<?php
require_once "db.class.php";

class m_ap_direccion extends database {

	function __construct(){}
	//-------------------------------------------------metodos de campos de busqueda
	public function cargarNomenclatura($post){
		$palabra=$post['busca'];
		$consulta='select nom."nom_abreviatura"
						,nom."nom_nombre"
					from "nom_nomenclatu" nom
					inner join "dnom_detnomencl" dnom on dnom."nom_ideregistro"=nom."nom_ideregistro"
					where dnom."dnom_sinonimo" ilike \'' . $palabra . '%\' 
					or nom.nom_nombre ilike \'' . $palabra . '%\'
					group by nom."nom_abreviatura",nom."nom_nombre"';
		$this->conecta_db();
		$respuesta=$this->consulta_db($consulta);
		$this->cierra_db();	
		count($respuesta)>0 ? $this->consultaToCadena($respuesta) : print('sinDatos');
		}	
	}
?>