package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.SoportePagos;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class ManejadorSoportePagos
 */
@Service
public interface ManejadorSoportePagos extends ManejadorCrud<SoportePagos, Integer>, IManejadorCrud<SoportePagos, Integer> {
    @Query(value = "select ss.* from aseo.sop_soportepagos ss " +
            "where ss.con_idconsolidacion = :idConsolidacion ", nativeQuery = true)
    List<SoportePagos> getAllSoportePagos(@Param("idConsolidacion") Integer idConsolidacion);

    SoportePagos getBySopIderegistro(@Param("sopIderegistro") Integer sopIderegistro);

    @Query(value = "select ss.sop_fecharegistro, ss.sop_ideregistro, ss.sop_id_acta, ac.sop_fecha_giro, ss.sop_fecha_comite, ac.observaciones " +
            "from aseo.aprconc_conciliacion ac " +
            "inner join aseo.sop_soportepagos ss on ss.sop_ideregistro = ac.sop_ideregistro " +
            "where ac.maprc_ideregistr = :maprcIderegistr and ac.ter_ideregistro = :terIderegistro and ac.per_facturacion = :perFacturacion ", nativeQuery = true)
    Map<String, Object> getSupportThirdPartyPayments(@Param("maprcIderegistr") Integer maprcIderegistr, @Param("terIderegistro") Long terIderegistro, @Param("perFacturacion") Integer perFacturacion);

    @Modifying
    @Transactional
    @Query(value = "update aseo.aprconc_conciliacion " +
            "set observaciones = :observaciones, sop_fecha_giro =:sopFechaGiro " +
            "where maprc_ideregistr = :maprcIderegistr and ter_ideregistro = :terIderegistro and per_facturacion = :perFacturacion ", nativeQuery = true)
    void updateObservations(@Param("observaciones") String observaciones, @Param("maprcIderegistr") Integer maprcIderegistr, @Param("terIderegistro") Long terIderegistro, @Param("perFacturacion") Integer perFacturacion, @Param("sopFechaGiro") Date sopFechaGiro);


    @Query(value = "select *" +
            "from aseo.sop_soportepagos " +
            "order by sop_ideregistro desc " +
            "limit 1 ", nativeQuery = true)
    Optional<SoportePagos> getLastSupportThirdPartyPayments();

    @Query(value = "select distinct  ss.* " +
            "from aseo.sop_soportepagos ss " +
            "inner join aseo.aprconc_conciliacion ac on ss.sop_ideregistro = ac.sop_ideregistro " +
            "where ac.maprc_ideregistr = :maprcIderegistr and ac.per_facturacion = :perFacturacion and ss.per_facturacion = :perFacturacion ", nativeQuery = true)
    List<SoportePagos> getAllSupportPayments(@Param("maprcIderegistr") Integer maprcIderegistr, @Param("perFacturacion") Integer perFacturacion);

    //O
    @Modifying
    @Transactional
    @Query(value = "update aseo.aprconc_conciliacion " +
            "set numeroactacon_tercero = null , sop_ideregistro = null, sop_fecha_giro = null "+
            "where sop_ideregistro = :sopIderegistro", nativeQuery = true)
    void updateSopIdActa(@Param("sopIderegistro") Integer sopIderegistro);

    @Query(value = "select aseo.fn_apro_crear_soporte_actualizar_apconc_fecha_giro(" +
            ":fechaGiro, " +
            ":periodoFac, " +
            ":terceros, " +
            ":maprcIderegistr, " +
            ":usuIderegistro, " +
            ":sopObservacion, " +
            ":sopIdActa, " +
            ":fechaComite " +
            ")", nativeQuery = true)
    void createSupportUpdateConciliation(@Param("fechaGiro") Date fechaGiro, @Param("periodoFac") Integer periodoFac, @Param("terceros") String terceros, @Param("maprcIderegistr") Integer maprcIderegistr, @Param("usuIderegistro") Integer usuIderegistro, @Param("sopObservacion") String sopObservacion, @Param("sopIdActa") Integer sopIdActa, @Param("fechaComite") Date fechaComite);
}
