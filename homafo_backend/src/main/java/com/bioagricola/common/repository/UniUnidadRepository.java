package com.bioagricola.common.repository;

import com.bioagricola.common.entity.UniUnidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository("unidadRespository")
public interface UniUnidadRepository extends JpaRepository<UniUnidad, Long>, JpaSpecificationExecutor<UniUnidad> {
    @Query(value = "SELECT\n" +
            "uni.uni_ideregistro as ide,\n" +
            "uni.uni_nombre1 as nombre,\n" +
            "uni.uni_orden as orden,\n" +
            "uni.uni_codigo1 as codigo,\n" +
            "CAST(uni.uni_propiedad->>'estado' AS VARCHAR), \n" +
            "uni.uni_nombre2 as nombre2 \n" +
            "FROM uni_unidad uni\n" +
            "INNER JOIN est_estructura est ON est.est_ideregistro=uni.est_ideregistro\n" +
            "INNER JOIN esem_estempresa esem ON esem.est_ideregistro=est.est_ideregistro\n" +
            "WHERE est.cla_ideregistro= :clase --26--63\n" +
            "AND esem.emp_ideregistro= :empresa \n" +
            "ORDER BY uni.uni_orden ASC", nativeQuery = true)
    List<Object[]> informacionUnidad(@Param("clase") Integer clase, @Param("empresa") Integer empresa);

    @Query(value = "SELECT\n" +
            "clte.clte_ideregistr,\n" +
            "uni.uni_ideregistro,\n" +
            "uni.uni_nombre1,\n" +
            "uni.uni_orden,\n" +
            "uni.uni_codigo1,\n" +
            "clte.ter_ideregistro\n" +
            "FROM clte_clatercero clte\n" +
            "INNER JOIN uni_unidad uni ON uni.uni_ideregistro=clte.uni_clatercero\n" +
            "INNER JOIN est_estructura est ON est.est_ideregistro=uni.est_ideregistro\n" +
            "INNER JOIN esem_estempresa esem ON esem.est_ideregistro=est.est_ideregistro\n" +
            "WHERE est.cla_ideregistro= :clase \n" +
            "AND esem.emp_ideregistro= :empresa \n" +
            "AND clte.ter_ideregistro= :tercero \n" +
            "ORDER BY uni.uni_nombre1 ASC", nativeQuery = true)
    List<Object[]> informcionUnidadTercero(@Param("clase") Integer clase, @Param("empresa") Integer empresa, @Param("tercero") Integer tercero);


    @Query("SELECT uni FROM UniUnidad uni "
            + "INNER JOIN EstEstructura est ON est.estIderegistro = uni.estIderegistro.estIderegistro "
            + "INNER JOIN EsemEstempresa esem ON esem.estIderegistro.estIderegistro = est.estIderegistro "
            + "WHERE est.claIderegistro.claIderegistro = :clase "
            + "AND esem.empIderegistro = :empresa")
    List<UniUnidad> findByClaseAndEmpresa(@Param("clase") Integer clase, @Param("empresa") Integer empresa);

//	@Query(value="SELECT uni.*\r\n" + 
//			"FROM clte_clatercero clte \r\n" + 
//			"INNER JOIN uni_unidad uni ON uni.uni_ideregistro=clte.uni_clatercero \r\n" + 
//			"INNER JOIN est_estructura est ON est.est_ideregistro=uni.est_ideregistro \r\n" + 
//			"INNER JOIN esem_estempresa esem ON esem.est_ideregistro=est.est_ideregistro \r\n" + 
//			"WHERE --est.cla_ideregistro= :clase AND \r\n" + 
//			"esem.emp_ideregistro= :empresa \r\n" + 
//			"--AND clte.ter_ideregistro= :terId ", nativeQuery=true)
//	List<UniUnidad> findByClaseAndEmpresa(@Param("empresa") Long empresa);

    @Query(value = "select * from uni_unidad uu where uni_idepadre in (17, 20)", nativeQuery = true)
    List<UniUnidad> findUnidadesTipoPersona();

    @Query(value = "select * from uni_unidad uu where est_ideregistro = 53", nativeQuery = true)
    List<UniUnidad> findUnidadesTipoIdentificacion();

    @Query("SELECT uni FROM UniUnidad uni WHERE uni.estIderegistro.estIderegistro = :estId")
    List<UniUnidad> findUnitsByEstId(@Param("estId") Long estId);
    
    @Query(value = "SELECT * FROM uni_unidad uu WHERE uu.est_ideregistro  = :estId and uu.uni_propiedad ->> 'estado' = 'A'" , nativeQuery = true)
    List<UniUnidad> findUnitsByEstIdCondicion(@Param("estId") Long estId);
    
    @Query(value = "SELECT * FROM uni_unidad uu inner join liq_liquidacion ll on ll.uni_liquidacion = uu.uni_ideregistro \n"
    		+ "and ll.liq_venclasific = 'LI' INNER JOIN esem_estempresa esem ON esem.est_ideregistro=uu.est_ideregistro \n"
    		+" inner join public.tido_tipdocumen tt on tt.uni_tipdocument = ll.uni_tipdocument \r\n"
    		+ "and tt.tido_estado = 'A' \r\n"
    		+ "WHERE uu.est_ideregistro  = :estId and esem.emp_ideregistro = :idEmp " , nativeQuery = true)
    List<UniUnidad> findUnitsByEstIdCondicionLiquidacion(@Param("estId") Long estId,@Param("idEmp")Long idEmp);

    @Query(value = "select * from uni_unidad where est_ideregistro=:estructura and uni_nombre1=:uniNombre", nativeQuery = true)
    List<UniUnidad> findByEstructuraAndUniNombre1(@Param("estructura") Long estructura, @Param("uniNombre") String uniNombre);

    @Query(value = "select * from uni_unidad where est_ideregistro=21", nativeQuery = true)
    List<UniUnidad> findTiposUsos();

    @Query(value = "SELECT uni.* \r\n" +
            "FROM uni_unidad uni \r\n" +
            "INNER JOIN est_estructura est ON est.est_ideregistro=uni.est_ideregistro \r\n" +
            "INNER JOIN esem_estempresa esem ON esem.est_ideregistro=est.est_ideregistro \r\n" +
            "WHERE est.cla_ideregistro= :clase \r\n" +
            "AND esem.emp_ideregistro= :empresa \r\n" +
            "ORDER BY uni.uni_orden asc", nativeQuery = true)
    List<UniUnidad> findByEmpresaAndClase(@Param("empresa") Long empresa, @Param("clase") Long clase);

    @Query(value = "select * from uni_unidad where est_ideregistro = :estTipoUbucacion", nativeQuery = true)
    List<UniUnidad> findUbicaciones(@Param("estTipoUbucacion") Long estTipoUbucacion);

    @Query(value = "select * from uni_unidad where est_ideregistro = :estActividad", nativeQuery = true)
    List<UniUnidad> findActividades(@Param("estActividad") Long estActividad);

    Optional<UniUnidad> findFirstByUniCodigoOrUniNombre1IgnoreCase(String uniCodigo, String uniNombre1);

    @Query(value = "select\n" +
            "un.uni_ideregistro ,\n" +
            "un.uni_nombre1, un.uni_orden, un.uni_codigo1, CAST(un.uni_propiedad->>'estado' AS VARCHAR) \n" +
            "from\n" +
            "prun_prgunidad pp\n" +
            "inner join uspu_usuprgunid uu on\n" +
            "uu.prun_ideregistr = pp.prun_ideregistr\n" +
            "inner join uni_unidad un on\n" +
            "un.uni_ideregistro = pp.uni_ideregistro\n" +
            "inner join est_estructura est on\n" +
            "est.est_ideregistro = un.est_ideregistro\n" +
            "inner join esem_estempresa esem on\n" +
            "esem.est_ideregistro = un.est_ideregistro\n" +
            "where\n" +
            "esem.emp_ideregistro =:idempresasesion\n" +
            "and uu.usu_ideregistro =:idusuariosesion\n" +
            "and pp.prg_ideregistro =:idprograma\n" +
            "and est.cla_ideregistro =:param_clase_estados ", nativeQuery = true)
    List<Object[]> unidadesUspuClase(@Param("idempresasesion") Integer idempresasesion, @Param("idusuariosesion") Integer idusuariosesion, @Param("idprograma") Integer idprograma, @Param("param_clase_estados") Integer param_clase_estados);

    /**
     * Consulta nombre por id de unidad
     *
     * @param unitId id de unidad
     * @return nombre de unidad
     */
    @Query(value = "select uni.uni_nombre1 from uni_unidad uni where uni.uni_ideregistro=:unitId", nativeQuery = true)
    String findNameByUnit(@Param("unitId") Long unitId);
    
    @Query(value = "select upper(uni.uni_nombre1) as valor from uni_unidad uni where uni.est_ideregistro=:estructura and uni.uni_codigo1=:uni_codigo1", nativeQuery = true)
    String findNameByEstAndUniCodigo1(@Param("estructura") Integer estructura, @Param("uni_codigo1") String uni_codigo1);

    /**
     * Consulta unidades por id de programa y empresa
     *
     * @param prg       id de programa
     * @param idEmpresa id de empresa
     * @return listado de unidades
     */
    @Query(value = "select cla.cla_ideregistro,uni.uni_ideregistro,uni.uni_nombre1 as name " +
            "from est_estructura est " +
            "inner join uni_unidad uni on est.est_ideregistro = uni.est_ideregistro " +
            "inner join prun_prgunidad prun on prun.uni_ideregistro=uni.uni_ideregistro " +
            "inner join esem_estempresa esem on est.est_ideregistro = esem.est_ideregistro  " +
            "inner join cla_clase cla on est.cla_ideregistro = cla.cla_ideregistro  " +
            "where prun.prg_ideregistro =:prg and uni_nivel=1 and esem.emp_ideregistro=:idEmpresa ", nativeQuery = true)
    List<Object[]> findUnitsByProgram(@Param("prg") Integer prg, @Param("idEmpresa") Integer idEmpresa);

    /**
     * Consulta unidades hijas por el id de la unidad padre
     *
     * @param idUnidad id de la unidad padre
     * @return listado de unidades hijas
     */
    @Query(value = "select est.est_ideregistro,uni.uni_ideregistro,uni.uni_nombre2 as name  " +
            "from est_estructura est  " +
            "inner join uni_unidad uni on est.est_ideregistro = uni.est_ideregistro  " +
            "where uni.uni_idepadre=:idUnidad ", nativeQuery = true)
    List<Object[]> findUnitsByUnitFather(@Param("idUnidad") Integer idUnidad);

    /**
     * Consulta de municipios por id de usuario y empresa
     *
     * @param idEmpresa id de empresa
     * @return listado de municipios
     */
    @Query(value = "select distinct pro.proyecto_ideregistro,pro.proyecto_nom from proyectos pro  " +
            "inner join empresas emp on pro.proyecto_codemp=emp.empresa_cod  " +
            "where emp.empresa_sevemp=:idEmpresa and pro.proyecto_estado = 'A'  " +
            "order by pro.proyecto_nom,pro.proyecto_ideregistro ", nativeQuery = true)
    List<Object[]> findMunicipiosByUserAndEnt(@Param("idEmpresa") Integer idEmpresa);

    /**
     * Consulta barrios por municipio y empresa
     *
     * @param idMunicipio id municipio
     * @return lista de barrios
     */
    @Query(value = "select bar.barrio_ideregistro,bar.barrio_nom, bar.barrio_zona_riesgo " +
            "from barrios bar " +
            "inner join public.proyectos p on p.proyecto_ideregistro = :idMunicipio " +
            "where bar.barrio_codemp = p.proyecto_codemp " +
            "order by barrio_nom asc", nativeQuery = true)
    List<Object[]> findBarriosByMunAndEnt(@Param("idMunicipio") Integer idMunicipio);

    /**
     * Consulta barrios por municipio y empresa
     *
     * @param idMunicipio id municipio
     * @param idEmpresa   id empresa
     * @return lista de barrios
     */
    @Query(value = "select bar.barrio_ideregistro,bar.barrio_nom " +
            "from barrios bar " +
            "INNER JOIN empresas emp on emp.empresa_cod = barrio_codemp and emp.empresa_sevemp =:idEmpresa " +
            "inner join muba_munbarrio muba on bar.barrio_ideregistro=muba.uni_barrio " +
            "where muba.uni_municipio=:idMunicipio " +
            "order by barrio_nom ", nativeQuery = true)
    List<Object[]> findBarriosByMunAndEnt(@Param("idMunicipio") Integer idMunicipio, @Param("idEmpresa") Integer idEmpresa);


    /**
     * Consulta de complementos de direccion por municipio y barrio
     *
     * @param idMunicipio id de municipio
     * @param idBarrio    id de barrio
     * @return listado de complementos
     */
    @Query(value = "select uni.uni_ideregistro,uni.uni_nombre1 " +
            "from muba_munbarrio muba " +
            "inner join mbcd_munbardirec mbcd on mbcd.muba_ideregistr=muba.muba_ideregistr " +
            "inner join uni_unidad uni on uni.uni_ideregistro=mbcd.uni_ideregistro " +
            "where muba.uni_municipio =:idMunicipio and muba.uni_barrio=:idBarrio", nativeQuery = true)
    List<Object[]> findCompDirecByMunBar(@Param("idMunicipio") Integer idMunicipio, @Param("idBarrio") Integer idBarrio);

    /**
     * Consulta lista de conceptos por programa,liquicacion, detalle suscripcion y empresa
     *
     * @param idprograma    id programa
     * @param idliquidacion id liquidacion
     * @param dsusid        detalle suscripcion id
     * @param idempresa     id empresa
     * @return lista de conceptos
     */
    @Query(value = "select distinct con.uni_concepto idconcepto,con.con_nombre concepto, con.con_tipregistro tiporegistro,con.con_valor valor,  " +
            "con.con_valor valorunitario,con.con_tipcalculo tipocalculo,con.con_financiable financiable  " +
            "from con_concepto con  " +
            "inner join coli_conliquida coli on con.uni_concepto=coli.uni_concepto  " +
            "where con.prg_ideregistro=:idprograma and coli.uni_liquidacion in (:idliquidacion)  " +
            "and con.con_estado = 'A' and  (case when con.con_finvigencia is null then con.con_finvigencia is null else con.con_finvigencia> cast(now() as date) end)  " +
            "and con.uni_concepto not in (select uni_concepto from cosu_consuscrip where dsus_ideregistr=:dsusid)  " +
            "UNION  " +
            "SELECT  " +
            "con.uni_concepto idconcepto,con.con_nombre concepto, con.con_tipregistro tiporegistro,con.con_valor valor,  " +
            "con.con_valor valorunitario,con.con_tipcalculo tipocalculo,con.con_financiable financiable  " +
            "from con_concepto con  " +
            "INNER JOIN est_estructura est on con.est_concepto=est.est_ideregistro  " +
            "inner join esem_estempresa esem on esem.est_ideregistro=est.est_ideregistro  " +
            "inner join cla_clase cla on cla.cla_ideregistro=est.cla_ideregistro  " +
            "where cla.cla_ideregistro =46  " +
            "and esem.emp_ideregistro=:idempresa  " +
            "and con.prg_ideregistro =:idprograma ", nativeQuery = true)
    List<Object[]> findConceptosByProgAndLiqAndDsusAndEmp(@Param("idprograma") Integer idprograma, @Param("idliquidacion") Integer idliquidacion, @Param("dsusid") Long dsusid, @Param("idempresa") Integer idempresa);

    /**
     * Consulta tipos de suscripcion por el id de convenio del suscriptor
     *
     * @param idconvenio
     * @return listado tipos de suscripcion
     */
    @Query(value = "select distinct tsu.uni_tipsuscripc,tsu.tsu_nombre  " +
            "from tsu_tipsuscripc tsu inner join esem_estempresa esem on tsu.est_tipsuscripc=esem.est_ideregistro  " +
            "inner join dicn_disconven dicn on tsu.uni_tipsuscripc=dicn.uni_tipsuscripc  " +
            "inner join muts_muntipsusc muts on tsu.uni_tipsuscripc=muts.uni_tipsuscripc  " +
            "where esem.emp_ideregistro=:idempresa and dicn.cnre_ideregistr=:idconvenio and muts.uni_municipio=:idmunicipio  ", nativeQuery = true)
    List<Object[]> findTiposSusByConvenio(@Param("idconvenio") Integer idconvenio, @Param("idempresa") Integer idempresa, @Param("idmunicipio") Integer idmunicipio);

    /**
     * Consulta de tipos de documento liquidacion
     *
     * @param idUsuario     id usuario
     * @param idPrograma    id programa
     * @param idEmpresa     id empresa
     * @param idSuscripcion id tipo uso suscripcion
     * @param idMunicipio   id de municipio
     * @return lista tipos de documento
     */
    @Query(value = "select " +
            "distinct doti.uni_tipdocument idtipodocumento, uni.uni_nombre1 tipodocumento " +
            "from doti_doctipo doti inner join doc_documento doc on doti.uni_documento=doc.uni_documento " +
            "inner join prun_prgunidad prun on prun.uni_ideregistro=doti.uni_tipdocument " +
            "inner join uspu_usuprgunid uspu on uspu.prun_ideregistr=prun.prun_ideregistr " +
            "inner join uni_unidad uni on uni.uni_ideregistro=doti.uni_tipdocument " +
            "inner join esem_estempresa esem on esem.est_ideregistro=doti.est_tipdocument " +
            "INNER JOIN liq_liquidacion liq on liq.uni_tipdocument=doti.uni_tipdocument " +
            "inner join limu_liqmunicipio limu on limu.uni_liquidacion = liq.uni_liquidacion " +
            "INNER JOIN lius_liquso lius on lius.uni_liquidacion=liq.uni_liquidacion " +
            "where  liq.liq_venclasific in ('VE','CA','CO','PV','CM') and uspu.usu_ideregistro=:idusuario " +
            "and prun.prg_ideregistro=:idprograma and esem.emp_ideregistro=:idempresa " +
            "and lius.uni_tipusosuscr=:idtipousosuscripcion and limu.uni_municipio=:idmunicipio", nativeQuery = true)
    List<Object[]> findDocumentType(@Param("idusuario") Integer idUsuario, @Param("idprograma") Integer idPrograma, @Param("idempresa") Integer idEmpresa,
                                    @Param("idtipousosuscripcion") Integer idSuscripcion, @Param("idmunicipio") Integer idMunicipio);

    /**
     * Consulta estructura por ide de unidad
     *
     * @param unitId id unidad
     * @return id de estructura
     */
    @Query(value = "select uni.est_ideregistro from uni_unidad uni where uni.uni_ideregistro=:unitId", nativeQuery = true)
    Integer findEstByUnit(@Param("unitId") Long unitId);

    /**
     * Consulta de unidades de programa por usuario
     *
     * @param idprograma id de programa
     * @param idusuario  id de usuario
     * @return lista de unidades
     */
    @Query(value = "select uni.uni_ideregistro id, uni.uni_nombre1 nombre " +
            "from uspu_usuprgunid uspu " +
            "inner join prun_prgunidad prun on prun.prun_ideregistr = uspu.prun_ideregistr " +
            "inner join uni_unidad uni on prun.uni_ideregistro = uni.uni_ideregistro " +
            "where uspu.usu_ideregistro=:idusuario " +
            "and prun.prg_ideregistro=:idprograma", nativeQuery = true)
    List<Object[]> findUnidadesUsuarioPrograma(@Param("idprograma") Integer idprograma, @Param("idusuario") Integer idusuario);

    /**
     * Consulta nombre de municipio por id
     *
     * @param idMun id municipio
     * @return nombre municipio
     */
    @Query(value = "select distinct pro.proyecto_nom  " +
            "from  proyectos pro  " +
            "where pro.proyecto_ideregistro=:idMun ", nativeQuery = true)
    String findNomMunById(Long idMun);

    /**
     * Consulta de nombre de barrio por id
     *
     * @param idbarrio id barrio
     * @return nombre barrio
     */
    @Query(value = "select distinct bar.barrio_nom  " +
            "from barrios bar  " +
            "where bar.barrio_ideregistro=:idbarrio ", nativeQuery = true)
    String findNomBarrioById(Long idbarrio);

    @Query(value = "select cast (par.par_parametro as varchar) from par_parametro par where par.emp_ideregistro=:idempresa", nativeQuery = true)
    String findParametrosById(@Param("idempresa") Integer idempresa);

    /**
     * Consulta cod municipio y cod barrio por id de barrio
     *
     * @param idBarrio id de barrio
     * @return cod municipio, cod barrio
     */
    @Query(value = "select bar.barrio_codpro as codmun, barrio_cod as codbar  " +
            "from barrios bar  " +
            "where bar.barrio_ideregistro =:idBarrio ", nativeQuery = true)
    Map<String, String> findProyCodAndMunCodByIdBarrio(Integer idBarrio);

    /**
     * Consulta de conceptos de liquidaciones
     *
     * @param idLiquidaciones lista ids liquidaciones
     * @return listado de conceptos
     */
    @Query(value = "SELECT DISTINCT  " +
            "con.uni_concepto idconcepto,  " +
            "con.con_nombre concepto,  " +
            "con.con_tipregistro tiporegistro,  " +
            "con.con_valor valor,  " +
            "con.con_valor valorunitario,  " +
            "con.con_tipcalculo tipocalculo,  " +
            "con.con_financiable financiable,  " +
            "con.con_valnulo eliminar,  " +
            "CASE WHEN ( con.prg_ideregistro = 18 AND con.con_tipcalculo = 'V' AND con.con_tipregistro <> 'U') THEN 'S'  " +
            "WHEN (  " +
            "con.prg_ideregistro = 18 AND con.con_tipcalculo = 'V' AND con.con_tipregistro = 'U' AND con.con_valor IS NULL) THEN 'S' ELSE 'N' END editable,  " +
            " (  " +
            "SELECT ccoli.uni_liquidacion FROM coli_conliquida ccoli WHERE  " +
            "ccoli.uni_concepto = con.uni_concepto AND ccoli.uni_liquidacion in (:idLiquidaciones)  " +
            "ORDER BY ccoli.uni_liquidacion  " +
            "LIMIT 1  " +
            ") idliquidacion  " +
            "FROM con_concepto con INNER JOIN coli_conliquida coli ON con.uni_concepto = coli.uni_concepto  " +
            "WHERE coli.uni_liquidacion IN (:idLiquidaciones) AND con.con_estado = 'A' AND (  " +
            "CASE WHEN con.con_finvigencia IS NULL THEN con.con_finvigencia IS NULL  " +
            "ELSE con.con_finvigencia >= cast(now() as DATE) END ) ORDER BY idliquidacion,con.con_nombre;", nativeQuery = true)
    List<Map<String, Object>> findConceptosLiquidaciones(@Param("idLiquidaciones") List<Integer> idLiquidaciones);

    @Query(value = "SELECT\n" +
            "uni.uni_ideregistro as llave,\n" +
            "uni.uni_nombre1 as valor\n" +
            "FROM uni_unidad uni\n" +
            "INNER JOIN est_estructura est ON est.est_ideregistro=uni.est_ideregistro\n" +
            "INNER JOIN esem_estempresa esem ON esem.est_ideregistro=est.est_ideregistro\n" +
            "WHERE est.cla_ideregistro= :clase\n" +
            "AND esem.emp_ideregistro= :empresa\n" +
            "ORDER BY uni.uni_orden ASC", nativeQuery = true)
    List<Map<String,Object>> findUnidadesByClaseAndEmpresa(@Param("clase") Integer clase, @Param("empresa") Integer empresa);

    @Query(value = "SELECT uni.uni_ideregistro as llave,\n" +
            "uni.uni_nombre1 as valor\n" +
            "FROM uni_unidad uni\n" +
            "INNER JOIN est_estructura est ON est.est_ideregistro=uni.est_ideregistro\n" +
            "INNER JOIN esem_estempresa esem ON esem.est_ideregistro=est.est_ideregistro\n" +
            "WHERE est.est_ideregistro= :estructura\n" +
            "AND esem.emp_ideregistro= :empresa and cast((uni.uni_propiedad ->> 'estado') as text) = 'A' \n" +
            "ORDER BY uni.uni_orden ASC", nativeQuery = true)
    List<Map<String,Object>> findUnidadesByEstAndEmpresa(@Param("estructura") Integer estructura, @Param("empresa") Integer empresa);

    @Query(value = "SELECT uni.uni_codigo1 as llave,\n" +
            "upper(uni.uni_nombre1) as valor\n" +
            "FROM uni_unidad uni\n" +
            "INNER JOIN est_estructura est ON est.est_ideregistro=uni.est_ideregistro\n" +
            "INNER JOIN esem_estempresa esem ON esem.est_ideregistro=est.est_ideregistro\n" +
            "WHERE est.est_ideregistro= :estructura\n" +
            "AND esem.emp_ideregistro= :empresa \n" +
            "ORDER BY cast(uni.uni_codigo1 as int) ASC", nativeQuery = true)
    List<Map<String,Object>> findEstratosByEstAndEmp(@Param("estructura") Integer estructura, @Param("empresa") Integer empresa);
    
    @Query(value = "select cnre.cnre_ideregistr, cnre.cnre_nombre  " +
            "       from cnre_cnvrecaudo cnre  " +
            "       inner join dicn_disconven dicn on dicn.cnre_ideregistr=cnre.cnre_ideregistr  " +
            "       inner join tsu_tipsuscripc tsu on tsu.tsu_ideregistro = dicn.uni_tipsuscripc  " +
            "       inner join esem_estempresa esem on esem.est_ideregistro = tsu.est_tipsuscripc  " +
            "       inner join prun_prgunidad prun on  prun.uni_ideregistro=dicn.uni_tipsuscripc  " +
            "       inner join uspu_usuprgunid uspu on uspu.prun_ideregistr=prun.prun_ideregistr  " +
            "       where dicn.emp_ideregistro= :codEmp and esem.emp_ideregistro = :codEmp  " +
            "             and uspu.usu_ideregistro= :usuario and prun.prg_ideregistro=58", nativeQuery = true)
    List<Object[]> findConveniosByEmp(@Param("codEmp") Integer codEmp, @Param("usuario") Integer usuario);

    @Query(value = "select tt.ter_ideregistro, tt.ter_nomcompleto from ter_tercero tt " +
            "inner join clte_clatercero cc on cc.ter_ideregistro = tt.ter_ideregistro " +
            "inner join uni_unidad uu on cc.uni_clatercero = uu.uni_ideregistro " +
            "inner join est_estructura ee on ee.est_ideregistro = uu.est_ideregistro " +
            "where uu.uni_ideregistro =:uniId ", nativeQuery = true)
    List<Object[]> getAllEnterprisesByUnitId(@Param("uniId") Integer uniId);

    @Query(value = "select cc.cnre_ideregistr llave,cc.cnre_nombre valor\n" +
            "from public.dicn_disconven dicn\n" +
            "inner join cnre_cnvrecaudo cc on dicn.cnre_ideregistr = cc.cnre_ideregistr\n" +
            "where dicn.emp_ideregistro=:empresa", nativeQuery = true)
    List<Map<String, Object>> findSegmentosFacturacion(@Param("empresa") Integer empresa);

    @Query(value = "select uni.uni_ideregistro llave, uni_nombre1 valor, muba.uni_barrio idbarrio  " +
            "from uni_unidad uni  " +
            "inner join mbcd_munbardirec mbcd on mbcd.uni_ideregistro=uni.uni_ideregistro  " +
            "inner join  muba_munbarrio muba on mbcd.muba_ideregistr = muba.muba_ideregistr  " +
            "where uni.est_ideregistro=:estructura ", nativeQuery = true)
    List<Map<String,Object>> findComplementosBarriosBio(@Param("estructura") Integer estructura);
    
    
    @Query(value = "SELECT ta.*,da.dtafo_frecuencia,da.dtafo_cantidad_visitas,fre_dias.tfd_ideregistro, "
    		+ " fre_dias.tdf_descripcion, fre_dias.tfv_ideregistro, cast(fre_dias.dis_diassemana as text) "    		
    		+ "FROM public.uni_unidad uni  "
    		+ "INNER JOIN public.est_estructura est ON est.est_ideregistro = uni.est_ideregistro   "
    		+ "INNER JOIN public.esem_estempresa esem ON esem.est_ideregistro = est.est_ideregistro   "
    		+ "INNER JOIN aseo.tafo_tipo_aforo ta ON ta.tafo_ideregistro = uni.uni_ideregistro \r\n"
    		+ "INNER JOIN aseo.dtafo_deta_tipo_aforo da ON da.tafo_ideregistro = ta.tafo_ideregistro  "
    		+ "INNER JOIN LATERAL ( SELECT * FROM aseo.tfd_tipo_frecuencia_dias tf  "
    		+ "    WHERE tf.tfv_ideregistro = 3 ) fre_dias ON true "
    		+ "WHERE est.cla_ideregistro = :clase   "
    		+ "  AND esem.emp_ideregistro = :empresa "
    		+ "  AND da.dtafo_frecuencia = jsonb_array_length(CAST(fre_dias.dis_diassemana AS jsonb)) "
    		+ "ORDER BY uni.uni_orden ASC", nativeQuery = true)
    List<Object []> findTipoAforosAndFrecuenciasByClase(@Param("empresa") Long empresa, @Param("clase") Long clase);
    

}
