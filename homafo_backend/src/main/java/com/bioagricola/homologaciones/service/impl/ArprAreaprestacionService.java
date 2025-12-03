package com.bioagricola.homologaciones.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.homologaciones.entity.ArprAreaprestacion;
import com.bioagricola.homologaciones.entity.specs.ArprAreaprestacionSpecifications;
import com.bioagricola.homologaciones.repository.ArprAreaprestacionRepository;

@Service
public class ArprAreaprestacionService extends AbstractService<ArprAreaprestacion,Long> {

	@Autowired
	private ArprAreaprestacionRepository arprRepository;
	public ArprAreaprestacionService() {
		super(ArprAreaprestacion.class);
		// TODO Auto-generated constructor stub
	}
	
	
	@Override
	protected JpaRepository<ArprAreaprestacion, Long> getRepository() {
		// TODO Auto-generated method stub
		return this.arprRepository;
	}
	
	public Page<ArprAreaprestacion> findAllByEmpresa(Integer empIderegistro,Pageable pageable){
		return this.arprRepository.findAll(ArprAreaprestacionSpecifications.byEmpresa(empIderegistro), pageable);
	}
	

}
