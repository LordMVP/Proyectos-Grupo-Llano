<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\CargarRecaudosModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use \DateTime;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of CargarFactorCorreccionDelegado
 *
 * @author jeisson
 */
class CargarRecaudosDelegado {

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
     * @var CargarRecaudosModel 
     */
    private $cargarRecaudosModel;

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
        $this->cargarRecaudosModel = new CargarRecaudosModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->sesion = $sesion;
    }

    /**
     * Obtiene los medios de pago de la empresa según el usuario y el programa actual
     * @return Object DOM - Select de medio de pagos
     */
    public function getMediosPago() {
        $idUsuario = $this->sesion->get('idusuario');
        $idEmpresa = $this->sesion->get('idempresa');
        $resultado = $this->cargarRecaudosModel->getMediosPago(PROGRAMA_CARGAR_RECAUDOS, $idUsuario, $idEmpresa);
        $listaDatos = array();
        foreach ($resultado as $campos) {
            $listaDatos[$campos['id']] = $campos['nombre'];
        }
        return Util::crearCombo('cmbMedioPago', $listaDatos);
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
     * Valida la información de los recaudos a subir y el archivo que esté en el servidor y se 
     * carga la información en base de datos
     * @param array $listaArchivo - Información del archivo subido en el servidor
     * @param array $infoRecaudo -  Información básica del recaudo (Parámetros del recaudo 
     * @throws MyException
     */
    public function procesarArchivo(array $listaArchivo, array $infoRecaudo) {
       
        $parametroInactivar['idprograma'] = PROGRAMA_CARGAR_RECAUDOS;
        $parametroInactivar['idempresa'] = $this->sesion->get('idempresa');
        if (empty($listaArchivo)) {
            $this->inactivarControlEjecucionProceso($parametroInactivar);
            throw new MyException('Error al subir el archivo plano', -1);
        }
        try {
            $listaRegistros = $this->procesarArchivoPorRecaudador($listaArchivo[0], $infoRecaudo);

            //Añadido por andres, if para saltar a medio de pago were
            if ($infoRecaudo['idmediopago'] != RECAUDADOR_WERE) {
                $this->validarTablaTemporal();
                $this->validarPrimerRecaudo($listaRegistros[0]);
                //$this->eliminarInformacionTablaTemporalQuitar($listaRegistros, $infoRecaudo);
                $this->cargarInformacionTablaTemporal($listaRegistros, $infoRecaudo);
                $this->validarInformacionArchivo($infoRecaudo);
            } else {
           
                $this->regitrarPago($listaRegistros, $infoRecaudo);
            }
        } catch (\Exception $ex1) {
            $this->inactivarControlEjecucionProceso($parametroInactivar);
            throw new MyException($ex1->getMessage(), $ex1->getCode());
        }
    }

    /**
     * Se procesa el archivo de acuerdo al recaudador seleccionado en la interfaz
     * @param object $infoArchivo información del archivo (ruta,tipo,nombre)
     * @param array $infoRecaudo información del recaudo (Método de pago, sucursal, fecha)
     * @return type
     * @throws MyException Error al procesar el archivo
     */
    private function procesarArchivoPorRecaudador($infoArchivo, $infoRecaudo) {
        $archivo = $infoArchivo['rutaarchivo'];
        $listaLineas = $this->leerArchivo($archivo);
        $nombre = $infoArchivo['nombrearchivo'];
        $nombreArchivo = str_replace(".txt", '', $nombre);
        switch ($infoRecaudo['idmediopago']) {
            case RECAUDADOR_COTREM:
                //Se valida que el nombre empiece con el nombre LLGAS-
                $this->validarNombre($nombreArchivo, '/^BIOAG-|^LLGAS-/');
                //Si la sucursal es de villavicencio se valida el nombre
                //Que concetenga el 50001
                if ($infoRecaudo['idsucursal'] == 1) {
                    $this->validarNombre($nombreArchivo, '/^LLGAS-50001-/');
                }
                if ($infoRecaudo['idsucursal'] != 1) {
                    $this->validarNombre($nombreArchivo, '/^BIOAG-|^LLGAS-99999-/');
                }
                $listaRegistros = $this->procesarLineasCotrem($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_CONSUERTE:
                $this->validarNombre($nombreArchivo, "/^Recaudo_Bioagricola_totaldia|^recaudo_llanogas_/");
                $listaRegistros = $this->procesarLineasConsuerte($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_ATH:
                $this->validarNombre($nombreArchivo, "/^Bioag|^BioLlan|^Llano|^Cusiana(([0-9]{8}))/");
                $listaRegistros = $this->procesarLineasATH($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_BANCOPOPULAR:
                $this->validarNombre($nombreArchivo, '/^POPULAR([0-9]{8})/');
                $listaRegistros = $this->procesarLineasBancoPopular($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_REDMULTICOLOR:
                $this->validarNombre($nombreArchivo, '/^R([0-9]{7})/');
                $listaRegistros = $this->procesarLineasRedMulticolor($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_BANCOBOGOTA:
                $this->validarNombre($nombreArchivo, '/[0-9]{12}/');
                $listaRegistros = $this->procesarLineasBancoBogota($listaLineas, $infoRecaudo);
                break;
	    case RECAUDADOR_RECAUDO_OFICINA:
                    $this->validarNombre($nombreArchivo, '/[0-9]{12}/');
                    $listaRegistros = $this->procesarLineasBancoBogota($listaLineas, $infoRecaudo);
                    break;
            case RECAUDADOR_COLPATRIA:
                $this->validarNombre($nombreArchivo, '/^RECLLANO([0-9]{8})/');
                $listaRegistros = $this->procesarLineasColpatria($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_BIOAGRICOLA:
                $this->validarNombre($nombreArchivo, '/^PAGGAS/');
                $listaRegistros = $this->procesarLineasBioagricola($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_ATHBARRAS:
                $this->validarNombre($nombreArchivo, '/^BioagricoB|^LLANOGAS|^LLANOGASB([0-9]{8})/');
                $listaRegistros = $this->procesarLineasATHBarras($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_DAVIVIENDA:
                $this->validarNombre($nombreArchivo, '/^DAVIVIENDA/');
                $listaRegistros = $this->procesarLineasDavivienda($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_GANE:
                $this->validarNombre($nombreArchivo, '/^Archivo_LLANOGAS_|^Archivo_CUSIANA_/');
                $listaRegistros = $this->procesarLineasGane($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_LIBRANZA_POTENZA:
                $this->validarNombre($nombreArchivo, '/^Archivo_POTENZA_/');
                $listaRegistros = $this->procesarLineasrecaudosPotenza($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_LIBRANZA_ACCIONES:
                $this->validarNombre($nombreArchivo, '/^Archivo_ACCIONES_/');
                $listaRegistros = $this->procesarLineasrecaudosPotenza($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_LIBRANZA_ALIS:
                $this->validarNombre($nombreArchivo, '/^Archivo_ALIS_/');
                $listaRegistros = $this->procesarLineasrecaudosPotenza($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_LIBRANZA_BIOAGRICOLA:
                $this->validarNombre($nombreArchivo, '/^Archivo_BIOAGRICOLA_/');
                $listaRegistros = $this->procesarLineasrecaudosPotenza($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_LIBRANZA_CUSIANA:
                $this->validarNombre($nombreArchivo, '/^Archivo_CUSIANALIB_/');
                $listaRegistros = $this->procesarLineasrecaudosPotenza($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_LIBRANZA_LLANOGAS:
                $this->validarNombre($nombreArchivo, '/^Archivo_LLANOLIB_/');
                $listaRegistros = $this->procesarLineasrecaudosPotenza($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_EMPRESARIAL_CUSIANA:
                $this->validarNombre($nombreArchivo, '/^Archivo_CUSIANAEMP_/');
                $listaRegistros = $this->procesarLineasrecaudosPotenza($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_EMPRESARIAL_LLANO:
                $this->validarNombre($nombreArchivo, '/^Archivo_LLANOEMP_/');
                $listaRegistros = $this->procesarLineasrecaudosPotenza($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_EFECTY:
                $this->validarNombre($nombreArchivo, '/^LLANOGAS110933_|^Efecty|^CLAAYASE_Asobancaria2001|^YENRODFL_Asobancaria2001/');
                $listaRegistros = $this->procesarLineasEfecty($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_LIBRANZA_CONVBOGOTA:
                $this->validarNombre($nombreArchivo, '/^Archivo_CONVBOGOTA_/');
                $listaRegistros = $this->procesarLineasrecaudosPotenza($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_EMSA:
                $this->validarNombre($nombreArchivo, '/^411BIO_([0-9]{8})/');
                $listaRegistros = $this->procesarLineasEmsa($listaLineas, $infoRecaudo);
                break;
            // Añadido por Andres, para cargar los recaudos no confirmados
            case RECAUDADOR_WERE:
                $this->validarNombre($nombreArchivo, '/^Archivo_WERE_/');
                $listaRegistros = $this->procesarLineasrecaudosWere($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_APACHE_POTENZA:
                $this->validarNombre($nombreArchivo, '/^Archivo_APACHE_/');
                $listaRegistros = $this->procesarLineasrecaudosPotenza($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_SCOTIABANK:
                $this->validarNombre($nombreArchivo, "/^SCOTIABANK/");
                $listaRegistros = $this->procesarLineasScotiabank($listaLineas, $infoRecaudo);
                break;
            case RECAUDADOR_BBVA:
                $this->validarNombre($nombreArchivo, '/^BBVA([0-9]{8})/');
                $listaRegistros = $this->procesarLineasBancoBogota($listaLineas, $infoRecaudo);
                break;

        }

        //Si no se cargó ningún registro se muestra un error al usuario
        if (empty($listaRegistros)) {
            throw new MyException('Error al procesar el archivo', -1);
        }
        return $listaRegistros;
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
     * Se valida que la tabla temporal exista y si existe se pasan todos los registros 
     * a estado 'C'
     * @return type
     * @throws MyException
     */
    private function validarTablaTemporal() {
        try {
            $idEmpresa = $this->sesion->get('idempresa');
            $tablaExiste = $this->cargarRecaudosModel->validarExisteTabla();
            if ($tablaExiste > 0) {
                $this->cargarRecaudosModel->vaciarTablaMasiva($idEmpresa);
                return;
            }
            $this->cargarRecaudosModel->crearTablaMasiva();
        } catch (\Exception $exc) {
            throw new MyException('Error al crear la tabla temporal', -1);
        }
    }

    /**
     * Método encargado de cargar los registros a la tabla temporal 
     * @param array  $listaRegistros lista registros que estaban en el archivo plano
     * @param type $infoRecaudo información con el cuál se esta cargando la información
     * @throws MyException Si el archivo ya fue cargado
     */
    private function cargarInformacionTablaTemporal($listaRegistros, $infoRecaudo) {
        try {
            $this->conexion->beginTransaction();
            $contador = 0;
            $complemento = "";
            $lengthArray = count($listaRegistros);
            foreach ($listaRegistros as $indice => $registro) {
                //Si se reporta un pago por un valor 0 no se carga
                if ($registro['valor'] <= 0) {
                    continue;
                }

                $valor = $registro['valor'];
                $fechaPago = $registro['fechapago'];
                $validacionFecha = $this->cargarRecaudosModel->validarFechaPago($fechaPago);
                if ($validacionFecha['diferenciaminutos'] < 0) {
                    throw new MyException(", o la fecha de Pago  " . $validacionFecha['fechapago'] . " no puede ser mayor a la fecha actual del sistema :" . $validacionFecha['fechaactual'], -1);
                }

                $idMedioPago = $registro['idmediopago'];
                $idSucursal = $infoRecaudo['idsucursal'];
                $idFormaPago = $infoRecaudo['idformapago'];
                $idsuscripcion = $registro['idsuscripcion'];
                $idfinanciacion = ($registro['num_financiacion']) ? $registro['num_financiacion'] : 0;
                $idfactura = $registro['num_factura'] ? $registro['num_factura'] : 0;
                $idEmpresa = $this->sesion->get('idempresa');
                $idProceso = $indice % NUMERO_HILOS_CARGAR_RECAUDOS;
                $complemento .= "($idsuscripcion,$valor,'$fechaPago',$idMedioPago,$idFormaPago,$idProceso,'P', $idSucursal, $idEmpresa,$idfinanciacion, $idfactura ),";
                //Se inserta a la tabla 5000 registros en una misma sentencia
                if ($contador == 5000 || $indice == $lengthArray - 1) {
                    $complemento = substr($complemento, 0, strlen($complemento) - 1);
                    $this->cargarRecaudosModel->insertarMasiva($complemento);
                    $contador = -1;
                    $complemento = "";
                }
                $contador++;
            }
            //Se verifica que no queden registros sin insertar en la tabla temporal
            if (!empty($complemento)) {
                $complemento = substr($complemento, 0, strlen($complemento) - 1);
                $this->cargarRecaudosModel->insertarMasiva($complemento);
            }
            //Se valida que si vienen registros repetidos se asigna a un mismo proceso
            $this->cargarRecaudosModel->modificarProcesoRecaudosRepetidos();
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException('Error, el archivo ya fue cargado o la suscripción ya tiene un recaudo para ese mismo dia, valor, medio pago, forma de pago y fecha ' . $ex->getMessage(), -1);
        }
    }

    /**
     * Permite validar si el archivo tiene toda la información consistente de ser así 
     * devuelve una cadena de texto con las suscripciones separadas por coma
     * @param array $listaRegistros - Recaudos registrados en el archivo
     * @param array $infoRecaudo - Información de la subida del recaudo (recaudador, mediopago, sucursal)
     * @return String - Ids de suscripción 
     * @throws MyException
     */
    private function validarInformacionArchivo($infoRecaudo) {
        try {
            $idEmpresa = $this->sesion->get('idempresa');
            $validacion = $this->cargarRecaudosModel->validarInformacionTemporal($idEmpresa, 5, MAXIMO_PAGO_CARGUE_RECAUDOS, $infoRecaudo['idmediopago']);
            if (!empty($validacion)) {
                $this->cargarRecaudosModel->eliminarPagosTotales($idEmpresa, 'P');
                throw new MyException($validacion[0]['mensaje'], -1);
            }
        } catch (MyException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw new MyException('Error al procesar el archivo ', -1);
        }
    }

    /**
     * Se validará si el archivo ya se subió según el primer recaudo registrado
     * @param object $recaudo - Primer registro en el archivo 
     * @throws MyException
     */
    private function validarPrimerRecaudo($recaudo) {
        $respuesta = $this->cargarRecaudosModel->validarRecaudo($recaudo);
        if ($respuesta == $recaudo['valor']) {
            throw new MyException('Error, el archivo ya fue cargado o el primer Registro tiene Valor  0 ', -1);
        }
    }

    /**
     * Valida y obtiene la información específica de cada recaudo según la estrucutura del archivo enviado por Cotrem
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoRecaudo - Información básica del recaudo (recaudador, mediopago, sucursal)
     * @return array - Información de cada recaudo 
     * @throws MyException
     */
    private function procesarLineasCotrem(array $listaLineas, $infoRecaudo) {
        if (empty($listaLineas)) {
            throw new MyException('El archivo no tiene líneas', -1);
        }
        $listaRegistros = array();
        $linea = $listaLineas[0];
        $infoRecaudo['fechapago'] = substr($linea, 40, 4) . '-' . substr($linea, 44, 2) . '-' . substr($linea, 46, 2);
        for ($i = 2; $i < count($listaLineas) - 2; $i++) {
            $lineaConEspacio = $listaLineas[$i];
            $linea = rtrim($lineaConEspacio);
            $longitud = strlen(trim($linea));
            if ($longitud != 155) {
                throw new MyException('El archivo no tiene el formato esperado', -1);
            }
            $registro['idsuscripcion'] = substr($linea, 42, 8) / 1;
            $registro['fechapago'] = $infoRecaudo['fechapago'] . ' ' . substr($linea, 87, 2) . ':' . substr($linea, 89, 2) . ':' . substr($linea, 91, 2);
            $registro['valor'] = substr($linea, 50, 12) / 1;
            $registro['idmediopago'] = $infoRecaudo['idmediopago'];
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }

    /**
     * Valida y obtiene la información específica de cada recaudo según la estrucutura del archivo enviado por Consuerte
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoRecaudo - Información básica del recaudo (recaudador, mediopago, sucursal)
     * @return array - Información de cada recaudo 
     * @throws MyException
     */
    private function procesarLineasConsuerte(array $listaLineas, $infoRecaudo) {
        if (empty($listaLineas)) {
            throw new MyException('El archivo no tiene líneas', -1);
        }
        $listaRegistros = array();
        $linea = $listaLineas[0];
        $infoRecaudo['fechapago'] = substr($linea, 40, 4) . '-' . substr($linea, 44, 2) . '-' . substr($linea, 46, 2);
        for ($i = 2; $i < count($listaLineas) - 2; $i++) {
            $linea = $listaLineas[$i];
            if (strlen(trim($linea)) != 159) {
                throw new MyException('El archivo no tiene el formato esperado (' . $linea . ')', -1);
            }
            $registro['idsuscripcion'] = substr($linea, 42, 8) / 1;
            $registro['fechapago'] = $infoRecaudo['fechapago'] . ' ' . substr($linea, 87, 2) . ':' . substr($linea, 89, 2) . ':' . substr($linea, 91, 2);
            $registro['valor'] = substr($linea, 50, 12) / 1;
            ;
            $registro['idmediopago'] = $infoRecaudo['idmediopago'];
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }

    /**
     * Valida y obtiene la información específica de cada recaudo según la estrucutura del archivo enviado por Red Multicolor
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoRecaudo - Información básica del recaudo (recaudador, mediopago, sucursal)
     * @return array - Información de cada recaudo 
     * @throws MyException
     */
    private function procesarLineasRedMulticolor(array $listaLineas, $infoRecaudo) {
        $listaRegistros = array();
        for ($i = 1; $i < count($listaLineas) - 1; $i++) {
            $linea = $listaLineas[$i];
            if (strlen($linea) != 64) {
                throw new MyException('El archivo no tiene el formato esperado', -1);
            }
            $registro['idsuscripcion'] = substr($linea, 4, 8) / 1;
            $registro['fechapago'] = '20' . substr($linea, 50, 2) . '-' . substr($linea, 52, 2) . '-' . substr($linea, 54, 2);
            $registro['valor'] = substr($linea, 12, 23) / 1; //+ substr($linea, 35, 13) / 1;
            $registro['idmediopago'] = $infoRecaudo['idmediopago'];
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }

    /**
     * Valida y obtiene la información específica de cada recaudo según la estrucutura del archivo enviado por Colpatria
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoRecaudo - Información básica del recaudo (recaudador, mediopago, sucursal)
     * @return array - Información de cada recaudo 
     * @throws MyException
     */
    private function procesarLineasColpatria(array $listaLineas, $infoRecaudo) {
        $listaRegistros = array();
        for ($i = 1; $i < count($listaLineas) - 1; $i++) {
            $linea = $listaLineas[$i];
            if (strlen($linea) != 64) {
                throw new MyException('El archivo no tiene el formato esperado (' . $linea . ')', -1);
            }
            $registro['idsuscripcion'] = substr($linea, 4, 8) / 1;
            $registro['fechapago'] = '20' . substr($linea, 50, 2) . '-' . substr($linea, 52, 2) . '-' . substr($linea, 54, 2);
            $registro['valor'] = substr($linea, 12, 23) / 1; //+ substr($linea, 35, 13) / 1;
            $registro['idmediopago'] = $infoRecaudo['idmediopago'];
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }

    /**
     * Valida y obtiene la información específica de cada recaudo según la estrucutura del archivo enviado por Bioagrícola
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoRecaudo - Información básica del recaudo (recaudador, mediopago, sucursal)
     * @return array - Información de cada recaudo 
     * @throws MyException
     */
    private function procesarLineasBioagricola(array $listaLineas, $infoRecaudo) {
        $listaRegistros = array();
        if (empty($listaLineas)) {
            throw new MyException('Error el archivo está vacío');
        }
        foreach ($listaLineas as $linea) {
            $info = explode(";", $linea);
            if (count($info) != 5) {
                throw new MyException("El archivo no tiene el formato esperado error en la línea ( $linea ) ", -1);
            }
            $registro['fechapago'] = $info[3] . ' ' . $info[2];
            $registro['idsuscripcion'] = $this->genericoModel->getSuscripcionCodigoAnterior(trim($info[0]));
            $registro['valor'] = str_replace(',', '', trim($info[1])) / 1;
            $registro['idmediopago'] = $infoRecaudo['idmediopago'];
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }

    /**
     * Valida y obtiene la información específica de cada recaudo según la estrucutura del archivo enviado por Potenza
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoRecaudo - Información básica del recaudo (recaudador, mediopago, sucursal)
     * @return array - Información de cada recaudo 
     * @throws MyException
     */
    private function procesarLineasrecaudosPotenza(array $listaLineas, $infoRecaudo) {
        $listaRegistros = array();
        if (empty($listaLineas)) {
            throw new MyException('Error el archivo está vacío');
        }
        foreach ($listaLineas as $linea) {
            $info = explode(";", $linea);
            $registro['num_financiacion'] = 0;
            $registro['num_factura'] = 0;
            switch (count($info)) {
                case 6:
                    $registro['num_financiacion'] = $info[5];
                    break;
                case 7:
                    $registro['num_financiacion'] = $info[5];
                    $registro['num_factura'] = $info[6];
                    break;
                case 5:
                    break;
                default :
                    throw new MyException("El archivo no tiene el formato esperado error en la línea ( $linea ) ", -1);
                    break;
            }
            $registro['fechapago'] = $info[3] . ' ' . $info[2];
            $registro['idsuscripcion'] = $this->genericoModel->consultarInformacionSuscripcion($info[4])['idsuscripcion'];
            $registro['valor'] = str_replace(',', '', trim($info[1])) / 1;
            $registro['idmediopago'] = $infoRecaudo['idmediopago'];
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }

    /**
     * Valida y obtiene la información específica de cada recaudo según la estrucutura del archivo enviado por Potenza
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoRecaudo - Información básica del recaudo (recaudador, mediopago, sucursal)
     * @return array - Información de cada recaudo 
     * @throws MyException
     */
    private function procesarLineasrecaudosWere(array $listaLineas, $infoRecaudo) {
        $listaRegistros = array();
        if (empty($listaLineas)) {
            throw new MyException('Error el archivo está vacío');
        }
        foreach ($listaLineas as $linea) {
            $info = explode("|", $linea);
            if (count($info) != 7) {
                throw new MyException("El archivo no tiene el formato esperado error en la línea ( $linea ) ", -1);
            }elseif(!is_numeric ($info[0]) ){ 
                continue;
            }else {
                $registro['CustPermId'] = $info[0];
                $registro['CustLoginId'] = $info[1];
                $registro['ClientDt'] = $info[2];
                $registro['RqUID'] = $info[3];
                $registro['OriginatorName'] = $info[4];
                $registro['Amt'] = $info[5];
                $registro['RefId1'] = $info[6];
            }
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }

    /**
     * Valida y obtiene la información específica de cada recaudo según la estrucutura del archivo enviado por Banco de Bogotá
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoRecaudo - Información básica del recaudo (recaudador, mediopago, sucursal)
     * @return array - Información de cada recaudo 
     * @throws MyException
     */
    private function procesarLineasBancoBogota(array $listaLineas, $infoRecaudo) {
        if (empty($listaLineas)) {
            throw new MyException('Error el archivo no contiene líneas', -1);
        }
        $listaRegistros = array();
        $linea = $listaLineas[0];
        $infoRecaudo['fechapago'] = substr($linea, 12, 4) . '-' . substr($linea, 16, 2) . '-' . substr($linea, 18, 2);
        for ($i = 2; $i < count($listaLineas) - 2; $i++) {
            $linea = $listaLineas[$i];
            if (strlen(trim($linea)) != 94) {
                throw new MyException('El archivo no tiene el formato esperado (' . $linea . ')', -1);
            }
            $registro['idsuscripcion'] = substr($linea, 42, 8) / 1;
            $registro['fechapago'] = $infoRecaudo['fechapago'];
            $registro['valor'] = substr($linea, 50, 12) / 1;
            $registro['idmediopago'] = $infoRecaudo['idmediopago'];
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }

    /**
     * Valida y obtiene la información específica de cada recaudo según la estrucutura del archivo enviado por ATH
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoRecaudo - Información básica del recaudo (recaudador, mediopago, sucursal)
     * @return array - Información de cada recaudo 
     * @throws MyException
     */
    private function procesarLineasATH(array $listaLineas, $infoRecaudo) {
        $listaRegistros = array();
        for ($i = 1; $i < count($listaLineas) - 1; $i++) {
            $linea = $listaLineas[$i];
            if (strlen($linea) != 64) {
                throw new MyException('El archivo no tiene el formato esperado (' . $linea . ')', -1);
            }
            $registro['idsuscripcion'] = substr($linea, 4, 8) / 1;
            $registro['fechapago'] = '20' . substr($linea, 50, 2) . '-' . substr($linea, 52, 2) . '-' . substr($linea, 54, 2);
            $registro['valor'] = substr($linea, 24, 11) / 1; // + substr($linea, 35, 13) / 1;
            $registro['idmediopago'] = $infoRecaudo['idmediopago'];
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }

    /**
     * Valida y obtiene la información específica de cada recaudo según la estrucutura del archivo enviado por ATH Barras
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoRecaudo - Información básica del recaudo (recaudador, mediopago, sucursal)
     * @return array - Información de cada recaudo 
     * @throws MyException
     */
    private function procesarLineasATHBarras(array $listaLineas, $infoRecaudo) {
        $listaRegistros = array();
        for ($i = 1; $i < count($listaLineas) - 1; $i++) {
            $linea = $listaLineas[$i];
            if (strlen($linea) != 64) {
                throw new MyException('El archivo no tiene el formato esperado (' . $linea . ')', -1);
            }
            $registro['idsuscripcion'] = substr($linea, 4, 8) / 1;
            $registro['fechapago'] = '20' . substr($linea, 50, 2) . '-' . substr($linea, 52, 2) . '-' . substr($linea, 54, 2);
            $registro['valor'] = substr($linea, 24, 11) / 1;
            $registro['idmediopago'] = $infoRecaudo['idmediopago'];
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }

    /**
     * Valida y obtiene la información específica de cada recaudo según la estrucutura del archivo enviado por Banco Popular
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoRecaudo - Información básica del recaudo (recaudador, mediopago, sucursal)
     * @return array - Información de cada recaudo 
     * @throws MyException
     */
    private function procesarLineasBancoPopular(array $listaLineas, $infoRecaudo) {
        $listaRegistros = array();
        if (empty($listaLineas)) {
            throw new MyException('Error el archivo está vacío');
        }
        foreach ($listaLineas as $linea) {
            $info = explode(";", $linea);
            if (count($info) <= 2) {
                throw new MyException('El archivo no tiene el formato esperado (' . $linea . ')', -1);
            }
            $infoFecha = explode("/", $info[0]);
            $registro['fechapago'] = $infoFecha[2] . '-' . $infoFecha[1] . '-' . $infoFecha[0] . ' ' . $info[1];
            $registro['idsuscripcion'] = $this->genericoModel->getSuscripcionCodigoAnterior($info[8]);
            $registro['valor'] = $info[18];
            $registro['idmediopago'] = $infoRecaudo['idmediopago'];
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }

    /**
     * Valida y obtiene la información específica de cada recaudo según la estrucutura del archivo enviado por Davivienda
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoRecaudo - Información básica del recaudo (recaudador, mediopago, sucursal)
     * @return array - Información de cada recaudo 
     * @throws MyException
     */
    private function procesarLineasDavivienda(array $listaLineas, $infoRecaudo) {
        $listaRegistros = array();
        if (empty($listaLineas)) {
            throw new MyException('Error el archivo está vacío');
        }
        foreach ($listaLineas as $linea) {
            $info = explode(";", $linea);
            $infoFecha = explode("/", $info[0]);
            $registro['fechapago'] = $infoFecha[2] . '-' . $infoFecha[1] . '-' . $infoFecha[0] ;
            $registro['idsuscripcion'] = $info[1]; //$this->genericoModel->getSuscripcionCodigoAnterior($info[8]);
            $registro['valor'] = $info[2];
            $registro['idmediopago'] = $infoRecaudo['idmediopago'];
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }

    /**
     * Valida y obtiene la información específica de cada recaudo según la estrucutura del archivo enviado por Gane
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoRecaudo - Información básica del recaudo (recaudador, mediopago, sucursal)
     * @return array - Información de cada recaudo 
     * @throws MyException
     */
    private function procesarLineasGane(array $listaLineas, $infoRecaudo) {
        if (empty($listaLineas)) {
            throw new MyException('El archivo no tiene líneas', -1);
        }
        $listaRegistros = array();
        $linea = $listaLineas[0];
        $infoRecaudo['fechapago'] = substr($linea, 40, 4) . '-' . substr($linea, 44, 2) . '-' . substr($linea, 46, 2);
        for ($i = 2; $i < count($listaLineas) - 2; $i++) {
            $linea = $listaLineas[$i];
            if (strlen($linea) != 155) {
                throw new MyException('El archivo no tiene el formato esperado', -1);
            }
            $registro['idsuscripcion'] = substr($linea, 42, 8) / 1;
            $registro['fechapago'] = $infoRecaudo['fechapago'] . ' ' . substr($linea, 87, 2) . ':' . substr($linea, 89, 2) . ':' . substr($linea, 91, 2);
            $registro['valor'] = substr($linea, 50, 12) / 1; //+ substr($linea, 35, 13) / 1;
            $registro['idmediopago'] = $infoRecaudo['idmediopago'];
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }

    /**
     * Valida y obtiene la información específica de cada recaudo según la estrucutura del archivo enviado por Efecty
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoRecaudo - Información básica del recaudo (recaudador, mediopago, sucursal)
     * @return array - Información de cada recaudo 
     * @throws MyException
     */
    private function procesarLineasEfecty(array $listaLineas, $infoRecaudo) {
        $listaRegistros = array();
        if (empty($listaLineas)) {
            throw new MyException('Error el archivo está vacío');
        }
        /*
         * Se ajusta el numero de lineas a no tener en cuenta en el cargue , porque al final viene un linea con un espacio, y antes la linea
         * de resumen y antes se estaba ignorando solo una linea .
         */
        for ($i = 1; $i < count($listaLineas) - 1; $i++) {
            $linea = $listaLineas[$i];
            $info = explode("|", $linea);
            if (count($info) != 9) {
                throw new MyException("El archivo no tiene el formato esperado error en la línea ( $linea ) ", -1);
            }
            $registro['fechapago'] = $info[3];
            $registro['idsuscripcion'] = str_replace('"', '', $info[1]);
            $registro['valor'] = trim($info[2]);
            $registro['idmediopago'] = $infoRecaudo['idmediopago'];
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }

    /**
     * Consulta el resultado del procesamiento de los recaudos que se cargaron en el archivo
     * @return Object con arreglos del proceso correcto y los que presentaron inconvenientes
     */
    public function consultarResumen() {
        $idEmpresa = $this->sesion->get('idempresa');
        $tablaExiste = $this->cargarRecaudosModel->validarExisteTabla();

        if ($tablaExiste > 0) {
            $resultado['resumencorrectos'] = $this->cargarRecaudosModel->consultarResumen($idEmpresa, 'A');
            $resultado['resumenconerrores'] = $this->cargarRecaudosModel->consultarResumenErrores($idEmpresa, 'F');
            return $resultado;
        }
    }

    /**
     * Valida que si la tabla temporal existe se le cambian todos los registros al estado 'C'
     * @return type
     */
    public function eliminarTablaTemporal() {
        $idEmpresa = $this->sesion->get('idempresa');
        $tablaExiste = $this->cargarRecaudosModel->validarExisteTabla();

        if ($tablaExiste > 0) {
            $this->cargarRecaudosModel->vaciarTablaMasiva($idEmpresa);
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
     * Valida y obtiene la información específica de cada recaudo según la estrucutura del archivo enviado por la EMSA
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoRecaudo - Información básica del recaudo (recaudador, mediopago, sucursal)
     * @return array - Información de cada recaudo 
     * @throws MyException
     */
    private function procesarLineasEmsa(array $listaLineas, $infoRecaudo) {
        $listaRegistros = array();
        if (empty($listaLineas)) {
            throw new MyException('Error el archivo está vacío');
        }
        for ($i = 1; $i < count($listaLineas); $i++) {
            $linea = $listaLineas[$i];

            $info = explode(";", $linea);
            if (count($info) != 8) {
                throw new MyException("El archivo no tiene el formato esperado error en la línea ( $linea ) ", -1);
            }
            $registro['fechapago'] = $info[0] . '-' . $info[1] . '-' . substr($info[4], 0, 2);
            $registro['idsuscripcion'] = $this->genericoModel->consultarInformacionSuscripcion($info[3])['idsuscripcion'];
            $registro['valor'] = trim($info[7]) / 1;
            $registro['idmediopago'] = $infoRecaudo['idmediopago'];
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }

    
    /**
     * Registra los pagos de were no confirmados
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoRecaudo - Información básica del recaudo (recaudador, mediopago, sucursal)
     * @throws MyException
     */
    private function regitrarPago($listaRegistros, $infoRecaudo) {        
        foreach ($listaRegistros as $indice => $registro) {
            $factura;
            $idRecaudoWeb=0;
            $estado_Detalle = 'OK';
            $estado_Det_Des = 'PENDIENTE';
            //Empresa
            $id_Empresa = $registro['CustPermId'];
            //fecha transaccion
            $fectrans = $registro['ClientDt'];
            //numero de referencia
            $num_referencia = $registro['RefId1'];
            //numero de la transaccion
            $nunTrans = $registro['RqUID'];
            //valor del pago
            $valPago = $registro['Amt'];
            //Este es para quitarle los ceros que vienen de mas??
            $valPago = (strlen($valPago) > 2) ? substr($valPago, 0, (strlen($valPago)) - 2) : "0";
            // nit del recuadador
            $nit_recaudador = $registro['CustLoginId'];
            // numero de la oficina
            $oficina = $registro['OriginatorName'];
            //Parsear fecha en ddMMyyyyHHmmss es la misma fechaser
            //nota debe ser la misma fecha de la transaccion
            $fechaResTr = new DateTime($fectrans);            
            try {
                // Oficina para consulta
                $oficina = "mediopago_".$oficina;
                //Consulta de prametros                            
                $param = $this->cargarRecaudosModel->consultar_Parametros($nit_recaudador, $id_Empresa, $oficina);
                if (empty($param)) {
                    throw new MyException('Error al consultar los parametros del recaudador..');           
                }
                // devuelve la cantidad de insertados en la tabla de were
                $cantidad = $this->cargarRecaudosModel->ValidarTransaccion($nunTrans, $nit_recaudador);
                if ($cantidad <= 0) {
                    //devuelve el objeto de la consulta
                    $factura = $this->cargarRecaudosModel->getDatosFactura($num_referencia, $id_Empresa, 'S');              
                    $fecha2 = new DateTime($fectrans);
                    $fecha2 = $fecha2->modify('-10 minute');
                    $fecha1 = new DateTime($fectrans);
                    $fecha1 = $fecha1->modify('+10 minute');
                    if ($factura['Homologado'] == 'S') {                   
                        $detrec = $this->cargarRecaudosModel->ConsultarPago($factura['Id_suscripcion'], $nit_recaudador, $fecha1, $fecha2);                                      
                        if ($detrec['Id'] != 1) {
                            $detrec = $this->cargarRecaudosModel->ConsultarPago($factura['Id_susalterna'], $nit_recaudador, $fecha1, $fecha2);                                      
                            if ($detrec['Id']== 1) {
                                $idRecaudoWeb = $detrec['IdRecaudoWeb'];
                                $this->cargarRecaudosModel->actualizarDetallePago($detrec['IdDetRecaudoWeb'], 'OK', 'PENDIENTE');
                            } else {
                                $estado_Detalle ='INCOMPLETO';
                                $estado_Det_Des = 'Pago Incompleto, pend. Transaccion 2';
                            }
                        }
                        else
                        {
                            continue;
                        }
                    }
                    if ($idRecaudoWeb === 0) {                                           
                        $objeto_recaudo = array();
                        $objeto_recaudo['Fecha'] = $fechaResTr->format('d-m-Y H:i:s');
                        $objeto_recaudo['ValorPagoTotal'] = intval($valPago);
                        $objeto_recaudo['Estado'] = 'E';
                        $objeto_recaudo['Mensaje'] = 'Pago factura gas-aseo';
                        $objeto_recaudo['TicketOfficeId'] = $param[0]['ticketofficeid'];
                        $objeto_recaudo['serviceCode'] = $param[0]['servicecode'];
                        $objeto_recaudo['VatAmount'] = 0;
                        $objeto_recaudo['PaymentId'] = strval($nunTrans);
                        $objeto_recaudo['PaymentDescription'] = 'Pago factura gas-aseo';
                        $objeto_recaudo['ReferenceNumber2'] = strval($num_referencia);
                        $objeto_recaudo['TerceroEntidad'] = $nit_recaudador;
                        $objeto_recaudo['MedioPago'] = $param[0]['medio_pago'];
                        $idRecaudoWeb = $this->cargarRecaudosModel->insertarRecaudoWeb($objeto_recaudo);
                    }
                    $obj_detalle_recaud = array();
                    $obj_detalle_recaud['IdRecaudoWeb'] = $idRecaudoWeb;
                    $obj_detalle_recaud['IdSuscripcion'] = $factura['Id_suscripcion'];
                    $obj_detalle_recaud['IdEmpresa'] = $id_Empresa;
                    $obj_detalle_recaud['fechac1'] = $fechaResTr->format('d-m-Y H:i:s');
                    $obj_detalle_recaud['ValorPago'] = $valPago;
                    $obj_detalle_recaud['EstadoPago'] = $estado_Detalle;
                    $obj_detalle_recaud['EstadoAplicacionPago'] = $estado_Det_Des;
                    $obj_detalle_recaud['nunTrans'] =$nunTrans ;                               

                    $iddetalle=$this->cargarRecaudosModel->insertarDetalle($obj_detalle_recaud);                                 
                  
                    $this->cargarRecaudosModel->actualizarRecaudoWeb($idRecaudoWeb);
                    
                }
            } catch (Exception $ex) {
                
            }
        }
    }
    
   
    private function procesarLineasScotiabank(array $listaLineas, $infoRecaudo) {
        if (empty($listaLineas)) {
            throw new MyException('El archivo no tiene lineas', -1);
        }
        $listaRegistros = array();
        $linea = $listaLineas[0];
        $infoRecaudo['fechapago'] = substr($linea, 40, 4) . '-' . substr($linea, 44, 2) . '-' . substr($linea, 46, 2);
        for ($i = 2; $i < count($listaLineas) - 2; $i++) {
            $linea = $listaLineas[$i];
            if (strlen(trim($linea)) != 94) {
                throw new MyException('El archivo no tiene el formato esperado (' . $linea . ')', -1);
            }
            $registro['idsuscripcion'] = substr($linea, 42, 8) / 1;
            $registro['fechapago'] = $infoRecaudo['fechapago'] . ' ' . substr($linea, 87, 2) . ':' . substr($linea, 89, 2) . ':' . substr($linea, 91, 2);
            $registro['valor'] = substr($linea, 50, 12) / 1;
            ;
            $registro['idmediopago'] = $infoRecaudo['idmediopago'];
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }
    
    /**
     * Valida y obtiene la información específica de cada recaudo según la estrucutura del archivo enviado por Banco bbva
     * @param array $listaLineas - Lineas del archivo 
     * @param array $infoRecaudo - Información básica del recaudo (recaudador, mediopago, sucursal)
     * @return array - Información de cada recaudo 
     * @throws MyException
     */
    private function procesarLineasBBVA(array $listaLineas, $infoRecaudo) {
        if (empty($listaLineas)) {
            throw new MyException('Error el archivo no contiene líneas', -1);
        }
        $listaRegistros = array();
        $linea = $listaLineas[0];
        $infoRecaudo['fechapago'] = substr($linea, 12, 4) . '-' . substr($linea, 16, 2) . '-' . substr($linea, 18, 2);
        for ($i = 2; $i < count($listaLineas) - 2; $i++) {
            $linea = $listaLineas[$i];
            if (strlen(trim($linea)) != 94) {
                throw new MyException('El archivo no tiene el formato esperado (' . $linea . ')', -1);
            }
            $registro['idsuscripcion'] = substr($linea, 42, 8) / 1;
            $registro['fechapago'] = $infoRecaudo['fechapago'];
            $registro['valor'] = substr($linea, 50, 12) / 1;
            $registro['idmediopago'] = $infoRecaudo['idmediopago'];
            $listaRegistros[] = $registro;
        }
        return $listaRegistros;
    }



}
