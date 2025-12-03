<?php

class dnov_consumo extends database{	
	function __construct(){
		$this->conecta_db();
		}
	public function procesar($a,$b){
		return $a * $b - $a;
		}
	}

function fn_dnov_consumo($a,$b){
	//la cadena de argumentos tiene el formato campo1:valor1,campo2:valor2. campo1 hace referencia al nombre de la columna de la base de datos y su respectivo valor en cada caso	
	$fn=new dnov_consumo();
	return $fn->procesar($a,$b);
	}
?>