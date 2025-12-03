package com.bioagricola.homologaciones.entity.specs;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import com.bioagricola.common.entity.EsemEstempresa;
import com.bioagricola.common.entity.EstEstructura;


public class EstEstructuraSpecifications {

	
	public static Specification<EstEstructura> byClaseAndEmpresa(Long clase,Long empresa) {
		return (root, query, cb) -> {			
			//Join<EstEstructura,EsemEstempresa> joinEstructura = root.join("estIderegistro",JoinType.INNER);
			Join<EstEstructura,EsemEstempresa> joinEsemempresa = root.join("empresas",JoinType.INNER);			
			List<Predicate> conditions = new ArrayList<>();
			conditions.add(cb.equal(root.get("claIderegistro"), clase));
			conditions.add(cb.equal(joinEsemempresa.get("empIderegistro"),empresa));			
			return cb.and(conditions.toArray(new Predicate[conditions.size()]));			
		};
	}
}
