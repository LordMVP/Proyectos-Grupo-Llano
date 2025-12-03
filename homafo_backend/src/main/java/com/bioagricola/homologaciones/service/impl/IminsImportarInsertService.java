package com.bioagricola.homologaciones.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.homologaciones.entity.IminsImportarInsertsEntity;
import com.bioagricola.homologaciones.repository.IminsImportarInsertsRepository;

@Service
public class IminsImportarInsertService extends AbstractService<IminsImportarInsertsEntity, Long> {

	@Autowired
	private IminsImportarInsertsRepository iminsImportarInsertsRepository;
	public IminsImportarInsertService() {
		super(IminsImportarInsertsEntity.class);
		// TODO Auto-generated constructor stub
	}
	@Override
	protected JpaRepository<IminsImportarInsertsEntity, Long> getRepository() {
		// TODO Auto-generated method stub
		return iminsImportarInsertsRepository;
	}
	
	

}
