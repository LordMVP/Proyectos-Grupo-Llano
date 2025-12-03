<?php

namespace Llanogas\LlanogasBundle\ProcesosMasivos\Procesos;

use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\Delegado\CastigoRecuperacionProvisionDelegado;
use Llanogas\LlanogasBundle\Delegado\CastigoReclasificacionProvisionDelegado;
use Llanogas\LlanogasBundle\Delegado\CastigoProvisionarDelegado;
use Llanogas\LlanogasBundle\Delegado\CastigoCastigarDelegado;
use Llanogas\LlanogasBundle\Models\ProcesoModel;
use \Llanogas\LlanogasBundle\Models\GenericoModel;

/**
 * Proceso de aplicar recaudos.
 *
 * @author hrey
 */
class ProcesoCarteraCastigada {

    private $codigoProceso;
    private $idAcceso;
    private $idCiclo;
    private $idUsuario;
    private $idEmpresa;
    private $conexion;

    /**
     *
     * @var CastigoRecuperacionProvisionDelegado 
     */
    private $recuperacionProvisionDelegado;

    /**
     *
     * @var CastigoReclasificacionProvisionDelegado 
     */
    private $reclasificacionDelegado;

    /**
     *
     * @var CastigoProvisionarDelegado 
     */
    private $provisionarDelegado;

    /**
     *
     * @var CastigoCastigarDelegado 
     */
    private $castigarDelegado;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\ProcesoModel 
     */
    private $procesoModel;

    /**
     *
     * @var \Llanogas\LlanogasBundle\Models\GenericoModel 
     */
    private $genericoDelegado;

    /**
     *
     * @var Int identificador de la actividad  
     */
    private $idactividad;

    /**
     * 
     * @param type $idEmpresa
     * @param type $idUsuario
     * @param type $idCiclo
     * @param type $idAcceso
     * @param type $codigoProceso
     * @param type $idactividad identificador del dper_
     */
    public function __construct($idEmpresa, $idUsuario, $idCiclo, $idAcceso, $codigoProceso, $idactividad) {
        $this->idEmpresa = $idEmpresa;
        $this->idUsuario = $idUsuario;
        $this->idCiclo = $idCiclo;
        $this->idAcceso = $idAcceso;
        $this->conexion = ConexionBD::getConexion();
        $this->idactividad = $idactividad;
        $this->codigoProceso = $codigoProceso;
        $this->recuperacionProvisionDelegado = new CastigoRecuperacionProvisionDelegado($this->conexion, $idAcceso);
        $this->reclasificacionDelegado = new CastigoReclasificacionProvisionDelegado($idAcceso, $this->conexion);
        $this->provisionarDelegado = new CastigoProvisionarDelegado($idAcceso, $this->conexion);
        $this->castigarDelegado = new CastigoCastigarDelegado($idAcceso, $this->conexion);
        $this->procesoModel = new ProcesoModel($this->conexion);
        $this->genericoDelegado = new GenericoModel($this->conexion);
    }

    /**
     * Método encargado de realizar el proceso masivo
     * @throws \Llanogas\LlanogasBundle\MyException
     */
    public function iniciar() {
        try {
              $this->crearTablaLog();
            $this->recuperarProvision();
            $this->provisionarDelegado->provisionarFacturasCarteraNormal($this->idCiclo);
            sleep(15);
            $this->provisionarDelegado->provisionarFacturasFinanciacion($this->idCiclo);
            $listaSuscripcion = $this->reclasificacionDelegado->getSuscripcionesReclasificar($this->idCiclo);
            $this->reclasificarProvision($listaSuscripcion);
            sleep(20);
            $this->castigarSuscripcion($listaSuscripcion);

            $this->genericoDelegado->actualizarActividad($this->idactividad, 'C');
        } catch (\Exception $ex) {
            throw new \Llanogas\LlanogasBundle\MyException($ex->getMessage(), -1);
        } finally {
            if ($this->conexion->isTransactionActive()) {
                $this->conexion->rollBack();
            }
            sleep(120);
            $this->procesoModel->finalizarProceso($this->codigoProceso);
        }
    }

    /**
     * Genera la recuperación de la provisión cuando se ejecuta de forma masiva
     * @return type
     */
    private function recuperarProvision() {
        $listaSuscripciones = $this->recuperacionProvisionDelegado->getSuscripcionesProvisionadas($this->idCiclo);
        $facturasRecuperadas = 0;
        foreach ($listaSuscripciones as $suscripcion) {
            $facturasRecuperadas += $this->recuperacionProvisionDelegado->generarRecuperacion($suscripcion['idsuscripcion']);
        }
        return $facturasRecuperadas;
    }

    /**
     * Genera la reclasificación de la provisión al momento de realizar el castigo
     * @param type $listaSuscripcion
     * @return type
     */
    private function reclasificarProvision($listaSuscripcion) {
        if (empty($listaSuscripcion)) {
            return;
        }
        foreach ($listaSuscripcion as $suscripcion) {
            $this->reclasificacionDelegado->generarReclasificacion($suscripcion['idsuscripcion']);
        }
    }

    /**
     * Elimina una suscripción 
     * @param type $listaSuscripcion
     * @return type
     */
    private function castigarSuscripcion($listaSuscripcion) {
        if (empty($listaSuscripcion)) {
            return;
        }
        foreach ($listaSuscripcion as $suscripcion) {
            try{
                $this->castigarDelegado->castigarCarteraNormal($suscripcion['idsuscripcion']);
                $this->castigarDelegado->castigarCarteraFinanciada($suscripcion['idsuscripcion']);
                $this->castigarDelegado->eliminarSuscripcion($suscripcion['idsuscripcion']);
            } catch (Exception $ex) {
                throw new MyException($ex->getMessage() , -1);
            }
            
        }
    }

    /**
     * Elimina la tabla y la vuelve a crear para 
     * registrar todos los eventos de la nueva ejecución del proceso
     */
    public function crearTablaLog() {
        $this->castigarDelegado->crearTablaLog();
    }

    /**
     * Método encargado de realizar el castigo de una suscripción antes de tiempo
     * y realiza todo el procedimiento
     * @param type $idSuscripcion
     * @throws \Llanogas\LlanogasBundle\MyException
     */
    public function procesarSuscripcion($idSuscripcion) {
        try {
            $this->recuperacionProvisionDelegado->generarRecuperacion($idSuscripcion);
            $this->provisionarDelegado->provisionarFacturasCarteraNormalSuscripcion($idSuscripcion);
            $this->provisionarDelegado->provisionarFacturasFinanciacion(null, $idSuscripcion);
            $this->reclasificacionDelegado->generarReclasificacion($idSuscripcion);
            $this->castigarDelegado->castigarCarteraNormal($idSuscripcion);
            $this->castigarDelegado->castigarCarteraFinanciada($idSuscripcion);
            $this->castigarDelegado->eliminarSuscripcion($idSuscripcion);
        } catch (\Exception $e) {
            throw new \Llanogas\LlanogasBundle\MyException($e->getMessage(), -1);
        }
    }

}
