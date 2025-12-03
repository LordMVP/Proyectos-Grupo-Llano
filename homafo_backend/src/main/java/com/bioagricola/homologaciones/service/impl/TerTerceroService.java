package com.bioagricola.homologaciones.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.common.repository.TerTerceroRepository;



@Service
public class TerTerceroService
{
	@Autowired
	private TerTerceroRepository repository;
	
	public List<HashMap<String, Object>> terceroTipo(Integer unidad)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.tercerosTipo(unidad))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("ter_ideregistro", tmp2[0]);
    		tmp1.put("ter_documento",tmp2[1]);
    		tmp1.put("ter_nomcompleto",tmp2[2]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> buscarTerceroNombre(String nombre)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.buscarTerceroNombre(nombre))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("ter_ideregistro", tmp2[0]);
    		tmp1.put("ter_nomcompleto",tmp2[1]);
    		total.add(tmp1);
    	}
    	return total;
	}

}
