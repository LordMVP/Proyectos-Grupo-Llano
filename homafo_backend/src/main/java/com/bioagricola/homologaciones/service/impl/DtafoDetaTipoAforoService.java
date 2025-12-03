package com.bioagricola.homologaciones.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.homologaciones.entity.DtafoDetaTipoAforo;
import com.bioagricola.homologaciones.repository.DtafoDetaTipoAforoRepository;

@Service
public class DtafoDetaTipoAforoService extends AbstractService<DtafoDetaTipoAforo, Long> {

	public DtafoDetaTipoAforoService() {
		// TODO Auto-generated constructor stub
		super(DtafoDetaTipoAforo.class);
	}
	@Autowired
	private DtafoDetaTipoAforoRepository detaTipoAforoRepository;
	
	public DtafoDetaTipoAforo save(DtafoDetaTipoAforo entity) {
		return this.detaTipoAforoRepository.save(entity);
	}
	
	public List<DtafoDetaTipoAforo> findByTafoIderegistro(Integer tafoIderegistro){
		return this.detaTipoAforoRepository.findByTafoIderegistro_TafoIderegistro(tafoIderegistro);
	}

	public void remove(DtafoDetaTipoAforo d) {
		// TODO Auto-generated method stub
		this.detaTipoAforoRepository.delete(d);		
	}
	public void removeById(Long id) {
		this.detaTipoAforoRepository.deleteById(id);
	}

	@Override
	protected JpaRepository<DtafoDetaTipoAforo, Long> getRepository() {
		// TODO Auto-generated method stub
		return this.detaTipoAforoRepository;
	}
	
}
