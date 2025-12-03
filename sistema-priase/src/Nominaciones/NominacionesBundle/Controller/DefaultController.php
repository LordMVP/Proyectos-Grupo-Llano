<?php

namespace Nominaciones\NominacionesBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

const VERSION = 1;

class DefaultController extends Controller {

   //private $ip = "http://167.86.97.41:8880";
    // private $ip = "http://localhost:8080";
    //private $ip = "http://10.43.51.29:8080";
    private $ip = "http://10.29.63.189:8080";

   // private $ip = "http://localhost:8080";
    private $ruta = '';

    public function __construct() {
        $server_addr = $_SERVER['SERVER_ADDR'];
        // if($server_addr == '10.43.51.29' || $server_addr == '190.14.232.146'){
        //   $this->ip = "http://localhost:8080";
        // }else {
        //   $this->ip = "http://localhost:8080";
        // }
        $this->ruta = $this->ip . '/nominaciones/api/';
    }

    public function indexAction(Request $request, $ruta = null) {
        // Util::iniciarSesion($this);
        $parameters['version'] = 1;
        return $this->render('NominacionesNominacionesBundle:Default:index.html.twig', $parameters);
    }

    public function apiAction(Request $request, $ruta = null) {
        try {
            $url = $this->ruta . str_replace('_', "/", $ruta);
            switch ($ruta) {
                case "configuracion_guardarmasivo":
                case "tramos_guardarmasivo":
                case "lecturaDiaria_guardarLlecturaarchivo":
                case "otros-puntos-consumo_proyeccion_masivo":
                case "lecturacontratos_masivo":
                    return $this->adjuntar($request, $url);
                case "global_archivo_adjuntar":
                    return $this->adjuntarMultiples($request, $url);
                case "cromatografia_guarda-masiva":
                case "lectura-diaria_lecturareal":
                    return $this->adjuntarDinamico($request, $url);
                case "obtener_sesion":
                    return $this->getSesion();
                case "cerrar_sesion":
                  $this->getSesion();
                    session_destroy();
                    return Util::construyeRespuesta([
                      "codigo" => 1,
                      "mensaje" => "Se ha cerrado sesión.",
                      "datos" => null
          ]);
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
                        "origen" => isset($_SESSION['origen']) ? $_SESSION['origen'] : 'INTERNO'
                    ]
        ]);
    }

    private function adjuntarMultiples(Request $request, $url) {
        if (empty($_FILES)) {
            return $this->respuesta(json_encode([
                        'codigo' => -1,
                        'mensaje' => 'Debe seleccionar un archivo'
            ]));
        }
        $listaArchivos = array();
        $archivo = $_FILES['archivo'];
        for ($i = 0; $i < count($archivo['tmp_name']); $i++) {
            $nombreArchivo = $archivo['name'][$i];
            $rutaArchivo = $archivo['tmp_name'][$i];
            $tipo = $archivo['type'][$i];
            $listaArchivos[] = [
                'nombre' => 'archivo',
                'nombreArchivo' => $nombreArchivo,
                'contenido' => file_get_contents($rutaArchivo),
                'tipo' => $tipo
            ];
        }
        $ch = curl_init($url);
        $ch = $this->enviarMultiplesArchivos($ch, uniqid(), $listaArchivos, $_POST);
        $data = curl_exec($ch);
        curl_close($ch);
        return $this->respuesta($data);
    }

    private function enviarMultiplesArchivos($ch, $separador, $listaArchivos, $campos = array()) {
        $delimitador = '-------------' . $separador;
        $data = '';
        foreach ($campos as $nombre => $infoArchivo) {
            $data .= "--" . $delimitador . "\r\n"
                    . 'Content-Disposition: form-data; name="' . $nombre . "\"\r\n\r\n"
                    . $infoArchivo . "\r\n";
        }
        foreach ($listaArchivos as $infoArchivo) {
            $data .= "--" . $delimitador . "\r\n"
                    . "Content-Type: {$infoArchivo['tipo']}\r\n"
                    . 'Content-Disposition: form-data; name="' . $infoArchivo['nombre'] . '"; '
                    . 'filename="' . $infoArchivo['nombreArchivo'] . '"'
                    . "\r\n\r\n"
                    . $infoArchivo['contenido'] . "\r\n";
        }
        $data .= "--" . $delimitador . "--\r\n";
        $referer = $this->getRequest()->headers->get('referer');
        curl_setopt_array($ch, [
            CURLOPT_POST => TRUE,
            CURLOPT_HTTPHEADER => [
                'Authorization:' . self::getToken(),
                'Content-Type: multipart/form-data; boundary=' . $delimitador,
                'Content-Length: ' . strlen($data),
                'route_url_origin:' . $referer
            ],
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_RETURNTRANSFER => true
        ]);
        return $ch;
    }

    private function adjuntar(Request $request, $url) {
        if (empty($_FILES)) {
            return $this->respuesta(json_encode([
                        'codigo' => -1,
                        'mensaje' => 'Debe seleccionar un archivo'
            ]));
        }
        $referer = $this->getRequest()->headers->get('referer');
        $archivo = array(
            'archivo' => new \CURLFile($_FILES['archivo']['tmp_name'], $_FILES['archivo']['type']),
            'separador' => $request->get('separador'),
            'cabecera' => $request->get('cabecera')
        );
        $headers = array("Content-Type:multipart/form-data", 'Authorization:' . self::getToken(), 'route_url_origin:' . $referer);
        $opciones = array(
            CURLOPT_URL => $url,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POSTFIELDS => $archivo,
            CURLOPT_RETURNTRANSFER => true
        );
        $ch = curl_init($url);
        curl_setopt_array($ch, $opciones);
        $data = curl_exec($ch);
        curl_close($ch);
        return $this->respuesta($data);
    }

    private function adjuntarDinamico(Request $request, $url) {
        if (empty($_FILES)) {
            return $this->respuesta(json_encode([
                        'codigo' => -1,
                        'mensaje' => 'Debe seleccionar un archivo'
            ]));
        }
        $llaves = $request->files->keys();
        $nombreParametro = $llaves[0];
        $archivoPeticion = $_FILES[$nombreParametro];
        $referer = $this->getRequest()->headers->get('referer');
        $objetoEnviar = array(
            $nombreParametro => new \CURLFile($archivoPeticion['tmp_name'], $archivoPeticion['type']),
        );
        $parametros = $request->request->all();
        foreach ($parametros as $nombre => $valor) {
            $objetoEnviar[$nombre] = $valor;
        }
        $headers = array("Content-Type:multipart/form-data", 'Authorization:' . self::getToken(), 'route_url_origin:' . $referer);
        $opciones = array(
            CURLOPT_URL => $url,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POSTFIELDS => $objetoEnviar,
            CURLOPT_RETURNTRANSFER => true
        );
        $ch = curl_init($url);
        curl_setopt_array($ch, $opciones);
        $data = curl_exec($ch);
        curl_close($ch);
        return $this->respuesta($data);
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
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10000000000);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10000000000);
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
        //var_dump($cabeceras['token'][0]);
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
        $url = $this->ip . '/nominaciones/global/iniciosesion/prisma';
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
