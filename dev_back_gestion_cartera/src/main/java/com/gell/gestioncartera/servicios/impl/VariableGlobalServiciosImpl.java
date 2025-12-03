package com.gell.gestioncartera.servicios.impl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gell.gestioncartera.dto.VariableGlobalDto;
import com.gell.gestioncartera.entidades.Ejecutivo;
import com.gell.gestioncartera.entidades.TablaComisional;
import com.gell.gestioncartera.entidades.Unidad;
import com.gell.gestioncartera.entidades.VariableGlobal;
import com.gell.gestioncartera.excepciones.NoDataFoundException;
import com.gell.gestioncartera.repositorios.EjecutivoRepositorio;
import com.gell.gestioncartera.repositorios.TablaComisionalRepositorio;
import com.gell.gestioncartera.repositorios.UnidadRepositorio;
import com.gell.gestioncartera.repositorios.VariableGlobalRepositorio;
import com.gell.gestioncartera.servicios.EjecutivoServicios;
import com.gell.gestioncartera.servicios.TablaComisionalServicios;
import com.gell.gestioncartera.servicios.VariableGlobalServicios;

@Service
public class VariableGlobalServiciosImpl implements VariableGlobalServicios {

	@Autowired
	VariableGlobalRepositorio _repositorio;
	
	@Autowired
	UnidadRepositorio _repositorioUnidad;

	@Override
	public VariableGlobal findById(Long id) {
		Optional<VariableGlobal> item = _repositorio.findById(id);
		if (!item.isPresent()) {
			throw new NoDataFoundException();
		}
		return item.get();
	}

	@Override
	public List<VariableGlobal> findByAll() {
		List<VariableGlobal> items = (List<VariableGlobal>)_repositorio.findAll();
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
		return items;
	}
	
	@Override
	public List<VariableGlobalDto> findByAllDto(Long idEmpresa) {
		List<VariableGlobal> items = (List<VariableGlobal>)_repositorio.findByEmpresasevemp(idEmpresa);
		if (items.size() == 0){
			throw new NoDataFoundException();
		}
		List<VariableGlobalDto> itemsDto = new ArrayList<VariableGlobalDto>();
		for (VariableGlobal variableGlobal : items) {
			VariableGlobalDto itemDto = new VariableGlobalDto();
			Unidad unidad = null;
			if(variableGlobal.getUni_atrmaestrocartera() != null && variableGlobal.getUni_atrmaestrocartera() > 0)  {				
				itemDto.setUni_atrmaestrocartera(variableGlobal.getUni_atrmaestrocartera());
				unidad = _repositorioUnidad.findById(variableGlobal.getUni_atrmaestrocartera()).get();
				itemDto.setUni_nombreatrmaestrocartera(unidad != null ?  unidad.getUninombre() : "");
			}
			
			if (variableGlobal.getUni_origenmetodo() != null && variableGlobal.getUni_origenmetodo() > 0) {				
				unidad = _repositorioUnidad.findById(variableGlobal.getUni_origenmetodo()).get();
				itemDto.setUni_origenmetodo(variableGlobal.getUni_origenmetodo());
				itemDto.setUni_nombreorigenmetodo(unidad != null ? unidad.getUninombre() : "");
			}
			
			if (variableGlobal.getUni_tipodato() != null && variableGlobal.getUni_tipodato() > 0) {	
				unidad = _repositorioUnidad.findById(variableGlobal.getUni_tipodato()).get();
				itemDto.setUni_tipodato(variableGlobal.getUni_tipodato());
				itemDto.setUni_nombretipodato(unidad != null ? unidad.getUninombre() : "");
			}
			
			if (variableGlobal.getUni_tipometodo() != null && variableGlobal.getUni_tipometodo() > 0) {	
				unidad = _repositorioUnidad.findById(variableGlobal.getUni_tipometodo()).get();
				itemDto.setUni_tipometodo(variableGlobal.getUni_tipometodo());
				itemDto.setUni_nombretipometodo(unidad != null ? unidad.getUninombre(): "");
			}
			
			itemDto.setVglo_esatrmaestrocartera(variableGlobal.isVglo_esatrmaestrocartera());
			itemDto.setVglo_esvalorconstante(variableGlobal.isVglo_esvalorconstante());
			itemDto.setVglo_esvcalculado(variableGlobal.isVglo_esvcalculado());
			itemDto.setVglo_idregistro(variableGlobal.getVglo_idregistro());
			itemDto.setVglo_descripcion(variableGlobal.getVglo_descripcion());
			itemDto.setVglo_valorconstante(variableGlobal.getVglo_valorconstante());
			
			itemsDto.add(itemDto);
			
		}
		return itemsDto;
	}


	@Override
	public VariableGlobal save(VariableGlobal item) {
		if (item.getUni_atrmaestrocartera() != null)
			if (item.getUni_atrmaestrocartera() < 0) item.setUni_atrmaestrocartera(null);
		
		if (item.getUni_origenmetodo() != null)
			if (item.getUni_origenmetodo() < 0) item.setUni_origenmetodo(null);
		
		if (item.getUni_tipometodo() != null)
			if (item.getUni_tipometodo() < 0) item.setUni_tipometodo(null);
		
		if (item.getUni_tipodato() != null)
			if (item.getUni_tipodato() < 0) item.setUni_tipometodo(null);


		return _repositorio.save(item);
	}

	
}