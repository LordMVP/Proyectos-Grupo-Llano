<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Control para generar los créditos que se han facturado
 * @author AppFuture
 */
class FacturacionCreditosController extends Controller {

    /**
     * @Route("facturacion_credito")
     * @Method({"GET"})
     * @Template("ReportesBundle:Potenza:facturacionCreditos.html.twig")
     */
    public function facturacionCreditos() {
        $base = $this->get("reportes.base");
        $empresas = $base->utilModel->consultarEmpresas();
        $parametros['convenios'] = $empresas;
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }

    /**
     * @Route("reporte_facturacion_creditos")
     * @Method({"POST"})
     */
    public function generarInformeCreditos(Request $request) {
        try {
            $base = $this->get("reportes.base");
            $info = json_decode($request->getContent(), true);

            $params['PR_STR_TITULO_REPORTE'] = "REPORTE FACTURACIÓN MES " . strtoupper($info['nombreperiodo']);
            $params['PR_STR_CONDICION'] = "";
            $params['PR_INT_ID_EMPRESA'] =  $base->idEmpresa;
            if (isset($info['idconvenio'])) {
                $params['PR_STR_CONDICION'] = " AND teremp.ter_ideregistro = " . $info['idconvenio'];
            }
            $params['PR_INT_ID_PERIODO'] = $info['idperiodo'];

            set_time_limit(3600);
            $report = $base->getReportObject("FacturacionCreditos.jrxml", $params, "xlsx", true, JASPER_REPORTS_JNDI_POTENZA);
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($report);
            return JasperUtil::getJSONPathResponse($manager);
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }

    /**
     * @Route("reporte_Factura_Computador")
     * @Method({"POST"})
     */
    public function generarFacturaCreditos(Request $request) {
        try {
            $base = $this->get("reportes.base");
            $info = json_decode($request->getContent(), true);

            $params['PR_STR_CONDICION'] = "";
            $params['PR_INT_ID_EMPRESA'] =  $base->idEmpresa;
            if (isset($info['idconvPR_STR_CONDICIONenio'])) {
                $params['PR_STR_CONDICION'] = " AND teremp.ter_ideregistro = " . $info['idconvenio'];
            }
            if (isset($info['idfinanciacion'])) {
                $params['PR_STR_CONDICION'] = $params['PR_STR_CONDICION'] + " AND fcc.fin_ideregistro = " . $info['idfinanciacion'];
            }
            $params['PR_INT_ID_PERIODO'] = $info['idperiodo'];

            set_time_limit(3600);
            $report = $base->getReportObject("Fomato_Factura_computador.jrxml", $params, "pdf", true, JASPER_REPORTS_JNDI_POTENZA);
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($report);
            return JasperUtil::getJSONPathResponse($manager);
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }

}
