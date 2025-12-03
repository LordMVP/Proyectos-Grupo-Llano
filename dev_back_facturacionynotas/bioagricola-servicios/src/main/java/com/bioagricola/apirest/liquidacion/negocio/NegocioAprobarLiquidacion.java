package com.bioagricola.apirest.liquidacion.negocio;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.GenericResponseDTO;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCprCtrprocesoRespository;
import com.bioagricola.apirest.modelo.manejadores.ManejadorHistoricos;

@Service
public class NegocioAprobarLiquidacion {

	@Autowired
	private ManejadorCprCtrprocesoRespository manejadorCprCtrprocesoRespository;
	@Autowired
	private ManejadorHistoricos manejadorHistoricos;
	@Autowired
	private NegocioParParametro negocioParParametro;

	private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(NegocioAprobarLiquidacion.class);

	private int idUsuario;
	private String mensajeExitoso = ConstantesServicios.RESULTADO_EXITOSO_OPERACION;
	private String mensajeFallido = ConstantesServicios.RESULTADO_FALLIDO_OPERACION;
	private Integer codigoExitoso = Integer.parseInt(ConstantesServicios.CODIGO_RESPUESTA_EXITOSA);
	private Integer codigoFallido = Integer.parseInt(ConstantesServicios.CODIGO_RESPUESTA_FALLIDA);

	String observacion;
	BigDecimal valorDescuento = BigDecimal.ZERO;
	List<Object[]> infoFactura;
	List<Object> descuentoCalidad = new ArrayList<>();

	public void aprobarLiquidacion(Integer idFactura) {
		idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
		descuentoCalidad = manejadorCprCtrprocesoRespository.getSaldoCalidad(idFactura);

		if (!descuentoCalidad.isEmpty()) {
			LOGGER.info("Inicio, hay un saldo x calidad para la factura: {}{}", idFactura, "");
			valorDescuento = new BigDecimal(descuentoCalidad.get(0).toString());
			infoFactura = manejadorCprCtrprocesoRespository.consultarFactura(idFactura.toString());
			crearRecaudo(valorDescuento);
			actualizarCalidad(idFactura.toString());

			LOGGER.info("Fin proceso calidad, {}{}", idFactura, "");
		}

	}

	private void actualizarCalidad(String idFactura) {
		String parametros;
		String condicion;

		parametros = " desc_aplicado =  true ";
		condicion = " fac_ideregistro = " + idFactura + " ";

		manejadorCprCtrprocesoRespository.actualizar(parametros, "aseo.DECA_DESCCALIDAD ", condicion);

	}

	public String fecha() {
		LocalDate hoy;
		LocalTime ahora;
		String fecha;

		hoy = LocalDate.now();
		ahora = LocalTime.now();
		fecha = hoy + " " + ahora;

		return fecha;
	}

	private void crearRecaudo(BigDecimal valorNota) {

		List<Object[]> suscripcion;
		Integer iddocumento;
		Integer idtipodocumento;
		BigInteger idsuscripcion;
		String recfecha;
		char recestado;
		Integer recvlrcambio;
		Integer recvlrajuste;
		Integer unimedpago;
		Integer cnreideregistr;
		String recfecpago;
		Integer csgideregistro;
		BigDecimal recvlrpagado;
		BigDecimal recvlrreal;
		int empideregistro;
		BigInteger susideregistro;
		BigInteger terideregistro;
		Integer unidocumento;
		String unimunicipio;
		int usuideregistro;
		String campos;
		String valores;
		Long idRecaudo;

		iddocumento = (Integer) infoFactura.get(0)[14];
		idtipodocumento = (Integer) infoFactura.get(0)[15];
		idsuscripcion = (BigInteger) infoFactura.get(0)[7];

		iddocumento = manejadorCprCtrprocesoRespository.consultarDocumentoPorDocumentoyTipoDocumento(iddocumento,
				idtipodocumento, "AF");
		suscripcion = manejadorCprCtrprocesoRespository.consultarInformacionSuscripcion(idsuscripcion);

		recfecha = fecha();
		recestado = 'A';
		recvlrcambio = 0;
		recvlrajuste = 0;
		unimedpago = 0;
		cnreideregistr = 0;
		recfecpago = fecha();
		csgideregistro = 0;
		recvlrpagado = valorNota;
		recvlrreal = (BigDecimal) infoFactura.get(0)[0];
		empideregistro = Integer.parseInt(infoFactura.get(0)[5].toString());
		susideregistro = (BigInteger) infoFactura.get(0)[6];
		terideregistro = (BigInteger) infoFactura.get(0)[11];
		unidocumento = iddocumento;
		unimunicipio = suscripcion.get(0)[7].toString();
		usuideregistro = idUsuario;

		campos = " rec_fecha,rec_estado,rec_vlrcambio,rec_vlrajuste,uni_medpago,cnre_ideregistr,rec_fecpago, csg_ideregistro,rec_vlrpagado, "
				+ " rec_vlrreal,emp_ideregistro,sus_ideregistro,ter_ideregistro,uni_documento,uni_municipio,usu_ideregistro ";
		valores = " '" + recfecha + "','" + recestado + "'," + recvlrcambio + "," + recvlrajuste + "," + unimedpago
				+ "," + cnreideregistr + ",'" + recfecpago + "'," + csgideregistro + "," + recvlrpagado + "," + " "
				+ recvlrreal + "," + empideregistro + "," + susideregistro + "," + terideregistro + "," + unidocumento
				+ "," + unimunicipio + "," + usuideregistro + " ";
		idRecaudo = manejadorCprCtrprocesoRespository.insertar("rec_recaudo", campos, valores,
				" returning rec_ideregistro ");

		procesarDistribucion(idRecaudo, valorNota, idsuscripcion);

	}

	private void procesarDistribucion(Long idRecaudo, BigDecimal valorNota, BigInteger idsuscripcion) {

		BigDecimal direvlrrecaudo;
		BigDecimal diresdorecaudo;
		Long recideregistro;
		int dicnideregistr;
		BigInteger dsusideregistr;
		Integer unitipdocument;
		Integer perideregistro;
		Integer cicideregistro;
		Integer empideregistro;
		Short cicano;
		int usuideregistro;
		String campos;
		String valores;

		direvlrrecaudo = valorNota;
		diresdorecaudo = valorNota;
		recideregistro = idRecaudo;
		dicnideregistr = 0;
		dsusideregistr = idsuscripcion;
		unitipdocument = (Integer) infoFactura.get(0)[15];
		perideregistro = (Integer) infoFactura.get(0)[13];
		cicideregistro = (Integer) infoFactura.get(0)[12];
		empideregistro = (Integer) infoFactura.get(0)[5];
		cicano = (Short) infoFactura.get(0)[16];
		usuideregistro = idUsuario;

		campos = " dire_vlrrecaudo, dire_sdorecaudo, rec_ideregistro, dicn_ideregistr, dsus_ideregistr, uni_tipdocument, per_ideregistro,"
				+ " cic_ideregistro, emp_ideregistro, cic_ano, usu_ideregistro ";
		valores = " " + direvlrrecaudo + "," + diresdorecaudo + "," + recideregistro + "," + dicnideregistr + ","
				+ dsusideregistr + "," + unitipdocument + "," + perideregistro + ", " + " " + cicideregistro + ","
				+ empideregistro + "," + cicano + "," + usuideregistro + " ";

		manejadorCprCtrprocesoRespository.insertar("dire_disrecaudo", campos, valores, " returning dire_ideregistr ");

	}

	public GenericResponseDTO cancelarReliquidacion(Integer tipoNota) {
		GenericResponseDTO genericResponseDTO;
		genericResponseDTO = new GenericResponseDTO();
		try {
			borrartablastemporales(tipoNota);
			genericResponseDTO.setCodResp(codigoExitoso);
			genericResponseDTO.setError(mensajeExitoso);
		} catch (Exception e) {
			genericResponseDTO.setCodResp(codigoFallido);
			genericResponseDTO.setError(mensajeFallido);
		}

		return genericResponseDTO;
	}

	private void borrartablastemporales(Integer tipoNota) {
		int idEmpresa;

		String tablaproceso;
		Integer existeTabla;
		Integer conceptoaforoextraordinario;
		Map<String, Object> parametros = null;

		idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
		idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();

		tablaproceso = "proceso_refacturacion_" + idEmpresa;
		existeTabla = manejadorHistoricos.validarTablaExistente(tablaproceso);

		if (existeTabla != 0) {
			manejadorCprCtrprocesoRespository.vaciarTablaTemporal(tablaproceso, idUsuario, tipoNota);
			manejadorCprCtrprocesoRespository.vaciarDetalleNovedadTMP(idEmpresa, idUsuario, tipoNota);
			manejadorCprCtrprocesoRespository.vaciarNovedadTMP(idEmpresa, idUsuario, tipoNota);

			if (tipoNota == 722) {
				try {
					parametros = negocioParParametro.consultaParametros(idEmpresa,
							ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
					conceptoaforoextraordinario = (Integer) parametros
							.get(ConstantesServicios.UNI_CONCEPTO_AFORO_EXTRAORDINARIO);

					manejadorCprCtrprocesoRespository.eliminarRegistroAforado(tipoNota, idEmpresa,
							conceptoaforoextraordinario, idUsuario);
				} catch (IOException e) {
					LOGGER.info("Error no controlado consultando el concepto aforado extraordinario {}",
							e.getMessage());
				}

			}

		}

	}
}
