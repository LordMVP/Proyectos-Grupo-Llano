<?php

require_once "db.class.php";
class m_facturacion_proces_gen_nota_autom extends database {
	function __construct(){$this->conecta_db();}
	public function guardar($post){		
		$args=$this->concatenarArgumentos($post);      
		        
        $funq="select fun_nombre,fun_ubicacion from fun_funcion where fun_ideregistro=" . $post['fun_ideregistro'];
        $funr=$this->consulta_db($funq);
		include '../librerias/' . $funr[0][1];eval($funr[0][0] . '(\'' . $args . '\');');
		}
	
	public function editar(){
		
		}
	
	public function eliminar(){
		
		}
	
	public function consultar($post){
		$consulta='';
		$jwhere='';
		$fechaLimite=new DateTime(); 
		$fechaLimite->modify('-5 month');
		
		if ($post['uni_tipusosuscr']!=''){
			$jwhere.="and uni_tipusosuscr=" . $post['uni_tipusosuscr'];
			}
		if ($post['uni_tipsuscripc']!=''){
			$jwhere.="and uni_tipsuscripc=" . $post['uni_tipsuscripc'];
			}

		switch ($post["accion_m"]){
			case 'periodo':
				$consulta='select per_ideregistro,per_nombre from "per_periodo" where cic_ideregistro=\'' . $post['cic_ideregistro'] . "' order by per_ideorden";
				break;
			
			case 'documentos':
				$consulta="select fac_ideregistro,fac_numero,fac_fecha,dsus_ideregistr,uni_liquidacion
								from fac_factura
								where uni_liquidacion=" . $post['uni_liquidacion'] . "
								and cic_ideregistro=" . $post['cic_ideregistro'] . "
								" . $jwhere . "
								and fac_estado<>'E'
								and fac_estado<>'C'
								and fac_estado<>'F'
								and fac_estado<>'G'
								and fac_fecha>'" . $fechaLimite->format('Y-m-d') . "'
								";
				break;
			}
		///*echo $consulta*/;
		$respuesta=$this->consulta_db($consulta);
		//print_r($respuesta);
		count($respuesta[0])>0 ? $this->consultaToCadena($respuesta) : print('sinDatos');
		}
	
	public function generar($post){
		$fechaLimite=new DateTime(); 
		$fechaLimite->modify('-5 month');
		//print_r($post);	
		$jwhere='';
		if ($post['tipsel']=='P'){
			foreach($post['periodos_ide'] as $per){
				$jwhere!='' ? $jwhere.=' or ' : true;
				$jwhere.=' per_ideregistro=' . $per;
				}
			$jwhere.=" and uni_liquidacion=" . $post['uni_liquidacion'];
			$jwhere.=" and cic_ideregistro=" . $post['cic_ideregistro'];
			$jwhere.=" and uni_tipusosuscr=" . $post['uni_tipusosuscr'];
			$jwhere.=" and uni_tipsuscripc=" . $post['uni_tipsuscripc'];
			}
		if ($post['tipsel']=='F'){
			foreach($post['documentos_ide'] as $doc){
				$jwhere!=='' ? $jwhere.=' and ' : true;
				$jwhere.=' fac_ideregistro=' . $doc;
				}
			}
		$conceptos=explode('@_@',$post['conceptos']);
		for($k=0;$k<count($conceptos);$k++){
			$conceptos[$k]=explode('||',$conceptos[$k]);
			}
		//echo "<pre>";print_r($conceptos);echo "</pre>";
		$consulta="select * from fac_factura where " . $jwhere . " and  fac_fecha>'" . $fechaLimite->format('Y-m-d') . "'" ;
		$facturas=$this->consulta_db($consulta);		
		foreach($facturas as $fac){
			$nota="INSERT INTO not_nota
						(not_fecha
						,not_comentario
						,uni_motnota
						,dsus_ideregistr
						,cic_ideregistro
						,per_ideregistro
						,est_motnota
						,emp_ideregistro)
					VALUES
						('" . date('Y-m-d') . "'
						,'" . $post['not_comentario'] . "'
						,'" . $post['uni_motnota'] . "'
						,'" . $fac[14] . "'
						,'" . $fac[19] . "'
						,'" . $fac[20] . "'
						,'3'
						,'" . $_SESSION['emp_ideregistro'] . "') RETURNING not_ideregistro";
			//echo $nota;
			$not_ideregistro=$this->ejecuta_db($nota);
			//echo $not_ideregistro[0];
			foreach($conceptos as $con){
				$consulta="select * from dfac_detfactura where fac_ideregistro='" . $fac[0] . "' and uni_concepto='" . $con[0] . "'";
				$datos=$this->consulta_db($consulta);
				$dif=floatval($datos[0][6]) - $con[3];
				$dnot="INSERT INTO dnot_detnota
							(not_ideregistro
							,dnot_cantidad
							,dnot_vlrunitari
							,dnot_vlrtotal
							,uni_liquidacion
							,uni_concepto
							,est_liquidacion
							,est_concepto
							,emp_ideregistro)
						VALUES
							(" . $not_ideregistro[0] . "
							," . $con[3] . "
							," . $con[2] . "
							," . $con[4] . "
							," . $post['uni_liquidacion'] . "
							," . $con[0] . "
							,7
							,6
							,'" . $_SESSION['emp_ideregistro'] . "');
					";
				//echo $dnot;
				$doc=26;
				$tdoc=27;
				if($dif<0){
					$doc=25;
					$tdoc=27;
					}
				
				$this->ejecuta_db($dnot);
				$dfac="INSERT INTO dfac_detfactura
							(dfac_estado
							,dfac_ideorigen
							,dfac_cantidad
							,dfac_vlrunitari
							,dfac_vlrtotal
							,dfac_vlrreal
							,dfac_sdoreal
							,fac_ideregistro
							,emp_ideregistro
							,dsus_ideregistr
							,uni_tipsuscripc
							,uni_liquidacion
							,uni_concepto
							,uni_documento
							,uni_tipdocument
							,tor_nomtabla
							,dtor_nomcampo
							,damo_ideregistr
							,est_tipsuscripc
							,est_liquidacion
							,est_concepto
							,est_documento
							,est_tipdocument
							,cic_ideregistro
							,per_ideregistro
							,dfac_idepadre
							,dfn_ideregistr)
						VALUES
							('" . $datos[0][1] . "'
							,'" . $fac[0] . "'
							,'" . $con[3] . "'
							,'" . $con[2] . "'
							,'" . $con[4] . "'
							,'" . $con[4] . "'
							,0
							,'" . $datos[0][8] . "'
							,'" . $datos[0][9] . "'
							,'" . $datos[0][10] . "'
							,'" . $datos[0][11] . "'
							,'" . $datos[0][12] . "'
							,'" . $datos[0][13] . "'
							,'" . $doc . "'
							,'" . $tdoc . "'
							,'" . $datos[0][16] . "'
							,'" . $datos[0][17] . "'
							,NULL
							,'" . $datos[0][19] . "'
							,'" . $datos[0][20] . "'
							,'" . $datos[0][21] . "'
							,'" . $datos[0][22] . "'
							,'" . $datos[0][23] . "'
							,'" . $datos[0][24] . "'
							,'" . $datos[0][25] . "'
							,'" . $fac[0] . "'
							,NULL)";
				//echo $dfac;
				$this->ejecuta_db($dfac);
				//echo $dif;
				}	
			}
		}
	
	}

?>