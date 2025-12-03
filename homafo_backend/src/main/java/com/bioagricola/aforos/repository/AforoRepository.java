package com.bioagricola.aforos.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bioagricola.aforos.entity.Aforo;
import com.bioagricola.common.entity.UniUnidad;

@Repository
@Transactional
public interface AforoRepository  extends JpaRepository<Aforo,Long>,JpaSpecificationExecutor<Aforo>{

	List<Aforo> findAll();

	@Query("SELECT a FROM Aforo a WHERE a.afoIderegistro = ?1")
	public Aforo findAforoByNumeroAforo(Long id);

	@Query(value= "select a.* from aseo.afo_aforos a \r\n" +
			"inner join aseo.dafo_detaforo d on d.afo_ideregistro=a.afo_ideregistro\r\n" +
			"where uni_tipoaforo=:tipoAforo and d.dsus_ideregistr=:dsus\r\n",nativeQuery=true)
	public List<Aforo> findAforoByDsusAndTipo(@Param("tipoAforo") Long tipoAforo,@Param("dsus") Long dsus);


	@Query(value="select \n"
			+ "      afo.afo_ideregistro,\n"			//0
			+ "      afo.uni_tipoAforo,\n"			    //1
			+ "      afo.afo_fecha,\n"					//2
			+ "      afo.afo_fechainicio,\n"			//3
			+ "      afo.afo_fechafinvegencia,\n"		//4
			+ "      afo.afo_numpqr,\n"					//5
			+ "      afo.afo_estado,\n"					//6
			+ "      afo.uni_clasesuscripcionaforo,\n"	//7
			+ "      afo.ter_aforador,\n"				//8
			+ "      afo.uni_tipogenerador,      \n"	//9
			+ "      afo.mafv_factor,\n"				//10
			+ "      afo.usu_ideregistro,\n"			//11
			+ "      afo.afo_observaciones,\n"			//12
			+ "      afo.barrio_ideregistro,\n"			//13
			+ "      afo.uni_complemento,\n"			//14
			+ "      afo.afo_ideafopadre,\n"			//15
			+ "      afo.afo_fechaactualizacion,\n"		//16
			+ "      afo.rure_ideregistro,\n"			//17
			+ "       dsus.dsus_ideregistr,\n"			//18
			+ "       dsus.dsus_pcodigo, \n"			//19
            + "       dsus.uni_barrio, \n"			    //20
			+ "       dafo.afo_numpqr as dafo_numpqr, \n"//21
			+ "       ROUND(dafo.dafo_multiusuporcentaje,2), \n"	//22
			+ "	   ter.ter_nomcompleto,\n"				//23
			+ "	   ba.barrio_nom, \n"					//24
			+ "       pro.pro_direccion, \n"				//25
			+ "      afom.afom_distribucion, \n"				//26
			+ "    dsus.uni_actsuscripc, \n"              //27
			+ "    info.iasus_nombreestablecimiento, \n"  //28
			+ "    info.iasus_referenciacomercial, \n"  //29
			+ "    emp.empresa_nom, \n"  //30
			+ "    tipo.uni_nombre1 as tipo_uso_sus, \n"  //31
			+ "    dsus.dsus_estado, \n"  //32
			+ "    uni.uni_nombre1, \n"  //33
			+ "    cnre.cnre_nombre, \n"  //34
			+ "    dsus.pro_catestrato, \n"  //35
			+ "    afom.afom_direccion, \n"  //36
			+ "    afom.afom_descripcion, \n"  //37
			+ "    afo.afo_distribucion_uniforme \n"  //38
			+ "from aseo.afo_aforos afo\n"
			+ "inner join aseo.dafo_detaforo dafo on dafo.afo_ideregistro=afo.afo_ideregistro\n"
			+ "inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr = dafo.dsus_ideregistr\n"
			+ "INNER JOIN ter_tercero ter ON ter.ter_ideregistro=dsus.ter_ideregistro\n"
			+ "INNER JOIN barrios ba ON ba.barrio_ideregistro=dsus.uni_barrio  \n"
			+ "inner join pro_propiedad pro on pro.pro_ideregistro = dsus.pro_ideregistro\n"
			+ "left join aseo.afom_afomultiusuario afom on afom.afo_ideregistro = afo.afo_ideregistro\n"
			+ "left join aseo.iasus_inforadicionalsuscripcion info on info.dsus_ideregistr=dsus.dsus_ideregistr\n"
			+ "left join empresas emp on emp.empresa_sevemp = dsus.emp_ideregistro\n"
			+ "left join uni_unidad tipo on tipo.uni_ideregistro = dsus.uni_tipusosuscr\n"
			+ "left join uni_unidad uni on uni.uni_ideregistro = pro.uni_cmpdireccion \n"
			+ "INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro = dsus.sus_ideregistro \n"
			+ "INNER JOIN cnre_cnvrecaudo cnre ON cnre.cnre_ideregistr = sus.cnre_ideregistr \n"

			+ "where afo.afo_ideregistro = :afo_idregistro", nativeQuery = true
			)
	List<Object[]> findMultiAforoById(@Param("afo_idregistro")String idAforo);

	@Query(value="SELECT\n" +
			"*\n" +
			"FROM aseo.fn_getfechafinalaforo( :tafoIderegistro, :rureIderegistro, :fechaInicial )", nativeQuery = true)
	List<Object[]> fechaFinalAforo(@Param("tafoIderegistro") Integer tafoIderegistro, @Param("rureIderegistro") Integer rureIderegistro,@Param("fechaInicial") String fechaInicial);

	//Page<Aforo> getAforosLiquidacion(Pageable pageable);

	Page<Aforo> findByAfoIderegistroAndAfoEstado(Long afoIderegistro,String afoEstado,Pageable pageable);
	Page<Aforo> findByAfoEstado(String afoEstado,Pageable pageable);

	// Métodos para buscar por múltiples estados
	Page<Aforo> findByAfoIderegistroAndAfoEstadoIn(Long afoIderegistro, List<String> estados, Pageable pageable);
	Page<Aforo> findByAfoEstadoIn(List<String> estados, Pageable pageable);

	@Query(value="select\n" +
			"			      afo.hafo_ideregistro,			\n" +
			"			      afo.uni_tipoAforo,			 \n" +
			"			      afo.hafo_fecha,					\n" +
			"			      afo.hafo_fechainicio,		\n" +
			"			      afo.hafo_fechafinvegencia,\n" +
			"			      afo.hafo_numpqr,					\n" +
			"			      afo.hafo_estado,					\n" +
			"			      afo.uni_clasesuscripcionaforo,	\n" +
			"			      afo.ter_aforador,				\n" +
			"			      afo.uni_tipogenerador, \n" +
			"			      afo.hmafv_factor,				\n" +
			"			      afo.usu_ideregistro,		\n" +
			"			      afo.hafo_observaciones,			\n" +
			"			      afo.barrio_ideregistro,			\n" +
			"			      afo.uni_complemento,			\n" +
			"			      afo.hafo_ideafopadre,			\n" +
			"			      afo.hafo_fechaactualizacion,		\n" +
			"			      afo.rure_ideregistro,			\n" +
			"			       dsus.dsus_ideregistr,		\n" +
			"			       dsus.dsus_pcodigo,			\n" +
			"                   dsus.uni_barrio,			\n" +
			"			       dafo.hafo_numpqr as dafo_numpqr,\n" +
			"			       dafo.hdafo_multiusuporcentaje,	\n" +
			"				   ter.ter_nomcompleto,				\n" +
			"				   ba.barrio_nom,					\n" +
			"			       pro.pro_direccion,	\n" +
			"			      afom.hafom_distribucion,\n" +
			"			    dsus.uni_actsuscripc,       \n" +
			"			    info.iasus_nombreestablecimiento,\n" +
			"			    info.iasus_referenciacomercial,  \n" +
			"			    emp.empresa_nom,  \n" +
			"			    tipo.uni_nombre1 as tipo_uso_sus,\n" +
			"			    dsus.dsus_estado,  \n" +
			"			    uni.uni_nombre1,  \n" +
			"			    cnre.cnre_nombre,\n" +
			"			    dsus.pro_catestrato,\n" +
			"			    afom.hafom_direccion, \n" +
			"			    afom.hafom_descripcion, \n" +
			"			    afo.hafo_distribucion_uniforme \n" +
			"			from aseo.hafo_aforos afo\n" +
			"			inner join aseo.hdafo_detaforo dafo on dafo.hafo_ideregistro=afo.hafo_ideregistro\n" +
			"			inner join dsus_detsuscrip dsus on dsus.dsus_ideregistr = dafo.dsus_ideregistr\n" +
			"			INNER JOIN ter_tercero ter ON ter.ter_ideregistro=dsus.ter_ideregistro\n" +
			"			INNER JOIN barrios ba ON ba.barrio_ideregistro=dsus.uni_barrio \n" +
			"			inner join pro_propiedad pro on pro.pro_ideregistro = dsus.pro_ideregistro\n" +
			"			left join aseo.hafom_afomultiusuario afom on afom.afo_ideregistro = afo.hafo_ideregistro\n" +
			"			left join aseo.iasus_inforadicionalsuscripcion info on info.dsus_ideregistr=dsus.dsus_ideregistr\n" +
			"			left join empresas emp on emp.empresa_sevemp = dsus.emp_ideregistro\n" +
			"			left join uni_unidad tipo on tipo.uni_ideregistro = dsus.uni_tipusosuscr\n" +
			"			left join uni_unidad uni on uni.uni_ideregistro = pro.uni_cmpdireccion\n" +
			"			INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro = dsus.sus_ideregistro\n" +
			"			INNER JOIN cnre_cnvrecaudo cnre ON cnre.cnre_ideregistr = sus.cnre_ideregistr\n" +
			"			where afo.hafo_ideregistro = :afo_idregistro AND afo.hafo_fechafinvegencia >=current_date ", nativeQuery = true
			)
	List<Object[]> findMultiAforoByIdPadre(@Param("afo_idregistro")String idAforo);

	@Query(value="select aseo.fn_historico_aforo(:aforo, :maestroVisitas, :factorEquivalencia, :tafna ,:volumen)", nativeQuery=true)
	public Long fnLiquidarAforo(@Param("aforo")Long aforo, @Param("maestroVisitas")Long maestroVisitas, @Param("factorEquivalencia")Double factorEquivalencia,@Param("tafna")Double tafna,@Param("volumen")Double volumen);

	@Query(value="select aseo.fn_historico_aforo_multiusuario(:aforo, :maestroVisitas, :tafna ,:volumen)", nativeQuery=true)
	public Long fnLiquidarAforoMultiusuario(@Param("aforo")Long aforo, @Param("maestroVisitas")Long maestroVisitas, @Param("tafna")Double tafna,@Param("volumen")Double volumen);

	
	@Query(value = "select distinct afo.afo_ideregistro aforoId,\n" +
			"iasus.iasus_nombreestablecimiento nombreEstablecimiento,\n" +
			"cast ( cast(dmaf.dmaf_fechavisita as date ) as varchar) as fechaVisita,\n" +
			"uni.uni_nombre1 claseAforo,\n" +
			"uni2.uni_nombre1 tipoAforo,\n" +
			"uni3.uni_nombre1 fuente,\n" +
			"dafo.dsus_ideregistr suscripcion,\n" +
			"cast(afo.afo_fecha as varchar) fechaAsignacion,\n" +
			"dsus.dsus_pcodigo codSusBio,\n" +
			"dmaf.dmaf_ideregistro visitaId,\n" +
			"dmaf.dmav_consecutivovisita visitaConsecutivo,\n" +
			"bar.barrio_nom barrio,\n" +
			"pro.pro_direccion direccion,\n" +
			"dmaf.dmaf_semanasecuencia semana,\n" +
			"afo.afo_numpqr radicado,\n" +
			"afom.afom_direccion direccionmulti\n" +
			"from aseo.dmaf_detallemaestrovisitas dmaf\n" +
			"inner join aseo.mafv_maestroaforovisitas mafv on mafv.mafv_ideregistro = dmaf.mafv_ideregistro\n" +
			"inner join aseo.afo_aforos afo on mafv.afo_ideregistro = afo.afo_ideregistro\n" +
			"inner join aseo.dafo_detaforo dafo on afo.afo_ideregistro = dafo.afo_ideregistro\n" +
			"inner join public.dsus_detsuscrip dsus on dafo.dsus_ideregistr=dsus.dsus_ideregistr\n" +
			"inner join public.uni_unidad uni on afo.uni_clasesuscripcionaforo=uni.uni_ideregistro\n" +
			"inner join public.uni_unidad uni2 on afo.uni_tipoaforo=uni2.uni_ideregistro\n" +
			"inner join public.pro_propiedad pro on dsus.pro_ideregistro=pro.pro_ideregistro\n" +
			"left join barrios bar on dsus.uni_barrio= bar.barrio_ideregistro\n" +
			"left join public.uni_unidad uni3 on afo.uni_complemento=uni3.uni_ideregistro\n" +
			"left join aseo.iasus_inforadicionalsuscripcion iasus on dsus.dsus_ideregistr= iasus.dsus_ideregistr\n" +
			"left join aseo.afom_afomultiusuario afom on afom.afo_ideregistro=afo.afo_ideregistro\n" +
			"where dmaf.ter_aforador=:idaforador\n" +
			"and dmaf_fechavisita=:fecha\n" +
			"and dmaf_estado='P' ",nativeQuery = true)
	List<Map<String,Object>> findVisitasAforosByUserAndFecha(@Param("idaforador") Integer idaforador,@Param("fecha") LocalDate fecha);

	@Query(value = "select uni_nombre1 nombreEstablecimiento\n" +
			"from aseo.afom_afomultiusuario afom\n" +
			"inner join aseo.afo_aforos afo on afom.afo_ideregistro = afo.afo_ideregistro\n" +
			"left join public.uni_unidad uni on afom.afom_complemento=uni_ideregistro\n" +
			"where afo.afo_ideregistro=:aforoid", nativeQuery = true)
	String findNombreEstablecimientoAfoMultiusuario(@Param("aforoid") Integer aforoid);


	@Query(value = "select afo.afo_ideregistro aforoId,\n" +
			"iasus.iasus_nombreestablecimiento nombreEstablecimiento,\n" +
			"uni.uni_nombre1 claseAforo,\n" +
			"uni2.uni_nombre1 tipoAforo,\n" +
			"uni3.uni_nombre1 fuente,\n" +
			"dafo.dsus_ideregistr suscripcion,\n" +
			"cast(afo.afo_fecha as varchar) fechaAsignacion,\n" +
			"dsus.dsus_pcodigo codSusBio,\n" +
			"dmaf.dmaf_ideregistro visitaId,\n" +
			"dmaf.dmav_consecutivovisita visitaConsecutivo\n" +
			"from aseo.dmaf_detallemaestrovisitas dmaf\n" +
			"inner join aseo.mafv_maestroaforovisitas mafv on mafv.mafv_ideregistro = dmaf.mafv_ideregistro\n" +
			"inner join aseo.afo_aforos afo on mafv.afo_ideregistro = afo.afo_ideregistro\n" +
			"inner join aseo.dafo_detaforo dafo on afo.afo_ideregistro = dafo.afo_ideregistro\n" +
			"inner join public.dsus_detsuscrip dsus on dafo.dsus_ideregistr=dsus.dsus_ideregistr\n" +
			"inner join public.uni_unidad uni on afo.uni_clasesuscripcionaforo=uni.uni_ideregistro\n" +
			"inner join public.uni_unidad uni2 on afo.uni_tipoaforo=uni2.uni_ideregistro\n" +
			"left join public.uni_unidad uni3 on afo.uni_complemento=uni3.uni_ideregistro\n" +
			"left join aseo.iasus_inforadicionalsuscripcion iasus on dsus.dsus_ideregistr= iasus.dsus_ideregistr\n" +
			"where dmaf.ter_aforador=:idaforador\n" +
			"and dmaf.dmaf_estado='T'\n" +
			"order by dmaf.dmaf_fechavisita desc ",nativeQuery = true)
	List<Map<String,Object>> findVisitasAforosRealizadasByUser(@Param("idaforador") Integer idaforador);

	@Query(value = "select afo.afo_ideregistro aforoId,\n" +
			"iasus.iasus_nombreestablecimiento nombreEstablecimiento,\n" +
			"uni.uni_nombre1 claseAforo,\n" +
			"uni2.uni_nombre1 tipoAforo,\n" +
			"uni3.uni_nombre1 fuente,\n" +
			"dafo.dsus_ideregistr suscripcion,\n" +
			"cast(afo.afo_fecha as varchar) fechaAsignacion,\n" +
			"dsus.dsus_pcodigo codSusBio,\n" +
			"dmaf.dmaf_ideregistro visitaId,\n" +
			"dmaf.dmav_consecutivovisita visitaConsecutivo,\n" +
			"dmaf_observaciones observacion\n" +
			"from aseo.dmaf_detallemaestrovisitas dmaf\n" +
			"inner join aseo.mafv_maestroaforovisitas mafv on mafv.mafv_ideregistro = dmaf.mafv_ideregistro\n" +
			"inner join aseo.afo_aforos afo on mafv.afo_ideregistro = afo.afo_ideregistro\n" +
			"inner join aseo.dafo_detaforo dafo on afo.afo_ideregistro = dafo.afo_ideregistro\n" +
			"inner join public.dsus_detsuscrip dsus on dafo.dsus_ideregistr=dsus.dsus_ideregistr\n" +
			"inner join public.uni_unidad uni on afo.uni_clasesuscripcionaforo=uni.uni_ideregistro\n" +
			"inner join public.uni_unidad uni2 on afo.uni_tipoaforo=uni2.uni_ideregistro\n" +
			"left join public.uni_unidad uni3 on afo.uni_complemento=uni3.uni_ideregistro\n" +
			"left join aseo.iasus_inforadicionalsuscripcion iasus on dsus.dsus_ideregistr= iasus.dsus_ideregistr\n" +
			"inner join public.per_periodo per on mafv.per_ideregistro=per.per_ideregistro\n" +
			"where dmaf.ter_aforador=:idaforador\n" +
			"and dmaf.dmaf_estado='C'\n" +
			"and :fecha <=per.per_fecfinal\n" +
			"order by dmaf.dmaf_fechavisita desc; ",nativeQuery = true)
	List<Map<String,Object>> findVisitasAforosCanceladasByUser(@Param("idaforador") Integer idaforador,@Param("fecha") LocalDate fecha);
	
	@Query(value= "select a.* from aseo.afo_aforos a \r\n" +
			"inner join aseo.dafo_detaforo d on d.afo_ideregistro=a.afo_ideregistro\r\n" +
			"where d.dsus_ideregistr=:dsus\r\n" +
			"and afo_estado=:estado",nativeQuery=true) /** Asignacion en proceso del aforo jlmendoza **/
	public List<Aforo> findAforoByDsusAndEstado(@Param("dsus") Long dsus,@Param("estado") String estado);
	
	@Query("SELECT a FROM Aforo a WHERE a.afoEstado =:estado")
	public List<Aforo> findAforoByEstado(String estado);
	
	@Query("SELECT a FROM Aforo a WHERE a.afoEstado =:estado and a.uniClasesuscripcionaforo =:uniclase")
	public List<Aforo> findAforoMultiusuarioByEstado(@Param("estado")String estado, @Param("uniclase") UniUnidad uniclase);

	@Query(value = "( "
			+ "  select "
			+ "    mm.afo_ideregistro as id_aforo, "
			+ "    dd.dmaf_ideregistro as id_visita, "
			+ "    dd.dmav_consecutivovisita as consecutivo_visita, "
			+ "    dd.dmaf_estado as estado, "
			+ "    'ACTUAL' as origen "
			+ "  from aseo.dmaf_detallemaestrovisitas dd "
			+ "  inner join aseo.mafv_maestroaforovisitas mm on mm.mafv_ideregistro = dd.mafv_ideregistro "
			+ "  where mm.afo_ideregistro = :id_aforo and dd.dmaf_ideregistro = :id_visita "
			+ "  group by id_aforo, id_visita, consecutivo_visita, estado, origen "
			+ ") "
			+ "union all "
			+ "( "
			+ "  select "
			+ "    mm.afo_ideregistro as id_aforo, "
			+ "    dd.hdmaf_ideregistro as id_visita, "
			+ "    dd.hdmav_consecutivovisita as consecutivo_visita, "
			+ "    dd.hdmaf_estado as estado, "
			+ "    'HISTORICO' as origen "
			+ "  from aseo.hdmaf_detallemaestrovisitas dd "
			+ "  inner join aseo.hmafv_maestroaforovisitas mm on mm.hmafv_ideregistro = dd.hmafv_ideregistro "
			+ "  where mm.afo_ideregistro = :id_aforo and dd.hdmaf_ideregistro = :id_visita "
			+ "  group by id_aforo, id_visita, consecutivo_visita, estado, origen "
			+ ") "
			+ "limit 1; ", nativeQuery = true)
	public Map<String,Object> findVisitaAforo(@Param("id_aforo") Integer id_aforo, @Param("id_visita") Integer id_visita);
}

