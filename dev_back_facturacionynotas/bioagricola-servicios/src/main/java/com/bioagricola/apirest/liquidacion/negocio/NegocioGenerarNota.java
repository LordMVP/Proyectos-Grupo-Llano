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
import com.bioagricola.apirest.modelo.dtos.NotNotaDTO;
import com.bioagricola.apirest.modelo.dtos.RequestGenerarNota;
import com.bioagricola.apirest.modelo.dtos.RequestNotNotaDTO;
import com.bioagricola.apirest.modelo.excepciones.NegocioException;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCprCtrprocesoRespository;

@Service
public class NegocioGenerarNota {

	@Autowired
	private ManejadorCprCtrprocesoRespository manejadorCprCtrprocesoRespository;
	@Autowired
	private NegocioNotNota negocioNotNota;
	@Autowired
	private NegocioParParametro negocioParParametro;

	private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(NegocioGenerarNota.class);
	// datos obtenidos desde el token
	int idEmpresa;
	int idUsuario;
	int idAcceso;
	int tipoNota;
	int uniMotnota;
	int reclamacion;
	String observacion;
	List<Object[]> infoFactura;
	List<String[]> listaDebitos = new ArrayList<>();
	List<String[]> listaCreditos = new ArrayList<>();
	List<String[]> listaSaldos = new ArrayList<>();
	List<Long> facturas = new ArrayList<>();
	private Integer codigoFallido = Integer.parseInt(ConstantesServicios.CODIGO_RESPUESTA_FALLIDA);

	public GenericResponseDTO generarNota(RequestGenerarNota generarNota) {
		GenericResponseDTO genericResponseDTO;
		String listaFallos = "";
		genericResponseDTO = new GenericResponseDTO();
		idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
		idAcceso = Integer.parseInt(JwtUtil.auditoriaDTO.getId());
		tipoNota = generarNota.getTipoNota();
		reclamacion = generarNota.getReclamacion();
		observacion = generarNota.getObservacion();
		uniMotnota = generarNota.getUniMotnota();
		
		StringBuilder bld = new StringBuilder();
		
		for (String idFactura : generarNota.getFacturas()) {
			LOGGER.info("Inicio de proceso; factura: {}{}", idFactura, "");

			listaDebitos = new ArrayList<>();
			listaCreditos = new ArrayList<>();
			listaSaldos = new ArrayList<>();
			facturas = null;

			try {
				compararVersion(idFactura);
				infoFactura = manejadorCprCtrprocesoRespository.consultarNovedad(idFactura);
				aplicarFormulasNovedad(idFactura);
				procesarDebitos(idFactura);
				procesarCreditos(idFactura);
				procesarSaldos(idFactura);
				actualizarValorFactura((BigInteger) infoFactura.get(0)[24]);
				compararVersion(idFactura);
				actualizarversion(infoFactura.get(0)[24].toString());
			} catch (NegocioException e) {
				bld.append(e.getMessage() + "|");
				genericResponseDTO.setCodResp(codigoFallido);
				LOGGER.info(e.toString());
			} catch (Exception e) {
				bld.append(e.getMessage() + " factura nota " + idFactura + "|");
				genericResponseDTO.setCodResp(codigoFallido);
				LOGGER.info(e.getMessage());
			}
		}
		listaFallos = bld.toString();
		
		if (tipoNota == 758) {
			Integer suscripcion;
			suscripcion = manejadorCprCtrprocesoRespository.validarSuscripcionAEliminar(tipoNota, idEmpresa, idUsuario);
			if (suscripcion != 0) {
				manejadorCprCtrprocesoRespository.eliminarSuscripcion(suscripcion);
				LOGGER.info("se eliminar la suscripcion {}", suscripcion);
			}
		}
		genericResponseDTO.setError(listaFallos);
		borrartablastemporales();
		LOGGER.info("Fin de proceso; se borran tablas temporales");
		return genericResponseDTO;
	}

	private void borrartablastemporales() {
		String tablaproceso;
		Integer conceptoaforoextraordinario;
		Map<String, Object> parametros = null;

		tablaproceso = "proceso_refacturacion_" + idEmpresa;

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
				LOGGER.info("Error no controlado consultando el concepto aforado extraordinario {}", e.getMessage());
			}

		}
	}

	private void actualizarversion(String idFacturaOriginal) {
		String parametros;
		String condicion;

		parametros = " fac_version =  fac_version + 1 ";
		condicion = " fac_ideregistro = " + idFacturaOriginal + " ";

		manejadorCprCtrprocesoRespository.actualizar(parametros, " fac_factura", condicion);

	}

	private Long agregarNota() {
		RequestNotNotaDTO nuevaNota = new RequestNotNotaDTO();
		NotNotaDTO nota;

		nuevaNota.setDsusIdregistr(Long.parseLong(infoFactura.get(0)[7].toString()));
		nuevaNota.setFacturas(facturas);
		nuevaNota.setFecha(fecha());
		nuevaNota.setObservacion(observacion);
		nuevaNota.setUniMotnota(uniMotnota);

		nota = negocioNotNota.agregarNota(nuevaNota);

		return nota.getNotIderegistro();

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

	private void agregarNofa(Long idNota, String idFacturaOrginal, BigInteger idFactura) {

		manejadorCprCtrprocesoRespository.insertarNofa(idNota, idFactura, idFacturaOrginal, idUsuario);

	}

	private void procesarDebitos(String idnovedad) {
		BigInteger idFactura;
		facturas = new ArrayList<>();
		Long idNota;
		if (!listaDebitos.isEmpty()) {
			idFactura = crearFactura("ND");
			facturas.add(Long.parseLong(idFactura.toString()));

			for (String[] concepto : listaDebitos) {
				crearDetalleFatura(idFactura, concepto, idnovedad);
			}
			actualizarValorFactura(idFactura);
			idNota = agregarNota();
			agregarNofa(idNota, infoFactura.get(0)[24].toString(), idFactura);
		}
	}

	private void procesarSaldos(String idnovedad) {
		BigInteger idFactura;
		BigDecimal valorNota;
		facturas = new ArrayList<>();
		Long idNota;

		if (!listaSaldos.isEmpty()) {
			idFactura = crearFactura("NS");
			facturas.add(Long.parseLong(idFactura.toString()));

			for (String[] concepto : listaSaldos) {
				crearDetalleFatura(idFactura, concepto, idnovedad);
			}
			valorNota = actualizarValorFactura(idFactura);
			crearRecaudo(valorNota);
			idNota = agregarNota();
			agregarNofa(idNota, infoFactura.get(0)[24].toString(), idFactura);

		}
	}

	private void procesarCreditos(String idnovedad) {
		BigInteger idFactura;
		facturas = new ArrayList<>();
		Long idNota;

		if (!listaCreditos.isEmpty()) {
			idFactura = crearFactura("NC");
			facturas.add(Long.parseLong(idFactura.toString()));

			for (String[] concepto : listaCreditos) {
				crearDetalleFatura(idFactura, concepto, idnovedad);
			}
			actualizarValorFactura(idFactura);
			idNota = agregarNota();
			agregarNofa(idNota, infoFactura.get(0)[24].toString(), idFactura);
		}
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

	private void crearDetalleFatura(BigInteger idFactura, String[] concepto, String idnovedad) {

		// concepto = idconcepto, valor, saldoReal,valorReal,idconceptoPadre
		manejadorCprCtrprocesoRespository.insertarDetalleFacturaReal(idFactura.toString(), concepto[1], concepto[1],
				concepto[1], concepto[0], idnovedad);

		manejadorCprCtrprocesoRespository.actualizarValorConceptoOriginal(concepto[3], concepto[2], concepto[4]);

	}

	private BigInteger crearFactura(String tipoFactura)  {
		BigDecimal valorTotal;
		char metodogenera;
		char estado;
		String fecha;
		String fechavencimiento;
		Integer idempresa;
		BigInteger idsuscriptor;
		BigInteger idsuscripcion;
		Integer idtiposuscripcion;
		Integer idtipousosuscripcion;
		Integer idliquidacion;
		BigInteger idtercero;
		Integer idciclo;
		Integer idperiodo;
		Integer iddocumento;
		Integer idtipodocumento;
		Short cicloano;
		BigInteger idhistoricoliquidacion;
		BigDecimal saldofactura;
		Integer idtipotercero;
		String fechasuspende;
		Integer version;
		String fechaaprobacion;
		String campos;
		String valores;
		Long respuesta;
		BigInteger idfactura;
		BigInteger facidepadre;
		Integer codigoNotaReclamacion;

		valorTotal = (BigDecimal) infoFactura.get(0)[0];
		metodogenera = infoFactura.get(0)[1].toString().charAt(0);
		estado = 'A';
		fecha = infoFactura.get(0)[3].toString();
		fechavencimiento = infoFactura.get(0)[4].toString();
		idempresa = (Integer) infoFactura.get(0)[5];
		idsuscriptor = (BigInteger) infoFactura.get(0)[6];
		idsuscripcion = (BigInteger) infoFactura.get(0)[7];
		idtiposuscripcion = (Integer) infoFactura.get(0)[8];
		idtipousosuscripcion = (Integer) infoFactura.get(0)[9];
		idliquidacion = (Integer) infoFactura.get(0)[10];
		idtercero = (BigInteger) infoFactura.get(0)[11];
		idciclo = (Integer) infoFactura.get(0)[12];
		idperiodo = (Integer) infoFactura.get(0)[13];
		iddocumento = (Integer) infoFactura.get(0)[14];
		idtipodocumento = (Integer) infoFactura.get(0)[15];
		cicloano = (Short) infoFactura.get(0)[16];
		idhistoricoliquidacion = (BigInteger) infoFactura.get(0)[17];
		saldofactura = (BigDecimal) infoFactura.get(0)[18];
		idtipotercero = (Integer) infoFactura.get(0)[19];
		fechasuspende = infoFactura.get(0)[4].toString();
		version = (Integer) infoFactura.get(0)[21];
		fechaaprobacion = infoFactura.get(0)[22].toString();
		facidepadre = (BigInteger) infoFactura.get(0)[24];

		// si es tipo reclamacion asociar tipo de documento y cambiar estado a R
		codigoNotaReclamacion = manejadorCprCtrprocesoRespository.obtenerCodigoReclamacion(idempresa);

		if (reclamacion == codigoNotaReclamacion) {
			estado = 'R';
			iddocumento = manejadorCprCtrprocesoRespository.consultarDocumentoPorDocumentoyTipoDocumento(iddocumento,
					idtipodocumento, tipoFactura);
		}

		campos = "fac_metgenera, fac_estado, fac_fecha, fac_fecvence, emp_ideregistro, sus_ideregistro, dsus_ideregistr, uni_tipsuscripc, uni_tipusosuscr, uni_liquidacion, ter_ideregistro, cic_ideregistro, per_ideregistro, uni_documento, uni_tipdocument, cic_ano, hliq_ideregistr, fac_sdoreal, uni_tiptercero, fac_fecsuspens, fac_version, fac_vlrreal, fac_fecaprobada, usu_ideregistro, fac_idepadre";
		valores = "'" + metodogenera + "','" + estado + "','" + fecha + "','" + fechavencimiento + "'," + idempresa
				+ "," + idsuscriptor + "," + idsuscripcion + "," + idtiposuscripcion + "," + idtipousosuscripcion + ","
				+ idliquidacion + "," + idtercero + "," + idciclo + "," + idperiodo + "," + iddocumento + ","
				+ idtipodocumento + "," + cicloano + "," + idhistoricoliquidacion + "," + saldofactura + ","
				+ idtipotercero + ",'" + fechasuspende + "'," + version + "," + valorTotal + ",'" + fechaaprobacion
				+ "'," + idUsuario + ", " + facidepadre + " ";
		respuesta = manejadorCprCtrprocesoRespository.insertar("fac_factura", campos, valores,
				" returning fac_ideregistro");

		idfactura = BigInteger.valueOf(respuesta);
		return idfactura;
	}

	private void aplicarFormulasNovedad(String idFactura) {
		List<Object[]> conceptosNovedad = null;
		List<Object[]> conceptoPadre = null;
		BigDecimal ajusteAAplicar = null;
		String idconceptoPadre = null;
		String idconcepto = null;
		BigDecimal saldoOriginal = null;
		BigDecimal valorOriginal = null;
		BigDecimal valor = null;
		BigDecimal saldoReal = null;
		BigDecimal valorReal = null;
		String[] concatenar = null;

		conceptosNovedad = manejadorCprCtrprocesoRespository.consultarConceptosNovedad(idFactura);

		for (Object[] concepto : conceptosNovedad) {
			idconcepto = concepto[0].toString();
			idconceptoPadre = concepto[2].toString();
			ajusteAAplicar = new BigDecimal(concepto[1].toString());

			conceptoPadre = manejadorCprCtrprocesoRespository.consultarConceptoPadre(idconceptoPadre);
			saldoOriginal = new BigDecimal(conceptoPadre.get(0)[1].toString());
			valorOriginal = new BigDecimal(conceptoPadre.get(0)[2].toString());

			if (ajusteAAplicar.compareTo(BigDecimal.ZERO) >= 0) {
				if ((saldoOriginal.subtract(ajusteAAplicar)).compareTo(BigDecimal.ZERO) >= 0) {

					valor = ajusteAAplicar;
					saldoReal = saldoOriginal.subtract(ajusteAAplicar);
					valorReal = valorOriginal.subtract(ajusteAAplicar);

					concatenar = new String[] { idconcepto, valor.toString(), saldoReal.toString(),
							valorReal.toString(), idconceptoPadre };
					listaCreditos.add(concatenar);
				} else {
					if (saldoOriginal.compareTo(BigDecimal.ZERO) > 0) {

						valor = saldoOriginal;
						saldoReal = saldoOriginal;
						valorReal = valorOriginal;

						concatenar = new String[] { idconcepto, valor.toString(), saldoReal.toString(),
								valorReal.toString(), idconceptoPadre };
						listaCreditos.add(concatenar);
					}
					valor = ajusteAAplicar.subtract(saldoOriginal);
					saldoReal = BigDecimal.ZERO;
					valorReal = valorOriginal.subtract(ajusteAAplicar);

					concatenar = new String[] { idconcepto, valor.toString(), saldoReal.toString(),
							valorReal.toString(), idconceptoPadre };
					listaSaldos.add(concatenar);

				}
			} else {

				valor = ajusteAAplicar.multiply(new BigDecimal("-1"));
				saldoReal = saldoOriginal.add(valor);
				valorReal = valorOriginal.add(valor);

				concatenar = new String[] { idconcepto, valor.toString(), saldoReal.toString(), valorReal.toString(),
						idconceptoPadre };
				listaDebitos.add(concatenar);
			}
		}

	}

	private Integer compararVersion(String idFactura) throws NegocioException {
		Integer version = null;
		try {
			version = manejadorCprCtrprocesoRespository.compararVersionNota(idFactura);
		} catch (Exception e) {
			throw new NegocioException(
					" No existe informacion en las tablas temporales de novedades para la factura  " + idFactura + " ");
		}
		if (version != 0) {
			return version;
		}
		throw new NegocioException(
				" la version de la nota no coincide con la factura original, idfactura nota " + idFactura + " ");
	}

	private BigDecimal actualizarValorFactura(BigInteger idFactura) {
		BigDecimal facvlrreal;
		BigDecimal facsdoreal;
		String parametros;
		String condicion;

		facvlrreal = manejadorCprCtrprocesoRespository.getValorFactura(Integer.parseInt(idFactura.toString()));
		facsdoreal = manejadorCprCtrprocesoRespository.getValorSaldo(Integer.parseInt(idFactura.toString()));

		parametros = " fac_vlrreal = " + facvlrreal + ", fac_sdoreal = " + facsdoreal + " ";
		condicion = " fac_ideregistro = " + idFactura.toString() + " ";

		manejadorCprCtrprocesoRespository.actualizar(parametros, "fac_factura", condicion);

		return facvlrreal;
	}

}
