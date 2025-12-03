package com.llanoGas.microservicio.services;

import java.util.List;

import com.llanoGas.microservicio.Entity.Dicn_disconven;;

public interface IDicn_disconvenService {
	public Dicn_disconven findById(int id);
	public Dicn_disconven priorizarDinsConven(Dicn_disconven disconve);
	   public List<Dicn_disconven> listaDinsConven(int programa);
	   public Dicn_disconven FilaDinsConven(int empresa,int idconvenio);

}
