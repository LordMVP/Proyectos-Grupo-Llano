<?php
require_once "db.class.php";
class m_ap_umbusqueda extends database {
	function __construct(){}
	private function imprimirStringSplit($jArray){
		$imprimir_registro='';
		$IR=0;
		foreach($jArray as $r){
			foreach ($r as $r_sub){
				$imprimir_registro.=$r_sub . "@-@";
				}/*define campo=>valor*/
			$imprimir_registro=substr($imprimir_registro,0,-3);
			$imprimir_registro.="@__@";/*define el combo*/
			$IR++;
			}
		$imprimir_registro=substr($imprimir_registro,0,-4);
		return $imprimir_registro;
		}	
	//-------------------------------------------------metodos de campos de busqueda
	public function nombreAutoComplete($post){
		$this->conecta_db();
		$nombusca=explode(' ',$post['ternombrebusca']);
		$nb=$na='';
		$i=$rok=0;
		foreach($nombusca as $n){
			$nb.=" $n ";$nb=trim($nb);					
			$jwhere=" UPPER(ter_nomcompleto) like UPPER('%$nb%') ";
			$consulta="select ter_nomcompleto from ter_tercero where $jwhere";
			if (!count($this->consulta_db($consulta))){
				$nb='';
				for($q=0;$q<=$rok;$q++){
					$nb.=" " . $nombusca[$q] . " ";
					$nb=trim($nb);
					}
				$na.=" $n ";$na=trim($na);
				$jwhere="ter_nombre ilike '%$nb%' and ter_apellido ilike '%$na%'";
				}
			else{$rok=$i;}
			$consulta="select ter_documento,ter_nombre || ' ' || ter_apellido from ter_tercero where $jwhere order by ter_nombre,ter_apellido,ter_documento limit 5";				
			$i++;
			}
		$this->conecta_db();		
		if($respuesta=@$this->consulta_db($consulta)){
			$this->consultaToCadena($respuesta);
			}
		else{
			print('sinDatos');
			}
		$this->cierra_db();
		}
	}

?>