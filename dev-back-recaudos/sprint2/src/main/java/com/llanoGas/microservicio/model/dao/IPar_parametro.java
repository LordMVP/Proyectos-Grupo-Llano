package com.llanoGas.microservicio.model.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.llanoGas.microservicio.Entity.Par_parametro;
import com.llanoGas.microservicio.Entity.Par_parametro;

public interface IPar_parametro extends JpaRepository<Par_parametro,Integer>{
	
	@Query(value = "select * from par_parametro where emp_ideregistro =  :#{#empresa} ",nativeQuery = true)	
    public Par_parametro parametro(int empresa);

}
