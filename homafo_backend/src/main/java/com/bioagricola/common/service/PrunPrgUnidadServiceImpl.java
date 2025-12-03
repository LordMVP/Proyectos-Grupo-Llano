package com.bioagricola.common.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.common.entity.PrunPrgUnidad;
import com.bioagricola.common.repository.PrunPrgUnidadRepository;

@Service
public class PrunPrgUnidadServiceImpl {

	@Autowired
	private PrunPrgUnidadRepository prgUnidadRepository;
	
	
	public List<PrunPrgUnidad> getPermisosUsuarioPrograma(Long usuIderegistro,Long prgIderegistro){
		return this.prgUnidadRepository.findByProgramaAndUsuario(prgIderegistro, usuIderegistro);
	}
}
