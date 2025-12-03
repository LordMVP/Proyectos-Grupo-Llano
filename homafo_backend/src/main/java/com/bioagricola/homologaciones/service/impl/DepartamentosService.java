package com.bioagricola.homologaciones.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.common.entity.Departamentos;
import com.bioagricola.homologaciones.repository.DepartamentosRepository;


@Service
public class DepartamentosService extends AbstractService<Departamentos, Long>
{
	public DepartamentosService() {
		// TODO Auto-generated constructor stub
		super(Departamentos.class);
	}
	
	@Autowired
	private DepartamentosRepository repository;
	
	public List<HashMap<String, Object>> listaDepartamentos()
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaDepartamentos())
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("departamento_cod", tmp2[0]);
    		tmp1.put("departamento_nom",tmp2[1]);
    		tmp1.put("departamento_codpai",tmp2[2]);
    		tmp1.put("departamento_ideregistro",tmp2[3]);
    		total.add(tmp1);
    	}
    	return total;
	}

	@Override
	protected JpaRepository<Departamentos, Long> getRepository() {
		// TODO Auto-generated method stub
		return this.repository;
	}

}
