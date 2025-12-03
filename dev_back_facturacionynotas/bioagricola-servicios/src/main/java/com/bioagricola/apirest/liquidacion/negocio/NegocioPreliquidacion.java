package com.bioagricola.apirest.liquidacion.negocio;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.FacFacturaDTO;
import com.bioagricola.apirest.modelo.entidades.FacFactura;
import com.bioagricola.apirest.modelo.excepciones.NegocioException;
import com.bioagricola.apirest.modelo.manejadores.ManejadorCprCtrprocesoRespository;

@Service
public class NegocioPreliquidacion extends NegocioAbstracto<FacFactura, FacFacturaDTO> {

	private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(NegocioPreliquidacion.class);

	@Autowired
	private ManejadorCprCtrprocesoRespository repo;

	@Autowired
	private NegocioLiquidacion negocioLiquidacion;

	@Autowired
	private NegocioParParametro negocioParParametro;

	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {
		return false;
	}

	@Override
	protected Logger getLogger() {
		return null;
	}

	@Override
	protected FacFacturaDTO instanciarDAO() {
		return null;
	}

	private Integer numeroHilosFacturacion;
	private Integer programaFacturarPeriodo;

	public void preLiquidacion(Integer idEmpresa, Integer idCiclo, Integer idUsuario, Integer idAcceso,
			char preLiquidar) throws IOException, NegocioException, SecurityException {

		Map<String, Object> parametros;

		String identificadorEmpresa = "proceso_facturacion_" + idEmpresa;

		parametros = negocioParParametro.consultaParametros(idEmpresa, ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
		numeroHilosFacturacion = (Integer) parametros.get(ConstantesServicios.NUMERO_HILOS_FACTURACION);
		programaFacturarPeriodo = (Integer) parametros.get(ConstantesServicios.PROGRAMA_FACTURAR_PERIODO);

		try {
			validarProcesoEjecucion(identificadorEmpresa, idEmpresa);
			iniciarProceso(idEmpresa, idCiclo, idUsuario, idAcceso, preLiquidar);
			LOGGER.info("Se incio el proceso correctamente");
		} catch (NegocioException e) {
			LOGGER.info("Error al iniciar el proceso {}", e.getMessage());
		}

	}

	public void iniciarProceso(Integer idEmpresa, Integer idCiclo, Integer idUsuario, Integer idAcceso,
			char preLiquidar) throws NegocioException, IOException {

		String identificadorEmpresa = "proceso_facturacion_" + idEmpresa;
		List<Object> factura = repo.getConsultarFacturasGeneradas(idEmpresa, idCiclo);
		if (!factura.isEmpty()) {
			throw new NegocioException("Hay facturas por aprobar", 4);
		} else {
			repo.vaciarTablaProceso(identificadorEmpresa);
			// Se cargan en la tabla temporal las suscripciones que se quieren liquidar

			repo.cargarSuscripciones(idCiclo, idEmpresa, idUsuario, numeroHilosFacturacion, identificadorEmpresa);
			lanzarHilos(idAcceso, idCiclo, idEmpresa, preLiquidar);
		}
	}

	public void lanzarHilos(Integer idAcceso, Integer idCiclo, Integer idEmpresa, char preLiquidar) throws IOException {

		negocioLiquidacion.inicializarData(idAcceso, idCiclo, idEmpresa, preLiquidar);

	}

	public void validarProcesoEjecucion(String identificadorEmpresa, Integer idEmpresa) throws NegocioException {
		List<Object> procesos = null;
		try {
			procesos = repo.getProcesoEjecucion(identificadorEmpresa, programaFacturarPeriodo, idEmpresa);
			if (procesos != null) {
				throw new NegocioException("Hay un proceso en ejecución", 4);
			}
		} catch (Exception e) {
			LOGGER.info("Error al validad procesos en Ejecucion {}", e.getMessage());
		}

	}

}
