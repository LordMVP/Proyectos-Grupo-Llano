package com.llanoGas.microservicio.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.llanoGas.microservicio.Entity.Red_rangedacart;

import com.llanoGas.microservicio.model.dao.IRed_rangedacart;
@Service
public class Red_rangedacartImpl  implements IRed_rangedacartService{
@Autowired
IRed_rangedacart red_rangedacartdao;
	@Override
	public List<Red_rangedacart> rangos() {
		// TODO Auto-generated method stub
		return red_rangedacartdao.findAll();
	}

	@Override
	public List<Red_rangedacart> findById(int id) {
		// TODO Auto-generated method stub
		return  red_rangedacartdao.findAll();
	}

	@Override
	public List<Red_rangedacart> save(List<Red_rangedacart> lista) {
		// TODO Auto-generated method stub
		return red_rangedacartdao.saveAll(lista);
	}

	@Override
	public void delete(List<Red_rangedacart> lista) {
		red_rangedacartdao.deleteAll(lista);
		
	}

}
