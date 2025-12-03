<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\DefinicionesConceptoModel;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;

/**
 * Description of DefinicionesConceptosDelegado
 *
 * @author Sergio Andrés Vargas
 * Revisión: 15 -07 - 2015
 */
class DefinicionesConceptosDelegado {

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
     * @var DefinicionesConceptoModel
     */
    private $definicionConceptosModel;

    /**
     * Constructor de la clase
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->sesion = $sesion;
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->definicionConceptosModel = new DefinicionesConceptoModel($this->conexion);
    }

    // <editor-fold desc="Definicion de concepto">

    /**
     * permite actualizar un concepto
     * @param array $concepto
     * @return int cantidad de filas afectadas
     */
    private function updateConcepto($concepto) {
        $idconcepto = 0;
        $concepto['idusuario'] = $this->sesion->get('idusuario');
        if ($concepto['accion'] === 'A') {
            $idconcepto = $this->definicionConceptosModel->actualizarConceptoModel($concepto);
        }
        if ($concepto['accion'] === 'I') {
            $idconcepto = $this->definicionConceptosModel->insertarConceptoModel($concepto);
        }
        return $idconcepto;
    }

    /**
     * Recibe la defincion de los conceptos con el fin de procesarlos
     * @param DefinicionesConceptos $definicionesconceptos
     */
    public function definicionConcepto($definicionesconceptos) {
        try {
            $this->conexion->beginTransaction();
            $this->setEstructuraConceptos($definicionesconceptos['conceptos']);
            $concepto = $definicionesconceptos['conceptos'];
            if ($concepto['tipcalculo'] === 'V') {
                $this->definicionConceptosModel->limpiarConceptosRelacionadosModel($concepto['idconcepto']);
                $this->definicionConceptosModel->limpiarRangoConceptoModel($concepto['idconcepto']);
            }
            $this->updateConcepto($concepto);
            if (isset($definicionesconceptos['relacionconceptos'])) {
                $conceptosRelacionados = $definicionesconceptos['relacionconceptos'];
                if (!empty($conceptosRelacionados)) {
                    $this->updateConceptoRelacionado($conceptosRelacionados);
                }
            }
            if (isset($definicionesconceptos['rangosconceptos'])) {
                $rangoConceptos = $definicionesconceptos['rangosconceptos'];
                if (!empty($rangoConceptos)) {

                    if (!empty($rangoConceptos['valor']) && !empty($rangoConceptos['formula'])) {
                        throw new MyException("No puede existir un rango con fórmula y valor", -1);
                    }
                    $this->updateRangoConceptos($rangoConceptos);
                }
            }
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

    /**
     * permite la modificación de la contabilización de los conceptos 
     * @param array $definicionesconceptos
     * @throws MyException
     */
    public function actualizarContabilizacionConceptos($definicionesconceptos) {
        try {
            $this->conexion->beginTransaction();
            if (!empty($definicionesconceptos['causioncontable']['contabilizacion'])) {
                $this->updateContabilizacionConceptos($definicionesconceptos['causioncontable']['contabilizacion']);
            }
            if (!empty($definicionesconceptos['causioncontable']['areanegocio'])) {
                $this->updateContabilizacionAreaNegocios($definicionesconceptos['causioncontable']['areanegocio']);
            }
            if (!empty($definicionesconceptos['causioncontable']['centrocosto'])) {
                $this->updateContabilizacionCentroCosto($definicionesconceptos['causioncontable']['centrocosto']);
            }
            if (!empty($definicionesconceptos['recaudo']['conceptoflujo'])) {
                $this->updateRecaudoConceptoFlujo($definicionesconceptos['recaudo']['conceptoflujo']);
            }
            if (!empty($definicionesconceptos['recaudo']['conceptocontable'])) {
                $this->updateContabilizacionConceptoContable($definicionesconceptos['recaudo']['conceptocontable']);
            }
            if (!empty($definicionesconceptos['consignacion']['conceptoflujo'])) {
                $contabilizacionConsignacionConceptoFlujo = $definicionesconceptos['consignacion']['conceptoflujo'];
                $this->updateContabilizacionConsignacionFlujoContable($contabilizacionConsignacionConceptoFlujo);
            }
            if (!empty($definicionesconceptos['consignacion']['conceptocontable'])) {
                $contabilizacionConsignacionConceptoContable = $definicionesconceptos['consignacion']['conceptocontable'];
                $this->updateContabilizacionConsignacionConceptoContable($contabilizacionConsignacionConceptoContable);
            }
            if (!empty($definicionesconceptos['diferencia']['conceptoflujo'])) {
                $contabilizacionConsignacionConceptoFlujo = $definicionesconceptos['diferencia']['conceptoflujo'];
                $this->updateContabilizacionConsignacionFlujoContable($contabilizacionConsignacionConceptoFlujo);
            }
            if (!empty($definicionesconceptos['diferencia']['conceptocontable'])) {
                $contabilizacionConsignacionConceptoContable = $definicionesconceptos['diferencia']['conceptocontable'];
                $this->updateContabilizacionConsignacionConceptoContable($contabilizacionConsignacionConceptoContable);
            }
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException($ex->getMessage(), $ex->getCode());
        }
    }

// </editor-fold>
    //<editor-fold desc="Definicion del concepto">
    // <editor-fold desc="Conceptos">

    /**
     * permite listar los conceptos
     * @param int $idconcepto
     * @return listado de conceptos
     * @throws arroja error si no encuentra conceptos que mostrar
     */
    public function getConceptos($idconcepto = null, $omitir = true, $esnuevo = false) {
        $idempresa = $this->sesion->get('idempresa');
        $conceptos = $this->definicionConceptosModel->getConceptos($idconcepto, $omitir, $idempresa, $esnuevo);
        if (empty($conceptos)) {
            throw new MyException("No hay conceptos para mostrar", 0);
        }
        if ($omitir == false)
            return $conceptos[0];

        return $conceptos;
    }

    /**
     * permite listar los conceptos
     * @param int $strAlias
     * @return listado de conceptos
     * @throws arroja error si no encuentra conceptos que mostrar
     */
    public function validaAliasConcepto($strAlias = null) {
        $conceptos = $this->definicionConceptosModel->validarAliasModel($strAlias);
        if (!empty($conceptos)) {
            throw new MyException("Ya se encuentra registrado el alias $strAlias", -1);
        }
        return 'Concepto permitido';
    }

    /**
     * 
     * permite consultar los conceptos relacionados
     * @param int $idconcepto
     * @return array obtiene los conceptos relacionados
     * @throws arroja error si no encuentra conceptos que mostrar
     */
    public function getConceptosRelacionados($idconcepto) {
        $empresa = $this->sesion->get('idempresa');
        $conceptos = $this->definicionConceptosModel->getConceptosRelacionadosModel($idconcepto, $empresa);
        return $conceptos;
    }

    /**
     * limpia los conceptos relacionados asociados a un concepto
     * @param int $idconcepto
     * @return cantidad de filas afectadas
     */
    public function limpiarConceptosRelacionados($idconcepto) {
        $conceptos = $this->definicionConceptosModel->limpiarConceptosRelacionadosModel($idconcepto);
        return $conceptos;
    }

    /**
     * @deprecated since version 1.0.0 usar updateconceptosrelacionados
     * permite crear los conceptos relacionados
     * @param ConceptosRelacionados $conceptosrelacionados
     * @return cantidad de filas afectadas
     */
    public function crearConceptosRelacionados($conceptosrelacionados) {
        $conceptosrelacionados['idusuario'] = $this->sesion->get('idusuario');
        $idconcepto = $this->definicionConceptosModel->crearConceptorelacionadoModel($conceptosrelacionados);
        return $idconcepto;
    }

    /**
     * permite retornar un listado de condeptos por nombre
     * @param stirng $cadena
     * @return listado de conceptos
     *
     */
    public function getConceptosNombre($cadena) {
        $idempresa = $this->sesion->get('idempresa');
        $idusuario = $this->sesion->get('idusuario');
        $conceptos = $this->definicionConceptosModel->getConceptosPorNombre($cadena, $idempresa, $idusuario);

        return $conceptos;
    }

    /**
     * permite retornar un listado de condeptos para parametrizar
     * @return listado de conceptos
     *
     */
    public function getConceptosParametrizables() {
        $idempresa = $this->sesion->get('idempresa');
        $conceptos = $this->definicionConceptosModel->getConceptosParametrizables($idempresa);
        return $conceptos;
    }

    /**
     * listado deprogramas
     * @return array
     */
    public function getProgramas() {
        $programa = $this->definicionConceptosModel->getProgramas();
        return $programa;
    }

    /**
     * @deprecated since version 1.0.0 
     * listado de elmentos por tabla de origen
     * @param int $idprograma
     * @return array
     */
    public function getTablaOrigen($idprograma) {
        $origen = $this->definicionConceptosModel->getTablaOrigen($idprograma);
        return $origen;
    }

    /**
     * @deprecated since version 1.0.0
     * permite obtener un campo especifico
     * @param int $idtablaorigen
     * @return array
     */
    public function getCampo($idtablaorigen) {
        $origen = $this->definicionConceptosModel->getCampo($idtablaorigen);
        return $origen;
    }

    /**
     * @deprecated since version 1.0.0
     * lista toda las liquidaciones
     * @return array
     */
    public function getLiquidacion() {
        $idempresa = $this->sesion->get("idempresa");
        $liquidacion = $this->definicionConceptosModel->getLiquidacionModel($idempresa);
        return $liquidacion;
    }

    /**
     * lista todos los documentos existentes
     * @return array
     */
    public function getDocumentos($idempresa) {

        $idusuario = $this->sesion->get("idusuario");
        $documentos = $this->genericoModel->getDocumentoPerfil(PROGRAMA_CONCEPTOS, $idusuario, $idempresa);
        return $documentos;
    }

    /**
     * lista los documentos asociados a un tipo de documento
     * @param int $iddocumento
     * @return array
     */
    public function getTipoDocumentos($iddocumento = null) {
        $idempresa = $this->sesion->get("idempresa");
        $idusuario = $this->sesion->get("idusuario");
        $documentos = $this->genericoModel->getTipoDocumentoPerfil(PROGRAMA_CONCEPTOS, $idusuario, $idempresa, $iddocumento);
        return $documentos;
    }

    /**
     * 
     * @param type $iddocumento
     * @return type
     */
    public function ObtenerTipoDocumentosParametrizables($iddocumento, $idempresa) {
        $idusuario = $this->sesion->get('idusuario');
        $Recaudos = $this->genericoModel->getTipoDocumentoPerfil(PROGRAMA_CONTABILIZAR_CONCEPTOS, $idusuario, $idempresa, $iddocumento);
        return $Recaudos;
    }

    /**
     * lista los documentos asociados a la liquidacion
     * @param int $idliquidacion
     * @return array
     */
    public function getDocumentoLiquidacion($idliquidacion) {
        $documentoLiquidacion = $this->definicionConceptosModel->getDocumentoLiquidacionModel($idliquidacion);
        return $documentoLiquidacion;
    }

    /**
     * Obtiene el listado de funciones
     * @return Array
     */
    public function getFunciones($idfuncion = null, $tipo = null) {
        $funciones = $this->definicionConceptosModel->getFuncionesModel($idfuncion, $tipo);
        return $funciones;
    }

    /**
     * permite obtener el listado de los conceptos
     * @param Concepto $concepto
     */
    private function setEstructuraConceptos(&$concepto) {
        $idconcepto = $concepto['idconcepto'];
        if (empty($idconcepto)) {
            return;
        }
        $respuestaEstructura = $this->genericoModel->consultarEstructuraPorIdUnidad($idconcepto);
        if (empty($respuestaEstructura)) {
            throw new MyException("No existen estructuras asociadas al concepto $idconcepto", 0);
        }
        $concepto["estconcepto"] = $respuestaEstructura['idestructura'];
    }

// </editor-fold>
    // <editor-fold desc="Relacion de conceptos">

    /**
     * Permite establecer la configuración del concepto relacionado
     * @param Conceptorelacionado $conceptosRelacionado
     */
    private function updateConceptoRelacionado($conceptosRelacionado) {
        foreach ($conceptosRelacionado as $relacion) {
            $relacion['idusuario'] = $this->sesion->get('idusuario');

            if ($relacion['accion'] === 'I') {
                $this->definicionConceptosModel->crearConceptorelacionadoModel($relacion);
            }
            if ($relacion['accion'] === 'A') {
                $this->definicionConceptosModel->actualizarConceptoRelacionadoModel($relacion);
            }
            if ($relacion['accion'] === 'E') {
                $this->definicionConceptosModel->eliminarConceptosRelacionadosModel($relacion['idconceptorelacionado'], $relacion['idconcepto']);
            }
        }
    }

    // </editor-fold>
    // <editor-fold desc="rangos de conceptos">

    /**
     * Permite actualizar los rangos de los conceptos
     * @param RangoConceptos $rangoConceptos
     */
    private function updateRangoConceptos($rangoConceptos) {
        foreach ($rangoConceptos as $concepto) {
            $concepto['usuario'] = $this->sesion->get("idusuario");

            if (empty($concepto['accion'])) {
                throw new MyException("No existe una acción para actualizar rangos, proceso cancelado", -1);
            }

            if ($concepto['accion'] === 'I') {
                $this->definicionConceptosModel->crearRangoConceptosModel($concepto);
            }
            if ($concepto['accion'] === 'A') {
                $this->definicionConceptosModel->actualizarRangoConceptosModel($concepto);
            }
            if ($concepto['accion'] === 'E') {
                $this->definicionConceptosModel->eliminarRangoConceptoModel($concepto['idrango']);
            }
        }
    }

    /**
     * permite obtener un rango por los concepto existentes
     * @param array $idconcepto
     * @return int cantidad de filas afectadas
     */
    public function getRangoConcepto($idconcepto) {
        $cantFilasAfectadas = $this->definicionConceptosModel->getRangosConceptosModel($idconcepto);
        return $cantFilasAfectadas;
    }

    /**
     * permite crear un rango concepto
     * @param array $rangoconceptos
     * @return int cantidad de filas afectadas
     */
    public function crearRangoConcepto($rangoconceptos) {
        $cantFilasAfectadas = $this->definicionConceptosModel->crearRangoConceptosModel($rangoconceptos);
        return $cantFilasAfectadas;
    }

    /**
     * permite actualizar un rango concepto
     * @param array $rangoconceptos
     * @return int cantidad de filas afectadas
     */
    public function actualizarRangoConcepto($rangoconceptos) {
        $cantFilasAfectadas = $this->definicionConceptosModel->actualizarRangoConceptosModel($rangoconceptos);
        return $cantFilasAfectadas;
    }

    /**
     * permite eliminar un rango concepto
     * @param array $rangoconceptos
     * @return int cantidad de filas afectadas
     */
    public function eliminarRangoConcepto($rangoconceptos) {
        $cantFilasAfectadas = $this->definicionConceptosModel->eliminarRangoConcepto($rangoconceptos);
        return $cantFilasAfectadas;
    }

// </editor-fold>
    // </editor-fold>
    // <editor-fold desc="contabilización de conceptos">

    /**
     * verifica el id de la empresa que llega como parámetro
     * @param type $idempresa recibe el identificador de la empresa
     */
    private function validarEmpresa($idempresa) {

        if (empty($idempresa)) {
            $idempresa = $this->sesion->get('idempresa');
        }

        return $idempresa;
    }

    /**
     * permite obtener las cuentas para la contabilización y recaudos
     * @param string $cuenta filtro por nombre o código de cuenta
     * @return Array listado de cuentas
     */
    public function ObtenerCuentasContabilizacionRecaudos($cuenta = null) {
        $idempresa = $this->sesion->get('idempresa');
        $cuentasContabilizacion = $this->definicionConceptosModel->ObtenerCuentasModel($idempresa, 5, $cuenta);
        return $cuentasContabilizacion;
    }

    //   <editor-fold desc="Causión contable">
    //           <editor-fold desc="Contabilización">

    /**
     * Permite configurar la contabilizaciond de conceptos
     * @param ContabilizacionConcepto $contabilizacionContable
     */
    private function updateContabilizacionConceptos($contabilizacionContable) {
        foreach ($contabilizacionContable as $concepto) {
            if ($concepto['accion'] === 'E') {
                $this->definicionConceptosModel->eliminarContabilizacionContableModel($concepto['idcontabilizacion']);
                break;
            }
            $concepto['usuario'] = $this->sesion->get("idusuario");
            $concepto['idempresa'] = $this->validarEmpresa($concepto['idempresa']);
            $concepto['tarcodi'] = 5;
            if ($concepto['accion'] === 'I') {
                $concepto['idcuenta'] = $concepto['codigo'];
                $this->definicionConceptosModel->crearContabilizacionContableModel($concepto);
            }
            if ($concepto['accion'] === 'A') {
                $concepto['idcuenta'] = $concepto['codigo'];
                $this->definicionConceptosModel->updateContabilizacionContableModel($concepto);
            }
        }
    }

    /**
     * permite obtener la contabilización
     * @param int $idconcepto filtro por nombre o código de cuenta
     * @return Array listado de contabilizacion
     */
    public function ObtenerContabilizacion($idconcepto, $iddocumento, $idtipodocumento) {
        $idempresa = $this->sesion->get('idempresa');
        $Contabilizacion = $this->definicionConceptosModel->obtenerContabilizacionModel($idconcepto, $idempresa,$iddocumento, $idtipodocumento);
        return $Contabilizacion;
    }

    // </editor-fold>
    // <editor-fold desc="Area de negocio">

    private function updateContabilizacionAreaNegocios($contabilizacionContable) {
        foreach ($contabilizacionContable as $concepto) {
            if ($concepto['accion'] === 'E') {
                $this->definicionConceptosModel->eliminarAreaNegocioModel($concepto['idareanegocio']);
                break;
            }

            $concepto['idusuario'] = $this->sesion->get("idusuario");
            $concepto['idempresa'] = $this->validarEmpresa($concepto['idempresa']);
            $identificadorcuenta = $this->definicionConceptosModel->obtenerIdentificadorCuenta($concepto['codigoarea']);
            //$concepto['idcuenta'] = $identificadorcuenta['idcuenta'];
            $concepto['codigo'] = $identificadorcuenta['idcuenta'];
            $concepto['tarcodi'] = 1;
            if ($concepto['accion'] === 'I') {
                $this->definicionConceptosModel->crearAreaNegocioModel($concepto);
            }
            if ($concepto['accion'] === 'A') {
                $this->definicionConceptosModel->updateAreaNegocioModel($concepto);
            }
        }
    }

    /**
     * permite obtener el área de negocio
     * @param int $idconcepto filtro por nombre o código de cuenta
     * @return Array listado de area de negocio
     */
    public function ObtenerAreaNegocio($idconcepto) {
        $idempresa = $this->sesion->get('idempresa');
        $AreaNegocio = $this->definicionConceptosModel->obtenerAreaNegocioModel($idconcepto, $idempresa);
        return $AreaNegocio;
    }

    /**
     * permite obtener las cuentas para la contabilización
     * @param string $cuenta filtro por nombre o código de cuenta
     * @return Array listado mde cuentas
     */
    public function ObtenerCuentasAreaNegocio($cuenta = null) {
        $idempresa = $this->sesion->get('idempresa');
        $cuentasContabilizacion = $this->definicionConceptosModel->ObtenerCuentasModel($idempresa, 1, $cuenta);
        return $cuentasContabilizacion;
    }

    /**
     * Lista los tipos de suscripciones de acuerdo al tipo de empresa
     * @return Array Tipo de suscripción
     */
    public function ObtenerTipoSuscripcionAreaNegocio() {
        $idempresa = $this->sesion->get('idempresa');
        $Tiposuscripcion = $this->definicionConceptosModel->obtenerTipoSuscripcionModel($idempresa);
        return $Tiposuscripcion;
    }

    // </editor-fold>
    // <editor-fold desc="Centro de costo">

    /**
     * Permite adminsitrar el centro de costo
     * @param ContabilizacionCentroCosto $contabilizacionCentroCosto
     */
    private function updateContabilizacionCentroCosto($contabilizacionCentroCosto) {
        foreach ($contabilizacionCentroCosto as $concepto) {
            if ($concepto['accion'] === 'E') {
                $this->definicionConceptosModel->eliminarCentroCostoModel($concepto['idcentrocosto']);
                break;
            }

            $concepto['idusuario'] = $this->sesion->get("idusuario");
            $concepto['idempresa'] = $this->validarEmpresa($concepto['idempresa']);
            $identificadorcuenta = $this->definicionConceptosModel->obtenerIdentificadorCuenta($concepto['codigo']);
            $concepto['idcuenta'] = $identificadorcuenta['idcuenta'];
            $concepto['tarcodi'] = 3;
            $concepto['est_concepto'] = 6;
            if ($concepto['accion'] === 'I') {
                $this->definicionConceptosModel->crearCentroCostoModel($concepto);
            }
            if ($concepto['accion'] === 'A') {
                $this->definicionConceptosModel->actualizarCentroCostoModel($concepto);
            }
        }
    }

    /**
     * Listar los centros de costo
     * @param int $idconcepto tipo de concepto
     * @return Array listado de centro de costos
     */
    public function ObtenerCentroCosto($idconcepto) {
        $idempresa = $this->sesion->get('idempresa');
        $AreaNegocio = $this->definicionConceptosModel->obtenerCentroCostoModel($idconcepto, $idempresa);
        return $AreaNegocio;
    }

    /**
     * permite obtener los procesos de las empresas
     * @return Array listado de procesos
     */
    public function ObtenerDepartamentoEmpresa() {
        $idempresa = $this->sesion->get('idempresa');
        $departamentoEmpresa = $this->definicionConceptosModel->obtenerDepartamentoEmpresa($idempresa);
        return $departamentoEmpresa;
    }

    /**
     * permite obtener las cuentas para la contabilización
     * @param string $cuenta filtro por nombre o código de cuenta
     * @return Array listado mde cuentas
     */
    public function ObtenerCuentasCentroCosto($cuenta = null) {
        $idempresa = $this->sesion->get('idempresa');
        $cuentasContabilizacion = $this->definicionConceptosModel->ObtenerCuentasModel($idempresa, 3, $cuenta);
        return $cuentasContabilizacion;
    }

    // </editor-fold>
    // </editor-fold>
    // <editor-fold desc="Recaudo">

    /**
     * permite obtener los medios de pago
     * @return Array listado de medios de pago
     */
    public function ObtenerMediosPago() {
        $idEmpresa = $this->sesion->get('idempresa');
        $idUsuario = $this->sesion->get('idusuario');
        $MediosPago = $this->definicionConceptosModel->obtenerMedioPagoModel($idEmpresa, $idUsuario);
        return $MediosPago;
    }

    // <editor-fold desc="Contabilizacion cruce">

    /**
     * Permite configurar los recaudos de conceptos
     * @param $conceptoContable  recibe el concepto contable a evaluar
     */
    private function updateContabilizacionConceptoContable($conceptoContable) {
        foreach ($conceptoContable as $concepto) {
            if ($concepto['accion'] === 'E') {
                $this->definicionConceptosModel->eliminarRecaudoConceptoContableModel($concepto['idconceptocontable']);
                break;
            }
            $concepto['idusuario'] = $this->sesion->get("idusuario");
            $concepto['idempresa'] = $this->validarEmpresa($concepto['idempresa']);

            if ($concepto['accion'] === 'I') {
                $this->definicionConceptosModel->CrearRecaudoConceptoContableModel($concepto);
            }
            if ($concepto['accion'] === 'A') {
                $this->definicionConceptosModel->updateRecaudoConceptoContableModel($concepto);
            }
        }
    }

    /**
     * Permite configurar los recaudos de conceptos
     * @param ContabilizacionConcepto $RecaudosConceptos
     */
    private function updateRecaudoConceptoFlujo($RecaudosConceptos) {
        foreach ($RecaudosConceptos as $concepto) {
            if ($concepto['accion'] === 'E') {
                $this->definicionConceptosModel->eliminarConceptoFlujoContableModel($concepto['idconceptoflujo']);
                break;
            }

            $concepto['idusuario'] = $this->sesion->get("idusuario");
            $concepto['idempresa'] = $this->validarEmpresa($concepto['idempresa']);

            if ($concepto['accion'] === 'I') {
                $this->definicionConceptosModel->CrearConceptoFlujoModel($concepto);
            }
            if ($concepto['accion'] === 'A') {
                $this->definicionConceptosModel->updateConceptoFlujoContableModel($concepto);
            }
        }
    }

    /**
     * Permite obtener el listado de contrabilización de cruce
     * @return Array Contabilizacion cruce
     */
    public function ObtenerContabilizacionCruce($idempresa) {
        $Recaudos = $this->definicionConceptosModel->obtenerContabilizacionCruceModel($idempresa);
        return $Recaudos;
    }

// </editor-fold>
    // <editor-fold desc="Contabilizacion Anticipo">

    /**
     * @deprecated since version 1.0.0
     * Permite configurar los recaudos de conceptos
     * @param ContabilizacionConcepto $RecaudosConceptos
     */
    private function updateContabilizacionAnticipoConceptos($RecaudosConceptos) {
        foreach ($RecaudosConceptos as $concepto) {
            $concepto['idusuario'] = $this->sesion->get("idusuario");
            $concepto['idempresa'] = $this->validarEmpresa($concepto['idempresa']);
            $identificadorcuenta = $this->definicionConceptosModel->obtenerIdentificadorCuenta($concepto['codigo']);
            $concepto['idcuenta'] = $identificadorcuenta['idcuenta'];
            $concepto['tarcodi'] = 5;
            if ($concepto['accion'] === 'I') {
                $this->definicionConceptosModel->crearContabilizacionAnticipoModel($concepto);
            }
            if ($concepto['accion'] === 'A') {
                $this->definicionConceptosModel->updateContabilizacionAnticipoModel($concepto);
            }
            if ($concepto['accion'] === 'E') {
                $this->definicionConceptosModel->eliminarContabilizacionAnticipoModel($concepto['idcontabilizacionanticipo']);
            }
        }
    }

    /**
     * Listar la contabilizacion anticipo
     * @param int $idconcepto tipo de concepto anticipo
     * @return Array listado de contabilizacion anticipo
     */
    public function ObtenerContabilizacionAnticipo($idempresa) {
        $ContabilizacionAnticipo = $this->definicionConceptosModel->obtenerContabilizacionAnticipoModel($idempresa);
        return $ContabilizacionAnticipo;
    }

    // </editor-fold>
    // <editor-fold desc="Empresas Convenio">
    /**
     * Permite cargar la contabilización de los recaudos de los conceptos
     * @param RecaudosConceptos $RecaudosConceptos
     */
    private function updateContabilizacionEmpresasConvenioConceptos($RecaudosConceptos) {
        foreach ($RecaudosConceptos as $concepto) {
            $concepto['idusuario'] = $this->sesion->get("idusuario");
            $concepto['idempresa'] = $this->validarEmpresa($concepto['idempresa']);
            $identificadorcuenta = $this->definicionConceptosModel->obtenerIdentificadorCuenta($concepto['codigo']);
            $concepto['idcuenta'] = $identificadorcuenta['idcuenta'];
            $concepto['tarcodi'] = 5;
            if ($concepto['accion'] === 'I') {
                $this->definicionConceptosModel->crearEmpresasConveniosModel($concepto);
            }
            if ($concepto['accion'] === 'A') {
                $this->definicionConceptosModel->actualizarEmpresasConveniosModel($concepto);
            }
            if ($concepto['accion'] === 'E') {
                $this->definicionConceptosModel->eliminarEmpresaConvenio($concepto['idconvenio']);
            }
        }
    }

    /**
     * Listar las empresas convenio
     * @param int $idempresa id de empresa logueada
     * @return Array listado de empresas convenios
     */
    public function ObtenerEmpresasConvenio() {
        $idempresa = $this->sesion->get('idempresa');
        $EmpresasConvenio = $this->definicionConceptosModel->obtenerEmpresasConvenioModel($idempresa);
        return $EmpresasConvenio;
    }

    /**
     * Permite obtener el listado de empresas para la pestaña de recaudos, con el objetivo de listar todos excepto la de los parámetros
     * @return Array listado de empresas para recaudo
     */
    public function ObtenerEmpresasRecaudo($idempresa) {
        $EmpresasRecaudos = $this->definicionConceptosModel->obtenerEmpresasRecaudoModel($idempresa);
        return $EmpresasRecaudos;
    }

    // </editor-fold>
    // </editor-fold>
    // <editor-fold desc="Consignación">
    //
    // <editor-fold desc="Consignaciones unidad">

    /**
     * Permite cargar la Consignación de los conceptos
     * @param ConsignacionConceptos $ConsignacionConceptos
     */
    private function updateContabilizacionConsignacionFlujoContable($ConsignacionConceptos) {
        foreach ($ConsignacionConceptos as $concepto) {
            if ($concepto['accion'] === 'E') {
                $this->definicionConceptosModel->eliminarConceptoFlujoContableModel($concepto['idconceptoflujo']);
                break; 
            }
            $concepto['idusuario'] = $this->sesion->get("idusuario");
            $concepto['idempresa'] = $this->validarEmpresa($concepto['idempresa']);
            if ($concepto['accion'] === 'I') {
                $this->definicionConceptosModel->crearConsignacionModel($concepto);
            }
            if ($concepto['accion'] === 'A') {
                $this->definicionConceptosModel->actualizarconsignacionModel($concepto);
            }
        }
    }

    /**
     * permite obtener los bancos permitidos como consignación a partir de una medio de pago
     * @return Array listado de bancos para consignación
     */
    public function obtenerListarBancosConsignacion($idmediopago) {
        $idempresa = $this->sesion->get('idempresa');
        $listaBaconsConsignacion = $this->definicionConceptosModel->obtenerListarBancosConsignacionModel($idmediopago, $idempresa);
        return $listaBaconsConsignacion;
    }

    /**
     * permite obtener los cuentas permitidos como consignación a partir de una medio de pago
     * @return Array listado de bancos para consignación
     */
    public function obtenerCuentasBanco($idmediopago, $idbanco) {
        $idempresa = $this->sesion->get('idempresa');
        $ListaCuentas = $this->definicionConceptosModel->obtenerCuentasBancoModel($idmediopago, $idempresa, $idbanco);
        return $ListaCuentas;
    }

    /**
     * Listar las consignaciones
     * @return Array listado de consignaciones
     */
    public function obtenerConsignaciones($idempresa) {
        $Consignaciones = $this->definicionConceptosModel->obtenerConsignacionesModel($idempresa);
        return $Consignaciones;
    }

    /**
     * carga las diferencias de consignacvión
     * @return Array diferencia de consignación
     */
    public function obtenerDiferenciaConsignaciones($idempresa) {
        $Consignaciones = $this->definicionConceptosModel->obtenerDiferenciaConsignacionModel($idempresa);
        return $Consignaciones;
    }

    // </editor-fold>
    // 

    /**
     * Permite cargar la Consignación de los conceptos
     * @param ConsignacionConceptos $ConsignacionConceptos
     */
    private function updateContabilizacionConsignacionConceptoContable($ConsignacionConceptos) {
        foreach ($ConsignacionConceptos as $concepto) {
            if ($concepto['accion'] === 'E') {
                $this->definicionConceptosModel->eliminarDiferenciaConsignacion($concepto['idconceptocontable']);
                break; 
            }
            $concepto['idusuario'] = $this->sesion->get("idusuario");
            $concepto['idempresa'] = $this->validarEmpresa($concepto['idempresa']);
            if ($concepto['accion'] === 'I') {
                $this->definicionConceptosModel->crearConsignacionConceptoContableModel($concepto);
            }
            if ($concepto['accion'] === 'A') {
                $this->definicionConceptosModel->actualizarConsignacionConceptoContableModel($concepto);
            }
        }
    }

    // 
    // </editor-fold>
    // <editor-fold desc="Presupuesto">
    /**
     * permite obtener los documentos permitidos como consignación
     * @return Array listado de documentos para consignación
     */
    public function ObtenerDocumentos($idempresa) {
        $idusuario = $this->sesion->get('idusuario');
        $Recaudos = $this->genericoModel->getDocumentoPerfil(PROGRAMA_CONCEPTOS, $idusuario, $idempresa, null);
        return $Recaudos;
    }

    /**
     * 
     * @param type $idempresa
     * @return type
     */
    public function ObtenerDocumentosParametrizables($idempresa) {
        $idusuario = $this->sesion->get('idusuario');
        $Recaudos = $this->genericoModel->getDocumentoPerfil(PROGRAMA_CONTABILIZAR_CONCEPTOS, $idusuario, $idempresa, null);
        return $Recaudos;
    }

    /**
     * Lista los conceptos contables
     * @return Array
     */
    public function ObtenerContabilizacionConceptoContable($idempresa, $iddocumento, $idtipodocumento, $idmediopago, $complemento) {
        $conceptoContable = $this->definicionConceptosModel->obtenerConceptosContablesModel($idempresa, $iddocumento, $idtipodocumento, $idmediopago, $complemento);
        return $conceptoContable;
    }

    /**
     * Obtiene el flujo contable para la creación de conceptos
     * @return type
     */
    public function ObtenerFlujoContable() {
        $idempresa = $this->sesion->get('idempresa');
        $conceptoContable = $this->definicionConceptosModel->obtenerflujoConceptoContable($idempresa);
        return $conceptoContable;
    }

    /**
     * Obtiene el concepto contable para la creación de conceptos
     * @return type
     */
    public function ObtenerConceptoContable() {
        $idempresa = $this->sesion->get('idempresa');
        $conceptoContable = $this->definicionConceptosModel->obtenerconceptoContable($idempresa);
        return $conceptoContable;
    }

    public function ObtenerContabilizacionFlujoContable($idempresa, $iddocumento, $idtipodocumento, $idmediopago, $complemento) {
        $conceptoContable = $this->definicionConceptosModel->obtenerFlujosConceptosContablesModel($idempresa, $iddocumento, $idtipodocumento, $idmediopago, $complemento);
        return $conceptoContable;
    }

    public function ObtenerParametrosFlujoContable() {
        $conceptoContable = $this->definicionConceptosModel->obtenerParametrosFlujosConceptosContablesModel();
        return $conceptoContable;
    }

    // </editor-fold>
    // </editor-fold>
}

?>