package com.bioagricola.common.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.entity.ParParametro;
import com.bioagricola.common.repository.ParParametroRepository;





@Service
public class ParParametroService {
	
	@Autowired
	private ParParametroRepository repository;
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	public Optional<ParParametro> findByEmpresa(Integer empresa){
		return this.repository.findByEmpIderegistro(empresa);
	}
	
	public JSONObject getJSONObjectParameter(String app,Long empresa) {
		String json = this.repository.getParParametro(app, empresa);
		JSONObject jsonObject = new JSONObject(json);
		return jsonObject;
	}
		
	public List<HashMap<String, Object>> parametrosHomologacion(Long empresa)
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		List<HashMap<String, Object>> total=new ArrayList<>();
		for(Object[] tmp2: this.repository.parametroValorHomologacion(idEmpresa))
    	{
			HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put(tmp2[0].toString(), tmp2[1]);
    		total.add(tmp1);
    	}
		return total;
	}
	
	public List<HashMap<String, Object>> parametrosAforo(Long empresa)
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		List<HashMap<String, Object>> total=new ArrayList<>();
		for(Object[] tmp2: this.repository.parametroValorAforo(idEmpresa))
    	{
			HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put(tmp2[0].toString(), tmp2[1]);
    		total.add(tmp1);
    		
    	}		
		return total;
	}
	
	public List<HashMap<String, String>> parametrosConfiguracion(Integer empresa)
	{
		
		List<HashMap<String, String>> total=new ArrayList<>();
    	for(String tmp2: this.repository.parametrosConfiguracion(empresa))
    	{
    		HashMap<String, String> tmp1=new HashMap<>();
    		tmp1.put("valor", tmp2);
    		total.add(tmp1);
    	}
    	return total;
	}

}
