<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;

/**
 * Description of UtilController
 *
 * @author jsvanegas
 */
class UtilController extends Controller {

    /**
     * Obtiene la fecha y hora del sistema
     * @return json
     */
    public function obtenerFechaServidorAction() {
        $respuesta = array();
        $respuesta['codigoRespuesta'] = 1;
        $respuesta['fecha'] = date('Y/m/d H:i:s');
        
        return Util::construyeRespuesta($respuesta);
    }

}
