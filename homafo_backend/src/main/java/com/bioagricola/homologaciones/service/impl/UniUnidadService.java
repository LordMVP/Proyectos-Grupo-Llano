package com.bioagricola.homologaciones.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.common.repository.UniUnidadRepository;
import com.bioagricola.homologaciones.controller.generic.EntityNotFoundException;
import com.bioagricola.homologaciones.entity.specs.UniUnidadSpecifications;


@Service
public class UniUnidadService extends AbstractService<UniUnidad, Long>
{
	public UniUnidadService() {
		super(UniUnidad.class);
		// TODO Auto-generated constructor stub
	}

	@Autowired
	private UniUnidadRepository uniUnidadRepository;
	
	
	
	
	public UniUnidad findByIdOrNull(Long id) {
		return this.findByIdOptional(id).orElseThrow(()->new EntityNotFoundException(UniUnidad.class, "ID "));
	}
	
	public UniUnidad getOne(Long id){
		return this.uniUnidadRepository.getOne(id);
	}
	
	public List<UniUnidad> getByClaseAndEmpresa(Long clase,Long empresa){
		return this.uniUnidadRepository.findAll(UniUnidadSpecifications.byClaseAndEmpresa(clase, empresa),Sort.by(Sort.Direction.ASC,"uniNombre1"));
	}
	public Page<UniUnidad> getByClaseAndEmpresa(Long clase,Long empresa,Pageable pageable){
		return this.uniUnidadRepository.findAll(UniUnidadSpecifications.byClaseAndEmpresa(clase, empresa),pageable);
	}
	public Page<UniUnidad> getByClaseAndEmpresa(Long clase,Long empresa,Pageable pageable,Optional<String> search){	
		
		Specification<UniUnidad> e = Specification.where(UniUnidadSpecifications.byClaseAndEmpresa(clase, empresa).and(UniUnidadSpecifications.byPropiedadJson("estado", "A"))).and(UniUnidadSpecifications.byNombreLike(search.orElse("")).or(UniUnidadSpecifications.byCodigoLike(search.orElse(""))));
		return this.uniUnidadRepository.findAll(e,pageable);
	}

	public Page<UniUnidad> getByClaseAndEmpresa(Long clase,Long empresa,Pageable pageable,Optional<String> search,Optional<String> filter){	
		Specification<UniUnidad> e= null;		
		if(filter.isPresent() && filter.get().split(",").length ==2){
			String[] propiedad  =  filter.get().split(",");
			e = Specification.where(
				UniUnidadSpecifications.byClaseAndEmpresa(clase, empresa)
				.and(UniUnidadSpecifications.byPropiedadJson(propiedad[0],propiedad[1])))
				.and(UniUnidadSpecifications.byNombreLike(search.orElse(""))
				.or(UniUnidadSpecifications.byCodigoLike(search.orElse(""))));	
		}else {
			e = Specification.where(UniUnidadSpecifications.byClaseAndEmpresa(clase, empresa)).and(UniUnidadSpecifications.byNombreLike(search.orElse("")).or(UniUnidadSpecifications.byCodigoLike(search.orElse(""))));
		}
		
		return this.uniUnidadRepository.findAll(e,pageable);
	}
	
	public List<HashMap<String, Object>> informcionUnidad( Integer clase, Integer empresa)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.uniUnidadRepository.informacionUnidad(clase, empresa ))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("uni_ideregistro", tmp2[0]);
    		tmp1.put("uni_nombre1",tmp2[1]);
    		tmp1.put("uni_orden",tmp2[2]);
    		tmp1.put("uni_codigo1",tmp2[3]);
    		tmp1.put("uni_estado",tmp2[4]);
    		tmp1.put("uni_nombre2",tmp2[5]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> informcionUnidadTercero( Integer clase, Integer empresa, Integer tercero)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.uniUnidadRepository.informcionUnidadTercero(clase, empresa, tercero ))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("clte_ideregistr", tmp2[0]);
    		tmp1.put("uni_ideregistro",tmp2[1]);
    		tmp1.put("uni_nombre1",tmp2[2]);
    		tmp1.put("uni_orden",tmp2[3]);
    		tmp1.put("uni_codigo1",tmp2[4]);
    		tmp1.put("ter_ideregistro",tmp2[5]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public Optional<UniUnidad> findByCodigoOrNombre(String codigo,String nombre){		
		return this.uniUnidadRepository.findFirstByUniCodigoOrUniNombre1IgnoreCase(codigo, nombre);
		}
	

	@Override
	protected JpaRepository<UniUnidad, Long> getRepository() {
		// TODO Auto-generated method stub
		return uniUnidadRepository;
	}
	
	public List<HashMap<String, Object>> informcionUnidadUspu( Integer idempresasesion, Integer idusuariosesion , Integer idprograma, Integer param_clase_estados)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.uniUnidadRepository.unidadesUspuClase(idempresasesion, idusuariosesion, idprograma, param_clase_estados ))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("uni_ideregistro", tmp2[0]);
    		tmp1.put("uni_nombre1",tmp2[1]);
    		tmp1.put("uni_orden",tmp2[2]);
    		tmp1.put("uni_codigo1",tmp2[3]);
    		tmp1.put("uni_estado",tmp2[4]);
    		total.add(tmp1);
    	}
    	return total;
	}

}
