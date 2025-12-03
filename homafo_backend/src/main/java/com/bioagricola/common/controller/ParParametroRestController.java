package com.bioagricola.common.controller;

import java.util.HashMap;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.service.ParParametroService;




@RestController
@RequestMapping(path = "api/parametros")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ParParametroRestController {

	private final Long EMPRESA = 317L;
	@Autowired
	private ParParametroService parametroService; 
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	@GetMapping(path = "/{app}")
	public ResponseEntity<JSONObject> getByApp(@PathVariable String app){
		JSONObject jsonObject= this.parametroService.getJSONObjectParameter(app,EMPRESA);
		return new ResponseEntity<JSONObject>(jsonObject,HttpStatus.OK);
		
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/homologacion")
	public List<HashMap<String, Object>> parametrosHomologacion() 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return parametroService.parametrosHomologacion(new Long(idEmpresa));
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/aforos")
	public List<HashMap<String, Object>> parametrosAforo() 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return parametroService.parametrosAforo(new Long(idEmpresa));
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/configuracion")
	public List<HashMap<String, String>> parametrosConfiguracion() 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return parametroService.parametrosConfiguracion(idEmpresa);
	}
}
