<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\MovimientosContablesModel;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Genera el proceso de  documentos de pago
 *
 * @author Sergio andrés vargas
 * @date 07 / sep / 2015
 * 
 * 
 */
class MovimientosContablesDelegado {
    // <editor-fold desc="variables ">  

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     * Sesión del usuario
     * @var \Symfony\Component\HttpFoundation\Session\SessionInterface
     */
    private $sesion;

    /**
     *
     * @var Llanogas\LlanogasBundle\Models\GenericoModel 
     */
    private $genericoModel;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\MovimientosContablesModel
     */
    private $movimientosContablesModel;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\ProcesoModel
     */
    private $procesoModel;

    /**
     *
     * @var Llanogas\LlanogasBundle\Delegado\GenericoDelegado 
     */
    private $genericoDelegado;

// </editor-fold>  
    // <editor-fold desc="constructor">  

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
        $this->movimientosContablesModel = new MovimientosContablesModel($this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->sesion = $sesion;
    }

    /**
     * Listado de ciclos
     * @return type
     */
    public function listarCiclos() {
        $empresa = $this->sesion->get('idempresa');
        return $this->genericoModel->consultarCiclosActivosPrograma(PROGRAMA_MOVIMIENTO_CONTABLE, $empresa);
    }

// </editor-fold>
    // <editor-fold desc="">  

    /** @deprecated since version 1.01
     * construye el movimiento contable 
     * @return int identificador del movimiento contable a procesar
     */
    private function crearMovimiento() {
        $idempresa = $this->sesion->get('idempresa');
        $idusuario = $this->sesion->get('idusuario');
        return $this->movimientosContablesModel->crearMovimiento($idempresa, $idusuario);
    }

    /**
     * Ingresa un nuevo registro en la tabla de procesos 
     * @return type
     */
    private function verificarProcesoEjecucion() {
        $empresa = $this->sesion->get('idempresa');
        $parametros['idAcceso'] = $this->sesion->get('idacceso');
        $parametros['idPrograma'] = COD_PROCESO_MOVIMIENTOS_CONTABLES;
        $parametros['estado'] = 'A';
        $parametros['idEmpresa'] = $empresa;
        $parametros['idHilo'] = 1;
        $parametros['fechaInicio'] = 'now()';
        return $this->procesoModel->insertarProceso($parametros);
    }

    /**
     * Se consulta si hay un proceso en ejecución
     * @param type $estado
     * @return type
     */
    public function obtenerEjecucionActual($estado = true) {
        $empresa = $this->sesion->get('idempresa');
        $response = $this->procesoModel->consultarProcesoPorEmpresaEstadoPrograma(COD_PROCESO_MOVIMIENTOS_CONTABLES, $empresa, $estado);
        if (!empty($response)) {
            return $response;
        }
        return null;
    }

    /**
     *  Inicia el proceso de movimientos contables
     */
    public function procesarMovimientosContables($idCiclo, ContainerInterface &$container, $idperiodoCerrado) {
        //lanza excepción si el programa ya ha sido ejecutado anteriormente
        $idEmpresa = $this->sesion->get('idempresa');
        $this->genericoDelegado->validarPrograma(COD_PROCESO_MOVIMIENTOS_CONTABLES, $idCiclo, $idEmpresa);
        $ejecucionactual = $this->obtenerEjecucionActual();
        if (!empty($ejecucionactual)) {
            return $ejecucionactual;
        }
        $idUsuario = $this->sesion->get('idusuario');
        $codigoProceso = $this->verificarProcesoEjecucion();
        $idAcceso = $this->sesion->get('idacceso');
        $ciclo = $this->genericoModel->getCicloPeriodoId($idCiclo);
        $periodo = $ciclo['idperiodo'];
      
        $cicloanio = $ciclo['cicloanio'];

        $parametros = "$idEmpresa $idUsuario $idCiclo $periodo $cicloanio $idAcceso $codigoProceso $idperiodoCerrado " . RUTA_PRINCIPAL;
        $script = $container->get('kernel')->locateResource('@LlanogasLlanogasBundle') . "ProcesosMasivos/EjecutaProcesoMovimientoContable.php $parametros > " . RUTA_PRINCIPAL . "/app/logs/movimiento_contable.log &";
        Util::ejecutarHilo($script);
    }
    
     public function listarCiclosGeneral($idCiclo) {
        $empresa = $this->sesion->get('idempresa');
        return $this->genericoModel->consultarCiclosActivoGeneral($idCiclo);
    }

    //</editor-fold>
}
