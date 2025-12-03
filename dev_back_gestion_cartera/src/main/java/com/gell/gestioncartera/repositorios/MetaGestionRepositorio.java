package com.gell.gestioncartera.repositorios;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.MetaGestion;
import com.gell.gestioncartera.entidades.TablaComisional;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para metas de gestión
 */
@Repository
@Transactional
public interface MetaGestionRepositorio  extends CrudRepository<MetaGestion, Long> {
	Iterable<MetaGestion>  findByEmpresasevemp(Long idEmpresa);
}
