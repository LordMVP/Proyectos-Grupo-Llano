package com.bioagricola.apirest.modelo.manejadores.utils;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;

/**
 *
 * @author descobar
 */
@NoRepositoryBean
public interface ManejadorCrud<T,ID extends Serializable> extends JpaRepository<T, ID> {
}
