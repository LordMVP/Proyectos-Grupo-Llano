package com.llanoGas.microservicio.services;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.llanoGas.microservicio.Entity.Con_concepto;
import com.llanoGas.microservicio.model.dao.ICon_concepto;
@Service
public class Con_conceptoImpl implements ICon_conceptoService {

	@Autowired
	private ICon_concepto conConcepto;
	@Override
	public Con_concepto findById(int id) {
		
		return conConcepto.findById(id).orElse(null);
	}

	@Override
	@Transactional
	public Con_concepto priorizarConcepto2(Con_concepto concepto) {
		// TODO Auto-generated method stub
		
		
		return conConcepto.save(concepto);
	}
	@Override
	public List<Con_concepto> listaConcepto(int usuario, int empresa,int programa) {
		// TODO Auto-generated method stub
		return conConcepto.listaConcepto(usuario, empresa, programa);
	}

}
