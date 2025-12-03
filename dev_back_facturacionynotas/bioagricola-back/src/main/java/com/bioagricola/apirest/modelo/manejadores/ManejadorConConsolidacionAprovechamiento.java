package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.ConConsolidacionAprovechamiento;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import com.bioagricola.apirest.modelo.projections.ConConsolidacionAprovechamientoProjection;
import com.bioagricola.apirest.modelo.projections.DetailConsolidacionAprovechamientoProjection;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
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

    @Query(value = "select " +
            "parent.fac_ideregistro id, " +
            "parent.fac_fecha fechaExpedicion, " +
            "cc.valor_calculado valor, " +
            "cc.porcentaje porcentaje, " +
            "cc.uni_concepto uniConcepto " +
            "from aseo.con_consolidacionaprovechamiento cc " +
            "inner join fac_factura ff  ON (ff.fac_ideregistro = cc.fac_ideregistro) " +
            "inner join fac_factura parent ON (ff.fac_idepadre = parent.fac_ideregistro OR ff.fac_ideorigen = parent.fac_ideregistro) " +
            "where cc.fecha_corte between :periodoliqInicial and :periodoliqFinal " +
            "and parent.fac_estado = 'C' and cc.emp_ideregistro = :idempresa " +
            "and cc.ter_ideregistro = :idTercero and cc.incentivo = :incentivo " +
            "and (cc.drec_ideregistro is null or cc.drec_ideregistro = 0) and ff.emp_ideregistro = :idempresa ", nativeQuery = true)
    List<ConConsolidacionAprovechamientoProjection> getAllByPunishedAndIdTerceroAndDates(@Param("idTercero") Long idTercero,
                                                                                         @Param("idempresa") Integer idempresa,
                                                                                         @Param("periodoliqInicial") Date periodoliqInicial,
                                                                                         @Param("periodoliqFinal") Date periodoliqFinal,
                                                                                         @Param("incentivo") Long incentivo);

    @Query(value = "select parent.fac_ideregistro id, " +
            "parent.fac_fecha fechaExpedicion " +
            "from aseo.con_consolidacionaprovechamiento cc " +
            "inner join fac_factura ff  ON (ff.fac_ideregistro = cc.fac_ideregistro) " +
            "inner join fac_factura parent ON (ff.fac_idepadre = parent.fac_ideregistro OR ff.fac_ideorigen = parent.fac_ideregistro) " +
            "where cc.fecha_corte between :periodoliqInicial and :periodoliqFinal " +
            "and parent.fac_estado = 'C' and cc.emp_ideregistro = :idempresa " +
            "and cc.ter_ideregistro = :idTercero and (cc.drec_ideregistro is null or cc.drec_ideregistro = 0) " +
            "and ff.emp_ideregistro = :idempresa and cc.incentivo = :incentivo " +
            "group by parent.fac_ideregistro, parent.fac_fecha", nativeQuery = true)
    List<DetailConsolidacionAprovechamientoProjection> getNumbersFac(@Param("idTercero") Long idTercero,
                                                                     @Param("idempresa") Integer idempresa,
                                                                     @Param("periodoliqInicial") Date periodoliqInicial,
                                                                     @Param("periodoliqFinal") Date periodoliqFinal,
                                                                     @Param("incentivo") Long incentivo);

    @Query(value = "select coalesce(sum(valor_calculado), 0) " +
            "from aseo.con_consolidacionaprovechamiento cc " +
            "where cc.incentivo = 0 " +
            "and cc.emp_ideregistro = :idempresa " +
            "and cc.estado = 'ACTIVO' " +
            "and cc.con_exportar_seven = 1 " +
            "and cc.concepto in ('AjusteCC', 'CC') " +
            "and cc.fecha_corte between :fecha_inicio and :fecha_fin " +
            "and (cc.drec_ideregistro is not null or cc.drec_ideregistro = 0)", nativeQuery = true)
    Optional<BigDecimal> getAllCollectionUseMarketing(@Param("idempresa") Integer idempresa,
                                                      @Param("fecha_inicio") Date fechaInicio,
                                                      @Param("fecha_fin") Date fechaFin);


    @Query(value = "select coalesce(sum(valor_calculado), 0) " +
            "from aseo.con_consolidacionaprovechamiento cc " +
            "where cc.incentivo = 0 " +
            "and cc.emp_ideregistro = :idempresa " +
            "and cc.estado = 'ACTIVO' " +
            "and cc.con_exportar_seven = 1 " +
            "and cc.concepto not in ('AjusteCC', 'CC') " +
            "and cc.fecha_corte between :fecha_inicio and :fecha_fin " +
            "and (cc.drec_ideregistro is not null or cc.drec_ideregistro = 0)", nativeQuery = true)
    Optional<BigDecimal> getAllUseVbaBudget(@Param("idempresa") Integer idempresa,
                                            @Param("fecha_inicio") Date fechaInicio,
                                            @Param("fecha_fin") Date fechaFin);

    @Query(value = "select coalesce(sum(valor_calculado), 0) " +
            "from aseo.con_consolidacionaprovechamiento cc " +
            "where cc.incentivo = 1 " +
            "and cc.emp_ideregistro = :idempresa " +
            "and cc.estado = 'ACTIVO' " +
            "and cc.con_exportar_seven = 1 " +
            "and cc.concepto not in ('AjusteCC', 'CC') " +
            "and cc.fecha_corte between :fecha_inicio and :fecha_fin " +
            "and (cc.drec_ideregistro is not null or cc.drec_ideregistro = 0)", nativeQuery = true)
    Optional<BigDecimal> getAllCollectionIncentiveOfUse(@Param("idempresa") Integer idempresa,
                                                        @Param("fecha_inicio") Date fechaInicio,
                                                        @Param("fecha_fin") Date fechaFin);

    @Query(value = "select * " +
            "from aseo.con_consolidacionaprovechamiento cc " +
            "where cc.estado != 'CERRADO' " +
            "and cc.estado != 'ELIMINADO' " +
            "and cc.emp_ideregistro = :idempresa  " +
            "and cc.ter_ideregistro = :idTercero " +
            "and cc.fecha_corte between :fecha_inicio and :fecha_fin", nativeQuery = true)
    List<ConConsolidacionAprovechamiento> getAllOrderDetailReport(@Param("idTercero") Long idTercero,
                                                                  @Param("idempresa") Integer idempresa,
                                                                  @Param("fecha_inicio") Date fechaInicio,
                                                                  @Param("fecha_fin") Date fechaFin);

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
}
