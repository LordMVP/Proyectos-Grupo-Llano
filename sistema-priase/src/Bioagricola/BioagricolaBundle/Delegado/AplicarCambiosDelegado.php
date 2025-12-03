<?php

namespace Bioagricola\BioagricolaBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Bioagricola\BioagricolaBundle\Models\AplicarCambiosModel;
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
class AplicarCambiosDelegado {

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
    private $aplCamModel;

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
        $this->aplCamModel = new AplicarCambiosModel($this->conexion);
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
     * Consulta la información de los cambios de valor que pertenecen a las financiaciones 
     * y carga esta informcion en la tabla temporal para ser procesada
     * @throws MyException
     */
    public function consultarCambiosAplicar() {
       
        $parametroInactivar['idprograma'] = PROGRAMA_APLCV_FIN_ESP_BIO;
        $parametroInactivar['idempresa'] = $this->sesion->get('idempresa');
        $listaRegistros = $this->aplCamModel->getCambiosDxD_AplFin($this->sesion->get('idempresa'));
        if (empty($listaRegistros)) {
            $this->inactivarControlEjecucionProceso($parametroInactivar);
            throw new MyException('No hay cambios de valor DxD para procesar...', -1);
        }
        try 
        {
            $this->validarTablaTemporal();
            $this->cargarInformacionTablaTemporal($listaRegistros);           
        } catch (\Exception $ex1) {
            $this->inactivarControlEjecucionProceso($parametroInactivar);
            throw new MyException($ex1->getMessage(), $ex1->getCode());
        }
    }
    
    /**
     * Valida la información de los Cambios DxD a subir y el archivo que esté en el servidor y se 
     * carga la información en base de datos
     * @param array $listaArchivo - Información del archivo subido en el servidor
     * @throws MyException
     */
    public function procesarArchivo(array $listaArchivo ) {
       
        $parametroInactivar['idprograma'] = PROGRAMA_APLCV_FIN_ESP_BIO;
        $parametroInactivar['idempresa'] = $this->sesion->get('idempresa');
        if (empty($listaArchivo)) {
            $this->inactivarControlEjecucionProceso($parametroInactivar);
            throw new MyException('Error al subir el archivo plano', -1);
        }
        try 
        {
            $archivo = $listaArchivo[0]['rutaarchivo'];
            $listaLineas = $this->leerArchivo($archivo);
            $nombre = $listaArchivo[0]['nombrearchivo'];
            $nombreArchivo = str_replace(".txt", '', $nombre);
            //Se valida que el nombre empiece con el nombre FIN_ESP-
            $this->validarNombre($nombreArchivo, '/^FIN_ESP_CAM-/');
        
            $listaRegistros = $this->procesarLineasArchivo($listaLineas);          
            //Si no se cargó ningún registro se muestra un error al usuario
            if (empty($listaRegistros)) {
                throw new MyException('Error al procesar el archivo', -1);
            } 
            $this->validarTablaTemporal();            
            $this->cargarInformacionTablaTemporal($listaRegistros);
            $this->llenarVersionFinanciacion();
        } catch (\Exception $ex1) {
            $this->inactivarControlEjecucionProceso($parametroInactivar);
            throw new MyException($ex1->getMessage(), $ex1->getCode());
        }
    }
    
    /**
     * Lee la información del archivo y se carga en un arreglo por cada salto de línea
     * @param file $archivo - archivo de texto
     * @return array Líneas del archivo
     */
    private function leerArchivo($archivo) {
        $listaLineas = array();
        $file = fopen($archivo, "r");
        while ($linea = fgets($file)) {
            $listaLineas[] = rtrim($linea, "\r\n");
        }
        return $listaLineas;
    }
    
    /**
     * Función encargada de ejecutar la expresión regular al nombre del archivo 
     * @param type $nombre nombre del archivo
     * @param type $expresion expresión regular
     * @throws MyException
     */
    private function validarNombre($nombre, $expresion) {
        if (!preg_match($expresion, $nombre)) {
            throw new MyException('Error en el nombre ' . $nombre, - 1);
        }
    }
    
      /**
     * Valida y obtiene la información específica de cada pago según la estrucutura del archivo requerido
     * @param array $listaLineas - Lineas del archivo 
     * @return array - Información de cada cambio de Valor 
     * @throws MyException
     */
    private function procesarLineasArchivo (array $listaLineas ) {
        $listaRegistros = array();
        if (empty($listaLineas)) {
            throw new MyException('Error el archivo está vacío');
        }
        foreach ($listaLineas as $linea) 
        {
            $info = explode("|", $linea);
            if(count($info) != 7 ) 
            {
                throw new MyException("El Registro no tiene el formato esperado error en la línea ( $linea ) ", -1);
            }
            if(strlen($info[0])<12 OR !is_numeric($info[0])) 
            {
                throw new MyException("El Codigo de Usuario no es correcto.( $linea ) ", -1);
            } 
            if(strlen($info[5])<8 OR !is_numeric($info[5])) 
            {
                throw new MyException("El Numero de Factura no es correcto...( $linea ) ", -1);
            }            
            if(strlen($info[2])<6 OR !is_numeric($info[2])) 
            {
                throw new MyException("El Mes año no es correcto...( $linea ) ", -1);
            }            
            if( !is_numeric($info[1]) OR !is_numeric($info[3]) OR !is_numeric($info[6])) 
            {
                throw new MyException(" Error en el formato de los valores.( $linea ) ", -1);
            }   
            $registro['mua_cod'] = $info[0] ;
            $registro['des_vlrtotal'] = $info[1] ;
            $registro['fin_mesaho'] = $info[2] ;
            $registro['num_pqr'] = $info[3] ;
            $registro['des_usuapl'] = $info[4] ;
            $registro['lmf_fac'] = $info[5] ;
            $registro['idfinanciacion'] = $info[6] ;
            $registro['des_vlrbio'] = 0 ;
            $registro['des_vlrter'] = 0 ;
            $registro['des_vlrterpag'] = 0 ;
            $registro['des_vlrsdo'] = 0 ;           
            $registro['num_version'] = 0 ;           
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
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
        $this->aplCamModel->actVersionFinanciacion($idEmpresa);
    }
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
            $tablaExiste = $this->aplCamModel->validarExisteTabla();
            if ($tablaExiste > 0) {
                $this->aplCamModel->vaciarTablaMasiva($idEmpresa);
                return;
            }       
            $this->aplCamModel->crearTabMasiva();                   
        } catch (\Exception $exc) {
            throw new MyException('Error al crear la tabla temporal', -1);
        }
    }
    
    /**
     * Método encargado de consultar la información de los descuentos a aplicar
     * y los caga en la tabla temporal 
     * @throws MyException Si el archivo ya fue cargado
     */
    private function cargarInformacionTablaTemporal($listaRegistros) {
        try {
            $this->conexion->beginTransaction();
           
            $contador = 0;
            $complemento = "";
            $lengthArray = count($listaRegistros);
            foreach ($listaRegistros as $indice => $registro) {                
                $num_pqr = $registro['num_pqr'];
                $mua_cod = $registro['mua_cod'];
                $lmf_fac = $registro['lmf_fac'];	
                $idfinanciacion = $registro['idfinanciacion'];
                $num_version = $registro['num_version'];
                $fin_mesaho = $registro['fin_mesaho'];                
                $des_vlrtotal = $registro['des_vlrtotal'];     
                $des_vlrbio = $registro['des_vlrbio'];                
                $des_vlrter = $registro['des_vlrter'];                
                $des_vlrterpag = $registro['des_vlrterpag'];                
                $des_vlrsdo = $registro['des_vlrsdo'];
                $des_usuapl = $registro['des_usuapl'];
                $idEmpresa = $this->sesion->get('idempresa');
                $idProceso = $indice % NUMERO_HILOS_CV_DXD_EMER_BIO ;  
                $complemento .= "($num_pqr, '$mua_cod', $lmf_fac, $idfinanciacion, $num_version , '$fin_mesaho', $des_vlrtotal, $des_vlrbio, $des_vlrter, $des_vlrterpag, $des_vlrsdo, '$des_usuapl', $idProceso,'P', $idEmpresa),";
                //Se inserta a la tabla 5000 registros en una misma sentencia
                if ($contador == 5000 || $indice == $lengthArray - 1) {
                    $complemento = substr($complemento, 0, strlen($complemento) - 1);
                    $this->aplCamModel->insertarMasiva($complemento);
                    $contador = -1;
                    $complemento = "";
                }
                $contador++;
            }
            //Se verifica que no queden registros sin insertar en la tabla temporal
            if (!empty($complemento)) {
                $complemento = substr($complemento, 0, strlen($complemento) - 1);
                $this->aplCamModel->insertarMasiva($complemento);
            }            
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException('Error al cargar los Dxd en la tabla temporal: ' . $ex->getMessage(), -1);
        }
    }
    
    /**
     * Consulta el resultado del procesamiento de las financiaciones que se cargaron en el archivo
     * @return Object con arreglos del proceso correcto y los que presentaron inconvenientes
     */
    public function consultarResumen() {
        $idEmpresa = $this->sesion->get('idempresa');       
        $tablaExiste = $this->aplCamModel->validarExisteTabla();

        if ($tablaExiste > 0) {
            $estados = "('A', 'P')" ;
            $resultado['resumencorrectos'] = $this->aplCamModel->consultarResumen($idEmpresa, $estados);
            $resultado['resumenconerrores'] = $this->aplCamModel->consultarResumenErrores($idEmpresa, 'F');
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
        $tablaExiste = $this->aplCamModel->validarExisteTabla();

        if ($tablaExiste > 0) {
            $this->aplCamModel->vaciarTablaMasiva($idEmpresa);
            return;
        }
    } 
    
     /**
     * Consulta los registros cargados con error
     * @return Object con los registros que se descargaran
     */
    public function consultarErrores() {      
        try {
            $parametros['id_empresa'] = $this->sesion->get('idempresa');
            $listaRegistros = $this->aplCamModel->getRegistrosErrores($parametros);           
            $lengthArray = count($listaRegistros);
            $data = "";
            if ($lengthArray > 0)
            {  
                $line = 'Mua_cod|Valor Total|Mes_aho|Num_pqr|Usu apl cambio|Factura|Financiacion|Mensaje'; 
                $data .= trim( $line ) . "\n" ;
                foreach ($listaRegistros as $indice => $registro) 
                {    
                    $line = ''; 
                    $value = $registro['mua_cod'] ."|"; 
                    $line .= $value;
                    $value = $registro['des_vlrtotal'] ."|" ;
                    $line .= $value;
                    $value = $registro['fin_mesaho']  ."|";
                    $line .= $value;
                    $value = $registro['num_pqr']  ."|";
                    $line .= $value;
                    $value = $registro['des_usuapl'] ."|" ;
                    $line .= $value;
                    $value = $registro['lmf_fac'] ."|" ;
                    $line .= $value;
                    $value = $registro['idfinanciacion'] ."|" ;
                    $line .= $value;
                    $value = $registro['mensaje'] ;   
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
            throw new MyException('Error al consultar los errores DxD' . $ex->getMessage(), -1);
        }
    } 
    /**
     * Consulta los registros de cambios de valor cargados en el ustimo mes y que tienen saldos
     * @return Object con los registros que se descargaran
     */
    public function consultarSaldos() {      
        try {
            $parametros['id_empresa'] = $this->sesion->get('idempresa');
            $listaRegistros = $this->aplCamModel->getRegistrosSaldos($parametros);           
            $lengthArray = count($listaRegistros);
            $data = "";
            if ($lengthArray > 0)
            {         
                $line = 'mua_cod|lmf_fac|fin_ideregistro|mesaho|num_pqr|vlr_total|vlr_apl_bio|vlr_apl_ter|vlr_ter_pagado|vlr_saldo|fec_apl'; 
                $data .= trim( $line ) . "\n" ;
                foreach ($listaRegistros as $indice => $registro) 
                {   
                    $line = ''; 
                    $value = $registro['mua_cod'] ."|"; 
                    $line .= $value;
                    $value = $registro['lmf_fac'] ."|" ;
                    $line .= $value;
                    $value = $registro['fin_ideregistro']  ."|";
                    $line .= $value;
                    $value = $registro['camv_mesaho']  ."|";
                    $line .= $value;
                    $value = $registro['camv_numradicado'] ."|" ;
                    $line .= $value;
                    $value = $registro['camv_vlrtotal'] ."|" ;
                    $line .= $value;
                    $value = $registro['camv_vlrbio'] ."|" ;
                    $line .= $value;
                    $value = $registro['camv_vlrter']  ."|";
                    $line .= $value;
                    $value = $registro['camv_vlrterpag'] ."|" ;
                    $line .= $value;
                    $value = $registro['camv_vlrsdo'] ."|" ;
                    $line .= $value;
                    $value = $registro['camv_fechagb']  ;
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
            throw new MyException('Error al consultar los saldos DxD' . $ex->getMessage(), -1);
        }
    } 
}
