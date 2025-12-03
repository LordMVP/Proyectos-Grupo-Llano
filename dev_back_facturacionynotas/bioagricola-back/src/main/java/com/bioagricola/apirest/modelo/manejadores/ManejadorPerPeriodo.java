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

	@Query("Select p.perIdeorden, p.perEstado, p.perFecinicial, p.perFecfinal " +
			"from PerPeriodo p inner join CicCiclo cc on (p.cicIderegistro = cc.cicIderegistro) " +
			"inner join CiemCicempresa cce on (cce.cicCiclo.cicIderegistro = cc.cicIderegistro) " +
			"where p.perEstado IN :states group by p.perIdeorden, p.perEstado, p.perFecinicial, p.perFecfinal order by p.perFecinicial desc, p.perFecfinal desc ")
	List<Object[]> getPerPeriodos(@Param("states") List<String> states);
}
