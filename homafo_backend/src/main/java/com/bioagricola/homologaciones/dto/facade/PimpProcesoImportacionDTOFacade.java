package com.bioagricola.homologaciones.dto.facade;

import org.springframework.stereotype.Component;

import com.bioagricola.homologaciones.dto.basic.PimpProcesoImportacionDTO;
import com.bioagricola.homologaciones.entity.PimpProcesoImportacion;

@Component
public class PimpProcesoImportacionDTOFacade extends AbstractDTOFacade<PimpProcesoImportacion, PimpProcesoImportacionDTO> {

	
	public PimpProcesoImportacionDTOFacade() {
		super(PimpProcesoImportacion.class,PimpProcesoImportacionDTO.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	public PimpProcesoImportacionDTO convertToDto(PimpProcesoImportacion entity) {
		// TODO Auto-generated method stub
		PimpProcesoImportacionDTO dto =this.mapToDto(entity);
		dto.setImarcNombre(entity.getImarcIderegistro().getImarcNombreArchivo());
		return dto;
	}

	@Override
	public PimpProcesoImportacion convertToEntity(PimpProcesoImportacionDTO dto) {
		// TODO Auto-generated method stub
		return this.mapToEntity(dto);
	}
	

}
