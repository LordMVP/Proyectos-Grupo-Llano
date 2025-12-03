<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\AutorizarImpresionesDelegado;
use Llanogas\LlanogasBundle\Delegado\RecaudosDelegado;
use Llanogas\LlanogasBundle\Models\AnularModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Consulta un recaudo
 *
 * @author hrey
 */
class ConsultarRecaudoController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $response = $this->render('LlanogasLlanogasBundle:Recaudos:consultar.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consultar los recaudos con el idrecaudo
     * @return json con la información de los recaudos.
     * @throws MyException Error en la petición.
     */
    public function consultarRecaudosAction() {
        $respuesta["codigoRespuesta"] = -1;
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $recaudos = array();
            $conexion = Util::getConexion($this);
            $objModel = new AnularModel();
            $objModel->setConexion($conexion);
            // Creacion de registro de autorizacion de impresion en la creacion del recaudo
            $autorizarImpresionesDelegado = new AutorizarImpresionesDelegado($this, $sesion);
            $idUsuario = $sesion->get('idusuario');
            $idRegistro = $request->get('idRegistro');
            $idSuscripcion = $request->get('idSuscripcion');
            $fechaInicio = $request->get('fechaInicio');
            $fechaFin = $request->get('fechaFin');
            $codigoAnterior = $request->get('codigoAnterior');
            Util::validarPeticion($this);
            if (empty($idRegistro)) {
                $idRegistro = "";
            }
            if (empty($idSuscripcion)) {
                $idSuscripcion = "";
            }
            if (empty($fechaInicio)) {
                $fechaInicio = "";
            }
            if (empty($fechaFin)) {
                $fechaFin = "";
            }
            if (empty($codigoAnterior)) {
                $codigoAnterior = "";
            }
            $idEmpresa = $sesion->get('idempresa');
            $result = $objModel->buscarRecaudos($idRegistro, null, $idSuscripcion, $fechaInicio, $fechaFin, $codigoAnterior, $idEmpresa);
            foreach ($result as $key => $value) {
                $recaudo = array();
                $recaudo['idRecaudo'] = $result[$key]['idrecaudo'];
                $recaudo['idSuscriptor'] = $result[$key]['idsuscriptor'];
                $recaudo['fecha'] = $result[$key]['fecha'];
                $recaudo['documentoTercero'] = $result[$key]['terdocumento'];
                $recaudo['nombreCompletoTercero'] = $result[$key]['ternombrecompleto'];
                $recaudo['idConvenio'] = $result[$key]['idconvenio'];
                $recaudo['nombreConvenio'] = $result[$key]['nombreconvenio'];
                $recaudo['iddocumento'] = $result[$key]['iddocumento'];
                $recaudo['documento'] = $result[$key]['documento'];
                try {
                    $cantLimite = $autorizarImpresionesDelegado->obtenerLimiteImpresionRecaudo($recaudo['idRecaudo']);
                    $impresion = $autorizarImpresionesDelegado->obtenerImpresionRecaudoUsuario($recaudo['idRecaudo'], $idUsuario);
                    $recaudo['limiteimpresion'] = $cantLimite;
                    if (!empty($impresion)) {
                        $recaudo['impresionrecaudo'] = $impresion;
                    }
                } catch (\Exception $exc) {
                    $respuesta["mensajeimpresiones"] = $exc->getMessage();
                }
                $recaudos[] = $recaudo;
            }
            if (!isset($recaudos) || !empty($recaudos) || count($recaudos) > 0) {
                $respuesta['codigoRespuesta'] = 1;
                $respuesta['recaudos'] = $recaudos;
            } else {
                $respuesta['codigoRespuesta'] = 0;
                $respuesta['mensajeError'] = "No se encontraron recaudos";
            }
        } catch (\Exception $exc) {
            print_r($exc->getMessage());
            $respuesta['mensajeError'] = "Ocurrió un error al consultar el recaudo";
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta el detalle del recaudo.
     * @return json Información del recaudo.
     * @throws MyException Error en la petición 
     */
    public function obtenerInformacionRecaudoAction() {
        try {
            $respuesta["codigoRespuesta"] = -1;
            $sesion = Util::iniciarSesion($this);
            $resultadoRecaudo = array();
            $conexion = Util::getConexion($this);
            $objModel = new AnularModel();
            $objModel->setConexion($conexion);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idRecaudo = $request->get('idRecaudo');
            $recaudosDelegado = new RecaudosDelegado($this, $sesion);
            if (empty($idRecaudo)) {
                throw new MyException("Error en los parámetros de búsqueda");
            }
            $resultadoSuscripcion = $objModel->buscarSuscripcionesRecaudo($idRecaudo);
            //Se consulta la información del recaudo(rec) y la información de la distribución
            $resultadoRecaudo['inforecaudo'] = $recaudosDelegado->getRecaudoInfo($idRecaudo);
            if (!empty($resultadoSuscripcion)) {
                $suscripciones = array();
                foreach ($resultadoSuscripcion as $key => $value) {
                    $suscripciones[$key]["idSuscripcion"] = $resultadoSuscripcion[$key]["idsuscripcion"];
                    $suscripciones[$key]["codigoAnterior"] = $resultadoSuscripcion[$key]["codigoanterior"];
                    $suscripciones[$key]["idTipoSuscripcion"] = $resultadoSuscripcion[$key]["idtiposuscripcion"];
                    $suscripciones[$key]["tipoSuscripcion"] = $resultadoSuscripcion[$key]["tiposuscripcion"];
                }
                $resultadoRecaudo["suscripciones"] = $suscripciones;
            } else {
                $resultadoRecaudo["suscripciones"] = "Suscripciones no encontradas";
            }
            //Se consultan las facturas asociadas al recaudo
            $resultadoFactura = $objModel->buscarFacturasRecaudo($idRecaudo);
            if (!empty($resultadoFactura)) {
                $facturas = array();
                foreach ($resultadoFactura as $key => $value) {
                    $facturas[$key]["idFactura"] = $resultadoFactura[$key]["idfactura"];
                    $facturas[$key]["numeroFactura"] = $resultadoFactura[$key]["numerofactura"];
                    $facturas[$key]["fechaVencimiento"] = $resultadoFactura[$key]["fechavencimiento"];
                    $facturas[$key]["cicloperiodo"] = $resultadoFactura[$key]["cicloperiodo"];
                    $facturas[$key]["idSuscripcion"] = $resultadoFactura[$key]["idsuscripcion"];
                    $facturas[$key]["idTipoSuscripcion"] = $resultadoFactura[$key]["idtiposuscripcion"];
                    $facturas[$key]["tipoSuscripcion"] = $resultadoFactura[$key]["tiposuscripcion"];
                    $facturas[$key]["totalPagadoRecaudo"] = $resultadoFactura[$key]["totalpagadorecaudo"];
                }
                $resultadoRecaudo["facturas"] = $facturas;
                //Se consultan los conceptos de factuas (dfac) que afectó el recaudo (drec)
                $resultadoConcepto = $objModel->buscarConceptosFacturasRecaudos($idRecaudo);
                if (!empty($resultadoConcepto)) {
                    $conceptos = array();
                    foreach ($resultadoConcepto as $key => $value) {
                        $conceptos[$key]["idFactura"] = $resultadoConcepto[$key]["idfactura"];
                        $conceptos[$key]["idConcepto"] = $resultadoConcepto[$key]["idconcepto"];
                        $conceptos[$key]["descripcion"] = $resultadoConcepto[$key]["descripcion"];
                        $conceptos[$key]["valorPagado"] = $resultadoConcepto[$key]["valorpagado"];
                    }
                    $resultadoRecaudo["conceptosFacturas"] = $conceptos;
                } else {
                    $resultadoRecaudo["conceptosFacturas"] = "No se encontraron conceptos por factura";
                }
            } else {
                $resultadoRecaudo["facturas"] = "Facturas no encontradas";
                $resultadoConcepto = $objModel->buscarConceptosRecaudos($idRecaudo);
                if (!empty($resultadoConcepto)) {
                    $conceptos = array();
                    foreach ($resultadoConcepto as $key => $value) {
                        $conceptos[$key]["idConcepto"] = $resultadoConcepto[$key]["idconcepto"];
                        $conceptos[$key]["descripcion"] = $resultadoConcepto[$key]["descripcion"];
                        $conceptos[$key]["valorPagado"] = $resultadoConcepto[$key]["valorpagado"];
                    }
                    $resultadoRecaudo["conceptos"] = $conceptos;
                } else {
                    $resultadoRecaudo["conceptos"] = "Conceptos no encontrados";
                }
            }
            //Se consultan las formas de pago de  del recaudo
            $resultadoForma = $objModel->buscarFormasPago($idRecaudo);
            if (!empty($resultadoForma)) {
                $formas = array();
                foreach ($resultadoForma as $key => $value) {
                    $formas[$key]["idRegistro"] = $resultadoForma[$key]["idformapago"];
                    $formas[$key]["formaPago"] = $resultadoForma[$key]["formapago"];
                    $formas[$key]["idFormaPago"] = $resultadoForma[$key]["idformapago"];
                    $formas[$key]["valorReal"] = $resultadoForma[$key]["valorreal"];
                    $resultadoInfoAdicional = $objModel->buscarInfoAdicional($resultadoForma[$key]["idformapago"]);
                    if (!empty($resultadoInfoAdicional)) {
                        $miInformacion = array();
                        foreach ($resultadoInfoAdicional as $key => $value) {

                            $miInformacion[$key]["idInfo"] = $resultadoInfoAdicional[$key]["idinfo"];
                            $miInformacion[$key]["informacion"] = $resultadoInfoAdicional[$key]["informacion"];
                            $miInformacion[$key]["estado"] = $resultadoInfoAdicional[$key]["estado"];
                            $miInformacion[$key]["idRegistro"] = $resultadoInfoAdicional[$key]["idregistro"];
                            $miInformacion[$key]["nombre"] = $resultadoInfoAdicional[$key]["nombre"];
                        }
                        $formas[$key]["informacion"] = $miInformacion;
                    }
                }
                $resultadoRecaudo["formas"] = $formas;
            } else {
                $resultadoRecaudo["formas"] = "No se encontraron formas de pago del recaudo";
            }
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["resultadoRecaudo"] = $resultadoRecaudo;
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = 0;
            $respuesta['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
