package com.llanoGas.microservicio.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.llanoGas.microservicio.Entity.Icc_impcarteracomision;
import com.llanoGas.microservicio.Entity.Irc_imprecaudocomision;
import com.llanoGas.microservicio.model.dao.IIcc_impcarteracomision;

@Service
public class Icc_impcarteracomisionImpl  implements IIcc_impcarteracomisionService{
	
	@Autowired
	IIcc_impcarteracomision Icc_impcarteracomision;

	@Override
	public List<Icc_impcarteracomision> save(List<Icc_impcarteracomision> icc_impcarteracomision) {
		// TODO Auto-generated method stub
		return Icc_impcarteracomision.saveAll(icc_impcarteracomision);
	}

	@Override
	public List<Icc_impcarteracomision> impuesto() {
		// TODO Auto-generated method stub
		return Icc_impcarteracomision.findAll() ;
	}

	@Override
	public Icc_impcarteracomision findById(int id) {
		// TODO Auto-generated method stub
		return Icc_impcarteracomision.findById(id).orElse(null);
	}

	@Override
	public void delete(List<Icc_impcarteracomision> icc_impcarteracomision) {
		Icc_impcarteracomision.deleteAll(icc_impcarteracomision);
		
	}

}
