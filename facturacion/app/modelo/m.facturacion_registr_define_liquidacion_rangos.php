<?php

require_once "db.class.php";

class m_facturacion_registr_define_liquidacion_rangos extends database {

	public function guardar($post){
		$campos='"';
        $valores="'";
        $consulta="";
        foreach($post as $campo=>$valor){
            switch ($campo){
                case "accion":
                case "navac":
                case "est_concepto":
                case "con_tipcalculo":
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
        $consulta="insert into raco_ranconcept (" . $campos . ") values (" . $valores . ")";
        ///*echo $consulta*/;
		$this->conecta_db();
		$respuesta=$this->ejecuta_db($consulta) ? $this->consultaToCadena($respuesta) : print('Error');
		$this->cierra_db();
		}
	
	public function editar($post){
		$campos='"';
        $valores="'";
        $consulta="";
        $setUpdate="";
        foreach($post as $campo=>$valor){
            switch ($campo){
				case "form_consulta":           
                case "accion":
                case "navac":
                case "accion":
                case "uni_concepto":
                case "est_concepto":
                case "con_tipcalculo":
                case "Rangos_ide":
                    $campo=$valor="";
                    break;                
                default:                   
                    break;
                }
            if (strlen($campo)>0){
            	if ($valor==''){
					$setUpdate.='"' . $campo . '"=NULL,';
					}
				else{
					$setUpdate.='"' . $campo . '"=\'' . $valor . '\',';
					}
                }          
            }
        $setUpdate=substr($setUpdate,0,-1);
        $campos=substr($campos,0,-2);
        $valores=substr($valores,0,-2);
        $consulta="update raco_ranconcept set " . $setUpdate . ' where raco_ideregistr=' . $post['Rangos_ide'];
		$this->conecta_db();
		if($res=@$this->ejecuta_db($consulta)){
			echo "Registro Guardado";
			}
		else{
			print_r($res);
			echo "No se ha podido completar la accion";
			}
		$this->cierra_db();
		///*echo $consulta*/;
		}
	
	public function eliminar(){
		
		}
	public function consultar($post){
		//print_r ($post);
		$consulta='';
		switch ($post["accion_m"]){
			case 'concepto_prin':
				/*$consulta='select con.uni_concepto,con.est_concepto,con.con_nombre,con.con_formula,con.con_tipcalculo,coli.uni_liquidacion
							from con_concepto con 
							inner join coli_conliquida coli
							on coli.uni_concepto=con.uni_concepto
							where con.uni_concepto=\'' . $post['uni_concepto'] . "'";
				*/
				$consulta='select uni_concepto,est_concepto,con_nombre,con_formula,con_tipcalculo from con_concepto where uni_concepto=\'' . $post['uni_concepto'] . "'";
				break;
			case 'concepto_disponible':
				$consulta="select core.uni_conrelacion,con.con_nombre,con.con_alias,con.con_valor,con.con_formula from con_concepto con inner join core_conrelacio core on con.uni_concepto=core.uni_conrelacion where core.uni_concepto=" . $post['uni_concepto'];
				break;
			case 'concepto_alias':
				$consulta='select con_alias from con_concepto where uni_concepto=' . $post['uni_concepto'];
				break;
			case 'rangos_relacion':
				$consulta="select raco.raco_ideregistr,raco.raco_raninicial,raco.raco_ranfinal,raco.raco_valor,raco.raco_formula from raco_ranconcept raco
							where raco.uni_concepto=" . $post['uni_concepto'] . " order by raco.raco_ideregistr";
				break;
			case 'rango_seleccionado':
				$consulta='select raco_raninicial,raco_ranfinal,raco_valor,raco_formula from raco_ranconcept where raco_ideregistr=' . $post['raco_ideregistr'];
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
		$consulta="";
		//echo $post["idreg"];
		switch($post["navac"]){
			case "f":
				$consulta.= " order by \"nov_ideregistro\"";				
				break;
			case "p":
				if ($post["idreg"]=="")
					$consulta.= " order by \"nov_ideregistro\" desc limit 1";
				else
					$consulta.= " where \"nov_ideregistro\" < " . $post["idreg"] . " order by \"nov_ideregistro\" limit 1";
				break;
			case "n":
				if ($post["idreg"]=="")
					$consulta.= " order by \"nov_ideregistro\"";
				else
					$consulta.= " where \"nov_ideregistro\" > " . $post["idreg"] . " order by \"nov_ideregistro\" limit 1";
				break;
			case "l":
				$consulta.= " order by \"nov_ideregistro\" desc limit 1";
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