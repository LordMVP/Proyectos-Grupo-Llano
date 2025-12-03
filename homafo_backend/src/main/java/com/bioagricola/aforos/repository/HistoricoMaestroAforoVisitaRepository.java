package com.bioagricola.aforos.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bioagricola.aforos.entity.HistoricoMaestroAforoVisita;

@Repository
@Transactional
public interface HistoricoMaestroAforoVisitaRepository  extends CrudRepository<HistoricoMaestroAforoVisita,Long>,JpaSpecificationExecutor<HistoricoMaestroAforoVisita>{
	
}

