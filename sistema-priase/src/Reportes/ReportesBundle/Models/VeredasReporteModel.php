<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Models;

/**
 * Description of VeredasReporteModel
 *
 * @author hrey
 */
class VeredasReporteModel extends ReportesDefaultModel {

    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    public function consultarConsumoyFacturado($param) {

        $sql = "SELECT
            barrios.barrio_nom                                   barrio,
            facturasiniciales.per_nombre                         periodo,
            tipouso.uni_nombre1                                  tiposuso,
            CASE WHEN tipouso.uni_ideregistro = 5
              THEN 0
            ELSE facturasiniciales.pro_catestrato END            estrato,
            SUM(CASE WHEN dfac.uni_concepto = 35
              THEN dfac.dfac_vlrtotal END)                       \"Consumo metros\",
            SUM(CASE WHEN dfac.uni_concepto = 597
              THEN dfac.dfac_vlrtotal END)                       \"Consumo pleno\",
            SUM(CASE WHEN dfac.uni_concepto IN (41, 42)
              THEN dfac.dfac_vlrtotal END)                       \"Facturado\",
            SUM(dfac.dfac_vlrtotal)                              valor,
            facturasiniciales.uni_municipio,
            EXTRACT(MONTH FROM facturasiniciales.per_fecinicial) mesorden,
            tipouso.uni_ideregistro                              idtipouso,
            facturasiniciales.uni_barrio                         idbarrio,
            facturasiniciales.per_fecfinal::DATE        	 fechafinperiodo	
          FROM (SELECT
                  MIN(fac.fac_fecha),
                  dsus.uni_barrio,
                  per.per_nombre,
                  dsus.uni_tipusosuscr,
                  dsus.pro_catestrato,
                  dsus.uni_municipio,
                  per.per_fecinicial,
                  per.per_fecfinal,
                  fac.fac_ideregistro
                FROM fac_factura fac
                  INNER JOIN doc_documento doc ON fac.uni_documento = doc.uni_documento
                  INNER JOIN per_periodo per ON fac.per_ideregistro = per.per_ideregistro
                  INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = fac.dsus_ideregistr
                WHERE
                  doc.doc_tipo = 'LI' AND
                  fac.cic_ano = " . $param['anos'] . " 
                  AND fac.cic_ideregistro NOT IN (107,143,123)
                  AND fac.fac_estado <> 'E'
                  AND fac.fac_idepadre IS NULL
                  AND fac.emp_ideregistro = 322
                  AND fac.uni_tipusosuscr IN (6, 5)
                  AND per.per_ideorden =  " . $param['idordenperiodo'] . "
                  AND dsus.uni_barrio IN (" . $param['barrios'] . ")
                GROUP BY dsus.dsus_ideregistr, dsus.uni_barrio, per.per_nombre, dsus.uni_tipusosuscr, dsus.pro_catestrato,
                  dsus.uni_municipio, per.per_fecinicial, fac.fac_ideregistro, per.per_fecfinal) facturasiniciales
            INNER JOIN dfac_detfactura dfac ON facturasiniciales.fac_ideregistro = dfac.fac_ideregistro
            INNER JOIN barrios barrios ON barrios.barrio_ideregistro = facturasiniciales.uni_barrio
            INNER JOIN uni_unidad tipouso ON facturasiniciales.uni_tipusosuscr = tipouso.uni_ideregistro
          WHERE dfac.uni_concepto IN (35, 597, 41, 42)
          GROUP BY barrio, periodo, mesorden, estrato, idtipouso, tiposuso, facturasiniciales.uni_municipio, idbarrio, fechafinperiodo
          ORDER BY barrio, mesorden ASC, idtipouso DESC, estrato, idbarrio;";
        return $this->executeQuery($sql);
    }

    /**
     * Se permite consultar los recaudos y refactorización según los parámetros enviados
     * @param type $param Objeto con parámetros de búsqueda
     * @return int
     */
    private function consultarUsuariosRecaudo($param) {
        $condicionEstrato = "";
        if ($param['idtipouso'] == 6) {
            $condicionEstrato = "AND dsus.pro_catestrato = :estrato";
        }
        $fechafinperiodo = $param['fechafinperiodo'];
        $sql = "SELECT COUNT(dsus.dsus_ideregistr) usuarios,
                SUM(vistarecaudo.recaudadosuscripcion) recaudo,
                SUM(vistarefacturado.refacturadosuscripcion) refacturado
                FROM dsus_detsuscrip dsus
                LEFT JOIN LATERAL (
                    SELECT SUM (drec.drec_vlrreal) recaudadosuscripcion
                    FROM dsus_detsuscrip dsusrec
                    INNER JOIN dire_disrecaudo dire ON dire.dsus_ideregistr = dsusrec.dsus_ideregistr
                    INNER JOIN drec_detrecaudo drec ON drec.rec_ideregistro = dire.rec_ideregistro
                    INNER JOIN rec_recaudo rec ON rec.rec_ideregistro = drec.rec_ideregistro
                    INNER JOIN dfac_detfactura dfac ON dfac.dfac_ideregistr = drec.dfac_ideregistr
                    WHERE dsusrec.dsus_ideregistr = dsus.dsus_ideregistr
                        AND rec.rec_fecha between (date_trunc('month', :fechafinperiodo::DATE)::DATE) AND (date_trunc('month', :fechafinperiodo::DATE)::DATE + INTERVAL '1 MONTH - 1 day')::DATE
                        AND dfac.uni_concepto IN (40, 41, 42, 586)
                    GROUP BY dsus.dsus_ideregistr
                ) vistarecaudo ON TRUE
                LEFT JOIN LATERAL (
                    SELECT SUM (dfcs.dfac_vlrreal) refacturadosuscripcion
                    FROM faca_faccartera faca
                    INNER JOIN dfcs_detcarsuma dfcs ON faca.faca_ideregistr = dfcs.faca_ideregistr
                    INNER JOIN per_periodo per ON per.per_ideregistro = faca.per_ideregistro
                    INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = per.cic_ideregistro
                    WHERE
                        faca.dsus_ideregistr = dsus.dsus_ideregistr
                        AND dfcs.uni_concepto IN (42, 40, 41,586)
                        AND faca.faca_estado = 'A'
                        AND dfcs.dfcs_estado = 'A'
                        AND per.per_ideorden = :mesorden
                        AND cic.cic_anoactual = :anos
                        AND faca.faca_tipo = 'M'
                ) vistarefacturado ON TRUE

                WHERE
                        dsus.uni_barrio = :idbarrio
                         AND dsus.dsus_estado in ( 'A','E','N','C')
                $condicionEstrato
                AND dsus.uni_tipusosuscr = :idtipouso
                AND dsus.emp_ideregistro = 322
                AND dsus.cic_ideregistro NOT IN (107, 143, 123) ";

        $resultado = $this->executeQuery($sql, $param);
        if (empty($resultado)) {
            $resultado['usuarios'] = 0;
            $resultado['recaudo'] = 0;
            $resultado['refacturado'] = 0;
            return $resultado;
        }
        return $resultado[0];
    }

    public function procesardatos(&$objPHPExcel, $param) {
        $datos = $this->consultarConsumoyFacturado($param);
        if (!empty($datos)) {
            $nofila = 8;
            $this->configurartitulos($objPHPExcel, 65, 6, $datos[0]['periodo']);
            $barrio = $datos[0]['barrio'];
            $barrioCambia = 0;
            $letras = 65;
            $this->estratos($objPHPExcel, 3, 67, $nofila);
            for ($i = 0; $i < count($datos); $i++) {
                $registro = $datos[$i];
                $registro['anos'] = $param['anos'];
                if ($i == 0) {
                    $barrioCambia = 1;
                }
                if ($barrio != $registro['barrio']) {
                    $barrio = $registro['barrio'];
                    $nofila = $nofila + 8;
                    $barrioCambia = 1;
                    $this->estratos($objPHPExcel, 3, 67, $nofila);
                }
                $this->configurarDatosSegunEstrato($objPHPExcel, $letras, $nofila, $registro, $barrioCambia);
            }
        }
        return $nofila + 6;
    }

    /*
     * La $fila debe ser la sugiente linea de despues de escribir los titulos
     * y apartir de ese punto se empieza a pintar el registro
     */

    public function configurarDatosSegunEstrato(&$objPHPExcel, &$letras, &$fila, $datos, &$barrioCambia) {
        if ($barrioCambia == 1) {
            $filaEstrato = $fila + 6;
            $this->configurarTotales($objPHPExcel, $filaEstrato);
        }
        $columnas = $barrioCambia == 0 ? 3 : 1;
        $letras = $barrioCambia == 0 ? 67 : 65;
        $estrato = $datos['estrato'];
        switch ($estrato) {
            case 1:
                $filaEstrato = $fila;
                $this->configurarDatos($objPHPExcel, $columnas, $letras, $filaEstrato, $datos, $barrioCambia);
                break;
            case 2:
                $filaEstrato = $fila + 1;
                $this->configurarDatos($objPHPExcel, $columnas, $letras, $filaEstrato, $datos, $barrioCambia);
                break;
            case 3:
                $filaEstrato = $fila + 2;
                $this->configurarDatos($objPHPExcel, $columnas, $letras, $filaEstrato, $datos, $barrioCambia);
                break;
            case 4:
                $filaEstrato = $fila + 3;
                $this->configurarDatos($objPHPExcel, $columnas, $letras, $filaEstrato, $datos, $barrioCambia);
                break;
            case 5:
                $filaEstrato = $fila + 4;
                $this->configurarDatos($objPHPExcel, $columnas, $letras, $filaEstrato, $datos, $barrioCambia);
                break;
            case 6:
                $filaEstrato = $fila + 5;
                $this->configurarDatos($objPHPExcel, $columnas, $letras, $filaEstrato, $datos, $barrioCambia);
                break;
            case 0:
                $filaEstrato = $fila + 6;
                $columnas = 1;
                $letras = 65;
                $this->configurarDatos($objPHPExcel, $columnas, $letras, $filaEstrato, $datos, $barrioCambia);
                break;
        }

        return $columnas;
    }

    public function configurarDatos(&$objPHPExcel, &$columnas, &$letras, &$fila, &$datos, &$barrioCambia) {
        $datosAdicionales = $this->consultarUsuariosRecaudo($datos);
        if ($barrioCambia == 1 || $datos['estrato'] == 0) {
            $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila, $datos['barrio'], 1);
            $letras++;
            $columnas++;
            $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila, $datos['tiposuso'], 1);
            $columnas++;
            $letras++;
            $barrioCambia = 0;
        }

        $estrato = intval($datos['estrato']) == 0 ? " " : "Est. " . $datos['estrato'];
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila, ( $estrato), 1);
        $letras++;
        $columnas++;
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila, $datosAdicionales['usuarios'], 1);
        $letras++;
        $columnas++;
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila, $datos['Consumo metros'], 1);
        $letras++;
        $this->encontrarLetraColumna($letras);
        $columnas++;
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila, $datos['Consumo pleno'], 1);
        $letras++;
        $this->encontrarLetraColumna($letras);
        $columnas++;
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila, $datos['Facturado'], 1);
        $letras++;
        $this->encontrarLetraColumna($letras);
        $columnas++;
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila, $datosAdicionales['recaudo'], 1);
        $letras++;
        $this->encontrarLetraColumna($letras);
        $columnas++;

        $columnaInicial = $this->configurarColumnasExcel($columnas, $letras) . $fila;
        $objPHPExcel->setActiveSheetIndex(0)->getStyle($columnaInicial)
                ->getNumberFormat()->applyFromArray(
                array(
                    'code' => \PHPExcel_Style_NumberFormat::FORMAT_PERCENTAGE_00
                )
        );
        $porcentaje = (empty($datos['Facturado']) || $datos['Facturado'] == NULL || $datos['Facturado'] == 0) ? 0 : ($datosAdicionales['recaudo'] / $datos['Facturado']);
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila, $porcentaje, 1);

        $letras++;
        $this->encontrarLetraColumna($letras);
        $columnas++;
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila, $datosAdicionales['refacturado'], 1);
    }

    public function estratos(&$objPHPExcel, $columnas, $letras, $fila) {
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila, "Est. 1", 1);
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila + 1, "Est. 2", 1);
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila + 2, "Est. 3", 1);
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila + 3, "Est. 4", 1);
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila + 4, "Est. 5", 1);
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila + 5, "Est. 6", 1);
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila + 6, " ", 1);
        return $fila + 6;
    }

    public function configurartitulos(&$objPHPExcel, $letras, $fila, $meses) {
        $columnas = 1;
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila, "Municipio");
        $letras++;
        $columnas++;
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila, "Tipo Uso");
        $letras++;
        $columnas++;
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila, "Estrato");
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila + 2, "Est. 1", 1);
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila + 3, "Est. 2", 1);
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila + 4, "Est. 3", 1);
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila + 5, "Est. 4", 1);
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila + 6, "Est. 5", 1);
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila + 7, "Est. 6", 1);
        $letras++;
        $columnas++;
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila, "Usuarios");
        $letras++;
        $columnas++;
        $this->configurarMeses($objPHPExcel, $columnas, $letras, $fila, $columnas, $meses);
        return $columnas;
    }

    public function configurarMeses(&$objPHPExcel, &$columnas, &$letras, $fila, &$columnas, $meses) {
//        $mes = 1;
//        $rango = 11;
//        for ($i = $mes; $i <= $mes + $rango; $i++) {
//            setlocale(LC_TIME, 'spanish');
//            $meses = ucwords(strftime("%B", mktime(0, 0, 0, $i, 1, 2000)));
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila, $meses, 1);
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila + 1, "Consumo Metros", 1);
        $letras++;
        $columnas++;
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila + 1, "Consumo Pleno", 1);
        $letras++;
        $columnas++;
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila + 1, "Facturado", 1);
        $letras++;
        $columnas++;
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila + 1, "Recaudado", 1);
        $letras++;
        $columnas++;
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila + 1, "% Recaudado", 1);
        $letras++;
        $columnas++;
        $this->escribirTitutlos($objPHPExcel, $columnas, $letras, $fila + 1, "Valor Refacturado", 1);
        $letras++;
        $columnas++;
//        }
    }

    public function escribirTitutlos(&$objPHPExcel, &$columas, &$letras, $fila, $titulo, $unafila = 0) {

        $columnaInicial = $this->configurarColumnasExcel($columas, $letras) . $fila;
        $columnafinal = $this->configurarColumnasExcel($columas, $letras) . ($fila + 1);
        $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension($this->configurarColumnasExcel($columas, $letras))->setWidth(20);
        if ($unafila == 1) {
            $objPHPExcel->setActiveSheetIndex(0)
                    ->setCellValue($columnaInicial, $titulo);
            return;
        }
        $objPHPExcel->setActiveSheetIndex(0)->mergeCells($columnaInicial . ':' . $columnafinal);
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue($columnaInicial, $titulo);
    }

    public function configurarTotales(&$objPHPExcel, $Nofila) {
        $fila = $Nofila + 1;
        $columnaInicial = "A" . $fila;
        $columnafinal = "C" . $fila;
        $letra = 68; //D
        $columa = 4;

        $objPHPExcel->setActiveSheetIndex(0)->mergeCells($columnaInicial . ':' . $columnafinal);
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue($columnaInicial, 'Total');

        $totalUsuariosLetra = $this->configurarColumnasExcel($columa, $letra);
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue(($totalUsuariosLetra . $fila), "=SUM(" . ($totalUsuariosLetra . ($fila - 7)) . ":" . ($totalUsuariosLetra . ($fila - 1)) . ")");
        $columa++;
        $letra++;
        $totalConsumoMtrLetra = $this->configurarColumnasExcel($columa, $letra);
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue(($totalConsumoMtrLetra . $fila), "=SUM(" . ($totalConsumoMtrLetra . ($fila - 7)) . ":" . ($totalConsumoMtrLetra . ($fila - 1)) . ")");
        $columa++;
        $letra++;
        $totalConsumoPlenoLetra = $this->configurarColumnasExcel($columa, $letra);
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue(($totalConsumoPlenoLetra . $fila), "=SUM(" . ($totalConsumoPlenoLetra . ($fila - 7)) . ":" . ($totalConsumoPlenoLetra . ($fila - 1)) . ")");
        $columa++;
        $letra++;
        $totalFacturadoLetra = $this->configurarColumnasExcel($columa, $letra);
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue(($totalFacturadoLetra . $fila), "=SUM(" . ($totalFacturadoLetra . ($fila - 7)) . ":" . ($totalFacturadoLetra . ($fila - 1)) . ")");
        $columa++;
        $letra++;
        $totalRecaudadoLetra = $this->configurarColumnasExcel($columa, $letra);
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue(($totalRecaudadoLetra . $fila), "=SUM(" . ($totalRecaudadoLetra . ($fila - 7)) . ":" . ($totalRecaudadoLetra . ($fila - 1)) . ")");

        $columa++;
        $letra++;
        $totalPorcentajeRecaudadoLetra = $this->configurarColumnasExcel($columa, $letra);
        $objPHPExcel->setActiveSheetIndex(0)->getStyle(($totalPorcentajeRecaudadoLetra . $fila))
                ->getNumberFormat()->applyFromArray(
                array(
                    'code' => \PHPExcel_Style_NumberFormat::FORMAT_PERCENTAGE_00
                )
        );
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue(($totalPorcentajeRecaudadoLetra . $fila), "=SUM(" . ($totalPorcentajeRecaudadoLetra . ($fila - 7)) . ":" . ($totalPorcentajeRecaudadoLetra . ($fila - 1)) . ")");

        $columa++;
        $letra++;
        $totalRefacturadoLetra = $this->configurarColumnasExcel($columa, $letra);
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue(($totalRefacturadoLetra . $fila), "=SUM(" . ($totalRefacturadoLetra . ($fila - 7)) . ":" . ($totalRefacturadoLetra . ($fila - 1)) . ")");
        $styleLetra = array(
            'font' => array(
                'bold' => true,
                'size' => 12,
            )
        );

        $objPHPExcel->setActiveSheetIndex(0)->getStyle('A' . $fila . ':' . ($totalRefacturadoLetra . $fila))->applyFromArray($styleLetra);
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

    public function validarMes($nombreMes) {
        switch (trim($nombreMes)) {
            case 'Enero': return 1;
            case 'Febrero': return 2;
            case 'Marzo': return 3;
            case 'Abril': return 4;
            case 'Mayo': return 5;
            case 'Junio': return 6;
            case 'Julio': return 7;
            case 'Agosto': return 8;
            case 'Septiembre': return 9;
            case 'Octubre': return 10;
            case 'Noviembre': return 11;
            case 'Diciembre': return 12;
        }
    }

    public function encontrarLetraColumna(&$letra) {
        switch ($letra) {
            case $letra > 90: return $letra = $letra - 26;
            case $letra > 116: return $letra = $letra - (26 * 2);
            case $letra > 142: return $letra = $letra - (26 * 3);
            case $letra > 168: return $letra = $letra - (26 * 4);
            default : return $letra;
        }
    }

}
