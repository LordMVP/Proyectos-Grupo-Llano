package com.bioagricola.aforos.facade;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.bioagricola.aforos.entity.dto.CredentialsDTO;
import com.gell.estandar.dto.AuditoriaDTO;

@Service
public class AuthenticationFacade {
	
	Authentication authentication;
	AuditoriaDTO dto;
	
	public AuthenticationFacade() {
		// TODO Auto-generated constructor stub
		//this.authentication = authentication;// SecurityContextHolder.getContext().getAuthentication();
		//this.dto = (AuditoriaDTO)authentication.getPrincipal();
	}

	private void init() {		
		this.authentication = SecurityContextHolder.getContext().getAuthentication();
		this.dto = (AuditoriaDTO)authentication.getPrincipal();
	}
	public CredentialsDTO getCredentials() {
		this.init();
		CredentialsDTO c = new CredentialsDTO();
		c.setAuditoria(dto);
	    c.setEstempresa(Long.parseLong(dto.getIdEmpresa()+""));
	    c.setUsuprgunid(Long.parseLong(dto.getIdUsuario()+""));
		return c;
	}
	
	public Integer getIdEmpresa() {
		this.init();
		return this.dto.getIdEmpresa();
	}
	
	public Integer getIdUsuario() {
		this.init();
		return this.dto.getIdUsuario();
	}
	
	public Long getIdEmpresaLong() {
		this.init();
		return (long)this.dto.getIdEmpresa();
	}
	
	public Long getIdUsuarioLong() {
		this.init();
		return (long)(this.dto.getIdUsuario());
	}
	
}
