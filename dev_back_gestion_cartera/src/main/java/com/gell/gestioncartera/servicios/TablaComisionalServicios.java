package com.gell.gestioncartera.servicios;

import java.util.List;

import com.gell.gestioncartera.entidades.TablaComisional;
import com.gell.gestioncartera.entidades.TablaComisionalDetalle;

/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para tabla comisional
 */
public interface TablaComisionalServicios {
	TablaComisional findById(Long id);
	List<TablaComisional> findByAll();
	List<TablaComisional> findByEmpresasevemp(Long idEmpresa);
	List<TablaComisionalDetalle> findByTcomidregistro(Long id);
	TablaComisional save(TablaComisional item);
	TablaComisionalDetalle saveTablaComisionaDetalle(TablaComisionalDetalle item);
	void deleteTablaComisionaDetalle(TablaComisionalDetalle item);
}
