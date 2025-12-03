package com.bioagricola.apirest.liquidacion.negocio;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.CosuConsuscripDTO;
import com.bioagricola.apirest.modelo.dtos.RequestCosuConsuscripDTO;
import com.bioagricola.apirest.modelo.entidades.CosuConsuscrip;
import com.bioagricola.apirest.modelo.entidades.DsusDetsuscrip;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCosuConsuscrip;
import com.bioagricola.apirest.modelo.manejadores.ManejadorDsusDetsuscrip;

@Service
public class NegocioCosuConsuscrip extends NegocioAbstracto<CosuConsuscrip, CosuConsuscripDTO> {

	@Autowired
	private ManejadorCosuConsuscrip manejadorCosuConsuscrip;

	@Autowired
	private ManejadorDsusDetsuscrip manejadorDsusDetsuscrip;

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(NegocioCosuConsuscrip.class.getName());

	/**
	 * Método encargado de realizar el instert en la tabla cosu_consuscrip
	 * correspondiente a la marcación por deshabitado a futuro
	 * 
	 * @param listaSuscripciones
	 * @param vigenciaDesde
	 * @param vigenciaHasta
	 * @param conceptoNota
	 * @return
	 */
	public List<CosuConsuscripDTO> marcacionTarifa(RequestCosuConsuscripDTO cosuConsuscrip) {

		Timestamp tsDesde = toTimestamp(cosuConsuscrip.getvigenciaDesde());
		Timestamp tsHasta = toTimestamp(cosuConsuscrip.getvigenciaHasta());

		logger.info(tsDesde + " " + tsHasta);

		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		int idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
		List<CosuConsuscrip> listaResultados = new ArrayList<>();

		for (String suscripcion : cosuConsuscrip.getListaSuscripciones()) {
			CosuConsuscrip cosuResp = new CosuConsuscrip();
			DsusDetsuscrip detalleSuscripcion = manejadorDsusDetsuscrip.findById(Long.parseLong(suscripcion)).get();
			CosuConsuscrip cosu = new CosuConsuscrip();
			cosu.setDsusIderegistr(Long.parseLong(suscripcion));
			cosu.setEmpIderegistro(idEmpresa);
			cosu.setDsusDetsuscrip(detalleSuscripcion);
			cosu.setCosuCantidad(ConstantesServicios.COSU_CANTIDAD);
			cosu.setCosuEstado(ConstantesServicios.COSU_ESTADO);
			cosu.setCosuVlrtotal(ConstantesServicios.COSU_VLRTOTAL);
			cosu.setCosuVlrunitari(ConstantesServicios.COSU_VLRUNITARI);
			cosu.setUniLiquidacion(detalleSuscripcion.getUniLiquidacion());
			cosu.setUniConcepto(cosuConsuscrip.getConceptoNota());
			cosu.setUsuIderegistro(idUsuario);
			cosu.setCosuFecinicio(tsDesde);
			cosu.setCosuFecfinal(tsHasta);
			CosuConsuscrip validarCosu = manejadorCosuConsuscrip.validarCosuConsuscrip(
					detalleSuscripcion.getDsusIderegistr(), detalleSuscripcion.getUniLiquidacion(),
					cosuConsuscrip.getConceptoNota());
			if (validarCosu != null) {
				cosu.setCosuIderegistr(validarCosu.getCosuIderegistr());
			} else {
				cosu.setCosuIderegistr(null);
			}

			try {
				cosuResp = manejadorCosuConsuscrip.save(cosu);
			} catch (Exception e) {
				logger.error("No se pudo insertar la marcacion; error no controlado ",e);
			}
			listaResultados.add(cosuResp);
		}

		return convertirListaEntidadesADao(listaResultados);
	}

	/**
	 * Método encargado de hacer la conversión de fecha en String a Timestamp
	 * @param fecha
	 * @return
	 */
	public Timestamp toTimestamp(String fecha) {

		try {
			DateFormat dateFormat = new SimpleDateFormat(ConstantesServicios.TIMESTAMP_FORMAT);
			Date parsedDate = dateFormat.parse(fecha);
			return new Timestamp(parsedDate.getTime());
		} catch (Exception e) { // this generic but you can control another types of exception
			// look the origin of excption
			return null;
		}

	}

	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {
		return CosuConsuscrip.contieneAtributo(nombreAtributo);
	}

	@Override
	protected Logger getLogger() {
		return null;
	}

	@Override
	protected CosuConsuscripDTO instanciarDAO() {
		return new CosuConsuscripDTO();
	}

}
