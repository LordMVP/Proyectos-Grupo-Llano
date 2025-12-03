<?php

namespace Bioagricola\BioagricolaBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Bioagricola\BioagricolaBundle\Models\CargarProcentajesAprModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
//use \DateTime;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Carga los Porcentajes de Aprovechamiento y Viat
 *
 * @author rsagudelo
 */
class CargarProcentajesAprDelegado {

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
     * @var CargarProcentajesAprModel 
     */
    private $cargarPorAprModel;

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
        $this->cargarPorAprModel = new CargarProcentajesAprModel($this->conexion);
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
     * Valida la información de los porcentajes a subir y el archivo que esté en el servidor y se 
     * carga la información en base de datos
     * @param array $listaArchivo - Información del archivo subido en el servidor
     * @param array $infoImpArc -  Información básica para cargar los porcentajes  
     * @throws MyException
     */
    public function procesarArchivo(array $listaArchivo, array $infoImpArc) {
       
        $parametroInactivar['idprograma'] = PROGRAMA_APR_FIN_ESP_BIO;
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
            $this->validarNombre($nombreArchivo, '/^POR_APR-/');
        
            $listaRegistros = $this->procesarLineasPorcentajesApr($listaLineas, $infoImpArc);          
            //Si no se cargó ningún registro se muestra un error al usuario
            if (empty($listaRegistros)) {
                throw new MyException('Error al procesar el archivo', -1);
            } 
            $nom_tabla = "temp_imp_por_apr_fin_esp" ;
            $this->validarTablaTemporal($nom_tabla);
            $this->validarPrimerRegistro($listaRegistros[0] );
            $this->cargarInformacionTablaTemporal($listaRegistros);
            $this->validarInformacionArchivo($infoImpArc);
           
        } catch (\Exception $ex1) {
            $this->inactivarControlEjecucionProceso($parametroInactivar);
            throw new MyException($ex1->getMessage(), $ex1->getCode());
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
     * Valida y obtiene la información específica de cada Registro según la estrucutura del archivo requerido
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoImpArc - Información básica (mesaho)
     * @return array - Información de cada registro 
     * @throws MyException
     */
    private function procesarLineasPorcentajesApr (array $listaLineas, $infoImpArc) {
        $listaRegistros = array();
        if (empty($listaLineas)) {
            throw new MyException('Error el archivo está vacío');
        }
        foreach ($listaLineas as $linea) 
        {
            $info = explode("|", $linea);
            if(count($info) != 6 ) 
            {
                throw new MyException("El Registro no tiene el formato esperado error en la línea ( $linea ) ", -1);
            }
            if($info[1] != $infoImpArc['mesaho'] ) 
            {
                throw new MyException("El registro no pertenece al mes y año seleccionado.( $linea ) ", -1);
            }            
            if($info[0] == '' ) 
            {
                throw new MyException("El Nit esta vacio para el registro.( $linea ) ", -1);
            }  
            if( !is_numeric($info[2]) OR !is_numeric($info[3]) OR !is_numeric($info[4]) OR !is_numeric($info[5])) 
            {
                throw new MyException(" Error en el formato de los porcentajes.( $linea ) ", -1);
            } 
            if(($info[2]< 0 ) OR($info[3] < 0) OR ($info[4] < 0) OR ($info[5]< 0)) 
            {
                throw new MyException(" Error los porcentajes no deben ser negativos.( $linea ) ", -1);
            } 
            if(($info[2] > 1) OR($info[3] > 1) OR ($info[4] > 1) OR ($info[5] > 1)) 
            {
                throw new MyException(" Error los porcentajes no deben ser mayores a 1.( $linea ) ", -1);
            } 
            $registro['ter_doc'] = $info[0] ;
            $registro['por_mesaho'] = $info[1] ;
            $registro['por_fijo'] = $info[2] ;            
            $registro['por_var'] = $info[3] ;            
            $registro['por_ajus'] = $info[4] ;
            $registro['por_viat'] = $info[5] ;
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }
     /**
     * Se valida que la tabla temporal exista y si existe se pasan todos los registros 
     * a estado 'C'
     * @param $nom_tabla - Nombre de la tabla temporal  
     * @return type
     * @throws MyException
     */
    
    private function validarTablaTemporal($nom_tabla) {
        try {
            $idEmpresa = $this->sesion->get('idempresa');
            $tablaExiste = $this->cargarPorAprModel->validarExisteTabla($nom_tabla);
            if ($tablaExiste > 0) {
                $this->cargarPorAprModel->vaciarTablaMasiva($idEmpresa,$nom_tabla );
                return;
            }          
            $this->cargarPorAprModel->crearTabMasivaPorApr();           
        } catch (\Exception $exc) {
            throw new MyException('Error al crear la tabla temporal', -1);
        }
    }
    
    /**
     * Se validará si el archivo ya se subió según el primer registro
     * @param object $regValidar - Primer registro en el archivo 
     * @throws MyException
     */
    private function validarPrimerRegistro ($regValidar) {
         $regValidar['idempresa'] = $this->sesion->get('idempresa');
        $respuesta = $this->cargarPorAprModel->validarRegistro($regValidar);
        if ($respuesta != -1 ) {
            throw new MyException('Error, el archivo ya fue cargado por favor validar ', -1);
        }
    }
    
    /**
     * Método encargado de cargar los registros a la tabla temporal 
     * @param array  $listaRegistros lista registros que estaban en el archivo plano
     * @throws MyException Si el archivo ya fue cargado
     */
    private function cargarInformacionTablaTemporal($listaRegistros ) {
        try {
            $this->conexion->beginTransaction();
            $contador = 0;
            $complemento = "";
            $lengthArray = count($listaRegistros);
            foreach ($listaRegistros as $indice => $registro) {
                //Si se reporta un registro con todos los porcentajes en valor 0 no se carga
                if ($registro['por_fijo'] <= 0 and $registro['por_var'] <= 0 and $registro['por_ajus'] <= 0 and $registro['por_viat'] <= 0 ) {
                    continue;                     
                } 
                $ter_doc = $registro['ter_doc'];
                $por_mesaho = $registro['por_mesaho'];
                $por_fijo = $registro['por_fijo'];
                $por_var = $registro['por_var'];	
                $por_ajus = $registro['por_ajus'];
                $por_viat = $registro['por_viat'];  
                $idEmpresa = $this->sesion->get('idempresa');
                $idProceso = 0 ;
                $complemento .= "('$ter_doc', '$por_mesaho', $por_fijo, $por_var, $por_ajus, $por_viat, $idEmpresa, 'P' , $idProceso),";
                //Se inserta a la tabla 5000 registros en una misma sentencia
                if ($contador == 5000 || $indice == $lengthArray - 1) {
                    $complemento = substr($complemento, 0, strlen($complemento) - 1);
                    $this->cargarPorAprModel->insertarMasiva($complemento);
                    $contador = -1;
                    $complemento = "";
                }
                $contador++;
            }
            //Se verifica que no queden registros sin insertar en la tabla temporal
            if (!empty($complemento)) {
                $complemento = substr($complemento, 0, strlen($complemento) - 1);
                $this->cargarPorAprModel->insertarMasiva($complemento);
            }            
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException('Error al cargar el archivo: ' . $ex->getMessage(), -1);
        }
    }
    
    /**
     * Permite validar si el archivo tiene la informacion minima necesaria 
     * @param array $infoImpArc - Información básica (mesaho)
     * @throws MyException
     */
    private function validarInformacionArchivo($infoImpArc) {
        try {
            $idEmpresa = $this->sesion->get('idempresa');
            $validacion = $this->cargarPorAprModel->validarInformacionTemporal($idEmpresa, $infoImpArc['mesaho']);
            if (!empty($validacion) and $validacion['id'] < 0 ) {
                //$this->cargarPorAprModel->eliminarRegistrosTotales($idEmpresa, 'P');
                throw new MyException($validacion['mensaje'], -1);
            }
        } catch (MyException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw new MyException('Error al procesar el archivo ', -1);
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
     * Consulta el resultado del procesamiento que se cargaron en el archivo
     * @return Object con arreglos del proceso correcto y los que presentaron inconvenientes
     */
    public function consultarResumen() {
        $idEmpresa = $this->sesion->get('idempresa');
        $nom_tabla = "temp_imp_por_apr_fin_esp" ;
        $tablaExiste = $this->cargarPorAprModel->validarExisteTabla($nom_tabla);

        if ($tablaExiste > 0) {
            $estados = "('A', 'P')" ;
            $resultado['resumencorrectos'] = $this->cargarPorAprModel->consultarResumen($idEmpresa, $estados);
            $resultado['resumenconerrores'] = $this->cargarPorAprModel->consultarResumenErrores($idEmpresa, 'F');
            return $resultado;
        }
    }

    /**
     * Valida que si la tabla temporal existe se le cambian todos los registros al estado 'C'
     * @param String $tabla nombre de la tabla temporal
     * @return type
     */
    public function eliminarTablaTemporal($tabla) {
        $idEmpresa = $this->sesion->get('idempresa');
        $tablaExiste = $this->cargarPorAprModel->validarExisteTabla($tabla);

        if ($tablaExiste > 0) {
            $this->cargarPorAprModel->vaciarTablaMasiva($idEmpresa, $tabla);
            return;
        }
    } 
    
    // ************* proceso de Importar porcentajes de Aprovechamiento
    
     /**
     * Valida que el registro no exista y 
     * carga la información en base de datos
     * @param array $listaArchivo - Información del archivo subido en el servidor
     * @throws MyException
     */
    public function procesarArchivoAct(array $listaArchivo) {       
        $parametroInactivar['idprograma'] = PROGRAMA_ACT_FIN_ESP_BIO;
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
            $this->validarNombre($nombreArchivo, '/^FIN_ESP_ACT-/');
            $listaRegistros = $this->procesarLineasActFin($listaLineas);          
            //Si no se cargó ningún registro se muestra un error al usuario
            if (empty($listaRegistros)) {
                throw new MyException('Error al procesar el archivo - ', -1);
            }           
            $nom_tabla = "esp_tem_act_fin" ;
            $this->validarTablaTemporal($nom_tabla);
            $this->validarPrimerRegistroAct($listaRegistros[0]);
            $this->cargarInfoTablaTempoAct($listaRegistros);
           
        } catch (\Exception $ex1) {
            $this->inactivarControlEjecucionProceso($parametroInactivar);
            throw new MyException($ex1->getMessage(), $ex1->getCode());
        }
    }     
    
    /**
     * Consulta los porcentages de terceros para un mes especifico
     * @param array $param - Información par hacer la consulta (mes y empresa) 
     * @return Object con el resumen de los pagos
     */
    public function consultarPorcentajesTercerosFinan($param) {
        $resultado['por_terceros']= $this->cargarPorAprModel->getPorcAprovechadoresMes($param);
        return $resultado;
    }
    
//    /*
//     * Consulta los registros que se van a procesar según el estado del registro
//     * @throws MyException Si no hay registros a procesar
//     * @return Object con arreglos de los registros a validar
//    */
//    public function consultarRegistrosProcesar() {       
//        $listaRegistros = $this->cargarPorAprModel->getRegistrosProcesar($this->idEmpresa);
//        if (empty($listaRegistros)) {
//            throw new MyException('Error no hay registros a procfesar, error al cargar el archivo: ', -1);
//        }
//        return $listaRegistros;
//
//    }
//    
//    /**
//     * realiza el procesamiento de los procentajes y va registrando en la tabla temporal
//     * @param array $listaRegistrosProc - Información de los porcentajes a procesar
//     */
//    public function procesarRegistros($listaRegistrosProc) {       
//        try {
//                foreach ($listaRegistrosProc as $registro) 
//                    {
//                $this->conexion->beginTransaction();
//                $this->financiacion = $registro;
//                print_r(" Informacion Financiacion inicial ");
//                print_r($this->financiacion);  
//                $this->procesarRegistro(); 
//                $datAct['id_registro'] = $this->financiacion['idregistro'] ;
//                $datAct['estado'] = 'A' ;
//                $datAct['mensaje'] = 'Se cargó correctamente la financicion con el id: ' .financiacion['finan']['idfinanciacion'] ;
//                $this->cargarFinanModel->actualizarTemporalResumen($datAct);
//                }
//                $this->conexion->commit();
//        } catch (MyException $e) {
//            $this->conexion->rollBack();
//            $datAct['id_registro'] = $this->financiacion['idregistro'] ;
//            $datAct['estado'] = 'F' ;
//            $datAct['mensaje'] = $e->getMessage() ;
//            $this->cargarFinanModel->actualizarTemporalResumen($datAct);       
//        } catch (\Exception $e) {
//            $this->conexion->rollBack();
//            $datAct['id_registro'] = $this->financiacion['idregistro'] ;
//            $datAct['estado'] = 'F' ;
//            $datAct['mensaje'] = $e->getMessage() ;
//            $this->cargarFinanModel->actualizarTemporalResumen($datAct);
//        } finally {
//            $this->aumentarCantidad();
//        }
//        
//    }
//    
//     /**
//     * Valida la información de la financiacion y la registra en las tablas necesarias 
//     * @return void
//     * @throws MyException
//     */
//    private function procesarRegistro() {
//         /*
//         * Valdia si la factura ya tiene una financiacion. 
//         */
//        $finan = $this->cargarFinanModel->getFinanciacionFactura($this->idEmpresa, $this->financiacion['lmf_fac']);
//        if ($finan['id_finan'] > 0 ) {
//            throw new MyException('La financiacion ya esta cargada para el codigo de usuario '.$finan['mua_cod']. 'y codigo' . $finan['id_finan']  , -1);
//        }       
//        /*
//         * crear la financiacion
//        */   
//        $this->insertarProcentajeApr();
//        $this->insertarDetalleFinanciacion();
//        $this->insertarDetAprFinanciacion();
//        $this->escribeLog("se incrementa registro en cpr y se cambia el estado de la financiacion a procesado " . $this->financiacion['finan']['idfinanciacion'] . " \n");
//
//    }
//    
//    /**
//     * Construye objeto de financiacion y envía para que sea registrado en base de datos
//     */
//    private function insertarProcentajeApr() {	
//        print_r("\n Inserta Financiacion :");
//        print_r($this->financiacion);
//        print_r("\n Empresa Sesion : ");
//        print_r($this->idEmpresa);
//        if ($this->idEmpresa != $this->financiacion['idempresa']) {
//            throw new MyException('La empresa en Sesion no es igual a la empresa de la financiacion ' . $this->financiacion['lmf_fac'] , -1);
//        }
//        $finan['tipouso'] = $this->financiacion['tus_ideregistro'];
//        $finan['codigo'] = $this->financiacion['mua_cod'];
//        $finan['factura'] = $this->financiacion['lmf_fac'];
//        $finan['empresa'] = $this->financiacion['mua_empresa'];
//        $finan['mesaho'] = $this->financiacion['fin_mesaho'];
//        $finan['vlrtotal'] = $this->financiacion['fin_vlrtotal'];
//        $finan['vlrbio'] = $this->financiacion['fin_vlrbio'];
//        $finan['vlraprfijo'] = $this->financiacion['fin_vlraprfijo'];
//        $finan['vlraprvar'] = $this->financiacion['fin_vlraprvar'];
//        $finan['vlrajuaprvar'] = $this->financiacion['fin_vlrajuaprvar'];
//        $finan['vlrviatfijo'] = $this->financiacion['fin_vlrviatfijo'];
//        $finan['vlrviatvar'] = $this->financiacion['fin_vlrviatvar'];
//        $finan['idempresa'] = $this->financiacion['idempresa'];
//        $finan['idusuario'] = $this->idUsuario;
//        $this->cargarFinanModel->insertarFinanciacion($finan);
//        $this->financiacion['finan'] = $finan ;
//    }
//    
//    /**
//     * Termina el control de ejecución del proceso
//     */
//    public function inactivarControlEjecucionProceso() {
//        $Datos['idempresa'] = $this->idEmpresa;
//        $Datos['idprograma'] = PROGRAMA_APR_FIN_ESP_BIO;
//        $this->procesoModel->inactivarControEjecucionProceso($Datos);
//    }
}
