<?php

namespace Bioagricola\BioagricolaBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Bioagricola\BioagricolaBundle\Models\CargarFinanciacionesModel;
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
class CargarFinanciacionesDelegado {

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
    private $cargarFinModel;

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
        $this->cargarFinModel = new CargarFinanciacionesModel($this->conexion);
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
     * Valida la información de las financiaciones a subir y el archivo que esté en el servidor y se 
     * carga la información en base de datos
     * @param array $listaArchivo - Información del archivo subido en el servidor
     * @param array $infoFinanciacion -  Información básica para cargar la financiacion  
     * @throws MyException
     */
    public function procesarArchivo(array $listaArchivo, array $infoFinEspe) {
       
        $parametroInactivar['idprograma'] = PROGRAMA_CARGAR_FIN_ESP_BIO;
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
            $this->validarNombre($nombreArchivo, '/^FIN_ESP-/');
        
            $listaRegistros = $this->procesarLineasFinanciacion($listaLineas, $infoFinEspe);          
            //Si no se cargó ningún registro se muestra un error al usuario
            if (empty($listaRegistros)) {
                throw new MyException('Error al procesar el archivo', -1);
            } 
            $nom_tabla = "temp_finan_esp" ;
            $this->validarTablaTemporal($nom_tabla);
            $this->validarPrimerRegistro($listaRegistros[0]);
            $this->cargarInformacionTablaTemporal($listaRegistros);
            $this->validarInformacionArchivo($infoFinEspe);
           
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
     * Valida y obtiene la información específica de cada Financiacion según la estrucutura del archivo requerido
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoFinanciacion - Información básica de la financiacion  (mesaho)
     * @return array - Información de cada financiacion 
     * @throws MyException
     */
    private function procesarLineasFinanciacion (array $listaLineas, $infoFinEsp) {
        $listaRegistros = array();
        if (empty($listaLineas)) {
            throw new MyException('Error el archivo está vacío');
        }
        foreach ($listaLineas as $linea) 
        {
            $info = explode("|", $linea);
            if(count($info) != 12 ) 
            {
                throw new MyException("El Registro no tiene el formato esperado error en la línea ( $linea ) ", -1);
            }
            if($info[3] != $infoFinEsp['mesaho'] ) 
            {
                throw new MyException("El registro no pertenece al mes y año seleccionado.( $linea ) ", -1);
            }            
            if($info[5] < 0 ) 
            {
                throw new MyException("El Valor del BIO es inconsistente para el registro.( $linea ) ", -1);
            }            
            $registro['mua_cod'] = $info[0] ;
            $registro['mua_empresa'] = $info[1] ;
            $registro['lmf_fac'] = $info[2] ;            
            $registro['fin_mesaho'] = $info[3] ;            
            $registro['fin_vlrtotal'] = $info[4] ;
            $registro['fin_vlrbio'] = $info[5] ;
            $registro['fin_vlraprfijo'] = $info[6] ;
            $registro['fin_vlraprvar'] = $info[7] ;
            $registro['fin_vlrajuaprvar'] = $info[8] ;
            $registro['fin_vlrviatfijo'] = $info[9] ;
            $registro['fin_vlrviatvar'] = $info[10] ;
            $registro['tip_uso'] = $info[11] ;
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
            $tablaExiste = $this->cargarFinModel->validarExisteTabla($nom_tabla);
            if ($tablaExiste > 0) {
                $this->cargarFinModel->vaciarTablaMasiva($idEmpresa,$nom_tabla );
                return;
            }
            switch ($nom_tabla) {
                case "temp_finan_esp":
                     $this->cargarFinModel->crearTabMasivaFin();
                    break;
                case "esp_tem_act_fin":
                     $this->cargarFinModel->crearTabMasivaActFin();                
                    break;
            }
           
        } catch (\Exception $exc) {
            throw new MyException('Error al crear la tabla temporal', -1);
        }
    }
    
    /**
     * Se validará si el archivo ya se subió según la primera financiacion registrada
     * @param object $financiacion - Primer registro en el archivo 
     * @throws MyException
     */
    private function validarPrimerRegistro ($financiacion) {
        $respuesta = $this->cargarFinModel->validarRegistro($financiacion);
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
                //Si se reporta una financiacion por un valor 0 no se carga
                if ($registro['fin_vlrtotal'] <= 0) {
                    continue;
                }   
                $tip_suscripcion = $registro['tip_uso'];
                $mua_cod = $registro['mua_cod'];
                $lmf_fac = $registro['lmf_fac'];	
                $mua_empresa = $registro['mua_empresa'];
                $fin_mesaho = $registro['fin_mesaho'];
                $fin_vlrtotal = $registro['fin_vlrtotal'];
                $fin_vlrbio = $registro['fin_vlrbio'];
                $fin_vlraprfijo = $registro['fin_vlraprfijo'];
                $fin_vlraprvar = $registro['fin_vlraprvar'];
                $fin_vlrajuaprvar = $registro['fin_vlrajuaprvar'];
                $fin_vlrviatfijo = $registro['fin_vlrviatfijo'];
                $fin_vlrviatvar = $registro['fin_vlrviatvar'];
                $idEmpresa = $this->sesion->get('idempresa');
                $idProceso = $indice % NUMERO_HILOS_FIN_EMER_BIO ;
                $complemento .= "($tip_suscripcion,'$mua_cod',$lmf_fac,'$mua_empresa', '$fin_mesaho' , $fin_vlrtotal,$fin_vlrbio,$fin_vlraprfijo ,$fin_vlraprvar, $fin_vlrajuaprvar, $fin_vlrviatfijo , $fin_vlrviatvar ,$idProceso,'P', $idEmpresa),";
                //Se inserta a la tabla 5000 registros en una misma sentencia
                if ($contador == 5000 || $indice == $lengthArray - 1) {
                    $complemento = substr($complemento, 0, strlen($complemento) - 1);
                    $this->cargarFinModel->insertarMasiva($complemento);
                    $contador = -1;
                    $complemento = "";
                }
                $contador++;
            }
            //Se verifica que no queden registros sin insertar en la tabla temporal
            if (!empty($complemento)) {
                $complemento = substr($complemento, 0, strlen($complemento) - 1);
                $this->cargarFinModel->insertarMasiva($complemento);
            }            
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException('Error al cargar el archivo: ' . $ex->getMessage(), -1);
        }
    }
    
    /**
     * Permite validar si el archivo tiene la informacion minima necesaria así 
     * devuelve una cadena de texto con las facturas separadas por coma
     * @param array $infoFinan - Información de la subida de la financiacion (mesaño)
     * @return String - Numeros de factura
     * @throws MyException
     */
    private function validarInformacionArchivo($infoFinan) {
        try {
            $idEmpresa = $this->sesion->get('idempresa');
            $validacion = $this->cargarFinModel->validarInformacionTemporal($idEmpresa, $infoFinan['mesaho']);
            if (!empty($validacion)) {
                $this->cargarFinModel->eliminarRegistrosTotales($idEmpresa, 'P');
                throw new MyException($validacion[0]['mensaje'], -1);
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
     * Consulta el resultado del procesamiento de las financiaciones que se cargaron en el archivo
     * @return Object con arreglos del proceso correcto y los que presentaron inconvenientes
     */
    public function consultarResumen() {
        $idEmpresa = $this->sesion->get('idempresa');
        $nom_tabla = "temp_finan_esp" ;
        $tablaExiste = $this->cargarFinModel->validarExisteTabla($nom_tabla);

        if ($tablaExiste > 0) {
            $estados = "('A', 'P')" ;
            $resultado['resumencorrectos'] = $this->cargarFinModel->consultarResumen($idEmpresa, $estados);
            $resultado['resumenconerrores'] = $this->cargarFinModel->consultarResumenErrores($idEmpresa, 'F');
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
        $tablaExiste = $this->cargarFinModel->validarExisteTabla($tabla);

        if ($tablaExiste > 0) {
            $this->cargarFinModel->vaciarTablaMasiva($idEmpresa, $tabla);
            return;
        }
    } 
    
    // ************* proceso de Importar y aplicar Actualizacion a las financiaciones
    
     /**
     * Valida la información de las financiaciones a Actualizar del archivo que esté en el servidor y se 
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
     * Valida y obtiene la información específica de cada registro que actualizara 
     * la Financiacion según la estrucutura del archivo requerido
     * @param array $listaLineas - Lineas del archivo 
     * @return array - Información de la actualización de cada financiacion 
     * @throws MyException
     */
    private function procesarLineasActFin (array $listaLineas ) {
        $listaRegistros = array();
        if (empty($listaLineas)) {
            throw new MyException('Error el archivo está vacío');
        }
        foreach ($listaLineas as $linea) 
        {
            $info = explode("|", $linea);           
            if(count($info) != 8 ) 
            {
                throw new MyException("El Registro no tiene el formato esperado error en la línea ( $linea ) ", -1);
            }
            if((strlen($info[0])<1 or $info[0]==0) and strlen($info[2])<8 and (strlen($info[1])<12 or strlen($info[3])<6)) 
            {
                throw new MyException("El registro no tiene parametros suficientes para realizar la actualizacion.( $linea ) ", -1);
            }            
            if(strlen($info[4])<3 and $info[5] == -1  and $info[6] == -1 and $info[7] != 'f') 
            {
                throw new MyException("No hay parametros para Actualizar en el Registro...( $linea ) ", -1);
            } 
            if(!is_numeric($info[5]) or (strlen($info[5]))<1 OR !is_numeric($info[6]) or (strlen($info[6]))<1 )
            {
                throw new MyException("Los parametros de actualizacion son incorrectos...( $linea ) ", -1);
            } 
            if(($info[5] != -1 or $info[6] != -1 or strlen($info[4]) >= 3) and $info[7] == 'f' )
            {
                throw new MyException("Los parametros de actualizacion son incorrectos...( $linea ) ", -1);
            } 
            $registro['fin_ideregistro'] = $info[0] ;
            $registro['mua_cod'] = $info[1] ;
            $registro['lmf_fac'] = $info[2] ;            
            $registro['fin_mesaho'] = $info[3] ;            
            $registro['mua_empresa'] = $info[4] ;
            $registro['fin_tasa'] = $info[5] ;
            $registro['num_cuo'] = $info[6] ;  
            $registro['fin_est'] = $info[7] ;  
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }
    
     /**
     * Se validará si el archivo ya se subió según el primer registro
     * @param object $fina_act - Primer registro en el archivo 
     * @throws MyException
     */
    private function validarPrimerRegistroAct ($fina_act) {
        $respuesta = $this->cargarFinModel->validarRegistroAct($fina_act);
        if ($respuesta['fin_ideregistro'] != -1 ) {
            throw new MyException('Error, el archivo ya fue cargado por favor validar ', -1);
        }
    }
    
    /**
     * Método encargado de cargar los registros a la tabla temporal de actualizacion 
     * @param array  $listaRegistros lista registros que estaban en el archivo plano
     * @throws MyException Si el archivo ya fue cargado
     */
    private function cargarInfoTablaTempoAct($listaRegistros ) {
        try {
            $this->conexion->beginTransaction();
            $contador = 0;
            $complemento = "";
            $lengthArray = count($listaRegistros);
            foreach ($listaRegistros as $indice => $registro) {   
                $fin_ideregistro = ($registro['fin_ideregistro'] =='') ? 0 : $registro['fin_ideregistro']  ;
                $mua_cod = ($registro['mua_cod'] =='') ? 0 : $registro['mua_cod']  ;
                $lmf_fac  = ($registro['lmf_fac'] =='') ? 0 : $registro['lmf_fac']  ;
                $fin_mesaho = ($registro['fin_mesaho'] =='') ? 0 : $registro['fin_mesaho']  ;
                $mua_empresa = $registro['mua_empresa'] ;
                $fin_tasa = $registro['fin_tasa'];
                $num_cuo = $registro['num_cuo'] ;          
                $fin_est = $registro['fin_est'] ;          
                $idEmpresa = $this->sesion->get('idempresa');
                $idProceso = $indice % NUMERO_HILOS_FIN_ACT_EMER_BIO ; 
                $complemento .= "($fin_ideregistro,'$mua_cod', $lmf_fac, '$fin_mesaho', '$mua_empresa', $fin_tasa, $num_cuo, '$fin_est' , $idEmpresa,'P', $idProceso),";
                //Se inserta a la tabla 5000 registros en una misma sentencia
                if ($contador == 5000 || $indice == $lengthArray - 1) {
                    $complemento = substr($complemento, 0, strlen($complemento) - 1);
                    $this->cargarFinModel->insertarMasivaTmp($complemento);
                    $contador = -1;
                    $complemento = "";
                }
                $contador++;
            }
            //Se verifica que no queden registros sin insertar en la tabla temporal
            if (!empty($complemento)) {
                $complemento = substr($complemento, 0, strlen($complemento) - 1);
                $this->cargarFinModel->insertarMasivaTmp($complemento);
            }            
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException('Error al cargar el archivo: ' . $ex->getMessage(), -1);
        }
    }
    
     /**
     * Consulta el resultado del procesamiento de la actualizacion de financiaciones
     * @return Object con arreglos del proceso correcto y los que presentaron inconvenientes
     */
    public function consultarResumenAct() {
        $idEmpresa = $this->sesion->get('idempresa');
         $nom_tabla = "esp_tem_act_fin" ;
        $tablaExiste = $this->cargarFinModel->validarExisteTabla($nom_tabla);

        if ($tablaExiste > 0) {
            $estados = "('A', 'P')" ;
            $resultado['resumencorrectos'] = $this->cargarFinModel->consultarResumenAct($idEmpresa, $estados);
            $resultado['resumenconerrores'] = $this->cargarFinModel->consultarResumenErroresAct($idEmpresa, 'F');
            return $resultado;
        }
    } 
    
}
