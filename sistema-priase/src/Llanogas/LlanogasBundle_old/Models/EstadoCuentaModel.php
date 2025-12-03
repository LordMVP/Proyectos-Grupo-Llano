<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;
use Llanogas\LlanogasBundle\Utiles\Util;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Clase que genera la información del estado de cuenta.
 *
 * @author hrey
 */
class EstadoCuentaModel extends AuditoriaServices {

    /**
     *
     * @var GenericoModel
     */
    private $genericoModel;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($conexion);
    }

    /**
     * Consulta las suscripciones de acuerdo de los parámetros.
     * @param type $parametros idsuscripcion, codigoanterior, documento de identidad del tercero
     * @return array listado de las suscripciones
     */
    public function consultarSuscripcines($parametros) {
        $idSuscripcion = $parametros['idsuscripcion'];
        $complemento = '';
        if (!empty($idSuscripcion)) {
            $complemento = 'and dsus.dsus_ideregistr=:idsuscripcion';
        } else {
            $complemento = 'and (dsus.dsus_pcodigo=:codigoanterior or ter.ter_documento=:documentosuscriptor)';
        }
        $sql = 'SELECT
                    distinct 
                    sus.sus_ideregistro idSuscriptor, 
                    ter.ter_ideregistro idTercero, 
                    ter.ter_documento docTercero, 
                    ter.ter_nomcompleto nombreTercero, 
                    cnre.cnre_ideregistr idConvenio,
                    cnre.cnre_nombre nombreConvenio,
                    dsus.dsus_ideregistr idsuscripcion,
                    dsus.dsus_pcodigo codigoanterior,
                    dsus.dsus_estado estadosuscripcion
                FROM 
                    sus_suscripcion sus inner join ter_tercero ter on sus.ter_ideregistro = ter.ter_ideregistro
                    inner join cnre_cnvrecaudo cnre on sus.cnre_ideregistr = cnre.cnre_ideregistr
                    inner join dsus_detsuscrip dsus on sus.sus_ideregistro = dsus.sus_ideregistro and dsus.emp_ideregistro = :idempresa
                WHERE dsus.dsus_fecinicio <= :fechacorte  ' . $complemento;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta las financiaciones asociadas a una suscripción, y de acuerdo a una fecha de corte.
     * @param int $idSuscripcion identificador de la suscripción.
     * @param date $fechaCorte Fecha de corte.
     * @return array Listado de las financiaciones.
     */
    public function consultarFinanciaciones($idSuscripcion, $fechaCorte) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['fechacorte'] = $fechaCorte;
        $sql = "select *,capitalinicial valorinicial,valorpagado valoramortizado from getfinanciacionestadocuenta(:idsuscripcion,:fechacorte::date)";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return;
        }
        $saldoFinanciaciones = 0.0;
        $financiaciones = array();
        foreach ($resultado as $financiacion) {
            $financiacion['detalle'] = $this->consultarDetalleFinanciacion($financiacion['idfinanciacion'], $fechaCorte);
            $saldoFinanciaciones += $this->validarSaldo($financiacion, $fechaCorte);


            $financiaciones[] = $financiacion;
        }
        $financiaciones['valorfinanciacion'] = $saldoFinanciaciones;
        $financiaciones['facturamora'] = $this->getFacturaMoraFinanciacion($idSuscripcion);
        return $financiaciones;
    }
    
    public function consultarVlrFinanciado($idSuscripcion, $fechaInicio, $fechaFin) {
        $parametros['idsuscripcion']    = $idSuscripcion;

        $sql = "SELECT  dsus_ideregistr as idfinanciacion,
                        sum(vlrfinanciable) as valorfinanciacion,
                        sum(vlrnofinanciable) as valornofinanciacion, 
                        sum(valorinteres) as valorinteres,
                        sum(valorcorriente) as valorcorriente
                FROM (
                    SELECT fac.dsus_ideregistr,dfac.uni_concepto, con_operacion,con.con_nombre,
                            CASE WHEN con.con_financiable = 'S' THEN dfac.dfac_sdoreal ELSE 0 END as vlrfinanciable,
                            CASE WHEN con.con_financiable = 'N' THEN dfac.dfac_sdoreal ELSE 0 END as vlrnofinanciable,
                            0 valorinteres,
                            0 valorcorriente 
                    FROM dfac_detfactura dfac 
                    INNER JOIN fac_factura fac on dfac.fac_ideregistro=fac.fac_ideregistro
                    INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                    WHERE fac.dsus_ideregistr =  :idsuscripcion
						
                        AND fac.fac_idepadre IS NULL
                        AND fac.fac_estado = 'A'
                        AND con.con_operacion != 'I'
                        AND COALESCE (fac.fac_sdoreal, 0) > 0

union all 

            SELECT fac.dsus_ideregistr,dfac.uni_concepto, con_operacion,con.con_nombre,
                            0 vlrfinanciable,
                            0 vlrnofinanciable,
                            CASE WHEN fac.uni_documento = 30 and con_condonable='S' THEN dfac.dfac_sdoreal ELSE 0 end as valorinteres,
                            CASE WHEN fac.uni_documento = 85 and con_condonable='S' THEN dfac.dfac_sdoreal ELSE 0 end as valorcorriente 
                    FROM dfac_detfactura dfac 
                    INNER JOIN fac_factura fac on dfac.fac_ideregistro=fac.fac_ideregistro
                    INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                    WHERE fac.dsus_ideregistr =  :idsuscripcion
			AND fac.fac_fecha <= (now() - INTERVAL '1 months')			
                        AND fac.fac_idepadre IS NULL
                        AND fac.fac_estado = 'A'
                        AND con.con_operacion != 'I'
                        AND COALESCE (fac.fac_sdoreal, 0) > 0

												
                ) as f
                GROUP BY dsus_ideregistr";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return;
        }
        return $resultado;
    }
    
    private function validarSaldo(&$financiacion, $fechaCorte) {
        $saldo = 0.0;
        foreach ($financiacion['detalle'] as $amortizacion) {
            $saldo += $amortizacion['saldo'];
        }
        if ($saldo > 0) {
            $financiacion['pagos'] = $this->consultarPagosFinanciacion($financiacion['idfinanciacion'], $fechaCorte);
        }
        return $saldo;
    }

    public function getFacturaMoraFinanciacion($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $complemento = "where fac.dsus_ideregistr=:idsuscripcion 
                        AND fac.fin_ideregistro IS NOT NULL 
                        AND fac.fac_idepadre is null
                        AND fac.fac_estado ='A'
                        AND fac.fac_sdoreal>0 ORDER BY fecha limit 1 ";
        return $this->genericoModel->getFacturasInformacion($complemento, $parametros);
    }

    /**
     * Obtiene el detalle de la financiación dependiendo a una fecha
     * @param int $idFinanciacion identificador de una financiación.
     * @param type $fechaCorte
     * @return type
     */
    public function consultarDetalleFinanciacion($idFinanciacion, $fechaCorte) {
        $sql = "SELECT
	              estadocuenta.*,
	              doc.uni_documento iddocumento,
  	              doc.doc_nombre documento,
  	              tido.tido_nombre tipodocumento,
  	              estadocuenta.valortotal valorinicial
	        FROM getdetallefinanciacionestadocuenta (:idfinanciacion, :fechacorte::date) AS estadocuenta
                     INNER JOIN fac_factura fac ON fac.fac_ideregistro=estadocuenta.idfactura and fac.fac_estado <> 'E'
                     INNER JOIN tido_tipdocumen tido ON tido.uni_tipdocument=fac.uni_tipdocument
                     INNER JOIN doc_documento doc ON doc.uni_documento=fac.uni_documento ";
        $parametros['idfinanciacion'] = $idFinanciacion;
        $parametros['fechacorte'] = $fechaCorte;
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta los pagos realizados a una financiación de acuerdo a una fecha de corte.
     * @param int $idFinanciacion identificador de la financiación.
     * @param date $fechaCorte Fecha de corte que se quiere consultar los pagos
     * @return array Información de los pagos realizados a esa fecha de corte.
     */
    public function consultarPagosFinanciacion($idFinanciacion, $fechaCorte) {
        $sql = " SELECT
                        rec.rec_ideregistro idrecaudo,
                        drec.uni_documento iddocumento,
                        doc.doc_nombre documento,
                        drec.uni_tipdocument idtipodocumento,
                        tido.tido_nombre tipodocumento,
                        SUM (drec.drec_vlrreal) valorpagado
                FROM
                        rec_recaudo rec
                INNER JOIN drec_detrecaudo drec ON drec.rec_ideregistro = rec.rec_ideregistro
                INNER JOIN dfac_detfactura dfac ON drec.dfac_ideregistr = dfac.dfac_ideregistr
                INNER JOIN doc_documento doc ON rec.uni_documento = doc.uni_documento
                INNER JOIN tido_tipdocumen tido ON drec.uni_tipdocument = tido.uni_tipdocument
                INNER JOIN fac_factura fac ON dfac.fac_ideregistro=fac.fac_ideregistro
                WHERE
                        rec.rec_idepadre IS NULL
                AND rec.rec_fecha::date <= '$fechaCorte'::date
                AND fac.fin_ideregistro = $idFinanciacion
                GROUP BY
                        rec.rec_ideregistro,
                        drec.uni_documento,
                        drec.uni_tipdocument,
                        doc.doc_nombre,
                        tido.tido_nombre;";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            return;
        }
        return $resultado;
    }

    /**
     * Consulta las facturas de una suscripción a una fecha de corte
     * @param int $idSuscripcion Identificador de la suscripción.
     * @param date $fechaCorte fecha de corte
     * @return array Listado de las facturas de acuerdo a criterios.
     */
    public function consultarFacturas($idSuscripcion, $fechaCorte) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['fechacorte'] = $fechaCorte;
        $sql = "select * from getfacturaestadocuenta(:idsuscripcion, :fechacorte::date)";
        $listaFacturas = $this->executeQuery($sql, $parametros);
        if (empty($listaFacturas)) {
            return;
        }
        $listaFacturasCalculadas = array();
        foreach ($listaFacturas as $infoFactura) {
            $factura = $this->getInfoFactura($infoFactura['idfactura']);

            if (empty($factura)) {
                continue;
            }
            $factura['valorpagadofactura'] = $infoFactura['valorpagado'];
            $factura['saldofactura'] = $infoFactura['saldo'];
            $factura['valorpagado'] = $infoFactura['valorpagado'];
            $factura['detalle'] = $this->consultarDetalleFacturas($infoFactura['idfactura'], $fechaCorte);
            $listaFacturasCalculadas[] = $factura;
        }
        return $listaFacturasCalculadas;
    }

    public function getInfoFactura($idFactura) {
        $complemento = " where fac.fac_ideregistro = :idfactura and doc.doc_tipo not in ('PR','RC','CC','RP')";
        $parametros['idfactura'] = $idFactura;
        $resultado = $this->genericoModel->getFacturasInformacion($complemento, $parametros);
        if (!empty($resultado)) {
            return $resultado[0];
        }
        return $resultado;
    }

    /**
     * Consulta los detalles de las facturas 
     * @param int $idFactura identificador de la factura
     * @param date $fechaCorte fecha de corte
     * @return array Listado de los conceptos de una factura.
     */
    public function consultarDetalleFacturas($idFactura, $fechaCorte) {
        $lista = array();
        $sql = 'select * from getconceptosestadocuenta(:idfactura, :fechacorte::date)';
        $parametros['idfactura'] = $idFactura;
        $parametros['fechacorte'] = $fechaCorte;
        $listaConceptos = $this->executeQuery($sql, $parametros);
        $complemento = 'where dfac.dfac_ideregistr=:iddetallefactura ';
        foreach ($listaConceptos as $concepto) {
            $parametros['iddetallefactura'] = $concepto['iddetallefactura'];
            $infoConcepto = $this->genericoModel->getConceptosInformacion($complemento, $parametros)[0];
            $infoConcepto['saldo'] = $concepto['valor'] - $concepto['valorpagado'];
            $infoConcepto['valorpagado'] = $concepto['valorpagado'];
            $lista[] = $infoConcepto;
        }
        return $lista;
    }
    public function consultarFacturasCastigadas($idSuscripcion){
        $sql = "SELECT fac_ideregistro
                FROM fac_factura
                WHERE dsus_ideregistr =$idSuscripcion AND fac_estado = 'C'";
        return $this->executeQuery($sql);
    }
}
