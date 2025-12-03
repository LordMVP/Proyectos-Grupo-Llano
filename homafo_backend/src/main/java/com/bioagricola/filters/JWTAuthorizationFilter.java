package com.bioagricola.filters;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.gell.estandar.comunicacion.ClienteToken;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;

public class JWTAuthorizationFilter extends BasicAuthenticationFilter {

	private ClienteToken clienteToken;

	
	public JWTAuthorizationFilter(AuthenticationManager authenticationManager, ClienteToken clienteToken) {
		super(authenticationManager);
		this.clienteToken = clienteToken;
		// TODO Auto-generated constructor stub
	}

	/**
	 * Metodo para autenticarnos dentro del flujo de Spring
	 * 
	 * @param claims
	 */
	@Override
	protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
			throws IOException, ServletException {
		System.out.println("Validando ");
		String header = req.getHeader("Authorization");
		System.out.println(header);
		if (header == null || !header.startsWith("Bearer ")) {
			chain.doFilter(req, res);
			System.err.println("Validando FALLIDA");
			//throw new IOException("");
			return;
		}
		UsernamePasswordAuthenticationToken authentication = getAuthentication(req);
		SecurityContextHolder.getContext().setAuthentication(authentication);
		chain.doFilter(req, res);
	}
	
	
	private UsernamePasswordAuthenticationToken getAuthentication(HttpServletRequest request) {
		String token = request.getHeader("Authorization");
		if (token != null) {
			// Se procesa el token y se recupera el usuario.
			try {
				AuditoriaDTO auditoriaDto = this.clienteToken.validarToken(token);				
				if (auditoriaDto != null) {					
					auditoriaDto.setToken(token);
					return new UsernamePasswordAuthenticationToken(auditoriaDto, null, new ArrayList<>());
				}
			} catch (AplicacionExcepcion e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return null;
			}return null;
		}return null;
	}
	
}
