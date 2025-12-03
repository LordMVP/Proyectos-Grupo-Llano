package com.bioagricola.homologaciones.dto.facade;

import org.springframework.stereotype.Component;

import com.bioagricola.homologaciones.dto.basic.HrrHorrecoleccionDTO;
import com.bioagricola.homologaciones.entity.HrrHorrecoleccionEntity;

@Component
public class HrrHorrecoleccionDTOFacade extends AbstractDTOFacade<HrrHorrecoleccionEntity,HrrHorrecoleccionDTO> {

	public HrrHorrecoleccionDTOFacade() {
		super(HrrHorrecoleccionEntity.class,HrrHorrecoleccionDTO.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	public HrrHorrecoleccionDTO convertToDto(HrrHorrecoleccionEntity entity) {
		// TODO Auto-generated method stub
		HrrHorrecoleccionDTO dto = this.mapToDto(entity);
		if (entity.getRureIderegistro() != null) {
			dto.setRureIderegistro(entity.getRureIderegistro().getRureIderegistro());
		}
		return dto;
	}

	@Override
	public HrrHorrecoleccionEntity convertToEntity(HrrHorrecoleccionDTO dto) {
		// TODO Auto-generated method stub
		return this.mapToEntity(dto);
	}

}
