package com.bioagricola.homologaciones.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.bioagricola.homologaciones.entity.PimpProcesoImportacion;

public interface PimpProcesoImportacionRepository extends JpaRepository<PimpProcesoImportacion, Long>,JpaSpecificationExecutor<PimpProcesoImportacion> {

	Page<PimpProcesoImportacion> findByPimpEstado(String estado, Pageable pageable);

}
