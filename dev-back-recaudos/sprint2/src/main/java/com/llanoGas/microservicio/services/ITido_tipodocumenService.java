package com.llanoGas.microservicio.services;

import java.util.List;

import com.llanoGas.microservicio.Entity.Tido_tipdocumen;;

public interface ITido_tipodocumenService {
	
	public Tido_tipdocumen findById(int id);
	public Tido_tipdocumen priorizarTipoDocumento(Tido_tipdocumen tipoDocumento);
	public List<Tido_tipdocumen> listaTipoDocument(  int usuario,  int empresa,  int programa);

}
