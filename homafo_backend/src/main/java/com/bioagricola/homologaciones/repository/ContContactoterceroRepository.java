package com.bioagricola.homologaciones.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.common.entity.ContContactotercero;

public interface ContContactoterceroRepository extends JpaRepository<ContContactotercero,Long>
{
	public static String esquemaAseo = "aseo";
	
	@Query(value = "SELECT\n" + 
			"cont.cont_ideregistro,\n" + 
			"cont.ter_ideregistro,\n" + 
			"uni.uni_ideregistro,\n" + 
			"cont.cont_valor,\n" + 
			"uni.uni_nombre1,\n" + 
			"uni.uni_codigo1\n" + 
			"FROM "+esquemaAseo+".cont_contactotercero cont\n" + 
			"INNER JOIN uni_unidad uni ON uni.uni_ideregistro=cont.uni_tipcontactotercero\n" + 
			"WHERE cont.ter_ideregistro= :terIderegistro",nativeQuery = true)
	List<Object[]> contactoTercero(@Param("terIderegistro") Integer terIderegistro);
	
	@Transactional
	@Modifying
	@Query(value="INSERT INTO "+esquemaAseo+".cont_contactotercero (ter_ideregistro,uni_tipcontactotercero,cont_valor) VALUES (:ter_ideregistro,:uni_ideregistro,:cont_valor)",nativeQuery = true)
	Integer insertContactotercero(@Param("ter_ideregistro") Integer ter_ideregistro, @Param("uni_ideregistro") Integer uni_ideregistro ,@Param("cont_valor") String cont_valor);
	
	@Transactional
	@Modifying
	@Query(value="DELETE FROM "+esquemaAseo+".cont_contactotercero WHERE cont_ideregistro= :cont_ideregistro",nativeQuery = true)
	Integer deleteContactotercero(@Param("cont_ideregistro") Integer cont_ideregistro);
}
