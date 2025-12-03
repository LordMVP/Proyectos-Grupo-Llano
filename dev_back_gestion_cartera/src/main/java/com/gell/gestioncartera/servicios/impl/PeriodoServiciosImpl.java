package com.gell.gestioncartera.servicios.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gell.gestioncartera.entidades.Periodo;
import com.gell.gestioncartera.excepciones.NoDataFoundException;
import com.gell.gestioncartera.repositorios.PeriodoRepositorio;
import com.gell.gestioncartera.servicios.PeriodoServicios;
/**
 * 
 * @author TSI
 * Clase con los métodos donde se aplica la lógica para funciones
 */
@Service
public class PeriodoServiciosImpl implements PeriodoServicios {

	@Autowired
	PeriodoRepositorio _repositorio;
		
	/**
	 * @param String tipo
	 * Método para busqueda de periodos por estado
	 * @return lista de periodo
	 */
	@Override
	public List<Periodo> findByEstado(Long id, String estado) {
		List<Periodo> items = (List<Periodo>)_repositorio.findByEstado(id, estado);
		
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
		return items;				
	}


	/**
	 * @param String tipo
	 * Método para busqueda de periodos por propiedad
	 * @return lista de periodo
	 */
	@Override
	public List<Periodo> findByPeriodo(List<Long> rango) {
		List<Periodo> items = (List<Periodo>)_repositorio.findByPeriodo(rango);
		
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
		return items;
	}

}
