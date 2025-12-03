<?php

require_once "db.class.php";

class m_facturacion_registr_ciclo_factura_empresa extends database {

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
        $consulta="insert into ciem_cicempresa (" . $campos . ",emp_ideregistro,usu_ideregistro) values (" . $valores . "," . $_SESSION['emp_ideregistro'] . ",'" . $_SESSION['usu_ideregistro'] . "')";        //echo $consulta;
		$this->conecta_db();
		if (!@$this->ejecuta_db($consulta)){
			echo "Error: La Empresa ya ha sido asignada a este ciclo o esta empresa no tiene permiso para vincular este ciclo.";
			}
		$this->cierra_db();
		}
	
	public function editar(){
		
		}
	
	public function eliminar($post){
			$this->conecta_db();
		switch ($post['accion_m']){
			case "ciem_cicempresa":
				$consulta="delete from ciem_cicempresa where ciem_ideregistr=" . $post['ciem_ideregistr'];
				break;	
			}
		//print_r($consulta);
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
		$consulta='';		
		$consulta='';
		switch ($post['accion_m']){
			case 'relacion':
				if (@$post['cic_ideregistro']==''){
					echo "    No se ha creado o seleccionado un ciclo.";
					return false;
					}
				$consulta="select ciem.ciem_ideregistr
									, emp.empresa_nom
									,'&nbsp' 
								from ciem_cicempresa ciem 
								inner join empresas emp on emp.empresa_sevemp=ciem.emp_ideregistro 
								where ciem.cic_ideregistro=" . $post['cic_ideregistro'] . "
								and ciem.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . "
								
								";
				break;
			case 'empresa':
				$consulta="select empresa_nom from empresas where empresa_sevemp=" . $_SESSION['emp_ideregistro'];
				break;
			case 'dsus_detsuscrip':
				$consulta="select dsus_ideregistr from dsus_detsuscrip where emp_ideregistro=" . $_SESSION['emp_ideregistro']." and cic_ideregistro=". $post['cic_ideregistro'];				
				break;	
			}

		//echo $consulta;
		$this->conecta_db();
		$respuesta=$this->consulta_db($consulta);
		$this->cierra_db();	
		count($respuesta)>0 ? $this->consultaToCadena($respuesta) : print('sinDatos');	
		}
	public function navegar($post){
		
		}
	
	
	}
	      
?>