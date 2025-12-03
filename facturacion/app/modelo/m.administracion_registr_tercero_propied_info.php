<?php

require_once "db.class.php";

class m_administracion_registr_tercero_propied_info extends database {

    public function guardar($post) {
        //print_r($post);
        $campos = '"';
        $valores = "'";
        $consulta = "";
        foreach ($post as $campo => $valor) {
            switch ($campo) {
                case "form_consulta":
                case "accion":
                case "navac":
                case "inpr_ideregistr":
                case "inf_ideregistro":
                case "inpr_informacio_mult":
                case "inpr_grpinform":
                    $campo = $valor = "";
                    break;
                default:
                    break;
            }
            if (strlen($campo) > 0) {
                $campos .= $campo . '","';
                $valores .= $valor . "','";
            }
        }
        $this->conecta_db();
        $grupoc = 'select inpr_grpinform from inpr_infpropie where tip_ideregistro=' . $post['tip_ideregistro'] . ' and pro_ideregistro=' . $post['pro_ideregistro'] . ' and inpr_grpinform=' . $post['inpr_grpinform'];
        $grupor = $this->ejecuta_db($grupoc);
        if (count($grupor[0]) != '') {
            echo "Usted no puede registrar este tipo de informacion en este grupo. Agregue un grupo nuevo.";
            exit();
        }
        $campos = substr($campos, 0, -2);
        $valores = substr($valores, 0, -2);
        $consulta = "insert into \"inpr_infpropie\" (" . $campos . ",inpr_grpinform) values (" . $valores . "," . $post['inpr_grpinform'] . ")";
        ///*echo $consulta*/;
        $opcm = array();
        $inprmult = $post['inpr_informacio_mult'];
        //echo "inr:" . $inprmult;

        if (count($inprmult) > 0 && $inprmult !== '') {
            $opcm = explode(',', $inprmult);
            $consulta = '';
            foreach ($opcm as $o) {
                $consulta .= "insert into inpr_infpropie (uni_tippropieda,est_tippropieda,tip_ideregistro,inpr_informacio,inpr_descripcio,tip_nombre,inpr_estado,pro_ideregistro,inpr_grpinform)
							 values (" . $post['uni_tippropieda'] . ",'" . $post['est_tippropieda'] . "','" . $post['tip_ideregistro'] . "','" . $o . "','" . $post['inpr_descripcio'] . "','" . $post['tip_nombre'] . "','" . $post['inpr_estado'] . "','" . $post['pro_ideregistro'] . "'," . $post['inpr_grpinform'] . ");";
            }
        }

        ///*echo $consulta*/;

        if ($res = $this->ejecuta_db($consulta)) {
            $verireq = "select inpr.inpr_informacio from pro_propiedad pro
							inner join inun_infunidad inun on inun.uni_ideregistro=pro.uni_tippropieda
							inner join tip_tipifica tip on tip.inf_ideregistro=inun.inf_ideregistro
							left join inpr_infpropie inpr on inpr.pro_ideregistro=pro.pro_ideregistro
							where tip.tip_obligatorio='S' and pro.pro_ideregistro=" . $post['pro_ideregistro'];
            $verires = $this->consulta_db($verireq);
            $activa = true;
            foreach ($verires as $ver) {
                if ($ver[0] === '') {
                    false;
                }
            }
            if ($activa) {
                $actestad = "update pro_propiedad set pro_estado='A' where pro_ideregistro=" . $post['pro_ideregistro'];
                $this->ejecuta_db($actestad);
            }
            echo $res[0];
        } else {
            print_r($res);
            echo "No se ha podido completar la accion, verifique que todos los datos estén completos";
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
                case "inpr_ideregistr":
                case "inf_ideregistro":
                case "Info_ide":
                    $campo = $valor = "";
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
        $consulta = "update \"inpr_infpropie\" set " . $setUpdate . ' where "inpr_ideregistr"=' . $post['inpr_ideregistr'];
        $this->conecta_db();
        if ($res = @$this->ejecuta_db($consulta)) {
            echo "Registro Guardado";
        } else {
            print_r($res);
            echo "No se ha podido completar la accion";
        }
        $this->cierra_db();
        ///*echo $consulta*/;
    }

    public function eliminar($post) {
        $consulta = 'delete from ter_tercero where "ter_ideregistro"=' . $post['ter_ideregistro'];
        $this->conecta_db();
        $res = $this->consulta_db($consulta);
        $this->cierra_db();
    }

    public function consultar($post) {
        //print_r ($post);
        $consulta = '';
        switch ($post["accion_m"]) {
            case 'info':
                $consulta = "select inpr.inpr_ideregistr
								,inpr.inpr_grpinform
								,inpr.tip_nombre
								,inpr.inpr_informacio
								,inpr.inpr_descripcio								
								,tip.tip_tipo
								,tip.tip_desdirector
							from inpr_infpropie inpr
							inner join tip_tipifica tip on inpr.tip_ideregistro=tip.tip_ideregistro
							where inpr.pro_ideregistro=" . $post['pro_ideregistro'] . "
							and inpr.inpr_grpinform='" . trim($post['grupo']) . "'";
                break;
            case 'inpr_infpropie':
                $consulta = "select *	from inpr_infpropie where inpr_ideregistr= " . $post['inpr_ideregistr'];
                break;
            case 'dtip_formato':
                $consulta = "select dtip_formato from dtip_dettipific where tip_ideregistro=" . $post['tip_ideregistro'];
                break;
            case 'inpr_grpinform':
                $consulta = "select coalesce(max(inpr_grpinform),-1) from inpr_infpropie where pro_ideregistro=" . $post['pro_ideregistro'];
                break;
        }
//		echo $consulta;
        $this->conecta_db();
        $respuesta = @$this->consulta_db($consulta);
        $this->cierra_db();
        if ($respuesta[0][0] != -1 && count($respuesta[0])>0) {
            $this->consultaToCadena($respuesta);
        } else
            print("sinDatos");
    }

    public function navegar($post) {
        $this->conecta_db();
        $consulta = 'select "inpr_ideregistr"
							,"inpr_grpinform"
							,"inpr_informacio"
							,"inpr_descripcio"
							,"tip_nombre"
						from "inpr_infpropie"
						where "pro_ideregistro"=' . $post['pro_ideregistro'] . '
						';
        switch ($post["navac"]) {
            case "f":
                $consulta .= " order by \"inpr_grpinform\"";
                break;
            case "p":
                if ($post["idreg"] == "")
                    $consulta .= " order by \"inpr_grpinform\" desc ";
                else
                    $consulta .= " where \"inpr_grpinform\" < " . $post["idreg"] . " order by \"ter_ideregistro\" desc ";
                break;
            case "n":
                if ($post["idreg"] == "")
                    $consulta .= " order by \"inpr_grpinform\"  limit 1";
                else
                    $consulta .= " where \"inpr_grpinform\" > " . $post["idreg"] . " order by \"ter_ideregistro\" ";
                break;
            case "l":
                $consulta .= " order by \"inpr_grpinform\" desc  limit 1";
                break;
        }
        ///*echo $consulta*/;

        $respuesta = $this->consulta_db($consulta);
        $this->cierra_db();
        $linea = "";
        $this->consultaToCadena($respuesta);
    }

}

?>