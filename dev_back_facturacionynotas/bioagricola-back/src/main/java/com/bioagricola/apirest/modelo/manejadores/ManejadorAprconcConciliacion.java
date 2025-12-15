package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.AprconcConciliacion;
import com.bioagricola.apirest.modelo.entidades.ConConsolidacionAprovechamiento;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import com.bioagricola.apirest.modelo.projections.ConConsolidacionAprovechamientoProjection;
import com.bioagricola.apirest.modelo.projections.DetailConsolidacionAprovechamientoProjection;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import com.bioagricola.apirest.modelo.entidades.*;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * @author andresgb
 * @project dev_back_facturacionynotas
 * @class ManejadorAprconcConciliacion
 */
@Service
public interface ManejadorAprconcConciliacion extends ManejadorCrud<AprconcConciliacion, Long>,
        IManejadorCrud<AprconcConciliacion, Long> {



    List<AprconcConciliacion> findByTerIderegistro(Long terIderegistro);

    @Query(value = "select ac.* from aseo.aprconc_conciliacion ac  \n" +
            "            where ac.aprcon_exportadoseven is null and ac.valorpagado_tercero is null and ac.aprcon_estado  = 'A'  \n" +
            "            and ac.ter_ideregistro = :tercero and ac.per_ideregistro = :periodo and ac.per_prestacion =:periodoPrestacion and ac.per_facturacion = :periodoFacturacion", nativeQuery = true)
    List<AprconcConciliacion> obtenerListadoConsolidacionPorTerceroAndPeriodo(@Param("tercero") Long tercero, @Param("periodo") Long periodo, @Param("periodoPrestacion") Integer periodoPrestacion, @Param("periodoFacturacion") Integer periodoFacturacion);

    @Query(value = "select ac.* from aseo.aprconc_conciliacion ac  \n" +
            "            where ac.aprcon_exportadoseven is null and ac.valorpagado_tercero is null and ac.aprcon_estado  = 'A'  \n" +
            "            and ac.ter_ideregistro = :tercero and ac.per_ideregistro = :periodo and ac.per_prestacion =:periodoPrestacion and ac.per_facturacion = :periodoFacturacion", nativeQuery = true)
    List<AprconcConciliacion> obtenerListadoConsolidacionPorTerceroAndPeriodo2(@Param("tercero") Long tercero, @Param("periodo") Long periodo, @Param("periodoPrestacion") Integer periodoPrestacion, @Param("periodoFacturacion") Integer periodoFacturacion);

    @Query(value = "select ac.* from aseo.aprconc_conciliacion ac  \n" +
            "            where ac.aprcon_exportadoseven is null and ac.valorpagado_tercero is null and ac.aprcon_estado  = 'A'  \n" +
            "            and ac.ter_ideregistro = 460626 and ac.per_prestacion =202211 and ac.per_facturacion = 202212; --and ac.per_ideregistro = 5367;", nativeQuery = true)
    List<AprconcConciliacion> obtenerListadoConsolidacionPorTerceroAndPeriodo2();


    @Query(value = "select\n" +
            "ac.fac_ideorigen ,\n" +
            "fac_ideregistro ,\n" +
            "uni_documento,\n" +
            "doc_tipo,\n" +
            "per_facturacion ,\n" +
            "uni_documento,\n" +
            "uni_concepto,\n" +
            "dfac_sdoreal,\n" +
            "fac_fecha\n" +
            "from\n" +
            "aseo.aprocas_castigoaprovechamiento ac\n" +
            "where\n" +
            "ac.per_facturacion = :perFacturacion\n" +
            "and ac.emp_ideregistro = :idempresa limit 10", nativeQuery = true)
    List<Map<String, Object>> getAllByPunishedInvoicesAndPeriod(@Param("perFacturacion") Integer perFacturacion, @Param("idempresa") Integer idempresa);

    @Query(value = "select ac.* from aseo.aprconc_conciliacion ac where\n" +
            "             ac.ter_ideregistro = :tercero and ac.per_prestacion in( :periodoPrestacion )and ac.per_facturacion in ( :periodoFacturacion) and ac.aprcon_estado = 'A';"
            , nativeQuery = true)
    List<ConConsolidacionAprovechamiento> getCruceReucaudoByAforado(@Param("tercero") Long tercero, @Param("periodoPrestacion") Integer periodoPrestacion, @Param("periodoFacturacion") Integer periodoFacturacion);

    ////select * from aseo.aprcon_update_exportadoseven(ter_ideregistros character varying, per_ini integer, per_fxin integer, id_corte integer, estado boolean);
    @Query(value = "select * from aseo.aprcon_update_exportadoseven(:terceros, :periodoPrestacion, :periodoFacturacion, :idCorte, :estado);"
            , nativeQuery = true)
    List<Map<String, Object>> updateExportadoSeven(@Param("terceros") String terceros, @Param("periodoPrestacion") Integer periodoPrestacion, @Param("periodoFacturacion") Integer periodoFacturacion, @Param("idCorte") Integer idCorte, @Param("estado") Boolean estado);
}
