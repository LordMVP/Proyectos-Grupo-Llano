<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Models;

/**
 * Description of FinanciacionesFacturadasCicloReporteModel
 *
 * @author progredi1
 */
class FinanciacionesFacturadasCicloReporteModel extends ReportesDefaultModel {

    //put your code here
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    public function consultar($parametros) {

        $sql = "SELECT
                dsus.dsus_ideregistr                               \"Suscripción\",
                fac.fin_ideregistro                                \"Id Financiación\",
                cic.cic_nombre                                     \"Ciclo\",
                proyectos.proyecto_nom                             \"Municipio\",
                fac.fac_fecha :: DATE                              \"Fecha Facturación\",
                unitpuso.uni_nombre1                               \"Tipo Uso\",
                liq.liq_nombre                                     \"Liquidación\",
                fac.fac_ideregistro                                idfactura,
                coalesce(htsi.htsi_tasinteres, 0)                  \"Tasa\",
                fac.fac_vlrreal                                    \"Total Facturado\",
                fin.fin_sdocapital + coalesce((
                  SELECT SUM(damo_vlrreal)
                  FROM damo_detamortiz damo
                    INNER JOIN amo_amortizacio amo ON damo.amo_ideregistro = amo.amo_ideregistro
                  WHERE amo.fin_ideregistro = fin.fin_ideregistro AND amo.amo_ideregistro = ((SELECT MAX(amo.amo_ideregistro)
                                                                                              FROM amo_amortizacio amo
                                                                                              WHERE amo.fin_ideregistro =
                                                                                                    fin.fin_ideregistro))
                ),0)                                                  \"Saldo Financiación\",
                fin.fin_fecha :: DATE                              \"Fecha Financiación\",
                (amfi.amfi_numcuotas - (amfi.amfi_cuoamortiz - 1)) \"Cuotas Pendientes\"
            FROM dsus_detsuscrip dsus
                INNER JOIN proyectos proyectos ON proyectos.proyecto_ideregistro = dsus.uni_municipio
                INNER JOIN fac_factura fac ON dsus.dsus_ideregistr = fac.dsus_ideregistr
                INNER JOIN fin_financiacio fin ON fac.fin_ideregistro = fin.fin_ideregistro
                INNER JOIN amfi_amofinanci amfi ON fin.fin_ideregistro = amfi.fin_ideregistro
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = fac.cic_ideregistro
                INNER JOIN uni_unidad unitpuso ON unitpuso.uni_ideregistro = fac.uni_tipusosuscr
                INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
                INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion = fac.uni_liquidacion
                LEFT JOIN htsi_htasinteres htsi ON fac.fac_ideregistro = htsi.fac_ideregistro
                INNER JOIN per_periodo per ON per.per_ideregistro = fac.per_ideregistro
              WHERE fac.fac_ideorigen IS NULL
                    AND fac.fac_idepadre IS NULL
                    AND fac.fin_ideregistro IS NOT NULL
                    AND doc.doc_tipo = 'FI'
                    AND amfi.amfi_estado = 'A'
                    AND dsus.dsus_estado <> 'E'
                    AND fac.fac_estado <> 'E' " . $parametros . "
            ORDER BY  dsus.dsus_ideregistr
            ,fac.fin_ideregistro
            ,cic.cic_nombre
            ,proyectos.proyecto_nom
            ,fac.fac_fecha
            ,unitpuso.uni_nombre1
            ,liq.liq_nombre
            ,fac.fac_ideregistro
            ,htsi.htsi_tasinteres
            ,fac.fac_vlrreal
            ,cic.cic_ideregistro";
        return $this->executeQuery($sql);
    }

    public function conceptos($idfactura) {
        $sql = "SELECT  (CASE WHEN con.con_intfinanciacion  = 'S' THEN 'ZInteres' ELSE 
	         (CASE 	WHEN  con.con_nombre  ILIKE '%iva%'  THEN  'ZIva' ELSE con.con_nombre END ) END) nombre , SUM (dfac.dfac_vlrtotal) valor FROM dfac_detfactura dfac 
        INNER JOIN con_concepto con ON con.uni_concepto = dfac.uni_concepto
        WHERE  fac_ideregistro = " . $idfactura . " GROUP BY nombre";
        return $this->executeQuery($sql);
    }

    public function columnas($parametros) {
        $sql = "SELECT  DISTINCT   (CASE WHEN con.con_intfinanciacion  = 'S' THEN 'ZInteres' ELSE 
	         (CASE 	WHEN  con.con_nombre  ILIKE '%iva%'  THEN  'ZIva' ELSE con.con_nombre    END ) END)  con_nombre 
        FROM dsus_detsuscrip dsus
        INNER JOIN proyectos proyectos ON proyectos.proyecto_ideregistro = dsus.uni_municipio
        INNER JOIN fac_factura fac ON dsus.dsus_ideregistr = fac.dsus_ideregistr
        INNER JOIN cic_ciclo cic  ON  cic.cic_ideregistro = fac.cic_ideregistro
        INNER JOIN uni_unidad unitpuso ON unitpuso.uni_ideregistro = fac.uni_tipusosuscr
        INNER JOIN dfac_detfactura  dfac ON dfac.fac_ideregistro =  fac.fac_ideregistro
        INNER JOIN con_concepto con ON con.uni_concepto = dfac.uni_concepto
        INNER JOIN doc_documento doc ON doc.uni_documento = fac.uni_documento
        INNER JOIN liq_liquidacion liq  ON liq.uni_liquidacion = fac.uni_liquidacion
        LEFT JOIN htsi_htasinteres htsi ON fac.fac_ideregistro = htsi.fac_ideregistro
        INNER JOIN per_periodo  per ON  per.per_ideregistro  = fac.per_ideregistro
        WHERE fac.fac_ideorigen IS NULL  AND fac.fac_idepadre IS NULL  AND fac.fin_ideregistro IS NOT NULL AND doc.doc_tipo = 'FI'
        AND  dsus.dsus_estado <> 'E' AND fac.fac_estado <> 'E' " . $parametros . "
        ORDER BY con_nombre";
        return $this->executeQuery($sql);
    }

    public function procesarColumnas($parametros) {
        $datos = $this->columnas($parametros);
        $final = array();
        foreach ($datos as $columna) {
            $final = array_merge($final, array_flip($columna));
        }

        foreach (array_keys($final) as $key) {
            $final[$key] = 0;
        }
        return $final;
    }

    public function procesarDatos(&$objPHPExcel, $parametros) {
        $facturas = $this->consultar($parametros);
        $columnasConceptos = $this->procesarColumnas($parametros);
        $nofila = 5;
        $letraFinal = 'Z';
        foreach ($facturas as $factura) {
            $factura = array_slice($factura, 0, 9, true) + $columnasConceptos +
                    array_slice($factura, 9, count($factura) - 1, true);

            $valorConcetos = $this->conceptos($factura['idfactura']);
            foreach ($valorConcetos as $valorConcepto) {
                if (isset($factura[$valorConcepto['nombre']])) {
                    $factura[$valorConcepto['nombre']] = $valorConcepto['valor'];
                }
            }
            if ($nofila == 5) {
                $this->escribirInformacion($objPHPExcel, array_keys($factura), $factura, $nofila);
            }
            $nofila++;
            $letraFinal = $this->escribirInformacion($objPHPExcel, array_keys($factura), $factura, $nofila);
        }

        return $letraFinal;
    }

    public function escribirInformacion(&$objPHPExcel, $columnasEncabezado, $factura, $nofila) {
        $cantidadColumnas = 1;
        $letras = 65;
        for ($i = 0; $i < count($columnasEncabezado); $i++) {
            $columna = $this->configurarColumnasExcel($cantidadColumnas, $letras) . $nofila;
            if ($nofila == 5) {
                $objPHPExcel->setActiveSheetIndex(0)
                        ->setCellValue($columna, ($columnasEncabezado[$i]));

                $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension($this->configurarColumnasExcel($cantidadColumnas, $letras))->setWidth(25);
            } else {
                $objPHPExcel->setActiveSheetIndex(0)
                        ->setCellValue($columna, $factura[$columnasEncabezado[$i]]);
            }
            $letras++;
            $cantidadColumnas++;
        }
        return $this->configurarColumnasExcel($cantidadColumnas, $letras);
    }

    public function configurarColumnasExcel($cantidadColumnas, &$letras) {
        //AA,AB,AC
        if ($cantidadColumnas >= 27 && $cantidadColumnas <= 52) {
            $letras = $cantidadColumnas == 27 ? 65 : $letras;
            return chr(65) . chr($letras);
        }
        //BA,BB,BC
        if ($cantidadColumnas >= 53 && $cantidadColumnas <= 78) {
            $letras = $cantidadColumnas == 53 ? 65 : $letras;
            return chr(66) . chr($letras);
        }
        //CA,CB,CC
        if ($cantidadColumnas >= 79 && $cantidadColumnas <= 104) {
            $letras = $cantidadColumnas == 79 ? 65 : $letras;
            return chr(67) . chr($letras);
        }
        //DA,DB,DC
        if ($cantidadColumnas >= 105 && $cantidadColumnas <= 130) {
            $letras = $cantidadColumnas == 105 ? 65 : $letras;
            return chr(68) . chr($letras);
        }
        //EA,EB,EC
        if ($cantidadColumnas >= 131 && $cantidadColumnas <= 156) {
            $letras = $cantidadColumnas == 131 ? 65 : $letras;
            return chr(69) . chr($letras);
        }
        //A,B,C
        return chr($letras);
    }

}
