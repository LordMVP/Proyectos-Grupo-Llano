package com.bioagricola.aforos.service.impl;

import java.lang.reflect.Field;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.Tuple;

import org.apache.logging.log4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.bioagricola.aforos.entity.Aforo;
import com.bioagricola.aforos.entity.HafoAforos;
import com.bioagricola.aforos.entity.dto.Aforox2DTO;
import com.bioagricola.aforos.entity.dto.LiquidacionDTO;
import com.bioagricola.aforos.entity.dto.SearchDTO;

@Component
public class SearchComponentServiceImpl {

	@PersistenceContext
	private EntityManager em;
	org.slf4j.Logger log=LoggerFactory.getLogger(this.getClass());
	
	@SuppressWarnings("unchecked")
	public List<Aforo> getAforosBusqueda(SearchDTO s, String claseSuscripcion) {
			String consulta="select distinct afo.*,dsus_pcodigo from aseo.afo_aforos afo \r\n" + 
					"inner join aseo.dafo_detaforo dafo on dafo.afo_ideregistro=afo.afo_ideregistro\r\n" + 
					"inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr = dafo.dsus_ideregistr\r\n" + 
					"inner join ter_tercero ter on ter.ter_ideregistro = dsus.ter_ideregistro\r\n" + 
					"left join rusu_rutsuscrip rusu on rusu.dsus_ideregistr = dsus.dsus_ideregistr\r\n" + 
					"left  join rut_ruta rut on rut.rut_ideregistro = rusu.rut_ideregistro\r\n" + 
					"inner join pro_propiedad pro on pro.pro_ideregistro = dsus.pro_ideregistro\r\n" + 
					"inner join proyectos municipio on municipio.proyecto_ideregistro = dsus.uni_municipio\r\n" + 
					"left join muba_munbarrio muba on muba.uni_municipio=municipio.proyecto_ideregistro \r\n" + 
					"inner join barrios ba on ba.barrio_ideregistro=dsus.uni_barrio\r\n" +
					"inner join cic_ciclo cic on cic.cic_ideregistro=dsus.cic_ideregistro\r\n" +
					"inner join uni_unidad uni on uni.uni_ideregistro=dsus.uni_tipusosuscr\r\n" +
					"left join aseo.iasus_inforadicionalsuscripcion ia on ia.dsus_ideregistr = dsus.dsus_ideregistr ";				
			
			if(isNotEmptyPro(s)) {
				/*
				 * JLMENDOZA
				 * */				
				Query q=em.createNativeQuery(consulta+this.getFiltros(s,claseSuscripcion),Aforo.class);
				//System.err.println("que sale de consulta "+consulta+this.getFiltros(s,claseSuscripcion));
				List<Aforo> aforos = q.getResultList();//Se podría retornar de inmediato pero generaría una excepción de casteo.				
				return aforos;
			}else {
				System.out.println("---- NO consultando");
				return new ArrayList<>();
			}
	}
	
	//[JLMENDOZA]
	@SuppressWarnings("unchecked")
	public List<Aforo> getAforosBusquedaMultiusuario(SearchDTO s, String claseSuscripcion) {
			String consulta="SELECT af.*,cantidad.conteo as cantidad,aa.afom_distribucion_nombre  FROM aseo.afom_afomultiusuario aa \r\n"
					+ "inner join aseo.afo_aforos af on af.afo_ideregistro = aa.afo_ideregistro \r\n"
					+ "inner join lateral (select count(da.dsus_ideregistr) conteo from aseo.dafo_detaforo da \r\n"
					+ "							where da.afo_ideregistro = aa.afo_ideregistro ) cantidad on true\r\n"
					+ "WHERE aa.afo_ideregistro = %s";		
			
			if(!isEmpty(s)) {	
				Query q=em.createNativeQuery(String.format(consulta,s.getNumAforo()),Aforo.class);
				List<Aforo> aforos = q.getResultList();//Se podría retornar de inmediato pero generaría una excepción de casteo.				
				return aforos;
			}else {
				System.out.println("---- NO consultando");
				return new ArrayList<>();
			}
	}
	@SuppressWarnings("unchecked")
	public List<Tuple> getInfoAdicionalMultiusuario(Long idMultiusuario,String claseSuscripcion){
		String consulta="select (select count(dd.afo_ideregistro) from aseo.dafo_detaforo dd where dd.afo_ideregistro = aa.afo_ideregistro) as cantidad "
						+ ",uu.uni_nombre1 as nombreMultiusuario,uu.uni_ideregistro as complemento from aseo.afo_aforos aa  "
						+ "inner join aseo.afom_afomultiusuario af on af.afo_ideregistro = aa.afo_ideregistro  "
						+ "inner join (select uu.uni_ideregistro from public.uni_unidad uu where uu.uni_ideregistro = %d ) multi on  "
						+ "multi.uni_ideregistro = aa.uni_clasesuscripcionaforo  "
						+ "inner join public.mbcd_munbardirec mb on mb.mbcd_ideregistr = af.afom_complemento  "
						+ "inner join public.uni_unidad uu on uu.uni_ideregistro = mb.uni_ideregistro  "
						+ "where aa.afo_ideregistro = %d ";
		if(!Objects.isNull(idMultiusuario)) {				
			Query q=em.createNativeQuery(String.format(consulta,Integer.parseInt(claseSuscripcion),idMultiusuario),Tuple.class);
			List<Tuple> tuplas=q.getResultList();
			return tuplas;
		}else {
			System.out.println("---- NO consultando");
			return new ArrayList<>();
		}
						
	}
	
	/*
	 * Busqueda de historicos aforos
	 */
	@SuppressWarnings("unchecked")
	public List<HafoAforos> getHAforosBusqueda(SearchDTO s) {
		
		StringBuilder consulta = new StringBuilder();
		consulta.append("select distinct hafo.* from aseo.hafo_aforos hafo \n")
		        .append("inner join aseo.hdafo_detaforo hdafo on hdafo.hafo_ideregistro = hafo.hafo_ideregistro \n")
		        .append("inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr = hdafo.dsus_ideregistr \n")
		        .append("inner join ter_tercero ter on ter.ter_ideregistro = dsus.ter_ideregistro \n")
		        .append("left join rusu_rutsuscrip rusu on rusu.dsus_ideregistr = dsus.dsus_ideregistr \n")
		        .append("left join rut_ruta rut on rut.rut_ideregistro = rusu.rut_ideregistro \n")
		        .append("inner join pro_propiedad pro on pro.pro_ideregistro = dsus.pro_ideregistro \n")
		        .append("inner join proyectos municipio on municipio.proyecto_ideregistro = pro.uni_municipio \n")
		        .append("inner join muba_munbarrio muba on muba.uni_municipio = municipio.proyecto_ideregistro \n")
		        .append("inner join barrios ba on ba.barrio_ideregistro = muba.uni_barrio \n")
		        .append("inner join cic_ciclo cic on cic.cic_ideregistro = dsus.cic_ideregistro \n")
		        .append("inner join uni_unidad uni on uni.uni_ideregistro = dsus.uni_tipusosuscr \n")
		        .append("where 1=1 \n");
		
				if (isNotEmptyPro(s)) {
		
				Map<Function<SearchDTO, String>, String> filtros = new LinkedHashMap<>();

				filtros.put(SearchDTO::getNumAforo, " and hafo.hafo_ideregistro = '%s'");
				filtros.put(SearchDTO::getIdTipoAforo, " and hafo.uni_tipoaforo = %d");
				filtros.put(SearchDTO::getSuscripcion, " and dsus.dsus_ideregistr = '%s'");
				filtros.put(SearchDTO::getCodigoSub, " and dsus.dsus_pcodigo = '%s'");
				filtros.put(SearchDTO::getNombres_apellidotercer, " and ter.ter_nomcompleto ilike '%s'");
				filtros.put(SearchDTO::getDocumento_tercer, " and ter.ter_documento like '%s'");
				filtros.put(SearchDTO::getMunicipio, " and municipio.proyecto_nom = %d");
				//filtros.put(s -> s.getUbicacion() != null && !s.getUbicacion().isEmpty() ? s.getUbicacion().substring(0, 1) : null, " and pro.pro_zona = '%s'");
				filtros.put(SearchDTO::getEstrato, " and dsus.pro_catestrato = %d");
				filtros.put(SearchDTO::getBarrio, " and ba.barrio_nom = '%s'");
				filtros.put(SearchDTO::getDireccion, " and pro.pro_direccion like '%s'");
				filtros.put(SearchDTO::getNumCatastral, " and pro.pro_numcatastral like '%s'");
				filtros.put(SearchDTO::getTipo_Uso, " and uni.uni_nombre1 like '%s'");
				filtros.put(SearchDTO::getCiclo, " and cic.cic_ideregistro = %d ");
				filtros.put(SearchDTO::getRuta, " and rut.rut_ideregistro = %d");
				filtros.put(SearchDTO::getCatastral, " and pro.pro_numcatastralnacional like '%s'");
				filtros.put(SearchDTO::getEstado, " and hafo.hafo_estado = '%s'");
								
				filtros.forEach((getter, template) -> {
			        String value = getter.apply(s);
			        if (value != null && !value.trim().isEmpty()) {
			            consulta.append(String.format(template, value));
			        }
			    });
				consulta.append(" order by hafo.hafo_ideregistro desc");
				Query q=em.createNativeQuery(consulta.toString(),HafoAforos.class);
				List<HafoAforos> haforos = q.getResultList();				
				return haforos;
			}else {
				return new ArrayList<>();
			}
	}
	
	
	
	@SuppressWarnings("unchecked")
	public Aforo searchAforoLiquidacion(LiquidacionDTO dto){
		String consulta="select distinct  a.* from aseo.afo_aforos a\r\n" + 
				"inner join aseo.dafo_detaforo da on da.afo_ideregistro=a.afo_ideregistro " +
				" where 1=1 ";
				
		
		if(!isEmptyLiquidacionDTO(dto)) {
			System.err.println("que llego consulta "+consulta+this.getFiltrosLiquidacion(dto));
			Query q=em.createNativeQuery(consulta+this.getFiltrosLiquidacion(dto),Aforo.class);
			List<Aforo> aforos = q.getResultList();//Se podría retornar de inmediato pero generaría una excepción de casteo.
			Aforo response = new Aforo();
			if(!aforos.isEmpty()) {
				response=aforos.get(0);
			}
			return response;
		}else {
			return new Aforo();
		}
	}
	
	private String getFiltrosLiquidacion(LiquidacionDTO dto) {
		StringBuilder f= new StringBuilder();
		
		if(!(dto.getIdAforo()==null || dto.getIdAforo()<=0))
			f.append(" and a.afo_ideregistro=".concat(dto.getIdAforo().toString()));
		if(!(dto.getIdMultiusuario()==null || dto.getIdMultiusuario()<=0))
			f.append(" and a.afo_ideregistro=".concat(dto.getIdMultiusuario().toString()));
//		if(!(dto.getIdConcepto()==null || dto.getIdConcepto()<=0))
//			f.append(" and afo.afo_ideregistro=".concat(""));
		if(!(dto.getIdSuscripcion()==null || dto.getIdSuscripcion()<=0))
			f.append(" and da.dsus_ideregistr=".concat(dto.getIdSuscripcion().toString()));
		if(!(dto.getIdTipoAforo()==null || dto.getIdTipoAforo()<=0))
			f.append(" and a.uni_tipoaforo=".concat(dto.getIdTipoAforo().toString()));
		if(!(dto.getIdClaseAforo()==null || dto.getIdClaseAforo()<=0))
			f.append(" and a.uni_clasesuscripcionaforo=".concat(dto.getIdClaseAforo().toString()));
		return f.toString();
	}
	
	private String getFiltros(SearchDTO s, String claseSuscripcion) {
	    StringBuilder sql = new StringBuilder();

	    sql.append("WHERE afo.uni_clasesuscripcionaforo IN (SELECT uni_ideregistro FROM uni_unidad WHERE uni_codigo1 = ")
	       .append(claseSuscripcion).append(") ");

	    Map<String, Function<SearchDTO, String>> filtrosMap = new LinkedHashMap<>();

	    filtrosMap.put("numAforo", dto -> "afo.afo_ideregistro = " + dto.getNumAforo());
	    filtrosMap.put("idTipoAforo", dto -> "afo.uni_tipoaforo = " + dto.getIdTipoAforo());
	    filtrosMap.put("suscripcion", dto -> "dsus.dsus_ideregistr = " + dto.getSuscripcion());
	    filtrosMap.put("codigoSub", dto -> "dsus.dsus_pcodigo LIKE '%" + dto.getCodigoSub() + "%'");
	    filtrosMap.put("nombres_apellidotercer", dto -> "ter.ter_nomcompleto LIKE '%" + dto.getNombres_apellidotercer() + "%'");
	    filtrosMap.put("documento_tercer", dto -> "ter.ter_documento LIKE '%" + dto.getDocumento_tercer() + "%'");
	    filtrosMap.put("municipio", dto -> "municipio.proyecto_nom = '" + dto.getMunicipio() + "'");
	    filtrosMap.put("ubicacion", dto -> "pro.pro_zona = '" + dto.getUbicacion().substring(0, 1) + "'");
	    filtrosMap.put("estrato", dto -> "dsus.pro_catestrato = '" + dto.getEstrato() + "'");
	    filtrosMap.put("barrio", dto -> "ba.barrio_nom = '" + dto.getBarrio() + "'");
	    filtrosMap.put("direccion", dto -> "pro.pro_direccion LIKE '%" + dto.getDireccion() + "%'");
	    filtrosMap.put("numCatastral", dto -> "pro.pro_numcatastral LIKE '%" + dto.getNumCatastral() + "%'");
	    filtrosMap.put("tipo_Uso", dto -> "uni.uni_nombre1 LIKE '%" + dto.getTipo_Uso() + "%'");
	    filtrosMap.put("ciclo", dto -> "cic.cic_ideregistro = '" + dto.getCiclo() + "'");
	    filtrosMap.put("ruta", dto -> "rut.rut_ideregistro = '" + dto.getRuta() + "'");
	    filtrosMap.put("catastral", dto -> "pro.pro_numcatastralnacional LIKE '%" + dto.getCatastral() + "%'");
	    filtrosMap.put("estado", dto -> "afo.afo_estado = '" + dto.getEstado() + "'");
	    filtrosMap.put("fechaInicio", dto -> "afo.afo_fecha between '" + dto.getFechaInicio() + "' and '" + dto.getFechaFin() +"'");
	    filtrosMap.put("stoYSena", dto -> "ia.iasus_nombreestablecimiento ilike '"+ dto.getStoYSena() +"'");

	    List<String> condiciones = filtrosMap.entrySet().stream()
	        .filter(entry -> {
	            String value = getPropertyValue(s, entry.getKey());
	            return StringUtils.hasText(value);
	        })
	        .map(entry -> entry.getValue().apply(s))
	        .collect(Collectors.toList());

	    if (!condiciones.isEmpty()) {
	        sql.append(" AND ").append(String.join(" AND ", condiciones));
	    }

	    sql.append(" ORDER BY afo.afo_ideregistro DESC");

	    return sql.toString();
	}

	private String getPropertyValue(SearchDTO dto, String fieldName) {
	    try {
	        Field field = SearchDTO.class.getDeclaredField(fieldName);
	        field.setAccessible(true);
	        Object value = field.get(dto);
	        return value != null ? value.toString() : null;
	    } catch (NoSuchFieldException | IllegalAccessException e) {
	        return null;
	    }
	}
	
	public boolean isEmpty(SearchDTO s)  {
	    return StringUtils.isEmpty(s.getBarrio()) &&
	    	   StringUtils.isEmpty(s.getCatastral()) &&
	    	   StringUtils.isEmpty(s.getCiclo()) &&
	    	   StringUtils.isEmpty(s.getCodigoSub()) &&
	    	   StringUtils.isEmpty(s.getDireccion()) &&
	    	   StringUtils.isEmpty(s.getDocumento_tercer()) &&
	    	   StringUtils.isEmpty(s.getEstado()) &&
	    	   StringUtils.isEmpty(s.getEstrato()) &&
	    	   StringUtils.isEmpty(s.getMunicipio()) &&
	    	   StringUtils.isEmpty(s.getNombres_apellidotercer()) &&
	    	   StringUtils.isEmpty(s.getNumAforo()) &&
	    	   StringUtils.isEmpty(s.getNumCatastral()) &&
	    	   StringUtils.isEmpty(s.getRadicadoPqrs()) &&
	    	   StringUtils.isEmpty(s.getRuta()) &&
	    	   StringUtils.isEmpty(s.getSuscripcion()) &&
	    	   StringUtils.isEmpty(s.getTipo_Uso()) &&
	    	   StringUtils.isEmpty(s.getUbicacion()) &&
	    	   StringUtils.isEmpty(s.getIdTipoAforo());
	}
	
	public boolean isNotEmptyPro(SearchDTO dto) {
	    if (dto == null) return false;

	    for (Field field : dto.getClass().getDeclaredFields()) {
	        field.setAccessible(true); 
	        try {
	            Object value = field.get(dto);
	            if (value instanceof String && value != null && !((String) value).trim().isEmpty()) {
	                return true; 
	            }
	        } catch (IllegalAccessException e) {
	            e.printStackTrace();
	        }
	    }
	    return false; 
	}
	
	private boolean isEmptyLiquidacionDTO(LiquidacionDTO dto) {
		return (dto.getIdAforo()==null || dto.getIdAforo()<=0) &&
			   (dto.getIdMultiusuario()==null || dto.getIdMultiusuario()<=0) &&
			   (dto.getIdConcepto()==null || dto.getIdConcepto()<=0) &&
			   (dto.getIdSuscripcion()==null || dto.getIdSuscripcion()<=0) &&
			   (dto.getIdTipoAforo()==null || dto.getIdTipoAforo()<=0);
	}
	
	@SuppressWarnings("unchecked")
	public List<Aforo> getAforosBusquedaVisitas(SearchDTO s, String claseSuscripcion) {
			String consulta="select distinct afo.*,dmaf.dmaf_fechavisita from aseo.afo_aforos afo \r\n" + 
					"inner join aseo.dafo_detaforo dafo on dafo.afo_ideregistro=afo.afo_ideregistro\r\n" + 
					"inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr = dafo.dsus_ideregistr\r\n" + 
					"inner join ter_tercero ter on ter.ter_ideregistro = dsus.ter_ideregistro\r\n" + 
					"left join rusu_rutsuscrip rusu on rusu.dsus_ideregistr = dsus.dsus_ideregistr\r\n" + 
					"left  join rut_ruta rut on rut.rut_ideregistro = rusu.rut_ideregistro\r\n" + 
					"inner join pro_propiedad pro on pro.pro_ideregistro = dsus.pro_ideregistro\r\n" + 
					"inner join proyectos municipio on municipio.proyecto_ideregistro = dsus.uni_municipio\r\n" + 
					"left join muba_munbarrio muba on muba.uni_municipio=municipio.proyecto_ideregistro \r\n" + 
					"inner join barrios ba on ba.barrio_ideregistro=dsus.uni_barrio\r\n" +
					"inner join cic_ciclo cic on cic.cic_ideregistro=dsus.cic_ideregistro\r\n" +
					"inner join aseo.mafv_maestroaforovisitas mfv on mfv.afo_ideregistro = afo.afo_ideregistro\r\n" +
					"inner join lateral (select dmaf.dmaf_fechavisita from aseo.dmaf_detallemaestrovisitas dmaf\r\n" +
					"where dmaf.mafv_ideregistro = mfv.mafv_ideregistro order by dmaf.dmaf_fechavisita desc limit 1) as dmaf on true\r\n" +
					"inner join uni_unidad uni on uni.uni_ideregistro=dsus.uni_tipusosuscr\r\n";
					
			
			if(!isEmpty(s)) {
				
				Query q=em.createNativeQuery(consulta+this.getFiltrosVisitas(s,claseSuscripcion),Aforo.class);
				System.err.println("que sale de consulta visitas "+consulta+this.getFiltrosVisitas(s,claseSuscripcion));				
				List<Aforo> aforos = q.getResultList();//Se podría retornar de inmediato pero generaría una excepción de casteo.
				
				Query qq=em.createNativeQuery(consulta+this.getFiltrosVisitas(s,claseSuscripcion),Tuple.class);
				Stream<Tuple>result=qq.getResultStream();
				List<Tuple>listado=result.collect(Collectors.toList());			
				
				aforos.stream().forEach(a->
				a.setAfoFechafinaforo(getFechaUltimaVisita(a.getAfoIderegistro(), listado)));
				
				return aforos;
			}else {
				System.out.println("---- NO consultando");
				return new ArrayList<>();
			}
	}
	
	//JLMENDOZA
	private Date getFechaUltimaVisita(Long afoIderegistro,List<Tuple>listado) {		
		List<Tuple>l=listado.stream().filter(t->
		Long.parseLong(t.get("afo_ideregistro").toString())==afoIderegistro).collect(Collectors.toList());
				//.collect(Collectors.toList());
		
		if(l.size() > 0) {
			log.error("afo:"+afoIderegistro +"  "+l.get(0).get("dmaf_fechavisita"));
			return new Date(((Timestamp)l.get(0).get("dmaf_fechavisita")).getTime());  
		}else {
			return null;
		}		
		
	}
	
	private String getFiltrosVisitas(SearchDTO s,String claseSuscripcion) {
		StringBuilder f= new StringBuilder();
		f.append("where 1=1 ");
		if(!StringUtils.isEmpty(s.getNumAforo()))
			f.append(" and afo.afo_ideregistro=".concat(s.getNumAforo()));
		if(!StringUtils.isEmpty(s.getIdTipoAforo()))
			f.append(" and afo.uni_tipoaforo=".concat(s.getIdTipoAforo()));
		if(!StringUtils.isEmpty(s.getSuscripcion()))
			f.append(" and dsus.dsus_ideregistr=".concat(s.getSuscripcion()));
		if(!StringUtils.isEmpty(s.getCodigoSub()))
			f.append(" and dsus.dsus_pcodigo like '%"+s.getCodigoSub()+"%'");
		if(!StringUtils.isEmpty(s.getNombres_apellidotercer()))
			f.append(" and ter.ter_nomcompleto like '%"+s.getNombres_apellidotercer()+"%'");
		if(!StringUtils.isEmpty(s.getDocumento_tercer()))
			f.append(" and ter.ter_documento like '%"+s.getDocumento_tercer()+"%'");
		if(!StringUtils.isEmpty(s.getMunicipio()))
			f.append(" and municipio.proyecto_nom = '"+s.getMunicipio()+"'");
		if(!StringUtils.isEmpty(s.getUbicacion()) && s.getUbicacion().length()>=1)
			f.append(" and pro.pro_zona = '"+s.getUbicacion().substring(0,1)+"'");
		if(!StringUtils.isEmpty(s.getEstrato()))
			f.append("and dsus.pro_catestrato = '"+s.getEstrato()+"'");
		if(!StringUtils.isEmpty(s.getBarrio()))
			f.append("and ba.barrio_nom='"+s.getBarrio()+"'");
		if(!StringUtils.isEmpty(s.getDireccion()))
			f.append(" and pro.pro_direccion like '%"+s.getDireccion()+"%'");
		if(!StringUtils.isEmpty(s.getNumCatastral()))
			f.append(" and pro.pro_numcatastral like '%"+s.getNumCatastral()+"%'");
		if(!StringUtils.isEmpty(s.getTipo_Uso()))
			f.append(" and uni.uni_nombre1 like '%"+s.getTipo_Uso()+"%'");
		if(!StringUtils.isEmpty(s.getCiclo()))
			f.append(" and cic.cic_ideregistro = '"+s.getCiclo()+"'");
		if(!StringUtils.isEmpty(s.getRuta()))
			f.append("and rut.rut_ideregistro='"+s.getRuta()+"'");
		if(!StringUtils.isEmpty(s.getCatastral()))
			f.append("pro.pro_numcatastralnacional like '%"+s.getCatastral()+"%'");
		if(!StringUtils.isEmpty(s.getEstado()))
			f.append(" and afo.afo_estado='"+s.getEstado()+"'");
		
		return f.toString();
	}
}
