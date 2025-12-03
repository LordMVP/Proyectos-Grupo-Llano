package com.llanoGas.microservicio.model.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.llanoGas.microservicio.Entity.Unidad_medpago;;

public interface IUnidad_medpago extends JpaRepository<Unidad_medpago,Integer>{
	
	@Query(value = "select * from public.ter_tercero\r\n" + 
			"inner join mpte_medpagtercer on ter_tercero.ter_ideregistro=mpte_medpagtercer.ter_ideregistro\r\n" + 
			"inner join  mpbc_medpagcuebanco on mpte_medpagtercer.uni_medpago=mpbc_medpagcuebanco.uni_medpago\r\n" + 
			"inner join bcu_bcocuenta on mpbc_medpagcuebanco.bcu_ideregistro = bcu_bcocuenta.bcu_ideregistro\r\n" + 
			"inner join uni_unidad on mpte_medpagtercer.uni_medpago=uni_unidad.uni_ideregistro\r\n" + 
			"where ter_tercero.ter_documento = :#{#documento}",nativeQuery = true)	
    public List<Unidad_medpago> Listaconvenios(String documento);

}
