<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of JasperUtil
 *
 * @author jpsierra
 */

namespace Reportes\ReportesBundle\JasperBridge;

use Symfony\Component\HttpFoundation\Response;
use Reportes\ReportesBundle\JasperBridge\ReportManager;

class JasperUtil {

    //put your code here

    const PDF = "pdf";
    const XLSX = "xlsx";
    const DOCX = "docx";
    const ODS = "ods";
    const ODT = "odt";
    const HTML = "html";
    const TXT = "txt";
    const RTF = "rtf";
    const CSV = "csv";

    public static function getReportErrorResponse(ReportManager $manager) {
        $message = $manager->getResponseJson()['message'];
        $message['codigoRespuesta'] = -1;
        $message['mensajeError'] = "Error en la invocacion del reporte, falla en el servidor de glassfish";
        return new Response(json_encode($message), 500, array('Content-Type' => 'application/json'));
    }

    public static function getExecutionErrorResponse(ReportManager $manager) {
        $info = $manager->getInformation();
        return new Response("Error de invocacion de web service", $info['http_code'], array('Content-Type' => 'application/json'));
    }

    public static function getPDFResponse(ReportManager $manager, $fileName) {
        return new Response($manager->getResponseDecodeContentBase64(), 200, array('Content-Type' => 'application/pdf', "Content-Disposition" => "attachment; filename=" . $fileName . ".pdf"));
    }

    public static function getExcelResponse(ReportManager $manager, $fileName) {
        return new Response($manager->getResponseDecodeContentBase64(), 200, array('Content-Type' => 'application/xlsx', "Content-Disposition" => "attachment; filename=" . $fileName . ".xlsx"));
    }

    private static function getErrorMessageAjax() {
        $message = array("codigoRespuesta" => -1, "mensajeError" => "Error en la ejecucion del reporte");
        return $message;
    }

    public static function getJSONPathResponse(ReportManager $manager) {
        if (!$manager->getError()) {            
            $json = array("id" => $manager->reportPath,"size"=>$manager->size,"format"=>$manager->format);
            return new Response(json_encode($json), 200, array('Content-Type' => 'application/json'));
        }
    }

    public static function getJSONBase64Response(ReportManager $manager, $fileName, $debug = false) {
        if (!$manager->getError()) {
            $json = $manager->getResponseJson();
            if ($json['error']) {
                if ($debug == true) {
                    $json = array_merge($json, self::getErrorMessageAjax());
                } else {
                    return new Response(json_encode(self::getErrorMessageAjax()), 200, array('Content-Type' => 'application/json'));
                }
            }
            $json['fileName'] = $fileName;
            return new Response(json_encode($json), 200, array('Content-Type' => 'application/json'));
        } else {
            return self::getReportErrorResponse($manager);
        }
    }

    public static function processPDFResponse(ReportManager $manager) {
        $response = $manager->getResponseJson();
        if (!$response['error']) {
            return self::getPDFResponse($manager);
        } else {
            return self::getReportErrorResponse($manager);
        }
    }

    public static function processExcelResponse(ReportManager $manager) {
        $response = $manager->getResponseJson();
        if (!$response['error']) {
            return self::getExcelResponse($manager);
        } else {
            return self::getReportErrorResponse($manager);
        }
    }

    public static function processResponse(ReportManager $manager, $fileName = "REPORTE") {
        $response = $manager->getResponseJson();
        if (!$response['error']) {
            if ($response['statusCode'] == 204) {
                return new Response("Pagina sin contenido", 204);
            }
            if ($response['statusCode'] == 500) {
                return new Response("Error de ejecucion del servicio: " . $response['message'], 500);
            }
            switch ($response['format']) {
                case "pdf":return self::getPDFResponse($manager, $fileName);
                case "xlsx": return self::getExcelResponse($manager, $fileName);
            }
            return self::getReportErrorResponse($manager);
        } else {
            return self::getReportErrorResponse($manager);
        }
    }

    public static function parseParams($params) {
        $newParams = array();
        foreach ($params as $key => $value) {
            if (ereg("PR_INT_.*", $key)) {
                $newParams[$key] = intval($value);
            } else if (ereg("PR_STR_.*", $key)) {
                $newParams[$key] = strval($value);
            } else {
                $newParams[$key] = $value;
            }
        }
        return $newParams;
    }

}
