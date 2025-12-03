package com.bioagricola.homologaciones.entity.specs;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import com.bioagricola.common.entity.RutRuta;
import com.bioagricola.homologaciones.entity.RureRutrecoleccion;

public class RureRutrecoleccionSpecifications {
	
	private static final Integer UNIRUTABARRIDO=1512;
	
	public static Specification<RureRutrecoleccion> byArpr(Integer arprIderegistro) {
		return (root, query, cb) -> {			
			return cb.equal(root.get("arprIderegistro"),arprIderegistro);
		};
	}
	
	public static Specification<RureRutrecoleccion> byEstado(String estado) {
		return (root, query, cb) -> {			
			return cb.equal(root.get("rureSwtact"),estado);
		};
	}
	
	public static Specification<RureRutrecoleccion> byNombreMacroRutaAndEstado(String estado,String search) {
		return (root, query, cb) -> {			
			Join<RureRutrecoleccion,RutRuta> joinRuta = root.join("rutIdemacruta",JoinType.INNER);
			List<Predicate> conditions = new ArrayList<>();
			//conditions.add(cb.equal(joinRuta.get("empresaSevemp"),empresa)));
			return cb.and(cb.like(cb.upper(joinRuta.get("rutNombre")), "%"+search.toUpperCase()+"%"),cb.equal(root.get("rureSwtact"),estado),cb.notEqual(joinRuta.get("uniTiporuta"),UNIRUTABARRIDO));						
		};
	}
	
}
