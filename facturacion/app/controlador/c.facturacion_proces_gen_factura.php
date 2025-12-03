<?php
require 'controlador.php';
require '../modelo/m.facturacion_proces_gen_factura.php';

class c_facturacion_proces_gen_factura extends Controlador{
	private $obmod;
    function __construct($a,$p){
    	
    	$this->obmod=new m_facturacion_proces_gen_factura();
    	$this->enviar($a,$p);
		}
	
	private function enviar($a,$p){
		switch($a){
			case 'g':
				$this->obmod->generar($p);
				break;
			case 'a':
				$this->obmod->aprobar($p);
				break;
			case 'c':
				$this->obmod->consultar($p);
				break;
			default:
				echo "[$a] Accion no reconocida. Consulte al proveedor";
				break;
			}
		}
	}
$cc=new c_facturacion_proces_gen_factura($_POST["accion"],$_POST);
?>