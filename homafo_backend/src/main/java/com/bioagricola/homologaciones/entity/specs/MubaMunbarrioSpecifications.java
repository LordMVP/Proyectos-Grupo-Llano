package com.bioagricola.homologaciones.entity.specs;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import com.bioagricola.common.entity.Barrios;
import com.bioagricola.common.entity.Empresas;
import com.bioagricola.common.entity.MubaMunbarrio;
import com.bioagricola.common.entity.Proyectos;


public class MubaMunbarrioSpecifications {
	
	public static Specification<MubaMunbarrio> byEmpresa(Integer empresa,String search) {
		return (root, query, cb) -> {					
			Join<MubaMunbarrio, Barrios> joinBarrio = root.join("uniBarrio",JoinType.INNER);			
			Join<Barrios,Empresas> joinEmpresaBarrios = joinBarrio.join("barrioCodemp",JoinType.INNER);			
			Join<MubaMunbarrio,Proyectos> joinProyectos = root.join("uniMunicipio",JoinType.INNER);
			Join<Proyectos,Empresas> joinEmpresaProyectos = joinProyectos.join("proyectoCodemp",JoinType.INNER);			
			List<Predicate> conditions = new ArrayList<>();
			conditions.add(cb.and(cb.equal(joinEmpresaProyectos.get("empresaSevemp"),empresa),cb.equal(joinEmpresaBarrios.get("empresaSevemp"),empresa)));
			//conditions.add(cb.equal(joinEmpresaProyectos.get("empresaSevemp"),empresa));
			//conditions.add(cb.equal(joinEmpresaBarrios.get("empresaSevemp"),empresa));
			conditions.add(cb.or(cb.like(cb.upper(joinProyectos.get("proyectoNom")), "%"+search.toUpperCase()+"%"),cb.like(cb.upper(joinBarrio.get("barrioNom")), "%"+search.toUpperCase()+"%")));
			//conditions.add(cb.like(cb.upper(joinProyectos.get("proyectoNom")), "%"+search.toUpperCase()+"%"));
			//conditions.add(cb.like(cb.upper(joinBarrio.get("barrioNom")), "%"+search.toUpperCase()+"%"));			
			return  cb.and(conditions.toArray(new Predicate[conditions.size()]));
		};	
	}
	
	public static Specification<MubaMunbarrio> byEmpresaAndMunicipioAndBarrio(Integer empresa,Integer municipio,Integer barrio) {
		return (root, query, cb) -> {					
			Join<MubaMunbarrio, Barrios> joinBarrio = root.join("uniBarrio",JoinType.INNER);			
			Join<Barrios,Empresas> joinEmpresaBarrios = joinBarrio.join("barrioCodemp",JoinType.INNER);			
			Join<MubaMunbarrio,Proyectos> joinProyectos = root.join("uniMunicipio",JoinType.INNER);
			Join<Proyectos,Empresas> joinEmpresaProyectos = joinProyectos.join("proyectoCodemp",JoinType.INNER);			
			List<Predicate> conditions = new ArrayList<>();			
			conditions.add(cb.equal(joinEmpresaProyectos.get("empresaSevemp"),empresa));
			conditions.add(cb.equal(joinEmpresaBarrios.get("empresaSevemp"),empresa));
			conditions.add(cb.equal(joinBarrio.get("barrioIderegistro"),barrio));
			conditions.add(cb.equal(joinProyectos.get("proyectoIderegistro"),municipio));
			return  cb.and(conditions.toArray(new Predicate[conditions.size()]));
			//return cb.any(byEmpresa(317));
		};	
	}
	
	public static Specification<MubaMunbarrio> byMunicipioLike(String search) {
		return (root, query, cb) -> {			
			return cb.like(cb.upper(root.get("proyectoNom")),"%"+search.toUpperCase()+"%");
		};	
	}

}
