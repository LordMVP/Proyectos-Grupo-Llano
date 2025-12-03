<?php

namespace Homafo\HomafoBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller {

    public function indexAction(Request $request, $ruta = null) {
        //Util::iniciarSesion($this);
        $parameters['version'] = time();
        return $this->render('HomafoHomafoBundle:Default:index.html.twig', $parameters);
    }

    public function apiAction(Request $request, $ruta = null) {   
    }
    
    public function kioAction(Request $request, $ruta = null){
        $respuesta = array();
        $respuesta["ruta"] = $ruta;
        return  Util::construyeRespuesta($respuesta);
    }
}
