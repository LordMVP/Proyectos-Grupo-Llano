package com.bioagricola.aforos.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bioagricola.aforos.entity.ClaveConsolidadoLVA;
import com.bioagricola.aforos.entity.ConsolidadoLiquidacionVisitaAforo;

@Repository
@Transactional
public interface ConsolidadoLiquidacionVisitaAforoRepository
		extends CrudRepository<ConsolidadoLiquidacionVisitaAforo, ClaveConsolidadoLVA>,
		JpaSpecificationExecutor<ConsolidadoLiquidacionVisitaAforo> {

	@Query(value = "select * from aseo.clva_consolidado_liq_visitas_aforos where mafv_ideregistro=:idMaestro", nativeQuery = true)
	public List<ConsolidadoLiquidacionVisitaAforo> findConsolidadosByMaestro(@Param("idMaestro") Long idMaestro);
}
