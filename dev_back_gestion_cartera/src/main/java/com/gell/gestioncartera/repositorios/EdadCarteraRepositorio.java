package com.gell.gestioncartera.repositorios;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.EdadCartera;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para edad cartera
 */
@Repository
@Transactional
public interface EdadCarteraRepositorio  extends CrudRepository<EdadCartera, Long> {
	Iterable<EdadCartera>  findByEmpresasevemp(Long idEmpresa);
}
