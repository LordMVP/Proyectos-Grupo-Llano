package com.gell.gestioncartera.servicios.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gell.gestioncartera.entidades.Funcion;
import com.gell.gestioncartera.entidades.Tercero;
import com.gell.gestioncartera.excepciones.NoDataFoundException;
import com.gell.gestioncartera.repositorios.FuncionRepositorio;
import com.gell.gestioncartera.repositorios.TerceroRepositorio;
import com.gell.gestioncartera.servicios.FuncionServicios;
import com.gell.gestioncartera.servicios.TerceroServicios;
/**
 * 
 * @author TSI
 * Clase con los métodos donde se aplica la lógica para funciones
 */
@Service
public class FuncionServiciosImpl implements FuncionServicios {

	@Autowired
	FuncionRepositorio _repositorio;
	
	
	/**
	 * @param String tipo
	 * Método para busqueda de funciones por tipo
	 * @return lista de funciones
	 */
	@Override
	public List<Funcion> findByFuntipo(String tipo) {
		List<Funcion> items = (List<Funcion>)_repositorio.findByFuntipo(tipo);
		
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
		return items;				
	}

}
