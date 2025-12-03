<?php

namespace Bioagricola\BioagricolaBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Bioagricola\BioagricolaBundle\Delegado\ConsultarFinanciacionDelegado;
use Llanogas\LlanogasBundle\MyException;

/**
 * Hace la actualizacion de los cambios de valor que no se han aplicado, 
 * se debe ejecutar antes de descargar los cambios de valor para DataEase
 */
class ConsultarFinanciacionController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $idUsuario = $sesion->get('idusuario');
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');  
        $response = $this->render('BioagricolaBioagricolaBundle:Financiacion:consultarFinan.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }
   
    /**
     * Consulta el resultado del proceso 
     * @return array - Lista los segmentos con la cantidad de financiaciones cargadas
     */
    public function buscarDatosAction() {
        Util::validarPeticion($this);
        $sesion = Util::iniciarSesion($this);
        $request = $this->getRequest();
        $codUsuario = $request->get('CodUsuario');
        $idFinan = $request->get('IdFinanciacion');
        $consulta_Delegado = new ConsultarFinanciacionDelegado($this, $sesion);        
        if (empty($codUsuario) and empty($idFinan)) {
            $resultado = $consulta_Delegado->consultarResumenFinanciaciones();
            $resultado['pagos'] = $consulta_Delegado->consultarResumenPagos();                
            $resultado['amortizaciones'] = $consulta_Delegado->consultarResumenAmortizaciones();
            $resultado['terceros'] = $consulta_Delegado->consultarResumenTercerosFinan();
            $resultado["codigoRespuesta"] = (empty($resultado['financiaciones'])) ? 0 : 2;
            $resultado["CodUsuario"] = " " ;
            $resultado["IdFinanciacion"] = " " ;
            $resultado["mensaje"] = "Se realizó la consulta correctamente " ;
            $resultado["mensaje"] .= (empty($resultado['financiaciones'])) ? ", No se Encontraron Resultados " : "" ;
        }
        Else
        {               
            $parametros['id_usuario'] = $codUsuario ; 
            $parametros['id_Finan'] = $idFinan ;             
            $resultado = $consulta_Delegado->consultarDatosCodUsuario( $parametros );
            if(count($resultado['financiaciones']) ==1 and empty($idFinan))
            {
                $idFinan = $resultado['financiaciones'][0]['id_fin'] ;
                $parametros['id_Finan'] = $idFinan  ;
            }
            if (empty($codUsuario) and count($resultado['financiaciones']) >=1)
            {
                $codUsuario = $resultado['financiaciones'][0]['mua_cod'] ;
            }
            if(!empty($idFinan))
            {
                $resultado['pagos'] = $consulta_Delegado->consultarPagosFinanciacion( $parametros );                
                $resultado['amortizaciones'] = $consulta_Delegado->consultarAmortFinanciacion( $parametros );
                $resultado['terceros'] = $consulta_Delegado->consultarTercerosFinanciacion( $parametros );
            }
            $resultado["codigoRespuesta"] = (empty($resultado['financiaciones'])) ? 0 : 1;
            $resultado["CodUsuario"] = $codUsuario ;
            $resultado["IdFinanciacion"] = $idFinan ;
            $resultado["mensaje"] = "Se realizó la consulta correctamente " ;
            $resultado["mensaje"] .= (empty($resultado['financiaciones'])) ? ", No se Encontraron Resultados " : "" ;
        }
        return Util::construyeRespuesta($resultado);
    }
}
