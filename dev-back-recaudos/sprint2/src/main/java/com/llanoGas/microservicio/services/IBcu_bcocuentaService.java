package com.llanoGas.microservicio.services;

import java.util.List;

import com.llanoGas.microservicio.Entity.Bcu_bcocuenta;

public interface IBcu_bcocuentaService {
	public List<Bcu_bcocuenta> convenios(int id,int unidad);
}
