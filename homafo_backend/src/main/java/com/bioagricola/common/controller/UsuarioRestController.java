package com.bioagricola.common.controller;

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
import com.bioagricola.common.service.UsuariosService;

@RestController
@RequestMapping(path = "api/usuarios")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UsuarioRestController
{
	@Autowired
	private UsuariosService service;
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/listaCompleta")
	public List<HashMap<String, Object>> listaUsuarios() 
	{
		return service.listaUsuarios();
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/datosReportes/{idUsuario}")
	public List<HashMap<String, Object>> datosReportes(@PathVariable("idUsuario") Integer idUsuario) 
	{
		Integer usuario=autoFacade.getCredentials().getAuditoria().getIdUsuario();
		Integer empresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.datosReportes(usuario,empresa);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/terceroUsuario/{idTercero}")
	public List<HashMap<String, Object>> terceroUsuario(@PathVariable("idTercero") Integer idTercero) 
	{
		Integer usuario=autoFacade.getCredentials().getAuditoria().getIdUsuario();
		return service.terceroUsuario(usuario,idTercero);
	}
	
	

}
