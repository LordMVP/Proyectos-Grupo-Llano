<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Models\TarifasModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Clase encargada de administrar los recaudos en forma de abono.
 */
class TarifasController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $conexion = Util::getConexion($this);
        $tarifasModel = new TarifasModel($conexion);
        $parametros['idempresa'] = $sesion->get('idempresa');
        $periodo = $tarifasModel->consultaPeriodos($parametros);
        $mercados = $tarifasModel->consultaMercados($parametros);
        if (empty($mercados)) {
            $mercados[0]['idmercado'] = '-1';
            $mercados[0]['mercado'] = 'Empresa no tiene mercados asociados';
        }
        $lisParametros = array();
        $lisParametros['periodo'] = $periodo;
        $lisParametros['mercados'] = $mercados;
        $lisParametros['empresa'] = $sesion->get('empresa');
        $response = $this->render('LlanogasLlanogasBundle:Facturacion:reporteTarifas.html.twig', $lisParametros);
        return $response;
    }

    /**
     * Método que filtra las suscripciones a las que se les puede hacer 
     * abono
     * @return json Objeto json con el arreglo de los registros.
     * @throws MyException Error sí el usuario  no digita los parámetros 
     */
    public function consultarTarifasAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            if (empty($request->get('periodo')) && empty($request->get('mercado'))) {
                throw new MyException("Error en los criterios de búsqueda", -1);
            }
            $tarifasModelo = new TarifasModel($conexion);
            $parametros['periodo'] = $request->get('periodo');
            $parametros['mercado'] = $request->get('mercado');
            $parametros['idempresa'] = $sesion->get('idempresa');
            $tarifas = array();
            $tarifas = $tarifasModelo->consultarTarifasHomlogadas($parametros);
            $respuesta["codigoRespuesta"] = (empty($tarifas)) ? 0 : 1;
            $respuesta['tarifas'] = $tarifas;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function consultarTarifasExcelAction() {
        try {
            $request = $this->getRequest();
//        Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $tarifasModelo = new TarifasModel($conexion);
            $parametros['periodo'] = $request->get('periodo');
            $parametros['mercado'] = $request->get('mercado');
            $parametros['idempresa'] = $sesion->get('idempresa');
            
            $tarifas = $tarifasModelo->consultarTarifasHomlogadas($parametros);
            if (!empty($tarifas)) {
                $parametros['tarifas'] = $tarifas;
                $parametros['empresa'] = $sesion->get('empresa');
                $objPhpExcel = $this->construyeExcel($parametros);
                $this->response = new StreamedResponse();
                $formato = 'Excel2007';
                $nombre_archivo = $parametros['empresa'].'_'.$parametros['periodo'] ;
                $this->response->setCallback(function()use($formato, $objPhpExcel) {
                    $objWriter = \PHPExcel_IOFactory::createWriter($objPhpExcel, $formato);
                    $objWriter->save('php://output');
                });
                $this->response->setStatusCode(200);
                $this->response->headers->set('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
                $this->response->headers->set('Content-Disposition', 'attachment; filename='.$nombre_archivo.'.xls');
                return $this->response;
            }
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = 'No información para generar el Archivo en Excel';
        }
        return Util::construyeRespuesta($respuesta);
    }

    private function construyeExcel($parametros) {
        $nombre = RUTA_PRINCIPAL . '/app/Resources/formatos/facturacion/ResumenTarifas.xls';
        $objReader = \PHPExcel_IOFactory::createReaderForFile($nombre);
        $hoja = array('Resumen', 'Resumen');
        $objReader->setLoadSheetsOnly($hoja);
        $xlsObj = $objReader->load($nombre);
        $sheetActive = $xlsObj->getActiveSheet();
        $fila = 9;
        $fecha = \date('d-m-Y H:i:s', time());
        $sheetActive->setCellValue('B3', $fecha);
        $sheetActive->setCellValue('B4', $parametros['empresa']);
        $sheetActive->setCellValue('B5', $parametros['periodo']);
        
        foreach ($parametros['tarifas'] as $registro) {

            if ($parametros['mercado'] == -1 && $fila == 9) {
                $sheetActive->setCellValue('B6', ' Todos los Mercados');
            } else if ($fila == 9) {
                $sheetActive->setCellValue('B6', $parametros['mercado'] . ' - ' . $registro['mercado']);
            }

            $sheetActive->setCellValue('A' . $fila, $registro['mercado'])
                    ->setCellValue('B' . $fila, $registro['idconcepto'])
                    ->setCellValue('C' . $fila, $registro['concepto'])
                    ->setCellValue('D' . $fila, $registro['rangoinicial'])
                    ->setCellValue('E' . $fila, $registro['rangofinal'])
                    ->setCellValue('F' . $fila, $registro['valorreingenieria'])
                    ->setCellValue('G' . $fila, $registro['codvariable'])
                    ->setCellValue('H' . $fila, $registro['aliasvariable'])
                    ->setCellValue('I' . $fila, $registro['valortarifas']);
            $fila += 1;
        }
//        print_r($xlsObj);
        return $xlsObj;
    }

}
