package com.bioagricola.common.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.service.ReclamosServiceImpl;

@RestController
@RequestMapping(path = "api/reclamos")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ReclamosController
{
	@Autowired
	private ReclamosServiceImpl service;
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/novedadesRadicado")
	public List<HashMap<String, Object>> listaNovedadesRadicado() 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.listaNovedadesRadicado(idEmpresa);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/listaCuadrillas")
	public List<HashMap<String, Object>> listaCuadrillas() 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.listaCuadrillas(idEmpresa);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/novedadesReporte")
	public List<HashMap<String, Object>> listaNovedadesReporte() 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.listaNovedadesReporte(idEmpresa);
	}

}
