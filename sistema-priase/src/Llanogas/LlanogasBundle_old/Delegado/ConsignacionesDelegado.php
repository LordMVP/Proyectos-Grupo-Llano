<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\AnularModel;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\RecaudosModel;

/**
 * Clase que se encarga de la lógica de negocio del caso de uso de Consignaciones.
 * @author hrey
 */
class ConsignacionesDelegado {

    /**
     * Objeto de recaudos model
     * @var \Llanogas\LlanogasBundle\Models\RecaudosModel 
     */
    private $recaudosModel;

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     * Información de la sesión.
     * @var SessionInterface 
     */
    private $sesion;

    /**
     *
     * @var AnularModel 
     */
    private $anularModel;

    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->recaudosModel = new RecaudosModel($this->conexion);
        $this->sesion = $sesion;
        $this->anularModel = new AnularModel($this->conexion);
    }

    /**
     * Consulta las sucursales que tienen el usuario que
     * pueda registrar una consignación
     * @return type
     * @throws MyException
     */
    public function getSucursales() {
        $resultado = $this->recaudosModel->consultarSucursal(PROGRAMA_CONSIGNACIONES_ID, $this->sesion->get('idusuario'));
        if (empty($resultado)) {
            throw new MyException('No se encontraron sucursales ', 0);
        }
        return $resultado;
    }

    /**
     * Consulta los medios de pagos
     * @return array lista de medios de pago 
     * @throws MyException Si el usuario no tiene un medio de pago  asociado 
     */
    public function getMediosPago() {
        $idEmpresa = $this->sesion->get('idempresa');
        $idUsuario = $this->sesion->get('idusuario');
        $resultado = $this->recaudosModel->consultarMedio($idEmpresa, $idUsuario);
        if (empty($resultado)) {
            throw new MyException('No se encontraron medios de pago ', 0);
        }
        return $resultado;
    }

    /**
     * Se consultan los tipos de documentos que se pueden realizar la consignación 
     * @param type $tipo si es faltante, sobrante, gasto
     * @param type $iddocumento seleccionado de la interfaz 
     * @return type
     * @throws MyException
     */
    public function getTiposDocumento($tipo, $iddocumento) {
        $resultado = null;
        if (isset($_SESSION) && isset($_SESSION['__idconsignacion'])) {
            $idconsignacion = $_SESSION['__idconsignacion'];
            $resultado = $this->recaudosModel->consultarTiposDocumentosAprobacion($iddocumento, $idconsignacion);
        }
        if (empty($resultado)) {
            throw new MyException('No se encontraron tipos de documentos', 0);
        }
        return $resultado;
    }

    /**
     * Se consultan todos los recaudos que están asociados a una 
     * consgnación 
     * @param type $idSucursal
     * @param type $idMedioPago
     * @param type $idConsignacion
     * @return array lista de recaudos
     * @throws MyException
     */
    public function getRecaudosConsignaciones($idSucursal, $idMedioPago, $idConsignacion) {
        $idEmpresa = $this->sesion->get('idempresa');
        /**
         * Si se está consultando una consignación existente
         */
        if (empty($idConsignacion)) {
            $idConsignacion = -1;
        }
        /**
         * Si la consignación es nueva trae todos los recaudos que no se han consignados y de lo contrario 
         * trae los de la consignación 
         */
        $listaRecaudos = $this->recaudosModel->getRecaudosConsignaciones($idSucursal, $idEmpresa, $idMedioPago, $idConsignacion);
        if (empty($listaRecaudos)) {
            throw new MyException('No se encontraron resultados', 0);
        }
        return $listaRecaudos;
    }

    /**
     * Se consultan todos los recaudos asociados a una empresa
     * @param type $idSucursal
     * @param type $idMedioPago
     * @param type $fecha fecha de consignación 
     * @param type $idConsignacion identificador de la consignación
     * @return type
     * @throws MyException
     */
    public function getRecaudosEmpresa($idSucursal, $idMedioPago, $fecha, $idConsignacion) {
        if (empty($idConsignacion)) {
            $idConsignacion = -1;
        }
        $idEmpresa = $this->sesion->get('idempresa');
        $resultado = $this->recaudosModel->getRecaudosConsignacionesEmpresa($idSucursal, $idEmpresa, $idMedioPago, $fecha, $idConsignacion);
        if (empty($resultado)) {
            throw new MyException('No se encontraron resultados', 0);
        }
        return $resultado;
    }

    /**
     * Se consultan los recaudos que tienen consignados y sus detalles 
     * @param type $fecha fecha de consignación 
     * @param type $idSucursal
     * @param type $idMedioPago
     * @return lista de detalles de los recaudos que se quieren consignar
     * @throws MyException
     */
    public function getRecaudosConsignacionesDetalle($fecha, $idSucursal, $idMedioPago) {
        $idEmpresa = $this->sesion->get('idempresa');
        $listaRecaudos = $this->recaudosModel->getRecaudosConsignacionesDetalle($idEmpresa, $fecha, $idSucursal, $idMedioPago);
        if (empty($listaRecaudos)) {
            throw new MyException('No se encontraron resultados', 0);
        }
        $infoListaRecaudos = array();
        foreach ($listaRecaudos as $recaudo) {
            $listaFormasPago = $this->anularModel->buscarFormasPago($recaudo['idrecaudo']);
            $recaudo['formaspago'] = $listaFormasPago;
            $infoListaRecaudos[] = $recaudo;
        }
        return $infoListaRecaudos;
    }

    /**
     * Consulta los cheques que no se han consignado  
     * @param type $fecha fecha de consignación 
     * @param type $idSucursal identificador de la sucursal 
     * @param type $idMedioPago identificador del medio de pago
     * @return type
     * @throws MyException
     */
    public function getChequesRecaudosSinConsignar($fecha, $idSucursal, $idMedioPago) {
        $idEmpresa = $this->sesion->get('idempresa');
        $listaCheques = $this->recaudosModel->getChequesRecaudosSinConsignar($idEmpresa, $fecha, $idSucursal, $idMedioPago);
        if (empty($listaCheques)) {
            throw new MyException('No se encontraron registros', 0);
        }
        $listaInfoRecaudos = array();
        foreach ($listaCheques as $cheque) {
            $infoAdicional = $this->anularModel->buscarFormasPago($cheque['idrecaudo']);
            if (!empty($infoAdicional)) {
                $infoAdicional['idrecaudo'] = $cheque['idrecaudo'];
                $listaInfoRecaudos[] = $infoAdicional;
            }
        }
        return $listaInfoRecaudos;
    }

    /**
     * Consulta cuales son los docuementos se puede consignar 
     * en éste caso sólo está saliendo consignaciones 
     * @return type
     */
    public function getDocumentosConsignaciones() {
        return $this->recaudosModel->getDocumentosConsignaciones($this->sesion->get('idempresa'));
    }

    /**
     * Consulta los bancos que se pueden consignar dependiendo de la sucursal uy 
     * del medio de pago 
     * @param type $idMedioPago 
     * @param type $idSucursal
     * @param type $idEmpresa
     * @return array lista de consignaciones 
     * @throws MyException
     */
    public function getBancosConsignaciones($idMedioPago, $idSucursal, $idEmpresa) {
        $listaBancos = $this->recaudosModel->getBancosConsignaciones($idEmpresa, $idMedioPago, $idSucursal);
        if (empty($listaBancos)) {
            throw new MyException('No se encontraron bancos', 0);
        }
        return $listaBancos;
    }

    /**
     * Consulta los tipos de cuenta que están parametrizados 
     * para el medio de pago , sucursal y el banco seleccionado 
     * @param type $idMedioPago
     * @param type $idSucursal
     * @param type $idBanco
     * @return tipos de cuentas registrados 
     * @throws MyException
     */
    public function getTipoCuentasConsignaciones($idMedioPago, $idSucursal, $idBanco) {
        $listaTipoCuentas = $this->recaudosModel->getTipoCuentasConsignaciones($this->sesion->get('idempresa'), $idMedioPago, $idSucursal, $idBanco);
        if (empty($listaTipoCuentas)) {
            throw new MyException('No se encontraron tipo de cuentas para el banco', 0);
        }
        return $listaTipoCuentas;
    }

    /**
     * De acuerdo al tipo de cuenta se consultan los números de cuentas registrados 
     * @param type $idMedioPago
     * @param type $idSucursal
     * @param type $idBanco
     * @param type $tipoCuenta
     * @param type $idEmpresa
     * @return type
     * @throws MyException
     */
    public function getCuentasConsignaciones($idMedioPago, $idSucursal, $idBanco, $tipoCuenta, $idEmpresa) {
        $listaCuentas = $this->recaudosModel->getCuentasConsignaciones($idEmpresa, $idMedioPago, $idSucursal, $idBanco, $tipoCuenta);
        if (empty($listaCuentas)) {
            throw new MyException('No hay cuentas registradas ', 0);
        }
        return $listaCuentas;
    }

    /**
     * Registra la consignación en la base de datos 
     * @param type $datos información de la consignación (recaudos,documento,tipo de documento (FA,SO,CP))
     * @return type
     * @throws MyException
     */
    public function grabarConsignacion($datos) {
        try {

            $this->conexion->beginTransaction();
            /**
             * Si están eliminando la consignación se desvinculan los recaudos 
             * para que sean registrados en otra consignación 
             */
            if ($datos['consignacion']['accion'] == 'E') {
                $this->reiniciarConsignacion($datos['consignacion']);
            } else {
                $consignacion = $this->setConsignacion($datos);
                $this->setDetalleConsignacion($datos, $consignacion);
                $this->setAdjuntosConsignacion($datos, $consignacion);
                $this->vincularRecaudosConsignacion($datos, $consignacion);
                $this->conexion->commit();
                return $consignacion;
            }
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Realiza la validación y el registro de los datos en las 
     * tablas de la base de datos 
     * @param array $datos
     * @return type
     * @throws MyException
     */
    private function setConsignacion(array $datos) {
        $consignacion = $datos['consignacion'];
        if (empty($consignacion)) {
            throw new MyException('Error en la información del encabezado de consignación', -1);
        }
        $consignacion['fecha'] = 'now()';
        $consignacion['idusuario'] = $this->sesion->get('idusuario');
        $consignacion['idempresa'] = $this->sesion->get('idempresa');
        $consignacion['estado'] = 'P';
        if (!is_numeric($consignacion['valorfaltante'])) {
            throw new MyException('Error en el valor faltante', -1);
        }
        if (!is_numeric($consignacion['valorsobrante'])) {
            throw new MyException('Error en el valor sobrante', -1);
        }
        if (!is_numeric($consignacion['valorgasto'])) {
            throw new MyException('Error en el valor gasto', -1);
        }
        /**
         * Se valida si la consignación se está registrando o 
         * se está actualizando
         */
        if ($consignacion['accion'] == 'I') {
            return $this->recaudosModel->insertarConsignacion($consignacion);
        }
        return $this->recaudosModel->actualizarConsignacion($consignacion);
    }

    private function setDetalleConsignacion(array $datos, array $consignacion) {

        $listaDetalleConsignacion = $datos['detalleconsignacion'];
        if (empty($listaDetalleConsignacion)) {
            throw new MyException('Error, No hay detalles de consignación', -1);
        }
        foreach ($listaDetalleConsignacion as $detalleConsignacion) {
            /**
             * Se valida que 
             */
            if ($detalleConsignacion['accion'] === "E") {
                $this->recaudosModel->eliminarDetalleConsignacion($detalleConsignacion['iddetalleconsignacion']);
                $this->recaudosModel->eliminarInformacionAdicional($detalleConsignacion['iddetalleconsignacion']);
            } else {
                $detalleConsignacion['idconsignacion'] = $consignacion['idconsignacion'];
                $detalleConsignacion['iddocumento'] = $consignacion['iddocumento'];
                $detalleConsignacion['idsucursal'] = $consignacion['idsucursal'];
                $detalleConsignacion['idmediopago'] = $consignacion['idmediopago'];
                $detalleConsignacion['idusuario'] = $this->sesion->get('idusuario');
                $infoConsignacion = $this->recaudosModel->insertarDetalleConsignacion($detalleConsignacion);
                $detalleConsignacion['iddetalleconsignacion'] = $infoConsignacion['iddetalleconsignacion'];
                $this->setInformacionAdicional($detalleConsignacion);
            }
        }
    }

    /**
     * Se ingresa la información adicional de las consignaciones 
     * @param array $detalleConsignacion
     * @return type
     */
    private function setInformacionAdicional(array $detalleConsignacion) {
        if (!isset($detalleConsignacion['informacionadicional'])) {
            return;
        }
        $listaInformacionAdicional = $detalleConsignacion['informacionadicional'];
        if (empty($listaInformacionAdicional)) {
            return;
        }
        for ($i = 0; $i < count($listaInformacionAdicional); $i++) {
            $infoAdicional = $listaInformacionAdicional[$i];
            foreach ($infoAdicional as $registro) {
                $data['informacion'] = $registro['informacion'];
                $data['estado'] = 'A';
                $data['descripcion'] = '.';
                $data['iddetalleconsignacion'] = $detalleConsignacion['iddetalleconsignacion'];
                $data['idformapago'] = $detalleConsignacion['idformapago'];
                $data['grupoinformacion'] = $i;
                $data['idtipificacion'] = $registro['idtipificacion'];
                $data['iddetalletipificacion'] = 10;
                $data['tipificacion'] = $registro['nombretipificacion'];
                $data['usu_ideregistro'] = $this->sesion->get('idusuario');
                $this->recaudosModel->insertarInformacionAdicionalConsignacion($data);
            }
        }
    }

    /**
     * Se asigna los adjuntos a la consignación 
     * @param type $datos
     * @param type $consignacion
     * @throws MyException
     */
    private function setAdjuntosConsignacion($datos, $consignacion) {
        if (!isset($datos['archivos'])) {
            throw new MyException('Error, debe adjuntar al menos un archivo', -1);
        }
        foreach ($datos['archivos'] as $archivo) {
            $this->recaudosModel->actualizarAdjuntosConsignacion($archivo['idarchivo'], $consignacion['idconsignacion']);
        }
    }

    /**
     * Se elimina un archivo cuando el usuario lo quita  de la interfaz 
     * @param type $idArchivo
     * @throws MyException
     */
    public function eliminarArchivo($idArchivo) {
        try {
            $archivo = $this->recaudosModel->getAdjunto($idArchivo);
            if (file_exists($archivo['rutaarchivo'])) {
                unlink($archivo['rutaarchivo']);
            }
            $this->recaudosModel->eliminarAdjuntosConsignacion($idArchivo);
        } catch (\Exception $e) {
            throw new MyException('Error al eliminar el archivo', -1);
        }
    }

    /**
     * Se adjuntan varios archivos si el usuario 
     * subió varios soportes 
     * @param array $listaArchivos
     * @return type
     * @throws MyException
     */
    public function setArchivo(array $listaArchivos) {
        try {
            $archivos = array();
            foreach ($listaArchivos as $archivo) {
                $archivo['tipoarchivo'] = 'pdf';
                $archivos[] = $this->recaudosModel->insertarAdjuntoConsignacion($archivo);
            }
            return $archivos;
        } catch (\Exception $e) {
            throw new MyException('Error al adjuntar el archivo', -1);
        }
    }

    /**
     * Se toma la lista de los recaudos de la consignación 
     * y se asocian y se modifica el campo csg_ideregistro
     * @param array $datos
     * @param array $consignacion
     */
    public function vincularRecaudosConsignacion(array $datos, array $consignacion) {
        if (isset($datos['recaudos'])) {
            $listaRecaudos = $datos['recaudos'];
            foreach ($listaRecaudos as $recaudo) {
                $this->recaudosModel->actualizarRecaudoConsignacion($consignacion['idconsignacion'], $recaudo['idrecaudo'], $recaudo['version']);
            }
        }
    }

    /**
     * Se eliminan los archivos fisicos del sistema
     * @param array $datos
     */
    private function reiniciarConsignacion(array $datos) {
        $consignacion = $datos['consignacion'];
        $this->recaudosModel->reiniciarConsignacion($consignacion['idconsignacion']);
        foreach ($datos['recaudos'] as $archivo) {
            if ($archivo['accion'] == 'E') {
                $this->eliminarArchivo($archivo['idarchivo']);
            }
        }
    }

    /**
     * Consulta una consignación previamente registrada 
     * @param type $fechaInicio
     * @param type $fechaFin
     * @param type $idConsignacion
     * @param type $idMedioPago
     * @return type
     * @throws MyException
     */
    public function getConsignacion($fechaInicio, $fechaFin, $idConsignacion, $idMedioPago) {
        $estado = 'P';
        $idempresa = $this->sesion->get('idempresa');
        $listaConsignaciones = $this->recaudosModel->getConsignacionFiltro($fechaInicio, $fechaFin, $idConsignacion, $idMedioPago, $estado, $idempresa);
        if (empty($listaConsignaciones)) {
            throw new MyException('No se encontraron registros', 0);
        }
        return $listaConsignaciones;
    }

    /**
     * Consulta toda la información de una consignación 
     * @param type $idConsignacion
     * @return type
     * @throws MyException
     */
    public function getConsolidadoConsignacion($idConsignacion) {
        $consignacion = array();
        $listaDetallesConsignacion = $this->recaudosModel->getDetalleConsignacion($idConsignacion);
        if (empty($listaDetallesConsignacion)) {
            throw new MyException('No se encontraron detalles de consignación', -1);
        }

        $consignacion['detallesconsignacion'] = $this->getInformacionAdicional($listaDetallesConsignacion);
        $consignacion['archivos'] = $this->recaudosModel->getArchivosConsginacion($idConsignacion);
        $recaudos = $this->recaudosModel->getRecaudosVinculadosConsignaciones($idConsignacion);
        $listaRecaudos = array();
        foreach ($recaudos as $recaudo) {
            $recaudo['formaspago'] = $this->anularModel->buscarInfoAdicional($recaudo['idrecaudo']);
            $listaRecaudos[] = $recaudo;
        }
        $consignacion['recaudosdetalles'] = $listaRecaudos;
        $consignacion['recaudosfechas'] = $this->recaudosModel->getRecaudosFechasConsignacion($idConsignacion);
        $consignacion['consolidadoempresas'] = $this->recaudosModel->getRecaudosConsignacionesEmpresaVinculardos($idConsignacion);
        return $consignacion;
    }

    /**
     * Información adicional que registran por cada detalle de 
     * consignación 
     * @param type $listaDetallesConsignacion
     * @return type
     */
    public function getInformacionAdicional(&$listaDetallesConsignacion) {
        $lista = array();
        foreach ($listaDetallesConsignacion as &$detalleConsignacion) {
            $iddetalleconsignacion = $detalleConsignacion['iddetalleconsignacion'];
            $gruposInformacionAdicional = $this->recaudosModel->getGruposInformacionAdicional($iddetalleconsignacion);

            if (!empty($gruposInformacionAdicional)) {
                foreach ($gruposInformacionAdicional as $grupo) {
                    $detalleConsignacion['informacionadicional'][] = $this->recaudosModel->getInformacionAdicional($iddetalleconsignacion, $grupo['idgrupoconsignacion']);
                }
            }
            $lista[] = $detalleConsignacion;
        }
        return $lista;
    }

    /**
     * Se aprueba la consignación y después no se puede realizar ningún cambio
     * @param type $idConsignacion 
     * @param type $idTerceroResponsable
     * @param type $idtipodocumento
     * @param type $descripcionseven
     * @throws MyException
     */
    public function aprobarConsignacion($idConsignacion, $idTerceroResponsable, $idtipodocumento, $descripcionseven) {
        try {
            $this->conexion->beginTransaction();
            $consignacion = $this->recaudosModel->getConsignacion($idConsignacion);
            $consignacion['estado'] = 'A';
            $consignacion['descripcionseven'] = $descripcionseven;
            $this->recaudosModel->actualizarConsignacion($consignacion);
            $this->agregarDiferencia($consignacion, $idTerceroResponsable, $idtipodocumento);
            /**
             * Antes de confirmar los cambios se valida que los detalles de la consignación 
             * se han igual al valor de la sumatoria de los recaudos
             */
            $this->validarConsistenciaDatos($idConsignacion);
            $this->conexion->commit();
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException('Ocurrió un problema al aprobar la consignación ' . $e->getMessage(), -1);
        }
    }

    /**
     * Función encargada de validar que los detalles de la consignación 
     * 
     */
    private function validarConsistenciaDatos($idConsignacion) {
        $validacion = $this->recaudosModel->validarConsistenciaDatos($idConsignacion);
        if ($validacion['validacion'] != $validacion['vlrrecaudado']) {
            throw new MyException('La sumatoria de los detalles de la consignación no es igual al valor de lo recaudado', -1);
        }
    }

    /**
     * Se devuelve la consignación para que sea nuevamente modificada y/o eliminada 
     * @param type $idConsignacion
     * @param type $descripcionseven
     * @throws MyException
     */
    public function rechazarConsignacion($idConsignacion, $descripcionseven) {
        try {
            $this->conexion->beginTransaction();
            $this->recaudosModel->desvincularRecaudos($idConsignacion);
            $consignacion['idconsignacion'] = $idConsignacion;
            $consignacion['estado'] = 'E';
            $consignacion['descripcionseven'] = $descripcionseven;
            $this->recaudosModel->actualizarConsignacion($consignacion);
            $this->conexion->commit();
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException('Ocurrió un problema al eliminar la consignación ', -1);
        }
    }

    /**
     * De acuerdo a los valores de la consignación se registra una 
     * diferencia y dependiendo de la misma se verifica que concepto se aplica al momento de registrar
     * @param type $consignacion
     * @param type $idTerceroResponsable
     * @param type $idtipodocumento
     */
    public function agregarDiferencia($consignacion, $idTerceroResponsable, $idtipodocumento) {
        if ($consignacion['valorsobrante'] > 0) {
            $this->agregarDiferenciaSobrante($consignacion, $idTerceroResponsable, $idtipodocumento);
        }
        if ($consignacion['valorfaltante'] > 0) {
            $this->agregarDiferenciaFaltante($consignacion, $idTerceroResponsable, $idtipodocumento);
        }
        if ($consignacion['valorgasto'] > 0) {
            $this->agregarDiferenciaGasto($consignacion, $idTerceroResponsable, $idtipodocumento);
        }
        if ($consignacion['valorcuentaporpagar'] > 0) {
            $this->agregarDiferenciaCuentaPorPagar($consignacion, $idTerceroResponsable, $idtipodocumento);
        }
    }

    /**
     * Se agrega la diferencia cuando es un gasto 
     * @param type $consignacion
     * @param type $idTerceroResponsable
     * @param type $idtipodocumento
     */
    private function agregarDiferenciaGasto($consignacion, $idTerceroResponsable, $idtipodocumento) {
        $idEmpresa = $this->sesion->get('idempresa');
        //$tipoDocumento = $this->recaudosModel->getTipoDocumentoConsignacion($consignacion['idconsignacion']);
        $idBancoCuenta = $this->recaudosModel->getBancoCuentaMayorValor($consignacion['idconsignacion']);
        $idMedioPagoBancoCuenta = $this->recaudosModel->getBancoCuenta($consignacion['idmediopago'], $idBancoCuenta);
        $idMedioPagoTercero = $this->recaudosModel->getMedioPagoTercero($consignacion['idmediopago'], $idTerceroResponsable);
        $concepto = $this->recaudosModel->getConceptoConsignacion('G', $consignacion['idmediopago'], $idEmpresa);
        $idDetalleConsignacion = $this->recaudosModel->getDetalleConsignacion($consignacion['idconsignacion'])[0]['iddetalleconsignacion'];
        $diferencia['iddetalleconsignacion'] = $idDetalleConsignacion;
        $diferencia['idmediopagobanco'] = $idMedioPagoBancoCuenta;
        $diferencia['tipo'] = 'G';
        $diferencia['idmediopagotercero'] = $idMedioPagoTercero;
        $diferencia['idtipodocumento'] = $idtipodocumento;
        $diferencia['idmediopago'] = $consignacion['idmediopago']; //TODO DIFERENCIA CONSIGNACIÓN 
        $diferencia['idterceroresponsable'] = $idTerceroResponsable;
        $diferencia['idconcepto'] = $concepto['idconcepto'];
        $diferencia['valortotal'] = $consignacion['valorgasto'];
        $diferencia['valorreal'] = $consignacion['valorgasto'];
        $diferencia['idempresa'] = $this->sesion->get('idempresa');
        $diferencia['idconsignacion'] = $consignacion['idconsignacion'];
        $diferencia['idusuario'] = $this->sesion->get('idusuario');
        $this->recaudosModel->insertarDiferenciaConsignacion($diferencia);
    }

    /**
     * Se agrega la difenrencia cuando es faltante 
     * @param type $consignacion
     * @param type $idTerceroResponsable
     * @param type $idtipodocumento
     */
    private function agregarDiferenciaFaltante($consignacion, $idTerceroResponsable, $idtipodocumento) {
        $idEmpresa = $this->sesion->get('idempresa');
        //$tipoDocumento = $this->recaudosModel->getTipoDocumentoConsignacion($consignacion['idconsignacion']);
        $idBancoCuenta = $this->recaudosModel->getBancoCuentaMayorValor($consignacion['idconsignacion']);
        $idMedioPagoBancoCuenta = $this->recaudosModel->getBancoCuenta($consignacion['idmediopago'], $idBancoCuenta);
        $idMedioPagoTercero = $this->recaudosModel->getMedioPagoTercero($consignacion['idmediopago'], $idTerceroResponsable);
        $concepto = $this->recaudosModel->getConceptoConsignacion('F', $consignacion['idmediopago'], $idEmpresa);
        $idDetalleConsignacion = $this->recaudosModel->getDetalleConsignacion($consignacion['idconsignacion'])[0]['iddetalleconsignacion'];
        $diferencia['iddetalleconsignacion'] = $idDetalleConsignacion;
        $diferencia['tipo'] = 'F';
        $diferencia['idmediopagobanco'] = $idMedioPagoBancoCuenta;
        $diferencia['idmediopagotercero'] = $idMedioPagoTercero;
        $diferencia['idtipodocumento'] = $idtipodocumento;
        $diferencia['idmediopago'] = $consignacion['idmediopago'];
        $diferencia['idterceroresponsable'] = $idTerceroResponsable;
        $diferencia['idconcepto'] = $concepto['idconcepto'];
        $diferencia['valortotal'] = $consignacion['valorfaltante'];
        $diferencia['valorreal'] = $consignacion['valorfaltante'];
        $diferencia['idempresa'] = $this->sesion->get('idempresa');
        $diferencia['idconsignacion'] = $consignacion['idconsignacion'];
        $this->recaudosModel->insertarDiferenciaConsignacion($diferencia);
    }

    /**
     * Se agrega la diferencia cuando es un sobrante 
     * @param type $consignacion
     * @param type $idTerceroResponsable
     * @param type $idtipodocumento
     */
    private function agregarDiferenciaSobrante($consignacion, $idTerceroResponsable, $idtipodocumento) {
        $idEmpresa = $this->sesion->get('idempresa');
        $idMedioPagoTercero = $this->recaudosModel->getMedioPagoTercero($consignacion['idmediopago'], $idTerceroResponsable);
        $concepto = $this->recaudosModel->getConceptoConsignacion('S', $consignacion['idmediopago'], $idEmpresa);
        $idBancoCuenta = $this->recaudosModel->getBancoCuentaMayorValor($consignacion['idconsignacion']);
        $idMedioPagoBancoCuenta = $this->recaudosModel->getBancoCuenta($consignacion['idmediopago'], $idBancoCuenta);
        $idDetalleConsignacion = $this->recaudosModel->getDetalleConsignacion($consignacion['idconsignacion'])[0]['iddetalleconsignacion'];
        $diferencia['tipo'] = 'S';
        $diferencia['idmediopagotercero'] = $idMedioPagoTercero;
        $diferencia['idtipodocumento'] = $idtipodocumento;
        $diferencia['idmediopago'] = $consignacion['idmediopago'];
        $diferencia['idmediopagobanco'] = $idMedioPagoBancoCuenta;
        $diferencia['idterceroresponsable'] = $idTerceroResponsable;
        $diferencia['idconcepto'] = $concepto['idconcepto'];
        $diferencia['valortotal'] = $consignacion['valorsobrante'];
        $diferencia['valorreal'] = $consignacion['valorsobrante'];
        $diferencia['idempresa'] = $this->sesion->get('idempresa');
        $diferencia['idconsignacion'] = $consignacion['idconsignacion'];
        $diferencia['iddetalleconsignacion'] = $idDetalleConsignacion;
        $this->recaudosModel->insertarDiferenciaConsignacion($diferencia);
    }

    /**
     * Se agrega la diferencia cuando es una cuenta por pagar
     * @param type $consignacion
     * @param type $idTerceroResponsable
     * @param type $idtipodocumento
     */
    private function agregarDiferenciaCuentaPorPagar($consignacion, $idTerceroResponsable, $idtipodocumento) {
        $idEmpresa = $this->sesion->get('idempresa');
        $idMedioPagoTercero = $this->recaudosModel->getMedioPagoTercero($consignacion['idmediopago'], $idTerceroResponsable);
        $concepto = $this->recaudosModel->getConceptoConsignacion('C', $consignacion['idmediopago'], $idEmpresa);
        $idBancoCuenta = $this->recaudosModel->getBancoCuentaMayorValor($consignacion['idconsignacion']);
        $idMedioPagoBancoCuenta = $this->recaudosModel->getBancoCuenta($consignacion['idmediopago'], $idBancoCuenta);
        $idDetalleConsignacion = $this->recaudosModel->getDetalleConsignacion($consignacion['idconsignacion'])[0]['iddetalleconsignacion'];
        $diferencia['tipo'] = 'C';
        $diferencia['idmediopagotercero'] = $idMedioPagoTercero;
        $diferencia['idtipodocumento'] = $idtipodocumento;
        $diferencia['idmediopago'] = $consignacion['idmediopago'];
        $diferencia['idmediopagobanco'] = $idMedioPagoBancoCuenta;
        $diferencia['idterceroresponsable'] = $idTerceroResponsable;
        $diferencia['idconcepto'] = $concepto['idconcepto'];
        $diferencia['valortotal'] = $consignacion['valorcuentaporpagar'];
        $diferencia['valorreal'] = $consignacion['valorcuentaporpagar'];
        $diferencia['idempresa'] = $this->sesion->get('idempresa');
        $diferencia['idconsignacion'] = $consignacion['idconsignacion'];
        $diferencia['iddetalleconsignacion'] = $idDetalleConsignacion;
        $this->recaudosModel->insertarDiferenciaConsignacion($diferencia);
    }

    /**
     * Se consultan los responsables de la consignación de acuerdo 
     * al medio de pago
     * @param type $idMedioPago
     * @return type
     * @throws MyException
     */
    public function getTercerosResponsables($idMedioPago) {
        $listaTerceros = $this->recaudosModel->getTercerosResponsables($idMedioPago);
        if (empty($listaTerceros)) {
            throw new MyException('No se encontraron registros de terceros', 0);
        }
        return $listaTerceros;
    }

    /**
     * Cosulta la información de la empresa que está en sesión
     * @return type
     * @throws MyException
     */
    public function getEmpresaLogueada() {
        $idEmpresa = $this->sesion->get('idempresa');
        $listaTerceros = $this->recaudosModel->getInformacionEmpresa($idEmpresa);
        if (empty($listaTerceros)) {
            throw new MyException('Ocurrió un problema al encontrar la información de la empresa, intente nuevamente', 0);
        }
        return $listaTerceros[0];
    }

}
