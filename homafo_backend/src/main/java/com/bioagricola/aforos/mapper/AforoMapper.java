package com.bioagricola.aforos.mapper;

import java.util.List;
import java.util.Objects;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import com.bioagricola.aforos.entity.Aforo;
import com.bioagricola.aforos.entity.DetalleAforo;
import com.bioagricola.aforos.entity.dto.AforoInfoDTO;
import com.bioagricola.aforos.repository.IasusInforadicionalsuscripcionRepository;
import com.bioagricola.common.entity.IasusInforadicionalsuscripcion;

@Mapper(componentModel = "spring")
public interface AforoMapper {
	AforoMapper INSTANCE = Mappers.getMapper(AforoMapper.class);

	@Mapping(target = "afoFechaVigencia", source="afoFechafinvegencia")
	@Mapping(source = "uniTipoaforo.tafoIderegistro",target = "tipoAforoId")
	@Mapping(source = "uniTipoaforo.unidad.uniNombre1",target = "tipoAforoNombre")
	@Mapping(source = "uniTipoaforo.unidad.uniCodigo1",target = "tipoAforoCodigo")
	@Mapping(source="afoIderegistro",target = "afoIderegistro" )
	@Mapping(source = "afoFechainicio",target = "afoFechaInicio")
	@Mapping(source = "terAforador.terNomcompleto",target = "terAforadorNombre")
	@Mapping(source = "terAforador.terDocumento",target = "terAforadorDocumento")
	@Mapping(source = "uniTipoaforo.uniClaseAforo.uniIderegistro",target = "claseAforoId")
	@Mapping(source = "uniTipoaforo.uniClaseAforo.uniNombre1",target = "claseAforoNombre")
	@Mapping(source = "uniComplemento.uniIderegistro",target = "conceptoAforoId")
	@Mapping(source = "uniComplemento.uniNombre1",target = "conceptoAforoNombre")
	@Mapping(source = "terAforador.terIderegistro",target = "terAforadorId")
	@Mapping(source = "detallesAforo",target = "dsusPcodigo",qualifiedByName = "obtenerDsusPcodigo")
	AforoInfoDTO aforoToAforoInfoDTO(Aforo aforo);
	
	@Named("obtenerDsusPcodigo")
	public static String obtenerDsusPcodigo(List<DetalleAforo> lista) {
		if (lista == null || lista.isEmpty()) return null;

		return lista.stream()
			.map(e -> e.getDsusIderegistr())
			.filter(Objects::nonNull)
			.map(d -> d.getDsusPcodigo())
			.filter(Objects::nonNull)
			.findFirst()
			.orElse(null);
	}	

	default Long toId(Aforo aforo) {
		return aforo.getAfoIderegistro();
	}

}
