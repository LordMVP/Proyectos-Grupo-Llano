package com.bioagricola.homologaciones.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.homologaciones.service.impl.EmpresasService;

@RestController
@RequestMapping(path = "api/empresas")
public class EmpresasRestController
{	
	
	@Autowired
	private EmpresasService service;
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/alternas/{empresa}")
	public List<HashMap<String, Object>> datosHomologacion(@PathVariable("empresa") Integer empresa) 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.listaEmpresasAlternas(idEmpresa);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/alternasHomologable/{empresa}")
	public List<HashMap<String, Object>> empresaAlternaHomologable(@PathVariable("empresa") Integer empresa) 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.listaEmpresasAlternasHomologables(idEmpresa);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/convenios/{empresa}")
	public List<HashMap<String, Object>> listaConvenios(@PathVariable("empresa") Integer empresa) 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.listaConvenios(idEmpresa);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/conveniosHomologables/{empresa}/{empresaAlterna}")
	public List<HashMap<String, Object>> listaConveniosHomologables(@PathVariable("empresa") Integer empresa, @PathVariable("empresaAlterna") Integer empresaAlterna) 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.listaConveniosHomologables(idEmpresa,empresaAlterna);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/tablasEmpresa")
	public List<HashMap<String, Object>> tablasEmpresas() 
	{
		
		return service.listaTablasBaseDatos();
	}

}
