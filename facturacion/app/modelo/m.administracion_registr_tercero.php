<?php

require_once "db.class.php";

class m_administracion_registr_tercero extends database {

    public function guardar($post) {
        $campos = '"';
        $valores = "'";
        $consulta = "";
        foreach ($post as $campo => $valor) {
            switch ($campo) {
                case "form_consulta":
                case "accion":
                case "navac":
                case "ter_ideregistro":
                case "est_clatercero":
                case "uni_clatercero":
                    $campo = $valor = "";
                    break;
                case "est_tipidentifica":
                    $campo = $valor = "";
                default:
                    break;
            }
            if (strlen($campo) > 0) {
                $campos.=$campo . '","';
                $valores.=$valor . "','";
            }
        }
        $campos = substr($campos, 0, -2);
        $valores = substr($valores, 0, -2);
        $consulta = "select ter_ideregistro from ter_tercero where ter_documento='" . $post['ter_documento'] . "' ";
        $this->conecta_db();
        $terex = $this->consulta_db($consulta);
        //echo($consulta);
        if (count($terex) > 0) {
            echo "El documento que intenta registrar ya existe. Por favor verifique la información.";
            return false;
        }
        $consulta = "insert into ter_tercero (" . $campos . ",usu_ideregistro) values (" . $valores . ",'" . $_SESSION['usu_ideregistro'] . "') RETURNING \"ter_ideregistro\"";        //echo $consulta;
        if ($res = $this->ejecuta_db($consulta)) {
            echo "Registro guardado. Ya puede registrar propiedades.";
            echo '||->' . $res[0] . '<-||';
        } else {
            //echo($consulta);
            echo " No se ha podido completar la accion, verifique que todos los datos estén completos";
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
                case "form_consulta":
                case "accion":
                case "navac":
                case "ter_ideregistro":
                case "uni_clatercero":
                case "est_clatercero":
                    $campo = $valor = "";
                    break;
                case "est_tipidentifica":
                    $campo = $valor = "";
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
        $consulta = "select ter_documento from ter_tercero where ter_ideregistro='" . $post['ter_ideregistro'] . "' ";
        $this->conecta_db();
        $terex = $this->consulta_db($consulta);
        //echo($consulta);
        if ($terex[0][0] != $post['ter_documento']) {
            $consulta = "select ter_ideregistro from ter_tercero where ter_documento='" . $post['ter_documento'] . "' ";
            $docex = $this->consulta_db($consulta);
            if (count($docex) > 0) {
                echo "El documento que intenta registrar ya existe. Por favor verifique la información";
                return false;
            }
        }
        $consulta = "update ter_tercero set " . $setUpdate . ', usu_ideregistro=\'' . $_SESSION['usu_ideregistro'] . '\' where "ter_ideregistro"=' . $post['ter_ideregistro'];
        if ($res = @$this->ejecuta_db($consulta)) {
            echo "Registro Actualizado Exitósamente";
        } else {
            echo "No se ha podido completar la acción";
        }
        $this->cierra_db();
        //echo $consulta;
    }

    public function relacionarClaseTercero($post) {
        $consulta = "";
        switch ($post['accion_m']) {
            case "relacionar":
                $consulta = "insert into clte_clatercero (uni_clatercero,ter_ideregistro,usu_ideregistro) 
							values('" . $post['uni_clatercero'] . "'
								,'" . $post['ter_ideregistro'] . "'
								,'" . $_SESSION['usu_ideregistro'] . "'
							)
							";
                break;
            case "eliminar":
                $consulta = "delete from clte_clatercero where clte_ideregistr=" . $post['clte_ideregistr'];
                break;
        }
            
        $this->conecta_db();
        if ($res = @$this->ejecuta_db($consulta)) {
            echo "Registro procesado";
        } else {
            echo "No se ha podido completar la accion.<br><br> Si está registrando una nueva clase de tercero, asegurese de que la haya seleccionado correctamente y que no está ya asignada al tercero.";
        }
        $this->cierra_db();
    }

    public function eliminar($post) {
        $consulta = 'delete from ter_tercero where "ter_ideregistro"=' . $post['ter_ideregistro'];
        $this->conecta_db();
        if (@$this->consulta_db($consulta)) {
            echo "OK";
        } else {
            echo "error";
        }
        $this->cierra_db();
    }

    public function consultar($post) {
        $consulta = '';
        $complemento = ''; $lefjoindsus = '' ;
        isset($post['b_uni_municipio']) ? $uni_municipio = $post['b_uni_municipio'] : $uni_municipio = '';
        isset($post['b_ter_documento']) ? $ter_documento = $post['b_ter_documento'] : $ter_documento = '';
        isset($post['b_pro_direccion']) ? $pro_direccion = $post['b_pro_direccion'] : $pro_direccion = '';
        isset($post['b_pro_numcatastral']) ? $pro_numcatastral = $post['b_pro_numcatastral'] : $pro_numcatastral = '';
        isset($post['b_pro_idepropieda']) ? $pro_idepropieda = $post['b_pro_idepropieda'] : $pro_idepropieda = '';
        isset($post['b_uni_barrio']) ? $uni_barrio = $post['b_uni_barrio'] : $uni_barrio = '';
        isset($post['b_codigo_anterior']) ? $codigo_anterior = $post['b_codigo_anterior'] : $codigo_anterior = '';
        switch ($post["accion_m"]) {
            case 'propiedad':
                //print_r($post);
                if($codigo_anterior!='') 
                { $lefjoindsus = ' left join dsus_detsuscrip dsus on dsus.pro_ideregistro = pro.pro_ideregistro and dsus.ter_ideregistro =   ' . $post['ter_ideregistro']  ;     
                  $complemento .= ' and dsus.dsus_pcodigo = \'' . $codigo_anterior. '\''; 
                
                }
                if($pro_idepropieda!='')
                 $complemento .= ' and pro.pro_idepropieda = \'' . $pro_idepropieda. '\'';
                if($pro_direccion!='')
                 $complemento .= ' and pro.pro_direccion ilike \'%' . $pro_direccion . '%\'' ;
                if($pro_numcatastral!='')
                  $complemento .= ' and pro.pro_numcatastral = \'' . $pro_numcatastral. '\'';

                $consulta = 'select distinct on (pro.pro_ideregistro)
                                                               
								pro."pro_ideregistro"
								,pro."pro_idepropieda"								
								,uni.uni_nombre1
								,proy."proyecto_nom"
								,bar."barrio_nom"
								,pro."pro_direccion"
								,pro.uni_tippropieda
								,pro.est_tippropieda
                                                                , row_number() over ( order by pro.pro_ideregistro) secuencia
							from "public"."pro_propiedad" pro
							inner join "uni_unidad" uni on pro."uni_tippropieda"=uni."uni_ideregistro"
							inner join "proyectos" proy on pro."uni_municipio" = proy."proyecto_ideregistro"
							inner join "barrios" bar on pro."uni_barrio"=bar."barrio_ideregistro"
							inner join uspr_usuprgpryto uspr on pro.uni_municipio=uspr.uni_municipio
							inner join esem_estempresa esem on esem.est_ideregistro=pro.est_tippropieda
                                                        '. $lefjoindsus .'  
							where pro."ter_ideregistro" = ' . $post['ter_ideregistro'] . '
							and uspr.usu_ideregistro=\'' . $_SESSION['usu_ideregistro'] . '\'
							and uspr.prg_ideregistro=3
							and esem.emp_ideregistro=' . $_SESSION['emp_ideregistro'] . ' 
                                                        and pro.pro_estado =\'A\' 
							' . $complemento;
                break;
            case 'clase_tercero':
                $consulta = "select clte.clte_ideregistr, uni.uni_nombre1 from clte_clatercero clte
								inner join ter_tercero ter on clte.ter_ideregistro=ter.ter_ideregistro
								inner join uni_unidad uni on clte.uni_clatercero=uni.uni_ideregistro
                                                                INNER JOIN esem_estempresa esem ON esem.est_ideregistro  =  uni.est_ideregistro and esem.emp_ideregistro = " . $_SESSION['emp_ideregistro'] . " 
								where ter.ter_ideregistro='" . $post['ter_ideregistro'] . "'
							";
                break;

            case 'ciudad_nom':
                $consulta = "select distinct on(ciudad_cod) ciudad_nom from ciudades where ciudad_cod='" . $post['ciudad_cod'] . "'";

                break;
            case 'tipo_documento':
                $consulta = "select uni_ideregistro,uni_nombre1  from uni_unidad  where uni_ideregistro=" . $post['uni_tipidentifica'];

                break;

            case 'cuadroBusquedaConsulta':

                $complemento = "";

                if ($ter_documento != '') {
                    $complemento = " and ter.ter_documento='$ter_documento'";
                }
                if ($pro_direccion != '') {
                    $complemento .= " and  UPPER(pro.pro_direccion) LIKE UPPER('%" . $pro_direccion . "%')";
                }
                if ($pro_numcatastral != '') {
                    $complemento .= " and  pro.pro_numcatastral = '$pro_numcatastral' ";
                }
                if ($uni_municipio != '') {
                    $complemento .= " and pro.uni_municipio = $uni_municipio ";
                }
                if ($pro_idepropieda != '') {
                    $complemento .= " and pro.pro_idepropieda = '$pro_idepropieda'";
                }
                if ($uni_barrio != '') {
                    $complemento .= " and  pro.uni_barrio  = '$uni_barrio'";
                }
                if ($codigo_anterior != '') {
                    $lefjoindsus  = "  left join dsus_detsuscrip dsus on dsus.ter_ideregistro = ter.ter_ideregistro " ; 
                    $complemento .= " and  dsus.dsus_pcodigo  = '$codigo_anterior'";
                } //dsus_ideregistr
                //
                //194121
                $consulta = "select distinct ter.ter_ideregistro,ter.ter_documento,ter.ter_nombre || ' ' || ter.ter_apellido,
                                                ter.ter_telfijo,ter.ter_telcelular,ter.uni_tipidentifica from ter_tercero ter
  						" .$lefjoindsus ."
                                                left join pro_propiedad pro on pro.ter_ideregistro=ter.ter_ideregistro
						left join uspr_usuprgpryto uspr on pro.uni_municipio=uspr.uni_municipio 
                                                
                                                and uspr.usu_ideregistro=" . $_SESSION['usu_ideregistro'] . "
                                                 
						"
                        . " WHERE 1=1 " . $complemento . ' limit 50 ';
                if ($complemento == "")
                    return false;

                break;

            case 'cargarResultado':
                $consulta = 'select ter_documento,ter_nombre,ter_apellido,ter_nomcompleto,ter_sexo,ter_correo,ter_telcelular,ter_telfijo,ter_ideregistro,uni_tiptercero,ciudad_cod,ter_docexpedicion::timestamp::date,uni_tipidentifica,ter_fecnacimiento::timestamp::date, ter_digverificacion,ter_idaprovechador from "ter_tercero" where "ter_ideregistro"=\'' . $post['ter_ideregistro'] . "'";
                break;
        }        
        //echo $consulta;
        $this->conecta_db();
        if ($respuesta = @$this->consulta_db($consulta)) {
            $this->consultaToCadena($respuesta);
        } else {
            print('sinDatos');
        }
        $this->cierra_db();
    }

    public function ciudadAutoComplete($post) {
        $this->conecta_db();
        $nombusca = strtoupper(trim($post['ciudnombrebusca']));
        $idempresa = 322;
          
        $jwhere = " and upper(ciu.ciudad_nom) like '%$nombusca%' ";
        $consulta = "select ciu.ciudad_cod,dep.departamento_nom || ' - ' || ciu.ciudad_nom from ciudades ciu ";
        $consulta.="inner join departamentos dep on dep.departamento_cod=ciu.ciudad_coddep
					inner join empresas emp on emp.empresa_cod=ciu.ciudad_codemp
					where emp.empresa_sevemp=" . $idempresa . "
					$jwhere
					";
        $this->conecta_db();
        if ($respuesta = @$this->consulta_db($consulta)) {
            $this->consultaToCadena($respuesta);
        } else {
            print('sinDatos');
        }
        $this->cierra_db();
    }

    public function navegar($post) {
        $consulta = 'select ter_documento,ter_nombre,ter_apellido,ter_nomcompleto,ter_sexo,ter_correo,ter_telcelular,ter_telfijo,ter_ideregistro,uni_tiptercero from "ter_tercero"';
        switch ($post["navac"]) {
            case "f":
                $consulta.= " order by \"ter_ideregistro\" limit 1";
                break;
            case "p":
                if ($post["idreg"] == "")
                    $consulta.= " order by \"ter_ideregistro\" desc  limit 1";
                else
                    $consulta.= " where \"ter_ideregistro\" < '" . $post["idreg"] . "' order by \"ter_ideregistro\" desc limit 1";
                break;
            case "n":
                if ($post["idreg"] == "")
                    $consulta.= " order by \"ter_ideregistro\"  limit 1";
                else
                    $consulta.= " where \"ter_ideregistro\" > '" . $post["idreg"] . "' order by \"ter_ideregistro\" limit 1";
                break;
            case "l":
                $consulta.= " order by \"ter_ideregistro\" desc  limit 1";
                break;
        }
        ///*echo $consulta*/;
        $this->conecta_db();
        if ($respuesta = @$this->consulta_db($consulta)) {
            $this->consultaToCadena($respuesta);
        }
        $this->cierra_db();
        $linea = "";
    }

    private function consultarPrograma($modulo) {
        $prg_ideregistro = 0;
        $consulta = "select prg_ideregistro from prg_programa where prg_localiza~*'$modulo' limit 1";
        if ($res = @$this->consulta_db($consulta)) {
            $prg_ideregistro = $res[0][0];
        }
        return $prg_ideregistro;
    }

}

?>
