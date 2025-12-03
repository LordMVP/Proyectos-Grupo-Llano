package com.gell.gestioncartera.repositorios;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.NovedadVisita;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para novedad de visitas
 */
@Repository
@Transactional
public interface NovedadVisitaRepositorio  extends CrudRepository<NovedadVisita, Long> {
	Iterable<NovedadVisita> findByEmpresasevemp(Long idEmpresa);
}
