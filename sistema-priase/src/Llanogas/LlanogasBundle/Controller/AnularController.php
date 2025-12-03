<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\Delegado\AnularDelegado;
use Llanogas\LlanogasBundle\Models\AnularModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Clase encargada de controlar la eliminación de un recaudo.
 */
class AnularController extends Controller {

    /**
     * Función que renderiza la página de anticipos.
     * @return html con la información de la página
     */
    public function indexAction() {
        $sesion = Util::iniciarSesion($this);
        $lisParametros = array();
        $lisParametros['empresa'] = $sesion->get('empresa');
        $cmbMotivos = $this->cargarComboDb('cmbMotivos');
        $lisParametros['cmbMotivos'] = $cmbMotivos;
        $response = $this->render('LlanogasLlanogasBundle:Recaudos:anular.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Pinta un select de html dependiendo del uusario y tipo de combo.
     * @param int $codTipo Código del combo que se quiere dibujar.
     * @return html renderizado con la información del combo
     */
    private function cargarComboDb($codTipo) {
        $conexion = Util::getConexion($this);
        $objModel = new AnularModel($conexion);
        switch ($codTipo) {
            case 'cmbMotivos':
                $resultado = $objModel->buscarMotivos();
                break;
        }
        $listaDatos = array();
        foreach ($resultado as $campos) {
            $listaDatos[$campos['id']] = $campos['nombre'];
        }
        //Combo renderizado en html
        return Util::crearCombo($codTipo, $listaDatos);
    }

    /**
     * Busca un recaudo por idrecaudo, idsuscriptor, id suscripción y (Rango de fechas)
     * @return json con la información de los recaudos de acuerdo a los criterios de búsqueda
     */
    public function buscarRecaudosAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            //Se valida que la petición se haga por método POST
            Util::validarPeticion($this);
            $anularDelegado = new AnularDelegado($this, $sesion);
            $idRecaudo = $request->get('idRegistro');
            $idSuscriptor = $request->get('idSuscriptor');
            $idSuscripcion = $request->get('idSuscripcion');
            $codAnterior = $request->get('codAnterior');
            $fechaInicio = $request->get('fechaInicio');
            $fechaFin = $request->get('fechaFin');
            $recaudos = $anularDelegado->buscarRecaudo($idRecaudo, $idSuscriptor, $idSuscripcion, $fechaInicio, $fechaFin, $codAnterior);
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['recaudos'] = $recaudos;
        } catch (\Exception $e) {
            $respuesta['codigoRespuesta'] = $e->getCode();
            $respuesta['mensajeError'] = $e->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Consulta la información adicional que tiene asociada un recaudo.
     * @return json con el detalle de un recaudo en particular (idrecaudo)
     * @throws MyException 
     */
    public function obtenerResultadosRecaudoAction() {
        try {
            $sesion = Util::iniciarSesion($this);
            $request = $this->getRequest();
            
            $anularDelegado = new AnularDelegado($this, $sesion);
            Util::validarPeticion($this);
            $idRecaudo = $request->get('idrecaudo');
            if (empty($idRecaudo)) {
                throw new MyException('Error, identificador del recaudo es obligatorio', -1);
            }
            $resultadoRecaudo = $anularDelegado->getDetallesRecaudos($idRecaudo);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["resultadoRecaudo"] = $resultadoRecaudo;
        } catch (\Exception $ex) {
            $respuesta["codigoRespuesta"] = ($ex->getCode() == 0) ? -1 : $ex->getCode();
            $respuesta['mensajeRespuesta'] = $ex;
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Controla y garantiza la eliminación del recaudo.
     * @return json con la información de la transacción sí se pudo realizar.
     */
    public function registrarAnularAction() {
        try {
            $respuesta["codigoRespuesta"] = -1;
            $sesion = Util::iniciarSesion($this);
            Util::validarPeticion($this);
            $parametros = $this->getParametrosAnulacion();
            $anularDelegado = new AnularDelegado($this, $sesion);
            $anularDelegado->anularRecaudo($parametros);
            $respuesta["codigoRespuesta"] = 1;
            $respuesta["mensajeRespuesta"] = 'Se anuló el recaudo correctamente ';
        } catch (MyException $ex) {
            $respuesta["codigoRespuesta"] = $ex->getCode();
            $respuesta["mensajeRespuesta"] = $ex->getMessage();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Valida y obtine los parámetros enviados por el usuario.
     * que se invoca en la función de registrar anulación
     * @return array
     */
    private function getParametrosAnulacion() {
        $request = $this->getRequest();
        $sesion = Util::iniciarSesion($this);
        $parametros['idempresa'] = $sesion->get('idempresa');
        $parametros['idrecaudo'] = $request->get('idRecaudo');
        $parametros['idmotivo'] = $request->get('idMotivo');
        $parametros['comentario'] = $request->get('comentario');
        $parametros['version'] = $request->get('version');
        return $parametros;
    }

}
