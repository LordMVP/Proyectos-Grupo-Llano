<?php

require_once "db.class.php";

class m_facturacion_registr_suscr_factura_suscripcion extends database {

	public function guardar($post){
		//print_r($post);
		$campos='"';
        $valores="'";
        $consulta="";
        foreach($post as $campo=>$valor){
            switch ($campo){
				case "form_consulta":           
                case "accion":
                case "navac":
                case "dsus_ideregistr":
                case "tsu_persuspend":
                case "PropTer_ide";
                case "suscr_ide";
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
        $this->conecta_db();
        $consultacic="select cic_ideregistro from dsus_detsuscrip where sus_ideregistro=" . $post["sus_ideregistro"] . " limit 1";
        $rescic=$this->consulta_db($consultacic);
        if ($post['cic_ideregistro']!=$rescic[0][0] && count($rescic)>0){
        	echo "Los ciclos de las suscripciones deben ser iguales";
			return false;
			}      
        
		        
        $consulta="insert into dsus_detsuscrip 
				(" . $campos . ",uni_municipio,uni_barrio,emp_ideregistro)
			 values 
			 	(" . $valores . ", (select uni_municipio from pro_propiedad where pro_ideregistro=" . $post["pro_ideregistro"] . "),(select uni_barrio from pro_propiedad 
			where pro_ideregistro=" . $post["pro_ideregistro"] . "),322) RETURNING dsus_ideregistr";
        ///*echo $consulta*/;
		
		$respuesta=@$this->ejecuta_db($consulta) ? $this->consultaToCadena($respuesta) : print('Error en suscripcion');
		if ($respuesta){
			$consulta="insert into rusu_rutsuscrip rusu_rutAnterio
									,rut_ideregistro
									,dsus_ideregistr
									,rusu_rutsecuen
								values('-'
									,(select rut_ideregistro from rut_ruta where empresa_sevemp='" . $_SESSION['emp_ideregistro'] . "' order by rut_ideregistro limit 1))
									,'" . $respuesta[0] . "'
									,(select max(rusu_rutsecuen)+1 from rusu_rutsuscrip)
									";
			$respuesta=@$this->ejecuta_db($consulta) ? $this->consultaToCadena($respuesta) : print('Error en ruta, es necesaro asignar manualmente.');
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
                case "accion":
				case "dsus_ideregistr":
				case "dsusDet_ide":
				case "sus_ideregistro":
				case "pro_ideregistro":
				case "dsus_ideregistr":
				case "ter_ideregistro":
				case "tsu_persuspend":   
				case "suscr_ide":
				case "PropTer_ide":     
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
        $consulta="update dsus_detsuscrip set " . $setUpdate . ' where dsus_ideregistr=' . $post['dsus_ideregistr'];
		$this->conecta_db();
		if($res=$this->ejecuta_db($consulta)){
			echo "Registro Guardado";
			}
		else{
			print_r($res);
			echo "No se ha podido completar la accion";
			}
		$this->cierra_db();
		//echo '<br>' . $consulta;
		}
	
	public function eliminar(){
		
		}
	public function consultar($post){
		//print_r ($post);
		$consulta='';
		switch ($post["accion_m"]){
			case 'sus_suscripcion':
				$jwhere='';
				if ($post['ter_ideregistro']!="" && count($post['ter_ideregistro'])>0){
					$jwhere.=" sus.ter_ideregistro='" . $post['ter_ideregistro'] . "'";
					}
				if ($post['sus_ideregistro']!="" && count($post['sus_ideregistro'])>0){
					$jwhere.=' and sus."sus_ideregistro"=' . $post['sus_ideregistro'];
					}
				$consulta='select sus."sus_ideregistro"								
								,cnre."cnre_nombre"
							from "sus_suscripcion" sus
							inner join "cnre_cnvrecaudo" cnre
							on sus."cnre_ideregistr" = cnre."cnre_ideregistr" where ' . $jwhere;
				

				break;
			case 'pro_propiedad':
				$consulta='select pro."pro_ideregistro"
								,uni."uni_nombre1" || \'-\' || uni."uni_nombre2" as tipoUnidad
								,pro."pro_idepropieda"							
								,proy."proyecto_nom"
								,bar."barrio_nom"
								,pro."pro_direccion"
								,pro."pro_seccion"
								,pro."pro_manzana"
							from "pro_propiedad" pro
							inner join "proyectos" proy on pro."uni_municipio"=proy."proyecto_ideregistro"
							inner join "barrios" bar on pro."uni_barrio"=bar."barrio_ideregistro"
							inner join "uni_unidad" uni on pro."uni_tippropieda"=uni."uni_ideregistro"
							where pro."ter_ideregistro"=' . $post['ter_ideregistro'];								
				break;
			case 'dsus_detsuscripcion':
				$jwhere='';
				if ($post['sus_ideregistro']!="" && count($post['sus_ideregistro'])>0){
					$jwhere.=' inner join sus_suscripcion sus on sus.sus_ideregistro=dsus.sus_ideregistro where sus."sus_ideregistro"=' . $post['sus_ideregistro'];
					}
				/*$consulta="SELECT dsus.dsus_ideregistr
								,dsus.dsus_pcodigo
								,dsus.dsus_descripcion
								,dsus.dsus_fecinicio
								,tsu.tsu_nombre
								,liq.liq_nombre
								,cic.cic_nombre
								,dsus.dsus_estado
								,dsus.dsus_iniestado || ' - ' || dsus.dsus_finestado as vigencia
							FROM dsus_detsuscrip dsus
							inner join tsu_tipsuscripc tsu on dsus.uni_tipsuscripc=tsu.uni_tipsuscripc
							inner join liq_liquidacion liq on dsus.uni_liquidacion=liq.uni_liquidacion
							inner join cic_ciclo cic on dsus.cic_ideregistro=cic.cic_ideregistro " . $jwhere;*/
							 
				$consulta="SELECT dsus.dsus_ideregistr
								,dsus.dsus_pcodigo
								,dsus.dsus_fecinicio
								,tsu.tsu_nombre
								,liq.liq_nombre
								,cic.cic_nombre
								,dsus.dsus_estado
								,dsus.dsus_iniestado || ' - ' || dsus.dsus_finestado as vigencia
								,rut.rut_nombre
							FROM dsus_detsuscrip dsus
							inner join tsu_tipsuscripc tsu on dsus.uni_tipsuscripc=tsu.uni_tipsuscripc
							inner join liq_liquidacion liq on dsus.uni_liquidacion=liq.uni_liquidacion
							inner join cic_ciclo cic on dsus.cic_ideregistro=cic.cic_ideregistro 
							left join rut_ruta rut on rut.rut_ideregistro=(select rusu.rut_ideregistro from rusu_rutsuscrip rusu where rusu.dsus_ideregistr=" . $post['sus_ideregistro'] . ")
							" . $jwhere;
				break;
			case 'suscripcion_seleccionada':
				$consulta="select dsus_ideregistr
									,dsus_fecinicio	
									,dsus_descripcion							
									,uni_tipsuscripc
									,est_tipsuscripc
									,uni_tipusosuscr
									,est_tipusosuscr
									,uni_liquidacion
									,est_liquidacion
									,cic_ideregistro
									,dsus_pcodigo
									,dsus_estado
									,pro_catestrato
									,dsus_iniestado
									,dsus_finestado
								from public.dsus_detsuscrip where dsus_ideregistr=" . $post['dsus_ideregistr'];
				break;
			
			
		
			}
		///*echo $consulta*/;
		$this->conecta_db();
		$respuesta=@$this->consulta_db($consulta);
		$this->cierra_db();
		//print_r($respuesta);
		count($respuesta[0])>0 ? $this->consultaToCadena($respuesta) : print('sinDatos');	
		}
	public function navegar($post){
		$consulta="";
		//echo $post["idreg"];
		switch($post["navac"]){
			case "f":
				$consulta.= " order by \"dsus_ideregistr\"";				
				break;
			case "p":
				if ($post["idreg"]=="")
					$consulta.= " order by \"dsus_ideregistr\" desc limit 1";
				else
					$consulta.= " where \"dsus_ideregistr\" < " . $post["idreg"] . " order by \"dsus_ideregistr\" limit 1";
				break;
			case "n":
				if ($post["idreg"]=="")
					$consulta.= " order by \"dsus_ideregistr\"";
				else
					$consulta.= " where \"dsus_ideregistr\" > " . $post["idreg"] . " order by \"dsus_ideregistr\" limit 1";
				break;
			case "l":
				$consulta.= " order by \"dsus_ideregistr\" desc limit 1";
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