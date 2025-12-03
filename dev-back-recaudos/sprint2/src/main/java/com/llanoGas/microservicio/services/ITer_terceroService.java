package com.llanoGas.microservicio.services;

import java.util.List;

import com.llanoGas.microservicio.Entity.Par_parametro;
import com.llanoGas.microservicio.Entity.Ter_tercero;

public interface ITer_terceroService {
	
	public Par_parametro parametro(int empresa);
	
	  public List<Ter_tercero> TerceroEntidad(int unidad,int programa,int usuario);

}
