<?php

require_once "db.class.php";

class m_facturacion_registr_ciclo_factura_liquidacion extends database {

	public function guardar($post){
		$campos='"';
        $valores="'";
        $consulta="";
        foreach($post as $campo=>$valor){
            switch ($campo){
				case "form_consulta":           
                case "accion":
                case "navac":
                case "empresa_nom":
                case "emp_ideregistro":
                //case "age_ideregistro":
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
                $consulta="insert into cili_cicliquida (" . $campos . ",est_liquidacion,usu_ideregistro) values (" . $valores . ",(select est_ideregistro from uni_unidad where uni_ideregistro=" . $post['uni_liquidacion'] . "),'" . $_SESSION['usu_ideregistro'] . "')";        //echo $consulta;
		$this->conecta_db();
		if (!@$this->ejecuta_db($consulta)){
			echo "Error: La liquidación ya ha sido asignada a este ciclo o esta empresa no tiene permiso para vincular esta liquidación.";
			}
		$this->cierra_db();
		}
	
	public function editar(){
		
		}
	
	public function eliminar($post){
			$this->conecta_db();
		switch ($post['accion_m']){
			case "cili_cicliquida":
				$consulta="delete from cili_cicliquida where cili_ideregistr=" . $post['cili_ideregistr'];
                        echo $consulta ;
   				break;	
			}
		//echo $consulta;
		$this->conecta_db();
		if($res=@$this->ejecuta_db($consulta)){
			echo "Registro Borrado";
			}
		else{
			print_r($res);
			echo "No se ha podido completar la accion";
			}
		$this->cierra_db();				
			
		}
	public function consultar($post){
		//print_r ($post);
		$consulta='';		
		switch ($post['accion_m']){
			case 'relacion':
				if (@$post['cic_ideregistro']==''){
					echo "    No se ha creado o seleccionado un ciclo.";
					return false;
					}
				$consulta="select cili.cili_ideregistr
									, liq.liq_nombre
									,'&nbsp' 
									,'&nbsp'
								from cili_cicliquida cili 
								inner join liq_liquidacion liq on liq.uni_liquidacion=cili.uni_liquidacion
								inner join uni_unidad uni on uni.uni_ideregistro = liq.uni_liquidacion
								inner join est_estructura est on uni.est_ideregistro=est.est_ideregistro
								inner join esem_estempresa esem on esem.est_ideregistro= est.est_ideregistro
								where est.cla_ideregistro=3
								and esem.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . "
								and cili.cic_ideregistro=" . $post['cic_ideregistro']  . "
											
								";	
				break;
			case 'empresa':
				$consulta="select empresa_nom from empresas where empresa_sevemp=" . $_SESSION['emp_ideregistro'];
				//echo $consulta;
				break;	
			}

		
		$this->conecta_db();
		$respuesta=$this->consulta_db($consulta);
		$this->cierra_db();	
		count($respuesta)>0 ? $this->consultaToCadena($respuesta) : print('sinDatos');	
		}
	public function navegar($post){
		
		}
	
	
	}
	      
?>