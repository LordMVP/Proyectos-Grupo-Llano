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
class CastigoReclasificacionProvisionModel extends AuditoriaServices {

    /**
     *
     * @var array información de la sesión 
     */
    private $sesion;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion, array $sesion) {
        $this->setConexion($conexion);
        $this->sesion = $sesion;
    }

    /**
     * Consulta todas los detalles de facturas provisionadas de una suscripción
     * @param int $idSuscripcion  identificador de la suscripción
     * @return  array Lista de provisiones de una suscripción
     */
    public function getFacturasProvision($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT
                  fac.fac_ideregistro idfacturaprovision,
                  fac.uni_tipdocument idtipodocumentoprovision,
                  fac.uni_documento iddocumentoprovision,
                  fac.fac_vlrreal valortotalprovision,
                  fac.fac_sdoreal saldoprovision,
                  fac.fin_ideregistro idfinanciacion,
                  fac.amo_ideregistro idamortizacion,
                  fac.fac_version as version
                FROM
                 fac_factura fac INNER JOIN doc_documento doc ON fac.uni_documento = doc.uni_documento
                WHERE
                 fac.dsus_ideregistr = :idsuscripcion AND doc.doc_tipo = 'PR' AND fac.fac_sdoreal>0";
        return $this->executeQuery($sql, $parametros);
    }

    public function getSuscripcionesReclasificar($idCiclo = null, $idSuscripcion = null) {
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
                 fac.dsus_ideregistr idsuscripcion
                FROM fac_factura fac 
                    INNER JOIN dsus_detsuscrip dsus ON fac.dsus_ideregistr=dsus.dsus_ideregistr
                    INNER JOIN per_periodo perr on perr.cic_ideregistro = dsus.cic_ideregistro 
                WHERE fac.fac_sdoreal > 0 AND fac.fac_idepadre IS NULL 
                   AND fac.emp_ideregistro=:idempresa
                   AND fac.fac_estado='A'
                   AND dsus.dsus_estado <> 'E'
                   AND perr.per_estado = 'A'
                   AND (
                        fac_fecha::DATE  BETWEEN (perr.per_fecfinal::date - INTERVAL '26 MONTH') 
                            AND  (perr.per_fecfinal::date - INTERVAL '25 MONTH')
                        -- fac_fecha::DATE  BETWEEN (now()::date - INTERVAL '26 MONTH') AND  (now()::date - INTERVAL '25 MONTH')
                    )
                $complemento
                 ";
        return $this->executeQuery($sql, $parametros);
    }

}
