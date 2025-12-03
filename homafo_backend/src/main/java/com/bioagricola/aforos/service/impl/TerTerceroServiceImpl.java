package com.bioagricola.aforos.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.aforos.entity.dto.StaticContentResponseDTO;
import com.bioagricola.common.entity.TerTercero;
import com.bioagricola.common.repository.TerTerceroRepository;

@Service
public class TerTerceroServiceImpl{

	@Autowired
	private TerTerceroRepository terceroRepository;

	public List<StaticContentResponseDTO<String>> getTecnicosAforadoresBySuscripcion(){
		List<StaticContentResponseDTO<String>> response = new ArrayList<>();
		List<TerTercero> terceros = terceroRepository.findTecnicosAforadores();
		
			terceros.stream().forEach(u->{
				StaticContentResponseDTO<String> item = new StaticContentResponseDTO<>();
												 item.setObject(u.getTerNomcompleto());
												 item.setId(u.getTerIderegistro());
				response.add(item);
			});
		
		return response.stream().distinct().collect(Collectors.toList());
	}

	public List<StaticContentResponseDTO<String>> getTercerosNombreLike(String nombre){
		List<StaticContentResponseDTO<String>> response = new ArrayList<>();
		List<TerTercero> terceros = terceroRepository.findTercerosNombreLike(nombre);
		
		terceros.stream().forEach(u->{
			StaticContentResponseDTO<String> item = new StaticContentResponseDTO<>();
			item.setObject(u.getTerNomcompleto());
			item.setId(u.getTerIderegistro());
			response.add(item);
		});
		
		return response.stream().distinct().collect(Collectors.toList());
	}
}
