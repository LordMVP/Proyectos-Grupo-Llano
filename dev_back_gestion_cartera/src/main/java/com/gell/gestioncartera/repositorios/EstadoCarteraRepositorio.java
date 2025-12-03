package com.gell.gestioncartera.repositorios;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.EstadoCartera;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para estado cartera
 */
@Repository
@Transactional
public interface EstadoCarteraRepositorio  extends CrudRepository<EstadoCartera, Long> {
	Iterable<EstadoCartera>  findByEmpresasevemp(Long idEmpresa);
}
