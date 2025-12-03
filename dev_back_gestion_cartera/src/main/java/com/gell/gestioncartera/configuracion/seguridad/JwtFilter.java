package com.gell.gestioncartera.configuracion.seguridad;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import com.gell.gestioncartera.dto.SessionDto;
import com.gell.gestioncartera.excepciones.SeguridadException;
import com.gell.gestioncartera.helpers.JwtHelper;

/**
 * 
 * @author TSI
 * Clase de utilidad para el filtrado de las peticiones
 */
public class JwtFilter extends GenericFilterBean {

	private JwtHelper jwtHelper;
	private Authentication authentication;
	
	public JwtFilter() {
		jwtHelper = new JwtHelper();
	}
	
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {

		HttpServletRequest sreq = (HttpServletRequest) request;
		HttpServletResponse sres = (HttpServletResponse) response;
		String url = sreq.getRequestURI();
		HttpServletResponse myResponse = (HttpServletResponse) response;
		authentication = jwtHelper.RenovarSesion((HttpServletRequest) request);
		SecurityContextHolder.getContext().setAuthentication(authentication);
		SessionDto sessionDto = jwtHelper.RenovarToken((HttpServletRequest) request); 
		String newToken = sessionDto.getNewToken();
		if (newToken != null) {

			myResponse.setHeader("Authorization", newToken);
			sreq.setAttribute("idEmpresa", sessionDto.getIdEmpresa());
			sreq.setAttribute("idUsuario", sessionDto.getIdUsuario());
		}

		if (url.contains("swagger")) {
			chain.doFilter(sreq, sres);
		} else if (url.contains("v2/api-docs")) {
			chain.doFilter(sreq, sres);
		} else if (url.contains("csrf")) {
			chain.doFilter(sreq, sres);
		} else {
			chain.doFilter(request, myResponse);
		}
	}
}
