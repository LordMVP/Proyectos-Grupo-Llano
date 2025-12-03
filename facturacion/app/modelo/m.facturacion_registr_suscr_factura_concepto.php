<?php

require_once "db.class.php";

class m_facturacion_registr_suscr_factura_concepto extends database {

	public function guardar($post){
		$campos='';
        $valores="'";
        $consulta="";
        foreach($post as $campo=>$valor){
            switch ($campo){
				case "form_consulta":           
                case "accion":
                case "navac":
                case "conceptoDisponible_ide":
                    $campo=$valor="";
                    break;
                
                
                default:
                    
                    break;
                }
            if (strlen($campo)>0 && $valor!=''){
                $campos.=$campo . ',';
                $valores.=$valor . "','";
                }          
            }
        $campos=substr($campos,0,-1);
        $valores=substr($valores,0,-2);
        $consulta="insert into cosu_consuscrip (" . $campos . ",emp_ideregistro) values (" . $valores . "," . $_SESSION['emp_ideregistro'] . ")";
		$this->conecta_db();
		$respuesta=$this->ejecuta_db($consulta) ? $this->consultaToCadena($respuesta) : print('Error');
		$this->cierra_db();
		}
	
	public function editar(){
		
		}
	
	public function eliminar(){
		
		}
	public function consultar($post){
		$consulta='';
		switch ($post["accion_m"]){
			case 'suscripcion':
				$consulta="select dsus.sus_ideregistro,dsus.uni_liquidacion,liq.liq_nombre from dsus_detsuscrip dsus
							inner join liq_liquidacion liq on dsus.uni_liquidacion=liq.uni_liquidacion
							where dsus.dsus_ideregistr=" . $post['dsus_ideregistr'];
				break;
			
			case 'concepto_disponible':
				$consulta="select con.uni_concepto,con.con_nombre,con.con_alias,con.con_valor,con.con_tipregistro from con_concepto con inner join coli_conliquida coli on con.uni_concepto=coli.uni_concepto where con.con_tipcalculo='V' and coli.uni_liquidacion=" . $post['uni_liquidacion'] . " and con.prg_ideregistro=15";
				break;
			
			case 'concepto_relacion':
				$consulta="select cosu_ideregistr
							,cosu_vlrunitari
							,cosu_cantidad							
							,cosu_vlrtotal
							,cosu_fecinicio::timestamp::date
							,cosu_fecfinal::timestamp::date
							,cosu_estado
						from cosu_consuscrip where dsus_ideregistr=" . $post['dsus_ideregistr'];
				break;
		
			}
		///*echo $consulta*/;
		$this->conecta_db();
		$respuesta=$this->consulta_db($consulta);
		$this->cierra_db();
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