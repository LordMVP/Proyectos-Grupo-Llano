<?php

require_once "db.class.php";

class m_facturacion_registr_define_liquidacion_contabiliza extends database {

	public function guardar($post){
		
		$campos='"';
        $valores="'";
        $consulta="";
        foreach($post as $campo=>$valor){
                //echo $campo;
            switch ($campo){
                case "accion":
                case "navac":
                case "codo_ideregistr":
                case "ndebcre":
                case "Cuentas_ide":                
                    $campo=$valor="";
                    break;
                case "ctasGraba":
                $campo1=substr($valor,1);	
        		$resp= explode(":",$campo1);   
	               		
                    $campo=$valor="";				                
                    break;				  
                default:
                    break;
                }
                
            if (strlen($campo)>0){
                $campos.=$campo . '","';
                $valores.=$valor . "','";
                }          
            }
        $campos=substr($campos,0,-2);
        $valores=substr($valores,0,-2);
        
		///*echo $consulta*/;
		$this->conecta_db();        

        for ($i=0; $i<count($resp); $i++) {
          		$melement= $resp[$i];
			    //echo $melement; 
   		        $resp1= explode(";",$melement); 
  		        //echo $resp1[4];  		         
	        //$consulta="insert into codo_condocumen (" . $campos . ",cue_idedebito,cue_tardebito,cue_idecredito,cue_tarcredito,codo_porcentaje) values (" . $valores . ",'5','5','6','5','100') RETURNING codo_ideregistr";
            $consulta="insert into codo_condocumen (" . $campos . ",cue_idedebito,cue_tardebito,cue_idecredito,cue_tarcredito,codo_porcentaje) values (" . $valores . "," . $resp1[0] . ",'" . $resp1[1] . "'," . $resp1[2] . ",'" . $resp1[3] . "','" . $resp1[4] . "') RETURNING codo_ideregistr";
            // /*echo $consulta*/;
			if($res=@$this->ejecuta_db($consulta)){
				echo "Operacion ejecutada con éxito!..";
				}
			else{
				print_r($res);
				echo "No se ha podido completar la accion, Verifique que todos los datos estén completos...";
				}
	        //echo "Count: ".count($array). " - Position: ".$i."<br>";
	        //OJOO FALTA EN CODOCOLI ErrorMessage: insert or update on table "codo_condocumen" violates foreign key constraint "fk_codocoli_conceptoliquidacion"


 	  		}			
			
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
				$consulta='select uni_concepto,est_concepto,con_nombre from con_concepto where uni_concepto=\'' . $post['uni_concepto'] . "'";
				break;
			case 'Cuentas':
				$consulta='select "cue_ideregistro","cue_ideregistro","cue_tarcodi","cue_codigo","cue_nombre" FROM "cue_cuenta" WHERE cue_tarcodi=\'5\''; 
				break;

			case 'tablaDoc':
				$consulta="select codo.codo_ideregistr
								,doc.doc_nombre
								,uni.uni_nombre1
								,codo.cue_idedebito
								,codo.cue_tardebito
								,codo.cue_idecredito
								,codo.cue_tarcredito
								,codo.codo_porcentaje
								,liq.liq_nombre
							from codo_condocumen codo
							inner join doc_documento doc on codo.uni_documento=doc.uni_documento
							inner join uni_unidad uni on codo.uni_tipdocument=uni.uni_ideregistro
							inner join liq_liquidacion liq on codo.uni_liquidacion = liq.uni_liquidacion where codo.uni_concepto='" . $post['uni_concepto'] . "'"; 
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