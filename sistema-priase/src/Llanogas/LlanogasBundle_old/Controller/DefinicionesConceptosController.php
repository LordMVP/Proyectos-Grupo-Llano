<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Delegado\DefinicionesConceptosDelegado;

/**
 * Clase encargada de administrar los recaudos en forma de abono.
 */
class DefinicionesConceptosController extends Controller {

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
        $response = $this->render('LlanogasLlanogasBundle:Facturacion:definicionConcepto.html.twig', $listaParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    // <editor-fold desc="Consulta por documentos ">  

    /**
     * permite listar los documentos por una acción determinadoa
     * @param char $accion Enumerador de carga de documentos
     */
    private function obtenerDocumentos($sesion, $accion = 'T') {
        $documentos = '';
        $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
        //obtiene todos los documentos del perfil asociado 
        if ($accion == 'T' || empty($accion)) {
            $documentos = $definicionConceptoDelegado->getDocumentos();
        }
        //obtiene todos los documentos de contabilizacion
        if ($accion == 'CC') {
            $documentos = $definicionConceptoDelegado->ObtenerDocumentoContabilizacion();
        }
        //obtiene todos los documentos de recaudo
        if ($accion == 'R') {
            $documentos = $definicionConceptoDelegado->ObtenerDocumentoRecaudo();
        }
        //obtiene todos los documentos de presupuestos
        if ($accion == 'P') {
            $documentos = $definicionConceptoDelegado->ObtenerDocumentoPresupuesto();
        }
        //obtiene todos los documentos de consignacion
        if ($accion == 'C') {
            $documentos = $definicionConceptoDelegado->ObtenerDocumentoConsignacion();
        }

        if (empty($documentos)) {
            throw new MyException('no existen documentos relacionados en la consulta', -1);
        }
        return $documentos;
    }

    /**
     * Permite obtener el listado de los documentos
     * @return JSON
     */
    public function consultarDocumentosAction() {
        try {
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            $accion = $request->get('accion');
            $respuesta['documentos'] = $this->obtenerDocumentos($sesion, $accion);
            $respuesta["codigoRespuesta"] = 1;
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
    public function consultarTipoDocumentoAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
            $respuesta["codigoRespuesta"] = 1;
            $iddocumento = $request->get('iddocumento');
            $respuesta['tipodocumento'] = $definicionConceptoDelegado->getTipoDocumentos($iddocumento);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    // </editor-fold>
    // <editor-fold desc="Parametrización de conceptos">  

    /**
     * permite cargar los parametros necesarios para construir la vista de definición de conceptos
     * /facturacion/conceptos/parametros/
     * @return JSON
     */
    public function cargarParametrosConceptosAction() {
        try {
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['conceptos'] = $this->cargarParametrosConceptos($sesion);
            $respuesta['mensaje'] = "información cargada satisfactoriamente";
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     *  
     * Permite armar el arrayque contendra la inicialización de parámetros de la vista
     * @param sesion $sesion
     * @return Array
     */
    private function cargarParametrosConceptos($sesion) {
        $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
        $parametros['programa'] = $definicionConceptoDelegado->getProgramas();
        $parametros['funcionesencabezado'] = $definicionConceptoDelegado->getFunciones(null, 'R');
        $parametros['funcionesconceptos'] = $definicionConceptoDelegado->getFunciones(null, 'A');
        $parametros['funciones'] = $definicionConceptoDelegado->getFunciones(null, 'F');
        $parametros['conceptosparametrizables'] = $definicionConceptoDelegado->getConceptosParametrizables();
        //ya no va por no ir documento ni tipo de documento 
        //$parametros['liquidaciones'] = $definicionConceptoDelegado->getLiquidacion(); 
        $parametros['mediospago'] = $definicionConceptoDelegado->ObtenerMediosPago();
        $parametros['conceptocontable'] = $definicionConceptoDelegado->ObtenerConceptoContable();
        $parametros['flujocontable'] = $definicionConceptoDelegado->ObtenerFlujoContable();

        return $parametros;
    }

// </editor-fold>
    // <editor-fold desc="conceptos">

    /**
     * permite establecer la creación o actualizacion de un concepto
     * @return JSON
     */
    public function actualizarConceptoAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
            $definicionesconcepto = $request->get('definicionesconceptos');
            if (empty($definicionesconcepto)) {
                throw new MyException('no se encontro definiciones de concepto a actualizar', -1);
            }
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['definicionConcepto'] = $definicionConceptoDelegado->definicionConcepto($definicionesconcepto);
            $respuesta['mensaje'] = "concepto actualizado con éxito";
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Valida que un alias den concepto no exista
     * @return JSON
     */
    public function validaAliasConceptoAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
            $definicionesconcepto = $request->get('alias');
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['validacion'] = $definicionConceptoDelegado->validaAliasConcepto($definicionesconcepto);
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

    /**
     * permite armar los detalles de conceptos
     * @param sesion $sesion
     * @param int $idconcepto
     * @return Array 
     */
    public function obtenerDetallesConcepto($sesion, $idconcepto, $esnuevo = false) {
        $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
        $respuesta['definicionConcepto'] = $definicionConceptoDelegado->getConceptos($idconcepto, false, $esnuevo);
        $respuesta['listaconceptosdiferentes'] = $definicionConceptoDelegado->getConceptos($idconcepto, true, $esnuevo);
        if ($esnuevo) {
            return $respuesta;
        }

        if (!empty($respuesta['definicionConcepto']['formula'])) {
            $respuesta['conceptosrelacionados'] = $definicionConceptoDelegado->getConceptosRelacionados($idconcepto);
            $respuesta['rangoconceptos'] = $definicionConceptoDelegado->getRangoConcepto($idconcepto);
        }
        /*  $respuesta['causioncontable']['contabilizacion'] = $definicionConceptoDelegado->ObtenerContabilizacion($idconcepto);
          $respuesta['causioncontable']['areanegocio'] = $definicionConceptoDelegado->ObtenerAreaNegocio($idconcepto);
          $respuesta['causioncontable']['centrocosto'] = $definicionConceptoDelegado->ObtenerCentroCosto($idconcepto);
          $respuesta['causioncontable']['tiposuscripcion'] = $definicionConceptoDelegado->ObtenerTipoSuscripcionAreaNegocio($idconcepto);
          $respuesta['recaudo']['contabilizacioncruce'] = $definicionConceptoDelegado->ObtenerContabilizacionCruce($idconcepto);
          $respuesta['recaudo']['contabilizacionanticipo'] = $definicionConceptoDelegado->ObtenerContabilizacionAnticipo($idconcepto);
          $respuesta['recaudo']['empresasrecaudo'] = $definicionConceptoDelegado->ObtenerEmpresasRecaudo($idconcepto);
          $respuesta['recaudo']['empresasconvenio'] = $definicionConceptoDelegado->ObtenerEmpresasConvenio($idconcepto);
          $respuesta['recaudo']['mediopago'] = $definicionConceptoDelegado->ObtenerMediosPago($idconcepto);
          $respuesta['consignacion']['consignacion'] = $definicionConceptoDelegado->obtenerConsignaciones($idconcepto);
          $respuesta['consignacion']['diferencia'] = $definicionConceptoDelegado->obtenerDiferenciaConsignaciones($idconcepto);
          $respuesta['presupuesto']['presupuesto'] = $definicionConceptoDelegado->ObtenerPresupuesto($idconcepto);
         */
        return $respuesta;
    }

    /**
     * permite obtener todos los detalles asociados al concepto relacionado
     * @return JSON
     */
    public function consultarConceptosAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $idconcepto = $request->get('idconcepto');
            $esnuevo = $request->get('esnuevo');
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['conceptos'] = $this->obtenerDetallesConcepto($sesion, $idconcepto, $esnuevo);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta los documentos con liquidacion
     * @return JSON
     */
    public function consultarDocumentoLiquidacionAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
            $idliquidacion = $request->get('idliquidacion');
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['documentoliquidacion'] = $definicionConceptoDelegado->getDocumentoLiquidacion($idliquidacion);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Listado de funciones necesarias para aplicar formulas
     * @return JSON
     */
    public function consultarFuncionesAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $definicionConceptoDelegado = new DefinicionesConceptosDelegado($this, $sesion);
            $idfuncion = $request->get('idfuncion');
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['funciones'] = $definicionConceptoDelegado->getFunciones($idfuncion);
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensajeError"] = $ex->getMessage();
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
            throw new MyException('debe existir una acción para consultar', -1);
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

    // </editor-fold>
}
