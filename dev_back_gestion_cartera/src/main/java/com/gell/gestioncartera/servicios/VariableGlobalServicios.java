package com.gell.gestioncartera.servicios;

import java.util.List;

import com.gell.gestioncartera.dto.VariableGlobalDto;
import com.gell.gestioncartera.entidades.VariableGlobal;
/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para variables globales
 */
public interface VariableGlobalServicios {
	VariableGlobal findById(Long id);
	List<VariableGlobal> findByAll();
	VariableGlobal save(VariableGlobal item);
	public List<VariableGlobalDto> findByAllDto(Long idEmpresa);
}
