<?php

require_once "db.class.php";

class m_administracion_registr_tercero_propied extends database {
	
	private function confirmarIde($idepropieda){
		$consultaide="select pro_ideregistro from pro_propiedad where pro_idepropieda='" . $idepropieda . "'";
		$consultaider=$this->consulta_db($consultaide);
    	if(count($consultaider)>0){
			echo "La propiedad ya existe, no puede ser registrada con el Ide Propiedad proporcionado.";
			return false;
			}
		return true;
		}
	public function verificarNumeroCatastral($post){		
		$consulta="select pro_numcatastral from pro_propiedad where pro_numcatastral='" . $post['pro_numcatastral'] . "'";
		$this->conecta_db();
		$consultar=$this->consulta_db($consulta);
		$this->cierra_db();
    	if(count($consultar)>0){
			echo "El numero catastral ya está registrado. Es conveniente que consulte mendiante 'Filtro' de búsquedas";			
			}
		return false;
		}
                public function verificarNumeroCatastralNacional($post){		
		$consulta="select pro_numcatastralnacional from pro_propiedad where pro_numcatastralnacional='" . $post['pro_numcatastralnacional'] . "'";
		$this->conecta_db();
		$consultar=$this->consulta_db($consulta);
		$this->cierra_db();
    	if(count($consultar)>0){
			echo "El numero catastral nacional ya está registrado. Es conveniente que consulte mendiante 'Filtro' de búsquedas";			
			}
		return false;
		}
	public function guardar($post){
		$campos='"';
        $valores="'";
        $consulta="";
        foreach($post as $campo=>$valor){
            switch ($campo){
				case "form_consulta":           
                case "accion":
                case "navac":
                case "pro_ideregistro":
                case "est_tippropieda":
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
		$this->conecta_db();
        $campos=substr($campos,0,-2);
        $valores=substr($valores,0,-2);        
		if ($post['pro_idepropieda']!=''){
			if(!$this->confirmarIde($post['pro_idepropieda'])) return false;
			}
		else{
			$consultaide="select max(pro_ideregistro) from pro_propiedad limit 1";
			$idepropieda=$this->consulta_db($consultaide);
			$idenuev=intval($idepropieda[0][0])+1;
			if(!$this->confirmarIde($idenuev)) {
				echo "No se puede asignar un ide de forma automática para ésta propiedad, debe ser suministrada.";
				echo $idepropieda[0][0];
				return false;
				}
			else{				
				$campos.=',"pro_idepropieda"';
				$valores.=',' . $idenuev;
				}
			}
		
		$consulta="insert into pro_propiedad (" . $campos . ",pro_estado,usu_ideregistro,est_tippropieda)
									values (" . $valores . ",'A'," . $_SESSION['usu_ideregistro'] . ",(select est_ideregistro from uni_unidad where uni_ideregistro=" . $post['uni_tippropieda'] . ")) RETURNING \"pro_ideregistro\"";
		/*echo $consulta;
		exit();*/
		if($res=$this->ejecuta_db($consulta)){
			$inforeq='select tip.tip_obligatorio from pro_propiedad pro
					inner join inun_infunidad inun on inun.uni_ideregistro=pro.uni_tippropieda
					inner join tip_tipifica tip on tip.inf_ideregistro=inun.inf_ideregistro
					where pro.pro_ideregistro=' . $res[0];
			
			$infores=$this->consulta_db($inforeq);
//			$obliga=false;
//			foreach($infores as $inf){
//				if ($inf[0]=='S'){
//					$obliga=true;
//					}
//				}
//			if($obliga){
//				$actestad="update pro_propiedad set pro_estado='I' where pro_ideregistro=" . $res[0];
//				$this->ejecuta_db($actestad);
//				}
			if ($post['pro_idepropieda']==''){
				$actestid="update pro_propiedad set pro_idepropieda='" . $res[0] . "' where pro_ideregistro=" . $res[0];
				$this->ejecuta_db($actestid);
				}
			echo $res[0];
			
			}
		else{
			print_r($res);
			echo "No se ha podido completar la accion, verifique que todos los datos estén completos";
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
                case "pro_ideregistro":
                    $campo=$valor="";
                    break;                
                default:                   
                    break;
                }
            if (strlen($campo)>0){
                if  (strlen($valor)>0)
                   $setUpdate.='"' . $campo . '"=\'' . $valor . '\',';
                else
                   $setUpdate.='"' . $campo . '" =null,';
                    
        }
        }
        $setUpdate=substr($setUpdate,0,-1);
        $campos=substr($campos,0,-2);
        $valores=substr($valores,0,-2);
        $consulta="update pro_propiedad set " . $setUpdate . ',usu_ideregistro=' . $_SESSION['usu_ideregistro'] . ' where "pro_ideregistro"=' . $post['pro_ideregistro'];		$this->conecta_db();
		if($res=@$this->ejecuta_db($consulta)){
                        $this->actualizarInfoTecsoft($post);
			echo " [OK] Registro Guardado";
			}
		else{
			print_r($res);
			echo "No se ha podido completar la accion";
			}
		$this->cierra_db();
		//echo $consulta;
		}
	
	public function eliminar($post){
		$consulta='delete from ter_tercero where "ter_ideregistro"=' . $post['ter_ideregistro'];
		$this->conecta_db();
		$res=$this->consulta_db($consulta);
		$this->cierra_db();
		}
	public function consultar($post){
		//print_r ($post);
		$consulta='';
		switch ($post["accion_m"]){
			case 'pro_propiedad':
				$consulta='select pro_idepropieda
									,pro_estado
									,pro_descripcion
									,pro_direccion
									,pro_ideregistro
									,ter_ideregistro
									,uni_tippropieda
									,est_tippropieda
									,pro_digitos
									,muba_sector
									,pro_seccion
									,pro_manzana
									,uni_municipio
									,uni_barrio
									,pro_altriesgo
									,pro_gpslatitud
									,pro_gpsaltitud
									,pro_gpslongitud
									,pro_numcatastral
									,pro_zona
                                                                        ,uni_cmpdireccion 
                                                                        ,pro_numcatastralnacional
                                                                        from "pro_propiedad" where "pro_ideregistro"=' . $post['pro_ideregistro'];
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
		switch($post["navac"]){
			case "f":
				$consulta.= " order by \"ter_ideregistro\" limit 1";				
				break;
			case "p":
				if ($post["idreg"]=="")
					$consulta.= " order by \"ter_ideregistro\" desc  limit 1";
				else
					$consulta.= " where \"ter_ideregistro\" < " . $post["idreg"] . " order by \"ter_ideregistro\" desc limit 1";
				break;
			case "n":
				if ($post["idreg"]=="")
					$consulta.= " order by \"ter_ideregistro\"  limit 1";
				else
					$consulta.= " where \"ter_ideregistro\" > " . $post["idreg"] . " order by \"ter_ideregistro\" limit 1";
				break;
			case "l":
				$consulta.= " order by \"ter_ideregistro\" desc  limit 1";
				break;
			}
		///*echo $consulta*/;
		$this->conecta_db();
		$respuesta=$this->consulta_db($consulta);
		$this->cierra_db();
		$linea="";
		$this->consultaToCadena($respuesta);
		}
                private function actualizarInfoTecsoft($post){
                    $consulta = "
                                update clientes set cliente_dirsus = dataactualizar.direccion,
                                        cliente_codbar=dataactualizar.barrio
                                from(
                                SELECT
                                  dsus.dsus_pcodigo pcodigo,
                                  dsus.pro_catestrato estrato,
                                  tipins.uni_nombre1 tipousoprisma,
                                  tipins.uni_nombre3 tipousotecsoft,
                                  pro.pro_direccion direccion,
                                        cli.cliente_dirsus,
                                  bar.barrio_cod barrio,
                                        cli.cliente_codbar ,
                                  pro.pro_ideregistro idpropiedad,
                                        emp.empresa_cod empresa
                                FROM dsus_detsuscrip dsus
                                  INNER JOIN empresas emp on emp.empresa_sevemp = dsus.emp_ideregistro
                                  INNER JOIN pro_propiedad pro ON pro.pro_ideregistro = dsus.pro_ideregistro
                                  INNER JOIN barrios bar ON bar.barrio_ideregistro = pro.uni_barrio
                                  INNER JOIN uni_unidad tipins ON tipins.uni_ideregistro = dsus.uni_tipusosuscr
                                  INNER JOIN clientes cli on cli.cliente_codsus = dsus.dsus_pcodigo 
                                        AND cli.cliente_codemp  = emp.empresa_cod
                                WHERE pro.pro_ideregistro = ".$post['pro_ideregistro']."
                                                        ) as dataactualizar
                                   where dataactualizar.pcodigo= cliente_codsus and dataactualizar.empresa= cliente_codemp" ; 
                    if($res= @$this->ejecuta_db($consulta)){
                        echo "Información Actualizada Correctamente " ;}
                    else {
                        print_r($res) ;
                        echo "Error Actualizando información de Tecsoft ";
                    }
                    
                    
                }
                
	}

?>