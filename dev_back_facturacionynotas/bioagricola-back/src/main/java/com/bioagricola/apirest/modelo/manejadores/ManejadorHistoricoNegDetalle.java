package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.HistoricoNegDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ManejadorHistoricoNegDetalle extends JpaRepository<HistoricoNegDetalle, Long> {
}
