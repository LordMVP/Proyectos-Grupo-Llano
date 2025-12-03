<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Models\FesModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\ValidacionException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Delegado\FesDelegado;

/**
 * Clase encargada de administrar los recaudos en forma de abono.
 */
class FesController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $conexion = Util::getConexion($this);
        $lisParametros = array();
        $ciclos = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $delegado = new FesDelegado($this, $sesion);
        $ciclos = $delegado->consultarCiclo();
        if (empty($ciclos)) {
            $ciclos[0]['idciclo'] = '-1';
            $ciclos[0]['ciclo'] = 'No hay ciclos para Procesar';
        }
        $lisParametros['ciclos'] = $ciclos;
        $response = $this->render('LlanogasLlanogasBundle:Facturacion:ejecutaProcesoFes.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function generarPlanoAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $request = $this->getRequest();
            $delegado = new FesDelegado($this, $sesion);
            $sesion->set('fesciclo', $request->get('idCiclo'));
            $proceso_activo = $delegado->ValidarEjecucionProceso();
            $respuesta['errores'] = $delegado->generarPlano($request->get('idCiclo'), $this->container);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = "Proceso iniciado Satisfactoriamente";
            if (!empty($respuesta['errores'])) {
                $respuesta['mensaje'] = "Proceso generado con Errores";
                $respuesta['codigoRespuesta'] = 3;
            } else
                $respuesta['mensaje'] = "Proceso iniciado Satisfactoriamente";
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }

    public function consultarProcesoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $delegado = new FesDelegado($this, $sesion);
            $errores = $delegado->consultaLogErroresFes();
            if (!empty($errores)) {
                $respuesta["codigoRespuesta"]= 3;
                $respuesta['errores'] = $errores;
//                throw new MyException("Se detectaron errores durante la validación de la información generada  ", 3);
            } else {
                $proceso_activo = $delegado->ValidarEjecucionProceso();
                $respuesta["codigoRespuesta"] = 0;
            }
        } catch (ValidacionException $ex) {
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = $ex->getMessage();
            $respuesta["datos"] = $ex->getData();
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
//        print_r($respuesta);
        return Util::construyeRespuesta($respuesta);
    }

    public function consultarArchivosAction() {
        try {
            $session = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $delegado = new FesDelegado($this, $session);
            $parametros['empresa'] = $session->get('idempresa');
            $parametros['usuario'] = $session->get('usu_ideregistro');
            $resultado = $delegado->consultarArchivos($parametros);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = "Consulta Exitosa";
            $respuesta['archivos'] = $resultado;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function cargarAction() {
        $sesion = Util::iniciarSesion($this);
        $conexion = Util::getConexion($this);
        $lisParametros = array();
        $ciclos = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $lisParametros['usuario_nit'] = $sesion->get('usuario_nit');
        $lisParametros['usu_ideregistro'] = $sesion->get('usu_idregistro');
        $response = $this->render('LlanogasLlanogasBundle:Facturacion:cargaProcesoFes.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function invocarWebServiceAction() {
        try {
            $response = $this->redirect(URL_WEBSERVICE_FES_COMERCIAL);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Llamada Exitosa';
        } catch (\Exeption $ex) {
            $respuesta['codigoRespuesta'] = -1;
            $respuesta['mensaje'] = 'Error Procesando Peticion a Webservice';
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function consultarProcesoCargaAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $delegado = new FesDelegado($this, $sesion);
            $respuesta['usu_ideregistro'] = $sesion->get("idusuario");
            $respuesta['idempresa'] = $sesion->get("idempresa");
            $respuesta['idacceso'] = $sesion->get("idacceso");
            $respuesta['idprograma'] = CODIGO_PROGRAMA_FES_PROCESO_CARGA;
            $proceso_activo = $delegado->ValidarEjecucionProcesoCarga();
            $respuesta["codigoRespuesta"] = 0;
        } catch (ValidacionException $ex) {
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = $ex->getMessage();
            $respuesta["datos"] = $ex->getData();
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
