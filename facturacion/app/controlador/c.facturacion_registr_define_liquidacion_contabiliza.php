<?php
require 'controlador.php';
require '../modelo/m.facturacion_registr_define_liquidacion_contabiliza.php';

class c_facturacion_registr_define_liquidacion_contabiliza extends Controlador{
	private $obmod;
    function __construct($a,$p){
    	
    	$this->obmod=new m_facturacion_registr_define_liquidacion_contabiliza();
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
				print_r($p);
				echo "[$a] Accion no reconocida. Consulte al proveedor";
				break;
			}
		}
	}
$cc=new c_facturacion_registr_define_liquidacion_contabiliza($_POST["accion"],$_POST);

?>