<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\SuscripcionesModel;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\SevenModel;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de los recaudos.
 * @author hrey
 */
class SuscripcionesDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\SuscripcionesModel 
     */
    private $suscripcionesModel;

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
     * @var sevenModel 
     */
    private $sevenModel;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface &$sesion, &$conexion = null) {
        $this->conexion = $conexion;
        if (empty($this->conexion)) {
            $this->conexion = Util::getConexion($control);
        }
        $this->suscripcionesModel = new SuscripcionesModel($this->conexion, $sesion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $sesion;
        $this->sevenModel = new SevenModel();
    }

    public function filtrarSusriptor($idSuscriptor, $cedula, $idTercero) {
        if (!is_numeric($idSuscriptor) && !is_numeric($idTercero) && empty($cedula)) {
            throw new MyException('Error, debe diligenciar al menos un campo ', -1);
        }
        return $this->suscripcionesModel->filtrarSuscriptor($idSuscriptor, $cedula, $idTercero, $this->sesion->get('idusuario'));
    }

    public function getPropiedad($idTercero) {
        $propiedades = array();
        if (!is_numeric($idTercero)) {
            throw new MyException('Error, debe seleccionar un tercero', -1);
        }
        $idUsuario = $this->sesion->get('idusuario');
        $idEmpresa = $this->sesion->get('idempresa');
        $propiedades['asignadas'] = $this->suscripcionesModel->getPropiedadesAsignadas($idTercero, $idUsuario, $idEmpresa);
        $propiedades['sinasignar'] = $this->suscripcionesModel->getPropiedadesSinAsignar($idTercero, $idUsuario, $idEmpresa);
        return $propiedades;
    }

    public function getTiposSuscripcion($idConvenio, $idMunicipio) {
        if (!is_numeric($idConvenio) || !is_numeric($idMunicipio)) {
            throw new MyException('Error, debe seleccionar el convenio y el municipio', -1);
        }
        $listaTiposSuscripcion = $this->suscripcionesModel->getTiposSuscripcion($this->sesion->get('idempresa'), $idConvenio, $idMunicipio);
        if (empty($listaTiposSuscripcion)) {
            throw new MyException('No se encontraron registros', 0);
        }
        return $listaTiposSuscripcion;
    }

    public function getTiposUsoSuscripcion($idTipoSuscripcion) {
        if (!is_numeric($idTipoSuscripcion)) {
            throw new MyException('Error, debe seleccionar un ciclo', -1);
        }
        $listaTipoUso = $this->suscripcionesModel->getTiposUsoSuscripcion($this->sesion->get('idempresa'), $idTipoSuscripcion);
        if (empty($listaTipoUso)) {
            throw new MyException('No hay registros de tipos de uso', 0);
        }
        return $listaTipoUso;
    }

    public function getTiposUsoPorCiclo($idCiclo) {
        if (!is_numeric($idCiclo)) {
            throw new MyException('Error, debe seleccionar un ciclo', -1);
        }
        $listaTipoUso = $this->suscripcionesModel->getTipoUsoPorCiclo($this->sesion->get('idempresa'), $idCiclo);
        if (empty($listaTipoUso)) {
            throw new MyException('No hay registros de tipos de uso', 0);
        }
        return $listaTipoUso;
    }

    public function getLiquidaciones($idTipoUsoSuscripcion, $idCiclo, $idMunicipio) {
        if (!is_numeric($idCiclo) || !is_numeric($idTipoUsoSuscripcion)) {
            throw new MyException('Error, debe seleccionar un ciclo y un tipo de uso', -1);
        }
        $listaLiquidaciones = $this->suscripcionesModel->getLiquidaciones($idTipoUsoSuscripcion, $idCiclo, $idMunicipio);
        if (empty($listaLiquidaciones)) {
            throw new MyException('No se encontraron liquidaciones', 0);
        }
        return $listaLiquidaciones;
    }

    public function getTerceros($nombre) {
        $listaTerceros = $this->suscripcionesModel->getTerceros($nombre);
        if (empty($listaTerceros)) {
            throw new MyException('No se encontraron registros', 0);
        }
        return $listaTerceros;
    }

    public function getRutaCiclo($idMunicipio, $idBarrio) {
        $listaRutas = $this->suscripcionesModel->getRutaSuscripcion($idMunicipio, $idBarrio);
        if (empty($listaRutas)) {
            $listaRutas = $this->suscripcionesModel->getRutaBarrio($idMunicipio, $idBarrio);
        }
        if (empty($listaRutas)) {
            throw new MyException('Error, El barrio no tienen asiganada ninguna ruta.', -1);
        }
        $ruta = $listaRutas[0];
        $respuesta['ruta'] = $ruta;
        $ciclo = $this->suscripcionesModel->getCicloPorRuta($ruta['idruta']);
        if (empty($ciclo)) {
            throw new MyException('Error, La ruta no tiene  un ciclo', -1);
        }
        $respuesta['ciclo'] = $ciclo[0];
        return $respuesta;
    }

    public function getConceptos($idLiquidacion, $idPrograma, $idSuscripcion) {
        $listaConceptos = $this->suscripcionesModel->getConceptos($idLiquidacion, $idPrograma, $idSuscripcion);
        if (empty($listaConceptos)) {
            throw new MyException('Error, La liquidación no tiene conceptos asociados', 0);
        }
        foreach ($listaConceptos as $concepto) {
            if ($concepto['tiporegistro'] === 'C' && $concepto['valor'] === NULL) {
                throw new MyException('Error, La configuración del concepto ' . $concepto['idconcepto'], -3);
            }
        }
        return $listaConceptos;
    }

    public function getInfoConcepto($idConcepto) {
        $concepto = $this->suscripcionesModel->getInfoConceptos($idConcepto);
        if (empty($concepto)) {
            throw new MyException('No se encontraron registros', 0);
        }
        return $concepto;
    }

    public function nuevaSuscripcion($datos) {
        try {
            $this->conexion->beginTransaction();
            $suscripcion = $datos['suscripcion'];
            $conceptos = (isset($datos['conceptos'])) ? $datos['conceptos'] : null;
            $ruta = $datos['ruta'];
            $unidadTipoSuscripcion = $this->genericoModel->consultarEstructuraPorIdUnidad($suscripcion['idtiposuscripcion']);
            $suscripcion['idestructuratiposuscripcion'] = $unidadTipoSuscripcion['idestructura'];
            $unidadUsoSuscripcion = $this->genericoModel->consultarEstructuraPorIdUnidad($suscripcion['idtipousosuscripcion']);
            $suscripcion['idestructuratipousosuscripcion'] = $unidadUsoSuscripcion['idestructura'];
            $unidadLiquidacion = $this->genericoModel->consultarEstructuraPorIdUnidad($suscripcion['idliquidacion']);
            $suscripcion['idestructuraliquidacion'] = $unidadLiquidacion['idestructura'];
            $suscripcion['idempresa'] = $this->sesion->get('idempresa');
            $suscripcion['idusuario'] = $this->sesion->get('idusuario');
            if (empty($suscripcion['idciclo'])) {
                throw new MyException('Error debe seleccionar un ciclo', -1);
            }
            /*
             * Validar si la propiedad seleccionada no haya sido relacionada por Suscripción de manera concurrente 
             */
            $validaPropiedadSuscripcion = $this->suscripcionesModel->validarPropiedadSuscripcion($suscripcion['idpropiedad'], $suscripcion['idempresa']);
            if (!empty($validaPropiedadSuscripcion['idsuscripcion'])) {
                throw new MyException('La propiedad ya fue asociada a la suscripción: ' . $validaPropiedadSuscripcion['idsuscripcion'] . ' y no se puede vinculada a otra suscripción ', -1);
            }
            $idSuscripcion = $this->suscripcionesModel->nuevaSuscripcion($suscripcion);
            if (!empty($conceptos)) {
                foreach ($conceptos as $concepto) {
                    $concepto['idsuscripcion'] = $idSuscripcion;
                    $concepto['idempresa'] = $this->sesion->get('idempresa');
                    $concepto['idusuario'] = $this->sesion->get('idusuario');
                    if (empty($concepto['fechainicio'])) {
                        $concepto['fechainicio'] = 'now()';
                    }
                    $this->suscripcionesModel->nuevaSuscripcionConceptos($concepto);
                }
            }
            $ruta['idsuscripcion'] = $idSuscripcion;
            $this->suscripcionesModel->nuevaSuscripcionRuta($ruta);
            $suscripcion['idsuscripcion'] = $idSuscripcion;
            $this->setSuscripcionCodigoAnterior($suscripcion);

            $liquidacion['idsuscripcion'] = $idSuscripcion;
            $liquidacion['idliquidacion'] = $suscripcion['idliquidacion'];
            $liquidacion['idempresa'] = $this->sesion->get('idempresa');
            $liquidacion['idusuario'] = $this->sesion->get('idusuario');
            $this->suscripcionesModel->nuevaSuscripcionLiquidacion($liquidacion);




            /*
             * Mejora implementada para sincronizar las suscripciones como terceros en la aplicación de seven 
             */

            $condicion = " dsus_ideregistr = " . $idSuscripcion;
            $infoSuscripcion = $this->genericoModel->consultaInfoSuscripciones($this->sesion->get('idempresa'), $condicion);
            $genericoDelegado = new GenericoDelegado($this->conexion);
            $infoSuscripcion[0]['idempresa'] = $this->sesion->get('idempresa');
            $validaParametroSincronizaTercero = $genericoDelegado->consultarParametroSincronizacionSeven($this->sesion->get('idempresa'));
            /*
             *  Valida Parametro SINCRONIZA_TERCERO_SEVEN para la empresa en Sesión 
             */
            $linea_log = " Suscripcion " . $idSuscripcion . " Empresa: " . $this->sesion->get('idempresa') . " Parametro Sincronizacion: " . $validaParametroSincronizaTercero[0]['valor'];
            shell_exec("echo " . $linea_log . " > /var/www/html/achagua/sistema/app/logs/log_SincronizaTercero_Seven.log");
            if ($validaParametroSincronizaTercero[0]['valor'] == "TRUE") {
                shell_exec("echo Sincronización activa, inicia Sincronización con Seven >> /var/www/html/achagua/sistema/app/logs/log_SincronizaTercero_Seven.log");
                $respuestaSeven = $genericoDelegado->invocaWsTercerosSeven($infoSuscripcion[0]);
                shell_exec("echo Respuesta Seven :".$respuestaSeven['error']." Mensaje :" .$respuestaSeven['mensaje']."  >> /var/www/html/achagua/sistema/app/logs/log_SincronizaTercero_Seven.log");
                sleep(2);
                $parametros['idempresa'] = $this->sesion->get('idempresa');
                $parametros['pcodigo'] = $infoSuscripcion[0]['idempresa'] == 325 ? $infoSuscripcion[0]['documento'] : $infoSuscripcion[0]['pcodigo'];;
                $resultadoTerceroSeven = $this->sevenModel->consultaTerceroSeven($parametros);

                if(empty($resultadoTerceroSeven)){
                    throw new MyException("No se creo el tercero en Seven, Comuniquese con personal de soporte", -1);
                }
            }

            $this->conexion->commit();
            return $idSuscripcion;
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException($e->getMessage(), -1);
        }
    }

    public function getMunicipiosPorPerfil($idPrograma) {
        $idEmpresa = $this->sesion->get('idempresa');
        $idUsuario = $this->sesion->get('idusuario');
        return $this->genericoModel->consultarMunicipios('', $idEmpresa, $idUsuario, $idPrograma);
    }

    public function getBarrios($idMunicipio) {
        return $this->genericoModel->getBarrios($idMunicipio);
    }

    /**
     * 
     * @param array $parametros criterios de búsqueda
     * @param string $estado Consulta todas las suscripciones que no están en esos estados (not in ('E')),
     * si es NULL se consultan todos los estados
     * @return type
     * @throws MyException
     */
    public function getSuscripciones($parametros, $estado = null) {
        $parametros['estado'] = $estado;
        $parametros["idempresa"] = $this->sesion->get('idempresa');
        $idusuario = $this->sesion->get('idusuario');
        $listaSuscripciones = $this->genericoModel->getSuscripcion($parametros, $idusuario);
        if (empty($listaSuscripciones)) {
            throw new MyException('No se encontraron suscripciones ', 0);
        }
        return $listaSuscripciones;
    }

    public function getDetalleSuscripcion($idSuscripcion) {
        $suscripcion['tercero'] = $this->suscripcionesModel->getSuscripcionTercero($idSuscripcion);
        $suscripcion['propiedad'] = $this->suscripcionesModel->getSuscripcionPropiedad($idSuscripcion);
        $suscripcion['suscripcion'] = $this->suscripcionesModel->getSuscripcionDetalle($idSuscripcion);
        $suscripcion['conceptos'] = $this->suscripcionesModel->getSuscripcionConceptos($idSuscripcion);
        return $suscripcion;
    }

    private function setSuscripcionCodigoAnterior($suscripcion) {
        $pcodigoUnicoEncontrado = 0;
        $secuencia = 0;
        $digitosComplemento = '00';
        while ($pcodigoUnicoEncontrado === 0 && $secuencia <= 99) {
            $digitosComplemento = $secuencia;
            if ($secuencia < 10) {
                $digitosComplemento = '0' . $secuencia;
            }
            $nuevoPcodigo = $this->suscripcionesModel->calcularNuevoPcodigo($suscripcion['idsuscripcion'], $suscripcion['idbarrio'], $digitosComplemento);
            $pcodigoUnicoEncontrado = $this->suscripcionesModel->validaNuevoPcodigo($nuevoPcodigo);
            if ($pcodigoUnicoEncontrado === 1) {
                $this->suscripcionesModel->setSuscripcionCodigoAnteriorFormulado($suscripcion['idsuscripcion'], $nuevoPcodigo);
                return;
            }
            $secuencia += 1;
        }
        throw new MyException('No se logró otener un nuevo Codigo Anterior para la suscripción: ' . $suscripcion . ' codigo Anterior:' . $nuevoPcodigo, -1);
    }

    public function getConceptosSuscripcion($idSuscripcion) {
        $listaConceptos = $this->suscripcionesModel->getConceptosSuscripcion($idSuscripcion);
        if (empty($listaConceptos)) {
            throw new MyException('No se encontraron conceptos asociados', 0);
        }
        return $listaConceptos;
    }

    public function getCiclos($idRuta, $idCiclo) {
        $resultado = $this->suscripcionesModel->getCiclos($this->sesion->get('idempresa'), $idCiclo, $idRuta);
        if (empty($resultado)) {
            throw new MyException('No se encontraron ciclos para la suscripción', -1);
        }
        return $resultado;
    }

    public function modificarSuscripcion($datos) {
        if (!isset($datos['suscripcion']['idsuscripcion'])) {
            throw new MyException('Debe seleccionar una suscripción', - 1);
        }
        try {
            $this->conexion->beginTransaction();
            $this->validarEstado($datos);
            $this->setSecuenciaCliente($datos);
            $this->suscripcionesModel->eliminarSuscripcionConceptos($datos['suscripcion']['idsuscripcion'], $this->getIdsConceptos($datos));
            $datos['suscripcion']['idusuario'] = $this->sesion->get('idusuario');
            $this->suscripcionesModel->actualizarSuscripcion($datos['suscripcion']);
            if (isset($datos['conceptos'])) {
                $this->registrarConceptos($datos);
            }
            /*
             * Se incluye mejora para actualizar información(Estrato y tipo de uso) de la suscripción en Clientes y Ventas de Tecsoft
             */
            $this->suscripcionesModel->actualizarInformacionClientesTecsoft($datos['suscripcion']['idsuscripcion']);
            $this->suscripcionesModel->actualizarInformacionVentasTecsoft($datos['suscripcion']['idsuscripcion']);
            $this->conexion->commit();
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException($e->getMessage(), -1);
        }
    }

    private function getIdsConceptos(array $datos) {
        if (!isset($datos['conceptos'])) {
            return '-1';
        }
        $ids = '';
        $listaConceptos = $datos['conceptos'];
        foreach ($listaConceptos as $concepto) {
            $ids .= $concepto['idconcepto'] . ',';
        }
        $ids .= '-1';
        return $ids;
    }

    private function validarEstado($datos) {
        $infoSuscripcionActual = $this->suscripcionesModel->getSuscripcionDetalle($datos['suscripcion']['idsuscripcion']);
        if ($infoSuscripcionActual['estado'] === $datos['suscripcion']['estado']) {
            return;
        }
        if ($infoSuscripcionActual['estado'] != 'P' && $datos['suscripcion']['estado'] == 'P') {
            throw new MyException('No se puede modificar el estado de la suscripción a pendiente', -1);
        }
        if ( $datos['suscripcion']['estado'] === 'R' || $datos['suscripcion']['estado'] === 'U') {
            $numeroDocumentosConSaldo = $this->suscripcionesModel->contarDocumentosConSaldo($datos['suscripcion']['idsuscripcion']);
            if ($numeroDocumentosConSaldo > 0) {
                throw new MyException('La suscripción tiene documentos con saldo (Recaudos,Facturas,Financiaciones)');
            }
        }
        if ($datos['suscripcion']['estado'] === 'E' ) {
            $numeroDocumentosConSaldo = $this->suscripcionesModel->contarDocumentosConSaldoEliminado($datos['suscripcion']['idsuscripcion']);
            if ($numeroDocumentosConSaldo > 0) {
                throw new MyException('La suscripción tiene documentos con saldo (Recaudos,Facturas,Financiaciones)');
            }
        }
        if ($datos['suscripcion']['estado'] !== 'A') {
            $numeroFactuasConSaldo = $this->suscripcionesModel->contarFacturasConSaldo($datos['suscripcion']['idsuscripcion']);
            if ($numeroFactuasConSaldo > 0) {
                throw new MyException('Error, No se puede actualizar el estado de la suscripción porque tiene facturas con saldo', -1);
            }
        }
        if ($datos['suscripcion']['estado'] == 'A') {
            $cantidad = $this->suscripcionesModel->consultarLecturaActual($datos['suscripcion']['idsuscripcion']);
            if ($cantidad == 0) {
                $this->suscripcionesModel->nuevoEncabezadoLectura($this->sesion->get('idusuario'), $datos['suscripcion']['idsuscripcion']);
            }
        }
    }

    private function registrarConceptos($datos) {
        foreach ($datos['conceptos'] as $concepto) {
            if (isset($concepto['fechainicio'])) {
                $concepto['fechainicio'] = str_replace('/', '-', trim($concepto['fechainicio']));
            }
            if (isset($concepto['fechafinal'])) {
                $concepto['fechafin'] = str_replace('/', '-', trim($concepto['fechafinal']));
            }
            $concepto['idsuscripcion'] = $datos['suscripcion']['idsuscripcion'];
            $concepto['idempresa'] = $this->sesion->get('idempresa');
            $concepto['idusuario'] = $this->sesion->get('idusuario');
            $this->suscripcionesModel->nuevaSuscripcionConceptos($concepto);
        }
    }

    /**
     * Consulta las actividades ecomonicas
     * @return type
     */
    public function getActividadEconomica() {
        $idEmpresa = $this->sesion->get('idempresa');
        $idusuario = $this->sesion->get('idusuario');
        return $this->suscripcionesModel->getActividadEconomica(CLA_ACTIVIDAD_ECONOMICA, $idEmpresa, $idusuario, PROGRAMA_SUSCRIPCIONES);
    }

    public function getRutasEmpresa() {
        $idEmpresa = $this->sesion->get('idempresa');
        return $this->suscripcionesModel->getRutasEmpresa($idEmpresa);
    }
    
    public function getPermisoLineaMatriz($idPrograma) {
        $idEmpresa = $this->sesion->get('idempresa');
        $idUsuario = $this->sesion->get('idusuario');
        $ideUnidad = 2743;
        return $this->suscripcionesModel->getPermisoLineaMatriz( $idEmpresa, $idUsuario, $idPrograma, $ideUnidad);
    }
    
    public function getClienteLineaMatriz($idSuscripcion) {
        $clienteLineaMatriz = $this->suscripcionesModel->getClienteVinculadoLineaMatriz($idSuscripcion);
        return $clienteLineaMatriz;
    }
    
    public function setRetiraClienteLineaMatriz($idSuscripcionesVinculada) {
        try{
            $this->conexion->beginTransaction();
            $idUsuario = $this->sesion->get('idusuario');
            foreach ($idSuscripcionesVinculada as $idSuscripcion){
                $idSuscripcion['idusuario'] = $idUsuario;
                $this->suscripcionesModel->setRetiraClienteMatriz($idSuscripcion);
            }
            $this->conexion->commit();
        } catch (\Exception $ex){
            $this->conexion->rollBack();
            throw new MyException("Error, No se retiró la vinculacion de la suscripcion "+ $ex->getMessage(), -1);
        }
    }
    
     public function buscaSucripcionLineaMatriz($getIdSuscripcionesVinculada) {
        try{
           $idUsuario = $this->sesion->get('idusuario');
           $idEmpresa = $this->sesion->get('idempresa');
            $getIdSuscripcionesVinculada['idusuario'] = $idUsuario;
            $getIdSuscripcionesVinculada['idempresa'] = $idEmpresa;
            $resultado =  $this->suscripcionesModel->getVinculadoLineaMatriz($getIdSuscripcionesVinculada);
            return $resultado;
        } catch (\Exception $ex){
            throw new MyException("Error, No se encontro la suscripcion"+ $ex->getMessage(), -1);
        }
    }
    
    public function validaSucripcionEstaVinculadaLineaMatriz($getIdSuscripcionesVinculada) {
        try{
            $this->conexion->beginTransaction();
           $idUsuario = $this->sesion->get('idusuario');
            $getIdSuscripcionesVinculada['idusuario'] = $idUsuario;
            $resultadoVinculacion =   $this->suscripcionesModel->validaSucripcionEstaVinculadaLineaMatriz($getIdSuscripcionesVinculada);
            if(empty($resultadoVinculacion) ){
                $this->suscripcionesModel->insertSucripcionVinculadaLineaMatriz($getIdSuscripcionesVinculada);
                $resultadoVinculacion['insert'] = 1;
            }
            $this->conexion->commit();
            return $resultadoVinculacion;
        } catch (\Exception $ex){
            $this->conexion->rollBack();
            throw new MyException("Error, No se pudo validar si la suscripcion esta vinculada a linea matriz"+ $ex->getMessage(), -1);
        }
    }
    
    private function setSecuenciaCliente($datos){
        if ( $datos['suscripcion']['estado'] === 'R' || $datos['suscripcion']['estado'] === 'U') {
            $this->suscripcionesModel->setSecuenciaCliente($datos['suscripcion']['idsuscripcion']);
        }
    }
}
