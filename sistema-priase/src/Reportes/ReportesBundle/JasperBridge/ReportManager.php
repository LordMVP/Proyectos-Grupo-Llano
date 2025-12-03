<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ReportManager
 *
 * @author jpsierra
 */

namespace Reportes\ReportesBundle\JasperBridge;

class ReportManager {

    //put your code here

    private $serviceURL;
    private $response;
    private $responseJSON;
    private $information;
    private $responseObject;
    private $error;
    private $defaultParameters;

    public function __construct($serviceURL = null) {
        if ($serviceURL == null) {
            $this->serviceURL = WEB_SERVICE_JASPER_REPORT;
        } else {
            $this->serviceURL = $serviceURL;
        }
        $this->defaultParameters = unserialize(DEFAULT_JASPER_REPORT_PARAMETERS);
        //$this->defaultParameters['PRG_STR_USUARIO']=$idUsuario;
    }

    public function executeReport($report) {
        $report['parameters'] = array_merge($this->defaultParameters, $report['parameters']);
        $data_string = json_encode($report);
        $curl = curl_init($this->serviceURL);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data_string))
        );
        $this->response = curl_exec($curl);
        $this->error = curl_errno($curl);
        $this->information = curl_getinfo($curl);
        $this->responseJSON = json_decode($this->response, true);
        $this->responseObject = json_decode($this->response, true);
        $this->responseObject['content'] = $this->getResponseDecodeContentBase64();
        curl_close($curl);
    }
    
    public function executeReportBytes($report) {
        $report['parameters'] = array_merge($this->defaultParameters, $report['parameters']);
        
        $data_string = json_encode($report);
        $curl = curl_init($this->serviceURL);
	$fileName = "report_".mt_rand().".".$report['format'];
	$filePath = RUTA_REPORTES_GRANDES;
	$reportPath=$filePath.$fileName;
	$file = fopen($reportPath,"w+");
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl,CURLOPT_FILE,$file);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data_string))
        );
        curl_exec($curl);
        $this->error = curl_errno($curl);
        $this->reportPath = $fileName;
        $this->size = filesize($reportPath);
        $this->format = $report['format'];
        curl_close($curl);
    }	

    public function getResponseDecodeContentBase64() {
        if (isset($this->responseJSON['content'])) {
            return base64_decode($this->responseJSON['content']);
        } else {
            return null;
        }
    }

    public function getResponseJson() {
        return $this->responseJSON;
    }

    public function getResponseObject() {
        return $this->responseObject;
    }

    function getInformation() {
        return $this->information;
    }

    function getError() {
        return $this->error;
    }

    function setInformation($information) {
        $this->information = $information;
    }

    function setError($error) {
        $this->error = $error;
    }

    function isNotContent() {
        return $this->getResponseObject()['noContent'];
    }

}
