package com.bioagricola.homologaciones.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.common.entity.Empresas;
import com.bioagricola.homologaciones.entity.specs.EmpresasSpecifications;
import com.bioagricola.homologaciones.repository.EmpresasRepository;

@Service
public class EmpresasService extends AbstractService<Empresas, Long>
{
	public EmpresasService() {
		// TODO Auto-generated constructor stub
		super(Empresas.class);
	}
	@Autowired
	private EmpresasRepository repository;
	
	public List<HashMap<String, Object>> listaEmpresasAlternas(Integer empresa)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaEmpresasAlternas(empresa))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("empresa_sevemp", tmp2[0]);
    		tmp1.put("empresa_nom",tmp2[1]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> listaEmpresasAlternasHomologables(Integer empresa)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaEmpresasAlternasHomologables(empresa))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("empresa_sevemp", tmp2[0]);
    		tmp1.put("empresa_nom",tmp2[1]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> listaConvenios(Integer empresa)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaConvenios(empresa))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("cnre_ideregistr", tmp2[0]);
    		tmp1.put("cnre_nombre",tmp2[1]);
    		tmp1.put("dicn_empfactura",tmp2[2]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> listaConveniosHomologables(Integer empresa,Integer empresaAlterna)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaConveniosHomologables(empresa,empresaAlterna))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("cnre_ideregistr", tmp2[0]);
    		tmp1.put("cnre_nombre",tmp2[1]);
    		tmp1.put("dicn_empfactura",tmp2[2]);
    		total.add(tmp1);
    	}
    	return total;
	}

	@Override
	protected JpaRepository<Empresas, Long> getRepository() {
		// TODO Auto-generated method stub
		return this.repository;
	}
	
	public Page<Empresas> getEmpresasForLogin(Pageable pageable){
		return this.repository.findAll(EmpresasSpecifications.isForLogin(), pageable);
	}
	
	public Optional<Empresas> getEmpresaByEmpresaSevemp(Long idEmpresa) {
		Optional<Empresas> empresas= this.repository.findByEmpresaSevemp(idEmpresa);
		return empresas;
	}
	
	public List<HashMap<String, Object>> listaTablasBaseDatos()
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.tablasBaseDatos())
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("esquema", tmp2[0]);
    		tmp1.put("nombreTabla",tmp2[1]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> listaConveniosHomologablesDsus(Integer empresa,Integer suscripcion)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaConveniosHomologablesDsus(empresa,suscripcion))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("cnre_ideregistr", tmp2[0]);
    		tmp1.put("cnre_nombre",tmp2[1]);
    		tmp1.put("dicn_empfactura",tmp2[2]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> listaConveniosDesHomologables(Integer empresa)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaConveniosDesHomologables(empresa))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("cnre_ideregistr", tmp2[0]);
    		tmp1.put("cnre_nombre",tmp2[1]);
    		tmp1.put("dicn_empfactura",tmp2[2]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<Integer> listaempresasSuscripcion(Integer suscripcion)
	{
		
		List<Integer> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaEmpresasSuscripcion(suscripcion))
    	{
    		//total.add(((BigInteger) tmp2[0]).intValue());
    		total.add((Integer) tmp2[0]);
    	}
    	return total;
	}

}
