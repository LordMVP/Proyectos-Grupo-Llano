package com.bioagricola.homologaciones.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.common.entity.ClteClatercero;

public interface ClteClaterceroRepository extends JpaRepository<ClteClatercero,Long>
{
	@Transactional
	@Modifying
	@Query(value="INSERT INTO clte_clatercero (uni_clatercero,ter_ideregistro,usu_ideregistro) VALUES (:uni_ideregistro,:ter_ideregistro, :usu_ideregistro)",nativeQuery = true)
	Integer insertClteClaTercero(@Param("uni_ideregistro") Integer uni_ideregistro, @Param("ter_ideregistro") Integer ter_ideregistro ,@Param("usu_ideregistro") Integer usu_ideregistro);
	
	@Transactional
	@Modifying
	@Query(value="DELETE FROM clte_clatercero WHERE clte_ideregistr= :clte_ideregistr",nativeQuery = true)
	Integer deleteClteClaTercero(@Param("clte_ideregistr") Integer clte_ideregistr);
	

}
