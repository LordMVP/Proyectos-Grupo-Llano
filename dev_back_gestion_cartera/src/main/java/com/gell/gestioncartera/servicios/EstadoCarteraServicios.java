package com.gell.gestioncartera.servicios;

import java.util.List;

import com.gell.gestioncartera.entidades.EstadoCartera;

/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para estado cartera
 */
public interface EstadoCarteraServicios {
	EstadoCartera findById(Long id);
	List<EstadoCartera> findByAll();
	List<EstadoCartera> findByEmpresasevemp(Long idEmpresa);
	EstadoCartera save(EstadoCartera item);
}
