package com.llanoGas.microservicio.services;
import java.util.List;

import com.llanoGas.microservicio.Entity.Par_parametro;
import com.llanoGas.microservicio.Entity.Prc_parecaudocomision;
public interface IPrc_parecaudocomisionService {
	
public List<Prc_parecaudocomision> findAll();
	
	public Prc_parecaudocomision findById(Integer id);
	
	public Prc_parecaudocomision save(Prc_parecaudocomision prc_parecaudocomision);
	
	public void delete(Integer id);
	
	public List<Prc_parecaudocomision> ConsultaR();
	public List<Prc_parecaudocomision> lista();

	  public int validar(int idTercero, int idConvenio);

}
