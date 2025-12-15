package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.aseo.LogFacturaApiEmsa;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import com.bioagricola.apirest.modelo.projections.LogFacturaApiEmsaProjection;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ManejadorLogFacturaApiEmsa extends ManejadorCrud<LogFacturaApiEmsa,Long> {
    
    @Query(value = "select log.*,u.usuario_nom as auditoria from aseo.log_factura_api_emsa log " +
        "inner join public.usuarios u on u.usu_ideregistro = log.usu_ideregistro " +
        "where cast(log.fecha as date) between :desde and :hasta ", nativeQuery = true)
    public List<LogFacturaApiEmsaProjection> findAllByRangeDate(@Param("desde") LocalDate desde,@Param("hasta") LocalDate hasta);
}
