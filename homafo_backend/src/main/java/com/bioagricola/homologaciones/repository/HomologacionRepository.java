package com.bioagricola.homologaciones.repository;

import com.bioagricola.homologaciones.entity.HomologacionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

public interface HomologacionRepository extends JpaRepository<HomologacionEntity,Long>
{
	public static String esquemaAseo = "aseo";
	//@Query(value = "insert into usu_usuario (usu_username,usu_password,usu_estado) VALUES (:nombreUsuario, :password, :estado)",nativeQuery = true)
	//Integer insertarusuario(@Param("nombreUsuario") String nombreUsuario,@Param("password") String password,@Param("estado") String estado);
	
	@Query(value="SELECT  \n" +  
			"			dsus.dsus_pcodigo as pcodigo,  \n" + 
			"			ter.ter_documento as documento,   \n" + 
			"			ter.ter_nomcompleto as nombreCompleto, \n" + 
			"			pro.pro_direccion as direccion, \n" + 
			"			pro.pro_numcatastral, \n" + 
			"			dsus.pro_catestrato as estrato, \n" + 
			"			cic.cic_nombre as ciclo,  \n" + 
			"			CASE WHEN dsus.uni_tipusosuscr=6 THEN 'Residencial'  \n" + 
			"					 WHEN dsus.uni_tipusosuscr=5 THEN 'C'  \n" + 
			"					 WHEN dsus.uni_tipusosuscr=7 THEN 'I'  \n" + 
			"					 WHEN dsus.uni_tipusosuscr=197 THEN 'GNV'  \n" + 
			"					 END as tiposuo,   \n" + 
			"			dsus.dsus_fecinicio as inicio,  \n" + 
			"			dsus.sus_ideregistro as idesuscripcion  \n" +
			"			FROM dsus_detsuscrip dsus  \n" + 
			"			INNER JOIN ter_tercero ter ON ter.ter_ideregistro=dsus.ter_ideregistro  \n" + 
			"			INNER JOIN proyectos proy ON dsus.uni_municipio=proy.proyecto_ideregistro  \n" + 
			"			INNER JOIN barrios ba ON ba.barrio_ideregistro=dsus.uni_barrio  \n" + 
			"			INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro=pro.pro_ideregistro  \n" + 
			"			INNER JOIN cic_ciclo cic ON cic.cic_ideregistro=dsus.cic_ideregistro  \n" + 
			"			LEFT JOIN rusu_rutsuscrip rusu ON rusu.dsus_ideregistr = dsus.dsus_ideregistr  \n" + 
			"			LEFT JOIN rut_ruta rut ON rut.rut_ideregistro = rusu.rut_ideregistro  \n" + 
			"			WHERE rut.rut_ideregistro=1168",nativeQuery = true)
	List<Object[]> datosHomologacion(@Param("dsus") Integer nombreUsuario );
	
	@Query(value="SELECT\n" + 
			"dsus.sus_ideregistro as sus,\n" + 
			"ter.ter_documento as documento, \n" + 
			"ter.ter_nomcompleto as nombreCompleto,\n" + 
			"ter.uni_tiptercero as naturaleza,\n" + 
			"pro.pro_direccion as direccion,\n" + 
			"dsus.uni_barrio as barrio,\n" +  
			"pro.muba_sector as sector,\n" + 
			"depar.departamento_ideregistro as departamento,\n" + 
			"dsus.uni_municipio as ciudad,\n" + 
			"pro.pro_numcatastral as catastralAntes,\n" + 
			"pro.uni_cmpdireccion as complementoPropiedad,\n" + 
			"pro.pro_numcatastralnacional as castastralNuevo,\n" + 
			//"(	SELECT	COUNT(pro10.pro_ideregistro)	FROM pro_propiedad pro10	WHERE pro10.pro_numcatastralnacional =pro.pro_numcatastralnacional) as independencia,\n" + 
			"pro.pro_secuenciaindep, \n"+
			"pro.pro_nummatriculainmobiliaria as matriculaInmobiliaria,\n" + 
			"pro.pro_zona as ubicacion,\n" + 
			"dsus.uni_actsuscripc as actividadComercial,\n" + 
			"pro.pro_gpslatitud as latitid,\n" + 
			"pro.pro_gpslongitud as longitud,\n" + 
			"proy.proyecto_cod,\n" + 
			"dsus.dsus_ideregistr,\n" + 
			"ter.ter_ideregistro,\n" +
			"Cast(pro.uni_clasificacionvivienda as varchar), \n" +
			"pro.uni_cmpdireccion, \n" +
			"dsus.emp_ideregistro, \n" +
			"ter.ter_digverificacion,  \n" +
			"pro.pro_idepropieda, \n"+
			"uniTipo.uni_nombre1, \n"+
			"pro.pro_resolcatastral \n"+
			"FROM dsus_detsuscrip dsus\n" +
			"INNER JOIN ter_tercero ter ON ter.ter_ideregistro=dsus.ter_ideregistro\n" + 
			"INNER JOIN proyectos proy ON dsus.uni_municipio=proy.proyecto_ideregistro\n" + 
			"INNER JOIN barrios ba ON ba.barrio_ideregistro=dsus.uni_barrio\n" + 
			"INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro=pro.pro_ideregistro\n" + 
			"INNER JOIN cic_ciclo cic ON cic.cic_ideregistro=dsus.cic_ideregistro\n" + 
			"INNER JOIN uni_unidad natu ON ter.uni_tiptercero=natu.uni_ideregistro\n" + 
			"INNER JOIN departamentos depar ON depar.departamento_ideregistro=proy.departamento_ideregistro\n" + 
			"INNER JOIN est_estructura est ON est.est_ideregistro=pro.est_tippropieda\n" +
			"INNER JOIN uni_unidad uniTipo ON uniTipo.uni_ideregistro=ter.uni_tipidentifica \n"+
			"--LEFT JOIN muba_munbarrio muba ON muba.muba_ideregistr=pro.muba_sector\n" +
			"\n" + 
			"--INNER JOIN uni_unidad unitipo ON unitipo.uni_ideregistro=pro.uni_tippropieda\n" + 
			"--INNER JOIN muba_munbarrio muba ON muba.uni_barrio=ba.barrio_ideregistro\n" + 
			"WHERE dsus.dsus_ideregistr= :dsus",nativeQuery = true)
	List<Object[]> informacionBasica(@Param("dsus") Integer dsus );
	
	@Transactional
	@Modifying
	@Query(value="UPDATE\n" + 
			"ter_tercero \n" + 
			"SET ter_documento=:terDocumento , ter_nomcompleto= :terNomcompleto, uni_tiptercero =:naturaleza\n" + 
			"FROM dsus_detsuscrip\n" + 
			"WHERE dsus_detsuscrip.ter_ideregistro=ter_tercero.ter_ideregistro\n" + 
			"AND dsus_detsuscrip.dsus_ideregistr= :dsusIderegistr",nativeQuery = true)
	Integer updateTerTercero(@Param("terDocumento") String terDocumento, @Param("terNomcompleto") String terNomcompleto , @Param("naturaleza") Integer naturaleza, @Param("dsusIderegistr") Integer dsusIderegistr);
	
	@Transactional
	@Modifying
	@Query(value="UPDATE\n" + 
			"pro_propiedad\n" + 
			"SET pro_direccion = :direccion , pro_numcatastral = :catastralAntes , pro_numcatastralnacional=:castastralNuevo , pro_gpslatitud = :latitud ,pro_gpslongitud = :longitud, uni_municipio= :proyecto, uni_barrio = :barrio , pro_zona = :ubicacion , pro_nummatriculainmobiliaria = :matriculaInmobiliaria , uni_clasificacionvivienda = cast(:clasificacionVivienda as json) , uni_cmpdireccion = :complementoPropiedad , muba_sector = :sector  \n" +
			"FROM dsus_detsuscrip\n" + 
			"WHERE dsus_detsuscrip.pro_ideregistro=pro_propiedad.pro_ideregistro\n" + 
			"AND dsus_detsuscrip.dsus_ideregistr= :dsusIderegistr",nativeQuery = true)
	Integer updateProPropiedad(@Param("direccion") String direccion,  @Param("catastralAntes") String catastralAntes, @Param("castastralNuevo") String castastralNuevo, @Param("latitud") String latitud, @Param("longitud") String longitud ,@Param("dsusIderegistr") Integer dsusIderegistr, @Param("proyecto") Integer proyecto, @Param("barrio") Integer barrio , @Param("ubicacion") String ubicacion, @Param("matriculaInmobiliaria") String matriculaInmobiliaria, @Param("clasificacionVivienda") String clasificacionVivienda, @Param("complementoPropiedad") Integer complementoPropiedad , @Param("sector") Integer sector);
	
	@Transactional
	@Modifying
	@Query(value="UPDATE\n" + 
			"dsus_detsuscrip\n" + 
			"SET uni_barrio = :barrio , uni_municipio= :proyecto , uni_actsuscripc= :actividadComercial \n" + 
			"WHERE dsus_detsuscrip.dsus_ideregistr= :dsusIderegistr",nativeQuery = true)
	Integer updateDsusDetsuscrip(@Param("barrio") Integer barrio, @Param("proyecto") Integer proyecto ,@Param("dsusIderegistr") Integer dsusIderegistr, @Param("actividadComercial") Integer actividadComercial);
	
	////suscripcion
	
	@Query(value="SELECT\n" + 
			"dsus.dsus_estado as estado,\n" + 
			"CAST(to_char(dsus.dsus_fecinicio, 'YYYY-MM-DD') as varchar) as inicio,\n" + 
			"CAST(to_char(dsus.dsus_fecact, 'YYYY-MM-DD') as varchar) as fecha2,\n" + 
			"dsus.uni_municipio as municipio,\n" + 
			"dsus.uni_tipusosuscr as tipouso,\n" + 
			"dsus.pro_catestrato as estrato,\n" + 
			"dsus.cic_ideregistro as ciclo,\n" + 
			"aisus.iasus_cobrojuridico as cobro,\n" + 
			"dsus.uni_liquidacion as liquidacion,\n" + 
			"aisus.iasus_pagapeaje as peaje,\n" + 
			"aisus.iasus_referenciacomercial as referencia,\n" +
			"dsus.sus_ideregistro as sus_ideregistro,\n" +
			"dsus.dsus_ideregistr as dsus_ideregistr,\n" +
			"dsus.uni_barrio as uni_barrio, \n"+
			"pp.pro_resolcatastral as resolCatastral, \n" +
			"dd.dsus_ideregistr as dsusAlterno, \n" +
			"cics.cic_ideregistro as cicloAlterno, \n"+
			"dd.emp_ideregistro as empAlterno\n" +
			"FROM dsus_detsuscrip dsus\n" +
			"INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro=dsus.sus_ideregistro \n"+
			"left join dsus_detsuscrip dd on dd.sus_ideregistro = sus.sus_ideregistro and \n" +
			"dd.dsus_ideregistr <> dsus.dsus_ideregistr \n"+
			"left JOIN cic_ciclo cics ON cics.cic_ideregistro=dd.cic_ideregistro \n"+
			"LEFT JOIN "+esquemaAseo+".iasus_inforadicionalsuscripcion aisus ON aisus.sus_ideregistro=dsus.sus_ideregistro\n" +
			"left join pro_propiedad pp on pp.pro_ideregistro = dsus.pro_ideregistro\n" +
			"WHERE dsus.dsus_ideregistr= :dsus",nativeQuery = true)
	List<Object[]> informacionSuscripcion(@Param("dsus") Integer dsus );
	
	@Transactional
	@Modifying
	@Query(value="UPDATE\n" + 
			"dsus_detsuscrip\n" + 
			"SET dsus_estado = :dsus_estado , dsus_fecinicio= :dsus_fecinicio , dsus_fecact= :dsus_fecexpira , uni_municipio= :uni_municipio , uni_tipusosuscr = :uni_tipusosuscr ,  \n" + 
			"pro_catestrato = :pro_catestrato , cic_ideregistro = :cic_ideregistro , uni_liquidacion = :uni_liquidacion \n"+
			"WHERE dsus_detsuscrip.dsus_ideregistr= :dsusIderegistr",nativeQuery = true)
	Integer updateDsusDetsuscripSuscripcion(@Param("dsus_estado") String dsus_estado, @Param("dsus_fecinicio") Date dsus_fecinicio,@Param("dsus_fecexpira") Date dsus_fecexpira, @Param("uni_municipio") Integer uni_municipio, @Param("uni_tipusosuscr") Integer uni_tipusosuscr, @Param("pro_catestrato") Integer pro_catestrato, @Param("cic_ideregistro") Integer cic_ideregistro , @Param("uni_liquidacion") Integer uni_liquidacion ,@Param("dsusIderegistr") Integer dsusIderegistr);
	
	@Transactional
	@Modifying
	@Query(value="UPDATE\n" + 
			""+esquemaAseo+".iasus_inforadicionalsuscripcion \n" + 
			"SET iasus_cobrojuridico = :iasus_cobrojuridico , iasus_pagapeaje= :iasus_pagapeaje , iasus_referenciacomercial= :iasus_referenciacomercial \n" +
			"WHERE "+esquemaAseo+".iasus_inforadicionalsuscripcion.dsus_ideregistr= :dsus_ideregistr",nativeQuery = true)
			//"WHERE "+esquemaAseo+".iasus_inforadicionalsuscripcion.sus_ideregistro= :sus_ideregistro",nativeQuery = true)
	Integer updateDsusDetsuscripIasus(@Param("iasus_cobrojuridico") Boolean iasus_cobrojuridico, @Param("iasus_pagapeaje") Boolean iasus_pagapeaje , @Param("iasus_referenciacomercial") String iasus_referenciacomercial, @Param("dsus_ideregistr") Integer dsus_ideregistr);
	
	@Query(value="SELECT distinct \n" +
			"dsus_ideregistr,  \n" + 
			"cnre.cnre_ideregistr,  \n" + 
			"dsus.ter_ideregistro,  \n" + 
			"cnre.cnre_nombre, \n" + 
			"sus.sus_ideregistro, \n" + 
			"per.per_ideregistro,\n" + 
			"ter.ter_nomcompleto,\n" + 
			"dsus.dsus_pcodigo,\n" + 
			"pro.pro_direccion,\n" + 
			"pro.pro_numcatastral,pro.pro_idepropieda, pro.pro_ideregistro \n" +
			"from dsus_detsuscrip dsus  \n" + 
			"INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro=dsus.sus_ideregistro  \n" + 
			"INNER JOIN cnre_cnvrecaudo cnre ON cnre.cnre_ideregistr=sus.cnre_ideregistr \n" + 
			"INNER JOIN per_periodo per ON per.cic_ideregistro=dsus.cic_ideregistro \n" + 
			"INNER JOIN ter_tercero ter ON ter.ter_ideregistro=dsus.ter_ideregistro\n" + 
			"INNER JOIN pro_propiedad pro ON pro.pro_ideregistro=dsus.pro_ideregistro\n" + 
			"WHERE dsus.dsus_ideregistr= :dsus \n" + 
			"AND per.per_estado='A'",nativeQuery = true)
	List<Object[]> informacionHomologacion(@Param("dsus") Integer dsus);
	
	@Query(value="SELECT\n" + 
			"gh.ghom_ideregistr,\n" + 
			"dgho.dsus_ideregistr,\n" + 
			"dgho.emp_ideregistro,\n" + 
			"ter.ter_nomcompleto,\n" + 
			"dsus2.pro_catestrato,\n" + 
			"emp.empresa_nom,\n" + 
			"CAST(dgho.dgho_consumo as varchar),\n" + 
			"uni.uni_nombre1 as tipoUso , dsus2.dsus_pcodigo, pro.pro_idepropieda, to_char(gh.ghom_fecharegistro, 'YYYY-MM-DD'),gh.observaciones\n" + 
			"FROM aseo.ghom_gestionhomologa gh\n" + 
			"INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro=gh.sus_ideregistro\n" + 
			"INNER JOIN dsus_detsuscrip dsus ON dsus.sus_ideregistro=sus.sus_ideregistro\n" + 
			"INNER JOIN aseo.dgho_detallegestionhomologa dgho ON dgho.ghom_ideregistr=gh.ghom_ideregistr\n" + 
			"INNER JOIN dsus_detsuscrip dsus2 ON dsus2.dsus_ideregistr=dgho.dsus_ideregistr\n" + 
			"INNER JOIN ter_tercero ter ON dsus2.ter_ideregistro=ter.ter_ideregistro\n" + 
			"INNER JOIN empresas emp ON emp.empresa_sevemp=dsus2.emp_ideregistro\n" + 
			"INNER JOIN uni_unidad uni ON uni.uni_ideregistro=dsus2.uni_tipusosuscr\n" + 
			"INNER JOIN pro_propiedad pro ON pro.pro_ideregistro=dsus2.pro_ideregistro\n" + 
			"WHERE dsus.dsus_ideregistr= :dsus \n" + 
			"ORDER BY dgho.emp_ideregistro DESC\n" ,nativeQuery = true)
	List<Object[]> informacionHomologacionDetalle(@Param("dsus") Integer dsus);
	
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE dsus_detsuscrip SET sus_ideregistro= :suscripcionNueva WHERE sus_ideregistro= :suscripcionVieja",nativeQuery = true)
	Integer actualizarSuscripcion(@Param("suscripcionNueva") Integer suscripcionNueva, @Param("suscripcionVieja") Integer suscripcionVieja);
	
	@Modifying
	@Query(value="SELECT\n" + 
			"* \n" + 
			"FROM "+esquemaAseo+".fn_getparametroshomosolo(:empresa)\n" + 
			"",nativeQuery = true)
	List<Object[]> parametroValor(@Param("empresa") Integer empresa);
	
	@Query(value="SELECT\n" + 
			"dsus.dsus_ideregistr,\n" + 
			"dsus.dsus_pcodigo\n" + 
			"FROM dsus_detsuscrip dsus\n" + 
			"WHERE dsus.dsus_ideregistr= :dsus",nativeQuery = true)
	List<Object[]> informacionGestion(@Param("dsus") Integer dsus);
	
	@Query(value="SELECT\n" + 
			"recla.reclamo_fecsol,\n" + 
			"recla.reclamo_numpqr,\n" + 
			"recla.reclamo_obssol\n" + 
			"FROM reclamos recla\n" + 
			"INNER JOIN dsus_detsuscrip dsus ON dsus.dsus_pcodigo=recla.reclamo_codsus\n" + 
			"INNER JOIN empresas emp ON emp.empresa_cod=recla.reclamo_codemp\n" + 
			"WHERE dsus.dsus_ideregistr= :dsus \n" + 
			"AND emp.empresa_sevemp= :empresa\n" + 
			"AND reclamo_swtdes=FALSE\n" + 
			"",nativeQuery=true)
	List<Object[]> informacionReclamos(@Param("dsus") Integer dsus, @Param("empresa") Integer empresa);
	
	@Query(value="SELECT\n" + 
			"dsus.dsus_pcodigo,\n" + 
			"dsus.dsus_ideregistr,\n" + 
			"ter.ter_nomcompleto,\n" + 
			"pro.pro_direccion,\n" + 
			"ba.barrio_nom,\n" + 
			"dsus.dsus_estado,\n" + 
			"CAST(to_char(dsus.dsus_fecinicio, 'YYYY-MM-DD') as varchar) as inicio,\n" + 
			"CAST(to_char(dsus.dsus_fecact, 'YYYY-MM-DD') as varchar) as fechaact, \n" + 
			"pro.pro_numcatastral,\n" + 
			"pro.pro_numcatastralnacional,\n" + 
			"ter.ter_documento,\n" + 
			"emp.empresa_nom,\n" + 
			"cnre.cnre_nombre, \n" + 
			"pro.pro_idepropieda, \n" + 
			"sus.sus_ideregistro, \n" + 
			"cic.cic_nombre as ciclo, \n"+
			"uni.uni_nombre1 as tipoUso,  \n"+
			"dsus.pro_catestrato as estrato \n"+
			"FROM dsus_detsuscrip dsus\n" + 
			"INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro=pro.pro_ideregistro\n" + 
			"INNER JOIN ter_tercero ter ON ter.ter_ideregistro=dsus.ter_ideregistro\n" + 
			"INNER JOIN empresas emp ON emp.empresa_sevemp=dsus.emp_ideregistro\n" + 
			"INNER JOIN sus_suscripcion sus ON sus.sus_ideregistro=dsus.sus_ideregistro\n" + 
			"INNER JOIN cnre_cnvrecaudo cnre on cnre.cnre_ideregistr=sus.cnre_ideregistr\n" + 
			"INNER JOIN barrios ba ON ba.barrio_ideregistro=dsus.uni_barrio\n" +
			"INNER JOIN cic_ciclo cic ON cic.cic_ideregistro=dsus.cic_ideregistro \n"+
			"INNER JOIN uni_unidad uni ON uni.uni_ideregistro=dsus.uni_tipusosuscr \n"+
			"INNER JOIN\n" + 
			"(\n" + 
			"SELECT\n" + 
			"	DISTINCT empresa_sevemp as codigo,\n" + 
			"	empresa_nom\n" + 
			"	FROM dicn_disconven CONVENIOS\n" + 
			"	inner join empresas emp on emp.empresa_sevemp = CONVENIOS.emp_ideregistro\n" + 
			"	inner join lateral (\n" + 
			"	select\n" + 
			"	cnre_ideregistr,\n" + 
			"	emp_ideregistro\n" + 
			"	from dicn_disconven\n" + 
			"	where emp_ideregistro = :empresaAlt and CONVENIOS.cnre_ideregistr = cnre_ideregistr\n" + 
			"	) conveniosempresasesion on conveniosempresasesion.emp_ideregistro != CONVENIOS.emp_ideregistro\n" + 
			") alterna ON alterna.codigo=dsus.emp_ideregistro\n" + 
			"WHERE (pro.pro_numcatastral= :catastral OR ter.ter_documento= :tercero OR pro.pro_direccion= :direccion) order by dsus_fecact desc limit 10 ",nativeQuery=true)
	List<Object[]> cruceInformacion(@Param("catastral") String catastral, @Param("tercero") String tercero, @Param("direccion") String direccion,@Param("empresaAlt") Integer empresaAlt);
	
	@Query(value="SELECT\n" + 
			"dsus.dsus_ideregistr,\n" + 
			"dsus.emp_ideregistro,\n" + 
			"dsus.dsus_pcodigo,\n" + 
			"pro.pro_idepropieda\n" + 
			"FROM dsus_detsuscrip dsus\n" + 
			"INNER JOIN pro_propiedad pro ON pro.pro_ideregistro=dsus.pro_ideregistro\n" + 
			"WHERE dsus.sus_ideregistro= :suscripcion",nativeQuery = true)
	List<Object[]> buscarSuscripciones(@Param("suscripcion") Integer suscripcion);
	
	@Query(value="SELECT dsus.emp_ideregistro FROM dsus_detsuscrip dsus WHERE dsus.dsus_ideregistr= :dsus",nativeQuery = true)
	Integer buscarEmpresaDsus(@Param("dsus") Integer dsus);
	
	@Query(value="SELECT column_name                 \n" + 
			"FROM information_schema.columns    \n" + 
			"WHERE  table_name   = :tabla", nativeQuery = true)
	List<Object[]> columnasTabla(@Param("tabla") String tabla);
	
	@Query(value="select dc.cic_ideregistro from public.dsus_detsuscrip dd \r\n"
			+ "inner join public.dcic_detciclo dc on dc.dist_ideregistro = dd.cic_ideregistro \r\n"
			+ "where dd.dsus_ideregistr = :dsus_ideregistr  \r\n"
			+ "",nativeQuery = true)
	Integer buscarCicloLiquidacionSuscripcionAlterna(@Param("dsus_ideregistr") Integer dsus_ideregistr);
	
	
	@Transactional
	@Modifying
	@Query(value="INSERT INTO aseo.iasus_inforadicionalsuscripcion (sus_ideregistro,iasus_cobrojuridico,iasus_pagapeaje,iasus_referenciacomercial,dsus_ideregistr) values (:sus_ideregistro,:iasus_cobrojuridico,:iasus_pagapeaje,:iasus_referenciacomercial, :dsus_ideregistr)",nativeQuery = true)
	Integer insertDsusDetsuscripIasus(@Param("iasus_cobrojuridico") Boolean iasus_cobrojuridico, @Param("iasus_pagapeaje") Boolean iasus_pagapeaje , @Param("iasus_referenciacomercial") String iasus_referenciacomercial, @Param("dsus_ideregistr") Integer dsus_ideregistr, @Param("sus_ideregistro") Integer sus_ideregistro);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE dsus_detsuscrip SET dsus_fecact= :fecha WHERE dsus_ideregistr= :dsus",nativeQuery = true)
	Integer actualizarFechaSuscripcion(@Param("fecha") Date fecha, @Param("dsus") Integer dsus);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE dsus_detsuscrip SET dsus_fecact= :fecha, cic_ideregistro= :cic WHERE dsus_ideregistr= :dsus",nativeQuery = true)
	Integer actualizarFechaSuscripcionCicloLiquidacion(@Param("fecha") Date fecha, @Param("dsus") Integer dsus, @Param("cic") Integer cic);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE dsus_detsuscrip SET sus_ideregistro= :suscripcionNueva WHERE dsus_ideregistr= :dsus_ideregistr",nativeQuery = true)
	Integer actualizardsusDeshomologacion(@Param("suscripcionNueva") Integer suscripcionNueva, @Param("dsus_ideregistr") Integer dsus_ideregistr);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE dsus_detsuscrip SET sus_ideregistro= :suscripcionNueva,cic_ideregistro= :dcic_ideregistro WHERE dsus_ideregistr= :dsus_ideregistr",nativeQuery = true)
	Integer actualizardsusDeshomologacionDatos(@Param("suscripcionNueva") Integer suscripcionNueva, @Param("dsus_ideregistr") Integer dsus_ideregistr, @Param("dcic_ideregistro") Integer dcic_ideregistro);
	
	
}
