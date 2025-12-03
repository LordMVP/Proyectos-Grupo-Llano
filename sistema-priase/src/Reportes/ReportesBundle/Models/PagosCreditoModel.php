<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Models;

/**
 * Description of PagosCreditoModel
 *
 * @author progredi1
 */
class PagosCreditoModel extends ReportesDefaultModel {

//put your code here

    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    public function consultarCredito($data) {
        $complemento = "" ;
        if ($data['documento'])
        {
            $complemento .= " AND ter.ter_documento = :documento ";
        }
        if ($data['fechainicio'] && $data['fechafin'])
        {
            $complemento .= " AND fin.fin_fecha :: DATE BETWEEN :fechainicio
                             AND :fechafin " ;
        }           
        $sql = "SELECT DISTINCT
                    COALESCE(cre.cre_ideregistro, 0)        idcredito,
                    ter.ter_nomcompleto                     nombre,
                    ter.ter_documento                       documento,
                    CASE 
                        WHEN restrucutradas.cuotasiniciales IS NULL
                            THEN amfi.amfi_numcuotas
                        ELSE restrucutradas.cuotasiniciales 
                    END 																		plazo,
                    fin.fin_inicapital                      monto,
                    fin.fin_fecha                           fechadesembolso,
                    fin.fin_ideregistro                     idfinanciacion,
                    dsus.dsus_ideregistr                    suscripcion,
                    amfi.amfi_estado
                FROM amfi_amofinanci amfi
                    INNER JOIN fin_financiacio fin ON fin.fin_ideregistro = amfi.fin_ideregistro
                    INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = amfi.dsus_ideregistr
                    INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
                    LEFT JOIN fac_factura fac ON fac.fin_ideregistro = fin.fin_ideregistro
                        AND fac.fac_estado <> 'E'
                    LEFT JOIN cre_credito cre ON cre.fin_ideregistro = fin.fin_ideregistro
                    LEFT JOIN LATERAL (
                        SELECT amfi_numcuotas cuotasiniciales
                        FROM amfi_amofinanci amfivista
                        WHERE amfivista.fin_ideregistro = fin.fin_ideregistro 
                            AND amfivista.amfi_estado = 'R'
                    )restrucutradas ON TRUE
                WHERE amfi.amfi_estado IN ('A', 'C')
                    AND fin.fin_estado = 'A' " . $complemento ." 
                ORDER BY fin.fin_ideregistro";
        return $this->executeQuery($sql, $data);
    }

    public function datosEjecutados($idfinanciacion, $idsuscripcion) {
        $parametros["idfinanciacion"] = $idfinanciacion;
        $parametros["idsuscripcion"] = $idsuscripcion;

        $sql = "WITH base AS ( SELECT DISTINCT
                                per.per_nombre,
                                per.per_ideregistro idperiodo
                              FROM
                                fac_factura fac
                                INNER JOIN per_periodo per ON fac.per_ideregistro = per.per_ideregistro
                              WHERE
                                fac.dsus_ideregistr = :idsuscripcion
                                AND fac.fin_ideregistro = :idfinanciacion
                              ORDER BY
                                per.per_ideregistro)
               SELECT
                 info.per_nombre,
                 pagos.idperiodo,
                 COALESCE(pagos.capital, 0)  capital,
                 COALESCE(pagos.intgeres, 0) intgeres,
                 COALESCE(pagos.seguro, 0)   seguro,
                 COALESCE(pagos.estudio, 0)  estudio,
                 'C'                         estado
               FROM base info
                 LEFT JOIN (SELECT
                              dire.per_ideregistro idperiodo,
                              SUM(CASE WHEN con.con_financiable = 'N'
                                THEN drec.drec_vlrreal
                                  ELSE 0 END)      intgeres,
                              SUM(CASE WHEN con.uni_concepto = 893
                                THEN drec.drec_vlrreal
                                  ELSE 0 END)      capital,
                              SUM(CASE WHEN con.uni_concepto = 897
                                THEN drec.drec_vlrreal
                                  ELSE 0 END)      seguro,
                              SUM(CASE WHEN con.uni_concepto = 1121
                                THEN drec.drec_vlrreal
                                  ELSE 0 END)      estudio
                            FROM rec_recaudo rec
                              INNER JOIN dire_disrecaudo dire ON rec.rec_ideregistro = dire.rec_ideregistro
                              INNER JOIN doc_documento doc ON rec.uni_documento = doc.uni_documento
                              INNER JOIN drec_detrecaudo drec ON rec.rec_ideregistro = drec.rec_ideregistro
                              INNER JOIN dfac_detfactura dfac ON drec.dfac_ideregistr = dfac.dfac_ideregistr
                              INNER JOIN fac_factura fac ON dfac.fac_ideregistro = fac.fac_ideregistro
                              INNER JOIN con_concepto con ON dfac.uni_concepto = con.uni_concepto
                            WHERE dire.dsus_ideregistr = :idsuscripcion
                            GROUP BY dire.per_ideregistro) pagos ON info.idperiodo = pagos.idperiodo
                    ORDER BY info.idperiodo;";
        return $this->executeQuery($sql, $parametros);
    }

    public function datosCredito($idfinanciacion) {
        $parametros["idfinanciacion"] = $idfinanciacion;
        $sql = "SELECT
                fin.fin_ideregistro                      idfinanciacion,
                fin.dsus_ideregistr                      idsuscripcion,
                ter.ter_documento                        documento,
                ter.ter_nomcompleto                      nombre,
                fin.fin_fecha :: DATE                    fechadesembolso,
                (fin.fin_fecha + CAST(amfi.amfi_numcuotas || ' months' AS
                                      INTERVAL)) :: DATE fechavencimiento,
                SUM(CASE WHEN dfin.uni_concepto = 893
                  THEN dfin.dfin_vlrreal
                    ELSE 0 END)                          capital,
                SUM(CASE WHEN dfin.uni_concepto = 897
                  THEN dfin.dfin_vlrreal
                    ELSE 0 END)                          seguro,
                SUM(CASE WHEN dfin.uni_concepto = 1121
                  THEN dfin.dfin_vlrreal
                    ELSE 0 END)                          estudio,
                COALESCE((SELECT htsi.htsi_tasinteres
                        FROM htsi_htasinteres htsi
                          INNER JOIN fac_factura fac ON fac.fac_ideregistro = htsi.fac_ideregistro
                        WHERE fac.fin_ideregistro = fin.fin_ideregistro
                        ORDER BY fac.fac_ideregistro
                        LIMIT 1),
                       (SELECT (con.con_formula :: JSON -> 0 ->> 'valor') :: NUMERIC(20, 7) interes
                        FROM coli_conliquida coli
                          INNER JOIN con_concepto con ON coli.uni_concepto = con.uni_concepto
                        WHERE coli.uni_liquidacion = amfi.uni_liquidacion AND con.con_financiable = 'N'
                        LIMIT 1))                        tasa,
                cre.cre_ideregistro                      idcredito,
                COALESCE(cre.cre_porseguro, 0)           porcentajeseguro,
                per.per_fecfinal :: DATE                 fechapago,
                liq.liq_tipcuota                         tipocuota,
                amfi.amfi_estado                         estado,
                COALESCE((SELECT amfivista.amfi_numcuotas
                          FROM amfi_amofinanci amfivista
                          WHERE amfivista.fin_ideregistro = fin.fin_ideregistro AND amfivista.amfi_estado = 'R'
                          ORDER BY amfivista.amfi_ideregistr
                          LIMIT 1), amfi.amfi_numcuotas) plazo
              FROM fin_financiacio fin
                INNER JOIN dfin_detfinanci dfin ON fin.fin_ideregistro = dfin.fin_ideregistro
                INNER JOIN amfi_amofinanci amfi ON fin.fin_ideregistro = amfi.fin_ideregistro
                INNER JOIN dsus_detsuscrip dsus ON fin.dsus_ideregistr = dsus.dsus_ideregistr
                INNER JOIN ter_tercero ter ON dsus.ter_ideregistro = ter.ter_ideregistro
                INNER JOIN per_periodo per ON fin.per_ideregistro = per.per_ideregistro
                INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion = amfi.uni_liquidacion
                LEFT JOIN cre_credito cre ON dsus.dsus_ideregistr = cre.dsus_ideregistr
              WHERE fin.fin_estado = 'A'
                    AND amfi.amfi_estado IN ('A', 'C')
                    AND fin.fin_ideregistro =  :idfinanciacion
              GROUP BY idfinanciacion,
                idsuscripcion,
                documento,
                nombre,
                fechadesembolso,
                fechavencimiento,
                tasa,
                idcredito,
                porcentajeseguro,
                fechapago,
                tipocuota,
                estado,
                      plazo;";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            return null;
        }


        return $resultado[0];
    }

    public function diasDiferenciaPeriodo($idfinanciacion) {
        $parametros["idfinanciacion"] = $idfinanciacion;
        $sql = "SELECT (per.per_fecfinal :: DATE - fin.fin_fecha :: DATE) dias
                FROM fin_financiacio fin
                INNER JOIN per_periodo per ON fin.per_ideregistro = per.per_ideregistro
                WHERE fin.fin_ideregistro = :idfinanciacion ;";
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            return array();
        }
        return $respuesta[0]['dias'];
    }

    public function cuotaCero($idfinanciacion) {
        $parametros["idfinanciacion"] = $idfinanciacion;
        $sql = "SELECT *
            FROM fac_factura fac
              INNER JOIN doc_documento doc ON fac.uni_documento = doc.uni_documento
            WHERE fac.fin_ideregistro = :idfinanciacion
                  AND fac.amo_ideregistro IS NULL
                  AND fac.fac_estado = 'A'
                  AND doc.doc_tipo = 'FI';";
        $respuesta = $this->executeQuery($sql, $parametros);
        if (empty($respuesta)) {
            return array();
        }
        return $respuesta[0];
    }

}
