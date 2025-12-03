package com.bioagricola.homologaciones.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.common.entity.SecSector;
import com.bioagricola.homologaciones.entity.specs.SecSectorSpecifications;
import com.bioagricola.homologaciones.repository.SecSectorRepository;

@Service
public class SecSectorService extends AbstractService<SecSector, Long>
{
	public SecSectorService() {
		super(SecSector.class);
		// TODO Auto-generated constructor stub
	}

	@Autowired
	private SecSectorRepository repository;
	
	public List<HashMap<String, Object>> listaSectores(Integer empresa)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaSectores(empresa,"A"))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("sec_ideregistro", tmp2[0]);
    		tmp1.put("sec_nombre",tmp2[1]);
    		tmp1.put("sec_codigo1",tmp2[2]);
    		tmp1.put("emp_ideregistro",tmp2[3]);
    		tmp1.put("sec_estado",tmp2[4]);
    		total.add(tmp1);
    	}
    	return total;
	}

	@Override
	protected JpaRepository<SecSector, Long> getRepository() {
		// TODO Auto-generated method stub
		return this.repository;
	}

	public Page<SecSector> findByEmpresa(Integer empresa, Pageable pageable) {
		return this.repository.findAll(SecSectorSpecifications.byEmpresa(empresa), pageable);
		
	}
	
	public Page<SecSector> findByEmpresaAndEstado(Integer empresa,String estado, Pageable pageable) {
		return this.repository.findAll(SecSectorSpecifications.byEmpresaAndEstado(empresa,estado), pageable);		
	}

	
}
