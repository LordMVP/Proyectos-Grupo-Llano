package com.bioagricola.homologaciones.dto.facade;

import org.springframework.stereotype.Component;

import com.bioagricola.common.entity.Barrios;
import com.bioagricola.homologaciones.dto.basic.BarriosDTO;

@Component
public class BarriosDTOFacade extends AbstractDTOFacade<Barrios,BarriosDTO> {

	public BarriosDTOFacade() {
		super(Barrios.class,BarriosDTO.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	public BarriosDTO convertToDto(Barrios entity) {
		// TODO Auto-generated method stub
		return this.mapToDto(entity);
	}

	@Override
	public Barrios convertToEntity(BarriosDTO dto) {
		// TODO Auto-generated method stub
		return this.mapToEntity(dto);
	}

}
