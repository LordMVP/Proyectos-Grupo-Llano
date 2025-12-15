package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.HhvcoHistorvarconceptos;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.hibernate.annotations.Type;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ManejadorHhvcoHistorvarconceptos extends ManejadorCrud<HhvcoHistorvarconceptos, Integer>, IManejadorCrud<HhvcoHistorvarconceptos, Integer> {

    @Query("SELECT h FROM HhvcoHistorvarconceptos h WHERE h.hhvcoIderegistr = :hhvcoIderegistr")
    HhvcoHistorvarconceptos consultarPorId(Long hhvcoIderegistr);

    @Query("SELECT MAX(h.hhvcoIderegistr) FROM HhvcoHistorvarconceptos h")
    Integer getNextId();
    @Query(name = "actualizar_conceptos_valor_rango", value = "SELECT aseo.actualizar_conceptos_valor_rango(:id_empresa, :usuario, :m, :y)", nativeQuery = true)
    Boolean actualizarConceptosValorRango(@Param("id_empresa") Integer id_empresa, @Param("usuario") Integer usuario, @Param("m") Integer m, @Param("y") Integer y);

    @Transactional
    @Query(name = "sincronizar_conceptos_valor_rango", value = "SELECT aseo.sincronizar_conceptos_valor_rango(:m, :y)", nativeQuery = true)
    Integer sincronizarConceptosValorRango(@Param("m") Integer m, @Param("y") Integer y);

    @Modifying
    @Transactional
    @Query(name = "cancelar_conceptos_valor_rango", value = "DELETE FROM aseo.temp_hhvco_historvarconceptos hh where hh.mes_actualizar = :m and hh.año_actualizar = :y ;DELETE FROM aseo.hhvco_historvarconceptos hh WHERE hhvco_estado != 'A' and hh.mes_actualizar = :m and hh.año_actualizar = :y", nativeQuery = true)
    void cancelarConceptosValorRango(@Param("m") Integer m, @Param("y") Integer y);

    @Query(name="select_aprobados",value="SELECT h.*,(case when h.con_rangofin is null and h.con_rangoinicio is null then cc.con_valor else raco_ranconcept.raco_valor end) valor_actual_concepto\n" +
            "FROM aseo.hhvco_historvarconceptos h \n" +
            "left join raco_ranconcept on raco_ranconcept.uni_concepto = h.uni_concepto_liq\n" +
            "AND raco_ranconcept.raco_raninicial = h.con_rangoinicio\n" +
            "AND ROUND(raco_ranconcept.raco_ranfinal, 0) = h.con_rangofin\n" +
            "left join con_concepto cc on h.uni_concepto_liq = cc.uni_concepto and h.con_rangofin is null and h.con_rangoinicio is null\n" +
            "WHERE h.hhvco_estado  = 'A' and h.mes_actualizar = :m and h.año_actualizar = :y", nativeQuery = true)
    List<Object> aprobados( @Param("m") Integer m, @Param("y") Integer y);

    @Type(type="pg-uuid")
    @Query(name = "listarRecientes", value = "select * from aseo.temp_hhvco_historvarconceptos hh where hh.año_actualizar = :anio and hh.mes_actualizar = :mes", nativeQuery = true)
    List<Object> listarRecientes(@Param("anio") Integer anio, @Param("mes") Integer mes);


    @Query(name = "existePeriodo", value = "SELECT EXISTS (SELECT 1 FROM aseo.hhvco_historvarconceptos hh where hh.mes_actualizar=:m and hh.año_actualizar=:y)", nativeQuery = true)
    Boolean existePeriodo(@Param("m") Integer m, @Param("y") Integer y);
}
