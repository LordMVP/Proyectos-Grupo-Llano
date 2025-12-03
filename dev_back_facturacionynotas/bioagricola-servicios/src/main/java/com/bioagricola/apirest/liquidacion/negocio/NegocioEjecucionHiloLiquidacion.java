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
import com.bioagricola.apirest.modelo.manejadores.utils.Json;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class NegocioEjecucionHiloLiquidacion implements Runnable {

	private Integer cantidadDecimales;
	private Integer programaFacturarPeriodo;
	private Integer indicadorCalidadRecoleccion;
	private Integer indicadorCalidadCompactacion;
	private Integer indicadorCalidadReclamacionAseoGas;
	private Integer indicadorCalidadReclamacionAseoEnergia;
	private Object idControlProceso;
	private Object cicloPeriodo;
	private char preliquidar;
	private List<Object> listaLiquidacionesG;
	private List<Object> listaConceptosLiquidados = new ArrayList<>();
	private List<Integer> listaConceptosLiquidados2 = new ArrayList<>();
	private Integer idempresa;
	private Long idsuscripcion = null;
	private Integer idproceso;
	private Integer idacceso;
	private String idUsuario;
	private String[] procesoG = new String[6];
	private List<Object[]> infoConceptoG = new ArrayList<>();
	private Integer idCiclo;
	private ManejadorCprCtrprocesoRespository manejadorCprCtrprocesoRespository;
	private ManejadorConConcepto manejadorConConcepto;
	private FuncionesConceptos funcionesConceptos;
	private NegocioParParametro negocioParParametro;

	public NegocioEjecucionHiloLiquidacion(NegocioParParametro negocioParParametro,
			ManejadorCprCtrprocesoRespository manejadorCprCtrprocesoRespository,
			ManejadorConConcepto manejadorConConcepto, FuncionesConceptos funcionesConceptos, char preliquidar,
			Integer idempresa, Integer idproceso, Integer idacceso, Integer idCiclo) {
		super();
		this.manejadorCprCtrprocesoRespository = manejadorCprCtrprocesoRespository;
		this.manejadorConConcepto = manejadorConConcepto;
		this.negocioParParametro = negocioParParametro;
		this.funcionesConceptos = funcionesConceptos;
		this.preliquidar = preliquidar;
		this.idempresa = idempresa;
		this.idproceso = idproceso;
		this.idacceso = idacceso;
		this.idCiclo = idCiclo;
	}

	private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(NegocioEjecucionHiloLiquidacion.class);

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
		return manejadorCprCtrprocesoRespository.getCicloPeriodoId(idciclo);
	}

	/* Método que ejecuta la vida del hilo */
	@Override
	public void run() {

		obtenerConstantes();
		cicloPeriodo = getCicloPeriodoId(getIdCiclo());
		registrarProceso();
		iniciar();
	}

	private void obtenerConstantes() {
		Map<String, Object> parametros = null;
		try {
			parametros = negocioParParametro.consultaParametros(idempresa,
					ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
			cantidadDecimales = (Integer) parametros.get(ConstantesServicios.CANTIDAD_DECIMALES);
			programaFacturarPeriodo = (Integer) parametros.get(ConstantesServicios.PROGRAMA_FACTURAR_PERIODO);
			indicadorCalidadRecoleccion = (Integer) parametros
					.get(ConstantesServicios.UNI_CONCEPTO_FACTURA_INDICADOR_CALIDAD_RECOLECCION);
			indicadorCalidadCompactacion = (Integer) parametros
					.get(ConstantesServicios.UNI_CONCEPTO_FACTURA_INDICADOR_CALIDAD_COMPACTACION);
			indicadorCalidadReclamacionAseoGas = (Integer) parametros
					.get(ConstantesServicios.UNI_CONCEPTO_FACTURA_INDICADOR_CALIDAD_RECLAMACION_ASEO_GAS);
			indicadorCalidadReclamacionAseoEnergia = (Integer) parametros
					.get(ConstantesServicios.UNI_CONCEPTO_FACTURA_INDICADOR_CALIDAD_RECLAMACION_ASEO_ENERGIA);

		} catch (IOException e) {
			LOGGER.info(e.toString());
		}
	}

	public void registrarProceso() {
		try {
			procesoG[0] = "A"; // estado
			procesoG[1] = fecha(); // fechaInicio
			procesoG[2] = String.valueOf(programaFacturarPeriodo); // idPrograma
			procesoG[3] = idacceso.toString(); // idAcceso
			procesoG[4] = idempresa.toString(); // idEmpresa
			procesoG[5] = idproceso.toString(); // idHilo
			idControlProceso = insertarProceso(procesoG);
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
	 * @param procesoG Detalle del proceso que se quiere ingresar.
	 * 
	 * @return Identificador del nueva ejecución del proceso.
	 */
	private Object insertarProceso(String[] procesoG) {

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

		cprestado = procesoG[0];
		cprfecinicio = Timestamp.valueOf(procesoG[1]);
		cprcanregistro = 0; // cpr_canregistro
		prgideregistro = Integer.parseInt(procesoG[2]);// prg_ideregistro
		accideregistro = Integer.parseInt(procesoG[3]); // acc_ideregistro
		empideregistro = Integer.parseInt(procesoG[4]); // emp_ideregistro
		cpridehilo = Integer.parseInt(procesoG[5]); // cpr_idehilo
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
			// Se consultan todas las liquidaciones que le pertenecen al proceso que se está
			// ejecutando
			cargarLiquidaciones();
			procesarSuscripciones();
		} catch (NegocioException e) {
			String mensaje = "Se procede a finalizar el proceso; " + procesoG;
			LOGGER.info(mensaje);
			if (e.hashCode() == -4) {
				actualizarRegistroProceso("F", mensaje + " Se genero la siguiente exepcion: " + e.getMessage());
			}
			LOGGER.info(e.getMessage());
		} catch (Exception e) {
			LOGGER.info(e.getMessage());
		} finally {
			finalizarProceso();
		}

	}

	/* Función actualizarRegistroProceso */
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

		parametros = " estado = '" + estado + "', mensaje = '" + mensaje + "' ";
		condicion = " proceso = " + proceso + " ";
		tabla = "proceso_facturacion_" + idempresa + "";

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

	}

	/**
	 * Se procede a liquidar todas las suscripciones del proceso
	 */
	private void procesarSuscripciones() {
		Object[] fields;
		List<Object> listaSuscripciones;

		listaSuscripciones = manejadorCprCtrprocesoRespository.getSuscripcionPorProceso(idempresa.toString(),
				Long.valueOf(idproceso));
		if (listaSuscripciones.isEmpty()) {
			LOGGER.info("No hay más suscripciones que procesar {}{} ", idproceso, "\r");
			return;
		}
		for (Object $suscripcion : listaSuscripciones) {
			fields = (Object[]) $suscripcion;
			try {
				LOGGER.info("Procesando suscripcion {}{}", fields[0], "\n");
				facturarSuscripcion($suscripcion);
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
	private List<Object> facturarSuscripcion(Object suscripcion) throws Exception {
		String estado;
		String mensaje;
		Object[] fields;
		Integer valor;
		Long factura;
		List<Object> infoFacturaG;

		infoFacturaG = new ArrayList<>();
		infoConceptoG = new ArrayList<>();

		Object[] liquidacion;
		try {

			estado = "G";
			mensaje = "Factura generada correctamente ";
			fields = (Object[]) suscripcion;
			valor = Integer.parseInt(fields[1].toString()); // idliquidacion
			liquidacion = buscarLiquidacion(valor);
			infoFacturaG.add(suscripcion);// suscripcion
			infoFacturaG.add(cicloPeriodo);// cicloperiodo
			infoFacturaG.add(liquidacion);// liquidacion

			// Se valida si la suscripción ya tiene una factura para el ciclo periodo actual
			// si es así ya no se liquida

			factura = getFacturaCicloPeriodoActual(infoFacturaG);
			if (factura == null) {
				liquidarSuscripcion(infoFacturaG);
				// Se genera el emitido en las tablas de faca_ dfcs_ dfci
				generarSaldoCartera(suscripcion);
			} else {
				estado = "N";
				mensaje = "La suscipción ya fue liquidada";
			}
			// Actualiza la tabla temporal para que no vuelva a procesar la misma
			// suscripción

			actualizarRegistro(suscripcion, estado, mensaje);
		} catch (Exception e) {
			estado = "F";
			mensaje = "Error al facturar Suscripcion " + e.getMessage();
			actualizarRegistro(suscripcion, estado, mensaje);
			throw e;
		}
		return infoFacturaG;

	}

	/**
	 * Método que obtiene ciclo y periodo actual de la factura
	 * 
	 * @param infoFacturaG
	 * @return
	 */
	private Long getFacturaCicloPeriodoActual(Object infoFacturaG) {
		ArrayList<?> fields = null;

		Integer iddocumento = null;
		Integer idtipodocumento = null;
		Integer idciclo = null;
		Integer idperiodo = null;
		Short cicloanio = null;

		fields = (ArrayList<?>) infoFacturaG;
		Object[] suscripcion = (Object[]) fields.get(0);
		Object[] cicloperiodo = (Object[]) fields.get(1);
		Object[] objliquidacion = (Object[]) fields.get(2);
		Object[] liquidacion = (Object[]) objliquidacion[0];

		idsuscripcion = Long.parseLong(suscripcion[0].toString());
		iddocumento = Integer.parseInt(liquidacion[2].toString());
		idtipodocumento = Integer.parseInt(liquidacion[1].toString());
		idciclo = Integer.parseInt(cicloperiodo[0].toString());
		idperiodo = Integer.parseInt(cicloperiodo[2].toString());
		cicloanio = Short.parseShort(cicloperiodo[4].toString());

		return manejadorCprCtrprocesoRespository.getFacturaCicloPeriodoActual(idsuscripcion, iddocumento,
				idtipodocumento, idciclo, idperiodo, cicloanio);

	}

	/* Aumenta la cantidad de registros procesados por el hilo */
	private void actualizarRegistro(Object suscripcion, String estado, String mensaje) {
		Object[] items = (Object[]) suscripcion;
		Integer idsuscripcion2 = Integer.parseInt(items[0].toString());

		try {
			actualizarRegistroProceso(idsuscripcion2, estado, mensaje, idempresa);
			Integer idcontrol = Integer.parseInt(idControlProceso.toString());
			manejadorCprCtrprocesoRespository.aumentarCantidadRegistro(idcontrol);
		} catch (Exception exc) {
			LOGGER.info(Arrays.toString(exc.getStackTrace()));
		}

	}

	/* Función actualizarRegistroProceso */
	private void actualizarRegistroProceso(Integer idsuscripcion, String estado, String mensaje, Integer idempresa) {
		String parametros;
		String condicion;
		String tabla;

		parametros = " estado = '" + estado + "' , mensaje = '" + mensaje + "' ";
		condicion = " idsuscripcion = " + idsuscripcion + " ";
		tabla = " proceso_facturacion_" + idempresa + " ";

		manejadorCprCtrprocesoRespository.actualizar(parametros, tabla, condicion);

	}

	/*
	 * Registra la información de las facturas que van a salir para FES en la tabla
	 * del emitido faca_ dcsi
	 */
	private void generarSaldoCartera(Object suscripcion) {
		Object[] items;
		Integer idsuscripcion3;
		Object[] itemsciclo;
		Integer idperiodo;
		Integer idciclo;
		Short cicloanio;
		Integer idFacturaCartera;
		Object[] itemsfactura;
		Object[] concatenar;
		Integer idFactura;

		items = (Object[]) suscripcion;
		idsuscripcion3 = Integer.parseInt(items[0].toString());
		itemsciclo = (Object[]) cicloPeriodo;
		idperiodo = (Integer) itemsciclo[2];
		idciclo = (Integer) itemsciclo[0];
		cicloanio = Short.parseShort(itemsciclo[4].toString());

		Object[] listaFacturasConSaldo = manejadorCprCtrprocesoRespository.consultarFacturasConSaldo(idsuscripcion3);
		if (listaFacturasConSaldo.length <= 0) {
			return;
		}
		for (Object detfactura : listaFacturasConSaldo) {
			itemsfactura = (Object[]) detfactura;
			idFactura = Integer.parseInt(itemsfactura[0].toString());

			concatenar = new Object[] { idsuscripcion3, idUsuario, idperiodo, idciclo, cicloanio };
			idFacturaCartera = insertarFacturaCartera(itemsfactura, concatenar);
			manejadorCprCtrprocesoRespository.insertarDetallesInformativos(idFacturaCartera, idUsuario, idFactura);
			manejadorCprCtrprocesoRespository.insertarDetallesSuma(idFacturaCartera, idUsuario, idFactura);

		}
	}

	private Integer insertarFacturaCartera(Object[] factura, Object[] concatenar) {

		String facafecha;
		String facaestado;
		Integer dsusideregistr;
		BigInteger facideregistro;
		Integer cicideregistro;
		Integer perideregistro;
		Short cicano;
		Integer usuideregistro;
		Integer empideregistro;
		BigDecimal facasdoreal;
		String facatipo;
		String campos;
		String valores;
		Long respuesta;

		facafecha = (LocalDate.now().toString());
		facaestado = "'X'";
		dsusideregistr = (Integer) concatenar[0];
		facideregistro = (BigInteger) factura[0];
		cicideregistro = (Integer) concatenar[3];
		perideregistro = (Integer) concatenar[2];
		cicano = (Short) concatenar[4];
		usuideregistro = Integer.parseInt(concatenar[1].toString());
		empideregistro = (Integer) factura[4];
		facasdoreal = (BigDecimal) factura[5];
		facatipo = factura[6].toString();

		campos = "faca_fecha,faca_estado,dsus_ideregistr,fac_ideregistro,cic_ideregistro,per_ideregistro,cic_ano,usu_ideregistro,emp_ideregistro,faca_sdoreal,faca_tipo";
		valores = "'" + facafecha + "'," + facaestado + "," + dsusideregistr + "," + facideregistro + ","
				+ cicideregistro + "," + perideregistro + "," + cicano + "," + usuideregistro + "," + empideregistro
				+ "," + facasdoreal + ",'" + facatipo + "'";

		respuesta = manejadorCprCtrprocesoRespository.insertar("faca_faccartera", campos, valores,
				" returning faca_ideregistr");
		return Integer.parseInt(respuesta.toString());
	}

	/* Método encargado de invocar el método genérico de liquidación */
	private void liquidarSuscripcion(List<Object> infoFacturaG) throws Exception {
		Integer idliquidacion;
		Object[] conceptouni;
		char preliquida;
		Integer idconcepto;
		Object[] factura;
		BigInteger idfactura;
		Object conceptoLiquidado;
		List<Object> conceptos = new ArrayList<>();
		Object[] valoresconcepto;
		Object[] concatenar;
		Object[] objliquidacion = (Object[]) infoFacturaG.get(2);
		Object[] liquidacion = (Object[]) objliquidacion[0];
		Object[] concepto = (Object[]) objliquidacion[1];
		idliquidacion = (Integer) liquidacion[0];

		for (Object item : concepto) {
			/**
			 * *Si los conceptos están parametrizados de que no preliquidar significa que lo
			 * liquida el sistema * Si el concepto dice que preliquida está condicionado a
			 * lo que el usuario escoja en la interfaz, si se escoge que si el sistema lo
			 * preliquida de lo contrario se registra el concepto en 0
			 */
			conceptouni = (Object[]) item;
			preliquida = (char) conceptouni[1];
			idconcepto = (Integer) conceptouni[0];

			if ((preliquida == 'S' && preliquidar == 'S') || preliquida == 'N') {
				conceptoLiquidado = iniciarLiquidacionConcepto(idconcepto, idliquidacion, null);
			} else {
				// Registra el concepto vació
				valoresconcepto = new Object[] { BigDecimal.ZERO, BigDecimal.ZERO, 1, BigDecimal.ZERO };
				concatenar = new Object[] { item, valoresconcepto };

				item = concatenar;
				conceptoLiquidado = item;
			}
			conceptos.add(conceptoLiquidado);
		}
		infoFacturaG.add(3, conceptos);
		crearFactura(infoFacturaG);
		procesarDetallesFacturas(infoFacturaG);
		factura = (Object[]) infoFacturaG.get(4);
		idfactura = new BigInteger(factura[1].toString());
		actualizarValorFactura(idfactura);

	}

	private void aplicarDescuentos(List<Object[]> descuentosCalidad, BigInteger idfactura, Integer concepto,
			BigDecimal total) throws NegocioException {
		Integer idDescuento;
		BigDecimal valorDescuento;
		BigDecimal diferencia;
		BigDecimal saldo;
		Integer conceptoCalidad;

		for (Object[] descuento : descuentosCalidad) {

			conceptoCalidad = Integer.parseInt(descuento[1].toString());

			if (conceptoCalidad.compareTo(concepto) == 0) {
				idDescuento = Integer.parseInt(descuento[0].toString());
				valorDescuento = new BigDecimal(descuento[2].toString());
				diferencia = total.subtract(valorDescuento);

				if (diferencia.compareTo(BigDecimal.ZERO) == 0) {
					saldo = BigDecimal.ZERO;

					actualizarTablaDescuentos(idfactura, saldo, idDescuento, conceptoCalidad);

				} else if (diferencia.compareTo(BigDecimal.ZERO) > 0) {
					throw new NegocioException("Error al aplicar el descuento de calidad para el concepto " + concepto
							+ " la diferencia es mayor a 0; verificar formula relacionada ");
				} else {
					saldo = diferencia.multiply(new BigDecimal("-1"));

					actualizarTablaDescuentos(idfactura, saldo, idDescuento, conceptoCalidad);
					return;
				}
			}

		}

	}

	private void actualizarTablaDescuentos(BigInteger idfactura, BigDecimal saldo, Integer idDescuento,
			Integer conceptoCalidad) {
		String parametros;
		String condicion;

		parametros = " fac_ideregistro = " + idfactura + ", saldo_total_desc = " + saldo
				+ ", uni_concepto_facturacion = " + conceptoCalidad + "";
		condicion = " deca_idregistr = " + idDescuento + " ";

		manejadorCprCtrprocesoRespository.actualizar(parametros, "aseo.DECA_DESCCALIDAD", condicion);

	}

	private List<Object[]> buscarDescuentos(List<Object> infoFacturaG) {

		Object[] suscripcion;
		Object[] cicloperiodo;
		List<Object[]> descuentos;

		BigInteger idsuscripcion4;
		Integer idperiodo;

		suscripcion = (Object[]) infoFacturaG.get(0);
		cicloperiodo = (Object[]) infoFacturaG.get(1);

		idsuscripcion4 = (BigInteger) suscripcion[0];
		idperiodo = (Integer) cicloperiodo[2];

		descuentos = manejadorCprCtrprocesoRespository.getInfoConceptosFacturacion(idsuscripcion4, idperiodo,
				indicadorCalidadRecoleccion, indicadorCalidadCompactacion, indicadorCalidadReclamacionAseoGas,
				indicadorCalidadReclamacionAseoEnergia);
		return descuentos;
	}

	/* Suma los detalles de la factura */
	private void actualizarValorFactura(BigInteger idfactura) {
		BigDecimal valor;
		Integer facideregistro;
		BigDecimal facvlrreal;
		BigDecimal facsdoreal;
		String parametros;
		String condicion;

		valor = manejadorCprCtrprocesoRespository.getValorFactura(Integer.parseInt(idfactura.toString()));
		facideregistro = Integer.parseInt(idfactura.toString());
		facvlrreal = valor;
		facsdoreal = valor;

		parametros = " fac_vlrreal = " + facvlrreal + ", fac_sdoreal = " + facsdoreal + " ";
		condicion = " fac_ideregistro = " + facideregistro + " ";

		manejadorCprCtrprocesoRespository.actualizar(parametros, "fac_factura", condicion);
	}

	/* Inserta los detalles de factura */
	@SuppressWarnings("unchecked")
	private void procesarDetallesFacturas(List<Object> infoFacturaG) throws NegocioException {
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
		BigInteger idfactura;
		Integer idconcepto;
		Integer version;
		Integer idusuario;
		Object[] factura;
		List<Object[]> descuentosCalidad;

		conceptos = (ArrayList<Object>) infoFacturaG.get(3);
		factura = (Object[]) infoFacturaG.get(4);

		Object[] detalleFactura;
		ArrayList<Object> listadetalleFactura = new ArrayList<>();
		String campos = "dfac_estado,dfac_cantidad,dfac_vlrunitari,dfac_vlrtotal,dfac_vlrreal,dfac_sdoreal,fac_ideregistro,uni_concepto,dfac_version,usu_ideregistro,dfac_ideorigen,damo_ideregistr,dfac_idepadre,dfin_ideregistr";
		String valores;

		idfactura = new BigInteger(factura[1].toString());
		idusuario = Integer.parseInt(idUsuario);
		version = 1;
		estado = 'A';

		descuentosCalidad = buscarDescuentos(infoFacturaG);

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
					idfactura, idconcepto, version, idusuario, 0, 0, 0, 0 };

			valores = "'" + estado + "'," + cantidad + "," + valorunitario + "," + valortotal + "," + valorreal + ","
					+ saldoreal + "," + idfactura + "," + idconcepto + "," + version + "," + idusuario + ",0,0,0,0 ";

			manejadorCprCtrprocesoRespository.insertar("dfac_detfactura", campos, valores,
					" returning dfac_ideregistr");

			listadetalleFactura.add(detalleFactura);
			if (!descuentosCalidad.isEmpty()) {

				aplicarDescuentos(descuentosCalidad, idfactura, idconcepto, valortotal);
			}

		}
		infoFacturaG.add(listadetalleFactura);
	}

	/* Registra la factura */
	private void crearFactura(List<Object> infoFacturaG) {
		Object[] suscripcion;
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
		Integer idempresa1;
		BigInteger idsuscriptor;
		BigInteger idsuscripcion5;
		Integer idtiposuscripcion;
		Integer idtipousosuscripcion;
		Integer idliquidacion;
		BigInteger idtercero;
		Integer idciclo;
		Integer idperiodo;
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
		BigInteger idfactura;

		suscripcion = (Object[]) infoFacturaG.get(0);
		cicloperiodo = (Object[]) infoFacturaG.get(1);
		objliquidacion = (Object[]) infoFacturaG.get(2);
		liquidacion = (Object[]) objliquidacion[0];
		fechaFacturas = getFechasFactura(suscripcion, cicloperiodo);

		valorTotal = BigDecimal.ZERO;
		metodogenera = 'P';
		estado = 'G';
		fecha = fecha();
		fechavencimiento = fechaFacturas[0].toString();
		idempresa1 = (Integer) suscripcion[3];
		idsuscriptor = (BigInteger) suscripcion[4];
		idsuscripcion5 = (BigInteger) suscripcion[0];
		idtiposuscripcion = (Integer) suscripcion[5];
		idtipousosuscripcion = (Integer) suscripcion[6];
		idliquidacion = (Integer) liquidacion[0];
		idtercero = (BigInteger) suscripcion[7];
		idciclo = (Integer) cicloperiodo[0];
		idperiodo = (Integer) cicloperiodo[2];
		iddocumento = (Integer) liquidacion[2];
		idtipodocumento = (Integer) liquidacion[1];
		cicloano = (Short) cicloperiodo[4];
		idhistoricoliquidacion = 0;
		saldofactura = valorTotal;
		idtipotercero = (Integer) suscripcion[8];
		fechasuspende = fechaFacturas[1].toString();
		version = 1;
		fechaaprobacion = fecha();

		campos = "fac_metgenera, fac_estado, fac_fecha, fac_fecvence, emp_ideregistro, sus_ideregistro, dsus_ideregistr, uni_tipsuscripc, uni_tipusosuscr, uni_liquidacion, ter_ideregistro, cic_ideregistro, per_ideregistro, uni_documento, uni_tipdocument, cic_ano, hliq_ideregistr, fac_sdoreal, uni_tiptercero, fac_fecsuspens, fac_version, fac_vlrreal, fac_fecaprobada, usu_ideregistro";
		valores = "'" + metodogenera + "','" + estado + "','" + fecha + "','" + fechavencimiento + "'," + idempresa1
				+ "," + idsuscriptor + "," + idsuscripcion5 + "," + idtiposuscripcion + "," + idtipousosuscripcion + ","
				+ idliquidacion + "," + idtercero + "," + idciclo + "," + idperiodo + "," + iddocumento + ","
				+ idtipodocumento + "," + cicloano + "," + idhistoricoliquidacion + "," + saldofactura + ","
				+ idtipotercero + ",'" + fechasuspende + "'," + version + "," + valorTotal + ",'" + fechaaprobacion
				+ "'," + idUsuario + " ";
		respuesta = manejadorCprCtrprocesoRespository.insertar("fac_factura", campos, valores,
				" returning fac_ideregistro");

		idfactura = BigInteger.valueOf(respuesta);

		factura = new Object[] { metodogenera, estado, fecha, fechavencimiento, idempresa, idsuscriptor, idsuscripcion5,
				idtiposuscripcion, idtipousosuscripcion, idliquidacion, idtercero, idciclo, idperiodo, iddocumento,
				idtipodocumento, cicloano, idhistoricoliquidacion, saldofactura, idtipotercero, fechasuspende, version,
				valorTotal, fechaaprobacion, idUsuario };

		factura = new Object[] { factura, idfactura };

		infoFacturaG.add(factura);

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
		BigInteger idsuscripcion6;
		Integer idliquidacion;
		Integer idperiodo;
		String fechavencimiento;
		String fechasuspension;

		itemssus = suscripcion;
		itemscic = cicloperiodo;
		idsuscripcion6 = (BigInteger) itemssus[0];

		idliquidacion = (Integer) itemssus[1];
		idperiodo = (Integer) itemscic[2];
		fechavencimiento = (String) itemscic[5];
		fechasuspension = (String) itemscic[6];


		fechasRutas =  manejadorCprCtrprocesoRespository.getFechasRutaPeriodo(idsuscripcion6, idperiodo);

		if (fechasRutas.length > 0) {
			return fechasRutas;
		}

		if (fechavencimiento != null) {
			fechas = new Object[] { fechavencimiento, fechasuspension };
			return fechas;
		}
		infoLiquidacion = (Object[]) manejadorCprCtrprocesoRespository.getLiquidacionSuscripcion(idliquidacion);
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
		infoConceptoG = infoConcepto;
		Object conceptoLiquidado;
		List<Object[]> infoConceptoGCalculado;

		if (infoConceptoG == null) {
			infoConceptoG = manejadorCprCtrprocesoRespository.getConceptoInformacion(idconcepto);
		}
		// Verifica si el concepto ya fue liquidado
		conceptoLiquidado = buscarConceptoLiquidado(idconcepto);
		if (conceptoLiquidado != null) {
			return conceptoLiquidado;
		}
		// liquida el concepto de acuerdo a los conceptos realcionados y rangos
		liquidarConcepto(infoConceptoG, liquidaciones);
		infoConceptoGCalculado = buscarConcepto(idconcepto);
		// Valida si el concepto es informativo o suma
		calculaValorRealConcepto(infoConceptoGCalculado);
		return infoConceptoGCalculado;
	}

	/* Establece el valor real del concepto */
	private void calculaValorRealConcepto(List<Object[]> infoConceptoG) {
		String operacion = infoConceptoG.get(0)[8].toString();

		if (operacion.equals("S")) {
			Object[] concatenar = new Object[] { infoConceptoG.get(1)[0], infoConceptoG.get(1)[1],
					infoConceptoG.get(1)[2], infoConceptoG.get(1)[0] };
			infoConceptoG.set(1, concatenar);
			return;
		}
		Object[] concatenar = { infoConceptoG.get(1)[0], infoConceptoG.get(1)[1], infoConceptoG.get(1)[2],
				BigDecimal.ZERO };
		infoConceptoG.set(1, concatenar);

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
	private void liquidarConcepto(List<Object[]> infoConceptoG, Integer liquidaciones) throws Exception {
		// Consulta los conceptos relacionados del concepto a liquidar
		Integer idconcepto;
		Object conceptoLiquidado = null;
		Integer rango;
		List<Object[]> listaConceptos;
		List<Object[]> conceptoRelacionado = new ArrayList<>();
		char valornulo;
		BigDecimal valortotal;

		idconcepto = Integer.parseInt(infoConceptoG.get(0)[0].toString());

		listaConceptos = manejadorCprCtrprocesoRespository.getConceptosRelacionados(idconcepto, liquidaciones);

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
		calcularConcepto(infoConceptoG);

		// Se valida si el concepto tiene rangos
		rango = manejadorCprCtrprocesoRespository.tieneRangoConcepto(idconcepto);
		if (rango != 0) {
			// Se procede a verificar los rangos de los conceptos
			evaluarRangoConcepto(infoConceptoG);

			// Se valida si el concepto permite nulos
			valornulo = (char) infoConceptoG.get(0)[19];
			valortotal = (BigDecimal) infoConceptoG.get(1)[0];

			if ((valortotal == null) && valornulo == 'N') {
				throw new NegocioException(
						"El valor calculado del concepto " + idconcepto + " " + infoConceptoG.get(0)[2] + " es nulo ");
			}

			// Valida el concepto real del concepto
			calculaValorRealConcepto(infoConceptoG);
		}
		// Se agrega el concepto a la lista de conceptos liquidados para no tener
		// que liquidar dos veces el mismo concepto
		listaConceptosLiquidados.add(infoConceptoG);
		listaConceptosLiquidados2.add(idconcepto);
	}

	/* Se encarga de consultar y procesar los rangos del concepto */
	private void evaluarRangoConcepto(List<Object[]> infoConceptoG) throws NegocioException {
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

		idconcepto = (Integer) infoConceptoG.get(0)[0];
		valortotal = (BigDecimal) infoConceptoG.get(1)[0];
		valornulo = (char) infoConceptoG.get(0)[19];
		valorreal = (BigDecimal) infoConceptoG.get(1)[3];

		listaRangos = (Object[]) manejadorCprCtrprocesoRespository.getRangoConcepto(idconcepto, valortotal).get(0);

		if (listaRangos.length == 0) {
			throw new NegocioException("Error al liquidar el concepto " + idconcepto + " " + infoConceptoG.get(0)[2]
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
			infoConceptoG.set(1, concatenar);

			calculaValorRealConcepto(infoConceptoG);
			return;
		}

		// Se valida si el rango soporta valores nulos
		if ((formula == null) && valornulo == 'S') {

			valortotal = BigDecimal.ZERO;
			valorunitario = BigDecimal.ZERO;
			cantidad = 1;
			valorreal = BigDecimal.ZERO;

			concatenar = new Object[] { valortotal, valorunitario, cantidad, valorreal };
			infoConceptoG.set(1, concatenar);

			return;
		}
		if (formula == null) {
			throw new NegocioException("El rango del concepto " + idconcepto + " " + infoConceptoG.get(0)[2]
					+ " no tienen asociada una fórmula");
		}

		// Se procesa la fórmula de los conceptos relacioandos

		formulaJson = gson.fromJson(formula, new TypeToken<ArrayList<Json>>() {
		}.getType());
		valorConcepto = procesarFormula(formulaJson, infoConceptoG);

		valortotal = new BigDecimal(valorConcepto).setScale(cantidadDecimales, RoundingMode.HALF_UP);
		valorunitario = new BigDecimal(valorConcepto).setScale(cantidadDecimales, RoundingMode.HALF_UP);
		cantidad = 1;
		concatenar = new Object[] { valortotal, valorunitario, cantidad, valorreal };
		infoConceptoG.set(1, concatenar);

	}

	/*
	 * Valida qué tipo de concepto es, si es Valor únicamente ejecuta lafunción u
	 * obtiene el dato del campo con_valor
	 */
	private void calcularConcepto(List<Object[]> infoConceptoG) throws NegocioException {
		String tipocalculo = (infoConceptoG.get(0)[5].toString());

		if (tipocalculo.equalsIgnoreCase("V")) {
			// Ejecuta las reglas de negocio del concepto valor
			calcularConceptoValor(infoConceptoG);
		} else {
			// Interpreta la foórmula del concepto
			calcularConceptoFormula(infoConceptoG);
		}
		// Valdia si es concepto que suma y/o informativo
		calculaValorRealConcepto(infoConceptoG);

	}

	/* Método encargado de interpretar la formula */
	private void calcularConceptoFormula(List<Object[]> infoConceptoG) throws NegocioException {
		String formula = (infoConceptoG.get(0)[7].toString());
		Integer cantidad = null;
		Gson gson = new Gson();
		List<Json> formulaJson;
		String valorConcepto;
		BigDecimal valortotal;
		BigDecimal valorunitario;
		Object[] concatenar;

		if (formula.isEmpty()) {
			throw new NegocioException("El concepto " + infoConceptoG.get(0)[0] + " - " + infoConceptoG.get(0)[2]
					+ " no tiene asociada una fórmula");
		}

		try {

			// Se convierte la formula a un objecto java
			formulaJson = gson.fromJson(formula, new TypeToken<ArrayList<Json>>() {
			}.getType());
			// Se procede a procesar las partes de la formula
			valorConcepto = procesarFormula(formulaJson, infoConceptoG);
			// se redondea cada uno de los valores del concepto
			valortotal = new BigDecimal(valorConcepto).setScale(cantidadDecimales, RoundingMode.HALF_UP);

			valorunitario = new BigDecimal(valorConcepto).setScale(cantidadDecimales, RoundingMode.HALF_UP);
			cantidad = 1; // cantidad

			concatenar = new Object[] { valortotal, valorunitario, cantidad };

			infoConceptoG.add(concatenar);
		} catch (NegocioException e) {
			throw e;
		} catch (Exception e) {
			throw new NegocioException("Error al procesar la fórmula del concepto " + infoConceptoG.get(0)[0] + " "
					+ infoConceptoG.get(0)[2]);
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
	private String liquidarConceptoRelacionado(Object conceptoRelacionado, List<Object[]> infoConceptoG)
			throws NegocioException {

		Integer idconceptoliq;
		List<Object[]> infoConcepto;
		Integer idconcepto;
		Object[] infoFuncion;
		Integer idfuncionrelacionada;

		idconceptoliq = (Integer) infoConceptoG.get(0)[0];

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
	private String procesarFuncionFormula(Object segmento, List<Object[]> infoConceptoG) throws NegocioException {
		String nombreFuncion = ((Json) segmento).getValor();

		try {
			/**
			 * Procesa el json y genera los parámentros para la función que se va a invocar
			 * por Reflection
			 */ 
			List<Object[]> parametros = procesarParametrosFuncion(segmento, infoConceptoG);
			if (parametros == null) {
				parametros = infoConceptoG;
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
	private List<Object[]> procesarParametrosFuncion(Object segmento, List<Object[]> infoConceptoG)
			throws NegocioException {
		Object listaParametros = null;
		Object[] items;
		String tipo = ((Json) segmento).getTipo();
		String valor = ((Json) segmento).getValor();

		switch (tipo) {
		case "valor":
			listaParametros = valor;
			break;
		case "con":
			Object[] concatenar = new Object[] { infoConceptoG.get(0) };

			for (Object a : concatenar) {
				items = (Object[]) a;
				items[0] = valor;
			}

			infoConceptoG.set(0, concatenar);
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
	private Object calcularConceptoValor(List<Object[]> infoConceptoG) throws NegocioException {

		char tiporegistro = (char) infoConceptoG.get(0)[21];
		BigDecimal valor = (BigDecimal) (infoConceptoG.get(0)[6]);
		Integer idfuncion = (Integer) (infoConceptoG.get(0)[22]);
		char valornulo = (char) (infoConceptoG.get(0)[19]);

		Integer cantidad;
		BigDecimal valorunitario;
		BigDecimal valortotal;

		// Si el tipo de concepto no aplica si ejecuta la función que tenga
		// parametrizada
		if (tiporegistro == 'N') { // tiporegistro
			return conceptoFuncion(idfuncion, infoConceptoG);
		}
		// Si el concepto tiene un valor se devuelve el concepto diligenciado
		if (valor != null) {

			cantidad = 1; // cantidad
			valorunitario = valor; // valorunitario
			valortotal = valor; // valortotal

			Object[] concatenar = new Object[] { valortotal, valorunitario, cantidad };

			infoConceptoG.add(concatenar);

		}
		// Se verifica qie la función no éste vacía
		if (idfuncion != null) {
			return conceptoFuncion(idfuncion, infoConceptoG);
		}
		// Se valida que si el concepto permite valores nulo y se llena el concepto con
		// 0
		if (valor == null && valornulo == 'S') {
			cantidad = 1; // cantidad
			valorunitario = BigDecimal.ZERO; // valorunitario
			valortotal = BigDecimal.ZERO; // valortotal

			Object[] concatenar = new Object[] { valortotal, valorunitario, cantidad };

			infoConceptoG.add(concatenar);

			return infoConceptoG;
		}

		throw new NegocioException(
				"No se pudo calcular el concepto " + infoConceptoG.get(0)[0] + ' ' + infoConceptoG.get(0)[2]);

	}

	/**
	 * Método encargado de evaluar el resultado después de interpretar la fórmula
	 */
	private Object conceptoFuncion(Integer idFuncion, List<Object[]> infoConceptoG) throws NegocioException {
		Integer cantidad = null;
		BigDecimal valorunitario = null;
		BigDecimal valortotal = null;
		BigDecimal respuesta = null;

		String respuestaf = ejecutarFuncion(idFuncion, infoConceptoG);

		try {
			respuesta = new BigDecimal(respuestaf);
		} catch (NumberFormatException excepcion) {
			throw new NegocioException(
					"Error al ejecutar la función " + idFuncion + " para el concepto " + infoConceptoG.get(0)[0]);
		}

		cantidad = 1; // cantidad
		valorunitario = respuesta; // valorunitario
		valortotal = respuesta; // valortotal

		Object[] lista = new Object[] { valortotal, valorunitario, cantidad };

		try {
			infoConceptoG.set(1, lista);
		} catch (Exception e) {
			infoConceptoG.add(lista);
		}
		return infoConceptoG;

	}

	/**
	 * Invoca la función de la clase de FuncionesConceptosDelegados
	 */
	private String ejecutarFuncion(Integer idFuncion, List<Object[]> infoConceptoG) throws NegocioException {
		Object[] funcion = (Object[]) getFuncion(idFuncion);

		try {
			// pasa los parámetros al método que se quiere invocar
			return funcionesConceptosDelegado(funcion[0].toString(), infoConceptoG);
		} catch (Exception e) {
			throw new NegocioException("La función " + funcion[0] + " no existe en la clase " + infoConceptoG.get(0)[0]
					+ " " + infoConceptoG.get(0)[2] + " ");
		}
	}

	/**
	 * Método de funciones para poder invocar funciones que están registradas en la
	 * base de datos
	 */
	@SuppressWarnings({ "unchecked", "rawtypes", "unused" })
	private String funcionesConceptosDelegado(String funcion, List<Object[]> infoConceptoG) throws NegocioException {
		Method[] metodos;
		Method metodo;
		Object result;

		try {
			Class c = funcionesConceptos.getClass();
			metodos = c.getMethods();
			metodo = c.getMethod(funcion, List.class);

			result = c.getDeclaredConstructor(NegocioParParametro.class, ManejadorConConcepto.class, Integer.class,
					Long.class).newInstance(negocioParParametro, manejadorConConcepto, idacceso, idsuscripcion);

			return metodo.invoke(result, infoConceptoG).toString();

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
		Object resultado;
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
		List<Object[]> infoConceptoLiquidado = null;

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
		Object[] liquidacion;

		for (Object item : listaLiquidacionesG) {
			fields = (ArrayList<Object>) item;
			cadena = (Object[]) fields.get(0);

			if (cadena[0].equals(idLiquidacion)) {
				liquidacion = new Object[] { fields.get(0), fields.get(1) };
				return liquidacion;
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
		listaLiquidacionesG = null;

		listaLiquidacionesG = manejadorCprCtrprocesoRespository.getLiquidaciones(idempresa.toString(),
				Long.valueOf(idproceso));

		if (listaLiquidacionesG.isEmpty()) {
			throw new NegocioException("No se encontraron liquidaciones ", 4);
		}

		for (Object $liquidacion : listaLiquidacionesG) {
			concatenar = new ArrayList<>();
			fields = (Object[]) $liquidacion;
			idliquidacion = (Integer) fields[0];
			concatenar.add($liquidacion);
			conceptos = manejadorCprCtrprocesoRespository.getConceptosLiquidacion(idliquidacion).toArray();
			concatenar.add(conceptos);
			listaLiquidacionesG.set(i, concatenar);
			i++;

		}

	}

}
