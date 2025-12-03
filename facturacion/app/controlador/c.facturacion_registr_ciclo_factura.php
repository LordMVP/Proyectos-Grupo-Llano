<?php
require 'controlador.php';
require '../modelo/m.facturacion_registr_ciclo_factura.php';

class c_facturacion_registr_ciclo_factura extends Controlador{
	private $obmod;
    function __construct($a,$p){
    	
    	$this->obmod=new m_facturacion_registr_ciclo_factura();
    	$this->enviar($a,$p);
		}
	
	private function enviar($a,$p){
		switch($a){
			case 's':
				$this->obmod->guardar($p);
				break;
			case 'e':
				$this->obmod->editar($p);
				break;
			case 'x':
				$this->obmod->borrar($p);
				break;
			case 'n':
				$this->obmod->navegar($p);
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
$cc=new c_facturacion_registr_ciclo_factura($_POST["accion"],$_POST);

?>