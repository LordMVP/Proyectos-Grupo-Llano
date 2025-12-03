package com.gell.gestioncartera.repositorios;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.CondonacionDetalle;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para condonacion
 */
@Repository
@Transactional
public interface CondonacionDetalleRepositorio  extends CrudRepository<CondonacionDetalle, Long> {
	Iterable<CondonacionDetalle>  findByUspuideregistr(Long uspuideregistr);
}
