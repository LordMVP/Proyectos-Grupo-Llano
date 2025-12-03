package com.llanoGas.microservicio.clases;

import com.llanoGas.microservicio.clases.*;

import java.util.HashMap;

import com.gell.estandar.comunicacion.ClienteToken;
import com.gell.estandar.constante.EAplicacion;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.dto.AutenticacionDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;

public class ValidarToken {

	EAplicacion aplicacion = null;
	ClienteToken tokenCliente = new ClienteToken(aplicacion.PRISMA);


	public AuditoriaDTO validarToken(String token) throws AplicacionExcepcion {
		AuditoriaDTO auditoria = null;	
		
		if (token.startsWith("Bearer")) {

			 auditoria = tokenCliente.validarToken(token);
			

			auditoria.setToken(token);

		

		}

		return auditoria;

	}
	
	public String renovarToken(AuditoriaDTO auditoria) throws AplicacionExcepcion {
		String tokenRenovado = "";
		tokenRenovado = tokenCliente.renovar(auditoria);
		return tokenRenovado;
		
		
		
	}

}

