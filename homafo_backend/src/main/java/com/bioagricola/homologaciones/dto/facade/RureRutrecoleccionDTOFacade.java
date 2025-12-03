package com.bioagricola.homologaciones.dto.facade;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.bioagricola.homologaciones.dto.basic.HrrHorrecoleccionDTO;
import com.bioagricola.homologaciones.dto.basic.MicroRutaPrototypeDTO;
import com.bioagricola.homologaciones.dto.basic.RureRutrecoleccionDTO;
import com.bioagricola.homologaciones.dto.basic.RutRutaDTO;
import com.bioagricola.homologaciones.entity.HrrHorrecoleccionEntity;
import com.bioagricola.homologaciones.entity.RureRutrecoleccion;
import com.bioagricola.homologaciones.service.impl.ArprAreaprestacionService;
import com.bioagricola.homologaciones.service.impl.RutRutaService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

@Component
public class RureRutrecoleccionDTOFacade extends AbstractDTOFacade<RureRutrecoleccion, RureRutrecoleccionDTO> {

	@Autowired
	private HrrHorrecoleccionDTOFacade hrrFacade;
	@Autowired
	private RutRutaDTOFacade rutFacade;

	@Autowired
	private RutRutaService rutService;
	@Autowired
	private ArprAreaprestacionService areaprestacionService;

	public RureRutrecoleccionDTOFacade() {
		super(RureRutrecoleccion.class, RureRutrecoleccionDTO.class);
	}

	@Override
	public RureRutrecoleccionDTO convertToDto(RureRutrecoleccion entity) {
		// TODO Auto-generated method stub
		RureRutrecoleccionDTO dto = this.mapToDto(entity);
		if (entity.getHorariosActivos() != null) {
			Set<HrrHorrecoleccionDTO> horariosDto = entity.getHorariosActivos().stream()
					.map(h -> hrrFacade.convertToDto(h)).collect(Collectors.toSet());
			dto.setHorarios(horariosDto);
		}
		if (entity.getArprIderegistro() != null) {
			dto.setArprIderegistro(entity.getArprIderegistro().getArprIderegistro());
			dto.setArprNombre(entity.getArprIderegistro().getArprNombre());
		}

		dto.setRutIdemacruta(rutFacade.convertToDto(entity.getRutIdemacruta()));
		if (entity.getRutMicroruta() != null) {
			dto.setMicrorutas(this.buildMicrorutas(entity.getRutMicroruta()));
		}
		return dto;
	}

	@Override
	public RureRutrecoleccion convertToEntity(RureRutrecoleccionDTO dto) {
		// TODO Auto-generated method stub
		RureRutrecoleccion entity = this.mapToEntity(dto);
		entity.setRutIdemacruta(rutFacade.convertToEntity(dto.getRutIdemacruta()));
		entity.setArprIderegistro(areaprestacionService.findById(dto.getArprIderegistro()));
		entity.setHorariosActivos(dto.getHorarios().stream().map(h -> {
			HrrHorrecoleccionEntity hrrEntity = hrrFacade.convertToEntity(h);
			hrrEntity.setRureIderegistro(entity);	
			hrrEntity.setHrrDiaValor(getDiaValor(hrrEntity.getHrrDia()));
			return hrrEntity;
		}).collect(Collectors.toSet()));
		return entity;
	}

	private Integer getDiaValor(String dia) {
		HashMap<String, Integer> dias = new HashMap<>();
		dias.put("Lunes", 1);
		dias.put("Martes", 2);
		dias.put("Miercoles", 3);
		dias.put("Jueves", 4);
		dias.put("Viernes", 5);
		dias.put("Sabado", 6);
		dias.put("Domingo", 7);
		return dias.get(dia);
	}
	private Set<RutRutaDTO> buildMicrorutas(String json) {
		System.out.println(json);
		Gson gson = new Gson();
		@SuppressWarnings("serial")
		Type microRutaSetType = new TypeToken<Set<MicroRutaPrototypeDTO>>() {
		}.getType();

		Set<MicroRutaPrototypeDTO> microRutasJson = gson.fromJson(json, microRutaSetType);

		Set<RutRutaDTO> microRutasDto = microRutasJson.stream().map(m -> {
			RutRutaDTO rutDto = this.rutFacade.convertToDto(this.rutService.findById(m.getMicroRuta()));
			return rutDto;
		}).collect(Collectors.toSet());

		return microRutasDto;
	}

}
