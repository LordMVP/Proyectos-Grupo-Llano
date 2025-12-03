package com.gell.gestioncartera.repositorios;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.gell.gestioncartera.entidades.Parametro;
import com.gell.gestioncartera.entidades.Tercero;
/**
 * 
 * @author TSI
 * Interface para gestionar acciones con la base de datos para parametros
 */
@Repository
@Transactional//(timeout = 5)
public interface ParametroRepositorio  extends CrudRepository<Parametro, Long> {
	Parametro findByEmpideregistro(Long Id);
}
