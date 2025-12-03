<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Symfony\Component\HttpFoundation\Request;

/**
 * Controller que permite la descarga del reporte de los créditos desembolsados
 * @author AppFuture
 */
class CreditosDesembolsadosController extends Controller {

    /**
     *
     * @var ReporteBaseController 
     */
    private $base;

    /**
     * @Route("creditos_desembolsados")
     * @Method({"GET"})
     * @Template("ReportesBundle:Potenza:creditosDesembolsados.html.twig")
     */
    public function creditosDesembolsados() {
        $base = $this->get("reportes.base");
        $empresas = $base->utilModel->consultarEmpresas();
        $parametros['convenios'] = $empresas;
        $parametros = array_merge($base->parametrosBasicos, $parametros);
        return $parametros;
    }

    /**
     * @Route("reporte_creditos_desmbolsados")
     * @Method({"POST"})
     */
    public function reporteCreditosDesembolsados(Request $request) {
        try {
            $this->base = $this->get("reportes.base");
            $info = json_decode($request->getContent(), true);
            $params['PR_STR_FECHA_INICIAL'] = $info['fechainicio'];
            $params['PR_STR_FECHA_FINAL'] = $info['fechafin'] . " 23:59:59";
            $params['PR_STR_TITULO_REPORTE'] = "Reporte Créditos Desembolsados";
            $params['PR_STR_CONDICION'] = "";
            if (isset($info['rangoinicio']) && isset($info['rangofin'])) {
                $params['PR_STR_CONDICION'] .= ' AND tbltemp.valordesembolso BETWEEN ' . $info['rangoinicio'] . ' AND ' . $info['rangofin'];
            }
            if (isset($info['idconvenio'])) {
                $params['PR_STR_CONDICION'] .= ' AND ter.ter_ideregistro = ' . $info['idconvenio'];
            }
            if (isset($info['plazo'])) {
                $params['PR_STR_CONDICION'] .= ' AND tbltemp.plazo = ' . $info['plazo'];
            }
            if (isset($info['documentocliente'])) {
                $params['PR_STR_CONDICION'] .= " AND tbltemp.identificacion = '" . $info['documentocliente'] . "'";
            }
            set_time_limit(3600);

            $report = $this->base->getReportObject("creditosDesembolsados.jrxml", $params, "xlsx", true, JASPER_REPORTS_JNDI_POTENZA);
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($report);
            return JasperUtil::getJSONPathResponse($manager);
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }
    /**
     * @Route("plano_creditos_desmbolsados")
     * @Method({"POST"})
     */
    public function planoCreditosDesembolsados(Request $request) {
        try {
            $this->base = $this->get("reportes.base");
            $info = json_decode($request->getContent(), true);
            $params['PR_STR_FECHA_INICIAL'] = $info['fechainicio'];
            $params['PR_STR_FECHA_FINAL'] = $info['fechafin'] . " 23:59:59";
            $params['PR_STR_TITULO_REPORTE'] = "Reporte Créditos Desembolsados";
            $params['PR_STR_CONDICION'] = "";
            if (isset($info['rangoinicio']) && isset($info['rangofin'])) {
                $params['PR_STR_CONDICION'] .= ' AND tbltemp.valordesembolso BETWEEN ' . $info['rangoinicio'] . ' AND ' . $info['rangofin'];
            }
            if (isset($info['idconvenio'])) {
                $params['PR_STR_CONDICION'] .= ' AND ter.ter_ideregistro = ' . $info['idconvenio'];
            }
            if (isset($info['plazo'])) {
                $params['PR_STR_CONDICION'] .= ' AND tbltemp.plazo = ' . $info['plazo'];
            }
            if (isset($info['documentocliente'])) {
                $params['PR_STR_CONDICION'] .= " AND tbltemp.identificacion = '" . $info['documentocliente'] . "'";
            }
            set_time_limit(3600);
            if ($info['banco']== '1')
            {
                 $report = $this->base->getReportObject("creditosDesembolsadosPlano.jrxml", $params, "csv", true, JASPER_REPORTS_JNDI_POTENZA);
            }
            else
            {
                 $report = $this->base->getReportObject("creditosDesembolsadosPlano_Davivienda.jrxml", $params, "csv", true, JASPER_REPORTS_JNDI_POTENZA);
            }           
            $manager = new ReportManager(WEB_SERVICE_JASPER_REPORT_BYTES);
            $manager->executeReportBytes($report);
            return JasperUtil::getJSONPathResponse($manager);
        } catch (\Exception $e) {
            return new \Symfony\Component\HttpFoundation\Response($e->getMessage());
        }
    }

}
