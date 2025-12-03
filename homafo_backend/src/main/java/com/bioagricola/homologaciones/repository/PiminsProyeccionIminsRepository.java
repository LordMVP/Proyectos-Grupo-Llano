package com.bioagricola.homologaciones.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.bioagricola.homologaciones.entity.PiminsProyeccionImins;

public interface PiminsProyeccionIminsRepository extends JpaRepository<PiminsProyeccionImins, Long>,JpaSpecificationExecutor<PiminsProyeccionImins>  {

	
	Page<PiminsProyeccionImins> findByPimpIderegistro_pimpIderegistro(Long piminsIderegistro,Pageable pageable);
	@Query(value = "SELECT p FROM PiminsProyeccionImins p WHERE p.pimpIderegistro.pimpIderegistro = :pimpIderegistro AND p.pimpIderegistro.pimpEstado = :pimpEstado")
	Page<PiminsProyeccionImins> findByPimpAndEstado(Long pimpIderegistro,String pimpEstado,Pageable pageable);
	
}
