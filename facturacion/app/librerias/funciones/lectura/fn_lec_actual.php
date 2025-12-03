<?php

class lec_actual extends database{
	private $uni_tipsuscripc;
	private $cic_ideregistro;
	private $per_ideregistro;
	private $rangoFecha;
	
	function __construct($a){
		$this->cargarParams($a);
		$this->conecta_db();
		}
	
	public function cargarSuscripcion(){
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
		$dsusq="select dsus.sus_ideregistro
				,dsus.dsus_descripcion				
				,dsus.dsus_ideregistr
				,dsus.ter_ideregistro
				,dsus.pro_ideregistro
				,dsus.uni_tipusosuscr
				,dsus.uni_liquidacion
				,dsus.cic_ideregistro
				from dsus_detsuscrip dsus
				where dsus_estado='A'
				" . $jwhere;
		
		$suscripciones=$this->consulta_db($dsusq);
		count($suscripciones[0])>0 ? $this->consultaToCadena($suscripciones) : print('sinDatos');
		return $suscripciones;
		}
	public function generarNovedad($dsus){
		//print_r($dsus);
		foreach($dsus as $d){
			$lectura_cons="select lec_ideregistro from lec_lectura where dsus_ideregistr='" . $d[2] . "'";
			$lecs=$this->consulta_db($lectura_cons);			
			$nov_ideregistro=null;
			if (count($lecs)>0){
				$uni_concepto=36;
				$con_nombre="Lectura";
				$nov_cons="insert into nov_novedad
					(nov_fecgenerac
					,nov_estado
					,nov_genera
					,nov_fecprocesad
					,nov_observacion
					,emp_ideregistro
					,cic_ideregistro
					,per_ideregistro
					,tor_nomtabla
					,nov_fecaprovac
					,per_ano)
				values
					('" . date('Y-m-d') . "'
					,'G'
					,'P'
					,'" . date('Y-m-d') . "'
					,'" . $con_nombre . "'
					," . $_SESSION['emp_ideregistro'] . "
					," . $d[7] . "
					," . $this->obtenerPeriodo($d[7]) . "
					,'lec_lectura'
					,NULL
					," . date('Y') . ") RETURNING nov_ideregistro";
				$nov_ideregistro=$this->ejecuta_db($nov_cons)[0];
				}
			
			foreach($lecs as $l){				
				$dlec="select dlec_ideregistr,dlec_consumo from dlec_detlectura where lec_ideregistro=" . $l[0] . "limit 1";
				$dlec=$this->consulta_db($dlec);
				$dnov_cons="insert into dnov_detnovedad
								(dnov_estado
								,dnov_cantidad
								,dnov_vlrunitari
								,dnov_vlrtotal
								,dnov_ideorigen
								,nov_ideregistro
								,emp_ideregistro
								,dsus_ideregistr
								,uni_liquidacion
								,uni_concepto
								,tor_nomtabla
								,dtor_nomcampo
								,cic_ideregistro
								,per_ideregistro
								,per_ano)
							values
								('G'
								,'" . $dlec[0][1] . "'
								,1
								,'" . $dlec[0][1] . "'
								,'" . $dlec[0][0] . "'
								,'" . $nov_ideregistro . "'
								,'" . $_SESSION['emp_ideregistro'] . "'
								,'" . $d[2] . "'
								,'" . $d[6] . "'
								,34
								,'dlec_detlectura'
								,'dlec_consumo'
								,'" . $d[7] . "'
								,'" . $this->obtenerPeriodo($d[7]) . "'
								,'" . date('Y') . "')";
				if(@$this->ejecuta_db($dnov_cons)){
					echo "Aqui se cambia el estado de la lectura, y se ha registrado la novedad.";
					return true;
					}							
				}
			}			
			echo "El proceso no generó ninguna novedad.";
			return false;
		}
	private function obtenerPeriodo($cic_ideregistro){
		$per_con="select per.per_ideregistro from per_periodo per where per.cic_ideregistro=$cic_ideregistro and per.per_estado='A' limit 1";
		$per_ideregistro=$this->consulta_db($per_con)[0][0];
		return $per_ideregistro;
		}
	private function cargarParams($a){
		$vars=array();
		$lin=explode(',',$a);
		$k=0;
		foreach($lin as $l){
			$varia=explode(':',$l);
			$vars[$varia[0]]=$varia[1];
			}
		$this->uni_tipsuscripc=$vars['uni_tipsuscripc'];
		$this->cic_ideregistro=$vars['cic_ideregistro'];
		$this->per_ideregistro=$vars['per_ideregistro'];
		}
	}

function fn_lec_actual($argumentos){
	//la cadena de argumentos tiene el formato campo1:valor1,campo2:valor2. campo1 hace referencia al nombre de la columna de la base de datos y su respectivo valor en cada caso	
	$fn=new lec_actual($argumentos);
	$dsus=$fn->cargarSuscripcion();
	$nov=$fn->generarNovedad($dsus);
	}
?>