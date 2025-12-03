package com.bioagricola.homologaciones.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.common.entity.LecLectura;

public interface LecLecturaRepository extends JpaRepository<LecLectura,Long>
{
	@Query(value="SELECT \n" + 
			"			concat(lectura.consumo,' - ',lectura.periodo,'/',lectura.anno )\n" + 
			"			FROM \n" + 
			"			( \n" + 
			"			SELECT \n" + 
			"			lec.lec_consumo as consumo, \n" + 
			"			lec_fecha as fecha  ,\n" + 
			"			per.per_nombre as periodo,\n" + 
			"			lec.cic_ano as anno\n" + 
			"			FROM lec_lectura lec \n" + 
			"			INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr=lec.dsus_ideregistr \n" + 
			"			INNER JOIN per_periodo per ON per.per_ideregistro=lec.per_ideregistro\n" + 
			"			WHERE dsus.dsus_ideregistr= :dsus \n" + 
			"			AND lec.lec_estado='P' \n" + 
			"			ORDER BY lec_fecha DESC  \n" + 
			"			limit 6) lectura \n" + 
			"			ORDER BY lectura.fecha ASC",nativeQuery = true)
	List<Object[]> ultimosConsumos(@Param("dsus") Integer dsus);
	
	@Query(value="SELECT\n" + 
			"lectura.consumo\n" + 
			"FROM\n" + 
			"(\n" + 
			"SELECT\n" + 
			"lec.lec_consumo as consumo,\n" + 
			"lec_fecha as fecha\n" + 
			"FROM lec_lectura lec\n" + 
			"INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_ideregistr=lec.dsus_ideregistr\n" + 
			"WHERE dsus.dsus_ideregistr= :dsus\n" + 
			"AND lec.lec_estado='P'\n" + 
			"ORDER BY lec_fecha DESC\n" + 
			"limit 6) lectura\n" + 
			"ORDER BY lectura.fecha ASC",nativeQuery = true)
	List<Integer> ultimosConsumosBase(@Param("dsus") Integer dsus);
}
