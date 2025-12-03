package com.llanoGas.microservicio.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.llanoGas.microservicio.Entity.Con_concepto;
import com.llanoGas.microservicio.Entity.Doc_documento;
import com.llanoGas.microservicio.model.dao.IDoc_documento;;

@Service
public class Doc_documentoImpl implements IDoc_documentoService {
	
	@Autowired
	private IDoc_documento doDocumento;

	@Override
	public Doc_documento priorizarDocumento(Doc_documento documento) {
		// TODO Auto-generated method stub
		return doDocumento.save(documento);
	}

	@Override
	public List<Doc_documento> listaDocumento(int usuario, int empresa, int programa) {
		// TODO Auto-generated method stub
		return doDocumento.listaDocumento(usuario, empresa, programa);
	}

	@Override
	public Doc_documento findById(int id) {
		// TODO Auto-generated method stub
		return doDocumento.findById(id).orElse(null);
	}

}
