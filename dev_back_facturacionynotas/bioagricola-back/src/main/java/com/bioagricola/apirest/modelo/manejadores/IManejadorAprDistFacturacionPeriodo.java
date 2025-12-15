package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.aseo.AprDistPeriodoFacturacion;
import com.bioagricola.apirest.modelo.entidades.aseo.EstadoProcesado;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public interface IManejadorAprDistFacturacionPeriodo extends ManejadorCrud<AprDistPeriodoFacturacion,Integer>{

    List<AprDistPeriodoFacturacion> findAllByOrderByPerFacturacionDesc();

    @Modifying
    @Transactional
    @Query(value = "update aseo.apr_dist_periodo_facturacion set estado = :estado where aprcons_ideregistr = :id", nativeQuery = true)
    void updateProcesado(@Param("estado") String estado, @Param("id") int id);

    Page<AprDistPeriodoFacturacion> findAllByEstado(EstadoProcesado estado, Pageable pageable);


}
