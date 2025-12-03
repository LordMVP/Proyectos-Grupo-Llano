<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Delegado\ProcesoWebServiceMovimientosContablesDelegado;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Clase que controla la gestión de suspensiones.
 */
class ExportarContabilizacionController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $procesarMovimientosContablesDelegado = new ProcesoWebServiceMovimientosContablesDelegado($this, $sesion);

        $lisParametros["empresa"] = $sesion->get("empresa");

        $lisParametros["ciclos"] = $procesarMovimientosContablesDelegado->getCiclosActivosMovimientoContableProgramaDelegado();
        $response = $this->render("LlanogasLlanogasBundle:MovimientosContables:exportarContabilizacion.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
    }

    /**
     * Función que se encarga de aprobar los movimientos contables de acuerdo al identificador 
     * del movimiento  y realiza la exportación a seven
     * @return json con el resultado de la transacción
     */
    public function AprobarEncabezadoMovimientoContableAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $exportacionMovimientos = $request->get('movimientoexportacion');

            if (!isset($exportacionMovimientos)) {
                throw new MyException('debe existir un encabezado a validar', -1);
            }
            $procesarMovimientosContablesDelegado = new ProcesoWebServiceMovimientosContablesDelegado($this, $sesion);
            $procesarMovimientosContablesDelegado->AprobarMovimientoContable($exportacionMovimientos);
            $tipoMovimiento = $request->get('tipomovimiento');
            $procesarMovimientosContablesDelegado->ExportarMovimientosContables($exportacionMovimientos, $tipoMovimiento);
            $respuesta ['codigoRespuesta'] = 1;
            $respuesta ['mensaje'] = 'Proceso finalizado';
        } catch (\Exception $exc) {
            $respuesta ['codigoRespuesta'] = $exc->getCode();
            $respuesta ['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Elimina un movimiento contable para que sea nuevamente generado
     * @return json con la información si se pudo eliminar 
     */
    public function EliminarEncabezadoMovimientoContableAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $exportacionMovimientos = $request->get('movimientoexportacion');
            $idMovimiento = $request->get('idmovimiento');

            if (!isset($exportacionMovimientos)) {
                throw new MyException('debe existir un encabezado a validar', -1);
            }
            $procesarMovimientosContablesDelegado = new ProcesoWebServiceMovimientosContablesDelegado($this, $sesion);
            //Se inicializa el campo mvi_ideregistro y se deja en NULL
            $procesarMovimientosContablesDelegado->EliminarMovimientoContable($exportacionMovimientos);
            //se pasa a estado E=Eliminado
            $procesarMovimientosContablesDelegado->EliminarMovimientosContables($idMovimiento);

            $respuesta ['codigoRespuesta'] = 1;
            $respuesta ['mensaje'] = 'los registros a exportar a seven estan eliminados satisfactoriamente';
        } catch (\Exception $exc) {
            $respuesta ['codigoRespuesta'] = $exc->getCode();
            $respuesta ['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se obtienen los movimientos contables del ciclo seleccinado
     * @return json con la lista de movimientos a exportar y/o aprobar
     */
    public function ObtenerMovimientoContablePorCicloAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idciclo = $request->get('idciclo');

            if (!isset($idciclo)) {
                throw new MyException('debe existir un ciclo a validar', -1);
            }
            $procesarMovimientosContablesDelegado = new ProcesoWebServiceMovimientosContablesDelegado($this, $sesion);
            $respuesta["movimientoscontables"] = $procesarMovimientosContablesDelegado->obtenerMovimientosContables($idciclo);
            $respuesta ['codigoRespuesta'] = 1;
            $respuesta ['mensaje'] = 'los registros a exportar a seven estan aprobados satisfactoriamente';
        } catch (\Exception $exc) {
            $respuesta ['codigoRespuesta'] = $exc->getCode();
            $respuesta ['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta si hubo errores al momento de realizar la exportación
     * @return json con la lista de errores ocurridos en seven al momento de exportar los movimientos
     */
    public function ObtenerReporteMovimientoErrorAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idmovimientodetalle = $request->get('idmovimientodetalle');
            $accion = $request->get('accion');
            if (empty($idmovimientodetalle) && !is_string($idmovimientodetalle)) {
                throw new MyException('Error, no se encontró movimientos a exportar');
            }
            $procesarMovimientosContablesDelegado = new ProcesoWebServiceMovimientosContablesDelegado($this, $sesion);
            $respuesta = $procesarMovimientosContablesDelegado->ValidarErroresGeneradosmovimientos($idmovimientodetalle, $accion);
            /*
             * Se establece en sesión que acción se va a realizar para poder generar el reporte 
             */
            $_SESSION['idmovimientodetalle'] = $idmovimientodetalle;
            $_SESSION['accion'] = $accion;
            if (!empty($respuesta)) {
                $respuesta["codigoRespuesta"] = $respuesta['cantidad'] > 0 ? 1 : 0;
                $respuesta["mensaje"] = $respuesta['mensaje'];
            }
        } catch (Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se genera el reporte del proceso de exportación de movimientos
     * @return type
     */
    public function GenerarReporteReporteExcelAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            //Método que se invoca por método GET y se obtiene el movimiento en sesión
            $idmovimientodetalle = $sesion->get('idmovimientodetalle');
            $accion = $sesion->get('accion');

            $procesarMovimientosContablesDelegado = new ProcesoWebServiceMovimientosContablesDelegado($this, $sesion);
            $objPHPExcel = $procesarMovimientosContablesDelegado->generarEncabezadoExcel($idmovimientodetalle, $accion);

            $formato = 'Excel2007';
            $this->response = new \Symfony\Component\HttpFoundation\StreamedResponse();

            $this->response->setCallback(function()use($formato, $objPHPExcel) {
                $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, $formato);
                $objWriter->save('php://output');
            });
            $this->response->headers->set('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
            $this->response->headers->set('Content-Disposition', 'attachment; filename=MovimientosContablesDetalleError.xls');
            $this->response->headers->set('Cache-Control', 'max-age=0');
            //Se remueven las variables de sesión
            unset($_SESSION['idmovimientodetalle']);
            unset($_SESSION['accion']);
        } catch (\Exception $ex) {
            print_r($ex->getMessage());
            print_r($ex->getLine());
        }

        return $this->response;
    }

    /**
     * Consulta los detalles de acuerdo a un movimiento
     * @return json con la lista de los detalles
     */
    public function ObtenerDetalleMovimientoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idmovimiento = $request->get('idmovimiento');
            $idtipomovimiento = $request->get('tipomovimiento');

            if (!isset($idmovimiento)) {
                throw new MyException('debe existir movimiento', -1);
            }

            $procesarMovimientosContablesDelegado = new ProcesoWebServiceMovimientosContablesDelegado($this, $sesion);
            $respuesta['movimientos'] = $procesarMovimientosContablesDelegado->obtenerDetalleMovimiento($idmovimiento, $idtipomovimiento);
            $respuesta ['codigoRespuesta'] = 1;
        } catch (\Exception $exc) {
            $respuesta ['codigoRespuesta'] = $exc->getCode();
            $respuesta ['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    public function regenerarMovimientoContableAction(){
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idMovimiento = $request->get('idmovimiento');
            if (empty($idMovimiento)) {
                    throw new MyException('Debe Seleccionar un movimiento...', -1);
                }
                $procesarMovimientosContablesDelegado = new ProcesoWebServiceMovimientosContablesDelegado($this, $sesion);
                $movimientoExportado = $procesarMovimientosContablesDelegado->reGenerarMovimientoContableExportado($idMovimiento) ;
               
                if(!empty($movimientoExportado)){
                    
                        $respuesta ['codigoRespuesta'] = -1;
                        $respuesta['mensaje'] =  $movimientoExportado[0]['mensaje'];
                    return Util::construyeRespuesta($respuesta);
                }
            $reGeneraMovContable = $procesarMovimientosContablesDelegado->reGenerarMovimientoContable($idMovimiento) ;
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = $reGeneraMovContable[0]['mensaje'];
           // $respuesta['mensaje'] = "Funcionalidad en Construcción Sandro Rosero Resolvera Dudas";
        } catch (\Exception $exc){
            $respuesta ['codigoRespuesta'] = -1;
            $respuesta ['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
