package com.gell.gestioncartera.servicios;

import java.util.List;

import com.gell.gestioncartera.entidades.Clasificacion;
import com.gell.gestioncartera.entidades.NovedadVisita;

/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para novedad de visitas
 */
public interface NovedadVisitaServicios {
	NovedadVisita findById(Long id);
	List<NovedadVisita> findByAll();
	List<NovedadVisita> findByEmpresasevemp(Long idEmpresa);
	NovedadVisita save(NovedadVisita item);
}
