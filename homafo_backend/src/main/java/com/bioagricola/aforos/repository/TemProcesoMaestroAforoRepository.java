package com.bioagricola.aforos.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bioagricola.aforos.entity.TemProcesoMaestroAforo;

@Repository("temProcesoMaestroAforoRepository")
@Transactional
public interface TemProcesoMaestroAforoRepository  extends CrudRepository<TemProcesoMaestroAforo,Long>,JpaSpecificationExecutor<TemProcesoMaestroAforo>{
	
	@Query(value="select * from aseo.tpmaf_temprocesomaestroaforos where afo_ideregistro=:idAforo",nativeQuery=true)
	public List<TemProcesoMaestroAforo> findByIdAforo(@Param("idAforo") Long idAforo);
}

