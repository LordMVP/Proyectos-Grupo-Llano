<?php

namespace Externo\FinanciacionesBundle\Controller;

use Exception;
use Externo\FinanciacionesBundle\Delegado\SeguridadDelegado;
use Externo\FinanciacionesBundle\HashException;
use Externo\FinanciacionesBundle\ValidacionExcepcion;
use Llanogas\LlanogasBundle\Utiles\Util;

/**
 * Description of SeguridadController
 *
 * @author god
 */
class SeguridadController extends GenericoController {

    /**
     * Agrega autenticación al usuario 
     * @return json Valida que el usuario sea correcto 
     */
    public function autenticarAction() {
        try {
            $seguridadDelegado = new SeguridadDelegado($this->conexion);
            $autenticado = $seguridadDelegado->autenticacion($this->parametros);
            return $this->construyeRespuesta($autenticado);
        } catch (HashException $ex) {
            return $this->construyeRespuestaValidacion($ex->getMensaje());
        } catch (ValidacionExcepcion $ex) {
            return $this->construyeRespuestaValidacion($ex->getDatos());
        } catch (\Exception $ex) {
            return $this->construyeRespuestaError($ex);
        }
    }

    /**
     * Consulta las empresas disponibles 
     * @return json Lista de empresas que pueden inciar sesión 
     */
    public function consultarEmpresasAction() {
        try {
            $conexion = Util::getConexion($this);
            $seguridadDelegado = new SeguridadDelegado($conexion);
            $listaEmpresas = $seguridadDelegado->consultarEmpresasFinancian();
            return $this->construyeRespuesta($listaEmpresas);
        } catch (\Exception $ex) {
            return $this->construyeRespuestaError($ex);
        }
    }

}
