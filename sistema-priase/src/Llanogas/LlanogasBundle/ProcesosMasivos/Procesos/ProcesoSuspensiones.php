<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Models\ProcesoSuspensionModel;
use Llanogas\LlanogasBundle\Models\SuspensionModel;
use Llanogas\LlanogasBundle\MyException;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ProcesoSuspensiones
 *
 * @author mebonilla
 */
class ProcesoSuspensiones {

    private $idEmpresa;
    private $idAcceso;
    private $idPrograma;
    private $tipoDeUso;
    private $desde;
    private $hasta;
    private $fechaIni;
    private $fechaFin;
    private $idUsuario;
    private $conexion;
    private $suscripcion;
    private $idSuscripcion;
    private $cantidadProcesadas;
    private $idTipoSuspension;
    private $idNuevoEncabezado;
    private $idMunicipio;

    /**
     *
     * @var ProcesoSuspensionModel 
     */
    private $procesoSuspensionesModel;

    /**
     *
     * @var SuspensionModel 
     */
    private $suspensionModel;

    /**
     *
     * @var ProcesoModel
     */
    private $procesoModel;
    private $idControlProceso;

    /**
     * Constructor de la clase
     * @param int $idEmpresa identificador de la empresa
     * @param int $idAcceso identificador de la sesion del usuario
     * @param int $idPrograma identificador del programa
     * @param int $tipoDeUso identificador del tipo de uso
     * @param int $desde valor inicial del intervalo de cantidad de facturas
     * vencidas por suscripcion
     * @param int $hasta valor final del intervalo de cantidad de facturas
     * vencidas por suscripcion
     * @param date $fechaIni  valor inicial de la fecha de vencimiento de 
     * las facturas de la suscripcion
     * @param date $fechaFin valor final de la fecha de vencimiento de 
     * las facturas de la suscripcion
     * @param int $idUsuario
     */
    function __construct($idEmpresa, $idAcceso, $idPrograma, $tipoDeUso, $desde, $hasta, $fechaIni, $fechaFin, $idUsuario, $municipios) {
        $this->idEmpresa = $idEmpresa;
        $this->idAcceso = $idAcceso;
        $this->idPrograma = $idPrograma;
        $this->tipoDeUso = $tipoDeUso;
        $this->desde = $desde;
        $this->hasta = $hasta;
        $this->fechaIni = $fechaIni;
        $this->fechaFin = $fechaFin;
        $this->idMunicipio = $municipios;
        $this->cantidadProcesadas = 0;
        $this->idUsuario = $idUsuario;
        $this->conexion = ConexionBD::getConexion();
        $this->procesoSuspensionesModel = new ProcesoSuspensionModel($this->conexion);
        $this->suspensionModel = new SuspensionModel($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
    }

    /**
     * Inicia el proceso de generar suspensiones.
     */
    public function iniciar() {
        $this->registrarProceso();
        try {
            $this->crearTablaResumen($this->idEmpresa);
            print_r("consultar suscripciones \n");
            if ($this->desde == 0 && $this->hasta == 0) {
                $this->validarSuspensionesFraude();
                $this->finalizarProceso();
                return;
            }
            $suscripciones = $this->consultarSuscripcionesPerSyr();
            print_r($suscripciones);
            print_r(" \n");
            if (empty($suscripciones)) {
                $this->procesoSuspensionesModel->insertarResumenProcesoSuspensiones('0', '0', '1', 'P', '0', MENSAJE_SIN_SUSPENSIONES, "SR", $this->idEmpresa, $this->idUsuario);
                $this->finalizarProceso();
                throw new MyException("No se encontraron suscripciones validas para el proceso", 0);
            }
            $cont = 1;
            print_r(" ====================================== SE INICIA PROCESO PARA CADA SUSCRIPCIÓN ========================================= \n ");
            foreach ($suscripciones as $suscripcion) {
                print_r("------------------------------------------$cont---------------------------------------- \n");
                $this->validadCondicionSuscripcion($suscripcion);
                $cont++;
            }
        } catch (\Exception $exc) {
            print_r($exc->getMessage());
            print_r(" \n");
        }
        $this->finalizarProceso();
    }

    /**
     * Consulta el lote de suspensiones que cumple con las conticiones enviadas
     * por el usuario a traves de la intefaz grafica
     * @return array Informacion de las suscripciones con saldo
     */
    private function consultarSuscripcionesPerSyr() {

        $suscripciones = $this->procesoSuspensionesModel->consultarSuscripcionesProceso($this->idEmpresa, $this->tipoDeUso, $this->desde, $this->hasta, $this->fechaIni, $this->fechaFin, $this->idMunicipio);    
         return $suscripciones;
    }

    /**
     * Valida todas las suscripciones con suspensiones activas y realizadas para verificar posible suspensión por fraude
     */
    private function validarSuspensionesFraude() {
        print_r("LLEGÓ PARA EMPEZAR");
        try {
            $cont = 0;
            $suspensiones = $this->procesoSuspensionesModel->consultarSuspensionesEjecutadas($this->tipoDeUso, NOVEDADES_PARA_SUSPENSION_FRAUDE, $this->idEmpresa, $this->idMunicipio );
            if (empty($suspensiones)) {
                $this->procesoSuspensionesModel->insertarResumenProcesoSuspensiones('0', '0', '1', 'P', '0', MENSAJE_SIN_SUSPENSIONES, "SR", $this->idEmpresa, $this->idUsuario);
                $this->finalizarProceso();
                throw new MyException("No se encontraron suscripciones validas para el proceso", 0);
            }
            print_r(' ====================================== SE INICIA LA VALIDACIÓN PARA SUSPENDIDO CONSUMIENDO  ========================================= ' . count($suspensiones) . " \n ");
            foreach ($suspensiones as $suspension) {
                print_r("------------------------------------------$cont---------------------------------------- \n");
                $this->suscripcion = $suspension;
                $this->generarSuspensionFraude();
                $cont++;
            }
        } catch (\Exception $exc) {
            print_r($exc->getMessage());
            print_r(" \n");
        }
    }

    /**
     * Realiza los procesos de filtro y busqueda para determinar una suspension
     * de tipo fraude o consumiendo suspendido
     * @param array $suscripcion informacion de la suscripcion
     * @throws MyException
     */
    private function generarSuspensionFraude() {
        $this->idSuscripcion = $this->suscripcion["idsuscripcion"];
        print_r(" ----- Id de la suscripcion a procesar: $this->idSuscripcion \n");

        $reconexion = $this->procesoSuspensionesModel->consultarUltimaReconexion($this->suscripcion["idsuspension"]);
        if (!empty($reconexion)) {
            return;
        }
        $cicPer = $this->procesoSuspensionesModel->obtenerCicloPeriodoAnteriorSuscripcion($this->idSuscripcion);
        // Validacion temporal para cuando no hay ciclo periodo para una suscripcion
        if (empty($cicPer["idciclo"]) && empty($cicPer["idperiodo"])) {
            print_r("Error la suscripción no tiene ciclo periodo activo ");
            return;
            //throw new MyException("Error la suscripción no tiene ciclo periodo activo ", -1);
        }

        $infoSuspension = $this->procesoSuspensionesModel->consultarLecturaSuspension($this->suscripcion['idsuspension']);
        $lectura = $this->procesoSuspensionesModel->consultarUltimaLectura($this->idSuscripcion, $cicPer["idciclo"], $cicPer["idperiodo"], $infoSuspension["fechaejecucion"]);
        if (!empty($lectura)) {
            print_r(" La lectura de la suspensióne es " . $infoSuspension["lectura"] . " ==== Y de la lectura del periodo " . $lectura["lecturaactual"]);
            $this->suscripcion['fechaejecucion'] = $infoSuspension['fechaejecucion'];
            if ($infoSuspension["lectura"] < $lectura["lecturaactual"]) {
                print_r("la lectura actual es diferente a la lectura de la ultima suspension para fraude \n y el proceso es -->  ". $infoSuspension['Proceso'] );
                $tipo ='F';
                if ($infoSuspension['proceso'] =='R' || $infoSuspension['proceso'] =='D' || $infoSuspension['proceso'] =='G' ){
                    $tipo ='G';
                }
                $this->generarSuspension($this->suscripcion, $tipo);
            }
        }
    }

    /**
     * Valida el estado de la suscripcion para determinar si se debe realizar
     * una suspension por pago o por fraude
     * @param array $suscripcion informacion de la suscripcion
     */
    private function validadCondicionSuscripcion($suscripcion) {
        try {
            print_r("valida que la suscripción esté activa \n ". $suscripcion['idsuscripcion']);
            // inicia la validacion con el valor de los conceptos
            $estadoSuscripcion = $this->procesoSuspensionesModel->consultarEstadoSuscripcion($suscripcion['idsuscripcion']);
            if ($estadoSuscripcion == 'A') {
                $this->validarTipoSuspension($suscripcion);
            }
        } catch (\Exception $exc) {
            print_r($exc->getMessage());
            print_r($exc->getTraceAsString());
        }
    }

    private function validarTipoSuspension($suscripcion) {
        //Se agrega validación para cancelar todas las suspensiones que están programadas 
        //Que sean anteriores a hoy y el usuario haya tenido un pago
        if ($this->desde == 999 && $this->hasta == 999) {
            $idSuscripcion = $suscripcion["idsuscripcion"];
            $cicPer = $this->procesoSuspensionesModel->obtenerCicloPeriodoActualSuscripcion($idSuscripcion);
            $encabezado = $this->procesoSuspensionesModel->consultarEncabezadoSuspension($idSuscripcion, $cicPer["idciclo"], $cicPer["idperiodo"], $cicPer["cicloanio"]);
            $utlSuspension = $this->procesoSuspensionesModel->consultarUltimaSuspension($encabezado["idsuspension"]);
            if(!empty($utlSuspension)){
                $this->procesoSuspensionesModel->cancelarSuspension($utlSuspension["idsuspension"]);   
            }
            $this->procesoModel->aumentarCantidadRegistro($this->idControlProceso);
            return;
        }
        //Se valida que el usuario tenga más de dos meses con facturas vencidas
        if ($this->desde >= 2) {
            print_r("genera suspension por morosidad \n");
            $this->generarSuspension($suscripcion, "O");
            print_r("Fin de la generacion de suspension por morosidad \n");
        } else {
            print_r("genera suspension por pago \n");
            $this->generarSuspension($suscripcion, "P");
            print_r("Fin de la generacion de suspension por pago \n");
        }
    }

    /**
     * Genera la suspension segun el tipo enviado por el proceso
     * @param array $suscripcion informacion de la suscripcion a procesar
     * @param string $tipo Valor del tipo de suspension que va a realizarse
     */
    private function generarSuspension($suscripcion, $tipo) {
        try {
            print_r("inicia transaccion \n");
            $this->conexion->beginTransaction();
            $idSuscripcion = $suscripcion["idsuscripcion"];
            //Verifica que no tenga ninguna solicitud de PQR pendiente en TECSOFT 
            $pqr = $this->procesoSuspensionesModel->validarSolicitudPqr($idSuscripcion);
            if ($pqr["numerosolicitudes"] > 0) {
                print_r("Error, la suscripción tiene registro pqr sin cerrar, no se puede generar suspensión \n");
                return;
            }

            print_r("Id de la suscripcion a procesar: $idSuscripcion");
            $cicPer = $this->procesoSuspensionesModel->obtenerCicloPeriodoActualSuscripcion($idSuscripcion);
            // Validacion temporal para cuando no hay ciclo periodo para una suscripcion
            if (empty($cicPer)) {
                throw new MyException("Error la suscripción no tiene ciclo periodo activo ", -1);
            }

            $encabezado = $this->procesoSuspensionesModel->consultarEncabezadoSuspension($idSuscripcion, $cicPer["idciclo"], $cicPer["idperiodo"], $cicPer["cicloanio"]);
            if (!empty($encabezado)) {
                print_r("la suscripcion tiene encabezado \n");
                $utlSuspension = $this->procesoSuspensionesModel->consultarUltimaSuspension($encabezado["idsuspension"]);
                $this->validarEstadoSuspension($idSuscripcion, $utlSuspension, $encabezado["idsuspension"], $tipo);
                return;
            }
            $this->insertarSuspension($idSuscripcion, $cicPer, $tipo);
        } catch (\Exception $exc) {
            print_r(' ==== LLEGÓ A ERROR');
            $this->conexion->rollBack();
            print_r($exc->getMessage());
            print_r($exc->getTraceAsString());
            //throw new MyException("\nFallo sobre el proceso " . $exc->getFile() . " - " . $exc->getCode() . " - " . $exc->getLine() . " - " . $exc->getMessage() . "\n", -1);
        } finally {
            $this->conexion->commit();
        }
    }

    /**
     * Genera un nuevo encabezado para luego generar la suspensión y aumentar el registro en cpr
     */
    private function insertarSuspension($idSuscripcion, $cicloPeriodo, $tipo) {
        print_r("la suscripcion no tiene encabezado \n");
        $propiedad = $this->procesoSuspensionesModel->obtenerPropiedadSuscripcion($idSuscripcion);
        print_r($cicloPeriodo);
        $newEncabezado = $this->procesoSuspensionesModel->registrarEncabezadoProceso($idSuscripcion, $cicloPeriodo["idciclo"], $cicloPeriodo["idperiodo"], $cicloPeriodo["cicloanio"], $propiedad["idpropiedad"], $this->idUsuario);
        print_r("encabezado creado \n");
        $this->generarSuspensionDetalle($idSuscripcion, $newEncabezado, $tipo);
    }

    /**
     * Valida el estado de una suspension
     * @param array $suspension informacion del detalle de suspension
     * @param int $idEncabezado id del encabezado de suspension
     * @param string $tipo tipo de suspension que se va a registrar
     */
    private function validarEstadoSuspension($idSuscripcion, $suspension, $idEncabezado, $tipo) {
        echo 'el id del encabezado es: ' . $idEncabezado . ' \n';

         /*
        if (empty($suspension["fechaejecucion"])) {
            print_r("la suspension no esta realizada \n");
            if (!empty($suspension["idsuspension"])) {
                $this->procesoSuspensionesModel->cancelarSuspension($suspension["idsuspension"]);
                $this->generarSuspensionDetalle($idSuscripcion, $idEncabezado, $tipo);
            }
            return;
        }         
          */
        print_r("tiene fecha de ejecucion \n");
        if (empty($suspension["realizada"]) || $suspension["realizada"] == "N") {
            $this->generarSuspensionDetalle($idSuscripcion, $idEncabezado, $tipo);
            return;
        }

        $this->validarEstadoReconexion($idSuscripcion, $idEncabezado, $suspension["idsuspension"], $tipo);
    }

    private function validarEstadoReconexion($idSuscripcion, $idEncabezado, $idSuspension, $tipo) {
        $reconexion = $this->procesoSuspensionesModel->consultarUltimaReconexion($idSuspension);
        if (empty($reconexion)) {
            print_r("No tiene reconexión \n");
            if ($tipo === 'F') {
              /*  $this->procesoSuspensionesModel->cancelarSuspension($idSuspension); */
                $this->generarSuspensionDetalle($idSuscripcion, $idEncabezado, $tipo);
            }
            return;
        }
        if (empty($reconexion["fechaejecucion"])) {
            print_r("la reconexion no está realizada \n");
            $this->cancelarReconexionProceso($idSuscripcion, $idEncabezado, $reconexion['idreconexion'], $tipo);
            return;
        }

        if (!empty($reconexion["realizada"]) && $reconexion["realizada"] == 'S') {
            print_r("la reconexion esta realizada \n");
            $this->generarSuspensionDetalle($idSuscripcion, $idEncabezado, $tipo);
        }
    }

    private function generarSuspensionDetalle($idSuscripcion, $idEncabezado, $tipo) {

        $this->cantidadProcesadas++;
        $motivo = $this->procesoSuspensionesModel->obtenerMotivoPorTipo($tipo);
        $idMunicipio = $this->procesoSuspensionesModel->consultarMunicipioEncabezado($idEncabezado);
        $idNuevoEncabezado = $this->procesoSuspensionesModel->registrarSuspensionProceso($motivo['idmotivo'], $idEncabezado, $this->idUsuario,$this->idEmpresa);
        $this->procesoSuspensionesModel->insertarResumenProcesoSuspensiones($idSuscripcion, $idEncabezado, $idMunicipio["idmunicipio"], $tipo, $idNuevoEncabezado, MENSAJE_DETALLE_GENERADO, "G", $this->idEmpresa, $this->idUsuario);
        $this->procesoModel->aumentarCantidadRegistro($this->idControlProceso);
    }

    private function cancelarReconexionProceso($idSuscripcion, $idEncabezado, $idReconexion, $tipo) {
        $this->cantidadProcesadas++;
        $this->procesoSuspensionesModel->cancelarReconexion($idReconexion);

        $motivo = $this->procesoSuspensionesModel->obtenerMotivoPorTipo($tipo);
        $idMunicipio = $this->procesoSuspensionesModel->consultarMunicipioEncabezado($idEncabezado);
        $idNuevoEncabezado = $this->procesoSuspensionesModel->registrarSuspensionProceso($motivo['idmotivo'], $idEncabezado, $this->idUsuario,$this->idEmpresa);
        $this->procesoSuspensionesModel->insertarResumenProcesoSuspensiones($idSuscripcion, $idEncabezado, $idMunicipio["idmunicipio"], $tipo, null, MENSAJE_DETALLE_CANCELAR_RECONEXION, "N", $this->idEmpresa, $this->idUsuario);
        $this->procesoModel->aumentarCantidadRegistro($this->idControlProceso);
    }

    /**
     * Se registró el procesó para bloquear intentos de ejecucion simultanea del
     * mismo.
     */
    public function registrarProceso() {
        $this->conexion->beginTransaction();
        try {
            $proceso['estado'] = 'A';
            $proceso['fechaInicio'] = 'now()';
            $proceso['idPrograma'] = $this->idPrograma;
            $proceso['idAcceso'] = $this->idAcceso;
            $proceso['idEmpresa'] = $this->idEmpresa;
            $proceso['idHilo'] = 1;
            $this->idControlProceso = $this->procesoModel->insertarProceso($proceso);
            print_r("proceso iniciado \n");
            $this->conexion->commit();
        } catch (\Exception $exc) {
            print_r(' ==== LLEGÓ A ERROR');
            print_r($exc->getMessage());
            print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    /**
     * Finaliza el registro de ejecucion del proceso dejandolo disponible para 
     * una nueva ejecucion.
     */
    public function finalizarProceso() {
        try {
            $this->conexion->beginTransaction();
            if ($this->cantidadProcesadas <= 0) {
                $this->procesoSuspensionesModel->insertarResumenProcesoSuspensiones('0', '0', '1', 'P', '0', MENSAJE_SIN_SUSPENSIONES, "SR", $this->idEmpresa, $this->idUsuario);
            }
            $this->procesoModel->finalizarProceso($this->idControlProceso);
            $this->conexion->commit();
            print_r("proceso finalizado \n");
        } catch (\Exception $exc) {
            print_r(' ==== LLEGÓ A ERROR');
            print_r($exc->getMessage());
            print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    private function crearTablaResumen($empresa) {
        $this->procesoSuspensionesModel->crearTablaResumenSuspensiones($empresa);
    }

}
