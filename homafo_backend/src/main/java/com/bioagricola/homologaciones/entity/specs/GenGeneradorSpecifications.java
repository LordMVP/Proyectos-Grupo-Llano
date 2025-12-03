package com.bioagricola.homologaciones.entity.specs;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.homologaciones.entity.GenGenerador;

public class GenGeneradorSpecifications {
	public static Specification<GenGenerador> byLikeNombre(String search) {
		return (root, query, cb) -> {		
			Join<GenGenerador, UniUnidad> joinUnidad = root.join("unidad",JoinType.INNER);			
			return cb.like(cb.upper(joinUnidad.get("uniNombre1")),"%"+search.toUpperCase()+"%");
		};	
	}
	
	public static Specification<GenGenerador> byClaseAforo(Long claseAforo) {
		return (root, query, cb) -> {		
			Join<GenGenerador, UniUnidad> joinUnidad = root.join("uniClaseAforo",JoinType.INNER);			
			return cb.equal(joinUnidad.get("uniIderegistro"),claseAforo);
		};	
	}

	public static Specification<GenGenerador> byLikeCodigo(String search) {
		return (root, query, cb) -> {		
			Join<GenGenerador, UniUnidad> joinUnidad = root.join("unidad",JoinType.INNER);			
			return cb.like(cb.upper(joinUnidad.get("uniCodigo")),"%"+search.toUpperCase()+"%");
		};	
	}
	
	public static Specification<GenGenerador> byVolumenGenerado(Double volumen) {
		return (root, query, cb) -> {		
			//cb.between(cb.literal(volumen),root.get("genDesde"), root.get("genHasta"));
			//Join<GenGenerador, UniUnidad> joinUnidad = root.join("unidad",JoinType.INNER);	
			////cb.like(cb.upper(joinUnidad.get("uniCodigo")),"%"+search.toUpperCase()+"%");
			return cb.between(cb.literal(volumen),root.get("genDesde"), root.get("genHasta"));
		};	
	}
	
	public static Specification<GenGenerador> byPropiedadJson(String key,String value) {
		return (root, query, cb) -> {		
			Join<GenGenerador, UniUnidad> joinUnidad = root.join("unidad",JoinType.INNER);		
			Predicate inJsonNames = cb.function("jsonb_extract_path_text",String.class,joinUnidad.get("uniPropiedad"),cb.literal(key)).in(value);	
			return cb.and(inJsonNames);
		};	
	}
	
}
