package com.gell.gestioncartera.repositorios;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.Ejecutivo;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para ejecutivos
 */
@Repository
@Transactional
public interface EjecutivoRepositorio  extends CrudRepository<Ejecutivo, Long> {
	Iterable<Ejecutivo> findByEmpresasevemp(Long idEmpresa);
}
