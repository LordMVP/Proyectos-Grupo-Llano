<?php

namespace Bioagricola\BioagricolaBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Bioagricola\BioagricolaBundle\Models\GenerarAmortizacionModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
//use \DateTime;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Carga las financiaciones Especiales
 *
 * @author rsagudelo
 */
class GenerarAmortizacionDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var GenericoDelegado 
     */
    private $genericoDelegado;

    /**
     *
     * @var CargarFinanciacionesModel 
     */
    private $genAmortModel;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde el cual se hizo la petición.
     */
    /*
     * @var ProcesoModel
     */
    private $procesoModel;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->genAmortModel = new GenerarAmortizacionModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->sesion = $sesion;
    }    
    /****   Logica Generica  ****/    
     /**
     * Se valida que la tabla temporal exista y si existe se pasan todos los registros 
     * a estado 'C'
     * @param $nom_tabla - Nombre de la tabla temporal  
     * @return type
     * @throws MyException
     */    
    private function validarTablaTemporal() {
        try {
            $idEmpresa = $this->sesion->get('idempresa');
            $tablaExiste = $this->genAmortModel->validarExisteTabla();
            if ($tablaExiste > 0) {
                $this->genAmortModel->vaciarTablaMasiva($idEmpresa);
                return;
            }       
            $this->genAmortModel->crearTabMasiva();                   
        } catch (\Exception $exc) {
            throw new MyException('Error al crear la tabla temporal' . $exc->getMessage() , -1);
        }
    }
    /**
     * Valida que si la tabla temporal existe se le cambian todos los registros al estado 'C'
     * @param String $tabla nombre de la tabla temporal
     * @return type
     */
    public function eliminarTablaTemporal() {
        $idEmpresa = $this->sesion->get('idempresa');
        $tablaExiste = $this->genAmortModel->validarExisteTabla();

        if ($tablaExiste > 0) {
            $this->genAmortModel->vaciarTablaMasiva($idEmpresa);
            return;
        }
    } 
     /**
     * Consulta la cantidad de los hilos del programa hasta el momento
     * @param Object $Datos (idempresa, idprograma)
     * @return number - Cantidad de registros en cpr activos
     */
    public function getControlEjecucionProceso($Datos) {
        return $this->procesoModel->consultarControEjecucionProceso($Datos);
    }
    
    /**
     * Se registra el proceso actual en base de datos para realizar el control de la ejecución y así otro usuario no ejecute el mismo
     * @param Object $Datos (idempresa, idprograma)
     */
    public function insertaControlEjecucionProceso($Datos) {
        $this->procesoModel->insertarControEjecucionProceso($Datos);
    }    
    
    /**
     * Termina el control de ejecución del proceso
     * @param Object $Datos (idempresa, idprograma)
     */
    public function inactivarControlEjecucionProceso($Datos) {
        $this->procesoModel->inactivarControEjecucionProceso($Datos);
    }     
     /**
     * Consulta el resultado del procesamiento de las financiaciones que se Procesaron
     * @return Object con arreglos del proceso correcto y los que presentaron inconvenientes
     */
    public function consultarResumen() {
        $idEmpresa = $this->sesion->get('idempresa');       
        $tablaExiste = $this->genAmortModel->validarExisteTabla();

        if ($tablaExiste > 0) {
            $estados = "('A', 'P')" ;
            $resultado['resumencorrectos'] = $this->genAmortModel->consultarResumen($idEmpresa, $estados);
            $resultado['resumenconerrores'] = $this->genAmortModel->consultarResumenErrores($idEmpresa, 'F');
            return $resultado;
        }
    }
    /****   Termina Logica Generica  ****/
    
    /******   Logica Generar Amortización  ****/
     
    /**
     * Consulta la información de los cambios de valor que pertenecen a las financiaciones 
     * y carga esta informcion en la tabla temporal para ser procesada
     * @throws MyException
     */
    public function consultarFinanaProcesar() {
        $parametroInactivar['idprograma'] = PROGRAMA_GEN_AMORT_FIN_ESP_BIO;
        $parametroInactivar['idempresa'] = $this->sesion->get('idempresa');
        /**
         * Consulta las financiaciones a procesar...
         */        
        $listaRegistros = $this->genAmortModel->getFinanAmortizar($this->sesion->get('idempresa'));
        if (empty($listaRegistros)) {
            $this->inactivarControlEjecucionProceso($parametroInactivar);
            throw new MyException('No hay Registros para procesar...', -1);
        }
        try 
        {
            $this->validarTablaTemporal();
            $this->cargarInformacionTablaTemporal($listaRegistros);           
            $this->validarInformacionProcesar();           
        } catch (\Exception $ex1) {
            $this->inactivarControlEjecucionProceso($parametroInactivar);
            throw new MyException($ex1->getMessage(), $ex1->getCode());
        }
    }       
     /**
     * Método encargado de cargar la informacion devuelta desde la consulta  
     * a la tabla temporal 
     * @throws MyException Si el archivo ya fue cargado
     */
    private function cargarInformacionTablaTemporal($listaRegistros) {
        try {
            $this->conexion->beginTransaction();           
            $contador = 0;
            $complemento = "";
            $lengthArray = count($listaRegistros);
            foreach ($listaRegistros as $indice => $registro)
            {   
                $idfinanciacion = $registro['id_financiacion'];
                $fin_cuoemitidas = $registro['cuotas_emitidas'];
                $fin_totcuotas = $registro['total_cuotas'];
                $fin_tasa = $registro['tasa_interes'];
                $fin_version = $registro['fin_version'];
                $fin_sdobio = $registro['sdo_bio'];
                $fin_sdoterfijo= $registro['sdo_terc_fijo'];
                $fin_sdotervar = $registro['sdo_terc_vari'];
                $fin_sdoteraju = $registro['sdo_terc_ajus'];
                $fin_sdofinan = $registro['fin_sdo'];
                $fin_sdoamort = $registro['saldo_cuotas'];
                $am_sdobio = 0 ;
                $am_sdoterfijo = 0 ;
                $am_sdotervar = 0 ;
                $am_sdoteraju =  0 ;
                $am_sdofinan = 0 ;
                $idproceso = $indice % NUMERO_HILOS_GEN_AMOT_BIO ;  
                $estado = 'P';
                //echo $complemento ;
                $idempresa = $this->sesion->get('idempresa');             
                $complemento .= "($idfinanciacion , $fin_cuoemitidas , $fin_totcuotas, $fin_tasa , $fin_sdobio , $fin_sdoterfijo , $fin_sdotervar , $fin_sdoteraju , $fin_sdofinan , $fin_sdoamort , $fin_version , $am_sdobio , $am_sdoterfijo , $am_sdotervar , $am_sdoteraju , $am_sdofinan , $idproceso ,'P' ,$idempresa ),";
                //Se inserta a la tabla 5000 registros en una misma sentencia
                if ($contador == 5000 || $indice == $lengthArray - 1) {
                    $complemento = substr($complemento, 0, strlen($complemento) - 1);
                    $this->genAmortModel->insertarMasiva($complemento);
                    $contador = -1;
                    $complemento = "";
                }
                $contador++;
            }
            //Se verifica que no queden registros sin insertar en la tabla temporal
            if (!empty($complemento)) {
                $complemento = substr($complemento, 0, strlen($complemento) - 1);
                $this->genAmortModel->insertarMasiva($complemento);
            }            
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException('Error al cargar las financiaciones a procesar en la tabla temporal: ' . $ex->getMessage() , -1);
        }
    }    
    /**
     * Permite validar si hay inconsistencias en la informacion preliminar a procesar 
     * @return String - Numeros de factura
     * @throws MyException
     */
    private function validarInformacionProcesar() {
        try {
            $idEmpresa = $this->sesion->get('idempresa');
            $validacion = $this->genAmortModel->validarInformacionTemporal($idEmpresa);
            if (!empty($validacion)) {
                $this->genAmortModel->eliminarRegistrosTotales($idEmpresa, 'P');
                throw new MyException($validacion[0]['mensaje'], -1);
            }
        } catch (MyException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw new MyException('Error al generar los registros a procesar ', -1);
        }
    }
    /**
     * Consulta las ultimas cuotas generadas para el cobro
     * @return Object con los registros que se descargaran
     */
    public function consultarInfoCuo() {      
        try {
            $parametros['id_empresa'] = $this->sesion->get('idempresa');
            $listaRegistros = $this->genAmortModel->getCuotaFacturar($parametros);           
            $lengthArray = count($listaRegistros);
            $data = "";
            if ($lengthArray > 0)
            {  
//                $line = 'fin_ide|am_ide|mua_cod|lmf_fac|fec_cob|fijo|variater|pago|ajusfijo|ajusvariater |fecha_pago|viatfijo|viatvariater| bio|nu cuota|tot_cuota|pago|vlr_cuota|fin_sdo'; 
//                $data .= trim( $line ) . "\n" ;
                foreach ($listaRegistros as $indice => $registro) 
                { 
                    $sdo_finan = $registro['fin_sdo'] - $registro['fijo'] - $registro['variater']
                           -  $registro['ajusvariater'] - $registro['bio'] ;
                    $cuota = round($registro['cuota']);
                    $sdo_finan = round($sdo_finan) ;
                    if ($sdo_finan == '-0')
                    {
                        $sdo_finan = 0 ;
                    }
                    $line = ''; 
                    $value = $registro['fin_ideregistro'] ."|"; 
                    $line .= $value;
                    $value = $registro['am_ideregistro'] ."|" ;
                    $line .= $value;
                    $value = $registro['mua_cod']  ."|";
                    $line .= $value;
                    $value = $registro['lmf_fac']  ."|";
                    $line .= $value;
                    $value = $registro['fec_cob'] ."|" ;
                    $line .= $value;
                    $value = $registro['fijo'] ."|" ;
                    $line .= $value;
                    $value = $registro['variater'] ."|" ;
                    $line .= $value;
                    $value = $registro['pago']  ."|";
                    $line .= $value;
                    $value = $registro['ajusfijo'] ."|" ;
                    $line .= $value;
                    $value = $registro['ajusvariater'] ."|" ;
                    $line .= $value;
                    $value = $registro['fecha_pago'] ."|" ;
                    $line .= $value;                    
                    $value = $registro['viatfijo'] ."|" ;
                    $line .= $value;                    
                    $value = $registro['interes']."|" ;
                    $line .= $value;                    
                    $value = $registro['bio'] ."|" ;
                    $line .= $value;                    
                    $value = $registro['num_cuo'] ."|" ;
                    $line .= $value;                    
                    $value = $registro['dfin_numcuotas'] ."|" ;
                    $line .= $value;                    
                    $value = $registro['pago'] ."|" ;
                    $line .= $value;                    
                    $value = $cuota ."|" ;
                    $line .= $value;                    
                    $value = $sdo_finan ;
                    $line .= $value;                    
                    $data .= trim( $line ) . ";\n" ;
                }
                $data = str_replace( "\r" , "" , $data );                
            }
            if ( $data == "" )
            {
                $data = "\n(0) Records Found!\n";
            }
            return $data ;
        } catch (\Exception $ex) {
            return null ;
            throw new MyException('Error al consultar la cuota a cobrar' . $ex->getMessage(), -1);
        }
    } 
}
