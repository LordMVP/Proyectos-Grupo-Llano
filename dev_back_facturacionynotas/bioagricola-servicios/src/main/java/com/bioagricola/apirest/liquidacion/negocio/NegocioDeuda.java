package com.bioagricola.apirest.liquidacion.negocio;

import java.io.IOException;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.RequestDeuda;
import com.bioagricola.apirest.modelo.excepciones.NegocioException;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCprCtrprocesoRespository;
import com.bioagricola.apirest.modelo.manejadores.ManejadorHistoricos;

@Service
public class NegocioDeuda  {

	private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(NegocioDeuda.class);

	@Autowired
	private ManejadorHistoricos manejadorHistoricos;

	@Autowired
	private ManejadorCprCtrprocesoRespository manejadorCprCtrprocesoRespository;

	@Autowired
	private NegocioHilosDeuda negocioHilosDeuda;
	@Autowired
	private NegocioParParametro negocioParParametro;

	private Integer programaFacturaPeriodo;
	private List<String> facturas;

	public void preLiquidacion(RequestDeuda deuda)
			throws  IOException, NegocioException {
		// datos obtenidos desde el token
		int idEmpresa;
		int idUsuario;
		int idAcceso;
		char adiciona;
		Boolean suselimina;
		Integer tipoNota;
		Integer suscripcion;
		Integer idHilo;
		String identificadorEmpresa;
		Integer idsuscripcion;
		Integer idCiclo;
		Integer existeTabla;
		Object[] factura;
		Integer numeroHilosFacturacion;
		Map<String, Object> parametros;
				
		idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		idUsuario = JwtUtil.auditoriaDTO.getIdUsuario();
		idAcceso = Integer.parseInt(JwtUtil.auditoriaDTO.getId());
		
		adiciona = deuda.getAdiciona();
		facturas = deuda.getFacturas();
		suselimina = deuda.getSuselimina();
		tipoNota = deuda.getTiponota();
		suscripcion = deuda.getSuscripcion();
		idHilo = 1;
		identificadorEmpresa = "proceso_refacturacion_" + idEmpresa;
		
		parametros = negocioParParametro.consultaParametros(idEmpresa, ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
		numeroHilosFacturacion = (Integer) parametros.get(ConstantesServicios.NUMERO_HILOS_FACTURACION);
		programaFacturaPeriodo = (Integer) parametros.get(ConstantesServicios.PROGRAMA_FACTURAR_PERIODO);

		existeTabla = manejadorHistoricos.validarTablaExistente(identificadorEmpresa);

		if (existeTabla != 0) {
			validarProcesoEjecucion(identificadorEmpresa, idEmpresa, tipoNota, idUsuario);
			manejadorHistoricos.vaciarTablaProceso(identificadorEmpresa, idUsuario, tipoNota);
		}


		try {
			
			if(Boolean.TRUE.equals(suselimina) && facturas.isEmpty() ) {
					iniciarProceso( idEmpresa, idUsuario, suscripcion.toString(), idHilo, tipoNota);
				
				lanzarHilos(idAcceso, 0, idEmpresa, adiciona, "0", idHilo, tipoNota,suselimina,suscripcion.toString());
				idHilo += 1;
			
			}
				
			for (String item : facturas) {
				if (idHilo > numeroHilosFacturacion) {
					idHilo = 1;
				}
					factura = manejadorHistoricos.getInfoFactura(item).get(0);
					idsuscripcion = Integer.parseInt (factura[0].toString()); 
					idCiclo = Integer.parseInt (factura[1].toString());

				iniciarProceso( idEmpresa,  idUsuario,  idsuscripcion.toString(), idHilo, tipoNota);
				
				lanzarHilos(idAcceso, idCiclo, idEmpresa, adiciona, item, idHilo, tipoNota,suselimina,suscripcion.toString());
				idHilo += 1;

			}
			LOGGER.info("Se incio el proceso correctamente");
		} catch (NegocioException e) {
			LOGGER.info(e.getMessage());
		} catch (Exception e) {
			LOGGER.info("Error no controlado {}", e.getMessage());
		}
	}
	

	public void iniciarProceso(Integer idEmpresa,  Integer idUsuario, String suscripcion,Integer idHilo,Integer tipoNota) throws NegocioException  {
		String identificadorEmpresa;
		Integer existeTabla;

		identificadorEmpresa = "proceso_refacturacion_" + idEmpresa;
		
		try {

		manejadorCprCtrprocesoRespository.vaciarDetalleNovedadTMPDeuda(idEmpresa, idUsuario, tipoNota, facturas);
		manejadorCprCtrprocesoRespository.vaciarNovedadTMP(idEmpresa, idUsuario, tipoNota);

		existeTabla = manejadorHistoricos.validarTablaExistente(identificadorEmpresa);
	

		if (existeTabla == 0) { // si no existe la tabla se crea la tabla temporal
			manejadorHistoricos.cargarSuscripcionesDeuda( idEmpresa,suscripcion, idHilo, identificadorEmpresa, idUsuario, tipoNota,  fecha());
		} else {
			manejadorHistoricos.insertarSuscripcionesDeuda(idEmpresa,suscripcion, idHilo, identificadorEmpresa,idUsuario, tipoNota, fecha());
		}
		}catch(Exception e) {
			throw new NegocioException ("Error al iniciar el proceso");
		}
		

	}

	public void lanzarHilos(Integer idAcceso, Integer idCiclo, Integer idEmpresa, char adiciona, String factura,
			Integer idHilo, Integer tipoNnota, Boolean suselimina, String suscripcion) {
		
		negocioHilosDeuda.inicializarData(idAcceso, idCiclo, idEmpresa, adiciona, factura, idHilo, tipoNnota,suselimina,suscripcion);

	}

	public void validarProcesoEjecucion(String identificadorEmpresa, Integer idEmpresa, Integer tipoNnota,
			int idUsuario) throws NegocioException {
		Object[] procesos = null;
		BigInteger cantidad;

		procesos = manejadorHistoricos.getProcesoEjecucion(identificadorEmpresa, programaFacturaPeriodo, idEmpresa,
				tipoNnota, idUsuario);

		if (procesos != null) {
			cantidad = new BigInteger(procesos[3].toString());

			if (cantidad != BigInteger.ZERO) {
				throw new NegocioException("Hay un proceso en ejecución para el mismo tipo de nota, usuario y empresa",
						4);
			}

		}

	}
	public Date fecha() {
		LocalDate hoy;
		LocalTime ahora;
		String fecha;

		hoy = LocalDate.now();
		ahora = LocalTime.now();
		fecha = hoy + " " + ahora;

		return Timestamp.valueOf(fecha);
	}


	/**
	 * Método encargado de consultar si existe un proceso activo para el cálculo de descuento por indicadores de calidad
	 * 
	 * @param tipoNota
	 * @return
	 */
	public Boolean consultarProcesoCalidad(Integer tipoNota) {
		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		Object[] procesos = null;

		procesos = manejadorHistoricos.consultarProcesoCalidad(idEmpresa,
				tipoNota);

		return (procesos != null) ;
	
	}

}
