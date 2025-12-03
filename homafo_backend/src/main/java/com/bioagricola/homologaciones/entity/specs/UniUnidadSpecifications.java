package com.bioagricola.homologaciones.entity.specs;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import com.bioagricola.common.entity.EsemEstempresa;
import com.bioagricola.common.entity.EstEstructura;
import com.bioagricola.common.entity.UniUnidad;

public class UniUnidadSpecifications {

	public static Specification<UniUnidad> byClaseAndEmpresa(Long clase,Long empresa) {
		return (root, query, cb) -> {			
			Join<UniUnidad, EstEstructura> joinEstructura = root.join("estIderegistro",JoinType.INNER);
			Join<EstEstructura,EsemEstempresa> joinEsemempresa = joinEstructura.join("empresas",JoinType.INNER);			
			List<Predicate> conditions = new ArrayList<>();
			conditions.add(cb.equal(joinEstructura.get("claIderegistro"), clase));
			conditions.add(cb.equal(joinEsemempresa.get("empIderegistro"),empresa));			
			return cb.and(conditions.toArray(new Predicate[conditions.size()]));			
		};
	}
	public static Specification<UniUnidad> byNombreLike(String search) {
		return (root, query, cb) -> {			
			return cb.like(cb.upper(root.get("uniNombre1")),"%"+search.toUpperCase()+"%");
		};	
	}
	public static Specification<UniUnidad> byCodigoLike(String search) {
		return (root, query, cb) -> {			
			return cb.like(cb.upper(root.get("uniCodigo")),"%"+search.toUpperCase()+"%");
		};	
	}
	public static Specification<UniUnidad> byPropiedadJson(String key,String value) {
		return (root, query, cb) -> {	
			Predicate inJsonNames = cb.function("jsonb_extract_path_text",String.class,root.get("uniPropiedad"),cb.literal(key)).in(value);
			return cb.and(inJsonNames);
		};	
	}
	
}
