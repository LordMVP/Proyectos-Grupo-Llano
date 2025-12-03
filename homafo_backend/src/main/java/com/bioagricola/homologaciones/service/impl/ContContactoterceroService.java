package com.bioagricola.homologaciones.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.common.entity.ContContactotercero;
import com.bioagricola.homologaciones.repository.ContContactoterceroRepository;

@Service
public class ContContactoterceroService extends AbstractService<ContContactotercero,Long>
{
	public ContContactoterceroService() {
		// TODO Auto-generated constructor stub
		super(ContContactotercero.class);
	}
	
	@Autowired
	private ContContactoterceroRepository repository;
	
	public List<HashMap<String, Object>> contactoTercero(Integer idTercero)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.contactoTercero(idTercero))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("cont_ideregistro", tmp2[0]);
    		tmp1.put("ter_ideregistro",tmp2[1]);
    		tmp1.put("uni_ideregistro",tmp2[2]);
    		tmp1.put("cont_valor",tmp2[3]);
    		tmp1.put("uni_nombre1",tmp2[4]);
    		tmp1.put("uni_codigo1",tmp2[5]);
    		total.add(tmp1);
    	}
    	return total;
	}

	@Override
	protected JpaRepository<ContContactotercero, Long> getRepository() {
		// TODO Auto-generated method stub
		return this.repository;
	}

}
