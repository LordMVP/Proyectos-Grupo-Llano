<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\ModificarLecturaDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\ValidacionException;

/**
 * Clase encargada de gestionar los cambios de lecturas
 * @author Lord_Nightmare
 */
class ModificarLecturaController extends Controller {

    /**
     * Función que renderiza la página de Modificar Lectura.
     * @return text/html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $modificarLecturaDelegado = new ModificarLecturaDelegado($this, $sesion);
        $lisParametros['cmbMotivosNota'] = $modificarLecturaDelegado->cargarComboDb();
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA";
        $response = $this->render("LlanogasLlanogasBundle:Lectura:ModificarLectura.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
    }

    /**
     * Permite realizar la busqueda de informacion de lectura anterior y actual
     * de una o mas suscripciones
     * @return application/json informacion de las lecturas
     * @throws MyException Lanzada al validar que la estructura de los parametros
     * es incorrecta
     */
    public function filtrarSuscripcionAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            $codigoAnterior = $request->get('codigoanterior');
            $documento = $request->get('documento');
            if (!is_numeric($idSuscripcion) && empty($codigoAnterior) && empty($documento)) {
                throw new MyException('Error, no se encontraron parámetros de búsqueda', -1);
            }
            $modificarLecturaDelegado = new ModificarLecturaDelegado($this, $sesion);
            $resultado = $modificarLecturaDelegado->consultarSuscripcionesDelegado($idSuscripcion, $documento, $codigoAnterior);
            $respuesta["codigoRespuesta"] = (empty($resultado) ? 0 : 1);
            $respuesta["datos"] = $resultado;
            $respuesta["mensaje"] = (empty($resultado)) ? "No se encontraron lectura de suscripciones" : "La consulta se realizó correctamente";
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la información del encabezado de lectura
     * @return json con la información del encabezado de lectura (lec_)
     */
    public function getInfoLecturaAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            $idLectura = $request->get('idlectura');
            if (!is_numeric($idSuscripcion) && empty($idLectura) && empty($idSuscripcion)) {
                throw new MyException('Error, no se encontraron parámetros de búsqueda', -1);
            }
            $modificarLecturaDelegado = new ModificarLecturaDelegado($this, $sesion);
            $resultado = $modificarLecturaDelegado->consultarEncabezadoLecturaSuscripcion($idSuscripcion, $idLectura);
            $respuesta["codigoRespuesta"] = (empty($resultado) ? 0 : 1);
            $respuesta["datos"] = $resultado;
            $respuesta["mensaje"] = (empty($resultado)) ? "No se encontraron encabezados de lectura" : "La consulta se realizó correctamente";
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Registra la modificación de lecturas
     * @return type
     */
    public function registrarModificacionLecturaAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $informacion = [];
            $informacion['datos'] = $request->get('datos');
            $informacion['encabezado'] = $request->get('encabezado');
            $modificarLecturaDelegado = new ModificarLecturaDelegado($this, $sesion);
            if (empty($informacion['encabezado'])) {
                throw new MyException('No se ha encontrado información del encabezado');
            }
            $resultado = $modificarLecturaDelegado->generarModificacionLectura($informacion);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = "Se actualizó la lectura satisfactoriamente";
        } catch (ValidacionException $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
            $respuesta['datos'] = $e->getData();
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    /**
     * Consulta la información de la factura
     * @return array con la información de la factura
     */
    public function getInfoFacturaAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            $idperiodolectura = $request->get('idperiodolectura');
            if (!is_numeric($idSuscripcion) && empty($idperiodolectura) && empty($idSuscripcion)) {
                throw new MyException('Error, no se encontraron parámetros de búsqueda', -1);
            }
            $modificarLecturaDelegado = new ModificarLecturaDelegado($this, $sesion);
            $resultado = $modificarLecturaDelegado->consultarFactura($idSuscripcion, $idperiodolectura);
            $respuesta["codigoRespuesta"] = (empty($resultado) ? 0 : 1);
            $respuesta["datos"] = $resultado;
            $respuesta["mensaje"] = (empty($resultado)) ? "No se encontraron facturas de Servicio" : "La consulta se realizó correctamente";
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
