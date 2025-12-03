package com.gell.gestioncartera.repositorios;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.Orientacion;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para orientacion
 */
@Repository
@Transactional
public interface OrientacionRepositorio  extends CrudRepository<Orientacion, Long> {
	Iterable<Orientacion>  findByEmpresasevemp(Long idEmpresa);
}
