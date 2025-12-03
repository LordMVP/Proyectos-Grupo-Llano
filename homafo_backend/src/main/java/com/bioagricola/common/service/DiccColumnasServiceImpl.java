package com.bioagricola.common.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.common.entity.DiccColumnasEntity;
import com.bioagricola.common.repository.DiccColumnasRepository;


@Service
public class DiccColumnasServiceImpl {

	
	@Autowired
	private DiccColumnasRepository respository;
	
	public Optional<DiccColumnasEntity> findByTabla(String tabla,String columna){
		return this.respository.findByDiccTablaAndDiccColumna(tabla, columna);
	}
	public Optional<List<DiccColumnasEntity>> findByTabla(String tabla){
		return this.respository.findByDiccTabla(tabla);
	}
}
