package com.gell.gestioncartera.servicios.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gell.gestioncartera.entidades.SectorComuna;
import com.gell.gestioncartera.entidades.Tercero;
import com.gell.gestioncartera.entidades.Unidad;
import com.gell.gestioncartera.excepciones.NoDataFoundException;
import com.gell.gestioncartera.repositorios.SectorRepositorio;
import com.gell.gestioncartera.repositorios.TerceroRepositorio;
import com.gell.gestioncartera.repositorios.UnidadRepositorio;
import com.gell.gestioncartera.servicios.SectorServicios;
import com.gell.gestioncartera.servicios.TerceroServicios;
import com.gell.gestioncartera.servicios.UnidadServicios;
/**
 * 
 * @author TSI
 * Clase con los métodos donde se aplica la lógica para sectores "comunas"
 */
@Service
public class SectorServiciosImpl implements SectorServicios {

	@Autowired
	SectorRepositorio _repositorio;
	
	/**
	 * 
	 * Método para listar todos los sectores "comunas"
	 * @return lista de sectores
	 */
	@Override
	public List<SectorComuna> findByAll() {
		List<SectorComuna> items = (List<SectorComuna>)_repositorio.findAll();
		
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
		return items;
	}
	
}