package com.bioagricola.apirest.liquidacion.negocio;

import java.io.IOException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.OptionalInt;
import java.util.stream.IntStream;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

import org.slf4j.LoggerFactory;

import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.excepciones.NegocioException;
import com.bioagricola.apirest.modelo.manejadores.ManejadorConConcepto;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCprCtrprocesoRespository;
import com.bioagricola.apirest.modelo.manejadores.ManejadorHistoricos;
import com.bioagricola.apirest.modelo.manejadores.utils.Json;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class NegocioReEjecucionHiloLiquidacion implements Runnable {

	private Integer cantidadDecimales;
	private Integer programaFacturarPeriodo;
	private Integer conceptoaforoextraordinario;
	private Object idControlProceso;
	private Object cicloPeriodo;
	private char preliquidar;
	private String suscripcion;
	private Integer tipoNota;
	private Integer faIdregistro;
	private Integer versionInicial;
	private Timestamp fechaDesde;
	private Timestamp fechaHasta;
	private Integer idperiodo;
	private List<Object> listaLiquidaciones;
	private List<Object> listaConceptosLiquidados = new ArrayList<>();
	private List<Integer> listaConceptosLiquidados2 = new ArrayList<>();
	private Integer idempresa;
	private Long idsuscripcion = null;
	private Integer idproceso;
	private Integer idacceso;
	private String idUsuario;
	private BigInteger idfactura;
	private String[] proceso = new String[6];

	private List<Object[]> infoConceptoF = new ArrayList<>();
	private List<Object[]> conceptosNota = new ArrayList<>();
	private Integer idCiclo;
	private ManejadorCprCtrprocesoRespository manejadorCprCtrprocesoRespository;
	private ManejadorConConcepto manejadorConConcepto;
	private FuncionesConceptos funcionesConceptos;
	private NegocioParParametro negocioParParametro;
	private ManejadorHistoricos manejadorHistoricos;

	private String coliConliquida;
	private String conConcepto;
	private String coreConrelacio;
	private String dsusDetsuscrip;
	private String liqLiquidacion;
	private String racoRanconcept;
	private String fechaColiConliquida = "";
	private String fechaConConcepto = "";
	private String fechaCoreConrelacio = "";
	private String fechaDsusDetsuscrip = "";
	private String fechaLiqLiquidacion = "";
	private String fechaRacoRanconcept = "";

	public NegocioReEjecucionHiloLiquidacion(NegocioParParametro negocioParParametro,
			ManejadorHistoricos manejadorHistoricos,
			ManejadorCprCtrprocesoRespository manejadorCprCtrprocesoRespository,
			ManejadorConConcepto manejadorConConcepto, FuncionesConceptos funcionesConceptos, char preliquidar,
			Integer idempresa, Integer idproceso, Integer idacceso, Integer idCiclo, String suscripcion,
			Integer tipoNota) {
		super();
		this.manejadorHistoricos = manejadorHistoricos;
		this.manejadorCprCtrprocesoRespository = manejadorCprCtrprocesoRespository;
		this.manejadorConConcepto = manejadorConConcepto;
		this.negocioParParametro = negocioParParametro;
		this.funcionesConceptos = funcionesConceptos;
		this.preliquidar = preliquidar;
		this.idempresa = idempresa;
		this.idproceso = idproceso;
		this.idacceso = idacceso;
		this.idCiclo = idCiclo;
		this.suscripcion = suscripcion;
		this.tipoNota = tipoNota;
	}

	private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(NegocioReEjecucionHiloLiquidacion.class);

	// Método encargado de obtener la información respectiva al usuario Como el ID,
	// cédula, perfil y empresa.

	public Object getInfoSesion(Integer idacceso) {
		return manejadorCprCtrprocesoRespository.getInfoSesion(idacceso);
	}

	public Integer getIdCiclo() {
		return idCiclo;
	}

	/* Método que obtiene el id del periodo del periodo que se está evaluando */
	public Object getCicloPeriodoId(Integer idciclo) {
		return manejadorHistoricos.getCicloPeriodoId(idciclo).get(0);

	}

	/* Método que ejecuta la vida del hilo */
	@Override
	public void run() {
		consultaParametros();
		registrarProceso();
		iniciarProceso();
	}

	private void iniciarProceso() {
		List<Object[]> cicloPeriodoI;
		String mensaje;
		Integer idliquidacion;
		String estado;

		// consultar en la tabla temporal el periodo y las fechas para hacer un for por
		// periodo
		cicloPeriodoI = manejadorHistoricos.getPeriodoProceso(this.idempresa.toString(), Long.valueOf(this.idproceso),
				tipoNota, idUsuario);

		if (cicloPeriodoI.isEmpty()) {
			mensaje = "no existe informacion en la tabla temporal para la empresa " + this.idempresa.toString()
					+ ", el tipo nota " + tipoNota + " y el usuario " + idUsuario + "";
			actualizarRegistroProceso("F", mensaje);
			LOGGER.info(mensaje);
		}
		for (Object[] periodo : cicloPeriodoI) {
			faIdregistro = null;
			listaLiquidaciones = new ArrayList<>();
			idperiodo = null;

			idperiodo = Integer.parseInt(periodo[0].toString());
			fechaDesde = (Timestamp) periodo[1];
			fechaHasta = (Timestamp) periodo[2];
			idliquidacion = Integer.parseInt(periodo[3].toString());
			this.cicloPeriodo = getCicloPeriodoId(this.idperiodo);

			if (cicloPeriodo == null) {
				mensaje = ("No hay informacion para el ciclo: " + idperiodo + "");
				estado = "F";
				this.actualizarRegistroProceso(Integer.parseInt(suscripcion), estado, mensaje, this.idempresa,
						idperiodo);
			} else {

				faIdregistro = manejadorHistoricos.getFacturaIdRegistro(suscripcion, idperiodo, idliquidacion);

				if (faIdregistro != 0) {
					versionInicial = manejadorHistoricos.getFacturaVersion(faIdregistro);
					iniciar();
				} else {
					mensaje = "No hay una factura Origen de la suscripcion " + suscripcion + " para el periodo "
							+ idperiodo.toString();
					estado = "F";
					this.actualizarRegistroProceso(Integer.parseInt(suscripcion), estado, mensaje, this.idempresa,
							idperiodo);
					LOGGER.info(mensaje);
				}
			}

		}
		LOGGER.info("No hay más suscripciones que procesar, hilo {}{}", this.idproceso, "\r");
		finalizarProceso();

	}

	private void consultaParametros() {
		Map<String, Object> parametros = null;
		try {
			parametros = negocioParParametro.consultaParametros(idempresa,
					ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
			cantidadDecimales = (Integer) parametros.get(ConstantesServicios.CANTIDAD_DECIMALES);
			programaFacturarPeriodo = (Integer) parametros.get(ConstantesServicios.PROGRAMA_FACTURAR_PERIODO);
			conceptoaforoextraordinario = (Integer) parametros
					.get(ConstantesServicios.UNI_CONCEPTO_AFORO_EXTRAORDINARIO);
		} catch (IOException e) {
			LOGGER.info("Error no controlado en consultaParametros {}", e.getMessage());
		}

	}

	public void registrarProceso() {
		try {
			proceso[0] = "A"; // estado
			proceso[1] = fecha(); // fechaInicio
			proceso[2] = String.valueOf(programaFacturarPeriodo); // idPrograma
			proceso[3] = idacceso.toString(); // idAcceso
			proceso[4] = idempresa.toString(); // idEmpresa
			proceso[5] = idproceso.toString(); // idHilo
			idControlProceso = insertarProceso(proceso);
		} catch (Exception exc) {
			LOGGER.info(exc.toString());
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

	/*
	 * Ingresa una nueva ejecución de un proceso
	 * 
	 * @param proceso Detalle del proceso que se quiere ingresar.
	 * 
	 * @return Identificador del nueva ejecución del proceso.
	 */
	private Object insertarProceso(String[] proceso) {

		Object[] infoSesion;
		String cprestado;
		Timestamp cprfecinicio;
		Integer cprcanregistro;
		Integer prgideregistro;
		Integer accideregistro;
		Integer empideregistro;
		Integer cpridehilo;
		Integer usuideregistro;
		String campos;
		String valores;
		Long respuesta;

		infoSesion = (Object[]) getInfoSesion(idacceso);
		idUsuario = infoSesion[1].toString();

		cprestado = proceso[0];
		cprfecinicio = Timestamp.valueOf(proceso[1]);
		cprcanregistro = 0; // cpr_canregistro
		prgideregistro = Integer.parseInt(proceso[2]);// prg_ideregistro
		accideregistro = Integer.parseInt(proceso[3]); // acc_ideregistro
		empideregistro = Integer.parseInt(proceso[4]); // emp_ideregistro
		cpridehilo = Integer.parseInt(proceso[5]); // cpr_idehilo
		usuideregistro = Integer.parseInt(idUsuario); // usu_ideregistro

		campos = " cpr_estado, cpr_fecinicio, cpr_canregistro, prg_ideregistro, acc_ideregistro, emp_ideregistro, cpr_idehilo, usu_ideregistro ";
		valores = " '" + cprestado + "','" + cprfecinicio + "'," + cprcanregistro + "," + prgideregistro + ","
				+ accideregistro + "," + empideregistro + "," + cpridehilo + "," + usuideregistro + " ";

		respuesta = manejadorCprCtrprocesoRespository.insertar("cpr_ctrproceso", campos, valores,
				"returning cpr_ideregistro");

		return respuesta;

	}

	public void iniciar() {

		try {
			validarHistoricos(fechaDesde, fechaHasta);// metodo de validacion de historicas
			cargarLiquidaciones();
			getConceptosTipoNota();
			procesarSuscripciones();
			validarNovedades();
		} catch (NegocioException e) {
			String mensaje = "Se procede a finalizar el proceso; " + proceso;
			LOGGER.info(mensaje);
			if (e.hashCode() == -4) {
				actualizarRegistroProceso("F", mensaje + " Se genero la siguiente exepcion: " + e.getMessage());
			}
			LOGGER.info(e.getMessage());
		} catch (Exception e) {
			LOGGER.info(e.getMessage());
		}

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

	/**
	 * Finalizar proceso
	 */
	private void finalizarProceso(Object idControlProceso) {

		char cprestado = 'I';
		String cprfecfinal = fecha();
		Integer cprideregistro = Integer.parseInt(idControlProceso.toString());

		String parametros = " cpr_estado = '" + cprestado + "', cpr_fecfinal = '" + cprfecfinal + "' ";
		String condicion = " cpr_ideregistro = " + cprideregistro + " ";

		manejadorCprCtrprocesoRespository.actualizar(parametros, "cpr_ctrproceso", condicion);
		LOGGER.info("proceso {}{}{}{}", cprideregistro, " finalizado, hilo  ", this.idproceso, " ");
	}

	/**
	 * Se procede a liquidar todas las suscripciones del proceso
	 */
	private void procesarSuscripciones() {
		Object[] fields;
		List<Object> listaSuscripciones;
		listaSuscripciones = manejadorHistoricos.getSuscripcionPorProceso(idempresa.toString(), Long.valueOf(idproceso),
				dsusDetsuscrip, fechaDsusDetsuscrip, idperiodo, tipoNota, idUsuario);
		if (listaSuscripciones.isEmpty()) {
			return;
		}
		for (Object item : listaSuscripciones) {
			fields = (Object[]) item;
			try {
				LOGGER.info("Procesando suscripcion {}{}{}{}", fields[0], " para el periodo ", idperiodo, "\n");
				facturarSuscripcion(item);
			} catch (Exception e) {
				LOGGER.info(e.getMessage());
			}
		}
		procesarSuscripciones();

	}

	/**
	 * Método encargado de generar la factura de servicio de una suscripción
	 * 
	 * @param $suscripcion
	 * @return
	 * @throws Exception
	 */
	private List<Object> facturarSuscripcion(Object suscripcionF) throws Exception {
		String estado;
		String mensaje;
		Object[] fields;
		Integer valor;
		Long factura;
		List<Object> infoFactura;

		infoFactura = new ArrayList<>();
		infoConceptoF = new ArrayList<>();

		Object[] liquidacion;
		try {

			estado = "G";
			mensaje = "Factura generada correctamente ";
			fields = (Object[]) suscripcionF;
			valor = Integer.parseInt(fields[1].toString()); // idliquidacion
			liquidacion = buscarLiquidacion(valor);
			infoFactura.add(suscripcionF);// suscripcion
			infoFactura.add(cicloPeriodo);// cicloperiodo
			infoFactura.add(liquidacion);// liquidacion

			// Se valida si la suscripción ya tiene una factura para el ciclo periodo actual
			// si es así ya no se liquida

			factura = getFacturaCicloPeriodoActual(infoFactura);
			if (factura != null) {
				liquidarSuscripcion(infoFactura);
				// Se genera el emitido en las tablas de faca_ dfcs_ dfci
			} else {
				estado = "N";

				mensaje = "La suscipción no esta lista para reliquidar";
			}

			// Actualiza la tabla temporal para que no vuelva a procesar la misma
			// suscripción

			actualizarRegistro(suscripcionF, estado, mensaje);
		} catch (Exception e) {
			estado = "F";
			mensaje = "Error al facturar Suscripcion " + e.getMessage();
			LOGGER.info(mensaje);
			actualizarRegistro(suscripcionF, estado, mensaje);
			throw e;
		}
		return infoFactura;

	}

	/**
	 * Método que obtiene ciclo y periodo actual de la factura
	 * 
	 * @param infoFactura
	 * @return
	 */
	private Long getFacturaCicloPeriodoActual(Object infoFactura) {
		ArrayList<?> fields = null;

		Integer iddocumento = null;
		Integer idtipodocumento = null;
		Integer idciclo = null;
		Integer idperiodoF = null;

		fields = (ArrayList<?>) infoFactura;
		Object[] suscripcionF = (Object[]) fields.get(0);
		Object[] cicloperiodo = (Object[]) fields.get(1);
		Object[] objliquidacion = (Object[]) fields.get(2);
		Object[] liquidacion = (Object[]) objliquidacion[0];

		idsuscripcion = Long.parseLong(suscripcionF[0].toString());
		iddocumento = Integer.parseInt(liquidacion[2].toString());
		idtipodocumento = Integer.parseInt(liquidacion[1].toString());
		idciclo = Integer.parseInt(cicloperiodo[0].toString());
		idperiodoF = Integer.parseInt(cicloperiodo[2].toString());

		return Long.parseLong(manejadorHistoricos
				.getFacturaCicloPeriodoActual(idsuscripcion, iddocumento, idtipodocumento, idciclo, idperiodoF)
				.toString());

	}

	/* Aumenta la cantidad de registros procesados por el hilo */
	private void actualizarRegistro(Object suscripcion, String estado, String mensaje) {
		Object[] items = (Object[]) suscripcion;
		Integer idsuscripcionF = Integer.parseInt(items[0].toString());

		try {
			actualizarRegistroProceso(idsuscripcionF, estado, mensaje, idempresa, idperiodo);
			Integer idcontrol = Integer.parseInt(idControlProceso.toString());
			manejadorCprCtrprocesoRespository.aumentarCantidadRegistro(idcontrol);
		} catch (Exception exc) {
			LOGGER.info(Arrays.toString(exc.getStackTrace()));
		}

	}

	/* Función actualizarRegistroProceso */
	private void actualizarRegistroProceso(Integer idsuscripcion, String estado, String mensaje, Integer idempresa,
			Integer idperiodo) {
		String parametros;
		String condicion;
		String tabla;
		parametros = " estado = '" + estado + "' , mensaje = '" + mensaje + "' ";
		condicion = " idsuscripcion = " + idsuscripcion + " and per_ideregistro = " + idperiodo
				+ " and usu_ideregistro  =" + idUsuario + " and tipo_nota =" + tipoNota + "";
		tabla = " proceso_refacturacion_" + idempresa + " ";

		manejadorCprCtrprocesoRespository.actualizar(parametros, tabla, condicion);

	}

	/* Método encargado de invocar el método genérico de liquidación */
	private void liquidarSuscripcion(List<Object> infoFactura) throws Exception {
		Integer idliquidacion;
		Object[] conceptouni;
		char preliquida;
		Integer idconcepto;
		Object[] factura;
		BigInteger idfacturaF;
		Object conceptoLiquidado;
		List<Object> conceptos = new ArrayList<>();
		Object[] valoresconcepto;
		Object[] concatenar;
		Object[] objliquidacion = (Object[]) infoFactura.get(2);
		Object[] liquidacion = (Object[]) objliquidacion[0];
		Object[] concepto = (Object[]) objliquidacion[1];
		idliquidacion = (Integer) liquidacion[0];

		for (Object $concepto : concepto) {
			/**
			 * *Si los conceptos están parametrizados de que no preliquidar significa que lo
			 * liquida el sistema * Si el concepto dice que preliquida está condicionado a
			 * lo que el usuario escoja en la interfaz, si se escoge que si el sistema lo
			 * preliquida de lo contrario se registra el concepto en 0
			 */
			conceptouni = (Object[]) $concepto;
			preliquida = (char) conceptouni[1];
			idconcepto = (Integer) conceptouni[0];

			if ((preliquida == 'S' && preliquidar == 'S') || preliquida == 'N') {
				conceptoLiquidado = iniciarLiquidacionConcepto(idconcepto, idliquidacion, null);
			} else {
				// Registra el concepto vació
				valoresconcepto = new Object[] { BigDecimal.ZERO, BigDecimal.ZERO, 1, BigDecimal.ZERO };
				concatenar = new Object[] { $concepto, valoresconcepto };

				$concepto = concatenar;
				conceptoLiquidado = $concepto;
			}
			conceptos.add(conceptoLiquidado);
		}
		infoFactura.add(3, conceptos);
		crearFactura(infoFactura);
		procesarDetallesFacturas(infoFactura);
		factura = (Object[]) infoFactura.get(4);
		idfacturaF = new BigInteger(factura[1].toString());
		actualizarValorFactura(idfacturaF);

	}

	/* Suma los detalles de la factura */
	private void actualizarValorFactura(BigInteger idfactura) {
		BigDecimal valor;
		Integer facideregistro;
		BigDecimal facvlrreal;
		BigDecimal facsdoreal;
		String parametros;
		String condicion;

		valor = manejadorHistoricos.getValorFactura(Integer.parseInt(idfactura.toString()));

		facideregistro = Integer.parseInt(idfactura.toString());
		facvlrreal = valor;
		facsdoreal = valor;

		parametros = " fac_vlrreal = " + facvlrreal + ", fac_sdoreal = " + facsdoreal + " ";
		condicion = " fac_ideregistro = " + facideregistro + " ";

		manejadorCprCtrprocesoRespository.actualizar(parametros, "fac_novedad", condicion);
	}

	/* Inserta los detalles de factura */
	@SuppressWarnings("unchecked")
	private void procesarDetallesFacturas(List<Object> infoFactura) {
		ArrayList<Object> concepto;
		Object[] itemconceptos;
		Object[] itemvalores;
		ArrayList<Object> conceptos;
		char estado;
		Integer cantidad;
		BigDecimal valorunitario;
		BigDecimal valortotal;
		BigDecimal valorreal;
		BigDecimal saldoreal;
		BigInteger idfacturaF;
		Integer idconcepto;
		Integer version;
		Integer idusuario;
		Object[] factura;

		conceptos = (ArrayList<Object>) infoFactura.get(3);
		factura = (Object[]) infoFactura.get(4);

		Object[] detalleFactura;
		ArrayList<Object> listadetalleFactura = new ArrayList<>();
		String campos = "dfac_estado,dfac_cantidad,dfac_vlrunitari,dfac_vlrtotal,dfac_vlrreal,dfac_sdoreal,fac_ideregistro,uni_concepto,dfac_version,usu_ideregistro,"
				+ " dfac_ideorigen,damo_ideregistr,dfac_idepadre,dfin_ideregistr,tipo_nota";
		String valores;

		idfacturaF = new BigInteger(factura[1].toString());
		idusuario = Integer.parseInt(idUsuario);
		version = versionInicial;
		estado = 'A';

		for (Object arrayconcepto : conceptos) {
			concepto = (ArrayList<Object>) arrayconcepto;
			itemconceptos = (Object[]) concepto.get(0);
			itemvalores = (Object[]) concepto.get(1);

			cantidad = (Integer) itemvalores[2];
			valorunitario = (BigDecimal) itemvalores[1];
			valortotal = (BigDecimal) itemvalores[0];
			valorreal = (BigDecimal) itemvalores[3];
			saldoreal = (BigDecimal) itemvalores[3];
			idconcepto = (Integer) itemconceptos[0];

			detalleFactura = new Object[] { estado, cantidad, valorunitario, valortotal, valorreal, saldoreal,
					idfacturaF, idconcepto, version, idusuario, 0, 0, 0, 0 };

			valores = "'" + estado + "'," + cantidad + "," + valorunitario + "," + valortotal + "," + valorreal + ","
					+ saldoreal + "," + idfacturaF + "," + idconcepto + "," + version + "," + idusuario + ",0,0,0,0,"
					+ tipoNota + " ";

			manejadorCprCtrprocesoRespository.insertar("dfac_detnovedad", campos, valores,
					" returning dfac_ideregistr");

			listadetalleFactura.add(detalleFactura);

		}
		infoFactura.add(listadetalleFactura);
	}

	/* Registra la factura */
	private void crearFactura(List<Object> infoFactura) {
		Object[] suscripcionF;
		Object[] cicloperiodo;
		Object[] objliquidacion;
		Object[] liquidacion;
		Object[] factura;
		Object[] fechaFacturas;

		BigDecimal valorTotal;
		char metodogenera;
		char estado;
		String fecha;
		String fechavencimiento;
		Integer idempresaF;
		BigInteger idsuscriptor;
		BigInteger idsuscripcionF;
		Integer idtiposuscripcion;
		Integer idtipousosuscripcion;
		Integer idliquidacion;
		BigInteger idtercero;
		Integer idciclo;
		Integer idperiodoF;
		Integer iddocumento;
		Integer idtipodocumento;
		Short cicloano;
		Integer idhistoricoliquidacion;
		BigDecimal saldofactura;
		Integer idtipotercero;
		String fechasuspende;
		Integer version;
		String fechaaprobacion;
		String campos;
		String valores;
		Long respuesta;

		idfactura = null;
		suscripcionF = (Object[]) infoFactura.get(0);
		cicloperiodo = (Object[]) infoFactura.get(1);
		objliquidacion = (Object[]) infoFactura.get(2);
		liquidacion = (Object[]) objliquidacion[0];
		fechaFacturas = getFechasFactura(suscripcionF, cicloperiodo);

		valorTotal = BigDecimal.ZERO;
		metodogenera = 'P';
		estado = 'G';
		fecha = fecha();
		fechavencimiento = fechaFacturas[0].toString();
		idempresaF = (Integer) suscripcionF[3];
		idsuscriptor = (BigInteger) suscripcionF[4];
		idsuscripcionF = (BigInteger) suscripcionF[0];
		idtiposuscripcion = (Integer) suscripcionF[5];
		idtipousosuscripcion = (Integer) suscripcionF[6];
		idliquidacion = (Integer) liquidacion[0];
		idtercero = (BigInteger) suscripcionF[7];
		idciclo = (Integer) cicloperiodo[0];
		idperiodoF = (Integer) cicloperiodo[2];
		iddocumento = (Integer) liquidacion[2];
		idtipodocumento = (Integer) liquidacion[1];
		cicloano = (Short) cicloperiodo[4];
		idhistoricoliquidacion = 0;
		saldofactura = valorTotal;
		idtipotercero = (Integer) suscripcionF[8];
		fechasuspende = fechaFacturas[1].toString();
		version = versionInicial;
		fechaaprobacion = fecha();

		campos = "fac_metgenera, fac_estado, fac_fecha, fac_fecvence, emp_ideregistro, sus_ideregistro, dsus_ideregistr, uni_tipsuscripc, uni_tipusosuscr, "
				+ "uni_liquidacion, ter_ideregistro, cic_ideregistro, per_ideregistro, uni_documento, uni_tipdocument, cic_ano, hliq_ideregistr, fac_sdoreal, "
				+ "uni_tiptercero, fac_fecsuspens, fac_version, fac_vlrreal, fac_fecaprobada, usu_ideregistro,tipo_nota";
		valores = "'" + metodogenera + "','" + estado + "','" + fecha + "','" + fechavencimiento + "'," + idempresaF
				+ "," + idsuscriptor + "," + idsuscripcionF + "," + idtiposuscripcion + "," + idtipousosuscripcion + ","
				+ idliquidacion + "," + idtercero + "," + idciclo + "," + idperiodoF + "," + iddocumento + ","
				+ idtipodocumento + "," + cicloano + "," + idhistoricoliquidacion + "," + saldofactura + ","
				+ idtipotercero + ",'" + fechasuspende + "'," + version + "," + valorTotal + ",'" + fechaaprobacion
				+ "'," + idUsuario + "," + tipoNota + "";
		respuesta = manejadorCprCtrprocesoRespository.insertar("fac_novedad", campos, valores,
				" returning fac_ideregistro ");

		idfactura = BigInteger.valueOf(respuesta);

		factura = new Object[] { metodogenera, estado, fecha, fechavencimiento, idempresaF, idsuscriptor,
				idsuscripcionF, idtiposuscripcion, idtipousosuscripcion, idliquidacion, idtercero, idciclo, idperiodoF,
				iddocumento, idtipodocumento, cicloano, idhistoricoliquidacion, saldofactura, idtipotercero,
				fechasuspende, version, valorTotal, fechaaprobacion, idUsuario };

		factura = new Object[] { factura, idfactura };

		infoFactura.add(factura);

	}

	/*
	 * Se consultan las fechas de vencimiento y de suspensión de acuerdo a la tabla
	 * rupe
	 */
	private Object[] getFechasFactura(Object[] suscripcion, Object[] cicloperiodo) {
		Object[] itemssus;
		Object[] itemscic;
		Object[] fechas;
		Object[] fechasRutas;
		Object[] infoLiquidacion;
		BigInteger idsuscripcionF;
		Integer idliquidacion;
		Integer idperiodoF;
		String fechavencimiento;
		String fechasuspension;

		itemssus = suscripcion;
		itemscic = cicloperiodo;
		idsuscripcionF = (BigInteger) itemssus[0];

		idliquidacion = (Integer) itemssus[1];
		idperiodoF = (Integer) itemscic[2];
		fechavencimiento = (String) itemscic[5];
		fechasuspension = (String) itemscic[6];


		fechasRutas =  manejadorCprCtrprocesoRespository.getFechasRutaPeriodo(idsuscripcionF, idperiodoF);
			

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

	/**
	 * Método inicial que verifica si el concepto tiene toda la configuración sino
	 * la tiene la consulta, verifica si el concepto ya fue liquidado, si éste fue
	 * liquidado únicamente lo retorna de lo contrario realiza la liquidación y
	 * verifica qué tipo de concepto es si es un concepto que suma o informativo
	 */
	private Object iniciarLiquidacionConcepto(Integer idconcepto, Integer liquidaciones, List<Object[]> infoConcepto)
			throws Exception {
		listaConceptosLiquidados = new ArrayList<>();
		listaConceptosLiquidados2 = new ArrayList<>();
		infoConceptoF = infoConcepto;
		Object conceptoLiquidado;
		List<Object[]> infoConceptoFCalculado;

		if (infoConceptoF == null) {
			infoConceptoF = manejadorHistoricos.getConceptoInformacion(idconcepto, conConcepto, fechaConConcepto);
		}
		// Verifica si el concepto ya fue liquidado
		conceptoLiquidado = buscarConceptoLiquidado(idconcepto);
		if (conceptoLiquidado != null) {
			return conceptoLiquidado;
		}
		// liquida el concepto de acuerdo a los conceptos realcionados y rangos
		liquidarConcepto(infoConceptoF, liquidaciones);
		infoConceptoFCalculado = buscarConcepto(idconcepto);
		// Valida si el concepto es informativo o suma
		calculaValorRealConcepto(infoConceptoFCalculado);
		return infoConceptoFCalculado;
	}

	/* Establece el valor real del concepto */
	private void calculaValorRealConcepto(List<Object[]> infoConceptoF) {
		String operacion = infoConceptoF.get(0)[8].toString();
		BigInteger idconcepto;
		List<Object[]> conceptoNota;

		idconcepto = new BigInteger(infoConceptoF.get(0)[0].toString());
		conceptoNota = buscarConceptoNota(idconcepto);

		if (conceptoNota != null) {
			Object[] concatenar = new Object[] { infoConceptoF.get(1)[0], infoConceptoF.get(1)[1],
					infoConceptoF.get(1)[2], infoConceptoF.get(1)[0] };
			infoConceptoF.set(1, concatenar);
			return;
		}
		if (operacion.equals("S")) {
			Object[] concatenar = new Object[] { infoConceptoF.get(1)[0], infoConceptoF.get(1)[1],
					infoConceptoF.get(1)[2], infoConceptoF.get(1)[0] };
			infoConceptoF.set(1, concatenar);
			return;
		}

		Object[] concatenar = { infoConceptoF.get(1)[0], infoConceptoF.get(1)[1], infoConceptoF.get(1)[2],
				BigDecimal.ZERO };
		infoConceptoF.set(1, concatenar);

	}

	/**
	 * Buscar el concepto liqudiado y pregunta si el concepto es diferente de 'N'
	 * aplica la caracterísitcas de un concepto vacío
	 */
	private List<Object[]> buscarConcepto(Integer idconcepto) throws NegocioException {

		String valornulo = "";
		Integer cantidad = null;
		BigDecimal valorunitario = null;
		BigDecimal valortotal = null;
		BigDecimal valorreal = null;
		List<Object[]> infoConcepto;
		Object[] concatenar;

		List<Object[]> conceptoLiquidado = buscarConceptoLiquidado(idconcepto);

		if (conceptoLiquidado != null) {
			return conceptoLiquidado;
		}
		// Consulta la información del concepto s

		infoConcepto = manejadorCprCtrprocesoRespository.getConceptoInformacion(idconcepto);

		valornulo = (infoConcepto.get(0)[19]).toString();

		if (!valornulo.equals("N")) {

			valortotal = BigDecimal.ZERO;
			valorunitario = BigDecimal.ZERO;
			cantidad = 1;
			valorreal = BigDecimal.ZERO;

			concatenar = new Object[] { valortotal, valorunitario, cantidad, valorreal };

			infoConcepto.add(concatenar);
			listaConceptosLiquidados.add(infoConcepto);
			listaConceptosLiquidados2.add(idconcepto);
			return infoConcepto;

		}
		// Si el concepto no fue liquidado o que no soporta valores nulos
		throw new NegocioException(
				"El concepto " + idconcepto + " - " + infoConcepto.get(0)[2] + " no pudo ser liquidado ");
	}

	/*
	 * Arma el árbol de dependia del conepto y valcula el valor de cada uno y
	 * verfica si el concepto tiene rangos
	 */
	private void liquidarConcepto(List<Object[]> infoConceptoF, Integer liquidaciones) throws Exception {
		// Consulta los conceptos relacionados del concepto a liquidar
		Integer idconcepto;
		Object conceptoLiquidado = null;
		Integer rango;
		List<Object[]> listaConceptos;
		List<Object[]> conceptoRelacionado = new ArrayList<>();
		char valornulo;
		BigDecimal valortotal;

		idconcepto = Integer.parseInt(infoConceptoF.get(0)[0].toString());

		listaConceptos = manejadorHistoricos.getConceptosRelacionados(idconcepto, liquidaciones, conConcepto,
				coreConrelacio, fechaCoreConrelacio);

		for (Object[] $conceptoRelacionado : listaConceptos) {
			// valida si el concepto relacionado ya fue liquidado
			conceptoLiquidado = buscarConceptoLiquidado((Integer) $conceptoRelacionado[0]);
			if (conceptoLiquidado == null) {
				// liquida el conceptorelacionado
				conceptoRelacionado.add($conceptoRelacionado);
				liquidarConcepto(conceptoRelacionado, liquidaciones);
			}
	
		}
		// Valida si el concepto se liquidó si ya está liquidado lo devuelve
		conceptoLiquidado = buscarConceptoLiquidado(idconcepto);
		if (conceptoLiquidado != null) {
			return;
		}
		// Liquida el valor de concepto de acuerdo a la suscripción
		calcularConcepto(infoConceptoF);

		// Se valida si el concepto tiene rangos
		rango = this.manejadorHistoricos.tieneRangoConcepto(idconcepto, racoRanconcept, fechaRacoRanconcept);
		if (rango != 0) {
			// Se procede a verificar los rangos de los conceptos
			evaluarRangoConcepto(infoConceptoF);

			// Se valida si el concepto permite nulos
			valornulo = (char) infoConceptoF.get(0)[19];
			valortotal = (BigDecimal) infoConceptoF.get(1)[0];

			if ((valortotal == null) && valornulo == 'N') {
				throw new NegocioException(
						"El valor calculado del concepto " + idconcepto + " " + infoConceptoF.get(0)[2] + " es nulo ");
			}

			// Valida el concepto real del concepto
			calculaValorRealConcepto(infoConceptoF);
		}
		// Se agrega el concepto a la lista de conceptos liquidados para no tener
		// que liquidar dos veces el mismo concepto
		listaConceptosLiquidados.add(infoConceptoF);
		listaConceptosLiquidados2.add(idconcepto);
	}

	/* Se encarga de consultar y procesar los rangos del concepto */
	private void evaluarRangoConcepto(List<Object[]> infoConceptoF) throws NegocioException {
		// Se consulta la información de los rangos de los conceptos de acuerdo al valor
		// liquidado
		Integer idconcepto;
		BigDecimal valortotal;
		char valornulo;
		BigDecimal valorunitario;
		Integer cantidad;
		BigDecimal valorreal;
		Object[] listaRangos;
		Object[] rangoConcepto;
		BigDecimal valor;
		String formula;
		Object[] concatenar;
		Gson gson = new Gson();
		List<Json> formulaJson;
		String valorConcepto;

		idconcepto = (Integer) infoConceptoF.get(0)[0];
		valortotal = (BigDecimal) infoConceptoF.get(1)[0];
		valornulo = (char) infoConceptoF.get(0)[19];
		valorreal = (BigDecimal) infoConceptoF.get(1)[3];
		listaRangos = (Object[]) manejadorHistoricos
				.getRangoConcepto(idconcepto, valortotal, racoRanconcept, fechaRacoRanconcept).get(0);

		if (listaRangos.length == 0) {
			throw new NegocioException("Error al liquidar el concepto " + idconcepto + " " + infoConceptoF.get(0)[2]
					+ " valor: " + valortotal);
		}
		// Se valida si existe parametrizado un rango para el valor actual del concepto
		if (listaRangos.length > 1) {
			throw new NegocioException("Error en los rangos del concepto " + idconcepto + " " + valortotal);
		}

		// Se calcula el valor real del concepto
		rangoConcepto = (Object[]) listaRangos[0];
		valor = (BigDecimal) (rangoConcepto[4]);
		formula = ((String) rangoConcepto[5]);

		if (valor != null) {
			valortotal = valor;
			valorunitario = valor;
			cantidad = 1;

			concatenar = new Object[] { valortotal, valorunitario, cantidad, valorreal };
			infoConceptoF.set(1, concatenar);

			calculaValorRealConcepto(infoConceptoF);
			return;
		}

		// Se valida si el rango soporta valores nulos
		if ((formula == null) && valornulo == 'S') {

			valortotal = BigDecimal.ZERO;
			valorunitario = BigDecimal.ZERO;
			cantidad = 1;
			valorreal = BigDecimal.ZERO;

			concatenar = new Object[] { valortotal, valorunitario, cantidad, valorreal };
			infoConceptoF.set(1, concatenar);

			return;
		}
		if (formula == null) {
			throw new NegocioException("El rango del concepto " + idconcepto + " " + infoConceptoF.get(0)[2]
					+ " no tienen asociada una fórmula");
		}

		// Se procesa la fórmula de los conceptos relacioandos

		formulaJson = gson.fromJson(formula, new TypeToken<ArrayList<Json>>() {
		}.getType());
		valorConcepto = procesarFormula(formulaJson, infoConceptoF);

		valortotal = new BigDecimal(valorConcepto).setScale(cantidadDecimales, RoundingMode.HALF_UP);
		valorunitario = new BigDecimal(valorConcepto).setScale(cantidadDecimales, RoundingMode.HALF_UP);
		cantidad = 1; // cantidad
		concatenar = new Object[] { valortotal, valorunitario, cantidad, valorreal };
		infoConceptoF.set(1, concatenar);

	}

	/*
	 * Valida qué tipo de concepto es, si es Valor únicamente ejecuta lafunción u
	 * obtiene el dato del campo con_valor
	 */
	private void calcularConcepto(List<Object[]> infoConceptoF) throws NegocioException {
		String tipocalculo = "";
		List<Object[]> conceptoNota;
		BigInteger idConcepto = new BigInteger(infoConceptoF.get(0)[0].toString());

		conceptoNota = buscarConceptoNota(idConcepto);
		if (conceptoNota == null) {
			tipocalculo = (infoConceptoF.get(0)[5].toString());

			if (tipocalculo.equalsIgnoreCase("V")) {
				// Ejecuta las reglas de negocio del concepto valor
				calcularConceptoValor(infoConceptoF);
			} else {
				// Interpreta la foórmula del concepto
				calcularConceptoFormula(infoConceptoF);
			}
		} else {
			tipocalculo = conceptoNota.get(0)[0].toString().trim();

			if (tipocalculo.equalsIgnoreCase("V")) {
				Integer cantidad;
				BigDecimal valorunitario;
				BigDecimal valortotal;
				BigDecimal valor;

				valor = new BigDecimal(conceptoNota.get(0)[1].toString());

				cantidad = 1; // cantidad
				valorunitario = valor; // valorunitario
				valortotal = valor; // valortotal

				Object[] concatenar = new Object[] { valortotal, valorunitario, cantidad };
				infoConceptoF.add(concatenar);
			} else {
				// formula
				infoConceptoF.get(0)[7] = conceptoNota.get(0)[2].toString();

				calcularConceptoFormula(infoConceptoF);
			}

		}
		// Valdia si es concepto que suma y/o informativo
		calculaValorRealConcepto(infoConceptoF);

	}

	/* Método encargado de interpretar la formula */
	private void calcularConceptoFormula(List<Object[]> infoConceptoF) throws NegocioException {
		String formula = (infoConceptoF.get(0)[7].toString());
		Integer cantidad = null;
		Gson gson = new Gson();
		List<Json> formulaJson;
		String valorConcepto;
		BigDecimal valortotal;
		BigDecimal valorunitario;
		Object[] concatenar;
 
		if (formula.isEmpty()) {
			throw new NegocioException("El concepto " + infoConceptoF.get(0)[0] + " - " + infoConceptoF.get(0)[2]
					+ " no tiene asociada una fórmula");
		}

		try {

			// Se convierte la formula a un objecto java
			formulaJson = gson.fromJson(formula, new TypeToken<ArrayList<Json>>() {
			}.getType());
			// Se procede a procesar las partes de la formula
			valorConcepto = procesarFormula(formulaJson, infoConceptoF);
			// se redondea cada uno de los valores del concepto
			valortotal = new BigDecimal(valorConcepto).setScale(cantidadDecimales, RoundingMode.HALF_UP);

			valorunitario = new BigDecimal(valorConcepto).setScale(cantidadDecimales, RoundingMode.HALF_UP);
			cantidad = 1; // cantidad

			concatenar = new Object[] { valortotal, valorunitario, cantidad };

			infoConceptoF.add(concatenar);
		} catch (NegocioException e) {
			throw e;
		} catch (Exception e) {
			throw new NegocioException("Error al procesar la fórmula del concepto " + infoConceptoF.get(0)[0] + " "
					+ infoConceptoF.get(0)[2]);
		}

	}

	/**
	 * Ejecuta la fórmula de forma aritmética
	 */
	private String procesarFormula(List<Json> jsonformula, List<Object[]> infoConceptoG) throws NegocioException {
		String formula = "";
		String tipo;
		String valor;
		String valorConcepto;
		StringBuilder bld = new StringBuilder();
		// Se valida el tipo de segmento que tiene la formula, si es concepto, función
		// y/o valor
		for (int i = 0; i < jsonformula.size(); i++) {
			tipo = ((Json) jsonformula.get(i)).getTipo();
			valor = ((Json) jsonformula.get(i)).getValor();

			switch (tipo) {
			case "fun":
				bld.append(procesarFuncionFormula(jsonformula.get(i), infoConceptoG));
				break;
			case "con":
				valorConcepto = liquidarConceptoRelacionado(jsonformula.get(i), infoConceptoG);
				bld.append(valorConcepto);
				break;
			case "op":
				valorop(valor,bld);
				break;
			case "parCierra":
				bld.append(valor);
				try {
					if (jsonformula.size() > i + 3 && ((Json) jsonformula.get(i + 3)).getValor().equals("else")) {
						bld.append("?");
					}
				} catch (Exception e) {
					throw new NegocioException("Error calculando la formula; Fuera de rango del array");
				}
				break;
			default:
				bld.append(valor);
				break;
			}
		}
		formula = bld.toString();
		return calculaConceptoFormulatest(formula).toString();

	}
	private void valorop(String valor, StringBuilder bld) {
		if (valor.equals("If")) {
			return;
		} else if (valor.equals("else")) {
			bld.append(":");
			return;
		} else if (valor.equals("And")) {
			bld.append("&&");
			return;
		} else if (valor.equals("Or")) {
			bld.append("||");
			return;
		}
		bld.append(valor);
		
	}

	/**
	 * Método que evalúa la cadena de concepto
	 * 
	 * @param cadena
	 * @return
	 * @throws NegocioException
	 */
	private Object calculaConceptoFormulatest(String cadena) throws NegocioException {
		ScriptEngineManager manager = new ScriptEngineManager();
		ScriptEngine engine = manager.getEngineByName("js");
		Object result;
		try {
			if (engine == null) {
				return 1;
			}
			result = engine.eval(cadena);
			return result;
		} catch (Exception e) {
			throw new NegocioException("Error calculando la formula: " + cadena);
		}
	}

	/**
	 * Se valida que si el concepto depende de otro y con qué fórmula se debe de
	 * calcular
	 */
	private String liquidarConceptoRelacionado(Object conceptoRelacionado, List<Object[]> infoConceptoF)
			throws NegocioException {

		Integer idconceptoliq;
		List<Object[]> infoConcepto;
		Integer idconcepto;
		Object[] infoFuncion;
		Integer idfuncionrelacionada;

		idconceptoliq = (Integer) infoConceptoF.get(0)[0];

		idconcepto = ((Json) conceptoRelacionado).getIdconcepto();

		infoConcepto = buscarConcepto(idconcepto);

		infoFuncion = (Object[]) manejadorCprCtrprocesoRespository.getFuncionRelacionada(idconcepto, idconceptoliq);
		if (infoFuncion == null) {

			throw new NegocioException("No se encontró la función relacionada idconceptorelacionado: " + idconcepto
					+ " idconceptoliquidar:" + idconceptoliq);
		}

		idfuncionrelacionada = (Integer) infoFuncion[0];
		return ejecutarFuncion(idfuncionrelacionada, infoConcepto);

	}

	/**
	 * Método encargado por introspección de un objeto ejetuta las funciones
	 * parametrizadas de un concepto
	 */
	private String procesarFuncionFormula(Object segmento, List<Object[]> infoConceptoF) throws NegocioException {
		String nombreFuncion = ((Json) segmento).getValor();

		try {
			/**
			 * Procesa el json y genera los parámentros para la función que se va a invocar
			 * por Reflection
			 */
			List<Object[]> parametros = procesarParametrosFuncion(segmento, infoConceptoF);
			if (parametros == null) {
				parametros = infoConceptoF;
			}
			return funcionesConceptosDelegado(nombreFuncion, parametros);
		} catch (Exception e) {
			throw new NegocioException("La función " + nombreFuncion + " no existe en la clase " + e.getMessage());
		}
	}

	/**
	 * Procesa la fórmula de acuerdo a los parámetros que se establecieron
	 */
	@SuppressWarnings("unchecked")
	private List<Object[]> procesarParametrosFuncion(Object segmento, List<Object[]> infoConceptoF) throws NegocioException {
		Object listaParametros = null;
		Object[] items;
		String tipo = ((Json) segmento).getTipo();
		String valor = ((Json) segmento).getValor();

		switch (tipo) {
		case "valor":
			listaParametros = valor;
			break;
		case "con":
			Object[] concatenar = new Object[] { infoConceptoF.get(0) };

			for (Object a : concatenar) {
				items = (Object[]) a;
				items[0] = valor;
			}

			infoConceptoF.set(0, concatenar);
			listaParametros = buscarConcepto(Integer.parseInt(valor));
			break;
		default:
			break;

		}
		return (List<Object[]>) listaParametros;
	}

	/**
	 * Calcula el valor del conepto de tipo valor
	 */
	private Object calcularConceptoValor(List<Object[]> infoConceptoF) throws NegocioException {

		char tiporegistro = (char) infoConceptoF.get(0)[21];
		BigDecimal valor = (BigDecimal) (infoConceptoF.get(0)[6]);
		Integer idfuncion = (Integer) (infoConceptoF.get(0)[22]);
		char valornulo = (char) (infoConceptoF.get(0)[19]);

		Integer cantidad;
		BigDecimal valorunitario;
		BigDecimal valortotal;

		// Si el tipo de concepto no aplica si ejecuta la función que tenga
		// parametrizada
		if (tiporegistro == 'N') { // tiporegistro
			return conceptoFuncion(idfuncion, infoConceptoF);
		}
		// Si el concepto tiene un valor se devuelve el concepto diligenciado
		if (valor != null) {

			cantidad = 1; // cantidad
			valorunitario = valor; // valorunitario
			valortotal = valor; // valortotal

			Object[] concatenar = new Object[] { valortotal, valorunitario, cantidad };

			infoConceptoF.add(concatenar);

		}
		// Se verifica qie la función no éste vacía
		if (idfuncion != null) {
			return conceptoFuncion(idfuncion, infoConceptoF);
		}
		// Se valida que si el concepto permite valores nulo y se llena el concepto con
		// 0
		if (valor == null && valornulo == 'S' ) {
			cantidad = 1; // cantidad
			valorunitario = BigDecimal.ZERO; // valorunitario
			valortotal = BigDecimal.ZERO; // valortotal

			Object[] concatenar = new Object[] { valortotal, valorunitario, cantidad };

			infoConceptoF.add(concatenar);

			return infoConceptoF;
		}

		throw new NegocioException(
				"No se pudo calcular el concepto " + infoConceptoF.get(0)[0] + ' ' + infoConceptoF.get(0)[2]);

	}

	/**
	 * Método encargado de evaluar el resultado después de interpretar la fórmula
	 */
	private Object conceptoFuncion(Integer idFuncion, List<Object[]> infoConceptoF) throws NegocioException {
		Integer cantidad = null;
		BigDecimal valorunitario = null;
		BigDecimal valortotal = null;
		BigDecimal respuesta = null;

		String respuestaF = ejecutarFuncion(idFuncion, infoConceptoF);

		try {
			respuesta = new BigDecimal(respuestaF);
		} catch (NumberFormatException excepcion) {
			throw new NegocioException(
					"Error al ejecutar la función " + idFuncion + " para el concepto " + infoConceptoF.get(0)[0]);
		}

		cantidad = 1; // cantidad
		valorunitario = respuesta; // valorunitario
		valortotal = respuesta; // valortotal

		Object[] lista = new Object[] { valortotal, valorunitario, cantidad };

		try {
			infoConceptoF.set(1, lista);
		} catch (Exception e) {
			infoConceptoF.add(lista);
		}
		return infoConceptoF;

	}

	/**
	 * Invoca la función de la clase de FuncionesConceptosDelegados
	 */
	private String ejecutarFuncion(Integer idFuncion, List<Object[]> infoConceptoF) throws NegocioException {
		Object[] funcion = (Object[]) getFuncion(idFuncion);

		try {
			// pasa los parámetros al método que se quiere invocar
			return funcionesConceptosDelegado(funcion[0].toString(), infoConceptoF);
		} catch (Exception e) {
			throw new NegocioException("La función " + funcion[0] + " no existe en la clase " + infoConceptoF.get(0)[0]
					+ " " + infoConceptoF.get(0)[2] + " ");
		}
	}

	/**
	 * Método de funciones para poder invocar funciones que están registradas en la
	 * base de datos
	 */
	@SuppressWarnings({ "unchecked", "rawtypes", "unused" })
	private String funcionesConceptosDelegado(String funcion, List<Object[]> infoConceptoF) throws NegocioException {
		Method[] metodos;
		Method metodo;
		Object result;

		try {
			Class c = funcionesConceptos.getClass();
			metodos = c.getMethods();
			metodo = c.getMethod(funcion, List.class);

			result = c.getDeclaredConstructor(NegocioParParametro.class, ManejadorConConcepto.class, Integer.class,
					Long.class).newInstance(negocioParParametro, manejadorConConcepto, idacceso, idsuscripcion);

			return metodo.invoke(result, infoConceptoF).toString();

		} catch (Exception e) {
			throw new NegocioException("No se encuentra la funcion " + funcion);

		}

	}

	/**
	 * Consulta la información de una función en específico
	 * 
	 * @param $idFuncion
	 * @return información de la función
	 * @throws Exception Error si la función no existe o no está parametrizado
	 */
	private Object getFuncion(Integer idFuncion) throws NegocioException {
		Object resultado=null;
		if (idFuncion == null) {
			throw new NegocioException("No hay funcion relacionada al concepto");
		}
		try {
			resultado = manejadorCprCtrprocesoRespository.getFuncion(idFuncion);
		} catch (Exception e) {
			throw new NegocioException("No se encontró la función " + idFuncion);
		}
		return resultado;
	}

	/**
	 * Buscar si un concepto ya fue liquidado
	 * 
	 * @param $concepto
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "static-access" })
	private List<Object[]> buscarConceptoLiquidado(Integer idconcepto) {
		List<Object[]> infoConceptoLiquidado= null;

		OptionalInt indexOpt = IntStream.range(0, listaConceptosLiquidados2.size())
				.filter(i -> idconcepto.equals(listaConceptosLiquidados2.get(i))).findFirst();
		if (indexOpt == indexOpt.empty()) {
			return infoConceptoLiquidado;
		}
		infoConceptoLiquidado = (List<Object[]>) listaConceptosLiquidados.get(indexOpt.getAsInt());
		return infoConceptoLiquidado;
	}

	/**
	 * Busca en memoria la liquidación
	 * 
	 * @param $idLiquidacion
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	private Object[] buscarLiquidacion(Integer idLiquidacion) throws NegocioException {
		ArrayList<Object> fields;
		Object[] cadena;
		Object[] liquidacionF;

		for (Object liquidacion : listaLiquidaciones) {
			fields = (ArrayList<Object>) liquidacion;
			cadena = (Object[]) fields.get(0);

			if (cadena[0].equals(idLiquidacion)) {
				liquidacionF = new Object[] { fields.get(0), fields.get(1) };
				return liquidacionF;
			}

		}
		throw new NegocioException("No se encontró la liquidación " + idLiquidacion, 4);
	}

	/**
	 * Consulta todas las liquidaciones para generar la liquidación, ésta
	 * información va a estar en memoria y se hace para no estar consultando por
	 * cada suscripción la liquidación que le pertenece
	 * 
	 * @throws NegocioException
	 */
	public void cargarLiquidaciones() throws NegocioException {
		Integer i = 0;
		Object[] fields;
		Integer idliquidacion;
		List<Object> concatenar;
		Object[] conceptos;
		listaLiquidaciones = null;

		listaLiquidaciones = manejadorHistoricos.getLiquidaciones(this.idempresa.toString(),
				Long.valueOf(this.idproceso), liqLiquidacion, fechaLiqLiquidacion, tipoNota, idUsuario);

		if (listaLiquidaciones.isEmpty()) {
			throw new NegocioException("No se encontraron liquidaciones ", 4);
		}

		for (Object $liquidacion : listaLiquidaciones) {
			concatenar = new ArrayList<>();
			fields = (Object[]) $liquidacion;
			idliquidacion = (Integer) fields[0];
			concatenar.add($liquidacion);
			conceptos = manejadorHistoricos
					.getConceptosLiquidacion(idliquidacion, coliConliquida, conConcepto, fechaColiConliquida).toArray();
			concatenar.add(conceptos);
			listaLiquidaciones.set(i, concatenar);
			i++;

		}

	}

	public void validarNovedades() {
		List<Object[]> novedades;
		String mensaje;

		novedades = manejadorHistoricos.getNovedades(faIdregistro, idfactura);

		if (novedades.isEmpty()) {
			mensaje = "no se encontraron diferencias entre factura origen " + faIdregistro + " y novedad  " + idfactura
					+ "";
			actualizarRegistroProceso("F", mensaje);
			LOGGER.info(mensaje);
		}

		else {
			asignarValores(novedades);
		}
	}

	private void asignarValores(List<Object[]> novedades) {
		char estado;
		BigDecimal cantidad;
		BigDecimal valorunitario;
		BigDecimal valortotal;
		BigDecimal valorreal;
		BigDecimal saldoreal;
		Integer idconcepto;
		Integer version;
		Integer idusuario;
		BigInteger dfacideorigen;
		BigInteger damoideregistr;
		BigInteger dfacidepadre;
		BigInteger dfinideregistr;
		String campos;
		String valores;
		String parametros;
		String condicion;
		String tabla;
		
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
			dfacideorigen = (novedades.get(i)[10] == null) ? null : (BigInteger) novedades.get(i)[10];
			damoideregistr = (novedades.get(i)[11] == null) ? null : (BigInteger) novedades.get(i)[11];
			dfacidepadre = (novedades.get(i)[12] == null) ? null : (BigInteger) novedades.get(i)[13];
			dfinideregistr = (novedades.get(i)[12] == null) ? null : (BigInteger) novedades.get(i)[12];

			campos = "dfac_estado,dfac_cantidad,dfac_vlrunitari,dfac_vlrtotal,dfac_vlrreal,dfac_sdoreal,fac_ideregistro,uni_concepto,dfac_version,usu_ideregistro,dfac_ideorigen,damo_ideregistr,dfac_idepadre,dfin_ideregistr,tipo_nota";
			valores = "'" + estado + "'," + cantidad + "," + valorunitario + "," + valortotal + "," + valorreal
					+ "," + saldoreal + "," + idfactura + "," + idconcepto + "," + version + "," + idusuario + ","
					+ dfacideorigen + "," + damoideregistr + "," + dfacidepadre + "," + dfinideregistr + ","
					+ tipoNota + "";

			manejadorCprCtrprocesoRespository.insertar("dfac_detnovedad", campos, valores,
					" returning dfac_ideregistr");

			parametros = " fac_idepadre = " + faIdregistro + " ";
			condicion = " fac_ideregistro = " + idfactura + " ";
			tabla = " fac_novedad ";

			manejadorCprCtrprocesoRespository.actualizar(parametros, tabla, condicion);

		}
		
	}

	private void validarHistoricos(Timestamp fechaDesde, Timestamp fechaHasta) {
		List<Object[]> respuesta = null;

		respuesta = manejadorHistoricos.historicoColiConliquida(fechaDesde, fechaHasta);

		if (respuesta.isEmpty()) {
			coliConliquida = "coli_conliquida";
			fechaColiConliquida = "";
		} else {
			fechaColiConliquida = " and coli.fecha_modificacion =" + respuesta.get(0)[0].toString();
			coliConliquida = respuesta.get(0)[1].toString();

		}

		respuesta = manejadorHistoricos.historicoConConcepto(fechaDesde, fechaHasta);

		if (respuesta.isEmpty()) {
			conConcepto = "con_concepto";
			fechaConConcepto = "";
		} else {
			fechaConConcepto = " and fecha_modificacion = " + respuesta.get(0)[0].toString();
			conConcepto = respuesta.get(0)[1].toString();

		}

		respuesta = manejadorHistoricos.historicoCoreCorelacio(fechaDesde, fechaHasta);

		if (respuesta.isEmpty()) {
			coreConrelacio = "core_conrelacio";
			fechaCoreConrelacio = "";
		} else {
			fechaCoreConrelacio = " and core.fecha_modificacion =" + respuesta.get(0)[0].toString();
			coreConrelacio = respuesta.get(0)[1].toString();

		}

		respuesta = manejadorHistoricos.historicoDsusDetsuscrip(fechaDesde, fechaHasta, suscripcion);

		if (respuesta.isEmpty()) {
			dsusDetsuscrip = "dsus_detsuscrip";
			fechaDsusDetsuscrip = "";
		} else {
			fechaDsusDetsuscrip = " and dsus_hist_idregistr =" + respuesta.get(0)[0].toString();
			dsusDetsuscrip = respuesta.get(0)[1].toString();

		}

		respuesta = manejadorHistoricos.historicoLiqLiquidacion(fechaDesde, fechaHasta);

		if (respuesta.isEmpty()) {
			liqLiquidacion = "liq_liquidacion";
			fechaLiqLiquidacion = "";
		} else {
			fechaLiqLiquidacion = " and fecha_modificacion =" + respuesta.get(0)[0].toString();
			liqLiquidacion = respuesta.get(0)[1].toString();

		}


		respuesta = manejadorHistoricos.historicoRacoRanconcept(fechaDesde, fechaHasta);

		if (respuesta.isEmpty()) {
			racoRanconcept = "raco_ranconcept";
			fechaRacoRanconcept = "";
		} else {
			fechaRacoRanconcept = " and fecha_modificacion =" + respuesta.get(0)[0].toString();
			racoRanconcept = respuesta.get(0)[1].toString();

		}

	}

	public void getConceptosTipoNota() {

		conceptosNota = manejadorHistoricos.getConceptosTipoNota(tipoNota, idempresa);

		if (tipoNota == 722) {
			conceptosNota = null;
			conceptosNota = manejadorHistoricos.getConceptosTipoNotaAforado(tipoNota, idempresa, idUsuario,
					conceptoaforoextraordinario);

		}

	}

	private List<Object[]> buscarConceptoNota(BigInteger idConcepto) {

		List<Object[]> concepto= null;

		for (Object item : conceptosNota.toArray()) {
			if (idConcepto.compareTo(new BigInteger(item.toString())) == 0) {
				concepto = manejadorHistoricos.getTipoCalculoConceptoNota(tipoNota, idempresa, idConcepto);

				if (idConcepto.compareTo(new BigInteger(conceptoaforoextraordinario.toString())) == 0
						&& tipoNota == 722) {
					concepto = manejadorHistoricos.getTipoCalculoConceptoNotaAforado(tipoNota, idempresa, idConcepto,
							idUsuario);
				}

				return concepto;

			}

		}

		return concepto;

	}

}
