package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.AprrecRecaudo;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

/**
 * @author andresgb
 * @project dev_back_facturacionynotas
 * @class ManejadorAprconcConciliacion
 */
@Service
public interface ManejadorAprrecRecaudo extends ManejadorCrud<AprrecRecaudo, Long>,
        IManejadorCrud<AprrecRecaudo, Long> {


    @Query(value = "select * from aseo.generar_reporte_det_liq_aprov(:terIderegistro, :perFecInicial, :perFecFinal, :idEmpresa, :perEstado, :perCorte) f", nativeQuery = true)
    List<Map<String, Object>> getReporteRecaudoConcAprovechador(@Param("terIderegistro") String terIderegistro,
                                                                @Param("perFecInicial") String perFecInicial,
                                                                @Param("perFecFinal") String perFecFinal,
                                                                @Param("idEmpresa") Integer idEmpresa,
                                                                @Param("perEstado") String perEstado,
                                                                @Param("perCorte") Integer perCorte);

    @Query(value = "select * from aseo.fn_gen_apro_recaudo_detalle_iat(:idterceros, :idempresa, :idPeriodo, :perFacturacion, :estado) f", nativeQuery = true)
    List<Map<String, Object>> getReporteRecaudoDetailAprovechador(@Param("idterceros") String idterceros,
                                                         @Param("idempresa") Integer idempresa,
                                                         @Param("idPeriodo") String idPeriodo,
                                                         @Param("perFacturacion") String perFacturacion,
                                                         @Param("estado") String estado);

    @Query(value = "select * from aseo.fn_apro_gen_cruce_recaudo_iat(:perFacturacion,:idempresa) f", nativeQuery = true)
    List<Map<String, Object>> getReporteCruceRecaudoIat(@Param("idempresa") Integer idempresa,
                                                     @Param("perFacturacion") Integer perFacturacion);

    @Query(value = "select * from aseo.fn_gen_reporte_notas_aprovechador_iat(:perFacturacion,:idempresa) f", nativeQuery = true)
    List<Map<String, Object>> getReporteNotasRecaudoIat(@Param("perFacturacion") Integer perFacturacion,
                                                        @Param("idempresa") Integer idempresa);
    //perfacturacion, idempresa, maprcideregistr, tercero, estado
    @Query(value = "select * from aseo.fn_gen_reporte_notas_aprovechador_iat(:perFacturacion, :idempresa, :maprcideregistr, :tercero, :estado) f", nativeQuery = true)
    List<Map<String, Object>> getReporteNotasRecaudoIat(@Param("perFacturacion") Integer perFacturacion,
                                                        @Param("idempresa") Integer idempresa,
                                                        @Param("maprcideregistr") Integer maprcideregistr,
                                                        @Param("tercero") String tercero,
                                                        @Param("estado") String estado);

    //fn_gen_reporte_castigo_aprovechamiento_iat
    @Query(value = "select * from aseo.fn_gen_reporte_castigo_aprovechamiento_iat(:idempresa, :idPeriodo, :perFacturacion, :estado) f", nativeQuery = true)
    List<Map<String, Object>> getReporteCastigoAprovechadorIat(@Param("idempresa") Integer idempresa,
                                                         @Param("idPeriodo") String idPeriodo,
                                                         @Param("perFacturacion") String perFacturacion,
                                                         @Param("estado") String estado);


    @Query(value = "insert into cpr_ctrproceso (cpr_estado, cpr_canregistro, prg_ideregistro, acc_ideregistro, emp_ideregistro, cpr_idehilo, usu_ideregistro) values('A', :cantidadregistros, :prgIderegistro, 0, :idempresa, 0, 0) returning cpr_ideregistro", nativeQuery = true)
    Long generateCpr(@Param("idempresa") Integer idempresa,
                     @Param("cantidadregistros") Integer cantidadregistros,
                     @Param("prgIderegistro") Integer prgIderegistro);

    @Query(value = "select f.* from public.fn_norma_validar_proceso_inactivo(:prgIderegistro, :idempresa) f", nativeQuery = true)
    boolean validateCpr(@Param("idempresa") Integer idempresa,
                        @Param("prgIderegistro") Integer prgIderegistro);

    @Modifying
    @Transactional
    @Query(value = "update cpr_ctrproceso set  cpr_estado = :estado where prg_ideregistro = :prgIderegistro and emp_ideregistro = :idempresa and cpr_ideregistro = (select max(cpr_ideregistro) from cpr_ctrproceso where prg_ideregistro = :prgIderegistro and emp_ideregistro = :idempresa)", nativeQuery = true)
    void updateCpr(@Param("idempresa") Integer idempresa,
                   @Param("prgIderegistro") Integer prgIderegistro,
                   @Param("estado") char estado);

    @Query(value = "select f.* from aseo.fn_apro_sinc_cas_castigoaprovechamiento(:idempresa, :cantidadregistros) f", nativeQuery = true)
    List<Map<String, Object>> generateSincCas(@Param("idempresa") Integer idempresa,
                                              @Param("cantidadregistros") Integer cantidadregistros);
    @Query(value = "select f.* from aseo.fn_apro_sinc_fa_factaaprovechamiento(:idempresa, :cantidadregistros) f", nativeQuery = true)
    List<Map<String, Object>> generateSincFa(@Param("idempresa") Integer idempresa,
                                             @Param("cantidadregistros") Integer cantidadregistros);
    //create function fn_apro_sinc_fa_factaaprovechamiento_v3(idempresa integer, p_per_ideregistro integer)
    @Query(value = "select f.* from aseo.fn_apro_sinc_fa_factaaprovechamiento_v3(:idempresa, :per_ideregistro) f", nativeQuery = true)
    List<Map<String, Object>> generateSincFaV3(@Param("idempresa") Integer idempresa,
                                               @Param("per_ideregistro") Integer per_ideregistro);

    @Query(value = "select f.* from aseo.fn_apro_sinc_rec_recaudoaprovechamiento_v2(:idempresa, :fecha_pago_recaudo) f", nativeQuery = true)
    List<Map<String, Object>> generateSincRecV2(@Param("idempresa") Integer idempresa,
                                               @Param("fecha_pago_recaudo") Date fecha_pago_recaudo);
    @Query(value = "select f.* from aseo.fn_apro_marcacion_distribucion_recaudo(:idempresa, :rec_fecha_pago) f", nativeQuery = true)
    List<Map<String, Object>> generateMarcacionDistribucionRecaudo(@Param("idempresa") Integer idempresa,
                                                                   @Param("rec_fecha_pago") Integer rec_fecha_pago);

    @Query(value = "select f.* from aseo.fn_apro_marcacion_distribucion_recaudo(:idempresa, :p_rec_fecpago) f", nativeQuery = true)
    List<Map<String, Object>> distribuirRecaudo(@Param("idempresa") Integer idempresa,
                                                @Param("p_rec_fecpago") Date p_rec_fecpago);

    @Query(value = "select f.* from aseo.fn_apro_sinc_not_notasaprovechamiento(:idempresa, :cantidadregistros) f", nativeQuery = true)
    List<Map<String, Object>> generateSincNot(@Param("idempresa") Integer idempresa,
                                              @Param("cantidadregistros") Integer cantidadregistros);

    @Query(value = "select f.* from aseo.fn_apro_sinc_rec_recaudoaprovechamiento(:idempresa, :cantidadregistros) f", nativeQuery = true)
    List<Map<String, Object>> generateSincRec(@Param("idempresa") Integer idempresa,
                                              @Param("cantidadregistros") Integer cantidadregistros);

    @Query(value = "select f.* from aseo.fn_apro_marcacion_distribucion(:idempresa) f", nativeQuery = true)
    List<Map<String, Object>> generateMarcacionDistribucion(@Param("idempresa") Integer idempresa);

    //function aseo.insertar_ciclos_periodos_facturacion()
    @Query(value = "select f.* from aseo.insertar_ciclos_periodos_facturacion() f", nativeQuery = true)
    List<Map<String, Object>> insertarCiclosPeriodosFacturacion();


    @Query(value = "select f.* from aseo.fn_apro_marcacion_distribucion_facturacion(:idempresa, :per_facturacion_campo) f", nativeQuery = true)
    List<Map<String, Object>> generateMarcacionDistribucionFacturacion(@Param("idempresa") Integer idempresa,
                                                                      @Param("per_facturacion_campo") Integer per_facturacion_campo);

    @Query(value = "select distinct ar.aprcons_ideregistr from aseo.aprore_recaudoaprovechamiento ar where ar.aprcons_ideregistr not in (select aprcons_ideregistr from aseo.apr_recaudo_mensual)", nativeQuery = true)
    List<BigInteger> obtenerDistinctAprConsIdeRegistr();

    @Query(value = "select f.* FROM aseo.fn_apro_procesar_recaudo_mensual(:p_aprcons_ideregistr) f",
            nativeQuery = true)
    List<Map<String, Object>> procesarRecaudoMensual(@Param("p_aprcons_ideregistr") Integer aprConsIdeRegistr);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO aseo.apr_sinc_periodos_facturacion (per_ideregistro, estado_procesado, per_estado)\n" +
            " SELECT pp.per_ideregistro, 'N', pp.per_estado "+
            "FROM fac_factura ff "+
            "INNER JOIN per_periodo pp ON pp.per_ideregistro = ff.per_ideregistro "+
            "WHERE ff.uni_documento = 24 "+
            "AND ff.fac_estado IN ('A', 'F') "+
            "AND ff.emp_ideregistro = :empIderegistro "+
            "AND ff.fac_idepadre IS NULL "+
            "group by pp.per_ideregistro,pp.per_ideregistro, pp.per_estado "+
            "ON CONFLICT (per_ideregistro) DO NOTHING", nativeQuery = true)
    void insertPendingSyncRecords(@Param("empIderegistro") Integer empIderegistro);

    @Modifying
    @Transactional
    @Query(value =
            "DELETE FROM aseo.apr_dist_periodo_facturacion " +
                    "WHERE aprcons_ideregistr IS NULL " +
                    "  AND per_facturacion IN (" +
                    "    SELECT DISTINCT af.per_facturacion " +
                    "    FROM aseo.aprofa_factaprovechamiento af " +
                    "    WHERE af.aprcons_ideregistr IS NULL" +
                    ");\n" +
                    "INSERT INTO aseo.apr_dist_periodo_facturacion (per_facturacion, estado, aprcons_ideregistr) " +
                    "SELECT DISTINCT af.per_facturacion, 'N', cast(NULL as bigint) " +
                    "FROM aseo.aprofa_factaprovechamiento af " +
                    "WHERE af.aprcons_ideregistr IS NULL " +
                    "  AND af.per_facturacion NOT IN (" +
                    "    SELECT per_facturacion " +
                    "    FROM aseo.apr_dist_periodo_facturacion" +
                    "  )",
            nativeQuery = true)
    void insertPendingDistributionRecords();
}