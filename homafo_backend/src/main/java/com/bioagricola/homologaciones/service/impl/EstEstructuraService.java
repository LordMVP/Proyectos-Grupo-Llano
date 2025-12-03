package com.bioagricola.homologaciones.service.impl;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.common.entity.EstEstructura;
import com.bioagricola.common.repository.EstEstructuraRepository;
import com.bioagricola.homologaciones.controller.generic.EntityNotFoundException;
import com.bioagricola.homologaciones.entity.specs.EstEstructuraSpecifications;

@Service
public class EstEstructuraService extends AbstractService<EstEstructura, Long>{
	
	public EstEstructuraService() {
		// TODO Auto-generated constructor stub
		super(EstEstructura.class);
	}
	@Autowired
	private EstEstructuraRepository repository;
	
	public EstEstructura getByClaseAndEmpresa(Long clase,Long empresa) {
		return this.repository.findOne(EstEstructuraSpecifications.byClaseAndEmpresa(clase, empresa)).orElseThrow(()->new EntityNotFoundException(EstEstructura.class , "clase","empresa"));
	}

	@Override
	protected JpaRepository<EstEstructura, Long> getRepository() {
		// TODO Auto-generated method stub
		return this.repository;
	}

}
