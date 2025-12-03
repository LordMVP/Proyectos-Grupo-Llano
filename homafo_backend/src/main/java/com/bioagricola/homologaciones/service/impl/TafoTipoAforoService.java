package com.bioagricola.homologaciones.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.homologaciones.controller.generic.EntityNotFoundException;
import com.bioagricola.homologaciones.entity.TafoTipoAforo;
import com.bioagricola.homologaciones.entity.specs.TafoTipoAforoSpecifications;
import com.bioagricola.homologaciones.repository.TafoTipoAforoRepository;

@Service
public class TafoTipoAforoService extends AbstractService<TafoTipoAforo, Long> {

	@Autowired
	private TafoTipoAforoRepository tipoAforoRepository;
	
	public TafoTipoAforoService() {
		// TODO Auto-generated constructor stub
		super(TafoTipoAforo.class);
	}
	
	public TafoTipoAforo findById(Long id) {
		return tipoAforoRepository.findById(id).orElseThrow(()->new EntityNotFoundException(TafoTipoAforo.class,"Id"));
	}

	public Page<TafoTipoAforo> findAll(Pageable pageable,Optional<String> search) {
		return this.tipoAforoRepository.findAll(TafoTipoAforoSpecifications.byLikeNombre(search.orElse("")),pageable);
	}

	public Page<TafoTipoAforo> findAll(Pageable pageable,Optional<String> search,Optional<String> filter) {
		Specification<TafoTipoAforo> e= null;		
		if(filter.isPresent() && filter.get().split(",").length ==2){
			String[] propiedad  =  filter.get().split(",");
			e = Specification.where(
				TafoTipoAforoSpecifications.byLikeNombre(search.orElse(""))
				.or(TafoTipoAforoSpecifications.byLikeCodigo(search.orElse("")))
				.and(TafoTipoAforoSpecifications.byPropiedadJson(propiedad[0],propiedad[1])));
				
		}else {
			e = Specification.where(TafoTipoAforoSpecifications.byLikeNombre(search.orElse("")).or(TafoTipoAforoSpecifications.byLikeCodigo(search.orElse(""))));
		}

		return this.tipoAforoRepository.findAll(e,pageable);
	}

	public TafoTipoAforo save(TafoTipoAforo tipoAforo) {
		return this.tipoAforoRepository.save(tipoAforo);
		
	}

	@Override
	protected JpaRepository<TafoTipoAforo, Long> getRepository() {
		// TODO Auto-generated method stub
		return this.tipoAforoRepository;
	}
}
