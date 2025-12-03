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
class CastigoRecuperacionProvisionModel extends AuditoriaServices {

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
    public function getDetallesProvisionados($idSuscripcion) {
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT *,
                 (round(((provisiones.saldoprovisionreal-(provisiones.saldodetalleoriginal*0.33))/ provisiones.saldoprovisionreal),7))::numeric
                 porcentajerecuperacion
                FROM (
                      SELECT
                        dfao.fac_ideregistro idfacturaoriginal,
                        dfao.dfac_ideregistr iddetalleoriginal,
                        dfao.dfac_vlrtotal valordetalleoriginal,
                        dfao.dfac_sdoreal saldodetalleoriginal,
                        dfap.fac_ideregistro idfacturaprovision,
                        dfap.dfac_ideregistr iddetalleprovision,
                        dfap.uni_concepto idconcepto,
                        dfap.dfac_vlrunitari - COALESCE((
                          SELECT SUM (dfac.dfac_vlrunitari) FROM dfac_detfactura dfac WHERE dfac.dfac_idepadre=dfap.dfac_ideregistr
                        ),0) saldoprovisionreal,
                        dfap.dfac_sdoreal saldoprovision
                       FROM
                        fac_factura facp 
                        INNER JOIN dfac_detfactura dfap ON facp.fac_ideregistro = dfap.fac_ideregistro
                        INNER JOIN dfac_detfactura dfao ON dfao.dfac_ideregistr=dfap.dfac_ideorigen
                        INNER JOIN doc_documento doc ON facp.uni_documento=doc.uni_documento
                        INNER JOIN con_concepto con ON dfao.uni_concepto=con.uni_concepto
                      WHERE
                        facp.fac_estado='P' AND facp.fac_sdoreal>0 AND doc.doc_tipo='PR' AND facp.dsus_ideregistr=:idsuscripcion
                        AND con.con_operacion='S'
                      ORDER BY
                        dfao.fac_ideregistro
                    )
               AS provisiones WHERE provisiones.saldoprovisionreal>0
               and ((round(((provisiones.saldoprovisionreal-(provisiones.saldodetalleoriginal*0.33))/ provisiones.saldoprovisionreal),7))::numeric)>0.001";
        return $this->executeQuery($sql, $parametros);
    }

    public function getSuscripciones($idCiclo, $idSuscripcion = null) {
        $complemento = '';
        if (!empty($idSuscripcion)) {
            $complemento = " AND dsus.dsus_ideregistr=:idsuscripcion ";
        }
        $parametros['idciclo'] = $idCiclo;
        $parametros['idsuscripcion'] = $idSuscripcion;
        $sql = "SELECT DISTINCT dsus.dsus_ideregistr idsuscripcion
                FROM 
                   dsus_detsuscrip dsus INNER JOIN fac_factura fac ON dsus.dsus_ideregistr=fac.dsus_ideregistr
                   INNER JOIN doc_documento doc ON doc.uni_documento=fac.uni_documento
                WHERE
                   fac.fac_estado='P' AND dsus.cic_ideregistro=:idciclo AND dsus.dsus_estado <> 'E'
                   AND fac.fac_sdoreal > 0 AND doc.doc_tipo= 'PR'  " . $complemento;
        return $this->executeQuery($sql, $parametros);
    }

    public function escribirLog($descripcion, $suscripcion) {
        $parametros['descripcion'] = $descripcion;
        $parametros['programa'] = 'Recuperacion';
        $parametros['estado'] = 'ERROR';
        $parametros['suscripcion'] = $suscripcion;
        $parametros['fecha'] = 'now()';
        $parametros['filasafectadas'] = '0';
        $this->insertar($parametros, 'tmp_log_carteracastigada', null);
    }

}
