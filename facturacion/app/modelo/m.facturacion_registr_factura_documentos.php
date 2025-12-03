<?php

require_once "db.class.php";

class m_facturacion_registr_factura_documentos extends database {

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
				$consulta="select fac.fac_ideregistro
								,fac.fac_estado
								,fac.fac_fecaprobada
								,fac.dsus_ideregistr
								,cic.cic_nombre
								,per.per_nombre 
								,fac.fac_vlrreal
							from 
								fac_factura fac
							inner join cic_ciclo cic on fac.cic_ideregistro=cic.cic_ideregistro
							inner join per_periodo per on fac.per_ideregistro=per.per_ideregistro							
							where 
								fac.fac_idepadre=" . $post['idbuscado'];	
				
				break;
			case 'filtrar':
				$filtro='';
				if (isset($post['uni_liquidacion'])){
					$filtro.=' and fac.uni_liquidacion=' . $post['uni_liquidacion'];
					}
				if (isset($post['uni_documento'])){
					$filtro.=' and fac.uni_documento=' . $post['uni_documento'];
					}
				if (isset($post['uni_tipdocument'])){
					$filtro.=' and fac.uni_tipdocumen = ' . $post['uni_tipdocument'];
					}
				if (isset($post['uni_tipusosuscr'])){
					$filtro.=' and fac.uni_tipusosuscr=' . $post['uni_tipusosuscr'];
					}
				if (isset($post['cic_ideregistro'])){
					$filtro.=' and fac.cic_ideregistro=' . $post['cic_ideregistro'];
					}
				
				$consulta="select fac.fac_ideregistro
								,fac.fac_estado
								,fac.fac_fecaprobada
								,fac.dsus_ideregistr
								,cic.cic_nombre
								,per.per_nombre 
								,fac.fac_vlrreal
							from 
								fac_factura fac
							inner join cic_ciclo cic on fac.cic_ideregistro=cic.cic_ideregistro
							inner join per_periodo per on fac.per_ideregistro=per.per_ideregistro							
							where 
								fac.fac_idepadre=" . $post['idbuscado'] . $filtro;			
				break;
			}
		$this->conecta_db();
		if(@$respuesta=$this->consulta_db($consulta))
			count($respuesta[0])>0 ? $this->consultaToCadena($respuesta) : print('sinDatos');
		$this->cierra_db();	
		}
	public function navegar($post){
		
		}
	
	
	}
	      
?>