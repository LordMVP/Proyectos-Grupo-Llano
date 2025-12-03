package com.llanoGas.microservicio.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.llanoGas.microservicio.Entity.Par_parametro;
import com.llanoGas.microservicio.Entity.Prc_parecaudocomision;
import com.llanoGas.microservicio.model.dao.IPrc_parecaudocomision;

@Service
public class Prc_parecaudocomisionImpl implements IPrc_parecaudocomisionService {
	@Autowired
	private IPrc_parecaudocomision prc_parecaudocomisiondao;
	@Override
	public List<Prc_parecaudocomision> findAll() {
		// TODO Auto-generated method stub
		return prc_parecaudocomisiondao.findAll();
	}

	@Override
	public Prc_parecaudocomision findById(Integer id) {
		// TODO Auto-generated method stub
		return prc_parecaudocomisiondao.findById(id).orElse(null);
	}

	@Override
	public Prc_parecaudocomision save(Prc_parecaudocomision prc_parecaudocomision) {
		// TODO Auto-generated method stub
		return prc_parecaudocomisiondao.save(prc_parecaudocomision);
	}

	@Override
	public void delete(Integer id) {
		prc_parecaudocomisiondao.deleteById(id);
		
	}

	@Override
	public List<Prc_parecaudocomision> ConsultaR() {
		// TODO Auto-generated method stub
		return null;
	}

	
	@Override
	public int validar(int idTercero, int idConvenio) {
		// TODO Auto-generated method stub
		return prc_parecaudocomisiondao.validar(idTercero, idConvenio);
	}

	@Override
	public List<Prc_parecaudocomision> lista() {
		// TODO Auto-generated method stub
		return prc_parecaudocomisiondao.lista();
	}
	
	
	

}
