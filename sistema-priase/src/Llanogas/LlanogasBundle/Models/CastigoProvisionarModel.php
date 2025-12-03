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
 * Description of RecuperacionProvisionModel
 *
 * @author hrey
 */
class CastigoProvisionarModel extends AuditoriaServices {

    /**
     *
     * @var array información de la sesión 
     */
    private $sesion;

    /**
     *
     * @var GenericoModel 
     */
    private $genericoModel;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion, array $sesion) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
        $this->genericoModel = new GenericoModel($conexion);
    }

    public function getFacturasCarteraNormal($idCiclo = null, $idSuscripcion = null) {
        $parametros['idciclo'] = $idCiclo;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $complemento = '';
        if (!empty($idSuscripcion)) {
            $complemento = 'AND fac.dsus_ideregistr=:idsuscripcion';
        }
        if (!empty($idCiclo)) {
            $complemento = 'AND fac.cic_ideregistro=:idciclo';
        }
        $sql = "SELECT 
                 fac.fac_ideregistro idfactura,
                 fac.fac_sdoreal saldofactura,
                 fac.dsus_ideregistr idsuscripcion,
                 EXTRACT (MONTH  FROM age(now()::DATE,(fac.fac_fecha::DATE)))+ 
                 EXTRACT (YEAR  FROM age(now()::DATE,(fac.fac_fecha::DATE)))*12 meses
                FROM fac_factura fac 
                WHERE fac.fac_sdoreal > 0 AND fac.fac_idepadre IS NULL 
                   AND fac.fac_estado='A' AND fac.fin_ideregistro IS NULL
                   AND fac.emp_ideregistro=:idempresa
                   AND (
                        fac_fecha::DATE  BETWEEN (now()::date - INTERVAL '14 MONTH') AND  (now()::date - INTERVAL '13 MONTH') OR
                        fac_fecha::DATE  BETWEEN (now()::date - INTERVAL '26 MONTH') AND  (now()::date - INTERVAL '25 MONTH')
                        )
                $complemento
                 ";
        return $this->executeQuery($sql, $parametros);
    }

    public function validarProvisiones($idFactura) {
        $sql = "SELECT count(*) cantidad
                FROM fac_factura fac INNER JOIN doc_documento doc ON fac.uni_documento=doc.uni_documento
                WHERE fac_ideorigen=$idFactura AND doc.doc_tipo='PR' AND fac.fac_estado <> 'E'";
        $resultado = $this->executeQuery($sql);
        return $resultado[0]['cantidad'];
    }

    public function getFinanciacionProvisionar($idCiclo = null, $idSuscripcion = null) {
        $parametros['idciclo'] = $idCiclo;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $complemento = '';
        if (!empty($idSuscripcion)) {
            $complemento = 'AND fac.dsus_ideregistr=:idsuscripcion';
        }
        if (!empty($idCiclo)) {
            $complemento = 'AND fac.cic_ideregistro=:idciclo';
        }
        $sql = "SELECT
                 DISTINCT
                 fac.dsus_ideregistr idsuscripcion,
                 fac.fin_ideregistro idfinanciacion,
                 (SELECT 
                  EXTRACT (MONTH  FROM age(now()::DATE,MIN(fa.fac_fecha::DATE)))+ 
                  EXTRACT (YEAR  FROM age(now()::DATE,MIN(fa.fac_fecha::DATE)))*12
                  FROM fac_factura fa 
                  WHERE fa.dsus_ideregistr=fac.dsus_ideregistr AND fa.fac_estado='A'
                  AND fa.fin_ideregistro=fac.fin_ideregistro AND fa.fac_sdoreal>0 AND fa.fac_idepadre IS NULL
                 ) meses
                FROM fac_factura fac
                WHERE fac.fac_sdoreal > 0 AND fac.fac_idepadre IS NULL 
                   AND fac.fac_estado='A' AND fac.fin_ideregistro IS NOT NULL
                   AND fac.emp_ideregistro=:idempresa 
                   AND (
                        fac_fecha::DATE  BETWEEN (now()::date - INTERVAL '14 MONTH') AND  (now()::date - INTERVAL '13 MONTH') OR
                        fac_fecha::DATE  BETWEEN (now()::date - INTERVAL '26 MONTH') AND  (now()::date - INTERVAL '25 MONTH')
                        )
                $complemento
                 ";
        return $this->executeQuery($sql, $parametros);
    }

    public function getInfoFinanciacion($idSuscripcion, $idFinanciacion) {
        $idEmpresa = $this->sesion['idempresa'];
        $sql = "SELECT
                fin.fin_ideregistro idfinanciacion,
                fin.fin_sdocapital saldocapital,
                sum(fac.fac_sdoreal)+fin.fin_sdocapital saldototalfinanciacion,
                count(*) cantidadfacturas,
                round(((sum(fac.fac_sdoreal) + fin.fin_sdocapital)),7) valortotalfinanciacion,
                sum(fac.fac_sdoreal) saldovencidas
              FROM
                      fac_factura fac INNER JOIN fin_financiacio fin ON fac.fin_ideregistro=fin.fin_ideregistro
              WHERE
               fac.fin_ideregistro = $idFinanciacion
               AND fac.fac_estado = 'A'
               AND fac.fac_idepadre IS NULL
               AND fac.fac_sdoreal > 0
               AND fac.emp_ideregistro=$idEmpresa
               AND fac.dsus_ideregistr=$idSuscripcion
              GROUP BY
                fin.fin_ideregistro,
                fin.fin_sdocapital";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('No se encontró información de la financiación', -1);
        }
        return $resultado[0];
    }

    public function getFacturasFinanciacion($idSuscripcion, $idFinanciacion) {
        $parametros['idfinanciacion'] = $idFinanciacion;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $parametros['idempresa'] = $this->sesion['idempresa'];
        $complemento = " WHERE fac.fin_ideregistro = :idfinanciacion
                            AND fac.fac_estado = 'A'
                            AND fac.fac_idepadre IS NULL
                            AND fac.fac_sdoreal > 0
                            AND fac.emp_ideregistro=:idempresa
                            AND fac.dsus_ideregistr=:idsuscripcion ";
        return $this->genericoModel->getFacturasInformacion($complemento, $parametros);
    }

}
