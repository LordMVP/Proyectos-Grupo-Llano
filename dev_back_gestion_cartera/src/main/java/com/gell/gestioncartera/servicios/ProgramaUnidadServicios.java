package com.gell.gestioncartera.servicios;

import java.util.List;

import com.gell.gestioncartera.entidades.Funcion;
import com.gell.gestioncartera.entidades.ProgramaUnidad;
import com.gell.gestioncartera.entidades.Usuario;

/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para programa unidad
 */
public interface ProgramaUnidadServicios {
	List<ProgramaUnidad> findProgramaUnidad(Long id, Long idEmpresa, List<Long> rango);
	ProgramaUnidad findById(Long id);
}
