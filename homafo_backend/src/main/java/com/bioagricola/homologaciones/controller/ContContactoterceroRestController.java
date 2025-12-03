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

import com.bioagricola.homologaciones.service.impl.ContContactoterceroService;

@RestController
@RequestMapping(path = "api/contContactotercero")
public class ContContactoterceroRestController
{
	@Autowired
	private ContContactoterceroService service;
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/contactoTercero/{idTercero}")
	public List<HashMap<String, Object>> contactoTercero(@PathVariable("idTercero") Integer idTercero) 
	{
		return service.contactoTercero(idTercero);
	}

}
