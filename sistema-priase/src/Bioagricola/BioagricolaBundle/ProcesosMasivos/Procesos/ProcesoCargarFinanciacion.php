<?php

namespace Bioagricola\BioagricolaBundle\ProcesosMasivos\Procesos;

//use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Bioagricola\BioagricolaBundle\Models\CargarFinanciacionesModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\MyException;

/**
 * Archivo que hará el control del proceso de cargar las financiaciones especiales de BIO
 * @author rsagudelo
 */
class ProcesoCargarFinanciacion {

    private $idHilo;

    /**
     * información del registro de la Financiacion que está en la tabla temporal
     * @var array 
     */
    private $financiacion;
    private $idAcceso;
    private $conexion;
    private $idEmpresa;
    private $idUsuario;
    private $idProceso;
    private $imprimeLog;
    private $genericoModel;
    private $genericoDelegado;
    private $cargarFinanModel;

    /**
     *
     * @var ProcesoModel 
     */
    private $procesoModel;


    function __construct($idEmpresa, $idUsuario, $idAcceso, $idProceso = 0) {
        $this->idEmpresa = $idEmpresa;
        $this->idAcceso = $idAcceso;
        $this->idUsuario = $idUsuario;
        $this->idHilo = $idProceso;
        $this->conexion = ConexionBD::getConexion();
        $this->cargarFinanModel = new CargarFinanciacionesModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->imprimeLog = true;
    }

    /**
     * Registra la ejecución del proceso de cargar financiacion y guarda la variable global del proceso
     */
    public function registrarProceso() {
        try {
            $this->conexion->beginTransaction();
            $proceso['estado'] = 'A';
            $proceso['fechaInicio'] = 'now()';
            $proceso['idPrograma'] = PROGRAMA_CARGAR_FIN_ESP_BIO;
            $proceso['idAcceso'] = $this->idAcceso;
            $proceso['idEmpresa'] = $this->idEmpresa;
            $proceso['idHilo'] = $this->idHilo;
            $this->idProceso = $this->procesoModel->insertarProceso($proceso);
            $this->conexion->commit();
        } catch (\Exception $exc) {
            $this->escribeLog($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    /**
     * Cierra la ejecucion del proceso dejando al programa habilitado para una
     * nueva ejecución
     * @param int $idControlProceso
     */
    public function finalizarProceso() {
        try {
            $this->conexion->beginTransaction();
            $this->procesoModel->finalizarProceso($this->idProceso);
            $this->conexion->commit();
        } catch (\Exception $exc) {
            $this->escribeLog($exc->getTraceAsString());
            $this->conexion->rollBack();
        }
    }

    /*
     * Consulta las financiaciones que se van a procesar según el estado del registro
     */

    public function consultarFinanciacionesPendiente($inicio) {
        try {
            $this->escribeLog(" consultando las financiaciones para procesar \n ");
            $listaFinanciaciones = $this->cargarFinanModel->getFinanciacionesPorProceso($this->idEmpresa, $this->idHilo, $inicio);
            if (empty($listaFinanciaciones)) {
                $this->escribeLog('No hay más financiaciones por procesar');
                return;
            }
            return $listaFinanciaciones;
        } catch (MyException $ex) {
            $this->escribeLog($ex->getMessage());
        }
    }

    /**
     * Inicia el procesamiento de las financiaciones y va registrando en la tabla temporal
     * @param array $listaFinanciaciones - Información de las financiacicones a procesar
     */
    public function iniciar($listaFinanciaciones) {
        foreach ($listaFinanciaciones as $registro) {
            try {
                $this->conexion->beginTransaction();
                $this->financiacion = $registro;
                print_r(" Informacion Financiacion inicial ");
                print_r($this->financiacion);  
                $this->procesarFinanciacion(); 
                $datAct['id_registro'] = $this->financiacion['idregistro'] ;
                $datAct['estado'] = 'A' ;
                $datAct['mensaje'] = 'Se cargó correctamente la financicion con el id: ' .financiacion['finan']['idfinanciacion'] ;
                $this->cargarFinanModel->actualizarTemporalResumen($datAct);
                $this->conexion->commit();
            } catch (MyException $e) {
                $this->conexion->rollBack();
                $datAct['id_registro'] = $this->financiacion['idregistro'] ;
                $datAct['estado'] = 'F' ;
                $datAct['mensaje'] = $e->getMessage() ;
                $this->cargarFinanModel->actualizarTemporalResumen($datAct);       
            } catch (\Exception $e) {
                $this->conexion->rollBack();
                $datAct['id_registro'] = $this->financiacion['idregistro'] ;
                $datAct['estado'] = 'F' ;
                $datAct['mensaje'] = $e->getMessage() ;
                $this->cargarFinanModel->actualizarTemporalResumen($datAct);
            } finally {
                $this->aumentarCantidad();
            }
        }
    }
    
     /**
     * Valida la información de la financiacion y la registra en las tablas necesarias 
     * @return void
     * @throws MyException
     */
    private function procesarFinanciacion() {
         /*
         * Valdia si la factura ya tiene una financiacion. 
         */
        $finan = $this->cargarFinanModel->getFinanciacionFactura($this->idEmpresa, $this->financiacion['lmf_fac']);
        if ($finan['id_finan'] > 0 ) {
            throw new MyException('La financiacion ya esta cargada para el codigo de usuario '.$finan['mua_cod']. 'y codigo' . $finan['id_finan']  , -1);
        }       
        /*
         * crear la financiacion
        */   
        $this->insertarFinanciacion();
        $this->insertarDetalleFinanciacion();
        $this->insertarDetAprFinanciacion();
        $this->escribeLog("se incrementa registro en cpr y se cambia el estado de la financiacion a procesado " . $this->financiacion['finan']['idfinanciacion'] . " \n");

    }
    
    /**
     * Construye objeto de financiacion y envía para que sea registrado en base de datos
     */
    private function insertarFinanciacion() {	
        print_r("\n Inserta Financiacion :");
        print_r($this->financiacion);
        print_r("\n Empresa Sesion : ");
        print_r($this->idEmpresa);
        if ($this->idEmpresa != $this->financiacion['idempresa']) {
            throw new MyException('La empresa en Sesion no es igual a la empresa de la financiacion ' . $this->financiacion['lmf_fac'] , -1);
        }
        $finan['tipouso'] = $this->financiacion['tus_ideregistro'];
        $finan['codigo'] = $this->financiacion['mua_cod'];
        $finan['factura'] = $this->financiacion['lmf_fac'];
        $finan['empresa'] = $this->financiacion['mua_empresa'];
        $finan['mesaho'] = $this->financiacion['fin_mesaho'];
        $finan['vlrtotal'] = $this->financiacion['fin_vlrtotal'];
        $finan['vlrbio'] = $this->financiacion['fin_vlrbio'];
        $finan['vlraprfijo'] = $this->financiacion['fin_vlraprfijo'];
        $finan['vlraprvar'] = $this->financiacion['fin_vlraprvar'];
        $finan['vlrajuaprvar'] = $this->financiacion['fin_vlrajuaprvar'];
        $finan['vlrviatfijo'] = $this->financiacion['fin_vlrviatfijo'];
        $finan['vlrviatvar'] = $this->financiacion['fin_vlrviatvar'];
        $finan['idempresa'] = $this->financiacion['idempresa'];
        $finan['idusuario'] = $this->idUsuario;
        $this->cargarFinanModel->insertarFinanciacion($finan);
        $this->financiacion['finan'] = $finan ;
    }
    
    /**
     * Construye objeto de detalle de aprovechamiento
     * y se envía al modelo para la inserción en base de datos
     */
    private function insertarDetAprFinanciacion() {
        print_r("\n Inserta Detalles de Aprovechamiento:");
        print_r($this->financiacion);                
        $detalles_por_apr = $this->cargarFinanModel->getPorcAprovechadoresMes($this->financiacion['idempresa'] , $this->financiacion['fin_mesaho']);      
        $vlr_tot_fij = 0 ;
        $vlr_tot_var = 0 ;
        $vlr_tot_aju = 0 ;         
        $det_terceros = array();
        $finan = $this->financiacion['finan'] ;
        foreach ($detalles_por_apr as $det_por_apr) {
            try {
                $vlr_fijo = $finan['vlraprfijo'] * $det_por_apr['papr_porfijo'] +
                            $finan['vlrviatfijo'] * $det_por_apr['papr_porviat'] ;
                $vlr_var = $finan['vlraprvar'] * $det_por_apr['papr_porvariable'] +
                            $finan['vlrviatvar'] * $det_por_apr['papr_porviat'] ;
                $vlr_ajus = $finan['vlrajuaprvar'] * $det_por_apr['papr_porajuste'] ;
                $vlr_tot_fij += $vlr_fijo ;
                $vlr_tot_var += $vlr_var ;
                $vlr_tot_aju += $vlr_ajus ;                            
                $detalle_ter['idfinanciacion'] = $finan['idfinanciacion'];
                $detalle_ter['idtercero'] = $det_por_apr['ter_ideregistro'];
                $detalle_ter['vlrfijo'] = $vlr_fijo ;
                $detalle_ter['vlrvariable'] = $vlr_var ;
                $detalle_ter['vlrajuste'] = $vlr_ajus ;
                $detalle_ter['camvariable'] = 0 ;
                $detalle_ter['pagfijo'] = 0 ;
                $detalle_ter['pagvariable'] = 0 ;
                $detalle_ter['pagjuste'] = 0 ;
                $detalle_ter['sdofijo'] = $vlr_fijo ;
                $detalle_ter['sdovariable'] = $vlr_var ;
                $detalle_ter['sdojuste'] = $vlr_ajus ;
                $this->cargarFinanModel->insertarDetTerFinanciacion($detalle_ter);
                $det_terceros[] = $detalle_ter ;
            } catch (\Exception $e) {
                throw new MyException('Error  al insertar un detalle de terceros factura: ' . $this->financiacion['lmf_fac']. ' - '.$e->getMessage() , -1);
                Break ;
            }            
        }
        $validacion = round(($vlr_tot_fij - ($finan['vlraprfijo'] + $finan['vlrviatfijo']) + 
             $vlr_tot_var - ($finan['vlraprvar'] + $finan['vlrviatvar']) + 
             $vlr_tot_aju - $finan['vlrajuaprvar']), 7 ) ;
        if ( $validacion == 0 )
        {
            $this->financiacion['detalle_tercero'] = $det_terceros ;
            print_r("\n  Se inserto los detalles de los Terceros:");
            print_r($this->financiacion);
        }
        else{
            print_r("\n Error en la distribucion de detalles de terceros financiacion:  ");
            print_r("\n Fijo : ". $vlr_tot_fij ." Variable: ".$vlr_tot_var . " ajuste: " . $vlr_tot_aju  );
            print_r($this->financiacion);
            print_r("\n Eroor en la distribucion de detalles de terceros Detalles:  ");
            print_r($det_terceros); 
            throw new MyException('Error en la distribucion de valores en los detalles de los terceros, validar procentajes' . $this->financiacion['lmf_fac']  . " Fijo : $vlr_tot_fij Variable: $vlr_tot_var ajuste: $vlr_tot_aju " . "Total " . ($vlr_tot_fij - ($finan['vlraprfijo'] + $finan['vlrviatfijo']) + 
             $vlr_tot_var - ($finan['vlraprvar'] + $finan['vlrviatvar']) + 
             $vlr_tot_aju - $finan['vlrajuaprvar']) , -1);           
        }
   }

    /**
     * Construye objeto de detalle 
     * y se envía al modelo para la inserción en base de datos
     */
    private function insertarDetalleFinanciacion() {
        print_r("\n Inserta Detalle :");
        print_r($this->financiacion);                
                
        $detalle['idfinanciacion'] = $this->financiacion['finan']['idfinanciacion'];
        $detalle['empresa'] = $this->financiacion['mua_empresa'];
        $detalle['tasa'] = $this->financiacion['tus_tasa'];
        $detalle['numcuota'] = $this->financiacion['tus_numcuotas'];
        $detalle['idusuario'] = $this->idUsuario;
        $detalle['estado'] = 'A' ; 
        $this->cargarFinanModel->insertarDetalleFinanciacion($detalle);
        $this->financiacion['detalle'] = $detalle;
        print_r("\n  Se inserto el detalle de la Financiacion :");
        print_r($this->financiacion);
    }

    /**
     * Aumenta la cantidad de registros procesados en la tabla de procesos (cpr_)
     */
    private function aumentarCantidad() {
        try {
            if ($this->conexion->isTransactionActive()) {
                $this->conexion->rollBack();
            }
            $this->conexion->beginTransaction();
            $this->procesoModel->aumentarCantidadRegistro($this->idProceso);
            $this->conexion->commit();
        } catch (\Exception $e) {
            $this->escribeLog($e->getMessage());
            $this->conexion->rollBack();
        }
    }
  
    /**
     * Valida si se debe imprimir el log y ejecutra print_r
     * @param type $mensaje
     */
    private function escribeLog($mensaje) {
        if ($this->imprimeLog) {
            print_r($mensaje);
        }
    }

    /**
     * Termina el control de ejecución del proceso
     */
    public function inactivarControlEjecucionProceso() {
        $Datos['idempresa'] = $this->idEmpresa;
        $Datos['idprograma'] = PROGRAMA_CARGAR_FIN_ESP_BIO;
        $this->procesoModel->inactivarControEjecucionProceso($Datos);
    }

    /**
     * Obtiene la cantidad de hilos que ejecutan el mismo  proceso
     * @param int $ProcesoControl - Id del hilo que s eestá ejecutando
     * @return int - Cantidad de hilos
     */
    public function getCantidadHilosActivosPrograma($ProcesoControl) {
        $Datos['idempresa'] = $this->idEmpresa;
        $Datos['idprograma'] = PROGRAMA_CARGAR_FIN_ESP_BIO;
        $Datos['idhilo'] = $ProcesoControl;
        $cantidad = $this->procesoModel->getCantidadHilosActivosPrograma($Datos);
        return $cantidad;
    }

}
