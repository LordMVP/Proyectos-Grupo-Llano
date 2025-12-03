package com.bioagricola.aforos.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.bioagricola.aforos.entity.DetalleMaestroVisita;
import com.bioagricola.aforos.entity.dto.DetalleMaestroVisitaResource;
import com.bioagricola.common.entity.TerTercero;

@Mapper(componentModel = "spring",uses = {DetalleConceptoVisitaMapper.class,AforoMaestroVisitasMapper.class})
public interface DetalleMaestroVisitasMapper {


	@Mapping(target = "detalles",source = "detalleConceptosList")
	@Mapping(target = "terAforadorNombre", source = "terAforador.terNomcompleto")
	DetalleMaestroVisitaResource toResource(DetalleMaestroVisita detalle);

	default Long toId(TerTercero tercero) {
		return tercero.getTerIderegistro();
	}
}
