<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\ConsultarFinanciacionModel;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Delegado\GenerarFinanciacionDelegado;
/**
 * Clase encargada de consultar todas las financiaciones.
 */
class ConsultarFinanciacionController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $response = $this->render('LlanogasLlanogasBundle:Cartera:FinanciacionCRUD.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta las financiaciones.
     * @return json con las financiaciones encontradas.
     */
    public function filtrarFinanciacionesAction() {
        try {
            $respuesta['codigoRespuesta'] = -1;
            Util::validarPeticion($this);
            $conexion = Util::getConexion($this);
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $consultaFinanciacionModel = new ConsultarFinanciacionModel();
            $consultaFinanciacionModel->setConexion($conexion);
            $parametros = $request->get('parametros');
            $parametros['idempresa'] = $sesion->get('idempresa');
            $financiaciones = $consultaFinanciacionModel->consultarFinanciacion($parametros);
            $generarFinanciacion = new GenerarFinanciacionDelegado($this, $sesion);
            foreach ($financiaciones as &$financiacion) {
                $adjuntos = $consultaFinanciacionModel->consultarAdjuntoPorFinanciacion($financiacion['idfinanciacion']);
                $informacionFinanciera = $consultaFinanciacionModel->consultarInformacionFinanciera($financiacion['idfinanciacion']);
                if (!empty($adjuntos)) {
                    $financiacion['adjuntos'] = $adjuntos;
                }
                if (!empty($informacionFinanciera)) {
                    $financiacion['informacionfinanciera'] = $informacionFinanciera[0];
                }
		$financiacion["interes"] = $generarFinanciacion->consultarInteresLiquidacion($financiacion["idliquidacion"]);
                $financiacion["interesiva"] = $generarFinanciacion->consultarInteresIvaLiquidacion($financiacion["idliquidacion"]);
            }
            $respuesta['codigoRespuesta'] = empty($financiaciones) ? 0 : 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente.';
            $respuesta['financiaciones'] = $financiaciones;
        } catch (\Exception $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta las facturas asociadas a una financiación.
     * @return json información de las facturas dependiendo de la financiación.
     * @throws MyException Error sí la financiación no existe.
     */
    public function consultarFacturasAction() {
        try {
            $respuesta['codigoRespuesta'] = -1;
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idFinanciacion = $request->get('idfinanciacion');
            if (empty($idFinanciacion)) {
                throw new MyException('Error, identificador de financiación obligatorio');
            }
            $conexion = Util::getConexion($this);
            $consultaFinanciacionModel = new ConsultarFinanciacionModel();
            $consultaFinanciacionModel->setConexion($conexion);
            $facturas = $consultaFinanciacionModel->consultarFacturasPorIdFinanciacion($idFinanciacion);
            $respuesta['codigoRespuesta'] = (empty($facturas)) ? 0 : 1;
            $respuesta['mensajeRespuesta'] = 'Se consultan todas las factuas';
            $respuesta['facturas'] = $facturas;
        } catch (\Exception $ex) {
            $respuesta['mensajeRespuesta'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los conceptos de una factura en específico.
     * @return json con la información de los conceptos.
     * @throws MyException Error en la petición.
     */
    public function consultarDetalleFacturasAction() {
        try {
            $respuesta['codigoRespuesta'] = -1;
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idFactura = $request->get('idfactura');
            if (empty($idFactura)) {
                throw new MyException('Error, identificador de factura obligatorio');
            }
            $conexion = Util::getConexion($this);
            $consultaFinanciacionModel = new ConsultarFinanciacionModel();
            $consultaFinanciacionModel->setConexion($conexion);
            $detalleFacturas = $consultaFinanciacionModel->consultarDetalleFactura($idFactura);
            $respuesta['codigoRespuesta'] = empty($detalleFacturas) ? 0 : 1;
            $respuesta['mensajeRespuesta'] = 'Se consultan todos los detalles de factuas';
            $respuesta['detallesfactura'] = $detalleFacturas;
        } catch (\Exception $ex) {
            $respuesta['mensajeRespuesta'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta detalle de la amortización.
     * @return json información con las amortizaciones.
     * @throws MyException Erro en el id de la petición.
     */
    public function consultarDetalleAmortizacionesAction() {
        try {
            $respuesta['codigoRespuesta'] = -1;
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idamortizacion = $request->get('idamortizacion');
            if (empty($idamortizacion)) {
                throw new MyException('Error, identificador de la amortización obligatorio');
            }
            $conexion = Util::getConexion($this);
            $consultaFinanciacionModel = new ConsultarFinanciacionModel();
            $consultaFinanciacionModel->setConexion($conexion);
            $amortizaciones = $consultaFinanciacionModel->consultarDetalleAmortizacion($idamortizacion);
            $respuesta['codigoRespuesta'] = (empty($amortizaciones)) ? 0 : 1;
            $respuesta['mensaje'] = (empty($amortizaciones)) ? 'No hay detalle de amortización' : 'Detalle amortización';
            $respuesta['detalleamortizacion'] = $amortizaciones;
        } catch (\Exception $ex) {
            $respuesta['mensajeRespuesta'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta las cuotas amortizadas.
     * @return json información con las amortizaciones.
     * @throws MyException Erro en el id de la petición.
     */
    public function consultarAmortizacionesAction() {
        try {
            $respuesta['codigoRespuesta'] = -1;
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idFinanciacion = $request->get('idfinanciacion');
            if (empty($idFinanciacion)) {
                throw new MyException('Error, identificador de financiación obligatorio');
            }
            $conexion = Util::getConexion($this);
            $consultaFinanciacionModel = new ConsultarFinanciacionModel();
            $consultaFinanciacionModel->setConexion($conexion);
            $amortizaciones = $consultaFinanciacionModel->consultarAmortizacionesPorFinanciacion($idFinanciacion);
            $respuesta['codigoRespuesta'] = (empty($amortizaciones)) ? 0 : 1;
            $respuesta['mensajeRespuesta'] = 'Se consultan todas cuotas amortizadas';
            $respuesta['amortizaciones'] = $amortizaciones;
        } catch (\Exception $ex) {
            $respuesta['mensajeRespuesta'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta las facturas por amortizar 
     * @return json con las facturas
     * @throws MyException Error de validación de la petición.
     */
    public function consultarFacturasPorAmortizacionAction() {
        try {
            $respuesta['codigoRespuesta'] = -1;
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idAmortizacion = $request->get('idamortizacion');
            if (empty($idAmortizacion)) {
                throw new MyException('Error, identificador de la amortización obligatorio');
            }
            $conexion = Util::getConexion($this);
            $consultaFinanciacionModel = new ConsultarFinanciacionModel();
            $consultaFinanciacionModel->setConexion($conexion);
            $facturas = $consultaFinanciacionModel->consultarFacturasPorAmortizacion($idAmortizacion);
            $respuesta['codigoRespuesta'] = (empty($facturas)) ? 0 : 1;
            $respuesta['mensajeRespuesta'] = 'Se consultan todas cuotas amortizadas';
            $respuesta['facturas'] = $facturas;
        } catch (\Exception $ex) {
            $respuesta['mensajeRespuesta'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se consultan los archivos adjuntos de la financiación
     * @return json con las facturas
     * @throws MyException Error de validación de la petición.
     */
    public function consultarAdjuntosPorFinanciacionAction() {
        try {
            $respuesta['codigoRespuesta'] = -1;
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idfinanciacion = $request->get('idfinanciacion');
            //Se valida que el identificador de la financiación esté vacío 
            if (empty($idfinanciacion)) {
                throw new MyException('Error, identificador de financiación obligatorio');
            }
            $conexion = Util::getConexion($this);
            $consultaFinanciacionModel = new ConsultarFinanciacionModel();
            $consultaFinanciacionModel->setConexion($conexion);
            $adjuntos = $consultaFinanciacionModel->consultarAdjuntoPorFinanciacion($idfinanciacion);
            $respuesta['codigoRespuesta'] = (empty($adjuntos)) ? 0 : 1;
            $respuesta['mensajeRespuesta'] = 'Se consultan todas los adjuntos de la financiacion';
            $respuesta['adjuntos'] = $adjuntos;
        } catch (\Exception $ex) {
            $respuesta['mensajeRespuesta'] = $ex->getMessage();
            $respuesta['codigoRespuesta'] = $ex->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    public function consultaPermisosAdjuntosAction(){
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $request = $this->getRequest();
            $idPrograma = $request->get('idPrograma');
            $idusuario = $sesion->get('idusuario');
            if(empty($idPrograma)){
                throw new MyException('No se envia el número de Programa',-1);
            }
            $delegado = new GenericoDelegado($conexion);
            $permisosGrabar = $delegado->consultaPermisosGrabar($idPrograma, $idusuario);
            $respuesta['data'] = $permisosGrabar;
            $respuesta['codigorespuesta'] = empty($permisosGrabar) ? 0 : 1;
            $respuesta['mensaje'] = empty($permisosGrabar) ? 'Solicite Permisos de Grabación' : 'Consulta de Exitosa';
        } catch (MyException $ex) {
            $respuesta['codigorespuesta'] = -1;
            $respuesta['mensaje'] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }
    
    
// </editor-fold>
    // <editor-fold desc="Liquidaciones Adjuntas">  
    /**
     * Consulta las facturas dependiendo por documento, tipo documento y suscripcion
     * @return json con facturas a financiar.
     * @throws MyException Error al financiar
     */
    public function subirFinanciacionAdjuntaAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->get('request');
            Util::validarPeticion($this);

            $financiacion = new GenerarFinanciacionDelegado($this, $sesion);
            $documentosAdjuntos = $financiacion->subirArchivoAdjunto($request);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["uploadedFiles"] = $documentosAdjuntos;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta["codigoRespuesta"] = 0;
        }
        return Util::construyeRespuesta($respuesta);
    }

}
