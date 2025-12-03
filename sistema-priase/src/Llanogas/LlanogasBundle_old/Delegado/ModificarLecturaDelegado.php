<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Doctrine\DBAL\Portability\Connection;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\ModificarLecturaModel;
use Llanogas\LlanogasBundle\Models\NotasAutomaticasModel;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\ProcesosMasivos\Procesos\ProcesoNotasCalculada;

/**
 * Description of ModificarLecturaDelegado
 *
 * @author Lord_Nightmare
 */
class ModificarLecturaDelegado {

    /**
     * Conexión a la base de datos
     * @var Connection 
     */
    private $conexion;

    /**
     *
     * @var SessionInterface
     */
    private $sesion;

    /**
     *
     * @var GenericoModel
     */
    private $genericoModel;

    /**
     *
     * @var ModificarLecturaModel
     */
    private $modificarLecturaModel;

    /**
     *
     * @var NotasAutomaticasModel
     */
    private $notasAutomaticasModel;

    /**
     *
     * @var LecturasDelegado 
     */
    private $lecturasDelegado;
    private $procesoNotasCalculada;

    /**
     * Información del encabezado que se está modificando
     * @var array 
     */
    private $encabezado;

    /**
     * Constructor del delegado
     * @param Controller $control instancia del controlador que invoca el delegado
     * @param SessionInterface $sesion instancia de la sesion de usuario
     */
    public function __construct(Controller &$control, SessionInterface &$sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->modificarLecturaModel = new ModificarLecturaModel($this->conexion, $sesion);
        $this->lecturasDelegado = new LecturasDelegado($control, $sesion);
        $this->notasAutomaticasModel = new NotasAutomaticasModel($this->conexion);
        $parametros['idacceso'] = $sesion->get('idacceso');
        $parametros['conceptos'] = json_encode(CONCEPTOS_CONSUMO);
        $parametros['idprograma'] = PROGRAMA_MODIFICAR_LECTURAS;
        $parametros['idproceso'] = 1;
        $this->procesoNotasCalculada = new ProcesoNotasCalculada($parametros, $this->conexion);
        $this->sesion = $sesion;
    }

    /**
     * obtener la informacion de la lectura actual y anterior de una suscripcion
     * @param int $suscripcion id de la suscripcion
     * @return array informacion de la lectura anterior y actual de la suscripcion
     */
    private function obtenerInformacionLectura($suscripcion) {
        $lecturas = array();
        $lecturas['lecturaactual'] = $this->modificarLecturaModel->obtenerLecturaActual($suscripcion);
        $anterior = $this->obtenerInformacionLecturaAnterior($suscripcion);
        if (!empty($anterior)) {
            $lecturas['lecturaanterior'] = $anterior; // $this->obtenerInformacionLecturaAnterior($suscripcion);
        }

        $medidorModificado = $this->obtenerInformacionMedidorModificado($suscripcion);
        if (!empty($medidorModificado)) {
            $lecturas['lecturamedidor'] = $medidorModificado;
        }
        return $lecturas;
    }

    /**
     * Permite visualizar si extiste un medidor modificado
     * @param int $idSuscripcion identificadoe de la suscripción
     */
    private function obtenerInformacionMedidorModificado($idSuscripcion) {
        $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($idSuscripcion);
        $encabezadoModificado = $this->modificarLecturaModel->obtenerLecturaAnterior($idSuscripcion, $cicloPeriodo['idperiodo'], $cicloPeriodo['idciclo'], 'K');

        if (empty($encabezadoModificado)) {
            $ciPerAnterior = $this->modificarLecturaModel->obtenerCicloPeriodoAnteriorSuscripcion($cicloPeriodo['idciclo'], $cicloPeriodo['idperiodo'], $cicloPeriodo['orden']);
            $encabezadoModificado = $this->modificarLecturaModel->obtenerLecturaAnterior($idSuscripcion, $ciPerAnterior['idperiodo'], $ciPerAnterior['idciclo'], 'K');
        }

        return $encabezadoModificado;
    }

    /**
     * Consulta la informacion de una o mas suscripciones segun el id de la
     * suscripcion, el documento del suscriptor o el codigo anterior de la
     * suscripcion y la informacion basica de su lectura actual y anterior
     * @param int $idSuscripcion id de la suscripcion a consultar
     * @param int $documento documento del tercero
     * @param int $codigoAnterior codigo anterior de la suscripcion
     * @return array informacion de la suscripcion, lectura actual y anterior
     */
    public function consultarSuscripcionesDelegado($idSuscripcion, $documento, $codigoAnterior) {
        $parametros['idtercero'] = $documento;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['codigoanterior'] = $codigoAnterior;
        $idusuario = $this->sesion->get('idusuario');
        $suscripciones = $this->genericoModel->getSuscripcion($parametros, $idusuario);
        $lecturas = $this->cargarFiltroLecturaSuscripcion($suscripciones);
        return $lecturas;
    }

    /**
     * Consulta la informacion completa de la suscripcion y de la lectura segun
     * sus respectivos ids
     * @param int $idSuscripcion id de la suscripcion a consultar
     * @param int $idLectura id de la lectura a consultar
     * @return array informacion completa de la suscripcion y de la lectura
     * seleccionada
     */
    public function consultarEncabezadoLecturaSuscripcion($idSuscripcion, $idLectura) {
        $datos = array();
        $datos['suscripcion'] = $this->consultarSuscripcion($idSuscripcion);
        $datos['encabezadolectura'] = $this->consultarEncabezadoLectura($idLectura);
        $datos['encabezadolectura']['detalleslectura'] = $this->consultarDetallesEncabezadoLectura($datos['encabezadolectura']['idlecturaencabezado']);
        return $datos;
    }

    /**
     * Consulta la suscripcion actual y anterior de un conjunto de suscripciones
     * @param array $suscripciones arreglo de suscripciones a consultar
     * @return array informacion de las lecturas de las suscripciones
     */
    private function cargarFiltroLecturaSuscripcion($suscripciones) {
        $lecturasSuscripciones = array();
        foreach ($suscripciones as $suscripcion) {
            $lecturasSuscripciones['suscripcion']['idsuscripcion'] = $suscripcion['idsuscripcion'];
            $lecturasSuscripciones['suscripcion']['documento'] = $suscripcion['cedula'];
            $lecturasSuscripciones['suscripcion']['nombre'] = $suscripcion['nombretercero'];
            $lecturasSuscripciones['lecturas'] = $this->obtenerInformacionLectura($suscripcion['idsuscripcion']);
        }
        return $lecturasSuscripciones;
    }

    /**
     * Consulta la informacion de la lectura anterior de una suscripcion
     * @param int $idSuscripcion id de la suscripcion a consultar
     * @return array informacion de la lectura anterior de la suscripcion
     */
    private function obtenerInformacionLecturaAnterior($idSuscripcion) {
        $cicloPeriodo = $this->genericoModel->getCicloPeriodoSuscripcion($idSuscripcion);
        $ciPerAnterior = $this->modificarLecturaModel->obtenerCicloPeriodoAnteriorSuscripcion($cicloPeriodo['idciclo'], $cicloPeriodo['idperiodo'], $cicloPeriodo['orden']);
        $encabezadoAnterior = $this->modificarLecturaModel->obtenerLecturaAnterior($idSuscripcion, $ciPerAnterior['idperiodo'], $ciPerAnterior['idciclo'], 'P');
        return $encabezadoAnterior;
    }

    /**
     * Consulta el arreglo de motivos disponibles para notas segun una estructura
     * @return array arreglo de motivos para notas
     * @throws MyException
     */
    private function obtenerMotivosNota() {
        $motivos = $this->modificarLecturaModel->consultarMotivosNota(PROGRAMA_MODIFICAR_LECTURAS);
        if (empty($motivos)) {
            throw new MyException("Error, no se encontraron motivos de nota", 0);
        }
        return $motivos;
    }

    /**
     * Despliega un combo en html con los motivos
     * @return html combo con motivos para nota de condonacion
     */
    public function cargarComboDb() {
        $codTipo = "cmbMotivosNota";
        $resultado = $this->obtenerMotivosNota();
        $listaDatos = array();
        foreach ($resultado as $campos) {
            $listaDatos[$campos['id']] = $campos['nombre'];
        }
        return Util::crearComboEx($codTipo, $listaDatos);
    }

    /**
     * Consulta la informacion de una lectura segun su id
     * @param int $idLectura id de la lectura a consultar
     * @return array informacion del encabezado de una lectura
     * @throws MyException lanzada al no encontrar informacion del encabezado
     * de una lectura
     */
    private function consultarEncabezadoLectura($idLectura) {
        $encabezadoLectura = $this->modificarLecturaModel->consultarInformacionLectura($idLectura);
        if (empty($encabezadoLectura)) {
            throw new MyException('Encabezado de lectura de no encontrado', 0);
        }
        return $encabezadoLectura;
    }

    /**
     * Consulta la informacion de los detalle de encabezado de lectura
     * @param type $idEncabezadoLectura id del encabezado de lectura
     * @return array
     * @throws MyException
     */
    private function consultarDetallesEncabezadoLectura($idEncabezadoLectura) {
        $detallesLectura = $this->modificarLecturaModel->detalleLectura($idEncabezadoLectura);
        return $detallesLectura;
    }

    /**
     * Consulta la informacion completa de una suscripción
     * @param int $idSuscripcion id de la suscripción a consultar
     * @return array informacion de la suscripción
     * @throws MyException lanzada al no encontrar informacion de una suscripción
     */
    private function consultarSuscripcion($idSuscripcion) {
        $suscripcion = $this->modificarLecturaModel->getSuscripciones($idSuscripcion, NULL, NULL);
        if (empty($suscripcion)) {
            throw new MyException('Suscripcion no encontrada', 0);
        }
        return $suscripcion;
    }

    /**
     * Cambia el estado de la lectura de la suscripcion anterior a estado A 
     * para realizar la modificacion de la lectura 
     * @param int $idSuscripcion id de la suscripcion
     * @param int $idLectura id del encabezado de la lectura
     * @throws Exception al existir una excepcion que cancele la transaccion
     */
    public function cambiarEstadoSuscripcion($idSuscripcion, $idLectura) {
        $lectura['estado'] = 'T';
        $this->modificarLecturaModel->cambiarEstadoLectura($idLectura, $lectura['estado']);
    }

    /**
     * Revierte el cambio de estados de la lectura anterior y actual a su estado
     * original
     * @param int $idSuscripcion id de la suscripcion a modificar
     * @param int $idLectura id de la lectura anterior con estado A
     */
    private function revertirCambioEstadoSuscripcion($idSuscripcion, $idLectura, $infoLectura) {
        $lecturaAnterior = $this->consultarEncabezadoLectura($idLectura);
        $this->modificarLecturaModel->cambiarEstadoLectura($lecturaAnterior['idlecturaencabezado'], $infoLectura['estado']);
    }

    public function generarModificacionLectura($informacion) {
        $encabezado = $informacion['encabezado'];
        $idSuscripcion = $encabezado['idsuscripcion'];
        $idLectura = $encabezado['idlecturaencabezado'];
        $this->encabezado = $encabezado;
        try {
            $this->conexion->beginTransaction();
            $infoLectura = $this->modificarLecturaModel->consultarInformacionLectura($idLectura);
            $this->generarModificacion($informacion);
            $infoLiquidacion = $this->modificarLecturaModel->consultarLiquidacionSuscripcion($idSuscripcion);
            $factura = $this->modificarLecturaModel->consultarFacuraCicloPeriodo($idSuscripcion, $infoLectura['idciclolectura'], $infoLectura['idperiodolectura'], $infoLectura['aniolectura'], $infoLiquidacion['idliquidacion']);
            /**
             * Se verifica que la modificación de lectura genere nota o no 
             */
            if (!empty($factura) && isset($encabezado['validarnota']) && is_numeric($encabezado['idmotivo'])) {
                $factura['idmotivo'] = $encabezado['idmotivo'];
                $factura['comentario'] = $encabezado['observaciones'];
                /**
                 * Se procede a realizar la liquidación parcial de acuerdo a los conceptos 
                 * seleccionados en la interfaz
                 */
                $this->procesoNotasCalculada->notaSuscripcion($factura);
                $this->revertirCambioEstadoSuscripcion($idSuscripcion, $idLectura, $infoLectura);
            }
            $this->conexion->commit();
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            $this->procesoNotasCalculada->finalizarProceso();
            throw $ex;
        }
        $this->procesoNotasCalculada->finalizarProcesoUsuario($this->sesion->get('idusuario'), PROGRAMA_MODIFICAR_LECTURAS);
    }

    /**
     * Se cambia el estado al encabezado de lectura 
     * para que cuando se liquide tome el encabezado que se está realizando
     * la modificación
     * @param type $informacion
     */
    private function generarModificacion($informacion) {
        $idusuario = $this->sesion->get('idusuario');
        if (is_numeric($this->encabezado['idmotivo'])) {
            $this->cambiarEstadoSuscripcion($informacion['encabezado']['idsuscripcion'], $informacion['encabezado']['idlecturaencabezado']);
        }
        $datos = $informacion['datos'];
        $encabezado = $informacion['encabezado'];
        if (isset($encabezado['cabeceracambiada'])) {
            /**
             * Se registran los datos de la lectura en los detalles como una observación
             */
            $encabezadoSinModificar = $this->consultarEncabezadoLectura($encabezado['idlecturaencabezado']);
            if ($encabezadoSinModificar['factorcorreccion'] !== $encabezado['factorcorreccion']) {
                $encabezadoSinModificar['observaciones'] .= " - Factor correción: " . $encabezadoSinModificar['factorcorreccion'];
            }
            $encabezado['estado'] = $encabezadoSinModificar['estado'] ;
            $this->agregarDetalleLectura($datos, $encabezadoSinModificar);
            $this->modificarLecturaModel->actualizarEncabezadoLectura($encabezado);
        }
        $resultado = $this->modificarLecturaModel->consultaDetalleLecturaEstadoP($encabezado)[0];
        if(!empty($resultado)){
            $encabezado['idusuario'] = $idusuario;
            $this->modificarLecturaModel->actualizaDetalleAsignadoAlEncabezado($resultado['iddetallelectura'],$encabezado);
        }
        
        
        if (!empty($datos)) {
            $this->lecturasDelegado->gestionarLectura($datos);
        }
    }

    /**
     * Se crea la información del detalle de la lectura
     * @param array $detallesLectura
     * @param type $lectura
     */
    private function agregarDetalleLectura(&$detallesLectura, $lectura) {
        $lectura['accion'] = 'I';
        $lectura['estado'] = 'M';
        $lectura['idanomalia'] = '-1';
        $lectura['idnovedad'] = '-1';
        $lectura['lecturaactual'] = $lectura['lecturaactual'];
        $lectura['observacion'] = $lectura['observaciones'];
        $lectura['fechaaprobacion'] = $lectura['fechaaprobacion'];
        $lectura['idempresa'] = $this->sesion->get('idempresa');
        $detallesLectura[] = $lectura;
    }
    
     public function consultarFactura($idSuscripcion, $idPeriodo) {
        return $this->modificarLecturaModel->getFactura($idSuscripcion, $idPeriodo);
        
    }

}
