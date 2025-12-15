package com.bioagricola.apirest.modelo.manejadores;

import java.util.Date;
import java.util.List;

import com.bioagricola.apirest.modelo.dtos.AproCoapConsolidadoDTO;
import com.bioagricola.apirest.modelo.dtos.PeriodoFactDTO;
import com.bioagricola.apirest.modelo.dtos.TerceroPorFactDTO;

public interface IManejadorCoapConsApro {

    public List<Object[]> getResumenLiquidacion(PeriodoFactDTO periodo, String terceros, Integer idEmpresa, String estado, Integer tipoProceso);

    public Object getFechaPrestacion(Integer idperiodoFacturacion);

    public Integer insertarConsolidado(AproCoapConsolidadoDTO coapConsolidadoaproDTO, Integer idEmpresa,Integer usuIderegistro, Date fechaReg);

    public List<Object[]> getResumenLiquidacionIA(PeriodoFactDTO periodo,Integer prlIderegistro, Integer idEmpresa, String estado, Integer tipoProceso, String terceros);

    public List<Object[]> getDetalleStage(PeriodoFactDTO periodo, Integer idEmpresa, String estado, String terceros);
	
    public List<TerceroPorFactDTO> consultaTerceroPorPeriodoFac(Integer idempresa,List<Integer> maprc_id, List<Integer> periodos_fact,Integer tipoProceso);

}
