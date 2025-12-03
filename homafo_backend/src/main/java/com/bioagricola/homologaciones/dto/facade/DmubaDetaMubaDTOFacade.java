package com.bioagricola.homologaciones.dto.facade;

import java.lang.reflect.Type;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.bioagricola.common.entity.RutRuta;
import com.bioagricola.homologaciones.dto.basic.DiaSemanaPrototypeDTO;
import com.bioagricola.homologaciones.dto.basic.DmubaDetaMubaDTO;
import com.bioagricola.homologaciones.dto.basic.RutRutaDTO;
import com.bioagricola.homologaciones.dto.basic.RutRutaPrototypeDTO;
import com.bioagricola.homologaciones.entity.DmubaDetaMuba;
import com.bioagricola.homologaciones.service.impl.RutRutaService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

@Component
public class DmubaDetaMubaDTOFacade extends AbstractDTOFacade<DmubaDetaMuba, DmubaDetaMubaDTO> {

	@Autowired
	private RutRutaService rutRutaService;
	public DmubaDetaMubaDTOFacade() {
		super(DmubaDetaMuba.class,DmubaDetaMubaDTO.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	public DmubaDetaMubaDTO convertToDto(DmubaDetaMuba entity) {
		// TODO Auto-generated method stub
		DmubaDetaMubaDTO dto = this.mapToDto(entity);
		@SuppressWarnings("serial")
		Type setRutRutaDTOtype = new TypeToken<Set<RutRutaDTO>>(){}.getType();
		@SuppressWarnings("serial")
		Type setDiaSemanaType = new TypeToken<Set<DiaSemanaPrototypeDTO>>(){}.getType();
		Gson gson = new Gson();
		
		Set<RutRutaDTO> rutas = gson.fromJson(entity.getDmubaRutas(), setRutRutaDTOtype);
		dto.setDmubaRutas(new HashSet<Long>());
		rutas.stream().forEach(ruta->{dto.getDmubaRutas().add(ruta.getRutIderegistro());});		
		
		Set<DiaSemanaPrototypeDTO> frecuencias = gson.fromJson(entity.getDmubaFrecuenciasBarrido(), setDiaSemanaType);
		dto.setDmubaFrecuenciasBarrido(new HashSet<Integer>());
		frecuencias.stream().forEach(frecuencia->{dto.getDmubaFrecuenciasBarrido().add(frecuencia.getValue());});
		
		return dto;
	}

	@Override
	public DmubaDetaMuba convertToEntity(DmubaDetaMubaDTO dto) {
		// TODO Auto-generated method stub
		DmubaDetaMuba entity = this.mapToEntity(dto);
		Gson gson = new Gson();
		if(dto.getDmubaRutas()!=null) {
			Set<RutRutaPrototypeDTO> protos = dto.getDmubaRutas().stream().map(i -> {
				RutRutaPrototypeDTO proto = new RutRutaPrototypeDTO();
				RutRuta ruta = rutRutaService.findById(i);
				proto.setRutIderegistro(ruta.getRutIderegistro());
				proto.setRutNombre(ruta.getRutNombre());
				return proto;
			}).collect(Collectors.toSet());
			String protosJson = gson.toJson(protos);
			System.out.println(protosJson);
			entity.setDmubaRutas(protosJson);
		}
		if(dto.getDmubaFrecuenciasBarrido()!=null) {
			Set<DiaSemanaPrototypeDTO> protos = dto.getDmubaFrecuenciasBarrido().stream().map(i -> {
				DiaSemanaPrototypeDTO proto = new DiaSemanaPrototypeDTO();
				proto.setValue(i);
				proto.setLabel(DiaSemanaPrototypeDTO.getLabel(i));
				return proto;
			}).collect(Collectors.toSet());
			String protosJson = gson.toJson(protos);
			System.out.println(protosJson);
			entity.setDmubaFrecuenciasBarrido(protosJson);
		}
		entity.setDmubaSwtact("A");
		entity.setUsuIderegistro(288);
		return entity;
	}

	
}
