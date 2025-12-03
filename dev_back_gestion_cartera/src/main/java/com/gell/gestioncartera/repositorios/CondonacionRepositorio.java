package com.gell.gestioncartera.repositorios;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.Condonacion;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para condonacion
 */
@Repository
@Transactional
public interface CondonacionRepositorio  extends CrudRepository<Condonacion, Long> {
	@Query(value = "select distinct uu.* from uspu_usuprgunid uu \r\n"
			+ "inner join luspu_limitusuprgunidad lu on uu.uspu_ideregistr = lu.uspu_ideregistr \r\n"
			+ "where lu.emp_ideregistro = :idEmpresa", nativeQuery = true)
	Iterable<Condonacion>  findByEmpresa(@Param("idEmpresa") Long idEmpresa);
	
	@Query(value = "select * from uspu_usuprgunid uu where uu.usu_ideregistro = :idUsuario "
			+ "and uu.prun_ideregistr = :tipo", nativeQuery = true)
	Iterable<Condonacion>  findByUsuarioyProceso(@Param("idUsuario") Long idUsuario, @Param("tipo") Long tipo);
}
