<?php

require_once "db.class.php";

class m_facturacion_registr_define_liquidacion_liquidacion extends database {

	public function guardar($post){
		$campos='"';
        $valores="'";
        $consulta="";
        foreach($post as $campo=>$valor){
            switch ($campo){
                case "accion":
                case "navac":
                case "est_concepto":
                case "con_tipcalculo":
               
                 $campo=$valor="";
                    break;
                default:                    
                    break;
                }
             if (strlen($campo)>0 && $valor!=''){
                $campos.=$campo . '","';
                $valores.=$valor . "','";
                }
            }
        $campos=substr($campos,0,-2);
        $valores=substr($valores,0,-2);
        $consulta="insert into coli_conliquida (uni_liquidacion,uni_concepto,coli_imprimir) values ('" . $post['uni_liquidacion'] . "','" . $post['uni_concepto'] . "','" . $post['coli_imprimir'] . "')";
        ///*echo $consulta*/;
		$this->conecta_db();
		$respuesta=@$this->ejecuta_db($consulta) ? $this->consultaToCadena($respuesta) : print('Error');
		$this->cierra_db();
		echo "Guardado";

		}
	
	public function editar(){
		
		}
	
	public function eliminar($post){
		$consulta='delete from coli_conliquida where coli_ideregistr=' . $post['coli_ideregistr'];
		$this->conecta_db();
		$this->ejecuta_db($consulta);
		$this->cierra_db();
		}
	public function consultar($post){
		$consulta='';
		switch ($post["accion_m"]){
			case 'concepto_prin':
				$consulta='select uni_concepto,est_concepto,con_nombre,con_formula,con_tipcalculo from con_concepto where uni_concepto=\'' . $post['uni_concepto'] . "'";
				break;
			case 'concepto_liquidacion':
				$consulta="select coli.coli_ideregistr,con.con_nombre,coli.coli_imprimir
							from coli_conliquida coli
							inner join con_concepto con on coli.uni_concepto=con.uni_concepto
							where coli.uni_liquidacion=" . $post['uni_liquidacion'] . "
							";
				break;
			case 'liq_liquidacion':
				$consulta="select uni_documento
								,uni_tipdocument
								,liq_inivigencia::timestamp::date
								,liq_finvigencia::timestamp::date
								,liq_venclasific
								,liq_estado
								,liq_historico
							from liq_liquidacion where uni_liquidacion=" . $post['uni_liquidacion'];
				break;
			case 'ideconcliq':
				$consulta="select coli_ideregistr from coli_conliquida 
								where uni_concepto='" . $post["uni_concepto"] . "'
								and uni_liquidacion='" . $post["uni_liquidacion"] . "'
								";
				break;
				
			}
	
		$this->conecta_db();
		$respuesta=$this->consulta_db($consulta);
		$this->cierra_db();
		count($respuesta[0])>0 ? $this->consultaToCadena($respuesta) : print('sinDatos');	
		}
	
	public function navegar($post){
		$consulta="select nov_ideregistro,nov_fecgenerac::timestamp::date,nov_estado,nov_genera,nov_fecprocesad::timestamp::date,nov_observacion,emp_ideregistro,cic_ideregistro,per_ideregistro,tor_nomtabla,nov_fecaprovac,per_ano from nov_novedad";
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