<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\CerrarLecturasModel;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\ConstructorasAmortizacionModel;

/**
 * Description of CerrarLecturasDelegado
 *
 * @author Sergio Vargas 
 * 
 */
class ConstructorasGenerarAmortizacionDelegado {

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
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     *  @var ConstructorasAmortizacionModel
     */
    private $constructorasAmortizacionModel;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->constructorasAmortizacionModel = new ConstructorasAmortizacionModel($this->conexion);
        $this->sesion = $sesion;
    }

    public function getCicloActivosPrograma() {
        return $this->genericoModel->consultarCiclosActivosPrograma(CODIGO_PROGRAMA_GENERAR_AMORTIZACION_CONSTRUCTORAS, $this->sesion->get('idempresa'));
    }

    public function ProcesarAmortizacion() {
        /*
         * Obteniendo Listado de Suscripciones que Fueron Agendados y que se van a amortizar
         */

        try {
            $this->conexion->beginTransaction();
            $SuscripcionesProcesar = $this->constructorasAmortizacionModel->getSuscripcionesProcesar($this->sesion->get("emp_ideregistro"));
            $suscripcion = array();
            foreach ($SuscripcionesProcesar as $suscripcion) {
                /*
                 * Construyendo encabezado de la factura
                 */
                $suscripcion['usu_ideregistro'] = $this->sesion->get("usu_ideregistro");
                $encabezado = array();
                $encabezado = $this->constructorasAmortizacionModel->ConstruyeEncabezado($suscripcion);
                if(empty($encabezado))
                    continue;
                
                $idEncabezado = $this->constructorasAmortizacionModel->InsertaEncabezado($encabezado);
                $detallesFactura = $this->constructorasAmortizacionModel->ConstruyeDetalle($idEncabezado, $suscripcion);
                foreach ($detallesFactura as $detalle) {
                    $registroDetalle = array();

                    $registroDetalle['dfac_estado'] = $detalle['dfac_estado'];
                    $registroDetalle['dfac_cantidad'] = $detalle['dfac_cantidad'];
                    $registroDetalle['dfac_vlrunitari'] = $detalle['dfac_vlrunitari'];
                    $registroDetalle['dfac_vlrtotal'] = $detalle['dfac_vlrtotal'];
                    $registroDetalle['dfac_vlrreal'] = $detalle['dfac_vlrreal'];
                    $registroDetalle['dfac_sdoreal'] = $detalle['dfac_sdoreal'];
                    $registroDetalle['fac_ideregistro'] = $detalle['fac_ideregistro'];
                    $registroDetalle['uni_concepto'] = $detalle['uni_concepto'];
                    $registroDetalle['dfac_version'] = $detalle['dfac_version'];
                    $registroDetalle['dfac_version'] = $detalle['dfac_version'];
                    $registroDetalle['sco_ideregistro'] = $detalle['sco_ideregistro'];
                    $registroDetalle['usu_ideregistro'] = $detalle['usu_ideregistro'];
                    $registroDetalle['usu_ideregistro'] = $detalle['usu_ideregistro'];

                    $IdDetalleFactura = $this->constructorasAmortizacionModel->InsertaDetalle($registroDetalle);

                    if ($IdDetalleFactura > 0) {   // Actualizar IdeDetalle Fcatura en SigueACtividades 
                        $this->constructorasAmortizacionModel->ActualizaDetalleFacturaSigueActividades($detalle, $IdDetalleFactura);
                    }
                }
//                $this->conexion->rollBack();
            }
            $this->conexion->commit();
//            $this->conexion->rollBack();
        } catch (\Exception $ex) {
            $this->conexion->rollBack();
            throw new MyException("Error Generando Amortizacion" . $ex->getMessage(), -1);
        }
    }

}

?>
