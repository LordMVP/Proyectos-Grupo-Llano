package com.llanoGas.microservicio.model.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.llanoGas.microservicio.Entity.Pcrc_parcomrecart;

public interface IPcrc_parcomrecart extends JpaRepository<Pcrc_parcomrecart ,Integer> {
	
	@Query(value = "select count(*) from aseo.pcrc_parcomrecart where ter_ideregistro = :#{#idTercero} and uni_medpago= :#{#idConvenio} and pcrc_estado = '1'",nativeQuery = true)	
    public int validar(int idTercero, int idConvenio);
	
	
	@Query(value = "    SELECT * FROM aseo.pcrc_parcomrecart inner  join ter_tercero on pcrc_parcomrecart.ter_ideregistro= ter_tercero.ter_ideregistro where \r\n" + 
			" pcrc_estado = '1' or pcrc_estado = '2' order by ter_tercero.ter_nomcompleto",nativeQuery = true)	
    public List<Pcrc_parcomrecart> lista();
    
    

}
