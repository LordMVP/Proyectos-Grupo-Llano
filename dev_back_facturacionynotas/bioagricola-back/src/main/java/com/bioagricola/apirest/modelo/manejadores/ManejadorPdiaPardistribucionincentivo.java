package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.PdiaPardistribucionincentivo;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public interface ManejadorPdiaPardistribucionincentivo
        extends ManejadorCrud<PdiaPardistribucionincentivo, Integer>, IManejadorCrud<PdiaPardistribucionincentivo, Integer> {

    @Query("select pp from PdiaPardistribucionincentivo pp " +
            "where pp.pdiaFechainiciovigencia <= :fechaRango " +
            "and pp.pdiaFechafinvigencia >= :fechaRango " +
            "and pp.uniMunicipio = :municipio")
    PdiaPardistribucionincentivo getPorcentajeIA(@Param("fechaRango") Date fechaRango,
                                                 @Param("municipio") Long municipio);


    @Query("select pp from PdiaPardistribucionincentivo pp where pp.terIderegistro = :terIderegistro and pp.empIderegistro = :empIderegistro")
    Integer porcentajeIncentivoAprovechamiento(@Param("empIderegistro") Integer empIderegistro);

    @Query(value = "select p.proyecto_nom  from aseo.pdia_pardistribucionincentivo pp " +
            "inner join proyectos p on p.proyecto_ideregistro = pp.uni_municipio " +
            "where emp_ideregistro = :ideEmpresa ", nativeQuery = true)
    String nombreMunicipo(@Param("ideEmpresa") Integer ideEmpresa);
}
