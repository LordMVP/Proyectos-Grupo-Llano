package com.gell.gestioncartera.repositorios;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.Clasificacion;
import com.gell.gestioncartera.entidades.Funcion;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para funciones
 */
@Repository
@Transactional
public interface FuncionRepositorio  extends CrudRepository<Funcion, Long> {
	Iterable<Funcion> findByFuntipo(String tipo);
}
