<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Delegado\ProcesoFacturacionDelegado;
use Llanogas\LlanogasBundle\ValidacionException;
use PHPExcel;
use PHPExcel_IOFactory;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Clase encargada de administrar los recaudos en forma de abono.
 */
class ProcesoFacturacionController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $procesoFacturarionDelegado = new ProcesoFacturacionDelegado($this, $sesion);
            $listaParametros = array();
            $listaParametros['empresa'] = $sesion->get('empresa');
            $listaParametros['ciclos'] = $procesoFacturarionDelegado->getCiclosActivosPrograma();
            $response = $this->render('LlanogasLlanogasBundle:Facturacion:ejecutaProcesoFacturacion.html.twig', $listaParametros);
            $response->headers->set('Content-Type', 'text/html');
            return $response;
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response('Error inesperado');
        }
    }

    /**
     * Método encargado de revisar y ejecutar el proceso 
     * de liquidación del servicio por un ciclo
     * @return json con la información si se pudo lanzar los procesos 
     */
    public function procesarAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $procesoFacturarionDelegado = new ProcesoFacturacionDelegado($this, $sesion);
            $idCiclo = $request->get('idciclo');
            $preliquidar = $request->get('preliquidar');
            if (!is_numeric($idCiclo)) {
                throw new MyException('Error se debe seleccionar un ciclo', -1);
            }
            //Se valida que el proceso no esté en ejecución
            $procesoFacturarionDelegado->validarProcesoEjecucion();
            $procesoFacturarionDelegado->iniciarProceso($idCiclo, $this->container, $preliquidar);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['mensaje'] = 'Se inicio el proceso correctamente';
        } catch (ValidacionException $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
            $respuesta["datos"] = $ex->getData();
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta una suscripción en específico para poder ser liquidada
     * @return json lista de suscripciones
     */
    public function getSuscripcionesAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $procesoFacturacionDelegado = new ProcesoFacturacionDelegado($this, $sesion);
            $idSuscripcion = $request->get('idsuscripcion');
            $cedula = $request->get('cedula');
            $codigoAnterior = $request->get('codigoanterior');
            if (!is_numeric($idSuscripcion) && empty($cedula) && empty($codigoAnterior)) {
                throw new MyException('Error debe ingresar un criterio de búsqueda', -1);
            }
            $listaSuscripciones = $procesoFacturacionDelegado->getSuscripciones($idSuscripcion, $cedula, $codigoAnterior);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['mensaje'] = 'Se consultaron correctamente las suscripciones';
            $respuesta['suscripciones'] = $listaSuscripciones;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Método encargado de realizar una liquidación de una suscripción
     * suscripción
     * @return type
     */
    public function liquidarAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idSuscripcion = $request->get('idsuscripcion');
            $idLiquidacion = $request->get('idliquidacion');
            $idCiclo = $request->get('idciclo');
            $preliquidar = $request->get('preliquidar');
            if (empty($idSuscripcion) || empty($idLiquidacion) || empty($idCiclo)) {
                throw new MyException('Debe seleccionar una suscripción', -1);
            }
            $procesoFacturacionDelegado = new ProcesoFacturacionDelegado($this, $sesion);
            //Se valida el proceso de ejecución que no se esté ejecutando
            $procesoFacturacionDelegado->validarProcesoEjecucion();
            $procesoFacturacionDelegado->cargarSuscripcion($idSuscripcion);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['mensaje'] = 'Se consultaron correctamente las suscripciones';
            $respuesta['factura'] = $procesoFacturacionDelegado->liquidar($idLiquidacion, $idSuscripcion, $preliquidar);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    /**
     * Se consulta todos los registros que lleva liquidado
     * @return type
     */
    public function getProgresoProcesoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $procesoFacturacionDelegado = new ProcesoFacturacionDelegado($this, $sesion);
            $procesoFacturacionDelegado->validarProcesoEjecucion();
            $respuesta["codigoRespuesta"] = 0;
            $respuesta['mensaje'] = 'Se consultaron correctamente los procesos';
        } catch (ValidacionException $ex) {
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = $ex->getMessage();
            $respuesta["datos"] = $ex->getData();
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = -4;
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Método encargado de aprobar las facturas 
     * @return json Resultado de la transacción
     */
    public function aprobarFacturacionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idCiclo = $request->get('idciclo');
            $idSuscripcion = $request->get('idsuscripcion');
            if (!is_numeric($idCiclo)) {
                throw new MyException('Debe seleccionar un ciclo', -1);
            }

            $procesoFacturacionDelegado = new ProcesoFacturacionDelegado($this, $sesion);
            $procesoFacturacionDelegado->validarProcesoEjecucion();
            //Se valida si se va aprobar un ciclo o una suscripción
            if (!empty($idSuscripcion)) {
                $listaErrores = $procesoFacturacionDelegado->aprobarLiquidacionSuscripcion($idSuscripcion);
            } else {
                $listaErrores = $procesoFacturacionDelegado->aprobarLiquidacion($idCiclo);
            }
            $respuesta["codigoRespuesta"] = (empty($listaErrores) ? 1 : -3);
            $respuesta["mensaje"] = 'Se finalizó el proceso';
            $respuesta['errores'] = $listaErrores;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta todas las suscripciones que se liquidaron y si fue corretamente 
     * se muestra agrupado la información por municipio, de lo contrario se muestra las 
     * suscripciones con su respectivo mensaje de error 
     * @return type
     */
    public function getResultadoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idCiclo = $request->get('idciclo');
            $procesoFacturacionDelegado = new ProcesoFacturacionDelegado($this, $sesion);
            $listaErrores = $procesoFacturacionDelegado->getResultado($idCiclo);
            $correctos = $procesoFacturacionDelegado->getSatisfactorios($idCiclo);
            $respuesta["codigoRespuesta"] = (empty($listaErrores) && empty($correctos) ) ? 0 : -3;
            $respuesta["mensaje"] = 'Se finalizó el proceso';
            $respuesta['errores'] = $listaErrores;
            $respuesta['correctos'] = $correctos;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se elimina la factura que se acaba de liquidar, en dado caso que se haya 
     * parametrizado mal la liquidación o por errores de lecturas
     * @return json con el resultado de la transacción
     */
    public function eliminarLiquidacionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idCiclo = $request->get('idciclo');
            $idsuscripcion = $request->get('idsuscripcion');

            if (!is_numeric($idCiclo)) {
                throw new MyException('Debe seleccionar un ciclo', -1);
            }

            $procesoFacturacionDelegado = new ProcesoFacturacionDelegado($this, $sesion);
            if (!empty($idsuscripcion)) {
                $procesoFacturacionDelegado->eliminarLiquidacionSuscripcion($idsuscripcion);
            } else {
                $procesoFacturacionDelegado->eliminarLiquidacion($idCiclo);
            }
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = 'Se eliminó la liquidación correctamente';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    public function liquidarVariasSuscripcionesAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idSuscripciones = $request->get('variasSuscripciones');
            $idCiclo = $request->get('idciclo');
            $preliquidar = $request->get('preliquidar');
            if (empty($idSuscripciones)) {
                throw new MyException('Debe digitar una suscripción', -1);
            }
//            //Se valida el proceso de ejecución que no se esté ejecutando
            $procesoFacturacionDelegado = new ProcesoFacturacionDelegado($this, $sesion);
            $procesoFacturacionDelegado->validarProcesoEjecucion();
            $procesoFacturacionDelegado->adminVariasSuscripciones($idSuscripciones, $idCiclo, $preliquidar);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['mensaje'] = 'Se consultaron correctamente las suscripciones';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

/**
     * Se consulta todos los registros que lleva liquidado
     * @return type
     */
    public function getReportePreLiquidacionAction() {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $procesoFacturacionDelegado = new ProcesoFacturacionDelegado($this, $sesion);
            $idsuscripcion= $request->get('idsuscripcion');
            $fechainicial=$request->get('fechainicial');
            $fechafinal=$request->get('fechafinal');
            $ciclo=$request->get('ciclo');
            $respuesta["data"]=$procesoFacturacionDelegado->getReportePreLiquidacion($idsuscripcion,$fechainicial,$fechafinal,$ciclo);
            $this->objPHPExcel = new \PHPExcel();
            $this->response = new StreamedResponse();
            $i = 1;
            $this->crearEncabezadoAfectados($i++);
            foreach ($respuesta["data"] as $registro) {
                $this->objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('A' . $i, $registro['fecgeneracion'])
                ->setCellValue('B' . $i, $registro['idsus'])
                ->setCellValue('C' . $i, $registro['pcodigo'])
                ->setCellValue('D' . $i, $registro['uso'])
                ->setCellValue('E' . $i, $registro['estrato'])
                ->setCellValue('F' . $i, $registro['liquidacion'])
                ->setCellValue('G' . $i, $registro['dinc'])
                ->setCellValue('H' . $i, $registro['vip'])
                ->setCellValue('I' . $i, $registro['exento'])
                ->setCellValue('J' . $i, $registro['icbf'])
                ->setCellValue('K' . $i, $registro['deshabitado'])
                ->setCellValue('L' . $i, $registro['pta_pta'])
                ->setCellValue('M' . $i, $registro['oficial'])
                ->setCellValue('N' . $i, $registro['aforado'])
                ->setCellValue('O' . $i, $registro['tafna'])
                ->setCellValue('P' . $i, $registro['saldofac']);
                       
                $i++;
            }             

        $formato = 'Excel2007';
        //Se escribe el buffer del cliente
        $this->response->setCallback(function()use($formato) {
            $objWriter = \PHPExcel_IOFactory::createWriter($this->objPHPExcel, $formato);
            $objWriter->save('php://output');
        });
        $this->response->setStatusCode(200);
        ob_clean();
        //Se establece el tipo de respuesta en �ste caso excel
        $this->response->headers->set('Content-Type', 'application/vnd.ms-excel');
        //Se establece un nombre predeterminado para el archivo a descargar
        $this->response->headers->set('Content-Disposition', 'attachment; filename=Reporte_Pre_Liquidacion.xls');
        return $this->response;
    }

    /**
     * Se crea el encabezado del archivo
     * @param type $i fila a llenar
     */
    private function crearEncabezadoAfectados($i) {
        $this->objPHPExcel->setActiveSheetIndex(0)
        ->setCellValue('A' . $i, 'fecgeneracion')
        ->setCellValue('B' . $i, 'idsus')
        ->setCellValue('C' . $i, 'pcodigo')
        ->setCellValue('D' . $i, 'uso')
        ->setCellValue('E' . $i, 'estrato')
        ->setCellValue('F' . $i, 'liquidacion')
        ->setCellValue('G' . $i, 'dinc')
        ->setCellValue('H' . $i, 'vip')
        ->setCellValue('I' . $i, 'exento')
        ->setCellValue('J' . $i, 'icbf')
        ->setCellValue('K' . $i, 'deshabitado')
        ->setCellValue('L' . $i, 'pta_pta')
        ->setCellValue('M' . $i, 'oficial')
        ->setCellValue('N' . $i, 'aforado')
        ->setCellValue('O' . $i, 'tafna')
        ->setCellValue('P' . $i, 'saldofac');
    }

}
