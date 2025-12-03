package com.bioagricola.apirest.liquidacion.negocio;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.ConsultaPqrDTO;
import com.bioagricola.apirest.modelo.dtos.ReclamoDTO;
import com.bioagricola.apirest.modelo.dtos.RequestReclamoDTO;
import com.bioagricola.apirest.modelo.entidades.Reclamos;
import com.bioagricola.apirest.modelo.manejadores.ManejadorReclamos;
import com.bioagricola.apirest.modelo.utils.ResponseError;

@Service
public class NegocioReclamo extends NegocioAbstracto<Reclamos, ReclamoDTO> {

	@Autowired
	private ManejadorReclamos manejadorReclamos;

	@Autowired
	private NegocioDsusDetsuscrip negocioDsusDetsuscrip;

	/**
	 * Método encargado de manejar la lógica de negocio para al consulta de PQR
	 * según la empresa en sesión y los datos obtenidos del formulario
	 */
	public List<ConsultaPqrDTO> consultaPqr(String numeroPqr, Long idSuscripcion, String nombreTercero,
			String terceroDocumento) {

		List<Object[]> listaConsulta ;
		List<Object[]> listaConsultaAuxiliar ;
		List<Object[]> listaConsultaRespuesta;

		if (nombreTercero.equals("")) {
			nombreTercero = negocioDsusDetsuscrip.stringVacio(nombreTercero);
		} else {
			nombreTercero = nombreTercero.toLowerCase();
		}

		terceroDocumento = negocioDsusDetsuscrip.stringVacio(terceroDocumento);

		// Obtención del Id de la empresa en sesión como parámetro de la consulta
		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();

		// Consulta inicial de pqr para validar si existe
		listaConsultaAuxiliar = manejadorReclamos.validarPqr(numeroPqr, idEmpresa);

		// Consulta de pqr y datos ingresados por el usuario
		listaConsulta = manejadorReclamos.consultaPqr(numeroPqr, idSuscripcion, nombreTercero, terceroDocumento,
				idEmpresa);

		List<ConsultaPqrDTO> listaResultados = new ArrayList<>();

		// Validación de si la búsqueda del usuario retornó algo, sino valida si la
		// consulta de pqr existe, si es así
		// crea un objeto que llevará el error para ser mmanejado en el frontEnd
		ResponseError response = new ResponseError();
		// Error de datos del tercero y/o id suscripción, se toma el que valida
		if (listaConsulta.isEmpty() && !listaConsultaAuxiliar.isEmpty()) {
			response.setErrorClass(ConstantesServicios.CODIGO_RESPUESTA_FALLIDA);
			response.setMessage(ConstantesServicios.ERROR_DATOS_PQR);
			listaConsultaRespuesta = listaConsultaAuxiliar;
			// El código PQR no existe
		} else if (listaConsultaAuxiliar.isEmpty()) {
			response.setErrorClass(ConstantesServicios.CODIGO_SIN_RESULTADOS);
			response.setMessage(ConstantesServicios.ERROR_DATOS_PQR);
			listaConsultaRespuesta = listaConsultaAuxiliar;
			// El código PQR existe y el usuario digitó correctamente los datos de búsqueda
		} else {
			response.setErrorClass(ConstantesServicios.CODIGO_RESPUESTA_EXITOSA);
			response.setMessage(ConstantesServicios.BUSQUEDA_EXITOSA);
			listaConsultaRespuesta = listaConsulta;
		}

		// Mapeo de los objetos de respuesta de la consulta al DTO de respuesta del
		// servicio
		for (Object[] row : listaConsultaRespuesta) {
			ConsultaPqrDTO consultaPqr = new ConsultaPqrDTO();
			consultaPqr.setResponse(response);
			consultaPqr.setFechaSolicitud((Date) row[0]);
			consultaPqr.setRadicado((String) row[1]);
			consultaPqr.setTipoServicio((String) row[2]);
			consultaPqr.setTipoAtencion((String) row[3]);
			consultaPqr.setSeccion((String) row[4]);
			consultaPqr.setServicio((String) row[5]);
			consultaPqr.setObservaciones((String) row[6]);
			consultaPqr.setDescartado((Boolean) row[7]);
			consultaPqr.setDocumentoTercero((String) row[8]);
			consultaPqr.setNombreTercero((String) row[9]);
			consultaPqr.setIdSuscripcion(row[10].toString());
			consultaPqr.setTipoAtencionCod(row[11].toString());
			consultaPqr.setTipoNota(row[12].toString());
			listaResultados.add(consultaPqr);
		}

		return listaResultados;
	}

	/**
	 * Método encargado de manejar la lógica de negocio para al consulta de PQR
	 * según la empresa en sesión y los datos obtenidos del formulario
	 */
	public Reclamos modificarPqr(RequestReclamoDTO modificaPQR) {

		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();

		manejadorReclamos.modificarPqrUnica(modificaPQR.getNumeroPqr(), modificaPQR.getIdSuscripcion(), idEmpresa,
				modificaPQR.getObservacion(), modificaPQR.getTipoNota());

		Reclamos reclamoResult = new Reclamos();
		reclamoResult = manejadorReclamos.consultaPqrUnica(modificaPQR.getNumeroPqr(), modificaPQR.getIdSuscripcion(),
				idEmpresa);

		return reclamoResult;
	}

	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {
		return false;
	}

	@Override
	protected Logger getLogger() {
		return null;
	}

	@Override
	protected ReclamoDTO instanciarDAO() {
		return null;
	}

}
