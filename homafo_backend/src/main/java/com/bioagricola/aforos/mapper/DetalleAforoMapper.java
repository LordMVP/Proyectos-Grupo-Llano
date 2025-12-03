package com.bioagricola.aforos.mapper;

import org.mapstruct.Mapper;

import com.bioagricola.aforos.entity.DetalleAforo;
import com.bioagricola.aforos.entity.dto.DetalleAforoInfoDTO;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring",uses= {DsusSuscripcionMapper.class,AforoMapper.class})
public interface DetalleAforoMapper {


	@Mapping(target = "dsusResource", source = "dsusIderegistr")
	DetalleAforoInfoDTO toResource(DetalleAforo detalle);
}
