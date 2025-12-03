<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\ProcesoWebServiceMovimientosContablesModel;
use Llanogas\LlanogasBundle\Models\SevenModel;
use Llanogas\LlanogasBundle\Utiles\Array2XML;

/**
 * Description of CerrarLecturasDelegado
 *
 * @author Sergio Vargas
 * fecha  : 23-09-2015
 * 
 */
class ProcesoWebServiceMovimientosContablesDelegado {

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
     * @var SevenModel
     */
    private $sevenModel;

    /**
     * @var ProcesoWebServiceMovimientosContablesModel 
     */
    private $MovimientosContablesModel;
    private $EsError;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller $control, SessionInterface $sesion) {
        if ($control != null and $sesion != null) {
            $conexion = Util::getConexion($control);
            $this->configurar($conexion);
            $this->sesion = $sesion;
        }
    }

    /**
     * Permite realizar la configuración de la conexión 
     * @param type $conexion se recibe la conexión a inicializar
     */
    public function configurar($conexion) {
        $this->conexion = $conexion;
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->MovimientosContablesModel = new ProcesoWebServiceMovimientosContablesModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->sevenModel = new SevenModel();
        $this->EsError = false;
    }

    // <editor-fold desc="Consultas de movimientos contables ">

    /**
     * permite obtener el listado de movimientos contables activos
     * @return listado de movimientos contables
     */
    public function obtenerMovimientosContables($idciclo) {
        $idempresa = $this->sesion->get('idempresa');
        $idusuario = $this->sesion->get('idusuario');
        return $this->MovimientosContablesModel->ObtenerMovimientosContables($idempresa, $idciclo, $idusuario);
    }

    /**
     * permite obtener el listado de movimientos contables activos
     * @return listado de movimientos contables
     */
    public function obtenerCiclosActivos() {
        $idempresa = $this->sesion->get('idempresa');
        return $this->genericoModel->getCiclosActivosPrograma($idempresa, PROCESO_EXPORTAR_CONTABILIZACION);
    }

    public function getCiclosActivosMovimientoContableProgramaDelegado() {
        $idempresa = $this->sesion->get('idempresa');
        return $this->genericoModel->getCiclosActivosMovimientoContablePrograma($idempresa, PROCESO_EXPORTAR_CONTABILIZACION);
    }

    /**
     * permite obtener el listado de movimientos contables activos
     * @return listado de movimientos contables
     */
    public function obtenerDetalleMovimiento($idmovimiento, $idtipomovimiento) {
        $idusuario = $this->sesion->get('idusuario');
        return $this->MovimientosContablesModel->obtenerDetalleMovimientoContable($idmovimiento, $idtipomovimiento, $idusuario);
    }

    /**
     * Permite actualizar el estado a Aprobado = 'A' para que pueda ser enviado ese encabezado del movimiento contable
     * @param int $exportacionMovimientos identificador del encabezado del movimiento contable
     */
    public function AprobarMovimientoContable($exportacionMovimientos) {
        foreach ($exportacionMovimientos as $movimiento) {
            $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($movimiento['idmovimientoexportacion'], 'A');
        }
    }

    public function EliminarMovimientoContable($exportacionMovimientos) {
        foreach ($exportacionMovimientos as $movimiento) {
            $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($movimiento['idmovimientoexportacion'], 'E');
        }
    }

    //</editor-fold>
    // <editor-fold desc="Exportar Movimientos contables">

    /**
     * Generar la exportación de los movimeintos a los servicios web
     * @param type $conexion se recibe  la conexión para realizar la configuración de los modelos
     */
    public function ExportarMovimientosContablesCron($conexion) {
        $this->configurar($conexion);

        /**
         * Permite realizar la reconstrucción de los movimientos con error
         */
        $movimientosReconstruir = $this->MovimientosContablesModel->ObtenerMovimientosReconstruirModel();
        if (!empty($movimientosReconstruir)) {
            $this->MovimientosContablesModel->ReconstruirMovimientosModel($movimientosReconstruir);
        }

        /* @var $movimientosExportar coleccion de tipo EMV */
        $movimientosExportar = $this->MovimientosContablesModel->ObtenerMovimientosExportarCronModel();
        foreach ($movimientosExportar as $movimiento) {
            $this->ProcesarMovimientosContables($movimiento['emv_ideregistro']);
            $this->ProcesarNotasCaja($movimiento['emv_ideregistro']);
            $this->procesarRecaudos($movimiento['emv_ideregistro']);
            $this->procesarConsignaciones($movimiento['emv_ideregistro']);
            $this->procesarFacturaCliente($movimiento['emv_ideregistro']);
            $this->procesarFacturaProveedor($movimiento['emv_ideregistro']);
        }
    }

    /**
     * Permite realizar la exportaciòn del movimiento contable seleccionado
     * @param string $tipoMovimiento Tipo de movimiento contable seleccioando
     */
    public function ExportarMovimientosContables($exportacionMovimientos, $tipoMovimiento) {
        foreach ($exportacionMovimientos as $movimiento) {
            if ($tipoMovimiento == "WSMC") {
                $this->ProcesarMovimientosContables($movimiento['idmovimientoexportacion']);
            }
            if ($tipoMovimiento == "WSNC") {
                $this->ProcesarNotasCaja($movimiento['idmovimientoexportacion']);
            }
            if ($tipoMovimiento == "WSDC") {
                $this->procesarRecaudos($movimiento['idmovimientoexportacion']);
            }
            if ($tipoMovimiento == "WSCD") {
                $this->procesarConsignaciones($movimiento['idmovimientoexportacion']);
            }
            if ($tipoMovimiento == "WSFC") {
                $this->procesarFacturaCliente($movimiento['idmovimientoexportacion']);
            }
            if ($tipoMovimiento == "WSFP") {
                $this->procesarFacturaProveedor($movimiento['idmovimientoexportacion']);
            }
        }
        return $this->EsError;
    }

    public function EliminarMovimientosContables($idMovimiento) {
        $idusuario = $this->sesion->get('idusuario');
        $idEmpresa = $this->sesion->get('idempresa');
        return $this->MovimientosContablesModel->EliminarMovimientosContablesModel($idusuario,$idMovimiento, $idEmpresa);
    }

    //</editor-fold>
    // <editor-fold desc="Resouestas de Servicio">
    /**
     * permite convertir un objeto de cadena formateado como xml  a json 
     * @param string $strXML carga el xml en formato de cadena 
     * @return json retorna el objeto en json 
     */
    private function cargarMensajeServicioMovimientoContable($strXML) {
        $xml = simplexml_load_string($strXML);
        $respuesta['error'] = $xml->CN_MCONT->RETORNO[0];
        $respuesta['mensaje'] = $xml->CN_MCONT->TXTERROR[0];
        $respuesta['codigoencabezado'] = $xml->CN_MCONT->MCO_NUME[0];
        $respuesta['identificadormovimientocontable'] = $xml->CN_MCONT->MCO_CONT[0];
        return $respuesta;
    }

    /**
     * permite convertir un objeto de cadena formateado como xml  a json 
     * @param string $strXML carga el xml en formato de cadena 
     * @return json retorna el objeto en json 
     */
    private function cargarMensajeServicioNotaCaja($strXML) {
        $xml = simplexml_load_string($strXML);
        $respuesta['error'] = $xml->TS_NCAJA->RETORNO[0];
        $respuesta['mensaje'] = $xml->TS_NCAJA->TXTERROR[0];
        $respuesta['codigoencabezado'] = $xml->TS_NCAJA->NCA_NUME[0];
        $respuesta['identificadormovimientocontable'] = $xml->TS_NCAJA->NCA_CONT[0];


        return $respuesta;
    }

    /**
     * permite convertir un objeto de cadena formateado como xml  a json 
     * @param string $strXML carga el xml en formato de cadena 
     * @return json retorna el objeto en json 
     */
    private function cargarMensajeConsignaciones($strXML) {
        $xml = simplexml_load_string($strXML);
        $respuesta['error'] = $xml->TS_MTESO->RETORNO[0];
        $respuesta['mensaje'] = $xml->TS_MTESO->TXTERROR[0];
        $respuesta['codigoencabezado'] = $xml->TS_MTESO->TS_MTESO[0];
        $respuesta['identificadormovimientocontable'] = $xml->TS_MTESO->MTE_CONT[0];


        return $respuesta;
    }

    /**
     * permite convertir un objeto de cadena formateado como xml  a json 
     * @param string $strXML carga el xml en formato de cadena 
     * @return json retorna el objeto en json 
     */
    private function cargarMensajeRecaudos($strXML) {

        $respuesta['error'] = $strXML->Retorno;
        $respuesta['mensaje'] = $strXML->TxtError;
        $respuesta['codigoencabezado'] = $strXML->Tra_nume;
        $respuesta['identificadormovimientocontable'] = $strXML->Tra_cont;


        return $respuesta;
    }

    /**
     * permite convertir un objeto de cadena formateado como xml  a json 
     * @param string $strXML carga el xml en formato de cadena 
     * @return json retorna el objeto en json 
     */
    private function cargarMensajeFacturaCliente($strXML) {
        $xml = simplexml_load_string($strXML);
        $respuesta['error'] = $xml->FA_FACTU->RETORNO[0];
        $respuesta['mensaje'] = $xml->FA_FACTU->TXTERROR[0];
        $respuesta['codigoencabezado'] = $xml->FA_FACTU->FAC_NUME[0];
        $respuesta['identificadormovimientocontable'] = $xml->FA_FACTU->FAC_CONT[0];


        return $respuesta;
    }

    /**
     * permite convertir un objeto de cadena formateado como xml  a json 
     * @param string $strXML carga el xml en formato de cadena 
     * @return json retorna el objeto en json 
     */
    private function cargarMensajeServicioFacturaProveedor($strXML) {
        $xml = simplexml_load_string($strXML);
        $respuesta['error'] = $xml->PO_FACTU->RETORNO[0];
        $respuesta['mensaje'] = $xml->PO_FACTU->TXTERROR[0];
        $respuesta['codigoencabezado'] = $xml->PO_FACTU->FAC_NUME[0];
        $respuesta['identificadormovimientocontable'] = $xml->PO_FACTU->FAC_CONT[0];


        return $respuesta;
    }

    //</editor-fold>
    //// <editor-fold desc="Exportacion Excel">

    /**
     * Permite controlar si existen errores generados en los movimietnos
     * @param int $idmovimiento identificador del movimiennto
     * @return int si la respuesta es mayor a cero, existe error
     */
    public function ValidarErroresGeneradosmovimientos($idmovimiento, $accion) {

        $respuesta = Array();
        $respuesta['cantidad'] = 1;
        $respuesta['mensaje'] = '';

        if ($accion === 'E') {
            $cantidad = $this->MovimientosContablesModel->ValidarErroresGeneradosModel($idmovimiento);
            $respuesta['cantidad'] = $cantidad;
            $respuesta['mensaje'] = $cantidad == 0 ? "No existen errores a mostrar en el movimiento $idmovimiento" : '';
        }


        return $respuesta;
    }

    public function generarEncabezadoExcel($idmovimiento, $accion) {

        $objPHPExcel = new \PHPExcel();
        $objPHPExcel->setActiveSheetIndex(0);
        $sheetActive = $objPHPExcel->getActiveSheet();


        if ($accion === 'E') {
            $this->obtenerListadoError($idmovimiento, $sheetActive);
        }

        if ($accion === 'D') {
            $this->obtenerlistadoDetalleMovimiento($idmovimiento, $sheetActive);
        }

        return $objPHPExcel;
    }

    /**
     * Listado de detalles de movimientos generados 
     * @param int $idmovimiento identificador de movimiento
     * @param object $sheetActive hoja activa
     */
    private function obtenerlistadoDetalleMovimiento($idmovimiento, &$sheetActive) {
        $detallesMovimientos = $this->MovimientosContablesModel->ObtenerDetallesMovimientosGeneradosModel($idmovimiento);
        $this->setEncabezados($sheetActive, 'D');
        $secuencia = 2;
        foreach ($detallesMovimientos as $movimientos) {
            $sheetActive->SetCellValue('A' . $secuencia, $movimientos['numexportacion']);
            $sheetActive->SetCellValue('B' . $secuencia, $movimientos['documento']);
            $sheetActive->SetCellValue('C' . $secuencia, $movimientos['tipodocumento']);
            $sheetActive->SetCellValue('D' . $secuencia, $movimientos['numero']);
            $sheetActive->SetCellValue('E' . $secuencia, $movimientos['top_codigo']);
            $sheetActive->SetCellValue('F' . $secuencia, $movimientos['codicuenta']);
            $sheetActive->SetCellValue('G' . $secuencia, $movimientos['sucursal']);
            $sheetActive->SetCellValue('H' . $secuencia, $movimientos['nit']);
            $sheetActive->SetCellValue('I' . $secuencia, $movimientos['costo']);
            $sheetActive->SetCellValue('J' . $secuencia, $movimientos['proyecto']);
            $sheetActive->SetCellValue('K' . $secuencia, $movimientos['sucursal']);
            $sheetActive->SetCellValue('L' . $secuencia, $movimientos['debito']);
            $sheetActive->SetCellValue('M' . $secuencia, $movimientos['credito']);
            //$sheetActive->SetCellValue('N' . $secuencia, $movimientos['valor']); -- se borra el día 27/09/2016 por petición de sandro

            $secuencia++;
        }
    }

    /**
     * permite obetner el detalle de errores existentes
     * @param int $idmovimiento identificador de movimietno
     * @param object $sheetActive hoja activa a procesar
     */
    private function obtenerListadoError($idmovimiento, &$sheetActive) {
        $listadoError = $this->MovimientosContablesModel->ObtenerListadoErrorModel($idmovimiento);
        $secuencia = 2;
        $sheetActive->setTitle('Errores');

        $this->setEncabezados($sheetActive, 'E');
        foreach ($listadoError as $error) {
            $sheetActive->SetCellValue('A' . $secuencia, $error['ciclo']);
            $sheetActive->SetCellValue('B' . $secuencia, $error['periodo']);
            $sheetActive->SetCellValue('C' . $secuencia, $error['ano']);
            $sheetActive->SetCellValue('D' . $secuencia, $error['fechaerror']);
            $sheetActive->SetCellValue('E' . $secuencia, $error['idemv']);
            $sheetActive->SetCellValue('F' . $secuencia, $error['documento']);
            $sheetActive->SetCellValue('G' . $secuencia, $error['tipodocumento']);
            $sheetActive->SetCellValue('H' . $secuencia, $error['concepto']);
            $sheetActive->SetCellValue('I' . $secuencia, $error['empresa']);
            $sheetActive->SetCellValue('J' . $secuencia, $error['usuario']);
            $sheetActive->SetCellValue('K' . $secuencia, $error['comentario']);
            $secuencia++;
        }
    }

    /**
     * permite construir los encabezados del reporte dependiendo de la acción
     * @param object $sheetActive hoja actva
     * @param char $accion acción a validar
     */
    private function setEncabezados(&$sheetActive, $accion) {
        if ($accion === 'E') {
            $sheetActive->SetCellValue('A1', 'Ciclo');
            $sheetActive->SetCellValue('B1', 'Periodo');
            $sheetActive->SetCellValue('C1', 'Año');
            $sheetActive->SetCellValue('D1', 'Fecha de error');
            $sheetActive->SetCellValue('E1', 'id encabezado emv');
            $sheetActive->SetCellValue('F1', 'Documento');
            $sheetActive->SetCellValue('G1', 'Tipo Documento');
            $sheetActive->SetCellValue('H1', 'Concepto');
            $sheetActive->SetCellValue('I1', 'Empresa');
            $sheetActive->SetCellValue('J1', 'Usuario');
        }
        if ($accion === 'D') {
            $sheetActive->SetCellValue('A1', 'Número exortación');
            $sheetActive->SetCellValue('B1', 'Documento');
            $sheetActive->SetCellValue('C1', 'Tipo documento');
            $sheetActive->SetCellValue('D1', 'Número');
            $sheetActive->SetCellValue('E1', 'Código');
            $sheetActive->SetCellValue('F1', 'Código Cuenta');
            $sheetActive->SetCellValue('G1', 'Sucursal');
            $sheetActive->SetCellValue('H1', 'NIT');
            $sheetActive->SetCellValue('I1', 'Costo');
            $sheetActive->SetCellValue('J1', 'Proyecto');
            $sheetActive->SetCellValue('K1', 'Sucursal');
            $sheetActive->SetCellValue('L1', 'Debito');
            $sheetActive->SetCellValue('M1', 'Credito');
            //$sheetActive->SetCellValue('N1', 'Valor');  -- se borra el día 27/09/2016 por petición de sandro
        }
    }

    //</editor-fold>
    // <editor-fold defaultstate="collapsed" desc="WEB SERVICES No 1">

    /**
     * Permite procesar los movimientos contables
     * @return Int
     */
    public function ProcesarMovimientosContables($idmovimiento) {
        $respuestaServicio = Array();
        $cargarEncabazadosMovimientosContables = $this->MovimientosContablesModel->ObtenerEncabezadosMovimientoContableModel($idmovimiento);
        $parametros = array();
        $codigoEmv = 0;
        foreach ($cargarEncabazadosMovimientosContables as $movimientoContable) {
            try {
                $codigoEmv = $movimientoContable['mco_nume'];

                $parametros['pContable']['Emp_codi'] = $movimientoContable['emp_codi'];
                $parametros['pContable']['Top_codi'] = $movimientoContable['top_codi'];
                $parametros['pContable']['Mco_nume'] = $movimientoContable['mco_nume'];
                $respuestaSeven = $this->sevenModel->ValidarMovimientoContable($parametros);
                //print_r('lo que llega -->  '.$respuestaSeven['seven'].'  --  '.$respuestaSeven[0]['seven']);
                if ($respuestaSeven['seven'] == 1 || $respuestaSeven['seven'] == 2 || $respuestaSeven['seven'] == 3) {///  hacer la parametrizacion desde sevemodel ()
                    if ($respuestaSeven['seven'] == 1) {
                        $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($movimientoContable['mco_nume'], 'T', 'Ya existe. No exporta movimiento');
                    }
                    if ($respuestaSeven['seven'] == 2) {
                        $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($movimientoContable['mco_nume'], 'T', 'Tiene movimientos inconsistentes. No exporta movimiento');
                    }
                    if ($respuestaSeven['seven'] == 3) {
                        $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($movimientoContable['mco_nume'], 'T', 'Existen varios movimiento Aplicados. No exporta movimiento');
                    }
                    continue;
                }
                $parametros['pContable']['Mco_fech'] = $movimientoContable['mco_fech'];
                $parametros['pContable']['Mod_codi'] = $movimientoContable['mod_codi'];
                $parametros['pContable']['Arb_csuc'] = $movimientoContable['arb_csuc'];
                $parametros['pContable']['Mco_desc'] = $movimientoContable['mco_desc'];
                $parametros['pContable']['vDetalle']['TSCnDmcon'] = $this->obtenerDetallesContables($codigoEmv);
                /*
                  $document = Array2XML::createXML("InsertarMovContable", $parametros);
                  print_r($document->saveXML());
                 */

                $respuestaServicio = $this->genericoDelegado->invocarServicio(WEB_SERVICE_CONTABILIDAD, 'InsertarMovContable', $parametros);
                $strXML = $respuestaServicio->InsertarMovContableResult;
                error_log($strXML);
                $mensajeServicio = $this->cargarMensajeServicioMovimientoContable($strXML);

                /*
                 * De acuerdo a la respuesta del servicio se le notifica al proceso si ha sido X=Exportado , T=transmitido y E=error
                 */
                $this->marcarProcesoExportacionSeven($codigoEmv, $mensajeServicio['error'], $mensajeServicio['identificadormovimientocontable'], $mensajeServicio['mensaje']);
            } catch (\Exception $ex) {
                $this->marcarProcesoExportacionSeven($codigoEmv, 1, 0, $ex->getMessage());
            }
        }
        return $this->EsError;
    }

    /**
     * Permite cambiar el estado del proceso dependiendo al resultado de la ejecución en el servicio
     * @param int $idexportacion identificador del encabezado que se envio a seven 
     * @param int $estado código de error generado por seven si no hay error su respuesta siempre sera 0
     * @param int $consecutivoSeven consecutivo generado por seven para determinar que ha sido procesado con exito este deberá hacer parte del emv
     */
    private function marcarProcesoExportacionSeven($idexportacion, $estado, $consecutivoSeven, $comentario = null) {
        /*
         * Seven genero error se da un tratamiento de error 
         */
        if ($estado > 0 || strpos(strtolower($comentario), 'error')) {
            //Actualización a EMV con estado R y comentario del mensaje de error en emv_comentario
            $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($idexportacion, 'R', $comentario);
            $this->EsError = true;
            return;
        }

        /* No hay error por lo tanto se procede a revisar los consecutivos de seven */
        if (empty($consecutivoSeven)) {
            //TODO: Actualización a EMV con estado T y fecha de exportacion actual 
            $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($idexportacion, 'T', $comentario . "\t No se recibe respuesta de seven");
            $this->EsError = true;
            return;
        }
        //TODO: Actualización a EMV con estado X y fecha de exportacion actual y codigo de consecutivo en seven 
        $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($idexportacion, 'X', '', $consecutivoSeven);
    }

    private function obtenerDetallesContables($codigoEmv) {
        $parametros = array();
        $obtenerDetalleEncabezadosMovimientoContable = $this->MovimientosContablesModel->ObtenerDetalleMovimientoContableModel($codigoEmv);
        foreach ($obtenerDetalleEncabezadosMovimientoContable as $dEncabezado) {
            $parametros[] = $this->cargarDetalleMovimientoContable($dEncabezado);
        }
        return $parametros;
    }

    /**
     * carga los detalles de los movimientos contables
     * @param array $dEncabezado objeto de encabezado de la consulta
     * @return array
     */
    private function cargarDetalleMovimientoContable($dEncabezado) {
        $parametros = array();
        $parametros['Cue_codi'] = $dEncabezado['cue_codi'];
        $parametros['Dmc_desc'] = $dEncabezado['dmc_desc'];
        $parametros['Dmc_acti'] = $dEncabezado['dmc_acti'];
        $parametros['Dmc_refe'] = $dEncabezado['dmc_refe'];
        $parametros['Dmc_vadb'] = $dEncabezado['dmc_vadb'];
        $parametros['Dmc_vacr'] = $dEncabezado['dmc_vacr'];
        $parametros['Dmc_vaba'] = $dEncabezado['dmc_vaba'];
        $parametros['Ter_coda'] = $dEncabezado['ter_coda'];
        $parametros['Arb_codc'] = $dEncabezado['arb_codc'];
        $parametros['Arb_coda'] = $dEncabezado['arb_coda'];
        $parametros['Arb_codp'] = $dEncabezado['arb_codp'];
        $parametros['Arb_cods'] = $dEncabezado['arb_cods'];
        $parametros['Ter_codm'] = $dEncabezado['ter_codm'];
        $parametros['Dmc_cant'] = $dEncabezado['dmc_cant'];
        return $parametros;
    }

    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="WEB SERVICES No 2">

    /**
     * @param type $idmovimiento
     * @return type
     */
    public function ProcesarNotasCaja($idmovimiento) {
        $cargarEncabezadosNotasCaja = $this->MovimientosContablesModel->ObtenerEncabezadoNotaCajaModel($idmovimiento);
        $parametros = array();
        $codigoEmv = 0;
        foreach ($cargarEncabezadosNotasCaja as $encabezadoNotaCaja) {
            try {
                $parametros['pStsncaja']['Emp_codi'] = $encabezadoNotaCaja['emp_codi'];
                $parametros['pStsncaja']['Top_codi'] = $encabezadoNotaCaja['top_codi'];
                $parametros['pStsncaja']['Nca_nume'] = $encabezadoNotaCaja['nca_nume'];
                $parametros['pStsncaja']['Nca_nech'] = $encabezadoNotaCaja['nca_nech'];
                $parametros['pStsncaja']['Nca_natu'] = $encabezadoNotaCaja['nca_natu'];
                $parametros['pStsncaja']['Ter_coda'] = $encabezadoNotaCaja['ter_coda'];
                $parametros['pStsncaja']['Caj_codi'] = $encabezadoNotaCaja['caj_codi'];
                $parametros['pStsncaja']['Nca_valo'] = $encabezadoNotaCaja['nca_valo'];
                $parametros['pStsncaja']['Nca_fopa'] = $encabezadoNotaCaja['nca_fopa'];
                $parametros['pStsncaja']['Cfl_codi'] = $encabezadoNotaCaja['cfl_codi'];
                $parametros['pStsncaja']['Dco_valo'] = $encabezadoNotaCaja['dco_valo'];
                $parametros['pStsncaja']['Dfo_chec'] = $encabezadoNotaCaja['dfo_chec'];
                $parametros['pStsncaja']['Mon_codi'] = $encabezadoNotaCaja['mon_codi'];
                $parametros['pStsncaja']['Tas_valr'] = $encabezadoNotaCaja['tas_valr'];
                $parametros['pStsncaja']['Nca_feta'] = $encabezadoNotaCaja['nca_feta'];
                $parametros['pStsncaja']['Arb_csuc'] = $encabezadoNotaCaja['arb_csuc'];
                $parametros['pStsncaja']['Arb_cpro'] = $encabezadoNotaCaja['arb_cpro'];
                $parametros['pStsncaja']['Arb_ccec'] = $encabezadoNotaCaja['arb_ccec'];
                $parametros['pStsncaja']['Arb_care'] = $encabezadoNotaCaja['arb_care'];
                $parametros['pStsncaja']['Nca_desc'] = $encabezadoNotaCaja['nca_desc'];
                $parametros['pStsncaja']['Nca_esta'] = "A";
                $codigoEmv = $encabezadoNotaCaja['nca_nume'];
                $parametros['pStsncaja']['DetalleConcepto']['TSTSCNCAJ'] = $this->obtenerDetallesNotasCaja($codigoEmv);
                $respuestaServicio = $this->genericoDelegado->invocarServicio(WEB_SERVICE_CAJA, 'InsertarNotas', $parametros);
                $strXML = $respuestaServicio->InsertarNotasResult;
                $mensajeServicio = $this->cargarMensajeServicioNotaCaja($strXML);
                /*
                 * De acuerdo a la respuesta del servicio se le notifica al proceso si ha sido X=Exportado , T=transmitido y E=error
                 */
                $this->marcarProcesoExportacionSeven($codigoEmv, $mensajeServicio['error'], $mensajeServicio['identificadormovimientocontable'], $mensajeServicio['mensaje']);
            } catch (\Exception $ex) {
                $this->marcarProcesoExportacionSeven($codigoEmv, 1, 0, $ex->getMessage());
            }
        }
        return $this->EsError;
    }

    /**
     * Consulta el detalle del encabezado
     * 
     */
    public function obtenerDetallesNotasCaja($codigoEmv) {
        $parametros = array();
        $obtenerDetalleEncabezadosNotasCaja = $this->MovimientosContablesModel->ObtenerDetalleNotaCajaModel($codigoEmv);
        foreach ($obtenerDetalleEncabezadosNotasCaja as $dEncabezado) {
            $parametros[] = $this->cargarDetalleNotasCaja($dEncabezado);
        }
        return $parametros;
    }

    public function cargarDetalleNotasCaja($dEncabezado) {

        $parametros = array();
        $parametros['Dst_codi'] = $dEncabezado['dst_codi'];
        $parametros['Cnc_valo'] = $dEncabezado['cnc_valo'];
        $parametros['Arb_csuc'] = $dEncabezado['arb_csuc'];
        $parametros['Arb_cpro'] = $dEncabezado['arb_cpro'];
        $parametros['Arb_ccec'] = $dEncabezado['arb_ccec'];
        $parametros['Arb_care'] = $dEncabezado['arb_care'];
        $parametros['Cfl_codi'] = $dEncabezado['cfl_codi'];
        $parametros['Cnc_refe'] = $dEncabezado['cnc_refe'];
        return $parametros;
    }

    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="WEB SERVICES No 3">
    /**
     * 
     * @return type
     */
    public function procesarRecaudos($idmovimiento) {
        $cargarEncabezadosRecaudos = $this->MovimientosContablesModel->ObtenerEncabezadosRecaudos($idmovimiento);
        $parametros = array();
        $codigoEmv = 0;
        foreach ($cargarEncabezadosRecaudos as $encabezadoRecaudos) {

            try {
                $parametros['pRecaudo']['Emp_codi'] = $encabezadoRecaudos['emp_codi'];
                $parametros['pRecaudo']['Top_codi'] = $encabezadoRecaudos['top_codi'];
                $parametros['pRecaudo']['Mte_nume'] = $encabezadoRecaudos['mte_nume'];
                $respuestaSeven = $this->sevenModel->ValidarReacaudoDirecto($parametros);
                if ($respuestaSeven['seven'] == 1 || $respuestaSeven['seven'] == 2 || $respuestaSeven['seven'] == 3) {///  hacer la parametrizacion desde sevemodel ()
                    if ($respuestaSeven['seven'] == 1) {
                        $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($encabezadoRecaudos['mte_nume'], 'T', 'Ya existe. No exporta movimiento');
                    }
                    if ($respuestaSeven['seven'] == 2) {
                        $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($encabezadoRecaudos['mte_nume'], 'T', 'Tiene movimientos inconsistentes. No exporta movimiento');
                    }
                    if ($respuestaSeven['seven'] == 3) {
                        $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($encabezadoRecaudos['mte_nume'], 'T', 'Existen varios movimiento Aplicados. No exporta movimiento');
                    }
                    continue;
                }
                $parametros['pRecaudo']['Mte_fech'] = $encabezadoRecaudos['mte_fech'];
                $parametros['pRecaudo']['Mte_desc'] = $encabezadoRecaudos['mte_desc'];
                $parametros['pRecaudo']['Ter_coda'] = $encabezadoRecaudos['ter_coda'];
                $parametros['pRecaudo']['Cfl_codi'] = $encabezadoRecaudos['cfl_codi'];
                $parametros['pRecaudo']['Arb_cods'] = $encabezadoRecaudos['arb_cods'];
                $parametros['pRecaudo']['Caj_codi'] = $encabezadoRecaudos['caj_codi'];
                $parametros['pRecaudo']['Mon_codi'] = $encabezadoRecaudos['mon_codi'];
                $parametros['pRecaudo']['Mte_feta'] = $encabezadoRecaudos['mte_feta'];
                $parametros['pRecaudo']['Mte_tdis'] = $encabezadoRecaudos['mte_tdis'];
                $parametros['pRecaudo']['Mte_nuco'] = $encabezadoRecaudos['mte_nuco'];
                $parametros['pRecaudo']['Reg_inve'] = $encabezadoRecaudos['reg_inve'];
                $parametros['pRecaudo']['Ven_codi'] = $encabezadoRecaudos['ven_codi'];
                $parametros['pRecaudo']['Mte_esta'] = "A";
                $codigoEmv = $encabezadoRecaudos['mte_nume'];
                $parametros['pRecaudo']['vDetalle']['TSTsDreca'] = $this->obtenerDetallesRecaudo($codigoEmv);
                $parametros['pRecaudo']['vFPago']['TSTsDfopa'] = $this->obtenerDetallesFormasPago($codigoEmv);
                /*
                  $document = Array2XML::createXML("InsertarTsRecad", $parametros);
                  print_r($document->saveXML());
                 */

                $respuestaServicio = $this->genericoDelegado->invocarServicio(WEB_SERVICE_RECAUDO, 'InsertarTsRecad', $parametros);
                $strXML = $respuestaServicio->InsertarTsRecadResult;
                $mensajeServicio = $this->cargarMensajeRecaudos($strXML);
                /*
                 * De acuerdo a la respuesta del servicio se le notifica al proceso si ha sido X=Exportado , T=transmitido y E=error
                 */
                $this->marcarProcesoExportacionSeven($codigoEmv, $mensajeServicio['error'], $mensajeServicio['identificadormovimientocontable'], $mensajeServicio['mensaje']);
            } catch (\Exception $ex) {
                $this->marcarProcesoExportacionSeven($codigoEmv, 1, 0, $ex->getMessage());
            }
        }
        return $this->EsError;
    }

    /**
     * Consulta el detalle del encabezado
     * 
     */
    public function obtenerDetallesRecaudo($codigoEmv) {
        $parametros = array();
        $obtenerDetalleEncabezadosRecaudos = $this->MovimientosContablesModel->ObtenerDetalleRecaudoModel($codigoEmv);
        foreach ($obtenerDetalleEncabezadosRecaudos as $dEncabezado) {
            $this->validarDetalleEncabezado($dEncabezado, $dEncabezado['mvre_id']);
            $parametros[] = $this->cargarDetalleRecaudo($dEncabezado, $codigoEmv);
        }
        return $parametros;
    }

    public function cargarDetalleRecaudo($dEncabezado, $codigoEmv) {
        $parametros = array();
        $parametros['Cie_codi'] = $dEncabezado['cie_codi'];
        $parametros['Ter_codd'] = $dEncabezado['ter_codd'];
        $parametros['Cfl_codd'] = $dEncabezado['cfl_codd'];
        $parametros['Rts_valo'] = $dEncabezado['rts_valo'];
        $parametros['Rts_refe'] = $dEncabezado['rts_refe'];

        $parametros['vDistribA']['TSTsDmtes'] = $this->obtenerDistribucionAutomatica($dEncabezado['mvre_id']);
//      Se quita el detalle de los impuestos, porque el webserivices no los acepta en 0 
//      (29-03-2017 -Sandro Rosero y Leonardo Rey)
//        $tstsrdtca = $this->obtenerDetalleImpuesto($codigoEmv);
//        if (!empty($tstsrdtca)) {
//            $parametros['vImpuesto']['TSTsRdtca'] = $this->obtenerDetalleImpuesto($codigoEmv);
//        }
        return $parametros;
    }

    private function validarDistribucionAutomatica($dEncabezado, $idDetalle) {
        $esError = '';
        if (!is_numeric($dEncabezado['tar_codi'])) {
            $esError = $esError . ' El campo tar_codi no puede ser Nulo en la Distribución Automática. Código Error (' . $idDetalle . ')';
        }
        if ($dEncabezado['arb_codi'] == null || $dEncabezado['arb_codi'] == '') {
            $esError = $esError . ' El campo arb_codi no puede ser Nulo en la Distribución Automática. Código Error (' . $idDetalle . ')';
        }
        if ($dEncabezado['dmt_tipo'] == null || $dEncabezado['dmt_tipo'] == '') {
            $esError = $esError . ' El campo dmt_tipo no puede ser Nulo en la Distribución Automática. Código Error (' . $idDetalle . ')';
        }
        if (!is_numeric($dEncabezado['dmt_valo'])) {
            $esError = $esError . ' El campo dmt_valo no puede ser Nulo en la Distribución Automática. Código Error (' . $idDetalle . ')';
        }
        if (!is_numeric($dEncabezado['dmt_porc'])) {
            $esError = $esError . ' El campo dmt_porc no puede ser Nulo en la Distribución Automática. Código Error (' . $idDetalle . ')';
        }
        if (!empty($esError)) {
            throw new MyException($esError, -1);
        }
    }

    public function obtenerDistribucionAutomatica($mvre_id) {
        $parametros = array();
        $obtenerDetalleEncabezadosDistribucionAutomatica = $this->MovimientosContablesModel->ObtenerDetalleDistribucionAutomaticaModel($mvre_id);
        foreach ($obtenerDetalleEncabezadosDistribucionAutomatica as $dEncabezado) {
            $this->validarDistribucionAutomatica($dEncabezado, $mvre_id);
            $parametros[] = $this->cargarDistribucionAutomatica($dEncabezado);
        }
        return $parametros;
    }

    public function cargarDistribucionAutomatica($dEncabezado) {
        $parametros = array();
        $parametros['Tar_codi'] = $dEncabezado['tar_codi'];
        $parametros['Arb_codi'] = $dEncabezado['arb_codi'];
        $parametros['Dmt_tipo'] = $dEncabezado['dmt_tipo'];
        $parametros['Dmt_valo'] = $dEncabezado['dmt_valo'];
        $parametros['Dmt_porc'] = $dEncabezado['dmt_porc'];
        return $parametros;
    }

    public function obtenerDetalleImpuesto($codigoEmv) {
        $parametros = array();
        $obtenerDetalleEncabezadosImpuesto = $this->MovimientosContablesModel->ObtenerDetalleEncabezadoImpuestoModel($codigoEmv);
        foreach ($obtenerDetalleEncabezadosImpuesto as $dEncabezado) {
            $this->validarImpuestos($dEncabezado, $codigoEmv);
            $parametros[] = $this->cargarImpuesto($dEncabezado);
        }
        return $parametros;
    }

    private function validarImpuestos($dEncabezado, $idDetalle) {
        $esError = '';
        if (!is_numeric($dEncabezado['imp_codi'])) {
            $esError = $esError . ' El campo imp_codi no puede ser Nulo en la carga de impuestos. Código Error (' . $idDetalle . ')';
        }
        if (!is_numeric($dEncabezado['dst_codi'])) {
            $esError = $esError . ' El campo dst_codi no puede ser Nulo en la carga de impuestos. Código Error (' . $idDetalle . ')';
        }
        if ($dEncabezado['rdt_imds'] == null || $dEncabezado['rdt_imds'] == '') {
            $esError = $esError . ' El campo rdt_imds no puede ser Nulo valores posibles (I=impuesto, D=Descuento) en la carga de impuestos. Código Error (' . $idDetalle . ')';
        }if ($dEncabezado['arb_csuc'] == null || $dEncabezado['arb_csuc'] == '') {
            $esError = $esError . ' El campo arb_csuc no puede ser Nulo en la carga de impuestos. Código Error (' . $idDetalle . ')';
        }
        if (!is_numeric($dEncabezado['rdt_valo'])) {
            $esError = $esError . ' El campo rdt_valo no puede ser Nulo en la carga de impuestos. Código Error (' . $idDetalle . ')';
        }

        if (!empty($esError)) {
            throw new MyException($esError, -1);
        }
    }

    public function cargarImpuesto($dEncabezado) {
        $parametros = array();
        $parametros['Imp_codi'] = $dEncabezado['imp_codi'];
        $parametros['Dst_codi'] = $dEncabezado['dst_codi'];
        $parametros['Rdt_imds'] = $dEncabezado['rdt_imds'];
        $parametros['Arb_csuc'] = $dEncabezado['arb_csuc'];
        $parametros['Rdt_valo'] = $dEncabezado['rdt_valo'];
        return $parametros;
    }

    public function obtenerDetallesFormasPago($codigoEmv) {
        $parametros = array();
        $obtenerDetalleEncabezadosFormasPago = $this->MovimientosContablesModel->ObtenerDetalleFormasPagoModel($codigoEmv);
        foreach ($obtenerDetalleEncabezadosFormasPago as $dEncabezado) {
            $this->validarFormasPago($dEncabezado, $codigoEmv);
            $parametros[] = $this->cargarFormasPago($dEncabezado);
        }
        return $parametros;
    }

    private function validarFormasPago($dEncabezado, $idDetalle) {
        $esError = '';
        if (!is_numeric($dEncabezado['fpa_codi'])) {
            $esError = $esError . ' El campo fpa_codi no puede ser Nulo en la Forma de pago. Código Error (' . $idDetalle . ')';
        }
        if (!is_numeric($dEncabezado['tac_codi'])) {
            $esError = $esError . ' El campo tac_codi no puede ser Nulo en la Forma de pago. Código Error (' . $idDetalle . ')';
        }
        if ($dEncabezado['dfo_fech'] == null || $dEncabezado['dfo_fech'] == '') {
            $esError = $esError . ' El campo dfo_fech no puede ser Nulo o debe ser una fecha valida (dd/mm/yyyy) en la Forma de pago. Código Error (' . $idDetalle . ')';
        }

        if (!is_numeric($dEncabezado['dfo_valo'])) {
            $esError = $esError . ' El campo dfo_valo no puede ser Nulo en la Forma de pago. Código Error (' . $idDetalle . ')';
        }
        if (!is_numeric($dEncabezado['dfo_viva'])) {
            $esError = $esError . ' El campo dfo_viva no puede ser Nulo en la Forma de pago. Código Error (' . $idDetalle . ')';
        }
        if (!is_numeric($dEncabezado['ban_codi'])) {
            $esError = $esError . ' El campo ban_codi no puede ser Nulo en la Forma de pago. Código Error (' . $idDetalle . ')';
        }
        if (!is_numeric($dEncabezado['dfo_chec'])) {
            $esError = $esError . ' El campo dfo_chec no puede ser Nulo en la Forma de pago. Código Error (' . $idDetalle . ')';
        }
        if ($dEncabezado['dfo_nocu'] == null || $dEncabezado['dfo_nocu'] == '') {
            $esError = $esError . ' El campo dfo_nocu no puede ser Nulo en la Forma de pago. Código Error (' . $idDetalle . ')';
        }
        if ($dEncabezado['dfo_chep'] == null || $dEncabezado['dfo_chep'] == '') {
            $esError = $esError . ' El campo dfo_chep no puede ser Nulo en la Forma de pago. Código Error (' . $idDetalle . ')';
        }
        if (!is_numeric($dEncabezado['dfo_cedu'])) {
            $esError = $esError . ' El campo dfo_cedu no puede ser Nulo en la Forma de pago. Código Error (' . $idDetalle . ')';
        }
        if ($dEncabezado['dfo_nomg'] == null || $dEncabezado['dfo_nomg'] == '') {
            $esError = $esError . ' El campo dfo_nomg no puede ser Nulo en la Forma de pago. Código Error (' . $idDetalle . ')';
        }
        if ($dEncabezado['dfo_clav'] == null || $dEncabezado['dfo_nomg'] == '') {
            $esError = $esError . ' El campo dfo_clav no puede ser Nulo en la Forma de pago. Código Error (' . $idDetalle . ')';
        }
        if (!is_numeric($dEncabezado['dfo_base'])) {
            $esError = $esError . ' El campo dfo_base no puede ser Nulo en la Forma de pago. Código Error (' . $idDetalle . ')';
        }
        if (!empty($esError)) {
            throw new MyException($esError, -1);
        }
    }

    public function cargarFormasPago($dEncabezado) {
        $parametros = array();
        $parametros['Fpa_codi'] = $dEncabezado['fpa_codi'];
        $parametros['Tac_codi'] = $dEncabezado['tac_codi'];
        $parametros['Dfo_fech'] = $dEncabezado['dfo_fech'];
        $parametros['Dfo_valo'] = $dEncabezado['dfo_valo'];
        $parametros['Dfo_viva'] = $dEncabezado['dfo_viva'];
        $parametros['Ban_codi'] = $dEncabezado['ban_codi'];
        $parametros['Dfo_chec'] = $dEncabezado['dfo_chec'];
        $parametros['Dfo_nocu'] = $dEncabezado['dfo_nocu'];
        $parametros['Dfo_chep'] = $dEncabezado['dfo_chep'];
        $parametros['Dfo_cedu'] = $dEncabezado['dfo_cedu'];
        $parametros['Dfo_nomg'] = $dEncabezado['dfo_nomg'];
        $parametros['Dfo_clav'] = $dEncabezado['dfo_clav'];
        $parametros['Dfo_base'] = $dEncabezado['dfo_base'];
        return $parametros;
    }

    //</editor-fold>
    //<editor-fold defaultstate="collapsed" desc="WEB SERVICES No 3">


    public function procesarConsignaciones($idmovimiento) {
        $cargarEncabezadosConsignaciones = $this->MovimientosContablesModel->ObtenerEncabezadosConsignacionesModel($idmovimiento);
        $parametros = array();
        $codigoEmv = 0;
        foreach ($cargarEncabezadosConsignaciones as $encabezadoConsignaciones) {

            try {
                $parametros['pConsig']['Emp_codi'] = $encabezadoConsignaciones['emp_codi'];
                $parametros['pConsig']['Top_codi'] = $encabezadoConsignaciones['top_codi'];
                $parametros['pConsig']['Mte_nume'] = $encabezadoConsignaciones['mte_nume'];
                $respuestaSeven = $this->sevenModel->ValidarConsignacionDirecta($parametros);
                if ($respuestaSeven['seven'] == 1 || $respuestaSeven['seven'] == 2 || $respuestaSeven['seven'] == 3) {///  hacer la parametrizacion desde sevemodel ()
                    if ($respuestaSeven['seven'] == 1) {
                        $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($encabezadoConsignaciones['mte_nume'], 'T', 'Ya existe. No exporta movimiento');
                    }
                    if ($respuestaSeven['seven'] == 2) {
                        $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($encabezadoConsignaciones['mte_nume'], 'T', 'Tiene movimientos inconsistentes. No exporta movimiento');
                    }
                    if ($respuestaSeven['seven'] == 3) {
                        $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($encabezadoConsignaciones['mte_nume'], 'T', 'Existen varios movimiento Aplicados. No exporta movimiento');
                    }
                    continue;
                }
                $parametros['pConsig']['Mte_fech'] = $encabezadoConsignaciones['mte_fech'];
                $parametros['pConsig']['Mte_fcon'] = $encabezadoConsignaciones['mte_fcon'];
                $parametros['pConsig']['Mte_desc'] = $encabezadoConsignaciones['mte_desc'];
                $parametros['pConsig']['Ter_coda'] = $encabezadoConsignaciones['ter_coda'];
                $parametros['pConsig']['Mte_fopa'] = $encabezadoConsignaciones['mte_fopa'];
                $parametros['pConsig']['Mon_codi'] = $encabezadoConsignaciones['mon_codi'];
                $parametros['pConsig']['Mte_feta'] = $encabezadoConsignaciones['mte_feta'];
                $parametros['pConsig']['Arb_cods'] = $encabezadoConsignaciones['arb_cods'];
                $parametros['pConsig']['Cub_nume'] = $encabezadoConsignaciones['cub_nume'];
                $parametros['pConsig']['Mte_recd'] = $encabezadoConsignaciones['mte_recd'];
                $parametros['pConsig']['Cfl_codi'] = $encabezadoConsignaciones['cfl_codi'];
                $parametros['pConsig']['Reg_inve'] = $encabezadoConsignaciones['reg_inve'];
                $parametros['pConsig']['Mte_tdis'] = $encabezadoConsignaciones['mte_tdis'];
                $codigoEmv = $encabezadoConsignaciones['mte_nume'];
                $parametros['pConsig']['vDetalle']['TSTsDcond'] = $this->obtenerDetallesConsignaciones($codigoEmv);
                /* $document = Array2XML::createXML("InsertarTsConsd", $parametros);
                  print_r($document->saveXML());
                 */
                $respuestaServicio = $this->genericoDelegado->invocarServicio(WEB_SERVICE_CONSIGNACIONES, 'InsertarTsConsd', $parametros);
                $strXML = $respuestaServicio->InsertarTsConsdResult;
                $mensajeServicio = $this->cargarMensajeConsignaciones($strXML);


                /* De acuerdo a la respuesta del servicio se le notifica al proceso si ha sido X=Exportado , T=transmitido y E=error
                 */
                $this->marcarProcesoExportacionSeven($codigoEmv, $mensajeServicio['error'], $mensajeServicio['identificadormovimientocontable'], $mensajeServicio['mensaje']);
            } catch (\Exception $ex) {
                $this->marcarProcesoExportacionSeven($codigoEmv, 1, 0, $ex->getMessage());
            }
        }
        return $this->EsError;
    }

    public function obtenerDetallesConsignaciones($codigoEmv) {
        $parametros = array();
        $obtenerDetalleEncabezadosConsignaciones = $this->MovimientosContablesModel->ObtenerDetalleConsignacionesModel($codigoEmv);
        foreach ($obtenerDetalleEncabezadosConsignaciones as $dEncabezado) {
            $this->validarDetalleEncabezado($dEncabezado, $dEncabezado['mvcs_id']);
            $parametros[] = $this->cargarDetallesConsignaciones($dEncabezado, $codigoEmv);
        }
        return $parametros;
    }

    /**
     * PErmite validar los detalles de los encabezados que se preparan npara la exportación 
     * @param type $dEncabezado Objeto con el detll
     * @param type $idDetalle identificador del detalle 
     * @throws MyException
     */
    private function validarDetalleEncabezado($dEncabezado, $idDetalle) {
        $esError = '';
        if (!is_numeric($dEncabezado['cie_codi'])) {
            $esError = $esError . ' El campo cie_codi no puede ser Nulo En el detalle del encabezado. Código Error (' . $idDetalle . ')';
        }
        if ($dEncabezado['ter_codd'] == null || $dEncabezado['ter_codd'] == '') {
            $esError = $esError . ' El campo ter_codd no puede ser Nulo En el detalle del encabezado. Código Error (' . $idDetalle . ')';
        }
        if ($dEncabezado['cfl_codd'] == null || $dEncabezado['cfl_codd'] == '') {
            $esError = $esError . ' El campo cfl_codd no puede ser Nulo En el detalle del encabezado. Código Error (' . $idDetalle . ')';
        }
        if (!is_numeric($dEncabezado['rts_valo'])) {
            $esError = $esError . ' El campo rts_valo no puede ser Nulo En el detalle del encabezado. Código Error (' . $idDetalle . ')';
        }
        if ($dEncabezado['rts_refe'] == null || $dEncabezado['rts_refe'] == '') {
            $esError = $esError . ' El campo rts_refe no puede ser Nulo En el detalle del encabezado. Código Error (' . $idDetalle . ')';
        }
        if (!empty($esError)) {
            throw new MyException($esError, -1);
        }
    }

    private function validarDetalleFacturaProveedor($dEncabezado, $idDetalle) {
        $esError = '';
        if (!is_numeric($dEncabezado['bod_codi'])) {
            $esError = $esError . ' El campo bod_codi no puede ser Nulo En el detalle del encabezado. Código Error (' . $idDetalle . ')';
        }
        if ($dEncabezado['pvd_coda'] == null || $dEncabezado['pvd_coda'] == '') {
            $esError = $esError . ' El campo pvd_coda no puede ser Nulo En el detalle del encabezado. Código Error (' . $idDetalle . ')';
        }
        if ($dEncabezado['ter_coda'] == null || $dEncabezado['ter_coda'] == '') {
            $esError = $esError . ' El campo ter_coda no puede ser Nulo En el detalle del encabezado. Código Error (' . $idDetalle . ')';
        }
        if ($dEncabezado['pro_codi'] == null || $dEncabezado['pro_codi'] == '') {
            $esError = $esError . ' El campo pro_codi no puede ser Nulo En el detalle del encabezado. Código Error (' . $idDetalle . ')';
        }
        if (!is_numeric($dEncabezado['dfa_valo'])) {
            $esError = $esError . ' El campo dfa_valo no puede ser Nulo En el detalle del encabezado. Código Error (' . $idDetalle . ')';
        }
        if ($dEncabezado['dfa_refe'] == null || $dEncabezado['dfa_refe'] == '') {
            $esError = $esError . ' El campo rts_refe no puede ser Nulo En el detalle del encabezado. Código Error (' . $idDetalle . ')';
        }
        if (!empty($esError)) {
            throw new MyException($esError, -1);
        }
    }

    public function cargarDetallesConsignaciones($dEncabezado, $codigoEmv) {
        $parametros = array();
        $parametros['Cie_codi'] = $dEncabezado['cie_codi'];
        $parametros['Ter_codd'] = $dEncabezado['ter_codd'];
        $parametros['Cfl_codd'] = $dEncabezado['cfl_codd'];
        $parametros['Rts_valo'] = $dEncabezado['rts_valo'] * 1;
        $parametros['Rts_refe'] = $dEncabezado['rts_refe'];
        $parametros['vDistribA']['TSTsDmtes'] = $this->obtenerDetallesConsignacionesDistribuacionAutomatica($dEncabezado['mvcs_id']);
        $parametros['vImpuesto']['TSTsRdtca'] = $this->obtenerDetallesConsignacionesImpuestos($codigoEmv);
        return $parametros;
    }

    public function obtenerDetallesConsignacionesDistribuacionAutomatica($mvcs_id) {
        $parametros = array();
        $obtenerDetalleEncabezadosDistribucionAutomatica = $this->MovimientosContablesModel->obtenerDetallesConsignacionesDistribuacionAutomaticaModel($mvcs_id);
        foreach ($obtenerDetalleEncabezadosDistribucionAutomatica as $dEncabezado) {
            $this->validarDistribucionAutomatica($dEncabezado, $mvcs_id);
            $parametros[] = $this->cargarDetallesConsignacionesDistribucionAutomatica($dEncabezado);
        }
        return $parametros;
    }

    public function cargarDetallesConsignacionesDistribucionAutomatica($dEncabezado) {
        $parametros = array();
        $parametros['Tar_codi'] = $dEncabezado['tar_codi'];
        $parametros['Arb_codi'] = $dEncabezado['arb_codi'];
        $parametros['Dmt_tipo'] = $dEncabezado['dmt_tipo'];
        $parametros['Dmt_valo'] = $dEncabezado['dmt_valo'] * 1;
        $parametros['Dmt_porc'] = $dEncabezado['dmt_porc'] * 1;

        return $parametros;
    }

    public function obtenerDetallesConsignacionesImpuestos($codigoEmv) {
        $parametros = array();
        $obtenerDetalleEncabezadosImpuestos = $this->MovimientosContablesModel->obtenerDetallesConsignacionesImpuestosModel($codigoEmv);
        foreach ($obtenerDetalleEncabezadosImpuestos as $dEncabezado) {

            if (empty($dEncabezado['imp_codi'])) {
                break;
            }

            $parametros[] = $this->cargarDetallesConsignacionesImpuestos($dEncabezado);
        }
        return $parametros;
    }

    public function cargarDetallesConsignacionesImpuestos($dEncabezado) {
        $parametros = array();
        $parametros['Imp_codi'] = $dEncabezado['imp_codi'];
        $parametros['Dst_codi'] = $dEncabezado['dst_codi'];
        $parametros['Rdt_imds'] = $dEncabezado['rdt_imds'];
        $parametros['Arb_csuc'] = $dEncabezado['arb_csuc'];
        $parametros['Rdt_valo'] = $dEncabezado['rdt_valo'] * 1;

        return $parametros;
    }

    //</editor-fold>

    public function reGenerarMovimientoContable($idMovimiento) {

        return $respuesta = $this->MovimientosContablesModel->reGenerarMovimientoContableModel($idMovimiento);
    }

    public function reGenerarMovimientoContableExportado($idMovimiento) {
        return $respuesta = $this->MovimientosContablesModel->reGenerarMovimientoContableExportadoModel($idMovimiento);
    }

    //****************
    /* -----------------------------FacturaCliente---------------------------------------------- */

    /**
     * Permite procesar los movimientos contables
     * @return Int
     */
    public function procesarFacturaCliente($idmovimiento) {
        $cargarEncabezadosConsignaciones = $this->MovimientosContablesModel->ObtenerEncabezadosFacturaClienteModel($idmovimiento);
        $parametros = array();
        $codigoEmv = 0;
        foreach ($cargarEncabezadosConsignaciones as $encabezadoConsignaciones) {

            try {
                $parametros['pFactura']['Emp_codi'] = $encabezadoConsignaciones['emp_codi'];
                $parametros['pFactura']['Top_codi'] = $encabezadoConsignaciones['top_codi'];
                $parametros['pFactura']['Fac_nume'] = $encabezadoConsignaciones['fac_nume'];
                $respuestaSeven = $this->sevenModel->ValidarFacturaCliente($parametros);
                if ($respuestaSeven['seven'] == 1 || $respuestaSeven['seven'] == 2 || $respuestaSeven['seven'] == 3) {///  hacer la parametrizacion desde sevemodel ()
                    if ($respuestaSeven['seven'] == 1) {
                        $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($encabezadoConsignaciones['fac_nume'], 'T', 'Ya existe. No exporta movimiento');
                    }
                    if ($respuestaSeven['seven'] == 2) {
                        $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($encabezadoConsignaciones['fac_nume'], 'T', 'Tiene movimientos inconsistentes. No exporta movimiento');
                    }
                    if ($respuestaSeven['seven'] == 3) {
                        $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($encabezadoConsignaciones['fac_nume'], 'T', 'Existen varios movimiento Aplicados. No exporta movimiento');
                    }
                    continue;
                }
                $parametros['pFactura']['Fac_fech'] = $encabezadoConsignaciones['fac_fech'];
                $parametros['pFactura']['Fac_desc'] = $encabezadoConsignaciones['fac_desc'];
                $parametros['pFactura']['Arb_csuc'] = $encabezadoConsignaciones['arb_csuc'];
                $parametros['pFactura']['Cli_coda'] = $encabezadoConsignaciones['cli_coda'];
                $parametros['pFactura']['Dcl_codd'] = $encabezadoConsignaciones['dcl_codd'];
                $parametros['pFactura']['Mon_codi'] = $encabezadoConsignaciones['mon_codi'];
                $parametros['pFactura']['Fac_tdis'] = $encabezadoConsignaciones['fac_tdis'];
                $parametros['pFactura']['Fac_tipo'] = $encabezadoConsignaciones['fac_tipo'];
                $parametros['pFactura']['Fac_feta'] = $encabezadoConsignaciones['fac_feta'];
                $parametros['pFactura']['Fac_feci'] = $encabezadoConsignaciones['fac_feci'];
                $parametros['pFactura']['Fac_fecf'] = $encabezadoConsignaciones['fac_fecf'];
                $parametros['pFactura']['Fac_cref'] = $encabezadoConsignaciones['fac_cref'];
                $parametros['pFactura']['Fac_fepo'] = $encabezadoConsignaciones['fac_fepo'];
                $parametros['pFactura']['Fac_fepe'] = $encabezadoConsignaciones['fac_fepe'];
                $parametros['pFactura']['Fac_fext'] = $encabezadoConsignaciones['fac_fext'];
                $parametros['pFactura']['Mco_cont'] = $encabezadoConsignaciones['mco_cont'];
                $parametros['pFactura']['Fac_tido'] = $encabezadoConsignaciones['fac_tido'];
                $parametros['pFactura']['Fac_pepe'] = $encabezadoConsignaciones['fac_pepe'];
                $parametros['pFactura']['Fac_pext'] = $encabezadoConsignaciones['fac_pext'];
                $parametros['pFactura']['Fac_peri'] = $encabezadoConsignaciones['fac_peri'];
                $codigoEmv = $encabezadoConsignaciones['mte_nume'];

                $parametros['pFactura']['vDetalle']['TSFaDfact'] = $this->obtenerDetallesFacturaCliente($codigoEmv);
                /*
                  $document = Array2XML::createXML("InsertarMovContable", $parametros);
                  print_r($document->saveXML());
                 */

                $respuestaServicio = $this->genericoDelegado->invocarServicio(WEB_SERVICE_FACTURA_CLIENTE, 'InsertarFactura', $parametros);
                $strXML = $respuestaServicio->InsertarMovContableResult;
                error_log($strXML);
                $mensajeServicio = $this->cargarMensajeServicioMovimientoContable($strXML);

                /*
                 * De acuerdo a la respuesta del servicio se le notifica al proceso si ha sido X=Exportado , T=transmitido y E=error
                 */
                $this->marcarProcesoExportacionSeven($codigoEmv, $mensajeServicio['error'], $mensajeServicio['identificadormovimientocontable'], $mensajeServicio['mensaje']);
            } catch (\Exception $ex) {
                $this->marcarProcesoExportacionSeven($codigoEmv, 1, 0, $ex->getMessage());
            }
        }
        return $this->EsError;
    }

    public function obtenerDetallesFacturaCliente($codigoEmv) {
        $parametros = array();
        $obtenerDetalleEncabezadosFacturaCliente = $this->MovimientosContablesModel->ObtenerDetalleFacturaClienteModel($codigoEmv);
        foreach ($obtenerDetalleEncabezadosFacturaCliente as $dEncabezado) {
            // $this->validarDetalleEncabezado($dEncabezado, $dEncabezado['mvfc_id']);
            $parametros[] = $this->cargarDetallesFacturaCliente($dEncabezado, $codigoEmv);
        }
        return $parametros;
    }

    public function cargarDetallesFacturaCliente($dEncabezado, $codigoEmv) {
        $parametros = array();
        $parametros['Tar_codi'] = $dEncabezado['tar_codi'];
        $parametros['Arb_codi'] = $dEncabezado['arb_codi'];
        $parametros['Ddi_tipo'] = $dEncabezado['ddi_tipo'];
        $parametros['Ddi_valo'] = $dEncabezado['ddi_valo'] * 1;
        $parametros['Ddi_porc'] = $dEncabezado['ddi_porc'];
        $parametros['vDistribA']['TSFaDdisp'] = $this->obtenerDetallesFacturaClienteAutomatica($dEncabezado['mvfc_id']);
        return $parametros;
    }

    public function obtenerDetallesFacturaClienteAutomatica($mvcs_id) {
        $parametros = array();
        $obtenerDetalleEncabezadosDistribucionAutomatica = $this->MovimientosContablesModel->obtenerDetallesFacturaClienteAutomaticaModel($mvcs_id);
        foreach ($obtenerDetalleEncabezadosDistribucionAutomatica as $dEncabezado) {
            $this->validarDistribucionAutomatica($dEncabezado, $mvcs_id);
            $parametros[] = $this->cargarDetallesConsignacionesDistribucionAutomatica($dEncabezado);
        }
        return $parametros;
    }

    /* -----------------------------FacturaProveedor---------------------------------------------- */

    /**
     * Permite procesar los movimientos contables
     * @return Int
     */
    public function procesarFacturaProveedor($idmovimiento) {

        $cargarEncabezadosFacturaProveedor = $this->MovimientosContablesModel->obtenerEncabezadosFacturaProveedorModel($idmovimiento);
        $parametros = array();
        $codigoEmv = 0;
        foreach ($cargarEncabezadosFacturaProveedor as $encabezadoFacturaProveedor) {

            try {
                $parametros['pFactura']['Emp_codi'] = $encabezadoFacturaProveedor['emp_codi'];
                $parametros['pFactura']['Top_codi'] = $encabezadoFacturaProveedor['top_codi'];
                $parametros['pFactura']['Fac_nume'] = $encabezadoFacturaProveedor['fac_nume'];
                //$respuestaSeven = '' ;
                $respuestaSeven = $this->sevenModel->ValidarFacturaProveedor($parametros);
                if ($respuestaSeven['seven'] == 1 || $respuestaSeven['seven'] == 2 || $respuestaSeven['seven'] == 3) {///  hacer la parametrizacion desde sevemodel ()
                    if ($respuestaSeven['seven'] == 1) {
                        $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($encabezadoFacturaProveedor['fac_nume'], 'T', 'Ya existe. No exporta movimiento');
                    }
                    if ($respuestaSeven['seven'] == 2) {
                        $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($encabezadoFacturaProveedor['fac_nume'], 'T', 'Tiene movimientos inconsistentes. No exporta movimiento');
                    }
                    if ($respuestaSeven['seven'] == 3) {
                        $this->MovimientosContablesModel->cambiarEstadoMovimientoContableModel($encabezadoFacturaProveedor['fac_nume'], 'T', 'Existen varios movimiento Aplicados. No exporta movimiento');
                    }
                    continue;
                }
                $parametros['pFactura']['Fac_fech'] = $encabezadoFacturaProveedor['fac_fech'];
                $parametros['pFactura']['Fac_feve'] = $encabezadoFacturaProveedor['fac_feve'];
                $parametros['pFactura']['Arb_cods'] = $encabezadoFacturaProveedor['arb_cods'];
                $parametros['pFactura']['Fac_desc'] = $encabezadoFacturaProveedor['fac_desc'];
                $parametros['pFactura']['Pvd_coda'] = $encabezadoFacturaProveedor['pvd_coda'];
                $parametros['pFactura']['Dep_codd'] = $encabezadoFacturaProveedor['dep_codd'];
                $parametros['pFactura']['Fac_tipo'] = $encabezadoFacturaProveedor['fac_tipo'];
                $parametros['pFactura']['Fac_pref'] = $encabezadoFacturaProveedor['fac_pref'];
                $parametros['pFactura']['Fac_esta'] = $encabezadoFacturaProveedor['fac_esta'];
                $parametros['pFactura']['Fac_nfap'] = $encabezadoFacturaProveedor['fac_nfap'];
                $parametros['pFactura']['Mon_codi'] = $encabezadoFacturaProveedor['mon_codi'];
                $parametros['pFactura']['Cal_impu'] = $encabezadoFacturaProveedor['cal_impu'];
                $parametros['pFactura']['Fac_base'] = $encabezadoFacturaProveedor['fac_base'];
                $parametros['pFactura']['Bir_cont'] = $encabezadoFacturaProveedor['bir_cont'];
                $parametros['pFactura']['Fac_auto'] = $encabezadoFacturaProveedor['fac_auto'];
                $parametros['pFactura']['Fac_tdis'] = $encabezadoFacturaProveedor['fac_tdis'];
                $codigoEmv = $encabezadoFacturaProveedor['fac_nume'];

                $parametros['pFactura']['vDetalle']['TSPoDfact1'] = $this->obtenerDetallesFacturaProveedor($codigoEmv);
                $obtenerDetalleConceptoAdicionalFacturaCliente = $this->MovimientosContablesModel->obtenerConceptoAdicionalFacturaProveedorModel($codigoEmv);
                if(!empty($obtenerDetalleConceptoAdicionalFacturaCliente)){
                    $parametros['pFactura']['vCAdic'] = $this->obtenerConceptoAdicionalFacturaProveedor($codigoEmv);
                }

                // print_r($parametros);

                $document = Array2XML::createXML("InsertarPoFactu", $parametros);
                // print_r($document->saveXML());


                $respuestaServicio = $this->genericoDelegado->invocarServicio(WEB_SERVICE_FACTURA_PROVEEDOR, 'InsertarPoFactu', $parametros);
                //var_dump($respuestaServicio);
                $strXML = $respuestaServicio->InsertarPoFactuResult;
                error_log($strXML);
                $mensajeServicio = $this->cargarMensajeServicioFacturaProveedor($strXML);

                /*
                 * De acuerdo a la respuesta del servicio se le notifica al proceso si ha sido X=Exportado , T=transmitido y E=error
                 */
                $this->marcarProcesoExportacionSeven($codigoEmv, $mensajeServicio['error'], $mensajeServicio['identificadormovimientocontable'], $mensajeServicio['mensaje']);
            } catch (\Exception $ex) {
                $this->marcarProcesoExportacionSeven($codigoEmv, 1, 0, $ex->getMessage());
            }
        }
        return $this->EsError;
    }

    public function obtenerDetallesFacturaProveedor($codigoEmv) {

        $parametros2 = array();
        $obtenerDetalleEncabezadosFacturaCliente = $this->MovimientosContablesModel->obtenerDetallesFacturaPreveedorModel($codigoEmv);
        foreach ($obtenerDetalleEncabezadosFacturaCliente as $dEncabezado) {
            $parametros = array();
            $this->validarDetalleFacturaProveedor($dEncabezado, $dEncabezado['mvfc_id']);
            $parametros['Bod_codi'] = $dEncabezado['bod_codi'];
            $parametros['Pvd_coda'] = $dEncabezado['pvd_coda'];
            $parametros['Dep_codd'] = $dEncabezado['dep_codd'];
            $parametros['Pro_codi'] = $dEncabezado['pro_codi'];
            $parametros['Dfa_dest'] = $dEncabezado['dfa_dest'];
            $parametros['Dfa_cant'] = $dEncabezado['dfa_cant'];
            $parametros['Dfa_valo'] = $dEncabezado['dfa_valo'];
            $parametros['Dfa_desc'] = $dEncabezado['dfa_desc'];
            $parametros['Ter_coda'] = $dEncabezado['ter_coda'];
            $parametros['Dfa_refe'] = $dEncabezado['dfa_refe'];

            $parametros['vDistrib']['TSPoDdisp1'] = $this->cargarDetallesDistribucionFacturaProveedor($dEncabezado, $codigoEmv);

            $parametros2[] = $parametros;
            // $parametros['vDistrib'] = '' ;
        }
        return $parametros2;
    }

    public function obtenerConceptoAdicionalFacturaProveedor($codigoEmv) {
        $parametros = array();
        $parametros2 = array();
        $obtenerDetalleConceptoAdicionalFacturaCliente = $this->MovimientosContablesModel->obtenerConceptoAdicionalFacturaProveedorModel($codigoEmv);

        foreach ($obtenerDetalleConceptoAdicionalFacturaCliente as $dAdiEncabezado) {
            $parametros['Coa_codi'] = $dAdiEncabezado['coa_codi'];
            $parametros['Coa_valo'] = $dAdiEncabezado['coa_valo'];
            $parametros2['TSPoDcoad1'][] = $parametros;
        }
        if (empty($parametros2)) {
            $parametros2['TSPoDcoad1'] = '';
        }

        return $parametros2;
    }

    public function cargarDetallesDistribucionFacturaProveedor($dEncabezado, $codigoEmv) {
        $parametros = array();
        $parametros = $this->obtenerDetallesFacturaProveedorAutomatica($dEncabezado['mvfc_id']);
        return $parametros;
    }

    public function obtenerDetallesFacturaProveedorAutomatica($mvfp_id) {
        $parametros2 = array();
        $obtenerDetalleEncabezadosDistribucionAutomatica = $this->MovimientosContablesModel->obtenerDetallesFacturaProveedorAutomaticaModel($mvfp_id);

        foreach ($obtenerDetalleEncabezadosDistribucionAutomatica as $disdEncabezado) {
            $parametros = array();
            $this->validarDistribucionAutomatica($disdEncabezado, $mvfp_id);
            $parametros['Tar_codi'] = $disdEncabezado['tar_codi'] * 1;
            $parametros['Arb_codi'] = $disdEncabezado['arb_codi'];
            $parametros['Ddi_porc'] = $disdEncabezado['dmt_porc'] * 1;
          //  $parametros['Ddi_tipo'] = $disdEncabezado['dmt_tipo'];
            //$parametros['Ddi_valo'] = $disdEncabezado['dmt_valo'] * 1;
            $parametros2[] = $parametros;
        }
        /*
          $parametros['Arb_codc'] = '1604101';
          $parametros['Arb_coda'] = '22011' ;
          $parametros['Arb_codp'] = '999';
          $parametros['Arb_cods'] = '1010101' ;
          $parametros['Ddi_porc'] = 100 ;
          $parametros['Ddi_tipo'] = 'P';
          $parametros['Ddi_valo'] = 0 ;

          $parametros2['TSPoDdisp1'][] = $parametros;
         */


        return $parametros2;
    }

    //****************
}

?>
