package com.gell.gestioncartera.servicios;

import java.util.List;

import com.gell.gestioncartera.entidades.EdadCartera;
import com.gell.gestioncartera.entidades.EstadoCartera;

/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para edad cartera
 */
public interface EdadCarteraServicios {
	EdadCartera findById(Long id);
	List<EdadCartera> findByAll();
	List<EdadCartera> findByEmpresasevemp(Long idEmpresa);
	EdadCartera save(EdadCartera item);
}
