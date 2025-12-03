package com.bioagricola.aforos.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bioagricola.aforos.entity.base.AuditoriaAforo;

@Repository("auditoriaAforoRepository")
@Transactional
public interface AuditoriaAforoRepository  extends CrudRepository<AuditoriaAforo,Long>,JpaSpecificationExecutor<AuditoriaAforo>{
	
}

