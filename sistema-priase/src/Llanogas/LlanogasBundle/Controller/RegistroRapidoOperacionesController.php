<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\RegistroRapidoOperacionesDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Clase encargada que permite el registro rápido de suspensión y/o reconexión
 */
class RegistroRapidoOperacionesController extends Controller {

    /**
     * Método que renderiza la página de registro rápido de suspensiones y reconexiones
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $registroRapidoOperacionesDelegado = new RegistroRapidoOperacionesDelegado($this, $sesion);
        $lisParametros = array();
        $lisParametros["empresa"] = $sesion->get("empresa");
        $lisParametros["listamotivosuspension"] = $registroRapidoOperacionesDelegado->cargarMotivosSuspensiones();
        $lisParametros["listamotivoreconexion"] = $registroRapidoOperacionesDelegado->cargarMotivosReconexiones();
        $lisParametros["listanovedadsuspension"] = $registroRapidoOperacionesDelegado->cargarListaNovedadesSuspension();
        $lisParametros["listanovedadreconexion"] = $registroRapidoOperacionesDelegado->cargarListaNovedadesReconexion();
        $lisParametros["listarutas"] = $registroRapidoOperacionesDelegado->cargarListaRutasSuspension();
        $lisParametros["listatiposuspension"] = $registroRapidoOperacionesDelegado->cargarListaTipoSuspension();

        $lisParametros["fechaactualSuspension"] = $registroRapidoOperacionesDelegado->obtenerFechaHolgura(PROGRAMA_REGISTRO_RAPIDO_SUSPENSIONES, 'HOLGURA_SUSPENSION');
        $lisParametros["fechaactualReconexion"] = $registroRapidoOperacionesDelegado->obtenerFechaHolgura(PROGRAMA_REGISTRO_RAPIDO_SUSPENSIONES, 'HOLGURA_RECONEXION');
        $response = $this->render("LlanogasLlanogasBundle:Operaciones:registroRapido.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
    }

    /**
     * Consultar municipios del programa
     * @return array listado de municipios
     * @throws MyException
     */
    public function obtenerMunicipiosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $municipio = $request->get("municipio");
            if (empty($municipio)) {
                throw new MyException('Error, el municipio es obligatorio', -1);
            }
            $registroRapidoOperacionesDelegado = new RegistroRapidoOperacionesDelegado($this, $sesion);
            $municipios = $registroRapidoOperacionesDelegado->obtenerMunicipios($municipio);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["datos"] = $municipios;
            $respuesta["mensaje"] = "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getMotivosSuspensionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $registroRapidoOperacionesDelegado = new RegistroRapidoOperacionesDelegado($this, $sesion);
            $motivosSuspension = $registroRapidoOperacionesDelegado->cargarMotivosSuspensiones();
            $respuesta["codigoRespuesta"] = (empty($motivosSuspension) ? 0 : 1);
            $respuesta["datos"] = $motivosSuspension;
            $respuesta["mensaje"] = (empty($motivosSuspension)) ? "No hay motivos de suspensión" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta las novedades de suspension
     * @return json Resultado con la informacion de las novedades de suspension
     */
    public function getNovedadesSuspensionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $registroRapidoOperacionesDelegado = new RegistroRapidoOperacionesDelegado($this, $sesion);
            $novedadesSuspenion = $registroRapidoOperacionesDelegado->cargarListaNovedadesSuspension();
            $respuesta["codigoRespuesta"] = (empty($novedadesSuspenion) ? 0 : 1);
            $respuesta["datos"] = $novedadesSuspenion;
            $respuesta["mensaje"] = (empty($novedadesSuspenion)) ? "No hay novedades de suspensión" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta las novedades de reconexion
     * @return json Resultado con la informacion de las novedades de reconexion
     */
    public function getNovedadesReconexionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $registroRapidoOperacionesDelegado = new RegistroRapidoOperacionesDelegado($this, $sesion);
            $novedadesReconexion = $registroRapidoOperacionesDelegado->cargarListaNovedadesReconexion();
            $respuesta["codigoRespuesta"] = (empty($novedadesReconexion) ? 0 : 1);
            $respuesta["datos"] = $novedadesReconexion;
            $respuesta["mensaje"] = (empty($novedadesReconexion)) ? "No hay novedades de reconexión" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los tipos de suspension
     * @return json Resultado con la informacion de los tipos de suspension
     */
    public function getTiposSuspensionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $registroRapidoOperacionesDelegado = new RegistroRapidoOperacionesDelegado($this, $sesion);
            $tipoSuspension = $registroRapidoOperacionesDelegado->cargarListaTipoSuspension();
            $respuesta["codigoRespuesta"] = (empty($tipoSuspension) ? 0 : 1);
            $respuesta["datos"] = $tipoSuspension;
            $respuesta["mensaje"] = (empty($tipoSuspension)) ? "No hay tipos de suspensión" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Obtiene la informacion de las suspensiones que cumplen con el filtro de
     * seleccion
     * @return json Resultado con la informacion de las suspensiones
     * @throws MyException
     */
    public function getSuspensionesTablaAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $municipio = $request->get("municipio");
            $ruta = $request->get("ruta");
            $motivo = $request->get("motivo");
            if (empty($municipio) && empty($ruta) && empty($motivo)) {
                throw new MyException('Error, el municipio, el motivo y la ruta son obligatorios', -1);
            }
            $barrio = $request->get("barrio");
            $desde = $request->get("desde");
            $hasta = $request->get("hasta");
            $altoRiesgo = $request->get("altoriesgo");
            $zona = $request->get("zona");
            $tercero = $request->get("tercero");
            $realizada = $request->get("realizada");
            $fechaProgramacion = $request->get("fechaprogramacion");
            $registroRapidoOperacionesDelegado = new RegistroRapidoOperacionesDelegado($this, $sesion);
            $suspensiones = $registroRapidoOperacionesDelegado->cargarTablaSuspensiones($municipio, $ruta, $barrio, $desde, $hasta, $altoRiesgo, $zona, $tercero, $realizada, $fechaProgramacion, $motivo);
            $respuesta["codigoRespuesta"] = (empty($suspensiones) ? 0 : 1);
            $respuesta["datos"] = $suspensiones;
            $respuesta["mensaje"] = (empty($suspensiones)) ? "No hay suspensiones" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Obtiene la informacion de las reconexiones que cumplen con el filtro de
     * seleccion
     * @return json Resultado con la informacion de las reconexiones
     * @throws MyException
     */
    public function getReconexionesTablaAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $municipio = $request->get("municipio");
            $ruta = $request->get("ruta");
            if (empty($municipio) && empty($ruta)) {
                throw new MyException('Error, el municipio y la ruta son obligatorios', -1);
            }
            $motivo = $request->get("motivo");
            $barrio = $request->get("barrio");
            $desde = $request->get("desde");
            $hasta = $request->get("hasta");
            $altoRiesgo = $request->get("altoriesgo");
            $zona = $request->get("zona");
            $tercero = $request->get("tercero");
            $realizada = $request->get("realizada");
            $fechaProgramacion = $request->get("fechaprogramacion");
            $registroRapidoOperacionesDelegado = new RegistroRapidoOperacionesDelegado($this, $sesion);
            $reconexiones = $registroRapidoOperacionesDelegado->cargarTablaReconexiones($municipio, $ruta, $barrio, $desde, $hasta, $altoRiesgo, $zona, $tercero, $realizada, $fechaProgramacion, $motivo);
            $respuesta["codigoRespuesta"] = (empty($reconexiones) ? 0 : 1);
            $respuesta["datos"] = $reconexiones;
            $respuesta["mensaje"] = (empty($reconexiones)) ? "No hay reconexiones" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Registra las modificaciones hechas en la tabla de suspensiones
     * @return json Resultado de la modificacion de las suspensiones
     * @throws MyException
     */
    public function setSuspensionesAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $suspensiones = $request->get("suspensiones");
            if (empty($suspensiones)) {
                throw new MyException('Error, no hay cambios por guardar.', -1);
            }
            $registroRapidoOperacionesDelegado = new RegistroRapidoOperacionesDelegado($this, $sesion);
            $resultado = $registroRapidoOperacionesDelegado->actualizarInformacionSus($suspensiones);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["datos"] = $resultado;
            $respuesta["mensaje"] = "Información registrada correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Registra las modificaciones hechas en la tabla de reconexiones
     * @return json Resultado de la modificacion de las reconexiones
     * @throws MyException
     */
    public function setReconexionesAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $reconexiones = $request->get("reconexiones");
            if (empty($reconexiones)) {
                throw new MyException('Error, no hay cambios por guardar.', -1);
            }
            $registroRapidoOperacionesDelegado = new RegistroRapidoOperacionesDelegado($this, $sesion);
            $resultado = $registroRapidoOperacionesDelegado->actualizarInformacionRec($reconexiones);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["datos"] = $resultado;
            $respuesta["mensaje"] = "Información registrada correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
