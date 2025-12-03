package com.bioagricola.homologaciones.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.common.entity.Proyectos;

public interface ProyectosRepository extends JpaRepository<Proyectos,Long>,JpaSpecificationExecutor<Proyectos>
{
	@Query(value = "SELECT\n" + 
			"proy.proyecto_cod,\n" + 
			"proy.proyecto_nom,\n" + 
			"proy.proyecto_codciu,\n" + 
			"proy.proyecto_codemp,\n" + 
			"proy.proyecto_llacom,\n" + 
			"proy.proyecto_ideregistro,\n" + 
			"proy.departamento_ideregistro,\n" + 
			"proy.cue_ideregistro,\n" + 
			"proy.proyecto_formato\n" + 
			"FROM proyectos proy \n" +
			"INNER JOIN empresas emp ON emp.empresa_cod=proy.proyecto_codemp \n"+
			"WHERE emp.empresa_sevemp= :empresa \n"+
			"ORDER BY proyecto_nom ASC",nativeQuery = true)
	List<Object[]> listaProyectos(@Param("empresa") Integer empresa);
	
	@Query(value = "SELECT\n" + 
			"proy.proyecto_cod,\n" + 
			"proy.proyecto_nom,\n" + 
			"proy.proyecto_codciu,\n" + 
			"proy.proyecto_codemp,\n" + 
			"proy.proyecto_llacom,\n" + 
			"proy.proyecto_ideregistro,\n" + 
			"proy.departamento_ideregistro,\n" + 
			"proy.cue_ideregistro,\n" + 
			"proy.proyecto_formato\n" + 
			"FROM proyectos proy \n" + 
			"INNER JOIN empresas emp ON emp.empresa_cod=proy.proyecto_codemp \n"+
			"WHERE departamento_ideregistro= :departamento AND emp.empresa_sevemp= :empresa \n" + 
			"ORDER BY proyecto_nom ASC",nativeQuery = true)
	List<Object[]> listaProyectosDepart(@Param("departamento") Integer departamento, @Param("empresa") Integer empresa);
	
	@Query(value="select distinct municipio.* from aseo.afo_aforos afo \r\n" + 
			"inner join aseo.dafo_detaforo dafo on dafo.afo_ideregistro=afo.afo_ideregistro\r\n" + 
			"inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr = dafo.dsus_ideregistr\r\n" + 
			"inner join ter_tercero ter on ter.ter_ideregistro = dsus.ter_ideregistro\r\n" + 
			"inner join rusu_rutsuscrip rusu on rusu.dsus_ideregistr = dsus.dsus_ideregistr\r\n" + 
			"inner join rut_ruta rut on rut.rut_ideregistro = rusu.rut_ideregistro\r\n" + 
			"inner join pro_propiedad pro on pro.pro_ideregistro = dsus.pro_ideregistro\r\n" + 
			"INNER JOIN proyectos municipio on municipio.proyecto_ideregistro = pro.uni_municipio",nativeQuery=true)
	List<Proyectos> findMunicipiosActivosAforos();
	
	@Query(value="select distinct municipio.* from aseo.afo_aforos afo \r\n" + 
			"inner join aseo.dafo_detaforo dafo on dafo.afo_ideregistro=afo.afo_ideregistro\r\n" + 
			"inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr = dafo.dsus_ideregistr\r\n" + 
			"inner join ter_tercero ter on ter.ter_ideregistro = dsus.ter_ideregistro\r\n" + 
			"inner join rusu_rutsuscrip rusu on rusu.dsus_ideregistr = dsus.dsus_ideregistr\r\n" + 
			"inner join rut_ruta rut on rut.rut_ideregistro = rusu.rut_ideregistro\r\n" + 
			"inner join pro_propiedad pro on pro.pro_ideregistro = dsus.pro_ideregistro\r\n" + 
			"INNER JOIN proyectos municipio on municipio.proyecto_ideregistro = pro.uni_municipio\r\n" +
			"where pro.pro_ideregistro=:idMunicipio",nativeQuery=true)
	List<Proyectos> findMunicipioByDsus(@Param("idMunicipio") Long idMunicipio);

}
