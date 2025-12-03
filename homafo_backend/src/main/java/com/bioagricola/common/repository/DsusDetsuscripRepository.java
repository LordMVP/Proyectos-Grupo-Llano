package com.bioagricola.common.repository;

import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.hya.dto.CosuConsuscripDTO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.persistence.Tuple;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository("dsusDetsuscripRepository")
@Transactional
public interface DsusDetsuscripRepository extends JpaRepository<DsusDetsuscrip, Long>, JpaSpecificationExecutor<DsusDetsuscrip> {

    @Query(value = "select\r\n" +
            "	clientes.* \r\n" +
            "from  \r\n" +
            "	dsus_detsuscrip clientes\r\n" +
            "	inner join ter_tercero terceros on terceros.ter_ideregistro = clientes.ter_ideregistro\r\n" +
            "	inner join pro_propiedad propiedad on propiedad.pro_ideregistro = clientes.pro_ideregistro \r\n" +
            "	inner join empresas em on  clientes.emp_ideregistro=em.empresa_sevemp\r\n" +
            "	left join reclamos rec on clientes.dsus_pcodigo = rec.reclamo_codsus\r\n" +
            "	and em.empresa_cod=rec.reclamo_codemp \r\n" +
            "where\r\n" +
            "	clientes.emp_ideregistro = :empresa \r\n" +
            "	and clientes.dsus_estado = 'A' \r\n" +
            "	and (clientes.dsus_ideregistr=:id or dsus_pcodigo = :codigo or rec.reclamo_numpqr=:pqr)", nativeQuery = true)
    List<DsusDetsuscrip> findByIdOrCodigoWithCredentials(@Param("empresa") Long empresa, @Param("id") Long id, @Param("codigo") String codigo, @Param("pqr") String pqr);

    @Query(value = "select dsus.* from dsus_detsuscrip dsus \r\n" +
            "inner join aseo.dafo_detaforo dafo on dafo.dsus_ideregistr=dsus.dsus_ideregistr\r\n" +
            "where dsus.emp_ideregistro= :empresa", nativeQuery = true)
    List<DsusDetsuscrip> findSuscripcionesActivasByEmpresa(@Param("empresa") Long empresa);

	@Query(value = "select dsus.* from dsus_detsuscrip dsus \r\n" +
					"inner join mbcd_munbardirec mm on \r\n "+
					"mm.mbcd_ideregistr = :complemento \r\n "+
					"inner join pro_propiedad pp on \r\n "+
					"pp.pro_ideregistro = dsus.pro_ideregistro \r\n"+
					"and pp.uni_cmpdireccion = mm.mbcd_ideregistr \r\n"+
					"where dsus.emp_ideregistro= :empresa \r\n"+
					"and dsus.uni_barrio = :barrio",nativeQuery = true)
	List<DsusDetsuscrip> findSuscripcionesActivasByComplemento(@Param("complemento") Long complemento,@Param("empresa") Long empresa,@Param("barrio") Long barrio); //JLMENDOZA


    @Query(value = "select dsus.* from dsus_detsuscrip dsus \r\n" +
            "inner join aseo.dafo_detaforo dafo on dafo.dsus_ideregistr=dsus.dsus_ideregistr\r\n" +
            "where dsus.emp_ideregistro=:empresa\r\n", nativeQuery = true)
    List<DsusDetsuscrip> getSuscripcionesAforosByEmpresa(@Param("empresa") Long empresa);

    @Query(value = "select * from (\r\n" +
            "   select *,\r\n" +
            "          row_number() over (partition by pro_catestrato order by pro_catestrato) as row_number\r\n" +
            "   from dsus_detsuscrip\r\n" +
            "   ) as rows\r\n" +
            "where row_number = 2022", nativeQuery = true)
    List<DsusDetsuscrip> getEstratos();
	
	/*@Query(value="select * from dsus_detsuscrip where emp_ideregistro=317 limit 1", nativeQuery = true)
	List<DsusDetsuscrip> getEstratos();*/



    @Query(value = "select\r\n" +
            "	clientes.* \r\n" +
            "from  \r\n" +
            "	dsus_detsuscrip clientes\r\n" +
            "	inner join ter_tercero terceros on terceros.ter_ideregistro = clientes.ter_ideregistro\r\n" +
            "	inner join pro_propiedad propiedad on propiedad.pro_ideregistro = clientes.pro_ideregistro \r\n" +
            "	inner join empresas em on  clientes.emp_ideregistro=em.empresa_sevemp\r\n" +
            "	left join reclamos rec on clientes.dsus_pcodigo = rec.reclamo_codsus\r\n" +
            "   inner join aseo.dafo_detaforo dafo on dafo.dsus_ideregistr=clientes.dsus_ideregistr  \r\n" +
            "   inner join aseo.afo_aforos afo on afo.afo_ideregistro=dafo.afo_ideregistro   \r\n" +
            "	and em.empresa_cod=rec.reclamo_codemp \r\n" +
            "where\r\n" +
            "	clientes.emp_ideregistro = :empresa \r\n" +
            "	and clientes.dsus_estado = 'A' \r\n" +
            "	and afo.afo_ideregistro= :NumAforoPadre ", nativeQuery = true)
    List<DsusDetsuscrip> buscarAforoPadre(@Param("empresa") Long empresa, @Param("NumAforoPadre") Long NumAforoPadre);

    @Query(value = "SELECT cnre.cnre_nombre FROM cnre_cnvrecaudo cnre \n"
            + "INNER JOIN sus_suscripcion sus ON sus.cnre_ideregistr=cnre.cnre_ideregistr \n"
            + "INNER JOIN dsus_detsuscrip dsus ON dsus.sus_ideregistro=sus.sus_ideregistro \n"
            + "WHERE dsus.dsus_ideregistr = :idSuscriptor \n"
            + "limit 1;", nativeQuery = true)
    String getConvenioBySuscriptor(@Param("idSuscriptor") Long idSuscriptor);

    @Query(value = /*"select distinct \n" +
            "				clientes.* \n" +
            "			from  \n" +
            "				dsus_detsuscrip clientes\n" +
            "				inner join ter_tercero terceros on terceros.ter_ideregistro = clientes.ter_ideregistro\n" +
            "				inner join pro_propiedad propiedad on propiedad.pro_ideregistro = clientes.pro_ideregistro \n" +
            "				inner join empresas em on  clientes.emp_ideregistro=em.empresa_sevemp\n" +
            "				left join reclamos rec on clientes.dsus_pcodigo = rec.reclamo_codsus\n" +
            "			  inner join aseo.hdafo_detaforo dafo on dafo.dsus_ideregistr=clientes.dsus_ideregistr  \n" +
            "			  inner join aseo.hafo_aforos afo on afo.hafo_ideregistro=dafo.hafo_ideregistro   \n" +
			//"			  and em.empresa_cod=rec.reclamo_codemp \n" +
            "			where\n" +
            "				clientes.emp_ideregistro = :empresa \n" +
			"				and clientes.dsus_estado = 'A' \n" +
			"				and afo.hafo_ideregistro= :NumAforoPadre and afo.hafo_fechafinaforo >=current_date "*/
    		"select dd.* "
    		+ "from aseo.hafo_aforos ha "
    		+ "inner join aseo.hdafo_detaforo hd on hd.hafo_ideregistro = ha.hafo_ideregistro "
    		+ "inner join public.dsus_detsuscrip dd on dd.dsus_ideregistr = hd.dsus_ideregistr "
    		+ "and dd.emp_ideregistro = :empresa "
    		+ "where ha.hafo_ideregistro = :NumAforoPadre and ha.hafo_fechafinaforo >=current_date ",nativeQuery = true)
	List<DsusDetsuscrip> buscarAforoPadreHistorico(@Param("empresa") Long empresa,@Param("NumAforoPadre") Long NumAforoPadre);
	
	DsusDetsuscrip findBySusIderegistroAndEmpIderegistroAndTerIderegistro_TerIderegistro(Long susIderegistro,Integer empIderegistro,Long terIderegistro);

	@Query(value = "select d.uniMunicipio from DsusDetsuscrip d where d.dsusIderegistr=:dsusIderegistro")
	Long findProyByDsusIderegistro(Long dsusIderegistro);

    @Query(value = "select count(ds) from DsusDetsuscrip ds where ds.proIderegistro = :idPropiedad")
    Long existsByProIderegistro(@Param("idPropiedad") Long idPropiedad);

    @Query(value = "select count(ds) from DsusDetsuscrip ds where ds.terIderegistro.terIderegistro = :idtercero " +
            "and ds.susIderegistro = :idSuscrip and ds.proIderegistro = :idPropiedad")
    Long existsByTerIderegistroAndSusIderegistroAndProIderegistro(@Param("idtercero") Long idtercero, @Param("idSuscrip") Long idSuscrip, @Param("idPropiedad") Long idPropiedad);

    @Query(value = "select count(ds) from DsusDetsuscrip ds where ds.terIderegistro.terIderegistro = :idtercero " +
            "and ds.proIderegistro = :idPropiedad")
    Long existsByTerIderegistroAndProIderegistro(@Param("idtercero") Long idtercero, @Param("idPropiedad") Long idPropiedad);

    @Query(value = "select count(ds) from DsusDetsuscrip ds where ds.empIderegistro = :idEmp and ds.proIderegistro = :idPropiedad")
    Long existsByProIderegistroAndEmpIderegistro(@Param("idPropiedad") Long idPropiedad, @Param("idEmp") Integer idEmp);

    /**
     * Consulta info suscripcion
     *
     * @param idempresa id empresa
     * @param iddsus    id detalle suscripcion
     * @return info suscripcion
     */
    @Query(value = "select  dsus.dsus_pcodigo pcodigo ,\n" +
            "ter.ter_documento as documento ,\n" +
            "ter.ter_nombre nombre ,\n" +
            "ter.ter_apellido apellido,\n" +
            "ter.ter_nomcompleto nombrecompleto ,\n" +
            "substring(proy.proyecto_codciu,1,2) departamento,\n" +
            "substring(proy.proyecto_codciu,3,10) municipio,\n" +
            "pro.pro_direccion direccion, COALESCE(ter.ter_correo,'0') mail,\n" +
            "(CASE  when ter.ter_telcelular is not null then ter.ter_telcelular\n" +
            "when ter.ter_telfijo is not null then ter.ter_telfijo else '0' end  ) telefono\n" +
            "from dsus_detsuscrip dsus\n" +
            "inner join  pro_propiedad pro on pro.pro_ideregistro = dsus.pro_ideregistro\n" +
            "inner join  ter_tercero ter on ter.ter_ideregistro = dsus.ter_ideregistro\n" +
            "inner join proyectos proy on proy.proyecto_ideregistro = dsus.uni_municipio\n" +
            "where dsus.emp_ideregistro = :idempresa and dsus_ideregistr=:iddsus  ", nativeQuery = true)
    Map<String, String> findInfoSuscripcion(@Param("idempresa") Integer idempresa, @Param("iddsus") Long iddsus);

    /**
     * Consulta estado de detalle suscripcion
     *
     * @param idsuscripcion is detalle suscripcion
     * @param idempresa     id empresa
     * @return estado dsus
     */
    @Query(value = "select d.dsusEstado from DsusDetsuscrip d where d.dsusIderegistr=:idsuscripcion and d.empIderegistro=:idempresa")
    String findEstadoByIdDsus(Long idsuscripcion, Integer idempresa);

    /**
     * Consulta documentos con saldo
     *
     * @param idsuscripcion id detalle suscripcion
     * @return valor conteo
     */
    @Query(value = "select (select count(fac_ideregistro) numero from fac_factura where dsus_ideregistr=:idsuscripcion and fac_sdoreal>0 and fac_estado='A' AND fac_idepadre IS NULL)+\n" +
            "(select count(*)  numero from fin_financiacio  where dsus_ideregistr=:idsuscripcion and fin_sdocapital>0 and fin_estado='A') as numero", nativeQuery = true)
    Long findDocsSaldo(@Param("idsuscripcion") Long idsuscripcion);

    /**
     * Consulta documentos con saldo eliminado
     *
     * @param idsuscripcion id detalle suscripcion
     * @return valor conteo
     */
    @Query(value = "select (select count(fac_ideregistro) numero from fac_factura where dsus_ideregistr=:idsuscripcion and fac_sdoreal>0 and fac_estado='A' AND fac_idepadre IS NULL)+\n" +
            "       (select count(*)  numero from fin_financiacio where dsus_ideregistr=:idsuscripcion and fin_sdocapital>0 and fin_estado='A' )+\n" +
            "       (select count(*) numero from dire_disrecaudo dire inner join rec_recaudo rec on dire.rec_ideregistro=rec.rec_ideregistro where dsus_ideregistr=:idsuscripcion and dire_sdorecaudo>0 and rec.rec_estado not in ('T','D','E')) as numero", nativeQuery = true)
    Long findDocsSaldoEliminado(@Param("idsuscripcion") Long idsuscripcion);

    /**
     * Consulta de facturas on saldo
     *
     * @param idsuscripcion id detalle suscripcion
     * @return valor conteo
     */
    @Query(value = "select count(fac_ideregistro) as numero from fac_factura where dsus_ideregistr=:idsuscripcion and fac_sdoreal>0 and fac_estado='A' and fac_idepadre is null", nativeQuery = true)
    Long findFacturasSaldo(@Param("idsuscripcion") Long idsuscripcion);

    /**
     * Consulta lectura actual
     *
     * @param idsuscripcion id detalle suscripcion
     * @return valor conteo
     */
    @Query(value = "select count(*) cantidad\n" +
            "from lec_lectura lec\n" +
            "inner join per_periodo per on lec.per_ideregistro = per.per_ideregistro\n" +
            "where lec.lec_estado in ('A', 'G') and per.per_estado = 'A' and lec.dsus_ideregistr = :idsuscripcion", nativeQuery = true)
    Long findLecturaActual(@Param("idsuscripcion") Long idsuscripcion);

    /**
     * Inserta nuevo encabezado lectura
     *
     * @param idsuscripcion id detalle suscripcion
     * @param idusuario     is usuario logueado
     */
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO lec_lectura\n" +
            "(SELECT nextval('sq_lec_ideregistro') , 'A', now(),NULL,now(),coalesce((SELECT ssp_lectura FROM ssp_suspension ssp\n" +
            "INNER JOIN syr_susreconex syr ON ssp.syr_ideregistro = syr.syr_ideregistro\n" +
            "INNER JOIN mosu_motsuspen mosu ON ssp.uni_motsuspen = mosu.uni_motsuspen\n" +
            "WHERE syr.syr_estado = 'A' AND\n" +
            "syr.dsus_ideregistr = dsus.dsus_ideregistr AND\n" +
            "mosu.mosu_proceso='S' AND\n" +
            "ssp.ssp_estado = 'A' LIMIT 1),0) ,NULL , 0,0,\n" +
            "(Select COALESCE((select COALESCE(lecpro.lec_conpromedio,0) from lec_lectura lecpro where lecpro.dsus_ideregistr = :idsuscripcion\n" +
            "and lecpro.lec_ideregistro = ( SELECT max(lecmax.lec_ideregistro) from lec_lectura lecmax\n" +
            "WHERE lecmax.dsus_ideregistr = lecpro.dsus_ideregistr)),0)),\n" +
            "'Se modifica el estado de la suscripción',\n" +
            "dsus.dsus_ideregistr,dsus.pro_ideregistro,dsus.cic_ideregistro,per.per_ideregistro,cic.cic_anoactual,dsus.emp_ideregistro,dsus.uni_tipsuscripc,\n" +
            "dsus.uni_tipusosuscr,pro.pro_idepropieda,pro.pro_digitos,\n" +
            "0.67,dsus.dsus_factor,:idusuario\n" +
            "FROM dsus_detsuscrip dsus\n" +
            "INNER JOIN per_periodo per ON per.cic_ideregistro=dsus.cic_ideregistro\n" +
            "INNER JOIN cic_ciclo cic ON cic.cic_ideregistro=dsus.cic_ideregistro\n" +
            "INNER JOIN pro_propiedad pro ON dsus.pro_ideregistro=pro.pro_ideregistro\n" +
            "LEFT JOIN lec_lectura lec ON dsus.dsus_ideregistr=lec.dsus_ideregistr\n" +
            "AND lec.lec_ideregistro = (SELECT max(le.lec_ideregistro)\n" +
            "FROM lec_lectura le\n" +
            "WHERE le.dsus_ideregistr = :idsuscripcion AND le.lec_estado = 'P')\n" +
            "WHERE per.per_estado='A' and dsus.dsus_ideregistr= :idsuscripcion)", nativeQuery = true)
    void insertNuevoEncabezadoLectura(@Param("idsuscripcion") Long idsuscripcion, @Param("idusuario") Integer idusuario);

    /**
     * Consulta info de suscripciones por id de tercero
     *
     * @param idtercero id tercero
     * @param idempresa id empresa
     * @return lista de info suscripciones
     */
    @Query(value = "select dsus from DsusDetsuscrip dsus where dsus.terIderegistro.terIderegistro = :idtercero and dsus.empIderegistro = :idempresa")
    List<DsusDetsuscrip> findAllDsusByIdTer(@Param("idtercero") Long idtercero, @Param("idempresa") Integer idempresa);

    /**
     * Consulta info de suscripciones por id de tercero and enterprise
     *
     * @param idtercero id tercero
     * @param idempresa id empresa
     * @return lista de info suscripciones
     */
    @Query(value = "select dsus.dsusIderegistr as dsusIderegistr, dsus.dsusPcodigo as dsusPcodigo, dsus.terIderegistro.terNomcompleto as terNomCompleto, dsus.proPropiedad.proDireccion as proDireccion, dsus.proPropiedad.proIdepropieda as proIdepropieda, dsus.empIderegistro as empIderegistro from DsusDetsuscrip dsus where dsus.terIderegistro.terIderegistro = :idtercero and dsus.empIderegistro = :idempresa")
    List<Map<String,Object>> findAllDsusByIdTerAndEnterprise(@Param("idtercero") Long idtercero, @Param("idempresa") Integer idempresa);

    /**
     * Consulta info de suscripciones por id de suscriptor
     *
     * @param idsuscriptor id suscriptor
     * @param idempresa    id empresa
     * @return lista de info suscripciones
     */
    @Query(value = "select dsus from DsusDetsuscrip dsus where dsus.susIderegistro = :idsuscriptor and dsus.empIderegistro = :idempresa ")
    List<DsusDetsuscrip> findAllDsusByIdSus(@Param("idsuscriptor") Long idsuscriptor, @Param("idempresa") Integer idempresa);

    /**
     * Consulta lista de propiedades disponibles para suscripcion por tercero
     *
     * @param idtercero id tercero
     * @return listado de propiedades
     */
    @Query(value = "select pro.pro_ideregistro as proideregistro, ter.ter_nomcompleto ternomcompleto, " +
            "pro_descripcion prodescripcion, pro.pro_direccion prodireccion " +
            "from pro_propiedad pro " +
            "inner join ter_tercero ter on pro.ter_ideregistro = ter.ter_ideregistro " +
            "where pro.ter_ideregistro=:idtercero  and pro.pro_ideregistro not in ( " +
            "    select dsus.pro_ideregistro " +
            "    from dsus_detsuscrip dsus " +
            "    where pro.ter_ideregistro=:idtercero )", nativeQuery = true)
    List<Map<String, ?>> findDispPropiedadesSuscripcion(@Param("idtercero") Long idtercero);

    /**
     * Consulta nombre de ciclo por id
     *
     * @param idciclo id ciclo
     * @return nombre ciclo
     */
    @Query(value = "select cic.cic_nombre from cic_ciclo cic where cic_ideregistro=:idciclo", nativeQuery = true)
    String findNombreByCiclo(@Param("idciclo") Integer idciclo);

    @Query(value = "select d.dsusPcodigo from DsusDetsuscrip d where d.dsusIderegistr=:dsusIderegistro")
    String findDsusPcodigoById(Long dsusIderegistro);

    @Query(value = "select emp_ideregistro as empAlterna\n" +
            "from dsus_detsuscrip\n" +
            "where sus_ideregistro=:susIderegistro and emp_ideregistro!=:empIderegistro", nativeQuery = true)
    List<Integer> empDsusAlternas(Long susIderegistro,Integer empIderegistro);


    DsusDetsuscrip findByDsusPcodigo(String dsuspcodigo);
    
    @Query(value="select cc.cosu_ideregistr,cc.uni_concepto,cc.cosu_cantidad,cc.cosu_vlrunitari, "
    		+ "cc.cosu_vlrtotal,cc.cosu_fecinicio,cc.cosu_fecfinal,cc.cosu_estado "
    		+ "from public.cosu_consuscrip cc where cc.dsus_ideregistr = :dsus and cc.cosu_estado = 'A'",nativeQuery=true)
    Optional<List<Object []>>cosuConsuscriptDTOList(@Param("dsus") Long dsus);
    
    @Query(value = "select dsus.* from dsus_detsuscrip dsus " +
            "where dsus.emp_ideregistro=:empresa and dsus.sus_ideregistro = :sus", nativeQuery = true)
    DsusDetsuscrip getSuscripcionesByEmpresaAndSuscripcion(@Param("empresa") Long empresa,@Param("sus") Long sus);
    
    /**
     * Consulta info de suscripciones por id 
     */
    @Query(value = "select dsus from DsusDetsuscrip dsus where dsus.dsusIderegistr = :dsus")
    Optional<DsusDetsuscrip> findDsusByDsus(@Param("dsus") Long dsus);
}
