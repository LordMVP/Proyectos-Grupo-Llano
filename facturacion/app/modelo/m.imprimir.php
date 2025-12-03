<?php

require_once "db.class.php";

class m_imprimir extends database {
	public function imprimir($post){
		$conts=$post['contenido'];
		$maestra_impresion=file_get_contents('../vista/default/modulo/v.imprimir.php');
		$maestra_impresion=preg_replace('/\#IMPRESION\#/ms',$conts,$maestra_impresion);
		//echo $maestra_impresion;
		$mipdf = new DOMPDF();
		$mipdf ->set_paper("letter", "portrait");
		$mipdf ->load_html($maestra_impresion);
		$mipdf ->render();
		$mipdf ->stream(date("YmdHis") . '.pdf');

		return true;		
		}
	}		      
?>