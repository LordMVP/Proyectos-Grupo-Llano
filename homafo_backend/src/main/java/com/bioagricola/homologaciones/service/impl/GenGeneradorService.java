package com.bioagricola.homologaciones.service.impl;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.homologaciones.controller.generic.EntityNotFoundException;
import com.bioagricola.homologaciones.entity.GenGenerador;
import com.bioagricola.homologaciones.entity.specs.GenGeneradorSpecifications;
import com.bioagricola.homologaciones.repository.GenGeneradorRepository;

@Service
public class GenGeneradorService extends AbstractService<GenGenerador, Long> {

	public GenGeneradorService() {
		super(GenGenerador.class);
	}

	@Autowired
	private GenGeneradorRepository generadorRepository;

	public GenGenerador findById(Long id) {
		return this.generadorRepository.findById(id).orElseThrow(()->new EntityNotFoundException(GenGenerador.class,"id"));
	}

	/*public GenGenerador save(GenGenerador generador) {
		return this.generadorRepository.save(generador);
	}*/

	public Page<GenGenerador> findAll(Pageable pageable,Optional<String> search) {
		return this.generadorRepository.findAll(GenGeneradorSpecifications.byLikeNombre(search.orElse("")),pageable);
	}

	public Page<GenGenerador> findAll(Pageable pageable,Optional<String> search,Optional<String> filter) {

		Specification<GenGenerador> e= null;
		if(filter.isPresent() && filter.get().split(",").length ==2){
			String[] propiedad  =  filter.get().split(",");
			e = Specification.where(
				GenGeneradorSpecifications.byLikeNombre(search.orElse(""))
				.or(GenGeneradorSpecifications.byLikeCodigo(search.orElse("")))
				.and(GenGeneradorSpecifications.byPropiedadJson(propiedad[0],propiedad[1])));

		}else {
			e = Specification.where(GenGeneradorSpecifications.byLikeNombre(search.orElse("")).or(GenGeneradorSpecifications.byLikeCodigo(search.orElse(""))));
		}

		return this.generadorRepository.findAll(e,pageable);
	}

	@Override
	protected JpaRepository<GenGenerador, Long> getRepository() {
		// TODO Auto-generated method stub
		return this.generadorRepository;
	}

	public List<GenGenerador> findByVolumenGenerado(Double volumenGenerado){
		//Pageable pageable = PageRequest.of(0, 10);
		Specification<GenGenerador> e = Specification.where(GenGeneradorSpecifications.byVolumenGenerado(volumenGenerado)).and(GenGeneradorSpecifications.byPropiedadJson("estado", "A"));
		return this.generadorRepository.findAll(e);
		//return this.generadorRepository.findByVolumenGenerado(volumenGenerado, pageable);
	}
	
	public List<GenGenerador> findByVolumenGeneradoAndClaseAforo(Double volumenGenerado,Long claseAforo){
		//Pageable pageable = PageRequest.of(0, 10);
		Specification<GenGenerador> e = Specification.where(GenGeneradorSpecifications.byVolumenGenerado(volumenGenerado)).and(GenGeneradorSpecifications.byPropiedadJson("estado", "A").and(GenGeneradorSpecifications.byClaseAforo(claseAforo)));
		this.generadorRepository.findAll(
				Specification.where(GenGeneradorSpecifications.byVolumenGenerado(volumenGenerado))
				.and(GenGeneradorSpecifications.byPropiedadJson("estado", "A")
				)).stream().forEach(b->System.out.println("ID GENERADOR:"+b.getGenIderegistro()));
		return this.generadorRepository.findAll(e);
		//return this.generadorRepository.findByVolumenGenerado(volumenGenerado, pageable);
	}
	
	public List<GenGenerador> listaGeneradorByVolumen(Double volumen){
		return this.generadorRepository.findByVolumenGenerado(volumen);
	}

	public String tipoGeneradorOficialComercialResidencial(Long dsus) {
		return this.generadorRepository.obtenerGeneradorOficialByDsus(dsus);
	}
	
	
}
