<?php

namespace Llanogas\LlanogasBundle\Controller;

use \Llanogas\LlanogasBundle\Delegado\NotasTipoUsoDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Clase encargada de registrar los cambios de tipo de uso
 * Si la factura tiene algún cambio por pago y/o nota 
 * no se puede realizar la acción de tipo de uso 
 * y se tiene que ajustar el valor por nota directa
 */
class NotasTipoUsoController extends Controller {

    /**
     * Función que renderiza la página de notas automáticas.
     * @return html.twig con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $response = $this->render('LlanogasLlanogasBundle:Facturacion:notasTipoUso.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta la lista de municipios que tiene asignado el usuario
     * @return json lista de municipios
     */
    public function getMunicipiosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $municipio = $request->get('municipio');
            $notasDelegado = new NotasTipoUsoDelegado($this, $sesion);
            $listaMunicipio = $notasDelegado->getMunicipios($municipio);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['municipios'] = $listaMunicipio;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se consulta la información de la suscripción que se quiere 
     * aplicar el cambio de tipo de uso
     * @return json
     */
    public function consultarSuscripcionAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idMunicipio = $request->get('idmunicipio');
            if (!is_numeric($idMunicipio)) {
                throw new MyException('Error, debe seleccionar el municipio', 0);
            }
            $parametros['idmunicipio'] = $idMunicipio;
            $parametros['cedula'] = $request->get('cedula');
            $parametros['idsuscripcion'] = $request->get('idsuscripcion');
            $parametros['codigoanterior'] = $request->get('codigoanterior');
            $notasDelegado = new NotasTipoUsoDelegado($this, $sesion);
            $suscripciones = $notasDelegado->consultarSuscripcion($parametros);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['suscripciones'] = $suscripciones;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta las facturas de la suscripción
     * @return json lista de facturas 
     */
    public function getFacturasAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $notasTipoUsoDelegado = new NotasTipoUsoDelegado($this, $sesion);
            $idsuscripcion = $request->get('idsuscripcion');
            if (empty($idsuscripcion)) {
                throw new MyException('Error, debe seleccionar una suscripción', -1);
            }
            $listaFacturas = $notasTipoUsoDelegado->getFacturas($idsuscripcion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['facturas'] = $listaFacturas;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se eliminan las tablas temporales del usuario
     * @return json resultado de la transacción 
     */
    public function eliminarTablasAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $notasDelegado = new NotasTipoUsoDelegado($this, $sesion);
            $notasDelegado->eliminarTablas();
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se procesa la información con el nuevo tipo de uso
     * y se hace la liquidación correspondiente
     * @return type
     */
    public function procesarNotaAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $notasDelegado = new NotasTipoUsoDelegado($this, $sesion);
            $idSuscripcion = $request->get('idsuscripcion');
            if (!is_numeric($idSuscripcion)) {
                throw new MyException('Debe seleccionar una suscripción', -1);
            }
            $idFactura = $request->get('idfactura');
            if (!is_numeric($idFactura)) {
                throw new MyException('Debe seleccionar una factura', -1);
            }
            $listaDetalles = $notasDelegado->procesarNota($idSuscripcion, $idFactura);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Notas procesadas correctamente';
            $respuesta['listadetalles'] = $listaDetalles;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se valida la información y se aplica las notas que tiene las tablas temporales 
     * @return json resultado de la transacción
     */
    public function aplicarNotasAction() {
        try {
            $respuesta['codigoRespuesta'] = 1;
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $notasDelegado = new NotasTipoUsoDelegado($this, $sesion);
            $parametros = $this->validarParametrosAplicarNotas();
            $notasDelegado->aplicarNotas($parametros);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se aplicó la nota correctamente';
        } catch (MyException $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Valida que todos los parámetros para aplicar las notas
     * @return array información con todos los parámetros
     * @throws MyException si hay un parámetro faltante
     */
    private function validarParametrosAplicarNotas() {
        $request = $this->getRequest();
        $idSuscripcion = $request->get('idsuscripcion');
        if (!is_numeric($idSuscripcion)) {
            throw new MyException('Debe seleccionar una suscripción', -1);
        }
        $idFactura = $request->get('idfactura');
        if (!is_numeric($idFactura)) {
            throw new MyException('Debe seleccionar una factura', -1);
        }
        $idMotivo = $request->get('idmotivo');
        if (!is_numeric($idMotivo)) {
            throw new MyException('Debe seleccionar un motivo', -1);
        }
        $comentario = $request->get('comentario');
        if (empty(trim($comentario))) {
            throw new MyException('Debe colocar un comentario', -1);
        }
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idfactura'] = $idFactura;
        $parametros['idmotivo'] = $idMotivo;
        $parametros['comentario'] = $comentario;
        return $parametros;
    }

    /**
     * Consulta los detalles de la factura que se va anular 
     * @return json 
     */
    public function detallesFacturasAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idFactura = $request->get('idfactura');
            if (!is_numeric($idFactura)) {
                throw new MyException('Debe seleccionar una factura', -1);
            }
            $notasDelegado = new NotasTipoUsoDelegado($this, $sesion);
            $listaConceptos = $notasDelegado->getDetalleFacturas($idFactura);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['conceptos'] = $listaConceptos;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
