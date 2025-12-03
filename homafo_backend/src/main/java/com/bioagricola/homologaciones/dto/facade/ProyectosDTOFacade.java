package com.bioagricola.homologaciones.dto.facade;

import org.springframework.stereotype.Component;

import com.bioagricola.common.entity.Proyectos;
import com.bioagricola.homologaciones.dto.basic.ProyectosDTO;

@Component
public class ProyectosDTOFacade extends AbstractDTOFacade<Proyectos, ProyectosDTO> {

	public ProyectosDTOFacade() {
		super(Proyectos.class,ProyectosDTO.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	public ProyectosDTO convertToDto(Proyectos entity) {
		// TODO Auto-generated method stub
		return this.mapToDto(entity);
	}

	@Override
	public Proyectos convertToEntity(ProyectosDTO dto) {
		// TODO Auto-generated method stub
		return this.mapToEntity(dto);
	}

}
