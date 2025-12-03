<?php
error_reporting(E_ALL & ~(E_STRICT|E_NOTICE));
require_once "db.class.php";

class m_facturacion_registr_ciclo_factura extends database {

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
            if (strlen($campo)>0 && $campo!='cmbanociclo'){
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

		if (count($existeCiclo)<=0){
			$consulta="insert into cic_ciclo (" . $campos . ",usu_ideregistro) values (" . $valores . "," . $_SESSION['usu_ideregistro'] . ") RETURNING cic_ideregistro";
	        ///*echo $consulta*/;
			$cic_ideregistro=$this->ejecuta_db($consulta);
			$cic_ideregistro=$cic_ideregistro[0];
			$periodicidad=intval($post["cic_periodos"]);
			$periodos=12/$periodicidad;
			$consulta='';
			$cic_diainicia=intval($post['cic_diainicia']);
			$cic_diafinaliza=intval($post['cic_diafinaliza']);
			$cic_anoactual=intval($post['cic_anoactual']);
			$fechas=array();
			for($k=0;$k<$periodos;$k++){
				$per_ideorden=$k+1;					
				$mes_inicio=($per_ideorden * $periodicidad)-($periodicidad-1);			
				$mes_final=$mes_inicio + $periodicidad;
				$diainicia=$cic_diainicia;
				$ultimodiaFechaInicio=new DateTime();
				$ultimodiaFechaInicio->setDate($cic_anoactual, $mes_inicio, 1);
				if($cic_diainicia > intval($ultimodiaFechaInicio->format('t')) ) {$diainicia=intval($ultimodiaFechaInicio->format('t')); }; 
				$fecha_inicio=new DateTime();
				$fecha_inicio->setDate($cic_anoactual, $mes_inicio, $diainicia);
				$fechas[]=array($fecha_inicio->format('Y-m-d'),null);
				}
			
			for($k=0;$k<count($fechas);$k++){
				$ffin=null;
				if (@!$fechas[$k+1][0]){
					$ffin=new DateTime($fechas[0][0]);
					$ffin->modify('+1 year');
					$ffin->modify('-1 day');
					}
				else{
					$ffin=new DateTime($fechas[$k+1][0]);
					$ffin->modify('-1 day');
					}
				$fechas[$k][1]=$ffin->format('Y-m-d');
				}
			
			for($k=0;$k<$periodos;$k++){			
				$per_ideorden=$k+1;				
				$per_nombre='';				
				$per_estado='B';
				$per_blofecha='N';			
				
				$per_nombre=new DateTime($fechas[$k][1]);
				$per_nombre=$this->meses[intval($per_nombre->format('m'))-1];
				
				$consulta.="insert into per_periodo(per_ideorden,cic_ideregistro,per_nombre,per_estado,per_blofecha,per_fecinicial,per_fecfinal,usu_ideregistro)
							values($per_ideorden,$cic_ideregistro,'$per_nombre','$per_estado','$per_blofecha','" . $fechas[$k][0] . "','" . $fechas[$k][1] . "'," . $_SESSION['acc_ideregistro'] . ");";
				///*echo $consulta*/ . "<p>";
				}
			
			//echo $consulta;	
			$respuesta=$this->ejecuta_db($consulta);
                        $consulta_in_ciem =" insert into ciem_cicempresa(cic_ideregistro,emp_ideregistro,usu_ideregistro) values($cic_ideregistro,".$_SESSION['emp_ideregistro'].",".$_SESSION['usu_ideregistro'].")" ;
                        $this->ejecuta_db($consulta_in_ciem);
			$respuesta ? $this->consultaToCadena($respuesta) : print('Error');
			echo '|-|->' . $cic_ideregistro . '<-|-|';	
			$this->cierra_db();	
			return true;
			}
		else{
			echo "El nombre del ciclo ya existe, por favor cambielo.";
			}
        
		}
	
	public function editar($post){
		$campos='"';
        $valores="'";
        $consulta="";
        $setUpdate="";
        foreach($post as $campo=>$valor){
            switch ($campo){
				case "accion":
				case "cic_ideregistro":
                    $campo=$valor="";
                    break;                
                default:                   
                    break;
                }
            if (strlen($campo)>0){
                $setUpdate.='"' . $campo . '"=\'' . $valor . '\',';
                }          
            }
        $setUpdate=substr($setUpdate,0,-1);
        $campos=substr($campos,0,-2);
        $valores=substr($valores,0,-2);
        $consulta="update cic_ciclo set " . $setUpdate . ',usu_ideregistro=' . $_SESSION['usu_ideregistro'] . ' where "cic_ideregistro"=' . $post['cic_ideregistro'];
		//echo $consulta;
		$this->conecta_db();
		if($res=@$this->ejecuta_db($consulta)){
			echo "Registro Guardado";
			}
		else{
			echo "No se ha podido completar la accion";
			}
		$this->cierra_db();
		//echo $consulta;
		}
	
	public function eliminar(){
		
		}
	public function consultar($post){
		//print_r ($post);
		$consulta='';
		switch ($post["accion_m"]){
			case 'cic_nombre':
				$consulta='select * from "cic_ciclo" where "cic_nombre"=\'' . $post['cic_nombre'] . "'";
				break;
			case 'cuadroBusquedaConsulta':
				isset($post['b_cic_ideregistro']) ? $cic_ideregistro=$post['b_cic_ideregistro'] : $cic_ideregistro='';
				isset($post['b_cic_nombre']) ? $cic_nombre=$post['b_cic_nombre'] : $cic_nombre='';

				if ($cic_ideregistro!=''){
					$consulta="select cic.cic_ideregistro
										,cic.cic_nombre
										,cic.cic_diainicia
										,cic.cic_diafinaliza
										,cic.cic_anoactual
									from cic_ciclo cic 
                                                                        INNER JOIN ciem_cicempresa ciem ON ciem.cic_ideregistro = cic.cic_ideregistro 
									where cic.cic_ideregistro=$cic_ideregistro
									and cic.cic_estado='A' and ciem.emp_ideregistro = " . $_SESSION['idempresa'] ;
					}
				else if ($cic_nombre!=''){
					$consulta="select cic.cic_ideregistro
										,cic.cic_nombre
										,cic.cic_diainicia
										,cic.cic_diafinaliza
										,cic.cic_anoactual
									from cic_ciclo cic
                                                                        INNER JOIN ciem_cicempresa ciem ON ciem.cic_ideregistro = cic.cic_ideregistro
									where cic.cic_nombre ilike '%$cic_nombre%'
                                                                        and cic.cic_estado='A' and ciem.emp_ideregistro = " . $_SESSION['idempresa'] . "  
									limit 10";
					}				
				else {
					return false;
					}
				break;
				
			case 'cargarResultado':
				$consulta="select cic_ideregistro
								,cic_nombre
								,cic_diainicia
								,cic_diafinaliza
								,cic_estado
								,cic_periodos
								,cic_anoactual
							from cic_ciclo
							where cic_ideregistro=" . $post['cic_ideregistro'] . "
							";
				break;
			}
		///*echo $consulta*/;
		$this->conecta_db();
		$respuesta=$this->consulta_db($consulta);
		$this->cierra_db();	
		count($respuesta)>0 ? $this->consultaToCadena($respuesta) : print('sinDatos');	
		}
	public function navegar($post){
		$consulta="select * from cic_ciclo";
		//echo $post["idreg"];
		switch($post["navac"]){
			case "f":
				$consulta.= " order by \"cic_ideregistro\" limit 1";				
				break;
			case "p":
				if ($post["idreg"]=="")
					$consulta.= " order by \"cic_ideregistro\" desc limit 1";
				else
					$consulta.= " where \"cic_ideregistro\" < " . $post["idreg"] . " order by \"cic_ideregistro\" desc limit 1";
				break;
			case "n":
				if ($post["idreg"]=="")
					$consulta.= " order by \"cic_ideregistro\" limit 1";
				else
					$consulta.= " where \"cic_ideregistro\" > " . $post["idreg"] . " order by \"cic_ideregistro\" limit 1";
				break;
			case "l":
				$consulta.= " order by \"cic_ideregistro\" desc limit 1";
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