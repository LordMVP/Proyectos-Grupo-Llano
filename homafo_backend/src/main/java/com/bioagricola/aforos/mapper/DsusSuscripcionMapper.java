package com.bioagricola.aforos.mapper;

import org.mapstruct.Mapper;

import com.bioagricola.aforos.entity.dto.DsusSuscripcionResource;
import com.bioagricola.common.entity.DsusDetsuscrip;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = { TerceroMapper.class })
public interface DsusSuscripcionMapper {

	@Mapping(target = "terTerceroResource", source = "terIderegistro")
	@Mapping(target = "terIderegistro", source = "terIderegistro.terIderegistro")
	@Mapping(target = "terceroNombreCompleto", source = "terIderegistro.terNomcompleto")
	@Mapping(target = "terceroDocumento", source = "terIderegistro.terDocumento")
	DsusSuscripcionResource toResource(DsusDetsuscrip suscripcion);

	default Long toId(DsusDetsuscrip suscripcion) {
		return suscripcion.getDsusIderegistr();
	}
}
