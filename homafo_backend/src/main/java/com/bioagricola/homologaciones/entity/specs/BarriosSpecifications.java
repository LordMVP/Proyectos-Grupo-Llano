package com.bioagricola.homologaciones.entity.specs;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;

import org.springframework.data.jpa.domain.Specification;

import com.bioagricola.common.entity.Barrios;
import com.bioagricola.common.entity.Empresas;

public class BarriosSpecifications {

	public static Specification<Barrios> isCodpro(String codpro) {
		return (root, query, cb) -> {
			return cb.equal(root.get("barrioCodpro"),codpro);
		};
	}
	
	public static Specification<Barrios> byCodEmpresa(Integer empresa){
		return (root, query, cb) -> {			
			Join<Barrios,Empresas> joinEmpresa = root.join("barrioCodemp",JoinType.INNER);
			return cb.equal(joinEmpresa.get("empresaSevemp"),empresa);
		};		
	}
	
	public static Specification<Barrios> byLikeNombre(String nombre){
		return (root, query, cb) -> {
			return cb.like(cb.upper(root.get("barrioNom")), nombre.toUpperCase()+"%");			
		};
	}

}
