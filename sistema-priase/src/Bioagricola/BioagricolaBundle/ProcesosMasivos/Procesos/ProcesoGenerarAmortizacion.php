<?php

namespace Bioagricola\BioagricolaBundle\ProcesosMasivos\Procesos;

//use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Bioagricola\BioagricolaBundle\Models\GenerarAmortizacionModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\MyException;

/**
 * Archivo que hará el control del proceso de cargar las finGenAmortizes especiales de BIO
 * @author rsagudelo
 */
class ProcesoGenerarAmortizacion {

    private $idHilo;

    /**
     * información del registro de la Financiacion que está en la tabla temporal
     * @var array 
     */
    private $finGenAmortiz;
    private $idAcceso;
    private $conexion;
    private $idEmpresa;
    private $idUsuario;
    private $idProceso;
    private $imprimeLog;
    private $genericoModel;
    private $genericoDelegado;
    private $genAmortModel;

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
        $this->genAmortModel = new GenerarAmortizacionModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->imprimeLog = true;
    }
    
    //****************** Logica de Hilos  **************************// 
    
    /**
     * Registra la ejecución del proceso de cargar finGenAmortiz y guarda la variable global del proceso
     */
    public function registrarProceso() {
        try {
            $this->conexion->beginTransaction();
            $proceso['estado'] = 'A';
            $proceso['fechaInicio'] = 'now()';
            $proceso['idPrograma'] = PROGRAMA_GEN_AMORT_FIN_ESP_BIO;
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
    
    /**
     * Obtiene la cantidad de hilos que ejecutan el mismo  proceso
     * @param int $ProcesoControl - Id del hilo que s eestá ejecutando
     * @return int - Cantidad de hilos
     */
    public function getCantidadHilosActivosPrograma($ProcesoControl) {
        $Datos['idempresa'] = $this->idEmpresa;
        $Datos['idprograma'] = PROGRAMA_GEN_AMORT_FIN_ESP_BIO;
        $Datos['idhilo'] = $ProcesoControl;
        $cantidad = $this->procesoModel->getCantidadHilosActivosPrograma($Datos);
        return $cantidad;
    }
    
     /**
     * Termina el control de ejecución del proceso
     */
    public function inactivarControlEjecucionProceso() {
        $Datos['idempresa'] = $this->idEmpresa;
        $Datos['idprograma'] = PROGRAMA_GEN_AMORT_FIN_ESP_BIO;
        $this->procesoModel->inactivarControEjecucionProceso($Datos);
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
    
    //****************** Finaliza Logica de Hilos  **************************// 
    //****************** Inicia Logica de Negocio  **************************//
   
    /*
     * Consulta las financiaciones que se van a procesar según el estado del registro
     */
    public function consultarFinanciaiconespendientes() {
        try {
            $this->escribeLog(" Consultando las financiaciones a procesar \n ");
            $listaFinancamort = $this->genAmortModel->getFinanciacionProceso($this->idEmpresa, $this->idHilo);
            if (empty($listaFinancamort)) {
                $this->escribeLog('No hay más financiaciones por procesar');
                return;
            }
            return $listaFinancamort;
        } catch (MyException $ex) {
            $this->escribeLog($ex->getMessage());
        }
    }
    
     /**
     * Inicia el procesamiento de las financiaciones y va registrando en la tabla temporal
     * @param array $listaFinancamort - Información de las financiaciones a procesar
     */
    public function iniciar($listaFinancamort , $id_Proceso) {
        $cantidad = 0 ;
        foreach ($listaFinancamort as $registro) {
            $proceso['idprograma'] = PROGRAMA_GEN_AMORT_FIN_ESP_BIO;
            $proceso['idempresa'] = $this->idEmpresa;
            $proceso['idhilo'] = $id_Proceso ;
            $cantidad = $this->procesoModel->getHiloActivoPrograma($proceso);
            if ($cantidad == 0 )
            {
                break ;
            }
            try {
                $this->conexion->beginTransaction();
                $this->finGenAmortiz = $registro;
                $this->procesarFinanAmortizar(); 
                $datAct['id_registro'] = $this->finGenAmortiz['idregistro'] ;
                $datAct['estado'] = 'A' ;
                $datAct['mensaje'] = 'Se genero correctamente la amortizacion: ' .$this->finGenAmortiz['idfinanciacion'] ;
                $this->genAmortModel->actualizarTemporalResumen($datAct);
                $this->conexion->commit();
            } catch (MyException $e) {
                $this->conexion->rollBack();
                $datAct['id_registro'] = $this->finGenAmortiz['idregistro'] ;
                $datAct['estado'] = 'F' ;
                $datAct['mensaje'] = $e->getMessage() ;
                $this->genAmortModel->actualizarTemporalResumen($datAct);       
            } catch (\Exception $e) {
                $this->conexion->rollBack();
                $datAct['id_registro'] = $this->finGenAmortiz['idregistro'] ;
                $datAct['estado'] = 'F' ;
                $datAct['mensaje'] = $e->getMessage() ;
                $this->genAmortModel->actualizarTemporalResumen($datAct);
            } finally {
                $this->aumentarCantidad();
            }
        }
    }
    
     /**
     * Valida la información del financiacion y registra y actualiza en la tablas necesarias 
     * @return void
     * @throws MyException
     */
    private function procesarFinanAmortizar() {
        /*
        * Valdia si la financiacion tiene amortizacion para el mes actual 
        */
        $this->validarFinanciacion() ; 
        
        /*
         * Consulta las Amortizaciones genera los nuevos detalles y genera el saldo a amortizar
        */
        $this->finGenAmortiz['amortizado'] = $this->consultarAmortizaciones() ; 
        $this->GenerarSaldoAmortizar() ; 

        if ($this->finGenAmortiz['saldo_amortizar'] > 0 )
        {
            /*
            * crear Amortizacion
            */   
            $this->generarAmortizacion();  
            /*
             *  crear Detalle de Amortizacion 
            */  
            $this->generarDetalleAmortizacion();
            $this->actualizarFinancicionVersion();
        }
        
        //print_r("financiacion inconsistente:"); 
        //print_r($this->finGenAmortiz); 
        
        $this->actualizarTabTemporalPag()   ;      
    }    
     /**
     * Consulta las amortizaciones de la financicion que tienen saldo,
     * crea el nuevo detalle y consolida los saldos de cada concepto
     * @return $amortiz arreglo con el saldo por cada concepto 
     * @throws MyException
     */
    private function consultarAmortizaciones() 
    {
        $datConsulta['idfin'] = $this->finGenAmortiz['idfinanciacion'] ;
        $datConsulta['idempresa'] = $this->finGenAmortiz['idempresa'] ;           
        $amortiz = $this->genAmortModel->getAmortizaciones($datConsulta);
     
        $sdo_cuobio = 0 ;
        $sdo_cuoter_fij = 0 ;
        $sdo_cuoter_var = 0 ;
        $sdo_cuoter_aju = 0 ;
        $sdo_cuotinteres = 0 ;
        $cant_amotiz = 0 ; 
        $sdo_cuota = 0 ;
        if (count($amortiz) > 0) 
        {           
            foreach ($amortiz as $amortiz_fin)
            {
                if($amortiz_fin['am_sdocuota'] <= 0 )
                {
                    continue ;
                }
                try {                 
                    $sdo_cuobio += $amortiz_fin['sdo_cuobio'] ;
                    $sdo_cuoter_fij += $amortiz_fin['sdo_cuoter_fij'] ;
                    $sdo_cuoter_var += $amortiz_fin['sdo_cuoter_var'] ;
                    $sdo_cuoter_aju += $amortiz_fin['sdo_cuoter_aju'] ;
                    $sdo_cuotinteres += $amortiz_fin['sdo_cuotinteres'] ;
                    $sdo_cuota += $amortiz_fin['am_sdocuota'] ;
                    $cant_amotiz += 1 ; 
                    $det_amortiz_ant['id'] = $amortiz_fin['dam_ideregistro'] ; 
                    $det_amortiz_ant['estado'] = 'f';                     
                    $det_amortiz_nue['idamortiz'] = $amortiz_fin['am_ideregistro'] ; 
                    $det_amortiz_nue['estado'] = 't'; 
                    $det_amortiz_nue['vlrtotal'] = $amortiz_fin['am_sdocuota'] ;
                    $det_amortiz_nue['vlrbio'] = $amortiz_fin['sdo_cuobio'] ;
                    $det_amortiz_nue['vlrterfij'] = $amortiz_fin['sdo_cuoter_fij'] ;
                    $det_amortiz_nue['vlrtervar'] = $amortiz_fin['sdo_cuoter_var'] ;
                    $det_amortiz_nue['vlrteraju'] = $amortiz_fin['sdo_cuoter_aju'] ;
                    $det_amortiz_nue['vlrinteres'] = $amortiz_fin['sdo_cuotinteres'] ;               
              
                    $this->genAmortModel->insertarDetalleAmortiz($det_amortiz_nue);
                    $detamortizacion = $this->actualizaDetalleAmortiz($det_amortiz_ant);       
                } catch (\Exception $e) {                    
                    print_r("Error  al Actualizar una amortizacion de la financiacion:"); 
                    print_r($this->finGenAmortiz); 
                    throw new MyException('Error  al Actualizar una amortizacion de la financiacion: ' . $e->getMessage() , -1);
                    Break ;
                }            
            } 
        }
        $amortizado['sdo_cuobio'] = $sdo_cuobio ;
        $amortizado['sdo_cuoter_fij'] = $sdo_cuoter_fij ;
        $amortizado['sdo_cuoter_var'] = $sdo_cuoter_var ;
        $amortizado['sdo_cuoter_aju'] = $sdo_cuoter_aju ;
        $amortizado['sdo_cuotinteres'] = $sdo_cuotinteres ;
        $amortizado['sdo_cuota'] = $sdo_cuota ;
        $amortizado['cant_amotiz'] = $cant_amotiz ;        
        return($amortizado);        
    }
   
     /**
     * Valida si la financiacion ya fue amortizada para el mes actual 
     * @return void
     * @throws MyException
     */
    private function validarFinanciacion() 
    {
        $fin_amortiz = $this->genAmortModel->getAmortizFinanciacion($this->finGenAmortiz['idfinanciacion'] , $this->finGenAmortiz['idempresa']);
        if ($fin_amortiz['am_ideregistro'] > 0 ) {
            throw new MyException('La Financiacion ya tiene Amortizacion para este mes ', -1);
        }   
    }
    
    /**
     * Valida y genera el saldo de la financiacion a amortizar 
     * @return void
     * @throws MyException
     */
    private function GenerarSaldoAmortizar() 
    { 
        $sdo_cuo_capital = 0 ;
        $val_saldo = 0 ;   
        if ($this->finGenAmortiz['amortizado'])
        {
            $sdo_cuo_capital = $this->finGenAmortiz['amortizado']['sdo_cuobio'] 
                           + $this->finGenAmortiz['amortizado']['sdo_cuoter_fij']
                           +  $this->finGenAmortiz['amortizado']['sdo_cuoter_var'] 
                           + $this->finGenAmortiz['amortizado']['sdo_cuoter_aju'];
            $val_saldo = $sdo_cuo_capital + $this->finGenAmortiz['amortizado']['sdo_cuotinteres']
                     - $this->finGenAmortiz['amortizado']['sdo_cuota'] ; 
            $val_saldo = round($val_saldo, 7 ) ;
            if ($val_saldo != 0 )
            {               
                print_r(" \n Los saldos amortizados son inconsistentes.. " ); 
                print_r(" \n valida saldo: " ); 
                print_r( $val_saldo ); 
                print_r(" \n saldo cuota: " ); 
                print_r( $sdo_cuo_capital ); 
                print_r($this->finGenAmortiz); 
                throw new MyException('Los saldos amortizados son inconsistentes', -1);
            }
        } 
        
        $saldo_amortizar = $this->finGenAmortiz['fin_sdofinan'] -  $sdo_cuo_capital ;
        $saldo_amortizar = round($saldo_amortizar, 4);
        if ($saldo_amortizar < 0 )
        {
            print_r(" \n Los saldos amortizados son inconsistentes con la Financiacion" ); 
            print_r($this->finGenAmortiz);
            print_r(" \n Saldo a amortizar : " + $saldo_amortizar );             
            throw new MyException('Los saldos amortizados son inconsistentes con la Financiacion', -1);
        }
        $saldo_cuotas = $this->finGenAmortiz['fin_totcuotas'] -  $this->finGenAmortiz['fin_cuoemitidas'] ;
        if ($saldo_cuotas < 0 )
        {
            print_r("Inconsistencias en la cantidad de cuotas..");
            print_r($this->finGenAmortiz);
            print_r(" \n Saldo cuotas : " + $saldo_cuotas ); 
            throw new MyException('Inconsistencias en la cantidad de cuotas..', -1);
        }
        if ($saldo_cuotas < 1 and $saldo_amortizar > 0  )
        {
            print_r("Inconsistencia: hay saldo por amortizar y no hay cuotas pendientes..");
            print_r($this->finGenAmortiz);
            print_r(" \n Saldo cuotas : " + $saldo_cuotas ); 
            print_r(" \n saldo amortizar : " + $saldo_amortizar ); 
            throw new MyException('Inconsistencia: hay saldo por amortizar y no hay cuotas pendientes..', -1);
        }
        $this->finGenAmortiz['cuota_pendientes'] = $saldo_cuotas ;
        $this->finGenAmortiz['saldo_amortizar'] = $saldo_amortizar ;
        $this->finGenAmortiz['sdo_amortiz_capital'] = $sdo_cuo_capital ; 
    }
    
     /**
     * Actualza el detalle de la amortizacion
     * y se envía al modelo para actualizar en base de datos
     */
    private function actualizaDetalleAmortiz($det_amortiz_act) {                     
        $det_amortizacion_fin['dam_ideregistro'] = $det_amortiz_act['id'] ;
        $det_amortizacion_fin['dam_estado'] = $det_amortiz_act['estado'] ;  
        $cantidad = $this->genAmortModel->actualizarDetAmortizacionFinan($det_amortizacion_fin);
        if($cantidad != 1 )
        {
            print_r("Error en la cantidad de registros actualizados en el detalle de la amortizacion");
            print_r($this->finGenAmortiz);            
            throw new MyException('Error en la cantidad de registros actualizados en el detalle de la amortizacion: ' . $det_amortiz_act['dam_ideregistro'] . ' y cantidad Act: '. $cantidad, -1);    
        }
        return $det_amortiz_act ;                        
   }
    
    /**
    * Construye objeto de amortizacion y se envía para que sea registrado en base de datos
    */
    private function generarAmortizacion() {	           
        if ($this->idEmpresa != $this->finGenAmortiz['idempresa']) {
            print_r("\n Empresa Sesion : ");
            print_r($this->idEmpresa);
            throw new MyException('La empresa en Sesion no es igual a la empresa de la Financiacion a procesar' . $this->finGenAmortiz['idempresa'] , -1);
        }
        // Se determina el saldo menor que se permitira, el cual es igual a 1.5 de la cuota minima
        $cuota_minima = (VAL_MIN_FINANCIAR/CAM_CUOTAS_MAX) * 1.5  ;
        $cuota_minima = round($cuota_minima, 7 );
        $amortizado = $this->finGenAmortiz['amortizado'] ;        
        $sdo_am_bio =  $this->finGenAmortiz['fin_sdobio'] - $amortizado['sdo_cuobio'] ;
        $sdo_am_ter_fijo =  $this->finGenAmortiz['fin_sdoterfijo'] - $amortizado['sdo_cuoter_fij'] ;
        $sdo_am_ter_var =  $this->finGenAmortiz['fin_sdotervar'] - $amortizado['sdo_cuoter_var'] ;
        $sdo_am_ter_ajuste =  $this->finGenAmortiz['fin_sdoteraju'] - $amortizado['sdo_cuoter_aju'] ;        
        $sdo_am_bio = round($sdo_am_bio , 7 ); 
        $sdo_am_ter_fijo = round($sdo_am_ter_fijo , 7 ); 
        $sdo_am_ter_var = round($sdo_am_ter_var, 7 ); 
        $sdo_am_ter_ajuste = round($sdo_am_ter_ajuste, 7 ); 
        $sdo_am_Conceptoso = $sdo_am_bio + $sdo_am_ter_fijo + $sdo_am_ter_var + $sdo_am_ter_ajuste ;
        $val_sal_fin = $sdo_am_Conceptoso - $this->finGenAmortiz['saldo_amortizar'] ;
        $val_sal_fin = round($val_sal_fin, 4);
        if ( $val_sal_fin != 0 )
        {
            print_r('\n Error en los saldo por amortizar de los conceptos y el total \n ' ) ;
            print_r($this->finGenAmortiz);
            print_r('\n Suma Detalles: ' );
            print_r( $sdo_am_Conceptoso );
            print_r('\n Saldo Total: ' );
            print_r($this->finGenAmortiz['saldo_amortizar'] );
            throw new MyException('Error en los saldo por amortizar de los conceptos y el total', -1);        
        }
        
        // carga los datos genericos
        $amortizacion['idfinanciacion'] = $this->finGenAmortiz['idfinanciacion'] ;
        $amortizacion['cambio'] = 0 ;
        $amortizacion['cam_tercero'] = 0 ;
        $amortizacion['pag_bio'] = 0 ;
        $amortizacion['pag_terfijo'] = 0 ;
        $amortizacion['pag_tervar'] = 0 ;
        $amortizacion['pag_terajuste'] = 0 ;
        $amortizacion['pag_inetres'] = 0 ;
        $amortizacion['numcuota'] = $this->finGenAmortiz['fin_cuoemitidas'] + 1 ;
        $amortizacion['id_empresa'] = $this->finGenAmortiz['idempresa']  ;
        $amortizacion['id_usuario'] = $this->idUsuario ;
        $amortizacion['swt_deshabitado'] = 'f' ;
        $amortizacion['vlr_interes'] = $this->finGenAmortiz['saldo_amortizar'] * $this->finGenAmortiz['fin_tasa'] ;
        $amortizacion['vlr_interes'] = round($amortizacion['vlr_interes'] , 7) ;
        $amortizacion['vlr_interes'] = (round($amortizacion['vlr_interes'] , 2 ) <1 )? 0 : $amortizacion['vlr_interes'];
        // se valida si se genera amortizacion por el total del saldo   
        
        if ($this->finGenAmortiz['saldo_amortizar'] <= $cuota_minima or $this->finGenAmortiz['cuota_pendientes'] == 1 )
        {
            $amortizacion['vlr_bio'] = $sdo_am_bio ;
            $amortizacion['vlr_ter_fijo'] = $sdo_am_ter_fijo ;
            $amortizacion['vlr_ter_var'] = $sdo_am_ter_var ;
            $amortizacion['vlr_ter_ajuste'] = $sdo_am_ter_ajuste ;            
            $amortizacion['total_cuota'] = $sdo_am_Conceptoso + $amortizacion['vlr_interes'] ;
        }
        else{
            $cuota_minima = ceil(VAL_MIN_FINANCIAR/CAM_CUOTAS_MAX);
            $usuFin = $this->finGenAmortiz ;
            $cuotas = $usuFin['cuota_pendientes'] ; 
            $totalcuota = ceil($usuFin['saldo_amortizar'] /$cuotas );
            $totalcuota = ($totalcuota < $cuota_minima)? $cuota_minima : $totalcuota ;
            $saldo_cuota = $totalcuota ;
            // amortizar ajuste          
            $vlr_apli = $totalcuota * ((ceil(($sdo_am_ter_ajuste/$sdo_am_Conceptoso) * 100))/100);
            $valor = (round($vlr_apli)<1 )? 1 :round($vlr_apli);
            $valor = ($valor>$saldo_cuota)?$saldo_cuota:$valor;
            $amortizacion['vlr_ter_ajuste'] = ($valor <= $sdo_am_ter_ajuste)? $valor :$sdo_am_ter_ajuste ;
            $saldo_cuota -= $amortizacion['vlr_ter_ajuste'];
            // amortizar fijo
            $vlr_apli = $totalcuota * ((ceil(($sdo_am_ter_fijo/$sdo_am_Conceptoso) * 100))/100);
            $valor = (round($vlr_apli)<1 )? 1 :round($vlr_apli);
            $valor = ($valor>$saldo_cuota)?$saldo_cuota:$valor;
            $amortizacion['vlr_ter_fijo'] = ($valor <= $sdo_am_ter_fijo)? $valor :$sdo_am_ter_fijo ;
            $saldo_cuota -= $amortizacion['vlr_ter_fijo'];
            // amortizar Variable
            $vlr_apli = $totalcuota * ((ceil(($sdo_am_ter_var/$sdo_am_Conceptoso) * 100))/100);
            $valor = (round($vlr_apli)<1 )? 1 :round($vlr_apli);
            $valor = ($valor>$saldo_cuota)?$saldo_cuota:$valor;
            $amortizacion['vlr_ter_var'] = ($valor <= $sdo_am_ter_var)? $valor :$sdo_am_ter_var ;
            $saldo_cuota -= $amortizacion['vlr_ter_var'];
            // amortizar bio
            $amortizacion['vlr_bio'] = ($saldo_cuota <= $sdo_am_bio )? $saldo_cuota : $sdo_am_bio ; 
            $saldo_cuota -=  $amortizacion['vlr_bio'];
            $amortizacion['total_cuota'] = $amortizacion['vlr_ter_ajuste'] + $amortizacion['vlr_ter_fijo'] + 
                                           $amortizacion['vlr_ter_var'] + $amortizacion['vlr_bio'] + 
                                           $amortizacion['vlr_interes'] ;            
        }        
        $this->genAmortModel->insertarAmortizFinanc($amortizacion);
        $this->finGenAmortiz['amortizFinan'] = $amortizacion ;
    }
     /**
    * Construye objeto de detalle de la amortizacion y se envía para que sea registrado en base de datos
    */
    private function generarDetalleAmortizacion() 
    {	           
        $amortizacion = $this->finGenAmortiz['amortizFinan'] ;
        $det_amortiz['idamortiz'] = $amortizacion['id_amortiz'] ;
        $det_amortiz['total_cuota'] = $amortizacion['total_cuota'] ;
        $det_amortiz['vlr_bio'] = $amortizacion['vlr_bio'] ;
        $det_amortiz['vlr_ter_fijo'] = $amortizacion['vlr_ter_fijo'] ;
        $det_amortiz['vlr_ter_var'] = $amortizacion['vlr_ter_var'] ;
        $det_amortiz['vlr_ter_ajuste'] = $amortizacion['vlr_ter_ajuste'] ;
        $det_amortiz['vlr_interes'] = $amortizacion['vlr_interes'] ;
        $det_amortiz['estao'] = 't' ;       
        $this->genAmortModel->insertarDetAmortizFinanc($det_amortiz);
        $this->finGenAmortiz['detamortizFinan'] = $det_amortiz ;
    }
    
    /**
    * Actualiza el numero de cuotas amortizadas y la version de la financiacion
    * y se envía al modelo para actualizar en base de datos
    */
    private function actualizarFinancicionVersion() 
    {        
        $fin_act['fin_ideregistro'] = $this->finGenAmortiz['idfinanciacion'] ;
        $fin_act['fin_version'] = $this->finGenAmortiz['fin_version'] + 1 ;         
        $fin_act['fin_cuoemitidas'] = $this->finGenAmortiz['fin_cuoemitidas'] + 1 ;         
               
        $cantidad = $this->genAmortModel->actualizarFinanciacion($fin_act ,$this->finGenAmortiz['fin_version']);
        if($cantidad != 1 )
        {
            $finans =  $this->finGenAmortiz['dat_finan']  ;    
            throw new MyException('Error Actualziando Version de la financiacion: ' .$this->finGenAmortiz['idfinanciacion'] , -1);    
        }                        
    }  
    
    /**
     * Actualza los valores procesados en la tabla temporal
     * y se envía al modelo para actualizar en base de datos
     */
    private function actualizarTabTemporalPag() {         
        $amortizado = $this->finGenAmortiz['amortizado'] ;
        $cantidad = $this->genAmortModel->actualizarTabTemporalPag($amortizado ,$this->finGenAmortiz['idregistro'] );
        if($cantidad != 1 )
        {
            print_r("\n Actualizar Tabla Temporal :");
            print_r($this->finGenAmortiz); 
            throw new MyException('Error al actualizar los valores en la tabla temporal, el registro no fue encontrado: ' . $this->finGenAmortiz['idregistro'] . ' y cantidad Act: '. $cantidad, -1);    
        }
   }
    
//     /**
//     * Actualza la amortizacion con los valoes de los pagos
//     * y se envía al modelo para actualizar en base de datos
//     */
//    private function actualizarPagoAmortizacion($amortizaciones_finan) {
//        print_r("\n Actualizar las Amortizaciones con los Pagos :");                     
//        $amortizaciones = array();
//        $pagFinan = $this->finGenAmortiz['pagFinan'] ;
//        $tot_vlr_bio = $this->finGenAmortiz['pag_vlrbio'] ; 
//        $tot_vlr_fijo = $this->finGenAmortiz['pag_vlrterfijo'] ;  
//        $tot_vlr_var = $this->finGenAmortiz['pag_vlrtervar'] ; 
//        $tot_vlr_aju = $this->finGenAmortiz['pag_vlrteraju'] ;  
//        if (count($amortizaciones_finan) == 0 )
//        {
//            print_r("\n No hay Amortizaciones para procesar, no se han generado cuotas o ya todas las cuotas estan pagas:");
//        }
//        else
//        {
//            foreach ($amortizaciones_finan as $amortiz_fin)
//            {
//                if ( ($tot_vlr_bio+$tot_vlr_fijo+$tot_vlr_var+$tot_vlr_aju) == 0 ) 
//                    Break ;
//                if($amortiz_fin['am_sdocuota'] <= 0 )
//                {
//                    continue ;
//                }
//                try { 
//                    $valor = 0 ; 
//                    $pagAmortiz['idamortiz'] = $amortiz_fin['am_ideregistro'];
//                    $pagAmortiz['idpago'] = $pagFinan['id_pago'];
//                    $vlr_apli = $amortiz_fin['am_vlrbio'] - $amortiz_fin['am_cambio'] 
//                                - $amortiz_fin['am_pagbio'] ; 
//                    $pagAmortiz['vlrbio'] = ($tot_vlr_bio<= $vlr_apli )? $tot_vlr_bio : $vlr_apli;
//                    $valor +=  $pagAmortiz['vlrbio'] ;
//                    $tot_vlr_bio -=  $pagAmortiz['vlrbio'] ;                    
//                    $vlr_apli = $amortiz_fin['am_vlrterfij'] - $amortiz_fin['am_pagterfij'] ;
//                    $pagAmortiz['vlrterfij'] = ($tot_vlr_fijo <= $vlr_apli )? $tot_vlr_fijo : $vlr_apli;
//                    $valor +=  $pagAmortiz['vlrterfij'] ;
//                    $tot_vlr_fijo -=  $pagAmortiz['vlrterfij'] ;                            
//                    $vlr_apli = $amortiz_fin['am_vlrtervar'] - $amortiz_fin['am_camtervar'] 
//                                - $amortiz_fin['am_pagtervar'] ;
//                    $pagAmortiz['vlrtervar'] = ($tot_vlr_var <= $vlr_apli )? $tot_vlr_var : $vlr_apli;
//                    $valor +=  $pagAmortiz['vlrtervar'] ;
//                    $tot_vlr_var -=  $pagAmortiz['vlrtervar'] ;                    
//                    $vlr_apli = $amortiz_fin['am_vlrteraju'] - $amortiz_fin['am_pagteraju'] ;
//                    $pagAmortiz['vlrteraju'] = ($tot_vlr_aju <= $vlr_apli )? $tot_vlr_aju : $vlr_apli;
//                    $valor +=  $pagAmortiz['vlrteraju'] ;
//                    $tot_vlr_aju -=  $pagAmortiz['vlrteraju'] ;
//                    $pagAmortiz['vlrtotal'] = $valor ;
//                    $this->genAmortModel->insertarPagoAmortiz($pagAmortiz);
//                    $amortiz_fin['pago_Amortiz'] = $pagAmortiz ;
//                    $amortizacion = $this->actualizaAmortizPago($amortiz_fin);
//                    $amortizaciones[] = $amortizacion ;                
//                } catch (\Exception $e) {
//                    print_r($this->finGenAmortiz); 
//                    throw new MyException('Error  al Actualizar una amortizacion financiacion: ' . $pagAmortiz['idamortiz'] . ' - ' . $e->getMessage() , -1);
//                    Break ;
//                }            
//            }
//            $this->finGenAmortiz['amortizPag'] = $amortizaciones; 
//            $this->finGenAmortiz['sdo_vlrbio'] = $tot_vlr_bio; 
//            $this->finGenAmortiz['sdo_vlrterfijo'] = $tot_vlr_fijo ;  
//            $this->finGenAmortiz['sdo_vlrtervar'] = $tot_vlr_var ; 
//            $this->finGenAmortiz['sdo_vlrteraju'] = $tot_vlr_aju ;  
//        }
//    }  
   
//    /**
//     * Actualza la amortizacion con los valores del pago
//     * y se envía al modelo para actualizar en base de datos
//     */
//    private function actualizaAmortizPago($amortiz_pag) {
//        print_r("\n Actualizar Amortización con Pago :");         
//        $pagoAmortiz = $amortiz_pag['pago_Amortiz'];        
//        $amortizacion_fin['am_ideregistro'] = $amortiz_pag['am_ideregistro'] ;
//        $amortizacion_fin['am_pagbio'] = $amortiz_pag['am_pagbio'] + $pagoAmortiz['vlrbio']  ; 
//        $amortizacion_fin['am_pagterfij'] = $amortiz_pag['am_pagterfij'] + $pagoAmortiz['vlrterfij']  ; 
//        $amortizacion_fin['am_pagtervar'] = $amortiz_pag['am_pagtervar'] + $pagoAmortiz['vlrtervar']  ; 
//        $amortizacion_fin['am_pagteraju'] = $amortiz_pag['am_pagteraju'] + $pagoAmortiz['vlrteraju']  ; 
//        $amortizacion_fin['am_sdocuota'] = $amortiz_pag['am_sdocuota'] - $pagoAmortiz['vlrtotal']  ;  
//        $cantidad = $this->genAmortModel->actualizarAmortizacionFinan($amortizacion_fin);
//        if($cantidad != 1 )
//        {
//            print_r($this->finGenAmortiz);
//            throw new MyException('Error en la cantidad de registros actualizados de la amortizacion: ' . $amortizacion_fin['am_ideregistro'] . ' y cantidad Act: '. $cantidad, -1);    
//        }
//        $amortiz_pag['amortizAct'] = $amortizacion_fin ;
//        return $amortiz_pag ;                        
//   }
   
//    /**
//     * crea un pago para cada financiacion por el total de las 
//     * Amortizaciones y se envía al modelo para actualizar en base de datos
//     */
//    private function insertaPagoFinanAmortizacion() {
//        print_r("\n Crea pagos para las financiaciones desde las amortizaciones :");
//        print_r($this->finGenAmortiz);
//        $finans =  $this->finGenAmortiz['dat_finan']  ;
//        $pagFinan = $this->finGenAmortiz['pagFinan'] ;
//        $financiaciones = array();
//        foreach ($finans as $inf_fin)
//        {
//            if ($inf_fin['saldo'] <= 0)
//            {
//                $financiaciones[]= $inf_fin ;
//                continue;
//            }
//            try 
//            {
//                $pagosAmortiz =  $this->genAmortModel->getPagosAmortizFinan( $pagFinan['id_pago'] ,$inf_fin['fin_ideregistro'] );
//                if (count($pagosAmortiz) == 0) {
//                    $financiaciones[]= $inf_fin ;
//                    continue; 
//                }
//                $pag_amortiza_fin = $pagosAmortiz[0];             
//                $pagfinanc_am['id_finan'] = $pag_amortiza_fin['fin_ideregistro'];
//                $pagfinanc_am['id_pago'] = $pag_amortiza_fin['pag_ideregistro'];
//                $pagfinanc_am['vlrtotal'] = $pag_amortiza_fin['vlrtotal'];
//                $pagfinanc_am['vlrbio'] = $pag_amortiza_fin['vlrbio'];
//                $pagfinanc_am['vlrterfijo'] = $pag_amortiza_fin['vlrterfijo'];
//                $pagfinanc_am['vlrtervar'] = $pag_amortiza_fin['vlrtervar'];
//                $pagfinanc_am['vlrteraju'] = $pag_amortiza_fin['vlrteraju'];
//                $pagfinanc_am['tippago'] = 'AM';             
//                $this->genAmortModel->insertarPagoFinan($pagfinanc_am);
//                $inf_fin['pag_am'] = $pagfinanc_am ;
//                $financiacion = $this->actualizaFinanPagoAm($inf_fin);                
//                $financiaciones[] = $financiacion ;                
//            } catch (\Exception $e) {
//                throw new MyException('Error  al Actualizar una financiacion: ' . $pagAmortiz['idamortiz'] . ' - ' . $e->getMessage() , -1);
//                Break ;
//            }            
//        }
//        $this->finGenAmortiz['dat_finan'] = $financiaciones ;
//    }   
    
//    /**
//     * Actualza los saldos de la financicion con los valores del pago
//     * y se envía al modelo para actualizar en base de datos
//     */
//    private function actualizaFinanPagoAm($finan_pag) {
//        print_r("\n Actualizar financiacion con Pago :");         
//        $pagoFinan = $finan_pag['pag_am'];        
//        $fin_act['fin_ideregistro'] = $finan_pag['fin_ideregistro'] ;
//        $fin_act['fin_pagbio'] = $finan_pag['fin_pagbio'] + $pagoFinan['vlrbio']  ; 
//        $fin_act['fin_pagterfijo'] = $finan_pag['fin_pagterfij'] + $pagoFinan['vlrterfij']  ; 
//        $fin_act['fin_pagtervar'] = $finan_pag['fin_pagtervar'] + $pagoFinan['vlrtervar']  ; 
//        $fin_act['fin_pagajutervar'] = $finan_pag['fin_pagteraju'] + $pagoFinan['vlrteraju']  ; 
//        $cantidad = $this->genAmortModel->actualizarFinanciacion($fin_act ,$finan_pag['fin_version'] );
//        if($cantidad != 1 )
//        {
//            throw new MyException('Error en la cantidad de registros actualizados de la financiacion: ' .$finan_pag['fin_ideregistro']  . ' y fin_version : '. $finan_pag['fin_version'] , -1);    
//        }        
//        $finan_pag['fin_pagbio'] = $fin_act['fin_pagbio'] ; 
//        $finan_pag['fin_pagterfijo'] = $fin_act['fin_pagterfijo'] ; 
//        $finan_pag['fin_pagtervar'] = $fin_act['fin_pagtervar'] ; 
//        $finan_pag['fin_pagajutervar'] = $fin_act['fin_pagajutervar'] ; 
//        $finan_pag['saldo'] =  $finan_pag['saldo'] - $finan_pag['fin_pagbio'] - $finan_pag['fin_pagterfijo'] -
//                                 $finan_pag['fin_pagtervar'] - $finan_pag['fin_pagajutervar']; 
//        return $finan_pag ;                        
//   }
   
//    /**
//    * Actualza la financiacion con los valores del pago
//    * y se envía al modelo para actualizar en base de datos
//    */
//    private function actualizarFinancicionAbono() {
//        print_r("\n Actualizar Financiaicon con los abonos:");        
//        $finans =  $this->finGenAmortiz['dat_finan']  ;
//        $pagFinan = $this->finGenAmortiz['pagFinan'] ;
//        $financiaciones = array();
//        $tot_vlr_bio = $this->finGenAmortiz['sdo_vlrbio'] ; 
//        $tot_vlr_fijo = $this->finGenAmortiz['sdo_vlrterfijo'] ;  
//        $tot_vlr_var = $this->finGenAmortiz['sdo_vlrtervar'] ; 
//        $tot_vlr_aju = $this->finGenAmortiz['sdo_vlrteraju'] ;  
//        foreach ($finans as $inf_fin)
//        {     
//            if ( ($tot_vlr_bio+$tot_vlr_fijo+$tot_vlr_var+$tot_vlr_aju) == 0 ) 
//            {
//                  $financiaciones[]= $inf_fin ;
//                  continue ; 
//            }
//            $financ = $this->genAmortModel->getFinanciacionById($inf_fin['fin_ideregistro']);        
//            if ($financ['fin_ideregistro'] == -1 )
//            {
//                print_r($this->finGenAmortiz);
//                throw new MyException('la Financiacion no fue encontrada o ya no esta activa : ' . $inf_fin['fin_ideregistro'] , -1);
//            }
//            if ($financ['fin_version'] != $inf_fin['fin_version'] )
//            {
//                print_r($this->finGenAmortiz);
//                throw new MyException('Hay otro proceso que actualizo la financiacion, pago no se aplicara.. ' .$inf_fin['fin_ideregistro']  , -1);
//            } 
//            if($inf_fin['saldo'] <= 0 )
//            {
//                $financiaciones[]= $inf_fin ;
//                continue ;
//            }
//            try {          
//                $valor = 0 ; 
//                $pagfinancAb['id_finan'] = $inf_fin['fin_ideregistro'];
//                $pagfinancAb['id_pago'] = $pagFinan['id_pago'];
//                $vlr_apli = $inf_fin['fin_vlrbio'] - $inf_fin['fin_cambio'] 
//                             - $inf_fin['fin_pagbio'] ; 
//                $pagfinancAb['vlrbio'] = ($tot_vlr_bio<= $vlr_apli )? $tot_vlr_bio : $vlr_apli;  
//                $valor +=  $pagfinancAb['vlrbio'] ;
//                $tot_vlr_bio -=  $pagfinancAb['vlrbio'] ; 
//                $vlr_apli = $inf_fin['fin_vlraprfijo'] + $inf_fin ['fin_vlrviatfijo'] 
//                            - $inf_fin['fin_pagterfijo'] ;
//                $pagfinancAb['vlrterfijo'] = ($tot_vlr_fijo <= $vlr_apli )? $tot_vlr_fijo : $vlr_apli;
//                $valor +=  $pagfinancAb['vlrterfijo'] ;
//                $tot_vlr_fijo -=  $pagfinancAb['vlrterfijo'] ;      
//                $vlr_apli = $inf_fin['fin_vlraprvar']  + $inf_fin['fin_vlrviatvar'] 
//                          - $inf_fin['fin_camtervar'] - $inf_fin['fin_pagtervar'] ;
//                $pagfinancAb['vlrtervar'] = ($tot_vlr_var <= $vlr_apli )? $tot_vlr_var : $vlr_apli;
//                $valor +=  $pagfinancAb['vlrtervar'] ;
//                $tot_vlr_var -=  $pagfinancAb['vlrtervar'] ;
//                $vlr_apli = $inf_fin['fin_vlrajuaprvar'] - $inf_fin['fin_pagajutervar'] ;
//                $pagfinancAb['vlrteraju'] = ($tot_vlr_aju <= $vlr_apli )? $tot_vlr_aju : $vlr_apli;
//                $valor +=  $pagfinancAb['vlrteraju'] ;
//                $tot_vlr_aju -=  $pagfinancAb['vlrteraju'] ;
//                $pagfinancAb['vlrtotal'] = $valor ;
//                $pagfinancAb['tippago'] = 'AB' ;    
//                print_r("\n Archivo de pagos :" .$inf_fin['fin_ideregistro'] );
//                print_r($pagfinancAb);
//                $this->genAmortModel->insertarPagoFinanAb($pagfinancAb);
//                $inf_fin['pag_ab'] = $pagfinancAb ;
//                $financiacion = $this->actualizaFinanPagoAb($inf_fin);  
//                $financiaciones[] = $financiacion ;                 
//            } catch (\Exception $e) {
//                print_r($this->finGenAmortiz);
//                throw new MyException('Error  al Actualizar una amortizacion financiacion: ' . $inf_fin['fin_ideregistro'] . ' - ' . $e->getMessage() , -1);
//                Break ;
//            }            
//        }
//        $this->finGenAmortiz['dat_finan'] = $financiaciones ;
//        $this->finGenAmortiz['sdo_vlrbio'] = $tot_vlr_bio; 
//        $this->finGenAmortiz['sdo_vlrterfijo'] = $tot_vlr_fijo ;  
//        $this->finGenAmortiz['sdo_vlrtervar'] = $tot_vlr_var ; 
//        $this->finGenAmortiz['sdo_vlrteraju'] = $tot_vlr_aju ;  
//    }
      
//    /**
//     * Actualza los saldos de la financicion con los valores del pago de Abono Directo
//     * y se envía al modelo para actualizar en base de datos
//     */
//    private function actualizaFinanPagoAb($finan_pag) {
//        print_r("\n Actualizar financiacion con Pago :");         
//        $pagoFinanAB = $finan_pag['pag_ab'];        
//        $fin_act['fin_ideregistro'] = $finan_pag['fin_ideregistro'] ;
//        $fin_act['fin_pagbio'] = $finan_pag['fin_pagbio'] + $pagoFinanAB['vlrbio']  ; 
//        $fin_act['fin_pagterfijo'] = $finan_pag['fin_pagterfijo'] + $pagoFinanAB['vlrterfijo']  ; 
//        $fin_act['fin_pagtervar'] = $finan_pag['fin_pagtervar'] + $pagoFinanAB['vlrtervar']  ; 
//        $fin_act['fin_pagajutervar'] = $finan_pag['fin_pagajutervar'] + $pagoFinanAB['vlrteraju']  ; 
//        $cantidad = $this->genAmortModel->actualizarFinanciacion($fin_act ,$finan_pag['fin_version'] );
//        if($cantidad != 1 )
//        {
//            print_r($this->finGenAmortiz);
//            throw new MyException('Error en la cantidad de registros actualizados de la financiacion: ' .$finan_pag['fin_ideregistro']  . ' y fin_version : '. $finan_pag['fin_version'] , -1);    
//        }        
//        $finan_pag['fin_pagbio'] = $fin_act['fin_pagbio'] ; 
//        $finan_pag['fin_pagterfijo'] = $fin_act['fin_pagterfijo'] ; 
//        $finan_pag['fin_pagtervar'] = $fin_act['fin_pagtervar'] ; 
//        $finan_pag['fin_pagajutervar'] = $fin_act['fin_pagajutervar'] ; 
//        $finan_pag['saldo'] =  $finan_pag['saldo'] - $finan_pag['fin_pagbio'] - $finan_pag['fin_pagterfijo'] -
//                                 $finan_pag['fin_pagtervar'] - $finan_pag['fin_pagajutervar']; 
//        return $finan_pag ;                        
//    }    
    
//    /**
//     * crea un pago para cada detalle para cada tercero, donde la financiacion 
//     * haya recibido un pago y se envía al modelo para actualizar en base de datos
//     */
//    private function insertaPagoDetTerFinanciacion() {
//        print_r("\n Crea pagos cada tercero segun los pagos desde las financiaciones :");        
//        $finans =  $this->finGenAmortiz['dat_finan']  ;
//        $pagFinan = $this->finGenAmortiz['pagFinan'] ;
//        $detTerFinanciaciones = array();
//        $financiaciones = array();
//        foreach ($finans as $inf_fin)
//        {            
//            try 
//            {
//                $pagosFinanci =  $this->genAmortModel->getPagosFinan( $pagFinan['id_pago'] ,$inf_fin['fin_ideregistro'] );
//                if (count($pagosFinanci) == 0) {
//                    $financiaciones[]= $inf_fin ;
//                    continue; 
//                }
//                $pagoFinanci = $pagosFinanci[0]; 
//                if (ceil($pagoFinanci['vlrterfijo']) == 0 and ceil($pagoFinanci['vlrtervar']) == 0 and ceil($pagoFinanci['vlrteraju']) == 0) 
//                {
//                    print_r($this->finGenAmortiz);
//                    print_r("\n No hay pagos para los terceros... :");
//                    $financiaciones[]= $inf_fin ;
//                    continue; 
//                }                
//                $detalles_apr_finan = $this->genAmortModel->getDetAprFinanciacion($inf_fin['fin_ideregistro'] );              
//                if (count($detalles_apr_finan) == 0 and $amortizaciones_finan['fin_ideregistro'] = -1 )
//                {  
//                    print_r($this->finGenAmortiz);
//                    throw new MyException('Error no hay detalles de terceros para procesar, validar saldos terceros fin_ideregistro: ' .$finan['fin_ideregistro'] , -1);
//                }
//                
//                $vlrterfijo = $pagoFinanci['vlrterfijo'] ;
//                $vlrtervar = $pagoFinanci['vlrtervar'] ;
//                $vlrteraju = $pagoFinanci['vlrteraju'] ;
//                $sdoterfijo = $pagoFinanci['vlrterfijo'] ;
//                $sdotervar = $pagoFinanci['vlrtervar'] ;
//                $sdoteraju = $pagoFinanci['vlrteraju'] ;  
//                
//                $vlr_tot_fijo = $inf_fin['fin_vlraprfijo'] + $inf_fin['fin_vlrviatfijo'];
//                $vlr_tot_var = $inf_fin['fin_vlraprvar'] + $inf_fin['fin_vlrviatvar'];
//                $vlr_tot_aju = $inf_fin['fin_vlrajuaprvar'] ;
//                $contador = 0 ;
//     
//                foreach ($detalles_apr_finan as $detalle_ter) 
//                {                 
//                    if($vlrterfijo == 0 and $vlrtervar == 0 and $vlrteraju == 0 )
//                    {
//                        break ;
//                    }
//                    $pagdetfinanc['id_afinan'] = $detalle_ter['afin_ideregistro'];
//                    $pagdetfinanc['id_pago'] = $pagFinan['id_pago'];
//                    $pagdetfinanc['sdoinifijo'] = $detalle_ter['afin_sdovlrfijo'] ;
//                    $pagdetfinanc['sdoinivariable'] = $detalle_ter['afin_sdovlrvariable'] ;
//                    $pagdetfinanc['sdoiniajuste'] = $detalle_ter['afin_sdovlrajustes'] ;                    
//                    $pagdetfinanc['vlrfijo'] = $this->procesatDetFinanCon($detalle_ter['afin_sdovlrfijo'] , $detalle_ter['afin_vlrfijo'], $vlr_tot_fijo, $vlrterfijo , $sdoterfijo ) ;
//                    $pagdetfinanc['vlrvariable'] = $this->procesatDetFinanCon($detalle_ter['afin_sdovlrvariable'] , $detalle_ter['afin_vlrvariable'], $vlr_tot_var, $vlrtervar, $sdotervar )  ;
//                    $pagdetfinanc['vlrajuste'] = $this->procesatDetFinanCon($detalle_ter['afin_sdovlrajustes'] , $detalle_ter['afin_vlrajuste'], $vlr_tot_aju, $vlrteraju, $sdoteraju ) ;
//                    $sdoterfijo -= $pagdetfinanc['vlrfijo'] ;
//                    $sdotervar -= $pagdetfinanc['vlrvariable'] ;
//                    $sdoteraju -= $pagdetfinanc['vlrajuste'] ;             
//
//                    $this->genAmortModel->insertarPagoDetFinan($pagdetfinanc);
//                    $detalle_ter['pago'] = $pagdetfinanc ;
//                    $detalle_ter['det_act'] = $this->actualizaDetFinanPago($detalle_ter) ;                        
//                    $det_terceros[] = $detalle_ter ;                  
//                }
//                $inf_fin['det_terce'] = $det_terceros ;
//                $sdoterfijo = round ($sdoterfijo, 4);
//                $sdotervar = round ($sdotervar, 4);
//                $sdoteraju = round ($sdoteraju, 4);           
//                if ($sdoterfijo > 0 OR $sdotervar > 0 or $sdoteraju> 0 )
//                {
//                    print_r("\n\n\n despues de terceros ... :") ;              
//                    print_r("\n fijo ... :". $sdoterfijo) ;
//                    print_r("\n variable ... :". $sdotervar) ;
//                    print_r("\n ajuste ... :". $sdoteraju) ;
//                    print_r("\n Terminando de Ingresar terceros ... :");
//                    print_r($inf_fin); 
//                    throw new MyException('Error en los saldos aplicados de terceros, hay mayor valor en la finan: ' . $inf_fin['fin_ideregistro'] , -1);     
//                }
//                if ($sdoterfijo < 0 OR $sdotervar < 0 or $sdoteraju < 0 )
//                {
//                    print_r("\n\n\n despues de terceros ... :") ;              
//                    print_r("\n fijo ... :". $sdoterfijo) ;
//                    print_r("\n variable ... :". $sdotervar) ;
//                    print_r("\n ajuste ... :". $sdoteraju) ;
//                    print_r("\n Terminando de Ingresar terceros ... :");
//                    print_r($inf_fin); 
//                    throw new MyException('Error en los saldos aplicados de terceros, se aplico mayor valor en los detalles en la finan: ' . $inf_fin['fin_ideregistro'] , -1);                         
//            
//                }
//            } catch (\Exception $e) {
//                throw new MyException('Error  al Actualizar el detalle de una financiacion: ' . $pagFinan['factura'] . ' - ' . $e->getMessage() , -1);
//                Break ;
//            }    
//            $financiaciones[]= $inf_fin ;
//        }
//        $this->finGenAmortiz['dat_finan'] = $financiaciones ;
//    }
    
//    /**
//     * valida el concepto enviado y retorna le valor a cargar
//     * @param $sdo_concepto - Id de la empresa actual
//     * @param $vlrtot_fin_det - valor total financiado del concepto para el detalle
//     * @param $vlr_tot_con - valor total financiado del concepto 
//     * @param $vlrtotapl - valor maximo a aplicar para el concepto
//     * return $vlr_apl_con - valor a plicar para el concepto
//     */
//    private function procesarDetFinanCon($sdo_concep , $vlrtot_fin_det, $vlr_tot_con, $vlrapl , $vlrtotapl ) 
//    {
//        $vlr_apl_con = 0 ;
//        if( $sdo_concep > 0 and $vlrtotapl > 0 )
//        {
//            if( $vlr_tot_con == 0)
//            {
//                throw new MyException('Error en los valores financiados y los detalles: ' , -1);
//            }  
//            $totalcuota = $vlrtotapl ;
//            $vlr_apli = $vlrapl * ((ceil(($vlrtot_fin_det/$vlr_tot_con) * 100))/100);
//            $valor = (round($vlr_apli, 7 ) <= 0 )? 0.0001 : round($vlr_apli, 7 );
//            $valor = ($valor>$totalcuota)?$totalcuota:$valor;
//            $vlr_apl_con = ($valor <= $sdo_concep)? $valor : $sdo_concep  ;
//        } 
//        return $vlr_apl_con ;                        
//    } 
//    
//     /**
//     * Actualza los saldos del detalle de la financicion con los valores del pago 
//     * y se envía al modelo para actualizar en base de datos
//     * @param $det_finan_pag - informacion con el detalle a actualizar
//     */
//    private function actualizaDetFinanPago ($det_finan_pag) {
//        print_r("\n Actualizar detalle de la financiacion con Pago :");         
//        $pagoDetFinan = $det_finan_pag['pago'];        
//        $det_fin_act['afin_ideregistro'] = $det_finan_pag['afin_ideregistro'] ;
//        $det_fin_act['afin_pagvlrfijo'] = $det_finan_pag['afin_pagvlrfijo'] + $pagoDetFinan['vlrfijo']  ; 
//        $det_fin_act['afin_pagvlrvariable'] = $det_finan_pag['afin_pagvlrvariable'] + $pagoDetFinan['vlrvariable']  ; 
//        $det_fin_act['afin_pagvlrajustes'] = $det_finan_pag['afin_pagvlrajustes'] + $pagoDetFinan['vlrajuste']  ; 
//        $det_fin_act['afin_sdovlrfijo'] = $det_finan_pag['afin_sdovlrfijo'] - $pagoDetFinan['vlrfijo']  ; 
//        $det_fin_act['afin_sdovlrvariable'] = $det_finan_pag['afin_sdovlrvariable'] - $pagoDetFinan['vlrvariable']  ; 
//        $det_fin_act['afin_sdovlrajustes'] = $det_finan_pag['afin_sdovlrajustes'] - $pagoDetFinan['vlrajuste']  ; 
//        $sdo_fijo = round($det_fin_act['afin_sdovlrfijo'], 7) ;
//        $sdo_vari = round($det_fin_act['afin_sdovlrvariable'], 7) ;
//        $sdo_ajus = round($det_fin_act['afin_sdovlrajustes'], 7) ;
//        if ($sdo_fijo < 0 OR $sdo_vari < 0 OR $sdo_ajus < 0  )
//        {
//            print_r($this->finGenAmortiz);
//            print_r(" \n\n Registro actual...");
//            print_r($det_finan_pag);            
//            print_r(" \n\n Registro a subir...");
//            print_r($det_fin_act);
//            throw new MyException('Error en la actualizacion del detalle saldos negativos: ' .$det_finan_pag['afin_ideregistro']  , -1);    
//        }
//        $cantidad = $this->genAmortModel->actualizarDetTercFinanciacion($det_fin_act);
//        if($cantidad != 1 )
//        {
//            print_r($this->finGenAmortiz);
//            throw new MyException('Error en la cantidad de registros actualizados del detalle: ' .$det_finan_pag['afin_ideregistro'] , -1);    
//        }        
//        return $det_fin_act ;                        
//    }
//   
//    /**
//     * Valida el usuario y la financiacion para consultar si es viable 
//     * aplicar el pago en las demas tablas 
//     * @return void
//     * @throws MyException
//     */
//    private function validarUsuarioFinanciacion() {
//         /*
//         * Valdia si el codigo de usuario tiene una financiacion. 
//         */
//        $usuFin = $this->genAmortModel->getUsuarioFinanciacion($this->finGenAmortiz['mua_cod'] , $this->finGenAmortiz['idempresa']);
//        if ($usuFin['cantidad'] < 0 ) {
//            print_r($this->finGenAmortiz);
//            throw new MyException('El usuario no tiene finaciaciones Activas: '.$this->finGenAmortiz['mua_cod']  , -1);
//        }
//        $saldo = round($usuFin['saldo']) ;
//        if ($saldo <= 0 )
//        {
//            print_r($this->finGenAmortiz);
//            throw new MyException('El usuario no tiene financiaciones con saldo: Financiaciones '.$usuFin['id_finan']. ' y facturas finan : ' . $usuFin['num_fac_fin']  , -1);
//        }
//        /*
//         * Valida si el pago se va aplicar a una financiacion Especifica 
//         * y la consulta en la Base de Datos
//         */
//        if ($this->finGenAmortiz['idfinanciacion'] > 0 )
//        {
//            $finan = $this->genAmortModel->getFinanciacionById($this->finGenAmortiz['idfinanciacion']);
//            if ($finan['fin_ideregistro'] < 0  ) {
//                print_r($this->finGenAmortiz);
//                throw new MyException('No existe la financiacion o no esta activa: '.$this->finGenAmortiz['idfinanciacion']  , -1);
//            }
//            $saldo = round($finan['saldo']) ;
//            if ($saldo <= 0  ) {
//                print_r($this->finGenAmortiz);
//                throw new MyException('La financiacion no tiene Saldo..: '.$this->finGenAmortiz['idfinanciacion']  , -1);
//            }
//             if ($finan['mua_cod'] != $this->finGenAmortiz['mua_cod']  ) {
//                 print_r($this->finGenAmortiz);
//                throw new MyException('La financicaion no pertenece al usuario: '.$this->finGenAmortiz['idfinanciacion']  , -1);
//            }       
//        }  
//        else
//        {
//            $finan = $this->genAmortModel->getFinanciacionUsuario($this->finGenAmortiz['mua_cod'],  $this->finGenAmortiz['idempresa']); 
//            if (count($finan) == 0 ){
//                print_r($this->finGenAmortiz);
//                throw new MyException('No hay Financiaciones activas para el usuario usuario: '.$this->finGenAmortiz['mua_cod']  , -1);
//            }            
//        }
//        $this->finGenAmortiz['inf_usuario'] = $usuFin ;
//        $this->finGenAmortiz['dat_finan'] = $finan ; 
//    }
}
