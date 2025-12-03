<?php

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Delegado\RecaudosDelegado;
use Llanogas\LlanogasBundle\Delegado\AnticiposDelegado;
use Llanogas\LlanogasBundle\Delegado\AutorizarImpresionesDelegado;

/**
 * Clase que realiza un controla la lógica de un anticipo.
 */
class AnticiposController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $recaudosDelegado = new RecaudosDelegado($this, $sesion);

        //cargar el combo de medios de pago
        $cmbMedioPago = $recaudosDelegado->cargarComboDb('cmbMedioPago');
        $lisParametros['cmbMedioPago'] = $cmbMedioPago;

        $cmbClasePago = $recaudosDelegado->cargarComboDb('cmbClasePago', 'AN', PROGRAMA_ANTICIPOS_ID);
        $lisParametros['cmbClasePago'] = $cmbClasePago;

        $cmbSucursal = $recaudosDelegado->consultarSucursal(PROGRAMA_ANTICIPOS_ID);
        $lisParametros['cmbSucursal'] = $cmbSucursal;

        //Se realiza render de la página de anticipos
        $response = $this->render('LlanogasLlanogasBundle:Recaudos:anticipos.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * routing:  /recaudos/obtener/documentos/
     * Consulta los tipos de liquidación de una sucripción seleccionada
     * @return json con los tipos de liquidación
     * @throws MyException Error sí la suscripción no es un número ó si la consulta no trae datos.
     */
    public function consultarDocumentosAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $anticiposDelegado = new AnticiposDelegado($this, $sesion);
            //Se valida que la petición se haga por método POST
            Util::validarPeticion($this);
            $idtipodocumento = $request->get('idtipodocumento');
            if (!is_numeric($idtipodocumento)) {
                throw new MyException('el tipo de documento debe ser un valor numérico', -1);
            }
            //Se construye respuesta de la consulta
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['documentos'] = $anticiposDelegado->obtenerDocumentos($idtipodocumento);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Routing /recaudos/obtener/tipos_documento/
     * Consulta los tipos de documento asociados a la suscripción
     * @return json con los tipos de documento
     * @throws MyException Error sí la suscripción no es un número ó si la consulta no trae datos.
     */
    public function consultarTiposDocumentoPorTipoUsoAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $anticiposDelegado = new AnticiposDelegado($this, $sesion);
            //Se valida que la petición se haga por método POST
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            $anticipoOrden = $request->get('anticipoOrden');
            
            if (!is_numeric($idSuscripcion)) {
                throw new MyException('La suscripción debe ser un valor numérico', -1);
            }
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["tiposDocumento"] = $anticiposDelegado->obtenerTiposDocumentoPorTipoUso($idSuscripcion , $anticipoOrden);
            $respuesta["periodos"] = $anticiposDelegado->getPeriodos($idSuscripcion);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        //Se construye el JSON para ser mostrado en la interfaz de usuario
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Routing /recaudos/obtener/liquidaciones/
     * Consulta los tipos de liquidación de una sucripción seleccionada
     * @return json con los tipos de liquidación
     * @throws MyException Error sí la suscripción no es un número ó si la consulta no trae datos.
     */
    public function consultarTiposLiquidacionAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $anticiposDelegado = new AnticiposDelegado($this, $sesion);
            //Se valida que la petición se haga por método POST
            Util::validarPeticion($this);
            $idTipoDocumento = $request->get('idtipodocumento');
            $idSuscripcion = $request->get('idsuscripcion');
            if (!is_numeric($idTipoDocumento)) {
                throw new MyException('La suscripción debe ser un valor numérico', -1);
            }
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['tiposLiquidacion'] = $anticiposDelegado->obtenerLiquidacionesPorTipoDocumento($idTipoDocumento, $idSuscripcion);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los conceptos que se le pueden hacer anticipos
     * @return json con los conceptos que se hacen los anticpos.
     * @throws MyException Error en la petición.
     */
    public function consultarConceptosAnticiposAction() {
        try {
            $respuesta["codigoRespuesta"] = -1;
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $anticiposDelegado = new AnticiposDelegado($this, $sesion);
            //Se valida que la petición se haga por método POST
            Util::validarPeticion($this);
            $idLiquidacion = $request->get('idliquidacion');
            $listaConceptosAnticipos = $anticiposDelegado->obtenerConceptosAnticipos($idLiquidacion);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['conceptos'] = $listaConceptosAnticipos;
        } catch (\Exception $ex) {
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los documentos y tipos de documentos asociados a la suscripción.
     * @return type json con el listado de documentos y tipos de documentos.
     * @throws MyException Error al consultar los tipos y documentos
     */
    public function consultarDocumentosTiposAnticiposAction() {
        try {
            $respuesta["codigoRespuesta"] = -1;
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $recaudosDelegado = new RecaudosDelegado($this, $sesion);
            //Se valida que la petición se haga por método POST
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            $listaDocumentosAnticipos = $recaudosDelegado->getDocumentosTiposAnticipos($idSuscripcion);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['conceptos'] = $listaDocumentosAnticipos;
        } catch (\Exception $ex) {
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los documentos y tipos de documentos de acuerdo a una liquidación seleccionada
     * @return json con la información de los documentos que pertenecen a la liquidación. 
     * @throws MyException Error sí la petición se hace por el método GET
     */
    public function consultarDocumentosTiposPorLiquidacionAction() {
        try {
            $respuesta["codigoRespuesta"] = -1;
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $recaudosDelegado = new RecaudosDelegado($this, $sesion);
            //Se valida que la petición se haga por método POST 
            Util::validarPeticion($this);
            $idLiquidacion = $request->get('idliquidacion');
            $listaDocumentosTiposAnticipos = $recaudosDelegado->getDocumentosTipos($idLiquidacion);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['conceptos'] = $listaDocumentosTiposAnticipos;
        } catch (\Exception $ex) {
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Ingresa al sistema un nuevo registro en forma de anticipo
     * @return json con la información de la transacción.
     * @throws MyException Error en el método de petición (GET)
     */
    public function registrarAnticipoAction() {
        try {
            $respuesta["codigoRespuesta"] = -1;
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $recaudosDelegado = new RecaudosDelegado($this, $sesion);
            //Se valida que la petición se haga por método POST
            Util::validarPeticion($this);
            $recaudo = $request->get('anticipo');
            $idUsuario = $sesion->get('idusuario');
            $idRecaudo = $recaudosDelegado->insertarRecaudoAnticipos($recaudo);
            $autorizarImpresionesDelegado = new AutorizarImpresionesDelegado($this, $sesion);
            $impresion = $request->get('impresion');
            $respuesta['documentomaximoImpresion'] =  $autorizarImpresionesDelegado->obtenerLimiteImpresionRecaudo($idRecaudo)['impresiones'];
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensajeRespuesta'] = 'Se registró el recaudo correctamente con número: ' . $idRecaudo;
            $respuesta['recaudo'] = $recaudosDelegado->getRecaudoInfo($idRecaudo);
            $respuesta['impresionrecaudo'] = $autorizarImpresionesDelegado->obtenerImpresionRecaudoUsuario($idRecaudo, $idUsuario);
            $respuesta["codigoRespuesta"] = 1;
        } catch (\Exception $ex) {
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
