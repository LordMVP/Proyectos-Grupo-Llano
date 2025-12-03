<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\ImportarFacturasDelegado;
use Llanogas\LlanogasBundle\ProcesosMasivos\EjecutaProcesoImportarFacturas;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\MyException;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\ImportarFacturasModel;

/**
 * Description of ImportarFacturasController
 *
 * @author mebonilla
 */
class ImportarFacturasController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $importarFacturasDelegado = new ImportarFacturasDelegado($this, $sesion);
        $lisParametros = array();
        $idempresa = $sesion->get('idempresa');
        $lisParametros['empresa'] = $sesion->get('empresa');
        //cargar el combo de medios de pago
        $cmbEmpresas = $importarFacturasDelegado->cargarComboDb("cmbEmpresas");
        $lisParametros["cmbEmpresas"] = $cmbEmpresas;
        $lisParametros['opcion'] = 0;
        $lisParametros['ciclos'] = $importarFacturasDelegado->consultarCiclosActivos($idempresa);
        $lisParametros['tipoimportacion'] = $importarFacturasDelegado->getTipo();
        $response = $this->render('LlanogasLlanogasBundle:Facturacion:importarFacturas.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Sube al sistema de archivos del servidor un archivo XML enviado por la
     * interfaz del lado del cliente para ser procesado y cargar las respectivas
     * facturas en la base de datos
     * @return array respuesta del servidor
     */
    public function subirArchivosImportacionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $cicloSeleccionado = 'S';
            $importarFacturasDelegado = new ImportarFacturasDelegado($this, $sesion);
            $operacion = $request->get('operacion');
            
            if ($sesion->get('idempresa') == LLANOGAS_IDPROYCTO){
                throw new MyException('Debe ingresar session con otra empresa diferente a LLanogas',-1);
                
            }
            if ($sesion->get('idempresa') == CUSIANAGAS_IDPROYECTO){
                throw new MyException('Debe ingresar session con otra empresa diferente a CusianaGas',-1);
                
            }
            $importarFacturasDelegado->existeTablaTemporalEncabezado();
            
            $listaArchivos = Util::subirAdjunto($request, $sesion->get("idusuario"), "importarfacturas");
            /*
             * ImportarFacturas($listaArchivos, $cicloSeleccionado)
             *Se lee archivo XML y se carga a la Tabla temporal
             */
            $importarFacturasDelegado->importarFacturas($listaArchivos, $cicloSeleccionado);
            
          
            
            if ($operacion == 'C') {
                $cicloSeleccionado = $request->get('cboCiclo');
                
                /*
                 * ActualizaFacturasPeriodoAnterior($this->cicloSeleccionado)
                 * Se saldan todas las facturas del ciclo selecciondo por el usuario segun la empresa sessión 
                 */
                $importarFacturasDelegado->ActualizaFacturasPeriodoAnterior($cicloSeleccionado);

                sleep(2);
                $this->lanzarHilos($cicloSeleccionado, $sesion);
            }
            
            if ($operacion != 'C') {
             
                $this->lanzarHilos($cicloSeleccionado, $sesion);
                
            }

            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = "Se Inicio Correctamente el Proceso";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    private function lanzarHilos($cicloSeleccionado, $sesion) {
        for ($idProceso = 0; $idProceso < NUMERO_HILOS_CARGAR_IMPORTAR_FACTURA; $idProceso++) {
            $idEmpresa = $sesion->get('idempresa');
            
            $idUsuario = $sesion->get('idusuario');
            $idAcceso = $sesion->get('idacceso');
            
            // se envia en el orden que tiene el PHP --> EjecutaProcesoImportarFactura.php
            $parametros = "$idAcceso $idUsuario $idProceso $idEmpresa $cicloSeleccionado " . RUTA_PRINCIPAL;
            //$this->container->get('kernel')->locateResource('@LlanogasLlanogasBundle')   == La ruta del symfony Ejplo:  /var/www/html/achagua/bundlellano
            $script = $this->container->get('kernel')->locateResource('@LlanogasLlanogasBundle') . "ProcesosMasivos/EjecutaProcesoImportarFacturas.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/importa_facturacion_$idProceso.log &";
            
            Util::ejecutarHilo($script);
            
            // Para trabajar sin Hilos se comentarea --> $script = $this->container->get('kernel')->locateResource('@LlanogasLlanogasBundle')
            // y tambien se comentarea --->  Util::ejecutarHilo($script);
            // 
//            $parametros['idacceso'] = $idAcceso;
//            $parametros['idusuario'] = $idUsuario;
//            $parametros['idproceso'] = $idProceso;
//            $parametros['idempresa'] = $idEmpresa;
//            $parametros['cicloSeleccionado'] = $cicloSeleccionado;
//            $proceso = new EjecutaProcesoImportarFacturas($parametros);
//            $proceso->run();
        }
    }

    /**
     * Genera el render del twig con el resultado de la carga de las facturas, 
     * el numero de las que han sido cargadas y cuales suscripciones no 
     * permitieron el cargue.
     * @param SessionInterface $sesion sesion del usuario
     * @param array $respuesta contenido de la respuesta del servidor
     * @return html Pagina renderizada
     */
    private function resultadoArchivo(SessionInterface &$sesion, array $respuesta) {
        $lisParametros = array();
        $lisParametros['opcion'] = 1;
        if (array_key_exists('datos', $respuesta)) {
            $lisParametros['filas'] = ceil(count($respuesta['datos']['facturasnocargadas']) / 3);
            $lisParametros['totalfacturado'] = array_sum($respuesta['datos']['totalfacturado']);
        }
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $lisParametros['respuesta'] = $respuesta;
        $response = $this->render('LlanogasLlanogasBundle:Facturacion:importarFacturas.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }
    
     /**
     * Muestra el estado del proceso en ejecución 
     * @return json con el estado del proceso.
     */
    public function consultarProgresoAction() {
        $sesion = Util::iniciarSesion($this);
        $conexion = Util::getConexion($this);
        $idEmpresa = $sesion->get("idEmpresa");
        $idUsuario = $sesion->get("idUsuario");
        

        $objProcesoModel = new ImportarFacturasModel($conexion, $sesion);
        $resultado['progreso'] = $objProcesoModel->getProcesoEjecucionHilos($idEmpresa, PROGRAMA_IMPORTAR_FACTURA_BIO_ACE, $idUsuario);
        $resultado["codigoRespuesta"] = (empty($resultado['progreso'])) ? 0 : 1;
        $resultado["mensaje"] = "Progreso";
        $conexion->close();
        return Util::construyeRespuesta($resultado);
    }
    
     public function consultarResumenAction() {
        Util::validarPeticion($this);
        $sesion = Util::iniciarSesion($this);
        $importarFacturasDelegado = new ImportarFacturasDelegado($this, $sesion);

        $resultado = $importarFacturasDelegado->consultarResumen();
        $resultado["codigoRespuesta"] = (empty($resultado['resumencorrectos'])) ? 0 : 1;
//        $resultado["codigoRespuesta"] = (empty($resultado['resumenconerrores'])) ? 0 : 1;
        $resultado["mensaje"] = "Se realizó la consulta correctamente";
        return Util::construyeRespuesta($resultado);
    }
    
    public function cancelarImportacionAction() {
        Util::validarPeticion($this);
        $sesion = Util::iniciarSesion($this);
        $importarFacturasDelegado = new ImportarFacturasDelegado($this, $sesion);

        $resultado = $importarFacturasDelegado->cancelarImportacion();
        $resultado["codigoRespuesta"] = (empty($resultado)) ? 0 : 1;
//        $resultado["codigoRespuesta"] = (empty($resultado['resumenconerrores'])) ? 0 : 1;
        $resultado["mensaje"] = "Se realizó la consulta correctamente";
        return Util::construyeRespuesta($resultado);
    }
    
}
