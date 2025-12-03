package com.bioagricola.homologaciones.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.homologaciones.service.impl.DepartamentosService;

@RestController
@RequestMapping(path = "api/departamentos")
public class DepartamentosRestController 
{
	@Autowired
	private DepartamentosService service;
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/lista")
	public List<HashMap<String, Object>> datosHomologacion() 
	{
		return service.listaDepartamentos();
	}

}
