<?php

require_once "db.class.php";

class m_facturacion_registr_define_liquidacion extends database {

	public function guardar($post){
		$campos='"';
        $valores="'";
        $consulta="";
        foreach($post as $campo=>$valor){
            switch ($campo){
				case "form_consulta":           
                case "accion":
                case "navac":
                case "cic_ideregistro":
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
        $consulta='select "cic_ideregistro" from "cic_ciclo" where "cic_nombre"=\'' . $post['cic_nombre'] . "'";
        ///*echo $consulta*/;
		$this->conecta_db();
		$existeCiclo=$this->consulta_db($consulta);
		$this->cierra_db();
		if (count($existeCiclo[0])<=0){
			$consulta="insert into cic_ciclo (" . $campos . ") values (" . $valores . ")";
	        ///*echo $consulta*/;
			$this->conecta_db();
			$respuesta=@$this->ejecuta_db($consulta) ? $this->consultaToCadena($respuesta) : print('Error');
			$this->cierra_db();			
			return true;
			}
		else{
			echo "Grabación cancelada:El ciclo ya existe.<br>Cambie el nombre del Ciclo";
			}
        
		}
	
	public function editar(){
		
		}
	
	public function eliminar(){
		
		}
	public function consultar($post){
				}
	public function navegar($post){
		
		}
	
	
	}
/*
<!--SELECT "cic_ideregistro"
		,"cic_nombre"
		,"cic_anioactivo"
		,"cic_diainicial"
		,"cic_diafinal"
		,"cic_periodicidad"
		,"cic_estado"
		,"cic_descripcion"
	FROM "public"."cic_ciclo"-->
*/      	
		      
?>