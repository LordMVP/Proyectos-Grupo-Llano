package com.bioagricola.homologaciones.repository;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bioagricola.common.entity.GhomGestionhomologa;

public interface GhomGestionhomologaRepository extends JpaRepository<GhomGestionhomologa,Long>
{
	public static String esquemaAseo = "aseo";
	
	@Query(value="SELECT\n" + 
			"ghom.ghom_fecharegistro,\n" + 
			"cnre.cnre_nombre,\n" + 
			"emp.empresa_nom,\n" + 
			"ter.ter_nomcompleto,\n" + 
			"dgho.dsus_pcodigo,\n" + 
			"usu.usuario_nom\n" + 
			"FROM "+esquemaAseo+".ghom_gestionhomologa ghom\n" + 
			"INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro=ghom.sus_ideregistro\n" + 
			"INNER JOIN dsus_detsuscrip dsus ON dsus.sus_ideregistro=dsus.sus_ideregistro\n" + 
			"INNER JOIN aseo.dgho_detallegestionhomologa dgho ON dgho.ghom_ideregistr=ghom.ghom_ideregistr\n" + 
			"INNER JOIN cnre_cnvrecaudo cnre ON cnre.cnre_ideregistr=sus.cnre_ideregistr\n" + 
			"INNER JOIN empresas emp ON emp.empresa_sevemp=ghom.emp_ideregistro\n" + 
			"INNER JOIN ter_tercero ter ON ter.ter_ideregistro=sus.ter_ideregistro\n" + 
			"INNER JOIN usuarios usu ON usu.usu_ideregistro=ghom.usu_ideregistro\n" + 
			"WHERE dsus.dsus_ideregistr= :dsus :condiciones",nativeQuery = true)
	List<Object[]> informacionGhmologacion(@Param("dsus") Integer dsus, @Param("condiciones") String condiciones);

	@Query(value = "SELECT to_char(ghom.ghom_fecharegistro,'DD-MM-YYYY') as fecha,\n" +
			"cnre.cnre_nombre as convenio,\n" +
			"emp2.empresa_nom as empresa,\n" +
			"ter.ter_nomcompleto as nomcompleto,\n" +
			"dgho.dsus_pcodigo as susalterna,\n" +
			"usu.usuario_nom as usuario,\n" +
			"ghom.observaciones as observaciones,\n" +
			"(select c2.cnre_nombre FROM aseo.dgho_detallegestionhomologa d2\n" +
			"inner join sus_suscripcion s2 on s2.sus_ideregistro = d2.sus_ideregistro_homologados\n" +
			"inner join cnre_cnvrecaudo c2 on c2.cnre_ideregistr = s2.cnre_ideregistr\n" +
			"where d2.ghom_ideregistr = ghom.ghom_ideregistr limit 1) as empresa1,\n" +
			"c3.cnre_nombre as empresa2,\n" +
			"dgho.dsus_ideregistr idsus\n" +
			"\n" +
			"FROM dsus_detsuscrip dsus\n" +
			"\n" +
			"inner join aseo.ghom_gestionhomologa ghom on ghom.dsus_ideregistr = dsus.dsus_ideregistr\n" +
			"INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro=ghom.sus_ideregistro\n" +
			"INNER JOIN cnre_cnvrecaudo cnre ON cnre.cnre_ideregistr=sus.cnre_ideregistr\n" +
			"INNER JOIN empresas emp ON emp.empresa_sevemp=ghom.emp_ideregistro\n" +
			"INNER JOIN ter_tercero ter ON ter.ter_ideregistro=sus.ter_ideregistro\n" +
			"INNER JOIN usuarios usu ON usu.usu_ideregistro=ghom.usu_ideregistro\n" +
			"inner join sus_suscripcion s3 on s3.sus_ideregistro = ghom.sus_ideregistro\n" +
			"inner join cnre_cnvrecaudo c3 on c3.cnre_ideregistr = s3.cnre_ideregistr\n" +
			"inner join aseo.dgho_detallegestionhomologa dgho on dgho.ghom_ideregistr = ghom.ghom_ideregistr\n" +
			"INNER JOIN empresas emp2 ON emp2.empresa_sevemp=dgho.emp_ideregistro\n" +
			"\n" +
			"WHERE dsus.dsus_ideregistr=:dsusId AND\n" +
			"      DATE(ghom_fecharegistro) BETWEEN :iniDate AND :endDate \n" +
			"      AND ghom.emp_ideregistro=:empIderegistro order by dgho.dgho_fecharegistro Desc", nativeQuery = true)
	List<Map<String,Object>> findHistoryHomologation(@Param("dsusId")Long dsusId, @Param("iniDate")Date iniDate, @Param("endDate")Date endDate, @Param("empIderegistro")Integer empIderegistro);
	
	@Query(value="select gg.* from aseo.ghom_gestionhomologa gg where gg.dsus_ideregistr =:dsus and gg.ghom_estado = 'A'",nativeQuery = true)
	public Optional<GhomGestionhomologa> findByDsusIderegistrHom(@Param("dsus") Integer dsus);
}
