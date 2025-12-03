package com.bioagricola.homologaciones.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.homologaciones.entity.PiminsProyeccionImins;
import com.bioagricola.homologaciones.repository.PiminsProyeccionIminsRepository;

@Service
public class PiminsProyeccionIminsService extends AbstractService<PiminsProyeccionImins, Long> {	

	@Autowired
	PiminsProyeccionIminsRepository repository;
	
	public PiminsProyeccionIminsService() {
		super(PiminsProyeccionImins.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected JpaRepository<PiminsProyeccionImins, Long> getRepository() {
		// TODO Auto-generated method stub
		return repository;
	}
	
	
	public Page<PiminsProyeccionImins> findByPimp(Long piminsIderegistro,Pageable pageable){
		return this.repository.findByPimpIderegistro_pimpIderegistro(piminsIderegistro, pageable);		
	}
	public Page<PiminsProyeccionImins> findByPimpAnEstado(Long piminsIderegistro,String estado,Pageable pageable){
		return this.repository.findByPimpAndEstado(piminsIderegistro, estado, pageable);
	}
	
	
	
}
