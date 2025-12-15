package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.dtos.HvtconHomvartarconceptosDTO;
import com.bioagricola.apirest.modelo.entidades.HvtconHomvartarconceptos;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ManejadorHvtconHomvartarconceptos extends ManejadorCrud<HvtconHomvartarconceptos, Integer>, IManejadorCrud<HvtconHomvartarconceptos, Integer> {


    @Query("SELECT h FROM HvtconHomvartarconceptos h WHERE h.hvtconIderegistr = :hvtconIderegistr")
    public HvtconHomvartarconceptosDTO consultarPorId(Integer hvtconIderegistr);

    //NEXT ID
    @Query("SELECT MAX(h.hvtconIderegistr) FROM HvtconHomvartarconceptos h")
    public Integer getNextId();

    @Query("select hh.hvtconIderegistr from HvtconHomvartarconceptos hh where hh.hvtconTipoactualizacion = :hvtcon_tipoactualizacion order by hh.hvtconIderegistr")
     List<Integer> consultarEncabezadoPorTipo(@Param("hvtcon_tipoactualizacion") String hvtcon_tipoactualizacion);

    @Query(value = "SELECT DISTINCT \n" +
            "  date_part('month', pp.per_fecinicial) AS mo,\n" +
            "  date_part('year', pp.per_fecinicial) AS ye\n" +
            "FROM aseo.varpr_varperreg varpr\n" +
            "INNER JOIN per_periodo pp ON pp.per_ideregistro = varpr.per_ideregistro\n" +
            "WHERE \n" +
            "  varpr.varpr_estado = 'CE'\t\n" +
            "  AND emp_ideregistro = :id_empresa\n" +
            "  AND varpr.varpr_estado_registro = 'A'\n" +
            "ORDER BY mo;", nativeQuery = true)
    List<Object[]> consultarAñoMesActualizar(@Param("id_empresa") Integer id_empresa);
}
