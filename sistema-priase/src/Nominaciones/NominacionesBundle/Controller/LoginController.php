<?php

namespace Nominaciones\NominacionesBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class LoginController extends Controller {

    //private $ip = "http://167.86.97.41:8880";
     //private $ip = "http://localhost:8080";
    // private $ip = "http://10.43.51.29:8080";
     private $ip = "http://10.29.63.36:8080";
    private $ruta = '';

    public function __construct() {
      $server_addr = $_SERVER['SERVER_ADDR'];
      // if($server_addr == '10.43.51.29' || $server_addr == '190.14.232.146'){
      //   $this->ip = "http://localhost:8080";
      //   }else {
      //     $this->ip = "http://localhost:8080";
      //   }
        $this->ruta = $this->ip . '/nominaciones/api/';
      }

      public function indexAction(Request $request, $ruta = null) {
        $parameters['version'] = 1;
        return $this->render('NominacionesNominacionesBundle:Default:index.html.twig', $parameters);
      }

      private function iniciarSesion($request, $url) {
        $parameter = json_decode($request->getContent(), true);
        $respuesta = ($this->getJson($url, $parameter));
        $json = json_decode($respuesta, true);
        //Iniciar la sesión...
        ini_set('session.handler.native_file', 'files');
        ini_set('session.save_path', $_SERVER['DOCUMENT_ROOT'] . '/achagua/sistema/app/sesiones');
        session_start();
        $obj = (isset($json['codigo']) && $json['codigo'] > 0) ? $json['datos'] : null;
        if($obj != null){
          $obj = json_decode($obj, true);
          $_SESSION['token'] = $obj['token'];
          $_SESSION['idusuario'] = $obj['idusuario'];
          $_SESSION['usuario'] = $obj['usuario'];
          $_SESSION['idempresa'] = $obj['idempresa'];
          $_SESSION['origen'] = 'EXTERNO';
        }
      $json['datos'] = null;
      return $this->respuesta(json_encode($json));
    }

    public function apiAction(Request $request, $ruta = null) {
        try {
            $url = $this->ruta .'global/'. str_replace('_', "/", $ruta);
            switch ($ruta) {
                case 'iniciosesion_tercero':
                  return $this->iniciarSesion($request, $url);
                break;
                default :
                  $parameter = json_decode($request->getContent(), true);
                  return $this->respuesta($this->getJson($url, $parameter));
            }
        } catch (\Exception $ex) {
            $respuesta['codigo'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
            return Util::construyeRespuesta($respuesta);
        }
    }

    private function respuesta($info) {
        $response = new Response($info);
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }

    private function getJson($url, $parameter = '') {
        if (empty($parameter)) {
            $parameter = [];
        }
        $referer = $this->getRequest()->headers->get('referer');
        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_POST, count($parameter));
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($parameter));

        curl_setopt($ch, CURLOPT_TIMEOUT, 1000);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 1000);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type:application/json',
            'route_url_origin:' . $referer
        ));
        $cabeceras = array();
        curl_setopt($ch, CURLOPT_HEADERFUNCTION, function($peticion, $propiedades) use (&$cabeceras) {
            $len = strlen($propiedades);
            $propiedades = explode(':', $propiedades, 2);
            if (count($propiedades) < 2) {// ignore invalid headers
                return $len;
            }
            $name = strtolower(trim($propiedades[0]));
            if (!array_key_exists($name, $cabeceras)) {
                $cabeceras[$name] = [trim($propiedades[1])];
            } else {
                $cabeceras[$name][] = trim($propiedades[1]);
            }
            return $len;
        });
        $data = curl_exec($ch);
        curl_close($ch);
        return $data;
    }

}
