<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Delegado\ConsignacionesDelegado;
use Llanogas\LlanogasBundle\MyException;

/**
 * Clase encargada de administrar consignaciones de los recaudos.
 */
class ConsignacionesController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $consignacionesDelegado = new ConsignacionesDelegado($this, $sesion);
            $listaParametros = array();
            $listaParametros['empresa'] = $sesion->get('empresa');
            $listaParametros['listasucursales'] = $consignacionesDelegado->getSucursales();
            $listaParametros['listamediospagos'] = $consignacionesDelegado->getMediosPago();
            $listaParametros['listadocumentos'] = $consignacionesDelegado->getDocumentosConsignaciones();
        } catch (\Exception $e) {
            $listaParametros['listasucursales'] = array();
            $listaParametros['listamediospagos'] = array();
            $listaParametros['listadocumentos'] = array();
        }
        $listaParametros['fecha'] = date('Y-m-d');
        $response = $this->render('LlanogasLlanogasBundle:Recaudos:Consignaciones.html.twig', $listaParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta los recaudos para consignar de acuerdo al municipio,
     * medio de pago
     * @return json con la lista de recaudos a consignar
     */
    public function getRecaudosConsignacionesAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $idSucursal = $request->get('idsucursal');
            $idMedioPago = $request->get('idmediopago');
            $idConsignacion = $request->get('idconsignacion');
            if (!is_numeric($idSucursal) || !is_numeric($idMedioPago)) {
                throw new MyException('Error en los parámetros de búsqueda', -1);
            }
            $consignacionesDelegado = new ConsignacionesDelegado($this, $sesion);
            $listaRecaudos = $consignacionesDelegado->getRecaudosConsignaciones($idSucursal, $idMedioPago, $idConsignacion);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['recaudos'] = $listaRecaudos;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Agrupa todos los recuados por empresa
     * @return type json con la lista de recaudos
     */
    public function getRecaudosConsolidadoEmpresaAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $idSucursal = $request->get('idsucursal');
            $idMedioPago = $request->get('idmediopago');
            $idConsignacion = $request->get('idconsignacion');
            $fecha = $request->get('fecha');
            if (!is_numeric($idSucursal) || !is_numeric($idMedioPago) || empty($fecha)) {
                throw new MyException('Error en los parámetros de búsqueda', -1);
            }
            $consignacionesDelegado = new ConsignacionesDelegado($this, $sesion);
            $listaRecaudos = $consignacionesDelegado->getRecaudosEmpresa($idSucursal, $idMedioPago, $fecha, $idConsignacion);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['recaudos'] = $listaRecaudos;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los detalles de una consignación 
     * @return type
     * @throws MyException
     */
    public function getRecaudosConsignacionesDetallesAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $idSucursal = $request->get('idsucursal');
            $idMedioPago = $request->get('idmediopago');
            $fecha = $request->get('fecha');
            if (!is_numeric($idSucursal) || !is_numeric($idMedioPago) || empty($fecha)) {
                throw new MyException('Error en los parámetros de búsqueda', -1);
            }
            $consignacionesDelegado = new ConsignacionesDelegado($this, $sesion);
            $listaRecaudos = $consignacionesDelegado->getRecaudosConsignacionesDetalle($fecha, $idSucursal, $idMedioPago);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['recaudos'] = $listaRecaudos;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los cheques sin consignar
     * @return type
     * @throws MyException
     */
    public function getChequesRecaudosSinConsignarAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $idSucursal = $request->get('idsucursal');
            $idMedioPago = $request->get('idmediopago');
            $fecha = $request->get('fecha');
            if (!is_numeric($idSucursal) || !is_numeric($idMedioPago) || empty($fecha)) {
                throw new MyException('Error en los parámetros de búsqueda', -1);
            }
            $consignacionesDelegado = new ConsignacionesDelegado($this, $sesion);
            $infoCheques = $consignacionesDelegado->getChequesRecaudosSinConsignar($fecha, $idSucursal, $idMedioPago);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['cheques'] = $infoCheques;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consultan los bancos 
     * @return type
     * @throws MyException
     */
    public function getBancosAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $idSucursal = $request->get('idsucursal');
            $idMedioPago = $request->get('idmediopago');
            $idEmpresa = $request->get('idempresa');
            if (!is_numeric($idSucursal) || !is_numeric($idMedioPago) || !is_numeric($idEmpresa)) {
                throw new MyException('Error en los parámetros de búsqueda', -1);
            }
            $consignacionesDelegado = new ConsignacionesDelegado($this, $sesion);
            $listaBancos = $consignacionesDelegado->getBancosConsignaciones($idMedioPago, $idSucursal, $idEmpresa);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['bancos'] = $listaBancos;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se consultan los tipos de cuentas 
     * @return type
     * @throws MyException
     */
    public function getTipoCuentasAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $idSucursal = $request->get('idsucursal');
            $idMedioPago = $request->get('idmediopago');
            $idBanco = $request->get('idbanco');
            if (!is_numeric($idSucursal) || !is_numeric($idMedioPago) || !is_numeric($idBanco)) {
                throw new MyException('Error en los parámetros de búsqueda', -1);
            }
            $consignacionesDelegado = new ConsignacionesDelegado($this, $sesion);
            $listaTipoCuentas = $consignacionesDelegado->getTipoCuentasConsignaciones($idMedioPago, $idSucursal, $idBanco);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['tipocuentas'] = $listaTipoCuentas;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consultan los tipos de cuentas de acuerdo al banco seleccionado 
     * @return type
     * @throws MyException
     */
    public function getCuentasAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $idSucursal = $request->get('idsucursal');
            $idMedioPago = $request->get('idmediopago');
            $idBanco = $request->get('idbanco');
            $tipoCuenta = $request->get('tipocuenta');
            $idEmpresa = $request->get('idempresa');
            if (!is_numeric($idSucursal) || !is_numeric($idMedioPago) || !is_numeric($idBanco) || empty($tipoCuenta) || !is_numeric($idEmpresa)) {
                throw new MyException('Error en los parámetros de búsqueda', -1);
            }
            $consignacionesDelegado = new ConsignacionesDelegado($this, $sesion);
            $listaCuentas = $consignacionesDelegado->getCuentasConsignaciones($idMedioPago, $idSucursal, $idBanco, $tipoCuenta, $idEmpresa);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['cuentas'] = $listaCuentas;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se registra la consignación 
     * @return type
     * @throws MyException
     */
    public function grabarConsignacionAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $datos = json_decode($request->get('datos'), true);
            if (empty($datos)) {
                throw new MyException('Error no hay información de consignaciones', -1);
            }
            $consignacionesDelegado = new ConsignacionesDelegado($this, $sesion);
            $consignacion = $consignacionesDelegado->grabarConsignacion($datos);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['mensaje'] = 'Se guardó la consignación correctamente ' . $consignacion['idconsignacion'];
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la información de una consignación
     * @return type
     * @throws MyException
     */
    public function buscarConsignacionAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $fechaInicio = $request->get('fechainicio');
            $fechaFin = $request->get('fechafin');
            $idConsignacion = $request->get('idconsignacion');
            $idMedioPago = $request->get('idmediopago');
            if (empty($fechaInicio) && empty($fechaFin) && empty($idConsignacion) && empty($idMedioPago)) {
                throw new MyException('Error no hay información de consignaciones', -1);
            }
            $consignacionesDelegado = new ConsignacionesDelegado($this, $sesion);
            $listaConsignaciones = $consignacionesDelegado->getConsignacion($fechaInicio, $fechaFin, $idConsignacion, $idMedioPago);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
            $respuesta['consignaciones'] = $listaConsignaciones;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Adjunta un archivo y lo deja en la carpeta de archivos dentro de
     * la carpeta de app/archivos
     * @return type
     */
    public function subirAdjuntoAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $listaArchivos = Util::subirAdjunto($request, $sesion->get('idusuario'), 'consignaciones');
            $consignacionesDelegado = new ConsignacionesDelegado($this, $sesion);
            $respuesta['archivos'] = $consignacionesDelegado->setArchivo($listaArchivos);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['mensaje'] = 'Se adjuntaron correctamente los archivos ';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Se realiza la eliminación del archivo 
     * @return type
     * @throws MyException
     */
    public function eliminarAdjuntoAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $idArchivo = $request->get('idarchivo');
            if (!is_numeric($idArchivo)) {
                throw new MyException('Error al eliminar el archivo', -1);
            }
            $consignacionesDelegado = new ConsignacionesDelegado($this, $sesion);
            $consignacionesDelegado->eliminarArchivo($idArchivo);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['mensaje'] = 'Se eliminó correctamente los archivos ';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta toda la información de la consignación
     * los recaudos, consignación, conceptos
     * @return type
     * @throws MyException
     */
    public function consultarInformacionAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $idConsignacion = $request->get('idconsignacion');
            if (!is_numeric($idConsignacion)) {
                throw new MyException('Debe seleccionar una consignación', -1);
            }
            /*
             * Se crea una sesión para poder controlar la aprobacion de la 
             * consignación al momento de cargar el combo de tipo de documento 
             * en el resumen. 
             */
            $_SESSION['__idconsignacion'] = $idConsignacion;

            $consignacionesDelegado = new ConsignacionesDelegado($this, $sesion);
            $respuesta['consignacion'] = $consignacionesDelegado->getConsolidadoConsignacion($idConsignacion);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['mensaje'] = 'Se realizó correctamente los consulta ';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la empresa que está en sesión
     * @return type
     */
    public function consultarEmpresaAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $consignacionesDelegado = new ConsignacionesDelegado($this, $sesion);
            $respuesta['empresa'] = $consignacionesDelegado->getEmpresaLogueada();
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['mensaje'] = 'Se realizó correctamente los consulta ';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
