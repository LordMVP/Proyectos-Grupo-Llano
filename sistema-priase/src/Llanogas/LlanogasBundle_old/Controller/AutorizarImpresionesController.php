<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\AutorizarImpresionesDelegado;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Description of AutorizarImpresionesController
 *
 * @author mebonilla
 */
class AutorizarImpresionesController extends Controller {

    /**
     * Se encarga de renderizar la pagina en el navegador
     * @return text/html render de la pagina inicial
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $idEmpresa = $sesion->get('empresa');
        $lisParametros = array();
        $lisParametros['empresa'] = $idEmpresa;
        $response = $this->render('LlanogasLlanogasBundle:Recaudos:autorizar_impresiones.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Consulta el valor limite de impresiones posibles para un recaudo por 
     * parte de un usuario
     * @return application/json informacion en formato json enviada al frontEnd
     * @throws MyException
     */
    public function getLimiteImpresionRecaudoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idRecaudo = $request->get('idrecaudo');
            if (empty($idRecaudo)) {
                throw new MyException('Id de recaudo no recibido', 0);
            }
            $autorizarImpresionesDelegado = new AutorizarImpresionesDelegado($this, $sesion);
            $resultado = $autorizarImpresionesDelegado->obtenerLimiteImpresionRecaudo($idRecaudo);
            $respuesta['codigoRespuesta'] = (empty($resultado) ? 0 : 1);
            $respuesta['datos'] = $resultado;
            $respuesta['mensaje'] = (empty($resultado)) ? 'No hay límites de impresiones' : 'La consulta se realizó correctamente';
        } catch (\Exception $exc) {
            $respuesta['codigoRespuesta'] = $exc->getCode();
            $respuesta['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion de usuarios segun un parametro de texto
     * @return application/json informacion en formato json enviada al frontEnd
     */
    public function getInfoUsuariosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $parametro = $request->get('parametro');
            $autorizarImpresionesDelegado = new AutorizarImpresionesDelegado($this, $sesion);
            $resultado = $autorizarImpresionesDelegado->obtenerInfoUsuarios($parametro);
            $respuesta['codigoRespuesta'] = (empty($resultado) ? 0 : 1);
            $respuesta['datos'] = $resultado;
            $respuesta['mensaje'] = (empty($resultado)) ? 'No hay limite de impresiones' : 'La consulta se realizó correctamente';
        } catch (\Exception $exc) {
            $respuesta['codigoRespuesta'] = $exc->getCode();
            $respuesta['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la informacion de impresiones disponibles que tiene un usuario
     * autorizado para un recaudo especifico
     * @return application/json informacion en formato json enviada al frontEnd
     */
    public function getImpresionRecaudoUsuarioAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idRecaudo = $request->get('idrecaudo');
            $idUsuario = $request->get('idusuario');
            if (empty($idRecaudo)) {
                throw new MyException('Debe elegir un recaudo para asignar impresiones de timbre', 0);
            }
            if (empty($idUsuario)) {
                $idUsuario = $sesion->get('idusuario');
            }
            $autorizarImpresionesDelegado = new AutorizarImpresionesDelegado($this, $sesion);
            $resultado = $autorizarImpresionesDelegado->obtenerImpresionRecaudoUsuario($idRecaudo, $idUsuario);
            $respuesta['codigoRespuesta'] = (empty($resultado) ? 0 : 1);
            $respuesta['datos'] = $resultado;
            $respuesta['mensaje'] = (empty($resultado)) ? 'No hay impresiones autorizadas para este usuario' : 'La consulta se realizó correctamente';
        } catch (\Exception $exc) {
            $respuesta['codigoRespuesta'] = $exc->getCode();
            $respuesta['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Registra una impresion de usuario desde la interfaz segun un id de usuario
     * y un id de recaudo
     * @return application/json informacion en formato json enviada al frontEnd
     * @throws MyException
     */
    public function setImpresionesRecaudoUsuarioAutomaticoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idRecaudo = $request->get('idrecaudo');
            $idAutorizado = $request->get('idusuario');
            $impAutorizadas = $request->get('impautorizadas');
            //Se valida que el identificador del recaudo sea obligatotio
            //Se verifica que el idUsuario que va a imprimir no esté vacío
            if (empty($idRecaudo) || empty($idAutorizado)) {
                throw new MyException('Debe elegir un recaudo y un usuario para asignar impresiones de timbre', 0);
            }
            $autorizarImpresionesDelegado = new AutorizarImpresionesDelegado($this, $sesion);
            $resultado = $autorizarImpresionesDelegado->insertarImpresionesRecaudoUsuario($idRecaudo, $idAutorizado, $impAutorizadas);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['datos'] = $resultado;
            $respuesta['mensaje'] = 'Se ha registrado un registro de impresion de recaudo';
        } catch (\Exception $exc) {
            $respuesta['codigoRespuesta'] = $exc->getCode();
            $respuesta['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Actualiza el valor de impresiones realizadas de un registro de impresiones
     * de recaudo por usuario, si el numero de impresiones realizadas es igual
     * al numero de impresiones autorizadas el estado cambia automaticamente a
     * estado 'C'
     * @return application/json informacion en formato json enviada al frontEnd
     */
    public function setActualizarImpresionRecaudoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            Util::validarPeticion($this);
            $idImpresion = $request->get('idimpresion');
            $autorizarImpresionesDelegado = new AutorizarImpresionesDelegado($this, $sesion);
            $resultado = $autorizarImpresionesDelegado->actualizarImpresionRecaudoUsuario($idImpresion);
            $respuesta['codigoRespuesta'] = (empty($resultado) ? 0 : 1);
            $respuesta['datos'] = $resultado;
            $respuesta['mensaje'] = (empty($resultado)) ? 'No hay impresiones autorizadas para este usuario' : 'Se ha actualizado el registro de impresion de recaudo';
        } catch (\Exception $exc) {
            $respuesta['codigoRespuesta'] = $exc->getCode();
            $respuesta['mensaje'] = $exc->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
