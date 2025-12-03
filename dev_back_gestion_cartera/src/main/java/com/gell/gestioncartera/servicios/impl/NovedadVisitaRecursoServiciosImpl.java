package com.gell.gestioncartera.servicios.impl;

import java.util.List;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.gell.gestioncartera.entidades.NovedadVisitaRecurso;

import com.gell.gestioncartera.excepciones.NoDataFoundException;
import com.gell.gestioncartera.repositorios.NovedadVisitaRecursoRepositorio;

import com.gell.gestioncartera.servicios.NovedadVisitaRecursoServicios;

/**
 * 
 * @author TSI
 * Clase con los métodos donde se aplica la lógica para novedad visita
 */
@Service
public class NovedadVisitaRecursoServiciosImpl implements NovedadVisitaRecursoServicios {

	@Autowired
	NovedadVisitaRecursoRepositorio _repositorio;
	
	/**
	 * @param Long id
	 * Método para busqueda de NovedadVisitaRecurso por id
	 * @return NovedadVisitaRecurso
	 */
	@Override
	public NovedadVisitaRecurso findById(Long id) {
		Optional<NovedadVisitaRecurso> item = _repositorio.findById(id);
		if (!item.isPresent()) {
			throw new NoDataFoundException();
		}
		return item.get();
	}
	
	/**
	 * 
	 * Método para listar todos las NovedadVisitaRecursoes
	 * @return lista NovedadVisitaRecursoes
	 */
	@Override
	public List<NovedadVisitaRecurso> findByAll(Long id) {
		List<NovedadVisitaRecurso> items = (List<NovedadVisitaRecurso>)_repositorio.findByNvisidregistro(id);
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
		return items;
	}
	
	
	/**
	 * 
	 * Método para guardar Novedad Visita Recurso
	 * 
	 * @return registro creado
	 */
	@Override
	public NovedadVisitaRecurso save(NovedadVisitaRecurso item) {
		NovedadVisitaRecurso novedadVisitaRecurso = _repositorio.save(item);

		return novedadVisitaRecurso;
	}
	
	/**
	 * 
	 * Método para guardar Novedad Visita Recurso
	 * 
	 * @return registro creado
	 */
	@Override
	public void delete(NovedadVisitaRecurso item) {
		_repositorio.delete(item);
	}

	
}