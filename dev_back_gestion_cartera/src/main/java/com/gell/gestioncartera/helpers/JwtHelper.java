package com.gell.gestioncartera.helpers;

/**
 * 
 * @author TSI
 * Helper o utilidad para el manejo de las peticiones del token JWT
 */
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import com.gell.estandar.comunicacion.ClienteToken;
import com.gell.estandar.constante.EAplicacion;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.gestioncartera.dto.SessionDto;

/**
 * 
 * @author TSI
 * Clase de utilidad para el manejo de la seguridad y filtrado de la aplicacion
 */
public class JwtHelper {
	private ClienteToken clienteToken = null;
	private String user = null;
	
	@Autowired
	AesHelper aesHelper;

	public JwtHelper() {
		clienteToken = new ClienteToken(EAplicacion.PRISMA);
	}

	/**
	 * 
	 * @param HttpServletRequest
	 * @return Authentication
	 * Metodo para validar la sesion del token
	 */
	public Authentication RenovarSesion(HttpServletRequest request) {
		String token = request.getHeader("Authorization");
		//token = "";//SOLO POR PRUEBAS
		//user = "user"; //SOLO POR PRUEBAS

		if (token.startsWith("Bearer ")) {
			AuditoriaDTO dto;
			try {
				dto = clienteToken.validarToken(token);
				user = dto.getIdUsuario().toString();//getParametros().get("idUsuario");

			} catch (AplicacionExcepcion e) {
				user = null;
			}
		}
		return user != null ? new UsernamePasswordAuthenticationToken(user, null, null) : null;
	}

	/**
	 * 
	 * @param HttpServletRequest
	 * @return String
	 * Metodo para renovar la sesion del token
	 */
	public SessionDto RenovarToken(HttpServletRequest request) {
		String newToken = null;
		SessionDto sessionDto = new SessionDto();
		String token = request.getHeader("Authorization");

		try {
			AuditoriaDTO dto = clienteToken.validarToken(token);
			dto.setToken(token);
			newToken = clienteToken.renovar(dto);
			sessionDto.setIdEmpresa(dto.getIdEmpresa().toString());
			sessionDto.setIdUsuario(dto.getIdUsuario().toString());
			sessionDto.setNewToken(newToken);
		} catch (AplicacionExcepcion e) {
			//throw new SeguridadException();
			sessionDto.setNewToken(null);
		}

		return sessionDto;
	}
}
