<?php

namespace Bioagricola\BioagricolaBundle\ProcesosMasivos\Procesos;

//use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Bioagricola\BioagricolaBundle\Models\CargarProcentajesAprModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\MyException;

/**
 * Archivo que hará el control del proceso de cargar las PorAprFinAples especiales de BIO
 * @author rsagudelo
 */
class ProcesoCargarProcentajesApr {

    private $idHilo;

    /**
     * información del registro de la Financiacion que está en la tabla temporal
     * @var array 
     */
    private $PorAprFinApl;
    private $idAcceso;
    private $conexion;
    private $idEmpresa;
    private $idUsuario;
    private $idProceso;
    private $imprimeLog;
    private $genericoModel;
    private $genericoDelegado;
    private $cargarPorAprModel;

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
        $this->cargarPorAprModel = new CargarProcentajesAprModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->imprimeLog = true;
    }
    
    //****************** Logica de Hilos  **************************// 
    
    /**
     * Registra la ejecución del proceso de cargar PorAprFinApl y guarda la variable global del proceso
     */
    public function registrarProceso() {
        try {
            $this->conexion->beginTransaction();
            $proceso['estado'] = 'A';
            $proceso['fechaInicio'] = 'now()';
            $proceso['idPrograma'] = PROGRAMA_APR_FIN_ESP_BIO;
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
        $Datos['idprograma'] = PROGRAMA_APR_FIN_ESP_BIO;
        $Datos['idhilo'] = $ProcesoControl;
        $cantidad = $this->procesoModel->getCantidadHilosActivosPrograma($Datos);
        return $cantidad;
    }
    
     /**
     * Termina el control de ejecución del proceso
     */
    public function inactivarControlEjecucionProceso() {
        $Datos['idempresa'] = $this->idEmpresa;
        $Datos['idprograma'] = PROGRAMA_APR_FIN_ESP_BIO;
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
    public function consultarRegistrospendientes() {
        try {
            $this->escribeLog(" Consultando los registros de Porcentaje para procesar \n ");
            $listaResgistroProc = $this->cargarPorAprModel->getRegistrosProcesar($this->idEmpresa, $this->idHilo);
            if (empty($listaResgistroProc)) {
                $this->escribeLog('No hay más Registros por procesar');
                return;
            }
            return $listaResgistroProc;
        } catch (MyException $ex) {
            $this->escribeLog($ex->getMessage());
        }
    }
    
     /**
     * Inicia el procesamiento de los procentajes  y va registrando en la tabla temporal
     * @param array $listaResgistroProc - Información de los Registros de Aprovechamiento procesar
     */
    public function iniciar($listaResgistroProc) {
        $fijo = 0 ;
        $variable = 0 ;
        $ajuste = 0 ;
        $viat = 0 ;
        try {
            $this->conexion->beginTransaction();
            foreach ($listaResgistroProc as $registro) {               
                $this->PorAprFinApl = $registro;
                print_r(" Informacion inicial del Registro.. ");
                print_r($this->PorAprFinApl);  
                $fijo += $registro['por_fijo'] ;
                $variable += $registro['por_var'] ;
                $ajuste += $registro['por_ajus'] ;
                $viat += $registro['por_viat'] ;
                $this->procesarProAprFinanc(); 
            }
            $fijo = round($fijo, 2) ;
            $variable = round($variable, 2) ;
            $viat = round($viat, 2) ;
            $ajuste = round($ajuste, 2) ;
            if ( $fijo != 1 or $variable != 1 or $viat != 1) 
            {
                print_r("\n Error en los procentajes : \n");
                print_r($this->PorAprFinApl); 
                print_r("\n Fijo: $fijo \n"); 
                print_r("\n variable : $variable \n"); 
                print_r("\n Viat : $viat \n"); 
                print_r("\n Ajuste: $ajuste\n");  
                throw new MyException('Error en la distribución de Porcentajes Fijo: ' . $fijo .' Variable: '.$variable. ' Ajuste: '.$ajuste .' Viat: '. $viat, -1);        
            }            
            if ( $ajuste != 0 and $ajuste != 1  )
            {
                print_r("\n Error en el procentaje de ajuste : \n");
                print_r($this->PorAprFinApl); 
                throw new MyException('Error en la distribución de Porcentaje Ajuste: '.$ajuste , -1);        
            }            
            $datAct['id_registro'] = $this->PorAprFinApl['idregistro'] ;
            $datAct['estado'] = 'A' ;
            $datAct['empresa'] = $this->PorAprFinApl['idempresa']  ;
            $datAct['mensaje'] = 'Se guardo correctamente el ultimo procentaje id: ' .$this->PorAprFinApl['porAprFinan']['idporapr'] ;  
            $this->cargarPorAprModel->actualizarTemporalResumen($datAct);
            $this->conexion->commit();
        } catch (MyException $e) {
            $this->conexion->rollBack();
            $datAct['id_registro'] = $this->PorAprFinApl['idregistro'] ;
            $datAct['estado'] = 'F' ;
            $datAct['empresa'] = $this->PorAprFinApl['idempresa']  ;
            $datAct['mensaje'] = $e->getMessage() ;
            $this->cargarPorAprModel->actualizarTemporalResumen($datAct);       
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            $datAct['id_registro'] = $this->PorAprFinApl['idregistro'] ;
            $datAct['estado'] = 'F' ;
            $datAct['empresa'] = $this->PorAprFinApl['idempresa']  ;
            $datAct['mensaje'] = $e->getMessage() ;
            $this->cargarPorAprModel->actualizarTemporalResumen($datAct);
        } finally {
            $this->aumentarCantidad();
        }       
    }
    
     /**
     * Valida la información del registro cargado y lo inserta en las tablas necesarias 
     * @return void
     * @throws MyException
     */
    private function procesarProAprFinanc() {
        /*
        * Valdia si el porcentaaje del tercero ya esta creado para el mes
        */
       $procApr = $this->cargarPorAprModel->validarRegistro($this->PorAprFinApl);        
       if ($procApr > 0 )
       {
           print_r($this->PorAprFinApl);
           throw new MyException('El tercero ya esta creado para el mes: '.$this->PorAprFinApl['ter_doc']  , -1);
       }        
        $this->insertarPorAprFinanciacion();
        $this->escribeLog(" Registro procesado correctamente...\n");
         print_r( $this->PorAprFinApl['porAprFinan']);
    }
    
     /**
     * Actualza los valores procesados en la tabla temporal
     * y se envía al modelo para actualizar en base de datos
     */
    private function actualizarTabTemporalPag() {         
        $pagFinan = $this->PorAprFinApl['pagFinan'] ;
        $cantidad = $this->cargarPorAprModel->actualizarTabTemporalPag($pagFinan ,$this->PorAprFinApl['idregistro'] );
        if($cantidad != 1 )
        {
            print_r("\n Actualizar Tabla Temporal :");
            print_r($this->PorAprFinApl); 
            throw new MyException('Error al actualizar los valores en la tabla temporal, el registro no fue encontrado: ' . $this->PorAprFinApl['idregistro'] . ' y cantidad Act: '. $cantidad, -1);    
        }
   }
   
    /**
    * Construye objeto del procentaje de aprovechamiento y envía para que sea registrado en base de datos
    */
    private function insertarPorAprFinanciacion() {	       
        print_r("\n realizando proceso de ingresar registro  :");        
        if ($this->idEmpresa != $this->PorAprFinApl['idempresa']) {
            print_r("\n Empresa Sesion : ");
            print_r($this->idEmpresa);
            throw new MyException('La empresa en Sesion no es igual a la empresa dl pago a aplicar' . $this->PorAprFinApl['idempresa'] , -1);
        }
        $porAprFinan['idtercero'] = $this->PorAprFinApl['ter_ideregistro'];
        $porAprFinan['mesaho'] = $this->PorAprFinApl['por_mesaho'];
        $porAprFinan['fijo'] = $this->PorAprFinApl['por_fijo'];
        $porAprFinan['variable'] = $this->PorAprFinApl['por_var'];
        $porAprFinan['ajuste'] = $this->PorAprFinApl['por_ajus'];
        $porAprFinan['viat'] = $this->PorAprFinApl['por_viat'];
        $porAprFinan['idempresa'] = $this->PorAprFinApl['idempresa'];
        $porAprFinan['idusuario'] = $this->idUsuario;
        $this->cargarPorAprModel->insertarPorAprFinanciacion($porAprFinan);
        $this->PorAprFinApl['porAprFinan'] = $porAprFinan ;
    }
}
