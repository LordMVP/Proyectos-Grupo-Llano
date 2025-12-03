package com.llanoGas.microservicio.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.llanoGas.microservicio.Entity.Par_parametro;
import com.llanoGas.microservicio.Entity.Ter_tercero;
import com.llanoGas.microservicio.model.dao.Iter_tercero;

import com.llanoGas.microservicio.model.dao.IPar_parametro;
@Service
public class Ter_terceroImpl implements ITer_terceroService{
	
	@Autowired
	private Iter_tercero tercerodao;
	
	@Autowired
	private IPar_parametro parametrodao;

	@Override
	public Par_parametro parametro(int empresa) {
		// TODO Auto-generated method stub
		return parametrodao.parametro(empresa);
	}

	@Override
	public List<Ter_tercero> TerceroEntidad(int unidad, int programa, int usuario) {
		return tercerodao.TerceroEntidad(unidad, programa, usuario);
	}

}
