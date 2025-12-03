package com.bioagricola.aforos.mapper;

import org.mapstruct.Mapper;

import com.bioagricola.aforos.entity.dto.TerTerceroResource;
import com.bioagricola.common.entity.TerTercero;

@Mapper(componentModel = "spring")
public interface TerceroMapper {


	TerTerceroResource toResource(TerTercero tercero);

	default Long terceroToID(TerTercero tercero) {
		return tercero.getTerIderegistro();
	}
}
