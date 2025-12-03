<?php

namespace Llanogas\LlanogasBundle\Models;

use Llanogas\LlanogasBundle\AuditoriaServices;
use Llanogas\LlanogasBundle\MyException;

/**
 * Clase encargada de administrar los datos de las financiaciones
 *
 * @author hrey
 */
class ConsultarFinanciacionModel extends AuditoriaServices {

    /**
     * Constructor de la clase
     * @param \Doctrine\DBAL\Connection $conexion
     */
    public function __construct(&$conexion = null) {
        $this->setConexion($conexion);
    }

    /**
     *  Consulta una financiación.
     * @param array  $parametros fecha inicio, fecha fin, idsuscripcion, codigoanterior, idfinanciación.
     * @return array Listado de las financiaciones de acuerdo a parámetros.
     */
    public function consultarFinanciacion($parametros) {
        $complemento = '';
        if (!empty($parametros['idfinanciacion'])) {
            $complemento = 'and fin.fin_ideregistro = :idfinanciacion';
        }

        if (!empty($parametros['idsuscripcion']) || !empty($parametros['codigoanterior'])) {

            $complemento = !empty($parametros['idsuscripcion']) ? ' and dsus.dsus_ideregistr=:idsuscripcion' : ' and dsus.dsus_pcodigo=:codigoanterior';
            if (!empty($parametros['fechainicio']) && !empty($parametros['fechafin'])) {
                $complemento .= ' and fin.fin_fecha::date between :fechainicio::date and :fechafin::date ';
            }
        }
        if ($complemento == '') {
            throw new MyException('No se encontraron parámetros de búsqueda', -1);
        }
        $sql = "  SELECT DISTINCT
                        dsus.pro_catestrato estrato,
                        dsus.dsus_ideregistr idsuscripcion,
                        dsus.dsus_pcodigo codigoanterior,
                        dsus.sus_ideregistro idsuscriptor,
                        fin.fin_ideregistro idfinanciacion,
                        fin_fecha fecha,
                        fin_estado estado,
                        fin_sdocapital saldocapital,
                        fin_inicapital capitalinicial,
                        fin.emp_ideregistro idempresa,
                        ter_idesolicita idsolicita,
                        ter_ideentfinan idbanco,
                        cic.cic_nombre ciclo,
                        per.per_nombre periodo,
                        cic.cic_ideregistro idciclo,
                        per.per_ideregistro idperiodo,
                        bar.barrio_nom barrio,
                        pro.uni_barrio idbarrio,
                        pry.proyecto_nom municipio,
                        pro.uni_municipio idmunicipio,
                        pro.pro_direccion direccion,
                        ter.ter_correo correo,
                        ter.ter_telfijo telefonofijo,
                        ter.ter_documento documentosolicita,
                        ter.ter_telcelular telefonocelular,
                        ter.ter_nomcompleto nombresolicita,
                        terf.ter_nombre nombrebanco,
                        ters.ter_nombre suscriptor,
                        ters.uni_tiptercero idtipotercero,
                        unitipter.uni_nombre2 tipotercero,
                        unitipter.uni_codigo1 codtipotercero,
                        ters.ter_documento documentosuscriptor,
                        amfi.amfi_numcuotas numerocuotas,
                        amfi.amfi_cuoamortiz cuotasamortizadas,
                        liq.liq_nombre liquidacion,
			liq.uni_liquidacion idliquidacion,
                        unit.uni_nombre1 tipodocumento,
                        unit.uni_ideregistro idtipodocumento,
                        uni.uni_nombre1 documento,
                        uni_par.uni_nombre1 parentesco
                        
                FROM
                        fin_financiacio fin
                INNER JOIN ter_tercero ter ON fin.ter_idesolicita = ter.ter_ideregistro
                INNER JOIN ter_tercero terf ON fin.ter_ideentfinan = terf.ter_ideregistro
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = fin.cic_ideregistro
                INNER JOIN per_periodo per ON per.per_ideregistro = fin.per_ideregistro
                INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr = fin.dsus_ideregistr
                INNER JOIN ter_tercero ters ON dsus.ter_ideregistro = ters.ter_ideregistro
                INNER JOIN uni_unidad unitipter ON unitipter.uni_ideregistro = ters.uni_tiptercero
                INNER JOIN pro_propiedad pro ON pro.pro_ideregistro = dsus.pro_ideregistro
                INNER JOIN proyectos pry ON pry.proyecto_ideregistro = pro.uni_municipio
                INNER JOIN barrios bar ON bar.barrio_ideregistro = pro.uni_barrio
                INNER JOIN amfi_amofinanci amfi ON amfi.fin_ideregistro = fin.fin_ideregistro
                INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion = amfi.uni_liquidacion
                INNER JOIN uni_unidad uni ON uni.uni_ideregistro = amfi.uni_documento
                INNER JOIN uni_unidad unit ON unit.uni_ideregistro = amfi.uni_tipdocument
		INNER JOIN uni_unidad uni_par ON fin.uni_parentesco = uni_par.uni_ideregistro
              

                WHERE
                    amfi.amfi_estado  in  ('A','C') AND fin.emp_ideregistro =:idempresa   $complemento 
                ORDER BY
                   fin.fin_ideregistro ";

        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Obtiene la información de una financiación por el identificador.
     * @param int $idFinanciacion identificador de la financiación.
     * @return array con el detalle de la financiación. 
     */
    public function consultarFacturasPorIdFinanciacion($idFinanciacion) {
        $parametros['idfinanciacion'] = $idFinanciacion;
        $sql = "SELECT DISTINCT
                        fac.fac_ideregistro idfactura,
                        fac.fac_numero numerofactura,
                        fac.fac_fecha :: DATE fecha,
                        cic.cic_nombre ciclo,
                        per.per_nombre periodo,
                        fac.fac_estado estado,
                        (
                                SELECT
                                        SUM (dfa.dfac_vlrtotal)
                                FROM
                                        dfac_detfactura dfa
                                INNER JOIN con_concepto con ON dfa.uni_concepto = con.uni_concepto
                                WHERE
                                        con.con_operacion = 'S'
                                AND dfa.fac_ideregistro = fac.fac_ideregistro
                        ) valortotal,
                        (
                                SELECT
                                        SUM (dfi.dfin_vlrreal)
                                FROM
                                        dfin_detfinanci dfi
                                WHERE
                                        dfi.fac_ideregistro = fac.fac_ideregistro AND dfi.fin_ideregistro=fin.fin_ideregistro
                        ) valorfinanciado
                FROM
                        fin_financiacio fin
                INNER JOIN dfin_detfinanci dfin ON fin.fin_ideregistro = dfin.fin_ideregistro
                INNER JOIN fac_factura fac ON dfin.fac_ideregistro = fac.fac_ideregistro
                INNER JOIN cic_ciclo cic ON fac.cic_ideregistro = cic.cic_ideregistro
                INNER JOIN per_periodo per ON fac.per_ideregistro = per.per_ideregistro
                WHERE
                        fin.fin_ideregistro =:idfinanciacion
                AND fin.fin_ideorigen IS NULL
                AND fin.fin_idepadre IS NULL;";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Obtiene el listado de los conceptos asociados a una factura.
     * @param int $idFactura identificador de la factura.
     * @return array con el listado de los conceptos.
     */
    public function consultarDetalleFactura($idFactura) {
        $parametros['idfactura'] = $idFactura;
        $sql = "select 
                   con.uni_concepto idconcepto, 
                   con.con_nombre nombreconcepto,
                   dfac.dfac_vlrtotal valor
                from
                   dfac_detfactura dfac inner join con_concepto con on con.uni_concepto=dfac.uni_concepto
                where
                   dfac.fac_ideregistro=:idfactura and con.con_operacion = 'S' and dfac.dfac_vlrtotal > 0";
        return $this->executeQuery($sql, $parametros);
    }

    public function consultarInformacionFinanciera($idfinanciacion) {
        $parametros['idfinanciacion'] = $idfinanciacion;
        $sql = 'SELECT
                        fiif.uni_tipsociedad idtiposociedad,
                        unisoc.uni_nombre1 tiposociedad,
                        fiif.uni_actsuscripc idactividadeconomica,
                        uniact.uni_nombre1 actividadeconomica,
                        fiif.fiif_nomempresa nombreempresalaboral,
                        fiif.fiif_fecingreso fechaingreso,
                        fiif.fiif_canexperiencia cantidadexperiencia,
                        fiif.uni_tipcargo idtipocargo,
                        unicargo.uni_nombre1 cargolaboral,
                        fiif.fiif_ingsalario salariofijo,
                        fiif.fiif_ingvarsalario salariovariable,
                        fiif.fiif_ingarriendo ingresoarriendo,
                        fiif.fiif_ingventa ingresoventa,
                        fiif.fiif_desingotro otroingreso,
                        fiif.fiif_ingotro valorotroingreso,
                        fiif.fiif_egrfamilia gastofamiliar,
                        fiif.fiif_egrarriendo gastoarriendo,
                        fiif.fiif_egrfinancie gastofinanciero,
                        fiif.fiif_egrcompra gastocompra,
                        fiif.fiif_desegreotros otrogasto,
                        fiif.fiif_egrotro valorotrogasto,
                        fiif.fiif_disefectivo efectivo,
                        fiif.fiif_disactivo activocorriente,
                        fiif.fiif_disvehiculo vehiculo,
                        fiif.fiif_dispropiedad propiedad
                FROM
                        fiif_fininfinancie fiif
                LEFT JOIN uni_unidad unisoc ON fiif.uni_tipsociedad = unisoc.uni_ideregistro
                LEFT JOIN uni_unidad uniact ON fiif.uni_actsuscripc = uniact.uni_ideregistro
                LEFT JOIN uni_unidad unicargo ON fiif.uni_tipcargo = unicargo.uni_ideregistro
                WHERE
                        fiif.fin_ideregistro =:idfinanciacion;';
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta todas las amoritaziones por una financiación.
     * @param type $idFinanciacion
     * @return type
     */
    public function consultarDetalleAmortizacion($idamortizacion) {
        $parametros['idamortizacion'] = $idamortizacion;
        $sql = "SELECT
                        doc.doc_nombre documento,
                        tido.tido_nombre tipodocumento,
                        liq.liq_nombre liquidacion,
                        cic.cic_nombre ciclo,
                        per.per_nombre periodo,
                        con.con_nombre concepto,
                        fac.fac_ideregistro,
                        fac.fac_numero,
                        dfac.dfac_vlrreal valorreal
                FROM
                        fac_factura fac
                INNER JOIN dfac_detfactura dfac ON fac.fac_ideregistro = dfac.fac_ideregistro
                INNER JOIN doc_documento doc ON fac.uni_documento = doc.uni_documento
                INNER JOIN tido_tipdocumen tido ON tido.uni_tipdocument = fac.uni_tipdocument
                INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion = fac.uni_liquidacion
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = fac.cic_ideregistro
                INNER JOIN per_periodo per ON per.per_ideregistro = fac.per_ideregistro
                INNER JOIN con_concepto con ON con.uni_concepto = dfac.uni_concepto
                INNER JOIN amfi_amofinanci amfi ON amfi.fin_ideregistro = fac.fin_ideregistro
                WHERE
                        fac.fac_vlrreal > 0
                AND amfi.amfi_estado = 'A'
                AND (
                        fac.amo_ideregistro = :idamortizacion
                        OR (
                                fac.fac_ideregistro = :idamortizacion
                                AND fac.amo_ideregistro IS NULL
                        )
                )";
        return $this->executeQuery($sql, $parametros);
    }

    /**
     * Consulta todas las amoritaziones por una financiación.
     * @param type $idFinanciacion
     * @return type
     */
    public function consultarAmortizacionesPorFinanciacion($idFinanciacion) {
        $sql = "SELECT * FROM (SELECT
                  fac.fac_fecha fecha,
                  0 cuotasamortizadas,
                  fac.fac_ideregistro idamortizacion,
                  doc.doc_nombre documento,
                  tido.tido_nombre tipodocumento,
                  liq.liq_nombre liquidacion,
                  cic.cic_nombre ciclo,
                  per.per_nombre periodo
                FROM
                  fac_factura fac INNER JOIN tido_tipdocumen tido ON fac.uni_tipdocument = tido.uni_tipdocument
                  INNER JOIN liq_liquidacion liq ON fac.uni_liquidacion=liq.uni_liquidacion
                  INNER JOIN cic_ciclo cic ON cic.cic_ideregistro=fac.cic_ideregistro
                  INNER JOIN per_periodo per ON per.per_ideregistro=fac.per_ideregistro 
                  INNER JOIN doc_documento doc ON doc.uni_documento=fac.uni_documento
                WHERE
                  fac.fin_ideregistro=$idFinanciacion AND fac.amo_ideregistro IS NULL 
                UNION
                SELECT
                        amo.amo_fecha fecha,
                        amo.amo_cuoamortiz cuotasamortizadas,
                        amo.amo_ideregistro idamortizacion,
                        doc.doc_nombre documento,
                        tido.tido_nombre tipodocumento,
                        liq.liq_nombre liquidacion,
                        cic.cic_nombre ciclo,
                        per.per_nombre periodo
                FROM
                        amo_amortizacio amo
                INNER JOIN doc_documento doc ON doc.uni_documento = amo.uni_documento
                INNER JOIN tido_tipdocumen tido ON tido.uni_tipdocument = amo.uni_tipdocument
                INNER JOIN liq_liquidacion liq ON liq.uni_liquidacion = amo.uni_liquidacion
                INNER JOIN cic_ciclo cic ON cic.cic_ideregistro = amo.cic_ideregistro
                INNER JOIN per_periodo per ON per.per_ideregistro = amo.per_ideregistro
                WHERE
                        amo.fin_ideregistro = $idFinanciacion) as info
                ORDER BY fecha                ";
        $respuesta = $this->executeQuery($sql);
        return $respuesta;
    }

    /**
     * Consulta toas las facturas asociadas a una amortización.
     * @param int $idAmortizacion identificador de  la amortización
     * @return array Listado de las facturas
     */
    public function consultarFacturasPorAmortizacion($idAmortizacion) {
        $parametros['idamortizacion'] = $idAmortizacion;
        $sql = " select 
           fac.fac_ideregistro idfactura,fac.fac_numero numero,
           fac.fac_fecha fecha,per.per_nombre periodo,
           cic.cic_ideregistro idciclo,cic.cic_nombre ciclo,
           per.per_ideregistro idperiodo,
           (
	     select coalesce(sum(dfac_vlrreal),0) from dfac_detfactura where fac_ideregistro=fac.fac_ideregistro
           ) valorfactura   
         from 
           fac_factura fac inner join cic_ciclo cic on fac.cic_ideregistro=cic.cic_ideregistro
           inner join per_periodo per on per.per_ideregistro=fac.per_ideregistro
         where
           fac.amo_ideregistro=:idamortizacion and fac.fac_idepadre is null";
        $resultado = $this->executeQuery($sql, $parametros);
        $listaFacturas = array();
        foreach ($resultado as $factura) {
            $factura['detalleFactura'] = $this->consultarDetallesFacturasAmortizacion($factura['idfactura']);
            $listaFacturas[] = $factura;
        }
        return $listaFacturas;
    }

    /**
     * Consulta toas las facturas asociadas a una amortización.
     * @param int $idAmortizacion identificador de  la amortización
     * @return array Listado de las facturas
     */
    public function consultarAdjuntoPorFinanciacion($idFinanciacion) {
        $parametros['idfinanciacion'] = $idFinanciacion;
        $sql = " select adfi_ruta ruta,adfi_nomarchivo nombre  from adfi_adjfinanciacio where fin_ideregistro =:idfinanciacion";
        $resultado = $this->executeQuery($sql, $parametros);
        return $resultado;
    }

    /**
     * Consulta los detalles de una factura por el identificador
     * @param int $idFactura identificador de la factura
     * @return array Detalles de la factura 
     */
    public function consultarDetallesFacturasAmortizacion($idFactura) {
        $parametros['idfactura'] = $idFactura;
        $sql = "select 
                dfac.uni_concepto idconcepto, con.con_nombre nombreconcepto,
                dfac.dfac_vlrreal valorconcepto
             from 
               dfac_detfactura  dfac inner join con_concepto con on dfac.uni_concepto=con.uni_concepto
             where
               dfac.fac_ideregistro= :idfactura and dfac.dfac_idepadre is null";
        return $this->executeQuery($sql, $parametros);
    }

}
