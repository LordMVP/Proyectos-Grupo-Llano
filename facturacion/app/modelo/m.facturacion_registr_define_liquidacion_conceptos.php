<?php

require_once "db.class.php";

class m_facturacion_registr_define_liquidacion_conceptos extends database {

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
                case "Conceptos_ide":
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
        		
		$consulta="insert into con_concepto (" . $campos . ") values (" . $valores . ")";
        ///*echo $consulta*/;
		$this->conecta_db();
		$this->ejecuta_db($consulta);
		$this->cierra_db();			
		return true;

        
		}
	
	public function editar(){
		
		}
	
	public function eliminar($post){
		$this->conecta_db();
		$consulta="delete from con_concepto where uni_concepto=" . $post['uni_concepto'];		
		if (!@$this->ejecuta_db($consulta)){
			$consulta="update con_concepto set con_estado='E' where uni_concepto=" . $post['uni_concepto'];
			$this->ejecuta_db($consulta);
			}
		$this->cierra_db();		
		}
	public function consultar($post){
		//print_r ($post);
		$consulta='';
		switch ($post["accion_m"]){
			case 'con_concepto':
				$consulta='select uni_concepto
								,est_concepto
								,con_nombre
								,con_alias
								,con_abreviatura
								,con_tipcalculo								
								,con_operacion
								,con_preliquidar
								,con_anticipo
								,con_pagpriori
								,con_financiable
								,prg_ideregistro
								,con_tipregistro
								,con_inivigencia::timestamp::date
								,con_finvigencia::timestamp::date
								,con_valor
								,con_estado
								,tor_nomtabla
								,dtor_nomcampo
							from "con_concepto"
							where "uni_concepto"=' . $post['uni_concepto'] . "
							
							";
				break;
			
			case 'tabla':
				$consulta='select con."uni_concepto"
						,uni."uni_nombre1" || \' - \' || uni."uni_nombre2" as "uni_nombre"
						,con."con_alias"
						,con."con_abreviatura"
						,con."con_tipcalculo"
						,con."con_operacion"
						,con."con_financiable"
						,prg."prg_nombre"
					from "con_concepto" con
					inner join "uni_unidad" uni on con."uni_concepto"=uni."uni_ideregistro"
					inner join "prg_programa" prg on con."prg_ideregistro" = prg."prg_ideregistro"
					and con.con_estado=\'A\'';

				break;
			}
			///*echo $consulta*/;
		$this->conecta_db();
		if($respuesta=@$this->consulta_db($consulta))
			count($respuesta[0])>0 ? $this->consultaToCadena($respuesta) : print('sinDatos');
		$this->cierra_db();	
		}
	public function navegar($post){
		
		}
	
	
	}
	      
?>