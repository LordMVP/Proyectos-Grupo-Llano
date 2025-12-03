package com.bioagricola.apirest.modelo.manejadores;

import java.util.Date;
import java.util.List;

import com.bioagricola.apirest.modelo.dtos.AproCoapConsolidadoDTO;

public interface IManejadorCoapConsApro {
	
	public List<Object[]> getResumenLiquidacion(Integer prlaIderegistro, 
			List<Integer> perIderegistro, List<Long> terIderegistro, Integer idEmpresa);

	public Object getFechaPrestacion(Integer idperiodoFacturacion );
	
	public Integer insertarConsolidado(AproCoapConsolidadoDTO coapConsolidadoaproDTO,Integer idEmpresa,
			Integer usuIderegistro, Date fechaReg );
	
	public List<Object[]> getResumenLiquidacionIA(Integer prlaIderegistro,Integer idEmpresa);
	
}
