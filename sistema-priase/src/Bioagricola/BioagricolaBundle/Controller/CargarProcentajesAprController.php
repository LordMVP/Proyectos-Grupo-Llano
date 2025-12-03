<?php

namespace Bioagricola\BioagricolaBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Bioagricola\BioagricolaBundle\Delegado\CargarProcentajesAprDelegado;
use Llanogas\LlanogasBundle\MyException;
//use Bioagricola\BioagricolaBundle\ProcesosMasivos\EjecutaProcesoCargarFinanciacion;

/**
 * Hace la importación masiva de los registros de procentajes de aprovechamiento
 */
class CargarProcentajesAprController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $idUsuario = $sesion->get('idusuario');
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');  
        $response = $this->render('BioagricolaBioagricolaBundle:Financiacion:importarProcentajesApr.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Se valida el nombre del archivo a cargar y la estructura del archivo
     * Además de verificar que no hayan procesos que estén activos de cumplir con todo el proceso es lanzado
     * @return codigoRespuesta
     * @throws MyException
     */
    public function cargarAction() {

        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            $cargarProAprFinDelegado = new CargarProcentajesAprDelegado($this, $sesion);
            Util::validarPeticion($this);  
            $fechaPago = $request->get('fechapago');
            
            if (empty($fechaPago)) {
                throw new MyException('Debe seleccionar un mes y año a cargar', -1);
            }
            $arrayFecha = explode("/", $fechaPago);
            $mesaho = $arrayFecha[1].$arrayFecha[0] ;
            
            /*
             * Validar Que no haya nada en cpr 
             */
            $parametrosProceso['idprograma'] = PROGRAMA_APR_FIN_ESP_BIO;
            $parametrosProceso['idempresa'] = $sesion->get('idempresa');
            $CantidadProcesosActivos = $cargarProAprFinDelegado->getControlEjecucionProceso($parametrosProceso);
            if ($CantidadProcesosActivos > 0) {
                throw new MyException('Ya hay un proceso que inicio el cargue de los porcentajes de aprovechamiento y no ha terminado', -1);
            }
            $parametrosProceso['idacceso'] = $sesion->get("idacceso");
            $parametrosProceso['estado'] = 'A';
            $parametrosProceso['idusuario'] = $sesion->get('idusuario');
            /*
             * Se hace la inserción en la tabla de control de proceso
             * Para que otra persona no suba otro archivo al mismo tiempo 
             */
            $cargarProAprFinDelegado->insertaControlEjecucionProceso($parametrosProceso);

            $listaArchivos = Util::subirAdjunto($request, $sesion->get('idusuario'), 'financiaciones');
          
            $infoFinEsp['mesaho'] = $mesaho ;
            /*
             * Se incluye control de execepcion en validación preeliminar del Archivo 
             * para liberar el control de proceso en caso de que el archivo no pase la validación 
             * de las reglas de cada archivo plano si hay alguna novedad se relanza la excepción 
             */
            $cargarProAprFinDelegado->procesarArchivo($listaArchivos, $infoFinEsp);
            $this->iniciarProcesoCargarPorcentajes();
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = 'Se inició correctamente el proceso que importa los porcentajes de aprovechamiento';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Ejecuta el proceso de cargar los porcentajes de aprovechamiento dividiendo la carga  en la 
     * cantidad de hilos disponibles para el proceso
     */
    private function iniciarProcesoCargarPorcentajes() {
        try {
            $sesion = Util::iniciarSesion($this);
            $idAcceso = $sesion->get("idacceso");
            $idUsuario = $sesion->get("idusuario");
            $idEmpresa = $sesion->get('idEmpresa');
            $rutaProyecto = RUTA_PRINCIPAL;
            $numeroProceso = 0 ;
            $parametros = "$idEmpresa $numeroProceso $idAcceso $idUsuario $rutaProyecto";
            $script = $this->container->get("kernel")->locateResource("@BioagricolaBioagricolaBundle") . "ProcesosMasivos/EjecutaProcesoCargarProcentajesApr.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/cargar_procentajes_apr_$numeroProceso.log & ";
            Util::ejecutarHilo($script);            
            sleep(10);
        } catch (\Exception $exc) {
            print_r($exc->getMessage());
        }
    }

    /**
     * Muestra el estado del proceso en ejecución 
     * @return json con el estado del proceso.
     */
    public function consultarProgresoAction() {
        $sesion = Util::iniciarSesion($this);
        $conexion = Util::getConexion($this);
        $idEmpresa = $sesion->get("idEmpresa");

        $objProcesoModel = new ProcesoModel($conexion);
        $resultado['progreso'] = $objProcesoModel->getProcesoEjecucionHilos($idEmpresa, PROGRAMA_APR_FIN_ESP_BIO);
        $resultado["codigoRespuesta"] = (empty($resultado['progreso'])) ? 0 : 1;
        $resultado["mensaje"] = "Progreso";
        $conexion->close();
        return Util::construyeRespuesta($resultado);
    }    

    /**
     * Consulta el resultado del proceso 
     * @return array - Lista los segmentos con la cantidad de registros cargados
     */
    public function consultarResumenAction() {
        Util::validarPeticion($this);
        $sesion = Util::iniciarSesion($this);
        $cargarFinanDelegado = new CargarProcentajesAprDelegado($this, $sesion);

        $resultado = $cargarFinanDelegado->consultarResumen();
        $resultado["codigoRespuesta"] = (empty($resultado['resumencorrectos'])) ? 0 : 1;

        $resultado["mensaje"] = "Se realizó la consulta correctamente";
        return Util::construyeRespuesta($resultado);
    }

    /**
     * Cambia el estado de las filas de la tabla temporal a 'C'
     * @return 
     */
    public function eliminarResumenAction() {
        Util::validarPeticion($this);
        $sesion = Util::iniciarSesion($this);
        $cargarFinanDelegado = new CargarProcentajesAprDelegado($this, $sesion);
        //Se actualiza todos los registros a estado 'C' la información de la tabla temporal
        $nom_tabla = "temp_imp_por_apr_fin_esp" ;
        $cargarFinanDelegado->eliminarTablaTemporal($nom_tabla);
        $resultado["codigoRespuesta"] = (empty($resultado['progreso'])) ? 0 : 1;
        $resultado["mensaje"] = "Se realizó la consulta correctamente";
        return Util::construyeRespuesta($resultado);
    } 
    
     /**
     * Consulta los porcentajes de aprovechamiento de un mes especifico 
     * @return array - Lista con los porcentajes del mes especifico
     */
    public function buscarDatosAction() 
    {
        Util::validarPeticion($this);
        $sesion = Util::iniciarSesion($this);
        $request = $this->getRequest();
        $fechaPago = $request->get('fechapago');            
        if (empty($fechaPago)) {
            $resultado["codigoRespuesta"] = -1;
            $resultado["mensaje"] = "Debe seleccionar un mes y año a cargar " ;
        }
        else
        {
            $arrayFecha = explode("/", $fechaPago);
            $mesaho = $arrayFecha[1].$arrayFecha[0] ;
            $parametrosProceso['idempresa'] = $sesion->get('idempresa');
            $parametrosProceso['mesaho'] = $mesaho ;
            $cargarFinanDelegado = new CargarProcentajesAprDelegado($this, $sesion);
            $resultado = $cargarFinanDelegado->consultarPorcentajesTercerosFinan($parametrosProceso);      

            $resultado["codigoRespuesta"] = (empty($resultado['por_terceros'])) ? 0 : 1;
            $resultado["mensaje"] = "Se realizó la consulta correctamente " ;
            $resultado["mensaje"] .= (empty($resultado['financiaciones'])) ? ", No se Encontraron Resultados " : "" ;
        }
        return Util::construyeRespuesta($resultado);
    }


}
