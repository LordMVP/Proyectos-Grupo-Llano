package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.AprsevSeven;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Yoner Silva
 */
@Service
public interface ManejadorAprsevSeven extends ManejadorCrud<AprsevSeven, Long>,IManejadorCrud<AprsevSeven, Long>{
    
    @Query(value = "select aprs.* from aseo.aprsev_seven aprs where aprs.mes = :mes and aprs.ano = :ano and aprs.emp_ideregistro = :empresa ",nativeQuery = true)
    AprsevSeven findByMesAnoEmp(@Param("mes") int mes, @Param("ano") int ano, @Param("empresa") int empresa);
    
    @Transactional
    @Modifying
    @Query(value = "UPDATE aseo.aprsev_seven " +
        "SET valor_proyectado_aprov = :vlr_pro_aprov, valor_ejecutado_aprov = :vlr_eje_aprov, valor_proyectado_iat = :vlr_pro_iat, valor_ejecutado_iat = :vlr_eje_iat " +
        "WHERE aprsev_ideregistro = :aprsev_ideregistro ",nativeQuery = true)
    void updateAprsev(@Param("aprsev_ideregistro") Long aprsev_ideregistro, 
            @Param("vlr_pro_aprov") double vlr_pro_aprov,
            @Param("vlr_eje_aprov") double vlr_eje_aprov,
            @Param("vlr_pro_iat") double vlr_pro_iat,
            @Param("vlr_eje_iat") double vlr_eje_iat);
}
