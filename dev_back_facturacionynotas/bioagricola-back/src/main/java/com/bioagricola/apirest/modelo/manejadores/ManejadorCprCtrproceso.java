package com.bioagricola.apirest.modelo.manejadores;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.CprCtrProceso;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

@Service
public interface ManejadorCprCtrproceso
		extends ManejadorCrud<CprCtrProceso, Long>, IManejadorCrud<CprCtrProceso, Long> {

	@Query(value = "select cpr.acc_ideregistro idacceso,cpr.cpr_fecinicio fechainicio, " + " usu.usuario_nom usuario,"
			+ " (select count(*) from :identiEmpresa" + " where estado <> 'P') cantidad" + " from cpr_ctrproceso cpr "
			+ " inner join acc_acceso acc on " + " cpr.acc_ideregistro=acc.acc_ideregistro"
			+ " inner join usuarios usu on usu.usu_ideregistro=cpr.usu_ideregistro"
			+ " where cpr.prg_ideregistro=:idprograma and cpr.cpr_estado='A' "
			+ " and cpr.emp_ideregistro=:idempresa limit 1", nativeQuery = true)
	public List<Object> getProcesoEjecucion(String identiEmpresa, Integer idprograma, Integer idempresa);

	@Modifying
	@Query(value = "INSERT INTO public.cpr_ctrproceso ("
			+ " cpr_estado, cpr_fecinicio, cpr_canregistro, prg_ideregistro, acc_ideregistro, emp_ideregistro, cpr_idehilo, usu_ideregistro)"
			+ " VALUES (:cprestado, :cprfecinicio, :cprcanregistro , :prgideregistro, :accideregistro, :empideregistro, :cpridehilo, :usuideregistro)", nativeQuery = true)
	@Transactional
	void insertCprCtrproceso(String cprestado, Timestamp cprfecinicio, Integer cprcanregistro, Integer prgideregistro,
			Integer accideregistro, Integer empideregistro, Integer cpridehilo, Integer usuideregistro);

	@Modifying
	@Query(value = "INSERT INTO public.cpr_ctrproceso ("
			+ " cpr_estado, cpr_fecinicio, cpr_canregistro, prg_ideregistro, acc_ideregistro, emp_ideregistro, cpr_idehilo, usu_ideregistro)"
			+ " VALUES (:cprestado, :cprfecinicio, :cprcanregistro , :prgideregistro, :accideregistro, :empideregistro, :cpridehilo, :usuideregistro)", nativeQuery = true)
	@Transactional
	void insertCprCtrprocesoApro(String cprestado, Date cprfecinicio, Integer cprcanregistro, Integer prgideregistro,
			Integer accideregistro, Integer empideregistro, Integer cpridehilo, Integer usuideregistro);

	@Modifying
	@Query(value = "update cpr_ctrproceso set cpr_canregistro=(cpr_canregistro+1) where cpr_ideregistro=:cprideregistro", nativeQuery = true)
	@Transactional
	void aumentarCantidadRegistro(Integer cprideregistro);

	@Query("select cpr from CprCtrProceso cpr where cpr.prgIderegistro =:tipoNota and cpr.empIderegistro = :idEmpresa and cpr.cprIdehilo=:tipoNota and cpr.cprEstado= 'A' ")
	public CprCtrProceso consultarProcesoCalidad(@Param("idEmpresa") int idEmpresa, @Param("tipoNota") int tipoNota);

	@Query(value = "select cpr.acc_ideregistro idacceso,cpr.cpr_fecinicio fechainicio, "
			+ "(select sum(cpr_canregistro) from cpr_ctrproceso "
			+ "where prg_ideregistro= :idprograma and cpr.emp_ideregistro = :idempresa "
			+ "and cpr_estado='A') as cantidad " + " from cpr_ctrproceso cpr "
			+ " where cpr.prg_ideregistro = :idprograma and cpr.cpr_estado='A' "
			+ " and cpr.emp_ideregistro = :idempresa limit 1", nativeQuery = true)
	List<Object> getProcesoEjecucionAprovechamiento(Integer idprograma, Integer idempresa);

	@Query("select pr from CprCtrProceso pr where pr.prgIderegistro = :idPrograma and pr.empIderegistro = :idEmpresa and pr.cprIdehilo = :idHilo and pr.cprEstado = 'A'")
	List<CprCtrProceso> getProcesoEjecucionPorHilo(@Param("idPrograma") Integer idPrograma,
			@Param("idEmpresa") Integer idEmpresa, @Param("idHilo") Long idHilo);
        
        @Query("select pr from CprCtrProceso pr where pr.prgIderegistro = :idPrograma and pr.empIderegistro = :idEmpresa and pr.cprEstado = :estado")
	List<CprCtrProceso> getProcesos(@Param("idPrograma") Integer idPrograma,
			@Param("idEmpresa") Integer idEmpresa, @Param("estado") String estado);
}
