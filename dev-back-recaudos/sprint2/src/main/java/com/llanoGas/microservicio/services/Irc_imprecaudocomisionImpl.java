package com.llanoGas.microservicio.services;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.llanoGas.microservicio.Entity.Irc_imprecaudocomision;
import com.llanoGas.microservicio.Entity.Prc_parecaudocomision;
import com.llanoGas.microservicio.model.dao.Iirc_imprecaudocomision;
import com.llanoGas.microservicio.services.Irc_imprecaudocomisionService;
@Service
public class Irc_imprecaudocomisionImpl implements Irc_imprecaudocomisionService {
	@Autowired
	Iirc_imprecaudocomision irc_imprecaudocomdao;

	@Override
	public List<Irc_imprecaudocomision> impuesto() {
		// TODO Auto-generated method stub
		return irc_imprecaudocomdao.findAll();
	}

	@Override
	public List<Irc_imprecaudocomision>  save(List<Irc_imprecaudocomision> irc_imprecaudocomisio) {
		// TODO Auto-generated method stub
		return  irc_imprecaudocomdao.saveAll(irc_imprecaudocomisio);
	}

	@Override
	public List<Irc_imprecaudocomision> datosestado1() {
		// TODO Auto-generated method stub
		return irc_imprecaudocomdao.datosestado1();
	}

	@Override
	public List<Prc_parecaudocomision> lista() {
		// TODO Auto-generated method stub
		return lista();
	}

	@Override
	public Irc_imprecaudocomision findById(int id) {
		// TODO Auto-generated method stub
		return irc_imprecaudocomdao.findById(id).orElse(null);
	}

	@Override
	public void delete(List<Irc_imprecaudocomision> lista ) {
		irc_imprecaudocomdao.deleteAll(lista);;
		
	}

}
