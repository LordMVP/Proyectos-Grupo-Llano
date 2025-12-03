package com.bioagricola.aforos.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.bioagricola.aforos.entity.DetalleConceptoVisitaAforo;
import com.bioagricola.aforos.entity.dto.DetalleConceptoVisitaResource;
import com.bioagricola.common.entity.ConConcepto;



@Mapper(componentModel = "spring")
public interface DetalleConceptoVisitaMapper {


	@Mapping(target = "uniConceptoNombre", source = "uniConcepto.conNombre")
	DetalleConceptoVisitaResource toResource(DetalleConceptoVisitaAforo detalle);

	default Long toLong(ConConcepto conConcepto) {
		return conConcepto.getUniConcepto();
	}

}
