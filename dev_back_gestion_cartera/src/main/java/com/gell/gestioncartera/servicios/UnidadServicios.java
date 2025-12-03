package com.gell.gestioncartera.servicios;

import java.util.List;

import com.gell.gestioncartera.entidades.Unidad;
/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para las unidades de las estructuras de clase
 */
public interface UnidadServicios {
	List<Unidad> findByEstideregistro(Long id);
	
	List<Unidad> findByParametros(Long id);
	
	List<Unidad> findByUnidadNotNull(Long id, Long idEmpresa);
}
