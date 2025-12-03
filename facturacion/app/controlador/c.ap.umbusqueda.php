<?php
require 'controlador.php';
require '../modelo/m.ap.umbusqueda.php';

class c_ap_umbusqueda extends Controlador{
	private $obmod;
    function __construct($a,$p){    	
    	$this->obmod=new m_ap_umbusqueda();
    	$this->enviar($a,$p);
		}
	
	private function enviar($a,$p){	
		switch($a){
			case 'nombreAutoComplete':
				$this->obmod->nombreAutoComplete($p);				
				break;			
			default:
				echo "[$a] Accion no reconocida. Consulte al proveedor";
				break;
			}
		}
	}
$cc=new c_ap_umbusqueda($_POST["accion"],$_POST);
?>