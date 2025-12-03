<?php

namespace Libranza\LibranzaBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Libranza\LibranzaBundle\Delegado\ParametrizacionCreditoDelegado;

/**
 * Ejecuta el proceso de suspensiones y/o reconexiones.
 *
 * @author hrey
 */
class ParametrizacionScoringController extends Controller {

    /**
     *
     * @var ParametrizacionCreditoDelegado  
     */
    private $parametrizacionCreditoDelegado;

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros["empresa"] = $sesion->get("empresa");
        $this->parametrizacionCreditoDelegado = new ParametrizacionCreditoDelegado($this, $sesion);
        $lisParametros["productofinanciero"] = $this->parametrizacionCreditoDelegado->obtenerDestinoCredito();
        $lisParametros["formularios"] = $this->parametrizacionCreditoDelegado->obtenerFormularios();
        $response = $this->render("LibranzaBundle:ParametrizacionScoring:ParametrizacionScoring.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
    }
    public function obtenerFormulariosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $parametrizacionCreditoDelegado = new ParametrizacionCreditoDelegado($this, $sesion);
            $idProducto = $request->get('idproducto');
            $formularios = $parametrizacionCreditoDelegado->obtenerFormulariosParametrizado($idProducto);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['datos'] = $formularios;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function obtenerVariablesAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $parametrizacionCreditoDelegado = new ParametrizacionCreditoDelegado($this, $sesion);
            $idFormulario = $request->get('idformulario');
            $variablesCredito = $parametrizacionCreditoDelegado->obtenerVariablesCreditoFormulario($idFormulario);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['datos'] = $variablesCredito;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function obtenerFuncionesVariableAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $parametrizacionCreditoDelegado = new ParametrizacionCreditoDelegado($this, $sesion);
            $funciones = $parametrizacionCreditoDelegado->obtenerFunciones();
            $variables = $parametrizacionCreditoDelegado->obtenerVariablesCredito();
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['funciones'] = $funciones;
            $respuesta['variables'] = $variables;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function crearFormularioAction() {
        try {
            $sesion = Util::iniciarSesion($this);
             Util::validarPeticion($this);
            $request = $this->getRequest();
            $parametrizacionCreditoDelegado = new ParametrizacionCreditoDelegado($this, $sesion);
            $nombre = $request->get('nombre');
            $fechainicial = $request->get('fechainicial');
            $fechafinal = $request->get('fechafinal');
            $idproducto = $request->get('idproducto');
            $variablesCredito = $parametrizacionCreditoDelegado->insertarFormulario($nombre, $fechainicial, $fechafinal, $idproducto);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = "Se a creado el formulario satisfactoriamente.";
            $respuesta['datos'] = $variablesCredito;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function crearParametrizacionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $parametrizacionCreditoDelegado = new ParametrizacionCreditoDelegado($this, $sesion);
            $idproductofinanciero = $request->get('idproductofinanciero');
            $idformulario = $request->get('idformulario');
            $variables = $request->get('variables');
            $variablesCredito = $parametrizacionCreditoDelegado->insertarParametrizacion($idproductofinanciero, $idformulario, $variables); 
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = "Se ha guardado la parametrización correctamente";
            $respuesta['datos'] = $variablesCredito;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
