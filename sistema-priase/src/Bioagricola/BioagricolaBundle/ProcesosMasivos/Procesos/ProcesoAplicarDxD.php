<?php

namespace Bioagricola\BioagricolaBundle\ProcesosMasivos\Procesos;

//use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Bioagricola\BioagricolaBundle\Models\AplicarCambiosModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\MyException;

/**
 * Archivo que hará el control del proceso de cargar las cambioDxDes especiales de BIO
 * @author rsagudelo
 */
class ProcesoAplicarDxD {

    private $idHilo;

    /**
     * información del registro de la Financiacion que está en la tabla temporal
     * @var array 
     */
    private $cambioDxD;
    private $idAcceso;
    private $conexion;
    private $idEmpresa;
    private $idUsuario;
    private $idProceso;
    private $imprimeLog;
    private $genericoModel;
    private $genericoDelegado;
    private $aplicarDxD_Model;

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
        $this->aplicarDxD_Model = new AplicarCambiosModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->imprimeLog = true;
    }

    /**
     * Registra la ejecución del proceso de cargar cambioDxD y guarda la variable global del proceso
     */
    public function registrarProceso() {
        try {
            $this->conexion->beginTransaction();
            $proceso['estado'] = 'A';
            $proceso['fechaInicio'] = 'now()';
            $proceso['idPrograma'] = PROGRAMA_APLCV_FIN_ESP_BIO;
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
        $Datos['idprograma'] = PROGRAMA_APLCV_FIN_ESP_BIO;
        $this->procesoModel->inactivarControEjecucionProceso($Datos);
    }

    /**
     * Obtiene la cantidad de hilos que ejecutan el mismo  proceso
     * @param int $ProcesoControl - Id del hilo que s eestá ejecutando
     * @return int - Cantidad de hilos
     */
    public function getCantidadHilosActivosPrograma($ProcesoControl) {
        $Datos['idempresa'] = $this->idEmpresa;
        $Datos['idprograma'] = PROGRAMA_APLCV_FIN_ESP_BIO;
        $Datos['idhilo'] = $ProcesoControl;
        $cantidad = $this->procesoModel->getCantidadHilosActivosPrograma($Datos);
        return $cantidad;
    }
    
    /*
     * Consulta los Cambios de Valor DxD que se van a procesar según el estado del registro
     */
    public function consultarCambiosDxDpendiente() {
        try {
            $this->escribeLog(" Consultando los cambios de valor DxD para procesar \n ");
            $listaCambiosDxD = $this->aplicarDxD_Model->getCambiosDxDproceso($this->idEmpresa, $this->idHilo);
            if (empty($listaCambiosDxD)) {
                $this->escribeLog('No hay más Cambios DxD por procesar');
                return;
            }
            return $listaCambiosDxD;
        } catch (MyException $ex) {
            $this->escribeLog($ex->getMessage());
        }
    }

    /**
     * Inicia el procesamiento de los cambios de Valor y va registrando en la tabla temporal
     * @param array $listaCambiosDxD - Información de los cambios de valor a procesar
     */
    public function iniciar($listaCambiosDxD) {
        foreach ($listaCambiosDxD as $registro) {
            try {
                $this->conexion->beginTransaction();
                $this->cambioDxD = $registro;
                $this->procesarCambioDxD(); 
                $datAct['id_registro'] = $this->cambioDxD['idregistro'] ;
                $datAct['estado'] = 'A' ;
                $datAct['mensaje'] = 'Se aplico correctamente el cambio de Valor con el id: ' .$this->cambioDxD['camValor']['idcambio'] ;
                $this->aplicarDxD_Model->actualizarTemporalResumen($datAct);
                $this->conexion->commit();
            } catch (MyException $e) {
                $this->conexion->rollBack();
                $datAct['id_registro'] = $this->cambioDxD['idregistro'] ;
                $datAct['estado'] = 'F' ;
                $datAct['mensaje'] = $e->getMessage() ;
                $this->aplicarDxD_Model->actualizarTemporalResumen($datAct);       
            } catch (\Exception $e) {
                $this->conexion->rollBack();
                $datAct['id_registro'] = $this->cambioDxD['idregistro'] ;
                $datAct['estado'] = 'F' ;
                $datAct['mensaje'] = $e->getMessage() ;
                $this->aplicarDxD_Model->actualizarTemporalResumen($datAct);
            } finally {
                $this->aumentarCantidad();
            }
        }
    }

     /**
     * Valida la información del cambioDxD y registra y actualiza en la tablas necesarias 
     * @return void
     * @throws MyException
     */
    private function procesarCambioDxD() {
         /*
         * Valdia si la financiacion ya se le ha aplicado un cambio de Valor DxD. 
         */
        $finan = $this->aplicarDxD_Model->getFinanciacionDxD($this->cambioDxD['idfinanciacion']);
        if ($finan['id_finan'] < 0 ) {
            throw new MyException('La Financiacion no existe o no esta activa', -1);
        }
        if ($finan['fin_swtcamdesh'] == 't' )
        {
            throw new MyException('La Financiacion ya tiene un cambio DxD aplicado'  , -1);
        }
        /*
         * crear cambioDxD
        */   
        $this->insertarCambioValorDxD();       
        $this->actualizarDetAprCambioDxD();
        $this->actualizarAmortizacionDxD();   
        $this->actualizarFinancicionDxD();   
        $this->actualizarCambioValorDxD();   
        $this->actualizarTabTemporalDxD();   
    }
    
    /**
     * Construye objeto de cambioDxD y envía para que sea registrado en base de datos
     */
    private function insertarCambioValorDxD() {	               
        if ($this->idEmpresa != $this->cambioDxD['idempresa']) {
            print_r("\n Empresa Sesion : ");
            print_r($this->idEmpresa);
            throw new MyException('La empresa en Sesion no es igual a la empresa de la cambioDxD ' , -1);
        }
        $camValor['num_pqr'] = $this->cambioDxD['num_pqr'];
        $camValor['codigo'] = $this->cambioDxD['mua_cod'];
        $camValor['factura'] = $this->cambioDxD['lmf_fac'];
        $camValor['finan'] = $this->cambioDxD['idfinanciacion'];
        $camValor['mesaho'] = $this->cambioDxD['fin_mesaho'];
        $camValor['vlrtotal'] = $this->cambioDxD['des_vlrtotal'];
        $camValor['vlrbio'] = $this->cambioDxD['des_vlrbio'];
        $camValor['vlrtercero'] = $this->cambioDxD['des_vlrter'];
        $camValor['vlrtercepag'] = $this->cambioDxD['des_vlrterpag'];
        $camValor['vlrsdo'] = $this->cambioDxD['des_vlrsdo'];
        $camValor['idempresa'] = $this->cambioDxD['idempresa'];
        $camValor['idusuario'] = $this->idUsuario;
        $this->aplicarDxD_Model->insertarCambioValor($camValor);
        $this->cambioDxD['camValor'] = $camValor ;
    }    
   
     /**
     * Construye objeto de cambio de Valor para cada detalle de aprovechamiento
     * y se envía al modelo para la inserción en base de datos
     */
    private function actualizarDetAprCambioDxD() {           
        $detalles_apr_finan = $this->aplicarDxD_Model->getDetAprFinanciacion($this->cambioDxD['idfinanciacion']);              
        $vlr_tot_cambio = 0 ;
        $vlr_tot_cam_Pag = 0 ;         
        $det_terceros = array();
        $camValor = $this->cambioDxD['camValor'] ;
        if (count($detalles_apr_finan) == 1 and $detalles_apr_finan['fin_ideregistro'] = -1 )
        {    
            print_r("\n Error no hay detalles de terceros para procesar, validar fin_ideregistro: ");
            print_r($this->cambioDxD);    
            throw new MyException('Error no hay detalles de terceros para procesar ' , -1);
        }
        else
        { 
            foreach ($detalles_apr_finan as $detalle_ter) {
                if($detalle_ter['camv_ideregistro'] != NULL)
                {
                    print_r("\n Error hay detalles con cambios de Valor aplicados fin_ideregistro : ");
                    print_r($this->cambioDxD);  
                    throw new MyException('Error hay detalles con cambios de Valor aplicados ', -1);
                    Break ;
                }
                try {                  
                    $detalle_ter['afin_camvlr'] = $detalle_ter['afin_sdovlrvariable'] ;
                    $detalle_ter['afin_sdovlrvariable'] = 0 ;
                    $detalle_ter['afin_camvlrpago'] = $detalle_ter['afin_pagvlrvariable'] ;                
                    $detalle_ter['camv_ideregistro'] = $camValor['idcambio'] ;
                    $detalle_ter['afin_swtrepcambio'] = '1' ;                                     
                    $vlr_tot_cambio += $detalle_ter['afin_camvlr'] ;
                    $vlr_tot_cam_Pag += $detalle_ter['afin_camvlrpago'] ; 
                    $cantidad = $this->aplicarDxD_Model->actualizarDetTercFinanciacion($detalle_ter);
                    $det_terceros[] = $detalle_ter ;
                    if($cantidad != 1 )
                    {
                        print_r("\n Error en la cantidad de registros actualizados del tercero ");
                        print_r($this->cambioDxD); 
                        print_r("\n cantidad " + $cantidad );
                        throw new MyException('Error en la cantidad de registros actualizados del tercero ', -1);    
                    }
                } catch (\Exception $e) {
                    throw new MyException('Error  al Actualizar un detalle de terceros financiacion: ' . $this->cambioDxD['idfinanciacion'] . ' y radiacado: '. $this->cambioDxD['num_pqr'] . ' - '.$e->getMessage() , -1);
                    Break ;
                }            
            }  
            $vlr_tot_cambio = round($vlr_tot_cambio , 7 ) ;
            $vlr_tot_cam_Pag = round($vlr_tot_cam_Pag , 7 ) ;
            if ( $camValor['vlrtotal'] - ($vlr_tot_cambio + $vlr_tot_cam_Pag)  > 0 ) 
            {
                $this->cambioDxD['detalle_tercero'] = $det_terceros ;
                $this->cambioDxD['des_vlrter'] = $vlr_tot_cambio ;
                $this->cambioDxD['des_vlrterpag'] = $vlr_tot_cam_Pag ;
                $this->cambioDxD['camValor']['vlrtercero'] = $vlr_tot_cambio ;
                $this->cambioDxD['camValor']['vlrtercepag'] = $vlr_tot_cam_Pag ;
            }
            else{
                print_r("\n Error el valor variable de los detalles es mayor o igual al valor total del cambioDxD ");
                print_r($this->cambioDxD);
                throw new MyException('Error el valor variable de los detalles es mayor o igual al valor total del cambioDxD, validar el valor del cambio' , -1);           
            }
        }
   }
   
    /**
     * Actualza la amortizacion con los valoes del cambio de valor
     * y se envía al modelo para actualizar en base de datos
     */
    private function actualizarAmortizacionDxD() {            
        $amortizaciones_finan = $this->aplicarDxD_Model->getAmortizacionFinanciacion($this->cambioDxD['idfinanciacion']);                      
        $amortizaciones = array();
        $camValor = $this->cambioDxD['camValor'] ;
        $tot_vlr_apl = 0 ; 
        $tot_vlr_apl_bio =  $this->cambioDxD['des_vlrtotal'] - $this->cambioDxD['des_vlrter'] ;
        $tot_vlr_apl_bio = round($tot_vlr_apl_bio,7) ;
        if (count($amortizaciones_finan) == 1 and $amortizaciones_finan[0]['fin_ideregistro'] == -1 )
        {
            print_r("\n No hay Amortizaciones para procesar, no se han generado cuotas o ya todas las cuotas estan pagas:");
        }
        else
        {            
            foreach ($amortizaciones_finan as $amortizacion_fin) {
                if($amortizacion_fin['am_swtcamdesh'] == 't')
                {
                    print_r("\n Error hay amortizaciones con Cambios ya aplicados ");
                    print_r($amortizacion_fin);
                    print_r($this->cambioDxD); 
                    throw new MyException('Error hay amortizaciones con Cambios ya aplicados ', -1);
                    Break ;
                }
                try {    
                    if ($this->cambioDxD['des_usuapl'] != null )
                    {
                       $amortizacion_fin['am_camtervar'] = $amortizacion_fin['am_vlrtervar'] - $amortizacion_fin ['am_pagtervar'] ;
                       $amortizacion_fin['am_cambio'] = $amortizacion_fin['am_camtervar'] * -1 ;                       
                    }
                    else
                    {
                        $camtervar = $amortizacion_fin['am_vlrtervar'] - $amortizacion_fin ['am_pagtervar'] ;
                        $cambio = $amortizacion_fin['am_vlrbio'] - $amortizacion_fin['am_pagbio'] ;
                        $cambio = round($cambio, 7 ) ;
                        $camtervar = round($camtervar, 7 ) ;
                        $amortizacion_fin['am_camtervar'] = $camtervar ; 
                       if ($cambio < 0 or $camtervar < 0 )
                       {
                           print_r("\n Error hay amortizaciones con saldos de Bio o de terceros Negativos  ");
                           print_r($this->cambioDxD);      
                           throw new MyException('Error hay amortizaciones con saldos de Bio o de terceros Negativos ' , -1);
                           Break ;
                       }
                       $amortizacion_fin['am_cambio'] = $cambio <= $tot_vlr_apl_bio ? $cambio : $tot_vlr_apl_bio ;
                       $tot_vlr_apl_bio -= $amortizacion_fin['am_cambio']  ; 
                       $amortizacion_fin['am_sdocuota'] = $amortizacion_fin['am_sdocuota'] - $amortizacion_fin['am_camtervar'] - $amortizacion_fin['am_cambio'] ;
                    }  
                    $tot_vlr_apl += $amortizacion_fin['am_camtervar'] ; 
                    $amortizacion_fin['am_swtcamdesh'] = 't' ;                    
                    $cantidad = $this->aplicarDxD_Model->actualizarAmortizacionFinan($amortizacion_fin, $amortizacion_fin['am_ideregistro']);
                    $amortizaciones[] = $amortizacion_fin ;
                    if($cantidad != 1 )
                    {
                        print_r("\n Error en la cantidad de registros actualizados de la amortizacion ");
                        print_r($this->cambioDxD); 
                        throw new MyException('Error en la cantidad de registros actualizados de la amortizacion ' . $cantidad, -1);    
                    }
                } catch (\Exception $e) {
                    print_r("\n Error  al Actualizar una amortizacion financiacion: " +  $this->cambioDxD['idfinanciacion'] + " y radiacado: " +  $this->cambioDxD['num_pqr'] + " - " + $e->getMessage());
                    print_r($this->cambioDxD); 
                    throw new MyException('Error  al Actualizar una amortizacion financiacion ' . $this->cambioDxD['idfinanciacion'] . ' y radiacado: '. $this->cambioDxD['num_pqr'] . ' - '.$e->getMessage() , -1);
                    Break ;
                }            
            }        
            $val_cam_ter = $camValor['vlrtercero'] - $tot_vlr_apl ;
            $val_cam_ter = round($val_cam_ter , 4 );
            if ( $val_cam_ter <  0 ) 
            {              
                print_r("\n Error el valor aplicado en la amortizaciones es mayor al aplicado en la tabla de tercero:  ");
                print_r($val_cam_ter);
                print_r("\n");
                print_r($this->cambioDxD);
                throw new MyException('Error el valor aplicado en la amortizaciones es mayo al aplicado en la tabla de terceros ' , -1);           
            }
            
        }  
   }
   /**
     * Actualza la financiacion con los valores del cambio de valor
     * y se envía al modelo para actualizar en base de datos
     */
    private function actualizarFinancicionDxD() {               
        $financ = $this->aplicarDxD_Model->getFinanciacionById($this->cambioDxD['idfinanciacion']);  
        $camValor = $this->cambioDxD['camValor'] ;
        $tot_vlr_apl = 0 ;   
        $tot_vlr_apl_bio =  $this->cambioDxD['des_vlrtotal'] - $this->cambioDxD['des_vlrter'] ;
        $tot_vlr_apl_bio = round($tot_vlr_apl_bio,7) ;
        if ($financ['fin_ideregistro'] == -1 )
        {
            print_r("\n la Financiacion no fue encontrada o ya no esta activa ");
            print_r($this->cambioDxD);
            throw new MyException('la Financiacion no fue encontrada o ya no esta activa ' , -1);
        }
        if ($financ['fin_swtcamdesh'] == 't' )
        {
            print_r("\n la Financiacion ya tiene un cambio de valor aplicado ");
            print_r($this->cambioDxD);
            throw new MyException('la Financiacion ya tiene un cambio de valor aplicado ' , -1);
        }
        if ($financ['fin_version'] != $this->cambioDxD['num_version'] )
        {
            print_r("\n Hay otro proceso que actualizo la financiacion, cambio no se aplicara  ");
            print_r($this->cambioDxD);
            throw new MyException('Hay otro proceso que actualizo la financiacion, cambio no se aplicara ' , -1);
        } 
        $vlrcamter = $financ['fin_vlraprvar'] + $financ ['fin_vlrviatvar'] - $financ ['fin_pagtervar'] ;
        $vlrcamter = round($vlrcamter , 7 );
        if($vlrcamter < 0 )
        {
            print_r("\n Error en los saldos de la financiacion, cambio no se aplicara ");
            print_r($this->cambioDxD);
            throw new MyException('Error en los saldos de la financiacion, cambio no se aplicara ' , -1);
        } 
        if ($this->cambioDxD['des_usuapl'] != null )
        {            
           $financ['fin_camtervar'] = $vlrcamter ;
           $financ['fin_cambio'] = $vlrcamter * -1 ;  
           $tot_vlr_apl_bio =  $this->cambioDxD['des_vlrtotal'] ;
        }
        else
        {
            $financ['fin_camtervar'] = $vlrcamter ;
            $cambio = $financ['fin_vlrbio'] - $financ['fin_pagbio'] ;
            if ($cambio < 0 )
            {
                print_r("\n Error, los saldos de BIO Negativos ");
                print_r($this->cambioDxD);
                throw new MyException('Error, los saldos de BIO Negativos ' , -1);
            }
            $financ['fin_cambio'] = $cambio <= $tot_vlr_apl_bio ? $cambio : $tot_vlr_apl_bio ;
            $tot_vlr_apl_bio -= $financ['fin_cambio']  ; 
        }
        $financ['fin_swtcamdesh'] = 't' ;
        $financ['camv_ideregistro'] = $camValor['idcambio'] ;
        $financ['fin_version'] += 1 ;
        $cantidad = $this->aplicarDxD_Model->actualizarFinanciacionDxD($financ,  $this->cambioDxD['num_version'] );
        $this->cambioDxD['financ'] =  $financ ;   
        $this->cambioDxD['des_vlrbio'] =  $financ['fin_cambio'] ;       
        $this->cambioDxD['des_vlrsdo'] =  $tot_vlr_apl_bio ;  
        $this->cambioDxD['camValor']['vlrbio'] =  $financ['fin_cambio'] ;       
        $this->cambioDxD['camValor']['vlrsdo'] =  $tot_vlr_apl_bio ;          
        if($cantidad != 1 )
        {
            print_r("\n Error al actualizar la financiacion ");
            print_r($this->cambioDxD);
            throw new MyException('Error al actualizar la financiacion ' , -1);    
        }
        $vlr_detalles =  round($camValor['vlrtercero']  , 2); 
        $vlr_fin = round($financ['fin_camtervar'] , 2) ; 
        $sdo = $vlr_detalles - $vlr_fin   ;
        $sdo =  round($sdo  , 2); 
        if ( $sdo > 0 or $sdo < 0 ) 
        {
           throw new MyException('Error en saldos de la financiacion con los detalles de los terceros' , -1);    
        }
   }
   
   /**
     * Actualza el cambio de valor, para agregar los valores actualizados en la tablas
     * y se envía al modelo para actualizar en base de datos
     */
    private function actualizarCambioValorDxD() {              
        $camValor = $this->cambioDxD['camValor'] ;
        $vlrtotal =  round($camValor['vlrtotal'] , 2); 
        $vlrbio = round($camValor['vlrbio'] , 2) ; 
        $vlrtercero = round($camValor['vlrtercero'] , 2) ; 
        $vlrsdo = round($camValor['vlrsdo'] , 2) ; 
        $vlrtercepag = round($camValor['vlrtercepag'] , 2) ; 
        $sdo_opr= $vlrtotal - ($vlrbio + $vlrtercero + $vlrsdo );
        $sdo_opr = round( $sdo_opr , 2) ; 
        if ( $sdo_opr > 0 or $sdo_opr < 0 ) 
        {
            print_r("\n vlrtotal :  " );
            print_r($vlrtotal);
            print_r("\n vlrbio:  ");
            print_r($vlrbio );
            print_r("\n vlrtercero:  " );
            print_r($vlrtercero);
            print_r("\n vlrsdo:  " );
            print_r($vlrsdo);
            print_r("\n sdo_opr:  ");
            print_r($sdo_opr);
            throw new MyException('Error en saldos del cambio de valor '  , -1);    
        }
        $sdo_opr = $vlrtotal - ($vlrtercero + $vlrtercepag ) ;
        if ( $sdo_opr < 0  )
        {
            throw new MyException('Error en saldos del cambio de valor respecto del valor pagado' , -1);    
        }     
        if ($this->cambioDxD['des_usuapl'] != null)
        {
            $camValor['vlrsdo'] = 0 ;
        } 
        $cantidad = $this->aplicarDxD_Model->actualizarCambioValorDxD($camValor);
        if($cantidad != 1 )
        {
            throw new MyException('Error al actualizar el cambio de Valor idfinanciacion ' , -1);    
        }
   }
   /**
     * Actualza los valores procesados en la tabla temporal
     * y se envía al modelo para actualizar en base de datos
     */
    private function actualizarTabTemporalDxD() { 
        $camValor = $this->cambioDxD['camValor'] ;
        $cantidad = $this->aplicarDxD_Model->actualizarTabTemporalDxD($camValor ,$this->cambioDxD['idregistro'] );
        if($cantidad != 1 )
        {
            throw new MyException('Error al actualizar los valores en la tabla temporal, el registro no fue encontrado: ' . $this->cambioDxD['idregistro'] . ' y cantidad Act: '. $cantidad, -1);    
        }
   }

}
