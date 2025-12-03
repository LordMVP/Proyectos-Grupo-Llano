package com.bioagricola.common.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.common.entity.PrunPrgUnidad;

public interface PrunPrgUnidadRepository extends JpaRepository<PrunPrgUnidad, Long>,JpaSpecificationExecutor<PrunPrgUnidad> {

	
	
	@Query("SELECT uspu.prunIderegistro FROM UspuUsuprgunid uspu "			
			+ "WHERE uspu.usuIderegistro = :usuIderegistro AND uspu.prunIderegistro.prgIderegistro = :prgIderegistro")
	List<PrunPrgUnidad> findByProgramaAndUsuario(@Param("prgIderegistro")Long prgIderegistro,@Param("usuIderegistro")Long usuIderegistro);
	
}
