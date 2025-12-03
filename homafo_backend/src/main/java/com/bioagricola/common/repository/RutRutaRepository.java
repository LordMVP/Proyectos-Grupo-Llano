package com.bioagricola.common.repository;

import com.bioagricola.common.entity.RutRuta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

public interface RutRutaRepository extends JpaRepository<RutRuta, Long>,JpaSpecificationExecutor<RutRuta> {
	public static String esquemaAseo = "aseo";
	public static String TIPO_SERVICIO_RECOLECCION="RECOL";
	
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
	
	@Query(value="SELECT DISTINCT  \n"
			+ "			rure.rure_ideregistro, \n"
			+ "			rut.rut_nombre, \n"
			+ "			rut.rut_ideregistro, \n"
			+ "			rure.rut_idemacruta, \n"
			+ "			Cast(rure.rut_microruta as varchar) \n"
			+ "			FROM aseo.rure_rutrecoleccion rure \n"
			+ "			INNER JOIN rut_ruta rut ON rut.rut_ideregistro=rure.rut_idemacruta \n"
			+ "			INNER JOIN aseo.arpr_areaprestacion arpr ON rure.arpr_ideregistro=arpr.arpr_ideregistro \n"
			+ "			INNER JOIN uni_unidad uni ON uni.uni_ideregistro=rut.uni_tiporuta \n"
			+ "			and uni.uni_codigo2 ='RECOL'  \n"
			+ "			INNER JOIN est_estructura est ON est.est_ideregistro=uni.est_ideregistro \n"
			+ "			INNER JOIN cla_clase cla ON cla.cla_ideregistro=est.cla_ideregistro \n"
			+ "			inner join jsonb_array_elements(rure.rut_microruta) rm on  \n"
			+ "			rm->>'nombre' in ((select jsonb_array_elements(dd.dmuba_rutas)->>'rutNombre'  from muba_munbarrio mm  \n"
			+ "				inner join aseo.dmuba_detamuba dd on  \n"
			+ "				dd.muba_ideregistro = mm.muba_ideregistr  \n"
			+ "				where mm.uni_barrio = :barrio ))			 \n"
			+ "			WHERE arpr.emp_ideregistro=:empresa  AND RURE.rure_swtact='A' "			
			+ " \n"  ,nativeQuery = true)
	List<Object[]> listaMacroRutas(@Param("empresa") Integer empresa,@Param("barrio")Integer barrio);
	
	@Query(value="SELECT\n" + 
			"hrr.hrr_dia,\n" + 
			"hrr.hrr_horinicio,\n" + 
			"hrr.hrr_horfin,\n"+
			"hrr.microruta\n" +
			"FROM aseo.hrr_horrecoleccion hrr\n" + 
			"INNER JOIN "+esquemaAseo+".rure_rutrecoleccion rure ON rure.rure_ideregistro=hrr.rure_ideregistro\n" + 
			"WHERE rure.rure_ideregistro= :rure_ideregistro \n" + 
			"AND hrr.hrr_swtact='A'",nativeQuery=true)
	List<Object[]> listaFrecuenciasRutas(@Param("rure_ideregistro") Integer rure_ideregistro);
	
	
	@Query(value="select hh.hrr_dia,max(hh.hrr_horinicio) hrr_horinicio,max(hh.hrr_horfin) hrr_horfin  from aseo.hrr_horrecoleccion hh \r\n"
			+ "where hrr_swtact = 'A'\r\n"
			+ "group by hh.hrr_dia",nativeQuery=true)
	List<Object[]> listaFrecuenciasRutasTMP();
	
	@Query(value = "SELECT\n" + 
			"rut.rut_ideregistro,\n" + 
			"rut.rut_nombre,\n" + 
			"rut.rut_tipo,\n" + 
			"rut.cic_ideregistro,\n" + 
			"rut.usu_ideregistro,\n" + 
			"rut.uni_tiporuta\n" + 
			"FROM rut_ruta rut\n" + 
			"INNER JOIN uni_unidad uni ON uni.uni_ideregistro=rut.uni_tiporuta	\n" + 
			"WHERE uni.est_ideregistro= :estrucutura",nativeQuery = true)
	List<Object[]> listaRutasTipo(@Param("estrucutura") Integer estrucutura);
	
	@Query(value="SELECT\n" + 
			"rutapr_ideregistro,\n" + 
			"rut_ideregistro,\n" + 
			"dsus_ideregistr,\n" + 
			"ter_aprovechamiento,\n" + 
			"rutapr_incentivo,\n" + 
			"rutapr_aforado, \n" +
			"CAST(to_char(date_created, 'YYYY-MM-DD') as varchar) as date_created, \n"+
			"rutapr_observacion \n" +
			"FROM "+esquemaAseo+".rapr_rutaaprovechamiento\n" +
			"WHERE dsus_ideregistr= :dsus AND rutapr_swtact='A' LIMIT 1",nativeQuery = true)
	List<Object[]> rutAprovechamiento(@Param("dsus") Integer dsus);
	
	@Transactional
	@Modifying
	@Query(value="DELETE FROM cosu_consuscrip WHERE cosu_ideregistr= :cosu_ideregistr",nativeQuery = true)
	Integer deleteCosuConsuscrip(@Param("cosu_ideregistr") Integer cosu_ideregistr);
	
	@Query(value="SELECT\n" + 
			"rusu.rut_ideregistro\n" + 
			"FROM rusu_rutsuscrip rusu\n" + 
			"INNER JOIN rut_ruta rut ON rut.rut_ideregistro=rusu.rut_ideregistro\n" + 
			"INNER JOIN uni_unidad uni ON uni.uni_ideregistro=rut.uni_tiporuta\n" + 
			"WHERE rusu.dsus_ideregistr= :dsus_ideregistr \n" + 
			"AND uni.est_ideregistro= :est_ideregistro LIMIT 1",nativeQuery = true)
	Integer rusuExistencia(@Param("dsus_ideregistr") Integer dsus_ideregistr, @Param("est_ideregistro") Integer est_ideregistro);
	
	@Transactional
	@Modifying
	@Query(value="INSERT INTO rusu_rutsuscrip (rusu_rutanterio,rut_ideregistro,dsus_ideregistr,rusu_rutsecuen,usu_ideregistro) VALUES (:rusu_rutanterio,:rut_ideregistro,:dsus_ideregistr,:rusu_rutsecuen,:usu_ideregistro) ",nativeQuery = true)
	Integer insertRusuRuta(@Param("rusu_rutanterio") String rusu_rutanterio,@Param("rut_ideregistro") Integer rut_ideregistro,@Param("dsus_ideregistr") Integer dsus_ideregistr,@Param("rusu_rutsecuen") Integer rusu_rutsecuen, @Param("usu_ideregistro") Integer usu_ideregistro);
	
	@Transactional
	@Modifying
	@Query(value="UPDATE rusu_rutsuscrip rusu\n" + 
			"SET rut_ideregistro= :ruta \n" + 
			"FROM rut_ruta rut\n" + 
			"INNER JOIN uni_unidad uni ON uni.uni_ideregistro=rut.uni_tiporuta\n" + 
			"INNER JOIN est_estructura est ON est.est_ideregistro=uni.est_ideregistro\n" + 
			"WHERE rusu.dsus_ideregistr= :dsus \n" + 
			"--AND est.est_ideregistro= :estructura ",nativeQuery = true)
	Integer updateRusuRuta(@Param("ruta") Integer ruta,@Param("dsus") Integer dsus);
	
	@Transactional
	@Modifying
	@Query(value="INSERT INTO "+esquemaAseo+".rapr_rutaaprovechamiento (rut_ideregistro,dsus_ideregistr,ter_aprovechamiento,rutapr_incentivo,rutapr_aforado,rutapr_swtact,usu_ideregistro,date_created) VALUES (:rut_ideregistro,:dsus_ideregistro,:ter_aprovechamiento,:rutapr_incentivo,:rutapr_aforado, 'A', :usu_ideregistro , :date_created)",nativeQuery = true)
	Integer insertRutapr(@Param("rut_ideregistro") Integer rut_ideregistro, @Param("dsus_ideregistro") Integer dsus_ideregistro, @Param("ter_aprovechamiento") Integer ter_aprovechamiento, @Param("rutapr_incentivo") Boolean rutapr_incentivo , @Param("rutapr_aforado") Boolean rutapr_aforado, @Param("usu_ideregistro") Integer usu_ideregistro, @Param("date_created") Date date_created);
	
	@Transactional
	@Modifying
	@Query(value="UPDATE "+esquemaAseo+".rapr_rutaaprovechamiento \n" + 
			"SET rut_ideregistro= :rut_ideregistro , ter_aprovechamiento= :ter_aprovechamiento , rutapr_incentivo= :rutapr_incentivo , rutapr_aforado= :rutapr_aforado, usu_ideregistro= :usu_ideregistro \n" + 
			"WHERE dsus_ideregistr= :dsus_ideregistro ",nativeQuery = true)
	Integer updateRutapr(@Param("rut_ideregistro") Integer rut_ideregistro, @Param("ter_aprovechamiento") Integer ter_aprovechamiento,  @Param("rutapr_incentivo") Boolean rutapr_incentivo , @Param("rutapr_aforado") Boolean rutapr_aforado, @Param("usu_ideregistro") Integer usu_ideregistro ,@Param("dsus_ideregistro") Integer dsus_ideregistro);
	
	@Query(value="SELECT * FROM "+esquemaAseo+".fn_getdmubafrecuencia(:ruta)",nativeQuery = true)
	String buscarMacroRuta(@Param("ruta") Integer ruta);

	@Query(value="select cast (dmuba.dmuba_rutas as varchar)\n" +
			"from aseo.dmuba_detamuba dmuba\n" +
			"where  dmuba.muba_ideregistro =:muba ",nativeQuery = true)
	List<String> buscarRutasBarByMuba(@Param("muba") Integer muba);
	
	@Query(value="SELECT\n" + 
			"rutrecbar.rut_ideregistro\n" + 
			"FROM "+esquemaAseo+".rrba_rutarecoleccionbarrido rutrecbar\n" + 
			"INNER JOIN rut_ruta rut ON rut.rut_ideregistro=rutrecbar.rut_ideregistro\n" + 
			"INNER JOIN uni_unidad uni ON uni.uni_ideregistro=rut.uni_tiporuta\n" + 
			"WHERE rutrecbar.dsus_ideregistr= :dsus \n" + 
			"AND uni.est_ideregistro= :estructura \n" + 
			"AND rutrecbar.rutrecbar_swtact='A' ORDER BY rutrecbar.rrba_ideregistro LIMIT 1",nativeQuery = true)
	Integer buscarRutrecbar(@Param("dsus") Integer dsus, @Param("estructura") Integer estructura);
	
	@Query(value="SELECT\n" + 
			"rutrecbar.rrba_ideregistro\n" + 
			//"FROM aseo.rutrecbar_recoleccion_barrido rutrecbar\n" +
			"FROM "+esquemaAseo+".rrba_rutarecoleccionbarrido rutrecbar\n"+
			"INNER JOIN rut_ruta rut ON rut.rut_ideregistro=rutrecbar.rut_ideregistro\n" + 
			"INNER JOIN uni_unidad uni ON uni.uni_ideregistro=rut.uni_tiporuta\n" + 
			"WHERE rutrecbar.dsus_ideregistr= :dsus \n" + 
			"AND uni.est_ideregistro= :estructura \n" + 
			"AND rutrecbar.rutrecbar_swtact='A' ORDER BY rutrecbar.rrba_ideregistro LIMIT 1",nativeQuery = true)
	Integer buscarRutrecbarRegistro(@Param("dsus") Integer dsus, @Param("estructura") Integer estructura);
	
	@Query(value="SELECT\n" + 
			"rutrecbar.rut_idemacroruta\n" + 
			//"FROM aseo.rutrecbar_recoleccion_barrido rutrecbar\n" +
			"FROM "+esquemaAseo+".rrba_rutarecoleccionbarrido rutrecbar\n" +
			"INNER JOIN rut_ruta rut ON rut.rut_ideregistro=rutrecbar.rut_ideregistro\n" + 
			"INNER JOIN uni_unidad uni ON uni.uni_ideregistro=rut.uni_tiporuta\n" + 
			"WHERE rutrecbar.dsus_ideregistr= :dsus \n" + 
			"AND uni.est_ideregistro= :estructura \n" + 
			"AND rutrecbar.rutrecbar_swtact='A' ORDER BY rutrecbar.rrba_ideregistro DESC LIMIT 1",nativeQuery = true)
	Integer buscarRutrecbarMacroRuta(@Param("dsus") Integer dsus, @Param("estructura") Integer estructura);
	
	@Transactional
	@Modifying
	@Query(value="INSERT INTO "+esquemaAseo+".rrba_rutarecoleccionbarrido (rut_ideregistro,dsus_ideregistr,rut_idemacroruta,rutrecbar_swtact,usu_ideregistro, rure_ideregistro)\n" + 
			"VALUES (:rut_ideregistro,:dsus_detsuscrip,:rut_idemacroruta,:rutrecbar_swtact,:usu_ideregistro,:rureIderegistro)\n" + 
			"",nativeQuery = true)
	Integer insertRutrecbar(@Param("rut_ideregistro") Integer rut_ideregistro, @Param("dsus_detsuscrip") Integer dsus_detsuscrip,@Param("rut_idemacroruta") Integer rut_idemacroruta,@Param("rutrecbar_swtact") String rutrecbar_swtact,@Param("usu_ideregistro") Integer usu_ideregistro, @Param("rureIderegistro") Integer rureIderegistro);
	
	@Transactional
	@Modifying
	@Query(value="UPDATE\n" + 
			esquemaAseo+".rrba_rutarecoleccionbarrido\n" + 
			"SET rut_ideregistro=:rut_ideregistro,rut_idemacroruta=:rut_idemacroruta,\n" + 
			"rutrecbar_swtact=:rutrecbar_swtact,usu_ideregistro=:usu_ideregistro,rure_ideregistro=:rureIderegistro \n" +
			"WHERE dsus_ideregistr= :dsus_detsuscrip \n" + 
			"AND rutrecbar_swtact='A' AND rrba_ideregistro= :rutrecbar_ideregistro",nativeQuery = true)
	Integer updateRutrecbar(@Param("rut_ideregistro") Integer rut_ideregistro, @Param("dsus_detsuscrip") Integer dsus_detsuscrip,@Param("rut_idemacroruta") Integer rut_idemacroruta,@Param("rutrecbar_swtact") String rutrecbar_swtact,@Param("usu_ideregistro") Integer usu_ideregistro, @Param("rutrecbar_ideregistro") Integer rutrecbar_ideregistro, @Param("rureIderegistro") Integer rureIderegistro);
	
	@Query(value = "select distinct rut.* from dsus_detsuscrip dsus \r\n" + 
			"inner join aseo.dafo_detaforo dafo on dafo.dsus_ideregistr=dsus.dsus_ideregistr\r\n" + 
			"inner join rusu_rutsuscrip rusu on rusu.dsus_ideregistr = dsus.dsus_ideregistr\r\n" + 
			"inner join rut_ruta rut on rut.rut_ideregistro = rusu.rut_ideregistro\r\n" + 
			"where dsus.emp_ideregistro= :empresa",nativeQuery = true)
	List<RutRuta> getRutasAforos(@Param("empresa") Long empresa);
	
	@Query(value = "SELECT \n" + 
			"rut.rut_ideregistro, \n" + 
			"rut.rut_nombre, \n" + 
			"rut.rut_tipo, \n" + 
			"rut.cic_ideregistro, \n" + 
			"rut.usu_ideregistro, \n" + 
			"rut.uni_tiporuta \n" +
			//"rr.rure_ideregistro \n"+
			"FROM rut_ruta rut\n" + 
			"INNER JOIN mbru_munbarruta mbru ON mbru.rut_ideregistro=rut.rut_ideregistro\n" + 
			"INNER JOIN muba_munbarrio muba ON muba.muba_ideregistr=mbru.muba_ideregistr\n" + 
			"INNER JOIN barrios ba ON ba.barrio_ideregistro=muba.uni_barrio\n" + 
			"INNER JOIN uni_unidad uni ON uni.uni_ideregistro=rut.uni_tiporuta	 \n" + 
			//"inner join aseo.rure_rutrecoleccion rr on rr.rut_idemacruta = rut.rut_ideregistro \n"+
			"WHERE uni.est_ideregistro= :estrucutura AND ba.barrio_ideregistro= :barrio ",nativeQuery = true)
	List<Object[]> listaRutasBarrioTipo(@Param("estrucutura") Integer estrucutura, @Param("barrio") Integer barrio);

	/*@Query(value = "SELECT distinct (rut.*) FROM rut_ruta rut " +
			"INNER JOIN aseo.rure_rutrecoleccion rure ON rut.rut_ideregistro=rure.rut_idemacruta " +
			"where rure.rure_swtact='A' ", nativeQuery = true)
	List<RutRuta> findAllActive();*/

	@Query(value = "SELECT distinct (rut.*) FROM rut_ruta rut where uni_tiporuta = 3017 ", nativeQuery = true)
	List<RutRuta> findAllActive();

	@Query(value = "SELECT rure.rure_ideregistro, Cast(rure.rut_microruta as varchar) FROM aseo.rure_rutrecoleccion rure " +
			"where rure.rure_swtact='A' and rure.rut_idemacruta = :idMacro ", nativeQuery = true)
	List<Object[]> getAllMicroRoutesByMacroRouteId(@Param("idMacro") Long idMacro);

	@Query(value = "SELECT rut.* FROM rut_ruta rut " +
			"where rut.cic_ideregistro = :idCycle ", nativeQuery = true)
	List<RutRuta> getAllRoutesByIdCycle(@Param("idCycle") Integer idCycle);

}
