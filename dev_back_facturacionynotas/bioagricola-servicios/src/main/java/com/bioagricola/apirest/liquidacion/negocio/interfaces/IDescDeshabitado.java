package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import com.bioagricola.apirest.modelo.dtos.ResponseConsultaDetalleSuscripcionDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface IDescDeshabitado {
	
	public ResponseConsultaDetalleSuscripcionDTO consultaDetalle(Long idSuscripcion, String nombreTercero,
			String documentoTercero, Integer ciclo, Integer documento, Integer tipoDocumento, String numCatastral,
			String codAntSuscripcion, Integer pagina, Integer tamanoPagina, boolean consultaPaginador)
			throws InvalidParameterException;

}
