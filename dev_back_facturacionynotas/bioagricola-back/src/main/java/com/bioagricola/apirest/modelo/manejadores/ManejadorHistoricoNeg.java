package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.HistoricoNegEMSA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ManejadorHistoricoNeg extends JpaRepository<HistoricoNegEMSA, Long> {
}
