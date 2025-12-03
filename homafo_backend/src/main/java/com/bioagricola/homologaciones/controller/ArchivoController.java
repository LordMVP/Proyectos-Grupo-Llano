package com.bioagricola.homologaciones.controller;

import java.io.IOException;
import java.util.Base64;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.bioagricola.homologaciones.dto.ArchivoPdfRequest;
import com.bioagricola.homologaciones.dto.ArchivoRequest;
import com.bioagricola.homologaciones.dto.ArchivoResponse;
import com.bioagricola.homologaciones.dto.HomologacionResponsePayLoad;
import com.bioagricola.homologaciones.service.impl.ArchivoService;
import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.dto.ArchivoDTO;
import com.gell.estandar.dto.RespuestaDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.estandar.util.ArchivoUtil;
import com.gell.estandar.util.LogUtil;

@RestController
@RequestMapping(path = "homologacion/archivos")
public class ArchivoController
{
	@Autowired
	private ArchivoService service;
	
	Logger logger= LoggerFactory.getLogger(ArchivoController.class);
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.POST})
	@RequestMapping(method = RequestMethod.POST, path="/adjuntar", produces=MediaType.APPLICATION_JSON_VALUE , consumes = {"multipart/form-data"})
	public ArchivoResponse cargarArchivo(@RequestParam(name = "archivo") MultipartFile archivo,@RequestParam(name="token") String token) throws AplicacionExcepcion
	{
		return service.cargarArchivo(archivo, token);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.POST})
	@PostMapping(path="/buscar", produces=MediaType.APPLICATION_JSON_VALUE)
	public RespuestaDTO verArchivo(@RequestBody ArchivoRequest request)
	//public RespuestaDTO verArchivo(@RequestParam(value = "idArchivo", required = true) String idArchivo,@RequestParam(value = "token", required = true) String token)
	{
		//return service.verArchivo(idArchivo,token);
		return service.verArchivo(request.getIdArchivo(),request.getToken());
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.POST})
	@PostMapping(path="/generarPdf", produces=MediaType.APPLICATION_JSON_VALUE)
	public HomologacionResponsePayLoad generarPdf(@RequestBody ArchivoPdfRequest request)
	{
		HomologacionResponsePayLoad response=new HomologacionResponsePayLoad();
		String resultado=service.generarPdf(request);
		if(resultado.length()>0)
		{
			if(resultado.equals("-1"))
			{
				response.setError(false);
				response.setStatusCode(400);
				response.setStatusText("Ho hay archivos Adjuntos...");
			}
			else
			{
				response.setError(false);
				response.setStatusCode(200);
				response.setStatusText(resultado);
			}			
		}
		else
		{
			response.setError(true);
			response.setStatusCode(500);
			response.setStatusText("Error al consultar el pdf...");
		}
		return response;
	}

}
