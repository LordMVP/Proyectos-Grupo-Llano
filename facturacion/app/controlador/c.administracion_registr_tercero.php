<?php
require 'controlador.php';
require '../modelo/m.administracion_registr_tercero.php';

class c_administracion_registr_tercero extends Controlador{
	private $obmod;
    function __construct($a,$p){
    	
    	$this->obmod=new m_administracion_registr_tercero();
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
			case 'clte':
				$this->obmod->relacionarClaseTercero($p);
				break;
			case 'ciudadAutoComplete':
				$this->obmod->ciudadAutoComplete($p);
				break;
			default:
				print_r($p);
				echo "[$a] Accion no reconocida. Consulte al proveedor";
				break;
			}
		}
	}
$cc=new c_administracion_registr_tercero($_POST["accion"],$_POST);

?>