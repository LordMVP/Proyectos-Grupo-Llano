<?php

namespace Reial\ReialBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller {

    private $ip = "http://localhost:8080";
    private $ruta = '';

    public function __construct() {
       /*$server_addr = $_SERVER['SERVER_ADDR'];
        if($server_addr == '10.43.51.29' || $server_addr == '190.14.232.146'){
          $this->ip = "http://10.43.51.29:8080";
        }else {
          $this->ip = "http://167.86.97.41:8880";
        }*/
        $this->ruta = $this->ip . '/grupollanoReial/api/alis/';
    }

    public function indexAction(Request $request, $ruta = null) {
        Util::iniciarSesion($this);
        $parameters['version'] = time();
        return $this->render('ReialReialBundle:Default:index.html.twig', $parameters);
    }
    public function apiAction(Request $request, $ruta = null) {
        $url = $this->ruta . str_replace('_', "/", $ruta);

        switch ($ruta) {
                      // POST

                      case "edicionactividades_insproaprocesoactividades":
                      case "parametrizacion_periodos_registrar":
                      case "etapas_agregarActividades":
                      case "etapas_agregarMateriales":
                      case "etapas_consultarAdjuntos":
                      case "etapas_agregarNovedad":
                      case "etapas_registrarTodos":
                      case "etapas_registrarAdjunto":
                      case "etapas_consultarActividades":
                      case "agenda_consultarTodas":
                      case "agenda_crearEditar":
                      case "agenda_consultarPorCodigo":
                      case "agenda_eliminar":
                      case "sincronizacionKactus_buscarLiquidacion":
                      case "sincronizacionKactus_periodos":
                      case "sincronizacionKactus_preliquidacion":
                      case "liquidacion_registrarLiquidacion":
                      case "liquidacion_descartarLiquidacion":
                      case "liquidacion_nominaDestajo":
                      case "agendaServicio_consultarPorCodigo":
                      case "agendaServicio_agregarServicios":
                      case "parametrizacion_materiales":
                      case "parametrizacion_periodos_registrar":
                      case "parametrizacion_consultarValorActividadMunicipio":
                      case "parametrizacion_listarActividades":
                      case "parametrizacion_listarContratistas":
                      case "parametrizacion_homologacionMunicipios":
                      case "parametrizacion_consultarHomologoMunicipio":
                      case "parametrizacion_homologacionAgendas":
                      case "parametrizacion_crearValorActividadMunicipio":
                      case "parametrizacion_editarValorActividadMunicipio":
                      case "parametrizacion_consultarAgendaHomologadaSevenPorAgenda":
                      case "parametros_empresas":
                      case "parametros_dependencias":
                      case "parametros_listardependencias":
                      case "parametros_municipios":
                      case "parametros_niveles":
                      case "servicio_consultarPorCodigo":
                      case "servicio_consultarPorNivel":
                      case "servicio_crearEditar":
                      case "servicio_eliminarServicio":
                      case "consultarArchivo":
                      case 'servicios_empresasContratantes':
                      case 'servicios_municipios':
                      case 'servicios_OrdenesCompletasLiquidar':
                      case 'servicios_consultarLiquidacionAAplicar':
                      case 'liquidacion_nominaDestajo':
                      case 'sincronizacionKactus_colaboradoresNomina':
                      case 'liquidacion_actualizaPreliquidacion':

                          return self::postJson($url, $request -> getContent(), 'POST');

                      // PUT

                      case "edicionactividades_edicionunidadactividad":
                      case "parametrizacion_periodos_actualizar":
                      case "etapas_noConformidad_cerrar":
                      case "medidores":

                          return self::postJson($url, $request->getContent(),'PUT');

                      // DELETE

                      case "edicionactividades_eliminarUraunidades":
                          $url = $url .'?'.http_build_query(json_decode($request->getContent()));
                          return self::postJson($url,'','DELETE');

                      case "obtener_sesion":
                          return $this->getSesion();

                      // Adjuntar archivo

                      case "adjuntarArchivo":
                          return $this->adjuntar($request,$url);

                      default :
                          $parameter = json_decode($request->getContent(), true);
                          return $this->getJson($url, $parameter);
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
        curl_setopt_array($ch, [
            CURLOPT_POST => TRUE,
            CURLOPT_HTTPHEADER => [
                //'Authorization:' . self::getToken(),
                'Content-Type: multipart/form-data; boundary=' . $delimitador,
                'Content-Length: ' . strlen($data),
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
        $archivo = array(
            'archivo' => new \CURLFile($_FILES['archivo']['tmp_name'], $_FILES['archivo']['type']),
            'separador' => $request->get('separador'),
            'cabecera' => $request->get('cabecera')
        );
        $token="Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNTUwMzY3NjAwMjIwIiwianRpIjoiMjc1NzQzIiwiaWF0IjoxNTUwMzY3NjAwLCJleHAiOjE1ODYzNjc2MDAsImlkRW1wcmVzYSI6MzIyLCJpZEFjY2VzbyI6IjI3NTc0MyIsImlkVXN1YXJpbyI6Mjg4LCJpbmZvIjp7ImlkUGVyZmlsIjoiMSIsIm5vbWJyZUVtcHJlc2EiOiJMbGFub2dhcyBTLkEgIEUuUy5QIn19.y-A0DHMpbPq6CkP_NuaSad0Pkswk99X159rYWeWF_Jg";
        $headers = array("Content-Type:multipart/form-data", 'Authorization:' . self::getToken());
        //$headers = array("Content-Type:multipart/form-data", 'Authorization:' . $token);
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

    private function respuesta($info) {
        $response = new Response($info);
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }

    private function postJson($url, $parameter = '',$verbo='') {
        if (empty($parameter)) {
            $parameter = [];
        }
        $token="Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNTUwMzY3NjAwMjIwIiwianRpIjoiMjc1NzQzIiwiaWF0IjoxNTUwMzY3NjAwLCJleHAiOjE1ODYzNjc2MDAsImlkRW1wcmVzYSI6MzIyLCJpZEFjY2VzbyI6IjI3NTc0MyIsImlkVXN1YXJpbyI6Mjg4LCJpbmZvIjp7ImlkUGVyZmlsIjoiMSIsIm5vbWJyZUVtcHJlc2EiOiJMbGFub2dhcyBTLkEgIEUuUy5QIn19.y-A0DHMpbPq6CkP_NuaSad0Pkswk99X159rYWeWF_Jg";
        $idPrograma = $this->getRequest()->headers->get('idPrograma');
        $ch = curl_init($url);
        //curl_setopt($ch, CURLOPT_POST, count($parameter));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $parameter);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $verbo);
        curl_setopt($ch, CURLOPT_TIMEOUT, 1000);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 1000);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            //'Authorization:'.$token,
            'Authorization:' . self::getToken(),
            'idPrograma:' . $idPrograma,
            'Content-Type:application/json'
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
        //Util::iniciarSesion($this);
        //$_SESSION['token'] = $cabeceras['token'][0];
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
        $url = $this->ip . '/grupollanoReial/global/iniciosesion/prisma';
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json'
        ));
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

    private function getJson($url, $parameter = '') {

        if (empty($parameter)) {
            $url = $url;
        } else {
            //$parameter= json_encode($parameter);
            $url = $url . '?' . http_build_query($parameter);
        }


        $token="Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNTUwMzY3NjAwMjIwIiwianRpIjoiMjc1NzQzIiwiaWF0IjoxNTUwMzY3NjAwLCJleHAiOjE1ODYzNjc2MDAsImlkRW1wcmVzYSI6MzIyLCJpZEFjY2VzbyI6IjI3NTc0MyIsImlkVXN1YXJpbyI6Mjg4LCJpbmZvIjp7ImlkUGVyZmlsIjoiMSIsIm5vbWJyZUVtcHJlc2EiOiJMbGFub2dhcyBTLkEgIEUuUy5QIn19.y-A0DHMpbPq6CkP_NuaSad0Pkswk99X159rYWeWF_Jg";
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                    //'Authorization:' . $token,
                    'Authorization:' . self::getToken(),
                    //'idPrograma:' . $idPrograma,
                    'Content-Type:application/json'
                ));
        curl_setopt($ch, CURLOPT_TIMEOUT, 5000);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5000);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $data = curl_exec($ch);
        curl_close($ch);

        $response = new Response($data);
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }

    private function requestPost($url, $parameter = '') {
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
      if(isset($cabeceras['token'])){
        $_SESSION['token'] = $cabeceras['token'][0];
      }
      $res = $this->respuesta($data);
      // var_dump($res);
      return $res;
  }

    public function apiv2Action(Request $request, $ruta = null){
        $url = $this->ruta . str_replace('_', "/", $ruta);
        $parameter = json_decode($request->getContent(), true);
        return $this->requestPost($url, $parameter);
    }

}
