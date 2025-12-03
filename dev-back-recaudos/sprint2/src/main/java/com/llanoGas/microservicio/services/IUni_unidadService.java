package com.llanoGas.microservicio.services;

import java.util.List;

import com.llanoGas.microservicio.Entity.Uni_unidad;
import com.llanoGas.microservicio.Entity.Unidad_medpago;

public interface IUni_unidadService {
	  public List<Uni_unidad> convenios(String documento);
	  
	  
}
