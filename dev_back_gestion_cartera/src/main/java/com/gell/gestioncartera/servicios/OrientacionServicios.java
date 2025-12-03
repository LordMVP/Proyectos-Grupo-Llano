package com.gell.gestioncartera.servicios;

import java.util.List;

import com.gell.gestioncartera.entidades.Orientacion;
/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para orientación
 */
public interface OrientacionServicios {
	Orientacion findById(Long id);
	List<Orientacion> findByAll();
	List<Orientacion> findByEmpresasevemp(Long idEmpresa);
	Orientacion save(Orientacion item);
}
