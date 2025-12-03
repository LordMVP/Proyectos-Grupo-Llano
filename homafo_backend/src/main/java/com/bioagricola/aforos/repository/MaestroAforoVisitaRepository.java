package com.bioagricola.aforos.repository;

import java.sql.Timestamp;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bioagricola.aforos.entity.MaestroAforoVisita;

@Repository
@Transactional
public interface MaestroAforoVisitaRepository  extends CrudRepository<MaestroAforoVisita,Long>,JpaSpecificationExecutor<MaestroAforoVisita>{
	
	@Query(value="select aseo.fn_crea_visitas(:idAforo, :fechaCreacion, :usuario)", nativeQuery=true)
	public Long fnCreateVisits(@Param("idAforo")Integer idAforo, @Param("fechaCreacion")Timestamp fechaCreacion, @Param("usuario")Integer usuario);
	
	@Query(value="select aseo.fn_crea_visitas_frecuencia(:idAforo, :fechaCreacion, :usuario, :tdf , :cantfrecuencia)", nativeQuery=true)
	public Long fnCreateVisits_frecuencia(@Param("idAforo")Integer idAforo, @Param("fechaCreacion")Timestamp fechaCreacion, 
			@Param("usuario")Integer usuario,@Param("tdf") Integer tdf,@Param("cantfrecuencia") Integer cantfrecuencia);
	
	@Query(value="select aseo.fn_liquida_visita(:mafvId, :orden, :usuario)", nativeQuery=true)
	public Long fnLiquidar(@Param("mafvId")Long mafvId, @Param("orden")String orden, @Param("usuario")Long usuario);
	
	@Query(value="select * from aseo.mafv_maestroaforovisitas where afo_ideregistro=:numAforo order by mafv_inicio desc",nativeQuery=true)
	public List<MaestroAforoVisita> getVisitasByAforo(@Param("numAforo")Long numAforo);
}

