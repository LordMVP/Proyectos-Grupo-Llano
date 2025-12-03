package com.llanoGas.microservicio.services;
import java.util.List;

import org.springframework.data.repository.query.Param;

import com.llanoGas.microservicio.Entity.Con_concepto;
public interface ICon_conceptoService {
	public Con_concepto findById(int id);
	
	
	
	public Con_concepto priorizarConcepto2(Con_concepto concepto);
	public List<Con_concepto> listaConcepto(  int usuario,  int empresa, int programa);
	List<Con_concepto> impuesto( int clase, int empresa);
}
