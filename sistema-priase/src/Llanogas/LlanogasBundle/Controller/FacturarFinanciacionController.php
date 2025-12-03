<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\RecaudosModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoFacturarFinanciacion;
use Llanogas\LlanogasBundle\ValidacionException;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;

/**
 * Clase encargada de facturar la financiación.
 */
class FacturarFinanciacionController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $conexion = Util::getConexion($this);
        $sesion = Util::iniciarSesion($this);
        $idEmpresa = $sesion->get('idempresa');
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $lisParametros['ciclos'] = $this->consultarCiclosActivos($conexion, $idEmpresa);
        $response = $this->render('LlanogasLlanogasBundle:Cartera:FacturarFinanciacion.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta los tipos de suscripción dependiendo por la empresa
     * @param int $idEmpresa  Id empresa
     * @param \Doctrine\DBAL\Connection $conexion conexión a la base de datos
     * @return array con la información de los tipos de suscripción.
     */
    private function consultarTiposSuscripcion($idEmpresa, $conexion) {
        $objModel = new RecaudosModel();
        $objModel->setConexion($conexion);
        $tiposSuscripcion = $objModel->consultarTiposSuscripcion($idEmpresa);
        return $tiposSuscripcion;
    }

    /**
     * Consulta los ciclos activos de una empresa
     * @param \Doctrine\DBAL\Connection $conexion conexion a la base de datos
     * @param int $idEmpresa Identificador de la empresa que se quiere consultar los ciclos
     * @return array con los ciclos activos.
     */
    private function consultarCiclosActivos($conexion, $idEmpresa) {
        $genericoModel = new GenericoModel();
        $genericoModel->setConexion($conexion);
        return $genericoModel->consultarCiclosActivosPrograma(PROGRAMA_FACTURAR_FINANCIACION, $idEmpresa);
    }

    /**
     * Inicia el proceso de facturar dependiendo del identificador de la empresa.
     * @return json con la información de la ejecución del proceso.
     * @throws MyException Error en la petición o validación de los conceptos que no hacen base para generación de facturas.
     */
    public function facturarFinanciacionAction() {
        try {
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $idCiclo = $request->get('idciclo');
            $idAcceso = $sesion->get('idacceso');
            $idEmpresa = $sesion->get("idempresa");
            $continuar = $request->get('continua');
            $genericoDelegado = new GenericoDelegado($conexion);
            //Se valida si el programa ya se ejecutó
            $genericoDelegado->validarPrograma(PROGRAMA_FACTURAR_FINANCIACION, $idCiclo, $idEmpresa);
            $procesoFacturarFinanciacion = new ProcesoFacturarFinanciacion($idAcceso, $idCiclo);
            //Valida si hay un proceso en ejecución 
            $procesoFacturarFinanciacion->validarProcesoEjecucion();
            //Si la persona no ha dado en continuar se muestra un dialogo con los conceptos que no hacen base 
            //para liquidarles interés y si el usuario ya dio en continuar se omite el dialogo con la información
            if ($continuar == 0) {
                $procesoFacturarFinanciacion->validarConceptosDeLiquidaciones();
            }
            //Se llena la tabla temporal con todas las financiaciones a liquidar
            $procesoFacturarFinanciacion->cargarFinanciaciones();
            $mensaje = $procesoFacturarFinanciacion->cantidadFacturasFinanciadas();
            //Después de cargar las suscripciones que se va a liquidar se diligencia el concepto de interés que se 
            //va a liquidar
            $procesoFacturarFinanciacion->actualizarTasaInteres();
            //Se lanzan los hilos del proceso de financiación
            $this->iniciarProcesoFacturacion($idAcceso, $idCiclo);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = ($mensaje <= 0) ? 'No hay financiaciones para facturar en ese ciclo' : 'Se inicia el proceso de facturación';
        } catch (ValidacionException $e) {
            //Se devuelven la lista de conceptos que no hacen base para la tasa de interés
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
            $respuesta['conceptos'] = $e->getData();
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta el progreso de un proceso en ejecución 
     * @return type
     */
    public function getProgresoProcesoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idCiclo = $request->get('idciclo');
            $idAcceso = $sesion->get('idacceso');
            $procesoFacturarFinanciacion = new ProcesoFacturarFinanciacion($idAcceso, $idCiclo);
            $procesoFacturarFinanciacion->validarProcesoEjecucion();
            $respuesta["codigoRespuesta"] = 0;
            $respuesta['mensaje'] = 'Se consultaron correctamente los procesos';
        } catch (ValidacionException $ex) {
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = $ex->getMessage();
            $respuesta["datos"] = $ex->getData();
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Devuelve el resumen del resultado de la ejecución del proceso
     * @return type
     */
    public function getResultadoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idCiclo = $request->get('idciclo');
            $idAcceso = $sesion->get('idacceso');
            $procesoFacturarFinanciacion = new ProcesoFacturarFinanciacion($idAcceso, $idCiclo);
            //Lista de errores en el proceso 
            $listaErrores = $procesoFacturarFinanciacion->getErrores();
            //Lista de suscripciones liquidadas correctamente
            $correctos = $procesoFacturarFinanciacion->getSatisfactorios();
            $respuesta["codigoRespuesta"] = (empty($correctos) && empty($listaErrores)) ? 0 : 1;
            $respuesta["mensaje"] = 'Se finalizó el proceso';
            $respuesta['errores'] = $listaErrores;
            $respuesta['correctos'] = $correctos;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Método encargado de pasar las facturas en estado='X' pendiente por 
     * aprobar a A=Activas y les asigna un número de acuerdo a la tabla nudo
     * @return type Resultado de la operación
     */
    public function aprobarFacturacionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idCiclo = $request->get('idciclo');
            if (!is_numeric($idCiclo)) {
                throw new MyException('Debe seleccionar un ciclo', -1);
            }
            $idAcceso = $sesion->get('idacceso');
            $procesoFacturarFinanciacion = new ProcesoFacturarFinanciacion($idAcceso, $idCiclo);
            $listaErrores = $procesoFacturarFinanciacion->aprobarFacturacion();
            $respuesta["codigoRespuesta"] = empty($listaErrores) ? 1 : -1;
            $respuesta["mensaje"] = empty($listaErrores) ? 'Se finalizó el proceso' : 'Error al aprobar  ' . $listaErrores[0]['mensaje'];
            $respuesta["errores"] = $listaErrores;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Lanza los proceso de acuerdo al ciclo y el acceso
     * @param type $idAcceso identificador de la tabla de acc_acceso
     * @param type $idCiclo id del ciclo que se está ejecutando
     */
    private function iniciarProcesoFacturacion($idAcceso, $idCiclo) {
        $sesion = Util::iniciarSesion($this);
        $idEmpresa = $sesion->get('idempresa');
        for ($i = 0; $i < NUMERO_HILOS_FACTURACION_FINANCIACION; $i++) {
            $parametros = "$idAcceso $idCiclo $i $idEmpresa " . RUTA_PRINCIPAL;
            $script = $this->container->get('kernel')->locateResource('@LlanogasLlanogasBundle') . "ProcesosMasivos/EjecutaProcesoFacturacionFinanciacion.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/facturacion_financiacion_$i.log &";
            Util::ejecutarHilo($script);
        }
    }

}
