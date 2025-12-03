package com.bioagricola.homologaciones.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.homologaciones.entity.GenGenerador;

public interface GenGeneradorRepository extends JpaRepository<GenGenerador,Long>,JpaSpecificationExecutor<GenGenerador> {


	@Query(value = "SELECT g FROM GenGenerador g WHERE :volumen BETWEEN g.genDesde AND g.genHasta")
	List<GenGenerador> findByVolumenGenerado(@Param("volumen") Double volumenGenerado,Pageable pageable);
	
	@Query(value = "SELECT g FROM GenGenerador g WHERE :volumen BETWEEN g.genVolumenDesde AND g.genVolumenHasta")
	List<GenGenerador> findByVolumenGenerado(@Param("volumen") Double volumenGenerado);
	
	@Query(value = "select uu.uni_codigo2 from public.dsus_detsuscrip dd "
			+ "inner join public.uni_unidad uu on uu.uni_ideregistro = dd.uni_tipusosuscr "
			+ "where dd.dsus_ideregistr = :dsus",nativeQuery = true)
	String obtenerGeneradorOficialByDsus(@Param("dsus") Long dsus);
}
