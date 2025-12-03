package com.bioagricola.homologaciones.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.common.dto.BarrioInfoDTO;
import com.bioagricola.common.entity.Barrios;
import com.bioagricola.homologaciones.entity.specs.BarriosSpecifications;
import com.bioagricola.homologaciones.repository.BarriosRepository;

@Service
public class BarriosService extends AbstractService<Barrios,Long>
{

	public BarriosService() {
		super(Barrios.class);
		// TODO Auto-generated constructor stub
	}

	@Autowired
	private BarriosRepository barriosRepository;
	
	public  List<Barrios> getByCodpro(String codpro){
		//this.barriosRepository.findAll(BarriosSpecifications.isCodpro(codpro),Sort.by(Sort.Direction.ASC,"barrioNom"));
		return this.barriosRepository.findAll(BarriosSpecifications.isCodpro(codpro),Sort.by(Sort.Direction.ASC,"barrioNom"));
	}
	public List<HashMap<String, Object>> listaBarrios(String codigo)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.barriosRepository.listaBarrios(codigo))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("barrio_nom", tmp2[0]);
    		tmp1.put("barrio_ideregistro",tmp2[1]);
    		tmp1.put("sec_sector",tmp2[2]);
    		tmp1.put("sec_ideregistro",tmp2[3]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> listaBarrioCodemp(String codigo,String codemp)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.barriosRepository.listaBarrioCodemp(codigo,codemp))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("barrio_nom", tmp2[0]);
    		tmp1.put("barrio_ideregistro",tmp2[1]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> listaBarrios2(String codigo)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.barriosRepository.listaBarrios(codigo))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("barrio_cod", tmp2[0]);
    		tmp1.put("barrio_nom", tmp2[1]);
    		tmp1.put("barrio_codpro",tmp2[2]);
    		tmp1.put("barrio_codemp",tmp2[3]);
    		tmp1.put("barrio_swtter",tmp2[4]);
    		tmp1.put("barrio_llacom",tmp2[5]);
    		tmp1.put("barrio_ideregistro",tmp2[6]);
    		tmp1.put("barrio_factor",tmp2[7]);
    		tmp1.put("barrio_porins",tmp2[8]);
    		tmp1.put("barrio_frerec",tmp2[9]);
    		tmp1.put("barrio_horrec",tmp2[10]);
    		tmp1.put("barrio_sectec",tmp2[11]);
    		//tmp1.put("docuBase64",util.buscarArchivo(repository2.buscarCodigo("RUTADOC", "AC").getCfgValorPrincipal()+"/"+tmp2[2]));
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> complementoPropiedad(Integer municipio , Integer barrio)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.barriosRepository.complementoPropiedad(municipio, barrio))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("mbcd_ideregistr", tmp2[0]);
    		tmp1.put("uni_nombre1",tmp2[1]);
    		total.add(tmp1);
    	}
    	return total;
	}
	@Override
	protected JpaRepository<Barrios, Long> getRepository() {
		// TODO Auto-generated method stub
		return this.barriosRepository;
	}
	public Page<Barrios> findByEmpresa(Integer empresa, Pageable pageable) {
		// TODO Auto-generated method stub		
		return this.barriosRepository.findAll(BarriosSpecifications.byCodEmpresa(empresa), pageable);
	}
	
	public Page<Barrios> findByEmpresaAnLikeNombre(Integer empresa,String nombre, Pageable pageable) {
		// TODO Auto-generated method stub	
		
		return this.barriosRepository.findAll(Specification.where(BarriosSpecifications.byCodEmpresa(empresa)).and(BarriosSpecifications.byLikeNombre(nombre)), pageable);
	}

	public List<BarrioInfoDTO> findBarriosByMicroRuta(Integer ruta){
		return this.barriosRepository.findBarriosByMicroRuta(ruta+"");
	}
	
	
	
	
	
}
