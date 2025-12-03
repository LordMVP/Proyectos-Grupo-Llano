package com.bioagricola.homologaciones.dto.facade;

import org.springframework.stereotype.Component;

import com.bioagricola.homologaciones.dto.basic.ArprAreaprestacionDTO;
import com.bioagricola.homologaciones.entity.ArprAreaprestacion;

@Component
public class ArprAreaprestacionDTOFacade extends AbstractDTOFacade<ArprAreaprestacion,ArprAreaprestacionDTO> {

	public ArprAreaprestacionDTOFacade() {
		super(ArprAreaprestacion.class,ArprAreaprestacionDTO.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	public ArprAreaprestacionDTO convertToDto(ArprAreaprestacion entity) {
		// TODO Auto-generated method stub
		return this.mapToDto(entity);
	}

	@Override
	public ArprAreaprestacion convertToEntity(ArprAreaprestacionDTO dto) {
		// TODO Auto-generated method stub
		return this.mapToEntity(dto);
	}
	
	

}
