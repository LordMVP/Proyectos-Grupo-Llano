package com.gell.gestioncartera.repositorios;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.VariableGlobal;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para variables globales
 */
@Repository
@Transactional
public interface VariableGlobalRepositorio  extends CrudRepository<VariableGlobal, Long> {
	Iterable<VariableGlobal>  findByEmpresasevemp(Long idEmpresa);
}
