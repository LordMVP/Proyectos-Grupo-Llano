<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\NotasAutomaticasDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\ValidacionException;

/**
 * Clase encargada de administrar las notas directas, sobre las facturas
 */
class NotasAutomaticasController extends Controller {

    /**
     * Función que renderiza la página de notas automáticas por el método de directa.
     * @return html.twig con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $conexion = Util::getConexion($this);
        $idAcceso = $sesion->get('idacceso');
        $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $lisParametros['tiposuso'] = $notasDelegado->getTipoUso();
        $lisParametros['ciclos'] = $notasDelegado->getCiclos();
        $lisParametros['tipoafectacion'] = $notasDelegado->getTipo();
        $lisParametros['listatipodocumentos'] = $notasDelegado->getTiposDocumentos();
        $response = $this->render('LlanogasLlanogasBundle:Facturacion:notasautomaticas.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     *  Obtiene los tipos de documentos de acuerdo a una suscripción
     *  Se invoca cuando el usuario va a realizar una nota directa 
     *  a una suscripción específica
     * @return type
     * @throws MyException
     */
    public function getTiposDocumentosAction() {
        try {
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $request = $this->getRequest();
            $respuesta = array();
            $idAcceso = $sesion->get('idacceso');
            $idSuscripcion = $request->get('idsuscripcion');
            if (!is_numeric($idSuscripcion)) {
                throw new MyException('Error en la suscripción ', -1);
            }
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA, $idSuscripcion);
            $respuesta['datos'] = $notasDelegado->getTiposDocumentos();
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se consultó correctamente los programas';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se obtiene documentos de acuerdo al tipo de documento seleccionado,
     * si llega el parámetro de idsuscripción se consulta  los de la suscripción
     * @return json
     * @throws MyException Si no llega el tipo de documento
     */
    public function getDocumentosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idTipoDocumento = $request->get('idtipodocumento');
            if (empty($idTipoDocumento)) {
                throw new MyException('Error, el tipo de documento es obligatorio', -1);
            }
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $idSuscripcion = $request->get('idsuscripcion');
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA, $idSuscripcion);
            $listaDocumentos = $notasDelegado->getDocumentos($idTipoDocumento);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['documentos'] = $listaDocumentos;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta todas las liquidaciones de un conjunto de suscripciones o una en específico 
     * y tiene en cuenta el perfil del usuario
     * @return json lista de liquidaciones
     */
    public function getLiquidacionAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $request = $this->getRequest();
            $idTipoDocumento = $request->get('idtipodocumento');
            $idDocumento = $request->get('iddocumento');
            $idSuscripcion = $request->get('idsuscripcion');
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA, $idSuscripcion);
            if (empty($idTipoDocumento) || empty($idDocumento)) {
                throw new MyException('Error en los parámetros de búsqueda', -1);
            }
            $listaLiquidacion = $notasDelegado->getLiquidacion($idTipoDocumento, $idDocumento, $idSuscripcion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['liquidacion'] = $listaLiquidacion;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta todos los municipios que tiene 
     * parametrizado el usuario para el programa de nota directa
     * @return json lista de municipios 
     */
    public function getMunicipiosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $municipio = $request->get('municipio');
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $idSuscripcion = $request->get('idsuscripcion');
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA, $idSuscripcion);
            $listaMunicipio = $notasDelegado->getMunicipios($municipio);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['municipios'] = $listaMunicipio;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta todas las facturas de acuerdo a los criterios de 
     * búsqueda de la interfaz si es masivo o por una suscripción específica 
     * Y las inserta en la tabla temporal del proceso
     * @return json lista de facturas a afectar
     */
    public function getFacturasAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA);
            $parametros = $request->get('parametros')[0];
            if (empty($parametros) || !is_array($parametros)) {
                throw new MyException('Error, no hay parámetros de búsqueda', -1);
            }
            $tipo = $parametros['tipo'];
            $meses = $parametros['meses'];
            if (empty($tipo)) {
                throw new MyException('Error, debe seleccionar tipo de afectación', -1);
            }
            if (!($meses >= 0 )) {
                throw new MyException('Error, debe seleccionar mes a afectar', -1);
            }
            if ($tipo !== 'S') {
                $this->validarParametrosMasivo($parametros);
            }
            $idsuscripcion = isset($parametros['idsuscripcion']) ? $parametros['idsuscripcion'] : NULL;
            if ($tipo === 'S' && !is_numeric($idsuscripcion)) {
                throw new MyException('Error, la suscripción es obligatoria', -1);
            }
            $parametros['idprograma'] = PROGRAMA_NOTA_DIRECTA;
            $listaFacturas = $notasDelegado->getFacturas($parametros);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['facturas'] = $listaFacturas;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Método encargado de validar los procesos cuando se quiere ejecutar 
     * masivamente
     * @param array $parametros  parametros de la interfaz 
     * @throws MyException Error si no llega algún parámetro requerido
     */
    private function validarParametrosMasivo(array $parametros) {
        $idCiclo = $parametros['idciclo'];
        $idTipoUso = $parametros['idtipouso'];
        $idTipoDocumento = $parametros['idtipodocumento'];
        $idDocumento = $parametros['iddocumento'];
        $idLiquidacion = $parametros['idliquidacion'];
        if (empty($idCiclo)) {
            throw new MyException('Error, el ciclo es obligatorio', -1);
        }
        if (empty($idTipoUso)) {
            throw new MyException('Error, el tipo de uso es obligatorio', -1);
        }

        if (empty($idTipoDocumento) || empty($idDocumento)) {
            throw new MyException("Error, documento y tipo de documento obligatorios", -1);
        }
        if (empty($idLiquidacion)) {
            throw new MyException("Error, la liquidación es obligatoria ", 1);
        }
    }

    /**
     * Consulta todos los detalles de una factura original o padre
     * @return json lista de detalles de factura (dfac)
     */
    public function getDetalleFacturaAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idfactura = $request->get('idfactura');
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA);
            $listaConceptos = $notasDelegado->getDetalleFactura($idfactura);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['conceptos'] = $listaConceptos;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los conceptos a los que se pueden realizar las notas
     * @return json con todos los conceptos
     */
    public function getConceptoAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idliquidacion = $request->get('idliquidacion');
            $tipoLiquidacion = $request->get('tipoliquidacion');
            $tipo = $request->get('tipo');
            if (empty($idliquidacion) || empty($tipo)) {
                throw new MyException('Error en los parámetros de búsqueda', -1);
            }
            if (empty($tipoLiquidacion)) {
                throw new MyException('Debe seleccionar una liquidación', -1);
            }
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $idSuscripcion = $request->get('idsuscripcion');
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA, $idSuscripcion);
            $listaConceptos = $notasDelegado->getConcepto($idliquidacion, $tipo, $tipoLiquidacion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['conceptos'] = $listaConceptos;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta todos los conceptos del combo de seleccionar 
     * @return json lista de conceptos
     */
    public function getConceptoAutocompleteAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idSuscripcion = $request->get('idsuscripcion');
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA, $idSuscripcion);
            $listaConceptos = $notasDelegado->getConceptoAutocomplete();
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['conceptos'] = $listaConceptos;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se le aplican filtros a las facturas que se muestran en la interfaz
     * @return json lista de facturas
     */
    public function getFacturaConFiltroAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $concepto = $request->get('conceptos');
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA);
            $listaFacturas = $notasDelegado->getFacturaConFiltro($concepto);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['facturas'] = $listaFacturas;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Método que se encarga de ejecutar y lanzar los procesos que 
     * van a procesar las notas
     * @return type
     */
    public function procesarFacturasAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $facturas = $request->get('facturas');
            $conceptos = $request->get('conceptos');
            $idLiquidacion = $request->get('idliquidacion');
            $reclamacion = $request->get('reclamacion');
            $tipoContabilidad = $request->get('tipocontabilidad');
            //C = Nota cálculo - D= Nota directa
            $tipoNota = $request->get('tiponota');
            if (empty($conceptos) || empty($facturas)) {
                throw new MyException('Error, facturas y conceptos obligatorios', -1);
            }
            if (empty($tipoContabilidad)) {
                $tipoContabilidad = "-1";
            }
            $parametros['facturas'] = $facturas;
            $parametros['conceptos'] = $conceptos;
            $parametros['tiponota'] = $tipoNota;
            $parametros['idliquidacion'] = $idLiquidacion;
            $parametros['reclamacion'] = $reclamacion;
            $parametros['tipocontabilidad'] = $tipoContabilidad;
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA);
            $respuesta = $notasDelegado->lanzarHilos($parametros, $this->container);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se inicia el proceso de generación de notas';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se encarga de consultar los cambios respecto a los conceptos originales
     * En este momento hace una comparación entre la tabla temporal y
     * la tabla de facturas
     * @return json lista de los conceptos que se realizaron los cambios o ajuste
     */
    public function verificarCambiosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idFactura = $request->get('idfactura');
            if (!is_numeric($idFactura)) {
                throw new MyException('Error, identificador de factura obligatorio.', -1);
            }
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA);
            $listaConceptosAfectados = $notasDelegado->getConceptosAfectados($idFactura);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['conceptos'] = $listaConceptosAfectados;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta si el proceso en ejecución ya finalizó
     * @return json información del proceso actual
     */
    public function consultarProcesoAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA);
            $proceso = $notasDelegado->consultarProceso();
            $respuesta['codigoRespuesta'] = (empty($proceso) ? 0 : 1);
            $respuesta['proceso'] = $proceso;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (ValidacionException $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
            $respuesta['datos'] = $e->getData();
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se encarga de pasar los cambios que están en las tablas temporales 
     * a las tablas de facturas, recaudos, notas
     * @return json con el resultado de la transacción
     */
    public function aplicarNotasAction() {
        try {
            $respuesta = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $parametros['idmotivo'] = $request->get('idmotivo');
            $parametros['comentario'] = $request->get('comentario');
            $parametros['reclamacion'] = $request->get('reclamacion');
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA);
            $notasDelegado->reiniciarFacturasTemporales();
            $notasDelegado->aplicarNotas($parametros);
            $respuesta['codigoRespuesta'] = -1;
            $respuesta['mensaje'] = 'Error al ejecutar el proceso';
            $listaErrores = $notasDelegado->getListaErrores();
            $respuesta['errores'] = $listaErrores;
            //Se valida que no haya errores en la ejecución del programa
            if (empty($listaErrores)) {
                $respuesta['codigoRespuesta'] = 1;
                $respuesta['mensaje'] = 'Se ejecutó el proceso correctamente';
                $notasDelegado->eliminarTablas();
                throw new MyException($respuesta['mensaje'], $respuesta['codigoRespuesta']);
            }
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se consultan todos los motivos de las notas (mono_)
     * de acuerdo por la empresa que está en sesión 
     * @return json 
     */
    public function motivosNotasAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se consultaron correctamente los motivos';
            $respuesta['motivos'] = $notasDelegado->obtenerMotivos();
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se consultan los errores que se hayan presentado durante la ejecución
     * del programa
     * @return json lista de errores
     */
    public function getListaErroresAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA);
            $listaErrores = $notasDelegado->getErroresNotas();
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['errores'] = $listaErrores;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (ValidacionException $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
            $respuesta['datos'] = $e->getData();
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Método encarga de validar si las tablas temporales existen, 
     * si no existen las crea y si existen elimina toda la información
     * del usuario que haya inciado sesión
     * @return type
     */
    public function eliminarTablasAction() {
        try {
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA);
            $notasDelegado->eliminarTablas();
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se eliminó correctamente las tablas';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = -1;
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los conceptos relacionados del concepto principal (SUMA)
     * para ingresarlos a la nota correspondiente 
     * @return JSON repsuesta con la lista de los conceptos
     * @throws MyException Si desde la vista no llega ningún parámetros
     */
    public function consultarConceptosRelacionadosAction() {
        try {
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $idLiquidacion = $request->get('idliquidacion');
            
            if (!is_numeric($idLiquidacion)) {
                throw new MyException('La liquidación es obligatoria', -1);
            }
            $idConcepto = $request->get('idconcepto');
            if (!is_numeric($idConcepto)) {
                throw new MyException('El concepto es obligatorio', -1);
            }
            $idLiquidacionFactura = $request->get('idLiquidacionFactura');
            if (!is_numeric($idLiquidacionFactura)) {
                throw new MyException('la Liquidacion d ela factura es obligatorio', -1);
            }

            /**
             * Conceptos relacionados a otros conceptos principales dentro de la interfaz
             * Para que no se muestren al nuevo que se el está asignando
             */
            $idsConceptosVinculados = $request->get('idconceptosvinculados');
            if (empty($idsConceptosVinculados)) {
                $idsConceptosVinculados = -1;
            }
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA);
            $listaConceptosRelacionados = $notasDelegado->consultarConceptosRelacionados($idLiquidacion, $idConcepto, $idsConceptosVinculados, $idLiquidacionFactura);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se consultó correctamente la información de los conceptos relacionados';
            $respuesta['datos'] = $listaConceptosRelacionados;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    public function controlComboContabilizacionAction(){
        try {
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
           
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA);
            $permisoComboContabilidad = $notasDelegado->getPermisoComboContabilizacionDelegado();
            $respuesta['codigoRespuesta'] = $permisoComboContabilidad == 1 ? 1 : 0;
            $respuesta['mensaje'] = $permisoComboContabilidad == 1 ? 'Usuario tiene ermisos' : 'No tiene permisos';
            
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
