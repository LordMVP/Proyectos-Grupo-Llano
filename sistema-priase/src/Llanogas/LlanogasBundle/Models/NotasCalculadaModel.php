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
 * @author lrey
 */
class NotasCalculadaModel extends AuditoriaServices {

    private $idPrograma;
    //put your code here

    private $genericoModel;

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct($idPrograma, &$conexion = null) {
        $this->setConexion($conexion);
        $this->genericoModel = new GenericoModel($conexion);
        $this->idPrograma = $idPrograma;
    }

    public function eliminarTablaConsulta($idUsuario) {


        //Elimina la tabla temporal si es que existe
        $sqlDrop = "DROP TABLE IF EXISTS temp_calculada_consulta_$idUsuario" . "_" . $this->idPrograma;
        $this->executeQuery($sqlDrop);
    }

    /*
     * Elimina las tablas temporales creadas 
     */

    public function eliminarTablasNotas($idUsuario) {
        //Elimina la secuencia temporal si es que existe
        $sqlDrop = "DROP SEQUENCE IF EXISTS sq_temp_calculada_factura_$idUsuario" . "_" . $this->idPrograma;
        $this->executeQuery($sqlDrop);

        $sqlDrop = "DROP TABLE IF EXISTS temp_calculada_factura_$idUsuario" . "_" . $this->idPrograma;
        $this->executeQuery($sqlDrop);

        $sqlDrop = "DROP TABLE IF EXISTS temp_calculada_detalle_$idUsuario" . "_" . $this->idPrograma;
        $this->executeQuery($sqlDrop);
    }

    public function crearTablasNotas($idUsuario) {
        //Elimina la secuencia temporal si es que existe
        $sqlCrear = "CREATE SEQUENCE sq_temp_calculada_factura_$idUsuario" . "_" . $this->idPrograma;
        $this->executeQuery($sqlCrear);

        $sqlCrear = "create table temp_calculada_factura_$idUsuario" . "_" . $this->idPrograma . " AS (select *,'-'::character(2) tipo from fac_factura limit 0)";
        $this->executeQuery($sqlCrear);

        $sqlCrear = "create table temp_calculada_detalle_$idUsuario" . "_" . $this->idPrograma . " AS (select *,''::character(1) existe from dfac_detfactura limit 0)";
        $this->executeQuery($sqlCrear);
    }

    public function getTiposDocumentos($parametros) {
        $complemento = '';
        $sql = "SELECT DISTINCT
                tido.uni_tipdocument idtipodocumento,
                uni.uni_nombre1      tipodocumento
              FROM
                tido_tipdocumen tido
                INNER JOIN uni_unidad uni ON tido.uni_tipdocument = uni.uni_ideregistro
                INNER JOIN prun_prgunidad prun ON tido.uni_tipdocument = prun.uni_ideregistro
                INNER JOIN uspu_usuprgunid uspu ON prun.prun_ideregistr = uspu.prun_ideregistr
                INNER JOIN esem_estempresa esem ON uni.est_ideregistro = esem.est_ideregistro
                INNER JOIN liq_liquidacion liq ON liq.uni_tipdocument = tido.uni_tipdocument
              WHERE
                prun.prg_ideregistro = :idprograma $complemento AND
                uspu.usu_ideregistro = :idusuario AND
                esem.emp_ideregistro = :idempresa AND
                liq.liq_venclasific = 'LI' ";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta los documentos de la tabla temporal según el idtipodocumento
     * @param int $idusuario id del usuario logueado
     * @param int $idTipoDocumento 
     * @return array Información de documentos
     */
    public function getDocumentos($parametros) {
        $complemento = '';
        if (isset($parametros['idsuscripcion'])) {
            $complemento = " AND fac.dsus_ideregistr =:idsuscripcion";
        }
        $sql = "SELECT DISTINCT
                        fac.uni_documento iddocumento,
                        doc.doc_nombre documento
                FROM
                        fac_factura fac
                INNER JOIN doc_documento doc ON fac.uni_documento = doc.uni_documento
                INNER JOIN prun_prgunidad prun ON fac.uni_documento = prun.uni_ideregistro
                INNER JOIN uspu_usuprgunid uspu ON prun.prun_ideregistr = uspu.prun_ideregistr
                INNER JOIN esem_estempresa esem ON doc.est_documento = esem.est_ideregistro
                INNER JOIN liq_liquidacion liq ON liq.uni_documento=fac.uni_documento
                WHERE 
                prun.prg_ideregistro = :idprograma $complemento
                AND uspu.usu_ideregistro = :idusuario
                AND esem.emp_ideregistro = :idempresa
                AND fac.uni_tipdocument = :idtipodocumento
                AND fac.fac_estado='A'
                AND fac.fac_idepadre is null AND liq.liq_venclasific='LI' ";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta las liquidaciones de una empresa
     * @param array $parametros id de la empresa logueada
     * @return array Información de las liquidaciones
     */
    public function getLiquidacion($parametros) {
        $complemento = '';
        if (isset($parametros['idsuscripcion'])) {
            $complemento = " AND fac.dsus_ideregistr =:idsuscripcion ";
        }
        $sql = "    SELECT DISTINCT fac.uni_liquidacion idliquidacion, liq_nombre liquidacion, liq.liq_venclasific tipoliquidacion
                    FROM fac_factura fac 
                      INNER JOIN liq_liquidacion liq ON fac.uni_liquidacion = liq.uni_liquidacion
                      INNER JOIN esem_estempresa esem ON esem.est_ideregistro=liq.est_liquidacion
                      INNER JOIN prun_prgunidad prun ON prun.uni_ideregistro=liq.uni_liquidacion
                      INNER JOIN uspu_usuprgunid uspu ON uspu.prun_ideregistr=prun.prun_ideregistr  
                    WHERE  esem.emp_ideregistro= :idempresa  AND liq.liq_venclasific='LI' 
                           $complemento
                           AND fac.uni_documento =:iddocumento 
                           AND fac.uni_tipdocument = :idtipodocumento
                           AND prun.prg_ideregistro= :idprograma
                           AND uspu.usu_ideregistro= :idusuario ";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta las facturas según unos criterios y son guardados en una tabla temporal
     * y finalmente se consulta toda la información guardada en dicha tabla
     * @param array $parametros - idusuario logueado, idempresa logueada, tipo de nota, 
     * idsuscripcion o idciclo, idtipouso, idmunicipio, idbarrio y cantidad de meses a consultar
     * @return array Información de las facturas de la tabla temporal creada
     * @throws MyException
     */
    public function getFacturas($parametros) {
        $parametros['numeroprocesos'] = NUMERO_HILOS_NOTAS_AUTOMATICAS_CALCULADA;
        $idUsuario = $parametros['idusuario'];
        $complemento = '';
        if (isset($parametros['idmunicipio']) && !empty($parametros['idmunicipio'])) {
            $complemento = " AND dsus.uni_municipio=:idmunicipio ";
        }
        if (isset($parametros['idbarrio']) && !empty($parametros['idbarrio'])) {
            $complemento = "   AND dsus.uni_barrio=:idbarrio ";
        }
        if (isset($parametros['idsuscripcion']) && !empty($parametros['idsuscripcion'])) {
            $complemento = "   AND dsus.dsus_ideregistr=:idsuscripcion ";
        }
        if (isset($parametros['idfactura']) && !empty($parametros['idfactura'])) {
            $complemento = "   AND fac.fac_ideregistro=:idfactura ";
        }



        $sql = "CREATE TABLE temp_calculada_consulta_" . $idUsuario . "_" . $this->idPrograma . " AS( SELECT
                  fac.*,
                  (row_number() OVER () % :numeroprocesos) as idproceso,
                  '-'::character varying estado,
                  '-'::character varying mensaje
                FROM
                  fac_factura fac INNER JOIN dsus_detsuscrip dsus ON fac.dsus_ideregistr=dsus.dsus_ideregistr
                  INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion=fac.uni_liquidacion
                WHERE
                  fac.per_ideregistro=:idperiodo AND liq.liq_venclasific='LI' AND fac.fac_estado ='A'
                  AND liq.uni_liquidacion=dsus.uni_liquidacion
                  AND fac.uni_tipdocument=:idtipodocumento
                  AND fac.uni_documento=:iddocumento AND fac.uni_liquidacion=:idliquidacion
                  AND dsus.cic_ideregistro=:idciclo AND fac.emp_ideregistro=:idempresa $complemento ) ";
        //Consulta todos los registros de la tabla temporal creada
        $this->executeQuery($sql, $parametros);
        $sqlSelect = "  SELECT  fac.fac_ideregistro idfactura,fac.fac_numero numero, 
                        fac.ter_ideregistro idtercero, fac.uni_liquidacion idliquidacion,
                        fac.fac_fecvence fechavencimiento,dsus.dsus_ideregistr idsuscripcion,
                        dsus.dsus_pcodigo codigoanterior,tsu.tsu_nombre tiposuscripcion,
                        fac.cic_ideregistro idciclo,fac.per_ideregistro idperiodo,cic.cic_nombre ciclo,
                        cic.cic_anoactual cicloanio,
                        fac.uni_documento iddocumento, fac.uni_tipdocument idtipodocumento,
                        per.per_nombre periodo, cic.cic_nombre ||' '|| per.per_nombre cicloperiodo,
                        fac.fac_sdoreal saldo, fac.fac_vlrreal valortotal,
                        (fac.fac_vlrreal-fac.fac_sdoreal) valorpagado,fac.fac_version as version
                FROM 
                   temp_calculada_consulta_$idUsuario" . "_" . $this->idPrograma . " fac INNER JOIN  dsus_detsuscrip dsus ON fac.dsus_ideregistr=dsus.dsus_ideregistr
                   INNER JOIN tsu_tipsuscripc tsu on tsu.uni_tipsuscripc=dsus.uni_tipsuscripc
                   INNER JOIN cic_ciclo cic ON fac.cic_ideregistro=cic.cic_ideregistro
                   INNER JOIN per_periodo per ON fac.per_ideregistro=per.per_ideregistro ";
        return $this->executeQuery($sqlSelect);
    }

    public function inicializarFacturas($idUsuario) {
        $sql = " update temp_calculada_consulta_$idUsuario" . "_" . $this->idPrograma . " set estado='-',mensaje='-'";
        $this->executeQuery($sql);
    }

    public function marcarFacturas($facturas, $idUsuario, $estado, $mensaje) {
        $sql = " update temp_calculada_consulta_$idUsuario" . "_" . $this->idPrograma . " set estado='$estado',mensaje='$mensaje' where fac_ideregistro in ($facturas) ";
        $this->executeQuery($sql);
    }

    public function getFacturasProceso($idUsuario, $idProceso) {
        $parametros['idusuario'] = $idUsuario;
        $parametros['idproceso'] = $idProceso;
        $sql = "select * from temp_calculada_consulta_$idUsuario" . "_" . $this->idPrograma . " where idproceso=:idproceso and estado='P' limit 100 ";
        return $this->executeQuery($sql, $parametros);
    }

    public function getFacturasId($idUsuario, $idFactura) {
        $parametros['idusuario'] = $idUsuario;
        $sql = "select * from temp_calculada_consulta_$idUsuario" . "_" . $this->idPrograma . " where fac_ideregistro = $idFactura ";
        $resultado = $this->executeQuery($sql, $parametros);
        if (empty($resultado)) {
            throw new MyException('Error, no se encontró la factura ', -1);
        }
        return $resultado[0];
    }

    public function insertarFacturaTemporal(&$factura, $idUsuario) {
        $factura['fac_version'] = 1;
        $factura['fac_vlrreal'] = 0;
        $factura['fac_sdoreal'] = 0;
        $factura['usu_ideregistro'] = $idUsuario;
        unset($factura['mvi_ideregistro']);
        unset($factura['fin_ideregistro']);
        unset($factura['amo_ideregistro']);
        unset($factura['fac_facvence']);
        unset($factura['fac_numero']);
        unset($factura['fac_ideregistro']);
        unset($factura['idproceso']);
        unset($factura['estado']);
        unset($factura['mensaje']);
        $factura['fac_ideregistro'] = $this->getIdTemporal($idUsuario);
        $this->insertar($factura, "temp_calculada_factura_$idUsuario" . "_" . $this->idPrograma, NULL);
    }

    public function insertarDetalleTemporal($detalle, $idUsuario) {
        $detalleTemp['dfac_vlrunitari'] = $detalle['valortotal'];
        $detalleTemp['fac_ideregistro'] = $detalle['fac_ideregistro'];
        $detalleTemp['dfac_cantidad'] = $detalle['cantidad'];
        $detalleTemp['dfac_vlrreal'] = $detalle['valorreal'];
        $detalleTemp['dfac_vlrtotal'] = $detalle['valortotal'];
        $detalleTemp['dfac_sdoreal'] = $detalle['valorreal'];
        if ($detalle['existe']) {
            $detalleTemp['dfac_idepadre'] = $detalle['iddetallepadre'];
            $detalleTemp['dfac_ideorigen'] = $detalle['iddetallepadre'];
        }
        $detalleTemp['uni_concepto'] = $detalle['idconcepto'];
        $detalleTemp['dfac_version'] = 1;
        $detalleTemp['dfac_estado'] = 'A';
        $detalleTemp['usu_ideregistro'] = $idUsuario;
        $detalleTemp['existe'] = ($detalle['existe']) ? 'S' : 'N';
        unset($detalleTemp['sco_ideregistro']);
        unset($detalleTemp['dfin_ideregistr']);
        unset($detalleTemp['damo_idereigstr']);
        $this->insertar($detalleTemp, "temp_calculada_detalle_$idUsuario" . "_$this->idPrograma", NULL);
    }

    public function getIdTemporal($idUsuario) {
        $sql = "select nextval('sq_temp_calculada_factura_$idUsuario" . "_" . $this->idPrograma . "') id";
        return $this->executeQuery($sql)[0]['id'];
    }

    public function getErroresNotas($idUsuario) {

        $sql = "select fac_ideregistro idfactura,mensaje from temp_calculada_consulta_$idUsuario" . "_" . $this->idPrograma . " where estado = 'F' ";
        return $this->executeQuery($sql);
    }

    public function actualizarNotasFactura($idUsuario) {
        $sql = "UPDATE temp_calculada_factura_$idUsuario" . "_" . $this->idPrograma . "
                SET fac_sdoreal = factura.valor, fac_vlrreal=factura.valor
                FROM (
                       SELECT
                        fac_ideregistro idfactura,
                        SUM (dfac_vlrreal) valor
                       FROM
                        temp_calculada_detalle_$idUsuario" . "_" . $this->idPrograma . " tmpd
                       GROUP BY
                        fac_ideregistro
                      ) AS factura
                WHERE fac_ideregistro=factura.idfactura";
        $this->executeQuery($sql);
    }

    public function getCambiosFactura($idFactura, $idUsuario) {
        $sql = "select *,(COALESCE(saldoconcepto,0)+notadebito+notacredito) saldoconceptofinal from (SELECT DISTINCT
                        con.con_nombre concepto,
                  con.uni_concepto idconcepto,
                  tmpd.dfac_idepadre iddetallefactura,
                  tmpf.fac_ideregistro idfactura,
                  fac.fac_numero numerofactura,
                  dfac.dfac_sdoreal saldoconcepto,
                  dfac.dfac_vlrtotal valorinicial,
                  dfac.dfac_vlrtotal-dfac.dfac_sdoreal valorpagado,
                  COALESCE (
                               (
                                       SELECT
                                               SUM (dfac_vlrreal)
                                       FROM
                                               temp_calculada_detalle_$idUsuario" . "_" . $this->idPrograma . " tpd INNER JOIN temp_calculada_factura_$idUsuario" . "_" . $this->idPrograma . " tpf  ON tpd.fac_ideregistro=tpf.fac_ideregistro
                                       WHERE
                                               tpd.uni_concepto = tmpd.uni_concepto AND tpf.tipo='ND'
                               ),0) notadebito, 
                   COALESCE (
                               (
                                       SELECT
                                               SUM (dfac_vlrreal)
                                       FROM
                                               temp_calculada_detalle_$idUsuario" . "_" . $this->idPrograma . " tpd INNER JOIN temp_calculada_factura_$idUsuario" . "_" . $this->idPrograma . " tpf  ON tpd.fac_ideregistro=tpf.fac_ideregistro
                                       WHERE
                                               tpd.uni_concepto = tmpd.uni_concepto AND tpf.tipo='NC'
                               ),0) notacredito, 
                   COALESCE (
                               (
                                       SELECT
                                               SUM (dfac_vlrreal)
                                       FROM
                                               temp_calculada_detalle_$idUsuario" . "_" . $this->idPrograma . " tpd INNER JOIN temp_calculada_factura_$idUsuario" . "_" . $this->idPrograma . " tpf  ON tpd.fac_ideregistro=tpf.fac_ideregistro
                                       WHERE
                                               tpd.uni_concepto = tmpd.uni_concepto AND tpf.tipo='NS'
                               ),0) notasaldo
               FROM
                       temp_calculada_factura_$idUsuario" . "_" . $this->idPrograma . " tmpf
               INNER JOIN temp_calculada_detalle_$idUsuario" . "_" . $this->idPrograma . " tmpd ON tmpf.fac_ideregistro = tmpd.fac_ideregistro
               INNER JOIN con_concepto con ON con.uni_concepto = tmpd.uni_concepto
               INNER JOIN fac_factura fac ON fac.fac_ideregistro=tmpf.fac_idepadre
               LEFT JOIN  dfac_detfactura dfac ON tmpd.dfac_idepadre=dfac.dfac_ideregistr
               WHERE
                       tmpf.fac_idepadre = $idFactura AND con.con_operacion='S') AS nota";
        return $this->executeQuery($sql);
    }

    public function conceptosInformativos($idFactura, $idUsuario) {
        $sql = "SELECT
                fac.fac_ideregistro idfactura,
                fac.fac_numero numerofactura,
                      con.uni_concepto idconcepto,
                con.con_nombre concepto,
                dfac.dfac_vlrtotal valorinicial,
                tmpd.dfac_vlrtotal valorliquidado
              FROM
                      temp_calculada_detalle_$idUsuario" . "_" . $this->idPrograma . " tmpd INNER JOIN con_concepto con ON tmpd.uni_concepto = con.uni_concepto
                INNER JOIN temp_calculada_factura_$idUsuario" . "_" . $this->idPrograma . " tmpf ON tmpf.fac_ideregistro=tmpd.fac_ideregistro  
                INNER JOIN fac_factura fac ON fac.fac_ideregistro=tmpf.fac_idepadre
                LEFT JOIN dfac_detfactura dfac ON tmpd.dfac_idepadre=dfac.dfac_ideregistr
              WHERE
                con.con_operacion='I' AND tmpf.fac_idepadre=$idFactura
               ORDER BY
                concepto ";

        return $this->executeQuery($sql);
    }

    public function getConceptosOriginales($idUsuario) {
        $sql = "SELECT DISTINCT
                      dfac.dfac_ideregistr iddetallefactura,
                dfac.fac_ideregistro idfactura,
                fac.fac_numero numerofactura,
                con.uni_concepto idconcepto,
                con.con_nombre concepto,
                dfac.dfac_cantidad cantidad,
                dfac.dfac_vlrunitari valorunitario,
                dfac.dfac_vlrtotal valortotal,
                dfac.dfac_vlrreal-dfac.dfac_sdoreal valorpagado,
                dfac.dfac_sdoreal saldo,
                con.con_operacion operacion
              FROM
                      fac_factura fac INNER JOIN (SELECT DISTINCT tmpf.fac_idepadre from temp_calculada_factura_$idUsuario" . "_" . $this->idPrograma . " tmpf ) as tmp ON fac.fac_ideregistro = tmp.fac_idepadre
                INNER JOIN dfac_detfactura dfac ON fac.fac_ideregistro=dfac.fac_ideregistro
                INNER JOIN con_concepto con ON con.uni_concepto=dfac.uni_concepto
              ORDER BY
                idfactura,operacion desc,concepto;
              ";
        return $this->executeQuery($sql);
    }

    public function getConceptosNotas($idUsuario) {
        $sql = "select 
                tmpf.fac_idepadre idfacturainicial,
                tmpd.uni_concepto idconcepto,
                con.con_nombre concepto,
                tmpd.dfac_vlrtotal valor,
                tmpd.dfac_vlrreal valornota,
                (
                       CASE WHEN(con.con_operacion ='I') THEN
                 'Informativo'
                 ELSE
                 'Suma'
                 END
                )tipoconcepto,
                (CASE WHEN(tmpf.tipo='NC') THEN
                 'Nota crédito'
                 WHEN (tmpf.tipo='ND') THEN 
                 'Nota débito'
                ELSE
                 'Nota saldo a Favor' END) tiponota
              FROM 
                 temp_calculada_detalle_$idUsuario" . "_" . $this->idPrograma . " tmpd INNER JOIN temp_calculada_factura_$idUsuario" . "_" . $this->idPrograma . " tmpf ON tmpd.fac_ideregistro=tmpf.fac_ideregistro
                 INNER JOIN con_concepto con ON con.uni_concepto=tmpd.uni_concepto
              ORDER BY idfacturainicial,tiponota,concepto";
        return $this->executeQuery($sql);
    }

    public function getFacturasNota($idUsuario) {
        $sql = "select * from temp_calculada_factura_$idUsuario" . "_" . $this->idPrograma . " where fac_estado='A' limit 500 ";
        return $this->executeQuery($sql);
    }

    public function getDetallesFacturasNota($idUsuario, $idFacturaTemp) {
        $sql = "select * from  temp_calculada_detalle_$idUsuario" . "_" . $this->idPrograma . " where fac_ideregistro=$idFacturaTemp ";
        return $this->executeQuery($sql);
    }

    public function actualizarDetallesNuevaFactura($idUsuario, $idFacturaTemp) {
        $tabla = "temp_calculada_detalle_$idUsuario" . "_" . $this->idPrograma;
        $data['fac_ideregistro'] = $idFacturaTemp;
        $data['existe'] = 'N';
        $this->actualizar($data, $tabla, 'fac_ideregistro=:fac_ideregistro');
    }

    public function validacionDetallesFacturasNota($idUsuario, $idFacturaTemp) {
        $sql = "select count(*) cantidad from  temp_calculada_detalle_$idUsuario" . "_" . $this->idPrograma . "  
                where fac_ideregistro=$idFacturaTemp 
                      AND dfac_vlrtotal <> 0 AND existe <> 'N' ";
        return $this->executeQuery($sql)[0]['cantidad'];
    }

    public function insertarNota(array $infoFacturaTemporal, array $parametros) {
        $data['not_fecha'] = "now()";
        $data['cic_ano'] = $infoFacturaTemporal['cic_ano'];
        $data['not_comentario'] = $parametros['comentario'];
        $data['uni_motnota'] = $parametros['idmotivo'];
        $data['dsus_ideregistr'] = $infoFacturaTemporal['dsus_ideregistr'];
        $data['cic_ideregistro'] = $infoFacturaTemporal['cic_ideregistro'];
        $data['per_ideregistro'] = $infoFacturaTemporal['per_ideregistro'];
        $data['emp_ideregistro'] = $infoFacturaTemporal['emp_ideregistro'];
        $data['usu_ideregistro'] = $infoFacturaTemporal['usu_ideregistro'];
        $data['est_motnota'] = ESTRUCTURA_NOTA;
        return $this->insertar($data, 'not_nota', 'sq_not_ideregistro');
    }

    public function insertarFacturaNota($factura) {
        unset($factura['tipo']);
        unset($factura['fac_ideregistro']);
        $factura['fac_fecha'] = 'now()';
        $factura['fac_fecaprobada'] = 'now()';
        $idFactura = $this->insertar($factura, 'fac_factura', 'sq_fac_ideregistro');
        $factura['fac_ideregistro'] = $idFactura;
        return $factura;
    }

    public function insertarDetalleFacturaNota($detalleFactura) {
        unset($detalleFactura['existe']);
        unset($detalleFactura['dfac_ideregistr']);
        unset($detalleFactura['sco_ideregistro']);
        return $this->insertar($detalleFactura, 'dfac_detfactura', 'sq_dfac_ideregistr');
    }

    public function insertarDetallePadre($detalleTemp) {
        $detalle['fac_ideregistro'] = $detalleTemp['fac_ideregistro'];
        $detalle['dfac_version'] = 1;
        $detalle['dfac_estado'] = 'A';
        $detalle['dfac_cantidad'] = 1;
        $detalle['dfac_vlrunitari'] = 0;
        $detalle['dfac_vlrtotal'] = 0;
        $detalle['dfac_vlrreal'] = 0;
        $detalle['dfac_sdoreal'] = 0;
        $detalle['usu_ideregistro'] = $detalleTemp['usu_ideregistro'];
        $detalle['uni_concepto'] = $detalleTemp['uni_concepto'];
        return $this->insertarDetalleFacturaNota($detalle);
    }

    public function crearRecaudo(array $infoRecaudo) {
        $recaudo['rec_fecha'] = "now()";
        $recaudo['rec_estado'] = 'G';
        $recaudo['rec_vlrcambio'] = 0;
        $recaudo['rec_vlrajuste'] = 0;
        $recaudo['uni_medpago'] = 0;
        $recaudo['cnre_ideregistr'] = 0;
        $recaudo['csg_ideregistro'] = 0;
        $recaudo['rec_fecpago'] = "now()";
        $recaudo['rec_vlrpagado'] = $infoRecaudo['valorpagado'];
        $recaudo['rec_vlrreal'] = $infoRecaudo['valorpagado'];
        $recaudo['emp_ideregistro'] = $infoRecaudo['idempresa'];
        $recaudo['sus_ideregistro'] = $infoRecaudo['idsuscriptor'];
        $recaudo['ter_ideregistro'] = $infoRecaudo['idtercero'];
        $recaudo['uni_documento'] = $infoRecaudo['iddocumento'];
        $recaudo['uni_municipio'] = $infoRecaudo['idsucursal'];
        $recaudo['usu_ideregistro'] = $infoRecaudo['idusuario'];
        return $this->insertar($recaudo, 'rec_recaudo', 'sq_rec_ideregistro');
    }

    public function marcarFacturaTemp($idFacturaTemp, $idUsuario) {
        $parametros['fac_ideregistro'] = $idFacturaTemp;
        $parametros['fac_estado'] = 'L';
        $this->actualizar($parametros, "temp_calculada_factura_$idUsuario" . "_" . $this->idPrograma, 'fac_ideregistro=:fac_ideregistro');
    }

    public function inicializarFacturasNotasTemp($idUsuario) {
        $parametros['fac_estado'] = 'A';
        $this->actualizar($parametros, "temp_calculada_factura_$idUsuario" . "_" . $this->idPrograma . "", '1=1');
    }

    public function getFacturaOriginal($idFacturaOriginal, $idUsuario) {
        $sql = "select * from temp_calculada_consulta_" . $idUsuario . "_" . $this->idPrograma . "  where fac_ideregistro=$idFacturaOriginal ";
        $resultado = $this->executeQuery($sql);
        if (empty($resultado)) {
            throw new MyException('Error al consultar la factura ', -1);
        }
        return $resultado[0];
    }

    public function actualizarFacturaConsultaTemp($parametros, $idUsuario) {
        $parametros['fac_version'] = $parametros['fac_version'];
        $parametros['fac_ideregistro'] = $parametros['fac_ideregistro'];
        $this->actualizar($parametros, "temp_calculada_consulta_" . $idUsuario . "_" . $this->idPrograma, 'fac_ideregistro = :fac_ideregistro');
    }

    public function conceptosAfectados($idsConceptos, $idLiquidacion) {
        $sql = "SELECT
                    DISTINCT
                    core.uni_concepto idconcepto
                FROM
                    coli_conliquida coli INNER JOIN core_conrelacio core ON coli.uni_concepto = core.uni_conrelacion
                    INNER JOIN coli_conliquida col ON col.uni_concepto=core.uni_concepto
                WHERE
                    coli.uni_concepto IN ($idsConceptos) AND coli.uni_liquidacion=$idLiquidacion AND col.uni_liquidacion=coli.uni_liquidacion";
        return $this->executeQuery($sql);
    }

    public function conceptosIniciales($idsConceptos) {
        $sql = "SELECT  DISTINCT  uni_concepto idconcepto FROM con_concepto WHERE uni_concepto IN ($idsConceptos)";
        return $this->executeQuery($sql);
    }

    public function infoDocumento($idDocumento) {
        $sql = "SELECT  * FROM doc_documento WHERE uni_documento= $idDocumento";
        return $this->executeQuery($sql)[0];
    }

    public function validarInformacionDetalleTemporal($idUsuario) {
        $tablaConsulta = "temp_calculada_consulta_$idUsuario" . "_" . $this->idPrograma;
        $tablaFactura = "temp_calculada_factura_$idUsuario" . "_" . $this->idPrograma;
        $tablaDetalle = "temp_calculada_detalle_$idUsuario" . "_" . $this->idPrograma;
        $sql = "select count(*) cantidad from pg_tables where tablename IN('$tablaFactura','$tablaDetalle','$tablaConsulta')";
        $cantidad = $this->executeQuery($sql)[0]['cantidad'];
        if ($cantidad > 0) {
            throw new MyException('Error, Hay trabajo pendiente por terminar, '
            . 'verifique que no tenga abierto el programa en otra pestaña y/o equipo,'
            . ' si está seguro que no tiene trabajo pendiente, presione el botón de cancelar, éste eliminará las notas en trámite', -1);
        }
    }

    public function insertarNuevaFactura($infoFacturaInicial) {
        $infoFacturaInicial['fac_ideorigen'] = $infoFacturaInicial['fac_ideregistro'];
        $infoFacturaInicial['fac_fecha'] = 'now()';
        $infoFacturaInicial['mvi_ideregistro'] = 0;
        unset($infoFacturaInicial['fac_numero']);
        unset($infoFacturaInicial['fac_ideregistro']);
        unset($infoFacturaInicial['fac_idepadre']);
        unset($infoFacturaInicial['idproceso']);
        unset($infoFacturaInicial['estado']);
        unset($infoFacturaInicial['mensaje']);
        return $this->insertar($infoFacturaInicial, 'fac_factura', 'sq_fac_ideregistro');
    }

}
