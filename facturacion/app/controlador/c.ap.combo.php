<?php
require 'controlador.php';
require '../modelo/m.ap.combo.php';

class c_ap_combo extends Controlador{
	private $obmod;
    function __construct($a,$p){    	
    	$this->obmod=new m_ap_combo();
    	$this->enviar($a,$p);
		}
	
	private function enviar($a,$p){
		switch($a){
			case 'uni_tipTercero':
				$this->obmod->tipTerceroCargar($p);				
				break;
			case 'rango':
				$this->obmod->crearRango($p);
				break;
			case 'periodicidad':
				$this->obmod->crearPeriodicidad();
				break;
			case 'estado':
				$this->obmod->crearEstado($p);
				break;
			case 'valorformula':
				$this->obmod->crearValorFormula();
				break;
			case 'efecto':
				$this->obmod->crearEfecto();
				break;
			case 'sino':
				$this->obmod->crearSiNo();
				break;
			case 'operacion':
				$this->obmod->crearOperacion();
				break;
			case 'tor_nomtabla':
				$this->obmod->tor_nomtabla($p);
				break;
			case 'dtor_dettaborig':
				$this->obmod->dtor_dettaborig($p);
				break;
			case 'funcion':
				$this->obmod->fun_funcion($p);
				break;
			case 'funcion_concepto':
				$this->obmod->funcionConcepto();
				break;			
			case 'proyecto':
				$this->obmod->proyecto($p);
				break;
			case 'barrio':
				$this->obmod->barrio($p);
				break;
			case 'inf_informacion':
				$this->obmod->inf_informacion($p);
				break;
			case 'tip_tipifica':
				$this->obmod->tip_tipifica($p);
				break;
			case 'convenio':
				$this->obmod->cnre_cnvRecaudo();
				break;
			case 'ciclo':
				$this->obmod->cic_ciclo($p);
				break;
			case 'periodo':
				$this->obmod->per_periodo($p);
				break;
			case 'actividad':
				$this->obmod->dper_detperiodo($p);
				break;
			case 'programa':
				$this->obmod->prg_programa($p);
				break;
			case 'tipacumula':
				$this->obmod->core_tipacumula($p);
				break;
			case 'tipo_suscripcion':
				$this->obmod->tsu_tipsuscripc($p);
				break;
			case 'liquidacion':
				$this->obmod->liq_liquidacion($p);
				break;
			case 'concepto':
				$this->obmod->con_concepto($p);				
				break;
			case 'liquidacion':
				$this->obmod->liq_liquidacion($p);				
				break;
			case 'debcre':
				$this->obmod->crearDebCre();
				break;
			case 'documento':
				$this->obmod->doc_documento($p);	
				break;
			case 'tipo_documento':
				$this->obmod->doti_doctipo($p);				
				break;
			case 'dettipifica':
				$this->obmod->dtip_dettipific($p);
				break;
			case 'sector':
				$this->obmod->muba_munbarrio($p);
				break;
			case 'venclasific':				
				$this->obmod->venClasific($p);
				break;
			case 'zonaprop':
				$this->obmod->zona();
				break;
			case 'selSuscriptorTercero':
				$this->obmod->sus_suscripcion($p);
				break;
			case 'complementodireccion':
				$this->obmod->complementoDireccion($p);
				break;
            case 'cerraractividad':
				$this->obmod->cerraractividad($p);
				break;
            case 'eliminaractividad':
				$this->obmod->eliminaractividad($p);
				break;
            case 'anosciclos';
				$this->obmod->anosciclos($p);
				break;
			default:
				echo "[$a] Accion no reconocida. Consulte al proveedor";
				break;
			}
		}
	}
$cc=new c_ap_combo($_POST["accion"],$_POST);
?>