package com.bioagricola.homologaciones.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.common.entity.ConConcepto;
import com.bioagricola.homologaciones.repository.ConConceptoRepository;

@Service
public class ConConceptoService extends AbstractService<ConConcepto, Long>
{
	
	public ConConceptoService() {
		super(ConConcepto.class);
	}
	@Autowired
	private ConConceptoRepository repository;
	
	public List<HashMap<String, Object>> conceptosSuscripcion(Integer dsus)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.conceptosSuscripcion(dsus))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("cosu_ideregistr", tmp2[0]);
    		tmp1.put("uni_concepto",tmp2[1]);
    		tmp1.put("concepto",tmp2[2]);
    		tmp1.put("desde",tmp2[3]);
    		tmp1.put("hasta",tmp2[4]);
    		tmp1.put("observacion",tmp2[5]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> conceptosSuscripcionSesion(Integer programa, Integer usuario)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.conceptosSuscripcionSesion(programa,usuario))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("uni_concepto", tmp2[0]);
    		tmp1.put("con_nombre",tmp2[1]);
    		total.add(tmp1);
    	}
    	return total;
	}

	@Override
	protected JpaRepository<ConConcepto, Long> getRepository() {
		// TODO Auto-generated method stub
		return this.repository;
	}

}
