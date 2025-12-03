<?php

namespace Contacto\ContactoBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

const VERSION = 1;

class DefaultController extends Controller {

    private $ip = "http://10.43.51.165:8280";

    private $ruta = '';

    public function __construct() {
  
        $this->ruta = $this->ip . '/contacto/api/';
    }

    public function indexAction(Request $request, $ruta = null) {
        Util::iniciarSesion($this);
        $parameters['version'] = 1;
        return $this->render('ContactoContactoBundle:Default:index.html.twig', $parameters);
    }

    public function apiAction(Request $request, $ruta = null) {
        try {
            $url = $this->ruta . str_replace('_', "/", $ruta);
            switch ($ruta) {
                case "obtener_sesion":
                    return $this->getSesion();
                default :
                    $parameter = json_decode($request->getContent(), true);
                    return $this->getJson($url, $parameter);
            }
        } catch (\Exception $ex) {
            $respuesta['codigo'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
            return Util::construyeRespuesta($respuesta);
        }
    }

    private function getSesion() {
        $sesion = Util::iniciarSesion($this);
        return Util::construyeRespuesta([
                    "codigo" => 1,
                    "mensaje" => "Se han obtenido las credenciales correctamente.",
                    "datos" => [
                        "usuario" => $sesion->get('usuario'),
                        "empresa" => $sesion->get('empresa'),
                    ]
        ]);
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
        $idPrograma = $this->getRequest()->headers->get('idPrograma');
        $referer = $this->getRequest()->headers->get('referer');
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, count($parameter));
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($parameter));

        curl_setopt($ch, CURLOPT_TIMEOUT, 1000);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 1000);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Authorization:' . $this->getToken(),
            'idPrograma:' . $idPrograma,
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
        Util::iniciarSesion($this);
        $_SESSION['token'] = $cabeceras['token'][0];
        return $this->respuesta($data);
    }

    private function getToken() {
        $sesion = Util::iniciarSesion($this);
        $token = $sesion->get('token');
        if (!empty($token)) {
            return $token;
        }
        $idAcceso = $sesion->get('idacceso');
        $json = json_encode(array('idAcceso' => $idAcceso));
        $url = $this->ip . '/contacto/global/iniciosesion/prisma';
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
        curl_setopt($ch, CURLOPT_TIMEOUT, 1000);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 1000);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $data = json_decode(curl_exec($ch));
        curl_close($ch);
        if ($data->codigo > 0) {
            return $data->datos;
        }
        throw new \Llanogas\LlanogasBundle\MyException($data->mensaje, $data->codigo);
    }

}
