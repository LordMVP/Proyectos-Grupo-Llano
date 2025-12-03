package com.bioagricola.aforos.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.aforos.entity.dto.StaticContentResponseDTO;
import com.bioagricola.common.entity.Proyectos;
import com.bioagricola.homologaciones.repository.ProyectosRepository;

@Service
public class ProyectosServiceImpl{

	@Autowired
	private ProyectosRepository proyectosRepository;

	public List<StaticContentResponseDTO<String>> getMunicipiosActivosAforos(){
		List<StaticContentResponseDTO<String>> response = new ArrayList<>();
		List<Proyectos> proyectos = proyectosRepository.findMunicipiosActivosAforos();
		
		proyectos.stream().forEach(p->{
			StaticContentResponseDTO<String> item = new StaticContentResponseDTO<>();
											 item.setObject(p.getProyectoNom());
											 item.setId(p.getProyectoIderegistro());
			response.add(item);
		});
		return response.stream().distinct().collect(Collectors.toList());
	}
	
	public List<StaticContentResponseDTO<String>> getMunicipiosActivosEmpresa(Integer empresa){
		List<StaticContentResponseDTO<String>> response = new ArrayList<>();
		for(Object[] tmp2: this.proyectosRepository.listaProyectos(empresa))
    	{
			StaticContentResponseDTO<String> item = new StaticContentResponseDTO<>();
			item.setObject(tmp2[1].toString());
			item.setId(Long.parseLong((String.valueOf(tmp2[0]))));
			response.add(item);
    	}
		
		return response.stream().distinct().collect(Collectors.toList());
	}
}
