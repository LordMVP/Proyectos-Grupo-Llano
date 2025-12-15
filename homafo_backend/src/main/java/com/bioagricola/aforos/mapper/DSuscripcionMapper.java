package com.bioagricola.aforos.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.bioagricola.aforos.entity.dto.DsusSuscripcionInfoDTO;
import com.bioagricola.common.entity.DsusDetsuscrip;

@Mapper(componentModel = "spring")
public interface DSuscripcionMapper {

	@Mapping(target = "dsusActividadComercialNombre", ignore = true)
	@Mapping(target = "dsusIderegistro", ignore = true)
	@Mapping(target = "dsusNombreEstablecimiento", ignore = true)
	@Mapping(target = "dsusReferenciaComercial", ignore = true)
	@Mapping(target = "proDireccion", ignore = true)
	@Mapping(target = "tipoUsoNombre", ignore = true)
	@Mapping(target = "terIderegistro", ignore = true)
	@Mapping(source = "uniBarrio.barrioIderegistro", target = "uniBarrio")
	@Mapping(source = "uniBarrio.barrioNom", target = "uniBarrioNombre")
	DsusSuscripcionInfoDTO dsusToDto(DsusDetsuscrip dsus);

}
