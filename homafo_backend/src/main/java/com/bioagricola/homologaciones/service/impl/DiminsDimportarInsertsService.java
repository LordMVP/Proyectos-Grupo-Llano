package com.bioagricola.homologaciones.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.homologaciones.entity.DiminsDimportarInsertsEntity;
import com.bioagricola.homologaciones.repository.DiminsDimportarInsertsRepository;

@Service
public class DiminsDimportarInsertsService extends AbstractService<DiminsDimportarInsertsEntity,Long> {

	@Autowired
	private DiminsDimportarInsertsRepository diminsDimportarInsertsRepository;
	public DiminsDimportarInsertsService() {
		super(DiminsDimportarInsertsEntity.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected JpaRepository<DiminsDimportarInsertsEntity, Long> getRepository() {
		// TODO Auto-generated method stub
		return diminsDimportarInsertsRepository;
	}

	
}
