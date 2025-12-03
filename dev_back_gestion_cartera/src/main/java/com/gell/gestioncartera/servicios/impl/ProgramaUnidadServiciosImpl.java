package com.gell.gestioncartera.servicios.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gell.gestioncartera.entidades.ProgramaUnidad;
import com.gell.gestioncartera.entidades.Usuario;
import com.gell.gestioncartera.excepciones.NoDataFoundException;
import com.gell.gestioncartera.repositorios.ProgramaUnidadRepositorio;
import com.gell.gestioncartera.repositorios.UsuarioRepositorio;
import com.gell.gestioncartera.servicios.ProgramaUnidadServicios;
import com.gell.gestioncartera.servicios.UsuarioServicios;
/**
 * 
 * @author TSI
 * Clase con los métodos donde se aplica la lógica para usuarios
 */
@Service
public class ProgramaUnidadServiciosImpl implements ProgramaUnidadServicios {

	@Autowired
	ProgramaUnidadRepositorio _repositorio;
		
	/**
	 * @param String tipo
	 * Método para busqueda de programa unidad
	 * @return lista de programas
	 */
	@Override
	public List<ProgramaUnidad> findProgramaUnidad(Long id, Long idEmpresa, List<Long> rango) {
		List<ProgramaUnidad> items = (List<ProgramaUnidad>)_repositorio.findProgramaUnidad(id, idEmpresa, rango);
		
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
		return items;				
	}

	@Override
	public ProgramaUnidad findById(Long id) {
		Optional<ProgramaUnidad> item = _repositorio.findById(id);
		
		if (!item.isPresent()) {
			throw new NoDataFoundException();
		}
		return item.get();
	}

}
