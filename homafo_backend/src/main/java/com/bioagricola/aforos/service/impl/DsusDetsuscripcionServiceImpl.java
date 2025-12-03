package com.bioagricola.aforos.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.aforos.entity.dto.StaticContentResponseDTO;
import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.common.repository.DsusDetsuscripRepository;

@Service
public class DsusDetsuscripcionServiceImpl{

	@Autowired
	private DsusDetsuscripRepository dsusDetsuscripRepository;
	
	Logger log = LoggerFactory.getLogger(this.getClass());
	
	public List<StaticContentResponseDTO<String>> getEstratosAforos(){
		List<StaticContentResponseDTO<String>> response = new ArrayList<>();
		List<DsusDetsuscrip> dsus = dsusDetsuscripRepository.getEstratos();
		
		log.error("RESULTADO: "+dsus.get(0).getUniBarrio());
		dsus.stream().forEach(i->{
			StaticContentResponseDTO<String> item = new StaticContentResponseDTO<>();
											 item.setObject(i.getProCatestrato().toString());
											 item.setId(i.getDsusIderegistr());
			response.add(item);
		});
		return response.stream().distinct().collect(Collectors.toList());
	}
}
