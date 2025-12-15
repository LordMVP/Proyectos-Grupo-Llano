package com.bioagricola.apirest.aprovechamiento.servicio;

import com.bioagricola.apirest.aprovechamiento.dto.ResumenConsolidadoAprovDto;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.aprovechamiento.negocio.NegocioResumLiqui;
import com.bioagricola.apirest.modelo.dtos.AproCoapConsolidadoDTO;
import com.bioagricola.apirest.modelo.dtos.DetalleResumenConsDTO;
import com.bioagricola.apirest.modelo.dtos.FiltrosResumenLiquDTO;
import com.bioagricola.apirest.modelo.dtos.InAproCoapConsolidadoDTO;
import com.bioagricola.apirest.modelo.dtos.PeriodoConsolidadoDTO;
import com.bioagricola.apirest.modelo.dtos.PeriodoFactDTO;
import com.bioagricola.apirest.modelo.dtos.TerceroPorFactDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import java.util.Map;

@RestController
@RequestMapping("/webresources/servicios/resumen-liquidacion")
public class ServicioResumLiqui {
	
	@Autowired
	private NegocioResumLiqui negocioResumLiqui;
	
	@PostMapping("/consulta")
	public List<ResumenConsolidadoAprovDto> consultaResumenLiq(@RequestBody FiltrosResumenLiquDTO filtrosResumenLiquDTO )
			throws IOException, InvalidParameterException {

		return negocioResumLiqui.consultaResumenLiq(filtrosResumenLiquDTO );
	}
	
	@PostMapping("/consulta-incentivoA")
	public List<ResumenConsolidadoAprovDto> consultaResumenLiqIA(@RequestBody FiltrosResumenLiquDTO filtrosResumenLiquDTO )
			throws IOException, InvalidParameterException {

		return negocioResumLiqui.consultaResumenLiqIA(filtrosResumenLiquDTO );
	}
	
	@GetMapping("filtro-periodo")
	public List<Object[]> consultarPeriodoConsolidado(@RequestParam("tipoProceso") Integer tipoProceso ) {
		return negocioResumLiqui.consultarPeriodoConsolidado();
	}
	
	@GetMapping("filtro-periodoFac")
	public List<PeriodoFactDTO> consultarPeriodoFacturacion(@RequestParam("prlaIderegistro")Long prlaIderegistro) {
		return negocioResumLiqui.consultarPeriodoFacturacion(prlaIderegistro);
	}
	
	@PostMapping("filtro-tercero")
	public List<TerceroPorFactDTO> consultarTerceroFactura(@RequestBody FiltrosResumenLiquDTO filtrosResumenLiquDTO ) {
		return negocioResumLiqui.consultarTerceroFactura(filtrosResumenLiquDTO);
	}
	
	@PostMapping("detalle")
	public List<DetalleResumenConsDTO> consultarDetalle(@RequestBody FiltrosResumenLiquDTO filtrosResumenLiquDTO  ) {
		return negocioResumLiqui.consultarDetalle(filtrosResumenLiquDTO);
	}
	
	@PostMapping("insertar")
	public boolean insertarConsolidado(@RequestBody AproCoapConsolidadoDTO coapConsolidadoaproDTO) {
		return negocioResumLiqui.insertarConsolidado(coapConsolidadoaproDTO);
	}

	

}
