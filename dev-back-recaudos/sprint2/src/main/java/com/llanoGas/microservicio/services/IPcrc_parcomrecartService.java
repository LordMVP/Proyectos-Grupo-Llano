package com.llanoGas.microservicio.services;

import java.util.List;

import com.llanoGas.microservicio.Entity.Pcrc_parcomrecart;;

public interface IPcrc_parcomrecartService {
public Pcrc_parcomrecart findById(Integer id);
	
	public Pcrc_parcomrecart save(Pcrc_parcomrecart pcrc_parcomrecart);
	
	 public int validar(int idTercero, int idConvenio);
	 
	 public List<Pcrc_parcomrecart> lista();
}
