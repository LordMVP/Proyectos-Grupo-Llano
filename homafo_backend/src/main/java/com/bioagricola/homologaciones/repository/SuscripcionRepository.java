package com.bioagricola.homologaciones.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.homologaciones.entity.SusSuscripcion;

@Repository
public interface SuscripcionRepository extends JpaRepository<SusSuscripcion, Long>
{
	@Query(value="SELECT\n" + 
			"DISTINCT ter.ter_nomcompleto,\n" + 
			"dsus.dsus_pcodigo, \n" + 
			"dsus.pro_catestrato, \n" + 
			"emp.empresa_nom, \n" + 
			"pro.pro_idepropieda, dsus.dsus_ideregistr\n" + 
			"FROM sus_suscripcion sus\n" + 
			"INNER JOIN dsus_detsuscrip dsus ON dsus.sus_ideregistro=sus.sus_ideregistro\n" + 
			"INNER JOIN ter_tercero ter ON dsus.ter_ideregistro=ter.ter_ideregistro \n" + 
			"INNER JOIN empresas emp ON emp.empresa_sevemp=dsus.emp_ideregistro \n" + 
			"INNER JOIN uni_unidad uni ON uni.uni_ideregistro=dsus.uni_tipusosuscr \n" + 
			"INNER JOIN pro_propiedad pro ON pro.pro_ideregistro=dsus.pro_ideregistro\n" + 
			"WHERE sus.sus_ideregistro= :sus AND dsus.dsus_ideregistr <>   :dsus" ,nativeQuery = true)
	List<Object[]> informacionDsusHomo(@Param("sus") Integer sus,@Param("dsus") Integer dsus);
	
	@Query(value="select dd.dsus_ideregistr from dsus_detsuscrip dd where dd.sus_ideregistro=:sus and dd.emp_ideregistro = :emp",nativeQuery = true)
	List<Object[]> dsusSuscripcionListado(@Param("sus") Long sus,@Param("emp") Integer emp);
	
}
