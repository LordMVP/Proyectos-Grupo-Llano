<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Reportes\ReportesBundle\JasperBridge\GatewayService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class AdminController extends Controller {

    /**
     * @Route("/admin")
     * @Method({"GET"})
     */
    public function indexAction() {
        $base = $this->get("reportes.base");
        return $this->render('ReportesBundle:Admin:index.html.twig', $base->parametrosBasicos);
    }

    /**
     * @Route("/cargarReporte")
     * @Method({"GET","POST"})
     */
    public function cargarReporteAction(Request $request) {
        $uploadedFile = $request->files->get('fileReport');
        $fileContentBase64 = base64_encode(file_get_contents($uploadedFile));
        $fileName = $uploadedFile->getClientOriginalName();
        $fileInformation = array("fileName" => $fileName, "pathFile" => JASPER_REPORTS_PATH, "fileContent" => $fileContentBase64);
        $gatewayService = new GatewayService(WEB_SERVICE_GATEWAY_REPORT);
        $response = $gatewayService->transferFile($fileInformation);
        return new \Symfony\Component\HttpFoundation\Response(json_encode($response), 200, array('Content-Type' => 'application/json'));
    }

    public function downloadReportAction($id) {
        $fichero = RUTA_REPORTES_GRANDES.$id;
        //echo $fichero;
         if (file_exists($fichero)) {
            $response = new BinaryFileResponse($fichero);
            $response->headers->set('Content-Type', 'application/octet-stream');
            return $response;
         }        
    }
    
    /**
     * @Route("/admin/download/{id}")
     * @Method({"GET"})
     */
    public function downloadReport($id) {
        $fichero = RUTA_REPORTES_GRANDES.$id;
        //echo $fichero;
         if (file_exists($fichero)) {
            $response = new BinaryFileResponse($fichero);
            $response->headers->set('Content-Type', 'application/octet-stream');
            return $response;
         } 
        
    }

    /**
     * @Route("/admin/reportes")
     * @Method({"GET"})
     */
    public function adminReports() {
        $base = $this->get("reportes.base");
        $parametros = $base->parametrosBasicos;
        return $this->render('ReportesBundle:Admin:reportes.html.twig', $parametros);
    }

    /**
     * @Route("/admin/getReportsJson")
     * @Method({"GET","POST"})
     */
    public function getReportsJson() {
        $base = $this->get("admin.reportes");
        $reportsJson = $base->getReportsJson();
        return new Response($reportsJson, 200, array('Content-Type' => 'application/json'));
    }

    public function testReport() {
        $base = $this->get("admin.reportes");
        $reports = $base->getReports();
    }

}
