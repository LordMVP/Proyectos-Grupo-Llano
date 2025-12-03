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
import com.bioagricola.homologaciones.service.impl.GhomGestionhomologaService;

@RestController
@RequestMapping(path = "api/gestionhomologa")
public class GhomGestionhomologaRestController
{
	@Autowired
	private GhomGestionhomologaService service;
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/busqueda/{dsus}/{condiciones}/{empresa}")
	public List<HashMap<String, Object>> datosHomologacion(@PathVariable("dsus") Integer dsus, @PathVariable("condiciones") String condiciones,@PathVariable("empresa") Integer empresa) 
	{
		//Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.informacionGhom(dsus,condiciones,empresa);
	}

}
