<?php

require_once "db.class.php";

class m_facturacion_proces_inicia_ciclo extends database {

    function __construct() {
        
    }

//    public function guardar($post) {
//        $cic_ideregistro = $post['cic_ideregistro'];
//        if ($this->verificarCiclo($cic_ideregistro)) {
//            $this->inicializarCiclo($cic_ideregistro);
//        }
//    }

    public function guardar($post) {
        $cic_ideregistro = $post['cic_ideregistro'];
        $this->inicializarCiclo_sin_validacion($cic_ideregistro);
    }

    private function inicializarCiclo($cic_ideregistro) {
        $this->conecta_db();
        $ciclo_original = $this->consulta_db("select cic_diainicia,cic_diafinaliza,cic_periodos,cic_anoactual from cic_ciclo where cic_ideregistro=$cic_ideregistro");
        $cic_anosiguiente = intval($ciclo_original[0][3]) + 1;

        $consulta = "update cic_ciclo set cic_anoactual = $cic_anosiguiente, usu_ideregistro=" . $_SESSION['idusuario'] . " where cic_ideregistro=$cic_ideregistro;";

        $periodos_actual = $this->consulta_db("SELECT  per_ideregistro from per_periodo 
                                                        WHERE date_part('year',per_fecinicial) = " . $ciclo_original[0][3] . "  and  
                                                        cic_ideregistro=$cic_ideregistro order by per_ideorden");

        $periodicidad = $ciclo_original[0][2];
        $periodos = 12 / $periodicidad;
        $cic_diainicia = $ciclo_original[0][0];
        $cic_diafinaliza = $ciclo_original[0][1];
        $cic_anoactual = $cic_anosiguiente;
        $fechas = array();
// Listado de periodos segùn periodicidad del ciclo 
        for ($k = 0; $k < $periodos; $k++) {
            $per_ideorden = $k + 1;
            $mes_inicio = ($per_ideorden * $periodicidad) - ($periodicidad - 1);
            $mes_final = $mes_inicio + $periodicidad;
            $diainicia = $cic_diainicia;
            $ultimodiaFechaInicio = new DateTime();
            $ultimodiaFechaInicio->setDate($cic_anoactual, $mes_inicio, 1);
            if ($cic_diainicia > intval($ultimodiaFechaInicio->format('t'))) {
                $diainicia = intval($ultimodiaFechaInicio->format('t'));
            };
            $fecha_inicio = new DateTime();
            $fecha_inicio->setDate($cic_anoactual, $mes_inicio, $diainicia);
            $fechas[] = array($fecha_inicio->format('Y-m-d'), null);
        }

        for ($k = 0; $k < count($fechas); $k++) {
            $ffin = null;
            if (@!$fechas[$k + 1][0]) {
                $ffin = new DateTime($fechas[0][0]);
                $ffin->modify('+1 year');
                $ffin->modify('-1 day');
            } else {
                $ffin = new DateTime($fechas[$k + 1][0]);
                $ffin->modify('-1 day');
            }
            $fechas[$k][1] = $ffin->format('Y-m-d');
        }

        for ($k = 0; $k < $periodos; $k++) {
            $per_ideorden = $k + 1;
            $per_estado = 'B';
            $per_nombre = new DateTime($fechas[$k][1]);
            $per_nombre = $this->meses[intval($per_nombre->format('m')) - 1];
            $dpers = $this->consulta_db("select dper_ideregistr,dper_fecinicial::timestamp::date,dper_fecfinal::timestamp::date 
                                      from dper_detperiodo where per_ideregistro=" . $periodos_actual[$k][0]);

            $consulta_nuevo_periodo = " INSERT INTO per_periodo  
                                           ( SELECT  nextval('sq_per_ideregistro') per_ideregistro,  per_ideorden	,cic_ideregistro, per_nombre,'" . $per_estado . "' per_estado ,per_blofecha	,'" . $fechas[$k][0] . "' per_fecinicial,
                                            '" . $fechas[$k][1] . "' per_fecfinal, null	per_fecvence,  null per_fecsuspens,"
                    . $_SESSION['idusuario'] . " usu_ideregistro from per_periodo where per_ideregistro=" . $periodos_actual[$k][0] . ") RETURNING per_ideregistro ";

            $nuevo_per = $this->consulta_db($consulta_nuevo_periodo)[0][0];

            $q = 0;
            foreach ($dpers as $dp) {
                $dperfi = new DateTime($dp[1]);
                $dperfi->modify('+1 Year');
                $dperff = new DateTime($dp[2]);
                $dperff->modify('+1 Year');
                $feci = new DateTime($fechas[$k][0]);
                $fecf = new DateTime($fechas[$k][1]);
                if ($dperfi < $feci)
                    $dperff = $feci;
                if ($dperff > $fecf)
                    $dperff = $fecf;
                $consulta .= " Update dper_detperiodo set per_ideregistro = $nuevo_per, dper_estado='B', dper_fecactiva='" . $fechas[$k][0] . "',
                                         dper_feccierre='" . $fechas[$k][1] . "',dper_fecinicial='" . $dperfi->format('Y-m-d') . "',dper_fecfinal='" . $dperff->format('Y-m-d') . "',
                                         usu_ideregistro=" . $_SESSION['idusuario'] . " where dper_ideregistr=" . $dp[0] . ";";
                $q++;
            }
        }

        $consulta .= "update per_periodo set per_estado='A', usu_ideregistro=" . $_SESSION['acc_ideregistro'] . " where per_ideregistro=(select per_ideregistro from per_periodo where cic_ideregistro=$cic_ideregistro order by per_ideorden limit 1);
		update dper_detperiodo set dper_estado='A', usu_ideregistro=" . $_SESSION['acc_ideregistro'] . " where dper_ideregistr=(select dper_ideregistr from dper_detperiodo where cic_ideregistro=$cic_ideregistro order by dper_fecinicial limit 1);
		update cic_ciclo set cic_estado='A', usu_ideregistro=" . $_SESSION['acc_ideregistro'] . " where cic_ideregistro=$cic_ideregistro ";
        $resultado = $this->ejecuta_db($consulta);
        if ($resultado) {
            echo "Ciclo  inicializado Correctamente";
            echo '||-> Sin conflictos <-||';
        }
        $this->cierra_db();
    }

    private function verificarCiclo($cic_ideregistro) {
        $this->conecta_db();
        //documentos
        $novs = "select nov_estado from nov_novedad where cic_ideregistro=$cic_ideregistro and nov_estado<>'C'";
        if (count($this->consulta_db($novs)) > 0) {
            $respuesta = $this->consulta_db($novs);
            $this->consultaToCadena($respuesta);
            echo "Existen novedades que estan en estado Pendiente o Generado y no se puede cerrar el ciclo. Por favor verifique";
            return false;
        }
        $facs = "select fac_estado from fac_factura where cic_ideregistro=$cic_ideregistro and fac_estado in ('X','Z','G')";
        if (count($this->consulta_db($facs)) > 0) {
            $respuesta = $this->consulta_db($facs);
            echo $this->consultaToCadena($respuesta);
            echo "Existen facturas que estan en estado Pendiente o Generado y no se puede cerrar el ciclo. Por favor verifique";
            return false;
        }
        //ciclos y periodos
        $pers = "select per_ideregistro, per_nombre, per_estado from per_periodo where cic_ideregistro=$cic_ideregistro and per_estado='A'";
        if (count($this->consulta_db($pers)) > 0) {
            $respuesta = $this->consulta_db($pers);
            $this->consultaToCadena($respuesta);
            echo "Hay periodos del ciclo que no se han cerrado, por favor verifique.";
            return false;
        }
        $cics = "select cic_estado from cic_ciclo where cic_ideregistro=$cic_ideregistro and cic_estado='A'";
        if (count($this->consulta_db($cics)) > 0) {
            $respuesta = $this->consulta_db($cics);
            $this->consultaToCadena($respuesta);
            echo "El ciclo seleccionado no se ha cerrado, por favor verifique.";
            return false;
        }
        $this->cierra_db();
        return true;
    }

    private function inicializarCiclo_sin_validacion($cic_ideregistro) {

        $this->conecta_db();
        try {
            $control_dependencia = -1;
            $this->iniarTransccion();
            $ciclo_original = $this->consultarCiclo($cic_ideregistro);
            $cic_anosiguiente = intval($ciclo_original[0][3]) + 1;

            $datosCiclo['anosiguiente'] = $cic_anosiguiente;
            $datosCiclo['idciclo'] = $cic_ideregistro;
//            $this->actualizarCiclo($datosCiclo);

            $datosPeriodo['anoactual'] = $ciclo_original[0][3];
            $datosPeriodo['idciclo'] = $cic_ideregistro;
            $periodos_actual = $this->consultarPeriodo($datosPeriodo);

            $periodicidad = $ciclo_original[0][2];
            $periodos = 12 / $periodicidad;
            $cic_diainicia = $ciclo_original[0][0];
            $cic_diafinaliza = $ciclo_original[0][1];
            $cic_anoactual = $cic_anosiguiente;
            $fechas = array();
            for ($k = 0; $k < $periodos; $k++) {
                $per_ideorden = $k + 1;
                $mes_inicio = ($per_ideorden * $periodicidad) - ($periodicidad - 1);
                $mes_final = $mes_inicio + $periodicidad;
                $diainicia = $cic_diainicia;
                $ultimodiaFechaInicio = new DateTime();
                $ultimodiaFechaInicio->setDate($cic_anoactual, $mes_inicio, 1);
                if ($cic_diainicia > intval($ultimodiaFechaInicio->format('t'))) {
                    $diainicia = intval($ultimodiaFechaInicio->format('t'));
                };
                $fecha_inicio = new DateTime();
                $fecha_inicio->setDate($cic_anoactual, $mes_inicio, $diainicia);
                $fechas[] = array($fecha_inicio->format('Y-m-d'), null);
            }

            for ($k = 0; $k < count($fechas); $k++) {
                $ffin = null;
                if (@!$fechas[$k + 1][0]) {
                    $ffin = new DateTime($fechas[0][0]);
                    $ffin->modify('+1 year');
                    $ffin->modify('-1 day');
                } else {
                    $ffin = new DateTime($fechas[$k + 1][0]);
                    $ffin->modify('-1 day');
                }
                $fechas[$k][1] = $ffin->format('Y-m-d');
            }

            for ($k = 0; $k < $periodos; $k++) {
                $per_ideorden = $k + 1;
                $per_nombre = new DateTime($fechas[$k][1]);
                $per_nombre = $this->meses[intval($per_nombre->format('m')) - 1];

                $dpers = $this->consultarActividades($periodos_actual[$k][0]);

                $datosPeriodo['estado'] = 'B';
                $datosPeriodo['fecinicial'] = $fechas[$k][0];
                $datosPeriodo['fecfinal'] = $fechas[$k][1];
                $datosPeriodo['idperiodo'] = $periodos_actual[$k][0];
                $nuevo_per = $this->insertarPeriodo($datosPeriodo);

                $q = 0;
                foreach ($dpers as $dp) {
                    $dperfi = new DateTime($dp[1]);
                    $dperfi->modify('+1 Year');
                    $dperff = new DateTime($dp[2]);
                    $dperff->modify('+1 Year');
                    $feci = new DateTime($fechas[$k][0]);
                    $fecf = new DateTime($fechas[$k][1]);

                    if ($dperfi < $feci) {
                        $dperff = $feci;
                    }
                    if ($dperff > $fecf) {
                        $dperff = $fecf;
                    }

                    $datosActividad['actividad'] = $dp[3];
                    $datosActividad['fecactiva'] = $fechas[$k][0];
                    $datosActividad['feccierre'] = $fechas[$k][1];
                    $datosActividad['idciclo'] = $cic_ideregistro;
                    $datosActividad['idperiodo'] = $nuevo_per;
                    $datosActividad['idprograma'] = $dp[5];
                    $datosActividad['fecinicial'] = $dperfi->format('Y-m-d');
                    $datosActividad['fecfinal'] = $dperff->format('Y-m-d');
                    $datosActividad['ctrfecha'] = $dp[6];
                    $datosActividad['ctrdependen'] = $dp[7];
                    $idNuevaActividad = $this->insertaActividad($datosActividad);

                    $datosHomologacion['ano'] = $cic_anosiguiente;
                    $datosHomologacion['idciclo'] = $cic_ideregistro;
                    $datosHomologacion['idperiodo'] = $nuevo_per;
                    $datosHomologacion['idactividadantiguo'] = $dp[0];
                    $datosHomologacion['idactividadnuevo'] = $idNuevaActividad;
                    $this->insertaActividadHomologada($datosHomologacion);

                    $actividadesdependencia = $this->consultadependenciaactividad($dp[0]);

                    if (!empty($actividadesdependencia)) {
                        $control_dependencia = 1;
                        foreach ($actividadesdependencia as $actividad) {
                            $infoactividad['idpadreantiguo'] = $actividad[0];
                            $infoactividad['idactividad'] = $idNuevaActividad;
                            $this->insertarDependenciaActvidad($infoactividad);
                        }
                    }
                    $q++;
                }
            }
            if ($control_dependencia == -1 && !empty($actividadesdependencia)) {
                throw new Exception("No se detecto dependencia en ninguna actividad algo esta mal ",.1);
            }

            $this->actualizarDependenciaActividades($datosCiclo);
            echo "Ciclo  inicializado Correctamente";
            echo '||-> Sin conflictos <-||';
            $this->confirmarTransaccion();
            $this->cierra_db();
        } catch (\Exception $ex) {
            echo '||-> Error :' . $ex->getMessage() . ' <-||';
            $this->deshacerTransaccion();
            $this->cierra_db();
        }
    }

    function consultarActividades($idperiodo) {
        $sql = "select dper_ideregistr,dper_fecinicial::date fechainicial,dper_fecfinal::date fechafinal ,
                                      dper_actividad,dper_estado,prg_ideregistro,dper_ctrfecha,dper_ctrdependen
                                      from dper_detperiodo where per_ideregistro= $idperiodo ";
        $resultado = $this->consulta_db($sql);
        return $resultado;
    }

    function consultarCiclo($idciclo) {
        $sql = "select cic_diainicia,cic_diafinaliza,cic_periodos,cic_anoactual from cic_ciclo where cic_ideregistro=$idciclo ";
        $resultado = $this->consulta_db($sql);
        return $resultado;
    }

    function actualizarCiclo($Datos) {
        $sql = "update cic_ciclo  "
                . "set cic_anoactual = " . $Datos['anosiguiente']
                . ", usu_ideregistro=" . $_SESSION['idusuario']
                . "  where cic_ideregistro=" . $Datos['idciclo'];
        $this->consulta_db($sql);
    }

    function consultarPeriodo($Datos) {
        $sql = "SELECT  per_ideregistro from per_periodo 
                                                        WHERE date_part('year',per_fecinicial) = " . $Datos['anoactual'] . "  and  
                                                        cic_ideregistro= " . $Datos['idciclo'] . "   order by per_ideorden";
        $resultado = $this->consulta_db($sql);

        return $resultado;
    }

    function insertarPeriodo($Datos) {
        $sql = "  INSERT INTO per_periodo  
                                           ( SELECT  nextval('sq_per_ideregistro') per_ideregistro,  per_ideorden	
                                               ,cic_ideregistro, per_nombre
                                               ,'" . $Datos['estado'] . "' per_estado"
                . " , per_blofecha "
                . " ,'" . $Datos['fecinicial'] . "' per_fecinicial
                                               ,'" . $Datos['fecfinal'] . "' per_fecfinal, null	per_fecvence,  null per_fecsuspens,"
                . $_SESSION['idusuario'] . " usu_ideregistro from per_periodo "
                . " where per_ideregistro=" . $Datos['idperiodo'] . ") RETURNING per_ideregistro ";
        $resultado = $this->consulta_db($sql);
        return $resultado[0][0];
    }

    function insertaActividad($datos) {
        $sql = " INSERT INTO dper_detperiodo VALUES(nextval('sq_dper_ideregistr')"
                . " , '" . $datos['actividad'] . "'"
                . " , 'A' "
                . " , '" . $datos['fecactiva'] . "'::timestamp "
                . " , '" . $datos['feccierre'] . "'::timestamp "
                . " , " . $datos['idciclo']
                . " , " . $datos['idperiodo'] . ""
                . " ,  " . $datos['idprograma']
                . " , '" . $datos['fecinicial'] . "'"
                . " , '" . $datos['fecfinal'] . "'"
                . " , '" . $datos['ctrfecha'] . "'"
                . " , '" . $datos['ctrdependen'] . "'"
                . " ,  " . $_SESSION['idusuario'] . "  ) RETURNING dper_ideregistr ";
        $resultado = $this->consulta_db($sql);
        return $resultado[0][0];
    }

    function consultaDependenciaActividad($idActividad) {
        $sql = " SELECT dper_idepadre idpadreantiguo FROM dea_depactividad where dper_ideregistr = " . $idActividad;
        $resultado = $this->consulta_db($sql);
        return $resultado;
    }

    function insertarDependenciaActvidad($Datos) {
        
        $sql = "INSERT INTO dea_depactividad VALUES(nextval('sq_dea_ideregistro') "
                . ", " . $Datos['idactividad']
                . ", " . $Datos['idpadreantiguo']
                . ", " . $_SESSION['idusuario'] . " )";
        $this->consulta_db($sql);
    }

    function insertaActividadHomologada($Datos) {

        $sql = " INSERT INTO hdp_hisdper VALUES ("
                . " (SELECT COALESCE((SELECT max(hdp_ideregistr) + 1  from hdp_hisdper ), 0) + 1 ) "
                . ", " . $Datos['ano']
                . ", " . $Datos['idciclo']
                . ", " . $Datos['idperiodo']
                . ", " . $Datos['idactividadantiguo']
                . ", " . $Datos['idactividadnuevo']
                . ", now()  "
                . ", " . $_SESSION['idusuario'] . " )";

        $this->consulta_db($sql);
    }

    function actualizarDependenciaActividades($Datos) {
        $sql = "
                    UPDATE dea_depactividad set dper_idepadre = actualizar.idactividadpadrenuevo from
                      (
                          select hdp.dper_ideregistr_nuevo idactividadpadrenuevo,
                                 dper.dper_ideregistr idactividad ,
                                 dea.dper_idepadre idpadre 
                             from 
                                 cic_ciclo cic
                                    inner join per_periodo per on cic.cic_ideregistro = per.cic_ideregistro
                                    inner join dper_detperiodo dper on dper.per_ideregistro = per.per_ideregistro
                                    inner join hdp_hisdper hdpn on  hdpn.dper_ideregistr_nuevo =  dper.dper_ideregistr   
                                    inner join dea_depactividad dea on dea.dper_ideregistr = dper.dper_ideregistr
                                    inner join hdp_hisdper hdp on hdp.dper_ideregistr = dea.dper_idepadre and hdp.hdp_ano = date_part('year',per.per_fecinicial)                                              
                            where 
                                    cic.cic_ideregistro = " . $Datos['idciclo'] . " 
                                    and date_part('year',per.per_fecinicial) = " . $Datos['anosiguiente'] . "
                                  
                      ) as actualizar
                       where   actualizar.idactividad = dper_ideregistr and dper_idepadre = actualizar.idpadre  
                                ";
        $this->consulta_db($sql);
    }

}
