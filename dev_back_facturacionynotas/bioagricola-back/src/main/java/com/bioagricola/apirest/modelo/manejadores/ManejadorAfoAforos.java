package com.bioagricola.apirest.modelo.manejadores;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.bioagricola.apirest.modelo.entidades.AfoAforos;

public interface ManejadorAfoAforos extends CrudRepository<AfoAforos, Long> {

    @Query("select a from AfoAforos a where a.terAforador = :terId")
    List<AfoAforos> getTerceroAforado(@Param("terId") Long terId);
}
