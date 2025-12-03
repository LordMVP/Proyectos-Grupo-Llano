package com.gell.gestioncartera.servicios;

import java.util.List;

import com.gell.gestioncartera.entidades.MetaGestion;
import com.gell.gestioncartera.entidades.MetaGestionDetalle;
/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para metas de gestión
 */
public interface MetaGestionServicios {
	MetaGestion findById(Long id);
	List<MetaGestion> findByAll();
	List<MetaGestion> findByEmpresasevemp(Long idEmpresa);
	List<MetaGestionDetalle> findByMegeidregistro(Long id);
	MetaGestion save(MetaGestion item);
	MetaGestionDetalle saveMetaGestionDetalle(MetaGestionDetalle item);
	void deleteMetaGestionDetalle(MetaGestionDetalle item);
}
