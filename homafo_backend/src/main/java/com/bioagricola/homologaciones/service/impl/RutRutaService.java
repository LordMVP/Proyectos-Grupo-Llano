package com.bioagricola.homologaciones.service.impl;

import com.bioagricola.aforos.entity.dto.StaticContentResponseDTO;
import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.entity.RutRuta;
import com.bioagricola.common.repository.RutRutaRepository;
import com.bioagricola.common.util.ConvertGeneral;
import com.bioagricola.homologaciones.entity.specs.RutRutaSpecifications;

import org.apache.log4j.xml.Log4jEntityResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;


@Service
public class RutRutaService extends AbstractService<RutRuta,Long>
{
	@Autowired
	AuthenticationFacade authenticationFacade;
	public RutRutaService() {
		super(RutRuta.class);
		// TODO Auto-generated constructor stub
	}

	@Autowired
	private RutRutaRepository repository;
	
	Logger logger=LoggerFactory.getLogger(RutRutaService.class);
	
	public List<HashMap<String, Object>> listaRutas(Integer rutRuta)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaRutas(rutRuta))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("rut_ideregistro", tmp2[0]);
    		tmp1.put("rut_nombre", tmp2[1]);
    		tmp1.put("rut_tipo",tmp2[2]);
    		tmp1.put("cic_ideregistro",tmp2[3]);
    		tmp1.put("usu_ideregistro",tmp2[4]);
    		tmp1.put("uni_tiporuta",tmp2[5]);
    		//tmp1.put("docuBase64",util.buscarArchivo(repository2.buscarCodigo("RUTADOC", "AC").getCfgValorPrincipal()+"/"+tmp2[2]));
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> listaMacroRutas(Integer empresa,Integer uni_barrio)
	{
		ConvertGeneral convert=new ConvertGeneral();
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaMacroRutas(empresa,uni_barrio))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("rure_ideregistro", tmp2[0]);
    		tmp1.put("rut_nombre", tmp2[1]);
    		tmp1.put("rut_ideregistro",tmp2[2]);
    		tmp1.put("rut_idemacruta",tmp2[3]);
    		tmp1.put("rut_microruta",convert.convertStringToArray(tmp2[4]));
    		tmp1.put("frecuencias",listaFrecuencias(((Integer) tmp2[0]).intValue()));
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> listaFrecuencias(Integer rure)
	{
		ConvertGeneral convert=new ConvertGeneral();
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaFrecuenciasRutas(rure))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("dia", tmp2[0]);
    		tmp1.put("horaInicio", tmp2[1]);
    		tmp1.put("horaFin",tmp2[2]);
			tmp1.put("microrutaFrecuencia",tmp2[3]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> listaFrecuenciasTMP()
	{
		ConvertGeneral convert=new ConvertGeneral();
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaFrecuenciasRutasTMP())
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("dia", tmp2[0]);
    		tmp1.put("horaInicio", tmp2[1]);
    		tmp1.put("horaFin",tmp2[2]);
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> listaRutasTipo(Integer tipo)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaRutasTipo(tipo))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("rut_ideregistro", tmp2[0]);
    		tmp1.put("rut_nombre", tmp2[1]);
    		tmp1.put("rut_tipo",tmp2[2]);
    		tmp1.put("cic_ideregistro",tmp2[3]);
    		tmp1.put("usu_ideregistro",tmp2[4]);
    		tmp1.put("uni_tiporuta",tmp2[5]);
    		//tmp1.put("docuBase64",util.buscarArchivo(repository2.buscarCodigo("RUTADOC", "AC").getCfgValorPrincipal()+"/"+tmp2[2]));
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public HashMap<String, Object> rutasAprovechamiento(Integer dsus)
	{
		
		HashMap<String, Object> total=new HashMap<String, Object>();
    	for(Object[] tmp2: this.repository.rutAprovechamiento(dsus))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("rutapr_ideregistro", tmp2[0]);
    		tmp1.put("rut_ideregistro", tmp2[1]);
    		tmp1.put("dsus_ideregistro",tmp2[2]);
    		tmp1.put("ter_aprovechamiento",tmp2[3]);
    		tmp1.put("rutapr_incentivo",tmp2[4]);
    		tmp1.put("rutapr_aforado",tmp2[5]);
    		tmp1.put("date_created",tmp2[6]);
    		tmp1.put("rutapr_observacion",tmp2[7]);
    		total=tmp1;
    	}
    	return total;
	}
	
	public String  buscarMacroRutas(Integer ruta)
	{
		return repository.buscarMacroRuta(ruta);
	}
	
	public Page<RutRuta> getByTipoRuta(Integer uniTiporuta,Pageable pageable){		
		return this.repository.findAll(RutRutaSpecifications.byTipoRuta(uniTiporuta), pageable);
	}
	
	public Page<RutRuta> getByTipoRutaAndLikeName(Integer uniTiporuta,Pageable pageable,Optional<String> search){
		Specification<RutRuta> sped = Specification.where(RutRutaSpecifications.byLikeNombre(search.orElse("")) // Se agrega la busqueda por nombre
										.or(RutRutaSpecifications.byLikeCodigo(search.orElse(""))) // Se agrega la busqueda por codigo
										.and(RutRutaSpecifications.byTipoRuta(uniTiporuta))); // Se agrega la busqueda por tipo de ruta
		return this.repository.findAll(sped, pageable);
	}

	@Override
	protected JpaRepository<RutRuta, Long> getRepository() {
		// TODO Auto-generated method stub
		return this.repository;
	} 

	public List<StaticContentResponseDTO<String>> getRutasAforos(){
		List<StaticContentResponseDTO<String>> response = new ArrayList<>();
		List<RutRuta> rutas = repository.getRutasAforos(this.authenticationFacade.getCredentials().getEstempresa());
		
		rutas.stream().forEach(i->{
			StaticContentResponseDTO<String> item = new StaticContentResponseDTO<>();
											 item.setObject(i.getRutNombre());
											 item.setId(i.getRutIderegistro());
			response.add(item);
		});
		return response;
	}
	
	public List<HashMap<String, Object>> listaRutasBarrioTipo(Integer tipo,Integer barrio)
	{
		
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.listaRutasBarrioTipo(tipo,barrio))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("rut_ideregistro", tmp2[0]);
    		tmp1.put("rut_nombre", tmp2[1]);
    		tmp1.put("rut_tipo",tmp2[2]);
    		tmp1.put("cic_ideregistro",tmp2[3]);
    		tmp1.put("usu_ideregistro",tmp2[4]);
    		tmp1.put("uni_tiporuta",tmp2[5]);
    		//tmp1.put("docuBase64",util.buscarArchivo(repository2.buscarCodigo("RUTADOC", "AC").getCfgValorPrincipal()+"/"+tmp2[2]));
    		//tmp1.put("frecuencias",listaFrecuencias(((Integer) tmp2[6]).intValue()));
    		tmp1.put("frecuencias",listaFrecuenciasTMP());
    		total.add(tmp1);
    	}
    	return total;
	}

}
