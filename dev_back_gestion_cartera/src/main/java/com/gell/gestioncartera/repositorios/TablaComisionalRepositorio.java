package com.gell.gestioncartera.repositorios;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.TablaComisional;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para la tabla comisional
 */
@Repository
@Transactional
public interface TablaComisionalRepositorio  extends CrudRepository<TablaComisional, Long> {
	Iterable<TablaComisional>  findByEmpresasevemp(Long idEmpresa);
}
