package com.gell.gestioncartera.repositorios;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.Clasificacion;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para estrategia
 */
@Repository
@Transactional
public interface ClasificacionRepositorio  extends CrudRepository<Clasificacion, Long> {
	Iterable<Clasificacion> findByEmpresasevemp(Long idEmpresa);
}
