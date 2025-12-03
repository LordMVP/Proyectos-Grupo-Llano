<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Models\FirmasInstaladorasModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Delegado\FirmasInstaladorasDelegado;
use Llanogas\LlanogasBundle\Delegado\GenericoDelegado;
/**
 * Clase encargada de administrar los recaudos en forma de abono.
 */
class FirmasInstaladorasController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $response = $this->render('LlanogasLlanogasBundle:Ventas:firmas_instaladoras.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function autoCompletarTerceroAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $delegado = new FirmasInstaladorasDelegado($this, $sesion);
            $respuesta['terceros'] = $delegado->consultarTercero($request->get("nombre"));
            $respuesta['codigorespuesta'] = 1;
        } catch (MyException $ex) {
            $respuesta['codigorespuesta'] = -1;
            $respuesta['mensaje'] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }

    public function consultaempleadoscertificacionesAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $delegado = new FirmasInstaladorasDelegado($this, $sesion);
            $respuesta['empleadoscertificaciones'] = $delegado->consultarempleadocertificaciones($request->get("tercero"));
            $respuesta['codigorespuesta'] = 1;
        } catch (MyException $ex) {
            $respuesta['codigorespuesta'] = -1;
            $respuesta['mensaje'] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }

    public function consultaCompetenciasAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $delegado = new FirmasInstaladorasDelegado($this, $sesion);
            $respuesta['competencias'] = $delegado->consultarCompetencias();
            $respuesta['codigorespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta de Competencias Exitosa';
        } catch (MyException $ex) {
            $respuesta['codigorespuesta'] = -1;
            $respuesta['mensaje'] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }

    public function grabarAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $request = $this->getRequest();
            $idusuario = $sesion->get('idusuario');
            $delegado = new GenericoDelegado($conexion);
            $permisosGrabar = $delegado->consultaPermisosGrabar(PROGRAMA_FIRMA_INSTALADORA, $idusuario, UNIDAD_PERMISO_GRABAR_FIRMAINSTALADORA);
            if(empty($permisosGrabar)){
                throw new MyException('Usuario no tiene permisos de Grabación',-1);
            }
            $colaboradorcertificacion = $request->get('colaboradorcertificacion');
            $firmaDelegado = new FirmasInstaladorasDelegado($this,$sesion);
            $firmaDelegado->grabar($colaboradorcertificacion);
            $respuesta['codigorespuesta'] = 1;
            $respuesta['mensaje'] = 'Transacción  Exitosa';
        } catch (MyException $ex) {
            $respuesta['codigorespuesta'] = -1;
            $respuesta['mensaje'] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }
    
    public function consultaPermisosGrabarAction(){
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $request = $this->getRequest();
            $idPrograma = $request->get('idPrograma');
            $idUnidad = $request->get('idUnidad');
            $idusuario = $sesion->get('idusuario');
            if(empty($idPrograma)){
                throw new MyException('No se envia el número de Programa',-1);
            }
            $delegado = new GenericoDelegado($conexion);
            $permisosGrabar = $delegado->consultaPermisosGrabar($idPrograma, $idusuario, $idUnidad);
            $respuesta['data'] = $permisosGrabar;
            $respuesta['codigorespuesta'] = empty($permisosGrabar) ? 0 : 1;
            $respuesta['mensaje'] = empty($permisosGrabar) ? 'Solicite Permisos de Grabación' : 'Consulta de Exitosa';
        } catch (MyException $ex) {
            $respuesta['codigorespuesta'] = -1;
            $respuesta['mensaje'] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }
}
