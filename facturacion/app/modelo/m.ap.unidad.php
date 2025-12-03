<?php
require_once "db.class.php";
class m_ap_arbol extends database {
	private $post;
	function __construct($post){
		$this->post=$post;
		}
	private $nivelesBd=5;
	private function imprimirStringSplit($jArray){
		$imprimir_registro='';
		$IR=0;
		foreach($jArray as $r){
			foreach ($r as $r_sub){
				$imprimir_registro.=$r_sub . "@-@";
				}
			$imprimir_registro=substr($imprimir_registro,0,-3);
			$imprimir_registro.="@__@";
			$IR++;
			}
		$imprimir_registro=substr($imprimir_registro,0,-4);
		return $imprimir_registro;
		}	
	//-------------------------------------------------metodos de campos de busqueda
	public function tipTerceroCargar(){
		$imprimir_registro="";
		//echo "Niveles[" . $this->post['niveles'] . "]";
		$valores=array();
		if (trim($this->post['niveles'])!=''){
			$valores=explode(";",trim($this->post['niveles']));
			}
		$this->conecta_db();
		for($k=1;$k<=$this->nivelesBd;$k++){
			$jwhere='';
			if($k>1) $jwhere='and "uni_codigo' . ($k-1) . '"=\'' . $valores[$k-2] . "'";

			$uni_unidad_q='select uni."uni_codigo' . $k . '",uni."uni_nombre' . $k . '" 
							from "uni_unidad" uni
							inner join esem_estempresa esem on esem.est_ideregistro=uni.est_ideregistro
							inner join est_estructura est on uni.est_ideregistro=est.est_ideregistro							
							where uni."uni_nivel"=' . $k . '
							and est.cla_ideregistro=' . $this->post['clase'] . '
							and esem.emp_ideregistro=' . $_SESSION['emp_ideregistro'] . '						
							' . $jwhere . '							
							';
			//echo $uni_unidad_q;
			$uni_unidad_r=$this->consulta_db($uni_unidad_q);
			$uni_unidad_dep=array();
			if (count($uni_unidad_r)>0){
				$imprimir_registro.=$this->imprimirStringSplit($uni_unidad_r) . '|__|';	
				}
			//echo "****************** k=$k ---- valcount=" . count($valores) . '<p>';
			if (($k-1)>=count($valores)) break;			
			}
		echo "||R||>" . substr($imprimir_registro,0,-4) . "<||R||"; 
		$this->cierra_db();	
	
		}
	
	public function tipTerceroSeleccionar($unidades,$estructura){		
		$unds=explode(";",$unidades);
		$undsq="where ";
		$i=1;
		foreach($unds as $u){
			$undsq.='uni."uni_codigo' . $i . '"=\'' . $u . '\' and ';
			$i++;
			}
		
		$undsq=substr($undsq,0, -4);		
		$consulta='select uni."uni_ideregistro",uni."uni_nombre' . ($i-1) . '" 
							from uni_unidad uni 
							inner join est_estructura est on uni.est_ideregistro=uni.est_ideregistro
							' . $undsq .' 							
							and est.cla_ideregistro=' . $estructura . '
							';
							
		//echo $consulta;
		$this->conecta_db();		
		$res=$this->consulta_db($consulta);
		$this->cierra_db();
		if (count($res)>0){
			echo $res[0][0] . ';' . $res[0][1];
			}		
		return true;
		}
	public function refrescar($u){
		$consulta ='select "uni_nombre1", "uni_nombre2" from "uni_unidad" where "uni_ideregistro"=' . $u;
		$this->conecta_db();
		$nombre=$this->consulta_db($consulta);
		$this->cierra_db();
		if($nombre[0][1]!=''){
			echo $nombre[0][1];
			}
		else{
			echo $nombre[0][0];
			}
		}
	public function cargarArbol($est){
		$imprimir_registro="";
		//en este caso el codigo de la estructura es 5			
		//extraccion de unidades de nivel 1
		$valores=explode(";",$this->post['niveles']);
		//print_r($valores);
		//$k=1;
		$valoresArbol=array();
		$this->conecta_db();
		for($k=1;$k<=$this->nivelesBd;$k++){
			$jwhere='';
			$i=$k;			
			if($k>1)
				$i=$i-1;			
								
			$uni_unidad_q='select "uni_ideregistro","uni_codigo' . $i. '","uni_nombre' . $k . '" 
							from "uni_unidad" 
							where "est_ideregistro"=' . $est . ' and "uni_nivel"=' . $k . '
							' . $jwhere . '							
							';
			//echo $uni_unidad_q;	
			$uni_unidad_r=$this->consulta_db($uni_unidad_q);
			$uni_unidad_dep=array();
			if (count($uni_unidad_r)>0){
				$imprimir_registro.=$this->imprimirStringSplit($uni_unidad_r) . '|__|<br>';
				array_push($valoresArbol,$uni_unidad_r);
				}
			}
		echo "<pre>";
		//echo substr($imprimir_registro,0,-4);
		$valoresRes=array();
		$k=0;
		foreach($valoresArbol as $va){
			$i=0;
			foreach($va as $v){
				array_push($valoresRes,$v);
				foreach ($valoresRes as $r){
					if ($v[1]==$r[1]){
						//array_splice($valoresRes,$k,0,$valoresArbol);
						}
					}
				//print_r($v);
				$i++;
				}
			$k++;
			}
		
		print_r($valoresRes);
		echo "</pre>";
		$this->cierra_db();	
		}
	}

?>