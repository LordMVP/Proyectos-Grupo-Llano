<?php

require_once "db.class.php";

class m_facturacion_registr_define_liquidacion_relconceptos extends database {

	public function guardar($post){
		$consulta='';		
		$conceptos=explode('|_|',$post['conceptos']);
		foreach($conceptos as $c){
			$linea=explode(',',$c);
			$consulta.="insert into core_conrelacio(uni_concepto,uni_conrelacion,tor_nomtabla,dtor_nomcampo,uni_documento,uni_tipdocument,core_tipacumula,core_canacumula,uni_liquidacion) values (";
			$consulta.=$post['uni_concepto'] . ',';
			$consulta.=$linea[0] . ',';
			$consulta.="'" . $linea[1] . "',";
			$consulta.="'" . $linea[2] . "',";
			$linea[3]!='' ? $consulta.="'" . $linea[3] . "'," : $consulta.="NULL,";
			$linea[4]!='' ? $consulta.="'" . $linea[4] . "'," : $consulta.="NULL,";
			$consulta.="'" . $linea[5] . "',";
			$consulta.="'" . $linea[6] . "',";
			$linea[7]!='' ? $consulta.="'" . $linea[7] . "');" : $consulta.="NULL);";
			
			}
		$consulta.="update con_concepto set con_formula='" . $post['con_formula'] . "' where uni_concepto=" . $post['uni_concepto'] . ';';
        /*echo $consulta*/;
		$this->conecta_db();
		$respuesta=@$this->ejecuta_db($consulta) ? $this->consultaToCadena($respuesta) : print('Error');
		$this->cierra_db();
		}
	
	public function editar(){
		
		}
	
	public function eliminar(){
		
		}
	public function consultar($post){
		//print_r ($post);
		$consulta='';
		switch ($post["accion_m"]){
			case 'concepto_prin':
				$consulta='select uni_concepto,est_concepto,con_nombre,con_formula,con_tipcalculo from con_concepto where uni_concepto=\'' . $post['uni_concepto'] . "'";
				break;
			case 'concepto_disponible':
				$consulta="select con.uni_concepto,con.con_nombre,con.con_alias,con.con_valor,con.con_formula from con_concepto con where con.uni_concepto<>" . $post['uni_concepto'];
				break;
			case 'concepto_alias':
				$consulta='select con_alias from con_concepto where uni_concepto=' . $post['uni_concepto'];
				break;
			case 'concepto_relacionado':
				$consulta="select core.uni_conrelacion,con.con_nombre, con.con_alias, core.core_tipacumula, core.core_canacumula, core.tor_nomtabla, core.uni_tipdocument
							from core_conrelacio core
							inner join con_concepto con on core.uni_conrelacion=con.uni_concepto
							where core.uni_concepto=" . $post['uni_concepto'];
				break;
			}
		///*echo $consulta*/;
		$this->conecta_db();
		$respuesta=$this->consulta_db($consulta);
		$this->cierra_db();
		//print_r($respuesta);
		count($respuesta[0])>0 ? $this->consultaToCadena($respuesta) : print('sinDatos');	
		}
	public function navegar($post){
		$consulta="";
		//echo $post["idreg"];
		switch($post["navac"]){
			case "f":
				$consulta.= " order by \"nov_ideregistro\"";				
				break;
			case "p":
				if ($post["idreg"]=="")
					$consulta.= " order by \"nov_ideregistro\" desc limit 1";
				else
					$consulta.= " where \"nov_ideregistro\" < " . $post["idreg"] . " order by \"nov_ideregistro\" limit 1";
				break;
			case "n":
				if ($post["idreg"]=="")
					$consulta.= " order by \"nov_ideregistro\"";
				else
					$consulta.= " where \"nov_ideregistro\" > " . $post["idreg"] . " order by \"nov_ideregistro\" limit 1";
				break;
			case "l":
				$consulta.= " order by \"nov_ideregistro\" desc limit 1";
				break;
			}
		$this->conecta_db();
		$respuesta=$this->consulta_db($consulta);
		$this->cierra_db();
		$linea="";
		$this->consultaToCadena($respuesta);
		}
	
	
	}

?>