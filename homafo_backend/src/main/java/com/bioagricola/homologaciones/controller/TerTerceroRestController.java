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

import com.bioagricola.homologaciones.service.impl.TerTerceroService;

@RestController
@RequestMapping(path = "api/terTercero")
public class TerTerceroRestController
{
	@Autowired
	private TerTerceroService service;
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/tiposTerceros/{unidad}")
	public List<HashMap<String, Object>> tiposTerceros(@PathVariable("unidad") Integer unidad) 
	{
		return service.terceroTipo(unidad);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/buscarTerceroNombre/{nombre}")
	public List<HashMap<String, Object>> findTercerosNombreLike(@PathVariable("nombre") String nombre) 
	{
		return service.buscarTerceroNombre(nombre);
	}
}
