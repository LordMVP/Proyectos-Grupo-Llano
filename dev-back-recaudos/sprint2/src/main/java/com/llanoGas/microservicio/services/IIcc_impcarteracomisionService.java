package com.llanoGas.microservicio.services;

import java.util.List;

import com.llanoGas.microservicio.Entity.Icc_impcarteracomision;


public interface IIcc_impcarteracomisionService {
	public List<Icc_impcarteracomision> impuesto();
	public Icc_impcarteracomision findById(int id);
	public List<Icc_impcarteracomision> save(List<Icc_impcarteracomision> irc_imprecaudocomision);
	
	public void delete( List<Icc_impcarteracomision> irc_imprecaudocomision);

}
