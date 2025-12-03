package com.bioagricola.filters;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.DatatypeConverter;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.bioagricola.common.dto.Usuario;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gell.estandar.comunicacion.ClienteToken;
import com.gell.estandar.dto.AutenticacionDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;


public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

	private ClienteToken clienteToken;
	
	
	public JWTAuthenticationFilter(ClienteToken clienteToken) {
		this.clienteToken = clienteToken;
		
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {
		try {
			Usuario credenciales = new ObjectMapper().readValue(request.getInputStream(), Usuario.class);
			// ClienteToken clienteToken= new ClienteToken(EAplicacion.VEPOS,"http://appmobile.grupodellano.com:7080");
			 AutenticacionDTO autenticacionDto = new AutenticacionDTO();
			 MessageDigest md = MessageDigest.getInstance("MD5");
			 md.update(credenciales.getPassword().getBytes());
			    byte[] digest = md.digest();
			    String myHash = DatatypeConverter.printHexBinary(digest).toLowerCase();
			 autenticacionDto.setClave(myHash);
			 autenticacionDto.setIdEmpresa(credenciales.getIdEmpresa());
			 autenticacionDto.setUsuario(credenciales.getUsername());
			 try {
				String token = clienteToken.autenticar(autenticacionDto);
				List<String> roles = new ArrayList<String>();
				roles.add("USER_AUTH");
				UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(token, null,
						roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList()));
				return auth;
			} catch (AplicacionExcepcion e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				throw new RuntimeException(e);
			}		
			
		} catch (IOException | NoSuchAlgorithmException e) {
			throw new RuntimeException(e);
		}
	}

	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication auth) throws IOException, ServletException {
		response.addHeader("Authorization", auth.getPrincipal().toString());
		response.setHeader("Access-Control-Expose-Headers", "Authorization");
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(
				"{\"token\":\"" + auth.getPrincipal().toString() + "\"}"
		);
		System.out.println("Auth successful");
	}
	
	/*private void getToken() {
		 ClienteToken clienteToken= new ClienteToken(EAplicacion.VEPOS,"http://appmobile.grupodellano.com:7080");
	}*/
}