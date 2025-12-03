<?php

namespace Bioagricola\BioagricolaBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Bioagricola\BioagricolaBundle\Delegado\GenerarAmortizacionDelegado;
use Llanogas\LlanogasBundle\MyException;
//use Bioagricola\BioagricolaBundle\ProcesosMasivos\EjecutaProcesoCargarFinanciacion;

/**
 * Hace la importación masiva de las financiaciones especiales
 */
class GenerarAmortizacionController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $idUsuario = $sesion->get('idusuario');
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');  
        $response = $this->render('BioagricolaBioagricolaBundle:Financiacion:GenerarAmortizacion.html.twig', $lisParametros);
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

            $genAmortDelegado = new GenerarAmortizacionDelegado($this, $sesion);
            Util::validarPeticion($this);             
            
            /*
            * Validar Que no haya nada en cep_ctrejepro 
            */
            $parametrosProceso['idprograma'] = PROGRAMA_GEN_AMORT_FIN_ESP_BIO;
            $parametrosProceso['idempresa'] = $sesion->get('idempresa');
            $CantidadProcesosActivos = $genAmortDelegado->getControlEjecucionProceso($parametrosProceso);
            if ($CantidadProcesosActivos > 0) {
                throw new MyException('Ya hay un proceso que inicio la generacion de la amortizacion y no ha terminado', -1);
            }
            $parametrosProceso['idacceso'] = $sesion->get("idacceso");
            $parametrosProceso['estado'] = 'A';
            $parametrosProceso['idusuario'] = $sesion->get('idusuario');
            /*
             * Se hace la inserción en la tabla de control de proceso
             * Para que otra persona no suba otro archivo al mismo tiempo 
             */
            $genAmortDelegado->insertaControlEjecucionProceso($parametrosProceso);         
            /*
             * Se incluye control de execepcion en cargue de la tabla temporal y valdiacion 
             * para liberar el control de proceso en caso de que no hayan financiaciones a procesar  
             */
            $genAmortDelegado->consultarFinanaProcesar();
            $this->iniciarProcesoGenerarAmortizacion();
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = 'Se inició correctamente el proceso de generacion de Amortizaciones...';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Ejecuta el proceso de generar amortizacion en la 
     * cantidad de hilos disponibles para el proceso
     */
    private function iniciarProcesoGenerarAmortizacion() {
        try {
            $sesion = Util::iniciarSesion($this);
            $idAcceso = $sesion->get("idacceso");
            $idUsuario = $sesion->get("idusuario");
            $idEmpresa = $sesion->get('idEmpresa');

            for ($numeroProceso = 0; $numeroProceso < NUMERO_HILOS_GEN_AMOT_BIO; $numeroProceso++) {
                $rutaProyecto = RUTA_PRINCIPAL;
                $parametros = "$idEmpresa $numeroProceso $idAcceso $idUsuario $rutaProyecto";
                $script = $this->container->get("kernel")->locateResource("@BioagricolaBioagricolaBundle") . "ProcesosMasivos/EjecutaProcesoGenerarAmortizacion.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/gen_amortiz_finan_bio_$numeroProceso.log & ";
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
        $resultado['progreso'] = $objProcesoModel->getProcesoEjecucionHilos($idEmpresa, PROGRAMA_GEN_AMORT_FIN_ESP_BIO);
        $resultado["codigoRespuesta"] = (empty($resultado['progreso'])) ? 0 : 1;
        $resultado["mensaje"] = "Progreso";
        $conexion->close();
        return Util::construyeRespuesta($resultado);
    }    

    /**
     * Consulta el resultado del proceso 
     * @return array - Lista los segmentos con la cantidad de financiaciones Procesadas
     */
    public function consultarResumenAction() {
        Util::validarPeticion($this);
        $sesion = Util::iniciarSesion($this);
        $genAmortDelegado = new GenerarAmortizacionDelegado($this, $sesion);

        $resultado = $genAmortDelegado->consultarResumen();
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
        $genAmortDelegado = new GenerarAmortizacionDelegado($this, $sesion);
        //Se actualiza todos los registros a estado 'C' la información de la tabla temporal
        $nom_tabla = "temp_finan_esp" ;
        $genAmortDelegado->eliminarTablaTemporal($nom_tabla);
        $resultado["codigoRespuesta"] = (empty($resultado['progreso'])) ? 0 : 1;
        $resultado["mensaje"] = "Se realizó la consulta correctamente";
        return Util::construyeRespuesta($resultado);
    }
    
    /**
     * genera el plano con las cuotas a crobrar
     * @return array - Lista de registros de las financiaciones a cobrar
     */
    public function GenerarPlanoAction() {   
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $genAmortDelegado = new GenerarAmortizacionDelegado($this, $sesion);
            Util::validarPeticion($this); 
            $datos = $genAmortDelegado->consultarInfoCuo();
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
