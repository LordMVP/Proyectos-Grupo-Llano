<?php

class dsus_estrato extends database{	
	function __construct(){
		$this->conecta_db();
		}
	public function procesar(){
		return 4;
		}
	}

function fn_dsus_estrato(){
	//la cadena de argumentos tiene el formato campo1:valor1,campo2:valor2. campo1 hace referencia al nombre de la columna de la base de datos y su respectivo valor en cada caso	
	$fn=new dsus_estrato();
	return $fn->procesar();
	}
?>