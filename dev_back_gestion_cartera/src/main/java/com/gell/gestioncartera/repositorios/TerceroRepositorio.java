package com.gell.gestioncartera.repositorios;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.Tercero;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para terceros
 */
@Repository
@Transactional//(timeout = 5)
public interface TerceroRepositorio  extends CrudRepository<Tercero, Long> {
	Tercero findByDocumento(String documento);
	Iterable<Tercero> findByNomcompletoContaining(String nombre);
}
