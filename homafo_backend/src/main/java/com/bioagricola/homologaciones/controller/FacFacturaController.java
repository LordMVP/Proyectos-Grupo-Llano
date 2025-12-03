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
import com.bioagricola.homologaciones.service.impl.FacFacturaService;

@RestController
@RequestMapping(path = "api/facFactura")
public class FacFacturaController
{

	@Autowired
	private FacFacturaService service;
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/busquedaSaldos/{dsus}/{empresa}")
	public List<HashMap<String, Object>> datosHomologacion(@PathVariable("dsus") Integer dsus, @PathVariable("empresa") Integer empresa) 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.saldoFacturas(dsus, idEmpresa);
	}
}
