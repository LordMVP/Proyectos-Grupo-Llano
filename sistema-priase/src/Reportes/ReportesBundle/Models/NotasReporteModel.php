<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Reportes\ReportesBundle\Models;

use Llanogas\LlanogasBundle\MyException;

/**
 * Description of NotasReporteModel
 *
 * @author progredi
 */
class NotasReporteModel extends ReportesDefaultModel {

    public $columnastotalesDias;

    //put your code here
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    public function datosTotales($parametros) {

        $sql = "SELECT DISTINCT
                fac.fac_fecha::DATE    \"Fecha Nota\",
                fac.dsus_ideregistr    \"Id Suscripción\",
                dsus.dsus_pcodigo      \"Código\",
                dsus.pro_catestrato    \"Estrato\",
                unitipouso.uni_nombre1 \"Tipo Uso\",
                ter.ter_nomcompleto    \"Usuario\",
                unimotivo.uni_nombre1  \"Motivo Nota\",
                CASE WHEN fac.fac_estado = 'R' THEN 'Si'  ELSE 'No' END  \"Reclamación\",
                CASE WHEN fac.mvi_ideregistro IS NULL    THEN 'No'  ELSE 'Si' END \"Contabilizado\",
                usu.usuario_nom        \"Funcionario\",
                nota.not_comentario    \"Observación\",
                COALESCE((SELECT valor
                          FROM getdetallenota(dfac.dfac_ideregistr, fac.fac_ideregistro, fac.fac_fecha)), 0) valorfactura,
                  dfacnota.dfac_vlrreal  valornota,
                dfac.uni_concepto      idconcepto,
                con.con_nombre         concepto,
                dfac.dfac_ideregistr,
                fac.fac_idepadre       idfacturaoriginal,
                fac.fac_ideregistro    idfacturanota,
                fac.fac_estado         estado,
                fac.fac_fecha::DATE    fechanota,
                ddot.ddot_tipo         tiponota,
                proyectos.proyecto_nom municipio,
                proyectos.proyecto_cod
              FROM
                fac_factura fac
                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = fac.dsus_ideregistr
                INNER JOIN proyectos proyectos ON proyectos.proyecto_ideregistro = dsus.uni_municipio
                INNER JOIN per_periodo per ON per.per_ideregistro = fac.per_ideregistro
                INNER JOIN cic_ciclo cic ON fac.cic_ideregistro = cic.cic_ideregistro
                INNER JOIN doti_doctipo doti ON fac.uni_tipdocument = doti.uni_tipdocument
                INNER JOIN ddot_detdoctipo ddot ON ddot.doti_ideregistr = doti.doti_ideregistr
                INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
                INNER JOIN uni_unidad unitipouso ON unitipouso.uni_ideregistro = dsus.uni_tipusosuscr
                INNER JOIN dfac_detfactura dfacnota ON fac.fac_ideregistro = dfacnota.fac_ideregistro
                INNER JOIN dfac_detfactura dfac ON dfac.dfac_ideregistr = dfacnota.dfac_idepadre
                INNER JOIN ( 
                SELECT DISTINCT con.*
                FROM core_conrelacio core INNER JOIN con_concepto con ON core.uni_conrelacion = con.uni_concepto
                WHERE core.uni_concepto IN (
                  SELECT DISTINCT con.uni_concepto
                  FROM con_concepto con INNER JOIN esem_estempresa esem ON con.est_concepto = esem.est_ideregistro
                    INNER JOIN coli_conliquida coli ON con.uni_concepto = coli.uni_concepto
                  WHERE esem.emp_ideregistro = 322 AND con.con_operacion = 'S'
                )
                UNION
                (SELECT DISTINCT con.*
                 FROM con_concepto con INNER JOIN esem_estempresa esem ON con.est_concepto = esem.est_ideregistro
                   INNER JOIN coli_conliquida coli ON con.uni_concepto = coli.uni_concepto
                 WHERE esem.emp_ideregistro = 322 AND con.con_operacion = 'S'))  con on dfac.uni_concepto = con.uni_concepto
                LEFT JOIN usuarios usu ON usu.usu_ideregistro = fac.usu_ideregistro
                LEFT JOIN nofa_notfactura nofa
                  ON (nofa.fac_ideregistro = fac.fac_ideregistro AND fac.fac_idepadre = nofa.fac_ideorigen)
                LEFT JOIN not_nota nota ON nota.not_ideregistro = nofa.not_ideregistro
                LEFT JOIN uni_unidad unimotivo ON unimotivo.uni_ideregistro = nota.uni_motnota
              WHERE
                fac.fac_estado <> 'E'
                AND fac.uni_documento = ddot.uni_documento
                AND fac.fac_idepadre IS NOT NULL
                AND con.con_operacion = 'S' 
                AND ddot.ddot_tipo NOT IN ('RC', 'PR', 'CC', 'NS','RP')
              " . $parametros . "
                ORDER BY proyectos.proyecto_cod, fac.fac_ideregistro , dfac.dfac_ideregistr";

        return $this->executeQuery($sql);
    }

    public function columnas($parametros) {
        $sql = "SELECT DISTINCT con.con_nombre
                FROM
                  fac_factura fac
                   INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = fac.dsus_ideregistr
                      INNER JOIN proyectos proyectos ON proyectos.proyecto_ideregistro = dsus.uni_municipio
                INNER JOIN per_periodo per ON per.per_ideregistro = fac.per_ideregistro
                INNER JOIN cic_ciclo cic ON fac.cic_ideregistro = cic.cic_ideregistro
                INNER JOIN doti_doctipo doti ON fac.uni_tipdocument = doti.uni_tipdocument
                INNER JOIN ddot_detdoctipo ddot ON ddot.doti_ideregistr = doti.doti_ideregistr
                INNER JOIN ter_tercero ter ON ter.ter_ideregistro = dsus.ter_ideregistro
                INNER JOIN uni_unidad unitipouso ON unitipouso.uni_ideregistro = dsus.uni_tipusosuscr
                INNER JOIN dfac_detfactura dfacnota ON fac.fac_ideregistro = dfacnota.fac_ideregistro
                INNER JOIN dfac_detfactura dfac ON dfac.dfac_ideregistr = dfacnota.dfac_idepadre
                INNER JOIN ( 
                SELECT DISTINCT con.*
                FROM core_conrelacio core INNER JOIN con_concepto con ON core.uni_conrelacion = con.uni_concepto
                WHERE core.uni_concepto IN (
                  SELECT DISTINCT con.uni_concepto
                  FROM con_concepto con INNER JOIN esem_estempresa esem ON con.est_concepto = esem.est_ideregistro
                    INNER JOIN coli_conliquida coli ON con.uni_concepto = coli.uni_concepto
                  WHERE esem.emp_ideregistro = 322 AND con.con_operacion = 'S'
                )
                UNION
                (SELECT DISTINCT con.*
                 FROM con_concepto con INNER JOIN esem_estempresa esem ON con.est_concepto = esem.est_ideregistro
                   INNER JOIN coli_conliquida coli ON con.uni_concepto = coli.uni_concepto
                 WHERE esem.emp_ideregistro = 322 AND con.con_operacion = 'S'))  con on dfac.uni_concepto = con.uni_concepto
                 LEFT JOIN usuarios usu ON usu.usu_ideregistro = fac.usu_ideregistro
                LEFT JOIN nofa_notfactura nofa
                  ON (nofa.fac_ideregistro = fac.fac_ideregistro AND fac.fac_idepadre = nofa.fac_ideorigen)
                LEFT JOIN not_nota nota ON nota.not_ideregistro = nofa.not_ideregistro
                LEFT JOIN uni_unidad unimotivo ON unimotivo.uni_ideregistro = nota.uni_motnota
                WHERE
                  fac.fac_estado <> 'E'
                  AND fac.uni_documento = ddot.uni_documento
                  AND fac.fac_idepadre IS NOT NULL
                   AND con.con_operacion = 'S' 
                  AND ddot.ddot_tipo NOT IN ('RC', 'PR', 'CC', 'NS','RP')
                  " . $parametros . "
                ORDER BY  con.con_nombre;";
        return $this->executeQuery($sql);
    }

    public $finalTotales;

    public function procesarColumnas($parametros) {
        $datos = $this->columnas($parametros);
        $final = array();
        $finalTotales = array();
        foreach ($datos as $columna) {
            $final = array_merge($final, array_flip($columna));
            $finalTotales = array_merge($finalTotales, array_flip($columna));
        }

        foreach (array_keys($final) as $key) {
            $final[$key] = 0;
            $totales['totalnota'] = 0;
            $totales['totalFactura'] = 0;
            $finalTotales[$key] = $totales;
        }

        $this->columnastotalesDias = $finalTotales;
        $this->finalTotales = $finalTotales;
        return $final;
    }

    public function procesarDatos(&$objPHPExcel, $parametros) {
        clearstatcache();
        $facturas = $this->datosTotales($parametros);
        if (empty($facturas)) {
            $resultado['cantidadFacturas'] = 1;
            $resultado['letraFinal'] = 'Z';
            return $resultado;
        }
        $columnasConceptos = $this->procesarColumnas($parametros);
        $nofila = 6;
        $letraFinal = 'Z';
        $cantidadFacturas = 0;
        $idfactura = $facturas[0]['idfacturanota'];
        $facturaNueva = array_slice($facturas[0], 0, 11, true) + $columnasConceptos;
        $lista = [];
        $municipio = $facturas[0]['municipio'];
        $fecha = $facturas[0]['fechanota'];
        $cambioFecha = 0;
        $cambioMunicipio = 1;
        for ($i = 0; $i < count($facturas); $i++) {
            $factura = $facturas[$i];
            $cantidadFacturas++;
            if ($municipio != $factura['municipio']) {
                $cambioMunicipio = 1;
                $municipio = $factura['municipio'];
            }
            if ($fecha != $factura['fechanota']) {
//                print_r('\n Entra a la validacion del ciclo Fecha Anterior' . $fecha . 'Fecha actual ' . $factura['fechanota']);
                $cambioFecha = 1;
                $fecha = $factura['fechanota'];
            }
            if ($idfactura == $factura['idfacturanota']) {
                $facturaNueva[$factura['concepto']] = $factura['valorfactura'] . '&&' . $factura['valornota'];
                $letraFinal = $this->validarUltimoRegistro($cantidadFacturas, $facturas, $factura, $lista, $facturaNueva, $objPHPExcel, $nofila, $municipio, $cambioMunicipio, $cambioFecha, $letraFinal);
                continue;
            }
            array_push($lista, $facturaNueva);
            $this->escribirDatos($objPHPExcel, array_keys($facturaNueva), $facturaNueva, $nofila, $cambioMunicipio, $cambioFecha, $municipio);
            $nofila = $nofila + 7;
            $idfactura = $factura['idfacturanota'];
            $municipio = $factura['municipio'];
            $fecha = $factura['fechanota'];
            $facturaNueva = array_slice($factura, 0, 11, true) + $columnasConceptos;
            $facturaNueva[$factura['concepto']] = $factura['valorfactura'] . '&&' . $factura['valornota'];
            $this->validarUltimoRegistro($cantidadFacturas, $facturas, $factura, $lista, $facturaNueva, $objPHPExcel, $nofila, $municipio, $cambioMunicipio, $cambioFecha, $letraFinal);
        }
        $resultado['cantidadFacturas'] = $nofila;
        $resultado['letraFinal'] = $letraFinal;
        return $resultado;
    }

    public function validarUltimoRegistro(&$cantidadFacturas, &$facturas, &$factura, &$lista, &$facturaNueva, &$objPHPExcel, &$nofila, &$municipio, &$cambioMunicipio, &$cambioFecha, &$letraFinal) {
        if ($cantidadFacturas == count($facturas)) {
            array_push($lista, $facturaNueva);
            if ($municipio != $factura['municipio']) {
                $cambioMunicipio = 1;
            }
            $cambioFecha = 1;
            $letraFinal = $this->escribirDatos($objPHPExcel, array_keys($facturaNueva), $facturaNueva, $nofila, $cambioMunicipio, $cambioFecha, $municipio);
            $nofila = $nofila + 7;
            return $letraFinal;
        }
    }

    public function escribirDatos(&$objPHPExcel, $columnasEncabezado, $factura, &$nofila, &$cambioMunicipio, &$cambioFecha, &$municipio) {
//        print_r(' \n Factura No: ' . $factura['idsuscripcion']);
        $cantidadColumnas = 1;
        $letras = 65;
        for ($i = 0; $i < count($columnasEncabezado); $i++) {
            $columna = $this->configurarColumnasExcel($cantidadColumnas, $letras) . $nofila;
            $letraActual = $this->configurarColumnasExcel($cantidadColumnas, $letras);
            if ($nofila == 6) {
                if ($cantidadColumnas < 12) {
                    //Nombre del municipio
                    $this->configurarNombreMunicipio($objPHPExcel, $cantidadColumnas, $columnasEncabezado, $letras, $municipio, $cambioMunicipio, $nofila);
                    ///encabezados
                    $objPHPExcel->setActiveSheetIndex(0)->mergeCells(($letraActual . $nofila) . ':' . ($letraActual . ($nofila + 1)));
                    $objPHPExcel->setActiveSheetIndex(0)
                            ->setCellValue($columna, ucwords($columnasEncabezado[$i]));
                    $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension($this->configurarColumnasExcel($cantidadColumnas, $letras))->setWidth(20);
                    //Estilo         
                    $objPHPExcel->setActiveSheetIndex(0)->getStyle($columna)->getFont()->setBold(true);
                    $objPHPExcel->setActiveSheetIndex(0)->getStyle($columna)->getAlignment()->setWrapText(true);
                    //__________________________________________________________________________________________________
                    //Prumera Filla    
                    $columna = $this->configurarColumnasExcel($cantidadColumnas, $letras) . ($nofila + 2);
                    $objPHPExcel->setActiveSheetIndex(0)->mergeCells(($letraActual . ($nofila + 2)) . ':' . ($letraActual . ($nofila + 5)));
                    if ($cantidadColumnas == 3) {
                        $objPHPExcel->getActiveSheet()->setCellValueExplicit($columna, $factura[$columnasEncabezado[$i]], \PHPExcel_Cell_DataType::TYPE_STRING);
                    } else {
                        $objPHPExcel->setActiveSheetIndex(0)
                                ->setCellValue($columna, $factura[$columnasEncabezado[$i]]);
                    }
                } else {
                    $this->configurarDetalleEncabezado($nofila, $cantidadColumnas, $letras, $objPHPExcel, $columnasEncabezado, $i, $factura); //, $letraActual;
                }
            } else {
                if ($cantidadColumnas < 12) {
                    //Nombre del municipio
                    $this->configurarNombreMunicipio($objPHPExcel, $cantidadColumnas, $columnasEncabezado, $letras, $municipio, $cambioMunicipio, $nofila);
                    //Prumera Filla    
                    $columna = $this->configurarColumnasExcel($cantidadColumnas, $letras) . ($nofila);
                    $objPHPExcel->setActiveSheetIndex(0)->mergeCells(($letraActual . ($nofila)) . ':' . ($letraActual . ($nofila + 5)));
                    if ($cantidadColumnas == 3) {
                        $objPHPExcel->getActiveSheet()->setCellValueExplicit($columna, $factura[$columnasEncabezado[$i]], \PHPExcel_Cell_DataType::TYPE_STRING);
                    } else {
                        $objPHPExcel->setActiveSheetIndex(0)
                                ->setCellValue($columna, $factura[$columnasEncabezado[$i]]);
                    }
                } else {
                    $this->configurarDetalleEncabezado($nofila, $cantidadColumnas, $letras, $objPHPExcel, $columnasEncabezado, $i, $factura); // , $letraActual, $totalesFinales
                }
            }
            $this->configurarTotalesDias($objPHPExcel, $cantidadColumnas, $letras, $nofila, $columnasEncabezado, $i, $cambioFecha);
            $letras++;
            $cantidadColumnas++;
        }
//        print_r('\n Fila Ultima No. :' . $nofila);
        $ultima = $letras - 1;
        return $this->configurarColumnasExcel($cantidadColumnas, $ultima);
    }

    public function configurarDetalleEncabezado(&$nofila, &$cantidadColumnas, &$letras, &$objPHPExcel, &$columnasEncabezado, &$i, &$factura) { //$letraActual, $totalesFinales
        $fila = $nofila;
        //Se sacan los valores de los conceptos
        $conceptosValor = explode('&&', $factura[$columnasEncabezado[$i]]);
        $conceptoFactura = isset($conceptosValor[0]) ? $conceptosValor[0] : 0;
        $conceptoNota = isset($conceptosValor[1]) ? $conceptosValor[1] : 0;
        $valordiferencia = $conceptoFactura - ($conceptoNota < 0 ? $conceptoNota * -1 : $conceptoNota);
        //Titulo liquidados
        if ($cantidadColumnas == 12) {
            $this->tituloDetalle($objPHPExcel, $cantidadColumnas, $letras, $fila, 'CONCEPTOS LIQUIDADOS', $columnasEncabezado);
        }
        $fila++;
        //Encabezados liquidados
        $this->encabezadoDetalle($objPHPExcel, $cantidadColumnas, $letras, $fila, $columnasEncabezado, $i);

        $fila++;
        //Filla para escribir datos
        $this->configurarDetalleDatos($objPHPExcel, $cantidadColumnas, $letras, $fila, $conceptoFactura);
        $this->calcularTotalesDias($columnasEncabezado, $i, 'F', $conceptoFactura);

        $fila++;
        //Titulo Notas
        if ($cantidadColumnas == 12) {
            $this->tituloDetalle($objPHPExcel, $cantidadColumnas, $letras, $fila, 'CONCEPTOS NOTAS', $columnasEncabezado);
        }
        $fila++;
        //Encabezados Notas
        $this->encabezadoDetalle($objPHPExcel, $cantidadColumnas, $letras, $fila, $columnasEncabezado, $i);

        $fila ++;
        //Fila para escribir datos
        $this->configurarDetalleDatos($objPHPExcel, $cantidadColumnas, $letras, $fila, $conceptoNota);
        $this->calcularTotalesDias($columnasEncabezado, $i, 'N', $conceptoNota);

        //Se pinta la diferencia entre notas 
        $fila++;
        $this->configurarDiferenciaNotas($objPHPExcel, $cantidadColumnas, $letras, $fila, $i, $valordiferencia);
    }

    public function configurarDetalleDatos(&$objPHPExcel, &$cantidadColumnas, &$letras, &$fila, $valor) {
        $columna = $this->configurarColumnasExcel($cantidadColumnas, $letras) . $fila;
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue($columna, $valor);
        //Estilo
        $objPHPExcel->setActiveSheetIndex(0)->getStyle($columna)->getAlignment()->setWrapText(true);
    }

    public function encabezadoDetalle(&$objPHPExcel, &$cantidadColumnas, &$letras, &$fila, &$columnasEncabezado, &$i) {
        $columna = $this->configurarColumnasExcel($cantidadColumnas, $letras) . $fila;
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue($columna, ucwords($columnasEncabezado[$i]));

        //estilo
        $objPHPExcel->setActiveSheetIndex(0)->getRowDimension($fila)->setRowHeight(30);
        $objPHPExcel->setActiveSheetIndex(0)->getStyle($columna)->getFont()->setBold(true);
        $objPHPExcel->setActiveSheetIndex(0)->getStyle($columna)->getAlignment()->setWrapText(true);
        $tamaño = strlen($columnasEncabezado[$i]) > 50 ? 35 : 20;
        $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension($this->configurarColumnasExcel($cantidadColumnas, $letras))->setWidth($tamaño);
    }

    public function tituloDetalle(&$objPHPExcel, &$cantidadColumnas, &$letras, &$fila, $titulo, &$columnasEncabezado) {
        $columna = $this->configurarColumnasExcel($cantidadColumnas, $letras) . $fila;
        $letrafinal = 65 + count($columnasEncabezado) - (intval((count($columnasEncabezado) - 1) / 26) * 26);
        $cantidad = (count($columnasEncabezado) - 1);
        $final = $this->configurarColumnasExcel($cantidad, $letrafinal) . $fila;
        //Estilo
        $objPHPExcel->setActiveSheetIndex(0)->mergeCells($columna . ':' . $final);
        $objPHPExcel->setActiveSheetIndex(0)->getStyle($columna . ':' . $final)->getFont()->setBold(true);
        //Escribe el titulo
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue($columna, $titulo);
    }

    public $letraInicial;

    public function configurarDiferenciaNotas(&$objPHPExcel, &$cantidadColumnas, &$letras, &$fila, &$i, $valordiferencia) {

        if ($cantidadColumnas == 12) {
            $this->letraInicial = 'A';
            $this->titulosTotales($cantidadColumnas, $letras - 1, $fila, $this->letraInicial . $fila, $objPHPExcel, 'TOTAL DIFERENCIA');
        }
        if ($i > 10) {
            $columna = $this->configurarColumnasExcel($cantidadColumnas, $letras) . ($fila);
            $objPHPExcel->setActiveSheetIndex(0)
                    ->setCellValue($columna, $valordiferencia);
        }
    }

    public function configurarTotalesDias(&$objPHPExcel, &$cantidadColumnas, &$letras, &$nofila, &$columnasEncabezado, &$i, &$cambioFecha) {
        if ($cambioFecha == 1) {
            $fila = $nofila + 9;
            if ($i == 0) {
                $this->letraInicial = $this->configurarColumnasExcel($cantidadColumnas, $letras);
            }
            if ($i == 10) {
//                print_r(':::: ESTOY CONFIGURANBDO TITULOS :::::::::');
                $this->titulosTotales($cantidadColumnas, $letras, $fila, $this->letraInicial . $fila, $objPHPExcel, 'TOTAL DIA LIQUIDADO');
                $fila++;
                $this->titulosTotales($cantidadColumnas, $letras, $fila, $this->letraInicial . $fila, $objPHPExcel, 'TOTAL DIA NOTAS');
                $fila++;
                $this->titulosTotales($cantidadColumnas, $letras, $fila, $this->letraInicial . $fila, $objPHPExcel, 'TOTAL DIA DIFERENCIA');
            }
            if ($i > 10) {
//                print_r(':::: ESTOY CONFIGURANBDO MUNICIPIO :::::::::');
                $concepto = $this->columnastotalesDias[$columnasEncabezado[$i]];
                $columna = $this->configurarColumnasExcel($cantidadColumnas, $letras) . ($fila);
                $almacenadoFactura = $concepto['totalFactura'];
                $almacenadoNota = $concepto['totalnota'];
                $diferencia = $almacenadoFactura - ($almacenadoNota < 0 ? $almacenadoNota * -1 : $almacenadoNota);
                $objPHPExcel->setActiveSheetIndex(0)
                        ->setCellValue($columna, $almacenadoFactura);
                $fila++;
                $columna = $this->configurarColumnasExcel($cantidadColumnas, $letras) . ($fila);
                $objPHPExcel->setActiveSheetIndex(0)
                        ->setCellValue($columna, $almacenadoNota);
                $fila++;
                $columna = $this->configurarColumnasExcel($cantidadColumnas, $letras) . ($fila);
                $objPHPExcel->setActiveSheetIndex(0)
                        ->setCellValue($columna, $diferencia);
            }
            if (count($columnasEncabezado) == $cantidadColumnas) {
                $nofila = $nofila + 7;
                $this->columnastotalesDias = $this->finalTotales;
                $cambioFecha = 0;
//                print_r('::::::::: Entra aqui !!' . $cambioFecha);
            }
        }
    }

    public function titulosTotales($cantidadColumnas, $letras, $fila, $columnaInicial, $objPHPExcel, $titulo) {
        $columna = $this->configurarColumnasExcel($cantidadColumnas, $letras) . ($fila);
//        printf('Columna inicial' . $columnaInicial . 'COLUMNA :' . $columna . ' TITULO : ' . $titulo);
        $objPHPExcel->setActiveSheetIndex(0)->mergeCells($columnaInicial . ':' . $columna);
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue($columnaInicial, $titulo);
        $objPHPExcel->setActiveSheetIndex(0)->getStyle($columnaInicial)->getFont()->setBold(true);
        $objPHPExcel->setActiveSheetIndex(0)->getStyle($columnaInicial)->getAlignment()->setWrapText(true);
    }

    public function calcularTotalesDias(&$columnasEncabezado, &$i, $tipo, $valor) {
        $concepto = $this->columnastotalesDias[$columnasEncabezado[$i]];
        $almacenadoNota = $concepto['totalnota'] == NULL ? 0 : $concepto['totalnota'];
        $almacenadoFactura = $concepto['totalFactura'] == null ? 0 : $concepto['totalFactura'];
        if ($tipo == 'N') {
            $almacenadoNota = $almacenadoNota + $valor;
            $concepto['totalnota'] = $almacenadoNota;
        }
        if ($tipo == 'F') {
            $almacenadoFactura = $almacenadoFactura + $valor;
            $concepto['totalFactura'] = $almacenadoFactura;
        }
        $this->columnastotalesDias[$columnasEncabezado[$i]] = $concepto;
    }

    public function configurarNombreMunicipio($objPHPExcel, $cantidadColumnas, $columnasEncabezado, $letras, $nombreMunicipio, &$cambioMunicipio, $nofila) {
        if ($cantidadColumnas == 1 && $cambioMunicipio == 1) {
            $columna = $this->configurarColumnasExcel($cantidadColumnas, $letras) . ($nofila - 1);
            $objPHPExcel->setActiveSheetIndex(0)
                    ->setCellValue($columna, $nombreMunicipio);

            $objPHPExcel->setActiveSheetIndex(0)->getStyle($columna)->getFont()->setBold(true);
            $objPHPExcel->setActiveSheetIndex(0)->getStyle($columna)->getAlignment()->setWrapText(true);
            $cambioMunicipio = 0;
        }
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
