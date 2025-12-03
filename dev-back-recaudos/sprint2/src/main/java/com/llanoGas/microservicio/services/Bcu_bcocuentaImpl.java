package com.llanoGas.microservicio.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.llanoGas.microservicio.Entity.Bcu_bcocuenta;
import com.llanoGas.microservicio.model.dao.IBcu_bcoCuenta;;


@Service
public class Bcu_bcocuentaImpl implements IBcu_bcocuentaService {
	@Autowired
	private IBcu_bcoCuenta bcu_bcoCuentadao;

	@Override
	public List<Bcu_bcocuenta> convenios(int id, int unidad) {
		// TODO Auto-generated method stub
		 return  bcu_bcoCuentadao.convenios( id,  unidad);
	}
	

}
