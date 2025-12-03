package com.bioagricola.common.repository;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bioagricola.common.entity.Reclamos;

@Repository("reclamosRepository")
@Transactional
public interface ReclamosRepository extends JpaRepository<Reclamos, String>, JpaSpecificationExecutor<Reclamos> {

	@Query(value = "select\r\n" + "	rec.* \r\n" + "from  \r\n" + "	dsus_detsuscrip clientes\r\n"
			+ "	inner join ter_tercero terceros on terceros.ter_ideregistro = clientes.ter_ideregistro\r\n"
			+ "	inner join pro_propiedad propiedad on propiedad.pro_ideregistro = clientes.pro_ideregistro \r\n"
			+ "	inner join empresas em on  clientes.emp_ideregistro=em.empresa_sevemp\r\n"
			+ "	inner join reclamos rec on clientes.dsus_pcodigo = rec.reclamo_codsus\r\n"
			+ "	and em.empresa_cod=rec.reclamo_codemp \r\n" + "where\r\n"
			+ "	clientes.emp_ideregistro = :empresa \r\n" + "	and clientes.dsus_estado = 'A' \r\n"
			+ "	and clientes.usu_ideregistro= :usuario \r\n"
			+ "	and (clientes.dsus_ideregistr=:id or dsus_pcodigo = :codigo or rec.reclamo_numpqr=:pqr)", nativeQuery = true)
	List<Reclamos> findByIdOrCodigoWithCredentials(@Param("empresa") Long empresa, @Param("usuario") Long usuario,
			@Param("id") Long id, @Param("codigo") String codigo, @Param("pqr") String pqr);

	@Query(value = "select \n" + "			novedadradicado_cod, \n" + "			novedadradicado_nom,\n"
			+ "			concat(novedadradicado_cod,' - ',novedadradicado_nom) \n" + "			from \n"
			+ "			novedades_radicado novedad \n" + "			inner join empresas e2 on \n"
			+ "			e2.empresa_cod = novedad.novedadradicado_codemp \n" + "			where \n"
			+ "			novedadradicado_coddepemp = '04' \n" + "			and novedadradicado_swtact is true \n"
			+ "			and novedadradicado_swtrep is false \n" + "			and e2.empresa_sevemp = :empresa \n"
			+ "			order by \n" + "			novedadradicado_nom" + "", nativeQuery = true)
	List<Object[]> listaNovedadesRadicado(@Param("empresa") Integer empresa);

	@Query(value = "SELECT\n" + "cua.cuadrilla_cod,\n" + "cua.cuadrilla_nom,\n"
			+ "concat(cua.cuadrilla_cod,' - ',cua.cuadrilla_nom) as nombre\n" + "FROM cuadrillas cua\n"
			+ "inner join empresas e2 on e2.empresa_cod =cua.cuadrilla_codemp\n"
			+ "WHERE  e2.empresa_sevemp = :empresa AND cua.cuadrilla_swtact=TRUE\n" + "ORDER BY cuadrilla_nom ASC"
			+ "", nativeQuery = true)
	List<Object[]> listaCuadrillas(@Param("empresa") Integer empresa);

	@Query(value = "SELECT\n" + "novedadradicado_cod,\n" + "novedadradicado_nom,\n"
			+ "concat(novedadradicado_cod,' - ',novedadradicado_nom)\n" + "FROM novedades_radicado radi\n"
			+ "INNER JOIN empresas e2 on e2.empresa_cod =radi.novedadradicado_codemp\n"
			+ "WHERE radi.novedadradicado_gru='C'\n"
			+ "AND radi.novedadradicado_swtrep is true and radi.novedadradicado_swtact is true\n"
			+ "and e2.empresa_sevemp = :empresa" + "", nativeQuery = true)
	List<Object[]> listaNovedadesReporte(@Param("empresa") Integer empresa);

	@Transactional
	@Modifying
	@Query(value = "INSERT INTO visitas_sol (visitasol_fecvis,visitasol_codnov,visitasol_codcua,visitasol_obs,visitasol_numpqr,visitasol_codrep,visitasol_codsus) VALUES (:fecha,:novedad,:cuadrilla,:observaciones,:reclamo_numpqr,:novReporte, :pcodigo)", nativeQuery = true)
	Integer insertVisitasSol(@Param("fecha") Date fecha, @Param("novedad") String novedad,
			@Param("cuadrilla") String cuadrilla, @Param("observaciones") String observaciones,
			@Param("reclamo_numpqr") String reclamo_numpqr, @Param("novReporte") String novReporte,
			@Param("pcodigo") String pcodigo);

}
