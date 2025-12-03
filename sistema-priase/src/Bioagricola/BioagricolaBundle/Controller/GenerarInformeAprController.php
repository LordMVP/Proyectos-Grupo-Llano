<?php

namespace Bioagricola\BioagricolaBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Bioagricola\BioagricolaBundle\Delegado\GenerarInformeAprDelegado;
use Llanogas\LlanogasBundle\MyException;

/**
 * Hace la actualizacion de los cambios de valor que no se han aplicado, 
 * se debe ejecutar antes de descargar los cambios de valor para DataEase
 */
class GenerarInformeAprController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $idUsuario = $sesion->get('idusuario');
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');  
        $response = $this->render('BioagricolaBioagricolaBundle:Financiacion:GenerarInformeApr.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * se consultan las facturas que se procesaran para informe de aprovechamiento
     * Además de verificar que no hayan procesos que estén activos de cumplir con todo el proceso es lanzado
     * @return codigoRespuesta
     * @throws MyException
     */
    public function cargarAction() {

        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $Gen_Inf_Apr_Delegado = new GenerarInformeAprDelegado($this, $sesion);
            Util::validarPeticion($this);             
            $fechaPago = $request->get('fechapago');
            
            if (empty($fechaPago)) {
                throw new MyException('Debe seleccionar un mes y año a Procesar', -1);
            }
            $arrayFecha = explode("/", $fechaPago);
            $mesaho = $arrayFecha[1].$arrayFecha[0] ;
            /*1
             * Validar Que no haya nada en cep_ctrejepro 
             */
            $parametrosProceso['idprograma'] = PROGRAMA_GEN_INF_APR_FIN_ESP_BIO;
            $parametrosProceso['idempresa'] = $sesion->get('idempresa');
            $CantidadProcesosActivos = $Gen_Inf_Apr_Delegado->getControlEjecucionProceso($parametrosProceso);
            if ($CantidadProcesosActivos > 0) {
                throw new MyException('Ya hay un proceso que inicio la actualizacion de Cambios de Valor DxD no ha terminado', -1);
            }
            $parametrosProceso['idacceso'] = $sesion->get("idacceso");
            $parametrosProceso['estado'] = 'A';
            $parametrosProceso['idusuario'] = $sesion->get('idusuario');
            /*
             * Se hace la inserción en la tabla de control de proceso
             * Para que otra persona no genere la temporal de cambios de valor al mismo tiempo 
             */
            $Gen_Inf_Apr_Delegado->insertaControlEjecucionProceso($parametrosProceso);  
            /*
             * Se incluye control de execepcion en cargue de la tabla temporal y valdiacion 
             * para liberar el control de proceso en caso de que no hayan cambios de Valor  
             */
            $Gen_Inf_Apr_Delegado->consultarRegistrosProcesar($mesaho);
            $this->iniciarProcesoGenerarInforApr();
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = 'Se inició correctamente el proceso que Genera el informe de Aprovechamiento';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Ejecuta el proceso para procesar el Informe de Aprovechamiento
     * @param int $can_hilos cantidad de hilos a procesar
     * cantidad de hilos disponibles para el proceso
     */
    private function iniciarProcesoGenerarInforApr() {
        try {
            $sesion = Util::iniciarSesion($this);
            $idAcceso = $sesion->get("idacceso");
            $idUsuario = $sesion->get("idusuario");
            $idEmpresa = $sesion->get('idEmpresa');

            for ($numeroProceso = 0; $numeroProceso < NUMERO_HILOS_GEN_INF_APR_BIO ; $numeroProceso++) {
                $rutaProyecto = RUTA_PRINCIPAL;
                $parametros = "$idEmpresa $numeroProceso $idAcceso $idUsuario $rutaProyecto";
                $script = $this->container->get("kernel")->locateResource("@BioagricolaBioagricolaBundle") . "ProcesosMasivos/EjecutaProcesoGenerarInformeApr.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/generarInformeApr_$numeroProceso.log & ";
                Util::ejecutarHilo($script);
            }
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
        $resultado['progreso'] = $objProcesoModel->getProcesoEjecucionHilos($idEmpresa, PROGRAMA_GEN_INF_APR_FIN_ESP_BIO);
        $resultado["codigoRespuesta"] = (empty($resultado['progreso'])) ? 0 : 1;
        $resultado["mensaje"] = "Progreso";
        $conexion->close();
        return Util::construyeRespuesta($resultado);
    }    

    /**
     * Consulta el resultado del proceso 
     * @return array - Lista los segmentos con la cantidad de financiaciones cargadas
     */
    public function consultarResumenAction() {
        Util::validarPeticion($this);
        $sesion = Util::iniciarSesion($this);
        $Gen_Inf_Apr_Delegado = new GenerarInformeAprDelegado($this, $sesion);

        $resultado = $Gen_Inf_Apr_Delegado->consultarResumen();
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
        $Gen_Inf_Apr_Delegado = new GenerarInformeAprDelegado($this, $sesion);
        //Se actualiza todos los registros a estado 'C' la información de la tabla temporal
        $Gen_Inf_Apr_Delegado->eliminarTablaTemporal();
        $resultado["codigoRespuesta"] = (empty($resultado['progreso'])) ? 0 : 1;
        $resultado["mensaje"] = "Se realizó la consulta correctamente";
        return Util::construyeRespuesta($resultado);
    }  
    /**
     * genera el informe de aprovechamiento
     * @return array - Lista los segmentos con la cantidad de financiaciones cargadas
     */
    public function GenerarInformeAction() {   
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $Gen_Inf_Apr_Delegado = new GenerarInformeAprDelegado($this, $sesion);
            Util::validarPeticion($this);             
            $fechaPago = $request->get('fechapago');

            if (empty($fechaPago)) {
                throw new MyException('Debe seleccionar un mes y año a Consultar', -1);
            }
            $arrayFecha = explode("/", $fechaPago);
            $mesaho = $arrayFecha[1].$arrayFecha[0] ;     

            $datos = $Gen_Inf_Apr_Delegado->consultarInfoCon($mesaho);
            if(!empty($datos))
            {
                $resultado['datos'] = $datos ;  
                $resultado["codigoRespuesta"] =  2;
                $resultado["mensaje"] = "Se realizó la consulta correctamente " ;
            }
            Else
            {    
                $resultado['datos'] = $datos ;  
                $resultado["codigoRespuesta"] =  0;
                $resultado["mensaje"] = "Se realizó la consulta, pero no hay Datos Generados" ;
            }
        } catch (\Exception $ex) {
            $resultado['datos'] = "" ;  
            $resultado["codigoRespuesta"] = - 1;
            $resultado["mensaje"] =  $ex->getMessage() ; 
        }
  
        return Util::construyeRespuesta($resultado);
    }

}
