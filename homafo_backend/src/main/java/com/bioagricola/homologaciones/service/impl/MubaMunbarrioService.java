package com.bioagricola.homologaciones.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.common.entity.MubaMunbarrio;
import com.bioagricola.homologaciones.entity.specs.MubaMunbarrioSpecifications;
import com.bioagricola.homologaciones.repository.MubaMunbarrioRepository;

@Service
public class MubaMunbarrioService extends AbstractService<MubaMunbarrio, Long> {

	@Autowired
	private MubaMunbarrioRepository repository;
	
	public MubaMunbarrioService() {
		super(MubaMunbarrio.class);
	}
	
	public Page<MubaMunbarrio> findByEmpresaPage(Integer empresa,Pageable pageable,Optional<String> search){
		return this.repository.findAll(MubaMunbarrioSpecifications.byEmpresa(empresa,search.orElse("")), pageable);
	}

	@Override
	protected JpaRepository<MubaMunbarrio, Long> getRepository() {
		// TODO Auto-generated method stub
		return repository;
	}

	public Optional<MubaMunbarrio> findByEmpresaMunicipioBarrio(Integer empresa, Integer municipio, Integer barrio) {
		// TODO Auto-generated method stub
		return this.repository.findOne(MubaMunbarrioSpecifications.byEmpresaAndMunicipioAndBarrio(empresa, municipio, barrio));
	}
	
	
	public List<Object []> findComplementoMultiusuarioByMbcd(Long mbcd){
		List<Object []> resultado = repository.findComplementoMultiusuarioByMbcd(mbcd);
		return resultado;
	}
	public List<Object []> findComplementoMultiusuarioByUnidad(Long mbcd){
		List<Object []> resultado = repository.findComplementoMultiusuarioByUnidad(mbcd);
		return resultado;
	}
	
	
	
}
