<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Controller;

/**
 * Description of DefaultTableController
 *
 * @author jpsierra
 */


use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

abstract class DefaultTableController extends \Symfony\Bundle\FrameworkBundle\Controller\Controller {
    
    
    /**
     *@return \Reportes\ReportesBundle\Models\DynamicTableModel Model of table
     */    
    protected abstract function getModel($conexion);

        /**
     * @Route("/getData")
     * @Method({"POST","GET"})
     * */
    public function getInfo(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(), true);
        $page = $requestContent["page"];
        $count = $requestContent["count"];
        $extra = isset($requestContent["extra"])?$requestContent["extra"]:null;      
        $model = $this->getModel($base->conexion);
        $resultados = $model->mainQuery($page, $count,$extra);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultados);
    }

    /**
     * @Route("/getColumns")
     * @Method({"POST","GET"})
     * */
    public function getColumns() {
        $base = $this->get("reportes.base");
        $model = $this->getModel($base->conexion);
        $respuesta['columnas'] = $model->getColumns();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($respuesta);        
    }
    
}
