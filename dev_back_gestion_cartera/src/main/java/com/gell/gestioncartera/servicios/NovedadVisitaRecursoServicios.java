package com.gell.gestioncartera.servicios;

import java.util.List;

import com.gell.gestioncartera.entidades.Clasificacion;
import com.gell.gestioncartera.entidades.NovedadVisita;
import com.gell.gestioncartera.entidades.NovedadVisitaRecurso;

/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para novedad de visitas recursos
 */
public interface NovedadVisitaRecursoServicios {
	NovedadVisitaRecurso findById(Long id);
	List<NovedadVisitaRecurso> findByAll(Long id);
	NovedadVisitaRecurso save(NovedadVisitaRecurso item);
	void delete(NovedadVisitaRecurso item);
}
