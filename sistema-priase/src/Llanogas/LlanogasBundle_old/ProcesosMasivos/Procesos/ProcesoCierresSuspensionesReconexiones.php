<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Models\ProcesoSuspensionModel;
use Llanogas\LlanogasBundle\Models\SuscripcionesModel;
use Llanogas\LlanogasBundle\MyException;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use const MENSAJE_CIERRE_ENCABEZADO;
use const MENSAJE_CIERRE_NO_ENCABEZADO;
use const MENSAJE_SIN_SUSPENSIONES;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ProcesoCierres
 *
 * @author mebonilla
 */
class ProcesoCierresSuspensionesReconexiones {

    private $idCiclo;
    private $idEmpresa;
    private $idAcceso;
    private $idPrograma;
    private $idUsuario;
    private $conexion;
    private $idActividad;
    private $idNuevoEncabezado;
    /**
     *
     * @var ProcesoSuspensionModel 
     */
    private $procesoSuspensionesModel;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var ProcesoModel
     */
    private $procesoModel;
    private $idControlProceso;
    private $cicloPeriodo;
    private $idPeriodoAnoSiguiente;
    private $suscripcion;
    private $encabezado;
    private $cantidadProcesada;
    private $detalle_Suspen_Rco;

    /**
     *
     * @var SuscripcionesModel 
     */
    private $suscripcionesModel;

    public function __construct($idCiclo, $idEmpresa, $idAcceso, $idPrograma, $idUsuario) {
        $this->idCiclo = $idCiclo;
        $this->idEmpresa = $idEmpresa;
        $this->idAcceso = $idAcceso;
        $this->idPrograma = $idPrograma;
        $this->idUsuario = $idUsuario;
        $this->idActividad = 0;
        $this->cantidadProcesada = 0;
        $this->conexion = ConexionBD::getConexion();
        $this->procesoSuspensionesModel = new ProcesoSuspensionModel($this->conexion);
        $this->suscripcionesModel = new SuscripcionesModel($this->conexion, null);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->idNuevoEncabezado = null;
    }

    /**
     * Inicia la validacion de los pre-requisitos para iniciar el proceso de
     * cierre y si los cumple ejecuta el proceso
     */
    public function iniciar() {
        $this->crearTablaResumen($this->idEmpresa);
        $this->registrarProceso();
        try {
            print_r("se valida la ejecucion del periodo \n");
            $permite = $this->validarEjecucionPeriodo();
            if (empty($permite) || $permite["ejecutar"] != "S") {
                throw new MyException('Error la actividad ya se ejecutó', -1);
            }
            $this->cicloPeriodo = $this->procesoSuspensionesModel->getPeriodoPorCiclo($this->idCiclo);
            if (empty($this->cicloPeriodo)) {
                throw new MyException(" Error, el ciclo no tiene un período activo", -1);
            }

            print_r("El período actual   es = " . $this->cicloPeriodo["idperiodo"] . " \n");
            $suscripciones = $this->procesoSuspensionesModel->obtenerSuscripcionesEncabezadoActual($this->cicloPeriodo);
            if (empty($suscripciones)) {
                print_r("no existen suscripciones para el ciclo \n");
                /*
                 * Se incluye el identifiador de la actividad para poder cerrar cuando no hay resultados 
                 */
                $this->idActividad = $permite["idactividad"];
                $this->cerrarActividad($this->idActividad);
                $this->finalizarProceso();

                return;
            }

//            $this->idPeriodoSiguiente = $this->procesoSuspensionesModel->consultarPeriodoSiguiente($this->cicloPeriodo);
            $this->idPeriodoAnoSiguiente = $this->genericoModel->consultarPeriodoSiguiente($this->cicloPeriodo);
            print_r($this->idPeriodoAnoSiguiente);
            print_r("El siguiente periodo del ciclo es: " . $this->idPeriodoAnoSiguiente['idperiodo'] . " Año : " . $this->idPeriodoAnoSiguiente['idanio'] . " \n");
            foreach ($suscripciones as $suscripcion) {
                $this->idNuevoEncabezado = null;
                $this->suscripcion = null;
                $this->suscripcion = $suscripcion;
                print_r("id de la suscripcion " . $suscripcion["idsuscripcion"] . " \n");
                print_r($suscripcion);
                print_r("id del encabezado \n" . $suscripcion["idencabezado"] . "\n");
                print_r("Inicia validacion del estado de la suspension para la suscripcion \n");
                $this->validarCondicionSuspension();
            }
            $this->idActividad = $permite["idactividad"];
            $this->cerrarActividad($this->idActividad);
        } catch (\Exception $exc) {
            print_r($exc->getMessage());
        } finally {
            $this->finalizarProceso();
        }
    }

    /**
     * Valida el estado de la suspension para procesar el cierre
     * @param int $suscripcion
     */
    public function validarCondicionSuspension() {
        try {
            $this->conexion->beginTransaction();
            print_r("se consulta el encabezado de la suscripción \n");
            $this->encabezado = null;
            $this->encabezado = $this->procesoSuspensionesModel->consultarEncabezadoCompleto($this->suscripcion["idencabezado"]);
            $this->validarSyrEncabezado();
            $this->validarSuscripcionEstado($this->idUsuario);
            $this->procesoModel->aumentarCantidadRegistro($this->idControlProceso);
            $this->conexion->commit();
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            print_r($exc->getMessage());
            print_r($exc->getTraceAsString());
        }
    }

    /**
     * Valida si el programa puede ser ejecutado para un ciclo especifico
     * @return array id de la actividad que debe cerrarse al terminar el
     * proceso
     */
    public function validarEjecucionPeriodo() {
        print_r("id del programa: " . $this->idPrograma . "\n");

        print_r("id del ciclo: " . $this->idCiclo . " \n");
        $resultado = $this->genericoModel->validarActividadPrograma($this->idPrograma, $this->idCiclo, $this->idEmpresa);
        return $resultado;
    }

    /**
     * Valida el estado de la suscripcion para actualizarlo a estado "A"
     * @param int $idusuario se pasa el identificador del usuario
     */
    public function validarSuscripcionEstado($idusuario) {
        print_r("Validando Estado de Suscripcion ");
        $suscripcion = $this->suscripcion;
        if ($suscripcion["estado"] == "U" || $suscripcion["estado"] == "R") {
            print_r("Suscripción en estado U o R \n");
            $currentDate = date("Y-m-d H:i:s", time());
            $facturas = $this->procesoSuspensionesModel->obtenerFacturaConSaldo($suscripcion["idsuscripcion"]);
            print_r("Facturas con Saldo  \n");
            print_r($facturas);

            if (empty($suscripcion["fechafin"])) {
                print_r("Fecha fin de Estado Vacia \n");
                return;
            }
            if ((strtotime($currentDate) > strtotime($suscripcion["fechafin"])) || (!empty($facturas))) {
                $this->actualizarSuscripcion($suscripcion["idsuscripcion"], $idusuario);
                ///nuevo 15/08/2018 
                $this->crearEncabezadoSuspensionTemporal();
                $this->validarCreacionLectura();
            }
        }
    }

    public function validarCreacionLectura() {
        $suscripcion = $this->suscripcion;
        $cantidad = $this->suscripcionesModel->consultarLecturaActual($suscripcion['idsuscripcion']);
        if ($cantidad == 0) {
            $this->suscripcionesModel->nuevoEncabezadoLectura($this->idUsuario, $suscripcion['idsuscripcion']);
        }
    }
    
    
    
    
    
    // nuevo 15/08/2018   ***********************************************************************************************
    
    
    
    
    
    
    
    public function crearEncabezadoSuspensionTemporal() {
        //  SE DEBE CREAR EL NUEVO ENCABEZADO PARA EL PERIODO ACTIVO CON EL VALOR Y LA ULTIMA LECTURA DEL MEDIDOR
        $encabezadoTemporal = $this->procesoSuspensionesModel->consultarEncabezadoSuspension($this->suscripcion['idsuscripcion'], $this->cicloPeriodo["idciclo"], $this->cicloPeriodo['idperiodo'], $this->cicloPeriodo['cicloanio']);
        if (empty($encabezadoTemporal)) {
            print_r("se genera encabezado para el periodo Actual de la suspension Temporal \n");
            print_r($this->encabezado);
            print_r($this->cicloPeriodo['idciclo']);
            print_r($this->cicloPeriodo['idperiodo']);
            print_r($this->idUsuario);
            $this->idNuevoEncabezado = $this->procesoSuspensionesModel->crearEncabezadoSuspension($this->encabezado, $this->cicloPeriodo['idciclo'], $this->cicloPeriodo['idperiodo'], $this->cicloPeriodo['cicloanio'], $this->idUsuario);
            $this->procesoSuspensionesModel->editarEstadoSuspension($this->idNuevoEncabezado);          
        }
        if(!empty($encabezadoTemporal)){
            $this->idNuevoEncabezado = $encabezadoTemporal['idsuspension'];
        }
        // Se crea detalle de SS de nuevo encabezado por suspension temporal
        $resultadoSS = $this->procesoSuspensionesModel->consultarSuspensionPorIdEncabezado($this->encabezado['idencabezado']);
        if(empty($resultadoSS)){
          return;  
        }
        print_r("Resultados SS ==>  \n");
        print_r($resultadoSS);
        print_r("\n <==   ==>  \n");
        $suspension = $this->procesoSuspensionesModel->consultarSuspensionCompleto($resultadoSS['ssp_ideregistro'], $resultadoSS['ssp_vlrtotal']);
        print_r($suspension);
        print_r("se crea detalle de suspensión para el encabezado ssp \n");
        $idNuevaSuspension = $this->guardarNuevaSuspension($this->idNuevoEncabezado, $suspension);
        $this->procesoSuspensionesModel->editarEstadoSuspension($this->idNuevoEncabezado);
        ////ojo aca vamos 
             ///   esto ya se hizo 
            ////   se crea el nuevo suspension del siguiente periodo 
        $this->idNuevoEncabezado = null;
        $this->validarSyrEncabezado();
    }
    
    
    
    
    
    
    
    
    ///*************************************************************************************************************************
    
    
    
    
    
    
    
    /**
     * Valida el estado del encabezado para generar la informacion para el
     * siguiente periodo
     * @param int $this->encabezado id del encabezado de suspension
     * @param int $this->idSuscripcion id de la suscripcion
     */
    public function validarSyrEncabezado() {
        print_r("se consulta el ultimo detalle de suspension \n");
    //sandro
        $ultSuspension = $this->procesoSuspensionesModel->consultarSuspensionesReconexionesNewEncabezado($this->encabezado["idencabezado"]);
        $this->procesoSuspensionesModel->editarEstadoSuspension($this->encabezado["idencabezado"]);
        if (empty($ultSuspension)) {
            print_r("el encabezado no tiene suspensiones \n");
            $this->insertarResumenProcesoCierre('N');
            return;
        }
        
    /*===========================================================================================*/
        foreach ($ultSuspension as $idsuspension_rco) {
            
            $this->detalle_Suspen_Rco = $idsuspension_rco;
                if (!empty($idsuspension_rco["ssp_ideregistro"]) && !empty($idsuspension_rco["rco_ideregistro"]) ) {
                    print_r("la suspension no está realizada se pasa para el siguiente período \n");
                    $this->generarEncabezadoSuspensionReconexionNuevo($idsuspension_rco["ssp_ideregistro"], $idsuspension_rco["rco_ideregistro"]);
                  //  $this->generarEncabezadoSuspensionReconexionNuevo($ultSuspension["idsuspension"]);
                    $this->insertarResumenProcesoCierre('G');
                    
                }else{
                    $this->generarEncabezadoSuspensionReconexionNuevo($idsuspension_rco["ssp_ideregistro"]);
                    $this->insertarResumenProcesoCierre('G');
                    
                 }   
        }
        
    /*===========================================================================================*/
    /*    print_r("tiene detalle de suspension \n");

        print_r("Se realizó la suspensión y se verifica la reconexión  \n");
        $ultReconexion = $this->procesoSuspensionesModel->consultarUltimaReconexion($ultSuspension["idsuspension"], "");
        if (empty($ultReconexion)) {
            $this->generarEncabezadoSuspensionReconexionNuevo($ultSuspension["idsuspension"]);
            $this->insertarResumenProcesoCierre('G');
            return;
        }

        print_r("tiene una reconexión \n");
        if (!isset($ultReconexion["realizada"]) || $ultReconexion["realizada"] == "N") {
            print_r("generando encabezado suspension y reconexion para el nuevo ciclo y periodo \n");
            $this->generarEncabezadoSuspensionReconexionNuevo($ultSuspension["idsuspension"], $ultReconexion["idreconexion"]);
            $this->insertarResumenProcesoCierre('G');
            return;
        }
    */    
        $this->insertarResumenProcesoCierre('G');
    }

    /**
     * Inserta el en la tabla temporal de si se pudo o no generar el nuevo encabezado 
     * de cierre de suspensiones 
     * @param type $estado
     */
    private function insertarResumenProcesoCierre($estado) {
        switch ($estado) {
            case 'G':
                $mensaje = MENSAJE_CIERRE_ENCABEZADO;
                break;
            case 'N':
                $mensaje = MENSAJE_CIERRE_NO_ENCABEZADO;
                break;
        }

        $this->cantidadProcesada++;
        $idMunicipio = $this->procesoSuspensionesModel->consultarMunicipioEncabezado($this->encabezado["idencabezado"]);
        $this->procesoSuspensionesModel->insertarResumenProcesoCierre($this->suscripcion['idsuscripcion'], $this->encabezado["idencabezado"], $idMunicipio["idmunicipio"], $mensaje, $estado, $this->idEmpresa, $this->idUsuario);
    }

    /**
     * Genera la informacion del nuevo encabezado de suspension, tambien del 
     * detalle de suspension y de la reconexion para el siguiente periodo del
     * ciclo, siempre y cuando cumpla con las reglas del negocio para generar
     * dichos registros
     * @param type $idSuspension id del detalle de la suspension
     * @param type $idReconexion id de la reconexion
     */
    public function generarEncabezadoSuspensionReconexionNuevo($idSuspension, $idReconexion = null) {
        $encabezadoAct = $this->encabezado;
        $idSuscripcion = $this->suscripcion['idsuscripcion'];
        $vlr_suspension = $this->detalle_Suspen_Rco['ssp_vlrtotal'];
        $vlr_rconexion = $this->detalle_Suspen_Rco['rco_vlrtotal'];
        /*
         * Validar parametro de año  
         */
        $encabezadoSig = $this->procesoSuspensionesModel->consultarEncabezadoSuspension($idSuscripcion, $this->cicloPeriodo["idciclo"], $this->idPeriodoAnoSiguiente['idperiodo'], $this->idPeriodoAnoSiguiente['idanio']);
        if (empty($encabezadoSig)) {
            print_r("se genera encabezado para el siguiente período \n");
            if(empty($this->idNuevoEncabezado) || $this->idNuevoEncabezado == null){
                $this->idNuevoEncabezado = $this->guardarNuevoEncabezado($encabezadoAct);
            }
            //print_r("La suscripción ya tiene grabado el encabezado para el siguiente período \n");
            
        }
        print_r("se consulta la informacion completa del detalle de suspension actual\n");
        $suspension = $this->procesoSuspensionesModel->consultarSuspensionCompleto($idSuspension, $vlr_suspension);
     /*   if (!empty($idReconexion)) {
            $suspension["valortotal"] = $vlr_suspension ;
        }*/
        print_r("se crea detalle de suspensión para el encabezado ssp \n");
        $idNuevaSuspension = $this->guardarNuevaSuspension($this->idNuevoEncabezado, $suspension);
        if ($idReconexion != null) {
            print_r("Existe reconexión!!! Se consulta la información de la reconexión rco \n");
            $reconexion = $this->procesoSuspensionesModel->consultarReconexionCompleto($idReconexion);
            $reconexion['valortotal'] = $vlr_rconexion; 
            $this->guardarNuevaReconexion($idNuevaSuspension, $this->idNuevoEncabezado, $reconexion);
        }
        $this->procesoSuspensionesModel->editarEstadoSuspension($this->encabezado['idencabezado']);
    }

    /**
     * Registra un nuevo encabezado para el siguiente periodo del ciclo segun
     * la informacion del ciclo y periodo actual de la suspension
     * @param array $encActual informacion del encabezado actual
     * @param int $perSiguiente id del periodo siguiente del ciclo
     * @param array $cicPeriodo informacion del ciclo y periodo actual
     * @return int id de registro del encabezado
     */
    private function guardarNuevoEncabezado($encActual) {
        $idNuevoEncabezado = $this->procesoSuspensionesModel->crearEncabezadoSuspension($encActual, $this->cicloPeriodo["idciclo"], $this->idPeriodoAnoSiguiente['idperiodo'], $this->idPeriodoAnoSiguiente['idanio'], $this->idUsuario);
        return $idNuevoEncabezado;
    }

    /**
     * Registra un nuevo detalle de suspension para el siguiente periodo del 
     * ciclo segun la informacion del ciclo y periodo actual de la suspension
     * @param int $idEncabezado id del encabezado de suspension del siguiente
     * periodo del ciclo
     * @param array $suspension informacion del detalle de suspension actual
     * @return int id del nuevo detalle de suspension
     */
    private function guardarNuevaSuspension($idEncabezado, $suspension) {
        $idNuevaSuspension = $this->procesoSuspensionesModel->crearDetalleSuspension($suspension, $idEncabezado, $this->idUsuario, $this->idEmpresa);
        return $idNuevaSuspension;
    }

    /**
     * Registra una nueva reconexion para el siguiente periodo del 
     * ciclo segun la informacion del ciclo y periodo actual de la suspension
     * @param int $idSuspension id del detalle de suspension del siguiente 
     * periodo
     * @param int $idEncabezado id del encabezado de suspension del siguiente
     * periodo
     * @param type $reconexion informacion de la reconexion del periodo actual
     * @return int id de la reconexion para el periodo siguiente
     */
    private function guardarNuevaReconexion($idSuspension, $idEncabezado, $reconexion) {
        $idNuevaReconexion = $this->procesoSuspensionesModel->crearReconexion($reconexion, $idEncabezado, $idSuspension, $this->idUsuario, $this->idEmpresa);
        return $idNuevaReconexion;
    }

    /**
     * Actualiza el estado de una suscripcion a Activo
     * @param int $idSuscripcion id de la suscripcion
     */
    private function actualizarSuscripcion($idSuscripcion, $idusuario) {
        $this->procesoSuspensionesModel->modificarSuscripcion($idSuscripcion, $idusuario);
    }

    /**
     * Se registró el procesó.
     */

    /**
     * Registra un proceso en cpr para evitar que el proceso sea lanzado 
     * nuevamente por otro usuario de manera simultanea
     */
    public function registrarProceso() {
        try {
            $this->conexion->beginTransaction();
            $proceso['estado'] = 'A';
            $proceso['fechaInicio'] = 'now()';
            $proceso['idPrograma'] = $this->idPrograma;
            $proceso['idAcceso'] = $this->idAcceso;
            $proceso['idEmpresa'] = $this->idEmpresa;
            $proceso['idHilo'] = 1;
            $this->idControlProceso = $this->procesoModel->insertarProceso($proceso);
            $this->conexion->commit();
        } catch (\Exception $exc) {
            print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    /**
     * Bloquea el proceso.
     */

    /**
     * Finaliza la ejecucion del proceso dejando al programa disponible para una
     * nueva ejecucion
     */
    public function finalizarProceso() {
        try {

            if ($this->cantidadProcesada <= 0) {
                $this->procesoSuspensionesModel->insertarResumenProcesoCierre(0, 0, 0, MENSAJE_SIN_SUSPENSIONES, 'SR', $this->idEmpresa, $this->idUsuario);
            }
            $this->conexion->beginTransaction();
            $this->procesoModel->finalizarProceso($this->idControlProceso);
            $this->conexion->commit();
        } catch (\Exception $exc) {
            print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    /**
     * Se finaliza la actividad en la agenda del ciclo
     * @param type $idActividad
     * @return type
     */
    public function cerrarActividad($idActividad) {
        $this->conexion->beginTransaction();
        try {
            $actividad["idactividad"] = $idActividad;
            $resultado = $this->genericoModel->actualizarActividad($actividad, "C");
            $this->conexion->commit();
            return $resultado;
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            print_r($exc->getTraceAsString());
        }
    }

    public function crearTablaResumen($empresa) {
        $this->procesoSuspensionesModel->crearTablaResumenCierre($empresa);
    }

}
