<?php

require_once "db.class.php";

class m_facturacion_proces_gen_factura extends database {
	private $uni_tipsuscripc;//tipo de suscripcion
	private $uni_tipusosuscr;//tipo de uso
	private $cic_ideregistro;//ciclo 
	private $per_ideregistro;//periodo
	private $concep_preliqui;//preliquidacion
	private $concep_conliqui;//conservaliquidacion
	private $tor_nomtabla;//proceso de origen
	private $suscripciones;
	private $liquidaciones;//relacion de liquidaciones por tipo de uso
	private $cili_cicliquida;//relacion de los ciclos de la liquidacion
	private $conceptos;
	function __construct(){$this->conecta_db();}
	
	public function generar($post){
    	$this->uni_tipsuscripc=$post['uni_tipsuscripc'];
    	$this->uni_tipusosuscr=$post['uni_tipusosuscr'];
    	$this->cic_ideregistro=$post['cic_ideregistro'];
    	$this->per_ideregistro=$post['per_ideregistro'];
    	$this->concep_preliqui=$post['concep_preliqui'];
    	$this->concep_conliqui=$post['concep_conliqui'];
    	if ($this->obtenerSuscripciones())
    	if ($this->verificarEstado())
    	if ($this->obtenerLiquidaciones())
    	if ($this->grabarHistorico())
		$this->facturar()
		;

		}
	private function obtenerSuscripciones(){
		$jwhere='';
		if ($this->uni_tipsuscripc!='TODO'){
			$jwhere.=' and dsus.uni_tipsuscripc=' . $this->uni_tipsuscripc;
			}
		if ($this->cic_ideregistro!='TODO'){
			$jwhere.=' and dsus.cic_ideregistro=' . $this->cic_ideregistro;
			if ($this->per_ideregistro!='TODO'){
				$perfec=$this->consulta_db("select per_fecinicial::timestamp::date,per_fecfinal::timestamp::date from per_periodo where per_ideregistro=" . $this->per_ideregistro);
				$this->rangoFecha=array($perfec[0][0],$perfec[0][1]);
				}
			}
		$jwhere.=" and dsus.uni_tipusosuscr=" . $this->uni_tipusosuscr;
		$dsusq="select dsus.sus_ideregistro
				,dsus.dsus_descripcion
				,dsus.dsus_ideregistr
				,dsus.ter_ideregistro
				,dsus.pro_ideregistro
				,dsus.uni_tipsuscripc
				,dsus.uni_tipusosuscr
				,dsus.uni_liquidacion
				,dsus.cic_ideregistro
				,dsus.est_liquidacion
				,dsus.est_tipsuscripc
				,dsus.est_tipusosuscr
				from dsus_detsuscrip dsus
				where dsus_estado='A'
				" . $jwhere;
		
		$suscripciones=$this->consulta_db($dsusq);
		//count($suscripciones[0])>0 ? $this->consultaToCadena($suscripciones) : print('sinDatos');

		$this->suscripciones=$suscripciones;
		return true;
		}
	private function verificarEstado(){
		foreach($this->suscripciones as $s){
			$facs="select fac.fac_estado from fac_factura fac where dsus_ideregistr='" . $s[2] . "'";

			$estado=$this->consulta_db($facs);
			foreach($estado as $e){
				if ($e[0]=='G'){
					echo "          El proceso se ha cancelado. Existen facturas sin aprobar de procesos anteriores.";
					return false;
					}
				}
			}
		return true;
		}
	private function obtenerLiquidaciones(){		
		$dsus_cics=array();		
		foreach($this->suscripciones as $s) !in_array(array($s[7]),$dsus_cics) ? $dsus_cics[]=array($s[7]) : false;		
		for($k=0;$k<count($dsus_cics);$k++) array_push($dsus_cics[$k],$this->suscripciones[$k][8]);
		//echo "<pre>"; print_r($dsus_cics); echo "</pre>";
		$this->cili_cicliquida=$dsus_cics;
		$consulta="select liq.uni_liquidacion
						,liq.liq_nombre
						,liq.liq_inivigencia
						,liq.liq_finvigencia
						,liq.uni_documento
						,liq.uni_tipdocument
						,liq.liq_historico
					from usli_usoliquida usli
					inner join liq_liquidacion liq on usli.uni_liquidacion=liq.uni_liquidacion
					where usli.uni_tipusosuscr=" . $this->uni_tipusosuscr . "
					and usli.emp_ideregistro=" . $_SESSION['emp_ideregistro'] . "
					and liq.liq_estado='A'
					and (liq.liq_venclasific<>'CO' and liq.liq_venclasific<>'CA')			
					";
		
		
		$liqs=$this->consulta_db($consulta);
		if (count($liqs)>0){
			$this->liquidaciones=$liqs;
			//echo "<pre>"; print_r($liqs); echo "</pre>";
			return true;
			}
		echo "No se encontraron liquidaciones relacionadas a este tipo de uso.";
		return false;		
		}
	private function grabarHistorico(){
		$i=0;
		//echo "<pre>"; print_r($this->cili_cicliquida); echo "</pre>";
		foreach($this->cili_cicliquida as $l){
			if(!$per_ideregistro=$this->obtenerPeriodo($l[1])){
				echo "Hubo un problema cargando un periodo. Ciclo [" . $l[1] . "]";
				return false;
				}
			$hliq_q="insert into hliq_liquidacion select nextval('sq_hliq_ideregistr'::regclass)
							,uni_liquidacion
							,est_liquidacion
							,liq_nombre
							,uni_documento
							,uni_tipdocument
							,liq_inivigencia
							,liq_finvigencia
							," . $_SESSION["emp_ideregistro"] . "
							,liq_venclasific
							,liq_estado
							," . $l[1] . "
							," . $per_ideregistro . "
							,'" . date('Y') . "'
							,'" . date('Y-m-d') . "'						
						from liq_liquidacion
						where uni_liquidacion=" . $l[0] . " RETURNING hliq_ideregistr;";
			//echo $hliq_q;
			if ($hliq_ideregistr=$this->ejecuta_db($hliq_q)[0]){
				$this->cili_cicliquida[$i][2]=$hliq_ideregistr;
				$historicliq="insert into hcon_concepto
								select $hliq_ideregistr
										,con.uni_concepto
										,con.est_concepto
										,con.con_nombre
										,con.con_alias
										,con.con_abreviatura
										,con.con_tipcalculo
										,con.con_valor
										,con.con_formula
										,con.con_operacion
										,con.con_naturaleza
										,con.con_preliquidar
										,con.con_anticipo
										,con.con_pagpriori
										,con.con_financiable
										,con.tor_nomtabla
										,NULL
										,con.con_inivigencia
										,con.con_finvigencia
										,con.con_estado
									from con_concepto con
									inner join coli_conliquida coli on con.uni_concepto=coli.uni_concepto
									where coli.uni_liquidacion=" . $this->cili_cicliquida[$i][0] . ";";
				$histocicliq.="insert into hcoli_conliquida
								select $hliq_ideregistr
										,coli.uni_concepto
										,NULL
										,coli.uni_liquidacion
										,NULL
										,NULL
										,coli.coli_imprimir
										,coli.coli_ideregistr
									from coli_conliquida coli
									where coli.uni_liquidacion=" . $this->cili_cicliquida[$i][0] . " ;";
				//$histocicliq.="insert into hcore_conrelacio";
				//$histocicliq.="insert into hraco_ranconcept";
				//$this->ejecuta_db($historicliq);
				}
			else{
				echo "Hubo un problema guardando los históricos. Se cancela la operacion";
				return false;
				}	
			//echo "<pre>"; print_r($this->cili_cicliquida); echo "</pre>";
			$i++;
			}
		return true;
		}
	
	public function facturar(){
		$this->conceptos=array();		
		$con_cons="select con.uni_concepto
					,con.con_alias
					,con.est_concepto
					,con.con_nombre
					,con.con_tipcalculo
					,con.con_valor
					,con.con_formula
					,con.con_operacion
					,con.con_naturaleza
					,con.con_preliquidar
					,con.con_anticipo
					,con.con_pagpriori
					,con.con_financiable
					,con.con_inivigencia
					,con.con_finvigencia
					,con.con_estado
					,con.prg_ideregistro
					,con.con_tipregistro
					,con.tor_nomtabla
					,con.dtor_nomcampo
				from con_concepto con
				where con.con_estado='A'
				order by con_tipcalculo				
				";
		$this->conceptos=$this->consulta_db($con_cons);
		$this->conceptos_valor=$this->conceptos_formula=array();	
		
		foreach($this->suscripciones as $dsus){
			if(!$this->facCrearCabecera($dsus)){
				echo "Ha fallado la creación de cabeceras en suscripcion(dsus):" . $dsus[2];
				return false;
				}	
			}
		echo "El proceso ha terminado.";
		return true;	
		}
	private function facCrearCabecera($dsus){
		$cabecera="insert into fac_factura
									(fac_numero,fac_metgenera,fac_estado,fac_fecha,fac_ideactual,fac_idepadre,fac_fecaprobada,fac_feceliminad,fac_fecfinancia,fac_feccastigad,fac_fecvence,emp_ideregistro,sus_ideregistro,dsus_ideregistr,uni_tipsuscripc,uni_tipusosuscr,uni_liquidacion,ter_ideregistro,cic_ideregistro,per_ideregistro,uni_documento,uni_tipdocument,amo_ideregistro,est_liquidacion,est_tipusosuscr,per_ano,hliq_ideregistr,est_documento,est_tipdocument,est_tipsuscripc,fac_sdoreal,fac_ideorigen,uni_tiptercero)								values
									((select max(fac_numero)+1 from fac_factura)
									,'P'
									,'G'
									,'" . date('Y-m-d h:m:i') . "'
									,NULL
									,NULL
									,NULL
									,NULL
									,NULL
									,NULL
									,NULL
									,'" . $_SESSION["emp_ideregistro"] . "'
									,'" . $dsus[0] . "'
									,'" . $dsus[2] . "'
									,'" . $dsus[5] . "'
									,'" . $dsus[6] . "'
									,'" . $dsus[7] . "'
									,(select ter_ideregistro from sus_suscripcion where sus_ideregistro='" . $dsus[0] . "')
									,'" . $dsus[8] . "'
									,'" . $this->obtenerPeriodo($dsus[8]) . "'
									,'24'
									,'27'
									,NULL
									,'" . $dsus[9] . "'
									,'" . $dsus[11] . "'
									,'" . date('Y') . "'
									,'" . $this->obtenerHliq($dsus[7]) . "'
									,'7'
									,'8'
									,'" . $dsus[9] . "'
									,NULL
									,NULL
									,(select ter.uni_tiptercero from sus_suscripcion sus inner join ter_tercero ter on sus.ter_ideregistro=sus.ter_ideregistro where sus.sus_ideregistro='" . $dsus[0] . "' limit 1)) RETURNING fac_ideregistro";
			//echo $cabecera . "<p>"; 
		if (!$fac_ideregistro=$this->ejecuta_db($cabecera)){		
			return false;
			}
		else{
			$this->facCrearDetalleFactura($fac_ideregistro[0],$dsus);
			}
		return true;
	
		}
	private function facCrearDetalleFactura($fac,$dsus){
		$coliq="select coli.uni_concepto from coli_conliquida coli where coli.uni_liquidacion=" . $dsus[7];
		$coli_conliquida=$this->consulta_db($coliq);
		$conceptos_coli=array();
		foreach($coli_conliquida as $coli){
			foreach ($this->conceptos as $con){
				if ($con[0]==$coli[0]){
					$conceptos_coli[]=$con;
					}
				}
			}
		$conceptos_valor=$conceptos_formula=array();
		foreach($conceptos_coli as $con){
			if ($con[4]=='V'){
				$conceptos_valor[]=$con;
				}
			else{
				$conceptos_formula[]=$con;
				}
			}
		//echo "<pre>";print_r($conceptos_coli);echo "</pre>";
		//obtener periodo y ciclo a procesar
		$per_id=null;
		if ($this->cic_ideregistro=='TODO'){
			$per_id=$this->consulta_db("select per_ideregistro from per_periodo where cic_ideregistro=" . $dsus[8] . " and per_estado='A' limit 1")[0][0];
			}
		else $per_id=$this->per_ideregistro;
		$this->facRegistraConValor($conceptos_valor,$fac,$dsus,$per_id);
		$this->facRegistraConFormula($conceptos_formula,$fac,$dsus,$per_id);
		}
	private function facRegistraConValor($conceptos_valor,$fac,$dsus,$per_id){
		foreach($conceptos_valor as $cv){
			$vrunitCon=$cantidCon=$vrtotaCon=0;//valores de concepto
			switch($cv[17]){
				case "C":
					$vrunitCon=1;
					$cantidCon=floatval($cv[5]);
					break;
				case "T":
					$vrunitCon=floatval($cv[5]);
					$cantidCon=1;
					break;
				case "U":
					$vrunitCon=floatval($cv[5]);
					$cantidCon=1;
					break;				
				}
			if($cv[18]=='con_concepto'){
					$vrtotaCon=$vrunitCon * $cantidCon;
					}
			else{
				$consulMovto="select " . $cv[19] . " from " . $cv[18] . " where dsus_ideregistr=" . $dsus[2];
				$vlrx=$this->consulta_db($consulMovto)[0][0];
				if (!is_numeric($vlrx)) $vlrx=0;
				switch($cv[17]){
					case "C":
						$vrunitCon=1;
						$cantidCon=$vlrx;
						$vrtotaCon=$vrunitCon * $cantidCon;
						break;
					case "U":
						$vrunitCon=$vlrx;
						$cantidCon=floatval($cv[5]);
						$vrtotaCon=$vrunitCon * $cantidCon;
						break;
					case "T":
						$vrtotaCon=$vlrx;
						break;
					}
				//echo $consulMovto;
				}
			$vrtotaCon=abs($vrtotaCon);
			$vrreal=0;
			switch($cv[7]){
				case "S":
					$vrreal=$vrtotaCon;
					break;
				case "R":
					$vrreal=$vrtotaCon * (-1);
					break;
				case "I":
					$vrreal=0;
					break;
				}
			$sdoreal=$vrreal;
			if ($sdoreal<0) $sdoreal=0;
			
			//echo "Valor total:$vrtotaCon<br>";
			$consulta="insert into dfac_detfactura
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
							,per_ideregistro)
						VALUES
							('G'
							,NULL
							,'" . $cantidCon . "'
							,'" . $vrunitCon . "'
							,'" . $vrunitCon . "'
							,'" . $vrreal . "'
							,'" . $sdoreal . "'
							,'" . $fac . "'
							,'" . $_SESSION["emp_ideregistro"] . "'
							,'" . $dsus[2] . "'
							,'" . $dsus[5] . "'
							,'" . $dsus[7] . "'
							,'" . $cv[0] . "'
							,24
							,27
							,'" . $cv[18] . "'
							,'" . $cv[19] . "'
							,0
							,'" . $dsus[10] . "'
							,'" . $dsus[9] . "'
							,'" . $cv[2] . "'
							,7
							,8
							,'" . $dsus[8] . "'
							,'" . $per_id . "')";
			///*echo $consulta*/ . "<br>";
			$this->ejecuta_db($consulta);
			}
		
		}
	private function facRegistraConFormula($conceptos_formula,$fac,$dsus,$per_ide=null){
		$per_ideregistro=0;
		!$per_ide ? $per_ideregistro=$this->per_ideregistro : $per_ideregistro=$per_ide;
		$core_conrelacio=array();
		$con_formula=array();
		foreach($conceptos_formula as $cf){
			$coreq="select core.uni_concepto
					,con.con_alias
					,core.uni_conrelacion
					,core.uni_liquidacion
					,core.tor_nomtabla
					,core.dtor_nomcampo
					,core.uni_documento
					,core.uni_tipdocument
					,core.core_ideregistr
					,core.core_tipacumula
					,core.core_canacumula
				from core_conrelacio core
				inner join con_concepto con on core.uni_conrelacion=con.uni_concepto
				where core.uni_concepto=" . $cf[0] . "				
				";
			$core_conrelacio[$cf[0]]=$this->consulta_db($coreq);			
			}
		//obten valores
		$q=0;
		foreach($core_conrelacio as $cr){
			//echo "<pre>";print_r($c);echo "</pre>";
			$i=0;
			foreach ($cr as $cn){
				//echo "<pre>";print_r($cn);echo "</pre>";
				$pref=substr($cn[4],0,strpos($cn[4],'_'));
				//echo $pref . "<br>";
				$periodow='';
				$cn[10]=='' ? $cn[10]='0' : true;
				switch($cn[9]){
					case "T":
						$periodow=" and per_ideregistro<=$per_ideregistro limit " . $cn[10];
						break;
					case "A":
						$periodow=" and per_ideregistro=$per_ideregistro";
						break;
					case "N":
						$periodow=" and per_ideregistro<$per_ideregistro limit " . $cn[10];
						break;
					case "I":
						$periodow="";
						break;
					}
				$valq="select sum(" . strtolower($cn[5]) . ") from " . strtolower($cn[4]) . " 
						where dsus_ideregistr=" . $dsus[2] . " 
						and (" . $pref . "_estado<>'E' and " . $pref . "_estado<>'C')
						" . $periodow;
				$valor=$this->consulta_db($valq)[0][0];
				if (!is_numeric($valor)) $valor=0;
				$core_conrelacio[$cn[0]][$i][11]=$valor;
				//echo "<br>" . $valor;
				
				$i++;
				}
			$q++;
			}
		//echo "<pre>";print_r($core_conrelacio);echo "</pre>";
		//remp form
		foreach($conceptos_formula as $cf){
			$formulafunc=array();
			$forfun=$formula=$cf[6];
			for(;;){
				$fn_=strpos($forfun,'fn_');
				if ($fn_===false) break;
				$pos=$fn_;
				$forfun=substr($forfun,$pos);
				$fpos=strpos($forfun,')')+1;
				$fun=substr($forfun,0,$fpos);
				$datos=substr($fun,strpos($fun,'('));
				foreach ($core_conrelacio[$cf[0]] as $cr) $datos=str_replace($cr[1],$cr[11],$datos);
				$fun_ori=$fun;
				$fun=substr($fun,0,strpos($fun,'(')) . $datos;
				$formula=str_replace($fun_ori,$fun,$formula);				
				$formulafunc[]=$fun;
				$forfun=substr($forfun,$fpos);				
				}
			foreach($formulafunc as $frm){
				$fun_nombre=substr($frm,0,strpos($frm,'('));
		        $funq="select fun_nombre,fun_ubicacion from fun_funcion where fun_nombre='" . $fun_nombre . "'";
		        $funr=$this->consulta_db($funq);
				include '../librerias/' . $funr[0][1];$funval=eval('return ' . $frm . ';');
				$formula=str_replace($frm,$funval,$formula);
				}
			foreach ($core_conrelacio[$cf[0]] as $cr){
				$formula=str_replace($cr[1],'(' . $cr[11] . ')',$formula);				
				}
			foreach ($this->conceptos as $con){
				$formula=str_replace($con[1],'(' . $con[5] . ')',$formula);
				}
			//echo $formula . "<br>";
			$formula_res=eval('return ' . $formula . ';');
			$vrunitCon=$cantidCon=$vrtotaCon=0;//valores de concepto
			switch($cf[17]){
				case "C":
					$vrunitCon=1;
					$cantidCon=floatval($formula_res);
					break;
				case "T":
					$vrunitCon=floatval($formula_res);
					$cantidCon=1;
					break;
				case "U":
					$vrunitCon=floatval($formula_res);
					$cantidCon=1;
					break;				
				}
			$vrtotaCon=$vrunitCon * $cantidCon;
			
			$vlrx=$formula_res;
			switch($cf[17]){
				case "C":
					$vrunitCon=1;
					$cantidCon=$vlrx;
					$vrtotaCon=$vrunitCon * $cantidCon;
					break;
				case "U":
					$vrunitCon=$vlrx;
					$cantidCon=floatval($cf[5]);
					$vrtotaCon=$vrunitCon * $cantidCon;
					break;
				case "T":
					$vrtotaCon=$vlrx;
					break;
				}
				//echo $consulMovto;
			$vrtotaCon=abs($vrtotaCon);
			$vrreal=0;
			switch($cf[7]){
				case "S":
					$vrreal=$vrtotaCon;
					break;
				case "R":
					$vrreal=$vrtotaCon * (-1);
					break;
				case "I":
					$vrreal=0;
					break;
				}
			$sdoreal=$vrreal;
			if ($sdoreal<0) $sdoreal=0;
			
			//echo "Valor total:$vrtotaCon<br>";
			$consulta="insert into dfac_detfactura
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
							,per_ideregistro)
						VALUES
							('G'
							,NULL
							,'" . $cantidCon . "'
							,'" . $vrunitCon . "'
							,'" . $vrunitCon . "'
							,'" . $vrreal . "'
							,'" . $sdoreal . "'
							,'" . $fac . "'
							,'" . $_SESSION["emp_ideregistro"] . "'
							,'" . $dsus[2] . "'
							,'" . $dsus[5] . "'
							,'" . $dsus[7] . "'
							,'" . $cf[0] . "'
							,24
							,27
							,'" . $cf[18] . "'
							,'" . $cf[19] . "'
							,0
							,'" . $dsus[10] . "'
							,'" . $dsus[9] . "'
							,'" . $cf[2] . "'
							,7
							,8
							,'" . $dsus[8] . "'
							,'" . $per_ideregistro . "')";
			///*echo $consulta*/ . "<br>";
			if (!$this->ejecuta_db($consulta)){
				return false;
				}
			return true;		
			}
		}
	private function obtenerPeriodo($cic_ideregistro){
		$per_con="select per.per_ideregistro from per_periodo per where per.cic_ideregistro=$cic_ideregistro and per.per_estado='A' limit 1";
		$per_ideregistro=$this->consulta_db($per_con)[0][0];
		if($per_ideregistro=="") return false;
		return $per_ideregistro;
		}
	private function obtenerHliq($uni_liquidacion){
		foreach($this->cili_cicliquida as $c) if ($c[0]==$uni_liquidacion) return $c[2];
		return false;
		}
	public function aprobar($post){
		$this->uni_tipsuscripc=$post['uni_tipsuscripc'];
    	$this->uni_tipusosuscr=$post['uni_tipusosuscr'];
    	$this->cic_ideregistro=$post['cic_ideregistro'];
    	$this->per_ideregistro=$post['per_ideregistro'];
    	$this->concep_preliqui=$post['concep_preliqui'];
    	$this->concep_conliqui=$post['concep_conliqui'];
    	if ($this->obtenerSuscripciones()){
	    	foreach($this->suscripciones as $s){
				$facs="update fac_factura set fac_estado='A' where fac_estado='G' and dsus_ideregistr='" . $s[2] . "'";
				$this->ejecuta_db($facs);
				}
			echo "Las facturas se han aprobado."; 
			}
		else{
			echo "No se aprobó ninguna suscripción.";
			}
		
		return true;	
		}
		
	}

?>