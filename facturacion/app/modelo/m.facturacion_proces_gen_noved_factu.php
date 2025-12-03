<?php

require_once "db.class.php";
class m_facturacion_proces_gen_noved_factu extends database {

	public function guardar($post){		
		$args=$this->concatenarArgumentos($post);      
		$this->conecta_db();        
        $funq="select fun_nombre,fun_ubicacion from fun_funcion where fun_ideregistro=" . $post['fun_ideregistro'];
        $funr=$this->consulta_db($funq);
		include '../librerias/' . $funr[0][1];eval($funr[0][0] . '(\'' . $args . '\');');
		$this->cierra_db();
		}
	
	public function editar(){
		
		}
	
	public function eliminar(){
		
		}
	public function consultar($post){
		
		}
	public function navegar($post){
	
		}
	private function concatenarArgumentos($post){
		$args="";
		foreach($post as $campo=>$valor){
            switch ($campo){
				case "fun_ideregistro":           
                case "accion":                
                    $campo=$valor="";
                    break;     
                
                default:
                    
                    break;
                }
            if ($valor!=''){            	
                $args.=$campo . ':' . $valor . ",";
                }          
            }
        $args=substr($args,0,-1);
        return $args;
		}
	
	}

?>