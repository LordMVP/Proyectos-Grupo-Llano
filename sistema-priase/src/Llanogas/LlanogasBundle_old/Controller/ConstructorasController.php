<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\ConstructoraDelegado;
use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Models\ConstructorasModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;

/**
 * Clase encargada de administrar las constructoras con sus respectivas Unidades Constructivas 
 */
class ConstructorasController extends Controller {

    public function indexAction() {
        /**
         * Método que renderiza la página.
         * @return html Página renderizada
         */
        $sesion = Util::iniciarSesion($this);
        $idUsuario = $sesion->get('idusuario');
        $idEmpresa= $sesion->get('idempresa');
        
        $this->conexion = ConexionBD::getConexion();        
        $genericoDelegado = new GenericoDelegado(Util::getConexion($this));
        
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa'); 
        $lisParametros['cuentas'] = $genericoDelegado->getArbCuentaSeven($idEmpresa);
        $lisParametros['clasificacion'] = $genericoDelegado->consultaClasificacionLiquidacion($idUsuario, $idEmpresa);
        
        $response = $this->render('LlanogasLlanogasBundle:Ventas:Constructora.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function consultarMunicipiosAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $constructorasDelegado = new ConstructoraDelegado($this, $sesion);
            $parametros = array();
            $parametros['nombreMunicipio'] = trim($request->get('nombreMunicipio'));
            $parametros['idempresa'] = $sesion->get('idempresa');
//            print_r($parametros);
            
            $resultadoQuery = $constructorasDelegado->consultarMunicipios($parametros);
            if (empty($resultadoQuery)) {
                $resultado = array("codigoRespuesta" => 0);
                throw new MyException('No hay datos');
            }
            $resultado = array("codigoRespuesta" => 1);
            $resultado['municipios'] = $resultadoQuery;
            $resultado['mensajeError'] = 'Consulta Exitosa';
            //  $ejemploDelegado = new EjemploDelegado($this, $sesion);
        } catch (MyException $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado["mensajeError"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function consultarBarriosAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $constructorasDelegado = new ConstructoraDelegado($this, $sesion);
            $parametros = array();
            $parametros['idMunicipio'] = $request->get('idMunicipio');
            $parametros['nombreBarrio'] = trim($request->get('nombreBarrio'));
            $parametros['idempresa'] = $sesion->get('idempresa');
            $resultadoQuery = $constructorasDelegado->consultarBarrios($parametros);
            if (empty($resultadoQuery)) {
                $resultado = array("codigoRespuesta" => 0);
                throw new MyException('No hay datos');
            }
            $resultado = array("codigoRespuesta" => 1);
            $resultado['barrios'] = $resultadoQuery;
            $resultado['mensajeError'] = 'Consulta Exitosa';
        } catch (MyException $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado["mensajeError"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function consultarContratosAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $resultado['codigoRespuesta'] = -1;
            $opcion = $request->get('opcion');
            $constructoraDelegado = new ConstructoraDelegado($this, $sesion);
            switch ($opcion) {
                case('ENC') :  //Consulta Encabezado de Contratos
                    $parametros = $this->getContratos();
                    $resultado['contratos'] = $constructoraDelegado->consultarContratos($parametros);
                    $resultado['mensajeError'] = 'Consulta de Contratos Exitosa';
                    break;
                case('DET') : // DETALLADO
                    $parametros = $request->get('idRegistro');
                    $resultado['proyecto'] = $constructoraDelegado->consultarVenLiqClasificProyecto($parametros);
                    $resultado['polizas'] = $constructoraDelegado->consultarPolizas($parametros);
                    $resultado['detDistribucionPago'] = $constructoraDelegado->consultarDetalleDistribucionPago($parametros);
                    $resultado['serviciosContratados'] = $constructoraDelegado->consultarServiciosContratados($parametros);
                    $resultado['archivos'] = $constructoraDelegado->consultarArchivos($parametros);
                    $resultado['mensajeError'] = 'Consulta Detalle de Contratos Exitosa ';
            }
            $resultado['codigoRespuesta'] = 1;
        } catch (MyException $exc) {
            $resultado["mensajeError"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function getContratos() {
        $request = $this->getRequest();
        $parametros['idContrato'] = $request->get('idContrato');
        $parametros['idMunicipio'] = $request->get('idMunicipio');
        $parametros['idBarrio'] = $request->get('idBarrio');
        $estado = $request->get('estado');
        $parametros['estado'] = ($estado == -1) ? '' : $estado;
        $parametros['fechaInicial'] = $request->get('fechaIncial');
        $parametros['fechaFinal'] = $request->get('fechaFinal');
        $parametros['idTercero'] = $request->get('idTercero');
        return($parametros);
    }

    public function consultarContactosAction() {
        try {
            $resultado['codigoRespuesta'] = -1;
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
//            $conexion = Util::getConexion($this);
            $parametros = $this->getContactos();
            $constructuraDelegado = new ConstructoraDelegado($this, $sesion);
            $resultadoContactos = $constructuraDelegado->consultarContactos($parametros);
            if (empty($resultadoContactos)) {
                $resultado = array("codigoRespuesta" => 0);
                throw new MyException('No hay datos');
            }
            $resultado = array("codigoRespuesta" => 1);
            $resultado['contactos'] = $resultadoContactos;
            $resultado['mensajeError'] = 'Consulta Exitosa Contactos';
        } catch (MyException $exc) {
            $resultado['mensajeError'] = $exc->getMessage();
            $resultado['codigoRespuesta'] = $exc->getCode();
        }
        return Util::construyeRespuesta($resultado);
    }

    private function getContactos() {
        $request = $this->getRequest();
        $parametros['idRegistro'] = $request->get('idRegistro');
        return($parametros);
    }

    public function grabarAction() {
        try {
            $request = $this->getRequest();
            $conexion = Util::getConexion($this);
            $conexion->beginTransaction();
            $resultado['codigoRespuesta'] = 1;
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $idusuario = $sesion->get('idusuario');
            $delegado = new GenericoDelegado($conexion);
            $permisosGrabar = $delegado->consultaPermisosGrabar(48, $idusuario);
            
            if(empty($permisosGrabar)){
                throw new MyException('Usuario no tiene permisos de Grabación',-1);
            }
            
            $detalleTransaccion = array();
            $polizas = array();
            $servicioscontratados = array();
            $constructorasModel = new ConstructorasModel($conexion, $sesion);
            $constructorasModel->setConexion($conexion);
            $detalleTransaccion['condicion'] = null;
            $detalleTransaccion['accion'] = null;
            $detalleTransaccion['clasifiLiq'] = $request->get('clasifiLiq');
            $detalleTransaccion['cue_ideregistro'] = $request->get('proyectoSeven');
            
            $idContrato = $request->get('contratoideregistro');
            $detalleTransaccion['idContratoActualizado'] = $idContrato;
            $idConstructora = $this->getConstructora();
            
            if ($idContrato === null or $idContrato === '') {
                $detalleTransaccion['accion'] = 'insert';
                $resultado['mensaje'] = 'Transacción Exitosa (Insersión de Contratos) Nuevo Contrato Procesado: ';
            } else {
                $detalleTransaccion['accion'] = 'update';
                $detalleTransaccion['condicion'] = ' gco_ideregistro =' . $idContrato;
                $resultado['mensaje'] = 'Transacción Exitosa (Modificación Contratos) Contrato Modificado: ';
            }
            
            $idContrato = $this->editarInformacionContraActual($detalleTransaccion, $idConstructora);
            $resultado['mensaje'] .=$idContrato;
            $this->editarInformacionContactos($idContrato);
            $parametrospolizas['polizas'] = $request->get('polizas');
            $parametrospolizas['polizaseliminar'] = $request->get('polizaseliminar');
            $parametrospolizas['idContrato'] = $idContrato;
            $parametrospolizas['accion'] = $detalleTransaccion['accion'];
            $this->EditarPolizas($parametrospolizas);
            $resultado['mensaje'].= " [Polizas]: Procesadas Correctamente ";
            $parametrosservicios['servicios'] = $request->get('servicioscontratados');
            $parametrosservicios['serviciosEliminar'] = $request->get('servicioscontratadosEliminar');
            $parametrosservicios['suscripcionesEliminar'] = $request->get('suscripcionesEliminar');
            $parametrosservicios['idContrato'] = $idContrato;
            $parametrosservicios['accion'] = $detalleTransaccion['accion'];
            $this->EditarServiciosContratados($parametrosservicios);
            $resultado['mensaje'].= " [Servicios]: Procesados Correctamente ";
            if (!empty($request->get('archivosgrabar'))) {
                $parametrosarchivos['archivos'] = $request->get('archivosgrabar');
                $parametrosarchivos['idContrato'] = $idContrato;
                $this->EditarArchivos($parametrosarchivos);
            }
            $conexion->commit();
            
        } catch (\Exception $ex) {
            
            $conexion->rollBack();
            $resultado['codigoRespuesta'] = $ex->getCode();
            $resultado['mensaje'] = $ex->getMessage();
                    
        }
        return Util::construyeRespuesta($resultado);
    }

    public function editarInformacionContraActual($detalleTransaccion, $idConstructora) {
        $request = $this->getRequest();
        $sesion = Util::iniciarSesion($this);
        $constructoraDelegado = new ConstructoraDelegado($this, $sesion);
        $parametros = $request->get('contrato');
        $parametros['idConstructora'] = $idConstructora;
        $parametros['emp_ideregistro'] = $sesion->get('idempresa');
        
        $idContrato = $constructoraDelegado->editarContrato($parametros, $detalleTransaccion);
        
        $detDistribucionPagos = $request->get("infDistribucionPago");
        $constructoraDelegado->editarDetallePagoContrato($idContrato, $detalleTransaccion, $detDistribucionPagos);
        
        return($idContrato);
    }

    private function getConstructora() {
        $request = $this->getRequest();
        if ($request->get('idConstructora') != '') {
            $idConstructora = $request->get('idConstructora');
            return ($idConstructora);
        }
        throw new MyException('No se selecciono Ninguna Constructura');
    }

    private function editarInformacionContactos($idContrato) {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $datos_elminar = array();
            $constructoraDelegado = new ConstructoraDelegado($this, $sesion);
            $resultado = array();
            if(empty($request->get('contactos')) && empty($request->get('contactoseliminar')))
            {
               throw new MyException('No hay información de Contactos a Procesar',-1); 
            }
            
            if ($request->get('contactos') != null) {
                $listaContactos = $request->get('contactos');
                $detalleTransaccion['condicion'] = null;
                $pos = 0;
                foreach ($listaContactos as $value) {
                    if ($value['idContacto'] === '' or $value['idContacto'] === null) {
                        $detalleTransaccion['accion'] = 'insert';
                    } else {
                        $detalleTransaccion['accion'] = 'update';
                        $detalleTransaccion['condicion'] = 'cco_ideregistro =' . $value['idContacto'];
                    }
                    $parametros['cco_nomcontacto'] = $value['nombreContacto'];
                    $parametros['cco_cargo'] = $value['cargoContacto'];
                    $parametros['cco_telfijo'] = $value['telefonoFijo'];
                    $parametros['cco_telcelular'] = $value['telefonoCelular'];
                    $parametros['cco_correo'] = $value['correo'];
                    $parametros['gco_ideregistro'] = $idContrato;
                    $resultado = $constructoraDelegado->editarContacto($parametros, $detalleTransaccion);
                    $pos+=1;
                }
            }
            //if (!empty($request->get('contactoseliminar'))) {
            $p = $request->get('contactoseliminar');
            if (!empty($p)) {
                $listaContactosEliminar = $request->get('contactoseliminar');
                foreach ($listaContactosEliminar as $value) {
                    $resultado = $constructoraDelegado->eliminarContacto($value['idContacto'], $idContrato);
                }
            }
        } catch (\Exception $ex) {
            throw new MyException("Error Editando Contactos". $ex->getMessage() ,-1);
        }
    }

    public function ConsultarTerceroAseguradoraAction() {
        try {
        $request = $this->getRequest();
        $resultado['codigoRespuesta'] = -1;
            $sesion = Util::iniciarSesion($this);
            $constructoraDelegado = new ConstructoraDelegado($this, $sesion);
            $AseguradoraNombre = $request->get('nombre');
            $resultado['terceros'] = $constructoraDelegado->consultarTerceroAseguradora($sesion->get('idEmpresa'), $AseguradoraNombre);
            $resultado['codigoRespuesta'] = 1;
            $resultado['mensaje'] = 'Transacción Exitosa';
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function ConsultarTerceroSuscriptorAction() {
        try {
        $request = $this->getRequest();
        $sesion = Util::iniciarSesion($this);
        Util::validarPeticion($this);
        $resultado['codigoRespuesta'] = '1';
            $constructoraDelegado = new ConstructoraDelegado($this, $sesion);
            $ideRegistro = $request->get('idTercero');
            $resultado['terceros'] = $constructoraDelegado->ConsultarTerceroSuscriptor($ideRegistro);
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function ConsultarSuscripcionesSuscriptorAction() {
        try {
        $request = $this->getRequest();
        $sesion = Util::iniciarSesion($this);
        $resultado['codigoRespuesta'] = '1';
            $constructoraDelegado = new ConstructoraDelegado($this, $sesion);
            $parametros['IdeSuscriptor'] = $request->get('ideSuscriptor');
            $parametros['suscripcionesrelacionadas'] = $request->get('suscripcionesRelacionadas');
            $resultado['suscripciones'] = $constructoraDelegado->ConsultarSuscripcionesSuscriptor($parametros);
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function ConsultarConstructorasAction() {
        $request = $this->getRequest();
        $sesion = Util::iniciarSesion($this);
        $resultado['codigoRespuesta'] = '-1';
        try {
            Util::validarPeticion($this);
            $constructoraDelegado = new ConstructoraDelegado($this, $sesion);
            $nombre = $request->get('nombre');
            $resultado['terceros'] = $constructoraDelegado->consultarTercerosClase($nombre);
            $resultado['codigoRespuesta'] = 1;
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function AutoCompletarLiquidacionAction() {
        try {
        $request = $this->getRequest();
        $sesion = Util::iniciarSesion($this);
        $resultado['codigoRespuesta'] = -1;
            Util::validarPeticion($this);
            $constructoraDelegado = new ConstructoraDelegado($this, $sesion);
            $liquidacion = $request->get('Liquidacion');
            $tipoUso = $request->get('tipoUso');
            $clasifiLiq = $request->get('clasifiLiq');
           
            $resultado['datos'] = $constructoraDelegado
                    ->AutoCompletarLiquidacion($liquidacion, $tipoUso, $clasifiLiq);
            
            $resultado['codigoRespuesta'] = 1;
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function ParametrosAdicionarServiciosAction() {
        try {
        $request = $this->getRequest();
        $sesion = Util::iniciarSesion($this);
        $resultado['codigoRespuesta'] = -1;
            Util::validarPeticion($this);
            $opcion = $request->get('opcion');
            $constructoraDelegado = new ConstructoraDelegado($this, $sesion);
            $resultado['codigoRespuesta'] = 1;
            switch ($opcion) {
                case "MCO" :
                    $resultado['datos'] = $constructoraDelegado->ConsultaMetodoConstructivo();
                    break;
                case "AGE" :
                    $parametros['liquidacion'] = $request->get('liquidacion');
                    $resultado['datos'] = $constructoraDelegado->ConsultaAgenda($parametros);
                    break;
                case "INF" :
                    $parametros['liquidacion'] = $request->get('liquidacion');
                    $resultado['datos'] = $constructoraDelegado->ConsultaCamposAdicionalesServicios($parametros);
                    if (empty($resultado['datos'])) {
                        throw new MyException("No Hay Campos Adicionales Parametrizados para Esta Liquidacion: " . $parametros['liquidacion'], -1);
                    }
                    break;
                case "CON" :
                    $parametros['liquidacion'] = $request->get('liquidacion');
                    $resultado['datos'] = $constructoraDelegado->ConsultaConceptosLiquidacion($parametros);
                    if (empty($resultado['datos'])) {
                        throw new MyException("No Hay Conceptos Relacionados  para Esta Liquidacion: " . $parametros['liquidacion'], -1);
                    }
            }
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    private function EditarPolizas($Parametros) {
        try {
        $sesion = Util::iniciarSesion($this);

            Util::validarPeticion($this);
            $constructoraDelegado = new ConstructoraDelegado($this, $sesion);
            if (!empty($Parametros['polizas'])) {
                $constructoraDelegado->EditarPolizas($Parametros);
            }
            if (!empty($Parametros['polizaseliminar'])) {
                $constructoraDelegado->EliminarPolizas($Parametros['polizaseliminar']);
            }
        } catch (\Exception $exc) {
            throw new MyException($exc->getMessage(), $exc->getCode());
        }
    }

    private function EditarServiciosContratados($Parametros) {
        try {
        $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            if (!empty($Parametros['servicios'])) {
                $constructoraDelegado = new ConstructoraDelegado($this, $sesion);
                $constructoraDelegado->EditarServiciosContratados($Parametros);
            }
            if (!empty($Parametros['serviciosEliminar'])) {
                $constructoraDelegado = new ConstructoraDelegado($this, $sesion);
                $constructoraDelegado->ELiminarServiciosContratados($Parametros['serviciosEliminar']);
            }
            if (!empty($Parametros['suscripcionesEliminar'])) {
                $constructoraDelegado = new ConstructoraDelegado($this, $sesion);
                $constructoraDelegado->ELiminarSuscripcionesRelacionadas($Parametros['suscripcionesEliminar']);
            }
        } catch (\Exception $exc) {
            throw new MyException($exc->getMessage(), $exc->getCode());
        }
    }

    private function EditarArchivos($Parametros) {
        try {
        $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $constructoraDelegado = new ConstructoraDelegado($this, $sesion);
            $constructoraDelegado->editarArchivos($Parametros);
        } catch (\Exception $exc) {
            throw new MyException($exc->getMessage(), $exc->getCode());
        }
    }

    public function subirarchivoAction() {
        try {
        $sesion = Util::iniciarSesion($this);
        Util::validarPeticion($this);
        $request = $this->getRequest();
            $constructoraDelegado = new ConstructoraDelegado($this, $sesion);
            $documentosAdjuntos = $constructoraDelegado->subirarchivo($request);
            $respuesta["documentosadjuntos"] = $documentosAdjuntos;
            $respuesta["codigoRespuesta"] = 1;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta["codigoRespuesta"] = 0;
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function eliminarArchivoAction() {
        try {
        $sesion = Util::iniciarSesion($this);
        $request = $this->get('request');
            Util::validarPeticion($this);
            $idarchivo = $request->get('idarchivo');
            $costructoraDelegado = new ConstructoraDelegado($this, $sesion);
            $documentosAdjuntos = $costructoraDelegado->eliminarArchivoAdjunto($idarchivo);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["documentosadjuntos"] = $documentosAdjuntos;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta["codigoRespuesta"] = 0;
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function AgendasAction() {
        $sesion = Util::iniciarSesion($this);
        $DelegadoConstructoras = new ConstructoraDelegado($this, $sesion);
        $lisParametros = array();
        $lisParametros['proceso']['usuario'] = $sesion->get('usuarionom');
        $lisParametros['proceso']['fechaInicio'] = 'vacio';
        $lisParametros['proceso']['numeroRegistrosProcesados'] = '0';
        $lisParametros['empresa'] = $sesion->get('empresa'); 
        $parametros['estado'] = 'A';
        $lisParametros['contratos'] = $DelegadoConstructoras->consultarContratos($parametros);

        $response = $this->render('LlanogasLlanogasBundle:Ventas:Constructora.genera_agenda.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function ProcesarAgendasAction() {
        try {
        $sesion = Util::iniciarSesion($this);
        $request = $this->get('request');
        $respuesta = array();
            Util::validarPeticion($this);
            $idarchivo = $request->get('idarchivo');
            $constructoraDelegado = new ConstructoraDelegado($this, $sesion);
            $parametros['contrato'] = $request->get('contrato');
            $resultado_proceso = $constructoraDelegado->procesarAgendas($parametros);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['agendasProcesadas'] = $resultado_proceso;
            $respuesta['mensaje'] = " Proceso Terminado Satisfactoriamente";
        } catch (\Exception $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta["codigoRespuesta"] = $ex->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    public function actualizarInformacionContratoAction(){
        try {
        $sesion = Util::iniciarSesion($this);
        $request = $this->get('request');
        $respuesta = array();
            Util::validarPeticion($this);
            $constructoraDelegado = new ConstructoraDelegado($this, $sesion);
            $idContrato = $request->get('contratoideregistro');
            if(empty($idContrato)){
                throw new MyException('Error, El Ide del Contrato no puede ser Vacio',-1);
            }
            $contactos = $request->get('contactos');
            $constructoraDelegado->autualizaInformacionContactos($contactos);
            $archivos = $request->get('archivos');
            $constructoraDelegado->actualizaInformacionArchivos($archivos, $idContrato);
            $polizas = $request->get('polizas');
            $constructoraDelegado->actualizaInformacionPolizas($polizas, $idContrato);
            $contratos = $request->get('contratos');
            $constructoraDelegado->actualizaInformacionContratos($contratos, $idContrato);
            
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = " Proceso Terminado Satisfactoriamente";
        } catch (\Exception $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta["codigoRespuesta"] = $ex->getCode();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    
    public function consultarProyectosPadreAction(){
        try{
            $request = $this->getRequest();
            
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $constructoraDelegado = new ConstructoraDelegado($this, $sesion);
            $respuesta["datos"] = $constructoraDelegado->consultarProyectosPadre($request->get('idTercero'));
            $respuesta["codigoRespuesta"] = 1;
        }catch(\Exception $ex){
            $respuesta['mensaje'] = $ex->getMessage();
            $respuesta["codigoRespuesta"] = $ex->getCode();
        }
        return  Util::construyeRespuesta($respuesta);
    }

}
