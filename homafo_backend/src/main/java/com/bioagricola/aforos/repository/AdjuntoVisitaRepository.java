package com.bioagricola.aforos.repository;

import com.bioagricola.aforos.entity.AdjuntoVisita;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public interface AdjuntoVisitaRepository extends CrudRepository<AdjuntoVisita,Long>,JpaSpecificationExecutor<AdjuntoVisita>{
	
	@Query(value="select * from aseo.adva_adjuntovisitas where dmaf_ideregistro=:idDetalle", nativeQuery=true)
	public List<AdjuntoVisita> getAdjuntosByDetalle(@Param("idDetalle") Long idDetalle);

	AdjuntoVisita findByDmafIderegistro(Integer dmafIderegistro);

}

