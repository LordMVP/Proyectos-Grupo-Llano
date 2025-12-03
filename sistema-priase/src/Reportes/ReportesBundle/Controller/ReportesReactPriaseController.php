<?php

namespace Reportes\ReportesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Reportes\ReportesBundle\JasperBridge\ReportManager;
use Reportes\ReportesBundle\JasperBridge\JasperUtil;
use Symfony\Component\HttpFoundation\Request;
use Reportes\ReportesBundle\Models\RecaudosReportesModel;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Llanogas\LlanogasBundle\MyException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;


class ReportesReactPriaseController extends Controller {

    public function __construct() {
        
    }
    
    /**
     * @Route("/{ruta}")
     * @Method({"GET"})    
     */
     public function indexReportesReactPriase(){
    $parameters['version'] = time();
        return $this->render('ReportesBundle:ReportesReactPriase:index.html.twig', $parameters);        
    }

    
    

}
