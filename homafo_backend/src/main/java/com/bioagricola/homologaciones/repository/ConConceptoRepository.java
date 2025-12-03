package com.bioagricola.homologaciones.repository;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.common.entity.ConConcepto;

public interface ConConceptoRepository extends JpaRepository <ConConcepto, Long>
{

	@Query(value = "SELECT\n" + 
			"cosu.cosu_ideregistr,\n" + 
			"cosu.uni_concepto,\n" + 
			"con.con_nombre,\n" + 
			"to_char(cosu.cosu_fecinicio,'DD-MM-YYYY') as fecha1,\n" + 
			"to_char(cosu.cosu_fecfinal,'DD-MM-YYYY') as fecha2,\n" +
			"cosu.cosu_observacion \n" +
			"FROM cosu_consuscrip cosu\n" + 
			"INNER JOIN con_concepto con ON cosu.uni_concepto=con.uni_concepto\n" + 
			"WHERE cosu.dsus_ideregistr= :dsus",nativeQuery = true)
	List<Object[]> conceptosSuscripcion(@Param("dsus") Integer dsus);
	
	
	@Query(value = "SELECT\n" + 
			"con.uni_concepto,\n" + 
			"con.con_nombre\n" + 
			"FROM con_concepto con\n" + 
			"INNER JOIN prun_prgunidad prun ON prun.uni_ideregistro=con.uni_concepto\n" + 
			"INNER JOIN uspr_usuprgpryto uspr ON uspr.prg_ideregistro=prun.prg_ideregistro\n" + 
			"WHERE con.prg_ideregistro= :programa AND uspr.usu_ideregistro= :usuario \n" + 
			"GROUP BY con.uni_concepto",nativeQuery = true)
	List<Object[]> conceptosSuscripcionSesion(@Param("programa") Integer programa,@Param("usuario") Integer usuario);
	
	
	@Transactional
	@Modifying
	@Query(value="INSERT INTO cosu_consuscrip (cosu_cantidad,cosu_vlrunitari,cosu_vlrtotal,cosu_fecinicio,cosu_fecfinal,dsus_ideregistr,uni_liquidacion,uni_concepto,emp_ideregistro,cosu_estado,usu_ideregistro) VALUES (1,1,1,:Desde,:Hasta,:dsus_ideregistr,:uni_liquidacion,:uni_concepto,:emp_ideregistro,'A',:usu_ideregistro)",nativeQuery = true)
	Integer insertCosuConsuscrip(@Param("Desde") Date Desde, @Param("Hasta") Date Hasta ,@Param("dsus_ideregistr") Integer dsus_ideregistr, @Param("uni_liquidacion") Integer uni_liquidacion, @Param("uni_concepto") Integer uni_concepto, @Param("emp_ideregistro") Integer emp_ideregistro, @Param("usu_ideregistro") Integer usu_ideregistro);
	
	@Transactional
	@Modifying
	@Query(value="DELETE FROM cosu_consuscrip WHERE cosu_ideregistr= :cosu_ideregistr",nativeQuery = true)
	Integer deleteCosuConsuscrip(@Param("cosu_ideregistr") Integer cosu_ideregistr);

}
