package com.gell.gestioncartera.servicios;

import java.util.List;

import com.gell.gestioncartera.entidades.Periodo;

/**
 * 
 * @author TSI
 * Interface con la declaración de los métodos para los periodos
 */
public interface PeriodoServicios {
	List<Periodo> findByEstado(Long id, String estado);
	List<Periodo> findByPeriodo(List<Long> rango);
}
