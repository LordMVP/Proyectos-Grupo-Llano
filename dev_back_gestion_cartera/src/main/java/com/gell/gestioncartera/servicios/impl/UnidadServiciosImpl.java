package com.gell.gestioncartera.servicios.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gell.gestioncartera.entidades.Tercero;
import com.gell.gestioncartera.entidades.Unidad;
import com.gell.gestioncartera.excepciones.NoDataFoundException;
import com.gell.gestioncartera.repositorios.TerceroRepositorio;
import com.gell.gestioncartera.repositorios.UnidadRepositorio;
import com.gell.gestioncartera.servicios.TerceroServicios;
import com.gell.gestioncartera.servicios.UnidadServicios;
/**
 * 
 * @author TSI
 * Clase con los métodos donde se aplica la lógica para las unidades de las estructuras de clase
 */
@Service
public class UnidadServiciosImpl implements UnidadServicios {

	@Autowired
	UnidadRepositorio _repositorio;
	
	/**
	 * @param Long id
	 * Método para busqueda de unidades por id
	 * @return lista de unidades
	 */
	@Override
	public List<Unidad> findByEstideregistro(Long id) {
		List<Unidad> items = (List<Unidad>)_repositorio.findByEstideregistro(id);
		
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
		return items;
	}

	@Override
	public List<Unidad> findByParametros(Long id) {
		List<Unidad> items = (List<Unidad>)_repositorio.findByParametros(id);
		
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
		return items;
	}

	@Override
	public List<Unidad> findByUnidadNotNull(Long id, Long idEmpresa) {
		List<Unidad> items = (List<Unidad>)_repositorio.findByUnidadNotNull(id, idEmpresa);
		
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
		return items;
	}
	
}