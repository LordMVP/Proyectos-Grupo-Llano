package com.bioagricola.homologaciones.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.bioagricola.homologaciones.entity.ImcdsusImpcontdsuscripcion;

@Repository
public interface ImcdsusImpcontdsuscripcionRepository extends JpaRepository<ImcdsusImpcontdsuscripcion, Integer> {
	
	
	@Query(value = "SELECT CAST(json_agg(to_jsonb(resultado)) AS TEXT) "
			+ "        FROM ( "
			+ "            SELECT *,now() fecha_registro "
			+ "            FROM aseo.imcdsus_impcontdsuscripcion ii   "
			+ "            LEFT JOIN public.dsus_detsuscrip dd ON dd.dsus_pcodigo = ii.dsus_pcodigo "
			+ "            LEFT JOIN public.ter_tercero tt ON tt.ter_ideregistro = dd.ter_ideregistro "
			+ "            LEFT JOIN public.pro_propiedad pp ON pp.pro_ideregistro = dd.pro_ideregistro "
			+ "            LEFT JOIN public.per_periodo pr ON pr.cic_ideregistro = dd.cic_ideregistro "
			+ "            and pr.per_estado = 'A' "
			+ "            where ii.usu_ideregistro = :usuario and ii.imarc_ideregistro = :imarc "
			+ "			   order by ii.imcd_ideregistro asc "
			+ "        ) AS resultado;",nativeQuery = true)
	public String obtenerRegistrosBaseCentralByDsusPcodigo( @Param("usuario") Long usuario,@Param("imarc") Long imarc);
	
	@Modifying
	@Transactional
	@Query("DELETE FROM ImcdsusImpcontdsuscripcion Imc WHERE Imc.usuIderegistro =:usuario and Imc.imarcIderegistro = :imarc")
	int limpiarImcdsusCompleto(@Param("usuario")Long usuario,@Param("imarc")Long imarc);

}
