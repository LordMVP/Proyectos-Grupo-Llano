package com.gell.gestioncartera.repositorios;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.Ejecutivo;
import com.gell.gestioncartera.entidades.EjecutivoSector;
import com.gell.gestioncartera.entidades.Tercero;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para ejecutivos con sus sectores
 */
@Repository
@Transactional
public interface EjecutivoSectorRepositorio extends CrudRepository<EjecutivoSector, Long> {
	Iterable<EjecutivoSector> findByEjeidregistro(Long eje_idregistro);
}
