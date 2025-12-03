package com.bioagricola.apirest.liquidacion.negocio;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.RequestVisitasSolDTO;
import com.bioagricola.apirest.modelo.dtos.VisitasSolDTO;
import com.bioagricola.apirest.modelo.entidades.ParParametro;
import com.bioagricola.apirest.modelo.entidades.VisitasSol;
import com.bioagricola.apirest.modelo.manejadores.ManejadorParParametro;
import com.bioagricola.apirest.modelo.manejadores.ManejadorReclamos;
import com.bioagricola.apirest.modelo.manejadores.ManejadorVisitasSol;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class NegocioVisitasSol extends NegocioAbstracto<VisitasSol, VisitasSolDTO> {

	@Autowired
	private ManejadorVisitasSol manejadorVisitasSol;

	@Autowired
	private ManejadorReclamos manejadorReclamos;

	@Autowired
	private ManejadorParParametro manejadorParParametro;


	/**
	 * Método encargado de manejar la lógica de negocio para agregar un indice según
	 * la PQR id suscript y tipo de empresa
	 * 
	 * @throws IOException
	 * @throws JsonMappingException
	 * @throws JsonParseException
	 */
	public VisitasSol agregarRegistro(RequestVisitasSolDTO agregarSol)
			throws  IOException {
		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		int ususarioSesion = JwtUtil.auditoriaDTO.getIdUsuario();
		Map<String, Object> consulta = this.consultaParametros(idEmpresa, ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
		String nombreEtapa = consulta.get(ConstantesServicios.NOMBRE_ETAPA).toString().replace('[', ' ')
				.replace(']', ' ').trim();
		String[] novedades = consulta.get(ConstantesServicios.NOMBRE_NOVEDAD).toString().replaceAll("[\\[\\]\\s]", "")
				.replace("_", " ").trim().split(",");

		List<Object[]> accedeOptions = new ArrayList<>();
		accedeOptions = manejadorReclamos.accedeData(agregarSol.getObservacion(),
				consulta.get(ConstantesServicios.AFAVOR_USUARIO).toString(),
				consulta.get(ConstantesServicios.AFAVOR_EMPRESA).toString(),
				consulta.get(ConstantesServicios.AFAVOR_NOAPLICA).toString(), ususarioSesion,
				consulta.get(ConstantesServicios.VISITASOL_ESTDIG).toString(), idEmpresa, nombreEtapa, novedades,
				agregarSol.getIdSuscripcion(), agregarSol.getNumeroPqr(),
				consulta.get(ConstantesServicios.PQRS_DEPENDENCIA_SERVICIO).toString(),
				(Integer) consulta.get(ConstantesServicios.PQRS_NIVEL_SERVICO));

		VisitasSol visitaSolResult = new VisitasSol();

		for (Object[] accedeOption : accedeOptions) {
			if (new String((String) accedeOption[1]).equals(agregarSol.getAccede())) {
				visitaSolResult.setVisitasolFecvis((Timestamp) accedeOption[2]);
				visitaSolResult.setVisitasolEst((String) accedeOption[3]);
				visitaSolResult.setVisitasolCodsus((String) accedeOption[5]);
				visitaSolResult.setVisitasolFav((String) accedeOption[6]);
				visitaSolResult.setVisitasolCodsus((String) accedeOption[8]);
				visitaSolResult.setVisitasolCodemp((String) accedeOption[9]);
				visitaSolResult.setVisitasolEmpcon((String) accedeOption[10]);
				visitaSolResult.setVisitasolSwtapl((Boolean) accedeOption[11]);
				visitaSolResult.setVisitasolCodrep((String) accedeOption[12]);
				visitaSolResult.setVisitasolUsugra((String) accedeOption[13]);
				visitaSolResult.setVisitasolEstdig((String) accedeOption[14]);
			}
		}

		visitaSolResult.setVisitasolObs(agregarSol.getObservacion());
		visitaSolResult.setVisitasolNumpqr(agregarSol.getNumeroPqr());
		visitaSolResult.setVisitasolCodnov(agregarSol.getCodigoNovedad().toString());

		manejadorVisitasSol.save(visitaSolResult);

		return visitaSolResult;
	}

	public Map<String, Object> consultaParametros(int idEmpresa, String parametroAConsultar)
			throws  IOException {
		ParParametro parametrosEmpresa = manejadorParParametro.consultaParametros(idEmpresa);
		Map<String, Object> parametros = new ObjectMapper().readValue(parametrosEmpresa.getParParametro(),
				HashMap.class);
		return (Map<String, Object>) parametros.get(parametroAConsultar);
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
	protected VisitasSolDTO instanciarDAO() {
		return null;
	}
}
