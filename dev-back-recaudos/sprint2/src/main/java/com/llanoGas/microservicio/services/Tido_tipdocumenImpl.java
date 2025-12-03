package com.llanoGas.microservicio.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.llanoGas.microservicio.Entity.Tido_tipdocumen;
import com.llanoGas.microservicio.model.dao.ITido_tipdocumen;



@Service
public class Tido_tipdocumenImpl implements ITido_tipodocumenService{
	@Autowired
	ITido_tipdocumen tidoTipoDocument;

	@Override
	public Tido_tipdocumen findById(int id) {
		// TODO Auto-generated method stub
		return tidoTipoDocument.findById(id).orElse(null);
	}

	@Override
	public Tido_tipdocumen priorizarTipoDocumento(Tido_tipdocumen tipoDocumento) {
		// TODO Auto-generated method stub
		return tidoTipoDocument.save(tipoDocumento);
	}

	@Override
	public List<Tido_tipdocumen> listaTipoDocument(int usuario, int empresa, int programa) {
		// TODO Auto-generated method stub
		return tidoTipoDocument.listaTipoDocument(usuario, empresa,  programa);
	}

}
