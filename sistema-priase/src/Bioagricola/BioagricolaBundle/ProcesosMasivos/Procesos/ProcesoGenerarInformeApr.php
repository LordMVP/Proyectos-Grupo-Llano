<?php

namespace Bioagricola\BioagricolaBundle\ProcesosMasivos\Procesos;

//use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Bioagricola\BioagricolaBundle\Models\GenerarInformeAprModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\MyException;

/**
 * Archivo que hará el control del proceso de cargar las infoProApres especiales de BIO
 * @author rsagudelo
 */
class ProcesoGenerarInformeApr {

    private $idHilo;

    /**
     * información del registro de la Financiacion que está en la tabla temporal
     * @var array 
     */
    private $infoProApr;
    private $idAcceso;
    private $conexion;
    private $idEmpresa;
    private $idUsuario;
    private $idProceso;
    private $imprimeLog;
    private $genericoModel;
    private $genericoDelegado;
    private $Gen_Inf_Apr_Model;

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
        $this->Gen_Inf_Apr_Model = new GenerarInformeAprModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->imprimeLog = true;
    }

    /**
     * Registra la ejecución del proceso de cargar infoProApr y guarda la variable global del proceso
     */
    public function registrarProceso() {
        try {
            $this->conexion->beginTransaction();
            $proceso['estado'] = 'A';
            $proceso['fechaInicio'] = 'now()';
            $proceso['idPrograma'] = PROGRAMA_GEN_INF_APR_FIN_ESP_BIO;
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
     * Consulta los registros que se van a procesar según el estado del registro
     */

    public function consultarRegistrosAprPendientes() {
        try {
            $this->escribeLog(" Consultando los Registros Pendientes de Apr a  procesar - " .$this->idEmpresa . " \n" );
            $listaRegistrosPendientes = $this->Gen_Inf_Apr_Model->getRegistros_X_proceso($this->idEmpresa, $this->idHilo);
            if (empty($listaRegistrosPendientes)) {
                $this->escribeLog('No hay más Registros por procesar');
                $this->escribeLog($listaRegistrosPendientes);
                return;
            }
            return $listaRegistrosPendientes;
        } catch (MyException $ex) {
            $this->escribeLog($ex->getMessage());
        }
    }

    /**
     * Inicia el procesamiento para generar el informe de aprovechamiento y va registrando en la tabla temporal
     * @param array $listaRegistrosPendientes - Información de los registros a procesar
     */
    public function iniciar($listaRegistrosPendientes , $id_Proceso) {
        $cantidad = 0 ;
        foreach ($listaRegistrosPendientes as $registro) {
            $proceso['idprograma'] = PROGRAMA_GEN_INF_APR_FIN_ESP_BIO;
            $proceso['idempresa'] = $this->idEmpresa;
            $proceso['idhilo'] = $id_Proceso ;
            $cantidad = $this->procesoModel->getHiloActivoPrograma($proceso);
            if ($cantidad == 0 )
            {
                break ;
            }
            try {
                $this->conexion->beginTransaction();
                $this->infoProApr = $registro;
                print_r("\n Registro Inicial.. ");
                print_r($this->infoProApr);
                $this->procesarRegistroApr(); 
                $datAct['id_registro'] = $this->infoProApr['idregistro'] ;
                $datAct['estado'] = 'A' ;
                $datAct['mensaje'] = 'Se genero correctamente el registro de Informe con el id: ' . $this->infoProApr['informe_apr']['inap_ide'] ;
                $this->Gen_Inf_Apr_Model->actualizarTemporalResumen($datAct);
                $this->conexion->commit();
            } catch (MyException $e) {
                $this->conexion->rollBack();
                $datAct['id_registro'] = $this->infoProApr['idregistro'] ;
                $datAct['estado'] = 'F' ;
                $datAct['mensaje'] = $e->getMessage() ;
                $this->Gen_Inf_Apr_Model->actualizarTemporalResumen($datAct);       
            } catch (\Exception $e) {
                $this->conexion->rollBack();
                $datAct['id_registro'] = $this->infoProApr['idregistro'] ;
                $datAct['estado'] = 'F' ;
                $datAct['mensaje'] = $e->getMessage() ;
                $this->Gen_Inf_Apr_Model->actualizarTemporalResumen($datAct);
            } finally {
                $this->aumentarCantidad();
            }
        }
        return $cantidad ;
    }
    
     /**
     * Valida la información del registro de Aprovechamiento y registra y actualiza en la tablas necesarias 
     * @return void
     * @throws MyException
     */
    private function procesarRegistroApr() {
         /*
         * Valdia si el registro de aprovechamiento ya esta en la tabla de informe. 
         */
        $cantidad = $this->Gen_Inf_Apr_Model->get_tercero_Procesado($this->infoProApr);
        if ( $cantidad > 0 ) {
            throw new MyException('Tercero ya procesado para el mes y año ' . $this->infoProApr['fin_mes'] . $this->infoProApr['fin_aho'].' y mes de reporte '. $this->infoProApr['rep_mesaho']  , -1);
        }
        /*
         * crear registros de informe de Apr
        */ 
        $this->insertarInformeApr();
        
        // Actualiza los registrso que estan en cero 
        
        $reg_apr_act['ter_id'] = $this->infoProApr['id_tercero'] ;
        $reg_apr_act['fin_mesaho'] = $this->infoProApr['fin_mesaho'] ;
        $reg_apr_act['swt_valor'] = '1' ;                
        $reg_apr_act['swt_valor_Ant'] = '0' ;                
        $reg_apr_act['swt_campo'] = 'afin_swttras' ;    
        $reg_apr_act['fec_campo'] = 'afin_fectras' ; 
        $reg_apr_act['complemento'] = 'AND afin_sdovlrfijo = 0 AND afin_sdovlrvariable = 0 AND afin_sdovlrajustes = 0 ' ; 
        $reg_apr_act['idempresa'] = $this->infoProApr['idempresa'];
        $this->actRegistroApr($reg_apr_act);
        $this->escribeLog("se incrementa registro en cpr y se cambia el estado de la infoProApr a procesado para el mes y año  " . $this->infoProApr['fin_mes'] . $this->infoProApr['fin_aho'].' y mes de reporte '. $this->infoProApr['rep_mesaho'] . " \n");
    }
    
    /**
     * Construye objeto de infoProApr y envía para que sea registrado en base de datos
     */
    private function insertarInformeApr() {	       
        if ($this->idEmpresa != $this->infoProApr['idempresa']) {
            print_r("\n\n Error en la Empresa en Sesion  ");
            print_r("\n Empresa Sesion: ");
            print_r($this->idEmpresa);
            print_r("\n Empresa del Registro: ");
            print_r($this->infoProApr['idempresa']);
            throw new MyException('La empresa en Sesion no es igual a la empresa de la infoProApr ' , -1);
        }  
        $registros_apr = $this->Gen_Inf_Apr_Model->getRegistroAprFinan($this->infoProApr);
        if(empty($registros_apr))
        {
            print_r("\n\n Error el tercero no tiene registros para este mes y año ");         
            print_r($this->infoProApr );
            throw new MyException('El tercero no tiene registros para este mes y año  ' . $this->infoProApr['fin_mes']. $this->infoProApr['fin_aho'].' y mes de reporte '. $this->infoProApr['rep_mesaho'] , -1);
        }
        $fac_fijo = 0 ;
        $fac_var = 0 ;
        $fac_ajus = 0 ; 
        $cambio = 0 ; 
        $cambio_pag = 0 ;
        $pag_fijo = 0 ;
        $pag_var = 0 ;
        $pag_ajus = 0 ;
        foreach ($registros_apr as $reg_apr) 
        {
            $this->infoProApr['reg_ifo_apr'] = $reg_apr ;              
            if($reg_apr['afin_swtrepcambio'] == 1 )
            {
                $cambio += $reg_apr ['cam_val'] ; 
                $cambio_pag += $reg_apr ['cam_val_pag'] ; 
                $reg_apr_act['ter_id'] = $this->infoProApr['id_tercero'] ;
                $reg_apr_act['fin_mesaho'] = $this->infoProApr['fin_mesaho'] ;
                $reg_apr_act['swt_valor'] = '2' ;                
                $reg_apr_act['swt_valor_Ant'] = '1' ;                
                $reg_apr_act['swt_campo'] = 'afin_swtrepcambio' ;    
                $reg_apr_act['fec_campo'] = 'afin_fecreccambio' ; 
                $reg_apr_act['complemento'] = ' ' ;
                $reg_apr_act['idempresa'] = $this->infoProApr['idempresa'];
                $this->actRegistroApr($reg_apr_act);
            } 
            if($reg_apr['afin_swttras'] == 0 )
            {                
                $fac_fijo += $reg_apr['sdo_fijo'];
                $fac_var += $reg_apr['sdo_var'];
                $fac_ajus += $reg_apr['sdo_ajus'];  
            }
        } 
        $pagos_apr = $this->Gen_Inf_Apr_Model->getPagosTerceros($this->infoProApr);
        if(!empty($pagos_apr))
        {        
            $this->infoProApr['reg_pag_apr'] = $pagos_apr ; 
            $pag_fijo = $pagos_apr['pago_fijo'] ;
            $pag_var = $pagos_apr['pago_variable'] ;
            $pag_ajus =  $pagos_apr['pago_ajuste'] ;              
            $this->actRegisPagoTerceros($this->infoProApr);
        }  
        $informeApr['id_tercero'] = $this->infoProApr['id_tercero'];
        $informeApr['id_finan'] = 0 ;
        $informeApr['mesaho_rep'] = $this->infoProApr['rep_mesaho'];
        $informeApr['mes'] = $this->infoProApr['fin_mes'];
        $informeApr['aho'] = $this->infoProApr['fin_aho'];
        $informeApr['pag_fijo'] = $pag_fijo ;
        $informeApr['pag_var'] =  $pag_var ;
        $informeApr['pag_ajus'] = $pag_ajus ;
        $informeApr['fac_fijo'] = $fac_fijo + $pag_fijo ;
        $informeApr['fac_var'] =  $fac_var + $pag_var + $cambio ;
        $informeApr['fac_ajus'] =  $fac_ajus + $pag_ajus ;   
        $informeApr['cambio'] =  $cambio ;
        $informeApr['cambio_pag'] =  $cambio_pag ;           
        $informeApr['idempresa'] = $this->infoProApr['idempresa'];
        $informeApr['idusuario'] = $this->idUsuario;
        $this->Gen_Inf_Apr_Model->insertarInformeApr($informeApr);
        $this->infoProApr['informe_apr'] = $informeApr ;
    }
    
    /**
     * Actualza el registro de Aprovechamiento
     * y se envía al modelo para actualizar en base de datos
     */
    private function actRegistroApr($reg_apr_act) {               
        $cantidad =$this->Gen_Inf_Apr_Model->actDetTercFinan($reg_apr_act);
        if($cantidad != 1 )
        {
            print_r("\n\n Error al actualizar el registro de Aprovechamiento  ");         
            print_r($reg_apr_act);
            throw new MyException('Error al actualizar el registro de Aprovechamiento ' , -1);    
        }
   }
    /**
     * Actualza el registro de pagos de Aprovechamiento
     * y se envía al modelo para actualizar en base de datos
     */
    private function actRegisPagoTerceros($reg_pag_act) {               
       
        $cantidad = $this->Gen_Inf_Apr_Model->actualizarPagosAprFinan($reg_pag_act);
        if($cantidad < 1 )
        {
            print_r("\n\n Error al actualizar el registro de pago de Aprovechamiento  ");         
            print_r($reg_pag_act);
            throw new MyException('Error al actualizar el registro de pago de Aprovechamiento ' , -1);    
        }
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
        $Datos['idprograma'] = PROGRAMA_GEN_INF_APR_FIN_ESP_BIO;
        $this->procesoModel->inactivarControEjecucionProceso($Datos);
    }
    
    /**
     * Obtiene la cantidad de hilos que ejecutan el mismo  proceso
     * @param int $ProcesoControl - Id del hilo que s eestá ejecutando
     * @return int - Cantidad de hilos
     */
    public function getCantidadHilosActivosPrograma($ProcesoControl) {
        $Datos['idempresa'] = $this->idEmpresa;
        $Datos['idprograma'] = PROGRAMA_GEN_INF_APR_FIN_ESP_BIO;
        $Datos['idhilo'] = $ProcesoControl;
        $cantidad = $this->procesoModel->getCantidadHilosActivosPrograma($Datos);
        return $cantidad;
    }
}
