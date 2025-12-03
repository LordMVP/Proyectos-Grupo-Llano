<?php
require 'controlador.php';
require '../modelo/m.imprimir.php';
require_once '../librerias/dompdf/dompdf_config.inc.php';
class c_imprimir extends Controlador{
	private $obmod;
    function __construct($a,$p){
    	
    	$this->obmod=new m_imprimir();
    	$this->enviar($a,$p);
		}
	
	private function enviar($a,$p){
		switch($a){
			case 'i':
				$this->obmod->imprimir($p);
				break;
			
			default:
				print_r($p);
				echo "[$a] Accion no reconocida. Consulte al proveedor";
				break;
			}
		}
	}
$cc=new c_imprimir($_POST["accion"],$_POST);

?>