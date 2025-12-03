package com.gell.gestioncartera.servicios.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gell.gestioncartera.entidades.Parametro;
import com.gell.gestioncartera.entidades.Tercero;
import com.gell.gestioncartera.excepciones.NoDataFoundException;
import com.gell.gestioncartera.repositorios.ParametroRepositorio;
import com.gell.gestioncartera.repositorios.TerceroRepositorio;
import com.gell.gestioncartera.servicios.ParametroServicios;
import com.gell.gestioncartera.servicios.TerceroServicios;
/**
 * 
 * @author TSI
 * Clase con los métodos donde se aplica la lógica para parametro
 */
@Service
public class ParametroServiciosImpl implements ParametroServicios {

	@Autowired
	ParametroRepositorio _repositorio;
	
	/**
	 * @param SLong id
	 * Método para busqueda de parametro por id de empresa
	 * @return parametro
	 */
	@Override
	public Parametro findByEmpideregistro(Long id) {
		Parametro item = _repositorio.findByEmpideregistro(id);
		
		if (item == null) {
			throw new NoDataFoundException();
		}
		return item;
	}
	

}
