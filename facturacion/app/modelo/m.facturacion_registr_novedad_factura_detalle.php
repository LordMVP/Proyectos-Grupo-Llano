<?php

require_once "db.class.php";

class m_facturacion_registr_novedad_factura_detalle extends database {

    public function guardar($post) {
        $campos = '';
        $valores = "'";
        $consulta = "";
        foreach ($post as $campo => $valor) {
            switch ($campo) {
                case "cic_nombre":
                case "per_nombre":
                case "est_liquidacion":
                case "accion":
                case "dnov_vlrtotal":
                case "dataSolicitudes":
                    $campo = $valor = "";
                    break;
                case "dnov_vlrtotal_model":
                    $campo = "dnov_vlrtotal";
                    break;
                default:
                    break;
            }
            if (strlen($campo) > 0) {
                $campos .= $campo . ',';
                $valores .= $valor . "','";
            }
        }
        $campos = substr($campos, 0, -1);
        $valores = substr($valores, 0, -2);
        $consulta = "insert into dnov_detnovedad (" . $campos . ",usu_ideregistro,cic_ano,dnov_estado,emp_ideregistro) 
					values (" . $valores . ",'" . $_SESSION['usu_ideregistro'] . "'
					,(select cic_anoactual from cic_ciclo where cic_ideregistro=" . $post['cic_ideregistro'] . ")
					,'G'
					," . $_SESSION['emp_ideregistro'] . ") RETURNING dnov_ideregistr";

        $this->conecta_db();
        $respuesta;
        $respuesta['codigoRespuesta'] = 1;
        $respuesta['mensaje'] = 'Registro Guardado Exitosamente';
        if (!$res = @$this->ejecuta_db($consulta)) {
            echo "No se ha podido completar la accion, verifique que todos los datos estén completos: consulta" + $consulta;
        } else {
            try {

                if (!empty($_POST['dataSolicitudes']) && count($_POST['dataSolicitudes']) > 0) {
                    $this->guardarSolicitudesRelacionadas($res[0], $_POST['dataSolicitudes']);
                }
                //echo "Registro guardado.";
            } catch (Exception $E) {
                $respuesta['codigoRespuesta'] = -1;
                $respuesta['mensaje'] = "Error Insertando Información de detalle de Novedades : " . $E->getMessage();
                $this->deshacerTransaccion();
                //echo  "Error Procesando Información de Solicitudes : ". $E->getMessage();                                                         
            }
            $this->generarRespuestaJSON($respuesta);
        }
        $this->cierra_db();
    }

    public function editar($post) {
        $campos = '"';
        $valores = "'";
        $consulta = "";
        $setUpdate = "";
        foreach ($post as $campo => $valor) {
            switch ($campo) {
                case "cic_nombre":
                case "per_nombre":
                case "est_liquidacion":
                case "accion":
                case "dnov_vlrtotal":
                case "dataSolicitudes":
                    $campo = $valor = "";
                    break;
                case "dnov_vlrtotal_model":
                    $campo = "dnov_vlrtotal";
                    break;
                default:
                    break;
            }
            if (strlen($campo) > 0) {
                $setUpdate .= '"' . $campo . '"=\'' . $valor . '\',';
            }
        }
        $setUpdate = substr($setUpdate, 0, -1);
        $campos = substr($campos, 0, -2);
        $valores = substr($valores, 0, -2);
        $consulta = "update dnov_detnovedad set " . $setUpdate . ' where "dnov_ideregistr"=' . $post['dnov_ideregistr'] . " RETURNING dnov_ideregistr";
        $respuesta;
        $respuesta['codigoRespuesta'] = 1;
        $respuesta['mensaje'] = 'Registro Editado Exitosamente';
        $this->conecta_db();
        if ($res = @$this->ejecuta_db($consulta)) {
            try {
                $this->eliminaSolicitudesRelacionadas($res[0]);
                if (!empty($_POST['dataSolicitudes']) && count($_POST['dataSolicitudes']) > 0) {
                    $this->guardarSolicitudesRelacionadas($res[0], $_POST['dataSolicitudes']);
                }
            } catch (Exception $E) {
                $this->deshacerTransaccion();
                $respuesta['codigoRespuesta'] = $E->getCode();
                $respuesta['mensaje'] = "Error Editando Información de Novedades: " . $E->getMessage();                
            }
            $this->generarRespuestaJSON($respuesta);
        } else {
            $respuesta['codigoRespuesta'] = -1;
            $respuesta['mensaje'] = "No se ha podido completar la accion. Verifique que ha seleccionado el concepto y ha calculado el valor total.";
            $this->generarRespuestaJSON($respuesta);
        }
        $this->cierra_db();
    }

    public function eliminar($post) {
        
    }

    public function consultar($post) {
        //print_r ($post);
        $consulta = '';
        switch ($post["accion_m"]) {
            case 'cicloPeriodo':
                $consulta = "select cic.cic_nombre
									,per.per_nombre
								from cic_ciclo cic
								inner join per_periodo per on cic.cic_ideregistro=per.cic_ideregistro
								where per.per_ideregistro=" . $post['per_ideregistro'] . "
							";
                break;
            case 'cargarDnov':
                $consulta = "select dnov.dnov_ideregistr
									,cic.cic_nombre
									,per.per_nombre
									,dnov.uni_liquidacion
									,dnov.uni_concepto
									,dnov.dnov_cantidad
									,dnov.dnov_vlrunitari
									,dnov.dnov_vlrtotal
								from dnov_detnovedad dnov
								inner join cic_ciclo cic on dnov.cic_ideregistro=cic.cic_ideregistro
								inner join per_periodo per on dnov.per_ideregistro=per.per_ideregistro
								where dnov.dnov_ideregistr=" . $post['dnov_ideregistr'] . "
							";
                break;
            case 'peticiones':
                $consulta = " select r.reclamo_numpqr,r.reclamo_obssol,r.reclamo_fecsol,r.reclamo_nomsol,r.reclamo_usugra  from reclamos r
                                                inner join empresas e on e.empresa_sevemp  = " . $_SESSION['idempresa'] . "
                                                inner join dsus_detsuscrip dsus on dsus.dsus_pcodigo = r.reclamo_codsus     
                                                where e.empresa_cod = r.reclamo_codemp and dsus.dsus_ideregistr =  " . $_POST['dsus_ideregistr'];
                break;

            case 'peticionesRelacionadas':
                $consulta = " select r.reclamo_numpqr,r.reclamo_obssol,r.reclamo_fecsol,r.reclamo_nomsol,r.reclamo_usugra  from reclamos r
                                                inner join empresas e on e.empresa_sevemp  = " . $_SESSION['idempresa'] . "
                                                inner join dsus_detsuscrip dsus on dsus.dsus_pcodigo = r.reclamo_codsus
                                                inner join dnovs_detnovsolicitudes dnovs on r.reclamo_numpqr::bigint = dnovs.sol_idregistro
                                                inner join dnov_detnovedad  dnov on dnov.dnov_ideregistr = dnovs.dnov_ideregistr  
                                                where e.empresa_cod = r.reclamo_codemp and  dsus.dsus_ideregistr =  " . $_POST['dsus_ideregistr'] . " AND dnov.dnov_ideregistr=" . $_POST['dnov_ideregistr'] . " AND dnovs.dnovs_estado='A' ";
        }

        try {
            $this->conecta_db();
            $respuesta = @$this->consulta_db($consulta);
            $this->cierra_db();
            //print_r($respuesta);
            count($respuesta) > 0 ? $this->consultaToCadena($respuesta) : print("sinDatos");
        } catch (Exception $e) {
            print("Error:" . $e->getMessage());
        }
    }

    private function guardarSolicitudesRelacionadas($idNovedad, $solicitudes) {        
        $datos = explode(",", $solicitudes);
        foreach ($datos as $valor) {
            $consulta = "insert into dnovs_detnovsolicitudes(dnov_ideregistr,sol_idregistro,usu_ideregistro,dnovs_estado)"
                    . " values (" . $idNovedad . "," . $valor . " ," . $_SESSION['usu_ideregistro'] . ",'A')";
            if (!$res = @$this->ejecuta_db($consulta)) {
                throw new Exception("Error Insertando relación de Solicitudes",-1); 
            }
        }
        return true;
    }

    private function eliminaSolicitudesRelacionadas($idNovedad) {

        $consulta = "update dnovs_detnovsolicitudes set dnovs_estado ='E' , usu_ideregistro=" . $_SESSION['usu_ideregistro'] . " where  dnov_ideregistr = " . $idNovedad . " AND dnovs_estado='A' ";
        if (!$res = @$this->ejecuta_db($consulta)) {
            throw new Exception("Error Actualizando relación de Solicitudes",-1); 
        }

        return true;
    }

    private function consultaSolicitudesRelacionadas($idNovedad) {

        $consulta = "select  dnovs_detnovsolicitudes set dnovs_estado ='E' , usu_ideregistro=" . $_SESSION['usu_ideregistro'] . " where  dnov_ideregistr = " . $idNovedad . " AND dnovs_estado='A' ";
        if (!$res = @$this->ejecuta_db($consulta)) {
            return false;
        }

        return true;
    }

}

?>