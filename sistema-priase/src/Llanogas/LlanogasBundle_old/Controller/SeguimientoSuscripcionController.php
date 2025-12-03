<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Delegado\SeguimientoSuscripcionesDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Delegado\SuscripcionesDelegado;

/**
 * Clase encargada de administrar todas las consultas de seguimiento 
 * a la suscripción
 */
class SeguimientoSuscripcionController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
        $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $lisParametros['listarutas'] = $suscripcionesDelegado->getRutasEmpresa();
        $lisParametros['listamunicipios'] = $suscripcionesDelegado->getMunicipiosPorPerfil(PROGRAMA_SEGUIMIENTO_SUSCRIPCION);
        $lisParametros['listaEmpresas'] = $seguimientoSuscripcionDelegado->getEmpresas();
        $response = $this->render('LlanogasLlanogasBundle:Suscripcion:seguimientoSuscripcion.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function getFacturasAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $fechaInicio = $request->get('fechainicio');
            $fechaFin = $request->get('fechafin');
            $idSuscripcion = $request->get('idsuscripcion');
            if (empty($fechaFin) || empty($fechaInicio) || !is_numeric($idSuscripcion)) {
                throw new MyException('Error en los parámetros de búsqueda', -1);
            }
            $listaFacturas = $seguimientoSuscripcionDelegado->getFacturas($fechaInicio, $fechaFin, $idSuscripcion);
            $listaDocumentos = $seguimientoSuscripcionDelegado->getDocumentos($fechaInicio, $fechaFin, $idSuscripcion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['facturas'] = $listaFacturas;
            $respuesta['documentos'] = $listaDocumentos;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getFacturasProvisionAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $fechaInicio = $request->get('fechainicio');
            $fechaFin = $request->get('fechafin');
            $idSuscripcion = $request->get('idsuscripcion');
            if (empty($fechaFin) || empty($fechaInicio) || !is_numeric($idSuscripcion)) {
                throw new MyException('Error en los parámetros de búsqueda', -1);
            }
            $listaFacturas = $seguimientoSuscripcionDelegado->getFacturasProvision($fechaInicio, $fechaFin, $idSuscripcion);
            $listaDocumentos = $seguimientoSuscripcionDelegado->getDocumentosP ($fechaInicio, $fechaFin, $idSuscripcion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['facturas'] = $listaFacturas;
            $respuesta['documentos'] = $listaDocumentos;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getFacturasNotasConceptosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idFactura = $request->get('idfactura');
            if (!is_numeric($idFactura)) {
                throw new MyException('Error, la factura es obligatoria', -1);
            }
            $listaConceptos = $seguimientoSuscripcionDelegado->getFacturasConceptosNotas($idFactura);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['conceptos'] = $listaConceptos;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    public function getFacturasConceptosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idFactura = $request->get('idfactura');
            if (!is_numeric($idFactura)) {
                throw new MyException('Error, la factura es obligatoria', -1);
            }
            $listaConceptos = $seguimientoSuscripcionDelegado->getConceptos($idFactura);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['conceptos'] = $listaConceptos;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    public function getFacturasConceptosPAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idFactura = $request->get('idfactura');
            if (!is_numeric($idFactura)) {
                throw new MyException('Error, la factura es obligatoria', -1);
            }
            $listaConceptos = $seguimientoSuscripcionDelegado->getConceptosP($idFactura);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['conceptos'] = $listaConceptos;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    public function getRecaudosConceptosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idrecaudo = $request->get('idrecaudo');
            if (!is_numeric($idrecaudo)) {
                throw new MyException('Error, el recaudo es obligatoria', -1);
            }
            $listaConceptos = $seguimientoSuscripcionDelegado->getRecaudosConceptos($idrecaudo);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['conceptos'] = $listaConceptos;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getRecaudosFacturaAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idFactura = $request->get('idfactura');
            if (!is_numeric($idFactura)) {
                throw new MyException('Error, la factura es obligatoria', -1);
            }
            $listaRecaudos = $seguimientoSuscripcionDelegado->getRecaudosFacturas($idFactura);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['recaudos'] = $listaRecaudos;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getRecaudosSuscripcionAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idSuscripcion = $request->get('idsuscripcion');
            $fechaInicio = $request->get('fechainicio');
            $fechaFin = $request->get('fechafin');
            if (!is_numeric($idSuscripcion)) {
                throw new MyException('Error, el identificador de la suscripción es obligatorio', -1);
            }
            if (empty($fechaFin) || empty($fechaInicio)) {
                throw new MyException('Error, Debe seleccionar un rango fechas ', -1);
            }
            $respuesta['clasespago'] = $seguimientoSuscripcionDelegado->getClasesPago($idSuscripcion, $fechaInicio, $fechaFin);
            $respuesta['recaudos']  = $seguimientoSuscripcionDelegado->getRecaudosSuscripcion($idSuscripcion, $fechaInicio, $fechaFin);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta las facturas asociados a un recaudo
     */
    public function getFacturasRecaudoAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idRecaudo = $request->get('idrecaudo');
            if (!is_numeric($idRecaudo)) {
                throw new MyException('Error, el recaudo es obligatoria', -1);
            }
            $listaFacturas = $seguimientoSuscripcionDelegado->getFacturasRecaudos($idRecaudo);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['facturas'] = $listaFacturas;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta las financiaciones asociados a un recaudo
     */
    public function getFinanciacionesSuscripcionAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idSuscripcion = $request->get('idsuscripcion');
            $fechaInicio = $request->get('fechainicio');
            $fechaFin = $request->get('fechafin');
            if (!is_numeric($idSuscripcion)) {
                throw new MyException('Error, el identificador de la suscripción es obligatorio', -1);
            }
            if (empty($fechaFin) || empty($fechaInicio)) {
                throw new MyException('Error, Debe seleccionar un rango fechas ', -1);
            }
            $listaFinanciaciones = $seguimientoSuscripcionDelegado->getFinanciacionSuscripcion($idSuscripcion, $fechaInicio, $fechaFin);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['financiaciones'] = $listaFinanciaciones;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getFacturasFinanciacionesAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idFinanciacion = $request->get('idfinanciacion');
            if (!is_numeric($idFinanciacion)) {
                throw new MyException('Error, la financiación es obligatoria', -1);
            }
            $listaFacturas = $seguimientoSuscripcionDelegado->getFacturasFinanciacion($idFinanciacion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['facturas'] = $listaFacturas;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * 
     * @return type
     * @throws MyException
     */
    public function getFacturaAmortizacionesAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idFinanciacion = $request->get('idfinanciacion');
            $fechaInicial = $request->get('fechainicio');
            $fechaFinal = $request->get('fechafin');
            if (!is_numeric($idFinanciacion)) {
                throw new MyException('Error, la financiación es obligatoria', -1);
            }
            $listaFacturas = $seguimientoSuscripcionDelegado->getAmortizacion($idFinanciacion, $fechaInicial, $fechaFinal);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['facturas'] = $listaFacturas;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * 
     * @return type
     * @throws MyException
     */
    public function getCarteraAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idfinanciacion = $request->get('idsuscripcion');
            $fechainicio = $request->get('fechainicio');
            $fechafin = $request->get('fechafin');
            if (!is_numeric($idfinanciacion)) {
                throw new MyException('Error, la financiación es obligatoria', -1);
            }
            $listaFacturas = $seguimientoSuscripcionDelegado->getCartera($idfinanciacion, $fechainicio, $fechafin);

            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['facturas'] = $listaFacturas;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getFacturasOtrasEmpresasAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $suscripcion = $request->get('idsuscriptor');
            $fechainicio = $request->get('fechainicio');
            $fechafin = $request->get('fechafin');
            $empresa = $request->get('idempresa');
            if (!is_numeric($suscripcion)) {
                throw new MyException('Error, el identificador de la suscripción es obligatorio', -1);
            }
            $listaFacturas = $seguimientoSuscripcionDelegado->getFacturasOtrasEmpresas($fechainicio, $fechafin, $suscripcion, $empresa);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['facturas'] = $listaFacturas;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Routing: /suscripcion/seguimiento/PQR/
     * Consulta los PQR de techsoft 
     * @return JSON 
     * @throws MyException Error, Debe seleccionar una suscripción
     */
    public function getPQRAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $suscripcion = $request->get('idsuscripcion');
            $fechainicio = $request->get('fechainicio');
            $fechafin = $request->get('fechafin');

            if (!is_numeric($suscripcion)) {
                throw new MyException('Error, el identificador de la suscripción es obligatorio', -1);
            }
            $listaFacturas = $seguimientoSuscripcionDelegado->getPQR($suscripcion, $fechainicio, $fechafin);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['pqr'] = $listaFacturas;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Routing: /suscripcion/seguimiento/Certificaciones/
     * Permite obtener el listado de certificaciones de techsoft
     * @return JSON 
     * @throws MyException Error, Debe seleccionar una suscripción
     */
    public function getCertificacionesAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idsuscripcion = $request->get('idsuscripcion');
            if (!is_numeric($idsuscripcion)) {
                throw new MyException('Error, el identificador de la suscripción es obligatorio', -1);
            }
            $listaFacturas = $seguimientoSuscripcionDelegado->getCertificaciones($idsuscripcion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['certificacion'] = $listaFacturas;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * 
     * @return type
     * @throws MyException 
     */
    public function getDatosSuspensionAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $suscripcion = $request->get('idsuscripcion');
            $fechainicio = $request->get('fechainicio');
            $fechafin = $request->get('fechafin');
            if (!is_numeric($suscripcion)) {
                throw new MyException('Error, el identificador de la suscripción es obligatorio', -1);
            }
            $listaFacturas = $seguimientoSuscripcionDelegado->getDatosSuspension($fechainicio, $fechafin, $suscripcion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['datosuspension'] = $listaFacturas;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getSuspensionAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idsuspensionreconexion = $request->get('idsuspensionreconexion');
            if (!is_numeric($idsuspensionreconexion)) {
                throw new MyException('Error, Debe seleccionar una suspensión / reconexión', -1);
            }
            $listaFacturas = $seguimientoSuscripcionDelegado->getSuspensiones($idsuspensionreconexion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['facturas'] = $listaFacturas;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getReconexionesAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idsuspensionreconexion = $request->get('idsuspensionreconexion');
            if (!is_numeric($idsuspensionreconexion)) {
                throw new MyException('Error, Debe seleccionar una suspensión / reconexión', -1);
            }

            $listaFacturas = $seguimientoSuscripcionDelegado->getReconexion($idsuspensionreconexion);

            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['facturas'] = $listaFacturas;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getLecturasAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $suscripcion = $request->get('idsuscripcion');
            $fechainicio = $request->get('fechainicio');
            $fechafin = $request->get('fechafin');
            if (!is_numeric($suscripcion)) {
                throw new MyException('Error, el identificador de la suscripción es obligatorio', -1);
            }

            $listaFacturas = $seguimientoSuscripcionDelegado->getLectura($fechainicio, $fechafin, $suscripcion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['datosuspension'] = $listaFacturas;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getDetalleLecturaAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idlectura = $request->get('idlectura');
            if (!is_numeric($idlectura)) {
                throw new MyException('Error, la lectura es obligatorio', -1);
            }
            $listaFacturas = $seguimientoSuscripcionDelegado->getDetalleLectura($idlectura);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['facturas'] = $listaFacturas;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getLecturaVistaAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idlectura = $request->get('idlectura');
            if (!is_numeric($idlectura)) {
                throw new MyException('Error, la lectura es obligatorio', -1);
            }

            $listaFacturas = $seguimientoSuscripcionDelegado->getLecturaVista($idlectura);

            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['facturas'] = $listaFacturas;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getNotasFacturasAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $suscripcion = $request->get('idsuscripcion');
            $fechainicio = $request->get('fechainicio');
            $fechafin = $request->get('fechafin');
            if (!is_numeric($suscripcion)) {
                throw new MyException('Error, el identificador de la suscripción es obligatorio', -1);
            }
            $listaFacturas = $seguimientoSuscripcionDelegado->getNotasFactura($fechainicio, $fechafin, $suscripcion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['facturas'] = $listaFacturas;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getNotasRecaudoAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $suscripcion = $request->get('idsuscripcion');
            $fechainicio = $request->get('fechainicio');
            $fechafin = $request->get('fechafin');
            if (!is_numeric($suscripcion)) {
                throw new MyException('Error, el identificador de la suscripción es obligatorio', -1);
            }
            $listaFacturas = $seguimientoSuscripcionDelegado->getNotasRecaudo($fechainicio, $fechafin, $suscripcion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['facturas'] = $listaFacturas;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    // <editor-fold desc="Seguimiento suscripción reclamos">  
    /**
     * Permite obtener los reclamos
     * @return Array Listado de reclamos
     * @throws MyException Error, Debe seleccionar una suscripción
     */
    public function getReclamosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            // Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $suscripcion = $request->get('idsuscripcion');
            $fechainicio = $request->get('fechainicio');
            $fechafin = $request->get('fechafin');
            if (!is_numeric($suscripcion)) {
                throw new MyException('Error, el identificador de la suscripción es obligatorio', -1);
            }
            $listaReclamos = $seguimientoSuscripcionDelegado->getReclamos($suscripcion, $fechainicio, $fechafin);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['reclamos'] = $listaReclamos;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    /**
     * 
     * @return type
     * @throws MyException
     */
    public function getTarifasAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idsuscripcion = $request->get('idsuscripcion');
            $fechainicio = $request->get('fechainicio');
            $fechafin = $request->get('fechafin');
            if (!is_numeric($idsuscripcion)) {
                throw new MyException('Error, la suscripcion es obligatoria', -1);
            }
            $tarifas = $seguimientoSuscripcionDelegado->getTarifas($idsuscripcion, $fechainicio, $fechafin);

            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['tarifas'] = $tarifas;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    public function getFacturasAllConceptosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idFactura = $request->get('idfactura');
            if (!is_numeric($idFactura)) {
                throw new MyException('Error, la factura es obligatoria', -1);
            }
            $listaConceptos = $seguimientoSuscripcionDelegado->getAllConceptos($idFactura);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['conceptos'] = $listaConceptos;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
     public function getAuditoriaSuscripcionAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $seguimientoSuscripcionDelegado = new SeguimientoSuscripcionesDelegado($this, $sesion);
            $idsuscripcion = $request->get('idsuscripcion');
            $fechainicio = $request->get('fechainicio');
            $fechafin = $request->get('fechafin');
            if (!is_numeric($idsuscripcion)) {
                throw new MyException('Error, la suscripcion es obligatoria', -1);
            }
            $auditoria = $seguimientoSuscripcionDelegado->getAuditoria($idsuscripcion, $fechainicio, $fechafin);

            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['auditoria'] = $auditoria;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

// </editor-fold>
}
