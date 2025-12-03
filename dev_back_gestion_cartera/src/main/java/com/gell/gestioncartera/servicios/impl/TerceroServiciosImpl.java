package com.gell.gestioncartera.servicios.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gell.gestioncartera.entidades.Tercero;
import com.gell.gestioncartera.excepciones.NoDataFoundException;
import com.gell.gestioncartera.repositorios.TerceroRepositorio;
import com.gell.gestioncartera.servicios.TerceroServicios;
/**
 * 
 * @author TSI
 * Clase con los métodos donde se aplica la lógica para terceros
 */
@Service
public class TerceroServiciosImpl implements TerceroServicios {

	@Autowired
	TerceroRepositorio _repositorio;
	
	/**
	 * @param String documento
	 * Método para busqueda de tercero por número de documento
	 * @return tercero
	 */
	@Override
	public Tercero findByDocumento(String documento) {
		Tercero item = _repositorio.findByDocumento(documento);
		
		if (item == null) {
			throw new NoDataFoundException();
		}
		return item;
	}
	
	/**
	 * @param String nombre
	 * Método para busqueda de tercero por nombre
	 * @return lista de terceros
	 */
	@Override
	public List<Tercero> findByNomcompletoContaining(String nombre) {
		List<Tercero> items = (List<Tercero>)_repositorio.findByNomcompletoContaining(nombre);
		
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
		return items;				
	}

}
