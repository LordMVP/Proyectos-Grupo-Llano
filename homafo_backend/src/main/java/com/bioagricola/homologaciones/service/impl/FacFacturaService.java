package com.bioagricola.homologaciones.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.common.entity.FacFactura;
import com.bioagricola.homologaciones.repository.FacFacturaRepository;

@Service
public class FacFacturaService extends AbstractService<FacFactura, Long>
{
	public FacFacturaService() {
		// TODO Auto-generated constructor stub
		super(FacFactura.class);
	}
	@Autowired
	private FacFacturaRepository repository;
	
	public List<HashMap<String, Object>> saldoFacturas(Integer dsus,Integer empresa)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.saldoFacturas(dsus, empresa))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("saldo", tmp2[0]);
    		total.add(tmp1);
    	}
    	return total;
	}

	@Override
	protected JpaRepository<FacFactura, Long> getRepository() {
		// TODO Auto-generated method stub
		return this.repository;
	}

}
