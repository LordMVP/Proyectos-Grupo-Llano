<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\ConstructorasModel;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\AprobacionVentaModel;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de los recaudos.
 * @author hrey
 */
class ConstructoraDelegado {

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\ConstructorasModel 
     */
    private $constructuraModel;

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var  \Llanogas\LlanogasBundle\Models\AprobacionVentaModel
     */
    private $aprobacionVentaModel;

    /**
     *
     * @var SuscripcionesDelegado 
     */
    private $suscripcionesDelegado;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->sesion = $sesion;
        $this->conexion = Util::getConexion($control);
        $this->constructuraModel = new ConstructorasModel($this->conexion, $this->sesion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->suscripcionesDelegado = new SuscripcionesDelegado($control, $sesion);
        $this->aprobacionVentaModel = new AprobacionVentaModel($this->conexion, $this->sesion);
    }

    public function consultarMunicipios($Parametros) {
        if (empty($Parametros['nombreMunicipio'])) {
            throw new MyException('No se han enviado valores para la Busqueda del Municipio', 0);
        }
        $resultadoQuery = $this->constructuraModel->consultarMunicipios($Parametros);
        if (empty($resultadoQuery)) {
            throw new MyException('No hay datos', 0);
        }
        return $resultadoQuery;
    }

    public function consultarBarrios($parametros) {

        if (empty($parametros['idMunicipio'])) {
            throw new MyException('No se ha seleccionado Municipio', -1);
        }
        if (empty($parametros['nombreBarrio'])) {
            throw new MyException('No se han enviado valores para la Busqueda del Barrio', -1);
        }
        $resultadoQuery = $this->constructuraModel->consultarBarrios($parametros);

        if (empty($resultadoQuery)) {
            throw new MyException('No hay datos', 0);
        }
        return $resultadoQuery;
    }

    public function consultarTercerosClase($nombre) {
        return $this->genericoModel->consultarTercero($nombre, UNIDAD_TERCEROS_CONSTRUCTORAS);
    }

    public function consultarContactos($parametros) {

        if (empty($parametros)) {
            throw new MyException('No hay Parametros de Entrada', 0);
        }
        $resultadoQuery = $this->constructuraModel->consultarContactos($parametros);
        return $resultadoQuery;
    }

    public function consultarContratos($parametros) {
        if (empty($parametros)) {
            throw new MyException('No hay Parametros de Entrada', 0);
        }
        
        $parametros['idusuario'] = $this->sesion->get('idusuario');
        $parametros['empresa'] = $this->sesion->get('idempresa');
        
        $resultadoQuery = $this->constructuraModel->consultarContratos($parametros);
        return ($resultadoQuery);
    }

    public function consultarPolizas($parametros) {
        if (empty($parametros)) {
            throw new MyException('No hay Parametros de Entrada para Consultar Polizas', 0);
        }
        $resultadoQuery = $this->constructuraModel->consultaInformacionContratoPolizas($parametros);
        return ($resultadoQuery);
    }

    public function consultarServiciosContratados($parametros) {
        if (empty($parametros)) {
            throw new MyException('No hay Parametros de Entrada para Consultar Servicios Contratados', 0);
        }
        $resultadoQuery = $this->constructuraModel->consultaInformacionContratoServiciosContratados($parametros);
        return ($resultadoQuery);
    }
    
    public function consultarDetalleDistribucionPago($parametros){
        if (empty($parametros)) {
            throw new MyException('No hay Parametros de Entrada para Consultar Servicios Contratados', 0);
        }
        $resultadoQuery = $this->constructuraModel->getDetalleDistribucionPago($parametros);
        return ($resultadoQuery);
    }

    public function consultarArchivos($parametros) {
        if (empty($parametros)) {
            throw new MyException('No hay Parametros de Entrada para Consultar Archivos', 0);
        }
        $archivos = $this->constructuraModel->consultarArchivos($parametros);
        return ($archivos);
    }

    public function editarContrato($parametros, $detalleTransaccion) {

        //print_r($parametros) ;
        if (empty($parametros) or empty($detalleTransaccion)) {
            throw new MyException('No hay Parametros de Entrada', 0);
        }

        if (!is_numeric($parametros['vlrAntesIva'])) {
            throw new MyException('Valor Proyecto Antes de Iva debe ser Numérico', 0);
        }
        if (!is_numeric($parametros['vlrIva'])) {
            throw new MyException('Valor Iva debe ser Numérico', 0);
        }
        /*if (!is_numeric($parametros['vlrAnticipo'])) { // cae en la tabla de pagos
            throw new MyException('Valor Anticipo debe ser Numérico', 0);
        }*/
        $parametros['idusuario'] = $this->sesion->get('idusuario');
        $resultadoQuery = $this->constructuraModel->editarContrato($parametros, $detalleTransaccion);
        return($resultadoQuery);
    }

    public function editarContacto($parametros, $detalleTransaccion) {
        if (empty($parametros) or empty($detalleTransaccion)) {
            throw new MyException('No hay Parametros de Entrada', 0);
        }
        $parametros['usu_ideregistro'] = $this->sesion->get('idusuario');
        $resultadoQuery = $this->constructuraModel->editarContacto($parametros, $detalleTransaccion);
        return($resultadoQuery);
    }

    public function editarDetallePagoContrato($idContrato, $detalleTransaccion, $parametros){
        
        if (!is_numeric($parametros[0]['porcentajePago'])) {
            throw new MyException('Valor Anticipo debe ser Numérico', 0);
        }
        
        $this->constructuraModel->editarDetallePagoContrato($idContrato, $detalleTransaccion, $parametros);
    }


    public function eliminarContacto($datos_elminar, $idContrato) {
        if (empty($datos_elminar) or empty($idContrato)) {
            throw new MyException('No hay Parametros de Entrada para eliminar contactos', 0);
        }
        $resultadoQuery = $this->constructuraModel->eliminarContacto($datos_elminar, $idContrato);
        return($resultadoQuery);
    }

    public function consultarTerceroAseguradora($empresa, $AseguradoraNombre) {
        if (empty($empresa)) {
            throw new MyException('No hay Empresa Seleccionada', 0);
        }
        $resultadoQuery = $this->constructuraModel->consultarTerceroAseguradora($empresa, $AseguradoraNombre);
        return($resultadoQuery);
    }

    public function ConsultarTerceroSuscriptor($ideRegistro) {
        if (empty($ideRegistro)) {
            throw new MyException('No hay Tercero Seleccionado', 0);
        }
        $resultadoQuery = $this->constructuraModel->consultarSuscriptoresTercero($ideRegistro);
        return($resultadoQuery);
    }

    public function ConsultarSuscripcionesSuscriptor($parametros) {
        if (empty($parametros['IdeSuscriptor'])) {
            throw new MyException('No hay parametros ingresados para consultar Suscripciones', 0);
        }
        $resultadoQuery = $this->constructuraModel->ConsultarSuscripcionesSuscriptor($parametros);
        return($resultadoQuery);
    }

    public function AutoCompletarLiquidacion($liquidacion, $tipoUso, $clasifiLiq) {
        if (empty($liquidacion)) {
            throw new MyException('No hay parametros Ingresados para consultar Liquidaciones', 0);
        }
        $resultadoQuery = $this->constructuraModel->autocompletarLiquidacion($liquidacion, $tipoUso, $clasifiLiq);
        if (empty($resultadoQuery)) {
            throw new MyException("No hay liquidaciones que conindan con parámetros de busqueda", -1);
        }
        return($resultadoQuery);
    }

    public function ConsultaMetodoConstructivo() {
        $resultadoQuery = $this->constructuraModel->ConsultaMetodoConstructivo();
        return($resultadoQuery);
    }

    public function ConsultaAgenda($datos) {
        if (empty($datos)) {
            throw new MyException('No hay parametros Ingresados para consultar Agendas', 0);
        }
        $resultadoQuery = $this->constructuraModel->ConsultaAgenda($datos);
        return($resultadoQuery);
    }

    public function ConsultaCamposAdicionalesServicios($datos) {
        if (empty($datos)) {
            throw new MyException('No hay parametros Ingresados para consultar Servicios Adicionales', 0);
        }
        $resultadoQuery = $this->constructuraModel->ConsultaCamposAdicionalesServicios($datos);
        return($resultadoQuery);
    }

    public function ConsultaConceptosLiquidacion($datos) {
        if (empty($datos)) {
            throw new MyException('No hay parametros Ingresados para consultar Conceptos de liquidacion', 0);
        }
        $resultadoQuery = $this->constructuraModel->ConsultaConceptosLiquidacion($datos);
        return($resultadoQuery);
    }

    public function EditarPolizas($datos) {
        
        foreach ($datos['polizas'] as $polizas) {
            $polizas['idContrato'] = $datos['idContrato'];
            $polizas['usuario'] = $this->sesion->get('idusuario');
            if (empty($polizas['pco_ideregistro'])) {
                $polizas['transaccion'] = 'insert';
            } else {
                $polizas['transaccion'] = 'update';
            }
            $resultadoquery = $this->constructuraModel->editarPolizas($polizas);
            if ($resultadoquery === 0 || empty($resultadoquery)) {
                throw new MyException('Error procesando Poliza :' + $polizas['transaccion'], -1);
            }
            //return($resultadoquery);
        }
    }

    public function EliminarPolizas($Datos) {
        if (empty($Datos)) {
            throw new MyException('No hay parametros Ingresados para consultar Conceptos de liquidacion', 0);
        }
        foreach ($Datos as $polizaEliminar) {
            $resultadoEliminacion = $this->constructuraModel->eliminarPolizas($polizaEliminar);
        }
    }

    public function ELiminarSuscripcionesRelacionadas($datos) {
        if (empty($datos)) {
            throw new MyException('No hay parametros Ingresados para Eliminar Suscripciones Relacionadas', 0);
        }
        try {
            foreach ($datos as $SuscripcionEliminar) {
                $this->constructuraModel->eliminarSuscripcionesRelacionadas($SuscripcionEliminar);
            }
        } catch (\Exception $ex) {
            throw new MyException("Error Eliminando Información de Servicio Contratado" . $ex, -1);
        }
    }

    public function ELiminarServiciosContratados($datos) {
        if (empty($datos)) {
            throw new MyException('No hay parametros Ingresados para Eliminar servicios Contratados', 0);
        }
        try {
            foreach ($datos as $ServicioEliminar) {
                $this->constructuraModel->eliminarInformacionServiciosContratados($ServicioEliminar);
            }
        } catch (\Exception $ex) {
            throw new MyException("Error Eliminando Información de Servicio Contratado" . $ex, -1);
        }
    }

    public function EditarServiciosContratados($datos) {
        if (empty($datos)) {
            throw new MyException('No hay parametros Ingresados para Registrar Informacion de Detalle', 0);
        }
        /*
         * Insersión de Servicios Contratados
         */
        foreach ($datos['servicios'] as $servicios) {

            $servicios['idContrato'] = $datos['idContrato'];
            $servicios['usuario'] = $this->sesion->get('idusuario');
            if (empty($servicios['uco_ideregistro'])) {
                $servicios['transaccion'] = 'insert';
            } else {
                $idServicioContratado = $servicios['uco_ideregistro'];
                $servicios['transaccion'] = 'update';
            }
            $idServicioContratado = $this->constructuraModel->EditarServiciosContratados($servicios);

            /*
             * Insersion Detalle Suscripciones Servicios Contratados
             */
            if (!empty($servicios['suscripciones'])) {
                foreach ($servicios['suscripciones'] as $suscripciones) {
                    $suscripciones['idContrato'] = $datos['idContrato'];
                    $suscripciones['idServicio'] = $idServicioContratado;
                    $suscripciones['usuario'] = $this->sesion->get('idusuario');
                    if (empty($suscripciones['sco_ideregistro'])) {
                        $suscripciones['transaccion'] = 'insert';
                    } else {
                        $suscripciones['transaccion'] = 'update';
                    }
                    $this->constructuraModel->EditarServiciosContratadosSuscripciones($suscripciones);
                }
            }
            /*
             * Insersion Detalle Conceptos Servicios Contratados 
             */
            if (!empty($servicios['conceptos'])) {
                foreach ($servicios['conceptos'] as $conceptos) {
                    if ($conceptos['peso'] >= 0 and $conceptos['peso'] <= 100) {
                        $conceptos['idServicio'] = $idServicioContratado;
                        $conceptos['usuario'] = $this->sesion->get('idusuario');
                        if (empty($conceptos['src_ideregistro'])) {
                            $conceptos['transaccion'] = 'insert';
                        } else {
                            $conceptos['transaccion'] = 'update';
                        }
                        $this->constructuraModel->EditarServiciosContratadosConceptos($conceptos);
                    }
                }
            }
            /*
             *  Insersión Detalle Información Adicional Servicios Contratados 
             */
            if (!empty($servicios['informacionAdicional'])) {
                $listaInformacionAdicional = array();
                foreach ($servicios['informacionAdicional'] as $informacionAdicional) {
                    $informacionAdicional['uco_ideregistro'] = $idServicioContratado;
                    $informacionAdicional['Estado'] = 'A';
                    $informacionAdicional['grupo'] = 1;
                    $listaInformacionAdicional[] = $informacionAdicional;
                    $modifica = $this->constructuraModel->ActualizaServiciosContratadosInformacionAdicional($informacionAdicional);
                    //print_r($modifica);
                    if ($modifica === 0) {
                        $this->constructuraModel->InsertaServiciosContratadosInformacionAdicional($informacionAdicional);
                    }
                }
            }
            if (!empty($listaInformacionAdicional)) {
                $this->constructuraModel->DepurarServiciosContratadosInformacionAdicional($listaInformacionAdicional, $idServicioContratado);
            }
        }
    }

    public function subirarchivo($request) {
        $this->conexion->beginTransaction();
        if (empty($request)) {
            throw new MyException("No hay archivos para Cargar ", -1);
        }
        try {
            $idUsuario = $this->sesion->get('idusuario');
            $modulo = 'Constructoras';
            $infoArchivo = Util::subirAdjunto($request, $idUsuario, $modulo);
            $resultadoTransaccion = $this->insertarAdjunto($infoArchivo);
            $this->conexion->commit();
            return $resultadoTransaccion;
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException('Error al adjuntar el archivo' . $ex->getMessage(), -1);
        }
    }

    private function insertarAdjunto(array $listaArchivos) {
        if (empty($listaArchivos)) {
            throw new MyException("No hay Archivos Adjuntos ", -1);
        }
        $Archivos = array();
        foreach ($listaArchivos as $Archivo) {
            $Archivo['tipoarchivo'] = 'pdf';
            $resultadoTransaccion = $this->constructuraModel->insertarAdjuntoConstructoras($Archivo);
            $Archivos[] = $resultadoTransaccion;
        }
        return $Archivos;
    }

    public function editarArchivos($listaArchivos) {
        if (empty($listaArchivos)) {
            throw new MyException("No hay Archivos Adjuntos ", -1);
        }
        foreach ($listaArchivos['archivos'] as $Archivo) {
            $Archivo['idContrato'] = $listaArchivos['idContrato'];
            $resultadoTransaccion = $this->constructuraModel->relacionarAdjuntoConstructoras($Archivo);
        }
    }

    public function eliminarArchivoAdjunto($idarchivo) {
        try {
            $archivo = $this->constructuraModel->obtenerAdjunto($idarchivo);
            if (file_exists($archivo['rutaarchivo'])) {
                unlink($archivo['rutaarchivo']);
            }

            $this->constructuraModel->eliminarAdjuntos($idarchivo);
        } catch (\Exception $e) {
            throw new MyException('Error al eliminar el archivo' . $e, -1);
        }
    }

    public function consultaContratosActivos() {
        
    }

    public function procesarAgendas($parametros) {
        $this->conexion->beginTransaction();
        $CantidadAgendas = 0;
        try {
            $contratos = $this->constructuraModel->ObtenerContratos($this->sesion->get('idempresa'), 'A', $parametros['contrato']);

            foreach ($contratos as $contrato) {
                $ServiciosContratadosAgendas = $this->constructuraModel->ObtenerAgendas($this->sesion->get('idempresa'), 'A', $contrato['idcontrato'], $contrato['idcontrato']); //                print_r($ServiciosContratadosAgendas);
                if (empty($ServiciosContratadosAgendas))
                    throw new MyException("No hay servicios Contratados Vinculados a esta Constructora para Generar Agendas ", -1);

                foreach ($ServiciosContratadosAgendas as $agenda) {
                    $cliente = $this->registrarCliente($agenda);
                    $this->registrarVenta($cliente);
                    $CantidadAgendas += 1;
                }
                $this->constructuraModel->ActualizarEstadoContrato($contrato['idcontrato'], 'T');
            }
        } catch (\Exception $e) {
            $this->conexion->rollBack();
            throw new MyException("Error Procesando Agendas " . $e->getMessage(), -1);
        }
        $this->conexion->commit();
        return $CantidadAgendas;
    }

    private function concatenarInformacionAdicional($ServicioContratado, $liquidacion) {
        $informacionadicional = $this->constructuraModel->getServiciosContratadosInformacionAdicional($ServicioContratado, $liquidacion);
        $resultadoConcatenacion = "";
        if (!empty($informacionadicional)) {

            foreach ($informacionadicional as $campos) {
                $resultadoConcatenacion .= $campos['nombre'] . ":" . $campos['informacion'] . " ";
            }
        }
        return $resultadoConcatenacion;
    }

    private function registrarCliente($agenda) {
        $suscripcion = array();
        $infoSuscripcion = array();
        $suscripcion['idsuscripcion'] = $agenda['idsuscripcion'];
        $suscripcion['idempresa'] = $this->sesion->get('idempresa');
        $detalleSuscripcion = $this->suscripcionesDelegado->getDetalleSuscripcion($agenda['idsuscripcion']);
        $barrio = $this->constructuraModel->getBarrio($detalleSuscripcion['propiedad']['idbarrio']);
        $infoSuscripcion = $this->genericoModel->getSuscripcion($suscripcion, $this->sesion->get('idusuario'));

        $cliente['cliente_fecven'] = $agenda['fecha'];
        $cliente['cliente_numpag'] = $agenda['idventa'];
        $cliente['cliente_nomsus'] = $detalleSuscripcion['tercero']['nombretercero'];
        $cliente['cliente_dirsus'] = $detalleSuscripcion['propiedad']['direccion'];
        $cliente['cliente_telsus'] = $detalleSuscripcion['tercero']['telefonofijo'];
        $cliente['cliente_celsus'] = $detalleSuscripcion['tercero']['telefonocelular'];

        $cliente['cliente_obs'] = substr($this->concatenarInformacionAdicional($agenda['servicio'], $agenda['liquidacion']), 0, 49);
        $cliente['cliente_tipsus'] = 'COMPLETA';
        $cliente['cliente_codbar'] = $barrio['codigobarrio'];
        $cliente['cliente_estsus'] = $infoSuscripcion[0]['estrato'];
        $cliente['cliente_codsus'] = $infoSuscripcion[0]['codigoanterior'];
        $cliente['cliente_est'] = $this->constructuraModel->getCodigoServicio($agenda['codigoagenda'], $agenda['idsuscripcion'], $this->sesion->get('idempresa'));

        $cliente['cliente_fecvis'] = null;

        $cliente['cliente_codage'] = substr($agenda['agendaalias'], 1, 2);
        // ojo estaba con valor null
        $cliente['cliente_rep'] = 'f';
        $cliente['cliente_codemp'] = $this->constructuraModel->getCodigoEmpresa($this->sesion->get('idempresa'));
        $cliente['cliente_tipins'] = $this->aprobacionVentaModel->getTipoinscripcion($agenda['idsuscripcion']);
        $cliente['cliente_fecgra'] = 'now()';
        $cliente['cliente_usugra'] = $this->constructuraModel->getCodigoUsuario($this->sesion->get('idusuario'));
        $cliente['cliente_swtgen'] = 'f';
        $cliente['cliente_nummed'] = null;
        $cliente['cliente_estfac'] = null;
        $cliente['cliente_nomven'] = null;
        $cliente['cliente_swtala'] = 'f';
        $cliente['cliente_llacom'] = $infoSuscripcion[0]['codigoanterior'] .''.$cliente['cliente_codemp'];
        $cliente['cliente_nit'] = $detalleSuscripcion['tercero']['cedula'];
        
        $existecliente = $this->constructuraModel->getClienteTecsoft($cliente['cliente_codsus'], $this->sesion->get('idempresa'));
        if ($existecliente == 0) {
            $this->constructuraModel->insertar($cliente, 'clientes', NULL);
        } else {
            $condicion = " cliente_llacom ='" . $cliente['cliente_llacom'] . "'";
            $this->constructuraModel->actualizar($cliente, 'clientes', $condicion);
        }
        $cliente['cliente_aliasagenda'] = $agenda['codigoagenda'];
        $cliente['idproyecto'] = $agenda['idproyecto'];
        $cliente['venta_cue'] = isset($agenda['proyseven']) ? $agenda['proyseven'] :null ;
        return $cliente;
    }

    public function registrarVenta($cliente) {
        $infoVenta['venta_fecven'] = $cliente['cliente_fecven'];
        $infoVenta['venta_numpag'] = $cliente['cliente_numpag'];
        $infoVenta['venta_codsus'] = $cliente['cliente_codsus'];
        $infoVenta['venta_obs'] = $cliente['cliente_obs'];
        $infoVenta['venta_tipins'] = $cliente['cliente_tipins'];
        $infoVenta['venta_estsus'] = $cliente['cliente_estsus'];
        $infoVenta['venta_est'] = null;
        $infoVenta['venta_fecvis'] = null;
        $infoVenta['venta_aliage'] = $cliente['cliente_aliasagenda'];
        $infoVenta['venta_tipsus'] = null;
        $infoVenta['venta_rep'] = 0;
        $infoVenta['venta_codemp'] = $cliente['cliente_codemp'];
        $infoVenta['venta_fecgra'] = 'now()';
        $infoVenta['venta_usugra'] = $cliente['cliente_usugra'];
        $infoVenta['venta_empcon'] = null;
        $infoVenta['venta_usuact'] = null;
        $infoVenta['venta_fecact'] = null;
        $infoVenta['venta_ordtra'] = null;
        $infoVenta['venta_swteje'] = 'f';
        $infoVenta['venta_swtala'] = 'f';
        $infoVenta['venta_llacom'] = $cliente['cliente_llacom'];
        $infoVenta['venta_gco'] = $cliente['idproyecto'];
        $infoVenta['venta_cue'] = $cliente['venta_cue'];
        $existe_venta = $this->constructuraModel->getVentaTecsoft($cliente['cliente_codsus'], $this->sesion->get('idempresa'));

        if ($existe_venta == 0) {
            $this->constructuraModel->insertar($infoVenta, 'ventas', NULL);
        } else {
            $condicion = " venta_llacom ='" . $cliente['cliente_llacom'] . "'";
            $this->constructuraModel->actualizar($infoVenta, 'ventas', $condicion);
        }
    }
    
    
    public function autualizaInformacionContactos($contactos){
        if(empty($contactos)){
            return;
        }
        foreach ($contactos as $dataContactos){
            $resultado = $this->constructuraModel->buscaContacto($dataContactos['idContacto']);
            if($resultado > 0){
                $this->constructuraModel->actualizaContacto($dataContactos);
            }
        }
    }
    
    public function actualizaInformacionArchivos($archivos, $idContrato){
        if(empty($archivos)){
            return;
        }
        foreach ($archivos as $dataArchivos){
            $resultado = $this->constructuraModel->buscarArchivo($dataArchivos['idarchivo']);
            if($resultado > 0){
                $this->constructuraModel->actualizarArchivo($dataArchivos, $idContrato);
            }
        }
    }
    
    public function actualizaInformacionPolizas($polizas, $idContrato){
        if(empty($polizas)){
            return;
        }        
        $dataPolizas['idContrato'] = $idContrato;
        $dataPolizas['polizas']= $polizas;
        $this->EditarPolizas($dataPolizas);           
    }
    
    public function actualizaInformacionContratos($contratos, $idContrato){
        if(empty($contratos)){
            return;
        }
            $resultado = $this->constructuraModel->buscarContratos($idContrato);
            if($resultado > 0){
                $this->constructuraModel->actualizarContratos($contratos, $idContrato);
            }
    }
    
    public function consultarProyectosPadre($idTercero) {
        try {
            $proyectosPadre = $this->constructuraModel->consultarProyectosPadre($idTercero, $this->sesion->get('idempresa'), 'T');

        } catch (\Exception $e) {
            throw new MyException("Error Buscando Proyectos Padre" . $e->getMessage(), -1);
        }
        return $proyectosPadre;
    }
    
    
    public function consultarVenLiqClasificProyecto($parametros) {
        try {
            $venLiqClasific = $this->constructuraModel->consultarVenLiqClasificaProyecto($parametros);

        } catch (\Exception $e) {
            throw new MyException("Error Consultando EL VenClaific Del Proyecto " . $e->getMessage(), -1);
        }
        return $venLiqClasific;
    }
    
    
}
