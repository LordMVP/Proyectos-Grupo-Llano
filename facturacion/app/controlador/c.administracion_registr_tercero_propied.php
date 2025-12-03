<?php
require 'controlador.php';
require '../modelo/m.administracion_registr_tercero_propied.php';

class c_administracion_registr_tercero_propied extends Controlador{
	private $obmod;
    function __construct($a,$p){
    	
    	$this->obmod=new m_administracion_registr_tercero_propied();
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
			case 'verificar_numcatastral':
				$this->obmod->verificarNumeroCatastral($p);
				break;
			case 'verificar_numcatastralnacional':
				$this->obmod->verificarNumeroCatastralNacional($p);
				break;
			default:
				print_r($p);
				echo "[$a] Accion no reconocida. Consulte al proveedor";
				break;
			}
		}
	}
$cc=new c_administracion_registr_tercero_propied($_POST["accion"],$_POST);

?>