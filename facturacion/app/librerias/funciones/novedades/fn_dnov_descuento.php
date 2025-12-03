<?php

class dnov_descuento extends database{	
	function __construct($a){
		$this->conecta_db();
		}
	public function procesar(){
		return 0.05;
		}
	}

function fn_dnov_descuento(){
	//la cadena de argumentos tiene el formato campo1:valor1,campo2:valor2. campo1 hace referencia al nombre de la columna de la base de datos y su respectivo valor en cada caso	
	$fn=new dnov_descuento();
	return $fn->procesar();
	}
?>