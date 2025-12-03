<?php

namespace Libranza\LibranzaBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Libranza\LibranzaBundle\Delegado\RegistroCreditoDelegado;

/**
 * Ejecuta el proceso de suspensiones y/o reconexiones.
 *
 * @author hrey
 */
class RegistroCreditoController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros["empresa"] = $sesion->get("empresa");
        $lisParametros['fecha'] = date('Y-m-d');
        $response = $this->render("LibranzaBundle:SolicitudCredito:SolicitarCredito.html.twig", $lisParametros);
        $response->headers->set("Content-Type", "text/html");
        return $response;
    }

    public function obtenerInformacionAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);

            $Parametros["estadocivil"] = $registroCreditoDelegado->obtenerEstadocivil();
            $Parametros["niveleducativo"] = $registroCreditoDelegado->obtenerNivelEducativo();
            $Parametros["profesiones"] = $registroCreditoDelegado->obtenerProfesiones();
            $Parametros["parentesco"] = $registroCreditoDelegado->obtenerParentesco();
            $Parametros["experienciafinanciera"] = $registroCreditoDelegado->obtenerExperienciaFinanciera();
            $Parametros["destinocredito"] = $registroCreditoDelegado->obtenerDestinoCredito();
            $Parametros["paises"] = $registroCreditoDelegado->obtenerPaises();
            $Parametros["departamentos"] = $registroCreditoDelegado->obtenerDepartamentos(169);
            $Parametros["actividadeseconomicas"] = $registroCreditoDelegado->obtenerActividadEconomica();
            $Parametros["tipocargo"] = $registroCreditoDelegado->obtenerTipoCargo();
            $Parametros["tipocontrato"] = $registroCreditoDelegado->obtenerTipoContrato();
            $Parametros["bancos"] = $registroCreditoDelegado->obtenerBancos();
            $Parametros["empresas"] = $registroCreditoDelegado->obtenerEmpresas();
            $Parametros["tiposactivos"] = $registroCreditoDelegado->obtenerTipoActivos();
            $Parametros["tiposvivienda"] = $registroCreditoDelegado->obtenerVivienda();
            $Parametros["correspondencia"] = $registroCreditoDelegado->obtenerCorrespondencia();
            $Parametros["tipoidentificacion"] = $registroCreditoDelegado->obtenerTipoIdentificacion();

            $respuesta['codigoRespuesta'] = 1;
            $respuesta['datos'] = $Parametros;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function obtenerDepartamentosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
            $idPais = $request->get('idpais');
            $departamentos = $registroCreditoDelegado->obtenerDepartamentos($idPais);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['datos'] = $departamentos;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function obtenerCiudadesAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
            $idDepartamento = $request->get('iddepartamento');
            $ciudades = $registroCreditoDelegado->obtenerCiudades($idDepartamento);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['datos'] = $ciudades;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function obtenermunicipiosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
            $iddepartamento = $request->get('iddepartamento');
            $municipios = $registroCreditoDelegado->obtenerMunicipios($iddepartamento);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['datos'] = $municipios;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function obtenerBarriosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
            $idmunicipio = $request->get('idmunicipio');
            $barrios = $registroCreditoDelegado->obtenerBarrios($idmunicipio);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['datos'] = $barrios;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function registrarCreditoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
            $request = $this->get('request');
            $solicitudCredito = $request->get('solicitudCredito');
            $idCredito = $registroCreditoDelegado->insertarSolicitudCredito($solicitudCredito['informacion']);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['credito'] = $idCredito;
            $respuesta['mensaje'] = 'Solicitud registrada correctamente con número de radicado: ' . $idCredito;
            $parametros["id_credito"] = $idCredito;
            $token = Util::crearToken($parametros);
            $respuesta['codigo'] = $token;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function actualizarCreditoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
            $request = $this->get('request');
            $credito['estado'] = $request->get('estado');
            $credito['idcredito'] = $request->get('idcredito');
            $idCredito = $registroCreditoDelegado->actualizarCredito($credito);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se actualizó correctamente la solicitud: ' . $credito['idcredito'];
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function consultarCreditoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
            $request = $this->get('request');
            $parametros['estado'] = $request->get('estado');
            $parametros['nombre'] = $request->get('nombre');
            $parametros['documento'] = $request->get('documento');
            $parametros['fecha'] = $request->get('fecha');
            $parametros['idcredito'] = $request->get('radicado');
            if (!empty($parametros['idcredito'])) {
                if (!is_numeric($parametros['idcredito'])) {
                    throw new MyException('El campo credito debe ser numerico', -1);
                }
            }
            if (empty($parametros['idcredito'])) {
                $parametros['idcredito'] = -1;
            }
            if (empty($parametros['documento'])) {
                $parametros['documento'] = -1;
            }
            if (empty($parametros['nombre'])) {
                $parametros['nombre'] = -1;
            }
            $listaCreditos = $registroCreditoDelegado->consultar($parametros);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente ';
            $respuesta['creditos'] = $listaCreditos;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function subirAdjuntoAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $tamanopermitido = 1024 * 1024 * 3;
            $listaArchivos = Util::subirAdjunto($request, $sesion->get('idusuario'), 'libranza', $tamanopermitido);
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
            $idarchivo = $registroCreditoDelegado->insertarAdjutno($listaArchivos[0]['nombrearchivo'], $listaArchivos[0]['ruta']);
            $listaArchivos['idarchivo'] = $idarchivo;
            $respuesta['archivos'] = $listaArchivos;
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['mensaje'] = 'Se adjuntaron correctamente los archivos';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function eliminarAdjuntoAction() {
        try {
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $idArchivo = $request->get('idarchivo');
            if (!is_numeric($idArchivo)) {
                throw new MyException('Error al eliminar el archivo', -1);
            }
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
            $registroCreditoDelegado->eliminarArchivo($idArchivo);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['mensaje'] = 'Se eliminó correctamente los archivos ';
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function consultarCreditoAprobadosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
            $request = $this->get('request');
            $parametros['estado'] = $request->get('estado');
            $listaCreditos = $registroCreditoDelegado->consultarCreditoAprobados($parametros);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente ';
            $respuesta['creditos'] = $listaCreditos;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function consultarTercerosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $registroCreditoDelegado = new RegistroCreditoDelegado($this, $sesion);
            $request = $this->get('request');
            $estado = $request->get('estado');
            $nombre = $request->get('nombre');
            $listaCreditos = $registroCreditoDelegado->obtenerTerceroAutoComplete($estado, $nombre);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente ';
            $respuesta['datos'] = $listaCreditos;
        } catch (\Exception $ex) {
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function tokenAction() {
        $datos = 'APPFutureccCAPSA';
        $iv = 'APPFutureccCAPSA';
//        $mensaje = 'elena Esta decifrando en php';
//        $ciphertext = Util::getEncrypt($mensaje, $datos, $iv);
//        print_r(urlencode($ciphertext));
        $ciphertext = 'L0lLU2VGb2JEZHdDaUpYRHVPRU1hR0lpcERERnRSZW56Y3Y4UStTbnhxUUhVVzRUTXJwajdwRUh4bkVNdFFsUThwV2V3NVFuK1ZMZGR1WXI0WXB1dzQ2OGcrdkE0MXg3UytVUXp1dk9oelZRZWREOEl6Y0l0ZkRl';
        $deciphertext = Util::getDecrypt($ciphertext, $datos, $iv);
//        print_r($deciphertext);
        $respuesta['codigoRespuesta'] = 1;
        $respuesta['mensaje'] = 'Consulta realizada correctamente ';
        $respuesta['datos'] = '';
        return Util::construyeRespuesta($respuesta);
    }

}
