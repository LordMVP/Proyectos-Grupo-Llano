package com.bioagricola.aforos.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.bioagricola.aforos.entity.MaestroAforoVisita;
import com.bioagricola.aforos.entity.dto.MaestroVisitasResource;

@Mapper(componentModel = "spring",uses={DetalleMaestroVisitasMapper.class,AforoMapper.class})
public interface AforoMaestroVisitasMapper {

	@Mapping(source = "detallesMaestrosVisitas",target = "detallesMaestroVisita")
	MaestroVisitasResource toResource(MaestroAforoVisita maestro);
}
