package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.UniUnidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface IManejadorUniUnidad extends JpaRepository<UniUnidad, Integer> {

    @Query(value = "select cast(uu.uni_codigo1 as int) as codigo, uu.uni_nombre1 as nombre " +
            "from public.uni_unidad uu " +
            "where uu.est_ideregistro = 191 " +
            "order by cast(uu.uni_codigo1 as int)", nativeQuery = true)
    List<Map<String, Object>> findEstratos();
}