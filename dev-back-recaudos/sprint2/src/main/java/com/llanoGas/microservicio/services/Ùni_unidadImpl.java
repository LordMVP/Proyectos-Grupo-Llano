package com.llanoGas.microservicio.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.llanoGas.microservicio.Entity.Uni_unidad;
import com.llanoGas.microservicio.model.dao.IUni_unidad;
@Service
public class Ùni_unidadImpl implements IUni_unidadService {
@Autowired
private IUni_unidad unidadDao;
	@Override
	public List<Uni_unidad> convenios(String documento) {
		// TODO Auto-generated method stub
		return unidadDao.convenios(documento);
	}

}
