package com.gell.gestioncartera.servicios.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.hibernate.result.NoMoreReturnsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gell.estandar.util.NombreUtil;
import com.gell.gestioncartera.entidades.Clasificacion;
import com.gell.gestioncartera.entidades.Condonacion;
import com.gell.gestioncartera.entidades.CondonacionDetalle;
import com.gell.gestioncartera.entidades.EdadCartera;
import com.gell.gestioncartera.entidades.Ejecutivo;
import com.gell.gestioncartera.entidades.EjecutivoSector;
import com.gell.gestioncartera.entidades.EstadoCartera;
import com.gell.gestioncartera.entidades.Estrategia;
import com.gell.gestioncartera.entidades.Orientacion;
import com.gell.gestioncartera.entidades.SectorComuna;
import com.gell.gestioncartera.excepciones.NoDataFoundException;
import com.gell.gestioncartera.repositorios.ClasificacionRepositorio;
import com.gell.gestioncartera.repositorios.CondonacionDetalleRepositorio;
import com.gell.gestioncartera.repositorios.CondonacionRepositorio;
import com.gell.gestioncartera.repositorios.EdadCarteraRepositorio;
import com.gell.gestioncartera.repositorios.EjecutivoRepositorio;
import com.gell.gestioncartera.repositorios.EjecutivoSectorRepositorio;
import com.gell.gestioncartera.repositorios.EstadoCarteraRepositorio;
import com.gell.gestioncartera.repositorios.EstrategiaRepositorio;
import com.gell.gestioncartera.repositorios.OrientacionRepositorio;
import com.gell.gestioncartera.repositorios.SectorRepositorio;
import com.gell.gestioncartera.servicios.ClasificacionServicios;
import com.gell.gestioncartera.servicios.CondonacionServicios;
import com.gell.gestioncartera.servicios.EdadCarteraServicios;
import com.gell.gestioncartera.servicios.EjecutivoServicios;
import com.gell.gestioncartera.servicios.EstadoCarteraServicios;
import com.gell.gestioncartera.servicios.EstrategiaServicios;
import com.gell.gestioncartera.servicios.OrientacionServicios;
/**
 * 
 * @author TSI
 * Clase con los métodos donde se aplica la lógica para condonacion
 */
@Service
public class CondonacionServiciosImpl implements CondonacionServicios {

	@Autowired
	CondonacionRepositorio _repositorio;
	@Autowired
	CondonacionDetalleRepositorio _repositorioDetalle;
	
	/**
	 * @param Long id
	 * Método para busqueda de condonacion por id
	 * @return condonacion
	 */
	@Override
	public Condonacion findById(Long id) {
		Optional<Condonacion> item = _repositorio.findById(id);
		if (!item.isPresent()) {
			throw new NoDataFoundException();
		}
		return item.get();
	}
	
	/**
	 * 
	 * Método para listar todos las condonaciones
	 * @return lista condonaciones
	 */
	@Override
	public List<Condonacion> findByAll() {
		List<Condonacion> items = (List<Condonacion>)_repositorio.findAll();
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
		return items;
	}
	
	/**
	 * 
	 * Método para guardar condonacion
	 * 
	 * @return registro creado
	 */
	@Override
	public Condonacion save(Condonacion item) {
		Condonacion condonacion = _repositorio.save(item);
		
		return condonacion;
	}

	/**
	 * 
	 * Método para guardar condonacion detalle
	 * 
	 * @return registro creado
	 */
	@Override
	public CondonacionDetalle saveDetale(CondonacionDetalle item) {
		CondonacionDetalle condonacionDetalle = _repositorioDetalle.save(item);
		
		return condonacionDetalle;
	}

	@Override
	public List<Condonacion> findByUsuarioyProceso(Long idUsuario, Long tipo) {
		List<Condonacion> items = (List<Condonacion>)_repositorio.findByUsuarioyProceso(idUsuario, tipo);

		return items;
	}

	@Override
	public List<CondonacionDetalle> findByUspuideregistr(Long uspuideregistr) {
		List<CondonacionDetalle> items = (List<CondonacionDetalle>)_repositorioDetalle.findByUspuideregistr(uspuideregistr);

		return items;
	}

	@Override
	public List<Condonacion> findByEmpresa(Long idEmpresa) {
		List<Condonacion> items = (List<Condonacion>)_repositorio.findByEmpresa(idEmpresa);

		return items;
	}

	@Override
	public CondonacionDetalle findByDetalleId(Long id) {
		Optional<CondonacionDetalle> item = _repositorioDetalle.findById(id);
		if (!item.isPresent()) {
			throw new NoDataFoundException();
		}
		return item.get();
	}
}