package com.gell.gestioncartera.servicios.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gell.gestioncartera.entidades.Ejecutivo;
import com.gell.gestioncartera.entidades.MetaGestion;
import com.gell.gestioncartera.entidades.MetaGestionDetalle;
import com.gell.gestioncartera.entidades.TablaComisional;
import com.gell.gestioncartera.entidades.VariableGlobal;
import com.gell.gestioncartera.excepciones.NoDataFoundException;
import com.gell.gestioncartera.repositorios.EjecutivoRepositorio;
import com.gell.gestioncartera.repositorios.MetaGestionDetalleRepositorio;
import com.gell.gestioncartera.repositorios.MetaGestionRepositorio;
import com.gell.gestioncartera.repositorios.TablaComisionalRepositorio;
import com.gell.gestioncartera.repositorios.VariableGlobalRepositorio;
import com.gell.gestioncartera.servicios.EjecutivoServicios;
import com.gell.gestioncartera.servicios.MetaGestionServicios;
import com.gell.gestioncartera.servicios.TablaComisionalServicios;
import com.gell.gestioncartera.servicios.VariableGlobalServicios;
/**
 * 
 * @author TSI
 * Clase con los metodos donde se aplica la lógica para metas de gestión
 */
@Service
public class MetaGestionServiciosImpl implements MetaGestionServicios {

	@Autowired
	MetaGestionRepositorio _repositorio;
	@Autowired
	MetaGestionDetalleRepositorio _repositorioMetaGestionDetalle;
	
	/**
	 * @param Long id
	 * Método para busqueda de la meta de gestión por id
	 * @return meta de gestión
	 */
	@Override
	public MetaGestion findById(Long id) {
		Optional<MetaGestion> item = _repositorio.findById(id);
		if (!item.isPresent()) {
			throw new NoDataFoundException();
		}
		return item.get();
	}
	
	/**
	 * 
	 * Método para listar todas las metas de gestión
	 * @return lista metas de gestión
	 */
	@Override
	public List<MetaGestion> findByAll() {
		List<MetaGestion> items = (List<MetaGestion>)_repositorio.findAll();
		return items;
	}
	
	/**
	 * 
	 * Método para listar todas las metas de gestión por empresa
	 * @return lista metas de gestión
	 */
	@Override
	public List<MetaGestion>  findByEmpresasevemp(Long idEmpresa) {
		List<MetaGestion> items = (List<MetaGestion>)_repositorio.findByEmpresasevemp(idEmpresa);
		return items;
	}
	
	/**
	 * 
	 * Método para guardar la meta de gestión
	 * @return registro creado
	 */
	@Override
	public MetaGestion save(MetaGestion item) {
		return _repositorio.save(item);
	}
	
	/**
	 * 
	 * Método para listar todas las metas de gestión detalle
	 * @return lista metas de gestión detalle
	 */
	@Override
	public List<MetaGestionDetalle> findByMegeidregistro(Long id) {
		List<MetaGestionDetalle> items = (List<MetaGestionDetalle>)_repositorioMetaGestionDetalle.findByMegeidregistro(id);
		return items;
	}
	
	/**
	 * 
	 * Método para guardar la meta de gestión detalle
	 * @return registro creado
	 */
	@Override
	public MetaGestionDetalle saveMetaGestionDetalle(MetaGestionDetalle item) {
		return _repositorioMetaGestionDetalle.save(item);
	}

	@Override
	public void deleteMetaGestionDetalle(MetaGestionDetalle item) {
		_repositorioMetaGestionDetalle.delete(item);
		
	}

	
}