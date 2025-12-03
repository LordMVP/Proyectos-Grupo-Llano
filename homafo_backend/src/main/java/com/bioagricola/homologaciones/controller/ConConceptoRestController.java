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
import com.bioagricola.homologaciones.service.impl.ConConceptoService;

@RestController
@RequestMapping(path = "api/conConcepto")
public class ConConceptoRestController
{
	@Autowired
	private ConConceptoService service;
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/busquedaDsus/{dsus}")
	public List<HashMap<String, Object>> conceptosSuscripcion(@PathVariable("dsus") Integer dsus) 
	{
		return service.conceptosSuscripcion(dsus);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/busquedaUsuario/{programa}/{usuario}")
	public List<HashMap<String, Object>> conceptosSuscripcionSesion(@PathVariable("programa") Integer programa, @PathVariable("usuario") Integer usuario) 
	{
		Integer idUsuario=autoFacade.getCredentials().getAuditoria().getIdUsuario();
		return service.conceptosSuscripcionSesion(programa, idUsuario);
	}

}
