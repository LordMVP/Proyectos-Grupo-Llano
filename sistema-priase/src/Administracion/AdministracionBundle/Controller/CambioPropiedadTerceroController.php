<?php

namespace Administracion\AdministracionBundle\Controller;

use Administracion\AdministracionBundle\Delegado\CambioPropiedadDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of CambioPropiedadTercero
 *
 * @author lmrubio
 */
class CambioPropiedadTerceroController extends Controller {

    //put your code here
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $lisParametros['fecha'] = date('Y-m-d');
        $response = $this->render('AdministracionAdministracionBundle:Terceros:CambioPropiedadTercero.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function AutocompletarTerceroAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $resultado['codigoRespuesta'] = '1';
            $Delegado = new CambioPropiedadDelegado($this, $sesion);
            $nombre = $request->get('nombre');
            $resultado['terceros'] = $Delegado->consultarTercero($nombre);
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function consultarTerceropropiedadAction() {
        $existe =0 ;
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $constructoraDelegado = new CambioPropiedadDelegado($this, $sesion);
            $tercero = array();
            $tercero['documento'] = $request->get('documento');
            $parametros['tercero'] = $request->get('tercero');
            $parametros['documento'] = $request->get('documento');
            $parametros['nrocatastral'] = $request->get('nrocatastral');
            $parametros['propiedad'] = $request->get('propiedad');
            $parametros['municipio'] = $request->get('municipio');
            $parametros['barrio'] = $request->get('barrio');
            $parametros['codigoanterior'] = $request->get('codigoanterior');
            $parametros['excluirtercero'] = $request->get('excluirtercero');
            $resultado['codigoRespuesta'] = 1;
            $resultado['mensaje'] = "Consulta Exitosa ";
            $resultado['terceropropiedad'] = $constructoraDelegado->consultarTerceroPropiedad($parametros);
        } catch (\Exception $exc) {
          
            $resultado['existetercero'] = $existe;
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

    public function consultarPropiedadAction() {
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $constructoraDelegado = new CambioPropiedadDelegado($this, $sesion);
            $parametros['tercero'] = $request->get('idtercero');
            $parametros['suscriptor'] = $request->get('suscriptor');
            $resultado['codigoRespuesta'] = 1;
            $resultado['mensaje'] = "Consulta Exitosa ";
            $resultado['propiedad'] = $constructoraDelegado->consultarPropiedad($parametros);
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }
    public function grabarAction() {
        try {
            $parametros = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $constructoraDelegado = new CambioPropiedadDelegado($this, $sesion);
            $parametros['tercero'] = $request->get('tercerodestino');
            $parametros['propiedades'] = $request->get('propiedades');
            $parametros['terceroorigen']  = $request->get('terceroorigen'); 
            $resultado['codigoRespuesta'] = 1;
            $resultado['propiedad'] = $constructoraDelegado->grabarPropiedadSoloCambioTecero($parametros);
            $resultado['mensaje'] = "Transacción finalizó exitosamente";
            
        } catch (\Exception $exc) {
            $resultado['codigoRespuesta'] = $exc->getCode();
            $resultado['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($resultado);
    }

}
