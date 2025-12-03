<?php

namespace Llanogas\LlanogasBundle\Controller;

use Exception;
use Llanogas\LlanogasBundle\Delegado\NotasAutomaticasDelegado;
use Llanogas\LlanogasBundle\Delegado\NotasCalculadaDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Clase encargada de ejecutar las notas de facturas
 * @author desarrollo1
 */
class NotasCalculadaController extends Controller {

    /**
     * Función que renderiza la página de notas automáticas calculadas.
     * @return html.twig con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $conexion = Util::getConexion($this);
        $idAcceso = $sesion->get('idacceso');
        $notasAutomaticasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_CALCULADA);
        $notaAutomaticaCalculada = new NotasCalculadaDelegado($idAcceso, PROGRAMA_NOTA_CALCULADA);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $lisParametros['ciclos'] = $notasAutomaticasDelegado->getCiclos();
        $lisParametros['tipoafectacion'] = $notasAutomaticasDelegado->getTipo();
        $lisParametros['listatipodocumentos'] = $notaAutomaticaCalculada->getTiposDocumentos();
        $response = $this->render('LlanogasLlanogasBundle:Facturacion:notasCalculadas.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta todos los tipos de documentos 
     * que tienen asociados el usuario y las liquidaciones 
     * que sean de servicio tipo 'LI'
     * @return lista de tipos de documentos
     */
    public function getTiposDocumentosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idAcceso = $sesion->get('idacceso');
            $idSuscripcion = $request->get('idsuscripcion');
            if (empty($idSuscripcion)) {
                throw new MyException('Error, debe seleccionar la suscripción para consultar los tipos de documento', -1);
            }
            $notasCalculadaDelegado = new NotasCalculadaDelegado($idAcceso, PROGRAMA_NOTA_CALCULADA);
            $tiposDeDocumento = $notasCalculadaDelegado->getTiposDocumentos($idSuscripcion);
            if (empty($tiposDeDocumento)) {
                throw new MyException("No se encontraron tipos de documento para la suscripción", 0);
            }
            $respuesta['datos'] = $tiposDeDocumento;
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Lista de documentos que tiene una suscripción asociados 
     * @return json
     */
    public function getDocumentosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idTipoDocumento = $request->get('idtipodocumento');
            $idSuscripcion = $request->get('idsuscripcion');
            if (empty($idTipoDocumento)) {
                throw new MyException('Error, el tipo de documento es obligatorio', -1);
            }
            $idAcceso = $sesion->get('idacceso');
            $notasCalculadaDelegado = new NotasCalculadaDelegado($idAcceso, PROGRAMA_NOTA_CALCULADA);
            $listaDocumentos = $notasCalculadaDelegado->getDocumentos($idTipoDocumento, $idSuscripcion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['documentos'] = $listaDocumentos;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta las liquidaciones que tiene asignadas un usuario por el 
     * perfil 
     * @return json lista de liquidaciones
     */
    public function getLiquidacionAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idAcceso = $sesion->get('idacceso');
            $request = $this->getRequest();
            $parametros['idtipodocumento'] = $request->get('idtipodocumento');
            $parametros['idsuscripcion'] = $request->get('idsuscripcion');
            $parametros['iddocumento'] = $request->get('iddocumento');
            $notasDelegado = new NotasCalculadaDelegado($idAcceso, PROGRAMA_NOTA_CALCULADA);
            if (empty($parametros['idtipodocumento']) || empty($parametros['iddocumento'])) {
                throw new MyException('Error en los parámetros de búsqueda', -1);
            }
            $listaLiquidacion = $notasDelegado->getLiquidaciones($parametros);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['liquidacion'] = $listaLiquidacion;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Lista de municipios según el perfil del usuario
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
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_CALCULADA, $idSuscripcion);
            $listaMunicipio = $notasDelegado->getMunicipios($municipio);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['municipios'] = $listaMunicipio;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Método encargado de eliminar el trabajo actual del usuario
     * @return json resultado de la transacción
     */
    public function eliminarAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idAcceso = $sesion->get('idacceso');
            $notas = new NotasCalculadaDelegado($idAcceso, PROGRAMA_NOTA_CALCULADA);
            $notas->eliminarTablas();
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la última factura del usuario 
     * que se le puede hacer la nota calculada
     * @return json información de la factura 
     */
    public function getFacturasAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasCalculadaDelegado = new NotasCalculadaDelegado($idAcceso, PROGRAMA_NOTA_CALCULADA);
            $parametros = $request->get('parametros')[0];
            $parametros['idprograma'] = PROGRAMA_NOTA_CALCULADA;
            if (empty($parametros) || !is_array($parametros)) {
                throw new MyException('Error, no hay parámetros de búsqueda', -1);
            }
            $this->validarParametrosFacturas();
            $listaFacturas = $notasCalculadaDelegado->getFacturas($parametros);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['facturas'] = $listaFacturas;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Valida si todos los parámetros para poder buscar una factura 
     * se enviaron 
     * @throws MyException
     */
    private function validarParametrosFacturas() {
        $request = $this->getRequest();
        $parametros = $request->get('parametros')[0];
        if (!isset($parametros['idciclo']) && !is_numeric($parametros['idciclo'])) {
            throw new MyException('Debe seleccionar un ciclo', -1);
        }
        if (!isset($parametros['idliquidacion']) && !is_numeric($parametros['idliquidacion'])) {
            throw new MyException('Debe seleccionar una liquidación', -1);
        }
        if (!isset($parametros['idtipodocumento']) && !is_numeric($parametros['idtipodocumento'])) {
            throw new MyException('Debe seleccionar un tipo de documento', -1);
        }
        if (!isset($parametros['iddocumento']) && !is_numeric($parametros['iddocumento'])) {
            throw new MyException('Debe seleccionar un documento', -1);
        }
    }

    /**
     * Método encargado de lanzar el proceso de notas en segundo plano
     * @return json si inicia el proceso correctamente
     */
    public function procesarAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idAcceso = $sesion->get('idacceso');
            $argumentos['conceptos'] = $request->get('conceptos');
            $argumentos['facturas'] = $request->get('facturas');
            $argumentos['idliquidacion'] = $request->get('idliquidacion');
            $notasCalculadaDelegado = new NotasCalculadaDelegado($idAcceso, PROGRAMA_NOTA_CALCULADA);
            $notasCalculadaDelegado->procesar($argumentos, $this->container);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se inicia correctamente el proceso';
            sleep(4);
        } catch (Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta si el proceso actual ya finalizó su ejecución
     * @return json información del progreso
     */
    public function consultarProcesoAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_CALCULADA);
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
     * Consulta si hubo errores en la ejecución del proceso 
     * @return informacion sobre los errores
     */
    public function getListaErroresAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasCalculadaDelegado($idAcceso, PROGRAMA_NOTA_CALCULADA);
            $listaErrores = $notasDelegado->getErrores();
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
     * Método encargado de comparar los cambios de la nota con respecto a la 
     * factura original
     * @return json muestra los cambios que se van a realizar 
     */
    public function verificarAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idAcceso = $sesion->get('idacceso');
            $request = $this->getRequest();
            $idFactura = $request->get('idfactura');
            $notasDelegado = new NotasCalculadaDelegado($idAcceso, PROGRAMA_NOTA_CALCULADA);
            $listaConceptos = $notasDelegado->verificarCambios($idFactura);
            $listaConceptosInformativos = $notasDelegado->verConceptosInformativosNota($idFactura);
            $codigoRespuesta = (empty($listaConceptos) && empty($listaConceptosInformativos)) ? 0 : 1;
            $respuesta['codigoRespuesta'] = $codigoRespuesta;
            $respuesta['conceptos'] = $listaConceptos;
            $respuesta['conceptosinformativos'] = $listaConceptosInformativos;
            $respuesta['mensaje'] = ($codigoRespuesta == 1) ? 'Consulta realizada correctamente' : 'No se realizaron cambios ';
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
     * Exporta la información de las facturas originales antes
     * de aplicar las notas 
     * @return Response
     */
    public function exportarOriginalAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasCalculadaDelegado($idAcceso, PROGRAMA_NOTA_CALCULADA);
            $this->objPHPExcel = $notasDelegado->exportarFacturasOriginales();
            $this->response = new StreamedResponse();
            $formato = 'Excel2007';
            $this->response->setCallback(function()use($formato) {
                $objWriter = \PHPExcel_IOFactory::createWriter($this->objPHPExcel, $formato);
                $objWriter->save('php://output');
            });
            $this->response->setStatusCode(200);
            $this->response->headers->set('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
            $this->response->headers->set('Content-Disposition', 'attachment; filename=facturas-originales.xlsx');
            return $this->response;
        } catch (\Exception $e) {
            return new Response('Error en el servidor.');
        }
    }

    /**
     * Exporta las notas a un archivo excel
     * @return Response
     */
    public function exportarNotasAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasCalculadaDelegado($idAcceso, PROGRAMA_NOTA_CALCULADA);
            $this->objPHPExcel = $notasDelegado->exportarFacturasNotas();
            $this->response = new StreamedResponse();
            $formato = 'Excel2007';
            $this->response->setCallback(function()use($formato) {
                $objWriter = \PHPExcel_IOFactory::createWriter($this->objPHPExcel, $formato);
                $objWriter->save('php://output');
            });
            $this->response->setStatusCode(200);
            $this->response->headers->set('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
            $this->response->headers->set('Content-Disposition', 'attachment; filename=facturas-notas.xlsx');
            return $this->response;
        } catch (\Exception $e) {
            return new Response('Error en el servidor.');
        }
    }

    /**
     * Aplica los cambios que  se encuentran en la tabla temporal y los pasa a las facturas 
     * @return json resultado de la transacción 
     */
    public function aplicarNotasAction() {
        try {
            $respuesta = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idAcceso = $sesion->get('idacceso');
            $parametros['idmotivo'] = $request->get('idmotivo');
            $parametros['comentario'] = $request->get('comentario');
            $notasDelegado = new NotasCalculadaDelegado($idAcceso, PROGRAMA_NOTA_CALCULADA);
            $notasDelegado->aplicarNotas($parametros);
            $respuesta['codigoRespuesta'] = -1;
            $respuesta['mensaje'] = 'Error al ejecutar el proceso';
            $listaErrores = $notasDelegado->getErroresAplicarNota();
            $respuesta['errores'] = $listaErrores;
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

}
