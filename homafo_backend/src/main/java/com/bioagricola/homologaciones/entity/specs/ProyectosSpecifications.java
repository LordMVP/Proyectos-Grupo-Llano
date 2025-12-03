package com.bioagricola.homologaciones.entity.specs;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;

import org.springframework.data.jpa.domain.Specification;

import com.bioagricola.common.entity.Empresas;
import com.bioagricola.common.entity.Proyectos;


public class ProyectosSpecifications {
	public static Specification<Proyectos> byCodEmpresa(Integer empresa) {
		return (root, query, cb) -> {			
			Join<Proyectos,Empresas> joinEmpresa = root.join("proyectoCodemp",JoinType.INNER);			
			return cb.equal(joinEmpresa.get("empresaSevemp"),empresa);
		};
	}
}
