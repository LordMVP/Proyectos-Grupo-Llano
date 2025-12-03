<?php
require 'controlador.php';
require '../modelo/m.ap.unidad.php';

class c_ap_arbol extends Controlador{
	private $obmod;
    function __construct($p){    	
    	$this->obmod=new m_ap_arbol($p);
    	switch($p['unidAccion']){
			case 'e':
				$this->enviar($p);
				break;
			case 's':
				$this->seleccionar($p['seleccionados'],$p['est']);
				break;
			case 'a':
				$this->obmod->cargarArbol($p['estructura']);
				break;
			case 'r':
				$this->obmod->refrescar($p['uni_ideregistro']);
			}    	
		}
	
	private function enviar(){	
		$this->obmod->tipTerceroCargar();			
		}
	private function seleccionar($p,$est){
		$this->obmod->tipTerceroSeleccionar($p,$est);
		}
	}
$cc=new c_ap_arbol($_POST);
?>