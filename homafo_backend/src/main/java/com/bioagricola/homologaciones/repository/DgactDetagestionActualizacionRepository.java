package com.bioagricola.homologaciones.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.homologaciones.entity.DgactDetagestionActualizacion;

public interface DgactDetagestionActualizacionRepository extends JpaRepository <DgactDetagestionActualizacion,Integer>
{
	@Query(value = "SELECT d.dgactAzId FROM DgactDetagestionActualizacion d WHERE d.gactIderegistro.gactIderegistro= :gactIderegistro")
	List<String> buscarArchivos(@Param("gactIderegistro") Long gactIderegistro);
}
