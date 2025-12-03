<?php

require_once "db.class.php";

class m_facturacion_registr_suscr_factura extends database {

	public function guardar($post){
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
            if (strlen($campo)>0){
                $campos.=$campo . '","';
                $valores.=$valor . "','";
                }          
            }
        $campos=substr($campos,0,-2);
        $valores=substr($valores,0,-2);
        $consulta="insert into sus_suscripcion (" . $campos . ") values (" . $valores . ") RETURNING \"sus_ideregistro\"";
        ///*echo $consulta*/;
		$this->conecta_db();
		if($res=$this->ejecuta_db($consulta)){
			echo $res[0];
			}
		else{
			/*echo $consulta*/;
			print_r($res);
			echo "No se ha podido completar la accion, verifique que todos los datos estén completos";
			}
		$this->cierra_db();
		}
	
	public function editar(){
		
		}
	
	public function eliminar(){
		
		}
	public function consultar($post){
		//print_r ($post);
		$consulta='';
		switch ($post["accion_m"]){
			case 'ter_documento':
				$consulta='select "ter_documento","ter_nomcompleto","ter_ideregistro","ter_telfijo","ter_telcelular" from "ter_tercero" where "ter_documento"=\'' . $post['ter_documento'] . "'";
				break;
			case 'buscaSuscripcion':
				if ($post['dsus_ideregistr']!=''){
					$jwhere=' where dsus.dsus_ideregistr=' . $post['dsus_ideregistr'];
					}
				else{
					$jwhere=' where dsus.dsus_pcodigo=\'' . $post['dsus_pcodigo'] . "'";
					}
				$consulta='select ter.ter_documento from ter_tercero ter inner join dsus_detsuscrip dsus on dsus.ter_ideregistro=ter.ter_ideregistro ' . $jwhere;			
				break;
			}
		///*echo $consulta*/;
		$this->conecta_db();
		$respuesta=$this->consulta_db($consulta);
		$this->cierra_db();
		//print_r($respuesta);
		count($respuesta[0])>0 ? $this->consultaToCadena($respuesta) : print('sinDatos');	
		}
	public function navegar($post){
		$consulta='select "ter_documento","ter_nomcompleto","ter_ideregistro","ter_telfijo","ter_telcelular" from "ter_tercero"';
		//echo $post["idreg"];
		switch($post["navac"]){
			case "f":
				$consulta.= " order by \"ter_ideregistro\" limit 1";				
				break;
			case "p":
				if ($post["idreg"]=="")
					$consulta.= " order by \"ter_ideregistro\" desc limit 1";
				else
					$consulta.= " where \"ter_ideregistro\" < " . $post["idreg"] . " order by \"ter_ideregistro\" desc limit 1";
				break;
			case "n":
				if ($post["idreg"]=="")
					$consulta.= " order by \"ter_ideregistro\" limit 1";
				else
					$consulta.= " where \"ter_ideregistro\" > " . $post["idreg"] . " order by \"ter_ideregistro\" limit 1";
				break;
			case "l":
				$consulta.= " order by \"ter_ideregistro\" desc limit 1";
				break;
			}
		$this->conecta_db();
		$respuesta=$this->consulta_db($consulta);
		$this->cierra_db();
		$linea="";
		$this->consultaToCadena($respuesta);
		}
	
	
	}

?>