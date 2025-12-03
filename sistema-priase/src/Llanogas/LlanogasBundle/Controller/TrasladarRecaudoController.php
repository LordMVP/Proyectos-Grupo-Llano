<?php

namespace Llanogas\LlanogasBundle\Controller;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\RecaudosModel;
use Llanogas\LlanogasBundle\Models\AnularModel;
use Llanogas\LlanogasBundle\Delegado\AnularDelegado;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoAplicarRecaudos;

/**
 * Clase que traslada un recaudo de una suscripción a otra.
 * @deprecated since version  Ésta clase no se va a utilizar ya que 
 * se adopto por que a los usuarios no se les iba a realizar el traslado 
 * del pago
 */
class TrasladarRecaudoController extends Controller {

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

        $response = $this->render('LlanogasLlanogasBundle:Recaudos:trasladar_recaudo.html.twig', $lisParametros);
        $response->headers->set('Content-Type', 'text/html');
        return $response;
    }

    /**
     * Crea un combo de html dependiendo del tipo de motivo.
     * @param type $codTipo
     * @return type
     */
    private function cargarComboDb($codTipo) {
        $conexion = Util::getConexion($this);
        $objModel = new AnularModel();
        $objModel->setConexion($conexion);
        switch ($codTipo) {
            case 'cmbMotivos':
                $resultado = $objModel->buscarMotivos();
                break;
            default:
                break;
        }
        $listaDatos = array();
        foreach ($resultado as $campos) {
            $listaDatos[$campos['id']] = $campos['nombre'];
        }
        return Util::crearCombo($codTipo, $listaDatos);
    }

    /**
     * Hace el traslado del recaudo.
     * @return json con la información de la transacción.
     */
    public function trasladarRecaudoAction() {
        try {
            $respuesta['codigoRespuesta'] = -1;
            $sesion = Util::iniciarSesion($this);
            $conexion = Util::getConexion($this);
            $conexion->beginTransaction();
            $parametros = $this->getParametrosAnulacion($conexion);
            $anularReacudo = new AnularModel($conexion);
            $anularReacudoDelegado = new AnularDelegado($this, $sesion);
            $anularReacudoDelegado->procesarAnulacion($parametros);
            $anularReacudo->actualizarEstadoRecaudo($parametros['idrecaudo'], 'T');
            $idRecaudoNuevo = $this->aplicarRecaudo($parametros, $conexion);
            $conexion->commit();
            $respuesta['codigoRespuesta'] = 1;
            $respuesta['mensajeRespuesta'] = 'Se realizó el traslado satisfactoriamente con número ' . $idRecaudoNuevo;
        } catch (\Exception $ex) {
            $respuesta['mensajeRespuesta'] = $ex->getMessage();
            $respuesta['codigoRespuesta'] = $ex->getCode();
            $conexion->rollBack();
        }
        return Util::construyeRespuesta($respuesta);
    }

    /**
     * Aplica el recaudo que se está trasladando a la nueva suscripción.
     * @param array $parametros información del recaudo que se quiere aplicar.
     * @param \Doctrine\DBAL\Connection $conexion Conexion a la base de datos
     */
    private function aplicarRecaudo(&$parametros, &$conexion) {
        $sesion = Util::iniciarSesion($this);
        $recaudosModel = new RecaudosModel();
        $recaudosModel->setConexion($conexion);
        $objGenericoModelo = new GenericoModel();
        $objGenericoModelo->setConexion($conexion);
        $suscripciones = $parametros['suscripciones'];
        $idRecaudoNuevo = $this->crearRecaudo($conexion, $parametros, $recaudosModel);
        $parametros['idnuevorecaudo'] = $idRecaudoNuevo;
        $recaudoAntiguo = $objGenericoModelo->getRecaudo($parametros['idrecaudo']);
        foreach ($suscripciones as $suscripcion) {
            $cicloPeriodo = $objGenericoModelo->getCicloPeriodoSuscripcion($suscripcion['idsuscripcion']);
            $parametros['idciclo'] = $cicloPeriodo['idCiclo'];
            $parametros['idperiodo'] = $cicloPeriodo['idPeriodo'];
            $parametros['cicloanio'] = $cicloPeriodo['cicloanio'];
            $idDistribucionRecaudo = $this->crearDistribucionRecaudo($conexion, $parametros, $suscripcion);
            $listaDistribucion = $recaudosModel->consultarRecaudoConDisponiblePorId($idDistribucionRecaudo);
            $idUsuario = $sesion->get('idusuario');
            $idEmpresa = $sesion->get('idempresa');
            $idAcceso = $sesion->get('idacceso');
            foreach ($listaDistribucion as $recaudoDisponible) {
                $procesoAplicar = new ProcesoAplicarRecaudos($idEmpresa, -1, $idAcceso, -1, $idUsuario);
                $recaudoDisponible['clasepago'] = $recaudoAntiguo['documento'];
                $recaudoDisponible['iddocumento'] = $recaudoAntiguo['documento'];
                $procesoAplicar->aplicarDisponible($recaudoDisponible, $conexion);
            }
        }
        return $idRecaudoNuevo;
    }

    /**
     * Obtiene parámetros de la petición para realizar la anulación del recaudo.
     * @param \Doctrine\DBAL\Connection $conexion Conexión de la base de datos.
     * @return array Con la información para realizar la anulación.
     */
    private function getParametrosAnulacion(&$conexion) {
        $request = $this->getRequest();
        $objGenericoModelo = new GenericoModel();
        $objGenericoModelo->setConexion($conexion);
        $sesion = Util::iniciarSesion($this);
        $parametros['idempresa'] = $sesion->get('idEmpresa');
        $parametros['idrecaudo'] = $request->get('idrecaudo');
        $parametros['idmotivo'] = $request->get('idmotivo');
        $parametros['comentario'] = $request->get('comentario');
        $parametros['suscriptor'] = $request->get('idsuscriptordestino');
        $parametros['idtercerodestino'] = $request->get('idtercerodestino');
        $parametros['recaudoantiguo'] = $objGenericoModelo->getRecaudo($parametros['idrecaudo']);
        $parametros['suscripciones'] = $request->get('suscripciones');
        return $parametros;
    }

    /**
     * Genera un  nuevo recaudo de acuerdo al anulado.
     * @param \Doctrine\DBAL\Connection $conexion  Conexión a la base de datos.
     * @param array $parametros Array con los parámetros de creación del nuevo recaudo.
     * @param RecaudosModel $recaudosModel Clase que ejecuta las consultas de los recaudos.
     * @return type
     */
    private function crearRecaudo(&$conexion, &$parametros, $recaudosModel) {
        $sesion = Util::iniciarSesion($this);
        $genericoModel = new GenericoModel();
        $genericoModel->setConexion($conexion);
        $idRecaudoAntiguo = $parametros['idrecaudo'];
        $recaudoAntiguo = $genericoModel->getRecaudo($idRecaudoAntiguo);
        $recaudo['pagado'] = $recaudoAntiguo['pagado'];
        $recaudo['cambio'] = $recaudoAntiguo['cambio'];
        $recaudo['ajuste'] = $recaudoAntiguo['ajuste'];
        $recaudo['mediopago'] = $recaudoAntiguo['mediopago'];
        $recaudo['convenio'] = 0;
        $recaudo['tercero'] = $parametros['idtercerodestino'];
        $recaudo['clasepago'] = $recaudoAntiguo['documento'];
        $recaudo['idorigen'] = $idRecaudoAntiguo;
        $recaudo['suscriptor'] = $parametros['suscriptor'];
        $recaudo['sucursal'] = $recaudoAntiguo['idsucursal'];
        $recaudo['idusuario'] = $sesion->get('idusuario');
        $idRecaudoNuevo = $recaudosModel->insertarRecaudo($recaudo, $parametros['idempresa']);
        return $idRecaudoNuevo;
    }

    /**
     * Genera la distribución del recaudo.
     * @param \Doctrine\DBAL\Connection $conexion Conexión a la base de datos.
     * @param array $parametros parametros de la petición
     * @param array $suscripcion Información con la suscripción.
     * @return array con la infromación de la distribución.
     */
    private function crearDistribucionRecaudo(&$conexion, &$parametros, $suscripcion) {
        $recaudosModel = new RecaudosModel();
        $recaudosModel->setConexion($conexion);
        $distribucion['valor'] = $suscripcion['valor'];
        $distribucion['saldo'] = $suscripcion['valor'];
        $distribucion['recaudo'] = $parametros['idnuevorecaudo'];
        $distribucion['convenio'] = 0;
        $distribucion['suscripcion'] = $suscripcion['idsuscripcion'];
        $distribucion['periodo'] = $parametros['idperiodo'];
        $distribucion['ciclo'] = $parametros['idciclo'];
        $distribucion['empresa'] = $parametros['idempresa'];
        $distribucion['cicloanio'] = $parametros['cicloanio'];
        $distribucion['idusuario'] = Util::validarSesion($this->getRequest())->get('idusuario');
        $idDistribucionRecaudo = $recaudosModel->crearDistribucionRecaudo($distribucion);
        $recaudosModel->actualizarMedioPagoRecaudo($parametros['idrecaudo'], $parametros['idnuevorecaudo']);
        return $idDistribucionRecaudo;
    }

}
