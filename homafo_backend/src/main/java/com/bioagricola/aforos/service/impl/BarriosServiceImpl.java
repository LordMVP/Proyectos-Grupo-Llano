package com.bioagricola.aforos.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.aforos.entity.dto.StaticContentResponseDTO;
import com.bioagricola.common.entity.Barrios;
import com.bioagricola.homologaciones.repository.BarriosRepository;

@Service
public class BarriosServiceImpl{

	@Autowired
	private BarriosRepository barriosRepository;

	public List<StaticContentResponseDTO<String>> getBarriosByMunicipio(Long municipio){
		List<StaticContentResponseDTO<String>> response = new ArrayList<>();
		List<Barrios> barrios = barriosRepository.findBarriosByMunicipio(municipio);
		
		barrios.stream().forEach(b->{
			StaticContentResponseDTO<String> item = new StaticContentResponseDTO<>();
											 item.setObject(b.getBarrioNom());
											 item.setId(Long.valueOf(b.getBarrioIderegistro()));
			response.add(item);
		});
		return response.stream().distinct().collect(Collectors.toList());
	}
}
