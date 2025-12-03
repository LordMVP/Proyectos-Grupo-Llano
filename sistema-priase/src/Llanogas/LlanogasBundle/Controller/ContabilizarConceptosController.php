<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Delegado\DefinicionesConceptosDelegado;

/**
 * Clase encargada de administrar los recaudos en forma de abono.
 */
class ContabilizarConceptosController extends Controller {

    /**
     *
     * @DefinicionesConceptosDelegado definicionConceptoDelegado
     */
    private $definicionConceptoDelegado;

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $listaParametros = array();
        $listaParametros['empresa'] = $sesion->get('empresa');
        $response = $this->render('LlanogasLlanogasBundle:Facturacion:contabilizarConcepto.html.twig', $listaParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Obtiene el lsitado de los tipos de documento
     * @return JSON
     */
    public function consultarTipoDocumentoAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
            $respuesta["codigoRespuesta"] = 1;
            $iddocumento = $request->get('iddocumento');
            $idempresa = $request->get('idempresa');
            if (empty($idempresa)) {
                $idempresa = $sesion->get('idempresa');
            }
            $respuesta['tipodocumento'] = $definicionConceptoDelegado->ObtenerTipoDocumentosParametrizables($iddocumento, $idempresa);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Obtiene el lsitado de los tipos de documento
     * @return JSON
     */
    public function consultarDocumentosAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
            $respuesta["codigoRespuesta"] = 1;
            $idempresa = $request->get('idempresa');
            if (empty($idempresa)) {
                $idempresa = $sesion->get('idempresa');
            }
            $respuesta['documento'] = $definicionConceptoDelegado->ObtenerDocumentosParametrizables($idempresa);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Permite consultar los conceptos por nombre por ajax
     * @return JSON
     */
    public function consultarEmpresasConvenioAction() {
        try {
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['empresasconvenio'] = $definicionConceptoDelegado->ObtenerEmpresasConvenio();
            $respuesta['mediospago'] = $definicionConceptoDelegado->ObtenerMediosPago();
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Permite consultar los conceptos por nombre por ajax
     * @return JSON
     */
    public function consultarConceptosNombreAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $concepto = $request->get('nombre');
            $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['conceptos'] = $definicionConceptoDelegado->getConceptosNombre($concepto);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    // </editor-fold>

    /**
     * permite establecer la creación o actualizacion de un concepto
     * @return JSON
     */
    public function actualizarContabilizacionConceptoAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
            $definicionesconcepto = $request->get('contabilizarconceptos');
            if (empty($definicionesconcepto)) {
                throw new MyException('No se encontró ninguna contabilización a evaluar', -1);
            }
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['contabilizarconcepto'] = $definicionConceptoDelegado->actualizarContabilizacionConceptos($definicionesconcepto);
            $respuesta['mensaje'] = "Concepto actualizado con éxito";
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Modified: 
     * Sergio Vargas
     * Routing 
     * /facturacion/contabilizar_concepto/obtener/causioncontable/
     * Descripción      
     * Permite cargas las causiones contables
     */
    public function obtenerCausionContableAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $idconcepto = $request->get('idconcepto');
            $iddocumento = $request->get('iddocumento');
            $idtipodocumento = $request->get('idtipodocumento');
            
            $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['causioncontable']['contabilizacion'] = $definicionConceptoDelegado->ObtenerContabilizacion($idconcepto,$iddocumento,$idtipodocumento);
            $respuesta['causioncontable']['areanegocio'] = $definicionConceptoDelegado->ObtenerAreaNegocio($idconcepto);
            $respuesta['causioncontable']['departamentoempresa'] = $definicionConceptoDelegado->ObtenerDepartamentoEmpresa();
            $respuesta['causioncontable']['tiposuscripcion'] = $definicionConceptoDelegado->ObtenerTipoSuscripcionAreaNegocio($idconcepto);
            $respuesta['causioncontable']['centrocosto'] = $definicionConceptoDelegado->ObtenerCentroCosto($idconcepto);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Routing 
     * /facturacion/contabilizar_concepto/obtener/consignacion/
     * Descripcion: 
     * carga los recaudos existentes
     * @return JSON
     */
    public function obtenerConsignacionAction() {
        try {
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
            $respuesta["codigoRespuesta"] = 1;
            $idempresa = $request->get('idempresa');
            if (empty($idempresa)) {
                $idempresa = $sesion->get('idempresa');
            }

            $iddocumento = $request->get('iddocumento');
            $idtipodocumento = $request->get('idtipodocumento');
            $idmediopago = $request->get('idmediopago');

            $respuesta['consignacion']['conceptoflujo'] = $definicionConceptoDelegado->ObtenerParametrosFlujoContable();
            $respuesta['consignacion']['consignacion']['conceptocontable'] = $definicionConceptoDelegado->ObtenerContabilizacionConceptoContable($idempresa, $iddocumento, $idtipodocumento, $idmediopago,"and dics_tipo = 'N'");
            $respuesta['consignacion']['consignacion']['conceptoflujo'] = $definicionConceptoDelegado->ObtenerContabilizacionFlujoContable($idempresa, $iddocumento, $idtipodocumento, $idmediopago, "and dics_tipo = 'N'");
            $respuesta['consignacion']['diferencia']['conceptocontable'] = $definicionConceptoDelegado->ObtenerContabilizacionConceptoContable($idempresa, $iddocumento, $idtipodocumento, $idmediopago, "and dics_tipo in ('F','S','G')");
            $respuesta['consignacion']['diferencia']['conceptoflujo'] = $definicionConceptoDelegado->ObtenerContabilizacionFlujoContable($idempresa, $iddocumento, $idtipodocumento, $idmediopago, "and dics_tipo in ('F','S','G')");
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Modified: Sergio Vargas
     * Routing 
     * /facturacion/contabilizar_concepto/obtener/recaudos/
     * Descripcion: 
     * carga los recaudos existentes 
     * @return JSON
     */
    public function obtenerRecaudosAction() {
        try {
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
            $respuesta["codigoRespuesta"] = 1;
            $idempresa = $request->get('idempresa');
            if (empty($idempresa)) {
                $idempresa = $sesion->get('idempresa');
            }

            $iddocumento = $request->get('iddocumento');
            $idtipodocumento = $request->get('idtipodocumento');
            $idmediopago = $request->get('idmediopago');

            $respuesta['recaudo']['conceptocontable'] = $definicionConceptoDelegado->ObtenerContabilizacionConceptoContable($idempresa, $iddocumento, $idtipodocumento, $idmediopago,"and dics_tipo = 'N'");
            $respuesta['recaudo']['flujocontable'] = $definicionConceptoDelegado->ObtenerContabilizacionFlujoContable($idempresa, $iddocumento, $idtipodocumento, $idmediopago,"and dics_tipo = 'N'");
            $respuesta['recaudo']['conceptoflujo'] = $definicionConceptoDelegado->ObtenerParametrosFlujoContable();
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Permite filtrar las cuentas porm medio de una acción
     * @param sesion $sesion
     * @param array $parametros
     */
    private function consultarCuentas($sesion, $parametros) {
        $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
        $cuentasContabilizacion = array();
        $accion = $parametros['accion'];
        $cuenta = $parametros['cuenta'];
        if (empty($accion)) {
            throw new MyException('Debe existir una acción para consultar', -1);
        }
        //sigla para obtener las cuentas de contabilizacion  o para todas las pestañas de recaudos recaudos
        if ($accion == 'CZ' || $accion == 'R') {
            $cuentasContabilizacion = $definicionConceptoDelegado->ObtenerCuentasContabilizacionRecaudos($cuenta);
        }
        //sigla para obtener las cuentas de area de negocio 
        if ($accion == 'AN') {
            $cuentasContabilizacion = $definicionConceptoDelegado->ObtenerCuentasAreaNegocio($cuenta);
        }
        //sigla para obtener las cuentas de centro de costo
        if ($accion == 'CC') {
            $cuentasContabilizacion = $definicionConceptoDelegado->ObtenerCuentasCentroCosto($cuenta);
        }
        return $cuentasContabilizacion;
    }

    /**
     * 
     * @return Array cuentas
     */
    public function consultarCuentasAction() {

        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $parametros['cuenta'] = $request->get('cuenta');
            $parametros['accion'] = $request->get('accion');
            $respuesta['cuentas'] = $this->consultarCuentas($sesion, $parametros);
            $respuesta["codigoRespuesta"] = 1;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * 
     * @return Array cuentas
     */
    public function obtenerListarBancosConsignacionAction() {

        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
            $idmediopago = $request->get('idmediopago');
            $respuesta['bancos'] = $definicionConceptoDelegado->obtenerListarBancosConsignacion($idmediopago);
            $respuesta["codigoRespuesta"] = 1;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * /facturacion/contabilizar_concepto/obtener/medio_pago/
     * Consulta medios de pago asociados a un usuario
     * @return Array cuentas
     */
    public function obtenerMediosPagoAction() {
        try {
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
            $respuesta['mediopago'] = $definicionConceptoDelegado->ObtenerMediosPago();
            $respuesta["codigoRespuesta"] = 1;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensajeError"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
