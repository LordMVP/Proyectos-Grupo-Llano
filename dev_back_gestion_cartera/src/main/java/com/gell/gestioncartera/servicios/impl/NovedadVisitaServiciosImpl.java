package com.gell.gestioncartera.servicios.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.hibernate.result.NoMoreReturnsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gell.estandar.util.NombreUtil;
import com.gell.gestioncartera.entidades.NovedadVisita;
import com.gell.gestioncartera.entidades.NovedadVisitaRecurso;
import com.gell.gestioncartera.entidades.Ejecutivo;
import com.gell.gestioncartera.entidades.EjecutivoSector;
import com.gell.gestioncartera.entidades.Orientacion;
import com.gell.gestioncartera.entidades.SectorComuna;
import com.gell.gestioncartera.excepciones.NoDataFoundException;
import com.gell.gestioncartera.repositorios.NovedadVisitaRepositorio;
import com.gell.gestioncartera.repositorios.EjecutivoRepositorio;
import com.gell.gestioncartera.repositorios.EjecutivoSectorRepositorio;
import com.gell.gestioncartera.repositorios.NovedadVisitaRecursoRepositorio;
import com.gell.gestioncartera.repositorios.OrientacionRepositorio;
import com.gell.gestioncartera.repositorios.SectorRepositorio;
import com.gell.gestioncartera.servicios.NovedadVisitaServicios;
import com.gell.gestioncartera.servicios.EjecutivoServicios;
import com.gell.gestioncartera.servicios.OrientacionServicios;
/**
 * 
 * @author TSI
 * Clase con los métodos donde se aplica la lógica para novedad visita
 */
@Service
public class NovedadVisitaServiciosImpl implements NovedadVisitaServicios {

	@Autowired
	NovedadVisitaRepositorio _repositorio;
	@Autowired
	NovedadVisitaRecursoRepositorio _repositorioNovedadVisitaRecurso;
	
	/**
	 * @param Long id
	 * Método para busqueda de NovedadVisita por id
	 * @return NovedadVisita
	 */
	@Override
	public NovedadVisita findById(Long id) {
		Optional<NovedadVisita> item = _repositorio.findById(id);
		if (!item.isPresent()) {
			throw new NoDataFoundException();
		}
		return item.get();
	}
	
	/**
	 * 
	 * Método para listar todos las NovedadVisitaes
	 * @return lista NovedadVisitaes
	 */
	@Override
	public List<NovedadVisita> findByAll() {
		List<NovedadVisita> items = (List<NovedadVisita>)_repositorio.findAll();
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
		return items;
	}
	
	/**
	 * 
	 * Método para listar todos las Novedad visitas por empresa
	 * @return lista Novedad Visitas
	 */
	@Override
	public List<NovedadVisita> findByEmpresasevemp(Long idEmpresa) {
		List<NovedadVisita> items = (List<NovedadVisita>)_repositorio.findByEmpresasevemp(idEmpresa);
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
		
		for(NovedadVisita itemNovedadVisita : items) {
			List<NovedadVisitaRecurso> itemsNovedadVisitaRecursos = (List<NovedadVisitaRecurso>) _repositorioNovedadVisitaRecurso.findByNvisidregistro(itemNovedadVisita.getNvis_idregistro());
			
			itemNovedadVisita.setListnovedadvisitarecursos(itemsNovedadVisitaRecursos);
		}
		return items;
	}
	
	/**
	 * 
	 * Método para guardar NovedadVisita
	 * 
	 * @return registro creado
	 */
	@Override
	public NovedadVisita save(NovedadVisita item) {
		NovedadVisita novedadVisita = _repositorio.save(item);
		
		if (item.getListnovedadvisitarecursos() != null) {
			for(NovedadVisitaRecurso itemNovedadVisitaRecurso : item.getListnovedadvisitarecursos()) {
				itemNovedadVisitaRecurso.setNvisidregistro(item.getNvis_idregistro());
			}
			_repositorioNovedadVisitaRecurso.saveAll(item.getListnovedadvisitarecursos());
		}

		return novedadVisita;
	}

	
}