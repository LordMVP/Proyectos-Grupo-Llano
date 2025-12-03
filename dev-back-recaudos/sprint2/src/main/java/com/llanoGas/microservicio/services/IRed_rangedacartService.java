package com.llanoGas.microservicio.services;

import java.util.List;

import com.llanoGas.microservicio.Entity.Red_rangedacart;

	
public interface IRed_rangedacartService {
	public List<Red_rangedacart> rangos();
	public List<Red_rangedacart> findById(int id);
	public  List<Red_rangedacart> save( List<Red_rangedacart> lista);
	
	public void delete(List<Red_rangedacart> lista);
}
