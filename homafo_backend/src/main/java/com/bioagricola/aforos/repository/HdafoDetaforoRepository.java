package com.bioagricola.aforos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bioagricola.aforos.entity.HdafoDetaforo;

@Repository
public interface HdafoDetaforoRepository extends CrudRepository<HdafoDetaforo,Long>,JpaSpecificationExecutor<HdafoDetaforo>
{
	@Query(value="SELECT\n" + 
			"hdafo.*\n" + 
			"FROM aseo.hdafo_detaforo hdafo\n" + 
			"WHERE hdafo.hafo_ideregistro=:hafo",nativeQuery=true)
	public List<HdafoDetaforo> buscarHDafo(@Param("hafo") Long hafo);

}
