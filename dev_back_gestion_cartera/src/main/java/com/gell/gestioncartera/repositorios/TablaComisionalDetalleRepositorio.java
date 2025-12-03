package com.gell.gestioncartera.repositorios;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.TablaComisionalDetalle;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para la tabla comisional detalle
 */
@Repository
@Transactional
public interface TablaComisionalDetalleRepositorio  extends CrudRepository<TablaComisionalDetalle, Long> {
	Iterable<TablaComisionalDetalle> findByTcomidregistro(Long id);
}
