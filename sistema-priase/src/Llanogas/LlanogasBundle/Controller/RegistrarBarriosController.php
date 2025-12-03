<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Delegado\RegistrarBarriosDelegado;

/**
 * Clase encargada de administrar el registro de ventas.
 */
class RegistrarBarriosController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $lisParametros['listamunicipios'] = array();
        //Se controla la excepción si hay un error con la comunicación 
        //con la base de datos
        try {
            $barrioDelegado = new RegistrarBarriosDelegado($this, $sesion);
            $lisParametros['listamunicipios'] = $barrioDelegado->getMunicipiosPorPerfil();
            $lisParametros['rutas'] = $barrioDelegado->getRutasEmpresa();
        } catch (\Exception $e) {
            
        }
        $lisParametros['fecha'] = date('Y-m-d');
        $response = $this->render('LlanogasLlanogasBundle:Ventas:registrar_barrios.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }
    
    public function consultaBarrioAction(){
        try{
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);  
            
            $parametros = array();
            $parametros    =  $request->get('parametros');
            $idMunicipio =  $parametros['idmunicipio'];            
             if (empty($idMunicipio)) {
                throw new MyException('Error, debe seleccionar un municicpio  ', -1);
            }
            $barrioDelegado = new RegistrarBarriosDelegado($this, $sesion);
            $respuesta['barrios'] = $barrioDelegado->getBarriosEmpresa($parametros);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    public function grabarBarrioAction(){
        try{
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);  
            
            $parametros = array();
            $parametros    =  $request->get('parametros');
                        
            $idMunicipio =  $parametros['idmunicipio'];
            $idCodigo =  $parametros['idcodigo'];
            if (empty($idMunicipio) || empty($idCodigo)) {
                throw new MyException('Error, debe seleccionar un municicpio y digitar el código ', -1);
            }
            $barrioDelegado = new RegistrarBarriosDelegado($this, $sesion);
            if(!empty($parametros['insert'])){                
                $existe = $barrioDelegado->getBarriosEmpresa($parametros);            
                if(!empty($existe)){
                    throw new MyException('Error, El código del barrio ya existe ', -1);
                }
            }    
            $respuesta['barrios'] = $barrioDelegado->grabarBarrio($parametros);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Barrio creado correctamente y su parametrización';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    public function rutasVinculadasAction(){
        try{
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);  
            
            $parametros = array();
            $parametros    =  $request->get('parametros');
            $idMuba =  $parametros['idmuba'];            
            if (empty($idMuba)) {
                throw new MyException('Error, debe seleccionar un municipio barrio  ', -1);
            }
            $barrioDelegado = new RegistrarBarriosDelegado($this, $sesion);
            $respuesta['rutasVinculadas'] = $barrioDelegado->getRutasVinculadas($idMuba);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    public function rutasMunicipioAction(){
        try{
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);  
             
            $idMunicipio =  $request->get('idmunicipio');           
            if (empty($idMunicipio)) {
                throw new MyException('Error, debe seleccionar un municipio   ', -1);
            }
            $barrioDelegado = new RegistrarBarriosDelegado($this, $sesion);
            $respuesta['rutas'] = $barrioDelegado->getRutasMunicipio($idMunicipio);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    public function consultaConsecutivoAction(){
        try{
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);  
            
            //$parametros = array();
            //$parametros    =  $request->get('parametros');
            $idMunicipio =  $request->get('idmunicipio');            
             if (empty($idMunicipio)) {
                throw new MyException('Error, debe seleccionar un municicpio  ', -1);
            }
            $barrioDelegado = new RegistrarBarriosDelegado($this, $sesion);
            $respuesta['consecutivo'] = $barrioDelegado->getBarriosConsecutivo();
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
}
