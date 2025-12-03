<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\RutasModel;

class RutasController extends Controller {

    public function indexAction() {

        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa'); //"Llanogas SA"; //$session->get('emp_ideregistro');

        $cboRutas = $this->armacboRuta('cboRutas');
        $lisParametros['cboRutas'] = $cboRutas;

        $cboTipoSuscripcion = $this->armacboTipoSuscripcion('cboTipoSuscripcion');
        $lisParametros['cboTipoSuscripcion'] = $cboTipoSuscripcion;


        $response = $this->render('LlanogasLlanogasBundle:Rutas:Rutas.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function armacboRuta($camdat) {
        $conexion = Util::getConexion($this);
        $sesion = Util::iniciarSesion($this);
        //$idUsuario = $sesion->get('usuario_nit');
        $idUsuario = $sesion->get('usu_ideregistro');
        $empresa = $sesion->get('emp_ideregistro');
        $objModel = new RutasModel();
        $objModel->setConexion($conexion);
        $resultado = $objModel->consultarcboRuta($idUsuario, $empresa);
        $listaDatos = array();
        foreach ($resultado as $key => $campos) {
            $listaDatos[$campos['idruta']] = $campos['nomruta'];
            //$listaRutas[$campos['nombre']] = $campos['nomRuta'];
            //$listaRutas[$campos['tipo']] = $campos['idTipoRuta'];
        }
        return Util::crearCombo($camdat, $listaDatos);
    }

    public function armacboTipoSuscripcion($camdat) {
        $conexion = Util::getConexion($this);
        $sesion = Util::iniciarSesion($this);
        $idEmpresa = $sesion->get('idEmpresa');
        $objModel = new RutasModel();
        $objModel->setConexion($conexion);
        $resultado = $objModel->consultarcboTipoSuscripcion($idEmpresa);
        $listaDatos = array();
        foreach ($resultado as $key => $campos) {
            $listaDatos[$campos['idtiposuscripcion']] = $campos['nomtiposuscripcion'];
            //$listaDatos[$campos['nomtiposuscripcion']]=$campos['nomtiposuscripcion'];
        }
        return Util::crearComboBox($camdat, $listaDatos);
    }

    public function consultarSuscriptoresAction() {
        try {
            $request = $this->getRequest();
            $respuesta['codigoRespuesta'] = -1;
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $this->validarConsultaSuscriptores();
            $conexion = Util::getConexion($this);
            $rutasModel = new RutasModel();
            $rutasModel->setConexion($conexion);
            $parametros = $this->getParametrosConsultaSuscriptores();
            //$rta=$rutasModel->consultarRuta($parametros['idRuta']);
            //$resultado=$rta['idtiporuta'];
            $parametros['idempresa'] = $sesion->get('idEmpresa');
            $resultado = $rutasModel->consultarSuscripciones($parametros);
            $respuesta['codigoRespuesta'] = (count($resultado) > 0) ? 1 : 0; // if alternario
            $respuesta['mensaje'] = 'Transaccion correcta';
            $respuesta['suscripciones'] = $resultado;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function consultarRutasSinAction() {
        try {
            $request = $this->getRequest();
            $respuesta['codigoRespuesta'] = -1;
            Util::validarPeticion($this);
            $this->validarConsultaRutasSin();
            $sesion = Util::iniciarSesion($this);
            $parametros = $this->getParametrosConsultaRutas();
            $conexion = Util::getConexion($this);
            $rutasModel = new RutasModel();
            $rutasModel->setConexion($conexion);
            $parametros['idempresa'] = $sesion->get('idEmpresa');
            $resultado = $rutasModel->consultarRutas($parametros);
            $respuesta['codigoRespuesta'] = (count($resultado) > 0) ? 1 : 0; // if alternario
            $respuesta['mensaje'] = 'Transaccion correcta';
            $respuesta['rutas'] = $resultado;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function consultarRutasAsiAction() {
        try {
            $request = $this->getRequest();
            $respuesta['codigoRespuesta'] = -1;
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $this->validarConsultaRutasSin();
            $parametros = $this->getParametrosConsultaRutas();
            $conexion = Util::getConexion($this);
            $rutasModel = new RutasModel();
            $rutasModel->setConexion($conexion);
            $parametros['idempresa'] = $sesion->get('idEmpresa');
            $resultado = $rutasModel->consultarRutas($parametros);
            $respuesta['codigoRespuesta'] = (count($resultado) > 0) ? 1 : 0; // if alternario
            $respuesta['mensaje'] = 'Transaccion correcta';
            $respuesta['rutas'] = $resultado;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    private function getParametrosConsultaSuscriptores() {
        $request = $this->getRequest();
        $parametros['idTercero'] = $request->get('idTercero');
        $parametros['idPropiedad'] = $request->get('idPropiedad');
        $parametros['idSuscripcion'] = $request->get('idSuscripcion');
        $parametros['idRuta'] = $request->get('idRuta');
        $parametros['idTipoSus'] = $request->get('idTipoSus');
        return $parametros;
    }

    private function getParametrosConsultaRutas() {
        $request = $this->getRequest();

        $parametros['idRuta'] = $request->get('idRuta');
        $parametros['idSecuencia'] = $request->get('idSecuencia');
        return $parametros;
    }

    private function validarConsultaSuscriptores() {
        $request = $this->getRequest();
        $idTercero = $request->get('idTercero');
        $idPropiedad = $request->get('idPropiedad');
        $idSuscripcion = $request->get('idSuscripcion');
        $idRuta = $request->get('idRuta');
        $idTipoSus = $request->get('idTipoSus');
        if (empty($idRuta)) {
            throw new MyException('Error Debe Seleccionar una Ruta');
        }
        if (empty($idTercero) && empty($idPropiedad) && empty($idSuscripcion)) {
            throw new MyException('Error debe diligenciar al menos un dato');
        }
        if (empty($idTipoSus)) {
            throw new MyException('Error debe diligenciar al menos un tipo de suscripcion');
        }
    }

    private function validarConsultaRutasSin() {
        $request = $this->getRequest();
        $idRuta = $request->get('idRuta');
        $idSecuencia = $request->get('idSecuencia');
        if ($idRuta === 1) {
            throw new MyException('Error Debe Seleccionar una Ruta');
        }
        if ($idSecuencia === 1) {
            throw new MyException('Error Debe Seleccionar una Ruta');
        }
    }

    public function grabarRutasSinAction() {
        try {
            $request = $this->getRequest();
            $respuesta['codigoRespuesta'] = -1;
            Util::validarPeticion($this);
            $this->validarGrabaRutasSin();
            $parametros = $this->getParametrosGrabaRutasSin();
            $conexion = Util::getConexion($this);
            $rutasModel = new RutasModel();
            $rutasModel->setConexion($conexion);


            $resultado = $rutasModel->GrabarRutasSin($parametros);
            $respuesta['codigoRespuesta'] = (count($resultado) > 0) ? 1 : 0; // if alternario
            $respuesta['mensaje'] = 'Transaccion correcta';
            $respuesta['rutas'] = $resultado;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function grabarBDRutasSinAction() {

        $request = $this->getRequest();

        $datos = $request->get('datos');
        $respuesta['codigoRespuesta'] = -1;

        try {
            Util::validarPeticion($this);
            //$this->validarFiltroContratos();
            $conexion = Util::getConexion($this);
            $rutasModel = new RutasModel();
            $rutasModel->setConexion($conexion);
            if ($datos) {
                foreach ($datos as $dato) {
                    $parametros = $this->getParametrosgrabarBDRutasSin($dato);
                    $resultado = $rutasModel->ActualizarRutasSin($parametros);
                }
            } else {
                $resultado = 0;
            }

            $respuesta['codigoRespuesta'] = (count($resultado) > 0) ? 1 : 0; // if alternario
            $respuesta['mensaje'] = 'Transaccion correcta';
            $respuesta['rutas'] = $resultado;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }

    public function grabarBDRutasAsiAction() {

        try {
            $request = $this->getRequest();

            $datos = $request->get('datos');
            $respuesta['codigoRespuesta'] = -1;

            Util::validarPeticion($this);
            //$this->validarFiltroContratos();
            $conexion = Util::getConexion($this);
            $rutasModel = new RutasModel();
            $rutasModel->setConexion($conexion);
            if ($datos) {
                foreach ($datos as $key => $value) {
                    $parametros = $this->getParametrosgrabarBDRutasAsi($key, $value);
                    $resultado = $rutasModel->ActualizarRutasAsi($parametros);
                }
            } else {
                $resultado = 0;
            }
            $respuesta['codigoRespuesta'] = (count($resultado) > 0) ? 1 : 0; // if alternario
            $respuesta['mensaje'] = 'Transaccion correcta';
            $respuesta['rutas'] = $resultado;
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }

    public function grabarTrasladaRutasAction() {
        try {

            $request = $this->getRequest();
            $respuesta['codigoRespuesta'] = -1;

            Util::validarPeticion($this);

            $conexion = Util::getConexion($this);
            $rutasModel = new RutasModel();
            $rutasModel->setConexion($conexion);

            $parametros = $this->getParametrosgrabarTrasladaRutas();
            $resvalida1 = $rutasModel->consultarPeriTraslaRutaOri($parametros);
            $listaDatos = '';
            $resvalida2 = $rutasModel->consultarPeriTraslaRutaDes($parametros);

            foreach ($resvalida1 as $campos) {
                $resvalida1 = $campos['peri'];
            }
            foreach ($resvalida2 as $campos) {
                $resvalida2 = $campos['peri'];
            }
            //print_r("(".$resvalida1." ".$resvalida2.")");


            if ($resvalida1 === $resvalida2) {
                $resultado = $rutasModel->ActualizarTrasladaRutas($parametros);
                $respuesta['codigoRespuesta'] = (count($resultado) > 0) ? 1 : 0; // if alternario
                $respuesta['mensaje'] = 'Transaccion correcta';
                $respuesta['rutas'] = $resultado;
            } else {
                //$resultado['peri']= null;
                $respuesta['codigoRespuesta'] = 0;
                $respuesta['mensaje'] = 'No se Pudo realizar la Transaccion, El Mes Periodo Activo No coincide';
                $respuesta['rutas'] = -2;
            }
//
        } catch (MyException $ex) {
            $respuesta['mensaje'] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }

    private function getParametrosgrabarBDRutasSin($datos) {
        //print_r($rutas);  
        $request = $this->getRequest();

        $rutas = $request->get('rutas');
        $parametros['idRuta'] = $rutas;
        $parametros['idSuscripcion'] = $datos['idsuscripcion'];
        $parametros['idSecuencia'] = 0;

        return $parametros;
    }

    private function getParametrosgrabarTrasladaRutas() {
        //print_r($rutas);  
        $request = $this->getRequest();

        $parametros['ideRuta'] = $request->get('ideRuta');
        $parametros['idSuscripcion'] = $request->get('idSuscripcion');
        $parametros['idSecuencia'] = $request->get('idSecuencia');
        $parametros['idRuta'] = $request->get('idRuta');
        return $parametros;
    }

    private function getParametrosgrabarBDRutasAsi($indice, $datos) {
        //print_r($rutas);  
        $request = $this->getRequest();
        $rutas = $request->get('rutas');
        $parametros['idRuta'] = $rutas;
        $parametros['idSuscripcion'] = $datos['idsuscripcion'];
        $parametros['idSecuencia'] = $indice + 1;

        return $parametros;
    }

    private function getParametrosGrabaRutasSin() {
        $request = $this->getRequest();
        $parametros['idRuta'] = $request->get('idRuta');
        $parametros['idSuscripcion'] = $request->get('idSuscripcion');
        $parametros['idSecuencia'] = $request->get('idSecuencia');

        return $parametros;
    }

    private function validarGrabaRutasSin() {
        $request = $this->getRequest();
        $idRuta = $request->get('idRuta');
        $idSecuencia = $request->get('idSecuencia');
        $idSuscripcion = $request->get('idSuscripcion');
        if ($idRuta === 1) {
            throw new MyException('Error Debe Seleccionar una Ruta');
        }

        if ($idSuscripcion === 1) {
            throw new MyException('Error Ha seleccionado Suscriptor');
        }

        if ($idSecuencia === 1) {
            throw new MyException('Error No tiene Secuencia');
        }
    }

    public function ArmcboRutaAction($camdat, $rut) {
        $conexion = Util::getConexion($this);
        $sesion = Util::iniciarSesion($this);
        $idUsuario = $sesion->get('usuario_nit');

        $objModel = new RutasModel();
        $objModel->setConexion($conexion);
        $resultado = $objModel->consultarcboRuta($idUsuario);
        $listaDatos = array();
        foreach ($resultado as $key => $campos) {

            if ($key != $rut) {
                $listaDatos[$campos['idruta']] = $campos['nomruta'];
            }
            //$listaRutas[$campos['nombre']] = $campos['nomRuta'];
            //$listaRutas[$campos['tipo']] = $campos['idTipoRuta'];
        }
        return Util::crearCombo($camdat, $listaDatos);
    }
    
    public function actualizaConsecutivoRutaAction(){
        
        $request = $this->getRequest();
        $respuesta['codigoRespuesta'] = -1;
        

            Util::validarPeticion($this);

            $conexion = Util::getConexion($this);
            $rutasModel = new RutasModel();
            $rutasModel->setConexion($conexion);
             $sesion = Util::iniciarSesion($this);
        $parametros['idempresa'] = $sesion->get('idEmpresa');   
        $parametros['idRuta'] = $request->get('idruta');
        
        $actualizaSecuencia = $rutasModel->actualizaSecuenciaRuta($parametros);
        
        $respuesta['codigoRespuesta'] = $actualizaSecuencia == 0 ? -1 : 1; 
        
        return Util::construyeRespuesta($respuesta);
    }

}
