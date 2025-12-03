<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\JasperBridge;

class ReporteConsulta
{
    //variables generales
    //private $resultado;
    
     public function __construct($serviceURL = null) {
        if ($serviceURL == null) {
            $this->serviceURL = WEB_SERVICE_JASPER_REPORT_CONTENT;
        } else {
            $this->serviceURL = $serviceURL;
        }
        $this->defaultParameters = unserialize(DEFAULT_JASPER_REPORT_PARAMETERS);
        //$this->defaultParameters['PRG_STR_USUARIO']=$idUsuario;
    }
    
    public function executeConsultar($parametros)
    {
         //datos a enviar
            //$data = array("a" => "a");
            //url contra la que atacamos
            $ch = curl_init($this->serviceURL);
            //a true, obtendremos una respuesta de la url, en otro caso, 
            //true si es correcto, false si no lo es
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            //establecemos el verbo http que queremos utilizar para la petición
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
            //enviamos el array data
            curl_setopt($ch, CURLOPT_POSTFIELDS,http_build_query($parametros));
            //obtenemos la respuesta
            $response = curl_exec($ch);
            // Se cierra el recurso CURL y se liberan los recursos del sistema
            curl_close($ch);
            if(!$response) {
                return false;
            }else{
                return $response;
            }
    }
    
    public function ejecutarConsulta($parametros)
    {
        //$data = array("name" => "Hagrid", "age" => "36");                                                                    
        $data_string = json_encode($parametros);                                                                                   

        $ch = curl_init($this->serviceURL);                                                                      
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
            'Content-Type: application/json',                                                                                
            'Content-Length: ' . strlen($data_string))                                                                       
        );                                                                                                                   

        $response = curl_exec($ch);
        return $response;
    }
}