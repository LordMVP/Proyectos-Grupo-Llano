<?php
namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Request;

class DefaultReactController extends Controller
{   
     /**
     * @Route("/ventasreact")
     * @Method({"GET"})
     * @Template("LlanogasLlanogasBundle:Ventas:IndexVentasReact.html.twig") 
     */
    public function indexVentasReactAction($ruta =null)
    {  
       $parameters['version'] = time();
       return $parameters;
       
    }
      /**
     * @Route("/suscriptorreact")
     * @Method({"GET"})
     * @Template("LlanogasLlanogasBundle:Suscriptor:IndexSuscriptorReact.html.twig") 
     */
    public function indexSuscriptorReactAction($ruta =null)
    {
      $parameters['version'] = time();
       return $parameters;
       
    }
       
         
}