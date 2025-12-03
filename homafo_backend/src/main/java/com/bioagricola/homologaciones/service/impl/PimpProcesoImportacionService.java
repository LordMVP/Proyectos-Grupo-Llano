package com.bioagricola.homologaciones.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.homologaciones.entity.PimpProcesoImportacion;
import com.bioagricola.homologaciones.repository.PimpProcesoImportacionRepository;

@Service
public class PimpProcesoImportacionService extends AbstractService<PimpProcesoImportacion, Long> {

	
	@Autowired
	private PimpProcesoImportacionRepository repository;
	
	public PimpProcesoImportacionService() {
		super(PimpProcesoImportacion.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected JpaRepository<PimpProcesoImportacion, Long> getRepository() {
		// TODO Auto-generated method stub
		return repository;
	}

	public Page<PimpProcesoImportacion> findByEstado(String estado,Pageable pageable) {
		// TODO Auto-generated method stub
		return this.repository.findByPimpEstado(estado,pageable);
	}

	
}
