<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Delegado\LecturasDelegado;
use Llanogas\LlanogasBundle\Delegado\CerrarLecturasDelegado;

/**
 * Description of CerrarLecturaController
 *
 * @author sergio vargas
 */
class CerrarLecturaController extends Controller {

    //put your code here
    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $delLecturas = new LecturasDelegado($this, $sesion);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $lisParametros['ciclos'] = $delLecturas->getCicloActivos();
        $response = $this->render('LlanogasLlanogasBundle:Lectura:CerrarLectura.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    // <editor-fold desc="Validaciond e ciclos activos">  
    public function evaluarCiclosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            Util::validarPeticion($this);
            $ciclos = $request->get("idciclo");
            if (!is_numeric($ciclos)) {
                throw new MyException("No hay ciclos activos para procesar", -1);
            }
            $delCerrarLect = new CerrarLecturasDelegado($this, $sesion);
            $delCerrarLect->validarEncabezado($ciclos);
            $respuesta["ciclos"] = "validacion de ciclos exitosa.";
            $respuesta['codigoRespuesta'] = 4; // asigna procesar lecturas
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensajeError'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function obtenerResumenAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $delCerrarLect = new CerrarLecturasDelegado($this, $sesion);
            //Obtiene el resumen de la ejecución del proceso
            $respuesta['resumen'] = $delCerrarLect->ObtenerResumen();
            $respuesta['codigoRespuesta'] = 1;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensajeError'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function obtenerEstadoProgramaAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $delCerrarLect = new CerrarLecturasDelegado($this, $sesion);
            //Valida si hay un proceso corriendo 
            $respuesta['estado'] = $delCerrarLect->ObtenerEstado();
            $respuesta['codigoRespuesta'] = 1;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensajeError'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function procesarCiclosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            //Validar si la petición fue por POST
            Util::validarPeticion($this);
            $idciclo = $request->get("idciclo");
            $idempresa = $sesion->get('idempresa');
            $idacceso = $sesion->get('idacceso');
            $idusuario = $sesion->get('idusuario');

            if (!is_numeric($idciclo)) {
                throw new MyException("el ciclo a procesar no es númerico", -1);
            }

            $delCerrarLect = new CerrarLecturasDelegado($this, $sesion);
            $respuesta = $delCerrarLect->lanzarProcesoSegundoPlano($idciclo, $this->container, $idempresa, $idusuario, $idacceso);
            $respuesta["mensaje"] = "proceso de lecturas lanzado con éxito";
            $respuesta['codigoRespuesta'] = 1;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensajeError'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    // </editor-fold>
}
