package com.bioagricola.homologaciones.entity.specs;

import org.springframework.data.jpa.domain.Specification;

import com.bioagricola.common.entity.SecSector;

public class SecSectorSpecifications {

	public static Specification<SecSector> byEmpresa(Integer empresa) {
		return (root, query, cb) -> {			
			return cb.equal(root.get("empIderegistro"), empresa);
		};	
	}
	
	public static Specification<SecSector> byEmpresaAndEstado (Integer empresa,String estado){
		return (root,query,cb)->{
			return cb.and(cb.equal(root.get("empIderegistro"), empresa),
				   cb.equal(root.get("secEstado"), estado));			
		};
	}
}
