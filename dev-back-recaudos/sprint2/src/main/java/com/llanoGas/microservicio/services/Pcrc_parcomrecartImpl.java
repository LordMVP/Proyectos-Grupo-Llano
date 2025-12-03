package com.llanoGas.microservicio.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.llanoGas.microservicio.Entity.Pcrc_parcomrecart;
import com.llanoGas.microservicio.model.dao.IPcrc_parcomrecart;
@Service
public class Pcrc_parcomrecartImpl  implements IPcrc_parcomrecartService{
	@Autowired
	private IPcrc_parcomrecart pcrc_parcomrecartdao;
	@Override
	public Pcrc_parcomrecart findById(Integer id) {
		// TODO Auto-generated method stub
		return pcrc_parcomrecartdao.findById(id).orElse(null);
	}

	@Override
	public Pcrc_parcomrecart save(Pcrc_parcomrecart pcrc_parcomrecart) {
		// TODO Auto-generated method stub
		return pcrc_parcomrecartdao.save(pcrc_parcomrecart);
	}

	@Override
	public int validar(int idTercero, int idConvenio) {
		// TODO Auto-generated method stub
		return pcrc_parcomrecartdao.validar(idTercero, idConvenio);
	}

	@Override
	public List<Pcrc_parcomrecart> lista() {
		// TODO Auto-generated method stub
		return pcrc_parcomrecartdao.lista();
	}


}
