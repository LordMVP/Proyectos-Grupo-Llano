package com.gell.gestioncartera.servicios;

import java.util.List;

import com.gell.gestioncartera.entidades.Ejecutivo;
/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para ejecutivo
 */
public interface EjecutivoServicios {
	Ejecutivo findById(Long id);
	List<Ejecutivo> findByAll();
	Ejecutivo save(Ejecutivo item);
	List<Ejecutivo> findByEmpresasevemp(Long idEmpresa);
}
