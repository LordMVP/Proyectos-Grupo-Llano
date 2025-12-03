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
class ProcesoCargarActFinan {

    private $idHilo;

    /**
     * información del registro de la Financiacion que está en la tabla temporal
     * @var array 
     */
    private $obj_actfinan;
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
     * Registra la ejecución del proceso de Actualizar financiacion y guarda la variable global del proceso
     */
    public function registrarProceso() {
        try {
            $this->conexion->beginTransaction();
            $proceso['estado'] = 'A';
            $proceso['fechaInicio'] = 'now()';
            $proceso['idPrograma'] = PROGRAMA_ACT_FIN_ESP_BIO;
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
     * Consulta los registros de actualizacion de financiaciones que se van a procesar según el estado del registro
     */

    public function consultarActFinanPendientes() {
        try {
            $this->escribeLog(" consultando los registros de actualizacion para procesar \n ");
            $listaRegProcesar = $this->cargarFinanModel->getActFinanPorProceso($this->idEmpresa, $this->idHilo );
            if (empty($listaRegProcesar)) {
                $this->escribeLog('No hay más registros de actualizacion  de financiacion por procesar');
                return;
            }
            return $listaRegProcesar;
        } catch (MyException $ex) {
            $this->escribeLog($ex->getMessage());
        }
    }

    /**
     * Inicia el procesamiento de los registros de actualizacion de financiacion y va registrando en la tabla temporal
     * @param array $listaRegActFinan - Información de las financiacicones a procesar
     */
    public function iniciar($listaRegActFinan) {
        foreach ($listaRegActFinan as $registro) {
            try {
                $this->conexion->beginTransaction();
                $this->obj_actfinan = $registro;
                print_r(" Informacion del registro de actualizacion de Financiacion inicial ");
                print_r($this->obj_actfinan);  
                $this->procesarActFinanciacion(); 
                $datAct['id_registro'] = $this->obj_actfinan['idregistro'] ;
                $datAct['estado'] = 'A' ;
                $datAct['mensaje'] = 'Se Actualizo correctamente la financicion con el id: ' .$this->obj_actfinan['finan']['fin_ideregistro'] ;
                $this->cargarFinanModel->actualizarTemporalActResumen($datAct);
                $this->conexion->commit();
            } catch (MyException $e) {
                $this->conexion->rollBack();
                $datAct['id_registro'] = $this->obj_actfinan['idregistro'] ;
                $datAct['estado'] = 'F' ;
                $datAct['mensaje'] = $e->getMessage() ;
                $this->cargarFinanModel->actualizarTemporalActResumen($datAct);       
            } catch (\Exception $e) {
                $this->conexion->rollBack();
                $datAct['id_registro'] = $this->obj_actfinan['idregistro'] ;
                $datAct['estado'] = 'F' ;
                $datAct['mensaje'] = $e->getMessage() ;
                $this->cargarFinanModel->actualizarTemporalActResumen($datAct);
            } finally {
                $this->aumentarCantidad();
            }
        }
    }
    
     /**
     * Valida la información del registro de actualizacion de la financiacion y actualiza en las tabla necesarias
     * @return void
     * @throws MyException
     */
    private function procesarActFinanciacion() {
         /*
         * Valdia si la financiacion ya esta actualizada con los datos del registro . 
         */
        $finan = $this->cargarFinanModel->validarRegistroAct($this->obj_actfinan);
        if ( $finan['fin_ideregistro'] > 0 ) {
            throw new MyException('La financiacion ya esta Actualizada a los parametros enviados..'  , -1);
        }       
        /*
         * Actualizar la financiacion, creando un nuevo detalle y cambiando el estado del anterior
        */   
        $this->ConsultarFinanciacionAct();
        $this->actualizarDetalleFinanciacion();
        $this->escribeLog("se incrementa registro en cpr y se cambia el estado de la financiacion a procesado " . $this->obj_actfinan['finan']['fin_ideregistro'] . " \n");

    }
    
    /**
     * Consulta la financiacion a actualiza con los parametros enviados
     */
    private function ConsultarFinanciacionAct() {	
        print_r("\n Consultando Financiacion :");
        print_r($this->obj_actfinan);
        print_r("\n Empresa Sesion : ");
        print_r($this->idEmpresa);
        if ($this->idEmpresa != $this->obj_actfinan['idempresa']) {
            throw new MyException('La empresa en Sesion no es igual a la empresa del registro de Actualizacion ' . $this->obj_actfinan['lmf_fac'] .' - ' . $this->obj_actfinan['mua_cod'], -1);
        }
        $finan = $this->cargarFinanModel->consultarFinanAct($this->obj_actfinan); 
        if ($finan['fin_ideregistro'] == -1 ) {
            throw new MyException('No fue posible encontrar una financiacion con los parametros dados..'  , -1);
        }
        elseif ($finan['fin_ideregistro'] == -2 ) {
            throw new MyException('Error Hay mas de un registro para el mismo mes y usuario No se actualizara..' . $this->obj_actfinan['lmf_fac'] .' - ' . $this->obj_actfinan['mua_cod'], -1);
        }  
        $this->obj_actfinan['finan'] = $finan ;
    }
    
    /**
     * Valida si es necesario actualizar el detalle y si es asi crea un detalle nuevo
     * y cambia el estado al actual  
     * y se envía al modelo para la inserción en base de datos
     */
    private function actualizarDetalleFinanciacion() {
        print_r("\n Valida Actualiza Detalle :");
        print_r($this->obj_actfinan);                
        $fin_act = $this->obj_actfinan['finan'];  
        $contador = 0 ; 
        if ($this->obj_actfinan['fin_est'] =='f')
        {
            $datos_act['usuario'] = $this->idUsuario ;
            $datos_act['id_detalle'] = $fin_act['dfin_ideregistro'] ;
            $this->cargarFinanModel->actualizarDetalleFinan($datos_act);
       
           $fn_act['fin_ideregistro'] = $fin_act['fin_ideregistro'] ;
           $fn_act['fin_estado'] = "f" ;    
           $cantidad = $this->cargarFinanModel->actualizarFinanciacion($fn_act ,$fin_act['fin_version'] );
           if($cantidad != 1 )
           {
               print_r($this->pagoFinApl);
               throw new MyException('Error en la cantidad de registros actualizados de la financiacion: '  , -1);    
           }                               
        } 
        else
        {
            if (strlen($this->obj_actfinan['mua_empresa'])>= 3 and $this->obj_actfinan['mua_empresa'] != $fin_act['mua_empresa'])
            {
                $detalle['empresa']= $this->obj_actfinan['mua_empresa'] ;
                $contador ++ ;
            }
            else {
                $detalle['empresa'] = $fin_act['mua_empresa'] ;
            }
            if ($this->obj_actfinan['fin_tasa'] != -1 and $this->obj_actfinan['fin_tasa'] != $fin_act['dfin_tasa'])
            {
                $detalle['tasa']= $this->obj_actfinan['fin_tasa'] ;
                $contador ++ ;
            } 
            else 
            {
                $detalle['tasa']= $fin_act['dfin_tasa'] ;
            }
            if ($this->obj_actfinan['num_cuo'] != -1 and $this->obj_actfinan['num_cuo'] != $fin_act['dfin_numcuotas'] and $this->obj_actfinan['num_cuo'] > $fin_act['fin_cuoemitidas'] )
            {
                $detalle['numcuota']= $this->obj_actfinan['num_cuo'] ;
                $contador ++ ;
            } 
            else{
                $detalle['numcuota']= $fin_act['dfin_numcuotas'] ;
            }
            if ($contador == 0 ) {
                throw new MyException('Detalle de la financiacion ya actualizado  o numero de cuotas no es mayor a las cuotas emitidas , por favor validar..' , -1);
            }      
            $detalle['idfinanciacion'] = $this->obj_actfinan['finan']['fin_ideregistro'];   
            $detalle['idusuario'] = $this->idUsuario;
            $detalle['estado'] = 'A' ; 
            $this->cargarFinanModel->insertarDetalleFinanciacion($detalle);
            $datos_act['usuario'] = $this->idUsuario ;
            $datos_act['id_detalle'] = $fin_act['dfin_ideregistro'] ;
            $this->cargarFinanModel->actualizarDetalleFinan($datos_act);
            $this->obj_actfinan['nuevo_detalle'] = $detalle;
            print_r("\n  Se inserto el nuevo detalle de la Financiacion :");
            print_r($this->obj_actfinan);
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
        $Datos['idprograma'] = PROGRAMA_ACT_FIN_ESP_BIO;
        $this->procesoModel->inactivarControEjecucionProceso($Datos);
    }

    /**
     * Obtiene la cantidad de hilos que ejecutan el mismo  proceso
     * @param int $ProcesoControl - Id del hilo que s eestá ejecutando
     * @return int - Cantidad de hilos
     */
    public function getCantidadHilosActivosPrograma($ProcesoControl) {
        $Datos['idempresa'] = $this->idEmpresa;
        $Datos['idprograma'] = PROGRAMA_ACT_FIN_ESP_BIO;
        $Datos['idhilo'] = $ProcesoControl;
        $cantidad = $this->procesoModel->getCantidadHilosActivosPrograma($Datos);
        return $cantidad;
    }

}
