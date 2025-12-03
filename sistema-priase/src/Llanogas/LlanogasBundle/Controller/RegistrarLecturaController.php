<?php

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Delegado\LecturasDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;

/**
 * Clase encargada de majenar el CRUD de lecturas de una suscripción.
 */
class RegistrarLecturaController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $response = $this->render('LlanogasLlanogasBundle:Lectura:gestionarLectura.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * permite filtar las lecturas de una suscripcion
     * @return array
     * @throws Si no hay diligenciado el id de suscripcion
     */
    public function filtrarLecturasAction() {
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
            $lecturasDelegado = new LecturasDelegado($this, $sesion);
            $respuesta['suscripciones'] = $lecturasDelegado->filtrarLecturas($idSuscripcion, $codigoAnterior, $documento);
            $respuesta["codigoRespuesta"] = (empty($respuesta['suscripciones']) ? 0 : 1);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * se visualiza el detalle de la propiedad por identificador de medidor
     * @return array
     */
    public function detallePropiedadAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idMedidor = $request->get('idmedidor');
            $lecturasDelegado = new LecturasDelegado($this, $sesion);
            $respuesta['propiedad'] = $lecturasDelegado->detallePropiedad($idMedidor);
            $respuesta["codigoRespuesta"] = (empty($respuesta['propiedad']) ? 0 : 1);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * permite mostar el historico de una suscripcion 
     * @return array
     */
    public function detalleHistoricoAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            $fechaInicial = $request->get('fechainicial');
            $fechaFinal = $request->get('fechafinal');

            if (empty($idSuscripcion) || empty($fechaFinal) || empty($fechaInicial)) {
                throw new MyException('Error en los parámetros de consulta');
            }
            $lecturasDelegado = new LecturasDelegado($this, $sesion);
            $respuesta['historico'] = $lecturasDelegado->encabezadoHistorico($idSuscripcion, $fechaInicial, $fechaFinal);
            $respuesta["codigoRespuesta"] = (empty($respuesta['historico']) ? 0 : 1);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * lista las novedades existentes
     * @return array
     */
    public function obtenerNovedadAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $lecturasDelegado = new LecturasDelegado($this, $sesion);
            $respuesta['novedad'] = $lecturasDelegado->obtenerNovedad();
            $respuesta["codigoRespuesta"] = (empty($respuesta['novedad']) ? 0 : 1);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Lista las anomalias existentes
     * @return array
     */
    public function obtenerAnomaliaAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $lecturasDelegado = new LecturasDelegado($this, $sesion);
            $respuesta['anomalia'] = $lecturasDelegado->obtenerAnomalia();
            $respuesta["codigoRespuesta"] = (empty($respuesta['anomalia']) ? 0 : 1);
            $respuesta["codigoRespuesta"] = (empty($respuesta['anomalia']) ? 0 : 1);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function consultarTercerosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            //Util::validarPeticion($this);
            $lecturasDelegado = new LecturasDelegado($this, $sesion);
            $nombre = $request->get('nombre');
            $respuesta['terceros'] = $lecturasDelegado->consultarTerceros($nombre);
            $respuesta["codigoRespuesta"] = 1;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     *  permite obtener el encabezado de la lectura activa de la suscripcion
     * @return array
     */
    public function obtenerEncabezadoLecturaAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            if (empty($idSuscripcion)) {
                throw new MyException('Error, la suscripción es obligatoria', -1);
            }
            $lecturasDelegado = new LecturasDelegado($this, $sesion);
            $encabezadoLectura = $lecturasDelegado->obtenerEncabezadoLectura($idSuscripcion);
            if (empty($encabezadoLectura)) {
                throw new MyException('Error, la suscripción no tiene un encabezado de lectura', -1);
            }
            $detalleLecturas = $lecturasDelegado->detalleLectura($encabezadoLectura['idlecturaencabezado']);
            $encabezadoLectura['detalleslectura'] = $detalleLecturas;
            $respuesta['encabezado'] = $encabezadoLectura;
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = 'Se consultó correctamente los datos';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Permite insertar una nueva lectura,actualizar y/o eliminar
     * @return array
     */
    public function insertarLecturaAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $datos = $request->get('datos');
            if (!is_array($datos)) {
                throw new MyException('Error, no se encontraron cambios.', -1);
            }
            Util::validarPeticion($this);
            $lecturaDelegado = new LecturasDelegado($this, $sesion);
            $lecturaDelegado->procesarLecturas($datos);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['mensaje'] = 'Se guardó correctamente el registro';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
