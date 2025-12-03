package com.bioagricola.aforos.mapper;

import org.mapstruct.Mapper;

import com.bioagricola.aforos.entity.dto.GenGeneradorResource;
import com.bioagricola.homologaciones.entity.GenGenerador;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface GenGeneradorMapper {


	@Mapping(target = "uniTipousoDesc", source="uniTipouso.uniNombre1")
	@Mapping(target = "uniTipouso", source="uniTipouso.uniIderegistro")
	@Mapping(target = "genNombre",source = "unidad.uniNombre1")
	GenGeneradorResource toResource(GenGenerador generador);

	default Long toLong(GenGenerador generador) {
		return generador.getGenIderegistro();
	}
}
