package com.bioagricola.aforos.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bioagricola.aforos.entity.DetalleConceptoVisitaAforo;

@Repository
@Transactional
public interface DetalleConceptoVisitaAforoRepository  extends CrudRepository<DetalleConceptoVisitaAforo,Long>,JpaSpecificationExecutor<DetalleConceptoVisitaAforo>{

	@Query(value="select dcva.* from aseo.dcva_detalleconceptovisitasaforo dcva " + 
			"inner join aseo.dmaf_detallemaestrovisitas dmaf on dmaf.dmaf_ideregistro=dcva.dmaf_ideregistro " + 
			"where dmaf.mafv_ideregistro=:idMaestro ",nativeQuery=true)
	public List<DetalleConceptoVisitaAforo> findDetallesConceptosByMaaestro(@Param("idMaestro")Long idMaestro);
	
	@Query(value="select dcva.* from aseo.dcva_detalleconceptovisitasaforo dcva \r\n" + 
			"inner join aseo.dmaf_detallemaestrovisitas dmaf on dmaf.dmaf_ideregistro=dcva.dmaf_ideregistro  \r\n" + 
			"where dmaf.dmaf_ideregistro=:idDetalleVisita",nativeQuery=true)
	public List<DetalleConceptoVisitaAforo> findDetallesConceptosByDetalleVisita(@Param("idDetalleVisita")Long idDetalleVisita);
	
	@Query(value="delete from aseo.dcva_detalleconceptovisitasaforo where dmaf_ideregistro " + 
			"in (select dmaf_ideregistro from aseo.dmaf_detallemaestrovisitas where mafv_ideregistro=:idMaestro) ", nativeQuery=true)
	public void deleteConceptosPreviosByMaestroVisita(@Param("idMaestro")Long idMaestro);
	
	@Query(value="select\n" + 
			"COALESCE(SUM(dcva.dcva_volumenaforo ) ,0)\n" + 
			"from aseo.dcva_detalleconceptovisitasaforo dcva \n" + 
			"where dcva.dmaf_ideregistro=:idmaf ",nativeQuery=true)
	public Double caclularVolumendmaf(@Param("idmaf")Long idmaf);
}
