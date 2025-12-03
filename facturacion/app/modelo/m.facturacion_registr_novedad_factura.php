
<?php

require_once "db.class.php";

class m_facturacion_registr_novedad_factura extends database {

    public function guardar($post) {
        $campos = '';
        $valores = "'";
        $consulta = "";
        foreach ($post as $campo => $valor) {
            switch ($campo) {
                case "accion":
                case "nov_ideregistro":
                case "nov_fecaprovac":
                case "accion":
                    $campo = $valor = "";
                    break;
                default:
                    break;
            }
            if (strlen($campo) > 0) {
                $campos.=$campo . ',';
                $valores.=$valor . "','";
            }
        }
        $campos = substr($campos, 0, -1);
        $valores = substr($valores, 0, -2);
        $consulta = "insert into nov_novedad (" . $campos . "
								,usu_ideregistro
								,emp_ideregistro
								,nov_fecgenerac
								,nov_estado
								,nov_genera
								,cic_ano
								) 
					values (" . $valores . ",'" . $_SESSION['usu_ideregistro'] . "'					
					," . $_SESSION['emp_ideregistro'] . "
					,'" . date('Y-m-d') . "'
					,'G'
					,'M'
					,(select cic_anoactual from cic_ciclo where cic_ideregistro=" . $post['cic_ideregistro'] . ")
					) RETURNING nov_ideregistro";
        //echo $consulta;
        //return false;
        $this->conecta_db();
        try {
            $res = $this->ejecuta_db($consulta);
            if(is_numeric($res[0])){
                echo $res[0];
                
            }else{
                echo "Error";
                
            }
        } catch (Exception $exc) {
            echo "Error";
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
                case "accion":
                case "cic_ideregistro":
                case "per_ideregistro":
                case "nov_fecaprovac":
                    $campo = $valor = "";
                    break;
                default:
                    break;
            }
            if (strlen($campo) > 0) {
                $setUpdate.='"' . $campo . '"=\'' . $valor . '\',';
            }
        }
        $setUpdate = substr($setUpdate, 0, -1);
        $campos = substr($campos, 0, -2);
        $valores = substr($valores, 0, -2);
        $consulta = "update nov_novedad set " . $setUpdate . ' where "nov_ideregistro"=' . $post['nov_ideregistro'];
        //echo $consulta;
        $this->conecta_db();
        if ($res = @$this->ejecuta_db($consulta)) {
            echo "Registro Guardado";
        } else {
            echo "No se ha podido completar la accion";
        }
        $this->cierra_db();
        //echo $consulta;
    }

    public function eliminar($post) {
        print_r($post);
        switch ($post["accion_m"]) {
            case 'eliminarDetalleNovedad' :
                $consulta = " DELETE FROM dnov_detnovedad  where dnov_ideregistr= " . $post['dnov_ideregistr'];

                break;
        }

        $this->conecta_db();
        if ($res = @$this->ejecuta_db($consulta)) {
            echo "Registro Eliminado Correctamente";
        } else {
            echo "No se ha podido Eliminar el Registro";
        }
        $this->cierra_db();
    }

    public function consultar($post) {
        //print_r ($post);
        $consulta = '';
        switch ($post["accion_m"]) {
            case 'nov_ideregistro':
                $consulta = 'select dsus_ideregistr
								,uni_liquidacion
								,uni_concepto
								,dnov_vlrunitari
								,dnov_cantidad
								,dnov_vlrtotal								
								,dnov_estado 
							from "dnov_detnovedad" 
							where "nov_ideregistro"=\'' . $post['nov_ideregistro'] . "'";
                break;
            case 'Suscripcion':
                $consulta = "select distinct on (dsus.dsus_ideregistr) dsus.dsus_ideregistr
									,dsus.uni_tipsuscripc
									,dsus.dsus_pcodigo
									,ter.ter_nomcompleto
									,pro.pro_idepropieda
									,dsus.uni_liquidacion
									,proy.proyecto_nom
									,barr.barrio_nom
									,cnre.cnre_nombre
                                                                        ,( 
                                                                        SELECT
                                                                                sum(fac_sdoreal)
                                                                        FROM
                                                                                fac_factura
                                                                        WHERE
                                                                                dsus_ideregistr = dsus.dsus_ideregistr
                                                                                AND 
                                                                        fac_estado = 'A'
                                                                                AND fac_idepadre IS NULL
                                                                                AND fac_sdoreal > 0 
                                                                                AND fac_fecvence <= now()::date
                                                                        ) saldo
							from dsus_detsuscrip dsus
								inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
								inner join pro_propiedad pro on dsus.pro_ideregistro=pro.pro_ideregistro
								inner join sus_suscripcion sus on dsus.sus_ideregistro=sus.sus_ideregistro
								inner join cnre_cnvrecaudo cnre on sus.cnre_ideregistr=cnre.cnre_ideregistr
								inner join nov_novedad nov on nov.dsus_ideregistr=dsus.dsus_ideregistr
								left join dnov_detnovedad dnov on dnov.nov_ideregistro=nov.nov_ideregistro								
								inner join proyectos proy on dsus.uni_municipio=proy.proyecto_ideregistro
								left join barrios barr on dsus.uni_barrio=barr.barrio_ideregistro
								where nov.nov_ideregistro=" . $post['nov_ideregistro'] . "
							limit 1							
							";
                break;
            case 'per_periodo':
                $per_ideregistro = 0;
                if ($post['per_periodo'] != '')
                    $per_ideregistro = $post['per_periodo'];
                $consulta = "select per_mesinicio,per_diainicio,per_mesfinaliza,per_diafinaliza
							from per_periodo
							where per_ideregistro='" . $per_ideregistro . "'";
                break;
            case 'DetalleNovedad':
                $consulta = "select dnov.dnov_ideregistr
									,liq.liq_nombre
                                                                        ,solicitud.sol_idregistro
									,con.con_nombre
									,dnov.dnov_cantidad
									,dnov_vlrunitari
									,dnov_vlrtotal								
								from dnov_detnovedad dnov
								inner join liq_liquidacion liq on dnov.uni_liquidacion=liq.uni_liquidacion
								inner join con_concepto con on dnov.uni_concepto=con.uni_concepto   
                                                                left join lateral( select sol_idregistro from dnovs_detnovsolicitudes  dnovs
                                                                   where dnovs.dnov_ideregistr = dnov.dnov_ideregistr  limit 1 
                                                                ) solicitud on true 
								where dnov.nov_ideregistro=" . $post['nov_ideregistro'] .  "
				                                order by dnov.dnov_ideregistr desc 
					";
                break;
            case 'cuadroBusquedaConsulta':
                //print_r($post);
                isset($post['b_ter_documento']) ? $ter_documento = $post['b_ter_documento'] : $ter_documento = '';
                isset($post['b_dsus_ideregistr']) ? $dsus_ideregistr = $post['b_dsus_ideregistr'] : $dsus_ideregistr = '';
                isset($post['b_sus_ideregistro']) ? $sus_ideregistro = $post['b_sus_ideregistro'] : $sus_ideregistro = '';
                isset($post['b_dsus_pcodigo']) ? $dsus_pcodigo = $post['b_dsus_pcodigo'] : $dsus_pcodigo = '';
                isset($post['b_dsus_iniestado']) ? $dsus_iniestado = $post['b_dsus_iniestado'] : $dsus_iniestado = '';
                isset($post['b_nov_ideregistro']) ? $nov_ideregistro = $post['b_nov_ideregistro'] : $nov_ideregistro = '';
                isset($post['b_uni_liquidacion']) ? $uni_liquidacion = $post['b_uni_liquidacion'] : $uni_liquidacion = '';
                isset($post['b_dsus_iniestado']) ? $dsus_iniestado = $post['b_dsus_iniestado'] : $dsus_iniestado = '';
                isset($post['b_dsus_finestado']) ? $dsus_finestado = $post['b_dsus_finestado'] : $dsus_finestado = '';

                $consultaEnc = "select distinct on(nov.nov_ideregistro) nov.nov_ideregistro,ter.ter_nomcompleto,nov.nov_fecgenerac :: timestamp :: date,uni.uni_nombre1 
									from nov_novedad nov
									left join dnov_detnovedad dnov on dnov.nov_ideregistro=nov.nov_ideregistro
									inner join dsus_detsuscrip dsus on nov.dsus_ideregistr=dsus.dsus_ideregistr
									inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro 
									inner join uni_unidad uni on dsus.uni_liquidacion=uni.uni_ideregistro 
								";

                if ($ter_documento != '') {
                    $consulta = $consultaEnc;
                    $consulta.="where ter.ter_documento='$ter_documento'
								and dsus.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . "
								limit 5
								";
                } else if ($dsus_ideregistr != '') {
                    $consulta = $consultaEnc;
                    $consulta.="where nov.dsus_ideregistr=$dsus_ideregistr
								and dsus.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . "
								limit 5
								";
                } else if ($sus_ideregistro != '') {
                    $consulta = $consultaEnc;
                    $consulta.="where dsus.sus_ideregistro='$sus_ideregistro'
								and dsus.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . "
								limit 5
								";
                } else if ($dsus_pcodigo != '') {
                    $consulta = $consultaEnc;
                    $consulta.="where dsus.dsus_pcodigo='$dsus_pcodigo'
								and dsus.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . "
								limit 5
								";
                } else if ($nov_ideregistro != '') {
                    $consulta = $consultaEnc;
                    $consulta.="where nov.nov_ideregistro=$nov_ideregistro
								and dsus.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . "
								limit 5
								";
                } else if ($uni_liquidacion != '') {
                    $consulta = $consultaEnc;
                    $consulta.="where dsus.uni_liquidacion=$uni_liquidacion
								and dsus.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . "
								limit 5
								";
                } else if ($dsus_iniestado != '') {
                    $consulta = $consultaEnc;
                    $consulta.=" where dsus.dsus_iniestado>='$dsus_iniestado'	
								and dsus.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . "							
								";
                    if ($dsus_finestado != '') {
                        $consulta.=" and dsus.dsus_finestado<='$dsus_finestado'";
                    }
                    $consulta.=' limit 5';
                } else {
                    return false;
                }
                //echo $consulta;
                break;
            case 'cuadroBusquedaConsultaSus':
                //print_r($post);
                isset($post['b_ter_documento']) ? $ter_documento = $post['b_ter_documento'] : $ter_documento = '';
                isset($post['b_dsus_ideregistr']) ? $dsus_ideregistr = $post['b_dsus_ideregistr'] : $dsus_ideregistr = '';
                isset($post['b_sus_ideregistro']) ? $sus_ideregistro = $post['b_sus_ideregistro'] : $sus_ideregistro = '';
                isset($post['b_dsus_pcodigo']) ? $dsus_pcodigo = $post['b_dsus_pcodigo'] : $dsus_pcodigo = '';
                isset($post['b_uni_liquidacion']) ? $uni_liquidacion = $post['b_uni_liquidacion'] : $uni_liquidacion = '';
                $consultaEnc = "select distinct on (dsus.dsus_ideregistr)
									 dsus.dsus_ideregistr
									,ter.ter_nomcompleto									
									,liq.liq_nombre
									,dsus.dsus_pcodigo
								from dsus_detsuscrip dsus
								inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
								inner join liq_liquidacion liq on dsus.uni_liquidacion=liq.uni_liquidacion
								";

                if ($ter_documento != '') {
                    $consulta = $consultaEnc;
                    $consulta.="where ter.ter_documento='$ter_documento'
								and dsus.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . "
								limit 5
								";
                    if ($uni_liquidacion != '') {
                        $consulta = $consultaEnc;
                        $consulta.="and dsus.uni_liquidacion=$uni_liquidacion
									and dsus.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . "
									limit 5
									";
                    }
                } else if ($dsus_ideregistr != '') {
                    $consulta = $consultaEnc;
                    $consulta.="where dsus.dsus_ideregistr=$dsus_ideregistr
								and dsus.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . "
								limit 5
								";
                } else if ($sus_ideregistro != '') {
                    $consulta = $consultaEnc;
                    $consulta.="where dsus.sus_ideregistro='$sus_ideregistro'
								and dsus.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . "
								limit 5
								";
                } else if ($dsus_pcodigo != '') {
                    $consulta = $consultaEnc;
                    $consulta.="where dsus.dsus_pcodigo='$dsus_pcodigo'
								and dsus.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . "
								limit 5
								";
                } else {
                    return false;
                }
                //echo $consulta;
                break;
            case 'cargarResultadoNovedad':
                $consulta = " select distinct on (nov_ideregistro) nov_ideregistro
								,nov_fecgenerac::timestamp::date
								,nov_fecprocesad::timestamp::date
								,nov_observacion
								,cic_ideregistro
								,per_ideregistro
							from nov_novedad
							where nov_ideregistro=" . $post['nov_ideregistro'] . "
				";
                break;
            case 'cargarResultadoSuscripcion':
                $consulta = " select distinct on (dsus.dsus_ideregistr) dsus.dsus_ideregistr
									,dsus.uni_tipsuscripc
									,dsus.dsus_pcodigo
									,ter.ter_nomcompleto
									,pro.pro_idepropieda
									,dsus.uni_liquidacion
									,proy.proyecto_nom
									,bar.barrio_nom
									,cnre.cnre_nombre
                                                                        ,( 
                                                                        SELECT
                                                                                sum(fac_sdoreal)
                                                                        FROM
                                                                                fac_factura
                                                                        WHERE
                                                                                dsus_ideregistr = dsus.dsus_ideregistr
                                                                                AND 
                                                                        fac_estado = 'A'
                                                                                AND fac_idepadre IS NULL
                                                                                AND fac_sdoreal > 0 
                                                                                AND fac_fecvence <= now()::date
                                                                        ) saldo
                                                                        
							from dsus_detsuscrip dsus
								inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
								inner join pro_propiedad pro on dsus.pro_ideregistro=pro.pro_ideregistro
                                                                inner join barrios bar on bar.barrio_ideregistro = dsus.uni_barrio
                                                                inner join proyectos proy on proy.proyecto_ideregistro = dsus.uni_municipio
								inner join sus_suscripcion sus on dsus.sus_ideregistro=sus.sus_ideregistro
								inner join cnre_cnvrecaudo cnre on sus.cnre_ideregistr=cnre.cnre_ideregistr								
							where dsus.dsus_ideregistr=" . $post['dsus_ideregistr'] . "
							
							limit 1
				";
                break;
        }//echo $consulta;
        //*echo $consulta*/;
        $this->conecta_db();
        $respuesta = @$this->consulta_db($consulta);

        $this->cierra_db();
        //print_r($respuesta);
        count($respuesta) > 0 ? $this->consultaToCadena($respuesta) : print("sinDatos");
    }

    public function navegar($post) {
        $consulta = "select nov_ideregistro,nov_fecgenerac,nov_estado,nov_genera,nov_fecprocesad::timestamp::date,nov_observacion,emp_ideregistro,cic_ideregistro,per_ideregistro,tor_nomtabla,nov_fecaprovac,per_ano from nov_novedad";
        //echo $post["idreg"];
        switch ($post["navac"]) {
            case "f":
                $consulta.= " order by \"nov_ideregistro\"";
                break;
            case "p":
                if ($post["idreg"] == "")
                    $consulta.= " order by \"nov_ideregistro\" desc limit 1";
                else
                    $consulta.= " where \"nov_ideregistro\" < " . $post["idreg"] . " order by \"nov_ideregistro\" limit 1";
                break;
            case "n":
                if ($post["idreg"] == "")
                    $consulta.= " order by \"nov_ideregistro\"";
                else
                    $consulta.= " where \"nov_ideregistro\" > " . $post["idreg"] . " order by \"nov_ideregistro\" limit 1";
                break;
            case "l":
                $consulta.= " order by \"nov_ideregistro\" desc limit 1";
                break;
        }
        $this->conecta_db();
        $respuesta = $this->consulta_db($consulta);
        $this->cierra_db();
        $linea = "";
        $this->consultaToCadena($respuesta);
    }

}

?>