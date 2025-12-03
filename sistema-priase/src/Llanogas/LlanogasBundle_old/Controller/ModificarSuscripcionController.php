<?php

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Delegado\SuscripcionesDelegado;
use Llanogas\LlanogasBundle\MyException;

/**
 * Clase encargada de administrar y gestionar las actualizaciones de una suscripción
 * Se puede modificar el estado, el ciclo, el tipo de uso, agregar conceptos como 
 * ICBF, excento, fecha de inicio y fin del estado
 */
class ModificarSuscripcionController extends Controller {

    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $lisParametros['listamunicipios'] = $suscripcionesDelegado->getMunicipiosPorPerfil(PROGRAMA_SUSCRIPCIONES);
        $lisParametros['lineamatriz'] = $suscripcionesDelegado->getPermisoLineaMatriz(PROGRAMA_MODIFICAR_SUSCRIPCIONES);
        $response = $this->render('LlanogasLlanogasBundle:Suscripcion:modificarSuscripcion.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta todos los conceptos que tiene relacionados a la suscripción que se encuentran 
     * en la tabla cosu_
     * @return json lista de conceptos
     */
    public function getConceptosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $suscripcionDelegado = new SuscripcionesDelegado($this, $sesion);
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            if (empty($idSuscripcion)) {
                throw new MyException('Error, suscripción obligatoria', -1);
            }
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['conceptos'] = $suscripcionDelegado->getConceptosSuscripcion($idSuscripcion);
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los ciclos que le aplican a una suscripción
     * de acuerdo a los parámetros del periodo
     * @return json lista de los ciclos 
     */
    public function getCiclosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $suscripcionDelegado = new SuscripcionesDelegado($this, $sesion);
            Util::validarPeticion($this);
            $idCiclo = $request->get('idciclo');
            $idRuta = $request->get('idruta');
            if (empty($idCiclo) || empty($idRuta)) {
                throw new MyException('Error, el ciclo y la ruta son obligatorios', -1);
            }
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['ciclos'] = $suscripcionDelegado->getCiclos($idRuta, $idCiclo);
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    /**
     * Consulta las suscripciones que estan vinculads a la linea matriz
     * en la tabla cosu_
     * @return json lista de conceptos
     */
    public function getClienteVinculadoLineaMatrizAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $suscripcionDelegado = new SuscripcionesDelegado($this, $sesion);
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            if (empty($idSuscripcion)) {
                throw new MyException('Error, suscripción obligatoria', -1);
            }
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['clientelineamatriz'] = $suscripcionDelegado->getClienteLineaMatriz($idSuscripcion);
            if(empty($respuesta['clientelineamatriz'])){
                $respuesta['codigoRespuesta'] = 0;
                $respuesta['mensaje'] = "No se encontro cliente para linea matriz";
            }
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
     /**
     * retira las suscripciones que pertenecen a la linea Matriz
     * en la tabla cosu_
     * @return json lista de conceptos
     */
    public function setRetiraClienteVinculadoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $suscripcionDelegado = new SuscripcionesDelegado($this, $sesion);
            Util::validarPeticion($this);
            $SuscripcionesVinculadas = $request->get('suscripcionesVinculadas');
            if (empty($SuscripcionesVinculadas)) {
                throw new MyException('Error, Seleccionar al menos una suscripción VInculada', -1);
            }
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $suscripcionDelegado->setRetiraClienteLineaMatriz($SuscripcionesVinculadas);
           
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    /**
     * Busca las suscripciones para vincular a linea Matriz
     * en la tabla cosu_
     * @return json lista de conceptos
     */
    public function getBuscaClienteLineaMatrizAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $suscripcionDelegado = new SuscripcionesDelegado($this, $sesion);
            Util::validarPeticion($this);
            $buscarSuscripcion = $request->get('data');
            if (empty($buscarSuscripcion)) {
                throw new MyException('Error, Seleccionar un criterio de filtro', -1);
            }
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['suscripcionAVincular'] = $suscripcionDelegado->buscaSucripcionLineaMatriz($buscarSuscripcion);
            if(empty($respuesta['suscripcionAVincular'])){
                $respuesta['codigoRespuesta'] = -1;
                $respuesta['mensaje'] = 'No se encontro el cliente referenciado en el filtro de busqueda ';
            }
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = "getBuscaClienteLineaMatrizAction ".$exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    /**
     * Busca las suscripciones para vincular a linea Matriz
     * en la tabla cosu_
     * @return json lista de conceptos
     */
    public function clienteParaVincularLineaMatrizAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $suscripcionDelegado = new SuscripcionesDelegado($this, $sesion);
            Util::validarPeticion($this);
            $buscarSuscripcion = $request->get('data');
            if (empty($buscarSuscripcion)) {
                throw new MyException('Error, Seleccionar un criterio de filtro', -1);
            }
            $respuesta['suscripcionInsertada'] = $suscripcionDelegado->validaSucripcionEstaVinculadaLineaMatriz($buscarSuscripcion);
            $respuesta['codigoRespuesta'] =  $respuesta['suscripcionInsertada']['insert'] == 1 ?  1: -3;
            $respuesta['mensaje'] = empty($respuesta['suscripcionInsertada']) ? 'Suscripcion vinculada a una line matriz' : 'Se inserto correctamente';
           
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
