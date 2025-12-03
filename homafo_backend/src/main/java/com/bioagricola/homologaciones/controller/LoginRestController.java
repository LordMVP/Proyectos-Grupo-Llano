package com.bioagricola.homologaciones.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.homologaciones.dto.UsuarioWrapper;
import com.bioagricola.homologaciones.service.impl.AutenticacionService;

@RestController
@RequestMapping(path = "/login")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LoginRestController {

	@Autowired
	AutenticacionService autenticacionService;
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	@PostMapping
	public String login(@RequestBody UsuarioWrapper wrapper) {
		Integer usuario=autoFacade.getCredentials().getAuditoria().getIdUsuario();
		Integer empresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		wrapper.setIdUsuario(usuario);
		wrapper.setIdEmpresa(empresa);
		String token = autenticacionService.procesarSesion(wrapper);
		return token;		
	}
}
