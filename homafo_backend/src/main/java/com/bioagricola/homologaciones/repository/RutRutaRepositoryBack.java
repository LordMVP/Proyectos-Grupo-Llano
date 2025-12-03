package com.bioagricola.homologaciones.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bioagricola.common.entity.RutRuta;

@Repository
public interface RutRutaRepositoryBack extends JpaRepository<RutRuta,Integer>
{
	@Query(value = "SELECT\n" + 
			"rut_ideregistro,\n" + 
			"rut_nombre,\n" + 
			"rut_tipo,\n" + 
			"cic_ideregistro,\n" + 
			"usu_ideregistro,\n" + 
			"uni_tiporuta\n" + 
			"FROM rut_ruta\n" + 
			"WHERE rut_ideregistro= :rut",nativeQuery = true)
	List<Object[]> listaRutas(@Param("rut") Integer rut);
	
	@Query(value = "select distinct rut.* from dsus_detsuscrip dsus \r\n" + 
			"inner join aseo.dafo_detaforo dafo on dafo.dsus_ideregistr=dsus.dsus_ideregistr\r\n" + 
			"inner join rusu_rutsuscrip rusu on rusu.dsus_ideregistr = dsus.dsus_ideregistr\r\n" + 
			"inner join rut_ruta rut on rut.rut_ideregistro = rusu.rut_ideregistro\r\n" + 
			"where dsus.emp_ideregistro= :empresa",nativeQuery = true)
	List<RutRuta> getRutasAforos(@Param("empresa") Long empresa);

}
