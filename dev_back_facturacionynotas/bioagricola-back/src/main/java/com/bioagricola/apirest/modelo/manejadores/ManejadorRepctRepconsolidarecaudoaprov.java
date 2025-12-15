package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.RepctRepconsolidarecaudoaprov;
import com.bioagricola.apirest.modelo.entidades.SoportePagos;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import com.bioagricola.apirest.modelo.projections.DetPeriodoAproGirosProjection;
import java.util.Date;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class ManejadorRepctRepconsolidarecaudoaprov
 */
@Service
public interface ManejadorRepctRepconsolidarecaudoaprov extends ManejadorCrud<RepctRepconsolidarecaudoaprov, Integer> {

    @Query(value = "select t.* from aseo.repct_repconsolidarecaudoaprov t " +
            "where t.ter_ideregistro = :terIdeRegistros and t.repct_oficio_pago = 0 ", nativeQuery = true)
    RepctRepconsolidarecaudoaprov ifGenerateDocument(@Param("terIdeRegistros") Long terIdeRegistros);

    @Query(value = "select t.* from aseo.repct_repconsolidarecaudoaprov t " +
            "where t.ter_ideregistro in :terIdeRegistros and t.repct_oficio_pago = 0 ", nativeQuery = true)
    List<RepctRepconsolidarecaudoaprov> getAllByTerIdeRegistro(@Param("terIdeRegistros") List<Long> terIdeRegistros);

    @Query(value = "select t.* from aseo.repct_repconsolidarecaudoaprov t " +
            "where t.ter_ideregistro = :terIdeRegistros and t.repct_oficio_pago = 0 ", nativeQuery = true)
    Optional<RepctRepconsolidarecaudoaprov> getRepctRepconsolidarecaudoaprov(@Param("terIdeRegistros") Long terIdeRegistros);
}
