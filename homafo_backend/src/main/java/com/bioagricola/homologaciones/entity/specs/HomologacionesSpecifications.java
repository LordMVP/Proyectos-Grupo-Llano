package com.bioagricola.homologaciones.entity.specs;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;

import org.springframework.data.jpa.domain.Specification;

import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.homologaciones.entity.GenGenerador;

public class HomologacionesSpecifications {

	
	public static Specification<DsusDetsuscrip> byLikeNombre(String search) {
		return (root, query, cb) -> {		
			
			Join<GenGenerador, UniUnidad> joinUnidad = root.join("unidad",JoinType.INNER);			
			return cb.like(joinUnidad.get("uniNombre1"),search+"%");
		};	
	}
}
