package com.bioagricola.homologaciones.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.homologaciones.dto.HomologacionResponsePayLoad;
import com.bioagricola.homologaciones.dto.ParametrizacionImportacionRequest;
import com.bioagricola.homologaciones.dto.ParametrizacionImportacionUpdateRequest;
import com.bioagricola.homologaciones.service.impl.ImarcArchivosImportacionService;

@RestController
@RequestMapping(path = "api/homoImportacion")
public class ImarcArchivosImportacionRestController
{
	@Autowired
	private ImarcArchivosImportacionService service;
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/busqueda/{imarcId}")
	public List<HashMap<String, Object>> datosArchivo(@PathVariable("imarcId") Integer imarcId) 
	{
		return service.datosArchivo(imarcId);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/busquedaGas/{fecha1}/{fecha2}/{ciclo}")
	public List<HashMap<String, Object>> datosLlanogas(@PathVariable("fecha1") String fecha1, @PathVariable("fecha2") String fecha2, @PathVariable("ciclo") Integer ciclo) 
	{
		return service.datosALlanogas(fecha1, fecha2, ciclo);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/tiposArchivos")
	public List<HashMap<String, Object>> tiposArchivos() 
	{
		return service.tiposArchivos();
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/busqueda2/{imarcId}")
	public List<HashMap<String, Object>> datosArchivo2(@PathVariable("imarcId") Integer imarcId) 
	{
		return service.datosArchivoEditar(imarcId);
	}
	
	////parametrizacion Homologacion
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.POST})
	@RequestMapping(value = "/insertarImarc", method = RequestMethod.POST)
	public HomologacionResponsePayLoad insertarParametrizacion(@RequestBody ParametrizacionImportacionRequest request)
	{
		HomologacionResponsePayLoad response=new HomologacionResponsePayLoad();
		Integer resultado=service.insertarImarcBasico(request);
		if(resultado>0)
		{
			response.setError(false);
			response.setStatusCode(200);
			response.setStatusText("Exito al Registrar...");
		}
		else
		{
			response.setError(true);
			response.setStatusCode(500);
			response.setStatusText("Error insertar...");
		}
		return response;
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/consultarImarc/{imarc}")
	public List<HashMap<String, Object>> consultarImarc(@PathVariable("imarc") Integer imarc) 
	{
		return service.datosImarc(imarc);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.POST})
	@RequestMapping(value = "/actualizarImarc", method = RequestMethod.POST)
	public HomologacionResponsePayLoad actualizarParametrizacion(@RequestBody ParametrizacionImportacionUpdateRequest request)
	{
		HomologacionResponsePayLoad response=new HomologacionResponsePayLoad();
		Integer resultado=service.actualizarImarcBasico(request);
		if(resultado>0)
		{
			response.setError(false);
			response.setStatusCode(200);
			response.setStatusText("Exito al Registrar...");
		}
		else
		{
			response.setError(true);
			response.setStatusCode(500);
			response.setStatusText("Error insertar...");
		}
		return response;
	}

}
