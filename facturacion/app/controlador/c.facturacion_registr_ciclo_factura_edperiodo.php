<?php
require 'controlador.php';
require '../modelo/m.facturacion_registr_ciclo_factura_edperiodo.php';
// echo "controlador" . print_r($_POST);
class c_facturacion_registr_ciclo_factura_edperiodo extends Controlador{
	private $obmod;
    function __construct($a,$p){
    	
    	$this->obmod=new m_facturacion_registr_ciclo_factura_edperiodo();
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
$cc=new c_facturacion_registr_ciclo_factura_edperiodo($_POST["accion"],$_POST);

?>