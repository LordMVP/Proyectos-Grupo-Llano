<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Genera y Administra las provisiones del proceso
 *
 * @author hrey
 */
class ProvisionesModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    /**
     * Genera una instancia de la clase Generico model
     * @return \Llanogas\LlanogasBundle\Models\GenericoModel
     */
    private function getGenericoModel() {
        $genericoModel = new GenericoModel();
        $genericoModel->setConexion($this->conexion);
        return $genericoModel;
    }

    /**
     * Filtra las facturas con saldo a provisionar
     * @param int $idEmpresa Identificador de la empresa
     * @param date $fechaProvision Fecha del aprovisionamiento
     * @return array Listado de las facturas con saldo para realizar el aprovisionamiento.
     */
    public function filtrarFacturasConSaldoProvisionar($idEmpresa, $fechaProvision) {
        $sql = "select * from facturasconsaldoprovisiones($idEmpresa,'$fechaProvision'::date)";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            return;
        }
        $listaFacturas = array();
        $genericoModel = $this->getGenericoModel();
        foreach ($resultado as $informacionFactura) {
            $factura = $genericoModel->consultarFactura($informacionFactura['idfactura']);
            $factura['valortotal'] = $informacionFactura['valortotal'];
            $factura['valorpagado'] = $informacionFactura['valorpagado'];
            $listaFacturas[] = $factura;
        }
        return $listaFacturas;
    }

    /**
     * Consulta la información del periodo
     * @param int $idPeriodo identificador del periodo
     * @return array Detalle del periodo
     * @throws MyException No se encontró el periodo.
     */
    public function consultarFechaInicioPeriodo($idPeriodo) {
        $sql = "select per_fecinicial fechainicio from per_periodo where per_ideregistro=$idPeriodo";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('Error al consultar la fecha inicial');
        }
        return $resultado[0];
    }

    /**
     * Consulta los conceptos con saldo de una factura.
     * @param int $idFacturas identificador de la factura.
     * @return array Listado de los conceptos de la factura
     */
    public function consultarConceptosConSaldo($idFacturas) {
        $parametros['idfactura'] = $idFacturas;
        $sql = "select * from consultarconceptosconsaldo(:idfactura)
                where valor > 0";
        $this->setSql($sql);
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta los pagos realizados a una factura que ya se hizo aprovisionamiento.
     * @param date $fechaProvision Fecha de aprovisionamiento.
     * @return array Listado de los pagos y con su correspondiente factura.
     */
    public function pagosFacturasRecuperarProvision($fechaProvision) {
        $sql = "select distinct fac.fac_ideregistro idfactura,fac.fac_numero numero,fac.
                fac_metgenera metodogeneracion,fac.fac_estado estado ,fac.
                fac_fecha fecha,fac.fac_ideactual ideactual,fac.
                fac_idepadre idfacturapadre,fac.fac_fecaprobada fechaaprobacion,fac.
                fac_feceliminad fechaeliminacion,fac_fecfinancia fechafinanciacion,fac.
                fac_feccastigad fechacastigada,fac.fac_fecvence fechavencimiento,fac.emp_ideregistro idempresa,fac.
                sus_ideregistro idsuscriptor,fac.dsus_ideregistr idsuscripcion,fac.
                uni_tipsuscripc idtiposuscripcion,fac.uni_tipusosuscr idtipousosuscripcion,fac.
                uni_liquidacion idliquidacion,fac.ter_ideregistro idtercero,fac.
                cic_ideregistro idciclo,fac.per_ideregistro idperiodo,fac.
                uni_documento iddocumento,fac.uni_tipdocument idtipodocumento,fac.
                amo_ideregistro idamortizacion,fac.est_liquidacion idestructuraliquidacion,fac.
                est_tipusosuscr idestructuratipousosuscripcion,fac.per_ano anio,fac.
                hliq_ideregistr idhistoricoliquidacion,fac.est_documento idestructuradocumento,fac.
                est_tipdocument idestructuratipodocumento,fac.est_tipsuscripc idestructuratiposuscripcion,fac.
                fac_sdoreal saldoreal,fac.fac_ideorigen idfacturaorigen,fac.uni_tiptercero idtipotercero,fac.
                fac_fecsuspens fechasuspension,coalesce(sum(drec.drec_vlrreal),0) abonoprovision
              from fac_factura fac inner join dfac_detfactura dfac on fac.fac_ideregistro=dfac.fac_ideregistro
              inner join drec_detrecaudo drec on drec.dfac_ideregistr=dfac.dfac_ideregistr
              where
               fac_ideorigen in (select fac_ideorigen from fac_factura where  uni_liquidacion in (select uni_liquidacion from liq_liquidacion where liq_venclasific='PR'))
               and drec.drec_fecha between  (select  ('$fechaProvision'::date- CAST((extract(day from '$fechaProvision'::date))||' days' AS INTERVAL)))  and 
                (select ('$fechaProvision'::date- CAST((extract(day from '$fechaProvision'::date))||' days' AS INTERVAL) + interval '1 month'))
              group by
                   fac.fac_ideregistro,fac. fac_numero,fac. fac_metgenera,fac. fac_estado,fac. fac_fecha,
                   fac.fac_ideactual,fac. fac_idepadre,fac. fac_fecaprobada,fac. fac_feceliminad,
                   fac.fac_fecfinancia,fac. fac_feccastigad,fac. fac_fecvence,fac. emp_ideregistro,
                   fac.sus_ideregistro,fac. dsus_ideregistr,fac. uni_tipsuscripc,fac. uni_tipusosuscr,
                   fac.uni_liquidacion,fac. ter_ideregistro,fac. cic_ideregistro,fac. per_ideregistro,
                   fac.uni_documento,fac. uni_tipdocument,fac. amo_ideregistro,fac. est_liquidacion,
                   fac.est_tipusosuscr,fac. per_ano,fac. hliq_ideregistr,fac. est_documento,fac. est_tipdocument,
                   fac.est_tipsuscripc,fac. fac_sdoreal,fac. fac_ideorigen,fac. uni_tiptercero,
                   fac.fac_fecsuspens";
        return $this->executeQuery($sql);
    }

    /**
     * Consulta los abonos realizados a un concepto.
     * @param int $idFactura identificador de la factura.
     * @param date $fechaProvision Fecha de la aprovisionamiento
     * @return array Listado de los abonos realizados a un concepto.
     */
    public function consultarAbonoConcepto($idFactura, $fechaProvision) {
        $sql = "select * from abonoconceptosprovisionar($idFactura,'$fechaProvision') where  valorpagado>0";
        return $this->executeQuery($sql);
    }

    /**
     * Consulta las facturas para reclasificarlas
     * @param date $fecha Fecha que se quiere obtener las facturas para reclasificarlas
     * @param int $idEmpresa Identificador de la empresa.
     * @return array Listado de facturas para reclasificar
     */
    public function consultarFacturasReclasificacion($fecha, $idEmpresa) {
        $sql = "  select * from facturasreclasificacion($idEmpresa,'$fecha'::date)";
        return $this->executeQuery($sql);
    }

    /**
     * Listado de las financiaciones para reclasificar
     * @param date $fecha fecha de reclasificación
     * @param int $idEmpresa identificador de la empresa
     * @return array Listado de financiaciones para reclasificar.
     */
    public function financiacionesParaReclasificar($fecha, $idEmpresa) {
        $sql = "  select * from financiacionesparareclasificar($idEmpresa,'$fecha'::date)";
        return $this->executeQuery($sql);
    }

    /**
     * Consulta las facturas provisionadas que ya cumplieron el tiempo para 
     * castigar.
     * @param int $idSuscripcion identificador de la suscripción.
     * @param date $fecha Fecha de provisionamiento y/o castigo.
     * @return array Listado de las facturas
     */
    public function consultarFacturasProvisionadasParaCastigar($idSuscripcion, $fecha) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['fecha'] = $fecha;
        $sql = "select * from facturasprovisionadasparacastigar(:idsuscripcion,:fecha)";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta de facturas sin aprovisionamiento para castigar
     * @param int $idSuscripcion identificador de la suscripción.
     * @param date $fecha fecha actual del sistema
     * @return array Listado de facturas
     */
    public function consultarFacturasSinProvisionarParaCastigar($idSuscripcion, $fecha) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['fecha'] = $fecha;
        $sql = "select * from facturasnoprovisionadasparacastigar(:idsuscripcion,:fecha)";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta el listado de financiaciones a aprovisionar
     * @param int $idEmpresa identificador de la empresa
     * @param date $fecha Fecha del sistema
     * @return array Listado de las financiaciones 
     */
    public function consultarFinanciacionesProvisionar($idEmpresa, $fecha) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['fecha'] = $fecha;
        $sql = "  select * from financiacionesparaprovisionar(:idempresa,:fecha)";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Listado de financiaciones para recuperar la provisión.
     * @param int $idEmpresa identificador de la empresa.
     * @param date $fecha Fecha del sistema.
     * @return array Listado de financiaciones.
     */
    public function consultarFinanciacionesRecuperarProvision($idEmpresa, $fecha) {
        $parametros['idempresa'] = $idEmpresa;
        $parametros['fecha'] = $fecha;
        $sql = "  select * from financiacionespararecuperarprovision(:idempresa,:fecha);";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta los detalles de la financiacion
     * @param int $idFinanciacion identificador de una financiación.
     * @return array Detalle de la financiación.
     */
    public function consultarInformacionFinanciacion($idFinanciacion) {
        $parametros['idfinanciacion'] = $idFinanciacion;
        $sql = "
	select 
	      amfi.emp_ideregistro idempresa,
	      amfi.dsus_ideregistr idsuscripcion,
	      dsus.sus_ideregistro idsuscriptor,
	      dsus.uni_tipsuscripc idtiposuscripcion,
	      dsus.uni_tipusosuscr idtipousosuscripcion,
	      dsus.ter_ideregistro idtercero,
	      dsus.est_tipusosuscr idestructuratipousosuscripcion,
	      dsus.est_tipsuscripc idestructuratiposuscripcion,
	      ter.uni_tiptercero idtipotercero,
	      amfi.uni_tipdocument idtipodocumento,
	      amfi.uni_documento iddocumento,
	      uni.est_ideregistro idestructuratipodocumento
	from 
	      amfi_amofinanci  amfi inner join dsus_detsuscrip dsus on amfi.dsus_ideregistr=dsus.dsus_ideregistr
	      inner join ter_tercero ter on dsus.ter_ideregistro=ter.ter_ideregistro
	      inner join uni_unidad uni on amfi.uni_tipdocument=uni.uni_ideregistro
	where 
	      amfi.amfi_estado='A' and amfi.fin_ideregistro=:idfinanciacion";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta los conceptos de una financiación.
     * @param int $idFinanciacion Identificador de la financiacipón.
     * @return array Listado de conceptos
     */
    public function consultarConceptosFinanciacionProvisionar($idFinanciacion) {
        $parametros['idfinanciacion'] = $idFinanciacion;
        $sql = "select 
                dfin.uni_concepto idconcepto,
                coalesce(sum(drec.drec_vlrreal),0) saldoconcepto
              from 
                dfin_detfinanci dfin inner join dfac_detfactura dfac on dfin.dfin_ideregistr=dfac.dfac_ideregistr
                inner join drec_detrecaudo drec on drec.dfac_ideregistr=dfac.dfac_ideregistr
              where
                dfin.fin_ideregistro=:idfinanciacion 
              group by 
                dfin.uni_concepto ";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta los conceptos de una fiananciación para realizar la recuperación de la provisionamiento.
     * @param int $idFinanciacion identificador de la financiación.
     * @param date $fechaProvision Fecha de provisionamiento.
     * @return array Listado de conceptos.
     */
    public function consultarConceptosFinanciacionRecuperarProvision($idFinanciacion, $fechaProvision) {
        $parametros['idfinanciacion'] = $idFinanciacion;
        $parametros['fechaprovision'] = $fechaProvision;
        $sql = "   
              select 
                dfin.uni_concepto idconcepto,
                coalesce(sum(drec.drec_vlrreal),0) saldoconcepto
              from 
                dfin_detfinanci dfin inner join dfac_detfactura dfac on dfin.dfin_ideregistr=dfac.dfac_ideregistr
                inner join drec_detrecaudo drec on drec.dfac_ideregistr=dfac.dfac_ideregistr
              where
                dfin.fin_ideregistro=:idfinanciacion and
               drec.drec_fecha between  (select  (fechaPovision- CAST((extract(day from :fechaprovision))||' days' AS INTERVAL)))  and 
               (select (:fechaprovision - CAST((extract(day from :fechaprovision))||' days' AS INTERVAL) + interval '1 month'))
              group by 
                dfin.uni_concepto ";
        return $this->executeQuery($sql, $parametros);
    }

}
