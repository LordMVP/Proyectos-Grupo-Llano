package com.gell.gestioncartera.servicios;

import java.util.List;

import com.gell.gestioncartera.entidades.Clasificacion;

/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para clasificacion
 */
public interface ClasificacionServicios {
	Clasificacion findById(Long id);
	List<Clasificacion> findByAll();
	List<Clasificacion> findByEmpresasevemp(Long idEmpresa);
	Clasificacion save(Clasificacion item);
}
