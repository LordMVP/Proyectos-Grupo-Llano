<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Delegado\MovimientosContablesDelegado;
use Llanogas\LlanogasBundle\Delegado\HabilitarVentaDespuesAprobarDelegado;
/**
 * Clase encargada de administrar generar los movimientos 
 * contables
 */
class HabilitarVentaDespuesAprobarController extends Controller {

    /**
     *
     * @var \Llanogas\LlanogasBundle\Delegado\HabilitarVentaDespuesAprobarDelegado
     */
    private $habilitarVentaDelegado;

    /**
     * Método que renderiza la página.
     * @return html Página renderizada
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $this->habilitarVentaDelegado = new HabilitarVentaDespuesAprobarDelegado($this, $sesion);
        $listaParametros = array();
        $listaParametros['empresa'] = $sesion->get('empresa');
        $listaParametros['ventas'] = $this->habilitarVentaDelegado->buscaVentasAprobadas();
        $response = $this->render('LlanogasLlanogasBundle:Ventas:habilitar_ventas_despues_aprobar.html.twig', $listaParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Permite buscar las ventas que se han habilitado
     *  /ventas/habilitar_ventas/busca_comentarios/
     * @return type
     */
    public function buscaComentariosAction() {
        try {
            Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $idVenta = $request->get('idVenta');                       
            if (empty($idVenta)) {
                throw new MyException('Error, el Número de Venta es Obligatorio', -1);
            }
            $this->habilitarVentaDelegado = new HabilitarVentaDespuesAprobarDelegado($this, $sesion);
            $comentarios = $this->habilitarVentaDelegado->buscarComentariosVentas($idVenta);
            $infoUsuario = $this->habilitarVentaDelegado->informacionCliente($idVenta);
            if(empty($comentarios)){
                $respuesta['comentario'] = " ";
            }
            $respuesta['comentario'] = $comentarios;
            $respuesta['infousuario'] = $infoUsuario;
            $respuesta["codigoRespuesta"] = 1;
            $respuesta['mensaje'] = "Consulta Realizado con Exito,";
            $respuesta['version'] = PARAMETRO_MAX_CAMBIO_VENTA;
            
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }
    /**
     * Permite buscar las ventas que se han habilitado
     *  /ventas/habilitar_ventas/graba_venta_historica/
     * @return type
     */
    public function grabaVentaHistoricaAction(){
        try {
             Util::validarPeticion($this);
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            $idVenta = $request->get('idVenta');
            $observacion = $request->get('observacion');
            if (empty($idVenta)) {
                throw new MyException('Error, el Número de Venta es Obligatorio', -1);
            }
            $this->habilitarVentaDelegado = new HabilitarVentaDespuesAprobarDelegado($this, $sesion);
            $this->habilitarVentaDelegado ->buscaVentas($idVenta,$observacion);
            
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensaje"] = "Se Habilito la Venta ".$idVenta.",  ya puede editarla. ";
            //$respuesta['mensaje'] = "Se Habilito con Exito,";
            
        } catch (\Exception $ex) {
             $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensaje"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

}
