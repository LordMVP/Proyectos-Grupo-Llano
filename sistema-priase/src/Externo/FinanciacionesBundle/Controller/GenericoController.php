<?php

namespace Externo\FinanciacionesBundle\Controller;

use Doctrine\DBAL\Connection;
use Exception;
use Externo\FinanciacionesBundle\ValidacionExcepcion;
use Llanogas\LlanogasBundle\Utiles\Hash;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\DependencyInjection\ContainerInterface;
use const CLAVE_CIFRADO;

class GenericoController extends Controller {

    /**
     *
     * @var Connection 
     */
    protected $conexion;

    /**
     * Guarda todos los parámetros de la petición en un array 
     * @var array 
     */
    protected $parametros;

    public function setContainer(ContainerInterface $container = null) {
        parent::setContainer($container);
        $this->iniciarlizar();
    }

    protected function iniciarlizar() {
        $this->conexion = Util::getConexion($this);
        $this->parametros();
    }

    /**
     * Construye un objeto de respuesta con un código 1 o 0, evaluando
     * los datos, en este caso puede ser un objeto, arreglo o booleano.
     * @param type $datos
     * @param type $mensaje
     * @return type
     */
    public function construyeRespuesta($datos, $mensaje = null) {
        $respuesta['codigo'] = is_bool($datos) ? (($datos == true) ? 1 : 0) : (empty($datos) ? 0 : 1);
        $respuesta['mensaje'] = empty($mensaje) ? 'Consulta ejecutada correctamente' : $mensaje;
        $respuesta['datos'] = $datos;
        return Util::construyeRespuesta($respuesta);
    }

    public function construyeRespuestaValidacion($errors, $mensaje = null) {
        $respuesta['codigo'] = -1;
        $respuesta['mensaje'] = empty($mensaje) ? 'Debe completar los campos correctamente.' : $mensaje;
        $respuesta['datos'] = $errors;
        return Util::construyeRespuesta($respuesta);
    }

    public function construyeRespuestaOK($mensaje = null) {
        $respuesta['codigo'] = 1;
        $respuesta['mensaje'] = empty($mensaje) ? 'Consulta ejecutada correctamente' : $mensaje;
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * 
     * @param Exception $e
     * @return type
     */
    public function construyeRespuestaError($e) {
        if ($e instanceof \Externo\FinanciacionesBundle\ValidacionExcepcion) {
            $respuesta['codigo'] = $e->getCodigo();
            $respuesta['mensaje'] = $e->getMensaje();
            $respuesta['datos'] = $e->getDatos();
            return Util::construyeRespuesta($respuesta);
        }
        if ($e instanceof \Llanogas\LlanogasBundle\MyException) {
            $respuesta['codigo'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
            return Util::construyeRespuesta($respuesta);
        }
        $respuesta['codigo'] = -1;
        $respuesta['mensaje'] = $e->getMessage();
        return Util::construyeRespuesta($respuesta);
    }

    public function comprobarSesionAction() {
        $token = $this->getRequest()->headers->get('token');
        $tokenSession = $request->getSession()->get("token");
        $validacion = ($token != null && $tokenSession != null) && ($token == $tokenSession);
        if ($validacion) {
            //Obtenemos el objeto.
            $objeto = Hash::decrypt($token, CLAVE_CIFRADO);
            $objeto = json_decode($objeto, true);
        }
        return $this->construyeRespuesta($validacion);
    }

    /**
     * Procesa todos los parámetros de la petición
     */
    private function parametros() {
        $paramsGET = array();
        $parametrosGET = $this->getRequest()->query->all();
        foreach ($parametrosGET as $key => $value) {
            $paramsGET[trim($key)] = trim($value);
        }
        $paramsPOST = array();
        $parametrosPOST = $this->getRequest()->request->all();
        foreach ($parametrosPOST as $key => $value) {
            $paramsPOST[trim($key)] = trim($value);
        }
        $paramsPOST["ip"] = $this->getRequest()->headers->get('ip');
        $this->parametros = array_merge($paramsGET, $paramsPOST);
    }

    /**
     * Información del usuario que está en el sistema
     * @return type (
     *              idacceso,idusuario,cedula,
     *              usuario,idempresa,empresa,
     *              idperfil
     *            )
     */
    public function getSesion() {
        $token = $this->getRequest()->headers->get('token');
        if (empty($token)) {
            throw new \Llanogas\LlanogasBundle\MyException('Se ha cerrado la sesión y debe de iniciar nuevamente', -2);
        }
        $objeto = Hash::decrypt($token, CLAVE_CIFRADO);
        $sesion = (array) $objeto->data;
        return $sesion;
    }

    public function getSesionPHP() {
        $sesionPhp = Util::iniciarSesion($this);
        $sesion['idusuario'] = $sesionPhp->get('idusuario');
        $sesion['idempresa'] = $sesionPhp->get('idempresa');
        $sesion['idperfil'] = $sesionPhp->get('idperfil');
        $sesion['usuarionit'] = $sesionPhp->get('usuarionit');
        $sesion['empresa'] = $sesionPhp->get('empresa');
        return $sesion;
    }

}
