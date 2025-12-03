<?php

namespace Bioagricola\BioagricolaBundle\ProcesosMasivos\Procesos;

//use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Bioagricola\BioagricolaBundle\Models\CargarPagosFinancModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\MyException;

/**
 * Archivo que hará el control del proceso de cargar las pagoFinAples especiales de BIO
 * @author rsagudelo
 */
class ProcesoCargarPagosFinanc {

    private $idHilo;

    /**
     * información del registro de la Financiacion que está en la tabla temporal
     * @var array 
     */
    private $pagoFinApl;
    private $idAcceso;
    private $conexion;
    private $idEmpresa;
    private $idUsuario;
    private $idProceso;
    private $imprimeLog;
    private $genericoModel;
    private $genericoDelegado;
    private $pagosFinancModel;

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
        $this->pagosFinancModel = new CargarPagosFinancModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->imprimeLog = true;
    }
    
    //****************** Logica de Hilos  **************************// 
    
    /**
     * Registra la ejecución del proceso de cargar pagoFinApl y guarda la variable global del proceso
     */
    public function registrarProceso() {
        try {
            $this->conexion->beginTransaction();
            $proceso['estado'] = 'A';
            $proceso['fechaInicio'] = 'now()';
            $proceso['idPrograma'] = PROGRAMA_PAG_FIN_ESP_BIO;
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
        $Datos['idprograma'] = PROGRAMA_PAG_FIN_ESP_BIO;
        $Datos['idhilo'] = $ProcesoControl;
        $cantidad = $this->procesoModel->getCantidadHilosActivosPrograma($Datos);
        return $cantidad;
    }
    
     /**
     * Termina el control de ejecución del proceso
     */
    public function inactivarControlEjecucionProceso() {
        $Datos['idempresa'] = $this->idEmpresa;
        $Datos['idprograma'] = PROGRAMA_PAG_FIN_ESP_BIO;
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
     * Consulta los Pagos que se van a procesar según el estado del registro
     */
    public function consultarPagospendientes() {
        try {
            $this->escribeLog(" Consultando los pagos para procesar \n ");
            $listaPagosFinanc = $this->pagosFinancModel->getPagosProceso($this->idEmpresa, $this->idHilo);
            if (empty($listaPagosFinanc)) {
                $this->escribeLog('No hay más pagos por procesar');
                return;
            }
            return $listaPagosFinanc;
        } catch (MyException $ex) {
            $this->escribeLog($ex->getMessage());
        }
    }
    
     /**
     * Inicia el procesamiento de los pagos y va registrando en la tabla temporal
     * @param array $listaPagosFinanc - Información de los cambios de valor a procesar
     */
    public function iniciar($listaPagosFinanc, $id_Proceso) {
        foreach ($listaPagosFinanc as $registro) {
            
            $proceso['idprograma'] = PROGRAMA_PAG_FIN_ESP_BIO;
            $proceso['idempresa'] = $this->idEmpresa;
            $proceso['idhilo'] = $id_Proceso ;
            $cantidad = $this->procesoModel->getHiloActivoPrograma($proceso);
            if ($cantidad == 0 )
            {
                break ;
            }            
            try {
                $this->conexion->beginTransaction();
                $this->pagoFinApl = $registro;
                $this->procesarPagoFinanc(); 
                $datAct['id_registro'] = $this->pagoFinApl['idregistro'] ;
                $datAct['estado'] = 'A' ;
                $datAct['mensaje'] = 'Se aplico correctamente el Pago id: ' .$this->pagoFinApl['pagFinan']['id_pago'] ;
                $this->pagosFinancModel->actualizarTemporalResumen($datAct);
                $this->conexion->commit();
            } catch (MyException $e) {
                $this->conexion->rollBack();
                $datAct['id_registro'] = $this->pagoFinApl['idregistro'] ;
                $datAct['estado'] = 'F' ;
                $datAct['mensaje'] = $e->getMessage() ;
                $this->pagosFinancModel->actualizarTemporalResumen($datAct);       
            } catch (\Exception $e) {
                $this->conexion->rollBack();
                $datAct['id_registro'] = $this->pagoFinApl['idregistro'] ;
                $datAct['estado'] = 'F' ;
                $datAct['mensaje'] = $e->getMessage() ;
                $this->pagosFinancModel->actualizarTemporalResumen($datAct);
            } finally {
                $this->aumentarCantidad();
            }
        }
    }
    
     /**
     * Valida la información del pagoFinApl y registra y actualiza en la tablas necesarias 
     * @return void
     * @throws MyException
     */
    private function procesarPagoFinanc() 
    {
        /*
         * valida si el pago tiene valores para aplicar
         */
        $vlr_conceptos =  $this->pagoFinApl['pag_vlrbio'] 
                        + $this->pagoFinApl['pag_vlrterfijo']
                         + $this->pagoFinApl['pag_vlrtervar']
                         + $this->pagoFinApl['pag_vlrteraju'];
        $vlr_conceptos = round ($vlr_conceptos, 4)     ;          
          
        if ($this->pagoFinApl['pag_vlrtotal'] <= 0 and  $vlr_conceptos <= 0 )
        {
            print_r( "\n El usuario no tiene valores para aplicar... ");
            print_r( "\n valor conceptos... ");
            print_r( $vlr_conceptos);
            print_r($this->pagoFinApl);
            throw new MyException(' El usuario no tiene valores para aplicar...' , -1);
        }         
        /*
        * Valdia el Codigo de usuario y la financiación 
        */
        $this->validarUsuarioFinanciacion() ; 
        /*
         * Consulta las Amortizaciones y distribuye los valores del pago
        */
        $amortiz = $this->consultarAmortizaciones() ; 
        $sdointeres = $this->consultarSaldoInteres();  
        if (empty($sdointeres))
        {
            $sdointeres = 0 ;
        }
        $this->pagoFinApl['saldointeres']= $sdointeres;        
        if($sdointeres > 0){            
            if ($this->pagoFinApl['saldointeres'] > $this->pagoFinApl['pag_vlrtotal']){
                
                $this->pagoFinApl['saldointeres'] = $this->pagoFinApl['pag_vlrtotal'];
                $this->pagoFinApl['pag_vlrtotal'] = 0;
                        
            } else {                
               $this->pagoFinApl['pag_vlrtotal'] = $this->pagoFinApl['pag_vlrtotal'] - $this->pagoFinApl['saldointeres'];                       
            }            
        }    
        
        $this->distribuirValoresPagoFinanc();         
        /*
         * crear y Aplicar Pago
        */           
        $this->insertarPagoFinanciacion();   
        
        if ($amortiz) {
            
            $this->actualizarPagoAmortizacion($amortiz);  
            $this->insertaPagoFinanAmortizacion();  
        }         
        $this->actualizarFinancicionAbono();           
        $this->actualizacionPagosTercero();
        $this->actualizarFinancicionVersion();     
        $this->actualizarTabTemporalPag()   ;
        //$this->escribeLog("se incrementa registro en cpr y se cambia el estado de la pagoFinApl a procesado " . $this->pagoFinApl['finan']['idpagoFinApl'] . " \n");

    }
     /**
     * Valida el usuario y la financiacion para consultar si es viable 
     * aplicar el pago en las demas tablas 
     * @return void
     * @throws MyException
     */
    private function validarUsuarioFinanciacion() {
         /*
         * Valdia si el codigo de usuario tiene una financiacion. 
         */
        $datConsulta['idusuario'] = $this->pagoFinApl['mua_cod'] ;
        $datConsulta['idfin'] = $this->pagoFinApl['idfinanciacion'] ;
        $datConsulta['idempresa'] = $this->pagoFinApl['idempresa'] ;
        $usuFin = $this->pagosFinancModel->getUsuarioFinanciacion($datConsulta);
        if ($usuFin['cantidad'] < 0 ) {
            print_r($this->pagoFinApl);
            throw new MyException('El usuario no tiene finaciaciones Activas, valide si el pago se va aplicar a una sola financiacion ' , -1);
        }
        $saldo = round($usuFin['saldo']) ;
        if ($saldo <= 0 )
        {
            print_r($this->pagoFinApl);
            throw new MyException('El usuario no tiene financiaciones con saldo ' , -1);
        }
        /*
         * Valida si el pago se va aplicar a una financiacion Especifica 
         * y la consulta en la Base de Datos
         */
        if ($this->pagoFinApl['idfinanciacion'] > 0 )
        {
            $finan = $this->pagosFinancModel->getFinanciacionById($this->pagoFinApl['idfinanciacion']);
            if ($finan[0]['fin_ideregistro'] < 0  ) {
                print_r($this->pagoFinApl);
                throw new MyException('No existe la financiacion o no esta activa: ', -1);
            }
            $saldo = round($finan[0]['saldo']) ;
            if ($saldo <= 0  ) {
                print_r($this->pagoFinApl);
                throw new MyException('La financiacion no tiene Saldo..: ', -1);
            }
            if ($finan[0]['mua_cod'] != $this->pagoFinApl['mua_cod']  ) {
                 print_r($this->pagoFinApl);
                throw new MyException('La financicaion no pertenece al usuario: ', -1);
            }       
        }  
        else
        {
            $finan = $this->pagosFinancModel->getFinanciacionUsuario($this->pagoFinApl['mua_cod'],  $this->pagoFinApl['idempresa']); 
            if (count($finan) == 0 ){
                print_r($this->pagoFinApl);
                throw new MyException('No hay Financiaciones activas para el usuario usuario: ' , -1);
            }            
        }
        $this->pagoFinApl['inf_usuario'] = $usuFin ;
        $this->pagoFinApl['dat_finan'] = $finan ; 
        $this->pagoFinApl['dat_finan_am'] = $finan;
    }
    
     /**
     * Consulta la las amortizaciones del usuario o la financiacion
     * dependiendo de los datos del archivo plano
     * @return $amortiz arreglo con las amortizaciones 
     * @throws MyException
     */
    private function consultarAmortizaciones() {
        if ($this->pagoFinApl['pag_tipopago'] == 'P')
        {
            $datConsulta['idusuario'] = $this->pagoFinApl['mua_cod'] ;
            $datConsulta['idfin'] = $this->pagoFinApl['idfinanciacion'] ;
            $datConsulta['idempresa'] = $this->pagoFinApl['idempresa'] ;
            $datConsulta['idfactura'] = $this->pagoFinApl['lmf_fac'] ;
            $amortiz = $this->pagosFinancModel->getAmortizaciones($datConsulta);
            if (count($amortiz) == 1 and $amortiz[0]['fin_ideregistro'] ==-1 ) {
                print_r($this->pagoFinApl);
                throw new MyException('No hay Amortizaciones con saldo emitidas con la factura pagada: ' , -1);
            } 
            return $amortiz ;
        }
        if ($this->pagoFinApl['pag_tipopago'] == 'A')
        {
            $datConsulta['idusuario'] = $this->pagoFinApl['mua_cod'] ;
            $datConsulta['idfin'] = $this->pagoFinApl['idfinanciacion'] ;
            $datConsulta['idempresa'] = $this->pagoFinApl['idempresa'] ;
            $datConsulta['idfactura'] = -1 ;
            $amortiz = $this->pagosFinancModel->getAmortizaciones($datConsulta);
            if (count($amortiz) == 1 and $amortiz[0]['fin_ideregistro'] ==-1 ) {
                return null ;
            } 
            return $amortiz ;
        }
        return null ;
    }
    
    private function consultarSaldoInteres() {  
        $datConsulta['idusuario'] = $this->pagoFinApl['mua_cod'] ;
        $datConsulta['idfin'] = $this->pagoFinApl['idfinanciacion'] ;
        $datConsulta['idempresa'] = $this->pagoFinApl['idempresa'] ;
        $datConsulta['idfactura'] = $this->pagoFinApl['lmf_fac'] ;
        $sdointeres = $this->pagosFinancModel->getSaldoInteres($datConsulta);
        return $sdointeres ;
    }
    
     /**
     * Valida la información del pagoFinApl y distribuye los valores en los conceptos de la amortizacion
     * @return void
     * @throws MyException
     */
    private function distribuirValoresPagoFinanc() 
    {
        $usuFin = $this->pagoFinApl['inf_usuario'] ;
        $saldo_fin = round($usuFin['saldo'], 2) ;
        $vlr_total_ini =  $this->pagoFinApl['pag_vlrtotal'] ;
        //consultar saldos de las amortizaciones
        $datConsulta['idusuario'] = $this->pagoFinApl['mua_cod'] ;
        $datConsulta['idfin'] = $this->pagoFinApl['idfinanciacion'] ;
        $datConsulta['idempresa'] = $this->pagoFinApl['idempresa'] ;
        $sdo_amortiz = $this->pagosFinancModel->getSdoAmortizaciones($datConsulta);  
        $this->pagoFinApl['pag_vlrsdo'] = 0 ;
        if (count($sdo_amortiz) == 1 ) // si hay amortizaciones 
        {   
            $this->distribuirValoresmortiz($sdo_amortiz[0]) ;           
        }        
        // si no hay amortizaciones 
        else if (count($sdo_amortiz) == 0 )
        {            
            $this->distribuirValoresSinmortiz();
        }  
        else
        {
            throw new MyException('Error en la consulta de saldo de Amortizaciones '  , -1);  
        }
    } 
     /**
     * Valida la información y genera los pagos de amortizacion y abono
     * @return void
     * @throws MyException
     */
    private function distribuirValoresmortiz($sdo_amortiz) 
    {
        $usuFin = $this->pagoFinApl['inf_usuario'] ;        
        $saldo_fin = round($usuFin['saldo'], 4) ;
        $vlr_total_ini =  $this->pagoFinApl['pag_vlrtotal'] ;             
        $sdo_capital_amortiz = $sdo_amortiz['sdo_bio'] + $sdo_amortiz['sdo_ter_fij'] 
                             + $sdo_amortiz['sdo_ter_var'] + $sdo_amortiz['sdo_ter_aju'] ;
        $sdo_amortiz['saldo'] = round($sdo_capital_amortiz,7);
        $validar_sdo = $sdo_amortiz['sdo_cuota'] - $sdo_capital_amortiz - $sdo_amortiz['sdo_interes'] ;
        $validar_sdo = round($validar_sdo, 4) ;        
        $usuFin['sdo_bio'] = $usuFin['sdo_bio'] - $sdo_amortiz['sdo_bio'] ;
        $usuFin['sdo_ter_fij'] = $usuFin['sdo_ter_fij'] - $sdo_amortiz['sdo_ter_fij'] ;
        $usuFin['sdo_ter_var'] = $usuFin['sdo_ter_var'] - $sdo_amortiz['sdo_ter_var'] ;
        $usuFin['sdo_ter_aju'] = $usuFin['sdo_ter_aju'] - $sdo_amortiz['sdo_ter_aju'] ;
        $usuFin['saldo'] = $usuFin['saldo'] - $sdo_amortiz['saldo'] ; 
        
        $this->pagoFinApl['pag_fin']['pag_vlrbio'] = 0 ;
        $this->pagoFinApl['pag_fin']['pag_vlrterfijo'] = 0 ;
        $this->pagoFinApl['pag_fin']['pag_vlrtervar'] = 0 ; 
        $this->pagoFinApl['pag_fin']['pag_vlrteraju'] = 0 ;          
        $this->pagoFinApl['pag_amortiz']['pag_vlrbio'] = 0 ;
        $this->pagoFinApl['pag_amortiz']['pag_vlrterfijo'] = 0 ;
        $this->pagoFinApl['pag_amortiz']['pag_vlrtervar'] = 0 ; 
        $this->pagoFinApl['pag_amortiz']['pag_vlrteraju'] = 0 ;   
        $this->pagoFinApl['pag_vlrsdo']  = 0 ;
        
        if ($validar_sdo > 0 or $validar_sdo < 0 )
        {                 
               print_r("\n Error en los saldos de las amortizaciones .. \n " );
               print_r($validar_sdo);
               print_r("\n ");
               print_r($this->pagoFinApl);
               throw new MyException(' Error en los saldos de las amortizaciones '  , -1);   
        }
        if($vlr_total_ini >= $sdo_capital_amortiz)
        {
            $this->pagoFinApl['pag_amortiz']['pag_vlrbio'] = $sdo_amortiz['sdo_bio'] ;
            $this->pagoFinApl['pag_amortiz']['pag_vlrterfijo']  = $sdo_amortiz['sdo_ter_fij'] ;
            $this->pagoFinApl['pag_amortiz']['pag_vlrtervar']  = $sdo_amortiz['sdo_ter_var'] ;
            $this->pagoFinApl['pag_amortiz']['pag_vlrteraju']  = $sdo_amortiz['sdo_ter_aju'] ;
            $this->pagoFinApl['pag_amortiz']['vlr_interes']  = $sdo_amortiz['sdo_interes'] ;
            $this->pagoFinApl['pag_amortiz']['vlr_total']  = $sdo_amortiz['sdo_cuota'] ;

            $vlr_total_ini = 
                    round (($vlr_total_ini - $sdo_amortiz['saldo'] ), 4);            
           
            if($vlr_total_ini > 0 )
            {              
                $saldo_fin = round($usuFin['saldo'], 4) ;
                if ( $saldo_fin < 0 )
                {
                    print_r("\n Error el Saldo de la Financiacion es negativo ... ") ;
                    print_r($saldo_fin) ;
                    Throw new MyException( 'Error el Saldo de la Financiacion es negativo'  , -1);   
                }
                if ($vlr_total_ini >= $saldo_fin )
                {                  
                    $this->pagoFinApl['pag_fin']['pag_vlrbio'] = $usuFin['sdo_bio'] ;
                    $this->pagoFinApl['pag_fin']['pag_vlrterfijo'] = $usuFin['sdo_ter_fij'] ;
                    $this->pagoFinApl['pag_fin']['pag_vlrtervar'] = $usuFin['sdo_ter_var']  ;
                    $this->pagoFinApl['pag_fin']['pag_vlrteraju'] = $usuFin['sdo_ter_aju'] ;

                    $Val_total = $this->pagoFinApl['pag_fin']['pag_vlrbio']  
                                + $this->pagoFinApl['pag_fin']['pag_vlrterfijo'] 
                                + $this->pagoFinApl['pag_fin']['pag_vlrtervar'] 
                                + $this->pagoFinApl['pag_fin']['pag_vlrteraju'] ;  
                    $this->pagoFinApl['pag_vlrsdo']  = $vlr_total_ini - $Val_total ;
                }
                else{ 
                    $Val_total = $vlr_total_ini ;
                    $Val_total_apl = $vlr_total_ini ;
                    $vlr_apli = $Val_total_apl * ((ceil(($usuFin['sdo_ter_aju']/$usuFin['saldo']) * 100))/100);
                    $valor = (round($vlr_apli)<1 )? 1 :round($vlr_apli);
                    $valor = ($valor>$Val_total)?$Val_total:$valor;
                    $this->pagoFinApl['pag_fin']['pag_vlrteraju'] = ($valor <= $usuFin['sdo_ter_aju'])? $valor : $usuFin['sdo_ter_aju'] ;
                    $Val_total -= $this->pagoFinApl['pag_fin']['pag_vlrteraju'] ;
                    $vlr_apli = $Val_total_apl * ((ceil(($usuFin['sdo_ter_fij']/$usuFin['saldo']) * 100))/100);
                    $valor = (round($vlr_apli)<1 )? 1 :round($vlr_apli);
                    $valor = ($valor>$Val_total)?$Val_total:$valor;
                    $this->pagoFinApl['pag_fin']['pag_vlrterfijo'] = ($valor <= $usuFin['sdo_ter_fij'])? $valor : $usuFin['sdo_ter_fij'] ;
                    $Val_total -= $this->pagoFinApl['pag_fin']['pag_vlrterfijo'] ;
                    $vlr_apli = $Val_total_apl *((ceil (($usuFin['sdo_ter_var']/$usuFin['saldo']) * 100))/100);
                    $valor = (round($vlr_apli)<1 )? 1 :round($vlr_apli);
                    $valor = ($valor>$Val_total)?$Val_total:$valor;
                    $this->pagoFinApl['pag_fin']['pag_vlrtervar'] = ($valor <= $usuFin['sdo_ter_var'])? $valor : $usuFin['sdo_ter_var'] ;
                    $Val_total -= $this->pagoFinApl['pag_fin']['pag_vlrtervar'] ;
                    $this->pagoFinApl['pag_fin']['pag_vlrbio'] = ($Val_total <= $usuFin['sdo_bio'])? $Val_total : $usuFin['sdo_bio'] ; ;
                    $Val_total -= $this->pagoFinApl['pag_fin']['pag_vlrbio'] ;
                    $this->pagoFinApl['pag_fin']['pag_vlrsdo'] = 0 ;
                    $this->pagoFinApl['pag_vlrsdo']  = 0 ;
                    if(round($Val_total) > 0 or round($Val_total) < 0 )
                    {                   
                        print_r("\n valor total : " );
                        print_r($Val_total);
                        print_r("\n ");
                        print_r($this->pagoFinApl);
                        throw new MyException('Error  al distribuir los valores a Aplicar en la financiación'  , -1);   
                    }
                }  
            }
        }
        else if($vlr_total_ini > 0) // si el valor no supera los valores amortizados
        { 
            $Val_total = $this->pagoFinApl['pag_vlrtotal'] ;
            $Val_total_apl = $this->pagoFinApl['pag_vlrtotal'] ;
            $vlr_apli = $Val_total_apl * ((ceil(($sdo_amortiz['sdo_ter_aju']/$sdo_amortiz['saldo']) * 100))/100);
            $valor = (round($vlr_apli)<1 )? 1 :round($vlr_apli);
            $valor = ($valor>$Val_total)?$Val_total:$valor;
            $this->pagoFinApl['pag_amortiz']['pag_vlrteraju'] = ($valor <= $sdo_amortiz['sdo_ter_aju'])? $valor : $sdo_amortiz['sdo_ter_aju'] ;
            $Val_total -= $this->pagoFinApl['pag_amortiz']['pag_vlrteraju'] ;
            $vlr_apli = $Val_total_apl * ((ceil(($sdo_amortiz['sdo_ter_fij']/$sdo_amortiz['saldo']) * 100))/100);
            $valor = (round($vlr_apli)<1 )? 1 :round($vlr_apli);
            $valor = ($valor>$Val_total)?$Val_total:$valor;
            $this->pagoFinApl['pag_amortiz']['pag_vlrterfijo'] = ($valor <= $sdo_amortiz['sdo_ter_fij'])? $valor : $sdo_amortiz['sdo_ter_fij'] ;
            $Val_total -= $this->pagoFinApl['pag_amortiz']['pag_vlrterfijo'] ;
            $vlr_apli = $Val_total_apl *((ceil (($sdo_amortiz['sdo_ter_var']/$sdo_amortiz['saldo']) * 100))/100);
            $valor = (round($vlr_apli)<1 )? 1 :round($vlr_apli);
            $valor = ($valor>$Val_total)?$Val_total:$valor;
            $this->pagoFinApl['pag_amortiz']['pag_vlrtervar'] = ($valor <= $sdo_amortiz['sdo_ter_var'])? $valor : $sdo_amortiz['sdo_ter_var'] ;
            $Val_total -= $this->pagoFinApl['pag_amortiz']['pag_vlrtervar'] ;
            $this->pagoFinApl['pag_amortiz']['pag_vlrbio'] = ($Val_total <= $sdo_amortiz['sdo_bio'])? $Val_total : $sdo_amortiz['sdo_bio'] ; ;
            $Val_total -= $this->pagoFinApl['pag_amortiz']['pag_vlrbio'] ;
            $this->pagoFinApl['pag_amortiz']['pag_vlrsdo'] = 0 ;

            $this->pagoFinApl['pag_fin']['pag_vlrbio'] = 0 ;
            $this->pagoFinApl['pag_fin']['pag_vlrterfijo'] = 0 ;
            $this->pagoFinApl['pag_fin']['pag_vlrtervar'] = 0 ; 
            $this->pagoFinApl['pag_fin']['pag_vlrteraju'] = 0 ; 
            $this->pagoFinApl['pag_vlrsdo'] = 0 ; 

            if(round($Val_total, 4) < 0 or  round($Val_total, 4) > 0 )
            {                   
                print_r("\n valor total : " );
                print_r($Val_total);
                print_r("\n ");
                print_r($this->pagoFinApl);
                throw new MyException('Error  al distribuir los valores a Aplicar para la amortizacion'  , -1);   
            }
        }
        else // si es un pago parcial 
        {            
            $vlr_total_ini = $this->pagoFinApl['pag_vlrbio'] + $this->pagoFinApl['pag_vlrterfijo'] + 
                                    $this->pagoFinApl['pag_vlrtervar'] + $this->pagoFinApl['pag_vlrteraju'] ;
            $vlr_total_ini = round( $vlr_total_ini , 4 ) ;            
            if ($vlr_total_ini > 0 ) 
            {
                $this->pagoFinApl['pag_vlrtotal'] = $vlr_total_ini ; 
                //amortizaciones             
                $Val_total = 0 ;            
                $valor = $this->pagoFinApl['pag_vlrbio'] ;
                $this->pagoFinApl['pag_amortiz']['pag_vlrbio'] = ($valor <= $sdo_amortiz['sdo_bio'])? $valor : $sdo_amortiz['sdo_bio'] ;
                $Val_total += $this->pagoFinApl['pag_amortiz']['pag_vlrbio'] ;
                $this->pagoFinApl['pag_vlrbio'] -= $this->pagoFinApl['pag_amortiz']['pag_vlrbio'] ;
                $valor = $this->pagoFinApl['pag_vlrterfijo'] ;
                $this->pagoFinApl['pag_amortiz']['pag_vlrterfijo'] = ($valor <= $sdo_amortiz['sdo_ter_fij'])? $valor : $sdo_amortiz['sdo_ter_fij'] ;
                $Val_total += $this->pagoFinApl['pag_amortiz']['pag_vlrterfijo'] ;
                $this->pagoFinApl['pag_vlrterfijo'] -= $this->pagoFinApl['pag_amortiz']['pag_vlrterfijo'] ;
                $valor = $this->pagoFinApl['pag_vlrtervar'] ;
                $this->pagoFinApl['pag_amortiz']['pag_vlrtervar'] = ($valor <= $sdo_amortiz['sdo_ter_var'])? $valor : $sdo_amortiz['sdo_ter_var'] ;
                $Val_total += $this->pagoFinApl['pag_amortiz']['pag_vlrtervar'] ;
                $this->pagoFinApl['pag_vlrtervar'] -= $this->pagoFinApl['pag_amortiz']['pag_vlrtervar'] ;
                $valor = $this->pagoFinApl['pag_vlrteraju'] ;
                $this->pagoFinApl['pag_amortiz']['pag_vlrteraju'] = ($valor <= $sdo_amortiz['sdo_ter_aju'])? $valor : $sdo_amortiz['sdo_ter_aju'] ;          
                $Val_total += $this->pagoFinApl['pag_amortiz']['pag_vlrteraju'] ;
                $this->pagoFinApl['pag_vlrteraju'] -= $this->pagoFinApl['pag_amortiz']['pag_vlrteraju'] ;
                $vlr_total_ini = $vlr_total_ini - $Val_total ; 
                if ($vlr_total_ini > 0 )
                {   
                    $Val_total = 0 ;            
                    $valor = $this->pagoFinApl['pag_vlrbio'] ;
                    $this->pagoFinApl['pag_fin']['pag_vlrbio'] = ($valor <= $usuFin['sdo_bio'])? $valor : $usuFin['sdo_bio'] ;
                    $Val_total += $this->pagoFinApl['pag_fin']['pag_vlrbio'] ;
                    $valor = $this->pagoFinApl['pag_vlrterfijo'] ;
                    $this->pagoFinApl['pag_fin']['pag_vlrterfijo'] = ($valor <= $usuFin['sdo_ter_fij'])? $valor : $usuFin['sdo_ter_fij'] ;
                    $Val_total += $this->pagoFinApl['pag_fin']['pag_vlrterfijo'] ;
                    $valor = $this->pagoFinApl['pag_vlrtervar'] ;
                    $this->pagoFinApl['pag_fin']['pag_vlrtervar'] = ($valor <= $usuFin['sdo_ter_var'])? $valor : $usuFin['sdo_ter_var'] ;
                    $Val_total += $this->pagoFinApl['pag_fin']['pag_vlrtervar'] ;
                    $valor = $this->pagoFinApl['pag_vlrteraju'] ;
                    $this->pagoFinApl['pag_fin']['pag_vlrteraju'] = ($valor <= $usuFin['sdo_ter_aju'])? $valor : $usuFin['sdo_ter_aju'] ;          
                    $Val_total += $this->pagoFinApl['pag_fin']['pag_vlrteraju'] ;
                    $this->pagoFinApl['pag_vlrsdo']  = $vlr_total_ini - $Val_total ;
                }
            } else if($this->pagoFinApl['saldointeres'] == 0 ){
                throw new MyException('No hay valores para actualizar o los valores son muy pequeños, no se procesara el registro ', -1);
            }
        }             
        $this->pagoFinApl['pag_vlrbio'] = $this->pagoFinApl['pag_fin']['pag_vlrbio'] 
                                        + $this->pagoFinApl['pag_amortiz']['pag_vlrbio'] ;
        $this->pagoFinApl['pag_vlrterfijo'] =  $this->pagoFinApl['pag_fin']['pag_vlrterfijo'] 
                                            +  $this->pagoFinApl['pag_amortiz']['pag_vlrterfijo'];
        $this->pagoFinApl['pag_vlrtervar'] =  $this->pagoFinApl['pag_fin']['pag_vlrtervar'] 
                                            + $this->pagoFinApl['pag_amortiz']['pag_vlrtervar'] ;
        $this->pagoFinApl['pag_vlrteraju'] = $this->pagoFinApl['pag_fin']['pag_vlrteraju'] 
                                            + $this->pagoFinApl['pag_amortiz']['pag_vlrteraju'] ;                
    } 
    
     /**
     * Valida la información y genera los pagos sin amortizacion
     * @return void
     * @throws MyException
     */
    private function distribuirValoresSinmortiz() 
    {  
        $usuFin = $this->pagoFinApl['inf_usuario'] ;
        $saldo_fin = round($usuFin['saldo'], 2) ;
        $vlr_total_ini =  $this->pagoFinApl['pag_vlrtotal'] ; 
        if ( $this->pagoFinApl['pag_vlrtotal'] > 0 )
         {
             if ( $this->pagoFinApl['pag_vlrtotal'] >= $saldo_fin )
             {                      
                 $this->pagoFinApl['pag_fin']['pag_vlrbio'] = $usuFin['sdo_bio'] ;
                 $this->pagoFinApl['pag_fin']['pag_vlrterfijo'] = $usuFin['sdo_ter_fij'] ;
                 $this->pagoFinApl['pag_fin']['pag_vlrtervar'] = $usuFin['sdo_ter_var'] ;
                 $this->pagoFinApl['pag_fin']['pag_vlrteraju'] = $usuFin['sdo_ter_aju'] ;                   

                 $this->pagoFinApl['pag_vlrbio'] = $usuFin['sdo_bio'] ;
                 $this->pagoFinApl['pag_vlrterfijo'] = $usuFin['sdo_ter_fij'] ;
                 $this->pagoFinApl['pag_vlrtervar'] = $usuFin['sdo_ter_var'] ;
                 $this->pagoFinApl['pag_vlrteraju'] = $usuFin['sdo_ter_aju'] ;
                 $Val_total = $usuFin['sdo_bio']  + $usuFin['sdo_ter_fij'] +$usuFin['sdo_ter_var'] + $usuFin['sdo_ter_aju']  ;
                 $this->pagoFinApl['pag_vlrsdo']  = $this->pagoFinApl['pag_vlrtotal'] - $Val_total ;
             }
             else{
                 $Val_total = $this->pagoFinApl['pag_vlrtotal'] ;
                 $Val_total_apl = $this->pagoFinApl['pag_vlrtotal'] ;
                 $vlr_apli = $Val_total_apl * ((ceil(($usuFin['sdo_ter_aju']/$usuFin['saldo']) * 100))/100);
                 $valor = (round($vlr_apli)<1 )? 1 :round($vlr_apli);
                 $valor = ($valor>$Val_total)?$Val_total:$valor;
                 $this->pagoFinApl['pag_vlrteraju'] = ($valor <= $usuFin['sdo_ter_aju'])? $valor : $usuFin['sdo_ter_aju'] ;
                 $Val_total -= $this->pagoFinApl['pag_vlrteraju'] ;
                 $vlr_apli = $Val_total_apl * ((ceil(($usuFin['sdo_ter_fij']/$usuFin['saldo']) * 100))/100);
                 $valor = (round($vlr_apli)<1 )? 1 :round($vlr_apli);
                 $valor = ($valor>$Val_total)?$Val_total:$valor;
                 $this->pagoFinApl['pag_vlrterfijo'] = ($valor <= $usuFin['sdo_ter_fij'])? $valor : $usuFin['sdo_ter_fij'] ;
                 $Val_total -= $this->pagoFinApl['pag_vlrterfijo'] ;
                 $vlr_apli = $Val_total_apl *((ceil (($usuFin['sdo_ter_var']/$usuFin['saldo']) * 100))/100);
                 $valor = (round($vlr_apli)<1 )? 1 :round($vlr_apli);
                 $valor = ($valor>$Val_total)?$Val_total:$valor;
                 $this->pagoFinApl['pag_vlrtervar'] = ($valor <= $usuFin['sdo_ter_var'])? $valor : $usuFin['sdo_ter_var'] ;
                 $Val_total -= $this->pagoFinApl['pag_vlrtervar'] ;
                 $this->pagoFinApl['pag_vlrbio'] = ($Val_total <= $usuFin['sdo_bio'])? $Val_total : $usuFin['sdo_bio'] ; ;
                 $Val_total -= $this->pagoFinApl['pag_vlrbio'] ;
                 $this->pagoFinApl['pag_vlrsdo'] = 0 ;                       
                 if(round($Val_total) > 0 or round($Val_total) < 0 )
                 {                   
                     print_r("\n valor total : " );
                     print_r($Val_total);
                     print_r("\n ");
                     print_r($this->pagoFinApl);
                     throw new MyException('Error  al distribuir los valores a Aplicar '  , -1);   
                 }
             }
         }
         else{            
             $this->pagoFinApl['pag_vlrtotal'] = $this->pagoFinApl['pag_vlrbio'] + $this->pagoFinApl['pag_vlrterfijo'] + 
                                     $this->pagoFinApl['pag_vlrtervar'] + $this->pagoFinApl['pag_vlrteraju'] ;
             $valor = round($this->pagoFinApl['pag_vlrtotal'] , 4 ) ;
             if ($valor > 0 ) 
             {
                 $Val_total = 0 ;            
                 $valor = $this->pagoFinApl['pag_vlrbio'] ;
                 $this->pagoFinApl['pag_vlrbio'] = ($valor <= $usuFin['sdo_bio'])? $valor : $usuFin['sdo_bio'] ;
                 $Val_total += $this->pagoFinApl['pag_vlrbio'] ;
                 $valor = $this->pagoFinApl['pag_vlrterfijo'] ;
                 $this->pagoFinApl['pag_vlrterfijo'] = ($valor <= $usuFin['sdo_ter_fij'])? $valor : $usuFin['sdo_ter_fij'] ;
                 $Val_total += $this->pagoFinApl['pag_vlrterfijo'] ;
                 $valor = $this->pagoFinApl['pag_vlrtervar'] ;
                 $this->pagoFinApl['pag_vlrtervar'] = ($valor <= $usuFin['sdo_ter_var'])? $valor : $usuFin['sdo_ter_var'] ;
                 $Val_total += $this->pagoFinApl['pag_vlrtervar'] ;
                 $valor = $this->pagoFinApl['pag_vlrteraju'] ;
                 $this->pagoFinApl['pag_vlrteraju'] = ($valor <= $usuFin['sdo_ter_aju'])? $valor : $usuFin['sdo_ter_aju'] ;          
                 $Val_total += $this->pagoFinApl['pag_vlrteraju'] ;
                 $this->pagoFinApl['pag_vlrsdo']  = $this->pagoFinApl['pag_vlrtotal'] - $Val_total ;

             } else if($this->pagoFinApl['saldointeres'] == 0 ){
                 throw new MyException('No hay valores para actualizar o los valores son muy pequeños, no se procesara el registro ', -1);
             }
         }            
         $this->pagoFinApl['pag_fin']['pag_vlrbio'] = $this->pagoFinApl['pag_vlrbio'];
         $this->pagoFinApl['pag_fin']['pag_vlrterfijo'] = $this->pagoFinApl['pag_vlrterfijo'] ;
         $this->pagoFinApl['pag_fin']['pag_vlrtervar'] = $this->pagoFinApl['pag_vlrtervar']  ;
         $this->pagoFinApl['pag_fin']['pag_vlrteraju'] = $this->pagoFinApl['pag_vlrteraju'] ;            
         $this->pagoFinApl['pag_amortiz']['pag_vlrbio'] = 0 ;
         $this->pagoFinApl['pag_amortiz']['pag_vlrterfijo'] = 0 ;
         $this->pagoFinApl['pag_amortiz']['pag_vlrtervar'] = 0 ;
         $this->pagoFinApl['pag_amortiz']['pag_vlrteraju'] = 0 ;         
    } 
    
    /**
    * Construye objeto del pago y envía para que sea registrado en base de datos
    */
    private function insertarPagoFinanciacion() {	            
        if ($this->idEmpresa != $this->pagoFinApl['idempresa']) {
            print_r("\n Empresa Sesion : ");
            print_r($this->idEmpresa);
            throw new MyException('La empresa en Sesion no es igual a la empresa del pago a aplicar' . $this->pagoFinApl['idempresa'] , -1);
        }  
        $this->pagoFinApl['pag_vlrsdo'] = round( $this->pagoFinApl['pag_vlrsdo'], 4);
        if ($this->pagoFinApl['pag_vlrsdo'] < 0 ) {
            print_r("\n Error el pago tiene saldos negativos : ");
            print_r($this->pagoFinApl);
            throw new MyException('Error el pago tiene saldos negativos ' , -1);
        }                
        $pagFinan['codigo'] = $this->pagoFinApl['mua_cod'];
        $pagFinan['factura'] = $this->pagoFinApl['lmf_fac'];
        $pagFinan['finan'] = $this->pagoFinApl['idfinanciacion'];
        $pagFinan['mesaho'] = $this->pagoFinApl['pag_mesaho'];
        $pagFinan['vlrtotal'] = $this->pagoFinApl['pag_vlrtotal'] + $this->pagoFinApl['saldointeres'];
        $pagFinan['vlrbio'] = $this->pagoFinApl['pag_vlrbio'];
        $pagFinan['vlrterfijo'] = $this->pagoFinApl['pag_vlrterfijo'];
        $pagFinan['vlrtervar'] = $this->pagoFinApl['pag_vlrtervar'];
        $pagFinan['vlrteraju'] = $this->pagoFinApl['pag_vlrteraju'];
        $pagFinan['vlrsdo'] = $this->pagoFinApl['pag_vlrsdo'];
        $pagFinan['tipopago'] = $this->pagoFinApl['pag_tipopago'];
        $pagFinan['idempresa'] = $this->pagoFinApl['idempresa'];
        $pagFinan['idusuario'] = $this->idUsuario;
        $pagFinan['sdointeres'] = $this->pagoFinApl['saldointeres'];
        $this->pagosFinancModel->insertarPagoFinanc($pagFinan);
        $this->pagoFinApl['pagFinan'] = $pagFinan ;
    }
    
     /**
     * Actualza la amortizacion con los valoes de los pagos
     * y se envía al modelo para actualizar en base de datos
     */
    private function actualizarPagoAmortizacion($amortizaciones_finan) {                 
        $amortizaciones = array();
        $pagFinan = $this->pagoFinApl['pagFinan'] ;
        $tot_vlr_bio = $this->pagoFinApl['pag_amortiz']['pag_vlrbio'] ; 
        $tot_vlr_fijo = $this->pagoFinApl['pag_amortiz']['pag_vlrterfijo'] ;  
        $tot_vlr_var = $this->pagoFinApl['pag_amortiz']['pag_vlrtervar'] ; 
        $tot_vlr_aju = $this->pagoFinApl['pag_amortiz']['pag_vlrteraju'] ;  
        $tot_vlr_interes = $this->pagoFinApl['saldointeres'];
        
        $total_pag_amortiz = $tot_vlr_bio + $tot_vlr_fijo +  
                                $tot_vlr_var + $tot_vlr_aju + $tot_vlr_interes ;
        $total_pag_amortiz = round($total_pag_amortiz, 4 ) ;
        if (count($amortizaciones_finan) == 0 )
        {
            if( $total_pag_amortiz > 0 )
            {
                print_r("\n Error hay valor de pago de amortizacion, pero no hay amortizaciones \n total pago amortiz : ");
                print_r($total_pag_amortiz);
                throw new MyException('Error hay valor de pago de amortizacion, pero no hay amortizaciones' , -1);
            }
            print_r("\n No hay Amortizaciones para procesar, no se han generado cuotas o ya todas las cuotas estan pagas:");
        }
        else
        {
            foreach ($amortizaciones_finan as $amortiz_fin)
            {
                $sdo_pago_apl = round (($tot_vlr_bio+$tot_vlr_fijo+$tot_vlr_var+$tot_vlr_aju+$tot_vlr_interes), 4 );
                if ( $sdo_pago_apl <= 0 ) 
                    Break ;
                if($amortiz_fin['am_sdocuota'] <= 0 )
                {
                    continue ;
                }
                try { 
                    $valor = 0 ; 
                    $pagAmortiz['idamortiz'] = $amortiz_fin['am_ideregistro'];
                    $pagAmortiz['idpago'] = $pagFinan['id_pago'];
                    $vlr_apli = $amortiz_fin['am_vlrbio'] - $amortiz_fin['am_cambio'] 
                                - $amortiz_fin['am_pagbio'] ; 
                    $pagAmortiz['vlrbio'] = ($tot_vlr_bio<= $vlr_apli )? $tot_vlr_bio : $vlr_apli;
                    $valor +=  $pagAmortiz['vlrbio'] ;
                    $tot_vlr_bio -=  $pagAmortiz['vlrbio'] ;                    
                    $vlr_apli = $amortiz_fin['am_vlrterfij'] - $amortiz_fin['am_pagterfij'] ;
                    $pagAmortiz['vlrterfij'] = ($tot_vlr_fijo <= $vlr_apli )? $tot_vlr_fijo : $vlr_apli;
                    $valor +=  $pagAmortiz['vlrterfij'] ;
                    $tot_vlr_fijo -=  $pagAmortiz['vlrterfij'] ;                            
                    $vlr_apli = $amortiz_fin['am_vlrtervar'] - $amortiz_fin['am_camtervar'] 
                                - $amortiz_fin['am_pagtervar'] ;
                    $pagAmortiz['vlrtervar'] = ($tot_vlr_var <= $vlr_apli )? $tot_vlr_var : $vlr_apli;
                    $valor +=  $pagAmortiz['vlrtervar'] ;
                    $tot_vlr_var -=  $pagAmortiz['vlrtervar'] ;                    
                    $vlr_apli = $amortiz_fin['am_vlrteraju'] - $amortiz_fin['am_pagteraju'] ;
                    $pagAmortiz['vlrteraju'] = ($tot_vlr_aju <= $vlr_apli )? $tot_vlr_aju : $vlr_apli;
                    $valor +=  $pagAmortiz['vlrteraju'] ;
                    $tot_vlr_aju -=  $pagAmortiz['vlrteraju'] ;
                    
                    $vlr_apli = $amortiz_fin['am_vlrinteres'] - $amortiz_fin['am_paginteres']; 
                    $pagAmortiz['vlrinteres'] = ($tot_vlr_interes<= $vlr_apli )? $tot_vlr_interes : $vlr_apli;
                    $valor +=  $pagAmortiz['vlrinteres'] ;
                    $tot_vlr_interes -=  $pagAmortiz['vlrinteres'] ; 
                    
                    $pagAmortiz['vlrtotal'] = $valor ;
                    $this->pagosFinancModel->insertarPagoAmortiz($pagAmortiz);
                    $amortiz_fin['pago_Amortiz'] = $pagAmortiz ;
                    //print_r($pag_Amortiz);                    
                    $amortizacion = $this->actualizaAmortizPago($amortiz_fin);
                    $amortizaciones[] = $amortizacion ;                
                } catch (\Exception $e) {
                    print_r($this->pagoFinApl); 
                    throw new MyException('Error  al Actualizar una amortizacion financiacion: ' . $e->getMessage() , -1);
                    Break ;
                }            
            }            
            $this->pagoFinApl['amortizPag'] = $amortizaciones; 
            $sdo_pago_Amortiz = $tot_vlr_bio + $tot_vlr_fijo + $tot_vlr_var 
                                + $tot_vlr_aju + $tot_vlr_interes ;
            if(round($sdo_pago_Amortiz,7) > 0){
                print_r("\n Error en la aplicación del pago a las amortizaciones. : ");
                print_r($sdo_pago_Amortiz);
                print_r("\n ");
                print_r($this->pagoFinApl);                
                throw new MyException('Error en la aplicación del pago a las amortizaciones.', -1);
            }
        }
    }
   
    /**
     * Actualza la amortizacion con los valores del pago
     * y se envía al modelo para actualizar en base de datos
     */
    private function actualizaAmortizPago($amortiz_pag) 
    {     
        $pagoAmortiz = $amortiz_pag['pago_Amortiz'];        
        $amortizacion_fin['am_ideregistro'] = $amortiz_pag['am_ideregistro'] ;
        $amortizacion_fin['am_pagbio'] = $amortiz_pag['am_pagbio'] + $pagoAmortiz['vlrbio']  ; 
        $amortizacion_fin['am_pagterfij'] = $amortiz_pag['am_pagterfij'] + $pagoAmortiz['vlrterfij']  ; 
        $amortizacion_fin['am_pagtervar'] = $amortiz_pag['am_pagtervar'] + $pagoAmortiz['vlrtervar']  ; 
        $amortizacion_fin['am_pagteraju'] = $amortiz_pag['am_pagteraju'] + $pagoAmortiz['vlrteraju']  ; 
        $amortizacion_fin['am_sdocuota'] = $amortiz_pag['am_sdocuota'] - $pagoAmortiz['vlrtotal']  ;
        $amortizacion_fin['am_paginteres'] = $amortiz_pag['am_paginteres'] + $pagoAmortiz['vlrinteres']  ;
        $cantidad = $this->pagosFinancModel->actualizarAmortizacionFinan($amortizacion_fin);
        if($cantidad != 1 )
        {
            print_r(" \n Error en la cantidad de registros actualizados de la amortizacion ");
            print_r($this->pagoFinApl);
            throw new MyException('Error en la cantidad de registros actualizados de la amortizacion: ' . $amortizacion_fin['am_ideregistro'] . ' y cantidad Act: '. $cantidad, -1);    
        }
        $amortiz_pag['amortizAct'] = $amortizacion_fin ;
        return $amortiz_pag ;                        
   }
   
    /**
     * crea un pago para cada financiacion por el total de las 
     * Amortizaciones y se envía al modelo para actualizar en base de datos
     */
    private function insertaPagoFinanAmortizacion() {
        //Crea pagos para las financiaciones desde las amortizaciones 
        $finans =  $this->pagoFinApl['dat_finan'];
        $pagFinan = $this->pagoFinApl['pagFinan'] ;
        $financiaciones = array();
        foreach ($finans as $inf_fin)
        {
            if ($inf_fin['saldo'] <= 0)
            {
                $financiaciones[]= $inf_fin ;
                continue ;
            }
            try 
            {
                $pagosAmortiz =  $this->pagosFinancModel->getPagosAmortizFinan( $pagFinan['id_pago'] ,$inf_fin['fin_ideregistro'] );
                if (count($pagosAmortiz) == 0) {
                    $financiaciones[]= $inf_fin ;
                    continue  ; 
                }
                $pag_amortiza_fin = $pagosAmortiz[0];             
                $pagfinanc_am['id_finan'] = $pag_amortiza_fin['fin_ideregistro'];
                $pagfinanc_am['id_pago'] = $pag_amortiza_fin['pag_ideregistro'];
                $pagfinanc_am['vlrtotal'] = $pag_amortiza_fin['vlrtotal'];
                $pagfinanc_am['vlrbio'] = $pag_amortiza_fin['vlrbio'];
                $pagfinanc_am['vlrterfijo'] = $pag_amortiza_fin['vlrterfijo'];
                $pagfinanc_am['vlrtervar'] = $pag_amortiza_fin['vlrtervar'];
                $pagfinanc_am['vlrteraju'] = $pag_amortiza_fin['vlrteraju'];
                $pagfinanc_am['vlrinteres'] = $pag_amortiza_fin['vlrinteres'];
                $pagfinanc_am['tippago'] = 'AM'; 
                $this->pagosFinancModel->insertarPagoFinan($pagfinanc_am);
                $inf_fin['pag_am'] = $pagfinanc_am ;
                $financiacion = $this->actualizaFinanPagoAm($inf_fin);                
                $financiaciones[] = $financiacion ;                
            } catch (\Exception $e) {
                print_r(" \n Error  al Actualizar Insertar un pago AM a una financiacion " );
                print_r($e->getMessage() );
                print_r(" \n ");
                print_r($this->pagoFinApl);
                throw new MyException('Error  al Actualizar Insertar un pago AM a una financiacion ' . $e->getMessage() , -1);
                Break ;
            }            
        }
        $this->pagoFinApl['dat_finan_am'] = $financiaciones ;
    }
    
    /**
     * Actualza los saldos de la financicion con los valores del pago
     * y se envía al modelo para actualizar en base de datos
     */
    private function actualizaFinanPagoAm($finan_pag) {       
        $pagoFinan = $finan_pag['pag_am'];  
        $fin_act['fin_ideregistro'] = $finan_pag['fin_ideregistro'] ;
        $fin_act['fin_pagbio'] = $finan_pag['fin_pagbio'] + $pagoFinan['vlrbio']  ; 
        $fin_act['fin_pagterfijo'] = $finan_pag['fin_pagterfijo'] + $pagoFinan['vlrterfijo']  ; 
        $fin_act['fin_pagtervar'] = $finan_pag['fin_pagtervar'] + $pagoFinan['vlrtervar']  ; 
        $fin_act['fin_pagajutervar'] = $finan_pag['fin_pagajutervar'] + $pagoFinan['vlrteraju']  ; 
        $cantidad = $this->pagosFinancModel->actualizarFinanciacion($fin_act ,$finan_pag['fin_version'] );
        if($cantidad != 1 )
        {
            throw new MyException('Error en la cantidad de registros actualizados de la financiacion: ' .$finan_pag['fin_ideregistro']  . ' y fin_version : '. $finan_pag['fin_version'] , -1);    
        }        
        $finan_pag['fin_pagbio'] = $fin_act['fin_pagbio'] ; 
        $finan_pag['fin_pagterfijo'] = $fin_act['fin_pagterfijo'] ; 
        $finan_pag['fin_pagtervar'] = $fin_act['fin_pagtervar'] ; 
        $finan_pag['fin_pagajutervar'] = $fin_act['fin_pagajutervar'] ; 
        $finan_pag['saldo'] =  $finan_pag['saldo'] - 
                               (  $pagoFinan['vlrbio']  + $pagoFinan['vlrterfijo'] 
                                + $pagoFinan['vlrtervar']   + $pagoFinan['vlrteraju'] );  
        return $finan_pag ;                        
   }
   
    /**
    * Actualza la financiacion con los valores del pago
    * y se envía al modelo para actualizar en base de datos
    */
    private function actualizarFinancicionAbono() {    
        $finans =  $this->pagoFinApl['dat_finan_am']  ;
        $pagFinan = $this->pagoFinApl['pagFinan'] ;
        $financiaciones = array();
        $tot_vlr_bio = $this->pagoFinApl['pag_fin']['pag_vlrbio'] ; 
        $tot_vlr_fijo = $this->pagoFinApl['pag_fin']['pag_vlrterfijo'] ;  
        $tot_vlr_var = $this->pagoFinApl['pag_fin']['pag_vlrtervar'] ; 
        $tot_vlr_aju = $this->pagoFinApl['pag_fin']['pag_vlrteraju'] ;
        
        foreach ($finans as $inf_fin)
        {  
            if ( ($tot_vlr_bio+$tot_vlr_fijo+$tot_vlr_var+$tot_vlr_aju) == 0 ) 
            {
                  $financiaciones[]= $inf_fin ;
                  continue ; 
            }
            $financ = $this->pagosFinancModel->getFinanciacionById($inf_fin['fin_ideregistro']);
                
            if ($financ[0]['fin_ideregistro'] == -1 )
            {
                print_r(" la Financiacion no fue encontrada o ya no esta activa : " + $inf_fin['fin_ideregistro'] + " \n");
                print_r($this->pagoFinApl);
                throw new MyException('la Financiacion no fue encontrada o ya no esta activa ' , -1);
            }
            if ($financ[0]['fin_version'] != $inf_fin['fin_version'] )
            {
                print_r("Hay otro proceso que actualizo la financiacion, pago no se aplicara.. " + $inf_fin['fin_ideregistro'] + "\n"  , -1);
                print_r($this->pagoFinApl);
                throw new MyException('Hay otro proceso que actualizo la financiacion, pago no se aplicara.. ' , -1);
            } 
            if($inf_fin['saldo'] <= 0 )
            {
                $financiaciones[]= $inf_fin ;
                continue ;
            }
            try {
                
                $valor = 0 ; 
                $pagfinancAb['id_finan'] = $inf_fin['fin_ideregistro'];
                $pagfinancAb['id_pago'] = $pagFinan['id_pago'];
                $vlr_apli = $inf_fin['fin_vlrbio'] - $inf_fin['fin_cambio'] 
                             - $inf_fin['fin_pagbio'] ; 
                $pagfinancAb['vlrbio'] = ($tot_vlr_bio<= $vlr_apli )? $tot_vlr_bio : $vlr_apli;  
                $valor +=  $pagfinancAb['vlrbio'] ;
                $tot_vlr_bio -=  $pagfinancAb['vlrbio'] ; 
                $vlr_apli = $inf_fin['fin_vlraprfijo'] + $inf_fin ['fin_vlrviatfijo'] 
                            - $inf_fin['fin_pagterfijo'] ;
                $pagfinancAb['vlrterfijo'] = ($tot_vlr_fijo <= $vlr_apli )? $tot_vlr_fijo : $vlr_apli;
                $valor +=  $pagfinancAb['vlrterfijo'] ;
                $tot_vlr_fijo -=  $pagfinancAb['vlrterfijo'] ;      
                $vlr_apli = $inf_fin['fin_vlraprvar']  + $inf_fin['fin_vlrviatvar'] 
                          - $inf_fin['fin_camtervar'] - $inf_fin['fin_pagtervar'] ;
                $pagfinancAb['vlrtervar'] = ($tot_vlr_var <= $vlr_apli )? $tot_vlr_var : $vlr_apli;
                $valor +=  $pagfinancAb['vlrtervar'] ;
                $tot_vlr_var -=  $pagfinancAb['vlrtervar'] ;
                $vlr_apli = $inf_fin['fin_vlrajuaprvar'] - $inf_fin['fin_pagajutervar'] ;
                $pagfinancAb['vlrteraju'] = ($tot_vlr_aju <= $vlr_apli )? $tot_vlr_aju : $vlr_apli;
                $valor +=  $pagfinancAb['vlrteraju'] ;
                $tot_vlr_aju -=  $pagfinancAb['vlrteraju'] ;
                $pagfinancAb['vlrtotal'] = $valor ;
                $pagfinancAb['tippago'] = 'AB' ;    
                $this->pagosFinancModel->insertarPagoFinanAb($pagfinancAb);
                $inf_fin['pag_ab'] = $pagfinancAb ;
                $financiacion = $this->actualizaFinanPagoAb($inf_fin);  
                $financiaciones[] = $financiacion ;                 
            } catch (\Exception $e) {
                print_r( "Error  al Actualizar una amortizacion financiacion: \n" +  $inf_fin['fin_ideregistro'] );
                print_r($e->getMessage());
                print_r($this->pagoFinApl);
                throw new MyException('Error  al Actualizar una amortizacion financiacion: ' . $inf_fin['fin_ideregistro'] . ' - ' . $e->getMessage() , -1);
                Break ;
            }            
        }
        $this->pagoFinApl['dat_finan'] = $financiaciones ;
        $this->pagoFinApl['sdo_vlrbio'] = $tot_vlr_bio; 
        $this->pagoFinApl['sdo_vlrterfijo'] = $tot_vlr_fijo ;  
        $this->pagoFinApl['sdo_vlrtervar'] = $tot_vlr_var ; 
        $this->pagoFinApl['sdo_vlrteraju'] = $tot_vlr_aju ;  
        $sdo_pago_finan = $tot_vlr_bio + $tot_vlr_fijo + $tot_vlr_var 
                            + $tot_vlr_aju  ;
        $sdo_pago_finan = round($sdo_pago_finan, 4) ; 
        if( $sdo_pago_finan > 0 or $sdo_pago_finan < 0){
            print_r("\n Error en la aplicación de pagos de abono a las financiaciones ");
            print_r($sdo_pago_finan);
            print_r("\n ");
            print_r($this->pagoFinApl);                
            throw new MyException('Error en la aplicación de pagos de abono a las financiaciones ', -1);
        }  
    }
      
    /**
     * Actualza los saldos de la financicion con los valores del pago de Abono Directo
     * y se envía al modelo para actualizar en base de datos
     */
    private function actualizaFinanPagoAb($finan_pag) {        
        $pagoFinanAB = $finan_pag['pag_ab'];        
        $fin_act['fin_ideregistro'] = $finan_pag['fin_ideregistro'] ;
        $fin_act['fin_pagbio'] = $finan_pag['fin_pagbio'] + $pagoFinanAB['vlrbio']  ; 
        $fin_act['fin_pagterfijo'] = $finan_pag['fin_pagterfijo'] + $pagoFinanAB['vlrterfijo']  ; 
        $fin_act['fin_pagtervar'] = $finan_pag['fin_pagtervar'] + $pagoFinanAB['vlrtervar']  ; 
        $fin_act['fin_pagajutervar'] = $finan_pag['fin_pagajutervar'] + $pagoFinanAB['vlrteraju']  ; 
        $cantidad = $this->pagosFinancModel->actualizarFinanciacion($fin_act ,$finan_pag['fin_version'] );
        if($cantidad != 1 )
        {
            print_r($this->pagoFinApl);
            throw new MyException('Error en la cantidad de registros actualizados de la financiacion: ' .$finan_pag['fin_ideregistro']  . ' y fin_version : '. $finan_pag['fin_version'] , -1);    
        }        
        $finan_pag['fin_pagbio'] = $fin_act['fin_pagbio'] ; 
        $finan_pag['fin_pagterfijo'] = $fin_act['fin_pagterfijo'] ; 
        $finan_pag['fin_pagtervar'] = $fin_act['fin_pagtervar'] ; 
        $finan_pag['fin_pagajutervar'] = $fin_act['fin_pagajutervar'] ; 
        $finan_pag['saldo'] =  $finan_pag['saldo'] - $finan_pag['fin_pagbio'] - $finan_pag['fin_pagterfijo'] -
                                 $finan_pag['fin_pagtervar'] - $finan_pag['fin_pagajutervar']; 
        return $finan_pag ;                        
    }    
    
    /**
     * crea un pago para cada detalle para cada tercero, donde la financiacion 
     * haya recibido un pago y se envía al modelo para actualizar en base de datos
     */    
    private function actualizacionPagosTercero()
    {
        $finans = $this->pagoFinApl['dat_finan']  ;
        $pagFinan = $this->pagoFinApl['pagFinan'] ;
        $detTerFinanciaciones = array();
        $financiaciones = array();
        foreach ($finans as $inf_fin)
        {            
            try 
            {
                $pagosFinanci =  $this->pagosFinancModel->getPagosFinan( $pagFinan['id_pago'] ,$inf_fin['fin_ideregistro'] );
                if (count($pagosFinanci) == 0) {
                    $financiaciones[]= $inf_fin ;
                    continue; 
                }
                $pagoFinanci = $pagosFinanci[0]; 
                if (round($pagoFinanci['vlrterfijo'], 4) == 0 and round($pagoFinanci['vlrtervar'],4) == 0 
                     and round($pagoFinanci['vlrteraju'],4) == 0) 
                {
                    print_r($this->pagoFinApl);
                    print_r("\n No hay pagos para los terceros... :");
                    $financiaciones[]= $inf_fin ;
                    continue; 
                }                
                $detalles_apr_finan = $this->pagosFinancModel->getDetAprFinanciacion($inf_fin['fin_ideregistro'] );              
                if (count($detalles_apr_finan) == 0 )
                { 
                    print_r('Error no hay detalles de terceros para procesar, validar saldos terceros fin_ideregistro: \n ' .$finan['fin_ideregistro'] .'\n');
                    print_r($this->pagoFinApl);
                    throw new MyException('Error no hay detalles de terceros para procesar, validar saldos terceros fin_ideregistro ' , -1);
                }                
                $vlrterfijo = $pagoFinanci['vlrterfijo'] ;
                $vlrtervar = $pagoFinanci['vlrtervar'] ;
                $vlrteraju = $pagoFinanci['vlrteraju'] ;
                $sdoterfijo = $pagoFinanci['vlrterfijo'] ;
                $sdotervar = $pagoFinanci['vlrtervar'] ;
                $sdoteraju = $pagoFinanci['vlrteraju'] ;  
                
                $vlr_tot_fijo = $inf_fin['fin_vlraprfijo'] + $inf_fin['fin_vlrviatfijo']
                              - $inf_fin['fin_pagterfijo'] + $pagoFinanci['vlrterfijo'] ; ;
                $vlr_tot_var = $inf_fin['fin_vlraprvar'] + $inf_fin['fin_vlrviatvar']
                              - $inf_fin['fin_pagtervar'] - $inf_fin['fin_camtervar']
                              + $pagoFinanci['vlrtervar'] ;;
                $vlr_tot_aju = $inf_fin['fin_vlrajuaprvar'] - $inf_fin['fin_pagajutervar']
                             + $pagoFinanci['vlrteraju'] ;  
                $contador = 0 ;     
                foreach ($detalles_apr_finan as $detalle_ter) 
                {                 
                    if($vlrterfijo == 0 and $vlrtervar == 0 and $vlrteraju == 0 )
                    {
                        break ;
                    }                    
                    $can_det_pag = $this->pagosFinancModel->getCant_RegPagDetAprFinan($detalle_ter['afin_ideregistro'], $pagFinan['id_pago'] ); 
                    
                    if ($can_det_pag > 0 )
                    {
                        $sdoterfijo = 0 ;
                        $sdotervar = 0  ;
                        $sdoteraju = 0  ;    
                        break ;
                    }
                    $contador ++ ;
                    $pagdetfinanc['id_afinan'] = $detalle_ter['afin_ideregistro'];
                    $pagdetfinanc['id_pago'] = $pagFinan['id_pago'];
                    $pagdetfinanc['sdoinifijo'] = $detalle_ter['afin_sdovlrfijo'] ;
                    $pagdetfinanc['sdoinivariable'] = $detalle_ter['afin_sdovlrvariable'] ;
                    $pagdetfinanc['sdoiniajuste'] = $detalle_ter['afin_sdovlrajustes'] ;   
                    $pagdetfinanc['vlrfijo'] = $this->procesatDetFinanCon($detalle_ter['afin_sdovlrfijo'] , $detalle_ter['afin_sdovlrfijo'], $vlr_tot_fijo, $vlrterfijo , $sdoterfijo ) ;
                    $pagdetfinanc['vlrvariable'] = $this->procesatDetFinanCon($detalle_ter['afin_sdovlrvariable'] , $detalle_ter['afin_sdovlrvariable'], $vlr_tot_var, $vlrtervar, $sdotervar )  ;
                    $pagdetfinanc['vlrajuste'] = $this->procesatDetFinanCon($detalle_ter['afin_sdovlrajustes'] , $detalle_ter['afin_sdovlrajustes'], $vlr_tot_aju, $vlrteraju, $sdoteraju ) ;

                    $sdoterfijo -= $pagdetfinanc['vlrfijo'] ;
                    $sdotervar -= $pagdetfinanc['vlrvariable'] ;
                    $sdoteraju -= $pagdetfinanc['vlrajuste'] ;             

                    $this->pagosFinancModel->insertarPagoDetFinan($pagdetfinanc);
                    $detalle_ter['pago'] = $pagdetfinanc ;
                    $detalle_ter['det_act'] = $this->actualizaDetFinanPago($detalle_ter) ;                        
                    $det_terceros[] = $detalle_ter ;                  
                }
                $inf_fin['det_terce'] = $det_terceros ;
                $sdoterfijo = round ($sdoterfijo, 4);
                $sdotervar = round ($sdotervar, 4);
                $sdoteraju = round ($sdoteraju, 4);           
                if ($sdoterfijo > 0 OR $sdotervar > 0 or $sdoteraju> 0 )
                {                 
                    print_r("\n\n\n despues de terceros ... :") ;              
                    print_r("\n fijo ... :". $sdoterfijo) ;
                    print_r("\n variable ... :". $sdotervar) ;
                    print_r("\n ajuste ... :". $sdoteraju) ;
                    print_r("\n Terminando de Ingresar terceros ... :");
                    print_r($inf_fin); 
                    throw new MyException('Error en los saldos aplicados de terceros, hay mayor valor en la finan: ' , -1);     
                }
                if ($sdoterfijo < 0 OR $sdotervar < 0 or $sdoteraju < 0  )
                {                                   
                    print_r("\n\n\n despues de terceros ... :") ;              
                    print_r("\n fijo ... :". $sdoterfijo) ;
                    print_r("\n variable ... :". $sdotervar) ;
                    print_r("\n ajuste ... :". $sdoteraju) ;
                    print_r("\n Terminando de Ingresar terceros ... :");
                    print_r($inf_fin); 
                    throw new MyException('Error en los saldos aplicados de terceros, se aplico mayor valor en los detalles en la finan: ' , -1);                         
            
                }
            } catch (\Exception $e) {
                throw new MyException('Error  al Actualizar el detalle de una financiacion: ' . $pagFinan['factura'] . ' - ' . $e->getMessage() , -1);
                Break ;
            }    
            $financiaciones[]= $inf_fin ;
        }
        
        $this->pagoFinApl['dat_finan'] = $financiaciones;
    }
    
    
    /**
     * valida el concepto enviado y retorna le valor a cargar
     * @param $sdo_concepto - Id de la empresa actual
     * @param $vlrtot_fin_det - valor total financiado del concepto para el detalle
     * @param $vlr_tot_con - valor total financiado del concepto 
     * @param $vlrtotapl - valor maximo a aplicar para el concepto
     * return $vlr_apl_con - valor a plicar para el concepto
     */
    private function procesatDetFinanCon($sdo_concep , $vlrtot_fin_det, $vlr_tot_con, $vlrapl , $vlrtotapl ) 
    {
        $vlr_apl_con = 0 ;
        if( $sdo_concep > 0 and $vlrtotapl > 0 )
        {
            if( $vlr_tot_con == 0 and $vlrtot_fin_det > 0 )
            {
                  print_r("\n vlr_tot_con : "); 
                  print_r($vlr_tot_con); 
                  print_r("\n vlrtot_fin_det"); 
                  print_r($vlrtot_fin_det); 
                throw new MyException('Error en los valores financiados y los detalles ' , -1);
            }  
            if( $vlr_tot_con == 0 )
            {
                return 0 ;
            }  
            $Val_total = $vlrtotapl ;
            $vlr_apli = $vlrapl * ((ceil(($vlrtot_fin_det/$vlr_tot_con) * 100))/100);
            $valor = (round($vlr_apli, 7 ) <= 0 )? 0.0001 : round($vlr_apli, 7 );
            $valor = ($valor>$Val_total)?$Val_total:$valor;
            $vlr_apl_con = ($valor <= $sdo_concep)? $valor : $sdo_concep  ;
        } 
        return $vlr_apl_con ;                        
    }
    
     /**
     * Actualza los saldos del detalle de la financicion con los valores del pago 
     * y se envía al modelo para actualizar en base de datos
     * @param $det_finan_pag - informacion con el detalle a actualizar
     */
    private function actualizaDetFinanPago ($det_finan_pag) {       
        $pagoDetFinan = $det_finan_pag['pago'];        
        $det_fin_act['afin_ideregistro'] = $det_finan_pag['afin_ideregistro'] ;
        $det_fin_act['afin_pagvlrfijo'] = $det_finan_pag['afin_pagvlrfijo'] + $pagoDetFinan['vlrfijo']  ; 
        $det_fin_act['afin_pagvlrvariable'] = $det_finan_pag['afin_pagvlrvariable'] + $pagoDetFinan['vlrvariable']  ; 
        $det_fin_act['afin_pagvlrajustes'] = $det_finan_pag['afin_pagvlrajustes'] + $pagoDetFinan['vlrajuste']  ; 
        $det_fin_act['afin_sdovlrfijo'] = $det_finan_pag['afin_sdovlrfijo'] - $pagoDetFinan['vlrfijo']  ; 
        $det_fin_act['afin_sdovlrvariable'] = $det_finan_pag['afin_sdovlrvariable'] - $pagoDetFinan['vlrvariable']  ; 
        $det_fin_act['afin_sdovlrajustes'] = $det_finan_pag['afin_sdovlrajustes'] - $pagoDetFinan['vlrajuste']  ; 
        $sdo_fijo = round($det_fin_act['afin_sdovlrfijo'], 7) ;
        $sdo_vari = round($det_fin_act['afin_sdovlrvariable'], 7) ;
        $sdo_ajus = round($det_fin_act['afin_sdovlrajustes'], 7) ;
        if ($sdo_fijo < 0 OR $sdo_vari < 0 OR $sdo_ajus < 0  )
        {
            print_r($this->pagoFinApl);
            print_r(" \n\n Registro actual...");
            print_r($det_finan_pag);            
            print_r(" \n\n Registro a subir...");
            print_r($det_fin_act);
            throw new MyException('Error en la actualizacion del detalle saldos negativos: ' .$det_finan_pag['afin_ideregistro']  , -1);    
        }
        $cantidad = $this->pagosFinancModel->actualizarDetTercFinanciacion($det_fin_act);
        if($cantidad != 1 )
        {
            print_r($this->pagoFinApl);
            throw new MyException('Error en la cantidad de registros actualizados del detalle: ' .$det_finan_pag['afin_ideregistro'] , -1);    
        }        
        return $det_fin_act ;                        
    }
    
    /**
    * Recorre las financiaciones y actualiza la version
    * y se envía al modelo para actualizar en base de datos
    */
    private function actualizarFinancicionVersion() {
        $finans = $this->pagoFinApl['dat_finan']  ;
        foreach ($finans as $inf_fin)
        {  
           $sdo_bio = $inf_fin['fin_vlrbio'] - $inf_fin['fin_cambio'] - $inf_fin['fin_pagbio'] ;
           $sdo_fijo= $inf_fin['fin_vlraprfijo'] + $inf_fin['fin_vlrviatfijo'] - $inf_fin['fin_pagterfijo'] ;
           $sdo_vari= $inf_fin['fin_vlraprvar'] + $inf_fin['fin_vlrviatvar'] - $inf_fin['fin_camtervar']
                        - $inf_fin['fin_pagtervar'] ;
           $sdo_ajuste= $inf_fin['fin_vlrajuaprvar'] - $inf_fin['fin_pagajutervar'] ;
           $sdo_total =   $inf_fin['fin_vlrtotal']  - $inf_fin['fin_cambio'] - $inf_fin['fin_pagbio']
                        - $inf_fin['fin_pagterfijo'] - $inf_fin['fin_camtervar'] - $inf_fin['fin_pagtervar'] 
                        - $inf_fin['fin_pagajutervar'] ;          
           
           $saldo = $sdo_bio + $sdo_fijo + $sdo_vari + $sdo_ajuste - $sdo_total ;
           $sdo_bio = round($sdo_bio, 4 );
           $sdo_fijo = round($sdo_fijo, 4 );
           $sdo_vari = round($sdo_vari, 4 );
           $sdo_ajuste = round($sdo_ajuste, 4 ) ;
           $sdo_total = round($sdo_total, 4 ) ;
           $saldo = round($saldo , 2 ) ;
           if ($saldo <> 0)
            {   
                print_r("\n Error en los saldos de la financiacion : " . $inf_fin['fin_ideregistro'] );
                print_r("\n Saldo.. " );
                print_r($saldo);                
                throw new MyException('Error en los saldos de la financiacion ', -1);
            }
            if ($sdo_bio < 0 or $sdo_fijo < 0 or $sdo_vari < 0 or $sdo_ajuste  < 0 or $sdo_total < 0)
            {
                print_r("\n saldo bio : ");
                print_r($sdo_bio);
                print_r("\n saldo fijo : ");
                print_r($sdo_fijo);
                print_r("\n saldo variable : ");
                print_r($sdo_vari);
                print_r("\n saldo ajuste : ");
                print_r($sdo_ajuste);
                print_r("\n saldo total : ");
                print_r($sdo_total);
                throw new MyException('La Financiacion quedo con saldos negativos ' , -1);
            }
            $fin_act['fin_ideregistro'] = $inf_fin['fin_ideregistro'] ;
            $fin_act['fin_version'] = $inf_fin['fin_version'] + 1 ;         
            $cantidad = $this->pagosFinancModel->actualizarFinanciacion($fin_act , $inf_fin['fin_version'] );
            if($cantidad != 1 )
            {                   
                throw new MyException('Error Actualziando Version de la financiacion: ' .$inf_fin['fin_ideregistro']  . ' y fin_version : '. $inf_fin['fin_version'] , -1);    
            }                        
        }       
    }
    
     /**
     * Actualza los valores procesados en la tabla temporal
     * y se envía al modelo para actualizar en base de datos
     */
    private function actualizarTabTemporalPag() {         
        $pagFinan = $this->pagoFinApl['pagFinan'] ;
        $cantidad = $this->pagosFinancModel->actualizarTabTemporalPag($pagFinan ,$this->pagoFinApl['idregistro'] );
        if($cantidad != 1 )
        {
            print_r("\n Actualizar Tabla Temporal :");
            print_r($this->pagoFinApl); 
            throw new MyException('Error al actualizar los valores en la tabla temporal, el registro no fue encontrado: ' . $this->pagoFinApl['idregistro'] . ' y cantidad Act: '. $cantidad, -1);    
        }
   }
}
