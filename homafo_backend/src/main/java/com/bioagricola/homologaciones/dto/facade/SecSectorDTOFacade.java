package com.bioagricola.homologaciones.dto.facade;

import org.springframework.stereotype.Component;

import com.bioagricola.common.entity.SecSector;
import com.bioagricola.homologaciones.dto.basic.SecSectorDTO;

@Component
public class SecSectorDTOFacade extends AbstractDTOFacade<SecSector,SecSectorDTO> {

	public SecSectorDTOFacade() {
		super(SecSector.class,SecSectorDTO.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	public SecSectorDTO convertToDto(SecSector entity) {
		// TODO Auto-generated method stub
		return this.mapToDto(entity);
	}

	@Override
	public SecSector convertToEntity(SecSectorDTO dto) {
		// TODO Auto-generated method stub
		return this.mapToEntity(dto);
	}

	
}
