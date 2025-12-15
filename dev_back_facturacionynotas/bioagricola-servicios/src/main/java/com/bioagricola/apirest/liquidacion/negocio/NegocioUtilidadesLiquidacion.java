package com.bioagricola.apirest.liquidacion.negocio;

import java.io.IOException;
import java.math.BigInteger;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.GenericResponseDTO;
import com.bioagricola.apirest.modelo.manejadores.ManejadorHistoricos;

@Service
public class NegocioUtilidadesLiquidacion {

	@Autowired
	private ManejadorHistoricos manejadorHistoricos;

	@Autowired
	private NegocioParParametro negocioParParametro;


	private Integer codigoExitoso = Integer.parseInt(ConstantesServicios.CODIGO_RESPUESTA_EXITOSA);
	private Integer codigoFallido = Integer.parseInt(ConstantesServicios.CODIGO_RESPUESTA_FALLIDA);

	public GenericResponseDTO validaProcesoEjecucion(Integer tipoNota)
			throws  IOException {

		Map<String, Object> parametros;
		Integer programaFacturarPeriodo;
		GenericResponseDTO genericResponseDTO;
		
		genericResponseDTO = new GenericResponseDTO();
		int idEmpresa;
		int idUsuario;
		Integer existeTabla;
		String identificadorEmpresa;
		Object[] procesos = null;
		BigInteger cantidad;

		idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
		identificadorEmpresa = "proceso_refacturacion_" + idEmpresa;
		parametros = negocioParParametro.consultaParametros(idEmpresa, ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
		programaFacturarPeriodo = tipoNota;//(Integer) parametros.get(ConstantesServicios.PROGRAMA_FACTURAR_PERIODO);

		existeTabla = manejadorHistoricos.validarTablaExistente(identificadorEmpresa);

		if (existeTabla != 0) {
			procesos = manejadorHistoricos.getProcesoEjecucion(identificadorEmpresa, programaFacturarPeriodo,
					idEmpresa, tipoNota,idUsuario);

			if (procesos != null) {
				cantidad = new BigInteger(procesos[3].toString());

				if (cantidad != BigInteger.ZERO) {
					genericResponseDTO.setCodResp(codigoFallido);
					genericResponseDTO
							.setError("Hay un proceso en ejecución para el mismo tipo de nota, usuario y empresa");
					return genericResponseDTO;
				}

			}
		} else {
			genericResponseDTO.setCodResp(codigoFallido);
			genericResponseDTO.setError("No se creo la tabla temporal " + identificadorEmpresa + "");
			return genericResponseDTO;
		}
		genericResponseDTO.setCodResp(codigoExitoso);
		genericResponseDTO.setError("No hay procesos en ejecución para el mismo tipo de nota, usuario y empresa ");
		return genericResponseDTO;
	}

}
