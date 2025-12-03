package com.bioagricola.common.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.repository.ReclamosRepository;

@Service
public class ReclamosServiceImpl
{
	@Autowired
	private ReclamosRepository reclamosRepository;
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	public List<HashMap<String, Object>> listaNovedadesRadicado(Integer empresa)
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		List<HashMap<String, Object>> total=new ArrayList<>();
		for(Object[] tmp2: this.reclamosRepository.listaNovedadesRadicado(idEmpresa))
    	{
			HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("codigo", tmp2[0]);
    		tmp1.put("nombre", tmp2[1]);
    		tmp1.put("nombreCompleto", tmp2[2]);
    		total.add(tmp1);
    	}
		return total;
	}
	
	public List<HashMap<String, Object>> listaCuadrillas(Integer empresa)
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		List<HashMap<String, Object>> total=new ArrayList<>();
		for(Object[] tmp2: this.reclamosRepository.listaCuadrillas(idEmpresa))
    	{
			HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("codigo", tmp2[0]);
    		tmp1.put("nombre", tmp2[1]);
    		tmp1.put("nombreCompleto", tmp2[2]);
    		total.add(tmp1);
    	}
		return total;
	}
	
	public List<HashMap<String, Object>> listaNovedadesReporte(Integer empresa)
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		List<HashMap<String, Object>> total=new ArrayList<>();
		for(Object[] tmp2: this.reclamosRepository.listaNovedadesReporte(idEmpresa))
    	{
			HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("codigo", tmp2[0]);
    		tmp1.put("nombre", tmp2[1]);
    		tmp1.put("nombreCompleto", tmp2[2]);
    		total.add(tmp1);
    	}
		return total;
	}

}
