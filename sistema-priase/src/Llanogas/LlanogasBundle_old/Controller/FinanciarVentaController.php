<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Delegado\FinanciarVentasDelegado;
use Llanogas\LlanogasBundle\Delegado\RegistrarVentasDelegado;

/**
 * Clase encargada de administrar el registro de ventas.
 */
class FinanciarVentaController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $financiarVentasDelegado = new FinanciarVentasDelegado($this, $sesion);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $lisParametros['fecha'] = date('Y-m-d');
        $lisParametros['parentescos'] = $financiarVentasDelegado->getParentescos();
        $lisParametros['cargos'] = $financiarVentasDelegado->getInformacionUnidadPorClase(CLASE_TIPOCARGO);
        //$lisParametros['profesiones'] = $financiarVentasDelegado->getInformacionUnidadPorClase(CLASE_PROFESIONES);
        $lisParametros['tiposociedad'] = $financiarVentasDelegado->getInformacionUnidadPorClase(CLASE_TIPOSOCIEDAD);
        $lisParametros['actividadeconomica'] = $financiarVentasDelegado->getInformacionUnidadPorClase(CLASE_ACTIVIDADECONOMICA);
        $response = $this->render('LlanogasLlanogasBundle:Ventas:financiar_ventas.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta los conceptos de una venta
     * @return json lista de conceptos de la venta que se está consultado
     * @throws MyException
     */
    public function getConceptosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idVenta = $request->get('idventa');
            if (!is_numeric($idVenta)) {
                throw new MyException('Error, identificador de venta obligatorio', -1);
            }
            $financiarVentasDelegado = new FinanciarVentasDelegado($this, $sesion);
            $factura = $financiarVentasDelegado->getConceptosVenta($idVenta);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['factura'] = $factura;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los conceptos de la venta de acuerdo a la liquidación seleccionada
     * @return json
     */
    public function getConceptosPorLiquidacionAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idVenta = $request->get('idventa');
            $idLiquidacion = $request->get('idliquidacion');
            if (!is_numeric($idVenta) || !is_numeric($idLiquidacion)) {
                throw new MyException('Error, todos los parámetros son obligatorios', -1);
            }
            $financiarVentasDelegado = new FinanciarVentasDelegado($this, $sesion);
            $conceptos = $financiarVentasDelegado->getConceptosVentaPorLiquidacion($idVenta, $idLiquidacion);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['conceptos'] = $conceptos;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta todas las liquidaciones de la venta que se ejecutó 
     * @return json lista de liquidaciones
     */
    public function getLiquidacionesAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idVenta = $request->get('idventa');
            $financiarVentasDelegado = new FinanciarVentasDelegado($this, $sesion);
            $liquidaciones = $financiarVentasDelegado->getLiquidaciones($idVenta);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['liquidaciones'] = $liquidaciones;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Método encargado de registrar la venta
     * @return type
     * @throws MyException
     */
    public function grabarAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $financiacion = $request->get('financiacion');
            if (!is_array($financiacion)) {
                throw new MyException('Debe diligenciar los parámetros de una financiación ', -1);
            }
            $registrarVentasDelegado = new RegistrarVentasDelegado($this, $sesion);
            $financiarVentasDelegado = new FinanciarVentasDelegado($this, $sesion);
            $idFinanciacion = $financiarVentasDelegado->grabarFinanciacion($financiacion);
            //Valida si eliminaron los archivos adjuntos de la financiación de una venta
            if (isset($financiacion['archivoseliminados']) && !empty($financiacion['numerofinanciacion'])) {
                $registrarVentasDelegado->eliminarArchivoAdjunto($financiacion['archivoseliminados']);
            }
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['datos'] = $idFinanciacion;
            $respuesta['mensaje'] = 'Se registró correctamente la financiación con número: ' . $idFinanciacion;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Método encargado de realizar la actualización de los archivos de la financiación
     * de la venta
     * @return json con el resultado de la actualización si fue efectiva o arrojó algún error 
     */
    public function actualizarAdjuntoAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $parametros = $request->get('parametros');
            $financiarVentasDelegado = new FinanciarVentasDelegado($this, $sesion);
            //Se asignan los nuevos archivos a la financiación
            $financiarVentasDelegado->asignarAdjuntos($parametros);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se guardó la información correctamente con número ' . $parametros['idventa'];
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta el listados de parentescos que se encuentran en la base de datos 
     * @return json lista de parentescos 
     */
    public function obtenerParentescosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $financiarVentasDelegado = new FinanciarVentasDelegado($this, $sesion);
            $parentescos = $financiarVentasDelegado->getParentescos();
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['parentescos'] = $parentescos;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Función encargada de recibir los adjuntos que el usuario 
     * eligió en la interfaz
     * @return json con el resultado de la acción
     */
    public function subirAdjuntoAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $modulo = $request->get('modulo');
            if (empty($modulo) && !is_string($modulo)) {
                throw new MyException('Error, se debe especificar el módulo ');
            }
            $listaArchivos = Util::subirAdjunto($request, $sesion->get('idusuario'), $modulo);
            $financiarVentasDelegado = new FinanciarVentasDelegado($this, $sesion);
            $respuesta['uploadedFiles'] = $financiarVentasDelegado->setArchivo($listaArchivos);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['mensaje'] = 'Se adjuntaron correctamente los archivos';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se establece en sesión la información que se va a exportar 
     * a las plantillas de excel 
     * @return json
     */
    public function cargarInformacionFormatoAction() {
        try {
            Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $informacion = $request->get('informacion');
            if (empty($informacion) && !is_string($informacion)) {
                throw new MyException('Error, no se encontró información para formatos de financiación ');
            }
            $_SESSION['informacionformato'] = $informacion;
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['mensaje'] = 'Se guardó la información de la financiación correctamente';
        } catch (Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
