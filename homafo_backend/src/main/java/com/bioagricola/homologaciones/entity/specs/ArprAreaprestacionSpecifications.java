package com.bioagricola.homologaciones.entity.specs;

import org.springframework.data.jpa.domain.Specification;

import com.bioagricola.homologaciones.entity.ArprAreaprestacion;



public class ArprAreaprestacionSpecifications {

	public static Specification<ArprAreaprestacion> byEmpresa(Integer empIderegistro) {
		return (root, query, cb) -> {			
			return cb.equal(root.get("empIderegistro"),empIderegistro);
		};	
	}
}
