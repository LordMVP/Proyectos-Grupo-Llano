<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\CargarLecturasModel;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpFoundation\Request;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de los recaudos.
 * @author hrey
 */
class CargarLecturasDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var  \Llanogas\LlanogasBundle\Models\CargarLecturasModel
     */
    private $cargarLecturasModel;

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
    private $conexionLog;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->cargarLecturasModel = new CargarLecturasModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->conexionLog = ConexionBD::getConexion();
        $this->sesion = $sesion;
    }

    /**
     * Carga las lecturas a partir de un fichero de una plano
     * @param Request $request Petición donde se contiene el fichero
     * @return Array información de lecturas no procesadas
     */
    public function cargarLecturas(Request $request, $esFacturar) {

        $this->cargarLecturasModel->CrearTablaLogModel($this->sesion->get('idempresa'));
        //carga la información del fichero
        $fichero = $this->cargarFichero($request);
        $fichero['esFacturar'] = $esFacturar;
        //posición 
        $i = 0;
        $this->escribirLog("Proceso de carge Iniciado");
        //mientras existan líneas  se procesan las lecturas 
        while ($linea = fgets($fichero['file'])) {
            $registro='';
            try {
                $i = $i + 1;
                $registro = explode(';', $linea);
                $infoRegistro = $this->getInfoRegistroArchivo($registro, $i);
                $this->procesarLectura($infoRegistro, $i, $fichero['esFacturar']);
            } catch (\Exception $e) {
                $this->escribirLog(json_encode($e->getMessage()), $i, "Cargar Lecturas -> codigo  ". $registro[13] ." fila -> ". $i, true);
                break;
            }
        }
        $this->escribirLog("Historico de Archivos Procesados", $i, "Lecturas Procesadas");
    }

    /**
     * carga el fichero 
     * @param type $request petición actual
     * @return array información de fichero
     */
    private function cargarFichero($request) {

        try {
            //sube el fichero al servidor
            $listaArchivos = Util::subirArchivo($request, $this->sesion->get('idusuario'));
        } catch (\Exception $ex) {
            throw new MyException('Archivo no válido para la ejecución ', -1);
        }
        //recorre el fichero encontrado 
        if (empty($listaArchivos)) {
            throw new MyException('Archivo no válido para la ejecución ', -1);
        }
        $archivo = $listaArchivos[0];

        //realiza la apertura del fichero como lectura
        $respuesta['file'] = fopen($archivo, "r");

        return $respuesta;
    }

    /**
     * permite procesar una línea para generar una lectura
     * @param varchar $errorLinea por referencia. identifica el error generado 
     * @param varchar $lecturaProcesada lectura a procesar
     * @param int $posicion posición de línea
     * @param char $esFacturar identifica si es facturable 
     */
    private function procesarLectura($infoRegistro, $posicion, $esFacturar) {
        $idsuscripcionLog = 'Lecturas';
        try {
            $this->conexion->beginTransaction();
            $idsuscripcionLog = "Suscripción {" . $infoRegistro['idsuscripcion'] . "} Código Anterior  {" . $infoRegistro['codigoanterior'] . "}";
            $this->procesarRegistroCargue($infoRegistro, $esFacturar);
            $this->conexion->commit();
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            print_r($e->getMessage());
            $this->escribirLog($e->getMessage(), $posicion, $idsuscripcionLog, true);
            throw $e;
        }
    }

    /**
     * permite procesar el registro de la lectura
     * @param array $infoRegistroArchivoPlano
     * @param type $esFacturar
     */
    private function procesarRegistroCargue($infoRegistroArchivoPlano, $esFacturar) {

        $idsuscripcion = 0;
        $codigoAnterior = '';

        if (!empty($infoRegistroArchivoPlano['idsuscripcion'])) {
            $idsuscripcion = $infoRegistroArchivoPlano['idsuscripcion'];
        }

        if (!empty($infoRegistroArchivoPlano['codigoanterior'])) {
            $codigoAnterior = $infoRegistroArchivoPlano['codigoanterior'];
        }

        $LecturaEncabezadoActual = $this->cargarLecturasModel->obtenerLecturaActivaExistente($idsuscripcion, $codigoAnterior);

        if ($esFacturar == 'F') {
            $this->facturarLecturas($infoRegistroArchivoPlano, $LecturaEncabezadoActual);
        } else {
            $this->crearDetalleLecturaRevision($LecturaEncabezadoActual, $infoRegistroArchivoPlano);
        }
    }

    /*     * *
     * Permite visualizar el Log de la transaccion
     */

    public function VerLog() {
        return $this->cargarLecturasModel->VerLogModel($this->sesion->get('idempresa'));
    }

    /**
     * permite cargar la información de la suscripción falatante para la construcción de la lectura
     * @param array $infoRegistro información de la suscfripcion 
     * @return Array con información de la suscripción a ser usada en la creación de la lectura
     */
    private function cargarSuscripcionLectura($infoRegistro) {
        try {
            /**
             * Obtiene la información de la suscripción 
             */
            $suscripcion = $this->cargarLecturasModel->ObtenerInformacionLecturasSuscripcion($infoRegistro['idsuscripcion'], $infoRegistro['codigoanterior']);
            /**
             * Se obtiene le ciclo periodo actual para la suscripción 
             */
            $cicloPeriodoActual = $this->genericoModel->getCicloPeriodoSuscripcion($suscripcion['idsuscripcion']);
            $respuesta['cic_ideregistro'] = $cicloPeriodoActual['idciclo'];
            $respuesta['per_ideregistro'] = $cicloPeriodoActual['idperiodo'];
            $respuesta['cic_ano'] = $cicloPeriodoActual['cicloanio'];
            $respuesta['pro_ideregistro'] = $suscripcion['idpropiedad'];
            $respuesta['emp_ideregistro'] = $this->sesion->get('idempresa');
            $respuesta['uni_tipsuscripc'] = $suscripcion['idtiposuscripcion'];
            $respuesta['uni_tipusosuscr'] = $suscripcion['idtiposuscriptor'];
            $respuesta['pro_digitos'] = $suscripcion['digitos'];
            $respuesta['lec_desviacion'] = PARAMETRO_DESVIACION;
            $respuesta['dsus_factor'] = $suscripcion['factor'];
            $respuesta['dsus_ideregistr'] = $suscripcion['idsuscripcion'];
            return $respuesta;
        } catch (\Exception $e) {
            throw new MyException($e->getMessage(), -1);
        }
    }

    /**
     * permite construir un nuevo encabezado de lectura
     * @param array $infoRegistro información de la lectura
     * @return int id de encabezado de lectura
     */
    private function crearEncabezadoLectura($infoRegistro) {
        try {

            /**
             * obtiene la información adicional de las lecturas, con respecto a la suscripción 
             */
            $lectura = $this->cargarSuscripcionLectura($infoRegistro);
            $lecturaPromedio = $this->buscaUltimoPromedio($infoRegistro);
            $cargaPromedio = 0 ;
            if(!empty($lecturaPromedio)){
                $cargaPromedio = $lecturaPromedio[0]['promedio'] ;
            }
             
            $lectura['lec_conpromedio'] = $cargaPromedio;
            $lectura['lec_observacion'] = utf8_encode($infoRegistro['observacion']);
            $lectura['pro_idepropiedad'] = $infoRegistro['numeromedidor'];
            $lectura['lec_estado'] = 'A';
            /**
             * Construir nueva lectura 
             */
            $lectura['lec_fecha'] = 'now()';
            $lectura['lec_anterior'] = $infoRegistro['lecturaanterior'];
            $lectura['lec_actual'] = $infoRegistro['lecturaactual'];
            $lectura['lec_consumo'] = $infoRegistro['consumo'];

            // permite crear la lectura
            $idnuevaLectura = $this->cargarLecturasModel->CrearLectura($lectura);
            return $idnuevaLectura;
        } catch (\Exception $e) {
            $idsuscripcionLog = "Suscripción {" . $infoRegistro['idsuscripcion'] . "} Código Anterior  {" . $infoRegistro['codigoanterior'] . "}";
            $this->escribirLog("Error Encontrado " . $e->getMessage(), null, $idsuscripcionLog, true);
            throw new MyException($e->getMessage(), -1);
        }
    }

    /**
     * Genera el proceso de facturación de las facturas
     * @param array $infoRegistro información obtenida del archivo plano
     * @param array $lecturaActiva información de la lectura actual vigente
     */
    private function facturarLecturas($infoRegistro, $lecturaActiva) {
        if (empty($lecturaActiva)) {
            $idnuevaLectura = $this->crearEncabezadoLectura($infoRegistro);
            /**
             * permite construir el detalle de la lectura facturada
             */
            $this->crearDetalleLecturaFacturar($idnuevaLectura, $infoRegistro);
        } else {
            /**
             * permite construir el detalle de la lectura facturada
             */
            $this->crearDetalleLecturaFacturar($lecturaActiva['lec_ideregistro'], $infoRegistro);
        }
    }

    /**
     * permite construir un detalle de lectura basado en la lectura activa
     * @param int $idlectura identificador de la lectura
     * @param array $infoRegistroPlano lectura de archivo plano
     */
    private function crearDetalleLecturaFacturar($idlectura, $infoRegistroPlano) {
        try {
            /**
             * Verifica que el resto de detalles existentes para la lectura esten Eliminados para dejar un unico activo
             */
            $this->cargarLecturasModel->ActualizarEstadoDetallesLecturaModel($idlectura);


            /**
             * Procesa nueva lectura
             */
            $dlectura['dlec_estado'] = 'P';
            $dlectura['dlec_fecha'] = 'now()';
            $dlectura['dlec_fecprogram'] = 'now()';
            $dlectura['dlec_lecreal'] = $infoRegistroPlano['lecturareal'];
            $dlectura['dlec_actual'] = $infoRegistroPlano['lecturaactual'];
            $dlectura['dlec_consumo'] = $infoRegistroPlano['consumo'];
            $dlectura['dlec_fecejecuta'] = 'now()';
            $dlectura['dlec_observacio'] = $infoRegistroPlano['observacion'];
            $dlectura['lec_ideregistro'] = $idlectura;
            $dlectura['lec_anterior'] = $infoRegistroPlano['lecturaanterior'];

            if (!empty($infoRegistroPlano['idanomalia'])) {
                $dlectura['uni_anolectura'] = $infoRegistroPlano['idanomalia'];
            }

            if (!empty($infoRegistroPlano['idnovedad'])) {
                $dlectura['uni_novlectura'] = $infoRegistroPlano['idnovedad'];
            } else {
                $dlectura['uni_novlectura'] = 908; // sin Novedad
            }

            $dlectura['emp_ideregistro'] = $this->sesion->get('idempresa');
            $dlectura['dlec_realizada'] = 'S';


            $this->cargarLecturasModel->CrearDetalleLectura($dlectura);
            $this->cargarLecturasModel->actualizarEncabezadoLectura($idlectura, $infoRegistroPlano);
        } catch (\Exception $e) {
            $idsuscripcionLog = "Suscripción {" . $infoRegistroPlano['idsuscripcion'] . "} Código Anterior  {" . $infoRegistroPlano['codigoanterior'] . "}";
            $this->escribirLog("Error Encontrado " . $e->getMessage(), null, $idsuscripcionLog, true);
        }
    }

    /**
     * permite construir un detalle de lectura basado en la lectura activa
     * @param array $lecturaActual identificador de la lectura
     * @param array $infoRegistroPlano lectura de archivo plano
     */
    private function crearDetalleLecturaRevision($lecturaActual, $infoRegistroPlano) {
        try {
            $idlectura = 0;
            if (!empty($lecturaActual)) {
                $idlectura = $lecturaActual['lec_ideregistro'];
            } else {
                $idlectura = $this->crearEncabezadoLectura($infoRegistroPlano);
            }
            /**
             * Verifica que el resto de detalles existentes para la lectura esten Eliminados para dejar un unico activo
             */
            $this->cargarLecturasModel->ActualizarEstadoDetallesLecturaModel($idlectura);
            /**
             * Procesa nueva lectura
             */
            $dlectura['dlec_estado'] = 'E'; //Ejecutado
            $dlectura['dlec_fecha'] = 'now()';
            $dlectura['dlec_fecprogram'] = 'now()';
            $dlectura['dlec_lecreal'] = $infoRegistroPlano['lecturareal'];
            $dlectura['dlec_actual'] = $infoRegistroPlano['lecturaactual'];
            $dlectura['dlec_consumo'] = intval($infoRegistroPlano['consumo']);
            $dlectura['dlec_fecejecuta'] = 'now()';
            $dlectura['dlec_observacio'] = $infoRegistroPlano['observacion'];
            $dlectura['lec_ideregistro'] = $idlectura;
            $dlectura['lec_anterior'] = empty($lecturaActual['lec_actual']) ? $infoRegistroPlano['lecturaanterior'] : $lecturaActual['lec_actual'];


            if (!empty($infoRegistroPlano['idanomalia'])) {
                $dlectura['uni_anolectura'] = $infoRegistroPlano['idanomalia'];
            }

            if (!empty($infoRegistroPlano['idnovedad'])) {
                $dlectura['uni_novlectura'] = $infoRegistroPlano['idnovedad'];
            } else {
                $dlectura['uni_novlectura'] = 908; // sin Novedad
            }

            $dlectura['emp_ideregistro'] = $this->sesion->get('idempresa');
            $dlectura['dlec_realizada'] = 'S';
            $this->cargarLecturasModel->CrearDetalleLectura($dlectura);
        } catch (\Exception $e) {
            $idsuscripcionLog = "Suscripción {" . $infoRegistroPlano['idsuscripcion'] . "} Código Anterior  {" . $infoRegistroPlano['codigoanterior'] . "}";
            $this->escribirLog("Error Encontrado " . $e->getMessage(), null, $idsuscripcionLog, true);
        }
    }

    /**
     * carga la información de la lectura
     * @param type $registro
     * @return string
     * @throws MyException El archivo no tiene el formato correcto
     */
    private function getInfoRegistroArchivo($registro, $fila) {
        try {
            $infoRegistro = array();
            if (count($registro) > 15 || count($registro) < 15) {
                throw new MyException('El archivo plano es corrupto o inválido, asegúrese que el formato sea el correcto. número de columnas ' . count($registro) . ' fila:' . $fila, -1);
            }

            /* if (!is_numeric($registro[0])) {
              throw new MyException('El identificador de la ruta es obligatorio.', -1);
              }
              $infoRegistro['idruta'] = $registro[0];
             */
            $infoRegistro['consecutivo'] = $registro[1];
            $infoRegistro['codigoanterior'] = 0;

            if (!is_numeric($registro[2])) {
                if (!is_numeric($registro[13])) {
                    throw new MyException('Debe existir suscripción valida o codigo anterior. (' . $registro[2] . ' o ' . $registro[13] . ') fila ' . $fila, -1);
                } else {
                    $infoRegistro['codigoanterior'] = $registro[13];
                    $infoRegistro['idsuscripcion'] = '';
                }
            } else {
                $infoRegistro['idsuscripcion'] = $registro[2];
                $infoRegistro['codigoanterior'] = '';
            }
            $infoRegistro['nombre'] = $registro[3];
            $infoRegistro['direccion'] = $registro[4];
            $infoRegistro['barrio'] = $registro[5];
            if (empty($registro[6])) {
                throw new MyException('Número de medidor es requerido.  fila ' . $fila, -1);
            }
            $infoRegistro['numeromedidor'] = $registro[6];
            if (!is_numeric($registro[7])) {
                throw new MyException('lectura anterior requerida. fila ' . $fila, -1);
            }
            $infoRegistro['lecturaanterior'] = $registro[7];
            if (!is_numeric($registro[8])) {
                throw new MyException('lectura actual requerida. fila ' . $fila, -1);
            }
            $infoRegistro['lecturaactual'] = $registro[8];
            if (is_numeric($registro[9])) {
                $infoRegistro['lecturareal'] = $registro[9];
            }
            if (!is_numeric($registro[10]) && !empty($registro[10])) {
                throw new MyException('la novedad debe se numerica. fila ' . $fila . ' valor:' . $registro[10], -1);
            }
            $infoRegistro['idnovedad'] = $registro[10];

            if (!empty($registro[11])) {
                if (!is_numeric($registro[11])) {
                    throw new MyException('la anomalia debe se numerica. fila ' . $fila, -1);
                }
                $infoRegistro['idanomalia'] = $registro[11];
            }

            $infoRegistro['observacion'] = $registro[12];
            $infoRegistro['lecturaactual'] = $registro[8];
            if (!is_numeric(trim($registro[14]))) {
                throw new MyException('el consumo es requerido. fila ' . $fila, -1);
            }
            $infoRegistro['consumo'] = trim($registro[14]);
            $infoRegistro['ejecutado'] = 'S';
            return $infoRegistro;
        } catch (MyException $e) {
            throw new MyException($e->getMessage(), -1);
        }
    }

    private function escribirLog($descripcion, $filasafectadas = null, $idsuscripcion = '', $eserror = false) {
        $conexionLog = $this->conexionLog;
        if ($conexionLog->isTransactionActive()) {
            $conexionLog->rollBack();
        }
        $conexionLog->beginTransaction();
        try {
            $cargarLecturasLogModel = new CargarLecturasModel($conexionLog);

            if ($eserror) {
                $cargarLecturasLogModel->InsertarLogModel($this->sesion->get('idempresa'), " Error, ".$descripcion , 'Cargue de Lecturas', 'ERROR', $idsuscripcion, 0);
                return;
            }

            if ($filasafectadas < 0 && !$eserror) {
                $cargarLecturasLogModel->InsertarLogModel($this->sesion->get('idempresa'),$descripcion . " No se encontraron facturas a procesar ", 'Cargue de Lecturas', 'COMPLETADO', $idsuscripcion, 0);
                return;
            }
            $cargarLecturasLogModel->InsertarLogModel($this->sesion->get('idempresa'),$descripcion . " Completada", 'Cargue de Lecturas', 'COMPLETADO', $idsuscripcion, $filasafectadas);
        } catch (\Exception $e) {
            $conexionLog->rollBack();
        } finally {
            if ($conexionLog->isTransactionActive()) {
                $conexionLog->commit();
            }
        }
    }
    
    public function buscaUltimoPromedio($infoRegistro){
        return   $this->cargarLecturasModel->buscaUltimaLectura($infoRegistro['idsuscripcion'], $infoRegistro['codigoanterior'])  ; 
    }

}
