<?php

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Delegado\SuscripcionesDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Delegado\RegistrarVentasDelegado;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Models\GenericoModel;

/**
 * Clase que registra y guarda una suscripción nueva
 */
class SuscripcionesController extends Controller {

    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $lisParametros['listamunicipios'] = $suscripcionesDelegado->getMunicipiosPorPerfil(PROGRAMA_SUSCRIPCIONES);
        $response = $this->render('LlanogasLlanogasBundle:Suscripcion:gestionarSuscripcion.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function filtrarSuscriptorAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
            $idSuscriptor = $request->get('idsuscriptor');
            $cedula = $request->get('cedula');
            $idTercero = $request->get('idtercero');
            if (!empty($idSuscriptor) && !is_numeric($idSuscriptor)) {
                throw new MyException('El campo id Suscriptor debe ser numerico', -1);
            }
            $suscriptores = $suscripcionesDelegado->filtrarSusriptor($idSuscriptor, $cedula, $idTercero);
            $respuesta['codigoRespuesta'] = empty($suscriptores) ? 0 : 1;
            $respuesta['suscriptores'] = $suscriptores;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = ($e->getCode() < 0) ? $e->getCode() : -1;
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function buscarPropiedadAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
            $idTercero = $request->get('idtercero');
            $listaPropiedades = $suscripcionesDelegado->getPropiedad($idTercero);
            $respuesta['codigoRespuesta'] = empty($listaPropiedades) ? 0 : 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['propiedades'] = $listaPropiedades;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = ($e->getCode() < 0) ? $e->getCode() : -1;
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getTiposSuscripcionAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
            $idConvenio = $request->get('idconvenio');
            $idMunicipio = $request->get('idmunicipio');
            if (!is_numeric($idMunicipio) || !is_numeric($idConvenio)) {
                throw new MyException('Error, Debe seleccionar un municipio y/o convenio', -1);
            }
            $listaTiposSuscripcion = $suscripcionesDelegado->getTiposSuscripcion($idConvenio, $idMunicipio);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['tipossuscripcion'] = $listaTiposSuscripcion;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getTiposUsoSuscripcionAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
            $idTipoSuscripcion = $request->get('idtiposuscripcion');
            if (!is_numeric($idTipoSuscripcion)) {
                throw new MyException('Error, Debe seleccionar un tipo de suscripción', -1);
            }
            $listaTiposUsoSuscripcion = $suscripcionesDelegado->getTiposUsoSuscripcion($idTipoSuscripcion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['tiposusosuscripcion'] = $listaTiposUsoSuscripcion;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getTiposUsoCicloAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
            $idCiclo = $request->get('idciclo');
            if (!is_numeric($idCiclo)) {
                throw new MyException('Error, Debe seleccionar un ciclo', -1);
            }
            $listaTiposUsoCiclo = $suscripcionesDelegado->getTiposUsoPorCiclo($idCiclo);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['tiposusosuscripcion'] = $listaTiposUsoCiclo;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getLiquidacionesAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
            $idCiclo = $request->get('idciclo');
            $idTipoUsoSuscripcion = $request->get('idtipousosuscripcion');
            $idMunicipio = $request->get('idmunicipio');
            if (!is_numeric($idMunicipio) || !is_numeric($idCiclo) || !is_numeric($idTipoUsoSuscripcion)) {
                throw new MyException('Error, Faltan parámetros para realizar la consulta. Es posible que no se carguen las liquidaciones ', -1);
            }
            $listaLiquidaciones = $suscripcionesDelegado->getLiquidaciones($idTipoUsoSuscripcion, $idCiclo, $idMunicipio);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['liquidaciones'] = $listaLiquidaciones;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getTercerosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $nombre = $request->get('nombre');
            if (empty($nombre)) {
                throw new MyException('Error, el nombre no debe estar vacío', -1);
            }
            $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
            $listaTerceros = $suscripcionesDelegado->getTerceros($nombre);
            $respuesta['codigoRespuesta'] = (empty($listaTerceros) ? 0 : 1);
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['terceros'] = $listaTerceros;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getRutaCicloAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idMunicipio = $request->get('idmunicipio');
            $idBarrio = $request->get('idbarrio');
            if (!is_numeric($idMunicipio) || !is_numeric($idBarrio)) {
                throw new MyException('Error, Debe seleccionar un municipio y/o barrio', -1);
            }
            $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
            $respuesta = $suscripcionesDelegado->getRutaCiclo($idMunicipio, $idBarrio);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getConceptosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idLiquidacion = $request->get('idliquidacion');
            $idSuscripcion = $request->get('idsuscripcion');
            if (!is_numeric($idLiquidacion)) {
                throw new MyException('Error, debe seleccionar una liquidación', -1);
            }
            if (empty($idSuscripcion)) {
                $idSuscripcion = -1;
            }
            $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
            $respuesta['conceptos'] = $suscripcionesDelegado->getConceptos($idLiquidacion, PROGRAMA_SUSCRIPCIONES, $idSuscripcion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function getInfoConceptosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idConcepto = $request->get('idconcepto');
            if (!is_numeric($idConcepto)) {
                throw new MyException('Error, debe seleccionar un concepto', -1);
            }
            $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
            $respuesta['concepto'] = $suscripcionesDelegado->getInfoConcepto($idConcepto);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function grabarSuscripcionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $datos = $request->get('datos');
//            print_r($datos);
            if (!isset($datos['suscripcion'])) {
                throw new MyException('Error, Debe diligenciar la información de la suscripción.', -1);
            }
            $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
            if (isset($datos['suscripcion']['accion'])) {
                $suscripcionesDelegado->modificarSuscripcion($datos);
                throw new MyException('Se modificó correctamente la suscripción.', 1);
            }
            if (!isset($datos['ruta'])) {
                throw new MyException('Error, Debe seleccionar una ruta.', -1);
            }
            $respuesta['idsuscripcion'] = $suscripcionesDelegado->nuevaSuscripcion($datos);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se creó la suscripción con el id: ' . $respuesta['idsuscripcion'];
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Buscar la suscripción 
     * @return type
     * @throws MyException
     */
    public function buscarSuscripcionAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idMunicipio = $request->get('idmunicipio');
            if (!empty($idMunicipio) && !is_numeric($idMunicipio)) {
                throw new MyException('Error en el Id del municipio', -1);
            }
            $parametros['idmunicipio'] = $idMunicipio;
            $parametros['idtercero'] = $request->get('idtercero');
            $parametros['cedula'] = $request->get('cedula');
            $parametros['direccion'] = $request->get('direccion');
            $parametros['numerocatastral'] = $request->get('numerocatastral');
            $parametros['idbarrio'] = $request->get('idbarrio');
            $parametros['numeropropiedad'] = $request->get('numeropropiedad');
            $parametros['idsuscripcion'] = $request->get('idsuscripcion');
            if (!empty($parametros['idsuscripcion']) && !is_numeric($parametros['idsuscripcion'])) {
                throw new MyException('Error, El Id Suscripción debe ser numerico', -1);
            }
            $parametros['idfactura'] = $request->get('idfactura');
            if (!empty($parametros['idfactura']) && !is_numeric($parametros['idfactura'])) {
                throw new MyException('Error, El Ide de Factura debe ser numerico', -1);
            }
            $parametros['codigoanterior'] = $request->get('codigoanterior');
            $parametros['ruta'] = $request->get('ruta');
            $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
            $suscripciones = $suscripcionesDelegado->getSuscripciones($parametros);
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
     * Consulta todos los barrios que tiene un municipio 
     * para poder realizar el filtro de la venta
     * @return type
     */
    public function getBarriosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idMunicipio = $request->get('idmunicipio');
            if (!is_numeric($idMunicipio)) {
                throw new MyException('Error, debe seleccionar un municicpio', -1);
            }
            $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
            $respuesta['barrios'] = $suscripcionesDelegado->getBarrios($idMunicipio);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta todos los detalles de la suscripción seleccionada
     * @return json con información de la suscripción
     */
    public function detalleSuscripcionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            if (!is_numeric($idSuscripcion)) {
                throw new MyException('Error, debe seleccionar una suscripción', -1);
            }
            $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
            $respuesta['resumensuscripcion'] = $suscripcionesDelegado->getDetalleSuscripcion($idSuscripcion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Verifica si un concepto se puede eliminar de una liquidación de facturas
     * @return json retorna si se puede o no eliminar el concepto
     */
    public function validarEliminacionConceptoAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idConcepto = $request->get('idconcepto');
            if (empty($idConcepto)) {
                throw new MyException('Debe seleccionar un concepto', -1);
            }
            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion);
            $validacion = $registrarVentasDelegado->validarEliminacionConcepto($idConcepto);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['eliminar'] = $validacion;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta las actividades económicas para poder 
     * agregar la información financiera 
     * @return type
     */
    public function getActividadEconomicaAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $suscripcionesDelegado = new SuscripcionesDelegado($this, $sesion);
            $respuesta['datos'] = $suscripcionesDelegado->getActividadEconomica();
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (Exception $exc) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
