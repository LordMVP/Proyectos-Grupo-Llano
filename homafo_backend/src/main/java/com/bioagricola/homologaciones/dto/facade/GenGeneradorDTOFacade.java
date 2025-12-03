package com.bioagricola.homologaciones.dto.facade;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.homologaciones.dto.basic.GenGeneradorDTO;
import com.bioagricola.homologaciones.entity.GenGenerador;
import com.bioagricola.homologaciones.service.impl.EstEstructuraService;
import com.bioagricola.homologaciones.service.impl.UniUnidadService;


@Component
public class GenGeneradorDTOFacade extends AbstractDTOFacade<GenGenerador, GenGeneradorDTO> {

	
	@Autowired
	private EstEstructuraService estructuraService;
	@Autowired
	private UniUnidadDTOFacade unidadDTOConverterFacade;
	@Autowired
	private UniUnidadService unidadService;
	
	Logger log= LoggerFactory.getLogger(GenGeneradorDTOFacade.class);
	public GenGeneradorDTOFacade() {
		super(GenGenerador.class,GenGeneradorDTO.class);		
	}
		
	@Override
	public GenGenerador convertToEntity(GenGeneradorDTO dto) {
		// TODO Auto-generated method stub
		GenGenerador entity = this.mapToEntity(dto);
		entity.setUnidad(this.unidadDTOConverterFacade.convertToEntity(dto.getUnidad()));
		UniUnidad unidadGenerador = entity.getUnidad();
		unidadGenerador.setEstIderegistro(estructuraService.getByClaseAndEmpresa(this.getLongNumberParameterValue("clase_tipo_generador_aforo"),this.EMPRESA));
		UniUnidad tipoUso = unidadService.findByIdOrNull(dto.getUniTipouso());
		entity.setUniClaseAforo(unidadService.findById(dto.getUniClaseaforo()));
		entity.setUniTipouso(tipoUso);
		entity.setFechaGenerador(new Date());
		return entity;
	}

	@Override
	public GenGeneradorDTO convertToDto(GenGenerador entity) {
		// TODO Auto-generated method stub
		GenGeneradorDTO dto = this.mapToDto(entity);
		dto.setUniTipouso(entity.getUniTipouso().getUniIderegistro());
		dto.setUniTipousoDesc(entity.getUniTipouso().getUniNombre1());
		dto.setUnidad(unidadDTOConverterFacade.convertToDto(entity.getUnidad()));
		dto.setUniClaseaforo(entity.getUniClaseAforo().getUniIderegistro());
		return dto;		
	}
	
	

	

	
}
