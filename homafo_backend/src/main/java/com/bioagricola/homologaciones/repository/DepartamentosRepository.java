package com.bioagricola.homologaciones.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.bioagricola.common.entity.Departamentos;

public interface DepartamentosRepository extends JpaRepository<Departamentos,Long>,JpaSpecificationExecutor<Departamentos>
{
	@Query(value = "SELECT\n" + 
			"departamento_cod,\n" + 
			"departamento_nom,\n" + 
			"departamento_codpai,\n" + 
			"departamento_ideregistro\n" + 
			"FROM departamentos\n" + 
			"ORDER BY departamento_nom ASC",nativeQuery = true)
	List<Object[]> listaDepartamentos();

}
