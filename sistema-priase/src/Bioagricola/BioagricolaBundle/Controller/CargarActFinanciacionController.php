<?php

namespace Bioagricola\BioagricolaBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Bioagricola\BioagricolaBundle\Delegado\CargarFinanciacionesDelegado;
use Llanogas\LlanogasBundle\MyException;
//use Bioagricola\BioagricolaBundle\ProcesosMasivos\EjecutaProcesoCargarFinanciacion;

/**
 * Hace la importación masiva de las financiaciones especiales
 */
class CargarActFinanciacionController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $idUsuario = $sesion->get('idusuario');
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');  
        $response = $this->render('BioagricolaBioagricolaBundle:Financiacion:importar_Act.html.twig', $lisParametros);
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

            $cargarFinDelegado = new CargarFinanciacionesDelegado($this, $sesion);
            Util::validarPeticion($this);  
            
            /*
             * Validar Que no haya nada en cpr 
             */
            $parametrosProceso['idprograma'] = PROGRAMA_ACT_FIN_ESP_BIO;
            $parametrosProceso['idempresa'] = $sesion->get('idempresa');
            $CantidadProcesosActivos = $cargarFinDelegado->getControlEjecucionProceso($parametrosProceso);
            if ($CantidadProcesosActivos > 0) {
                throw new MyException('Ya hay un proceso que inicio el cargue y Actualizacion de las Financiaicones y no ha terminado', -1);
            }
            $parametrosProceso['idacceso'] = $sesion->get("idacceso");
            $parametrosProceso['estado'] = 'A';
            $parametrosProceso['idusuario'] = $sesion->get('idusuario');
            /*
             * Se hace la inserción en la tabla de control de proceso
             * Para que otra persona no suba otro archivo al mismo tiempo 
             */
            $cargarFinDelegado->insertaControlEjecucionProceso($parametrosProceso);

            $listaArchivos = Util::subirAdjunto($request, $sesion->get('idusuario'), 'financiaciones');
         
            /*
             * Se incluye control de execepcion en validación preeliminar del Archivo 
             * para liberar el control de proceso en caso de que el archivo no pase la validación 
             * de las reglas de cada archivo plano si hay alguna novedad se relanza la excepción 
             */
            $cargarFinDelegado->procesarArchivoAct($listaArchivos);
            $this->iniciarProcesoCargarActFinan();
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = 'Se inició correctamente el proceso de cargue de Financiaciones';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Ejecuta el proceso de cargar los registros y actualizar la financiaciones en la 
     * cantidad de hilos disponibles para el proceso
     */
    private function iniciarProcesoCargarActFinan() {
        try {
            $sesion = Util::iniciarSesion($this);
            $idAcceso = $sesion->get("idacceso");
            $idUsuario = $sesion->get("idusuario");
            $idEmpresa = $sesion->get('idEmpresa');

            for ($numeroProceso = 0; $numeroProceso < NUMERO_HILOS_FIN_ACT_EMER_BIO; $numeroProceso++) {
                $rutaProyecto = RUTA_PRINCIPAL;
                $parametros = "$idEmpresa $numeroProceso $idAcceso $idUsuario $rutaProyecto";
                $script = $this->container->get("kernel")->locateResource("@BioagricolaBioagricolaBundle") . "ProcesosMasivos/EjecutaProcesoCargarActFinan.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/cargue_Act_finan_bio_$numeroProceso.log & ";
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
        $resultado['progreso'] = $objProcesoModel->getProcesoEjecucionHilos($idEmpresa, PROGRAMA_ACT_FIN_ESP_BIO);
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
        $cargarFinanDelegado = new CargarFinanciacionesDelegado($this, $sesion);

        $resultado = $cargarFinanDelegado->consultarResumenAct();
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
        $cargarFinanDelegado = new CargarFinanciacionesDelegado($this, $sesion);
        //Se actualiza todos los registros a estado 'C' la información de la tabla temporal
        $nom_tabla = "esp_tem_act_fin" ;
        $cargarFinanDelegado->eliminarTablaTemporal($nom_tabla);
        $resultado["codigoRespuesta"] = (empty($resultado['progreso'])) ? 0 : 1;
        $resultado["mensaje"] = "Se realizó la consulta correctamente";
        return Util::construyeRespuesta($resultado);
    }   


}
