package com.llanoGas.microservicio.model.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import com.llanoGas.microservicio.Entity.Con_concepto;
public interface ICon_concepto extends JpaRepository<Con_concepto,Integer> {
	
	
	@Query(value = "SELECT *  FROM public.uni_unidad inner join esem_estempresa  on uni_unidad.est_ideregistro = esem_estempresa.est_ideregistro inner join con_concepto  on uni_unidad.uni_ideregistro = con_concepto.uni_concepto inner join prun_prgunidad on con_concepto.uni_concepto=prun_prgunidad.uni_ideregistro inner join uspu_usuprgunid on   prun_prgunidad.prun_ideregistr=uspu_usuprgunid.prun_ideregistr where uspu_usuprgunid.usu_ideregistro=:#{#usuario} and esem_estempresa .emp_ideregistro=:#{#empresa} and  prun_prgunidad.prg_ideregistro= :#{#programa} and con_operacion = 'S'  order by con_pagpriori ",nativeQuery = true)	
    public List<Con_concepto> listaConcepto( int usuario, int empresa,   int programa);
    
    
   
    
    
	@Query(value = "select *from con_concepto\r\n" + 
			"inner join uni_unidad on con_concepto.uni_concepto=uni_unidad.uni_ideregistro\r\n" + 
			"\r\n" + 
			"inner join est_estructura on uni_unidad.est_ideregistro=est_estructura.est_ideregistro\r\n" + 
			"\r\n" + 
			"inner join cla_clase on est_estructura.cla_ideregistro=cla_clase.cla_ideregistro\r\n" + 
			"\r\n" + 
			"inner join  esem_estempresa on est_estructura.est_ideregistro=esem_estempresa.est_ideregistro\r\n" + 
			"\r\n" + 
			"inner join empresas on esem_estempresa.emp_ideregistro = empresas.empresa_sevemp\r\n" + 
			"where cla_clase.cla_ideregistro  = :#{#clase} and esem_estempresa.emp_ideregistro = :#{#empresa}  ",nativeQuery = true)	
    public List<Con_concepto> impuesto( int clase, int empresa);

}
