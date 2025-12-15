package com.bioagricola.apirest.liquidacion.negocio;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.slf4j.LoggerFactory;

import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCprCtrprocesoRespository;
import com.bioagricola.apirest.modelo.manejadores.ManejadorHistoricos;
import javax.transaction.Transactional;

public class NegocioEjecucionHiloDeuda implements Runnable {

	private Integer programaFacturarPeriodo;
	private Object idControlProceso;
	private char adiciona;
	private Boolean susElimina;
	private String factura;
	private Integer tipoNota;
	private Integer versionInicial;
	private Integer idproceso;
	private Integer idacceso;
	private String idUsuario;
	private Integer idempresa;
	private String[] proceso = new String[6];
	private Integer idCiclo;
	private String suscripcion;
	private ManejadorCprCtrprocesoRespository manejadorCprCtrprocesoRespository;
	private NegocioParParametro negocioParParametro;
	private ManejadorHistoricos manejadorHistoricos;
        
	public NegocioEjecucionHiloDeuda(NegocioParParametro negocioParParametro, ManejadorHistoricos manejadorHistoricos,
			ManejadorCprCtrprocesoRespository manejadorCprCtrprocesoRespository, char adiciona, Integer idempresa,
			Integer idproceso, Integer idacceso, Integer idCiclo, String factura, Integer tipoNota, Boolean susElimina,
			String suscricion) {
		super();
		this.manejadorHistoricos = manejadorHistoricos;
		this.manejadorCprCtrprocesoRespository = manejadorCprCtrprocesoRespository;
		this.negocioParParametro = negocioParParametro;
		this.adiciona = adiciona;
		this.idempresa = idempresa;
		this.idproceso = idproceso;
		this.idacceso = idacceso;
		this.idCiclo = idCiclo;
		this.factura = factura;
		this.tipoNota = tipoNota;
		this.susElimina = susElimina;
		this.suscripcion = suscricion;
	}

	private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(NegocioEjecucionHiloDeuda.class);
        
	@Override
	public void run() {
		consultaParametros();
		registrarProceso();
		iniciarProceso();
	}

	public Object getInfoSesion(Integer idacceso) {
		return manejadorCprCtrprocesoRespository.getInfoSesion(idacceso);
	}

	public Integer getIdCiclo() {
		return idCiclo;
	}

	public Object getCicloPeriodoId(Integer idciclo) {
		return manejadorHistoricos.getCicloPeriodoId(idciclo).get(0);

	}

	private void iniciarProceso() {
		String mensaje = "";
		BigInteger idfactura;
		char estado;
		Integer version;
		estado = 'G';
		version = versionInicial;
                
                LOGGER.error("factura -> "+factura);

		if (adiciona == '2') {
			if (!factura.equals("0")) {

				try {
					idfactura = crearNota(adiciona);
					if (idfactura != null) {
						manejadorCprCtrprocesoRespository.insertarDeudaDetalle(estado, version, idUsuario, tipoNota,
								factura, idfactura, idempresa);
					}
					mensaje = "Factura Generada Correctamente";
					actualizarRegistroProceso("G", mensaje);

				} catch (Exception e) {
					mensaje = "Error al crear la TMP de eliminacion";
					actualizarRegistroProceso("I", mensaje);
					LOGGER.info("{}{}{}", mensaje, " ", e.getMessage());
				}

			}
			if (Boolean.TRUE.equals(susElimina)) {
				mensaje = "Eliminar suscripcion";
				actualizarRegistroProceso("G", mensaje);
			}

		} else {
			try {
				idfactura = crearNota(adiciona);

				if (idfactura != null) {
					validarNovedades(idfactura);
				}
				mensaje = "Factura Generada Correctamente";
				actualizarRegistroProceso("G", mensaje);
			} catch (Exception e) {
				mensaje = "Error al crear la TMP de adicion";
				actualizarRegistroProceso("I", mensaje);
				LOGGER.info("{}{}{}", mensaje, " ", e.getMessage());
			}
		}

		LOGGER.info("Fin proceso en el hilo {}{}", this.idproceso, "\r");
		finalizarProceso();

	}

	private BigInteger crearNota(char adiciona) {
		versionInicial = manejadorHistoricos.getFacturaVersion(new BigInteger(factura));
            
		BigInteger idfactura;
		char metodogenera;
		char estado;
		String fecha;
		Integer version;
		String fechaaprobacion;
		BigInteger respuesta;
		Object[] fechaFacturas;
		String fechasuspende;
		String fechavencimiento;

		fechaFacturas = getFechasFactura(suscripcion, factura);

		metodogenera = 'P';
		estado = 'G';
		fecha = fecha();
		fechaaprobacion = fecha();
		version = versionInicial;
		fechasuspende = fechaFacturas[1].toString();
		fechavencimiento = fechaFacturas[0].toString();

		respuesta = manejadorCprCtrprocesoRespository.insertarDeuda(metodogenera, estado, fecha, fechaaprobacion,
				version, idUsuario, tipoNota, factura, fechasuspende, fechavencimiento,adiciona);
                LOGGER.error("respuesta -> "+respuesta);
		idfactura = respuesta;

		return idfactura;

	}

	/*
	 * Se consultan las fechas de vencimiento y de suspensión de acuerdo a la tabla
	 * rupe
	 */
	private Object[] getFechasFactura(String suscripcion, String factura) {
		Object[] infoFactura;
		Object[] fechas;
		Object[] fechasRutas;
		Object[] infoLiquidacion;
		Integer idliquidacion;
		Integer idperiodoF;
		String fechavencimiento = null;
		String fechasuspension;
		String liqLiquidacion;
		String fechaLiqLiquidacion = "";

		liqLiquidacion = "liqliquidacion";
		infoFactura = manejadorCprCtrprocesoRespository.consultarFactura(factura).get(0);
		idperiodoF = Integer.parseInt(infoFactura[13].toString());
		idliquidacion = Integer.parseInt(infoFactura[10].toString());
		fechavencimiento = (infoFactura[4] == null) ? null : infoFactura[4].toString();
		fechasuspension = (infoFactura[20] == null) ? null : infoFactura[20].toString();

		fechasRutas = manejadorCprCtrprocesoRespository.getFechasRutaPeriodo(new BigInteger(suscripcion), idperiodoF);

		if (fechasRutas.length > 0) {
			return fechasRutas;
		}

		if (fechavencimiento != null) {
			fechas = new Object[] { fechavencimiento, fechasuspension };
			return fechas;
		}
		infoLiquidacion = (Object[]) manejadorHistoricos.getLiquidacionSuscripcion(idliquidacion, liqLiquidacion,
				fechaLiqLiquidacion);
		fechas = new Object[] { infoLiquidacion[4], infoLiquidacion[3] };
		return fechas;
	}

	private void consultaParametros() {
		Map<String, Object> parametros = null;
		try {
			parametros = negocioParParametro.consultaParametros(idempresa,
					ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
			programaFacturarPeriodo = (Integer) parametros.get(ConstantesServicios.PROGRAMA_FACTURAR_PERIODO);
		} catch (IOException e  ) {
			LOGGER.info("Error no controlado en consultaParametros {}", e.getMessage());
		} catch (Exception i ) {
                    i.printStackTrace();
                }
                
                
	}

	public void registrarProceso() {
		try {
			proceso[0] = "A"; // estado
			proceso[1] = fecha(); // fechaInicio
			proceso[2] = String.valueOf(tipoNota);//programaFacturarPeriodo); // idPrograma
			proceso[3] = idacceso.toString(); // idAcceso
			proceso[4] = idempresa.toString(); // idEmpresa
			proceso[5] = idproceso.toString(); // idHilo
			idControlProceso = insertarProceso(proceso);
		} catch (Exception exc) {
			LOGGER.info("Error al registrar el proceso {}", exc.getMessage());
		}
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

	private Object insertarProceso(String[] proceso) {

		Object[] infoSesion;
		String cprEstado;
		Timestamp cprFecinicio;
		Integer cprCanregistro;
		Integer prgIderegistro;
		Integer accIderegistro;
		Integer empIderegistro;
		Integer cprIdehilo;
		Integer usuIderegistro;
		String campos;
		String valores;
		Long respuesta;

		infoSesion = (Object[]) getInfoSesion(idacceso);
		idUsuario = infoSesion[1].toString();

		cprEstado = proceso[0];
		cprFecinicio = Timestamp.valueOf(proceso[1]);
		cprCanregistro = 0; // cpr_canregistro
		prgIderegistro = Integer.parseInt(proceso[2]);// prg_ideregistro
		accIderegistro = Integer.parseInt(proceso[3]); // acc_ideregistro
		empIderegistro = Integer.parseInt(proceso[4]); // emp_ideregistro
		cprIdehilo = Integer.parseInt(proceso[5]); // cpr_idehilo
		usuIderegistro = Integer.parseInt(idUsuario); // usu_ideregistro

		campos = " cpr_estado, cpr_fecinicio, cpr_canregistro, prg_ideregistro, acc_ideregistro, emp_ideregistro, cpr_idehilo, usu_ideregistro ";
		valores = " '" + cprEstado + "','" + cprFecinicio + "'," + cprCanregistro + "," + prgIderegistro + ","
				+ accIderegistro + "," + empIderegistro + "," + cprIdehilo + "," + usuIderegistro + " ";

		respuesta = manejadorCprCtrprocesoRespository.insertar("cpr_ctrproceso", campos, valores,
				"returning cpr_ideregistro");

		return respuesta;

	}

	private void actualizarRegistroProceso(String estado, String mensaje) {
		try {
			actualizarRegistroMasivo(idproceso, estado, mensaje, idempresa);
		} catch (Exception exc) {
			LOGGER.info(Arrays.toString(exc.getStackTrace()));
		}

	}

	private void actualizarRegistroMasivo(Integer proceso, String estado, String mensaje, Integer idempresa) {
		String parametros;
		String condicion;
		String tabla;

		parametros = " estado = '" + estado + "' , mensaje = '" + mensaje + "' ";
		condicion = " proceso = " + proceso + " ";
		tabla = "proceso_refacturacion_" + idempresa + "";

		manejadorCprCtrprocesoRespository.actualizar(parametros, tabla, condicion);
	}

	/* Finalizar proceso */
	private void finalizarProceso() {
		try {
			finalizarProceso(idControlProceso);

		} catch (Exception exc) {
			LOGGER.info(Arrays.toString(exc.getStackTrace()));
		}

	}

	private void finalizarProceso(Object idControlProceso) {

		char cprEstado = 'I';
		String cprFecfinal = fecha();
		Integer cprIderegistro = Integer.parseInt(idControlProceso.toString());

		String parametros = " cpr_estado = '" + cprEstado + "', cpr_fecfinal = '" + cprFecfinal + "' ";
		String condicion = " cpr_ideregistro = " + cprIderegistro + " ";

		manejadorCprCtrprocesoRespository.actualizar(parametros, "cpr_ctrproceso", condicion);
		LOGGER.info("proceso {}{}{}{}", cprIderegistro, " finalizado, hilo  ", this.idproceso, " ");
	}

	public void validarNovedades(BigInteger idfacturanov) {
		List<Object[]> novedades;
		char estado;
		BigDecimal cantidad;
		BigDecimal valorunitario;
		BigDecimal valortotal;
		BigDecimal valorreal;
		BigDecimal saldoreal;
		Integer idconcepto;
		Integer version;
		Integer idusuario;
		BigInteger dfacIdeorigen;
		BigInteger damoIderegistr;
		BigInteger dfacIdepadre;
		BigInteger dfinIderegistr;
		String campos;
		String valores;
		String mensaje;

		novedades = manejadorHistoricos.getNovedadesDeuda(Long.parseLong(factura));

		if (novedades.isEmpty()) {
			mensaje = "no se encontraron conceptos a adicionar para la factura " + factura + " ";
			actualizarRegistroProceso("F", mensaje);
			LOGGER.info(mensaje);
		}

		else {

			for (int i = 0; novedades.size() > i; i++) {
				estado = (char) novedades.get(i)[0];
				cantidad = (BigDecimal) novedades.get(i)[1];
				valorunitario = (BigDecimal) novedades.get(i)[2];
				valortotal = (BigDecimal) novedades.get(i)[3];
				valorreal = (BigDecimal) novedades.get(i)[4];
				saldoreal = (BigDecimal) novedades.get(i)[5];
				idconcepto = Integer.parseInt(novedades.get(i)[7].toString());
				version = Integer.parseInt(novedades.get(i)[8].toString());
				idusuario = Integer.parseInt(novedades.get(i)[9].toString());
				dfacIdeorigen = (novedades.get(i)[10] == null) ? null : (BigInteger) novedades.get(i)[10];
				damoIderegistr = (novedades.get(i)[11] == null) ? null : (BigInteger) novedades.get(i)[11];
				dfacIdepadre = (novedades.get(i)[13] == null) ? null : (BigInteger) novedades.get(i)[13];
				dfinIderegistr = (novedades.get(i)[12] == null) ? null : (BigInteger) novedades.get(i)[12];

				campos = "dfac_estado,dfac_cantidad,dfac_vlrunitari,dfac_vlrtotal,dfac_vlrreal,dfac_sdoreal,fac_ideregistro,uni_concepto,dfac_version,usu_ideregistro,dfac_ideorigen,damo_ideregistr,dfac_idepadre,dfin_ideregistr,tipo_nota,emp_ideregistro";
				valores = "'" + estado + "'," + cantidad + "," + valorunitario + "," + valortotal + "," + valorreal
						+ "," + saldoreal + "," + idfacturanov + "," + idconcepto + "," + version + "," + idusuario
						+ "," + dfacIdeorigen + "," + damoIderegistr + "," + dfacIdepadre + "," + dfinIderegistr + ","
						+ tipoNota + "," + idempresa;

				manejadorCprCtrprocesoRespository.insertar("dfac_detnovedad", campos, valores,
						" returning dfac_ideregistr");
			}
			actualizarValorFactura(idfacturanov);
		}
	}

	/* Suma los detalles de la factura */
	private void actualizarValorFactura(BigInteger idfactura) {
		BigDecimal valor;
		BigInteger facIderegistro;
		BigDecimal facVlrreal;
		BigDecimal facSdoreal;
		String parametros;
		String condicion;

		valor = manejadorHistoricos.getValorFactura(idfactura);

		facIderegistro = idfactura ;
		facVlrreal = valor;
		facSdoreal = valor;

		parametros = " fac_vlrreal = " + facVlrreal + ", fac_sdoreal = " + facSdoreal + " ";
		condicion = " fac_ideregistro = " + facIderegistro + " ";

		manejadorCprCtrprocesoRespository.actualizar(parametros, "fac_novedad", condicion);
	}

}
