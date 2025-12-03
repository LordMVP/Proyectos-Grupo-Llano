package com.llanoGas.microservicio.model.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.llanoGas.microservicio.Entity.Irc_imprecaudocomision;

public interface Iirc_imprecaudocomision extends JpaRepository<Irc_imprecaudocomision,Integer>{
	@Query(value = "select * from aseo.irc_imprecaudocomision\r\n" + 
			"inner join aseo.prc_parecaudocomision on  irc_imprecaudocomision.prc_ideregistro=prc_parecaudocomision.prc_ideregistro\r\n" + 
			"\r\n" + 
			"where aseo.prc_parecaudocomision.prc_estado='1'",nativeQuery = true)	
	public List<Irc_imprecaudocomision> datosestado1();

}
