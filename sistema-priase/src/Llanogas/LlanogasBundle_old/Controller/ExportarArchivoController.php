<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Delegado\NotasAutomaticasDelegado;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Clase que se encarga de exportar los registros que se afectaron con las notas directas
 */
class ExportarArchivoController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $conexion = Util::getConexion($this);
        $idAcceso = $sesion->get('idacceso');
        $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso, PROGRAMA_NOTA_DIRECTA);
        $registros = $notasDelegado->getConceptosAfectadosExportar();
        //Se crea el objeto PHPExcel que crea el archivo de excel
        $this->objPHPExcel = new \PHPExcel();
        $this->objPHPExcel->
                getProperties()
                ->setCreator("appfuture")
                ->setLastModifiedBy("appfuture")
                ->setTitle("Facturas procesadas")
                ->setSubject("Facturas y conceptos")
                ->setDescription("Facturas con sus respectivos conceptos procesados")
                ->setKeywords("facturas conceptos")
                ->setCategory("Facturas");
        //Se valida que la lista de los registros a mostrar no esté vacío
        if (!empty($registros)) {
            $i = 1;
            $idFactura = $registros[0]['idfactura'];
            $this->crearEncabezadoAfectados($i++);
            foreach ($registros as $registro) {
                if ($idFactura != $registro['idfactura']) {
                    $idFactura = $registro['idfactura'];
                    $i += 2;
                    $this->crearEncabezadoAfectados($i++);
                }
                $this->objPHPExcel->setActiveSheetIndex(0)
                        ->setCellValue('A' . $i, $registro['iddetallefactura'])
                        ->setCellValue('B' . $i, $registro['idfactura'])
                        ->setCellValue('C' . $i, $registro['numerofactura'])
                        ->setCellValue('D' . $i, $registro['idconcepto'])
                        ->setCellValue('E' . $i, $registro['concepto'])
                        ->setCellValue('F' . $i, $registro['valorinicial'])
                        ->setCellValue('G' . $i, $registro['saldoconcepto'])
                        ->setCellValue('H' . $i, $registro['valorpagado'])
                        ->setCellValue('I' . $i, $registro['valornota'])
                        ->setCellValue('J' . $i, $registro['resultado'])
                        ->setCellValue('K' . $i, $registro['operacion']);

                $i++;
            }
        }
        $this->response = new StreamedResponse();
        $formato = 'Excel2007';
        //Se escribe el buffer del cliente
        $this->response->setCallback(function()use($formato) {
            $objWriter = \PHPExcel_IOFactory::createWriter($this->objPHPExcel, $formato);
            $objWriter->save('php://output');
        });
        $this->response->setStatusCode(200);
        //Se establece el tipo de respuesta en éste caso excel
        $this->response->headers->set('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
        //Se establece un nombre predeterminado para el archivo a descargar
        $this->response->headers->set('Content-Disposition', 'attachment; filename=notas.xlsx');
        return $this->response;
    }

    /**
     * Se crea el encabezado del archivo
     * @param type $i fila a llenar
     */
    private function crearEncabezadoAfectados($i) {
        $this->objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('A' . $i, 'iddetallefactura')
                ->setCellValue('B' . $i, 'idfactura')
                ->setCellValue('C' . $i, 'numerofactura')
                ->setCellValue('D' . $i, 'idconcepto')
                ->setCellValue('E' . $i, 'concepto')
                ->setCellValue('F' . $i, 'valorinicial')
                ->setCellValue('G' . $i, 'saldoconcepto')
                ->setCellValue('H' . $i, 'valorpagado')
                ->setCellValue('I' . $i, 'valornota')
                ->setCellValue('J' . $i, 'resultado')
                ->setCellValue('K' . $i, 'operacion');
    }

    /**
     * Consulta las facturas sin realizar el cambio
     * @return archivo de excel con las facturas antes de realizar la nota
     */
    public function facturasOriginalesAction() {
        $sesion = Util::iniciarSesion($this);
        $conexion = Util::getConexion($this);
        $idAcceso = $sesion->get('idacceso');
        $notasDelegado = new NotasAutomaticasDelegado($conexion, $idAcceso);
        $registros = $notasDelegado->getConceptosOriginales();
        $this->objPHPExcel = new \PHPExcel();
        $this->objPHPExcel->
                getProperties()
                ->setCreator("appfuture")
                ->setLastModifiedBy("appfuture")
                ->setTitle("Facturas procesadas")
                ->setSubject("Facturas y conceptos")
                ->setDescription("Facturas con sus respectivos conceptos procesados")
                ->setKeywords("facturas conceptos")
                ->setCategory("Facturas");
        if (!empty($registros)) {
            $i = 1;
            $idFactura = $registros[0]['idfactura'];
            $this->crearEncabezadoOriginal($i++);
            foreach ($registros as $registro) {
                if ($idFactura != $registro['idfactura']) {
                    $idFactura = $registro['idfactura'];
                    $i += 2;
                    $this->crearEncabezadoOriginal($i++);
                }
                $this->objPHPExcel->setActiveSheetIndex(0)
                        ->setCellValue('A' . $i, $registro['iddetallefactura'])
                        ->setCellValue('B' . $i, $registro['idfactura'])
                        ->setCellValue('C' . $i, $registro['numerofactura'])
                        ->setCellValue('D' . $i, $registro['idconcepto'])
                        ->setCellValue('E' . $i, $registro['concepto'])
                        ->setCellValue('F' . $i, $registro['cantidad'])
                        ->setCellValue('G' . $i, $registro['valorunitario'])
                        ->setCellValue('H' . $i, $registro['valortotal'])
                        ->setCellValue('I' . $i, $registro['valorpagado'])
                        ->setCellValue('K' . $i, $registro['saldo']);

                $i++;
            }
        }
        $this->response = new StreamedResponse();
        $formato = 'Excel2007';
        $this->response->setCallback(function()use($formato) {
            $objWriter = \PHPExcel_IOFactory::createWriter($this->objPHPExcel, $formato);
            $objWriter->save('php://output');
        });
        $this->response->setStatusCode(200);
        $this->response->headers->set('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
        $this->response->headers->set('Content-Disposition', 'attachment; filename=facturas.xlsx');
        return $this->response;
    }

    /**
     * 
     * @param int $i número de la fila para crear el encabezado del archivo de excel
     */
    private function crearEncabezadoOriginal($i) {
        $this->objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('A' . $i, 'iddetallefactura')
                ->setCellValue('B' . $i, 'idfactura')
                ->setCellValue('C' . $i, 'numerofactura')
                ->setCellValue('D' . $i, 'idconcepto')
                ->setCellValue('E' . $i, 'concepto')
                ->setCellValue('F' . $i, 'cantidad')
                ->setCellValue('G' . $i, 'valorunitario')
                ->setCellValue('H' . $i, 'valortotal')
                ->setCellValue('I' . $i, 'valorpagado')
                ->setCellValue('K' . $i, 'saldo');
    }

}
