package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.ConConsolidacionAprovechamiento;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import com.bioagricola.apirest.modelo.projections.ConConsolidacionAproGirosProjection;
import com.bioagricola.apirest.modelo.projections.ConConsolidacionAprovechamientoProjection;
import com.bioagricola.apirest.modelo.projections.DetPeriodoAproGirosProjection;
import com.bioagricola.apirest.modelo.projections.DetailConsolidacionAprovechamientoProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * @author nagredo
 * @project dev_back_facturacionynotas
 * @class ManejadorConConsolidacionAprovechamiento
 */
@Service
public interface ManejadorConConsolidacionAprovechamiento extends ManejadorCrud<ConConsolidacionAprovechamiento, Integer>,
        IManejadorCrud<ConConsolidacionAprovechamiento, Integer> {
    @Query(value = "select cc.* " +
            "from aseo.con_consolidacionaprovechamiento cc " +
            "where cc.fecha_corte between :periodoliqInicial and :periodoliqFinal " +
            "and cc.ter_ideregistro = :idTercero and cc.emp_ideregistro = :idempresa ", nativeQuery = true)
    List<ConConsolidacionAprovechamiento> getAllByIdTerceroAndDates(@Param("idempresa") Integer idempresa,
                                                                    @Param("idTercero") Long idTercero,
                                                                    @Param("periodoliqInicial") Date periodoliqInicial,
                                                                    @Param("periodoliqFinal") Date periodoliqFinal);

    @Query(value = "select cc.* " +
            "from aseo.con_consolidacionaprovechamiento cc " +
            "where cc.fecha_corte between :periodoliqInicial and :periodoliqFinal " +
            "and cc.ter_ideregistro = :idTercero and cc.emp_ideregistro = :idempresa and cc.per_fecinicial <= :periodo and cc.incentivo = :incentivo ", nativeQuery = true)
    List<ConConsolidacionAprovechamiento> getAllByIdTerceroAndPeriodo(@Param("idempresa") Integer idempresa,
                                                                      @Param("idTercero") Long idTercero,
                                                                      @Param("periodo") Date periodo,
                                                                      @Param("periodoliqInicial") Date periodoliqInicial,
                                                                      @Param("periodoliqFinal") Date periodoliqFinal,
                                                                      @Param("incentivo") Long incentivo);

    @Query(value = "select cc.*" +
            "from aseo.con_consolidacionaprovechamiento cc " +
            "where cc.ter_ideregistro = :tercero and cc.fecha_corte between :fecha_inicio and :fecha_fin and cc.incentivo = :incentivo ", nativeQuery = true)
    List<ConConsolidacionAprovechamiento> getByTerIderegistroAndFechaCorte(@Param("tercero") Long tercero,
                                                                           @Param("fecha_inicio") Date fechaInicio,
                                                                           @Param("fecha_fin") Date fechaFin,
                                                                           @Param("incentivo") Long incentivo);

    @Query(value = "select cc.*" +
            "from aseo.con_consolidacionaprovechamiento cc " +
            "where cc.ter_ideregistro = :tercero ", nativeQuery = true)
    ConConsolidacionAprovechamiento getByTerIderegistro(@Param("tercero") Long tercero);

    @Query(value = "select cc.* from aseo.con_consolidacionaprovechamiento cc " +
            "where cc.emp_ideregistro = :ideEmpresa and cc.incentivo = :incentivo and cc.estado = :estado", nativeQuery = true)
    List<ConConsolidacionAprovechamiento> getByIdeEmpresa(@Param("ideEmpresa") Integer ideEmpresa,
                                                          @Param("incentivo") Integer incentivo,
                                                          @Param("estado") String estado);

    @Query(value = "select cc.* from aseo.con_consolidacionaprovechamiento cc " +
            "where cc.aforado = :aforado and cc.ter_ideregistro = :tercero and cc.fecha_corte between :fecha_inicio and :fecha_fin " +
            " and cc.incentivo = :incentivo and cc.estado = 'ACTIVO' ", nativeQuery = true)
    List<ConConsolidacionAprovechamiento> getCruceReucaudoByAforado(@Param("aforado") Integer aforado,
                                                                    @Param("tercero") Integer tercero,
                                                                    @Param("incentivo") Integer incentivo,
                                                                    @Param("fecha_inicio") Date fechaInicio,
                                                                    @Param("fecha_fin") Date fechaFin);

    @Query(value = "select cc.* from aseo.con_consolidacionaprovechamiento cc " +
            "where cc.con_exportar_seven = 0 and cc.con_oficio_pago = 0 and cc.estado = 'ACTIVO' " +
            "and cc.ter_ideregistro = :tercero and cc.fecha_corte between :fecha_inicio and :fecha_fin and cc.per_fecinicial <= :periodo and cc.incentivo = :incentivo ", nativeQuery = true)
    List<ConConsolidacionAprovechamiento> obtenerListadoConsolidacionPorTerceroAndPeriodo(@Param("fecha_inicio") Date fechaInicio,
                                                                                          @Param("fecha_fin") Date fechaFin,
                                                                                          @Param("periodo") Date periodo,
                                                                                          @Param("tercero") Long tercero,
                                                                                          @Param("incentivo") Long incentivo);

    @Query(value = "select dfac.fac_ideregistro, dfac.uni_concepto, dfac.dfac_ideregistr " +
            "from aseo.con_consolidacionaprovechamiento cc " +
            "inner join fac_factura ff  on (ff.fac_ideregistro = cc.fac_ideregistro) " +
            "inner join dfac_detfactura dfac on (dfac.fac_ideregistro = ff.fac_ideregistro) " +
            "inner join fac_factura parent ON (ff.fac_idepadre = parent.fac_ideregistro OR ff.fac_ideorigen = parent.fac_ideregistro) " +
            "where cc.ter_ideregistro = :tercero and cc.fecha_corte between :fecha_inicio and :fecha_fin " +
            "and cc.incentivo = :incentivo and cc.estado = 'ACTIVO' " +
            "and parent.fac_estado = 'C' and cc.emp_ideregistro = :idempresa " +
            "and (cc.drec_ideregistro is null or cc.drec_ideregistro = 0) and ff.emp_ideregistro = :idempresa ", nativeQuery = true)
    List<Object[]> getAllByPunishedInvoicesAndPeriod(@Param("fecha_inicio") Date fechaInicio,
                                                     @Param("idempresa") Integer idempresa,
                                                     @Param("fecha_fin") Date fechaFin,
                                                     @Param("tercero") Long tercero,
                                                     @Param("incentivo") Long incentivo);

    @Query(value = "select \n" +
            "	periodoprestacion as periodo_prestacion, \n" +
            "	perodofacturacion as periodo_facturacion, \n" +
            "	terideregistro, \n" +
            "	ternomcompleto, \n" +
            "	castigosaldota as castigo_saldo_ta, \n" +
            "	castigosaldocc as castigo_saldo_cc, \n" +
            "	castigosaldotadinc as castigo_saldo_ta_dinc, \n" +
            "	castigossaldoajusteta as castigo_saldo_ajuste_ta, \n" +
            "	castigossaldoajustetadinc as castigo_saldo_ajuste_ta_dinc, \n" +
            "	castigotaaforado_valor as castigo_ta_aforado_valor, \n" +
            "	castigoccfin_valor as castigo_cc_fin_valor, \n" +
            "	castigotafin_valor as castigo_ta_fin_valor, \n" +
            "	castigotamora_valor as castigo_ta_mora_valor, \n" +
            "	castigotaintcorriente_valor as castigo_ta_intcorriente_valor, \n" +
            "	castigosaldoiat as castigo_saldo_iat, \n" +
            "	castigosaldoajusteiat as castigo_saldo_ajuste_iat, \n" +
            "	castigoccajuste_valor as castigo_saldo_ajuste_cc, \n" +
            "	cantidadfcr as cantidad_fcr, \n" +
            "	fechaultimocastigo as fecha_ultimo_castigo \n" +
            "from aseo.fn_apro_reporteresumen_castigo(:idempresa,cast(:fechainicio as timestamp),cast(:fechafin as timestamp),:estado,0,:terceros); ", nativeQuery = true)
    List<ConConsolidacionAprovechamientoProjection> getAllByPunishedAndIdTerceroAndDates(@Param("terceros") String terceros,
                                                                                         @Param("idempresa") Integer idempresa,
                                                                                         @Param("fechainicio") Date fechainicio,
                                                                                         @Param("fechafin") Date fechafin,
                                                                                         @Param("estado") String estado);

    @Query(value = "select idfactura,ff.fac_numero,fechaexpedicion,fechacastigo,t_edadcartera," +
            "MAX(porcentajeparticipacion) porcentaje_participacion," +
            "max(t_porcentaje_cc) t_porcentaje_cc," +
            "sum(t_valoracastigar_cc) t_valoracastigar_cc," +
            "max(t_porcentaje_ta) t_porcentaje_ta," +
            "sum(t_valorcastigar_ta) t_valorcastigar_ta," +
            "max(t_porcentaje_iat) t_porcentaje_iat," +
            "sum(t_valorcastigar_iat) t_valorcastigar_iat," +
            "max(t_porcentajeajuste_cc) t_porcentajeajuste_cc," +
            "sum(t_valoracastigar_ajustecc) t_valoracastigar_ajustecc," +
            "max(t_porcentajeajuste_ta) t_porcentajeajuste_ta," +
            "sum(t_valoracastigar_ajusteta) t_valoracastigar_ajusteta, " +
            "max(t_porcentajeajuste_iat) t_porcentajeajuste_iat," +
            "sum(t_valoracastigar_ajusteiat) t_valoracastigar_ajusteiat " +
            "from aseo.fn_apro_reporteresumendeetalle_castigo(:idempresa,cast(:fechainicio as timestamp),cast(:fechafin as timestamp),:estado,0,:idTercero) " +
            "inner join public.fac_factura ff on ff.fac_ideregistro = idfactura " +
            "group by idfactura,ff.fac_numero,fechaexpedicion,fechacastigo,t_edadcartera", nativeQuery = true)
    List<DetailConsolidacionAprovechamientoProjection> getNumbersFac(@Param("idTercero") Long idTercero,
                                                                     @Param("idempresa") Integer idempresa,
                                                                     @Param("fechainicio") Date fechainicio,
                                                                     @Param("fechafin") Date fechafin,
                                                                     @Param("estado") String estado);

    @Query(value = "select coalesce(sum(cc_valor),0) \n" +
            "from aseo.aprconc_conciliacion aprcon \n" +
            "where aprcon.aprcon_exportadoseven is true \n" +
            "	AND aprcon.aprconc_fechacorte BETWEEN :fecha_inicio AND :fecha_fin \n" +
            "    AND aprcon.aprcon_estado = 'A' AND emp_ideregistro = :idempresa ", nativeQuery = true)
    Optional<BigDecimal> getAllCollectionUseMarketing(@Param("idempresa") Integer idempresa,
                                                      @Param("fecha_inicio") Date fechaInicio,
                                                      @Param("fecha_fin") Date fechaFin);


    @Query(value = "select coalesce(sum(aprcon.cc_valor + aprcon.ta_valor),0) \n" +
            "from aseo.aprconc_conciliacion aprcon \n" +
            "where aprcon.aprcon_exportadoseven is true \n" +
            "	and aprcon.aprconc_fechacorte BETWEEN :fecha_inicio AND :fecha_fin\n" +
            "    and aprcon.aprcon_estado = 'A'\n" +
            "    and emp_ideregistro = :idempresa", nativeQuery = true)
    Optional<BigDecimal> getAllUseVbaBudget(@Param("idempresa") Integer idempresa,
                                            @Param("fecha_inicio") Date fechaInicio,
                                            @Param("fecha_fin") Date fechaFin);

    @Query(value = "select coalesce(sum(iat_valor),0) \n" +
            "from aseo.aprconc_conciliacion aprcon\n" +
            "where aprcon.aprcon_exportadoseven is true \n" +
            "	and aprcon.aprconc_fechacorte BETWEEN :fecha_inicio AND :fecha_fin \n" +
            "    and aprcon.aprcon_estado = 'A' \n" +
            "    and emp_ideregistro = :idempresa ", nativeQuery = true)
    Optional<BigDecimal> getAllCollectionIncentiveOfUse(@Param("idempresa") Integer idempresa,
                                                        @Param("fecha_inicio") Date fechaInicio,
                                                        @Param("fecha_fin") Date fechaFin);

    @Query(value = "SELECT " + 
            "   terideregistro as ter_ideregistro, ternomcompleto as ter_nomcompleto,"+
            "   (sum(pagocc) + sum(pagota) + sum(pagoiat)) as valor " +
            "FROM aseo.fn_apro_reporteresumen_girosaprovechador(:idempresa,cast(:fechainicio as timestamp),cast(:fechafin as timestamp),:estado,:idtercero) " +
            "group by ter_ideregistro,ter_nomcompleto ", nativeQuery = true)
    List<ConConsolidacionAproGirosProjection> getAllOrderDetailReport(@Param("idempresa") Integer idempresa,
                                                                      @Param("fechainicio") Date fechainicio,
                                                                      @Param("fechafin") Date fechafin,
                                                                      @Param("estado") String estado,
                                                                      @Param("idtercero") Long idtercero);
    @Query(value = "select terideregistro as ter_ideregistro,ternomcompleto as ter_nomcompleto,oficioconciliacion_tercero,numeroactacon_tercero,pagocc,pagota,pagoiat,aprconc_fechagiro " +
            "FROM aseo.fn_apro_reporteresumen_girosaprovechador(:idempresa,cast(:fechainicio as timestamp), cast(:fechafin as timestamp),:estado,:idtercero) ", nativeQuery = true)
    List<DetPeriodoAproGirosProjection> getDetailsOrderByPeriod(@Param("idempresa") Integer idempresa,
                                                                @Param("fechainicio") Date fechainicio,
                                                                @Param("fechafin") Date fechafin,
                                                                @Param("estado") String estado,
                                                                @Param("idtercero") Long idtercero);


    @Query(value = "select * " +
            "from aseo.con_consolidacionaprovechamiento cc " +
            "where cc.ter_ideregistro = :idTercero " +
            "and cc.emp_ideregistro = :idempresa " +
            "and cc.incentivo = :incentivo " +
            "and cc.fecha_corte between :fecha_inicio and :fecha_fin", nativeQuery = true)
    List<ConConsolidacionAprovechamiento> getAllBalanceReport(@Param("idTercero") Long idTercero,
                                                              @Param("idempresa") Integer idempresa,
                                                              @Param("fecha_inicio") Date fechaInicio,
                                                              @Param("fecha_fin") Date fechaFin,
                                                              @Param("incentivo") Long incentivo);

    @Query(value = "select cc.* " +
            "from aseo.con_consolidacionaprovechamiento cc " +
            "inner join fac_factura ff  ON (ff.fac_ideregistro = cc.fac_ideregistro) " +
            "inner join dfac_detfactura dff  ON (dff.fac_ideregistro = ff.fac_ideregistro) " +
            "where dff.uni_concepto = :uniconcepto " +
            "and cc.ter_ideregistro = :idTercero " +
            "and cc.emp_ideregistro = :idempresa " +
            "and cc.incentivo = :incentivo " +
            "and cc.fecha_corte between :fecha_inicio and :fecha_fin", nativeQuery = true)
    List<ConConsolidacionAprovechamiento> getAllDinc(@Param("idTercero") Long idTercero,
                                                     @Param("uniconcepto") Long uniconcepto,
                                                     @Param("idempresa") Integer idempresa,
                                                     @Param("fecha_inicio") Date fechaInicio,
                                                     @Param("fecha_fin") Date fechaFin,
                                                     @Param("incentivo") Long incentivo);

    @Query(value = "select cc.* " +
            "from aseo.con_consolidacionaprovechamiento cc " +
            "inner join fac_factura ff  on (ff.fac_ideregistro = cc.fac_ideregistro) " +
            "inner join dfac_detfactura dfac on (dfac.fac_ideregistro = ff.fac_ideregistro) " +
            "inner join fac_factura parent ON (ff.fac_idepadre = parent.fac_ideregistro OR ff.fac_ideorigen = parent.fac_ideregistro) " +
            "where cc.ter_ideregistro = :idTercero and cc.fecha_corte between :fecha_inicio and :fecha_fin and cc.incentivo = :incentivo " +
            "and cc.estado = 'CERRADO' " +
            "and parent.fac_estado = 'C' and cc.emp_ideregistro = :idempresa " +
            "and (cc.drec_ideregistro is null or cc.drec_ideregistro = 0) and ff.emp_ideregistro = :idempresa ", nativeQuery = true)
    List<ConConsolidacionAprovechamiento> getAllPunishedWalletVlr(@Param("idTercero") Long idTercero,
                                                                  @Param("idempresa") Integer idempresa,
                                                                  @Param("fecha_inicio") Date fechaInicio,
                                                                  @Param("fecha_fin") Date fechaFin,
                                                                  @Param("incentivo") Long incentivo);

    @Query(value = "select f.* from aseo.fn_apro_gen_reporte_saldo_cartera(:idTercero, :idempresa, :periodo,:fechaCorte, :estado) f", nativeQuery = true)
    List<Map<String, Object>>   generateThirdPartyBalanceReport(@Param("idTercero") Integer idTercero,
                                                              @Param("idempresa") Integer idempresa,
                                                              @Param("periodo") Integer periodo,
                                                              @Param("fechaCorte") String fechaCorte,
                                                              @Param("estado") String estado);


    @Query(value = "select f.* from aseo.fn_apro_gen_reporte_saldo_cartera_detail(:idTercero, :idempresa, :periodo,'A',:fechacorte) f", nativeQuery = true)
    List<Map<String, Object>> generateDetailThirdPartyBalanceReport(@Param("idTercero") Integer idTercero,
                                                                    @Param("idempresa") Integer idempresa,
                                                                    @Param("periodo") Integer periodo,
                                                                    @Param("fechacorte") String fechacorte);

    @Query(value = "select f.* from aseo.fn_apro_gen_reporte_notas_cambiovlr(:idempresa, :periodo_prestacion, :terideregistros, :estado) f", nativeQuery = true)
    List<Map<String, Object>> generateChangeValueReport(@Param("idempresa") Integer idempresa,
                                                        @Param("periodo_prestacion") Integer periodo,
                                                        @Param("terideregistros") String terIderegistro,
                                                        @Param("estado") String estado);
    @Query(value = "select f.* from aseo.fn_apro_gen_reporte_facturacion(:idTercero, :idempresa,:perPrestacion,:estado) f", nativeQuery = true)
    List<Map<String, Object>> generateConsolidateBilling(String idTercero, int idempresa,  Integer perPrestacion,String estado);

    @Query(value = "select f.* from aseo.fn_apro_gen_reporte_cons_faciat(:idTercero, :idempresa, :perPrestacion) f", nativeQuery = true)
    List<Map<String, Object>> generateConsolidateUseReportIAT(String idTercero, int idempresa,  Integer perPrestacion);

    @Query(value = "select f.* from aseo.fn_apro_gen_reporte_fac_detalle_iat(:idTercero, :idempresa,:perPrestacion) f", nativeQuery = true)
    List<Map<String, Object>> generateDetailReportIAT(Long idTercero, int idempresa, Integer perPrestacion);


    @Query(value = "select f.* from aseo.fn_apro_recaudo(:idterceros, :idempresa,:maprcIderegistro, :perInicial,:perFinal) f", nativeQuery = true)
    List<Map<String, Object>> generateAproRec(@Param("idterceros") String idterceros,
                                              @Param("idempresa") Integer idempresa,
                                              @Param("maprcIderegistro") Integer maprcIderegistro,
                                              @Param("perInicial") String perInicial,@Param("perFinal") String perFinal);


}