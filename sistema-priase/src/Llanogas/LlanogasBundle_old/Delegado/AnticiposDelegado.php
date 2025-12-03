<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Llanogas\LlanogasBundle\Models\AnticiposModel;
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
 * 
 */
class AnticiposDelegado {

    /**
     * Objeto de recaudos model
     * @var \Llanogas\LlanogasBundle\Models\AnticiposModel
     */
    private $anticipossModel;

    /**
     * Conexión a la base de datos
     * @var \Doctrine\DBAL\Connection 
     */
    private $conexion;

    /**
     * Objeto de la clase de generico model
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     * Información de la sesión.
     * @var SessionInterface 
     */
    private $sesion;
    private $genericoDelegado;

    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->anticipossModel = new AnticiposModel($this->conexion);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $sesion;
        $this->genericoDelegado = new GenericoDelegado($this->conexion);
    }

    /**
     * lista las liquidaciones disponibles para el tipo de documento seleccionado 
     * @param int $idTipoDocumento 
     * @param int $idSuscripcion
     * @return type
     */
    public function obtenerLiquidacionesPorTipoDocumento($idTipoDocumento, $idSuscripcion) {
        $idusuario = $this->sesion->get('idusuario');
        $idempresa = $this->sesion->get('idempresa');
        return $this->anticipossModel->obtenerLiquidacionesPorTipoDocumentoModel($idTipoDocumento, PROGRAMA_ANTICIPOS_ID, $idusuario, $idempresa, $idSuscripcion);
    }

    /**
     * lista los tipos de documento asociados al tipo de uso de la suscripción
     */
    public function obtenerTiposDocumentos() {
        $idusuario = $this->sesion->get('idusuario');
        $idempresa = $this->sesion->get('idempresa');
        return $this->genericoModel->getTipoDocumentoPerfil(PROGRAMA_ANTICIPOS_ID, $idusuario, $idempresa);
    }

    /**
     * lista los tipos de documento asociados al tipo de uso de la suscripción
     */
    public function obtenerTiposDocumentoPorTipoUso($idsuscripcion , $anticipoOrden = null) {
        $facturasConSaldo = $this->genericoModel->getFacturasConSaldo($idsuscripcion);
//        var_dump($facturasConSaldo);
//        die();
        if (!empty($facturasConSaldo)) {
            throw new MyException('La suscripción tiene facturas con saldo', -3);
        }
        $idusuario = $this->sesion->get('idusuario');
        $idempresa = $this->sesion->get('idempresa');
        
        if ( intval($anticipoOrden) === 1) {
            return $this->anticipossModel->obtenerTiposDocumentoPorTipoUsoAnticipoServicioModel($idsuscripcion, PROGRAMA_ANTICIPOS_ID, $idusuario, $idempresa , $anticipoOrden );    
        }else{
            return $this->anticipossModel->obtenerTiposDocumentoPorTipoUsoModel($idsuscripcion, PROGRAMA_ANTICIPOS_ID, $idusuario, $idempresa , $anticipoOrden );
        }
        
    }

    /**
     * lista los documentos disponibles para el usuario y la empresa
     */
    public function obtenerDocumentos($idtipodocumento) {
        $idusuario = $this->sesion->get('idusuario');
        $idempresa = $this->sesion->get('idempresa');
        return $this->genericoModel->getDocumentoPerfil(PROGRAMA_ANTICIPOS_ID, $idusuario, $idempresa, $idtipodocumento);
    }

    /**
     * lista los conceptos asociados a las liquidaciones
     */
    public function obtenerConceptosAnticipos($idliquidacion) {
        return $this->anticipossModel->ObtenerConceptosAnticiposModel($idliquidacion);
    }
    
    public function getperiodos($idsuscripcion, $idrecaudo = null) {
        return $this->anticipossModel->getPeriodosPorSuscripcion($idsuscripcion, $idrecaudo);
    }

}
