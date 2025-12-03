package com.gell.gestioncartera.servicios.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.hibernate.result.NoMoreReturnsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gell.estandar.util.NombreUtil;
import com.gell.gestioncartera.entidades.Ejecutivo;
import com.gell.gestioncartera.entidades.EjecutivoSector;
import com.gell.gestioncartera.entidades.Orientacion;
import com.gell.gestioncartera.entidades.SectorComuna;
import com.gell.gestioncartera.excepciones.NoDataFoundException;
import com.gell.gestioncartera.repositorios.EjecutivoRepositorio;
import com.gell.gestioncartera.repositorios.EjecutivoSectorRepositorio;
import com.gell.gestioncartera.repositorios.OrientacionRepositorio;
import com.gell.gestioncartera.repositorios.SectorRepositorio;
import com.gell.gestioncartera.servicios.EjecutivoServicios;
import com.gell.gestioncartera.servicios.OrientacionServicios;
/**
 * 
 * @author TSI
 * Clase con los métodos donde se aplica la lógica para ejecutivos
 */
@Service
public class OrientacionServiciosImpl implements OrientacionServicios {

	@Autowired
	OrientacionRepositorio _repositorio;
	//@Autowired
	//EjecutivoSectorRepositorio _repositorioEecutivoSector;
	//@Autowired
	//SectorRepositorio _repositorioSector;
	
	/**
	 * @param Long id
	 * Método para busqueda de orientacion por id
	 * @return orientacion
	 */
	@Override
	public Orientacion findById(Long id) {
		Optional<Orientacion> item = _repositorio.findById(id);
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
	 * Método para listar todos las orientaciones
	 * @return lista orientaciones
	 */
	@Override
	public List<Orientacion> findByAll() {
		List<Orientacion> items = (List<Orientacion>)_repositorio.findAll();
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
//		String nombresectores = "";
//		for (Ejecutivo itemEjecutivo : items) {
//			List<String> sectores = new ArrayList<String>();
//			itemEjecutivo.setSectores(sectores);
//			for(EjecutivoSector itemEjecutivoSector : itemEjecutivo.getEjecutivoSectores()) {
//				
//				itemEjecutivo.getSectores().add(itemEjecutivoSector.getSecidregistro().toString());
//				Optional<SectorComuna>  sector = _repositorioSector.findById(itemEjecutivoSector.getSecidregistro());
//				if (sector.isPresent()) {
//					
//					if (sector != null) {
//						nombresectores+=sector.get().getSec_nombre() + ",";
//					}
//				}
//			}
//			if(nombresectores.endsWith(",")) {				
//				nombresectores = nombresectores.substring(0,nombresectores.length() - 1);
//			}
//			itemEjecutivo.setSectoresnombres(nombresectores);
//			nombresectores="";
//		}
		return items;
	}
	
	/**
	 * 
	 * Método para listar todos las orientaciones por empresa
	 * @return lista orientaciones
	 */
	@Override
	public List<Orientacion> findByEmpresasevemp(Long idEmpresa) {
		List<Orientacion> items = (List<Orientacion>)_repositorio.findByEmpresasevemp(idEmpresa);
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
//		String nombresectores = "";
//		for (Ejecutivo itemEjecutivo : items) {
//			List<String> sectores = new ArrayList<String>();
//			itemEjecutivo.setSectores(sectores);
//			for(EjecutivoSector itemEjecutivoSector : itemEjecutivo.getEjecutivoSectores()) {
//				
//				itemEjecutivo.getSectores().add(itemEjecutivoSector.getSecidregistro().toString());
//				Optional<SectorComuna>  sector = _repositorioSector.findById(itemEjecutivoSector.getSecidregistro());
//				if (sector.isPresent()) {
//					
//					if (sector != null) {
//						nombresectores+=sector.get().getSec_nombre() + ",";
//					}
//				}
//			}
//			if(nombresectores.endsWith(",")) {				
//				nombresectores = nombresectores.substring(0,nombresectores.length() - 1);
//			}
//			itemEjecutivo.setSectoresnombres(nombresectores);
//			nombresectores="";
//		}
		return items;
	}
	
	/**
	 * 
	 * Método para guardar orientacion y sus estrageias de la clasificacion de los ejecutivos
	 * 
	 * @return registro creado
	 */
	@Override
	public Orientacion save(Orientacion item) {
		Orientacion orientacion = _repositorio.save(item);
		
//		List<EjecutivoSector> ejecutivoSectores = (List<EjecutivoSector>) _repositorioEecutivoSector.findByEjeidregistro(ejecutivo.getEje_idregistro());
//		
//		if (item.getSectores() != null) {	
//			if(!ejecutivoSectores.isEmpty())
//				_repositorioEecutivoSector.deleteAll(ejecutivoSectores);
//			
//			for (String itemEjecutivo : item.getSectores()) {
//				EjecutivoSector itemESector = new EjecutivoSector();
//				itemESector.setEjeidregistro(ejecutivo.getEje_idregistro());
//				itemESector.setSecidregistro(Long.parseLong(itemEjecutivo));
//				_repositorioEecutivoSector.save(itemESector);
//			}
//		}
		

		return orientacion;
	}

	
}