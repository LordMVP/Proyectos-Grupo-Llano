package com.gell.gestioncartera.repositorios;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.Unidad;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para unidades de las estructuras de clase
 */
@Repository
@Transactional//(timeout = 5)
public interface UnidadRepositorio  extends CrudRepository<Unidad, Long> {
	Iterable<Unidad> findByEstideregistro(Long id);
	
	@Query(value = "select uu.* from public.cla_clase cc\r\n"
			+ "inner join public.est_estructura ee on ee.cla_ideregistro =cc.cla_ideregistro\r\n"
			+ "inner join public.uni_unidad uu on uu.est_ideregistro = ee.est_ideregistro\r\n"
			+ "where cc.cla_ideregistro = :id ", nativeQuery = true)
	Iterable<Unidad> findByParametros(@Param("id") Long id);
	
	@Query(value = "select uu.* from est_estructura ee  "
			+ "inner join uni_unidad uu  on uu.est_ideregistro = ee.est_ideregistro   "
			+ "inner join esem_estempresa ee2 on ee2.est_ideregistro =ee.est_ideregistro  "
			+ "where ee.cla_ideregistro  =:id and ee2.emp_ideregistro =:idEmpresa and uu.uni_propiedad notnull", nativeQuery = true)
	Iterable<Unidad> findByUnidadNotNull(@Param("id")Long id, @Param("idEmpresa")Long idEmpresa);
	
}
