package com.gell.gestioncartera.repositorios;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.ProgramaUnidad;

/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para programa unidad
 */
@Repository
@Transactional
public interface ProgramaUnidadRepositorio  extends CrudRepository<ProgramaUnidad, Long> {
	
	@Query(value = "select pp.prun_ideregistr , pp2.prg_nombre , uu.uni_nombre1 from prun_prgunidad pp\r\n"
			+ "inner join prg_programa pp2 on  pp2.prg_ideregistro  = pp.prg_ideregistro  \r\n"
			+ "inner join uni_unidad uu  on uu.uni_ideregistro  = pp.uni_ideregistro\r\n"
			+ "inner join est_estructura ee on ee.est_ideregistro = uu.est_ideregistro\r\n"
			+ "inner join esem_estempresa ee2  on ee2.est_ideregistro  = ee.est_ideregistro\r\n"
			+ "where ee.cla_ideregistro  = :id and ee2.emp_ideregistro = :idEmpresa and\r\n"
			+ "pp.prg_ideregistro  in (:rango)", nativeQuery = true)
	Iterable<ProgramaUnidad> findProgramaUnidad(@Param("id") Long id, @Param("idEmpresa") Long idEmpresa, @Param("rango") List<Long> rango);
	
	@Query(value = "select pp.prun_ideregistr , pp2.prg_nombre , uu.uni_nombre1 from prun_prgunidad pp\r\n"
			+ "inner join prg_programa pp2 on  pp2.prg_ideregistro  = pp.prg_ideregistro  \r\n"
			+ "inner join uni_unidad uu  on uu.uni_ideregistro  = pp.uni_ideregistro\r\n"
			+ "inner join est_estructura ee on ee.est_ideregistro = uu.est_ideregistro\r\n"
			+ "inner join esem_estempresa ee2  on ee2.est_ideregistro  = ee.est_ideregistro\r\n"
			+ "where pp.prun_ideregistr = :id", nativeQuery = true)
	Optional<ProgramaUnidad> findById(@Param("id") Long id);
}
