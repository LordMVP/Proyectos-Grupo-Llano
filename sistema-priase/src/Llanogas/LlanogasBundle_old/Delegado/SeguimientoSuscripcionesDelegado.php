<?php

namespace Llanogas\LlanogasBundle\Delegado;

use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Llanogas\LlanogasBundle\Models\GenericoModel;
use Llanogas\LlanogasBundle\Models\SeguimientoSuscripcionesModel;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase encargada de administrar la lógica de negocio de los recaudos.
 * @author hrey
 */
class SeguimientoSuscripcionesDelegado {

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
     *
     * @var SeguimientoSuscripcionesModel 
     */
    private $seguimientoSuscripcionModel;

    /**
     * Constructor de la clase 
     * @param Controller $control Controlador desde se hizo la petición.
     */
    public function __construct(Controller &$control, SessionInterface $sesion) {
        $this->conexion = Util::getConexion($control);
        $this->genericoModel = new GenericoModel($this->conexion);
        $this->sesion = $sesion;
        $this->seguimientoSuscripcionModel = new SeguimientoSuscripcionesModel($this->conexion, $sesion);
    }

    public function getFacturas($fechaInicio, $fechaFin, $idSuscripcion) {
        $listaFacturas = $this->seguimientoSuscripcionModel->getFacturas($fechaInicio, $fechaFin, $idSuscripcion);
        if (empty($listaFacturas)) {
            throw new MyException('No se encontraron facturas', 0);
        }
        return $listaFacturas;
    }

    public function getFacturasProvision($fechaInicio, $fechaFin, $idSuscripcion) {
        $listaFacturas = $this->seguimientoSuscripcionModel->getFacturasProvision($fechaInicio, $fechaFin, $idSuscripcion);
        if (empty($listaFacturas)) {
            throw new MyException('No se encontraron facturas', 0);
        }
        return $listaFacturas;
    }

    public function getDocumentos($fechaInicio, $fechaFin, $idSuscripcion) {
        return $this->seguimientoSuscripcionModel->getDocumentos($idSuscripcion, $fechaInicio, $fechaFin);
    }

    public function getDocumentosP($fechaInicio, $fechaFin, $idSuscripcion) {
        return $this->seguimientoSuscripcionModel->getDocumentosP($idSuscripcion, $fechaInicio, $fechaFin);
    }

    public function getFacturasConceptosNotas($idfactura) {
        $listaConceptos = $this->seguimientoSuscripcionModel->getFacturasNotasConceptos($idfactura);
        if (empty($listaConceptos)) {
            throw new MyException('No se encontraron conceptos asociados a la factura', 0);
        }
        return $listaConceptos;
    }

    public function getConceptos($idFactura) {
        $listaConceptos = $this->seguimientoSuscripcionModel->getConceptos($idFactura);
        if (empty($listaConceptos)) {
            throw new MyException('No se ecnontraron conceptos asociados a la factura', 0);
        }
        return $listaConceptos;
    }

    public function getConceptosP($idFactura) {
        $listaConceptos = $this->seguimientoSuscripcionModel->getConceptosP($idFactura);
        if (empty($listaConceptos)) {
            throw new MyException('No se ecnontraron conceptos asociados a la factura', 0);
        }
        return $listaConceptos;
    }

    public function getRecaudosFacturas($idFactura) {
        $listaRecaudos = $this->seguimientoSuscripcionModel->getRecaudosFactura($idFactura);
        if (empty($listaRecaudos)) {
            throw new MyException('No se encontraron recaudos para la factura', 0);
        }
        return $listaRecaudos;
    }

    public function getRecaudosSuscripcion($idSuscripcion, $fechaInicio, $fechaFin) {
        $listaRecaudos = $this->seguimientoSuscripcionModel->getRecaudosSuscripcion($idSuscripcion, $fechaInicio, $fechaFin);
        if (empty($listaRecaudos)) {
            throw new MyException('No se encontraron recaudos para la suscripción', 0);
        }
        return $listaRecaudos;
    }

    public function getClasesPago($idSuscripcion, $fechaInicio, $fechaFin) {
        $listaClasesPago = $this->seguimientoSuscripcionModel->getClasesPago($idSuscripcion, $fechaInicio, $fechaFin);
        if (empty($listaClasesPago)) {
            throw new MyException('No hay clases de pago asociados al recaudo ', -1);
        }
        return $listaClasesPago;
    }

    public function getFacturasRecaudos($idRecaudo) {
        $listaFacturas = $this->seguimientoSuscripcionModel->getFacturasRecaudos($idRecaudo);
        if (empty($listaFacturas)) {
            throw new MyException('No se encontraron facturas asociadas al recaudo', 0);
        }
        return $listaFacturas;
    }

    public function getFinanciacionSuscripcion($idSuscripcion, $fechaInicio, $fechaFin) {
        $listaFinanciaciones = $this->seguimientoSuscripcionModel->getFinanciacionSuscripcion($idSuscripcion, $fechaInicio, $fechaFin);
        if (empty($listaFinanciaciones)) {
            throw new MyException('No se encontraron financiaciones', 0);
        }
        return $listaFinanciaciones;
    }

    public function getFacturasFinanciacion($idFinanciacion) {
        $listaFinanciaciones = $this->seguimientoSuscripcionModel->getFacturasFinanciacion($idFinanciacion);
        if (empty($listaFinanciaciones)) {
            throw new MyException('No se encontraron los registros', 0);
        }
        return $listaFinanciaciones;
    }

    public function getAmortizacion($idfinanciacion, $fechainicio, $fechafin) {
        $listaFinanciaciones = $this->seguimientoSuscripcionModel->getAmortizaciones($fechainicio, $fechafin, $idfinanciacion);
        if (empty($listaFinanciaciones)) {
            throw new MyException('No se encontraron los registros', 0);
        }
        return $listaFinanciaciones;
    }

    public function getCartera($idfinanciacion, $fechainicio, $fechafin) {
        $listaFinanciaciones = $this->seguimientoSuscripcionModel->getCartera($idfinanciacion, $fechainicio, $fechafin);
        if (empty($listaFinanciaciones)) {
            throw new MyException('No se encontraron los registros', 0);
        }
        return $listaFinanciaciones;
    }

    public function getRecaudosConceptos($idrecaudo) {

        $listarecaudos = $this->seguimientoSuscripcionModel->getRecaudosConceptosModel($idrecaudo);
        if (empty($listarecaudos)) {
            throw new MyException('No se encontraron los registros', 0);
        }
        return $listarecaudos;
    }

    public function getFacturasOtrasEmpresas($fechainicio, $fechafin, $suscripcion, $empresa) {
        if (empty($empresa)) {
            $empresa = $this->sesion->get('idempresa');
        }
        $listaFinanciaciones = $this->seguimientoSuscripcionModel->getFacturasOtrasEmpresas($empresa, $fechainicio, $fechafin, $suscripcion);
        if (empty($listaFinanciaciones)) {
            throw new MyException('No se encontraron los registros', 0);
        }
        return $listaFinanciaciones;
    }

    /**
     * recibe las PQR de techsoft
     * @param int $idsuscripcion identificador de la suscripción
     * @return array
     * @throws MyException No se encontraron los registros
     */
    public function getPQR($idsuscripcion, $fechainicial, $fechafinal) {
        $idempresa = $this->sesion->get('idempresa');

        $listaFinanciaciones = $this->seguimientoSuscripcionModel->getPQRModel($idsuscripcion, $idempresa, $fechainicial, $fechafinal);
        if (empty($listaFinanciaciones)) {
            throw new MyException('No se encontraron los registros', 0);
        }
        return $listaFinanciaciones;
    }

    /**
     * recibe las certificaciones de techsoft
     * @param int $idsuscripcion identificador de la suscripción
     * @return array
     * @throws MyException No se encontraron los registros
     */
    public function getCertificaciones($idsuscripcion) {
        $idempresa = $this->sesion->get('idempresa');
        $listaFinanciaciones = $this->seguimientoSuscripcionModel->getCertificacionesModel($idsuscripcion, $idempresa);
        if (empty($listaFinanciaciones)) {
            throw new MyException('No se encontraron los registros', 0);
        }
        return $listaFinanciaciones;
    }

    public function getEmpresas() {

        $empresa = $this->sesion->get('idempresa');

        $listaFinanciaciones = $this->seguimientoSuscripcionModel->getEmpresas($empresa);
        if (empty($listaFinanciaciones)) {
            throw new MyException('No se encontraron los registros', 0);
        }
        return $listaFinanciaciones;
    }

    public function getDatosSuspension($fechainicio, $fechafin, $suscripcion) {
        $listaFinanciaciones = $this->seguimientoSuscripcionModel->getDatosSuspensionModel($fechainicio, $fechafin, $suscripcion);
        if (empty($listaFinanciaciones)) {
            throw new MyException('No se encontraron los registros', 0);
        }
        return $listaFinanciaciones;
    }

    public function getSuspensiones($idsuspensionreconexion) {
        $listaFinanciaciones = $this->seguimientoSuscripcionModel->getSuspensionesModel($idsuspensionreconexion);
        if (empty($listaFinanciaciones)) {
            throw new MyException('No se encontraron los registros', 0);
        }
        return $listaFinanciaciones;
    }

    public function getReconexion($idsuspensionreconexion) {
        $listaFinanciaciones = $this->seguimientoSuscripcionModel->getReconexionesModel($idsuspensionreconexion);

        if (empty($listaFinanciaciones)) {
            throw new MyException('No se encontraron los registros', 0);
        }
        return $listaFinanciaciones;
    }

    public function getLectura($fechainicio, $fechafin, $suscripcion) {
        $listaLecturas = $this->seguimientoSuscripcionModel->getLecturasModel($suscripcion, $fechainicio, $fechafin);

        if (empty($listaLecturas)) {
            throw new MyException('No se encontraron los registros', 0);
        }
        return $listaLecturas;
    }

    public function getDetalleLectura($idlectura) {
        $listaFinanciaciones = $this->seguimientoSuscripcionModel->getDetalleLecturaModel($idlectura);

        if (empty($listaFinanciaciones)) {
            throw new MyException('No se encontraron los registros', 0);
        }
        return $listaFinanciaciones;
    }

    public function getLecturaVista($idlectura) {
        $listaFinanciaciones = $this->seguimientoSuscripcionModel->getLecturaVistaModel($idlectura);

        if (empty($listaFinanciaciones)) {
            throw new MyException('No se encontraron los registros', 0);
        }
        return $listaFinanciaciones;
    }

    public function getNotasFactura($fechainicio, $fechafin, $suscripcion) {
        $listaFinanciaciones = $this->seguimientoSuscripcionModel->getNotasFacturaModel($suscripcion, $fechainicio, $fechafin);

        if (empty($listaFinanciaciones)) {
            throw new MyException('No se encontraron los registros', 0);
        }
        return $listaFinanciaciones;
    }

    public function getNotasRecaudo($fechainicio, $fechafin, $suscripcion) {
        $listaFinanciaciones = $this->seguimientoSuscripcionModel->getNotasRecaudoModel($suscripcion, $fechainicio, $fechafin);
        if (empty($listaFinanciaciones)) {
            throw new MyException('No se encontraron los registros', 0);
        }
        return $listaFinanciaciones;
    }

    // <editor-fold desc="Reclamos">  
    /**
     * Permite obtener el listado de reclamos
     * @param Date $fechainicio fecha de inicio de proceso
     * @param Date $fechafin fecha fin de proceso
     * @param int $suscripcion identificador de suscripción
     * @return Array listado de reclamos
     * @throws MyException No se encontraron los registros
     */
    public function getReclamos($suscripcion, $fechainicio, $fechafin) {
        $listaFinanciaciones = $this->seguimientoSuscripcionModel->ObtenerReclamosModel($suscripcion, $fechainicio, $fechafin);
        if (empty($listaFinanciaciones)) {
            throw new MyException('No se encontraron los registros', 0);
        }
        return $listaFinanciaciones;
    }
    
    public function getTarifas($idSuscripcion, $fechainicio, $fechafin) {
        $tarifas = $this->seguimientoSuscripcionModel->getTarifas($idSuscripcion, $fechainicio, $fechafin);
        if (empty($tarifas)) {
            throw new MyException('No se encontraron los registros de tarifas', 0);
        }
        return $tarifas;
    }
    
    public function getAllConceptos($idFactura) {
        $listaConceptos = $this->seguimientoSuscripcionModel->getAllConceptos($idFactura);
        if (empty($listaConceptos)) {
            throw new MyException('No se ecnontraron conceptos asociados a la factura', 0);
        }
        return $listaConceptos;
    }
    
    public function getAuditoria($idSuscripcion, $fechainicio, $fechafin) {
        $auditoriaTerceros = array();
        $auditoriaPropiedades = array();
        $auditoriaConceptoExento = array();
        $auditoriaRuta = array();
        $listadoAuditoria = array();
        $auditoriaSuscripcion = $this->seguimientoSuscripcionModel->getAuditoriaSuscripcion($idSuscripcion, $fechainicio, $fechafin);
        $auditoriaTerceros = $this->seguimientoSuscripcionModel->getAuditoriaTercero($idSuscripcion, $fechainicio, $fechafin);
        $auditoriaPropiedades = $this->seguimientoSuscripcionModel->getAuditoriaPropiedad($idSuscripcion, $fechainicio, $fechafin);
        $auditoriaConceptoExento = $this->seguimientoSuscripcionModel->getAuditoriaConceptoExento($idSuscripcion, $fechainicio, $fechafin);
        $auditoriaRuta = $this->seguimientoSuscripcionModel->getAuditoriaRuta($idSuscripcion, $fechainicio, $fechafin);
        $listadoAuditoria['auditoriasuscripcion'] = $auditoriaSuscripcion ;
        $listadoAuditoria['auditoriaterceros'] = $auditoriaTerceros ;
        $listadoAuditoria['auditoriapropiedades'] = $auditoriaPropiedades ;
        $listadoAuditoria['auditoriaconceptoexento'] = $auditoriaConceptoExento ;
        $listadoAuditoria['auditoriaruta'] = $auditoriaRuta ;
        return $listadoAuditoria;
    }

// </editor-fold>
}
