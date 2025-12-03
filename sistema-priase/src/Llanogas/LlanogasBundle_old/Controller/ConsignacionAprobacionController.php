<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Delegado\ConsignacionesDelegado;

/**
 * Clase encargada de administrar consignaciones de los recaudos y realizar
 * las aprobaciones de las consignaciones que están en estado 'P'
 */
class ConsignacionAprobacionController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $consignacionesDelegado = new ConsignacionesDelegado($this, $sesion);
        $listaParametros = array();
        $listaParametros['empresa'] = $sesion->get('empresa');
        $listaParametros['listamediospagos'] = $consignacionesDelegado->getMediosPago();
        $response = $this->render('LlanogasLlanogasBundle:Recaudos:flujoAprobacion.html.twig', $listaParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Función encargado de realizar la aprobación
     * @return json con el resultado de la transacción
     */
    public function aprobarAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $idConsignacion = $request->get('idconsignacion');
            $idTerceroResponsable = $request->get('idterceroresponsable');
            $idtipodocumento = $request->get('idtipodocumento');
            $descripcionseven = $request->get('descripcionseven');
            $accion = $request->get('accion');
            if (!is_numeric($idConsignacion)) {
                throw new MyException('Debe seleccionar una consignación ', -1);
            }
            $consignacionesDelegado = new ConsignacionesDelegado($this, $sesion);
            //Se valida que tipo de acción se va a realizar (A=Aprobar, E=Eliminar)
            if ($accion == 'A') {
                $consignacionesDelegado->aprobarConsignacion($idConsignacion, $idTerceroResponsable, $idtipodocumento, $descripcionseven);
                $respuesta['mensaje'] = 'Se aprobó correctamente la consignación';
            } else {
                $consignacionesDelegado->rechazarConsignacion($idConsignacion, $descripcionseven);
                $respuesta['mensaje'] = 'Se eliminó correctamente la consignación';
            }
            $respuesta["codigoRespuesta"] = 1;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los responsables de un concepto de acuerdo a la consignación 
     * @return json con la lista de terceros responsables de acuerdo al concepto que 
     * se va a generar 
     */
    public function getTercerosResponsablesAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $idMedioPago = $request->get('idmediopago');
            //Se valida que el medio de pago sea obligatorio
            if (!is_numeric($idMedioPago)) {
                throw new MyException('Debe seleccionar una consignación ', -1);
            }
            $consignacionesDelegado = new ConsignacionesDelegado($this, $sesion);
            $listaTerceros = $consignacionesDelegado->getTercerosResponsables($idMedioPago);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['terceros'] = $listaTerceros;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los tipos de documentos de acuerdo si es
     * GA=Gasto, SO=Sobrante, CP=Cuenta por pagar
     * @return type
     */
    public function getTiposDocumentosAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $iddocumento = $request->get('iddocumento');
            $tipo = $request->get('tipo');
            if (!is_numeric($iddocumento) || empty($tipo)) {
                throw new MyException('Falta información para la consulta', -1);
            }
            $consignacionesDelegado = new ConsignacionesDelegado($this, $sesion);
            $listaTiposDocumento = $consignacionesDelegado->getTiposDocumento($tipo, $iddocumento);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['tiposdocumento'] = $listaTiposDocumento;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
