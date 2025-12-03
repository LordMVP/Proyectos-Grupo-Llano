package com.gell.gestioncartera.servicios;

import java.util.List;

import com.gell.gestioncartera.entidades.Estrategia;
import com.gell.gestioncartera.entidades.EstrategiaClasificacion;

/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para estrategia
 */
public interface EstrategiaServicios {
	Estrategia findById(Long id);
	List<Estrategia> findByAll();
	List<Estrategia> findByEmpresasevemp(Long idEmpresa);
	Estrategia save(Estrategia item);
}
