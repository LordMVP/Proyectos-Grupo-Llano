<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\CondonarCarteraCorrienteDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Clase encargada de condonar facturas a usuarios morosos
 * pero que no se han castigado
 */
class CondonarCarteraCorrienteController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $condonarCarteraCorrienteDelegado = new CondonarCarteraCorrienteDelegado($this, $sesion);
        //cargar el combo de medios de pago
        $lisParametros["cmbMotivosNota"] = $condonarCarteraCorrienteDelegado->cargarComboDb();
        $response = $this->render('LlanogasLlanogasBundle:Cartera:CondonarCarteraCorriente.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function getMunicipiosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            Util::validarPeticion($this);
            $municipio = $request->get("municipio");
            if (empty($municipio)) {
                throw new MyException('Error, el municipio es obligatorio', -1);
            }
            $condonarCarteraCorrienteDelegado = new CondonarCarteraCorrienteDelegado($this, $sesion);
            $municipios = $condonarCarteraCorrienteDelegado->obtenerMunicipios($municipio);
            $respuesta["codigoRespuesta"] = (empty($municipios) ? 0 : 1);
            $respuesta["datos"] = $municipios;
            $respuesta["mensaje"] = (empty($municipios)) ? "No se encontraron municipios" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Obtiene la informacion de una suscripcion
     * @return json Resultado con la informacion de la suscripcion
     * @throws MyException
     */
    public function getSuscripcionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            Util::validarPeticion($this);
            $idMunicipio = $request->get("idmunicipio");
            $idSuscripcion = $request->get("idsuscripcion");
            $codigoAnterior = $request->get("codigoanterior");
            if (empty($idMunicipio)) {
                throw new MyException("Error, municipio obligatorio. ", -1);
            }
            if (!is_numeric($idSuscripcion) && empty($codigoAnterior)) {
                throw new MyException("Error, la suscripción es numérica y obligatoria.", -1);
            }
            $condonarCarteraCorrienteDelegado = new CondonarCarteraCorrienteDelegado($this, $sesion);
            $suscripcion = $condonarCarteraCorrienteDelegado->filtrarSuscripciones($idMunicipio, $idSuscripcion, $codigoAnterior);
            $respuesta["codigoRespuesta"] = (empty($suscripcion) ? 0 : 1);
            $respuesta["datos"] = $suscripcion;
            $respuesta["mensaje"] = (empty($suscripcion)) ? "No se encontraron suscripciones" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Obtiene la informacion de las facturas de una suscripcion
     * @return json Resultado con la informacion de las facturas de la
     * suscripcion
     */
    public function getFacturasSuscripcionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            Util::validarPeticion($this);
            $idSuscripcion = $request->get("idsuscripcion");
            $condonarCarteraCorrienteDelegado = new CondonarCarteraCorrienteDelegado($this, $sesion);
            $facturas = $condonarCarteraCorrienteDelegado->obtenerFacturasCarteraCorriente($idSuscripcion);
            $respuesta["codigoRespuesta"] = (empty($facturas) ? 0 : 1);
            $respuesta["datos"] = $facturas;
            $respuesta["mensaje"] = (empty($facturas)) ? "Suscripción sin facturas" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Genera la condonacion de cartera a una suscripcion
     * @return json Resultado con la informacion de la condonacion
     */
    public function generarCondonacionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            Util::validarPeticion($this);
            $suscripcion = $request->get("suscripcion");
            $idMotivo = $request->get("idmotivo");
            $descripcion = $request->get("descripcion");
            $condonarCarteraCorrienteDelegado = new CondonarCarteraCorrienteDelegado($this, $sesion);
            $nota = $condonarCarteraCorrienteDelegado->generarCondonacion($suscripcion, $idMotivo, $descripcion);
            $respuesta["codigoRespuesta"] = (empty($nota) ? 0 : 1);
            $respuesta["datos"] = $nota;
            $respuesta["mensaje"] = (empty($nota)) ? "Error registrando la condonación" : "La condonación se ha registrado con el id: " . $nota;
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los permisos para activar botones de seleccion de facturas para condonacion de cartera a una suscripcion
     * @return json Resultado con la informacion de permisos
     */		
    public function consultarPermisosBotonesCondonacionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            Util::validarPeticion($this);
            $suscripcion = $request->get("idprograma");
            $condonarCarteraCorrienteDelegado = new CondonarCarteraCorrienteDelegado($this, $sesion);
            $permisos = $condonarCarteraCorrienteDelegado->consultarPermisosBotonesFacturas();
            $respuesta["codigoRespuesta"] = (empty($permisos) ? 0 : 1);
            $respuesta["datos"] = $permisos;
            $respuesta["mensaje"] = (empty($permisos)) ? "El Usuario No tiene registrado permisos para consultar Facturas" : "consulta exitosa...";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

     /**
     * Obtiene la informacion de las facturas de una suscripcion
     * @return json Resultado con la informacion de las facturas de la
     * suscripcion
     */

    public function getFacturasIntCorrienteSuscripcionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            Util::validarPeticion($this);
            $idSuscripcion = $request->get("idsuscripcion");
            $condonarCarteraCorrienteDelegado = new CondonarCarteraCorrienteDelegado($this, $sesion);
            $facturas = $condonarCarteraCorrienteDelegado->obtenerFacturasCarteraIntCorriente($idSuscripcion);
            $respuesta["codigoRespuesta"] = (empty($facturas) ? 0 : 1);
            $respuesta["datos"] = $facturas;
            $respuesta["mensaje"] = (empty($facturas)) ? "Suscripción sin facturas" : "La consulta se realizó correctamente";

        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }



}
