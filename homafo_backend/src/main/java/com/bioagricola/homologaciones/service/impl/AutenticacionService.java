package com.bioagricola.homologaciones.service.impl;

import java.util.List;

import com.bioagricola.common.entity.Usuarios;
import com.bioagricola.common.repository.UsuariosRepository;
import com.bioagricola.homologaciones.dto.*;
import com.bioagricola.hya.util.EmailForm;
import com.bioagricola.hya.util.EmailUtil;
import com.bioagricola.hya.util.PasswordEncoder;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.bioagricola.common.service.UsuariosService;
import com.gell.estandar.comunicacion.ClienteToken;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.dto.AutenticacionDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.estandar.persistencia.entidades.OpcOpcion;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.mail.MessagingException;

@Service
public class AutenticacionService {

	@Value("${gell.estandar.api.autenticador.url}")
	private String urlAutenticador;

	private final String restorePass = "/autenticador/global/pass/restablecer";

	private final String changePass = "/autenticador/global/pass/cambiar";

	private final Logger logger = LoggerFactory.getLogger(AutenticacionService.class);

	private final EmailUtil emailUtil;

	@Autowired
	private UsuariosService usuServices;

	@Autowired
	private ClienteToken clienteToken;

	@Autowired
	RestTemplate restTemplate;

	private final UsuariosRepository usuariosRepository;

	private Gson gson;

	public AutenticacionService(EmailUtil emailUtil, UsuariosRepository usuariosRepository) {
		this.emailUtil = emailUtil;
		this.usuariosRepository = usuariosRepository;
		gson = new Gson();
	}

	public String procesarSesion(UsuarioWrapper usuario)
	{
		String token="";
		
		try
		{
			
			//ClienteToken clienteToken= new ClienteToken(EAplicacion.PRISMA,"http://190.14.232.146:8080");
			AutenticacionDTO auth= new AutenticacionDTO(); 
			auth.setIdEmpresa(String.valueOf(usuario.getIdEmpresa()));
			auth.setUsuario(usuServices.extraerDatosLogin(0, usuario.getIdUsuario()));
			auth.setClave(usuServices.extraerDatosLogin(1, usuario.getIdUsuario()));
			auth.setParametro("usuario", usuServices.extraerDatosLogin(0, usuario.getIdUsuario()));	
			//auth.setUsuario(usuario.getUsuario());
			//auth.setClave(usuario.getContrasena());
			//auth.setParametro("usuario", usuario.getUsuario());			
			token=clienteToken.autenticar(auth);
		}catch (AplicacionExcepcion e) {
			System.err.println(e.getMensaje());
			token=e.getMensaje();
		}catch (Exception ex) {
			token=ex.getMessage();
		}finally {
			return token;
		}
	}
	
	public AuditoriaDTO validarToken(String token)
	{
		
		AuditoriaDTO auditoriaDTO = null;		
		try {
			auditoriaDTO = clienteToken.validarToken(token);
		} catch (AplicacionExcepcion e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return auditoriaDTO;
	}
	
	public List<OpcOpcion> getMenuPrisma(String token) throws AplicacionExcepcion {		
		return clienteToken.menuPrisma(token);
	}


	/**
	 * Metodo que genera la peticion de restauracion de contraseña y el correo del usuario
	 * @param userEmail email
	 * @return RestorePasswordDto
	 */
	public RestorePasswordDto rememberPassRequest(String userEmail) throws Exception {
		Usuarios user= this.usuariosRepository.findByEmail(userEmail).orElseThrow(() -> new Exception("No se encuentra un usuario activo con la dirección de correo ingresada, comuniquese con el administrador"));
		UsuarioWrapper userWrapper= new UsuarioWrapper();
		userWrapper.setUsuario(user.getUsuLogin());
		userWrapper.setContrasena("");
		String json = this.gson.toJson(userWrapper);
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
		headers.set("aplicacion", "prisma");
		HttpEntity<String> request = new HttpEntity<>(json, headers);
		ResponseEntity<String> rMob = restTemplate.postForEntity(urlAutenticador.concat(restorePass), request, String.class);
		RestorePasswordDto response = this.gson.fromJson(rMob.getBody(), RestorePasswordDto.class);

		if(rMob.getStatusCode().value()!= 200 ||  response.getCodigo()!=1){
			throw new RuntimeException(response.getMensaje());
		} else{
			/*EmailForm emailForm= new EmailForm();
			emailForm.setEmailTo(user.getUsuarioMail());
			emailForm.setSubject("Solicitud restauracion de contraseña");
			String link= "app://homafo.bocetos.co/password-reset/"+response.getDatos().getIdConfirmacion()+"/username/"+user.getUsuLogin();
			emailForm.setLink(link);
			try{
				 emailUtil.sendEmailRememberPass(emailForm);
	             logger.info("Correo de recuperacion de contraseña enviado...");
			}catch (MessagingException e){
				throw new RuntimeException("No se ha podido enviar el codigo al correo electrónico del usuario, intente nuevamente");
			}*/
		}
		return response;
	}

	/**
	 * Metodo para cambiar la contraseña
	 * @param form formulario restaurar contraseña
	 * @return RestorePasswordDto
	 */
	public RestorePasswordDto restorePassword(RestorePasswordForm form) throws Exception {
		if(!form.getPassword().equals(form.getConfPasword())) throw new Exception("Las contraseñas no coinciden");
		ParametersDto parameters= new ParametersDto(form.getCode());
		UserChangePassDto userChangePass= new UserChangePassDto(form.getUsername(),
				PasswordEncoder.getInstance().getMD5SecurePassword(form.getPassword()),0,parameters);
		String json = this.gson.toJson(userChangePass);
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
		headers.set("aplicacion", "prisma");
		HttpEntity<String> request = new HttpEntity<>(json, headers);
		ResponseEntity<String> rMob = restTemplate.postForEntity(urlAutenticador.concat(changePass), request, String.class);
		RestorePasswordDto response = this.gson.fromJson(rMob.getBody(), RestorePasswordDto.class);

		if(rMob.getStatusCode().value()!= 200 ||  response.getCodigo()!=1){
			throw new RuntimeException(response.getMensaje());
		}
		return response;
	}

	/**
	 * Metodo para establecer paremetros de correo elastic
	 * @param name nombre
	 * @param link link
	 * @return parametros
	 */
	private MultiValueMap<String, String> getParamsEmail(String name, String link){
		MultiValueMap<String, String> map= new LinkedMultiValueMap<>();
		map.add("template", "64679");
		map.add("merge_complete_name", name);
		map.add("merge_link", link);
		return map;
	}

}