package com.gell.gestioncartera.servicios.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gell.gestioncartera.entidades.Ejecutivo;
import com.gell.gestioncartera.entidades.TablaComisional;
import com.gell.gestioncartera.entidades.TablaComisionalDetalle;
import com.gell.gestioncartera.entidades.VariableGlobal;
import com.gell.gestioncartera.excepciones.NoDataFoundException;
import com.gell.gestioncartera.repositorios.EjecutivoRepositorio;
import com.gell.gestioncartera.repositorios.TablaComisionalDetalleRepositorio;
import com.gell.gestioncartera.repositorios.TablaComisionalRepositorio;
import com.gell.gestioncartera.repositorios.VariableGlobalRepositorio;
import com.gell.gestioncartera.servicios.EjecutivoServicios;
import com.gell.gestioncartera.servicios.TablaComisionalServicios;
import com.gell.gestioncartera.servicios.VariableGlobalServicios;
/**
 * 
 * @author TSI
 * Clase con los métodos donde se aplica la lógica para tabla comisional
 */
@Service
public class TablaComisionalServiciosImpl implements TablaComisionalServicios {

	@Autowired
	TablaComisionalRepositorio _repositorio;
	@Autowired
	TablaComisionalDetalleRepositorio _repositorioDetalle;
	
	/**
	 * @param Long id
	 * Método para busqueda de tabla comisional por id
	 * @return tabla comisional
	 */
	@Override
	public TablaComisional findById(Long id) {
		Optional<TablaComisional> item = _repositorio.findById(id);
		if (!item.isPresent()) {
			throw new NoDataFoundException();
		}
		return item.get();
	}
	
	/**
	 * 
	 * Método para listar tabla comisional
	 * @return lista tabla comisional
	 */
	@Override
	public List<TablaComisional> findByAll() {
		List<TablaComisional> items = (List<TablaComisional>)_repositorio.findAll();
		return items;
	}
	
	/**
	 * 
	 * Método para listar tabla comisional por empresa
	 * @return lista tabla comisional
	 */
	@Override
	public List<TablaComisional> findByEmpresasevemp(Long idEmpresa) {
		List<TablaComisional> items = (List<TablaComisional>)_repositorio.findByEmpresasevemp(idEmpresa);
		return items;
	}
	
	/**
	 * 
	 * Método para guardar tabla comisional
	 * @return registro creado
	 */
	@Override
	public TablaComisional save(TablaComisional item) {
		return _repositorio.save(item);
	}

	/**
	 * 
	 * Método para listar tabla comisional detalle
	 * @return lista tabla comisional detalle
	 */
	@Override
	public List<TablaComisionalDetalle> findByTcomidregistro(Long id) {
		List<TablaComisionalDetalle> items = (List<TablaComisionalDetalle>)_repositorioDetalle.findByTcomidregistro(id);
		return items;
	}

	/**
	 * 
	 * Método para guardar tabla comisional detalle
	 * @return registro creado
	 */
	@Override
	public TablaComisionalDetalle saveTablaComisionaDetalle(TablaComisionalDetalle item) {
		return _repositorioDetalle.save(item);
	}

	/**
	 * 
	 * Método para eliminar tabla comisional detalle
	 * @return void
	 */
	@Override
	public void deleteTablaComisionaDetalle(TablaComisionalDetalle item) {
		_repositorioDetalle.delete(item);
	}

	
}