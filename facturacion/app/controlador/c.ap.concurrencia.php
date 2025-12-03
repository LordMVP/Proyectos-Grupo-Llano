<?php
require 'controlador.php';
require '../modelo/m.ap.concurrencia.php';

class c_ap_concurrencia extends Controlador{
	private $obmod;
    function __construct($a,$p){    	
    	$this->obmod=new m_ap_concurrencia();
    	$this->enviar($a,$p);
		}
	
	private function enviar($a,$p){	
		$a=trim(base64_decode($a));
		switch($a){
			case 'c':
				$this->obmod->bloquearRegistro($p);
				break;
			case 'p':
				
				break;
			case 'cx':
				$this->obmod->liberarRegistro($p);
				break;
			case 'px':
				
				break;			
			default:
				echo "[$a] Accion no reconocida. Consulte al proveedor";
				break;
			}
		}
	}
$cc=new c_ap_concurrencia($_POST["accion"],$_POST);
?>