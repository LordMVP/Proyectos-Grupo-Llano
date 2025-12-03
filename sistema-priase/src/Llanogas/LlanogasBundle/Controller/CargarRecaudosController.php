<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Delegado\RecaudosDelegado;
use Llanogas\LlanogasBundle\Delegado\CargarRecaudosDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\ProcesosMasivos\EjecutaProcesoCargarRecaudo;

/**
 * Hace la importación masiva de los recaudos
 */
class CargarRecaudosController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $recaudosDeledado = new RecaudosDelegado($this, $sesion);
        $cargarRecaudosDeleago = new CargarRecaudosDelegado($this, $sesion);
        $idUsuario = $sesion->get('idusuario');
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        //cargar el combo de medios de pago
        $lisParametros['cmbMedioPago'] = $cargarRecaudosDeleago->getMediosPago();
        //cargar el combo de sucursales
        $cmbSucursal = $recaudosDeledado->consultarSucursal(PROGRAMA_CARGAR_RECAUDOS, $idUsuario);
        //$lisParametros['cmbSucursal'] = $cmbSucursal;
        //Realizar el render de la página
        $response = $this->render('LlanogasLlanogasBundle:Recaudos:importar.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Se validan los parámetros y las líneas del archivo para verificar que la información esté correcta 
     * Además de verificar que no hayan procesos que estén activos de cumplir con todo el proceso es lanzado
     * @return codigoRespuesta
     * @throws MyException
     */
    public function cargarAction() {

        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();

            $cargarRecaudoDelegado = new CargarRecaudosDelegado($this, $sesion);
            Util::validarPeticion($this);
            $idFormaPago = $request->get('idformapago');
            if (!is_numeric($idFormaPago)) {
                throw new MyException('Debe seleccionar una forma de pago', -1);
            }
            $idMedioPago = $request->get('idmediopago');
            if (!is_numeric($idMedioPago)) {
                throw new MyException('Debe seleccionar un medio de pago', -1);
            }
            $idSucursal = $request->get('idsucursal');
            if (!is_numeric($idSucursal)) {
                throw new MyException('Debe seleccionar una sucursal', -1);
            }
            $fechaPago = $request->get('fechapago');
            if (!empty($fechaPago)) {
                $fechaPago = str_replace('/', '-', $fechaPago);
            }
            /*
             * Validar Que no haya nada en cpr 
             */
            $parametrosProceso['idprograma'] = PROGRAMA_CARGAR_RECAUDOS;
            $parametrosProceso['idempresa'] = $sesion->get('idempresa');
            $CantidadProcesosActivos = $cargarRecaudoDelegado->getControlEjecucionProceso($parametrosProceso);
            if ($CantidadProcesosActivos > 0) {
                throw new MyException('Ya hay un proceso que inicio el cargue de pagos y no a terminado', -1);
            }
            $parametrosProceso['idacceso'] = $sesion->get("idacceso");
            $parametrosProceso['estado'] = 'A';
            $parametrosProceso['idusuario'] = $sesion->get('idusuario');
            /*
             * Se hace la inserción en la tabla de control de proceso
             * Para que otra persona no suba otro edificio 
             */
            $cargarRecaudoDelegado->insertaControlEjecucionProceso($parametrosProceso);

            $listaArchivos = Util::subirAdjunto($request, $sesion->get('idusuario'), 'recaudos');

            $infoRecaudo['idmediopago'] = $idMedioPago;
            $infoRecaudo['idsucursal'] = $idSucursal;
            $infoRecaudo['idformapago'] = $idFormaPago;
            $infoRecaudo['fechapago'] = $fechaPago;
            /*
             * Se incluye control de execepcion en validación preeliminar del Archivo 
             * para liberar el control de proceso en caso de que el archivo no pase la validación 
             * de las reglas de cada archivo plano si hay alguna novedad se relanza la excepción 
             */
            $cargarRecaudoDelegado->procesarArchivo($listaArchivos, $infoRecaudo);
            if ($infoRecaudo['idmediopago'] != RECAUDADOR_WERE) {
                $this->iniciarProcesoCargarRecuados();
                $respuesta["codigoRespuesta"] = 1;
                $respuesta["mensaje"] = 'Se inició correctamente el proceso de cargue de recaudos';
            } else {
                
                $cargarRecaudoDelegado->inactivarControlEjecucionProceso($parametrosProceso);
                $respuesta["codigoRespuesta"] = 1;
                $respuesta["mensaje"] = 'Se Cargo correctamente el Recaudo WERE';
            }
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Ejecuta el proceso de cargar los recaudos dividiendo la cargar en la 
     * cantidad de hilos disponibles para el proceso
     */
    private function iniciarProcesoCargarRecuados() {
        try {
            $sesion = Util::iniciarSesion($this);
            $idAcceso = $sesion->get("idacceso");
            $idUsuario = $sesion->get("idusuario");
            $idEmpresa = $sesion->get('idEmpresa');
            //Línea para ejecutar el proceso sin hilos
//            $obj = new \Llanogas\LlanogasBundle\ProcesosMasivos\EjecutaProcesoCargarRecaudo($idEmpresa, $idUsuario, $idAcceso, 0);
//            $obj->run();
            for ($numeroProceso = 0; $numeroProceso < NUMERO_HILOS_CARGAR_RECAUDOS; $numeroProceso++) {
                $rutaProyecto = RUTA_PRINCIPAL;
                $parametros = "$idEmpresa $numeroProceso $idAcceso $idUsuario $rutaProyecto";
                $script = $this->container->get("kernel")->locateResource("@LlanogasLlanogasBundle") . "ProcesosMasivos/EjecutaProcesoCargarRecaudo.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/cargue_recaudos_$numeroProceso.log & ";
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
        $resultado['progreso'] = $objProcesoModel->getProcesoEjecucionHilos($idEmpresa, PROGRAMA_CARGAR_RECAUDOS);
        $resultado["codigoRespuesta"] = (empty($resultado['progreso'])) ? 0 : 1;
        $resultado["mensaje"] = "Progreso";
        $conexion->close();
        return Util::construyeRespuesta($resultado);
    }

    /**
     * Consulta el resultado del proceso 
     * @return array - Lista de municipios con cantidad de recaudos cargados
     */
    public function consultarResumenAction() {
        Util::validarPeticion($this);
        $sesion = Util::iniciarSesion($this);
        $cargarRecaudoDelegado = new CargarRecaudosDelegado($this, $sesion);

        $resultado = $cargarRecaudoDelegado->consultarResumen();
        $resultado["codigoRespuesta"] = (empty($resultado['resumencorrectos'])) ? 0 : 1;
//        $resultado["codigoRespuesta"] = (empty($resultado['resumenconerrores'])) ? 0 : 1;
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
        $cargarRecaudoDelegado = new CargarRecaudosDelegado($this, $sesion);
        //Se actualiza todos los registros a estado 'C' la información de la tabla temporal
        $cargarRecaudoDelegado->eliminarTablaTemporal();
        $resultado["codigoRespuesta"] = (empty($resultado['progreso'])) ? 0 : 1;
        $resultado["mensaje"] = "Se realizó la consulta correctamente";
        return Util::construyeRespuesta($resultado);
    }

    public function consultarSucursalesPorMedioPagoAction() {
        Util::validarPeticion($this);
        $sesion = Util::iniciarSesion($this);
        $request = $this->getRequest();
        $recaudosDeledado = new RecaudosDelegado($this, $sesion);
        $idMedioPago = $request->get('idmediopago');
        $resultado = $recaudosDeledado->consultarSucursalesPorMedioPago($idMedioPago);
        return Util::construyeRespuesta($resultado);
    }

}
