package com.gell.gestioncartera.repositorios;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.Estrategia;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para clasificacion
 */
@Repository
@Transactional
public interface EstrategiaRepositorio  extends CrudRepository<Estrategia, Long> {
	Iterable<Estrategia>  findByEmpresasevemp(Long idEmpresa);
}
