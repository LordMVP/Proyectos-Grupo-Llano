package com.bioagricola.common.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.common.repository.UsuariosRepository;

@Service
public class UsuariosService
{

	@Autowired
	private UsuariosRepository repository;
	
	public List<HashMap<String, Object>> listaUsuarios()
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaUsuarios())
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("usu_ideregistro", tmp2[0]);
    		tmp1.put("usuario_nom",tmp2[1]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> datosReportes(Integer idUsuario,Integer empresa)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.datosReportes(Long.valueOf(idUsuario)))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("usu_ideregistro", tmp2[0]);
    		tmp1.put("usuario_nom",tmp2[1]);
    		tmp1.put("passwd",tmp2[2]);
    		tmp1.put("username",tmp2[3]);
    		tmp1.put("idEmpresa",empresa);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public String extraerDatosLogin(Integer valor,Integer idUsuario)
	{
		List<String[]> tmp=repository.extraerDatosLogin(Long.valueOf(idUsuario));
		String resultado="";
		for(String[] tmp2: tmp)
		{
				resultado=tmp2[valor];
		}
		return resultado;
	}
	
	public List<HashMap<String, Object>> terceroUsuario(Integer idUsuario,Integer idTercero)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.terceroUsuario(Long.valueOf(idUsuario), Long.valueOf(idTercero)))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("usu_ideregistro", tmp2[0]);
    		tmp1.put("usuario_nom",tmp2[1]);
    		total.add(tmp1);
    	}
    	return total;
	}
}
