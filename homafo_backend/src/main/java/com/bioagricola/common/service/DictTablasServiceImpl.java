package com.bioagricola.common.service;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.common.entity.DictTablasEntity;
import com.bioagricola.common.repository.DictTablasRepository;

@Service
public class DictTablasServiceImpl {

	@Autowired
	private DictTablasRepository respository;
	
	
	public Optional<DictTablasEntity> findEtiquetaTabla(String tabla){
		return this.respository.findByDictTabla(tabla);
	}
}
