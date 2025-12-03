package com.bioagricola.homologaciones.entity.specs;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.homologaciones.entity.TafoTipoAforo;

public class TafoTipoAforoSpecifications {
	public static Specification<TafoTipoAforo> byLikeNombre(String search) {
		return (root, query, cb) -> {		
			Join<TafoTipoAforo, UniUnidad> joinUnidad = root.join("unidad",JoinType.INNER);			
			return cb.like(cb.upper(joinUnidad.get("uniNombre1")),"%"+search.toUpperCase()+"%");
		};	
	}

	public static Specification<TafoTipoAforo> byLikeCodigo(String search) {
		return (root, query, cb) -> {		
			Join<TafoTipoAforo, UniUnidad> joinUnidad = root.join("unidad",JoinType.INNER);			
			return cb.like(cb.upper(joinUnidad.get("uniCodigo")),"%"+search.toUpperCase()+"%");
		};	
	}

	public static Specification<TafoTipoAforo> byPropiedadJson(String key,String value) {
		return (root, query, cb) -> {		
			Join<TafoTipoAforo, UniUnidad> joinUnidad = root.join("unidad",JoinType.INNER);				
			Predicate inJsonNames = cb.function("jsonb_extract_path_text",String.class,joinUnidad.get("uniPropiedad"),cb.literal(key)).in(value);	
			return cb.and(inJsonNames);
		};	
	}
}
