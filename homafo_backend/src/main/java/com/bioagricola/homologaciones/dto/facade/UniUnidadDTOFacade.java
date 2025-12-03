package com.bioagricola.homologaciones.dto.facade;

import org.springframework.stereotype.Component;

import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.homologaciones.dto.basic.UniUnidadDTO;

@Component
public class UniUnidadDTOFacade extends AbstractDTOFacade<UniUnidad, UniUnidadDTO> {

	public UniUnidadDTOFacade() {
		super(UniUnidad.class, UniUnidadDTO.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	public UniUnidadDTO convertToDto(UniUnidad entity) {
		// TODO Auto-generated method stub
		return this.mapToDto(entity);
	}

	@Override
	public UniUnidad convertToEntity(UniUnidadDTO dto) {
		// TODO Auto-generated method stub
		return this.mapToEntity(dto);
	}

}
