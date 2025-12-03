<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\FesModel;

/**
 * Proceso de aplicar recaudos.
 *
 * @author hrey
 */
class ProcesoGenerarPlanoFes {

    /**
     * @var array
     */
    private $parametros;

    /**
     *
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var type Entero
     */
    private $idEmpresa;

    /**
     *
     * @var GenericoModel 
     */
    private $objGenericoModel;

    /**
     *
     * @var ProcesoModel 
     */
    private $objProcesoModel;

    /**
     *
     * @var FesModel
     */
    private $objFesModel;

    /**
     *
     * @var type integer
     */
    private $cantidadProcesosActivos;

    /**
     *
     * @var type bolean
     */
    private $hilociereactivo;

    /**
     *
     * @var type Array ;
     */
    private $informacionControl;

    /**
     * Constructor de la empresa
     * Trae Los parametros requeridos para la ejecucion del proceso , IdPrograma, IdAcceso, IdUsuario 
     */
    public function __construct(array $parametrosEntrada) {
        print_r("->Constructor");
        $this->parametros = $parametrosEntrada;
        $this->conexion = ConexionBD::getConexion();
        $this->objFesModel = new FesModel($this->conexion);
        $this->objGenericoModel = new GenericoModel($this->conexion);
        $this->hilociereactivo = false;
        $this->informacionControl = array();
        $this->registrarProceso();
    }

    /**
     * Inicia el proceso 
     */
    public function iniciar() {
        try {

            print_r("------------->Inicio hilo");
            print_r($this->parametros);
            $facturas = array();
            $nombre = "proceso_genera_fes_" . $this->parametros['idempresa'] . "_ciclo_" . $this->parametros['idciclo'];
            $this->objFesModel->validaExistenciaTabla($nombre);
            $facturas = $this->objFesModel->consultarListadoFacturas($this->parametros);

            $infolog['empresa'] = $this->parametros['idempresa'];
            $infolog['ciclo'] = $this->parametros['idciclo'];
            $this->objFesModel->EliminarInformacionLog($infolog);
            $camposvalidar = $this->objFesModel->consultaCamposValidar(1);
            $contador = 0;
            print_r("\n Total de Facturas a Procesar:");
            $cantidad_facturas = count($facturas);
            print_r($cantidad_facturas);
            foreach ($facturas as $factura) {
                print_r("Inicia Ciclo Facturas ");
                $factura['idciclo'] = $this->parametros['idciclo'];
                $factura['idempresa'] = $this->parametros['idempresa'];
                $this->objFesModel->actualizarCamposFormuladosFuncDB($factura, $this->idControlProceso);
                print_r("\nValidacion en HILO :" . $this->parametros['idproceso'] . " ID PROCESO " . $this->idControlProceso . " Factura :" . $factura['fac_ideregistro']);
                $contador += 1;
                $this->validacionplanoFES($camposvalidar, $factura['fac_ideregistro']);
            }

            if ($this->parametros['idproceso'] == 0) {
                $this->consultarProcesoActivo();
                print_r("Cantidad Procesos Activos" . $this->cantidadProcesosActivos);
                while ($this->cantidadProcesosActivos > 0) {
                    $this->consultarProcesoActivo();
                    print_r("\nNumero Procesos Activos:");
                    print_r($this->cantidadProcesosActivos);
                    print_r(" -> Numero Intentos :");
                    print_r($intentos);
                    $intentos ++;
                    sleep(5);
                }
                print_r("\nInicia validacion Masiva");
                /*
                 * Validación de Fase En proceso posterior a que todos los hilos hayan culminado
                 */
                $this->validacionplanoFES($camposvalidar);
                /*
                 * Validación Final Fase Ultima Confirmar que todos los registros esten procesados
                 */
                print_r("\n Validación Final");
                $camposvalidar = $this->objFesModel->consultaCamposValidar(2);
                $this->validacionplanoFES($camposvalidar);
                $this->consultarProcesoActivo();
                $intentos = 0;
                $generado = 0;
                print_r("Validando Calidad de Datos ");
                print_r("\n Iniciando Construcciòn Archivo Plano ");
                $Datos['idciclo'] = $this->parametros['idciclo'];
                $Datos['idempresa'] = $this->parametros['idempresa'];
                $this->generaplanoFFES();
                $this->generaplanoRESCIC($Datos);
                $this->generaplanoRESCART($Datos);
                $this->generaxlsResumenMes($Datos);

                $actividad = $this->objFesModel->consultarIdActividad($this->parametros['idciclo'], CODIGO_PROGRAMA_FES_GENERACION_PLANO);
                if (!empty($actividad)) {
                    print_r($actividad[0]);
                    $this->objGenericoModel->actualizarActividad($actividad[0], 'C');
                }
            }
            print_r("\n Finalizò Construcciòn Archivo Plano ");
            $this->finalizarProceso();
        } catch (\Exception $ex) {
            print_r($ex->getMessage());
            $this->finalizarProcesoconError();
        }
    }

    public function generaplanoFFES() {
        $archivo['ruta'] = RUTA_ARCHIVO_PLANO_FES;
        $archivo['idtabla'] = $this->parametros['idempresa'] . "_ciclo_" . $this->parametros['idciclo'];
        $consultaFechaProceso = $this->objFesModel->consultaFecha();
//        $archivo['nombre_archivo'] = $consultaFechaProceso[0]['ano'] . '_' . $consultaFechaProceso[0]['mes'] . '_' . $consultaFechaProceso[0]['dia'] .
//                "_CICLO_" . $this->parametros['idciclo'] . '_ACC_' . $this->parametros['idacceso'] . "_PROC_" . $this->idControlProceso . ".txt";
        $archivo['nombre_archivo'] = "FFES".$this->parametros['idempresa'] ." ". $consultaFechaProceso[0]['mes'] . " " . $this->idControlProceso.".txt";
        $this->objFesModel->construyeArchivoPlanoFes($archivo);
        $archivo['ruta'] = RUTA_PUBLICACION_PLANO_FES_BD;
        $this->preparaInformacionControl($archivo);
        $this->objFesModel->guardaControlArchivo($this->informacionControl);
    }

    public function generaplanoRESCIC($Datos) {

        $archivo['ruta'] = RUTA_ARCHIVO_PLANO_FES;
        $archivo['idtabla'] = $this->parametros['idempresa'] . "_ciclo_" . $this->parametros['idciclo'];
        $archivo['nombre_archivo'] = '___TOTUSU_CICLO_' . $this->parametros['idciclo'] . '_' . $consultaFechaProceso[0]['ano'] . '_' . $consultaFechaProceso[0]['mes'];
        $this->objFesModel->construyeResumenRutas($archivo);
        $archivo['ruta'] = RUTA_PUBLICACION_PLANO_FES_BD;
        $this->preparaInformacionControl($archivo);
        $this->objFesModel->guardaControlArchivo($this->informacionControl);
    }

    public function generaplanoRESCART($Datos) {
        $archivo['ruta'] = RUTA_ARCHIVO_PLANO_FES;
        $archivo['idtabla'] = $this->parametros['idempresa'] . "_ciclo_" . $this->parametros['idciclo'];
        $archivo['nombre_archivo'] = '___USUCAR_CICLO_' . $this->parametros['idciclo'] . '_' . $consultaFechaProceso[0]['ano'] . '_' . $consultaFechaProceso[0]['mes'];
        $this->objFesModel->construyeResumenCartas($archivo, $Datos);
        $archivo['ruta'] = RUTA_PUBLICACION_PLANO_FES_BD;
        $this->preparaInformacionControl($archivo);
        $this->objFesModel->guardaControlArchivo($this->informacionControl);
    }

    public function generaxlsResumenMes($Datos) {
        $mes[1] = 'ene';
        $mes[2] = 'feb';
        $mes[3] = 'mar';
        $mes[4] = 'abr';
        $mes[5] = 'may';
        $mes[6] = 'jun';
        $mes[7] = 'jul';
        $mes[8] = 'ago';
        $mes[9] = 'sep';
        $mes[10] = 'oct';
        $mes[11] = 'nov';
        $mes[12] = 'dic';
        $archivo['ruta'] = RUTA_ARCHIVO_PLANO_FES;
        $archivo['nombre_archivo'] = '___RESUMEN_CICLO_' . $this->parametros['idciclo'] . '_' . $mes[$consultaFechaProceso[0]['mes']] . '_' . $consultaFechaProceso[0]['ano'] . '_' . $this->idControlProceso . '.xlsx';
        $archivo['idtabla'] = $this->parametros['idempresa'] . "_ciclo_" . $this->parametros['idciclo'];
        $this->reporte_resumen_xls($archivo, $Datos);
        $archivo['ruta'] = RUTA_PUBLICACION_PLANO_FES_WEB;
        $this->preparaInformacionControl($archivo);
        $this->objFesModel->guardaControlArchivo($this->informacionControl);
    }

    /**
     * Ingresa un registro en la tabla de proceso para bloquearlo.
     */
    public function registrarProceso() {
//        $conexion = ConexionBD::getConexion();
        $objProcesoModel = new ProcesoModel($this->conexion);
        $proceso['estado'] = 'A';
        $proceso['fechaInicio'] = 'now()';
        $proceso['idPrograma'] = CODIGO_PROGRAMA_FES_GENERACION_PLANO;
        $proceso['idAcceso'] = $this->parametros['idacceso'];
        $proceso['idEmpresa'] = $this->parametros['idempresa'];
        $proceso['idHilo'] = $this->parametros['idproceso']; // $this->getCurrentThreadId();
        $this->idControlProceso = $objProcesoModel->insertarProceso($proceso);
//        $conexion->close();
    }

    public function consultarProcesoActivo() {
//        $conexion = ConexionBD::getConexion();
        $objProcesoModel = new ProcesoModel($this->conexion);
        $proceso['idPrograma'] = CODIGO_PROGRAMA_FES_GENERACION_PLANO;
        $proceso['idAcceso'] = $this->parametros['idacceso'];
        $proceso['idEmpresa'] = $this->parametros['idempresa'];
//        $proceso['idproceso'] = $this->idControlProceso ;
        $proceso['idproceso'] = $this->parametros['idproceso'];
        $this->cantidadProcesosActivos = $objProcesoModel->getCantidadProcesosActivos($proceso);
//        $conexion->close();
    }

    /**
     * Termina el proceso.
     */
    public function finalizarProceso() {
        $objProcesoModel = new ProcesoModel($this->conexion);
        $objProcesoModel->finalizarProceso($this->idControlProceso);
    }

    public function finalizarProcesoconError() {
        $objProcesoModel = new ProcesoModel($this->conexion);
        $objProcesoModel->finalizarProcesoconError($this->idControlProceso);
    }

    public function aumentarRegistrosProcesados() {
        $objProcesoModel = new ProcesoModel($this->conexion);
        $objProcesoModel->aumentarCantidadRegistro($this->idControlProceso);
    }

    private function preparaInformacionControl($archivo) {
        $controlArchivo = array();
        $controlArchivo['usu_ideregistro'] = $this->parametros['usuario'];
        $controlArchivo['prg_ideregistro'] = CODIGO_PROGRAMA_FES_GENERACION_PLANO;
        $controlArchivo['carc_nombre'] = $archivo['nombre_archivo'];
        $controlArchivo['carc_urlarchivo'] = $archivo['ruta'] . '/' . $archivo['nombre_archivo'];
        $controlArchivo['carc_parametros'] = "Ciclo :" . $this->parametros['idciclo'] . " Acceso:" . $this->parametros['idacceso'];
        $controlArchivo['carc_fecha'] = ' now()';
        $controlArchivo['emp_ideregistro'] = $this->parametros['idempresa'];
        print_r("Información de Control de Archivo ");
        print_r($controlArchivo);
        $this->informacionControl = $controlArchivo;
    }

    private function reporte_resumen_xls($parametros, $Datos) {
        try {
            print_r("Parametros resumen XLS");
            print_r($parametros);
            print_r("Datos Resumen XLS");
            print_r($Datos);
//            $informacion = $this->objFesModel->construyeResumenMesCiclo($parametros, $Datos);
            $informacion = $this->objFesModel->construyeResumenMesCiclo_xls($parametros, $Datos);
            print_r("Informacion resumen ");
            print_r($informacion);
            if (!empty($informacion)) {
                $nombre = RUTA_PRINCIPAL . '/app/Resources/formatos/fes/Resumen.xlsx';
                $objReader = \PHPExcel_IOFactory::createReaderForFile($nombre);
                $hoja = array('ResumenCargue', 'ResumenCargue');
                $objReader->setLoadSheetsOnly($hoja);
                $xlsObj = $objReader->load($nombre);
                $sheetActive = $xlsObj->getActiveSheet();
                $formato = strpos('Resumenmes', 'xlsx') ? 'Excel2007' : 'Excel5';
                $infoperiodo = $this->objFesModel->obtenerCicloAnoPeriodo($Datos);
                $Datos['idtabla'] = $parametros['idtabla'];
                $inforutas = $this->objFesModel->obtenerRutasCiclo($Datos);
                $concatenaRutas = "Resumen del Proyecto:  Rutas( ";
                foreach ($inforutas as $rutas) {
                    $concatenaRutas .= $rutas['idruta'] . " ";
                    print_r($rutas);
                }
                $concatenaRutas .= ")";
                print_r($concatenaRutas);

                // Información Llanogas  
                $sheetActive->setCellValue('A6', "Ciclo Periodo Facturado: " . $infoperiodo['nombreciclo'] . " " . $infoperiodo['ano'] . "-" . $infoperiodo['mes'])
                        ->setCellValue('A5', $concatenaRutas)
                        ->setCellValue('B10', $informacion['cantidad'])
                        ->setCellValue('B11', $informacion['sancion_por_mora'])
                        ->setCellValue('B12', $informacion['refacturado'])
                        ->setCellValue('B13', $informacion['interesesmora'])
                        ->setCellValue('B14', $informacion['valorservicios'])
                        ->setCellValue('B15', $informacion['impuesto'])
                        ->setCellValue('B16', $informacion['impuesto1'])
                        ->setCellValue('B17', $informacion['revqimes'])
                        ->setCellValue('B18', $informacion['revqacu'])
                        ->setCellValue('B19', $informacion['ftdl_fnr'])
                        ->setCellValue('B20', 0)
                        //Cartera de Gas
                        ->setCellValue('B23', $informacion['cantidad_cartera_llanogas'])
                        ->setCellValue('B24', $informacion['cuota_amortizacion'])
                        ->setCellValue('B25', $informacion['refacturadocartera'])
                        ->setCellValue('B26', $informacion['mora_cartera'])
                        ->setCellValue('B27', $informacion['otros_conceptos_cartera'])
                        ->setCellValue('B28', $informacion['total_cartera_llano'])
                        //Gasodomesticos
                        ->setCellValue('B31', $informacion['total_gasodomesticos'])
                        //Seguros ACE
                        ->setCellValue('B34', $informacion['segvid'])
                        //Total_facturado
                        ->setCellValue('B37', 0)
                        // Información Bioagricola 
                        ->setCellValue('B40', $informacion['lmf_fac'])
                        ->setCellValue('B41', $informacion['lmf_tar'])
                        ->setCellValue('B42', $informacion['lmf_subcon'])
                        ->setCellValue('B43', $informacion['lmf_des'])
                        ->setCellValue('B44', $informacion['lmf_sob'])
                        ->setCellValue('B45', $informacion['lmf_ant'])
                        ->setCellValue('B46', $informacion['lmf_mor'])
                        ->setCellValue('B47', $informacion['lmf_otraseo'])
                        ->setCellValue('B48', $informacion['lmf_tot'])
                        ->setCellValue('B49', $informacion['val_cuo'])
                        ->setCellValue('B51', 0); //Total facturado 
//                $nombre = RUTA_PRINCIPAL . '/app/Resources/formatos/fes/Resumen.xlsx';
                $objWriter = \PHPExcel_IOFactory::createWriter($xlsObj, $formato);
                $objWriter->save($parametros['ruta'] . '/' . $parametros['nombre_archivo']);
            }
        } catch (\Exception $ex) {
            print_r($ex->getMessage());
            $this->finalizarProcesoconError();
        }
    }

    private function validacionplanoFES($campos, $idfactura = null) {
        $parametros['empresa'] = $this->parametros['idempresa'];
        $parametros['ciclo'] = $this->parametros['idciclo'];
        $consulta_log = $this->objFesModel->consultaLogFes($parametros);
        $nombre_table = 'proceso_genera_fes_' . $this->parametros['idempresa'] . '_ciclo_' . $this->parametros['idciclo'];

        if (count($consulta_log) >= 1)
            throw new MyException(" Registro no cumple Validación de Datos", -1);

        foreach ($campos as $campo) {
            $respuestaValidacion = $this->objFesModel->validacionCampos($campo, $nombre_table, $idfactura);
            if (!empty($respuestaValidacion)) {
                foreach ($respuestaValidacion as $respuesta) {
                    $this->objFesModel->insertaLogFes($respuesta);
                }
                throw new MyException(" Registro no cumple Validación de Datos", -1);
            }
        }
    }

}
