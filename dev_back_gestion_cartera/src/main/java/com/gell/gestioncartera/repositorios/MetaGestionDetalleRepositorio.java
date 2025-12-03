package com.gell.gestioncartera.repositorios;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.MetaGestionDetalle;

/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para metas de gestión detalle
 */
@Repository
@Transactional
public interface MetaGestionDetalleRepositorio  extends CrudRepository<MetaGestionDetalle, Long> {
	Iterable<MetaGestionDetalle> findByMegeidregistro(Long id);
}
