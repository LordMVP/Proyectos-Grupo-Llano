<?php

require_once "db.class.php";

class m_facturacion_registr_ciclo_factura_edperiodo extends database {

    public function guardar($post) {
        $campos='"';
        $valores="'";
        $consulta="";
        foreach($post as $campo=>$valor){
            switch ($campo){
				case "form_consulta":           
                case "accion":
                case "navac":
                 $campo=$valor="";
                    break;
                default:
                    
                    break;
                }
             if (strlen($campo)>0 && $valor!=''){
                $campos.=$campo . '","';
                $valores.=$valor . "','";
                }           	
            }
        $campos=substr($campos,0,-2);
        $valores=substr($valores,0,-2);
        
        $consulta="insert into dper_detperiodo (" . $campos . ",usu_ideregistro) values (" . $valores . ",'" . $_SESSION["usu_ideregistro"] . "')";    //print_r($consulta);
		//echo $consulta;
		$this->conecta_db();
		if($respuesta=@$this->ejecuta_db($consulta)){
			echo "Registro guardado";
			}
		else{
			print('Por favor verifique que no está repetido el programa de control y que todos los datos están completos.');
			}
		$this->cierra_db();
    }

    public function editar($post) {
        $consulta = '';
        $ideregactual = 0;
        if (empty($post['edper_fecinicial'])||empty($post['edper_fecfinal'])) {
                print('Complete Los Campos');exit;
        }
        $consulta = ' update per_periodo set per_fecinicial=' ."'". $post['edper_fecinicial'] ."',". 'per_fecfinal=' ."'". $post['edper_fecfinal'] ."',". 'per_estado=' ."'". $post['edestado'] ."'".' where per_ideregistro=' . $post['id_edper'] . ';';
        $this->conecta_db();
        if ($respuesta = $this->ejecuta_db($consulta)) {
            echo "Periodos actualizados";
        } else {
            print('Error');
        }
        $this->cierra_db();
    }

    public function eliminar() {
        
    }

    public function consultar($post) {
        // print_r($post);exit;
        if (empty($post['cic_ideregistro'])) {
//            echo "Ciclo no seleccionado ";
            return;
        }
        if (empty($post['per_ideregistro'])) {
//            echo "Ciclo no seleccionado ";
            return;
        }
        $consulta = '';
        $consulta = 'select "per_ideregistro","per_nombre",per_fecinicial::timestamp::date,per_fecfinal::timestamp::date,per_fecvence::timestamp::date,per_fecsuspens::timestamp::date,"per_estado","per_estado" As boton '
                . ' from "per_periodo" per '
                . ' inner join cic_ciclo cic on cic.cic_ideregistro = per.cic_ideregistro '
                . ' where per.cic_ideregistro=\'' . $post['cic_ideregistro'] . "'"
                . " and  per_ideregistro = '" . $post['per_ideregistro'] . "'  order by \"per_ideorden\"";
        // echo $consulta;
        $this->conecta_db();
        if ($respuesta = @$this->consulta_db($consulta))
            count($respuesta[0]) > 0 ? $this->consultaToCadena($respuesta) : print('sinDatos');
        $this->cierra_db();
    }

    public function navegar($post) {
        
    }

}

?>