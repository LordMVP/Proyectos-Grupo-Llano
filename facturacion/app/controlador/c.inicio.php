<?php
require 'controlador.php';
require '../modelo/m.inicio.php';

class c_inicio extends Controlador{
	private $obmod;
    function __construct($a,$p){
    	
    	$this->obmod=new m_inicio();
    	$this->enviar($a,$p);
		}
	
	private function enviar($a,$p){
		switch($a){
			case 'i':
				$this->obmod->iniciarSesion($p);
				break;
			
			default:
				print_r($p);
				echo "[$a] Accion no reconocida. Consulte al proveedor";
				break;
			}
		}
	}
$cc=new c_inicio($_POST["accion"],$_POST);

?>