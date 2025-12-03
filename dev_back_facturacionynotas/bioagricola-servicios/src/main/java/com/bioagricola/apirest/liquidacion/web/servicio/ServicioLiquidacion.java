package com.bioagricola.apirest.liquidacion.web.servicio;

import java.io.IOException;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioAprobarLiquidacion;
import com.bioagricola.apirest.liquidacion.negocio.NegocioDeuda;
import com.bioagricola.apirest.liquidacion.negocio.NegocioGenerarNota;
import com.bioagricola.apirest.liquidacion.negocio.NegocioPreliquidacion;
import com.bioagricola.apirest.liquidacion.negocio.NegocioRePreliquidacion;
import com.bioagricola.apirest.liquidacion.negocio.NegocioUtilidadesLiquidacion;
import com.bioagricola.apirest.modelo.dtos.GenericResponseDTO;
import com.bioagricola.apirest.modelo.dtos.RequestDeuda;
import com.bioagricola.apirest.modelo.dtos.RequestGenerarNota;
import com.bioagricola.apirest.modelo.dtos.RequestReLiquidarDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import com.bioagricola.apirest.modelo.excepciones.NegocioException;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad
 * LiqLiquidacion
 * 
 * @author GeneradorCRUD
 */
@RestController
@RequestMapping("/webresources/servicios/liquidacion")
public class ServicioLiquidacion {

	@Autowired
	private NegocioGenerarNota negocioGenerarNota;

	@Autowired
	private NegocioPreliquidacion negocioPreLiquidacion;

	@Autowired
	private NegocioRePreliquidacion negocioRePreLiquidacion;
	@Autowired
	private NegocioAprobarLiquidacion negocioAprobarLiquidacion;
	@Autowired
	private NegocioUtilidadesLiquidacion negocioUtilidadesLiquidacion;
	@Autowired
	private NegocioDeuda negocioDeuda;

	@Transactional
	@GetMapping("/Preliquidacion")
	public void preLiquidacion(@RequestParam(value = "acceso") Integer idAcceso,
			@RequestParam(value = "ciclo") Integer idCiclo, @RequestParam(value = "empresa") Integer idEmpresa,
			@RequestParam(value = "liquidar") char preLiquidar, @RequestParam(value = "idUsuario") Integer idUsuario)
			throws  IOException, NegocioException, NoSuchMethodException,
			SecurityException {
		negocioPreLiquidacion.preLiquidacion(idEmpresa, idCiclo, idUsuario, idAcceso, preLiquidar);
	}

	@Transactional
	@PostMapping(path = "/Reliquidacion", consumes = "application/json", produces = "application/json")
	public void reliquidacion(@RequestBody RequestReLiquidarDTO reLiquidar)
			throws  IOException, NegocioException {
		negocioRePreLiquidacion.preLiquidacion(reLiquidar);
	}

	@Transactional
	@PostMapping(path = "/GenerarNota", consumes = "application/json", produces = "application/json")
	public GenericResponseDTO generarNota(@RequestBody RequestGenerarNota generarNota) {
		return negocioGenerarNota.generarNota(generarNota);
	}

	@Transactional
	@GetMapping("/AprobarLiquidacion")
	public void aprobarLiquidacion(@RequestParam(value = "idFactura") Integer idFactura)  {
		negocioAprobarLiquidacion.aprobarLiquidacion(idFactura);
	}

	@Transactional
	@GetMapping("/cancelarReliquidacion")
	public GenericResponseDTO cancelarReliquidacion(@RequestParam(value = "tipoNota") Integer tipoNota)
		{
		return negocioAprobarLiquidacion.cancelarReliquidacion(tipoNota);
	}

	@Transactional
	@GetMapping("/consultarProcesoEjecucionReliquidacion")
	public GenericResponseDTO consultarProcesoEjecucionReliquidacion(@RequestParam(value = "tipoNota") Integer tipoNota) 
			throws  InvalidParameterException, IOException, NegocioException
	{
		return negocioUtilidadesLiquidacion.validaProcesoEjecucion(tipoNota);
	}

	@Transactional
	@PostMapping(path = "/gestionDeuda", consumes = "application/json", produces = "application/json")
	public void gestionDeuda(@RequestBody RequestDeuda deuda)
			throws  IOException, NegocioException {
		negocioDeuda.preLiquidacion(deuda);
	}

	/**
	 * Método encargado de consultar si existe un proceso activo de cálculo de
	 * descuento por indicadores de calidad
	 * 
	 * @param tipoNota
	 * @return
	 * @throws Exception
	 */
	@Transactional
	@GetMapping("/consultarProcesoCalidad")
	public Boolean consultarProcesoCalidad(@RequestParam(value = "tipoNota") Integer tipoNota) {
		return negocioDeuda.consultarProcesoCalidad(tipoNota);
	}

}
