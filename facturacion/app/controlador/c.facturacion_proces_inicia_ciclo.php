<?php
require 'controlador.php';
require '../modelo/m.facturacion_proces_inicia_ciclo.php';

class c_facturacion_proces_inicia_ciclo extends Controlador{
	private $obmod;
    function __construct($a,$p){
    	
    	$this->obmod=new m_facturacion_proces_inicia_ciclo();
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
$cc=new c_facturacion_proces_inicia_ciclo($_POST["accion"],$_POST);
?>