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
import com.bioagricola.homologaciones.service.impl.CicCicloService;

@RestController
@RequestMapping(path = "api/cicCiclo")
public class CicCicloRestController
{
	@Autowired
	private CicCicloService service;
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/lista/{empresa}")
	public List<HashMap<String, Object>> listaCicCiclos(@PathVariable("empresa") Integer empresa) 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.listaCiclos(idEmpresa);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/lista2/{empresa}")
	public List<HashMap<String, Object>> listaCicCiclos2(@PathVariable("empresa") Integer empresa) 
	{
		//Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.listaCiclos2(empresa);
	}

}
