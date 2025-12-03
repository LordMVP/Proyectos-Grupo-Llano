<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Request;

class UtilController extends Controller {

    public function __construct() {
        
    }

    /**
     * @Route("/findJsonSuscriptorByName")
     * @Method({"POST"})
     */
    public function findJsonSuscriptorPorNombre(Request $request) {
        $base = $this->get("reportes.base");
        $utilModel = new \Reportes\ReportesBundle\Models\UtilModel($base->conexion);
        $resultado['terceros'] = $utilModel->consultarSuscriptoresNombre($request->request->get("nombre"));
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/buscarTerceroNombre/{search}")
     * @Method({"GET"})
     */
    public function buecarTerceroPorNombre($search, Request $request) {
        $base = $this->get("reportes.base");
        $utilModel = new \Reportes\ReportesBundle\Models\UtilModel($base->conexion);
        $resultado['terceros'] = $utilModel->consultarSuscriptoresNombre($search);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/buscarTerceroDocumento/{search}")
     * @Method({"GET"})
     */
    public function buecarTerceroPorDocumento($search, Request $request) {
        $base = $this->get("reportes.base");
        $utilModel = new \Reportes\ReportesBundle\Models\UtilModel($base->conexion);
        $resultado['terceros'] = $utilModel->consultarSuscriptoresDocumento($search);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/findJsonConstructoraByName")
     * @Method({"POST"})
     */
    public function findJsonConstructorasByName(Request $request) {
        $base = $this->get("reportes.base");
        $utilModel = new \Reportes\ReportesBundle\Models\UtilModel($base->conexion);
        $resultado['resultados'] = $utilModel->consultarConstructoras($request->request->get("nombre"));
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonCiclosActivos")
     * @Method({"GET"})
     */
    public function getJsonCiclosActivos() {
        $base = $this->get("reportes.base");
        $ciclosActivos = $base->modeloGenerico->consultarCiclosActivos($base->idEmpresa);
        $resultado['ciclos'] = $ciclosActivos;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonCiclosActivosPorPrograma/{idprograma}")
     * @Method({"GET"})
     */
    public function getJsonCiclosActivosPorPrograma($idprograma) {
        $base = $this->get("reportes.base");
        $ciclosActivos = $base->modeloGenerico->getCiclosActivosPrograma($base->idEmpresa, $idprograma);
        $resultado['ciclos'] = $ciclosActivos;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonPeriodosCiclo/{ciclo}")
     * @Method({"GET"})
     */
    public function getJsonPeriodosCiclo($ciclo) {
        $base = $this->get("reportes.base");
        $periodos = $base->utilModel->consultarPeriodosCiclo($ciclo);
        $resultado['periodos'] = $periodos;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonPeriodosUnicosCiclo/{ciclo}")
     * @Method({"GET"})
     */
    public function getJsonPeriodosUnicosCiclo($ciclo) {
        $base = $this->get("reportes.base");
        $periodos = $base->utilModel->consultarPeriodosUnicosCiclo($ciclo);
        $resultado['periodos'] = $periodos;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonPeriodosCicloAno")
     * @Method({"POST"})
     */
    public function getJsonPeriodosCicloAno(Request $request) {
        $base = $this->get("reportes.base");
        $datos = json_decode($request->getContent(), true);
        $idciclo = $datos['ciclo'];
        $anos = $datos['anos'];
        $periodos = $base->utilModel->consultarPeriodosCicloAno($idciclo, $anos);
        $resultado['periodos'] = $periodos;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonPeriodosAno")
     * @Method({"GET"})
     */
    public function getJsonPeriodosAno(Request $request) {
        $base = $this->get("reportes.base");
        $datos = json_decode($request->getContent(), true);
        $anos = $datos['anos'];
        $empresa = $base->idEmpresa ;
        $periodos = $base->utilModel->consultarPeriodosAno($anos, $empresa);
        $resultado['periodos'] = $periodos;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonPeriodos")
     * @Method({"GET"})
     */
    public function getJsonPeriodos() {
        $base = $this->get("reportes.base");
        $periodos = $base->utilModel->periodos();
        $resultado['periodos'] = $periodos;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getConsultarPeriodos")
     * @Method({"GET"})
     */
    public function consultarPeriodos() {
        $base = $this->get("reportes.base");
        $periodos = $base->utilModel->consultarPeriodos($base->idEmpresa);
        $resultado['periodos'] = $periodos;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonLiquidacionesFacturadas")
     * @Method({"POST"})
     */
    public function liquidacionesFacturadas(Request $request) {
        $base = $this->get("reportes.base");
        $datos = json_decode($request->getContent(), true);
        $idorden = $datos['idordenperiodo'];
        $anos = $datos['anos'];
        $liquidaciones = $base->utilModel->consultarLiquidacionesFacturadas($idorden, $anos, $base->idEmpresa);
        $resultado['liquidaciones'] = $liquidaciones;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonListarAnos")
     * @Method({"GET"})
     */
    public function getJsonListarAnos() {
        $base = $this->get("reportes.base");
        $periodos = $base->utilModel->listarAnos();
        $resultado['anos'] = $periodos;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonNovedades")
     * @Method({"GET"})
     */
    public function getJsonNovedades() {
        $base = $this->get("reportes.base");
        $novedades = $base->utilModel->consultarNovedadesLecturas();
        $resultado['novedades'] = $novedades;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonTiposUso")
     * @Method({"GET"})
     */
    public function getJsonTiposUso() {
        $base = $this->get("reportes.base");
        $tiposUso = $base->utilModel->consultarTiposUso();
        $resultado['tiposUso'] = $tiposUso;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonTiposUsoEmpresa")
     * @Method({"GET"})
     */
    public function getJsonTiposUsoPorEmpresa() {
        $base = $this->get("reportes.base");
        $parametros['idclase'] = CLASE_TIPOUSOSUSCRIPCION;
        $parametros['idempresa'] = $base->idEmpresa;
        $tiposUso = $base->utilModel->consultarTipoUsoPorEmpresa($parametros);
        $resultado['tiposUso'] = $tiposUso;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonTiposUsoIndustrialComercial")
     * @Method({"GET"})
     */
    public function getJsonTiposUsoIndustrialComercial() {
        $base = $this->get("reportes.base");
        $tiposUso = $base->utilModel->consultarTiposUsoIndustiralComercial();
        $resultado['tiposuso'] = $tiposUso;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonTiposSuspension")
     * @Method({"GET"})
     */
    public function getJsonTiposSuspension() {
        $base = $this->get("reportes.base");
        $resultadoQuery = $base->utilModel->consultarTiposSuspension();
        $resultado['datos'] = $resultadoQuery;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonMotivosSuspension")
     * @Method({"GET"})
     */
    public function getJsonMotivosSuspension() {
        $base = $this->get("reportes.base");
        $resultadoQuery = $base->utilModel->consultarMotivosSuspension();
        $resultado['datos'] = $resultadoQuery;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonMotivosReconexion")
     * @Method({"GET"})
     */
    public function getJsonMotivosReconexion() {
        $base = $this->get("reportes.base");
        $resultadoQuery = $base->utilModel->consultarMotivosReconexion();
        $resultado['datos'] = $resultadoQuery;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonNovedadesSuspension")
     * @Method({"GET"})
     */
    public function getJsonNovedadesSuspension() {
        $base = $this->get("reportes.base");
        $resultadoQuery = $base->utilModel->consultarNovedadesSuspension();
        $resultado['datos'] = $resultadoQuery;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonNovedadesReconexion")
     * @Method({"GET"})
     */
    public function getJsonNovedadesReconexion() {
        $base = $this->get("reportes.base");
        $resultadoQuery = $base->utilModel->consultarNovedadesReconexion();
        $resultado['datos'] = $resultadoQuery;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonProyectos")
     * @Method({"GET"})
     */
    public function getJsonProyectos() {
        $base = $this->get("reportes.base");
        $proyectos = $base->modeloGenerico->getMunicipiosPorPerfil($base->idUsuario, $base->idEmpresa);
        $resultado['proyectos'] = $proyectos;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonBarrios/{idmunicipio}")
     * @Method({"GET"})
     */
    public function getJsonBarrios($idmunicipio) {
        $base = $this->get("reportes.base");
        $barrios = $base->modeloGenerico->getBarrios($idmunicipio);
        $resultado['barrios'] = $barrios;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonEstadosVenta")
     * @Method({"GET"})
     */
    public function getJsonEstadosVenta() {
        $base = $this->get("reportes.base");
        $estadosVenta[] = array("id" => "P", "label" => "Pendiente");
        $estadosVenta[] = array("id" => "A", "label" => "Aprobada");
        $estadosVenta[] = array("id" => "F", "label" => "Facturada");
        $estadosVenta[] = array("id" => "E", "label" => "Eliminada");
        $resultado['items'] = $estadosVenta;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonLiquidaciones")
     * @Method({"GET"})
     */
    public function getJsonLiquidaciones() {
        $base = $this->get("reportes.base");
        $resultado['items'] = $base->utilModel->consultarLiquidaciones();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonConceptosLiquidacion/{liquidacion}")
     * @Method({"GET"})
     */
    public function getJsonConceptos($liquidacion) {
        $base = $this->get("reportes.base");

        $conceptosPlanos = $base->utilModel->consultarConceptosLiquidacion($liquidacion);
        $conceptosInteres = $base->utilModel->consultarConceptosLiquidacionInteres($liquidacion);
        $resultado['conceptosPlanos'] = $conceptosPlanos;
        $resultado['conceptosInteres'] = $conceptosInteres;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonCajeros")
     * @Method({"GET"})
     */
    public function getJsonCajeros() {
        $base = $this->get("reportes.base");
        $resultado['items'] = $base->utilModel->consultarCajeros();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonCajerosActivos")
     * @Method({"GET"})
     */
    public function getJsonCajerosActivos() {
        $base = $this->get("reportes.base");
        $codemp = $base->idEmpresa;
        $resultado['items'] = $base->utilModel->consultarCajerosActivos($codemp);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonTipoOperacion")
     * @Method({"GET"})
     */
    public function getJsonTipoOperacion() {
        $base = $this->get("reportes.base");
        //$periodos = $base->utilModel->consultarPeriodosCiclo($ciclo);
        $operacion = $base->utilModel->consultarTipoOperacion($base->idUsuario);
        $resultado['operaciones'] = $operacion;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonNovedadLec")
     * @Method({"GET"})
     */
    public function getJsonNovedadLec() {
        $base = $this->get("reportes.base");
        //$periodos = $base->utilModel->consultarPeriodosCiclo($ciclo);
        $novedad = $base->utilModel->consultarNovedadLectura();
        $resultado['novedades'] = $novedad;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonProyecto")
     * @Method({"GET"})
     */
    public function getJsonProyecto() {
        $base = $this->get("reportes.base");
        //$periodos = $base->utilModel->consultarPeriodosCiclo($ciclo);
        $proyecto = $base->utilModel->consultarProyecto();
        $resultado['proyectos'] = $proyecto;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
    /**
     * @Route("/getJsonProyectosEmpresa")
     * @Method({"GET"})
     */
    public function getJsonProyectosEmpresa() {
        $base = $this->get("reportes.base");
        $codemp = $base->idEmpresa;
        $proyecto = $base->utilModel->mostrarProyectos($codemp);
        $resultado['proyectos'] = $proyecto;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonLiquidacionesVentas")
     * @Method({"GET"})
     */
    public function getJsonLiquidacionesVentas() {
        $base = $this->get("reportes.base");
        $resultado['items'] = $base->utilModel->consultarLiquidacionesVentas();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonDocumentoPostventas")
     * @Method({"GET"})
     */
    public function getJsonDocumentoPostventas() {
        $base = $this->get("reportes.base");
        $resultado['items'] = $base->utilModel->consultarDocumentosPostventa();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonTerceroInfo/{tercero}")
     * @Method({"GET"})
     */
    public function getJsonTerceroInfo($tercero) {
        $base = $this->get("reportes.base");
        $resultado = $base->utilModel->terceroInfo($tercero);

        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/buscarTerceroInfo/{search}/{tipo}")
     * @Method({"GET"})
     */
    public function buecarTerceroPorNombreInfo($search, $tipo, Request $request) {
        $base = $this->get("reportes.base");
        $utilModel = new \Reportes\ReportesBundle\Models\UtilModel($base->conexion);
        $resultado['terceros'] = $utilModel->consultarTercerosInfo($search, $tipo);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonLiquidacionesMinas")
     * @Method({"GET"})
     */
    public function getJsonLiquidacionesMinas() {
        $base = $this->get("reportes.base");
        $resultado['items'] = $base->utilModel->consultarLiquidacionesVentasMinas();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonLiquidacionPostventas")
     * @Method({"GET"})
     */
    public function getJsonLiquidacionPostventas() {
        $base = $this->get("reportes.base");
        $resultado['items'] = $base->utilModel->consultarLiquidacionPostventa();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonTipoMovimiento")
     * @Method({"GET"})
     */
    public function getJsonTipoMovimiento() {
        $base = $this->get("reportes.base");
        $resultado['items'] = $base->utilModel->consultarEmv($base->idUsuario);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonRutas")
     * @Method({"GET"})
     */
    public function getJsonRutas() {
        $base = $this->get("reportes.base");
        $resultado['rutas'] = $base->utilModel->consultarRutas();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonRutasCiclo/{ciclo}")
     * @Method({"GET"})
     */
    public function getJsonRutasCiclo($ciclo) {
        $base = $this->get("reportes.base");
        $resultado['rutas'] = $base->utilModel->consultarRutasCiclo($ciclo);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonMotivo/{tipo}")
     * @Method({"GET"})
     */
    public function getJsonMotivo($tipo) {
        $base = $this->get("reportes.base");
        if ($tipo == 1) {
            $motivos = $base->utilModel->consultarMotivoSupension();
        }
        if ($tipo == 2) {
            $motivos = $base->utilModel->consultarMotivoReconexion();
        }
        $resultado['resultados'] = $motivos;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * Inicio de modificacion Julian Poveda
     */

    /**
     * @Route("/getJsonFiltroSuspension/{filtro}")
     * @Method({"GET"})
     */
    public function getJsonFiltroSuspension($filtro) {
        $base = $this->get("reportes.base");
        if ($filtro == 2) {
            $filtros_suspension = $base->utilModel->consultarFiltroSuspension();
        } else {
            $filtros_suspension = null;
        }
        $resultado['filtros_suspension'] = $filtros_suspension;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * Fin de modificacion Julian Poveda
     */

    /**
     * @Route("/getJsonMercados")
     * @Method({"GET"})
     */
    public function getJsonMercados() {
        $base = $this->get("reportes.base");
        $resultado['mercados'] = $base->utilModel->consultarMercado($base->idEmpresa);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonMediosPagos")
     * @Method({"GET"})
     */
    public function getJsonMediosPagos() {
        $base = $this->get("reportes.base");
        $resultado['medospagos'] = $base->utilModel->consultarMediosPagoUsuarioEmpresa($base->idEmpresa, $base->idUsuario);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonCiclosGeneral")
     * @Method({"GET"})
     */
    public function getJsonCiclosGeneral() {
        $base = $this->get("reportes.base");
        $resultado['ciclos'] = $base->utilModel->consultarCiclosGeneral();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonPeriodosCicloActivos/{idciclo}")
     * @Method({"GET"})
     */
    public function getJsonPeriodosCicloActivos($idciclo) {
        $base = $this->get("reportes.base");
        $periodos = $base->utilModel->consultarPeriodosActivos($idciclo);
        $resultado['periodos'] = $periodos;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonBancosGeneral")
     * @Method({"GET"})
     */
    public function getJsonBancosGeneral() {
        $base = $this->get("reportes.base");
        $resultado['bancos'] = $base->utilModel->consultarBancosGeneral();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonCiclosGeneralEmpresa/{programa}")
     * @Method({"GET"})
     */
    public function getJsonCiclosGeneralEmpresa($programa) {
        $base = $this->get("reportes.base");
        $resultado['ciclos'] = $base->utilModel->consultarCiclosGeneralEmpresa($base->idEmpresa, $programa);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonBarriosPorNombre/{palabraclave}")
     * @Method({"GET"})
     */
    public function getJsonBarriosPorNombre($palabraclave) {
        $base = $this->get("reportes.base");
        $resultado['barrios'] = $base->utilModel->consultarBarriosPorNombre($base->idEmpresa, $palabraclave);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonUsuarioAnno/{usuario}")
     * @Method({"GET"})
     */
    public function getJsonUsuarioAnno($usuario) {
        $base = $this->get("reportes.base");
        $empleado = $base->idUsuario;
        $annos = $base->utilModel->consultarUsuarioAnnos($usuario, $empleado);
        $resultado['annos'] = $annos;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/buscarMviGeneral")
     * @Method({"GET"})
     */
    public function buscarMviGeneral() {
        $base = $this->get("reportes.base");
        $empleado = $base->idUsuario;
        $empresa = $base->idEmpresa;
        $resultado['mvi'] = $base->utilModel->consultarListaMvi($empleado, $empresa);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getDocumentos")
     * @Method({"GET"})
     */
    public function getDocumentos() {
        $base = $this->get("reportes.base");
        $empleado = $base->idUsuario;
        $resultado['documentos'] = $base->utilModel->consultarListaDocumentos($empleado);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getTiposDocumento")
     * @Method({"GET"})
     */
    public function getTiposDocumento() {
        $base = $this->get("reportes.base");
        $empleado = $base->idUsuario;
        $resultado['tiposDocumento'] = $base->utilModel->consultarListaTiposDocumento($empleado);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getConceptos")
     * @Method({"GET"})
     */
    public function getConceptos() {
        $base = $this->get("reportes.base");
        $empleado = $base->idUsuario;
        $resultado['conceptos'] = $base->utilModel->consultarListaConceptos($empleado);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getJsonPermisoHistorico")
     * @Method({"GET"})
     */
    public function getJsonPermisoHistorico() {
        $base = $this->get("reportes.base");
        $empresa = $base->idEmpresa;
        $empleado = $base->idUsuario;
        $ideunidad = $base->utilModel->consultaPermisoUsuario($empresa, $empleado);
        $resultado['ideunidad'] = $ideunidad;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }

    /**
     * @Route("/getConsultarPeriodosPorAno")
     * @Method({"POST"})
     */
    public function consultarPeriodosPorAno(Request $request) {
        $base = $this->get("reportes.base");
        $datos = json_decode($request->getContent(), true);
        $anno = $datos['anos'];
        $idempresa = $base->idEmpresa;
        $periodos = $base->utilModel->periodosPorAno($anno, $idempresa);
        $resultado['periodos'] = $periodos;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
    /**
     * @Route("/getConsultarPeriodosPorAnoAce")
     * @Method({"POST"})
     */
    public function consultarPeriodosPorAnoAce(Request $request) {
        $base = $this->get("reportes.base");
        $datos = json_decode($request->getContent(), true);
        $anno = $datos['anos'];
        $idempresa = $base->idEmpresa;
        $periodos = $base->utilModel->periodosPorAnoCicloAce($anno, $idempresa);
        $resultado['periodos'] = $periodos;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
    /**
     * @Route("/getConsultarPeriodosPorAnoGeneral")
     * @Method({"POST"})
     */
    public function consultarPeriodosPorAnoGeneral(Request $request) {
        $base = $this->get("reportes.base");
        $datos = json_decode($request->getContent(), true);
        $anno = $datos['anos'];
        $idempresa = $base->idEmpresa;
        $periodos = $base->utilModel->periodosPorAnoCicloGeneral($anno, $idempresa);
        $resultado['periodos'] = $periodos;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
    
    /**
     * @Route("/getJsonCajeroMedPago/{idMedioPago}")
     * @Method({"GET"})
     */
    public function getJsonCajeroMedPago($idMedioPago) {
        $base = $this->get("reportes.base");
        
        $parametros ['uni_metpago']= $idMedioPago;
        $parametros ['emp_codsev']= $base->idEmpresa ;    
        $cajeros = $base->utilModel->consultarCajeroMedPago($parametros);
        $resultado['cajeros'] = $cajeros;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
      /**
     * @Route("/getJsonMercadosActivos")
     * @Method({"GET"})
     */
    public function getJsonMercadosActivos() {
        $base = $this->get("reportes.base");
        
        $parametros ['emp_codsev']= $base->idEmpresa ;    
        $mercados = $base->utilModel->consultarMercadosEmpresa($parametros);
        $resultado['mercados'] = $mercados;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
     /**
     * @Route("/consultaPeriodosTarifas")
     * @Method({"GET"})
     */
     public function consultaPeriodosTarifas()
     {
       $base = $this->get("reportes.base"); 
       $parametros ['idempresa']= $base->idEmpresa ; 
       $periodo = $base->utilModel->consultaPeriodosTarifas($parametros);
       $resultado['periodo'] = $periodo;
       return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);  
     }
     
     /**
     * @Route("/consultarEmpresaGeneral")
     * @Method({"GET"})
     */
    public function consultarEmpresaGeneral() {
        $base = $this->get("reportes.base");
        $empresas = $base->utilModel->consultarEmpresaGeneral();
        $resultado['empresas'] = $empresas;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
    /**
     * @Route("/getConsultarCategoriaEmpresa/{empresa}")
     * @Method({"GET"})
     */
    public function  getConsultarCategoriaEmpresa($empresa) {
        $base = $this->get("reportes.base");
        $categorias = $base->utilModel->consultarCategoriaEmpresa($empresa);
        $resultado['categorias'] = $categorias;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
    /**
     * @Route("/getConsultaUnidadesCategoria/{categoria}")
     * @Method({"GET"})
     */
    public function  getConsultaUnidadesCategoria($categoria) {
        $base = $this->get("reportes.base");
        $unidades = $base->utilModel->consultaUnidadesCategoria($categoria);
        $resultado['unidades'] = $unidades;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
     /**
     * @Route("/consultarReporteUnidades")
     * @Method({"GET"})
     */
    public function consultarReporteUnidades() {
        $base = $this->get("reportes.base");
        $empresas = $base->utilModel->consultarReporteUnidades();
        $resultado['reporteUnidades'] = $empresas;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
    /**
     * @Route("/getConsultarCiclosEmpresaReporte/{empresa}")
     * @Method({"GET"})
     */
    public function  getConsultarCiclosEmpresaReporte($empresa) {
        $base = $this->get("reportes.base");
        $ciclos = $base->utilModel->consultaCiclosEmpresaReportes($empresa);
        $resultado['ciclos'] = $ciclos;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
    /**
     * @Route("/getConsultarProyectoEmpresaReporte/{empresa}")
     * @Method({"GET"})
     */
    public function  getConsultarProyectoEmpresaReporte($empresa) {
        $base = $this->get("reportes.base");
        $proyectos = $base->utilModel->consultaProyectosEmpresaReportes($empresa);
        $resultado['proyectos'] = $proyectos;
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultado);
    }
    
    

}
