package com.bioagricola.homologaciones.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.homologaciones.entity.HrrHorrecoleccionEntity;
import com.bioagricola.homologaciones.repository.HrrHorrecoleccionRepositoryHom;

@Service
public class HrrHorrecoleccionService extends AbstractService<HrrHorrecoleccionEntity, Long> {

	@Autowired
	private HrrHorrecoleccionRepositoryHom hrrRepository;
	
	public HrrHorrecoleccionService() {
		super(HrrHorrecoleccionEntity.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected JpaRepository<HrrHorrecoleccionEntity, Long> getRepository() {
		// TODO Auto-generated method stub
		return hrrRepository;
	}
	
	

}
