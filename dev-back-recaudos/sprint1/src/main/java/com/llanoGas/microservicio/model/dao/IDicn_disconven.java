package com.llanoGas.microservicio.model.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.llanoGas.microservicio.Entity.Dicn_disconven;


public interface IDicn_disconven extends JpaRepository<Dicn_disconven,Integer> {
	
	
	@Query(value = "\r\n" + 
			"select * from cnre_cnvrecaudo cc \r\n" + 
			"inner join dicn_disconven dd   on dd.cnre_ideregistr  = cc.cnre_ideregistr \r\n" + 
			"inner join uni_unidad uu  on uu.uni_ideregistro  = dd.uni_tipsuscripc \r\n" + 
			"inner join empresas e2  on e2.empresa_sevemp  = dd.emp_ideregistro \r\n" + 
			"inner join ( select distinct cnre_ideregistr idconvenioempresasesion from dicn_disconven  \r\n" + 
			"      where emp_ideregistro = :#{#empresa} and dicn_empfactura = 'S'\r\n" + 
			") conveniosempresasesion on conveniosempresasesion.idconvenioempresasesion = cc.cnre_ideregistr \r\n" + 
			"where cc.cnre_estado  ='A' order by   dicn_pagprioridad",nativeQuery = true)	
    public List<Dicn_disconven> listaDinsConven(int empresa);
    
    
    
    
    
	@Query(value = "\r\n" + 
			"select * from cnre_cnvrecaudo cc \r\n" + 
			"inner join dicn_disconven dd   on dd.cnre_ideregistr  = cc.cnre_ideregistr \r\n" + 
			"inner join uni_unidad uu  on uu.uni_ideregistro  = dd.uni_tipsuscripc \r\n" + 
			"inner join empresas e2  on e2.empresa_sevemp  = dd.emp_ideregistro \r\n" + 
			"inner join ( select distinct cnre_ideregistr idconvenioempresasesion from dicn_disconven  \r\n" + 
			"      where emp_ideregistro = :#{#empresa} and dicn_empfactura = 'S'\r\n" + 
			") conveniosempresasesion on conveniosempresasesion.idconvenioempresasesion = cc.cnre_ideregistr \r\n" + 
			"where cc.cnre_estado  ='A'  and dd.dicn_ideregistr= :#{#idconvenio}  ",nativeQuery = true)	
    public Dicn_disconven FilaDinsConven(int empresa,int idconvenio);

}
