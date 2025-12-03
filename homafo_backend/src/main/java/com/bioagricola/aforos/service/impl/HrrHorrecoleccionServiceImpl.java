package com.bioagricola.aforos.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.common.entity.HrrHorrecoleccion;
import com.bioagricola.common.repository.HrrHorrecoleccionRepository;

@Service
public class HrrHorrecoleccionServiceImpl{

	@Autowired
	private HrrHorrecoleccionRepository hrrHorrecoleccionRepository;

	public HrrHorrecoleccion getFrecuenciaRecoleccion(){
		Optional<HrrHorrecoleccion> hrrHor = hrrHorrecoleccionRepository.findFrecuenciaRecoleccion().stream().findAny();
		
		return hrrHor.isPresent()?hrrHor.get():null;
	}
}
