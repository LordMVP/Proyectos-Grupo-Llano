package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.aseo.AprSincPeriodosFacturacion;
import com.bioagricola.apirest.modelo.entidades.aseo.EstadoProcesado;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.util.List;

@Service
public interface IManejadorAprSincFacturacionPeriodo extends ManejadorCrud<AprSincPeriodosFacturacion,Long>{

    @Modifying
    @Transactional
    @Query(value = "update aseo.apr_sinc_periodos_facturacion set estado_procesado = :estado where per_ideregistro = :id", nativeQuery = true)
    void updateProcesado(@Param("estado") String estado, @Param("id") Integer id);

    //Seleccionar Todos los registros
    List<AprSincPeriodosFacturacion> findAllByOrderByPerIderegistro();

    Page<AprSincPeriodosFacturacion> findAllByEstadoProcesado(EstadoProcesado estado, Pageable pageable);
}
