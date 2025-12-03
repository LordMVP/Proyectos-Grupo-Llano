<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ReportesDefaultModel
 *
 * @author jpsierra
 */
namespace Reportes\ReportesBundle\Models;

class ReportesDefaultModel extends \Llanogas\LlanogasBundle\AuditoriaServices  {

    public function ajustarParametros($parametros) {
        $parametrosSanos = array();
        foreach ($parametros as $key => $value) {
            if ($value == null) {
                $parametrosSanos[$key] = "NULL";
            } else {
                $parametrosSanos[$key] = $value;
            }
        }
        return $parametrosSanos;
    }

}
