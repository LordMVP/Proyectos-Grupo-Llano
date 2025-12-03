package com.gell.gestioncartera.servicios.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.hibernate.result.NoMoreReturnsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gell.estandar.util.NombreUtil;
import com.gell.gestioncartera.entidades.Clasificacion;
import com.gell.gestioncartera.entidades.Ejecutivo;
import com.gell.gestioncartera.entidades.EjecutivoSector;
import com.gell.gestioncartera.entidades.Estrategia;
import com.gell.gestioncartera.entidades.EstrategiaClasificacion;
import com.gell.gestioncartera.entidades.Orientacion;
import com.gell.gestioncartera.entidades.SectorComuna;
import com.gell.gestioncartera.excepciones.NoDataFoundException;
import com.gell.gestioncartera.repositorios.ClasificacionRepositorio;
import com.gell.gestioncartera.repositorios.EjecutivoRepositorio;
import com.gell.gestioncartera.repositorios.EjecutivoSectorRepositorio;
import com.gell.gestioncartera.repositorios.EstrategiaClasificacionRepositorio;
import com.gell.gestioncartera.repositorios.EstrategiaRepositorio;
import com.gell.gestioncartera.repositorios.OrientacionRepositorio;
import com.gell.gestioncartera.repositorios.SectorRepositorio;
import com.gell.gestioncartera.servicios.ClasificacionServicios;
import com.gell.gestioncartera.servicios.EjecutivoServicios;
import com.gell.gestioncartera.servicios.EstrategiaServicios;
import com.gell.gestioncartera.servicios.OrientacionServicios;
/**
 * 
 * @author TSI
 * Clase con los métodos donde se aplica la lógica para estrategia
 */
@Service
public class EstrategiaServiciosImpl implements EstrategiaServicios {

	@Autowired
	EstrategiaRepositorio _repositorio;
	@Autowired
	EstrategiaClasificacionRepositorio _repositorioEstrategiaRepositorio;
	//@Autowired
	//SectorRepositorio _repositorioSector;
	
	/**
	 * @param Long id
	 * Método para busqueda de Estrategia por id
	 * @return Estrategia
	 */
	@Override
	public Estrategia findById(Long id) {
		Optional<Estrategia> item = _repositorio.findById(id);
		if (!item.isPresent()) {
			throw new NoDataFoundException();
		}
//		List<String> sectores = new ArrayList<String>();
//		item.get().setSectores(sectores);
//		List<EjecutivoSector> ejecutivoSectores = (List<EjecutivoSector>) _repositorioEecutivoSector.findByEjeidregistro(id);
//		for (EjecutivoSector itemEjecutivoSector : ejecutivoSectores) {
//			item.get().getSectores().add(itemEjecutivoSector.getSecidregistro().toString());
//		}
		return item.get();
	}
	
	/**
	 * 
	 * Método para listar todos las Estrategias
	 * @return lista Estrategias
	 */
	@Override
	public List<Estrategia> findByAll() {
		List<Estrategia> items = (List<Estrategia>)_repositorio.findAll();
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
		for (Estrategia itemEstrategia : items) {
			List<String> clasificaciones = new ArrayList<String>();
			itemEstrategia.setClasificaciones(clasificaciones);
			for(EstrategiaClasificacion itemEstrategiaClasificacion : itemEstrategia.getEstrategiaClasificaciones()) {			
				itemEstrategia.getClasificaciones().add(itemEstrategiaClasificacion.getEstidregistro().toString());
			}
		}
		return items;
	}
	
	/**
	 * 
	 * Método para listar todos las Estrategias por empresa
	 * @return lista Estrategias
	 */
	@Override
	public List<Estrategia> findByEmpresasevemp(Long idEmpresa) {
		List<Estrategia> items = (List<Estrategia>)_repositorio.findByEmpresasevemp(idEmpresa);
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
		for (Estrategia itemEstrategia : items) {
			List<String> clasificaciones = new ArrayList<String>();
			itemEstrategia.setClasificaciones(clasificaciones);
			for(EstrategiaClasificacion itemEstrategiaClasificacion : itemEstrategia.getEstrategiaClasificaciones()) {			
				itemEstrategia.getClasificaciones().add(itemEstrategiaClasificacion.getUni_unidadclasificacion().toString());
			}
		}
		return items;
	}
	
	
	/**
	 * 
	 * Método para guardar Estrategia 
	 * 
	 * @return registro creado
	 */
	@Override
	public Estrategia save(Estrategia item) {
		Estrategia estrategia = _repositorio.save(item);
		
		List<EstrategiaClasificacion> estrategiaClasificaciones = (List<EstrategiaClasificacion>) _repositorioEstrategiaRepositorio.findByEstidregistro(estrategia.getEst_idregistro());
//		
		if (item.getClasificaciones() != null) {	
			if(!estrategiaClasificaciones.isEmpty())
			_repositorioEstrategiaRepositorio.deleteAll(estrategiaClasificaciones);
			
			for (String itemEstrategia : item.getClasificaciones()) {
				EstrategiaClasificacion itemEClasificacion = new EstrategiaClasificacion();
				itemEClasificacion.setEstidregistro(estrategia.getEst_idregistro());
				itemEClasificacion.setUni_unidadclasificacion(Long.parseLong(itemEstrategia));
				_repositorioEstrategiaRepositorio.save(itemEClasificacion);
			}
		}
		

		return estrategia;
	}
	
}