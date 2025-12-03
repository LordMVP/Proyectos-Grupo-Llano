<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\RegistroRapidoOperacionesDelegado;
use Llanogas\LlanogasBundle\Delegado\SuspensionesDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Clase que controla la gestión de suspensiones.
 */
class SuspensionController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros["empresa"] = $sesion->get("empresa"); //"Llanogas SA"; //$session->get("emp_ideregistro");
        $lisParametros["fechaactual"] = date('Y-m-d');
        $registroRapidoOperacionesDelegado = new RegistroRapidoOperacionesDelegado($this, $sesion) ;
         $lisParametros["fechaactualSuspension"] = $registroRapidoOperacionesDelegado->obtenerFechaHolgura(PROGRAMA_REGISTRO_RAPIDO_SUSPENSIONES, 'HOLGURA_SUSPENSION');
        $lisParametros["fechaactualReconexion"] = $registroRapidoOperacionesDelegado->obtenerFechaHolgura(PROGRAMA_REGISTRO_RAPIDO_SUSPENSIONES, 'HOLGURA_RECONEXION');
        $response = $this->render("LlanogasLlanogasBundle:Suspension:index.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
    }
    
    /**
     * Metodo que carga la pagina de mapa gps
     * @return type
     */
    public function seguimientoAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $empresa = $sesion->get("empresa");
        $idEmpresa = $sesion->get("idempresa");
        
        $suspensionesDelegado = new SuspensionesDelegado($this, $sesion) ;
        $lisParametros["cuadrillas"] = $suspensionesDelegado->obtenerCuadrillasEmpresa($idEmpresa, '06', "A");
        $lisParametros["fechaactual"] = date('Y-m-d');
        $lisParametros["empresa"] = $empresa;
        $response = $this->render("LlanogasLlanogasBundle:Suspension:SeguimientoSuspensiones.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
    }

    /**
     * Metodo de consulta de la ubicación de la cuadrilla
     * @return type
     */
    public function localizacionCuadrillaAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idEmpresa = $sesion->get("idempresa");
            $fecha = $request->get("fecha");
            $localizar = $request->get("localizar");
            $actividad = $request->get("actividad");
            $cuadrilla = $request->get("cuadrilla");
            
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $localizaciones = $suspensionesDelegado->obtenerLocalizacionCuadrilla($localizar, $actividad, "SURES", $cuadrilla, $fecha);
            
            $respuesta["codigoRespuesta"] = (empty($localizaciones)) ? 0 : 1;
            $respuesta["datos"] = $localizaciones;
            $respuesta["mensaje"] = (empty($localizaciones)) ? "No se encontraron localizaciones" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    
    /**
     * Obtiene la información de la suscripción.
     * @return json con la información detallada de una suscripción.
     * @throws MyException Error sí el identificador de la suscripción no es correcto.
     */
    public function detalleSuscripcionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idSuscripcion = $request->get("idSuscripcion");
            if (!is_numeric($idSuscripcion)) {
                throw new MyException("Error, el identificador de la suscripción es obligatorio" - 1);
            }
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $detalle = $suspensionesDelegado->obtenerDetalleSuscripcion($idSuscripcion);
            $respuesta["codigoRespuesta"] = (empty($detalle) ? 0 : 1);
            $respuesta["datos"] = $detalle;
            $respuesta["mensaje"] = (empty($detalle)) ? "No hay detalle de suscripcion" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta una suscripción dependiendo de la empresa, documento,
     * codigoanterior, idsuscripcion
     * @return json con el listado de las suscripciones.
     * @throws MyException Error si llegan todos los parámetros vacíos
     */
    public function consultarSuscripcionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idEmpresa = $sesion->get("idempresa");
            $documento = $request->get("documento");
            $codanterior = $request->get("codanterior");
            $municipio = $request->get("municipio");
            $idSuscripcion = $request->get("idsuscripcion");
            if (empty($documento) && empty($codanterior) && empty($idSuscripcion) && empty($municipio)) {
                throw new MyException("Error en los parámetros de búsqueda", -1);
            }

            if ((!empty($documento) && !is_numeric($documento)) || (!empty($codanterior) && !is_numeric($codanterior)) || (!empty($idSuscripcion) && !is_numeric($idSuscripcion)) || (!empty($municipio) && !is_numeric($municipio))) {
                throw new MyException("Error, los parámetros deben ser numéricos", -1);
            }
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $suscripcion = $suspensionesDelegado->consultarSuscripcion($idEmpresa, $documento, $codanterior, $idSuscripcion, $municipio);
            $respuesta["codigoRespuesta"] = (empty($suscripcion) ? 0 : 1);
            $respuesta["datos"] = $suscripcion;
            $respuesta["mensaje"] = (empty($suscripcion)) ? "No se encontraron suscripciones" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Routing para consultar la informacion del ciclo y el periodo de una
     * suscripcion
     * @return json informacion del ciclo y el periodo de una suscripcion
     */
    public function getCicloPeriodoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idSuscripcion = $request->get("idsuscripcion");
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $cicloperiodo = $suspensionesDelegado->consultarCicloPeriodo($idSuscripcion);
            $respuesta["codigoRespuesta"] = (empty($cicloperiodo) ? 0 : 1);
            $respuesta["datos"] = $cicloperiodo;
            $respuesta["mensaje"] = (empty($cicloperiodo)) ? "No se encontró ciclo / período" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Filtra los encabezados de suspension para una suscripcion
     * @return json informacion del encabezado de suspension
     * @throws MyException Error si no llegan todos los parámetros.
     */
    public function filtrarDocumentoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idEmpresa = $sesion->get("idempresa");
            $documento = $request->get("documento");
            $codAnterior = $request->get("codanterior");
            $suscripcion = $request->get("suscripcion");
            if (empty($documento) && empty($codAnterior) && empty($suscripcion)) {
                throw new MyException("Error en los parámetros de búsqueda", -1);
            }
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $cabecera = $suspensionesDelegado->consultarCabecera($idEmpresa, $documento, $codAnterior, $suscripcion);
            if (empty($cabecera)) {
                throw new MyException("No hay cabecera de la suscripción", 0);
            }
            $detalle = $suspensionesDelegado->consultarDetalle($cabecera["idsuscripcion"]);
            $suspensiones = array();
            $reconexiones = array();
            foreach ($cabecera as $cab) {
                $suspension["iddetallesuscripcion"] = $cab["iddetallesuscripcion"];
                $suspension["motivosus"] = $cab["motivosus"];
                $suspension["fechaprogramacionsus"] = $cab["fechaprogramacionsus"];
                $suspension["ejecutadasus"] = $cab["ejecutadasus"];
                $suspension["empresasus"] = $cab["empresasus"];
                $suspension["fechaejecucionsus"] = $cab["fechaejecucionsus"];
                $suspension["novedadsus"] = $cab["novedadsus"];
                $suspension["lecturasus"] = $cab["lecturasus"];
                $suspension["observacionsus"] = $cab["observacionsus"];
                $suspensiones[] = $suspension;

                $reconexion["fechaprogramacionrec"] = $cab["fechaprogramacionrec"];
                $reconexion["ejecutadarec"] = $cab["ejecutadarec"];
                $reconexion["fechaejecucionrec"] = $cab["fechaejecucionrec"];
                $reconexion["novedadrec"] = $cab["novedadrec"];
                $reconexion["estadorec"] = $cab["estadorec"];
                $reconexion["conceptorec"] = $cab["conceptorec"];
                $reconexion["valorrec"] = $cab["valorrec"];
                $reconexion["empresarec"] = $cab["empresarec"];
                $reconexiones[] = $reconexion;
            }
            $cabecera["suspensiones"] = $suspensiones;
            $cabecera["reconexiones"] = $reconexiones;
            $respuesta["codigoRespuesta"] = (empty($cabecera) ? 0 : 1);
            $respuesta["datos"] = $cabecera;
            $respuesta["mensaje"] = (empty($cabecera)) ? "No se encontró la cabecera" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Inserta un nuevo encabezado de suspension
     * @return json resultado de la insersion
     * @throws MyException
     */
    public function nuevaSuspensionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idSuscripcion = $request->get("idsuscripcion");
            $idPropiedad = $request->get("idpropiedad");
            $estado = $request->get("estado");
            $fechaGen = $request->get("fechageneracion");
            $fechaApro = $request->get("fechaaprobacion");
            $fechaPro = $request->get("fechaprocesamiento");
            $observaciones = $request->get("observaciones");
            $cicloano = $request->get("cicanio");
            if (empty($idSuscripcion)) {
                throw new MyException("Error, el identificador de la suscripción es obligatorio" - 1);
            }
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $suspension = $suspensionesDelegado->registrarNuevaSuspension($idSuscripcion, $idPropiedad, $estado, $fechaGen, $fechaApro, $fechaPro, $observaciones, $cicloano);
            $respuesta["codigoRespuesta"] = (empty($suspension) ? 0 : 1);
            $respuesta["datos"] = $suspension;
            $respuesta["mensaje"] = (empty($suspension)) ? "Error al guardar la suspensión" : "Se ha registrado una nueva suspension con el codigo: " . $suspension;
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Edita la informacion de un detalle de suspension
     * @return json
     * @throws MyException
     */
    public function editarSuspensionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idSuspension = $request->get("idDetalleCabecera");
            $fecha = $request->get("fechaGeneracion");
            $fechaApro = $request->get("fechaAprobacion");
            $fechaProc = $request->get("fechaProcesamiento");
            $observacion = $request->get("observaciones");
            $idSuscripcion = $request->get("idSuscripcion");
            if (empty($fecha)) {
                throw new MyException("Error, la fecha de generación es obligatoria", -1);
            }
            if (empty($idSuscripcion)) {
                throw new MyException("Error, el identificador de la suscripción es obligatorio" - 1);
            }
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $suspensionEditada = $suspensionesDelegado->editarSuspension($idSuspension, $fecha, $fechaApro, $fechaProc, $observacion, $idSuscripcion);
            $respuesta["codigoRespuesta"] = (empty($suspensionEditada) ? 0 : 1);
            $respuesta["datos"] = $suspensionEditada;
            $respuesta["mensaje"] = (empty($suspensionEditada)) ? "Error al editar la suspensión" : "La suspension ha sido editada correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Modifica el estado de un detalle de suspension a "C" 
     * @return type
     * @throws MyException
     */
    public function eliminarSuspensionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idSuspension = $request->get("idSuspension");
            $estado = "E";
            if (empty($idSuspension)) {
                throw new MyException("Error, el identificador de la suspensión es obligatorio" - 1);
            }
            if ((!empty($idSuspension) && !is_numeric($idSuspension))) {
                throw new MyException("Error, la suspensión debe ser numérica");
            }
            $suspensionDelegado = new SuspensionesDelegado($this, $sesion);
            $suspensionEliminada = $suspensionDelegado->eliminarSuspension($estado, $idSuspension);
            $respuesta["codigoRespuesta"] = (empty($suspensionEliminada) ? 0 : 1);
            $respuesta["datos"] = $suspensionEliminada;
            $respuesta["mensaje"] = (empty($suspensionEliminada)) ? "Error al eliminar la suspensión" : "Se ha eliminado la suspension";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Permite registrar un nuevo detalle de suspension con informacion enviada
     * en la peticion
     * @return json informacion de la respuesta del servidor
     * @throws MyException
     */
    public function crearDetalleSuspensionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $fechaProg = $request->get("fechaprogramacion");
            $fechaEjec = $request->get("fechaejecucion");
            $lectura = $request->get("lectura");
            $observacion = $request->get("observacion");
            $motivo = $request->get("idmotivosuspension");
            $idNovedad = $request->get("idnovedadsuspension");
            $idTipo = $request->get("idtiposuspension");
            $idSuspension = $request->get("idsuspension");
            $idTercero = $request->get("idtercerosuspension");
            $fechaApro = $request->get("fechaaprobacion");
            $valorTotal = $request->get("valortotal");
            $idConcepto = "";
            if (empty($idSuspension)) {
                throw new MyException("Error, no se encontraron encabezados para agregar los detalles. ", -1);
            }
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            if (!empty($idNovedad)) {
                $uniConcepto = $suspensionesDelegado->obtenerValorNovedadSus($idNovedad);
                if (!empty($uniConcepto["idconcepto"])) {
                    $idConcepto = $uniConcepto["idconcepto"];
                }
            }
            $detalleSuspension = $suspensionesDelegado->registrarDetalleSuspension($fechaProg, $fechaEjec, $lectura, $observacion, $motivo, $idNovedad, $idTipo, $idSuspension, $idTercero, $fechaApro, $idConcepto, $valorTotal);
            $respuesta["codigoRespuesta"] = (empty($detalleSuspension) ? 0 : 1);
            $respuesta["datos"] = $detalleSuspension;
            $respuesta["mensaje"] = (empty($detalleSuspension)) ? "Error al registrar el detalle de suspensión" : "Se ha creado un nuevo detalle de suspensión con el código " . $detalleSuspension;
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Edita la informacion de un detalle de suspension segun la informacion
     * recibida en la peticion
     * @return json respuesta de la edicion del detalle de suspension
     */
    public function editarDetalleSuspensionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idSuscripcion = $request->get("idSuscripcion");
            $idDetalleSuspension = $request->get("idregistrodetalle");
            $fechaProg = $request->get("fechaprogramacion");
            $fechaEjec = $request->get("fechaejecucion");
            $motivo = $request->get("idmotivosuspension");
            $idNovedad = $request->get("idnovedadsuspension");
            $idTipo = $request->get("idtiposuspension");
            $idTercero = $request->get("idtercerosuspension");
            $lectura = $request->get("lectura");
            $observacion = $request->get("observacion");
            $ejecutada = $request->get("ejecutada");
            $idConcepto = $request->get("idconceptosuspension");
            $valorTotal = $request->get("valortotal");
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            if (!empty($idNovedad)) {
                $uniConcepto = $suspensionesDelegado->obtenerIdConceptoNovedadSus($idNovedad);
                if (!empty($uniConcepto["idconcepto"])) {
                    $idConcepto = $uniConcepto["idconcepto"];
                }
            }
            $suspensionEditada = $suspensionesDelegado->editarDetalleSuspension($idDetalleSuspension, $fechaProg, $fechaEjec, $motivo, $idNovedad, $idTipo, $idTercero, $lectura, $observacion, $ejecutada, $idConcepto, $valorTotal,$idSuscripcion);
            $respuesta["codigoRespuesta"] = (empty($suspensionEditada) ? 0 : 1);
            $respuesta["datos"] = $suspensionEditada;
            $respuesta["mensaje"] = (empty($suspensionEditada)) ? "Error al editar la suspensión" : "Se ha editado el detalle de suspensión con el código" . $suspensionEditada;
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion de los detalle de suspension que tiene un
     * encabezado de suspension
     * @param int $idSuspension id del encabezado de suspension
     * @return json respuesta que contiene los detalle de suspension de un
     * encabezado
     */
    public function consultarDetallesSuspensionAction($idSuspension) {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $detalleSuspension = $suspensionesDelegado->consultarDetalleSuspension(intval($idSuspension));
            $respuesta["codigoRespuesta"] = (empty($detalleSuspension) ? 0 : 1);
            $respuesta["datos"] = $detalleSuspension;
            $respuesta["mensaje"] = (empty($detalleSuspension)) ? "No hay detalles de suspensión" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Inserta una nueva reconexion con los parametros recibidos dentro de la
     * peticion
     * @return json respuesta de la insersion de la reconexion
     */
    public function insertaReconexionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $fechaProg = $request->get("fechaprogramacion");
            $fechaEjec = $request->get("fechaejecucion");
            $fechaApro = $request->get("fechaaprobacion");
            $lectura = $request->get("lectura");
            $observacion = $request->get("observacion");
            $valorTotal = $request->get("valortotal");
            $novedad = $request->get("idnovedadreconexion");
            $idSuspension = $request->get("idsuspension");
            $idTercero = $request->get("idterceroreconexion");
            $idEmpresa = $sesion->get("idempresa");
            $motivo = $request->get("idmotivoreconexion");
            $idDetalle = $request->get("iddetallesuspension");
            $idConcepto = "";
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            if (!empty($novedad)) {
                $uniConcepto = $suspensionesDelegado->obtenerValorNovedadRec($novedad);
                if (!empty($uniConcepto["idconcepto"])) {
                    $idConcepto = $uniConcepto["idconcepto"];
                }
            }
            $reconexion = $suspensionesDelegado->insertarReconexion($fechaProg, $fechaEjec, $fechaApro, $lectura, $observacion, $valorTotal, $novedad, $idSuspension, $idConcepto, $idTercero, $idEmpresa, $motivo, $idDetalle);
            $respuesta["codigoRespuesta"] = (empty($reconexion) ? 0 : 1);
            $respuesta["datos"] = $reconexion;
            $respuesta["mensaje"] = (empty($reconexion)) ? "Error al guardar la reconexión" : "Se ha registrado una nueva reconexión con el código: " . $reconexion;
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Actualiza una reconexion con la informacion contenida en la peticion
     * @return json resultado de la actualizacion de la reconexion
     * @throws MyException
     */
    public function actualizarReconexionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idReconexion = $request->get("idregistrodetalle");
            $fechaProg = $request->get("fechaprogramacion");
            $fechaEjec = $request->get("fechaejecucion");
            $fechaApro = $request->get("fechaaprobacion");
            $lectura = $request->get("lectura");
            $observacion = $request->get("observacion");
            $valorTotal = $request->get("valortotal");
            $novedad = $request->get("idnovedadreconexion");
            $idSuspension = $request->get("idsuspension");
            $idConcepto = $request->get("idconceptoreconexion");
            $idTercero = $request->get("idterceroreconexion");
            $motivo = $request->get("idmotivoreconexion");
            $realizada = $request->get("realizada");
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            if(($motivo == 261 || $motivo == 258) && $realizada == 'S'){
                $suspensionesDelegado->actualizaSuscripcion($idSuspension);
            }
            if (empty($idReconexion)) {
                throw new MyException("Se debe asignar una reconeción antes de actualizar");
            }
            if (!empty($novedad)) {
                $uniConcepto = $suspensionesDelegado->obtenerIdConceptoNovedadRec($novedad);
                if (!empty($uniConcepto["idconcepto"])) {
                    $idConcepto = $uniConcepto["idconcepto"];
                }
            }
            $reconexion = $suspensionesDelegado->actualizarReconexion($fechaProg, $fechaEjec, $fechaApro, $lectura, $observacion, $valorTotal, $novedad, $idSuspension, $idConcepto, $idTercero, $idReconexion, $motivo, $realizada);
            $respuesta["codigoRespuesta"] = (empty($reconexion) ? 0 : 1);
            $respuesta["datos"] = $reconexion;
            $respuesta["mensaje"] = (empty($reconexion)) ? "Error al actualizar la reconexión" : "La reconexión ha sido actualizada";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion de una reconexion
     * @return json resultado con la informacion de la reconexion
     * @throws MyException
     */
    public function consultarReconexionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idSuspension = $request->get("idsuspension");
            if (empty($idSuspension)) {
                throw new MyException("Error en los parámetros de búsqueda");
            }
            if ((!empty($idSuspension) && !is_numeric($idSuspension))) {
                throw new MyException("Los campos deben ser numéricos");
            }
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $reconexiones = $suspensionesDelegado->consultarReconexion($idSuspension);
            $respuesta["codigoRespuesta"] = (empty($reconexiones) ? 0 : 1);
            $respuesta["datos"] = $reconexiones;
            $respuesta["mensaje"] = (empty($reconexiones)) ? "No se encontraron reconexiones" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion de un encabezado de suspension
     * @return json resultado con informacion del encabezado de suspension
     * @throws MyException
     */
    public function consultarSuspensionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idSuscripcion = $request->get("idsuscripcion");
            if (empty($idSuscripcion)) {
                throw new MyException("Error, el identificador de la suscripción es obligatorio" - 1);
            }
            if ((!empty($idSuscripcion) && !is_numeric($idSuscripcion))) {
                throw new MyException("Error, el identificador de la suscripción debe ser numérico" - 1);
            }
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $suspension = $suspensionesDelegado->consultarSuspension($idSuscripcion);
            $respuesta["codigoRespuesta"] = (empty($suspension) ? 0 : 1);
            $respuesta["datos"] = $suspension;
            $respuesta["mensaje"] = (empty($suspension)) ? "No se encontraron suspensiones" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion de los estados que puede tener un encabezado de 
     * suspension
     * @return json resultado con la informacion de los estados de encabezados
     * de suspension
     */
    public function consultarEstadosSuspensionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $parametros = $suspensionesDelegado->consultaParametros(C_ESTADO_SUSPENSIONES);
            $respuesta["codigoRespuesta"] = (empty($parametros) ? 0 : 1);
            $respuesta["datos"] = $parametros;
            $respuesta["mensaje"] = (empty($parametros)) ? "No hay motivos" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion de los motivos de suspension
     * @return json resultado con la informacion de los motivos de suspension
     */
    public function consultarMotivosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $parametros = $suspensionesDelegado->consultaParametros(COD_MOTIVOS);
            $respuesta["codigoRespuesta"] = (empty($parametros) ? 0 : 1);
            $respuesta["datos"] = $parametros;
            $respuesta["mensaje"] = (empty($parametros)) ? "No se encontraron motivos" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion de los motivos de reconexion
     * @return json resultado con la informacion de los motivos de reconexion
     */
    public function consultarMotivosReconexionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $parametros = $suspensionesDelegado->consultaParametros(COD_MOTIVOS_RECONEXIONES);
            $respuesta["codigoRespuesta"] = (empty($parametros) ? 0 : 1);
            $respuesta["datos"] = $parametros;
            $respuesta["mensaje"] = (empty($parametros)) ? "No se encontraron motivos de reconexión" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion de los conceptos de suspension
     * @return json resultado con la informacion de los conceptos de suspension
     */
    public function consultarConceptosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $parametros = $suspensionesDelegado->consultaParametros(COD_CONCEPTOS);
            $respuesta["codigoRespuesta"] = (empty($parametros) ? 0 : 1);
            $respuesta["datos"] = $parametros;
            $respuesta["mensaje"] = (empty($parametros)) ? "No hay conceptos" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion de novedades de suspension
     * @return json resultado con la informacion de las novedades de suspension
     */
    public function consultarNovedadesSuspensionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $parametros = $suspensionesDelegado->consultaParametros(COD_NOVEDADES_SUSP);
            $respuesta["codigoRespuesta"] = (empty($parametros) ? 0 : 1);
            $respuesta["datos"] = $parametros;
            $respuesta["mensaje"] = (empty($parametros)) ? "No hay novedades de suspensión" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion sobre novedades de reconexion
     * @return json Resultado con la informacion de las novedades de reconexion
     */
    public function consultarNovedadesReconexionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $parametros = $suspensionesDelegado->consultaParametros(COD_NOVEDADES_RECO);
            $respuesta["codigoRespuesta"] = (empty($parametros) ? 0 : 1);
            $respuesta["datos"] = $parametros;
            $respuesta["mensaje"] = (empty($parametros)) ? "No hay novedades de reconexión" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion de los tipos de informacion
     * @return json Resultado con la informacion de los tipos de suspension
     */
    public function consultarTiposSuspensionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $parametros = $suspensionesDelegado->consultaParametros(COD_TIPOS_SUSPENSION);
            $respuesta["codigoRespuesta"] = (empty($parametros) ? 0 : 1);
            $respuesta["datos"] = $parametros;
            $respuesta["mensaje"] = (empty($parametros)) ? "No hay tipos de suspensión" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion de los terceros en la base de datos
     * @return json Resultado con la informacion de los terceros
     * @throws MyException
     */
    public function consultarTercerosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $nombre = $request->get("nombre");
            if (empty($nombre)) {
                throw new MyException("Error en los parámetros de búsqueda");
            }
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $listaTerceros = $suspensionesDelegado->consultarTerceros($nombre);
            $respuesta["codigoRespuesta"] = (empty($listaTerceros) ? 0 : 1);
            $respuesta["datos"] = $listaTerceros;
            $respuesta["mensaje"] = (empty($listaTerceros)) ? "No se encontraron terceros" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensajeError"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion de los terceros que pueden realizar suspensiones
     * y reconexiones
     * @return Resultado con la informacion de suspensiones y reconexiones
     * @throws MyException
     */
    public function getTercerosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $nombre = $request->get("nombre");
            if (empty($nombre)) {
                throw new MyException("Error en los parámetros de búsqueda");
            }
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $listaTerceros = $suspensionesDelegado->consultarTercerosClase($nombre);
            $respuesta["codigoRespuesta"] = (empty($listaTerceros) ? 0 : 1);
            $respuesta["datos"] = $listaTerceros;
            $respuesta["mensaje"] = (empty($listaTerceros)) ? "No se encontraron terceros" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Modifica a estado "C" un detalle de suspension
     * @return json Resultado de la modificacion del detalle
     * @throws MyException
     */
    public function eliminarDetalleSuspensionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idRegistroDetalle = $request->get("idregistrodetalle");
            if (empty($idRegistroDetalle)) {
                throw new MyException("Error en los parámetros de búsqueda");
            }
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $detalleSuspension = $suspensionesDelegado->eliminarDetalleSuspension($idRegistroDetalle);
            $respuesta["codigoRespuesta"] = (empty($detalleSuspension) ? 0 : 1);
            $respuesta["datos"] = $detalleSuspension;
            $respuesta["mensaje"] = (empty($detalleSuspension)) ? "Error al eliminar el detalle de suspensión" : "Se ha eliminado el detalle de suspension";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Elimina una reconexión
     * @return json con toda la información de la transacción
     * @throws MyException Error si no llega el parámetro de eliminación.
     */
    public function eliminarReconexionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idRegistroDetalle = $request->get("idregistrodetalle");
            if (empty($idRegistroDetalle)) {
                throw new MyException("Error en los parámetros de búsqueda");
            }
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $reconexion = $suspensionesDelegado->eliminarReconexion($idRegistroDetalle);
            $respuesta["codigoRespuesta"] = (empty($reconexion) ? 0 : 1);
            $respuesta["datos"] = $reconexion;
            $respuesta["mensaje"] = (empty($reconexion)) ? "Error al eliminar el detalle de suspensión" : "Se ha eliminado la reconexion";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion de los municipios 
     * @return json Resultado con la informacion de los municipios asignados al
     * programa de suspensiones y reconexiones
     * @throws MyException
     */
    public function getMunicipiosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $municipio = $request->get("municipio");
            if (empty($municipio)) {
                throw new MyException('Error, el municipio es obligatorio', -1);
            }
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $municipios = $suspensionesDelegado->getMunicipio($municipio);
            $respuesta["codigoRespuesta"] = (empty($municipios) ? 0 : 1);
            $respuesta["datos"] = $municipios;
            $respuesta["mensaje"] = (empty($municipios)) ? "No se encontraron municipios" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion sobre motivos de reconexion
     * @return json Resultado con la informacion de motivos de reconexion
     */
    public function getMotivosReconexionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idSuspension = $request->get("idsuspension");
            $idDetalle = $request->get("iddetallesuspension");
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $data["motivos"] = $suspensionesDelegado->consultarMotivosReconexion($idSuspension, $idDetalle);
            $data["suspension"] = $suspensionesDelegado->obtenerUltimaSuspensionEjecutada($idSuspension);

            $respuesta["codigoRespuesta"] = (empty($data) ? 0 : 1);
            $respuesta["datos"] = $data;
            $respuesta["mensaje"] = (empty($data)) ? "No hay motivos de reconexión" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion del valor de los conceptos de suspension
     * @return json Resultado con informacion del valor de un concepto
     */
    public function getValorConceptoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $concepto = $request->get("idconcepto");
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $valor = $suspensionesDelegado->consultarValorConcepto($concepto);
            $respuesta["codigoRespuesta"] = (empty($valor) ? 0 : 1);
            $respuesta["datos"] = $valor;
            $respuesta["mensaje"] = (empty($valor)) ? "No hay valor de concepto" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta el id del detalle de la suspension para una nueva reconexion
     * @return json Resultado con la informacion del detalle de la suspension
     */
    public function getSuspensionParaReconexionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idsuspension = $request->get("idsuspension");
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $suspension = $suspensionesDelegado->obtenerSuspensionParaReconexion($idsuspension);
            $respuesta["codigoRespuesta"] = (empty($suspension) ? 0 : 1);
            $respuesta["datos"] = $suspension;
            $respuesta["mensaje"] = (empty($suspension)) ? "No hay suspensiones pendientes por reconexión" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta el valor de una novedad de suspension
     * @return json Resultado con la informacion
     */
    public function getValorNovedadSuspensionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idNovedadSus = $request->get("idnovedad");
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $valorTotal = $suspensionesDelegado->obtenerValorNovedadSus($idNovedadSus);
            $respuesta["codigoRespuesta"] = (empty($valorTotal) ? 0 : 1);
            $respuesta["datos"] = $valorTotal;
            $respuesta["mensaje"] = (empty($valorTotal)) ? "No hay valor asociado a la novedad" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion del valor de una novedad de reconexion
     * @return json Resultado con la informacion del valor de una novedad de 
     * reconexion
     */
    public function getValorNovedadReconexionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            //Valida la petición que se haga por POST
            Util::validarPeticion($this);
            $idNovedadRec = $request->get("idnovedad");
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            $valorTotal = $suspensionesDelegado->obtenerValorNovedadRec($idNovedadRec);
            $respuesta["codigoRespuesta"] = (empty($valorTotal) ? 0 : 1);
            $respuesta["datos"] = $valorTotal;
            $respuesta["mensaje"] = (empty($valorTotal)) ? "No hay valor asociado a la novedad" : "La consulta se realizó correctamente";
        } catch (\Exception $exc) {
            $respuesta["codigoRespuesta"] = $exc->getCode();
            $respuesta["mensaje"] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
     /**
     * Obtiene la información de la suscripción.
     * @return json con la información detallada de una suscripción.
     * @throws MyException Error sí el identificador de la suscripción no es correcto.
     */
    public function habilitarSspRcoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);           
            $idsuspension = $request->get("idsuspension");
            $idregistrodetalle = $request->get("idregistrodetalle");
            $idreconexion = $request->get('idreconexion');
            $accion = $request->get("accion");
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            
           
            $contadorHabilitar = $suspensionesDelegado->habilitarSSRX($idsuspension,$idregistrodetalle,$accion, $idreconexion);    
                    
            
            $respuesta["codigoRespuesta"] = $contadorHabilitar[0]['contador'] == 0 ? -1 : 1;            
            $respuesta["mensaje"] = (empty($contadorHabilitar)) ? "Usuario no tiene Permisos para habilitar; por favor Diligencie autorización" : "Puede editar nuevamente, Recuerde que se debe Ejecutar antes del Porceso de Suspensiones, de lo contrario este lo cancelara";
        } catch (\Exception $e) {
            
            $respuesta["codigoRespuesta"] = $e->getCode();
            $respuesta["mensaje"] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
     /**
     * Obtiene la información del Saldo una Factura o Financiacion.
     * @return json con la información detallada de una suscripción.
     * @throws MyException Error sí el identificador de la suscripción no es correcto.
     */
    public function getInformacionFacturaFinanaciacionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);           
            $idsuscripcion = $request->get("idSuscripcion");
            if(empty($idsuscripcion)){
                throw new MyException('Error, la suscripción es obligatoria', -1);
            }
            $suspensionesDelegado = new SuspensionesDelegado($this, $sesion);
            
            $contadorSaldo = $suspensionesDelegado->getInformacionFacturaFinanaciacion($idsuscripcion);    
            $respuesta["codigoRespuesta"] = $contadorSaldo[0]['cantidad'] == 0 ? 1 : -1;            
            $respuesta["mensaje"] =  $contadorSaldo[0]['cantidad'] == 0 ? "Consulta Exitosa" : "Cliente tiene Facturas ó Financiaciones con Saldo";
        } catch (\Exception $e) {
            
            $respuesta["codigoRespuesta"] = $e->getCode();
            $respuesta["mensaje"] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }


}
