package com.llanoGas.microservicio.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.llanoGas.microservicio.Entity.Dicn_disconven;
import com.llanoGas.microservicio.model.dao.IDicn_disconven;;
@Service
public class Dicn_disconvenImpl implements IDicn_disconvenService{

	@Autowired
	IDicn_disconven disconv;
	
	@Override
	public Dicn_disconven findById(int id) {
		// TODO Auto-generated method stub
		return disconv.findById(id).orElse(null);
	}

	@Override
	public Dicn_disconven priorizarDinsConven(Dicn_disconven disconve) {
		// TODO Auto-generated method stub
		return disconv.save(disconve);
	}

	@Override
	public List<Dicn_disconven> listaDinsConven(int programa) {
		// TODO Auto-generated method stub
		return disconv.listaDinsConven(programa);
	}

	@Override
	public Dicn_disconven FilaDinsConven(int empresa, int idconvenio) {
		// TODO Auto-generated method stub
		return disconv.FilaDinsConven(empresa, idconvenio);
	}

}
