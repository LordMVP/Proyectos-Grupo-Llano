<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\LiquidacionesDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Realiza la gestión de la una liquidación
 */
class GestionarLiquidacionController extends Controller {

    /**
     *  Renderiza la página de gestionar una liquidación
     * @return html
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $liquidacionesDelegado = new LiquidacionesDelegado($this, $sesion);
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $lisParametros['listaclasificaciones'] = $liquidacionesDelegado->cargarComboClasificacion();
        $response = $this->render('LlanogasLlanogasBundle:Liquidacion:gestionarLiquidacion.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta los documentos de acuerdo a una clasificación 
     * VE=Venta CO=Convenio CA=Campña LI=Liquidación FI= financiación
     * @return json lista de doucmentos de acuerdo a la clasificación de la financiación
     */
    public function getDocumentosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $liquidacionesDelegado = new LiquidacionesDelegado($this, $sesion);
            Util::validarPeticion($this);
            $clasificacion = $request->get('idclasificacion');
            if (empty($clasificacion)) {
                throw new MyException("Error, clasificación obligatoria.", -1);
            }
            $documentos = $liquidacionesDelegado->getDocumentos($clasificacion);
            $respuesta["codigoRespuesta"] = (empty($documentos) ? 0 : 1);
            $respuesta["datos"] = $documentos;
            $respuesta["mensaje"] = (empty($documentos)) ? "No se encontraron documentos" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta todos los tipos de documentos de acuerdo del
     * identificador del documento
     * @return json lista de tipos de documentos 
     */
    public function getTiposDocumentosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $liquidacionesDelegado = new LiquidacionesDelegado($this, $sesion);
            $documento = $request->get("iddocumento");
            if (!is_numeric($documento)) {
                throw new MyException("Error, el documento es obligatorio.", -1);
            }
            $tiposDocumentos = $liquidacionesDelegado->getTipoDocumento($documento);
            $respuesta["codigoRespuesta"] = (empty($tiposDocumentos) ? 0 : 1);
            $respuesta["datos"] = $tiposDocumentos;
            $respuesta["mensaje"] = (empty($tiposDocumentos)) ? "No hay tipos de documentos" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta las liquidaciones que se encuentran registradas en uni_ y para ser parametrizadas en 
     * las tablas de liq_
     * @return json lista de liquidaciones sin parametrizar
     */
    public function getLiquidacionesAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $liquidacion = $request->get("liquidacion");
            if (empty($liquidacion)) {
                throw new MyException('Error, la liquidacion es obligatoria.', -1);
            }
            $liquidacionesDelegado = new LiquidacionesDelegado($this, $sesion);
            $liquidaciones = $liquidacionesDelegado->getLiquidacionesSinParametrizar($liquidacion);
            $respuesta["codigoRespuesta"] = (empty($liquidaciones) ? 0 : 1);
            $respuesta["datos"] = $liquidaciones;
            $respuesta["mensaje"] = (empty($liquidaciones)) ? "No se encontraron liquidaciones" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta todos los conceptos que están parametrizados para la empresa 
     * y/o que se encuentren en uni_unidad
     * @return type
     * @throws MyException
     */
    public function getConceptosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idLiquidacion = $request->get("idliquidacion");
            $concepto = $request->get("concepto");
            if (empty($concepto)) {
                throw new MyException('Error, el concepto es obligatorio.', -1);
            }
            $liquidacionesDelegado = new LiquidacionesDelegado($this, $sesion);
            $conceptos = $liquidacionesDelegado->getConceptosPorLiquidacion($concepto, $idLiquidacion);
            $respuesta["codigoRespuesta"] = (empty($conceptos) ? 0 : 1);
            $respuesta["datos"] = $conceptos;
            $respuesta["mensaje"] = (empty($conceptos)) ? "No se encontraron conceptos" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta el municipio de acuerdo al perfil del usuario
     * @return json lista de municipios
     */
    public function getMunicipiosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $municipio = $request->get("municipio");
            $liquidacionesDelegado = new LiquidacionesDelegado($this, $sesion);
            $municipios = $liquidacionesDelegado->getMunicipio($municipio);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["datos"] = $municipios;
            $respuesta["mensaje"] = "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los tipos de uso que van a aplicar la liquidación
     * que se está parametrizando
     * @return json lista de tipos de uso
     */
    public function getTiposUsosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $respuesta["codigoRespuesta"] = -1;
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $liquidacionesDelegado = new LiquidacionesDelegado($this, $sesion);
            $tiposUsos = $liquidacionesDelegado->getTiposDeUsos();
            $respuesta["codigoRespuesta"] = (empty($tiposUsos) ? 0 : 1);
            $respuesta["datos"] = $tiposUsos;
            $respuesta["mensaje"] = (empty($tiposUsos)) ? "No se encontraron tipos de usos" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los barrios de acuerdo al municipio y a la empresa 
     * que está en sesión
     * @return json lista de barrios
     */
    public function getBarriosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $respuesta["codigoRespuesta"] = -1;
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $municipios = $request->get("municipios");
            $barrio = $request->get("barrio");
            if (empty($barrio)) {
                throw new MyException('Error, el barrio es obligatorio', -1);
            }
            $liquidacionesDelegado = new LiquidacionesDelegado($this, $sesion);
            $barrios = $liquidacionesDelegado->getBarrios($municipios, $barrio);
            $respuesta["codigoRespuesta"] = (empty($barrios) ? 0 : 1);
            $respuesta["datos"] = $barrios;
            $respuesta["mensaje"] = (empty($barrios)) ? "No se encontraron barrios" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta si se va aplicar una liquidación para unos usuarios específicos
     * @return json lista de suscripciones
     */
    public function getSuscripcionesAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $respuesta["codigoRespuesta"] = -1;
            $request = $this->getRequest();
            $parametros = array();
            Util::validarPeticion($this);
            $idSuscripcion = $request->get("idsuscripcion");
            $cedula = $request->get("cedula");
            $codigoAnterior = $request->get("codigoanterior");
            $municipios = $request->get("municipios");
            $parametros["idsuscripcion"] = $idSuscripcion;
            $parametros["cedula"] = $cedula;
            $parametros["codigoanterior"] = $codigoAnterior;
            $parametros["codigosmunicipios"] = $municipios;
            if (empty($idSuscripcion) && empty($cedula) && empty($codigoAnterior) && empty($municipios)) {
                throw new MyException('Error, debe ingresar al menos un parámetro de búsqueda', -1);
            }
            $liquidacionesDelegados = new LiquidacionesDelegado($this, $sesion);
            $suscripciones = $liquidacionesDelegados->getSuscripciones($parametros);
            $respuesta["codigoRespuesta"] = (empty($suscripciones) ? 0 : 1);
            $respuesta["datos"] = $suscripciones;
            $respuesta["mensaje"] = (empty($suscripciones)) ? "No se enconraron suscripciones" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Guarda la nueva liquidación
     * @return json resultado de la operación 
     */
    public function guardarLiquidacionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $infoLiquidacion = $request->get("liquidacion");
            $idLiquidacion = $infoLiquidacion["idliquidacion"];
            $usuario = $sesion->get('idusuario');
            $liquidacionesDelegado = new LiquidacionesDelegado($this, $sesion);
            //Se crea la nueva liquidación
            $liquidacionesDelegado->insertarLiquidacion($infoLiquidacion, $usuario);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = 'Se registró la liquidación correctamente con número: ' . $idLiquidacion;
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se consulta una liquidación previamente registrada 
     * para ser modificada y/o consultada
     * @return type
     */
    public function getLiquidacionAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idLiquidacion = $request->get("idliquidacion");
            $liquidacionesDelegado = new LiquidacionesDelegado($this, $sesion);
            $liquidacion = $liquidacionesDelegado->consultarLiquidacion($idLiquidacion);
            $respuesta["codigoRespuesta"] = (empty($liquidacion) ? 0 : 1);
            $respuesta["datos"] = $liquidacion;
            $respuesta["mensaje"] = (empty($liquidacion)) ? "No se encontraron liquidaciones" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Valida que un concepto se pueda eliminar 
     * @return json resultado de la operación
     */
    public function getConceptosEliminarAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idLiquidacion = $request->get("idliquidacion");
            $idConcepto = $request->get("idconcepto");
            if (!is_numeric($idConcepto)) {
                throw new MyException("Error, debe seleccionar conceptos a eliminar", -1);
            }
            $liquidacionesDelegado = new LiquidacionesDelegado($this, $sesion);
            $suscripcion = $liquidacionesDelegado->consultarConceptosEliminar($idLiquidacion, $idConcepto);
            $respuesta["codigoRespuesta"] = (empty($suscripcion) ? 0 : 1);
            $respuesta["datos"] = $suscripcion;
            $respuesta["mensaje"] = (empty($suscripcion)) ? "No se encontró suscripción" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los municipios a eliminar de una liquidación de acuerdo 
     * al perfil del usuario que ha iniciado sesión
     * @return json resultado de la operación
     */
    public function getMunicipiosEliminarAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idLiquidacion = $request->get("idliquidacion");
            $idMunicipio = $request->get("idmunicipio");
            if (!is_numeric($idMunicipio)) {
                throw new MyException("Error, seleccione municipios a eliminar.", -1);
            }
            $liquidacionesDelegado = new LiquidacionesDelegado($this, $sesion);
            $suscripcion = $liquidacionesDelegado->consultarMunicipiosEliminar($idLiquidacion, $idMunicipio);
            $respuesta["codigoRespuesta"] = (empty($suscripcion) ? 0 : 1);
            $respuesta["datos"] = $suscripcion;
            $respuesta["mensaje"] = (empty($suscripcion)) ? "No se encontraron municipios" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta si se puede eliminar un tipo de uso
     * se verifica que no esté asociado a ninguna suscripción
     * @return type
     */
    public function getTipoUsosEliminarAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idLiquidacion = $request->get("idliquidacion");
            $idTipoUso = $request->get("idtipouso");
            if (!is_numeric($idTipoUso)) {
                throw new MyException("Error, seleccione tipo de uso a eliminar", -1);
            }
            $liquidacionesDelegado = new LiquidacionesDelegado($this, $sesion);
            $suscripcion = $liquidacionesDelegado->consultarTipoUsosEliminar($idLiquidacion, $idTipoUso);
            $respuesta["codigoRespuesta"] = (empty($suscripcion) ? 0 : 1);
            $respuesta["datos"] = $suscripcion;
            $respuesta["mensaje"] = (empty($suscripcion)) ? "No se encontró tipo de uso" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta una liquidación que se encuentra parametrizada
     * @return json lista de liquidaciones parametrizadas
     */
    public function getLiquidacionesParametrizadasAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $liquidacionesDelegado = new LiquidacionesDelegado($this, $sesion);
            Util::validarPeticion($this);
            $liquidacion = $request->get('liquidacion');
            $liquidaciones = $liquidacionesDelegado->consultarLiquidacionesParemetrizadas($liquidacion);
            $respuesta["codigoRespuesta"] = (empty($liquidaciones) ? 0 : 1);
            $respuesta["datos"] = $liquidaciones;
            $respuesta["mensaje"] = (empty($liquidaciones)) ? "No se encontraron documentos" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los municipios que puede consultar un 
     * usuario
     * @return json lista de municipios 
     */
    public function getMunicipiosPorUsuarioAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $liquidacionesDelegado = new LiquidacionesDelegado($this, $sesion);
            $municipios = $liquidacionesDelegado->consultarMunicipiosUsuario();
            $respuesta["codigoRespuesta"] = (empty($municipios) ? 0 : 1);
            $respuesta["datos"] = $municipios;
            $respuesta["mensaje"] = (empty($municipios)) ? "No se encontraron municipios" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
