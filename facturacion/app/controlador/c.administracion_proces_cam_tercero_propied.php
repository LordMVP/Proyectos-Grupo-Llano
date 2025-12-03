<?php
require 'controlador.php';
require '../modelo/m.administracion_proces_cam_tercero_propied.php';

class c_administracion_proces_cam_tercero_propied extends Controlador{
	private $obmod;
    function __construct($a,$p){
    	
    	$this->obmod=new m_administracion_proces_cam_tercero_propied();
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
			case 'v':
				$this->obmod->validar($p);
				break;
			case 't':
				$this->obmod->trasladar($p);
				break;
			default:
				echo "[$a] Accion no reconocida. Consulte al proveedor";
				break;
			}
		}
	}
$cc=new c_administracion_proces_cam_tercero_propied($_POST["accion"],$_POST);

?>