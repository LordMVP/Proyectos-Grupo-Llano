package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.DperDetperiodo;
import com.bioagricola.apirest.modelo.entidades.PerPeriodo;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.List;
import java.util.Map;

/**
 * Manejador que define las operaciones CRUD y de negocio a realizar sobre la
 * tabla correspondiente a la entidad PerPeriodo.
 * 
 * @author GeneradorCRUD
 */
@Service
public interface ManejadorPerPeriodo extends ManejadorCrud<PerPeriodo, Integer>, IManejadorCrud<PerPeriodo, Integer>,
		PagingAndSortingRepository<PerPeriodo, Integer> {

	@Query(value = "SELECT" + "                  rupe.rupe_fecvence fechavencimiento,"
			+ "                  rupe.rupe_fecsuspens fechasuspension" + "                FROM"
			+ "                  rupe_rutperiodo rupe INNER JOIN rusu_rutsuscrip rusu ON rupe.rut_ideregistro=rusu.rut_ideregistro"
			+ "                  INNER JOIN per_periodo per ON per.per_ideregistro=rupe.per_ideregistro"
			+ "                WHERE"
			+ "                  rusu.dsus_ideregistr=:idsuscripcion AND per.per_ideregistro=:idperiodo", nativeQuery = true)
	public List<Object[]> getFechasRutaPeriodo(BigInteger idsuscripcion, Integer idperiodo);

	/**
	 * Consulta del último periodo semestral cerrado para aplicar los descuentos por indicadores de calidad
	 *
	 * @param idCicloSemestral
	 * @param pageable
	 * @return
	 */
	@Query("select pp from PerPeriodo pp where cicIderegistro = :idCicloSemestral and "
			+ "perEstado = 'C' order by pp.perIderegistro desc ")
	public List<PerPeriodo> consultarPeriodoDescCalidad(@Param("idCicloSemestral") int idCicloSemestral,
			Pageable pageable);
	
	@Query("select dd from DperDetperiodo dd  "
			+ "inner join PerPeriodo pp on pp.perIderegistro = dd.perPeriodo.perIderegistro "
			+ "where dd.prgPrograma.prgIderegistro = :idProcesoIndicadoresCalidad "
			+ "and pp.perIderegistro =:idPeriodo ")
	public List<DperDetperiodo> consultarEstadoPeriodo(@Param("idProcesoIndicadoresCalidad") int idProcesoIndicadoresCalidad,
			@Param("idPeriodo") int idPeriodo);

	/**
	 * Consulta para retornar el periodo activo de facturación según la suscripción
	 *
	 * @param dsusIderegistr
	 * @return
	 */
	@Query("select pp from DsusDetsuscrip dd  " + "inner join PerPeriodo pp on pp.cicIderegistro = dd.cicIderegistro  "
			+ "and pp.perEstado = 'A' " + "where dd.dsusIderegistr =:dsusIderegistr ")
	public PerPeriodo consultaPeriodoActivoPorSuscrip(@Param("dsusIderegistr") Long dsusIderegistr);

	@Query("Select p from PerPeriodo p where p.cicIderegistro = :idCiclo")
	List<PerPeriodo> getPerPeriodoByCiclo(@Param("idCiclo") int idCiclo);

	@Query(value ="select distinct \n" +
			"\tpp.per_ideregistro, pp.per_ideorden, pp.per_estado, pp.per_fecinicial, pp.per_fecfinal,\n" +
			"    concat(pp.per_nombre,' ',pl.prl_anio) as periodo_corte,\n" +
			"    mm.maprc_ideregistr\n" +
			"from aseo.prl_liquidacionapro pl\n" +
			"inner join aseo.maprc_maestroconciliacion mm on pl.maprc_ideregistr = mm.maprc_ideregistr \n" +
			"inner join public.per_periodo pp on pp.per_ideregistro = mm.per_ideregistro\n" +
			"where pl.prl_estado in ('A','P') and mm.emp_ideregistro = 317\n" +
			"order by maprc_ideregistr desc;", nativeQuery = true)
	List<Map<String,Object>> getPerPeriodos(@Param("states") List<String> states);

	@Query(value = "select\n" +
			"\tdistinct \n" +
			"\tpp.per_ideregistro,\n" +
			"\tpp.per_estado,\n" +
			"\tpp.per_fecinicial,\n" +
			"\tpp.per_fecfinal \n" +
			"from\n" +
			"\tper_periodo pp\n" +
			"inner join aseo.aprconc_conciliacion ac on\n" +
			"\tac.per_ideregistro = pp.per_ideregistro\n" +
			"order by\n" +
			"\tpp.per_fecinicial desc;" , nativeQuery = true)
	List<Object[]> getPeriodosCon(@Param("idempresasesion") int idempresasesion);

	@Query(value = "select distinct \n" +
			"\tpp.per_estado ,\n" +
			"\tpp.per_ideregistro,\n" +
			"\taf.per_facturacion,\n" +
			"\taf.per_prestacion,\n" +
			"\tpp.per_fecinicial ,\n" +
			"\tto_char(to_date(cast(af.per_facturacion as text), 'YYYYMM'), 'TMMonth YYYY') as per_nombre_facturacion,\n" +
			"\tto_char(to_date(cast(af.per_prestacion as text), 'YYYYMM'), 'TMMonth YYYY') as per_nombre_prestacion,\n" +
			"\tpp.per_fecfinal\n" +
			"from aseo.aprfac_facturacion af \n" +
			"inner join aseo.maprc_maestroconciliacion mm \n" +
			"on mm.maprc_ideregistr = af.maprc_ideregistr \n" +
			"inner join per_periodo pp on pp.per_ideregistro =mm.per_ideregistro and mm.maprc_ideregistr =:maprcIderegistro\n" +
			"order by af.per_prestacion desc", nativeQuery = true)
	List<Map<String,Object>> getPeriodosLiquidacionPrestacionApr(@Param("maprcIderegistro") int maprcIderegistro);

}
