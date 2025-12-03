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
 * Description of TerceroModel
 *
 * @author lmrubio
 */
class ProcesoRecaudosModel extends AuditoriaServices {

    //put your code here

    private $genericoModel;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($conexion);
    }

    public function getRecaudosDisponibleTipoSuscripcion($idTipoSuscripcion, $idEmpresa, $inicio) {
        $parametros['idtiposuscripcion'] = $idTipoSuscripcion;
        $parametros['idempresa'] = $idEmpresa;
        $parametros['inicio'] = $inicio;
        $parametros['idprogramafes'] = CODIGO_PROGRAMA_FES_GENERACION_PLANO;
        $concatenar = '';
        if($idEmpresa != 322){
            $concatenar = ' AND dsus.uni_tipsuscripc=:idtiposuscripcion ';
        }
        $sql = "SELECT
                  DISTINCT
                  dire.dsus_ideregistr idsuscripcion,
                  rec.rec_ideregistro idrecaudo,
                  rec.rec_fecaplicado fechaaplicado,
                  rec.rec_version as version,
                  dire.dire_sdorecaudo disponible,
                  rec.uni_documento iddocumento,
                  doc.doc_tipo tiporecaudo,
                  dire.dire_ideregistr iddistribucion
                FROM
                  dire_disrecaudo dire INNER JOIN rec_recaudo rec ON dire.rec_ideregistro=rec.rec_ideregistro
                  INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr=dire.dsus_ideregistr
                  INNER JOIN doc_documento doc ON doc.uni_documento=rec.uni_documento
                  left join (select dsus_ideregistr,count(*) cantidad from fac_factura where  emp_ideregistro  = :idempresa and fac_estado ='G'
                                GROUP BY dsus_ideregistr) contfact on contfact.dsus_ideregistr = dire.dsus_ideregistr
                WHERE
                  dire.dire_sdorecaudo > 0 AND dire.emp_ideregistro = :idempresa AND rec.rec_estado in ('A','G','P')
                  AND rec.rec_idepadre IS NULL". $concatenar . "                 
                  AND (
                       doc.doc_aplicafes ='N'  
                      OR
                        (   dire.uni_documento is not null 
                            AND dire.uni_documento IN (SELECT uni_documento from doc_documento where doc_aplicafes ='N' )
                        )
                      OR 
                      (
                       (COALESCE(contfact.cantidad,0))= 0 
                      )
                      OR
                      (
                          ( select  count(*) from dper_detperiodo dper 
                               inner join per_periodo per on per.per_ideregistro  = dper.per_ideregistro 
                               where per.cic_ideregistro = dsus.cic_ideregistro and per.per_estado ='A' 
                                     AND dper.dper_feccierre is not null and rec.rec_fecha < dper.dper_feccierre
                                     AND dper.prg_ideregistro = :idprogramafes AND dper.dper_estado='C'  
                          ) = 0
                      ))
                ORDER BY
                  rec.rec_ideregistro
                OFFSET :inicio
                LIMIT 100";
        return $this->executeQuery($sql, $parametros);
    }

    public function getRecaudosDisponibleCiclo($idCiclo, $idEmpresa, $inicio) {
        $parametros['idciclo'] = $idCiclo;
        $parametros['idempresa'] = $idEmpresa;
        $parametros['inicio'] = $inicio;
        $sql = "SELECT
                  DISTINCT
                  dire.dsus_ideregistr idsuscripcion,
                  rec.rec_ideregistro idrecaudo,
                  rec.rec_fecaplicado fechaaplicado,
                  rec.rec_version as version,
                  dire.dire_sdorecaudo disponible,
                  rec.uni_documento iddocumento,
                  doc.doc_tipo tiporecaudo,
                  dire.dire_ideregistr iddistribucion
                FROM
                  dire_disrecaudo dire INNER JOIN rec_recaudo rec ON dire.rec_ideregistro=rec.rec_ideregistro
                  INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr=dire.dsus_ideregistr
                  INNER JOIN doc_documento doc ON doc.uni_documento=rec.uni_documento
                WHERE
                  dire.dire_sdorecaudo > 0 AND dire.emp_ideregistro = :idempresa AND rec.rec_estado in ('A','G','P')
                  AND rec.rec_idepadre IS NULL AND dsus.cic_ideregistro=:idciclo AND doc.doc_pagpriori<>-1 
                ORDER BY
                  rec.rec_ideregistro
                OFFSET :inicio
                LIMIT 2000";
        return $this->executeQuery($sql, $parametros);
    }

    public function insertarDetalleRecaudo($infoRecaudo, &$concepto, &$factura) {
        $detalle['rec_ideregistro'] = $infoRecaudo['idrecaudo'];
        $detalle['dire_ideregistr'] = $infoRecaudo['iddistribucion'];
        $detalle['drec_vlrtotal'] = $concepto['valorpagar'];
        $detalle['drec_vlrreal'] = $concepto['valorpagar'];
        $detalle['drec_fecha'] = 'now()';
        $detalle['fac_ideregistro'] = $concepto['idfactura'];
        $detalle['cic_ideregistro'] = $infoRecaudo['cicloperiodo']['idciclo'];
        $detalle['per_ideregistro'] = $infoRecaudo['cicloperiodo']['idperiodo'];
        $detalle['uni_documento'] = $factura['iddocumento'];
        $detalle['uni_tipdocument'] = $factura['idtipodocumento'];
        $detalle['dfac_ideregistr'] = $concepto['iddetallefactura'];
        $detalle['cic_ano'] = $infoRecaudo['cicloperiodo']['cicloanio'];
        $detalle['usu_ideregistro'] = $infoRecaudo['idusuario'];
        $detalle['iddetallerecaudo'] = $this->insertar($detalle, 'drec_detrecaudo', 'sq_drec_ideregistr');
        return $detalle;
    }

    public function insertarFacturaRecaudo(&$infoRecaudo, &$factura) {
        $facturaRecaudo['fac_ideregistro'] = $factura['idfactura'];
        $facturaRecaudo['dsus_ideregistr'] = $infoRecaudo['idsuscripcion'];
        $facturaRecaudo['dire_ideregistr'] = $infoRecaudo['iddistribucion'];
        $facturaRecaudo['emp_ideregistro'] = $factura['idempresa'];
        $facturaRecaudo['usu_ideregistro'] = $infoRecaudo['idsuscripcion'];
        $this->insertar($facturaRecaudo, 'fare_facrecaudo', 'sq_fare_ideregistr');
    }

    public function getFacturasConSaldoAnticipo($infoAnticipo) {
        $complemento = '';
        if (!empty($infoAnticipo['idconcepto'])) {
            $complemento .= ' INNER JOIN dfac_detfactura dfac ON dfac.fac_ideregistro=fac.fac_ideregistro  and dfac.dfac_sdoreal >0';
        }
        $complemento .= " WHERE fac.uni_tipdocument=:idtipodocumento AND fac.dsus_ideregistr=:idsuscripcion AND fac.fac_sdoreal>0 AND "
                       ."       fac.fac_estado ='A' and fac.fac_idepadre is null ";
        if (!empty($infoAnticipo['iddocumentoanticipo'])) {
            $complemento .= ' AND fac.uni_documento=:iddocumentoanticipo ';
        }
        if (!empty($infoAnticipo['idconcepto'])) {
            $complemento .= 'AND dfac.uni_concepto =:idconcepto ';
        }
        if (!empty($infoAnticipo['ideperiodoaplicar'])) {
            $complemento .= ' AND fac.per_ideregistro =:ideperiodoaplicar ';
        }
        return $this->genericoModel->getFacturasInformacion($complemento, $infoAnticipo);
    }

    public function getConceptosSaldoAnticipos($infoAnticipo) {
        $complemento = 'WHERE dfac.fac_ideregistro=:idfactura AND dfac.dfac_sdoreal>0';
        if (!empty($infoAnticipo['idconcepto'])) {
            $complemento .= ' AND dfac.uni_concepto =:idconcepto ';
        }
        return $this->genericoModel->getConceptosInformacion($complemento, $infoAnticipo);
    }

    public function vaciarTabla($idEmpresa) {
        $sql = "DROP TABLE IF EXISTS temp_aplicar_recaudos_$idEmpresa";
        $this->executeQuery($sql);
    }

    public function crearTabla($idEmpresa) {
        $sql = "CREATE TABLE temp_aplicar_recaudos_$idEmpresa AS SELECT
                  dire.dire_ideregistr iddistribucion,
                        dire.rec_ideregistro idrecaudo,
                  dire.dsus_ideregistr idsuscripcion,
                  'P'::character VARYING estado,
                  ''::text mensaje,
                  0::bigint usu_ideregistro
                FROM
                 dire_disrecaudo dire INNER JOIN dsus_detsuscrip dsus ON dire.dsus_ideregistr=dsus.dsus_ideregistr
                WHERE 1=2";
        $this->executeQuery($sql);
    }

    public function insertarTablaTemporal(array $registro, $idEmpresa) {
        $parametros = array();
        $this->setCampo($registro, $parametros, 'iddistribucion', 'iddistribucion');
        $this->setCampo($registro, $parametros, 'idrecaudo', 'idrecaudo');
        $this->setCampo($registro, $parametros, 'idsuscripcion', 'idsuscripcion');
        $this->setCampo($registro, $parametros, 'estado', 'estado');
        $this->setCampo($registro, $parametros, 'mensaje', 'mensaje');
        $this->setCampo($registro, $parametros, 'idusuario', 'usu_ideregistro');
        $this->insertar($parametros, "temp_aplicar_recaudos_$idEmpresa", null);
    }

    public function actualizarFechaAplicacion($idrecaudo) {
        $parametros['rec_ideregistro'] = $idrecaudo;
        $parametros['rec_fecaplicado'] = 'now()';
        return $this->actualizar($parametros, 'rec_recaudo', 'rec_ideregistro =:rec_ideregistro');
    }

    public function getVersionRecaudo($idRecaudo) {
        $sql = "select rec_version from rec_recaudo where rec_ideregistro = $idRecaudo";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('No se encontró el recaudo', -1);
        }
        return $resultado[0]['rec_version'];
    }

}
