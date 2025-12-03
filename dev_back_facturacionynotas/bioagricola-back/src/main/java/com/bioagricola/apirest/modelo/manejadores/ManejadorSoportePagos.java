package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.SoportePagos;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.List;

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

    @Query(value = "select ss.* from aseo.sop_soportepagos ss where ss.sop_ideregistro = :sopIderegistro ", nativeQuery = true)
    SoportePagos getBySopIderegistro(@Param("sopIderegistro") Integer sopIderegistro);
}
