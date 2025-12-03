<?php

namespace Llanogas\LlanogasBundle\Controller;

use Doctrine\DBAL\Connection;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Delegado\ProcesoFinanciaEmergenciaDelegado;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Models\ProcesoFinanciaEmergenciaModel;
use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoFinanciarEmergencias;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Clase encargada de administrar las peticiones del caso de uso 
 * de generar interés por mora
 * @author mebonilla
 */
class ProcesoFinanciaEmergenciaController extends Controller {

    /**
     * Función que renderiza la página de financia emergencia
     * @return html con la información de la página
     */
    public function indexAction() {
        $conexion = Util::getConexion($this);
        $sesion = Util::iniciarSesion($this);
        $idEmpresa = $sesion->get('idEmpresa');
        $lisParametros = array();
        $financiaEmergenciaDelegado = new ProcesoFinanciaEmergenciaDelegado($this, $sesion);
        $lisParametros['empresa'] = $sesion->get('empresa');
        $lisParametros['idempresa'] = $sesion->get('idEmpresa');
        $lisParametros['ciclos'] = $financiaEmergenciaDelegado->consultarCiclosActivos($idEmpresa);
        $response = $this->render('LlanogasLlanogasBundle:Cartera:ProcesarFinanciacionEmergencia.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Genera el proceso de interes por mora para una suscripcion o las
     * suscripciones de un ciclo
     * @return json Resultado de la generacion del interes por mora para una
     * suscripcion o las suscripciones de un ciclo
     * @throws MyException
     */
    public function generaProcesoFinanciaEmergenciaAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);

            $actividad = "";
            $resultado = "";
            $parametros = array();
            $con = Util::getConexion($this);
            $accion = strtoupper($request->get("accion"));
            $genericoDelegado = new GenericoDelegado($con);

            switch ($accion) {
                case "S":
                    $parametros["idsuscripcion"] = $request->get("idsuscripcion");
                    if (empty($parametros["idsuscripcion"])) {
                        throw new MyException("Debe seleccionar una suscripción", -1);
                    }
                    $idAcceso = $sesion->get("idacceso");
                    $idUsuario = $sesion->get("idusuario");
                    $idCiclo = $request->get("idciclo");
                    $idEmpresa = $sesion->get('idEmpresa');
                    $financiaEmergenciaDelegado = new ProcesoFinanciaEmergenciaDelegado($this, $sesion);
                    $procesoFinanciarEmergencias = new ProcesoFinanciarEmergencias($idEmpresa, 0, $idAcceso, $idUsuario, 1);
                    $idEmpresa == 325 ? $procesoFinanciarEmergencias->cargarSuscripcionesFinanciarPotenza($parametros["idsuscripcion"]) : $procesoFinanciarEmergencias->cargarSuscripcionesFinanciar($parametros["idsuscripcion"]);
                    $resultado = $idEmpresa == 325 ? $procesoFinanciarEmergencias->consultarCantidadSuscripcionesPotenza() : $procesoFinanciarEmergencias->consultarCantidadSuscripciones();
                    $idEmpresa == 325 ? $procesoFinanciarEmergencias->generarFinanciacionPotenza() : $procesoFinanciarEmergencias->generarFinanciacion();
                    break;
                case "C":
                    $idAcceso = $sesion->get("idacceso");
                    $idUsuario = $sesion->get("idusuario");
                    $idCiclo = $request->get("idciclo");
                    $idEmpresa = $sesion->get('idEmpresa');
                    $procesoActual = $this->consultarProcesoEjecucion($idEmpresa);
                    if (count($procesoActual) > 0) {
                        throw new MyException("El proceso ya se esta ejecutando", -1);
                    }
                    if($idEmpresa == 325){
                        $idCiclo = 0;
                    }
                    $ProcesoFinanciarEmergencias = new ProcesoFinanciarEmergencias($idEmpresa, $idCiclo, $idAcceso, $idUsuario, 0);
                    $idEmpresa == 325 ? $ProcesoFinanciarEmergencias->cargarSuscripcionesFinanciarPotenza() : $ProcesoFinanciarEmergencias->cargarSuscripcionesFinanciar();
                    $resultado = $idEmpresa == 325 ? $ProcesoFinanciarEmergencias->consultarCantidadSuscripcionesPotenza() : $ProcesoFinanciarEmergencias->consultarCantidadSuscripciones();
                    $this->iniciarProcesoFinanciaEmergencia($idEmpresa, $idCiclo, $idAcceso, $idUsuario);
                    break;
            }
            $respuesta["codigoRespuesta"] = (empty($resultado) ? 0 : 1);
            $respuesta["datos"] = $resultado;
            $respuesta["mensaje"] = (empty($resultado) || $resultado <= 0 ) ? "No han sido generadas financiaciones" : "Proceso Financia Emergencia realizado correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Verifica que el proceso no se esté ejecutando por otro usuario.
     * @param int $idEmpresa identificador de la empresa.
     * @return array con la información del proceso
     */
    private function consultarProcesoEjecucion($idEmpresa) {
        $conexion = Util::getConexion($this);
        $objProcesoModel = new ProcesoModel($conexion);
        $resultado = $objProcesoModel->getProcesoEjecucionHilos($idEmpresa, PROGRAMA_FINANCIA_EMERGENCIA);
        $conexion->close();
        return $resultado;
    }

    public function consultaProcesoAction() {

        $sesion = Util::iniciarSesion($this);
        $conexion = Util::getConexion($this);
        $idEmpresa = $sesion->get("idEmpresa");
        $idUsuario = $sesion->get("idUsuario");
        $objProcesoModel = new ProcesoFinanciaEmergenciaModel($conexion, $sesion);
        $resultado['progreso'] = $objProcesoModel->getProcesoEjecucionHilos($idEmpresa, PROGRAMA_FINANCIA_EMERGENCIA, $idUsuario);
        $resultado["codigoRespuesta"] = (empty($resultado['progreso'])) ? 0 : 1;
        $resultado["mensaje"] = "Progreso";
        $conexion->close();
        return Util::construyeRespuesta($resultado);
    }

    /**
     * Método encargado de lanzar los hilos del proceso
     * @param type $idEmpresa
     * @param type $idCiclo
     * @param type $idAcceso
     * @param type $idUsuario
     */
    private function iniciarProcesoFinanciaEmergencia($idEmpresa, $idCiclo, $idAcceso, $idUsuario) {
        try {

            for ($numeroProceso = 0; $numeroProceso < NUMERO_HILOS_FINANCIA_EMERGENCIA; $numeroProceso++) {
                $rutaProyecto = RUTA_PRINCIPAL;
                $parametros = "$idEmpresa $numeroProceso $idCiclo $idAcceso $idUsuario $rutaProyecto";
                $script = $this->container->get("kernel")->locateResource("@LlanogasLlanogasBundle") . "ProcesosMasivos/ProcesoFinanciaEmergencia.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/financiaemergencia_$numeroProceso.log & ";
                Util::ejecutarHilo($script);
            }
            sleep(10);
        } catch (\Exception $exc) {
            print_r($exc->getMessage());
        }
    }

    /**
     * Consulta el resumen de la ejecución del proceso
     * @return type
     */
    public function consultarResumenAction() {
        try {
            $resultado = array();
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $idEmpresa = $sesion->get("idempresa");

            $financiaEmergenciaDelegado = new ProcesoFinanciaEmergenciaDelegado($this, $sesion);
            $resultado = $financiaEmergenciaDelegado->consultarResumen();
            $resultado["codigoRespuesta"] = (empty($resultado['resumencorrectos'])) ? 0 : 1;
            $resultado["mensaje"] = "Se realizó la consulta correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    /**
     * Consulta la lista de municipios para el programa
     * @return type
     * @throws MyException
     */
    public function getMunicipiosAction() {
        $sesion = Util::iniciarSesion($this);
        $request = $this->getRequest();
        try {
            Util::validarPeticion($this);
            $municipio = $request->get("municipio");
            if (empty($municipio)) {
                throw new MyException('Error, el municipio es obligatorio', -1);
            }
            $procesoFinanciaEmergenciaDelegado = new ProcesoFinanciaEmergenciaDelegado($this, $sesion);
            $municipios = $procesoFinanciaEmergenciaDelegado->obtenerMunicipios($municipio);
            $respuesta["codigoRespuesta"] = (empty($municipios) ? 0 : 1);
            $respuesta["datos"] = $municipios;
            $respuesta["mensaje"] = (empty($municipios)) ? "No se encontraron municipios" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Sube al sistema de archivos del servidor un archivo csv enviado por la
     * interfaz del lado del cliente para ser procesado y cargar las respectivas
     * facturas en la base de datos
     * @return array respuesta del servidor
     */
    public function subirArchivosImportacionEmergenciaAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);

            $financiaEmergenciaDelegado = new ProcesoFinanciaEmergenciaDelegado($this, $sesion);

            $listaArchivos = Util::subirAdjunto($request, $sesion->get("idusuario"), "importarfacturas");
            $archivo = $listaArchivos[0];
            $listaLineas = $financiaEmergenciaDelegado->leerArchivo($archivo['rutaarchivo']);
            $lineas = $financiaEmergenciaDelegado->importarFacturas($listaLineas);

            $respuesta["codigoRespuesta"] = $lineas > 0 ? 1 : 0;
            $respuesta["mensaje"] = $lineas > 0 ? "Se Inicio Correctamente el Proceso" : "Error Cargando archivo";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
