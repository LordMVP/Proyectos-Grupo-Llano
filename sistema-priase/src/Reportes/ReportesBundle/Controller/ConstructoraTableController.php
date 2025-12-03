<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

class ConstructoraTableController extends Controller {

    /**
     * @Route("/getInfo")
     * @Method({"POST","GET"})
     * */
    public function getInfo(\Symfony\Component\HttpFoundation\Request $request) {
        $base = $this->get("reportes.base");
        $requestContent = json_decode($request->getContent(), true);
        $page = $requestContent["page"];
        $count = $requestContent["count"];
        $extra = isset($requestContent["extra"])?$requestContent["extra"]:null;        
        $model = new \Reportes\ReportesBundle\Models\ConstructoraTableModel($base->conexion);
        $resultados = $model->consultaPrincipal($page, $count,$extra);
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($resultados);
    }

    /**
     * @Route("/getColumns")
     * @Method({"POST","GET"})
     * */
    public function getColumns() {
        $base = $this->get("reportes.base");
        $model = new \Reportes\ReportesBundle\Models\ConstructoraTableModel($base->conexion);
        $respuesta['columnas'] = $model->getColumns();
        return \Llanogas\LlanogasBundle\Utiles\Util::construyeRespuesta($respuesta);        
    }

}
