<?php

require_once "db.class.php";
class m_facturacion_registr_factura extends database {

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
        /*echo $consulta*/;
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
			case 'fac_factura':
				$consulta='select fac.fac_ideregistro
								,fac.fac_estado
								,fac.emp_ideregistro
								,fac.fac_numero
								,doc.doc_nombre
								,fac.fac_fecha::timestamp::date
								,fac.cic_ideregistro
								,fac.per_ideregistro
								,tido.tido_nombre
								,fac.sus_ideregistro
								,fac.fac_ideorigen
								,fac.fac_ideactual
								,ter.ter_nomcompleto
								,tsu.tsu_nombre 
							from fac_factura fac 
							inner join ter_tercero ter on ter.ter_ideregistro=fac.ter_ideregistro 
							inner join tsu_tipsuscripc tsu on tsu.uni_tipsuscripc=fac.uni_tipsuscripc
							inner join doc_documento doc on doc.uni_documento=fac.uni_documento
							inner join tido_tipdocumen tido on tido.uni_tipdocument=fac.uni_tipdocument';
				break;
			case 'cuadroBusquedaConsulta':
				$consultaEnc="
						select distinct on (fac.fac_ideregistro) 
								fac.fac_ideregistro
								,fac.fac_numero
								,doc.doc_nombre
								,fac.fac_fecha::timestamp::date
								,cic.cic_nombre
								,per.per_nombre
								,tido.tido_nombre								
							from fac_factura fac 
							inner join tsu_tipsuscripc tsu on tsu.uni_tipsuscripc=fac.uni_tipsuscripc
							inner join doc_documento doc on doc.uni_documento=fac.uni_documento
							inner join tido_tipdocumen tido on tido.uni_tipdocument=fac.uni_tipdocument
							inner join cic_ciclo cic on cic.cic_ideregistro=fac.cic_ideregistro
							inner join per_periodo per on per.per_ideregistro=fac.per_ideregistro and fac_estado <>'E'
                                                        and fac.emp_ideregistro=" . $_SESSION['emp_ideregistro'] 
					;

				isset($post['b_ter_documento']) ? $ter_documento=$post['b_ter_documento'] : $ter_documento='';
				isset($post['b_pro_direccion']) ? $pro_direccion=$post['b_pro_direccion'] : $pro_direccion='';
				isset($post['b_sus_ideregistro']) ? $sus_ideregistro=$post['b_sus_ideregistro'] : $sus_ideregistro='';
				isset($post['b_dsus_ideregistr']) ? $dsus_ideregistr=$post['b_dsus_ideregistr'] : $dsus_ideregistr='';
				isset($post['b_nov_ideregistro']) ? $nov_ideregistro=$post['b_nov_ideregistro'] : $nov_ideregistro='';
				isset($post['b_uni_tipusosuscr']) ? $uni_tipusosuscr=$post['b_uni_tipusosuscr'] : $uni_tipusosuscr='';
				isset($post['b_uni_liquidacion']) ? $uni_liquidacion=$post['b_uni_liquidacion'] : $uni_liquidacion='';
				isset($post['b_uni_documento']) ? $uni_documento=$post['b_uni_documento'] : $uni_documento='';
				isset($post['b_uni_tipdocument']) ? $uni_tipdocument=$post['b_uni_tipdocument'] : $uni_tipdocument='';
				isset($post['b_dsus_pcodigo']) ? $dsus_pcodigo=$post['b_dsus_pcodigo'] : $dsus_pcodigo='';


				
				if ($ter_documento!=''){
					$jwhere='';
					$consulta="
						inner join ter_tercero ter on fac.ter_ideregistro=ter.ter_ideregistro
						where ter.ter_documento='$ter_documento'
						limit 5
						";
					
					if ($uni_tipusosuscr!=''){
						$jwhere.="
							and fac.uni_tipusosuscr=$uni_tipusosuscr
							";
						}
					if ($uni_liquidacion!=''){
						$jwhere.="
							and fac.uni_liquidacion=$uni_liquidacion
							";
						}
					if ($uni_documento!=''){
						$jwhere.="
							and fac.uni_documento=$uni_documento
							";
						}
					if ($uni_tipdocument!=''){
						$jwhere.="
							and fac.uni_tipdocument=$uni_tipdocument
							";
						}
					
					$consulta="
						inner join ter_tercero ter on fac.ter_ideregistro=ter.ter_ideregistro
						where ter.ter_documento='$ter_documento'
						$jwhere
						limit 5
						";
					}
				else if ($pro_direccion!=''){
					$consulta="
						inner join pro_propiedad pro on pro.ter_ideregistro=ter.ter_ideregistro
						where pro.pro_direccion ~* '$pro_direccion'
						limit 5
						";
					}
				else if ($sus_ideregistro!=''){
					$consulta="
						where fac.sus_ideregistro=$sus_ideregistro
						";
					}
				else if ($dsus_ideregistr!=''){
					$consulta="
						where fac.dsus_ideregistr=$dsus_ideregistr
						";
					}
                                else if ($dsus_pcodigo!=''){
						$consulta.=" inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr = fac.dsus_ideregistr
							    where dsus.dsus_pcodigo ='$dsus_pcodigo' ";
						}        

				else {
					return false;
					}
				$consulta=$consultaEnc . $consulta;
				break;
				
			case 'cargarResultado':
				$consulta="
						select fac.fac_ideregistro
								,fac.fac_estado
								,fac.emp_ideregistro
								,fac.fac_numero
								,doc.doc_nombre
								,fac.fac_fecha::timestamp::date
								,fac.cic_ideregistro
								,fac.per_ideregistro
								,tido.tido_nombre
								,fac.sus_ideregistro
                                                                ,fac.dsus_ideregistr
                                                                ,dsus.dsus_pcodigo
								,fac.fac_ideorigen
								,fac.fac_ideactual
								,ter.ter_nomcompleto
								,tsu.tsu_nombre 
								,ee.est_nombre
								,dsus.pro_catestrato
								,cic_nombre
								,fac.fac_vlrreal								
							from fac_factura fac 
                            inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr= fac.dsus_ideregistr 
							inner join est_estructura ee on ee.est_ideregistro =dsus.pro_catestrato
							inner join ter_tercero ter on ter.ter_ideregistro=fac.ter_ideregistro 
							inner join tsu_tipsuscripc tsu on tsu.uni_tipsuscripc=fac.uni_tipsuscripc
							inner join doc_documento doc on doc.uni_documento=fac.uni_documento
							inner join tido_tipdocumen tido on tido.uni_tipdocument=fac.uni_tipdocument
							inner join cic_ciclo cc on cc.cic_ideregistro=dsus.cic_ideregistro
							where fac.fac_ideregistro=" . $post['fac_ideregistro'] . "
				";
				break;
			
			}

		$this->conecta_db();
		if($respuesta=$this->consulta_db($consulta))
			count($respuesta[0])>0 ? $this->consultaToCadena($respuesta) : print('sinDatos');
		$this->cierra_db();	
		}
	public function navegar($post){
		$consulta='select fac.fac_ideregistro
								,fac.fac_estado
								,fac.emp_ideregistro
								,fac.fac_numero
								,doc.doc_nombre
								,fac.fac_fecha::timestamp::date
								,fac.cic_ideregistro
								,fac.per_ideregistro
								,tido.tido_nombre
								,fac.sus_ideregistro
								,fac.fac_ideorigen
								,fac.fac_ideactual
								,ter.ter_nomcompleto
								,tsu.tsu_nombre 
							from fac_factura fac 
							inner join ter_tercero ter on ter.ter_ideregistro=fac.ter_ideregistro 
							inner join tsu_tipsuscripc tsu on tsu.uni_tipsuscripc=fac.uni_tipsuscripc
							inner join doc_documento doc on doc.uni_documento=fac.uni_documento
							inner join tido_tipdocumen tido on tido.uni_tipdocument=fac.uni_tipdocument';
		switch($post["navac"]){
			case "f":
				$consulta.= " order by fac.fac_ideregistro limit 1";				
				break;
			case "p":
				if ($post["idreg"]=="")
					$consulta.= " order by fac.fac_ideregistro desc  limit 1";
				else
					$consulta.= " where fac.fac_ideregistro < " . $post["idreg"] . " order by fac.fac_ideregistro desc limit 1";
				break;
			case "n":
				if ($post["idreg"]=="")
					$consulta.= " order by fac.fac_ideregistro  limit 1";
				else
					$consulta.= " where fac.fac_ideregistro > " . $post["idreg"] . " order by fac.fac_ideregistro limit 1";
				break;
			case "l":
				$consulta.= " order by fac.fac_ideregistro desc  limit 1";
				break;
			}
		echo $consulta;
		$this->conecta_db();
		$respuesta=@$this->consulta_db($consulta);
		$this->cierra_db();
		$linea="";
		$this->consultaToCadena($respuesta);
		}
	}
	      
?>