<?php

/**
 * Description of CargarLecturasController
 *
 * @author sergio vargas
 * Date: 01 diciembre de 2015
 */

namespace Llanogas\LlanogasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Utiles\Util;
use Llanogas\LlanogasBundle\ValidacionException;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Delegado\CargarLecturasDelegado;

class CargarLecturasController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $response = $this->render('LlanogasLlanogasBundle:Lectura:CargarLectura.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    public function cargarLecturasAction() {

        try {
            $request = $this->getRequest();
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            //F=Facturar R=Revisión(Es informativo únicamente ) 
            $parametros['esFacturar'] = $request->get('tipocargue');

            $lecturasDelegado = new CargarLecturasDelegado($this, $sesion);
            $respuesta = $lecturasDelegado->cargarLecturas($request, $parametros['esFacturar']);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensaje'] = 'Archivo procesado.';
        } catch (\Exception $exc) {
            $respuesta ['codigoRespuesta'] = -1;
            $respuesta ['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    public function cargarProcesoAction() {

        try {
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $lecturasDelegado = new CargarLecturasDelegado($this, $sesion);
            $respuesta['resumen'] = $lecturasDelegado->VerLog();
            $respuesta['codigoRespuesta'] = 1;
        } catch (\Exception $exc) {
            $respuesta ['codigoRespuesta'] = -1;
            $respuesta ['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
