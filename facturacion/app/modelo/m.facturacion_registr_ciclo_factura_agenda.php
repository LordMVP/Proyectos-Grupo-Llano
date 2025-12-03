<?php

require_once "db.class.php";

class m_facturacion_registr_ciclo_factura_agenda extends database {
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
                case "Agendas_ide":
                case "dper_ideregistr":
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
        $consulta="update dper_detperiodo set " . $setUpdate . ' where "dper_ideregistr"=' . $post['dper_ideregistr'];
		$this->conecta_db();
		if($res=@$this->ejecuta_db($consulta)){
			echo "Registro Guardado";
			}
		else{
			print_r($res);
			echo "No se ha podido completar la accion";
			}
		$this->cierra_db();
		//echo $consulta;
		}
	
	public function eliminar($post){
			$this->conecta_db();
		switch ($post['accion_m']){
			case "dper_detperiodo":
				$consulta=" update dper_detperiodo set dper_estado='B' where dper_ideregistr=" . $post['dper_ideregistr'];
				break;	
			case "dea_depactividad":
				$consulta='delete from dea_depactividad where dea_ideregistro='. $post['dea_ideregistro'] ;
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
		$this->conecta_db();
		switch ($post['accion_m']){
			case "agendas":
				$consulta='select dper.dper_ideregistr as mbtn,dper.dper_ideregistr,dper."dper_actividad",dper."dper_fecinicial"::timestamp::date ,dper."dper_fecfinal"::timestamp::date, prg."prg_nombre", dper."dper_estado",dper."dper_feccierre"::timestamp::date,dper."dper_ctrdependen",dper."dper_estado",dper."dper_ordenactividad" As boton from "dper_detperiodo" dper inner join "prg_programa" prg on prg."prg_ideregistro"=dper."prg_ideregistro" where dper_estado!=\'D\' and dper."cic_ideregistro"=\'' . $post['cic_ideregistro'] . "' and \"per_ideregistro\"='" . $post['per_ideregistro'] . "'" . ' order by dper."dper_ordenactividad" asc ';
				break;
			case "agenda_seleccionada":
				if ($post['dper_ideregistr']=='') return false;
				$consulta="select dper_ideregistr
									,per_ideregistro
									,dper_actividad
									,dper_fecinicial::timestamp::date
									,dper_fecfinal::timestamp::date
									,dper_estado
									,prg_ideregistro
									,dper_ctrfecha
									,dper_ctrdependen
								from dper_detperiodo
								where dper_ideregistr='" . $post['dper_ideregistr'] . "'
									";
				break;
	    	case "idepactiv":
	           	//$consulta="select dper_ideregistr FROM dea_depactividad where dper_idepadre='" . $post['dper_ideregistr'] . "'";    '&nbsp &nbsp '
				   $consulta="select dea_ideregistro ,dper.dper_ideregistr
				   					,dper.dper_actividad
				   					,prg.prg_nombre
									,'&nbsp &nbsp '
				   				from dea_depactividad dea
				   				inner join dper_detperiodo dper on dper.dper_ideregistr=dea.dper_idepadre
				   				inner join prg_programa prg on prg.prg_ideregistro=dper.prg_ideregistro
				   				where dea.dper_ideregistr=" . $post['dper_ideregistr']; 
				
				//echo $consulta;
	    		break;
	    	case "agenda_dep":
				$consulta="select  '&nbsp &nbsp ' ,dper_ideregistr
									,dper_actividad
									,dper_fecinicial::timestamp::date
									,dper_fecfinal::timestamp::date
									,prg_nombre
									,dper_estado
									,dper_feccierre::timestamp::date
									,dper_estado as boton
								from dper_detperiodo inner join prg_programa on prg_programa.prg_ideregistro=dper_detperiodo.prg_ideregistro
								where dper_ideregistr='" . $post['dper_ideregistr'] . "'";
				break;
				
			   	case "deapadre":
				   $consulta="select dea_ideregistro from dea_depactividad where dper_ideregistr=" . $post['dper_ideregistr']; 
	    		break;
						
			   	case "deahijo":
				   $consulta="select dea_ideregistro from dea_depactividad where dper_idepadre=" . $post['dper_ideregistr']; 
	    		break;		
			}
		$respuesta=@$this->consulta_db($consulta);
		$this->cierra_db();	
		count($respuesta)>0 ? $this->consultaToCadena($respuesta) : print('sinDatos');
		}
	public function dependientes($post){
		$consulta='';
		switch ($post["accion_m"]){
			case 'dependientes':
				$consulta='insert into dea_depactividad (dper_ideregistr,dper_idepadre,usu_ideregistro) values('.$post['idreg'].','.$post['padre'].','.$post['usuario'].')';				
				echo $consulta;
		$this->conecta_db();
		if($res=@$this->ejecuta_db($consulta)){
			echo "Registro Guardado";
			}
		else{
			print_r($res);
			echo "No se ha podido completar la accion";
			}
		$this->cierra_db();				
			break;

			}		
		}		
	public function update($post){
		$consulta='';
		$this->conecta_db();
		switch ($post["accion_u"]){
			case 'update':
				$consulta = 'update dper_detperiodo set dper_actividad=' ."'". $post['nombre'] ."',". 'dper_estado=' ."'". $post['estado'] ."',". 'prg_ideregistro=' ."'". $post['prog'] ."',". 'dper_fecinicial=' ."'". $post['feini'] ."',".'dper_fecfinal=' ."'". $post['fefin'] ."'".' where dper_ideregistr=' . $post['idreg'] . ';';
				if($res=@$this->ejecuta_db($consulta)){
					echo "Actualizado Correctamente";
					}
				else{
					print_r($res);
					echo "No se ha podido completar la accion";
					}
				$this->cierra_db();		
			break;
			case 'order':
				$consulta = 'update dper_detperiodo set dper_ordenactividad=' . $post['orden'] .' where per_ideregistro=' . $post['idper'] . ';';
				if($res=@$this->ejecuta_db($consulta)){
					echo "Orden Actualizado Correctamente";
					}
				else{
					print_r($res);
					echo "No se ha podido completar la accion";
					}
				$this->cierra_db();		
			break;
			}
		}		
	public function navegar($post){
		
		}
	
	
	}
	      
?>