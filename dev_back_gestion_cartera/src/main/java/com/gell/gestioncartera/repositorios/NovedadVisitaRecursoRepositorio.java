package com.gell.gestioncartera.repositorios;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.gell.gestioncartera.entidades.NovedadVisitaRecurso;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para novedad de visitas recursos
 */
@Repository
@Transactional
public interface NovedadVisitaRecursoRepositorio  extends CrudRepository<NovedadVisitaRecurso, Long> {
	Iterable<NovedadVisitaRecurso> findByNvisidregistro(Long id);
}
