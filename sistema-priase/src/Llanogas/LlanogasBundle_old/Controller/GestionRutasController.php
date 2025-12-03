<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\RutasModel;

class GestionRutasController extends Controller {

    public function indexAction() {

        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');
        $rutaDelegado = new \Llanogas\LlanogasBundle\Delegado\GestionRutasDelegado($this, $sesion);
        $lisParametros['listaciclos'] = $rutaDelegado->buscaCicloEmpresa();
        $lisParametros['tiporutas'] = $rutaDelegado->getTipoRutaEmpresa();
        $response = $this->render('LlanogasLlanogasBundle:Rutas:GestionRutas.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function buscaMunicipiosNuevoAction() {
        $sesion = Util::iniciarSesion($this);
        $request = $this->getRequest();
        $idempresa = $sesion->get('idempresa');
        $delegado = new \Llanogas\LlanogasBundle\Delegado\GestionRutasDelegado($this, $sesion);
        $respuesta['municipios'] = $delegado->buscaMunicipiosNuevo();
        $respuesta['codigo'] = empty($consulta) ? - 1 : 1;
        $respuesta['mensaje'] = empty($consulta) ? "Error no se encontraron municipios " : "Consulta exitosa";

        return (Util::construyeRespuesta($respuesta));
    }

    public function buscarRutasAction() {
        $sesion = Util::iniciarSesion($this);
        $request = $this->getRequest();
        $parametros = array();
        $parametros = $request->get('parametros');
        $delegadoGestionRuta = new \Llanogas\LlanogasBundle\Delegado\GestionRutasDelegado($this, $sesion);
        $respuestaConsulta = $delegadoGestionRuta->getBuscarRutas($parametros);
        $respuesta['rutas'] = $respuestaConsulta;
        $respuesta['codigoRespuesta'] = empty($respuestaConsulta) ? 0 : 1;
        $respuesta['mensaje'] = empty($respuestaConsulta) ? "Error no se encontraron rutas con los parametros selecionados " : "Consulta exitosa";
        return Util::construyeRespuesta($respuesta);
    }

    public function buscaMunicipiosBarriosAction() {
        $sesion = Util::iniciarSesion($this);
        $request = $this->getRequest();
        $idRuta = $request->get('idruta');
        $delegadoGestionRuta = new \Llanogas\LlanogasBundle\Delegado\GestionRutasDelegado($this, $sesion);
        $respuestaConsulta = $delegadoGestionRuta->buscaMunicipiosBarrios($idRuta);
        $respuesta['data'] = $respuestaConsulta;
        $respuesta['codigoRespuesta'] = empty($respuestaConsulta) ? 0 : 1;
        $respuesta['mensaje'] = empty($respuestaConsulta) ? "Error no se encontraron resultados para la ruta seleccionada " : "Consulta exitosa";
        return Util::construyeRespuesta($respuesta);
    }

    public function consultaPeriodoVencimientoAction() {
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);

            $parametros = array();
            $parametros = $request->get('parametros');
            $idRuta = $parametros['idruta'];
            $ano = $parametros['ano'];
            $idCiclo = $parametros['idciclo'];
            if (empty($idRuta)) {
                throw new MyException('Error, No se obtuvo el código de la ruta  ', -1);
            }
            if (empty($ano)) {
                throw new MyException('Error, No se Selecciono el año  ', -1);
            }
            if (empty($idCiclo)) {
                throw new MyException('Error, No se Selecciono Ciclo  ', -1);
            }
            $delegadoGestionRuta = new \Llanogas\LlanogasBundle\Delegado\GestionRutasDelegado($this, $sesion);
            $respuestaConsulta = $delegadoGestionRuta->buscaPeriodoVencimientos($parametros);
            $respuesta['codigoRespuesta'] = empty($respuestaConsulta) ? 0 : 1;
            $respuesta['data'] = $respuestaConsulta;
            $respuesta['mensaje'] = empty($respuestaConsulta) ? 'No se encontraron resultados con los filtros de busqueda' : 'Consulta realizada correctamente' ;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    public function grabarRutasGestionAction(){
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);

            $parametros = array();
            $parametros = $request->get('parametros');
            $nombreRuta = $parametros['nombreRuta'];
            $idTipoRuta = $parametros['idTipoRuta'];
            $idCiclo = $parametros['idCiclo'];
            $aliasRuta = $parametros['aliasRuta'];
            if (empty($nombreRuta)) {
                throw new MyException('Error, Por favor diligenciar nombre a la ruta ', -1);
            }
            if (empty($aliasRuta)) {
                throw new MyException('Error, Por favor diligenciar alias Rutas a la ruta ', -1);
            }
            if (empty($idTipoRuta)) {
                throw new MyException('Error, No se Selecciono el tipo de ruta   ', -1);
            }
            if (empty($idCiclo)) {
                throw new MyException('Error, No se Selecciono Ciclo  ', -1);
            }
            $delegadoGestionRuta = new \Llanogas\LlanogasBundle\Delegado\GestionRutasDelegado($this, $sesion);
            $respuestaConsulta = $delegadoGestionRuta->grabaRutas($parametros);
            $respuesta['codigoRespuesta'] = empty($respuestaConsulta) ? 0 : 1;
            $respuesta['data'] = $respuestaConsulta;
            $respuesta['mensaje'] = empty($respuestaConsulta) ? 'No se creo la ruta; si persiste la falla comuniquese con personal de soporte' : 'Se inserto correctamente' ;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    public function actualizaRutaPeriodosFechasAction(){
        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);

            $parametros = array();
            $parametros = $request->get('parametros');         
            $delegadoGestionRuta = new \Llanogas\LlanogasBundle\Delegado\GestionRutasDelegado($this, $sesion);
            $respuestaConsulta = $delegadoGestionRuta->onSetRutaPeriodo($parametros);
            $respuesta['codigoRespuesta'] = empty($respuestaConsulta) ? 0 : 1;
            $respuesta['data'] = $respuestaConsulta;
            $respuesta['mensaje'] = empty($respuestaConsulta) ? 'Error, no se pudo actualizar ó no se digitaron las fechas' : 'Se cargaron los datos correctamente' ;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    

}
