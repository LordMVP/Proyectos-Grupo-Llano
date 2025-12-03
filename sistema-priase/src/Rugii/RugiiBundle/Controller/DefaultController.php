<?php

namespace Rugii\RugiiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{
    /**
     * @Route("/index", name="index")
     */
    public function indexAction()
    {
        return $this->render('RugiiRugiiBundle:Default:index.html.twig', []);
    }
    
    /**
     * @Route("/session", name="session")
     */
    public function sessionAction(Request $request)
    {
        $session=$request->getSession();
        $data=json_decode($request->getContent(),true);
        $result="ok";
        foreach($data as $key=>$value){
            $session->set($key, $value);
        }
        return new Response($result);
    }
    /**
     * @Route ("/home", name="home")
     */
    public function homeAction()
    {
        return $this->render('RugiiRugiiBundle:Default:index.html.twig', []);
    }
    
    /**
     * @Route("/registroOia", name="registerOia")
     */
    public function registerOiaAction()
    {
        return $this->render('RugiiRugiiBundle:Default:registerOIA.html.twig', []);
    }
     /**
     * @Route("/ciudades", name="ciudades")
     */
        public function ciudad()
        {
        $headers = array('Accept' => 'application/json');
        $wsurl=getenv("WS_BASE")."/ciudades";
        $response = Unirest\Request::get($wsurl,$headers);
        $key=getenv("TOKEN_KEY");
        $decoded = JWT::decode($response->raw_body,$key,array('HS256'));
        return new JsonResponse($decoded);
        }

      /**
     * @Route("/ciudades/{dpto}", name="ciudadesxdpto")
     */
	public function ciudadxdpto($dpto)
	{
	$headers = array('Accept' => 'application/json');
	$wsurl=getenv("WS_BASE")."/ciudades/";
	$response = Unirest\Request::get($wsurl.$dpto,$headers);
	$key=getenv("TOKEN_KEY");
	$decoded = JWT::decode($response->raw_body,$key,array('HS256'));
	return new JsonResponse($decoded);
	}
   	/**
     	* @Route("/departamentos", name="departamentos")
     	*/
        public function departamentos()
        {
        $headers = array('Accept' => 'application/json');
        $wsurl=getenv("WS_BASE")."/departamentos";
        $response = Unirest\Request::get($wsurl,$headers);
        $key=getenv("TOKEN_KEY");
        $decoded = JWT::decode($response->raw_body,$key,array('HS256'));
        return new JsonResponse($decoded);
        }
 	/**
        * @Route("/zonas", name="zonas")
        */
        public function zonas()
        {
        $headers = array('Accept' => 'application/json');
        $wsurl=getenv("WS_BASE")."/zonas";
        $response = Unirest\Request::get($wsurl,$headers);
        $key=getenv("TOKEN_KEY");
        $decoded = JWT::decode($response->raw_body,$key,array('HS256'));
        return new JsonResponse($decoded);
        }
        /**
        * @Route("/tipos_actividad", name="tipos_actividad")
        */
        public function tipos_actividad()
        {
        $headers = array('Accept' => 'application/json');
        $wsurl=getenv("WS_BASE")."/tipos_actividad";
        $response = Unirest\Request::get($wsurl,$headers);
        $key=getenv("TOKEN_KEY");
        $decoded = JWT::decode($response->raw_body,$key,array('HS256'));
        return new JsonResponse($decoded);
        }
        /**
        * @Route("/tipos_oia", name="tipos_oia")
        */
        public function tipos_oia()
        {
        $headers = array('Accept' => 'application/json');
        $wsurl=getenv("WS_BASE")."/tipos_oia";
        $response = Unirest\Request::get($wsurl,$headers);
        $key=getenv("TOKEN_KEY");
        $decoded = JWT::decode($response->raw_body,$key,array('HS256'));
        return new JsonResponse($decoded);
        }
        /**
        * @Route("/alcances", name="alcances")
        */
        public function alcances()
        {
        $headers = array('Accept' => 'application/json');
        $wsurl=getenv("WS_BASE")."/alcances";
        $response = Unirest\Request::get($wsurl,$headers);
        $key=getenv("TOKEN_KEY");
        $decoded = JWT::decode($response->raw_body,$key,array('HS256'));
        return new JsonResponse($decoded);
        }
       /**
        * @Route("/tipos_cuadrilla", name="tipos_cuadrilla")
        */
        public function tipos_cuadrilla()
        {
        $headers = array('Accept' => 'application/json');
        $wsurl=getenv("WS_BASE")."/tipos_cuadrilla";
        $response = Unirest\Request::get($wsurl,$headers);
        $key=getenv("TOKEN_KEY");
        $decoded = JWT::decode($response->raw_body,$key,array('HS256'));
        return new JsonResponse($decoded);
        }
	/**
        * @Route("/tipos_identificacion", name="tipos_identificacion")
        */
        public function tipos_identificacion()
        {
        $headers = array('Accept' => 'application/json');
        $wsurl=getenv("WS_BASE")."/tipos_identificacion";
        $response = Unirest\Request::get($wsurl,$headers);
        $key=getenv("TOKEN_KEY");
        $decoded = JWT::decode($response->raw_body,$key,array('HS256'));
        return new JsonResponse($decoded);
        }

 	/**
	* @Route("/contactos/{nit}", name="contactosxnit")
     	*/
        public function contactosxnit($nit)
        {
        $headers = array('Accept' => 'application/json');
        $wsurl=getenv("WS_BASE")."/contactos/";
        $response = Unirest\Request::get($wsurl.$nit,$headers);
        $key=getenv("TOKEN_KEY");
        $decoded = JWT::decode($response->raw_body,$key,array('HS256'));
        return new JsonResponse($decoded);
        }
    	/**
        * @Route("/estados_radicado", name="estados_radicado")
        */
        public function estados_radicado()
        {
        $headers = array('Accept' => 'application/json');
        $wsurl=getenv("WS_BASE")."/estados_radicado";
        $response = Unirest\Request::get($wsurl,$headers);
        $key=getenv("TOKEN_KEY");
        $decoded = JWT::decode($response->raw_body,$key,array('HS256'));
        return new JsonResponse($decoded);
        }

       /**
        * @Route("/oia/{nit}", name="oiaxnit")
        */
        public function oiaxnit($nit)
        {
        $headers = array('Accept' => 'application/json');
        $wsurl=getenv("WS_BASE")."/oia/";
        $response = Unirest\Request::get($wsurl.$nit,$headers);
        $key=getenv("TOKEN_KEY");
        $decoded = JWT::decode($response->raw_body,$key,array('HS256'));
        return new JsonResponse($decoded);
        }
	
	/**
        * @Route("/oia", name="oia")
        */
        public function oia()
        {
        $headers = array('Accept' => 'application/json');
        $wsurl=getenv("WS_BASE")."/oia";
        $response = Unirest\Request::get($wsurl,$headers);
        $key=getenv("TOKEN_KEY");
        $decoded = JWT::decode($response->raw_body,$key,array('HS256'));
        return new JsonResponse($decoded);
        }

 	/**
        * @Route("/oiaestado/{estado}", name="oiaestado")
        */
        public function oiaestado($estado)
        {
        $headers = array('Accept' => 'application/json');
        $wsurl=getenv("WS_BASE")."/oiaestado/";
        $response = Unirest\Request::get($wsurl.$estado,$headers);
        $key=getenv("TOKEN_KEY");
        $decoded = JWT::decode($response->raw_body,$key,array('HS256'));
        return new JsonResponse($decoded);
        }


}
