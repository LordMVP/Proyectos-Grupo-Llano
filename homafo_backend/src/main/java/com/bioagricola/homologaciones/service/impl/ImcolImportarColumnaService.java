package com.bioagricola.homologaciones.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.homologaciones.entity.ImcolImportarColumnaEntity;
import com.bioagricola.homologaciones.repository.ImcolImportarColumnaRepository;

@Service
public class ImcolImportarColumnaService extends AbstractService<ImcolImportarColumnaEntity,Long> {

	
	@Autowired
	private ImcolImportarColumnaRepository imcolImportarColumnaRepository;
	public ImcolImportarColumnaService() {
		super(ImcolImportarColumnaEntity.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected JpaRepository<ImcolImportarColumnaEntity, Long> getRepository() {
		// TODO Auto-generated method stub
		return imcolImportarColumnaRepository;
	}

}
