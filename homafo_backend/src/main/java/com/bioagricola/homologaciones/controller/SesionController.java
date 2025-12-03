package com.bioagricola.homologaciones.controller;

import com.bioagricola.homologaciones.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.homologaciones.service.impl.AutenticacionService;

import javax.validation.Valid;
import java.util.Locale;


@RestController
@RequestMapping(path = "homologacion")
public class SesionController
{
	@Autowired
	AutenticacionService service;
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.POST})
	@RequestMapping("/sesion")
	@PostMapping(path="", produces=MediaType.APPLICATION_JSON_VALUE)
	public HomologacionResponsePayLoad iniciarSesion(@RequestBody UsuarioWrapper usuario)
	{
		Integer idUsuario2=autoFacade.getCredentials().getAuditoria().getIdUsuario();
		Integer idEmpresa2=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		usuario.setIdUsuario(idUsuario2);
		usuario.setIdEmpresa(idEmpresa2);
		String resultado= service.procesarSesion(usuario);
		HomologacionResponsePayLoad response=new HomologacionResponsePayLoad();

		if(resultado.length()>0)
		{
			response.setError(false);
			response.setStatusCode(200);
			response.setStatusText(resultado);
		}
		return response;
	}

	/**
	 * Servicio solicitud recuperar contraseña
	 * @param basicSearchForm busqueda por correo
	 * @return Recurso solicitud de recupreacion de contraseña creado con exito
	 */
	@PostMapping("/rememberpass")
	public ResponseEntity<RestorePasswordDto> rememberPassRequest(
			@Valid @RequestBody BasicSearchForm basicSearchForm) throws Exception {
		RestorePasswordDto response=this.service.rememberPassRequest(basicSearchForm.getSearch());
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	/**
	 * Servicio restaurar contraseña
	 * @param form formulario restaurar contraseña
	 * @return Recurso actualizado con exito
	 */
	@PutMapping("/restorepass")
	public ResponseEntity<RestorePasswordDto> restorePass(@Valid @RequestBody RestorePasswordForm form) throws Exception {
		RestorePasswordDto response=this.service.restorePassword(form);
		return new ResponseEntity<>(response,HttpStatus.OK);
	}

	
	/*
	@CrossOrigin(origins = "*", methods= {RequestMethod.POST})
	@GetMapping(path="/validar", produces=MediaType.APPLICATION_JSON_VALUE)
	public String validarToken()
	{
		return service.validarToken();
	}
	*/

}
