package com.gell.gestioncartera.repositorios;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.EjecutivoSector;
import com.gell.gestioncartera.entidades.EstrategiaClasificacion;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para clasificacion
 */
@Repository
@Transactional
public interface EstrategiaClasificacionRepositorio  extends CrudRepository<EstrategiaClasificacion, Long> {
	Iterable<EstrategiaClasificacion> findByEstidregistro(Long est_idregistro);
}
