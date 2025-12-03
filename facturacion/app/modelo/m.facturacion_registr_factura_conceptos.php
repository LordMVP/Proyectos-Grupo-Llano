<?php

require_once "db.class.php";

class m_facturacion_registr_factura_conceptos extends database {

	public function guardar($post){
		$campos='"';
        $valores="'";
        $consulta="";
        foreach($post as $campo=>$valor){
            switch ($campo){
				case "form_consulta":           
                case "accion":
                case "navac":
                case "cic_ideregistro":
                case "Conceptos_ide":
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
        		
		$consulta="insert into con_concepto (" . $campos . ") values (" . $valores . ")";
        /*echo $consulta*/;
		$this->conecta_db();
		$this->ejecuta_db($consulta);
		$this->cierra_db();			
		return true;
      
		}
	
	public function editar(){
		
		}
	
	public function eliminar($post){
		$this->conecta_db();
		$consulta="delete from con_concepto where uni_concepto=" . $post['uni_concepto'];		
		if (!@$this->ejecuta_db($consulta)){
			$consulta="update con_concepto set con_estado='E' where uni_concepto=" . $post['uni_concepto'];
			$this->ejecuta_db($consulta);
			}
		$this->cierra_db();		
		}
	public function consultar($post){
		//print_r ($post);
		$consulta='';
		switch ($post["accion_m"]){
			case 'fac_factura':
				$consulta='select fac_ideregistro,fac_estado,emp_ideRegistro,fac_numero,uni_documento,fac_fecha::timestamp::date,cic_ideRegistro,per_ideRegistro,uni_tipDocument,sus_ideRegistro,fac_ideOrigen,fac_ideActual,ter_nomcompleto,tsu_nombre FROM fac_factura INNER JOIN ter_tercero ON ter_tercero.ter_ideregistro=fac_factura.ter_ideregistro INNER JOIN tsu_tipsuscripc ON tsu_tipsuscripc.uni_tipsuscripc=fac_factura.uni_tipsuscripc';
				break;
			
			case 'tabla':
				$consulta="select dfac_ideregistr,dfac_estado,dfac_cantidad::decimal(12,0) ,
                                    (case (con_metajuste) 
                                        when 'R' then dfac_vlrtotal :: decimal(12,2)
                                         else    dfac_vlrtotal 
                                    end) as valortotal ,
                                    dfac_vlrreal :: decimal(12,2),
                                    con_concepto.con_nombre 
                                 from dfac_detfactura 
                                   inner join con_concepto on con_concepto.uni_concepto=dfac_detfactura.uni_concepto 
                                 where 
                                   fac_ideregistro=" . $post['idbuscado'] ."  order by dfac_vlrtotal DESC";
				break;
			}
		$this->conecta_db();
		if($respuesta=@$this->consulta_db($consulta))
			count($respuesta[0])>0 ? $this->consultaToCadena($respuesta) : print('sinDatos');
		$this->cierra_db();	
		}
	public function navegar($post){
		
		}
	
	
	}
	      
?>