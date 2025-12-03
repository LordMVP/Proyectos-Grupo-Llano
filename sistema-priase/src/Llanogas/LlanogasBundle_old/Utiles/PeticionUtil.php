<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Utiles;

/**
 * Description of PeticionUtil
 *
 * @author god
 */
class PeticionUtil {

    /**
     * Realiza una petición 
     * @param string $url Ruta del servicio a invocar
     * @param array $parametros Lista de los parámetros a enviar 
     * @param type $metodo POST o GET 
     * @return type
     */
    public static function ejecutar($url, $parametros) {
        if (!empty($parametros)) {
            $url = $url . '?' . http_build_query($parametros);
        }
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_TIMEOUT, 50000000);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 50000000000);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $data = curl_exec($ch);
        curl_close($ch);
        return $data;
    }

}
