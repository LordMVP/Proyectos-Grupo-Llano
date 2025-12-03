package com.bioagricola.homologaciones.entity.specs;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;

import org.springframework.data.jpa.domain.Specification;

import com.bioagricola.common.entity.RutRuta;
import com.bioagricola.common.entity.UniUnidad;

public class RutRutaSpecifications {

	public static Specification<RutRuta> byTipoRuta(Integer uniTiporuta) {
		return (root, query, cb) -> {			
			return cb.equal(root.get("uniTiporuta"),uniTiporuta);
		};	
	}
	public static Specification<RutRuta> byLikeNombre(String search) {
		return (root, query, cb) -> {			
			return cb.like(cb.upper(root.get("rutNombre")),"%"+search.toUpperCase()+"%");
		};	
	}
	public static Specification<RutRuta> byLikeCodigo(String search) {
		return (root, query, cb) -> {		
			Join<RutRuta, UniUnidad> joinUnidad = root.join("uniTiporuta",JoinType.INNER);			
			return cb.like(cb.upper(joinUnidad.get("uniCodigo")),"%"+search.toUpperCase()+"%");
		};	
	}
}