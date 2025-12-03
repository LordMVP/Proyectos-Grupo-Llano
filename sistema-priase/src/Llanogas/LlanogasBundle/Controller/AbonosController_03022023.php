<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\AutorizarImpresionesDelegado;
use Llanogas\LlanogasBundle\Delegado\RecaudosDelegado;
use Llanogas\LlanogasBundle\Models\RecaudosModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Clase encargada de administrar los recaudos en forma de abono.
 * Registra los conceptos más antiguos
 */
class AbonosController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $recaudosDelegado = new RecaudosDelegado($this, $sesion);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        //cargar el combo de medios de pago
        $cmbMedioPago = $recaudosDelegado->cargarComboDb('cmbMedioPago');
        $lisParametros['cmbMedioPago'] = $cmbMedioPago;

        $cmbClasePago = $recaudosDelegado->cargarComboDb('cmbClasePago', 'AB', PROGRAMA_ABONOS_ID);
        $lisParametros['cmbClasePago'] = $cmbClasePago;

        $cmbSucursal = $recaudosDelegado->consultarSucursal(PROGRAMA_ABONOS_ID);
        $lisParametros['cmbSucursal'] = $cmbSucursal;

        $response = $this->render('LlanogasLlanogasBundle:Recaudos:abonos.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Método que filtra las suscripciones a las que se les puede hacer 
     * abono
     * @return json Objeto json con el arreglo de los registros.
     * @throws MyException Error sí el usuario  no digita los parámetros 
     */
    public function consultarSuscripcionAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $documento = $request->get('documento');
            $codAnterior = $request->get('codanterior');
            $idSuscripcion = $request->get('idsuscripcion');
            $estado = $request->get('estado');
            if (empty($documento) && empty($codAnterior) && !is_numeric($idSuscripcion)) {
                throw new MyException("Error en los criterios de búsqueda", -1);
            }
            $recaudosDelegado = new RecaudosDelegado($this, $sesion);
            //Se valida que el pago que se va a realizar es de Cartera Castigada
            if ($estado == 'C') {
                $suscripciones = $recaudosDelegado->getSuscripcionesCarteraCastigada($documento, $idSuscripcion, $codAnterior);
            } else {
                $suscripciones = $recaudosDelegado->getSuscripcionesAbonos($documento, $idSuscripcion, $codAnterior);
            }
            $respuesta["codigoRespuesta"] = (empty($suscripciones)) ? 0 : 1;
            $respuesta['suscripciones'] = $suscripciones;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Método encargado de consultar las facturas por una suscripción.
     * @return json Object json con la información de las facturas.
     * @throws MyException Error sí la petición no se hace por el método POST
     */
    public function cargarFacturaSuscripcionAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $suscripcion = $request->get('suscripcion');
            if (empty($suscripcion)) {
                throw new MyException("No se encontró la suscripción", -1);
            }
            $idsSuscripcion = str_replace('"', '', $suscripcion);
            $recaudosDelegado = new RecaudosDelegado($this, $sesion);
            $respuesta = $recaudosDelegado->getFacturasConSaldo($idsSuscripcion);
            $respuesta["codigoRespuesta"] = 1;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Método de cosultar los bancos
     * @return json con el listado de bancos
     */
    public function consultarBancosAction() {
        try {
            $respuesta["codigoRespuesta"] = -1;
            $conexion = Util::getConexion($this);
            $objModel = new RecaudosModel();
            $objModel->setConexion($conexion);

            Util::validarPeticion($this);
            $listaBancos = $objModel->consultarBancos();
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['bancos'] = $listaBancos;
        } catch (MyException $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Método encargado de registrar un recaudo en forma de abono.
     * @return json con la información del recaudo.
     */
    public function registrarAbonoAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);

            Util::validarPeticion($this);
            $recaudosDelegado = new RecaudosDelegado($this, $sesion);
            $recaudo = $request->get('abono');
            $idRecaudo = $recaudosDelegado->insertarRecaudoAbono($recaudo, $sesion->get('idempresa'));
            // Creacion de registro de autorizacion de impresion en la creacion del recaudo
            $autorizarImpresionesDelegado = new AutorizarImpresionesDelegado($this, $sesion);
            $idUsuario = $sesion->get('idusuario');
            $impresion = $request->get('impresion');
            //Se valida que el recaudo cuantas veces sean impresos
            if (!empty($impresion) && $impresion > 0) {
                $autorizarImpresionesDelegado->insertarImpresionesRecaudoUsuarioAutomatico($idRecaudo, $idUsuario);
            } else {
                //Se valida las impresiones que tiene un recaudo por un usuario en específico
                $cantLimite = $autorizarImpresionesDelegado->obtenerLimiteImpresionRecaudo($idRecaudo);
                $imp = 1;
                if ($cantLimite['impresiones'] == 0) {
                    $imp = 0;
                }
                $autorizarImpresionesDelegado->insertarImpresionesRecaudoUsuarioAutomatico($idRecaudo, $idUsuario, $imp);
            }
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensajeRespuesta'] = 'Se registró el recaudo correctamente con número: ' . $idRecaudo;
            $respuesta['recaudo'] = $recaudosDelegado->getRecaudoInfo($idRecaudo);
            $respuesta['impresionrecaudo'] = $autorizarImpresionesDelegado->obtenerImpresionRecaudoUsuario($idRecaudo, $idUsuario);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
