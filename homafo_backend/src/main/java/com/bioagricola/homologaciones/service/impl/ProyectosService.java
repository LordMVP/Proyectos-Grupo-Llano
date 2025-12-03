package com.bioagricola.homologaciones.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.common.entity.Proyectos;
import com.bioagricola.homologaciones.entity.specs.ProyectosSpecifications;
import com.bioagricola.homologaciones.repository.ProyectosRepository;

@Service
public class ProyectosService extends AbstractService<Proyectos, Long>
{
	public ProyectosService() {
		super(Proyectos.class);
		// TODO Auto-generated constructor stub
	}

	@Autowired
	private ProyectosRepository repository;
	
	public List<HashMap<String, Object>> listaProyectos(Integer empresa)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaProyectos(empresa))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("proyecto_cod", tmp2[0]);
    		tmp1.put("proyecto_nom", tmp2[1]);
    		tmp1.put("proyecto_codciu",tmp2[2]);
    		tmp1.put("proyecto_codemp",tmp2[3]);
    		tmp1.put("proyecto_llacom",tmp2[4]);
    		tmp1.put("proyecto_ideregistro",tmp2[5]);
    		tmp1.put("departamento_ideregistro",tmp2[6]);
    		tmp1.put("cue_ideregistro",tmp2[7]);
    		tmp1.put("proyecto_formato",tmp2[8]);
    		//tmp1.put("docuBase64",util.buscarArchivo(repository2.buscarCodigo("RUTADOC", "AC").getCfgValorPrincipal()+"/"+tmp2[2]));
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> listaProyectosDepart(Integer departamento , Integer empresa)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaProyectosDepart(departamento,empresa))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("proyecto_cod", tmp2[0]);
    		tmp1.put("proyecto_nom", tmp2[1]);
    		tmp1.put("proyecto_codciu",tmp2[2]);
    		tmp1.put("proyecto_codemp",tmp2[3]);
    		tmp1.put("proyecto_llacom",tmp2[4]);
    		tmp1.put("proyecto_ideregistro",tmp2[5]);
    		tmp1.put("departamento_ideregistro",tmp2[6]);
    		tmp1.put("cue_ideregistro",tmp2[7]);
    		tmp1.put("proyecto_formato",tmp2[8]);
    		//tmp1.put("docuBase64",util.buscarArchivo(repository2.buscarCodigo("RUTADOC", "AC").getCfgValorPrincipal()+"/"+tmp2[2]));
    		total.add(tmp1);
    	}
    	return total;
	}

	@Override
	protected JpaRepository<Proyectos, Long> getRepository() {
		// TODO Auto-generated method stub
		return this.repository;
	}
	
	public Page<Proyectos> findByCodEmpresa(Integer codEmpresa,Pageable pageable){
		return this.repository.findAll(ProyectosSpecifications.byCodEmpresa(codEmpresa),pageable);
	}


}
