<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\Models\Conexion\ConexionBD;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\EliminarFacturaModel;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de los recaudos.
 * @author hrey
 */
class EliminarFacturaDelegado {

    /**
     * @var Controller
     */
    private $control;

    /**
     * Objeto de recaudos model
     * @var \Llanogas\LlanogasBundle\Models\EliminarFacturaModel 
     */
    private $eliminarFacturaModel;
    
       /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;


    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    

    /**
     * Información de la sesión.
     * @var SessionInterface 
     */
    private $sesion;
   

    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = ConexionBD::getConexion();
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->eliminarFacturaModel = new EliminarFacturaModel($this->conexion);
        $this->sesion = $sesion;
        $this->control = $control;
    }
    
    public function consultaFacturaSuscripcion($datos) {
        $suscripciones = implode(",", $datos);
        $facturasConSaldo =  $this->eliminarFacturaModel->consultarFacturasModel($suscripciones);
        if (empty($facturasConSaldo)) {
            throw new MyException('No se encontraron facturas del servicio para eliminar', 0);
        }
        $respuesta['facturas'] = $facturasConSaldo;
       
        
        return $respuesta;
    }
    
    public function actualizarFacturasSuscricion($idFaturas){
        try {
            foreach($idFaturas as $idfactura){
                $this->conexion->beginTransaction();
                $factura['fac_ideregistro'] = $idfactura;
                $factura['fac_estado'] = 'E';
                $factura['fac_sdoreal'] = -1;
                $factura['fac_vlrreal'] = -1;
                $factura['fac_feceliminad'] = 'NOW()';
                $this->genericoModel->actualizarFactura($factura);
                //   $this->eliminarFacturaModel->actualizarFacturasSuscricionModel($idFaturas);
                   $this->eliminarFacturaModel->actualizarLecturaModel($idfactura);
                   $this->eliminarFacturaModel->actualizarFacaModel($idfactura);
                $this->conexion->commit();
            }
        } catch (Exception $ex) {
                $this->conexion->rollBack();
                print_r($exc->getTraceAsString());
        }
        finally {
                $this->conexion->close();    
        }
    }
    
     public function getSuscripcionesDelegado($cedula, $idSuscripcion, $codAnterior,$suscripciones) {
        $listadoSuscripciones = $this->eliminarFacturaModel->getSuscripciones($this->sesion->get('idempresa'), $cedula, $idSuscripcion, $codAnterior, "'A'",$suscripciones);
        return $listadoSuscripciones ;
    }

   

}
