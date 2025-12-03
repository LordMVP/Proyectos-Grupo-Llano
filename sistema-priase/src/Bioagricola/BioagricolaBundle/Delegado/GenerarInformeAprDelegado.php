<?php

namespace Bioagricola\BioagricolaBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Bioagricola\BioagricolaBundle\Models\GenerarInformeAprModel;
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
class GenerarInformeAprDelegado {

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
     * @var GenerarInformeAprModel 
     */
    private $Gen_Inf_Apr_Model;

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
        $this->Gen_Inf_Apr_Model = new GenerarInformeAprModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->sesion = $sesion;
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
     * Se valida que la tabla temporal exista y si existe se borran los registros
     * esto debido a que la catidad de registros pasa los dos millones 
     * @return type
     * @throws MyException
     */
    
    private function validarTablaTemporal() {
        try {
            $idEmpresa = $this->sesion->get('idempresa');
            $tablaExiste = $this->Gen_Inf_Apr_Model->validarExisteTabla();
            if ($tablaExiste > 0) {
                $this->Gen_Inf_Apr_Model->vaciarTablaMasiva($idEmpresa);
                return;
            }       
            $this->Gen_Inf_Apr_Model->crearTabMasiva();                   
        } catch (\Exception $exc) {
            throw new MyException('Error al crear la tabla temporal', -1);
        }
    }
    
    /**
     * Termina el control de ejecución del proceso
     * @param Object $Datos (idempresa, idprograma)
     */
    public function inactivarControlEjecucionProceso($Datos) {
        $this->procesoModel->inactivarControEjecucionProceso($Datos);
    }
    
     /**
     * Termina el control de ejecución del proceso
     * @param Object $Datos (idempresa, idprograma)
     */
    public function llenarVersionFinanciacion() {
        $idEmpresa = $this->sesion->get('idempresa');
        $this->Gen_Inf_Apr_Model->actVersionFinanciacion($idEmpresa);
    }
    
    /**
     * Consulta el resultado del procesamiento de las financiaciones que se cargaron en el archivo
     * @return Object con arreglos del proceso correcto y los que presentaron inconvenientes
     */
    public function consultarResumen() {
        $idEmpresa = $this->sesion->get('idempresa');       
        $tablaExiste = $this->Gen_Inf_Apr_Model->validarExisteTabla();

        if ($tablaExiste > 0) {
            $estados = "('A', 'P')" ;
            $resultado['resumencorrectos'] = $this->Gen_Inf_Apr_Model->consultarResumen($idEmpresa, $estados);
            $resultado['resumenconerrores'] = $this->Gen_Inf_Apr_Model->consultarResumenErrores($idEmpresa, 'F');
            return $resultado;
        }
    }

    /**
     * Valida que si la tabla temporal existe se le cambian todos los registros al estado 'C'
     * @param String $tabla nombre de la tabla temporal
     * @return type
     */
    public function eliminarTablaTemporal() {
        $idEmpresa = $this->sesion->get('idempresa');
        $tablaExiste = $this->Gen_Inf_Apr_Model->validarExisteTabla();

        if ($tablaExiste > 0) {
            $this->Gen_Inf_Apr_Model->vaciarTablaMasiva($idEmpresa);
            return;
        }
    } 
    
    /******   Logica Informe Aprovechamiento  ****/
     /**
     * Consulta la información de los cambios de valor que pertenecen a las financiaciones 
     * y carga esta informcion en la tabla temporal para ser procesada
     * @throws MyException
     */
    public function consultarRegistrosProcesar($mesaho) {       
        $parametroInactivar['idprograma'] = PROGRAMA_GEN_INF_APR_FIN_ESP_BIO;
        $parametroInactivar['idempresa'] = $this->sesion->get('idempresa');
        /**
         * Consulta el mes y año para el proceso de aprovechamiento
         */
        $meaho_ant = "";
        $mes_info_apr = $this->Gen_Inf_Apr_Model->getUltimoMesInfAprovechamiento($this->sesion->get('idempresa'));
        if ($mes_info_apr['aho_info'] == -1 ) 
        {            
            $mes_info_fin = $this->Gen_Inf_Apr_Model->getUltimoMesFinanciacion($this->sesion->get('idempresa'));
            if ($mes_info_fin ['aho_fin'] == -1 ) 
            {
                $this->inactivarControlEjecucionProceso($parametroInactivar);
                throw new MyException('No hay Financiaciones para la empresa en sesion, por favor validar...', -1);
            }
            $meaho_pro = $mes_info_fin['mes_fin'] . $mes_info_fin['aho_fin'] ;
        }
        else
        {
            $meaho_ant = $mes_info_apr['mes_ant'] . $mes_info_apr['aho_ant'] ;
            $meaho_pro = $mes_info_apr['mes_info'] . $mes_info_apr['aho_info'] ;
        }
        if($mesaho != $meaho_pro)
        {
            if ($mesaho != $meaho_ant)
            {
                $this->inactivarControlEjecucionProceso($parametroInactivar);
                throw new MyException('Error en el mes y año a procesar... el mes debe ser: ' . $meaho_pro  .' o Regenerar el mes '. $meaho_ant , -1);  
            }          
        }
        $listaRegistros = $this->Gen_Inf_Apr_Model->getTercerosProcesar($this->sesion->get('idempresa'));
        if (empty($listaRegistros)) {
            $this->inactivarControlEjecucionProceso($parametroInactivar);
            throw new MyException('No hay Registros para procesar...', -1);
        }
        try 
        {
            $this->validarTablaTemporal();
            $this->cargarInformacionTablaTemporal($listaRegistros,$mesaho);           
        } catch (\Exception $ex1) {
            $this->inactivarControlEjecucionProceso($parametroInactivar);
            throw new MyException($ex1->getMessage(), $ex1->getCode());
        }
    }
    
     /**
     * Método encargado de recorrer el arreglo de terceros y
     * guardar los registros a procesar en la tabla temporal
     * @throws MyException Si hay errores al cargar la tabla temporal
     */
    private function cargarInformacionTablaTemporal($listaRegistros, $meaho) {
        try {
            $this->conexion->beginTransaction();  
            $contador = 0;
            $complemento = "";
             $lengthArray = count($listaRegistros);
            foreach ($listaRegistros as $indice => $registro) { 
                $cant_reg = $registro['cantidad'];
                $id_tercero = $registro['tercero'];
                $fin_mes = $registro['mes'];
                $fin_aho = $registro['aho'];     
                $fin_mesaho = $registro['mesaho'];     
                $vlrsdo_fijo = $registro['sdo_fijo'];
                $vlrsdo_var = $registro['sdo_varible'];
                $vlrsdo_ajus = $registro['sdo_ajuste'];  
                $idEmpresa = $this->sesion->get('idempresa');
                $idProceso = $indice % NUMERO_HILOS_GEN_INF_APR_BIO ;  
                $complemento .= "($cant_reg , $fin_mes, $fin_aho , '$fin_mesaho' , '$meaho' , $id_tercero, $vlrsdo_fijo , $vlrsdo_var, $vlrsdo_ajus , $idProceso,'P', $idEmpresa),";
                //Se inserta a la tabla 5000 registros en una misma sentencia
                if ($contador == 5000 || $indice == $lengthArray - 1) {
                    $complemento = substr($complemento, 0, strlen($complemento) - 1);
                    $this->Gen_Inf_Apr_Model->insertarMasiva($complemento);
                    $contador = -1;
                    $complemento = "";
                }
                $contador++;
            }
            //Se verifica que no queden registros sin insertar en la tabla temporal
            if (!empty($complemento)) {
                $complemento = substr($complemento, 0, strlen($complemento) - 1);
                $this->Gen_Inf_Apr_Model->insertarMasiva($complemento);
            }            
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException('Error al cargar los registros a la tabla temporal: ' . $ex->getMessage(), -1);
        }
    }
    
    /**
     * Consulta el resultado del procesamiento de las financiaciones que se cargaron en el archivo
     * @return Object con arreglos del proceso correcto y los que presentaron inconvenientes
     */
    public function consultarInfoCon($mesaho) {      
        try {
            $parametros['mesaho_rep'] = $mesaho ;
            $parametros['id_empresa'] = $this->sesion->get('idempresa');
            $listaRegistros = $this->Gen_Inf_Apr_Model->getInforAprConsolidadon($parametros);           
            $lengthArray = count($listaRegistros);
            $data = "";
            if ($lengthArray > 0)
            {  
                $line = 'Nombre Tercero|Mes|Año|Factura fijo|Factura Variable|Factura Ajuste|Cambio|Pago fijo|Pago Variable|Pago Ajuste|Cambio Pagado'; 
                $data .= trim( $line ) . "\n" ;
                foreach ($listaRegistros as $indice => $registro) 
                { 
                    $line = ''; 
                    $value = $registro['ter_nomcompleto'] ."|"; 
                    $line .= $value;
                    $value = $registro['mes'] ."|" ;
                    $line .= $value;
                    $value = $registro['aho']  ."|";
                    $line .= $value;
                    $value = $registro['fac_fijo']  ."|";
                    $line .= $value;
                    $value = $registro['fac_variable'] ."|" ;
                    $line .= $value;
                    $value = $registro['fac_ajuste'] ."|" ;
                    $line .= $value;
                    $value = $registro['cambio'] ."|" ;
                    $line .= $value;
                    $value = $registro['pag_fijo']  ."|";
                    $line .= $value;
                    $value = $registro['pag_variable'] ."|" ;
                    $line .= $value;
                    $value = $registro['pag_ajuste'] ."|" ;
                    $line .= $value;
                    $value = $registro['campagado'] ;
                    $line .= $value;                    
                    $data .= trim( $line ) . "\n" ;
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
            throw new MyException('Error al consultar el informe' . $ex->getMessage(), -1);
        }
    } 
}
