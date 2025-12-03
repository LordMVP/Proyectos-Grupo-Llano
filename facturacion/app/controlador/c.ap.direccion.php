<?php
require 'controlador.php';
require '../modelo/m.ap.direccion.php';

class c_ap_direccion extends Controlador{
	private $obmod;
    function __construct($a,$p){    	
    	$this->obmod=new m_ap_direccion();
    	$this->enviar($a,$p);
		}
	
	private function enviar($a,$p){	
		switch($a){
			case 'n':
				$this->obmod->cargarNomenclatura($p);				
				break;		
			}
		}
	}
$cc=new c_ap_direccion($_POST["accion"],$_POST);
?>