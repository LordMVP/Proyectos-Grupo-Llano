<?php

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Models\FinanciacionModel;
use Llanogas\LlanogasBundle\MyException;

/**
 * Reestructura una financiación.
 */
class ReestructurarFinanciacionController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $lisParametros['fecha'] = date('Y-m-d');
        $response = $this->render('LlanogasLlanogasBundle:Cartera:ReestructurarFinanciacion.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta una suscripción po documento,codigoanterior,idsuscripcion 
     * @return json con la información de la suscripción.
     * @throws MyException Error si no llegan al menos un criterio de búsqueda.
     */
    public function consultarSuscripcionAction() {
        $respuesta["codigoRespuesta"] = -1;
        try {
            Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $documento = $request->get('documento');
            $codAnterior = $request->get('codAnterior');
            $idSuscripcion = $request->get('idSuscripcion');
            if (empty($documento) && empty($codAnterior) && empty($idSuscripcion)) {
                throw new MyException("Todos lo datos están vacíos");
            }
            if ((!empty($documento) && !is_numeric($documento)) || (!empty($codAnterior) && !is_numeric($codAnterior)) || (!empty($idSuscripcion) && !is_numeric($idSuscripcion))) {
                throw new MyException("Los campos deben ser numéricos");
            }
            $conexion = Util::getConexion($this);
            $objModel = new FinanciacionModel();
            $objModel->setConexion($conexion);
            $suscripcionesSinFacVencidas = [];
            $suscripciones = $objModel->filtrarSuscripcionesReestructurar($documento, $codAnterior, $idSuscripcion);

            foreach ($suscripciones as $suscripcion) {
                $facVencida = $objModel->consultarFacturasVencidas($suscripcion['idsuscripcion']);
                $permitido = $objModel->consultarAmortizaciones($suscripcion['idsuscripcion']);
                //Se valida si el usuario tiene facturas vencidas o 
                //que haya superado el número de reestructuraciones anuales permitidas
                if (!empty($facVencida) || $permitido >= NUMERO_REESTRUCTURACIONESPERMITIDAS) {
                    $mensaje = !empty($facVencida) ? 'La suscripción tiene facturas vencidas sin pagar.' : 'La suscripción no tiene permitido realizar más reestructuraciones.';
                    continue;
                }
                $suscripcionesSinFacVencidas[] = $suscripcion;
            }

            $respuesta['mensaje'] = (count($suscripciones) > count($suscripcionesSinFacVencidas)) ? $mensaje : 'No se encontraron resultados';
            $respuesta["codigoRespuesta"] = empty($suscripcionesSinFacVencidas) ? 0 : 1;
            $respuesta["suscripciones"] = $suscripcionesSinFacVencidas;
        } catch (MyException $exc) {
            $respuesta["mensaje"] = $exc->getMessage();
            $respuesta["codigoRespuesta"] = $exc->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la tabla de financiaciones  
     * @return json con con la información de todas las financiaciones que tiene una suscripción.
     */
    public function consultarTablaFinanciacionAction() {
        $respuesta["codigoRespuesta"] = 1;
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idsuscripcion = $request->get('idSuscripcion');
            $idTipoDocumento = $request->get('idtipodocumento');
            $idDocumento = $request->get('iddocumento');
            $validarCuotas = $request->get('validarcuota');
            $respuesta["tablaFinanciacion"] = $this->cargarTablaFinanciacion($idsuscripcion, $idTipoDocumento, $idDocumento, $validarCuotas);
        } catch (\Exception $exc) {
//            $respuesta["mensajeError"] = $exc->getMessage();
            $respuesta["mensaje"] = $exc->getMessage();
            $respuesta["codigoRespuesta"] = $exc->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * 
     * @param type $idsuscripcion
     * @return Array listado de facturas financiación
     * 
     */
    private function cargarTablaFinanciacion($idsuscripcion, $idTipoDocumento, $idDocumento, $validarCuotas) {
        $conexion = Util::getConexion($this);
        $sesion = Util::iniciarSesion($this);
        $idempresa = $sesion->get('idempresa');
        $objModel = new FinanciacionModel($conexion);
        $tablaFinanciacion = $objModel->consultarTablaFinanciacion($idempresa, $idsuscripcion, $idTipoDocumento, $idDocumento, $validarCuotas);
        if (empty($tablaFinanciacion)) {
            throw new MyException('No se encontraron financiaciones para reestructurar. ', 0);
        }
        $financiaciones = array();
        foreach ($tablaFinanciacion as $financiacion) {
            $financiacion['liquidaciones'] = $this->cargarLiquidacionesFinanciacion($financiacion['idtipodocumento']);
            $financiaciones[] = $financiacion;
        }

        return $financiaciones;
    }

    /**
     * carga las liquidaciones por tipo de documento
     * @param type $idtipodocumento
     */
    private function cargarLiquidacionesFinanciacion($idtipodocumento) {
        $sesion = Util::iniciarSesion($this);
        $idEmpresa = $sesion->get('idempresa');
        $objModel = new FinanciacionModel();
        $conexion = Util::getConexion($this);
        $objModel->setConexion($conexion);
        return $objModel->consultarLiquidacionFinanciacionModel($idtipodocumento, $idEmpresa);
    }

    /**
     * Consulta el detalle de una financiación de acuero al identificador
     * @return json con la información de la financiación.
     */
    public function consultarConceptosAction() {
        $respuesta["codigoRespuesta"] = -1;
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idFinanciacion = $request->get('idRegistro');
            $conexion = Util::getConexion($this);
            $objModel = new FinanciacionModel();
            $objModel->setConexion($conexion);
            $resultadoQuery = $objModel->consultarConceptos($idFinanciacion);
            $conceptos = array();
            foreach ($resultadoQuery as $value) {
                $conceptos[$key]["idConcepto"] = $value["idconcepto"];
                $conceptos[$key]["nombre"] = $value["nombre"];
            }
            $respuesta["codigoRespuesta"] = 0;
            $respuesta["conceptos"] = $conceptos;
        } catch (MyException $exc) {
            $respuesta["mensajeError"] = $exc;
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Reestructura una financiación seleccionada
     * @return json información con la transacción del proceso.
     */
    public function guardarReestructuracionAction() {
        $respuesta["codigoRespuesta"] = -1;
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $listaReestructuracion = $request->get('reestructuracion');
            $conexion = Util::getConexion($this);
            $objModel = new FinanciacionModel($conexion);
            $idusuario = $sesion->get('idusuario');
            $idempresa = $sesion->get('idempresa');
            $objModel->guardarReestructuracionFinanciacion($listaReestructuracion, $idusuario, $idempresa);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensajeError"] = 'Se modificó la financiación correctamente.';
        } catch (Exception $e) {
            $respuesta["mensajeError"] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
