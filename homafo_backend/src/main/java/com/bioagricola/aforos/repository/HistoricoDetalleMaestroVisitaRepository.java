package com.bioagricola.aforos.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bioagricola.aforos.entity.HistoricoDetalleMaestroVisita;

@Repository
@Transactional
public interface HistoricoDetalleMaestroVisitaRepository  extends CrudRepository<HistoricoDetalleMaestroVisita,Long>,JpaSpecificationExecutor<HistoricoDetalleMaestroVisita>{
	
}

