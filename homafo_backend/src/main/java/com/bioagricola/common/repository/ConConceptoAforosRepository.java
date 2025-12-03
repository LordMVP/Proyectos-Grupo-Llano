package com.bioagricola.common.repository;

import com.bioagricola.common.entity.ConConcepto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface ConConceptoAforosRepository  extends JpaRepository<ConConcepto, Long> {
	
	@Query(value="select con.* \r\n" + 
			"from con_concepto con \r\n" + 
			"inner join coli_conliquida coli on coli.uni_concepto=con.uni_concepto\r\n" + 
			"inner join liq_liquidacion liq on liq.uni_liquidacion=coli.uni_liquidacion\r\n" + 
			"inner join est_estructura est on est.est_ideregistro=liq.est_liquidacion\r\n" + 
			"inner join esem_estempresa esem on esem.est_ideregistro=est.est_ideregistro\r\n" + 
			"WHERE esem.emp_ideregistro= :empresa",nativeQuery=true)
	List<ConConcepto> findConceptosByEmpresa(@Param("empresa") Long empresa);
	
	@Query(value = "select distinct c.* from con_concepto c inner join\r\n" + 
			"uni_unidad u on c.uni_concepto=u.uni_ideregistro\r\n" + 
			"and u.est_ideregistro=:idEstructura and u.est_ideregistro=c.est_concepto \r\n" + 
			"inner join coli_conliquida coli on coli.uni_concepto=c.uni_concepto\r\n" + 
			"and coli.uni_liquidacion=:uniLiquidacion",nativeQuery = true)
	List<ConConcepto> findConConceptosAforo(@Param("idEstructura") Long idEstructura,@Param("uniLiquidacion") Long uniLiquidacion);

	@Query(value = "select distinct c.uni_concepto llave, c.con_nombre valor, c.con_valor vol  " +
			"from con_concepto c  " +
			"inner join uni_unidad u on c.uni_concepto=u.uni_ideregistro  " +
			"and u.est_ideregistro=:idEstructura and u.est_ideregistro=c.est_concepto  " +
			"inner join coli_conliquida coli on coli.uni_concepto=c.uni_concepto  " +
			"and coli.uni_liquidacion=:uniLiquidacion ",nativeQuery = true)
	List<Map<String, Object>> findConConceptosAforoSimpleItem(@Param("idEstructura") Long idEstructura, @Param("uniLiquidacion") Long uniLiquidacion);
	
	@Query(value = "select * from con_concepto where uni_concepto = :uniConcepto limit 1",nativeQuery = true)
	ConConcepto findConConceptoByUniConcepto(@Param("uniConcepto") Long uniConcepto);

	/*@Query(value = "select cc from ConConcepto cc where cc.prgIderegistro = :idPro")
	List<ConConcepto> getAllConceptsByIdProgram(@Param("idPro") Integer idPro);*/
	
	@Query(value = "select cc.* from con_concepto cc inner join prun_prgunidad pp on pp.uni_ideregistro = cc.uni_concepto "
			+ "inner join uspu_usuprgunid uu on uu.prun_ideregistr = pp.prun_ideregistr and uu.usu_ideregistro = :usuario "
			+ "where cc.prg_ideregistro = :idPro ",nativeQuery = true)
	List<ConConcepto> getAllConceptsByIdProgram(@Param("idPro") Integer idPro,@Param("usuario") Integer usuario);
	
	
	@Query(value = "select cc.* from con_concepto cc inner join prun_prgunidad pp on pp.uni_ideregistro = cc.uni_concepto "
			+ " and pp.prg_ideregistro = :programa "
			+ "inner join uspu_usuprgunid uu on uu.prun_ideregistr = pp.prun_ideregistr and uu.usu_ideregistro = :usuario "
			+ "where cc.prg_ideregistro = :idPro ",nativeQuery = true)
	List<ConConcepto> getAllConceptsByIdProgramPrograma(@Param("idPro") Integer idPro,@Param("usuario") Integer usuario, Integer programa);
	
}
