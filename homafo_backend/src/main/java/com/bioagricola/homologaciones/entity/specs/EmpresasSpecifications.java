package com.bioagricola.homologaciones.entity.specs;

import org.springframework.data.jpa.domain.Specification;

import com.bioagricola.common.entity.Empresas;



public class EmpresasSpecifications {

	public static Specification<Empresas> isForLogin() {
		return (root, query, cb) -> {
			return cb.isNotNull(root.get("empresaSevemp"));
		};
	}
}
