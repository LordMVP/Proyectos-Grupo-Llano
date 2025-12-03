package com.bioagricola.aforos.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bioagricola.aforos.entity.HDetalleConceptoVisitaAforo;

@Repository
@Transactional
public interface HDetalleConceptoVisitaAforoRepository  extends CrudRepository<HDetalleConceptoVisitaAforo,Long>,JpaSpecificationExecutor<HDetalleConceptoVisitaAforo>{

	@Query(value="select hdcva.* from aseo.hdcva_historicodetalleconceptovisitasaforo hdcva \n" + 
			"inner join aseo.hdmaf_detallemaestrovisitas hdmaf on hdmaf.hdmaf_ideregistro=hdcva.hdmaf_ideregistro \n" + 
			"where hdmaf.hmafv_ideregistro=:idMaestro ",nativeQuery=true)
	public List<HDetalleConceptoVisitaAforo> findDetallesConceptosByMaaestro(@Param("idMaestro")Long idMaestro);
	
	@Query(value="select\n" + 
			"SUM(hdcva.hdcva_volumenaforo )\n" + 
			"from aseo.hdcva_historicodetalleconceptovisitasaforo hdcva \n" + 
			"where hdcva.hdmaf_ideregistro=:idmaf ",nativeQuery=true)
	public Double caclularVolumendmaf(@Param("idmaf")Long idmaf);
		
}