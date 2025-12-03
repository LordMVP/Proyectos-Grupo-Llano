package com.bioagricola.homologaciones.dto.facade;

import org.springframework.stereotype.Component;

import com.bioagricola.homologaciones.dto.basic.PiminsProyeccionIminsDTO;
import com.bioagricola.homologaciones.entity.PiminsProyeccionImins;

@Component
public class PiminsProyeccionIminsDTOFacade extends AbstractDTOFacade<PiminsProyeccionImins, PiminsProyeccionIminsDTO> {

	public PiminsProyeccionIminsDTOFacade() {
		super(PiminsProyeccionImins.class, PiminsProyeccionIminsDTO.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	public PiminsProyeccionIminsDTO convertToDto(PiminsProyeccionImins entity) {
		// TODO Auto-generated method stub
		return this.mapToDto(entity);
	}

	@Override
	public PiminsProyeccionImins convertToEntity(PiminsProyeccionIminsDTO dto) {
		// TODO Auto-generated method stub
		return this.mapToEntity(dto);
	}

	
}
