package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.DafoDetaforo;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

@Service
public interface ManejadorDafoDetaforo
        extends ManejadorCrud<DafoDetaforo, Integer>, IManejadorCrud<DafoDetaforo, Integer> {
    @Query(value = "select count(*) " +
            "from fac_factura ff " +
            "         inner join dfac_detfactura dfac on dfac.fac_ideregistro = ff.fac_ideregistro " +
            "         inner join aseo.dafo_detaforo dafo on dafo.usu_ideregistro = dfac.usu_ideregistro " +
            "where ff.fac_ideregistro = :facIderegistro", nativeQuery = true)
    Integer getInvoiceByGradedUser(@Param("facIderegistro") Long facIderegistro);
}
