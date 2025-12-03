package com.llanoGas.microservicio.services;

import java.util.List;

import com.llanoGas.microservicio.Entity.Con_concepto;
import com.llanoGas.microservicio.Entity.Doc_documento;

public interface IDoc_documentoService {
	public Doc_documento findById(int id);
	public Doc_documento priorizarDocumento(Doc_documento documento);
	public List<Doc_documento> listaDocumento(  int usuario,  int empresa, int programa);

}
