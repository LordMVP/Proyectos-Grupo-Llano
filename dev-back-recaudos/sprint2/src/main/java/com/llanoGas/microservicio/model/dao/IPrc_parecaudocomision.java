package com.llanoGas.microservicio.model.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.llanoGas.microservicio.Entity.Par_parametro;
import com.llanoGas.microservicio.Entity.Prc_parecaudocomision;

public interface IPrc_parecaudocomision extends JpaRepository<Prc_parecaudocomision ,Integer> {
	

    
@Query(value = "select count(*) from aseo.prc_parecaudocomision where ter_ideregistro = :#{#idTercero} and uni_medpago= :#{#idConvenio} and prc_estado = '1'",nativeQuery = true)	
    public int validar(int idTercero, int idConvenio);



@Query(value = " SELECT * FROM aseo.prc_parecaudocomision inner  join ter_tercero on prc_parecaudocomision.ter_ideregistro= ter_tercero.ter_ideregistro\r\n" + 
		" where  prc_estado = '1' or prc_estado = '2' order by ter_tercero.ter_nomcompleto",nativeQuery = true)	
public List<Prc_parecaudocomision> lista();



}
