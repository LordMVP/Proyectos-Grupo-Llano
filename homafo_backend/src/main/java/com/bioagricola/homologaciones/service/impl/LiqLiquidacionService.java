package com.bioagricola.homologaciones.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.common.entity.LiqLiquidacion;
import com.bioagricola.homologaciones.repository.LiqLiquidacionRepository;

@Service
public class LiqLiquidacionService extends AbstractService<LiqLiquidacion, Long>
{
	@Autowired
	private LiqLiquidacionRepository repository;
	
	public LiqLiquidacionService() {
		// TODO Auto-generated constructor stub
		super(LiqLiquidacion.class);
	}
	
	public List<HashMap<String, Object>> informacionLiquidacion(Integer empresa)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.informacionLiquidacion(empresa))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("uni_liquidacion", tmp2[0]);
    		tmp1.put("liq_nombre",tmp2[1]);
    		total.add(tmp1);
    	}
    	return total;
	}

	@Override
	protected JpaRepository<LiqLiquidacion, Long> getRepository() {
		// TODO Auto-generated method stub
		return this.repository;
	}

}
