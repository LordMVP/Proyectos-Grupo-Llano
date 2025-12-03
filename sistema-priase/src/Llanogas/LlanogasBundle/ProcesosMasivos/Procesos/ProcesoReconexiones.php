<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Models\ProcesoSuspensionModel;
use Llanogas\LlanogasBundle\Models\SuspensionModel;
use Llanogas\LlanogasBundle\Models\SuscripcionesModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\MyException;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ProcesoReconexiones
 *
 * @author hrey
 */
class ProcesoReconexiones {

    private $idEmpresa;
    private $idAcceso;
    private $idPrograma;
    private $tipoDeUso;
    private $idUsuario;
    private $idMunicipio;
    private $conexion;
    private $suscripcion;
    private $idSuscripcion;
    private $cicloPeriodo;
    private $idPeriodoAnoSiguiente;
    private $encabezado;
    private $idNuevoEncabezado;
    private $detalle_Suspen_Rco;

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
     * @var SuscripcionesModel 
     */
    private $suscripcionesModel;

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

    function __construct($idEmpresa, $idAcceso, $idPrograma, $tipoDeUso, $idUsuario, $municipios) {
        $this->idEmpresa = $idEmpresa;
        $this->idAcceso = $idAcceso;
        $this->idPrograma = $idPrograma;
        $this->tipoDeUso = $tipoDeUso;
        $this->idUsuario = $idUsuario;
        $this->idMunicipio = $municipios;
        $this->conexion = ConexionBD::getConexion();
        $this->procesoSuspensionesModel = new ProcesoSuspensionModel($this->conexion);
        $this->suspensionModel = new SuspensionModel($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->suscripcionesModel = new SuscripcionesModel($this->conexion, null);
        $this->genericoModel = new GenericoModel($this->conexion);
    }

    /**
     * Inicia el proceso de reconexiones.
     */
    public function iniciar($idsuscripcion = null) {
        $this->registrarProceso();
        try {
            $this->crearTablaResumen($this->idEmpresa);
            print_r("consultar suscripciones \n");
            print_r($this->tipoDeUso);
            print_r($this->idMunicipio);
            $complemento = " " ; 
            
            if ($idsuscripcion != null)
            {
                $complemento = " and  dsus.dsus_ideregistr = " . $idsuscripcion . " " ;
            }
            
            $suscripciones = $this->procesoSuspensionesModel->consultarSuscripcionParaReconexion($this->tipoDeUso, $this->idEmpresa, $this->idMunicipio ,  $complemento);
            
            
            $cont = 1;
            print_r("   ====================  SE INICIA PROCESO DE RECONEXIONES  ============================ " . count($suscripciones) . "  \n");


            foreach ($suscripciones as $suscripcion) {
                print_r("------------------------------------------$cont---------------------------------------- \n");
                $this->suscripcion = $suscripcion;
                $this->idSuscripcion = $suscripcion["idsuscripcion"];
                $this->getInfoSuscripcion();
                $this->validarCondicionSuscripcion();
                $cont++;
            }
            print_r(" Consultando Suscripciones en estado U o R para validar si se pueden Activar \n");
            print_r($this->tipoDeUso);
            print_r("  ----- Tipo de uso ----\n");
            print_r($this->idEmpresa);
            print_r("  ---- Id Empresa  ------\n");

            $suscricioensUoRparaActivar = $this->procesoSuspensionesModel->consultaActivarSuscripcionesEstadoUoR($this->tipoDeUso, $this->idEmpresa);
            print_r($suscricioensUoRparaActivar);   
            print_r(" \n------------------------------------------- \n");

            if (!empty($suscricioensUoRparaActivar)) {
                print_r(" Incia Proceso de Activacion  \n");
                $cantidadSuscripcionActualizadas = $this->activaSuscripcion($suscricioensUoRparaActivar);
                $this->procesoSuspensionesModel->insertarResumenProcesoReconexiones($cantidadSuscripcionActualizadas, null, null, 'AS', null, MENSAJE_SUSCRIPCION_ACTUALIZADAS, 'AS', $this->idEmpresa, $this->idUsuario);
            }
        } catch (\Exception $e) {
            print_r($e->getMessage());
        } finally {
            $this->finalizarProceso();
        }
    }

    /**
     * Consulta informacion adicional de la suscripcion para el uso del proceso
     * @param array $suscripcion informacion de la suscripcion
     */
    public function getInfoSuscripcion() {
        $sus = $this->procesoSuspensionesModel->infoAdicionalDsus($this->idSuscripcion);
        $this->suscripcion["estado"] = $sus["estado"];
        $this->suscripcion["idmunicipio"] = $sus["idmunicipio"];
        $this->suscripcion["fechafin"] = date('Y-m-d', strtotime($sus["fechafin"]));
        $this->suscripcion["fechaini"] = date('Y-m-d', strtotime($sus["fechaini"]));
    }

    /**
     * Valida el estado de la suscripcion para realizar la tarea respectiva del
     * proceso de reconexion
     * @param array $suscripcion informacion de la suscripcion
     */
    private function validarCondicionSuscripcion() {
        try {
            // inicia la validacion con el valor de los conceptos
            if ($this->suscripcion["estado"] == "U" || $this->suscripcion["estado"] == "R") {
                print_r("La suscripcion  " . $this->idSuscripcion . " tiene estado U o R \n");
                $this->validarSuscripcionEstado();
                return;
            }

            if ($this->suscripcion["saldoconceptos"] < VALOR_SUSPENSION_RECONEXION) {
                print_r("El saldo es menor a 2000 \n" . $this->idSuscripcion . " \n");
                $this->generarReconexion("P");
                return;
            }

            print_r('No se harÃ¡ nada para la suscripcion ' . $this->idSuscripcion);
        } catch (\Exception $exc) {
            print_r($exc->getMessage());
        }
    }

    /**
     * Valida el estado de la suspension para determinar el tipo de reconexion
     * va a ser realizada
     * @param array $suscripcion Informacion de la suscripcion
     */
    private function validarSuscripcionEstado() {
        $fechaActual = date("Y-m-d", strtotime('now'));
        print_r("================== FECHA ==================== \n" . $this->suscripcion["fechaini"] . ' =========== ' . $this->suscripcion["fechafin"] . ' ========= ' . $fechaActual . " \n");

        if ($this->suscripcion["fechafin"] < $fechaActual) {
            print_r("se registra reconexion de tipo 'V'  ya que la fecha fin estado de la suscripcion es menor a hoy \n");
            $this->generarReconexion("V");
            return;
        }
        if (!isset($this->suscripcion["fechaini"]) || !isset($this->suscripcion["fechaini"])) {
            $this->procesoSuspensionesModel->insertarResumenProcesoReconexiones($this->idSuscripcion, null, idmunicipio, null, null, MENSAJE_SUSCRIPCION_SIN_FECHAS, 'SF', $this->idEmpresa, $this->idUsuario);
            return;
        }
        if (($this->suscripcion["fechaini"] <= $fechaActual) && ($this->suscripcion["fechafin"] >= $fechaActual)) {
            $saldoFacturas = $this->consultarSumatoriaFacturasDeSuscripcion();
            if ($saldoFacturas > 0) {
//                $this->actualizarSuscripcionReconexion($this->suscripcion["idsuscripcion"]);
                $this->procesoModel->aumentarCantidadRegistro($this->idControlProceso);
                $this->generarReconexion("E");
            }
            return;
        }
        if ($this->suscripcion["saldoconceptos"] < VALOR_SUSPENSION_RECONEXION) {
            print_r("La suscripcion tiene estado U o R El saldo es menor a 2000 \n" . $this->suscripcion["idsuscripcion"] . " \n");
            $this->generarReconexion("P");
        }
    }

    private function consultarSumatoriaFacturasDeSuscripcion() {
        $saldoFacturas = $this->procesoSuspensionesModel->consultarSumatoriaFacturasDeSuscripcion($this->idSuscripcion, $this->idEmpresa);
        return $saldoFacturas;
    }

    /**
     * Actualiza el estado de la suscripcion posterior a la verificacion de el
     * saldo en ceros de los conceptos de las facturas de la suscripcion
     * @param int $idSuscripcion id de la suscripcion
     */
    private function actualizarSuscripcionReconexion() {
        try {
            print_r("actualiza suscripcion reconexion 'V' \n");
            $this->conexion->beginTransaction();
            $this->procesoSuspensionesModel->actualizarSuscripcion($this->idSuscripcion);
            $this->procesoModel->aumentarCantidadRegistro($this->idControlProceso);
            $this->conexion->commit();
        } catch (\Exception $exc) {
            $this->conexion->rollBack();
            print_r($exc->getTraceAsString());
        }
    }

    /**
     * Genera la reconexion para una suscripcion validando condiciones
     * @param type $suscripcion
     * @param type $tipo tipo de la reconexion
     */
    private function generarReconexion($tipo) {
        $this->conexion->beginTransaction();
        try {
//            $cicPer = $this->procesoSuspensionesModel->obtenerCicloPeriodoActualSuscripcion($this->idSuscripcion);
            $cicPer = $this->procesoSuspensionesModel->obtenerCicloPeriodoEncabezadoActivo($this->idSuscripcion);
            if (empty($cicPer["idciclo"]) || empty($cicPer["idperiodo"])) {
                print_r(" La suscripcion no tiene el ciclo periodo activo \n");
                return;
//                throw new MyException("Error la suscripcion no tiene ciclo periodo activo ", -1);
            }

            //Consulta en tabla syr en caso de no tener registra encabezado, suspension y reconexion
            $ultimoEncabezado = $this->procesoSuspensionesModel->consultarEncabezadoSuspension($this->idSuscripcion, $cicPer["idciclo"], $cicPer["idperiodo"], $cicPer["cicloanio"]);
            print_r("Encabezado de la suscripcion \n");
            print_r($ultimoEncabezado);
            if (empty($ultimoEncabezado)) {
                print_r("No tiene encabezado se genera la suspension y la reconexion \n");
                $this->generarEncabezadoReconexion($cicPer, $tipo);
                return;
            }
            if ($ultimoEncabezado['estado'] != 'A') {
                throw new MyException("Tiene encabezado para el perÃ­odo actual pero no se encuentra activo");
                // return $this->actualizarEstadoEncabezado($ultimoEncabezado["idsuspension"]);
            }

            $ultSuspension = $this->procesoSuspensionesModel->consultarUltimaSuspensionParaReconexion($ultimoEncabezado["idsuspension"]);
            print_r("La Ãºltima suspension \n");
            print_r($ultSuspension);
            if (empty($ultSuspension)) {
                $tipo = $tipo == 'P' ? $ultSuspension['tipo'] : $tipo;
                $motivo = $this->procesoSuspensionesModel->obtenerMotivoRec($tipo);
                $idSuspension = $this->procesoSuspensionesModel->registrarSuspensionProcesoEjecutado($motivo["idmotivosus"], $ultimoEncabezado["idsuspension"], $this->idUsuario);
                $this->procesoSuspensionesModel->registrarReconexionProceso($motivo["idmotivorec"], $idSuspension, $ultimoEncabezado["idsuspension"], $this->idUsuario, $this->idEmpresa);
                $this->generarResumenProceso($idEncabezado, $tipo, 'G');
                return;
            }

            $ultReconexion = $this->procesoSuspensionesModel->consultarUltimaReconexion($ultSuspension["idsuspension"], "");
            print_r("Ãºltima reconexion");
            print_r($ultReconexion);
            if (empty($ultReconexion)) {
                $tipo = $tipo == 'P' ? $ultSuspension['tipo'] : $tipo;
                $this->validarSuspensionReconexion($ultSuspension, $ultimoEncabezado["idsuspension"], $tipo);
                return;
            }
            print_r("Ya que tiene una reconexion, vÃ¡lida si ya estÃ¡ realizada o no \n");
            $this->validarEstadoReconexion($ultReconexion, $ultimoEncabezado["idsuspension"], $tipo);
        } catch (\Exception $exc) {
            print_r($exc->getMessage());
            print_r(" \n");
            //print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
        } finally {
            if ($this->conexion->isTransactionActive()) {
                $this->conexion->commit();
            }
        }
    }

    /* private function actualizarEstadoEncabezado($idEncabezado){
      return $this->actualizarEstadoEncabezado($idEncabezado);
      } */

    /**
     * Valida el estado de una reconexion con el fin de detarminar si puede ser
     * registrada una nueva
     * @param int $reconexion id de la reconexion
     * @param int $idEncabezado id del encabezado de la suspension
     * @param string $tipo tipo de la reconexion a realizar
     */
    private function validarEstadoReconexion($reconexion, $idEncabezado, $tipo) {
        try {
            $idReconexion = $reconexion["idreconexion"];
            $motivo = $this->procesoSuspensionesModel->obtenerMotivoRec($tipo);
            if (empty($reconexion["fechaejecucion"]) || empty($reconexion["realizada"])) {
                print_r("Tiene un registro de reconexion por ejecutar");
                return;
            }

            print_r("la reconexion tiene fecha de ejecucion \n");
            if (!empty($reconexion["realizada"]) && $reconexion["realizada"] == 'S') {
                print_r("la reconexion esta realizada \n");
                print_r("No se realiza registro de reconexion porque la Ãºltima estÃ¡ ejecutada \n");
                return;
            }

            print_r("Se genera reconexion porque el Ãºltimo registro no fue efectiv \n");
            $this->procesoSuspensionesModel->registrarReconexionProceso($motivo["idmotivorec"], $reconexion["idsuspension"], $idEncabezado, $this->idUsuario, $this->idEmpresa);
            $this->generarResumenProceso($idEncabezado, $tipo, 'G');
        } catch (\Exception $exc) {
            print_r($exc->getMessage());
        }
    }

    /**
     * Valida si un detalle de suspension encontrado puede generar una reconexion
     * @param array $ultSuspension ultimo detalle de suspension del encabezado
     * de la suspension
     * @param int $idEncabezado id del encabezado
     * @param string $tipo tipo de la reconexion
     */
    public function validarSuspensionReconexion($ultSuspension, $idEncabezado, $tipo) {
        print_r($ultSuspension);
        print_r($idEncabezado);
        print_r($tipo);
        try {
            if (empty($ultSuspension)) {
                return;
            }
            if (empty($ultSuspension["fechaejecucion"])) {
                $this->procesoSuspensionesModel->cancelarSuspension($ultSuspension["idsuspension"]);
                $this->generarResumenProceso($idEncabezado, $tipo, 'N');
                return;
            }
            print_r("se verifica si la suspension esta ejecutada \n");
            $ultReconexion = $this->procesoSuspensionesModel->consultarUltimaReconexion($ultSuspension["idsuspension"]);
            if (!empty($ultReconexion)) {
                print_r("Trae la Ãºltima reconexion programada\n");
                $this->validarEstadoReconexion($ultReconexion, $idEncabezado, $tipo);
                return;
            }
            $motivo = $this->procesoSuspensionesModel->obtenerMotivoRec($tipo);
            $this->procesoSuspensionesModel->registrarReconexionProceso($motivo["idmotivorec"], $ultSuspension["idsuspension"], $idEncabezado, $this->idUsuario, $this->idEmpresa);
            $this->generarResumenProceso($idEncabezado, $tipo, 'G');
        } catch (\Exception $exc) {
            print_r($exc->getTraceAsString());
        }
    }

    /**
     * Genera un registro en la tabla de rco
     * @param type $cicloPeriodo
     * @param type $tipo
     */
    private function generarEncabezadoReconexion($cicloPeriodo, $tipo) {
        $propiedad = $this->procesoSuspensionesModel->obtenerPropiedadSuscripcion($this->idSuscripcion);
        $idEncabezado = $this->procesoSuspensionesModel->registrarEncabezadoProceso($this->idSuscripcion, $cicloPeriodo["idciclo"], $cicloPeriodo["idperiodo"], $cicloPeriodo["cicloanio"], $propiedad["idpropiedad"], $this->idUsuario);
        $motivo = $this->procesoSuspensionesModel->obtenerMotivoRec($tipo);
        $idSuspension = $this->procesoSuspensionesModel->registrarSuspensionProcesoEjecutado($motivo["idmotivosus"], $idEncabezado, $this->idUsuario);
        $this->procesoSuspensionesModel->registrarReconexionProceso($motivo["idmotivorec"], $idSuspension, $idEncabezado, $this->idUsuario, $this->idEmpresa);
        $this->procesoModel->aumentarCantidadRegistro($this->idControlProceso);
        $this->generarResumenProceso($idEncabezado, $tipo, 'E');
    }

    private function generarResumenProceso($idEncabezado, $tipo, $tipoGeneracion) {
        $mensaje = '';
        switch ($tipoGeneracion) {
            case 'N':
                $mensaje = MENSAJE_CANCELAR_DETALLE_SUSPENSION;
                break;
            case 'G':
                $mensaje = MENSAJE_RECONEXION_GENERADO;
                break;
            case 'E':
                $mensaje = MENSAJE_ENCABEZADO_RECONEXION_GENERADO;
                break;
            case 'SF':
                $mensaje = MENSAJE_SUSCRIPCION_SIN_FECHAS;
                break;
        }
        $this->procesoModel->aumentarCantidadRegistro($this->idControlProceso);
        $idMunicipio = $this->procesoSuspensionesModel->consultarMunicipioEncabezado($idEncabezado);
        $this->procesoSuspensionesModel->insertarResumenProcesoReconexiones($this->idSuscripcion, $idEncabezado, $idMunicipio["idmunicipio"], $tipo, null, $mensaje, $tipoGeneracion, $this->idEmpresa, $this->idUsuario);
    }

    /**
     * Se registro el proceso.
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
            print_r("Inicia el proceso \n");
        } catch (\Exception $exc) {
            print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    /**
     * Bloquea el proceso.
     */
    public function finalizarProceso() {
        try {
            $this->conexion->beginTransaction();
            $this->procesoModel->finalizarProceso($this->idControlProceso);
            $this->conexion->commit();
            print_r("Finaliza el proceso \n");
        } catch (\Exception $exc) {
            print_r($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    private function crearTablaResumen($empresa) {
        $this->procesoSuspensionesModel->crearTablaResumenReconexiones($empresa);
    }

    private function activaSuscripcion($infoSuscripciones) {
        $cantidadSuscripcionActualizadas = 0;
        foreach ($infoSuscripciones as $suscripcionActivar) {
$parametros = array();            $this->conexion->beginTransaction();
            try {
                $this->cicloPeriodo = $this->procesoSuspensionesModel->getPeriodoPorCiclo($suscripcionActivar['idciclo']);
                if (empty($this->cicloPeriodo)) {
                    throw new MyException(" Error, el ciclo no tiene un periodo activo", -1);
                }
                $this->idPeriodoAnoSiguiente = $this->genericoModel->consultarPeriodoSiguiente($this->cicloPeriodo);
                print_r($this->idPeriodoAnoSiguiente);
                print_r("El siguiente periodo del ciclo es: " . $this->idPeriodoAnoSiguiente['idperiodo'] . " AÃ±o : " . $this->idPeriodoAnoSiguiente['idanio'] . " \n");
                $parametros['idciclo'] = $this->cicloPeriodo['idciclo'];
                $parametros['idsuscripcion'] = $suscripcionActivar['idsuscripcion'];
                $this->suscripcion = $this->procesoSuspensionesModel->obtenerSuscripcionEncabezado($parametros);
                $this->encabezado = $this->procesoSuspensionesModel->consultarEncabezadoCompleto($this->suscripcion["idencabezado"]);
                print_r("\n Insertando Encabezado de suscripcion :" . $suscripcionActivar['idsuscripcion'] . " En estado (U,R)");
                //$this->procesoSuspensionesModel->insertaEncabezadoLecturas($this->idEmpresa, $suscripcionActivar['idsuscripcion'], $this->idUsuario);
                print_r("\n Activando  suscripcion :" . $suscripcionActivar['idsuscripcion'] . " En estado (U,R)");
                $this->procesoSuspensionesModel->actualizarEstadoSuscripciones($this->idEmpresa, $suscripcionActivar['idsuscripcion']);
                $this->crearEncabezadoSuspensionTemporal();
                $this->validarCreacionLectura();
                $cantidadSuscripcionActualizadas += 1;
            } catch (\Exception $ex) {
                print_r(" Se genero Error Procesando Activacion y Generacion de encabezado de lecturas :" . $suscripcionActivar['idsuscripcion']);
                $this->conexion->rollBack();
            } finally {
                if ($this->conexion->isTransactionActive()) {
                    $this->conexion->commit();
                }
            }
        }
        return $cantidadSuscripcionActualizadas;
    }
    

    // nuevo 19/10/2018   ***********************************************************************************************


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
        // Se crea detalle de SS de nuevo encabezado por suspension temporal
        $resultadoSS = $this->procesoSuspensionesModel->consultarSuspensionPorIdEncabezado($this->encabezado['idencabezado']);
        $suspension = $this->procesoSuspensionesModel->consultarSuspensionCompleto($resultadoSS['ssp_ideregistro'], $resultadoSS['ssp_vlrtotal']);
        print_r("se crea detalle de suspension para el encabezado ssp \n");
        $idNuevaSuspension = $this->guardarNuevaSuspension($this->idNuevoEncabezado, $suspension);
        $this->validarSyrEncabezado();
    }

    public function validarCreacionLectura() {
        $suscripcion = $this->suscripcion;
        $cantidad = $this->suscripcionesModel->consultarLecturaActual($suscripcion['idsuscripcion']);
        if ($cantidad == 0) {
            $this->suscripcionesModel->nuevoEncabezadoLectura($this->idUsuario, $suscripcion['idsuscripcion']);
        }
    }

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
            return;
        }

        /* =========================================================================================== */
        foreach ($ultSuspension as $idsuspension_rco) {

            $this->detalle_Suspen_Rco = $idsuspension_rco;
            if (!empty($idsuspension_rco["ssp_ideregistro"]) && !empty($idsuspension_rco["rco_ideregistro"])) {
                print_r("la suspension no estÃ¡ realizada se pasa para el siguiente perÃ­odo \n");
                $this->generarEncabezadoSuspensionReconexionNuevo($idsuspension_rco["ssp_ideregistro"], $idsuspension_rco["rco_ideregistro"]);
            } else {
                $this->generarEncabezadoSuspensionReconexionNuevo($idsuspension_rco["ssp_ideregistro"]);
            }
        }
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
         * Validar parametro de aÃ±o  
         */
        $encabezadoSig = $this->procesoSuspensionesModel->consultarEncabezadoSuspension($idSuscripcion, $this->cicloPeriodo["idciclo"], $this->idPeriodoAnoSiguiente['idperiodo'], $this->idPeriodoAnoSiguiente['idanio']);
        if (empty($encabezadoSig)) {
            print_r("se genera encabezado para el siguiente perÃ­odo \n");
            $this->idNuevoEncabezado = $this->guardarNuevoEncabezado($encabezadoAct);
            //print_r("La suscripcion ya tiene grabado el encabezado para el siguiente perÃ­odo \n");
        }
        print_r("se consulta la informacion completa del detalle de suspension actual\n");
        $suspension = $this->procesoSuspensionesModel->consultarSuspensionCompleto($idSuspension, $vlr_suspension);
        /*   if (!empty($idReconexion)) {
          $suspension["valortotal"] = $vlr_suspension ;
          } */
        print_r("se crea detalle de suspension para el encabezado ssp \n");
        $idNuevaSuspension = $this->guardarNuevaSuspension($this->idNuevoEncabezado, $suspension);
        if ($idReconexion != null) {
            print_r("Existe reconexion!!! Se consulta la informacion de la reconexion rco \n");
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

    ///*************************************************************************************************************************
}
