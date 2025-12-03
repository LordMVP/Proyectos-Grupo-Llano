package com.bioagricola.homologaciones.dto.facade;

import org.springframework.stereotype.Component;

import com.bioagricola.homologaciones.dto.basic.DtafoDetaTipoAforoDTO;
import com.bioagricola.homologaciones.entity.DtafoDetaTipoAforo;

@Component
public class DtafoDetaTipoAforoDTOFacade extends AbstractDTOFacade<DtafoDetaTipoAforo, DtafoDetaTipoAforoDTO>{

	public DtafoDetaTipoAforoDTOFacade() {
		super(DtafoDetaTipoAforo.class,DtafoDetaTipoAforoDTO.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	public DtafoDetaTipoAforoDTO convertToDto(DtafoDetaTipoAforo entity) {
		// TODO Auto-generated method stub
		return this.mapToDto(entity);
	}

	@Override
	public DtafoDetaTipoAforo convertToEntity(DtafoDetaTipoAforoDTO dto) {
		// TODO Auto-generated method stub
		return this.mapToEntity(dto);
	}
	
	

	
}
