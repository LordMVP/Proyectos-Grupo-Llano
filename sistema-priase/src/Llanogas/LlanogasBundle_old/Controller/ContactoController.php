<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\ValidacionException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Delegado\ContactoDelegado;
/**
 * Clase encargada de administrar los recaudos en forma de abono.
 */
class ContactoController extends Controller {

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $conexion = Util::getConexion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $response = $this->render('LlanogasLlanogasBundle:Facturacion:generaPlanoContacto.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }
    
     public function generarPlanoContactoAction() {
        try {
            $respuesta = array();
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $request = $this->getRequest();
            $delegado = new ContactoDelegado($this, $sesion);
            $respuesta['archivos'] = $delegado->generarPlano($request->get('fechaInicial'),$request->get('fechaFinal'));
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = "Proceso iniciado Satisfactoriamente";
           
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }

        return Util::construyeRespuesta($respuesta);
    }
}
