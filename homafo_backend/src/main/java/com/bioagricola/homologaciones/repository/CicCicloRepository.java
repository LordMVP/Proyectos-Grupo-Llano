package com.bioagricola.homologaciones.repository;

import com.bioagricola.common.entity.CicCiclo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CicCicloRepository extends JpaRepository<CicCiclo,Long>
{
	@Query(value = "SELECT\r\n"
			+ "			max(cic.cic_ideregistro) as cic_ideregistro,\r\n"
			+ "			cic.cic_nombre,\r\n"
			+ "			max(cic.cic_diainicia) as cic_diainicia,\r\n"
			+ "			max(cic.cic_diafinaliza) as cic_diafinaliza,\r\n"
			+ "			max(cic.cic_estado) as cic_estado,\r\n"
			+ "			max(cic.cic_periodos) as cic_periodos,\r\n"
			+ "			max(cic.cic_anoactual) as cic_anoactual,\r\n"
			+ "			max(cic.usu_ideregistro) as usu_ideregistro\r\n"
			+ "			FROM cic_ciclo cic INNER JOIN ciem_cicempresa ciem ON cic.cic_ideregistro=ciem.cic_ideregistro \r\n"
			+ "			inner join cili_cicliquida cc on cc.cic_ideregistro = cic.cic_ideregistro \r\n"
			+ "			WHERE ciem.emp_ideregistro= :empresa\r\n"
			+ "			group by cic.cic_nombre \r\n"
			+ "			order by cic.cic_nombre asc ",nativeQuery = true)
	List<Object[]> listaCiclos(@Param("empresa") Integer empresa);
	
	@Query(value = "select distinct cic.* from aseo.dafo_detaforo deta \r\n" + 
			"inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr=deta.dsus_ideregistr\r\n" + 
			"inner join cic_ciclo cic on cic.cic_ideregistro=dsus.cic_ideregistro"  
			,nativeQuery = true)
	List<CicCiclo> obtenerCiclosActivosAforos();

	@Query(value = "SELECT distinct cic.* FROM cic_ciclo cic " +
			"INNER JOIN ciem_cicempresa ciem ON cic.cic_ideregistro=ciem.cic_ideregistro " +
			" inner join public.dcic_detciclo dd on dd.cic_ideregistro = cic.cic_ideregistro "+
			"WHERE ciem.emp_ideregistro= :empresa ", nativeQuery = true)
	List<CicCiclo> findAllCyclesByEmpId(@Param("empresa") Integer empresa);

	@Query(value = "select per_ideregistro from per_periodo where cic_ideregistro=:cicloId and per_estado='A'", nativeQuery = true)
	Integer findActivePerByCic(@Param("cicloId")Integer cicloId);

	/*
	@Query(value = "SELECT cic.* FROM cic_ciclo cic\n" +
			"INNER JOIN ciem_cicempresa ciem ON cic.cic_ideregistro=ciem.cic_ideregistro\n" +
			"INNER JOIN cili_cicliquida cc on cic.cic_ideregistro = cc.cic_ideregistro\n" +
			"WHERE ciem.emp_ideregistro= :empresa and uni_liquidacion=:liquidacion ", nativeQuery = true)
	List<CicCiclo> findAllCyclesByEmpId(@Param("empresa") Integer empresa, @Param("liquidacion") Integer liquidacion);*/
	
	@Query(value = "SELECT\n" + 
			"cic.cic_ideregistro,\n" + 
			"cic.cic_nombre,\n" + 
			"cic.cic_diainicia,\n" + 
			"cic.cic_diafinaliza,\n" + 
			"cic.cic_estado,\n" + 
			"cic.cic_periodos,\n" + 
			"cic.cic_anoactual,\n" + 
			"cic.usu_ideregistro\n" + 
			"FROM cic_ciclo cic INNER JOIN ciem_cicempresa ciem ON cic.cic_ideregistro=ciem.cic_ideregistro WHERE ciem.emp_ideregistro= :empresa \n" + 
			"",nativeQuery = true)
	List<Object[]> listaCiclos2(@Param("empresa") Integer empresa);

	

}
