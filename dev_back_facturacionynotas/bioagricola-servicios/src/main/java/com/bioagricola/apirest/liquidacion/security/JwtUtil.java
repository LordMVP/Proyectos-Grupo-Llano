package com.bioagricola.apirest.liquidacion.security;

import static java.util.Collections.emptyList;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.gell.estandar.comunicacion.ClienteToken;
import com.gell.estandar.constante.EAplicacion;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import org.springframework.beans.factory.annotation.Value;

public class JwtUtil {

	private ClienteToken clienteToken;
	private String tokenUser;
	public static AuditoriaDTO auditoriaDTO;
        
	public JwtUtil() {
		clienteToken = new ClienteToken(EAplicacion.PRISMA, ConstantesServicios.URL_SERVICIO_TOKEN);
	}

	@SuppressWarnings("finally")
	public String renovarToken(HttpServletRequest request) {
		String newToken = null;
		String token = request.getHeader("Authorization");

		try {
			auditoriaDTO = clienteToken.validarToken(token);
			auditoriaDTO.setToken(token);
			newToken = clienteToken.renovar(auditoriaDTO);

		} catch (AplicacionExcepcion appEx) {
			System.out.println(appEx.getMensaje());
		} catch (Exception ex) {
			System.out.println(ex.getMessage());
		} finally {
			return newToken;
		}
	}

	public Authentication renovarSesion(HttpServletRequest request) {
		String user = null;
		try {
			String token = request.getHeader("Authorization");

			if (token.startsWith("Bearer ")) {
				auditoriaDTO = clienteToken.validarToken(token);
				
				user = auditoriaDTO.getParametros().get("nombreEmpresa");
			}
		} catch (AplicacionExcepcion appEx) {
			System.out.println(appEx.getMensaje());
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			return user != null ? new UsernamePasswordAuthenticationToken(user, null, emptyList()) : null;
		}

	}
	
}
