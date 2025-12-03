package com.llanoGas.microservicio.model.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.llanoGas.microservicio.Entity.Uni_unidad;
import com.llanoGas.microservicio.Entity.Unidad_medpago;

public interface IUni_unidad extends JpaRepository<Uni_unidad,Integer>  {
	
	@Query(value = "select uni_unidad.uni_ideregistro,uni_unidad.uni_codigo1, uni_unidad.uni_nombre1 from ter_tercero\r\n" + 
			"inner join mpte_medpagtercer on ter_tercero.ter_ideregistro=mpte_medpagtercer.ter_ideregistro\r\n" + 
			"inner join uni_unidad on mpte_medpagtercer.uni_medpago=uni_unidad.uni_ideregistro\r\n" + 
			"where ter_tercero.ter_documento = :#{#documento}",nativeQuery = true)	
    public List<Uni_unidad> convenios(String documento);
    
    
    
	


}
