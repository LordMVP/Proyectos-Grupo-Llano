<?php

namespace Agendamiento\AgendamientoBundle\Controller;

use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller {

    private $ip = "http://10.43.51.168:8080/";
    private $ruta = '';

    public function __construct() {
      $server_addr = $_SERVER['SERVER_ADDR'];
      /*if($server_addr == '10.43.51.29' || $server_addr == '190.14.232.146'){
        $this->ip = "http://10.43.51.29:8080/";
      }else {
        $this->ip = "http://167.86.97.41:8880/";
      }*/
        $this->ruta = $this->ip . 'grupollanoAgau/';
    }

    public function indexAction(Request $request, $ruta = null) {
        Util::iniciarSesion($this);
        $parameters['version'] = time();
        return $this->render('AgendamientoAgendamientoBundle:Default:index.html.twig', $parameters);
    }

    public function apiAction(Request $request, $ruta = null) {
        $url = $this->ruta . str_replace('_', "/", $ruta);

        switch ($ruta) {
            //POST
            case "menu":
            case "edicionactividades_insproaprocesoactividades":
            case "agendamientoAutomatico_registrarParametro":
            case "agendamientoAutomatico_edicionReglas_registrarRegla":
            case "agendamientoAutomatico_edicionReglas_registrarCondicion":
            case "agendamientoAutomatico_edicionReglas_buscarReglas":
            case "agendamientoAutomatico_registrarConfiguracionAgendamiento":
            case "agendamientoAutomatico_buscarConfiguracionAgendamiento":
            case "crondAgendamiento_registrarFrecuenciaAgendamiento":
            case "crondAgendamiento_buscarFrecuenciaAgendamiento":
            case "calendarioHabil_registrarConfiguracionCalendarioHabil":
            case "calendarioHabil_consultarCalendarioHabil":
            case "relacionSectoresRutas_registrarSectoresRutas":
            case "relacionRutasMunicipios_registrarRumRutasmunicipio":
            case "ureActividadesSectores_registrarUreUnidadResponsable":
            case "agendamientoManualSure_listarContratantes":
            case "agendamientoManualSure_listarprocesos":
            case "agendamientoManualSure_listarContratistas":
            case "agendamientoManualSure_listarproyectos":
            case "agendamientoManualSure_listarServicios":
            case "agendamientoManualSure_listarActividades":
            case "agendamientoManualSure_listarUres":
            case "agendamientoManualSure_listarRutas":
            case "agendamientoManualSure_listarCuentas":
            case "agendamientoManualSure_Asignar":
            case "agendamientoManualSure_listarOrganismos":
            case "reportes_consultarUguii":
            case "reportes_exportar":
            case "calendarioHabil_consultarfestivos":
            case "ureActividadesSectores_listarcuadrillas":
            case "ureActividadesSectores_insertarUnidadResponsable":
            case "ureActividadesSectores_consultarPorId":
            case "relacionMunicipiosSectores_listarSectores":
            case "relacionMunicipiosSectores_listarCiudades":
            case "relacionMunicipiosSectores_registrarSectores":
            case "ureActividadesSectores_consultarProcesoActividades":
            case "relacionMunicipiosSectores_consultarSectoresmunicipios":
            case "relacionMunicipiosSectores_eliminarMunicipioSectores":
            case "relacionSectoresRutas_listarRutasPorSector":
            case "calendarioHabil_consultarDetalleCalendarioHabil": 
            case "agendamientoPorDemanda_consultarDisponibilidadDemanda":  
            case "reasignar_consultarAgendamiento":   
            case "reasignar_reasignarAgendamiento": 
            case "reasignar_consultarAgendamientoSuscriptor":
            case "agendamientoPorDemanda_editarActividad":
                return self::postJson($url, $request->getContent(),'POST');
            case "ureActividadesSectores_consultarUreUnidadresponsables":
                $parameter = json_decode($request->getContent(),true);
                $proceso=$parameter["proceso"];
                $parameter=$request->getContent();
                $url = $url.'?proceso='.$proceso;
                return self::postJson($url,$parameter,'POST');

            //UPDATE
            case "edicionactividades_edicionunidadactividad":
            case "agendamientoAutomatico_actualizarParametro":
            case "agendamientoAutomatico_edicionReglas_actualizarRegla":
            case "agendamientoAutomatico_edicionReglas_actualizarCondicion":
            case "agendamientoAutomatico_actualizarConfiguracionAgendamiento":
            case "crondAgendamiento_actualizarFrecuenciaAgendamiento":
            case "calendarioHabil_actualizarConfiguracionCalendarioHabil":
            case "relacionRutasMunicipios_editarRumRutasMunicipio":
            case "ureActividadesSectores_actualizarUreUnidadResponsable":
            case "agendamientoManual_EditarActividadesAgendamientoManual":
            case "agendamientoManual_registrarActividadesAgendamientoManual":
            //case "agendamientoPorDemanda_editarActividad":
                return self::postJson($url, $request->getContent(),'PUT');
            //DELETE
            case "edicionactividades_eliminarUraunidades":
            case "edicionactividades_eliminarCiaciudades":
            case "relacionSectoresRutas_eliminarSectoresRutas":
            case "relacionRutasMunicipios_eliminarRumRutasMunicipio":
            case 'agendamientoAutomatico_edicionReglas_eliminarCondicion':
                $url = $url .'?'.http_build_query(json_decode($request->getContent()));
                return self::postJson($url,'','DELETE');

            case "obtener_sesion":
                return $this->getSesion();
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
        curl_setopt($ch, CURLOPT_TIMEOUT, 10000);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10000);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            //'Authorization:'.$token,
            'Authorization:' . self::getToken(),
            //'idPrograma:' . $idPrograma,
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
        //die($data);
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
      $url = $this->ip . 'grupollanoAgau/global/iniciosesion/prisma';
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
            $url = $url . '?' . http_build_query($parameter);
        }


        $token="Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNTUwMzY3NjAwMjIwIiwianRpIjoiMjc1NzQzIiwiaWF0IjoxNTUwMzY3NjAwLCJleHAiOjE1ODYzNjc2MDAsImlkRW1wcmVzYSI6MzIyLCJpZEFjY2VzbyI6IjI3NTc0MyIsImlkVXN1YXJpbyI6Mjg4LCJpbmZvIjp7ImlkUGVyZmlsIjoiMSIsIm5vbWJyZUVtcHJlc2EiOiJMbGFub2dhcyBTLkEgIEUuUy5QIn19.y-A0DHMpbPq6CkP_NuaSad0Pkswk99X159rYWeWF_Jg";
        //$idPrograma = $this->getRequest()->headers->get('idPrograma');
        //$referer = $this->getRequest()->headers->get('referer');
        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                    'Authorization:' . self::getToken(),
                    //'Authorization:' . $token,
                    //'idPrograma:' . $idPrograma,
                    'Content-Type:application/json',
                    //'route_url_origin:' . $referer
                ));
        curl_setopt($ch, CURLOPT_TIMEOUT, 1000);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 1000);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        // $cabeceras = array();
        // curl_setopt($ch, CURLOPT_HEADERFUNCTION, function($peticion, $propiedades) use (&$cabeceras) {
        //     $len = strlen($propiedades);
        //     $propiedades = explode(':', $propiedades, 2);
        //     if (count($propiedades) < 2) {// ignore invalid headers
        //         return $len;
        //     }
        //     $name = strtolower(trim($propiedades[0]));
        //     if (!array_key_exists($name, $cabeceras)) {
        //         $cabeceras[$name] = [trim($propiedades[1])];
        //     } else {
        //         $cabeceras[$name][] = trim($propiedades[1]);
        //     }
        //     return $len;
        // });
        $data = curl_exec($ch);
        curl_close($ch);

        $response = new Response($data);
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }


}
