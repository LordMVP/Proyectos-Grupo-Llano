<?php
require 'controlador.php';
require '../modelo/m.facturacion_registr_ciclo_factura_agenda.php';

class c_facturacion_registr_ciclo_factura_agenda extends Controlador{
	private $obmod;
    function __construct($a,$p){
    	
    	$this->obmod=new m_facturacion_registr_ciclo_factura_agenda();
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
				$this->obmod->eliminar($p);
				break;
			case 'n':
				$this->obmod->navegar($p);
				break;
			case 'c':
				$this->obmod->consultar($p);
				break;
			case 'd':
				$this->obmod->dependientes($p);
				break;			
			case 'u':
				$this->obmod->update($p);
				break;			
			default:
				echo "[$a] Accion no reconocida. Consulte al proveedor";
				break;
			}
		}
	}
$cc=new c_facturacion_registr_ciclo_factura_agenda($_POST["accion"],$_POST);

?>