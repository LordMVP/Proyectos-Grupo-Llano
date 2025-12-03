<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\NotasReclamacionDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\ValidacionException;

class NotasReclamacionController extends Controller {
    
    /**
     * Función que renderiza la página de notas automáticas por el método de directa.
     * @return html.twig con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
       // $conexion = Util::getConexion($this);
        
        $programaActivo = $sesion->get('programaNotasReclamacion');
        print_r($programaActivo) ;
        //Valida que si ya se ha abierto una página con el proceso no la pueda abrir nuevamente
        if (isset($programaActivo)) {
            Util::redireccionar('/achagua/home.html', $this->getRequest()->getMethod());
        }
        $this->eliminarTablas();
        //$idAcceso = $sesion->get('idacceso');
       // $notasDelegado = new NotasReclamacionDelegado($conexion, $idAcceso, PROGRAMA_NOTA_RECLAMACION);
        $lisParametros = array();
        $_SESSION['programaNotasReclamacion'] = true;
        $lisParametros['empresa'] = $sesion->get('empresa');        
//        $lisParametros['tiposuso'] = $notasDelegado->getTipoUso();
//        $lisParametros['ciclos'] = $notasDelegado->getCiclos();
//        $lisParametros['tipoafectacion'] = $notasDelegado->getTipo();
//        $lisParametros['listatipodocumentos'] = $notasDelegado->getTiposDocumentos();        
        $response = $this->render('LlanogasLlanogasBundle:Facturacion:notasReclamacion.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function getMunicipiosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $municipio = $request->get('municipio');
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $idSuscripcion = $request->get('idsuscripcion');
            $notasDelegado = new NotasReclamacionDelegado($conexion, $idAcceso, PROGRAMA_NOTA_RECLAMACION, $idSuscripcion);
            $listaMunicipio = $notasDelegado->getMunicipios($municipio);           
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['municipios'] = $listaMunicipio ;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    public function getNotasRAction() 
    {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasReclamacionDelegado($conexion, $idAcceso, PROGRAMA_NOTA_RECLAMACION);
            $parametros = $request->get('parametros')[0];
            if (empty($parametros) || !is_array($parametros)) {
                throw new MyException('Error, no hay parámetros de búsqueda', -1);
            }
            $idsuscripcion = isset($parametros['idsuscripcion']) ? $parametros['idsuscripcion'] : NULL;
            if (!is_numeric($idsuscripcion)) {
                throw new MyException('Error, la suscripción es obligatoria', -1);
            }
            $parametros['idprograma'] = PROGRAMA_NOTA_RECLAMACION ;
            $listaFacturas = $notasDelegado->getNotasReclamacion($parametros);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['facturas'] = $listaFacturas;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }   
    
    public function getConceptoAutocompleteAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idSuscripcion = $request->get('idsuscripcion');
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasReclamacionDelegado($conexion, $idAcceso, PROGRAMA_NOTA_RECLAMACION, $idSuscripcion);
            $listaConceptos = $notasDelegado->getConceptoAutocomplete();
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['conceptos'] = $listaConceptos;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    public function getNotasRConFiltroAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $concepto = $request->get('conceptos');
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasReclamacionDelegado($conexion, $idAcceso, PROGRAMA_NOTA_RECLAMACION);
            $listaFacturas = $notasDelegado->getNotasRConFiltro($concepto);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['facturas'] = $listaFacturas ;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    public function getDetalleNotasRAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idfactura = $request->get('idfactura');
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasReclamacionDelegado($conexion, $idAcceso, PROGRAMA_NOTA_RECLAMACION);
            $listaConceptos = $notasDelegado->getDetalleNotaR($idfactura);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['conceptos'] = $listaConceptos;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    public function eliminarProgramaActivoAction() {
        try {
            $respuesta = array();
            Util::iniciarSesion($this);
            Util::validarPeticion($this);
            unset($_SESSION['programaNotasReclamacion']);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se eliminó la sesión del programa';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    public function procesarNotasRAction() { 
        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $norasr = $request->get('notasr');
            $conceptos = $request->get('conceptos');
            if (empty($conceptos) || empty($norasr)) {
                throw new MyException('Error, Notas Reclamacion y conceptos obligatorios', -1);
            }
            $parametros['notasr'] = $norasr;
            $parametros['conceptos'] = $conceptos;
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasReclamacionDelegado($conexion, $idAcceso, PROGRAMA_NOTA_RECLAMACION);
            $respuesta1 = $notasDelegado->ProcesarNotasR($parametros );
            $respuesta['respuesta'] = $respuesta1;
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Se han Procesado las notas Correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function verificarCambiosAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $request = $this->getRequest();
            $idFactura = $request->get('idnotar');
            if (!is_numeric($idFactura)) {
                throw new MyException('Error, identificador de la Nota en Reclamacion es obligatorio.', -1);
            }
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasReclamacionDelegado($conexion, $idAcceso, PROGRAMA_NOTA_RECLAMACION);
            $listaConceptosAfectados = $notasDelegado->getConceptosAfectados($idFactura);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['conceptos'] = $listaConceptosAfectados;
            $respuesta['mensaje'] = 'Consulta realizada correctamente';
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    
    public function aplicarNotasAction() {  // aqui voy
        try {
            $respuesta = array();
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $parametros['idmotivo'] = $request->get('idmotivo');
            $parametros['comentario'] = $request->get('comentario');
            $notasDelegado = new NotasReclamacionDelegado($conexion, $idAcceso, PROGRAMA_NOTA_RECLAMACION);
            $notasDelegado->reiniciarFacturasTemporales();
            $notasDelegado->aplicarNotas($parametros);
            $respuesta['codigoRespuesta'] = -1;
            $respuesta['mensaje'] = 'Error al ejecutar el proceso';
            $listaErrores = $notasDelegado->getListaErrores();
            $respuesta['errores'] = $listaErrores;
            if (empty($listaErrores)) {
                $respuesta['codigoRespuesta'] = 1;
                $respuesta['mensaje'] = 'Se ejecutó el proceso correctamente';
                $notasDelegado->eliminarTablas();
                throw new MyException($respuesta['mensaje'], $respuesta['codigoRespuesta']);
            }
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensaje'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    public function eliminarTablas() {
        try {
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $idAcceso = $sesion->get('idacceso');
            $notasDelegado = new NotasReclamacionDelegado($conexion, $idAcceso, PROGRAMA_NOTA_RECLAMACION);
            $notasDelegado->eliminarTablas();
        } catch (\Exception $e) {
            $e->getMessage();
        }
    }
}
