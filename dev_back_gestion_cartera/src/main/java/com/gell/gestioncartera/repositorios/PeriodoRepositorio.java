package com.gell.gestioncartera.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.Clasificacion;
import com.gell.gestioncartera.entidades.Funcion;
import com.gell.gestioncartera.entidades.Periodo;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para periodos
 */
@Repository
@Transactional
public interface PeriodoRepositorio  extends CrudRepository<Periodo, Long> {
	@Query(value = "select pp.* from cic_ciclo cc  "
			+ "join per_periodo pp  "
			+ "on pp.cic_ideregistro =cc.cic_ideregistro   "
			+ "where cc.cic_ideregistro =:id and pp.per_estado = :estado", nativeQuery = true)
	Iterable<Periodo> findByEstado(Long id, String estado);
	
	@Query(value = "select  cc.cic_ideregistro, pp.per_ideregistro, pp.per_nombre, pp.per_estado\r\n"
			+ "from cic_ciclo cc\r\n"
			+ "join per_periodo pp  on pp.cic_ideregistro =cc.cic_ideregistro  \r\n"
			+ "where cc.cic_ideregistro in (:rango) \r\n"
			+ "and pp.per_estado = 'A'", nativeQuery = true)
	Iterable<Periodo> findByPeriodo(@Param("rango") List<Long> rango);
	
	
}
