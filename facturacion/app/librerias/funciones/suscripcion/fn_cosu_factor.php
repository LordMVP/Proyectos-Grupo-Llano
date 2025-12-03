<?php

class cosu_factor extends database{	
	function __construct(){
		$this->conecta_db();
		}
	public function procesar(){
		return 152;
		}
	}

function fn_cosu_factor(){
	//la cadena de argumentos tiene el formato campo1:valor1,campo2:valor2. campo1 hace referencia al nombre de la columna de la base de datos y su respectivo valor en cada caso	
	$fn=new cosu_factor();
	return $fn->procesar();
	}
?>