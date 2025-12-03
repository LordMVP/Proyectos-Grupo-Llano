package com.bioagricola.homologaciones.dto.facade;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.homologaciones.dto.basic.DtafoDetaTipoAforoDTO;
import com.bioagricola.homologaciones.dto.basic.TafoTipoAforoDTO;
import com.bioagricola.homologaciones.entity.DtafoDetaTipoAforo;
import com.bioagricola.homologaciones.entity.TafoTipoAforo;
import com.bioagricola.homologaciones.service.impl.EstEstructuraService;
import com.bioagricola.homologaciones.service.impl.UniUnidadService;

@Component
public class TafoTipoAforoDTOFacade extends AbstractDTOFacade<TafoTipoAforo, TafoTipoAforoDTO> {

	@Autowired
	private DtafoDetaTipoAforoDTOFacade detaTipoAforoDTOConverterFacade;	

	@Autowired
	private EstEstructuraService estructuraService;

	@Autowired
	private UniUnidadService unidadService;
	@Autowired
	private AuthenticationFacade authFacade;

	public TafoTipoAforoDTOFacade() {
		super(TafoTipoAforo.class, TafoTipoAforoDTO.class);
	}

	@Override
	public TafoTipoAforoDTO convertToDto(TafoTipoAforo entity) {
		TafoTipoAforoDTO dto = this.mapToDto(entity);
		dto.setUnidad(this.unidadFacade.convertToDto(entity.getUnidad()));
		dto.setUniClaseaforo(entity.getUniClaseAforo().getUniIderegistro());
		Collection<DtafoDetaTipoAforoDTO> deatallesDto = entity.getDetalles().stream()
				.map((det) -> detaTipoAforoDTOConverterFacade.convertToDto(det)).collect(Collectors.toList());
		dto.setDetalles(deatallesDto);
		return dto;
	}

	@Override
	public TafoTipoAforo convertToEntity(TafoTipoAforoDTO dto) {
		// TODO Auto-generated method stub
		TafoTipoAforo entity = this.mapToEntity(dto);
		//entity.setUnidad(this.unidadDtoConverter.convertToEntity(dto.getUnidad()));
		Set<DtafoDetaTipoAforo> detalles = dto.getDetalles().stream().map(det -> {
			DtafoDetaTipoAforo d = detaTipoAforoDTOConverterFacade.convertToEntity(det);
			d.setTafoIderegistro(entity);
			d.setUsuIderegistro(authFacade.getIdUsuario());
			return d;
		}).collect(Collectors.toSet());
		entity.setDetalles(detalles);
		entity.getUnidad().setEstIderegistro(
				estructuraService.getByClaseAndEmpresa(this.getLongNumberParameterValue("clase_tipo_aforo"), this.EMPRESA));
		entity.setUniClaseAforo(unidadService.findById(dto.getUniClaseaforo())); 
		return entity;
	} 

}
