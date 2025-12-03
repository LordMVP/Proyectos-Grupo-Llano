package com.bioagricola.homologaciones.dto.facade;

import org.springframework.stereotype.Component;

import com.bioagricola.common.entity.RutRuta;
import com.bioagricola.homologaciones.dto.basic.RutRutaDTO;

@Component
public class RutRutaDTOFacade extends AbstractDTOFacade<RutRuta, RutRutaDTO> {

	public RutRutaDTOFacade() {
		super(RutRuta.class,RutRutaDTO.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	public RutRutaDTO convertToDto(RutRuta entity) {
		// TODO Auto-generated method stub
		RutRutaDTO dto =this.mapToDto(entity); 
		return dto;
	}

	@Override
	public RutRuta convertToEntity(RutRutaDTO dto) {
		// TODO Auto-generated method stub
		return this.mapToEntity(dto);
	}
	
	

}
