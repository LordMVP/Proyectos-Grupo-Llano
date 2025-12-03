<?php

namespace Bioagricola\BioagricolaBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Bioagricola\BioagricolaBundle\Models\CargarPagosFinancModel;
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
class CargarPagosFinancDelegado {

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
    private $cargarPagModel;

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
        $this->cargarPagModel = new CargarPagosFinancModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->sesion = $sesion;
    }
    
    /**
     * Consulta el resultado del procesamiento de las financiaciones que se cargaron en el archivo
     * @return Object con arreglos del proceso correcto y los que presentaron inconvenientes
     */
    public function consultarResumen() {
        $idEmpresa = $this->sesion->get('idempresa');       
        $tablaExiste = $this->cargarPagModel->validarExisteTabla();

        if ($tablaExiste > 0) {
            $estados = "('A', 'P')" ;
            $resultado['resumencorrectos'] = $this->cargarPagModel->consultarResumen($idEmpresa, $estados);
            $resultado['resumenconerrores'] = $this->cargarPagModel->consultarResumenErrores($idEmpresa, 'F');
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
        $tablaExiste = $this->cargarPagModel->validarExisteTabla();

        if ($tablaExiste > 0) {
            $this->cargarPagModel->vaciarTablaMasiva($idEmpresa);
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
     * Valida la información de los pagos a subir y el archivo que esté en el servidor y se 
     * carga la información en base de datos
     * @param array $listaArchivo - Información del archivo subido en el servidor
     * @throws MyException
     */
    public function procesarArchivo(array $listaArchivo ) {
       
        $parametroInactivar['idprograma'] = PROGRAMA_PAG_FIN_ESP_BIO;
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
            $this->validarNombre($nombreArchivo, '/^FIN_ESP_PAG-/');
        
            $listaRegistros = $this->procesarLineasPagoFin($listaLineas);          
            //Si no se cargó ningún registro se muestra un error al usuario
            if (empty($listaRegistros)) {
                throw new MyException('Error al procesar el archivo', -1);
            } 
            $this->validarTablaTemporal();
            $this->validarPrimerRegistro($listaRegistros[0]);
            $this->cargarInformacionTablaTemporal($listaRegistros);
            $this->validarInformacionArchivo();
           
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
     * @return array - Información de cada pago 
     * @throws MyException
     */
    private function procesarLineasPagoFin (array $listaLineas ) {
        $listaRegistros = array();
        if (empty($listaLineas)) {
            throw new MyException('Error el archivo está vacío');
        }
        foreach ($listaLineas as $linea) 
        {
            $info = explode("|", $linea);
            if(count($info) != 10 ) 
            {
                throw new MyException("El Registro no tiene el formato esperado error en la línea ( $linea ) ", -1);
            }
            if(strlen($info[0])<12 OR !is_numeric($info[0])) 
            {
                throw new MyException("El Codigo de Usuario no es correcto.( $linea ) ", -1);
            } 
            if(strlen($info[1])<8 OR !is_numeric($info[0])) 
            {
                throw new MyException("El Numero de Factura no es correcto...( $linea ) ", -1);
            }            
            if(strlen($info[1])<6 OR !is_numeric($info[0])) 
            {
                throw new MyException("El Mes año no es correcto...( $linea ) ", -1);
            }            
            if( !is_numeric($info[2]) OR !is_numeric($info[4]) OR !is_numeric($info[5]) OR !is_numeric($info[6]) OR !is_numeric($info[7]) OR !is_numeric($info[8])) 
            {
                throw new MyException(" Error en el formato de los valores.( $linea ) ", -1);
            }       
            $registro['mua_cod'] = $info[0] ;
            $registro['lmf_fac'] = $info[1] ;
            $registro['idfinanciacion'] = $info[2] ;            
            $registro['pag_mesaho'] = $info[3] ;            
            $registro['pag_vlrtotal'] = $info[4] ;
            $registro['pag_vlrbio'] = $info[5] ;
            $registro['pag_vlrterfijo'] = $info[6] ;
            $registro['pag_vlrtervar'] = $info[7] ;
            $registro['pag_vlrteraju'] = $info[8] ;
            $registro['pag_tipopago'] = $info[9] ;
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
    private function validarTablaTemporal() {
        try {
            $idEmpresa = $this->sesion->get('idempresa');
            $tablaExiste = $this->cargarPagModel->validarExisteTabla();
            if ($tablaExiste > 0) {
                $this->cargarPagModel->vaciarTablaMasiva($idEmpresa);
                return;
            }       
            $this->cargarPagModel->crearTabMasiva();                   
        } catch (\Exception $exc) {
            throw new MyException('Error al crear la tabla temporal' . $exc->getMessage() , -1);
        }
    }
    
     /**
     * Se validará si el archivo ya se subió según el primer recaudo registrado
     * @param object $pago_finan - Primer registro en el archivo 
     * @throws MyException
     */
    private function validarPrimerRegistro ($pago_finan) {
         $pago_finan['id_empresa'] =  $this->sesion->get('idempresa');        
        $respuesta = $this->cargarPagModel->validarRegistro($pago_finan);
        if ($respuesta != -1 ) {
            throw new MyException('Error, el archivo ya fue cargado por favor validar ', -1);
        }
    }
    
     /**
     * Método encargado de cargar la informacion del archivo plano 
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
                $mua_cod = $registro['mua_cod'];
                $lmf_fac = $registro['lmf_fac'];	
                $idfinanciacion = $registro['idfinanciacion'];
                $pag_mesaho = $registro['pag_mesaho'];                
                $pag_vlrtotal = $registro['pag_vlrtotal'];     
                $pag_vlrbio = $registro['pag_vlrbio'];                
                $dpag_vlrterfijor = $registro['pag_vlrterfijo'];                
                $pag_vlrtervar = $registro['pag_vlrtervar'];                
                $pag_vlrteraju = $registro['pag_vlrteraju'];
                $pag_tipopago = $registro['pag_tipopago'];
                $pag_vlrsdo = 0 ;  
                $idEmpresa = $this->sesion->get('idempresa');
                $idProceso = $indice % NUMERO_HILOS_PAG_FIN_EMER_BIO ;               
                $complemento .= "('$mua_cod', $lmf_fac, $idfinanciacion, '$pag_mesaho', $pag_vlrtotal, $pag_vlrbio, $dpag_vlrterfijor, $pag_vlrtervar, $pag_vlrteraju, $pag_vlrsdo,'$pag_tipopago', $idProceso,'P', $idEmpresa),";
                //Se inserta a la tabla 5000 registros en una misma sentencia
                if ($contador == 5000 || $indice == $lengthArray - 1) {
                    $complemento = substr($complemento, 0, strlen($complemento) - 1);
                    $this->cargarPagModel->insertarMasiva($complemento);
                    $contador = -1;
                    $complemento = "";
                }
                $contador++;
            }
            //Se verifica que no queden registros sin insertar en la tabla temporal
            if (!empty($complemento)) {
                $complemento = substr($complemento, 0, strlen($complemento) - 1);
                $this->cargarPagModel->insertarMasiva($complemento);
            }            
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException('Error al cargar los pagos en la tabla temporal: ' . $ex->getMessage(), -1);
        }
    }
    /**
     * Permite validar si el archivo tiene la informacion minima necesaria así 
     * devuelve una cadena de texto con los pagos por coma
     * @return String - Numeros de factura
     * @throws MyException
     */
    private function validarInformacionArchivo() {
        try {
            $idEmpresa = $this->sesion->get('idempresa');
            $validacion = $this->cargarPagModel->validarInformacionTemporal($idEmpresa);
            if (!empty($validacion)) {
                $this->cargarPagModel->eliminarRegistrosTotales($idEmpresa, 'P');
                throw new MyException($validacion[0]['mensaje'], -1);
            }
        } catch (MyException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw new MyException('Error al procesar el archivo ', -1);
        }
    }
     /**
     * Consulta los registros de pagos que no fueron cargados por error
     * @return Object con los registros que se descargaran
     */
    public function consultarErrores() {      
        try {
            $parametros['id_empresa'] = $this->sesion->get('idempresa');
            $listaRegistros = $this->cargarPagModel->getRegistrosErrores($parametros);           
            $lengthArray = count($listaRegistros);
            $data = "";
            if ($lengthArray > 0)
            {           
                $line = 'mua_cod|lmf_fac|fin_ideregistro|mesaho|total|vlr_apl_bio|vlr_apl_ter_fij|vlr_ter_var|vlr_ter_ajuste|tipo pago|Mensaje'; 
                $data .= trim( $line ) . "\n" ;
                foreach ($listaRegistros as $indice => $registro) 
                {   
                    $line = ''; 
                    $value = $registro['mua_cod'] ."|"; 
                    $line .= $value;
                    $value = $registro['lmf_fac'] ."|" ;
                    $line .= $value;
                    $value = $registro['idfinanciacion']  ."|";
                    $line .= $value;
                    $value = $registro['pag_mesaho']  ."|";
                    $line .= $value;
                    $value = $registro['pag_vlrtotal'] ."|" ;                    
                    $line .= $value;
                    $value = $registro['pag_vlrbio'] ."|" ;
                    $line .= $value;
                    $value = $registro['pag_vlrterfijo']  ."|";
                    $line .= $value;
                    $value = $registro['pag_vlrtervar']  ."|";
                    $line .= $value;
                    $value = $registro['pag_vlrteraju'] ."|" ;
                    $line .= $value;
                    $value = $registro['pag_tipopago'] . "|";
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
            throw new MyException('Error al consultar los saldos DxD' . $ex->getMessage(), -1);
        }
    } 
     /**
     * Consulta los registros de pagos que quedaron con saldo por aplicar 
      * para que sean aplicados en DataEase
     * @return Object con los registros que se descargaran
     */
    public function consultarSaldos() {      
        try {
            $parametros['id_empresa'] = $this->sesion->get('idempresa');
            $parametros['id_usuario'] = $this->sesion->get('idusuario');
            $listaRegistros = $this->cargarPagModel->getRegistrosSaldoPago($parametros);           
            $lengthArray = count($listaRegistros);
            $data = "";
            if ($lengthArray > 0)
            {                    
//                $line = 'mua_cod|vlr Total Pago|total aplicado |saldo|tipo'; 
//                $data .= trim( $line ) . "\n" ;
                foreach ($listaRegistros as $indice => $registro) 
                {   
                    $line = ''; 
                    $value = $registro['mua_cod'] ."|"; 
                    $line .= $value;
                    $value = $registro['pag_vlrtotal'] ."|" ;
                    $line .= $value;
                    $value = $registro['aplicado']  ."|";
                    $line .= $value;
                    $value = $registro['pag_sdo']  ."|";
                    $line .= $value;
                    $value = $registro['pag_tipo']  ;                    
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
            throw new MyException('Error al consultar los saldos de los pagos aplicados' . $ex->getMessage(), -1);
        }
    } 
}
