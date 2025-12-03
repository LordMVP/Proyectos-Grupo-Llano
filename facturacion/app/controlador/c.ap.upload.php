<?php
require 'controlador.php';
require '../modelo/m.ap.upload.php';

class c_ap_upload extends Controlador{
	private $obmod;
    function __construct($a,$p,$f){    	
    	$this->obmod=new m_ap_upload();
    	$this->enviar($a,$p,$f);
		}
	
	private function enviar($a,$p,$f){	
		switch($a){
			case 'c':
				$d='../../' . $p['destino'];
				$this->obmod->cargarArchivo($p,$f,$d);				
				break;			
			default:
				echo "[$a] Accion no reconocida. Consulte al proveedor";
				break;
			}
		}
	}
$cc=new c_ap_upload($_POST["accion"],$_POST,$_FILES);
?>