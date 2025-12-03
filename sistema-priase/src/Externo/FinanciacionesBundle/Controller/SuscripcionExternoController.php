<?php

namespace Externo\FinanciacionesBundle\Controller;

use Externo\FinanciacionesBundle\Delegado\SuscripcionExternoDelegado;
use Externo\FinanciacionesBundle\ValidacionExcepcion;
use Symfony\Component\HttpFoundation\Response;

class SuscripcionExternoController extends GenericoController {

    /**
     * Consulta todas las empresas que prestan servicio
     * @return Response
     */
    public function consultarEmpresasServicioAction() {
        try {
            $suscripcionDelegado = new SuscripcionExternoDelegado($this->conexion, $this->getSesion());
            $listaEmpresas = $suscripcionDelegado->consultarEmpresasServicio();
            return $this->construyeRespuesta($listaEmpresas);
        } catch (\Exception $ex) {
            return $this->construyeRespuestaError($ex);
        }
    }

    /**
     *  Consulta una suscripción por el código o identificador de la suscripción
     * @return json con la información (suscripción,tercero,
     * propiedad y empresa prestadora del servicio )
     */
    public function consultarSuscripcionAction() {
        try {
            $suscripcionDelegado = new SuscripcionExternoDelegado($this->conexion, $this->getSesion());
            $infoSuscripcion = $suscripcionDelegado->consultarSuscripcion($this->parametros);
            return $this->construyeRespuesta($infoSuscripcion);
        } catch(ValidacionExcepcion $e){
            return $this->construyeRespuestaValidacion($e->getDatos(), $e->getMensaje());
        }catch (\Exception $ex) {
            return $this->construyeRespuestaError($ex);
        }
    }

}
