package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import java.text.ParseException;
import java.util.List;

import com.bioagricola.apirest.modelo.dtos.ConsultaMedidorSuscriptcionDTO;
import com.bioagricola.apirest.modelo.dtos.DsusDetsuscripDTO;
import com.bioagricola.apirest.modelo.dtos.ResponseConsultaDetalleSuscripcionDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

public interface IDsusDetsuscrip {

	public List<DsusDetsuscripDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public DsusDetsuscripDTO crear(DsusDetsuscripDTO dsusDetsuscripDTO);

	public DsusDetsuscripDTO actualizar(DsusDetsuscripDTO dsusDetsuscripDTO);

	public String eliminar(Long dsusIderegistr);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

	public ResponseConsultaDetalleSuscripcionDTO consultaDetalle(Long idSuscripcion, String nombreTercero,
			String documentoTercero, Integer ciclo, Integer documento, Integer tipoDocumento, String numCatastral,
			String codAntSuscripcion, Integer pagina, Integer tamanoPagina, String fechaDesde, String fechaHasta)
			throws InvalidParameterException, ParseException;

	public List<ConsultaMedidorSuscriptcionDTO> consultaId(String empresaId, String numeroMedidor,
			String codigoAnterior) throws InvalidParameterException;

}
