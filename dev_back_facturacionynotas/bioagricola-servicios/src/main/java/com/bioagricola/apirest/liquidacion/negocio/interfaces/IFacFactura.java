package com.bioagricola.apirest.liquidacion.negocio.interfaces;

import com.bioagricola.apirest.modelo.dtos.*;
import com.bioagricola.apirest.modelo.dtos.payload.FacFacturaPayload;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import com.bioagricola.apirest.modelo.utils.GeneralBodyResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IFacFactura {

	public List<FacFacturaDTO> consultar(String filterBy, String orderBy, Integer from, Integer to)
			throws InvalidParameterException;

	public FacFacturaDTO insertarFactura(FacFacturaDTO facFacturaDTO);

	public FacFacturaDTO actualizar(FacFacturaDTO facFacturaDTO);

	public String eliminar(Long facIderegistro);

	public String contar(String filterBy, Integer from, Integer to) throws InvalidParameterException;

	public List<String> consultarLista(String filterBy, String orderBy, String atributo)
			throws InvalidParameterException;

	public Long getFacturaCicloPeriodoActual(RequestIdFacFacturaDTO requestId);

	public Object[] getConsultarFacturasGeneradas(RequestConsultarFacturasGeneradas requestId);

	ResponseEntity<GeneralBodyResponse<Page<FacFacturaDTOResponse>>> filterInvoice(FacFacturaPayload facFacturaPayload, Pageable pageable);

	ResponseEntity<GeneralBodyResponse<Page<DocDocumentoFacturaDTOResponse>>> associatedDocumentInvoice(Long idInvoice, Long dsusId, Pageable pageable);
}
