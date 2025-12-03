<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of GatewayService
 *
 * @author jpsierra
 */
namespace Reportes\ReportesBundle\JasperBridge;
class GatewayService {

    //put your code here
    private $serviceURL;
    private $response;

    public function __construct($serviceURL = null) {
        if ($serviceURL == null) {
            $this->serviceURL = WEB_SERVICE_JASPER_REPORT;
        } else {
            $this->serviceURL = $serviceURL;
        }
    }

    public function transferFile($fileInformation) {
        
        $data_string = json_encode($fileInformation);
        $curl = curl_init($this->serviceURL);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data_string))
        );
        $this->error = curl_errno($curl);
        if (!$this->error) {
            $this->information = curl_getinfo($curl);
        }
        $this->response = curl_exec($curl);
        curl_close($curl);
        return json_decode($this->response,true);
    }

}
