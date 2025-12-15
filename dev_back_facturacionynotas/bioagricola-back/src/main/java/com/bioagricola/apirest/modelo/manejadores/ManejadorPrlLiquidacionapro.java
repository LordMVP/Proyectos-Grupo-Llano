package com.bioagricola.apirest.modelo.manejadores;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.dtos.PeriodoConsolidadoDTO;
import com.bioagricola.apirest.modelo.entidades.PrlLiquidacionapro;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import com.bioagricola.apirest.modelo.projections.PeriodoFactProjection;
import java.util.Date;
import java.util.Map;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

@Service
public interface ManejadorPrlLiquidacionapro
extends ManejadorCrud<PrlLiquidacionapro, Integer>, IManejadorCrud<PrlLiquidacionapro, Integer> {

        @Modifying
	@Query(value = "select distinct \n" +
                "	pl.prl_ideregistro,concat(pp.per_nombre,' ',pl.prl_anio) as per_nombre,\n" +
                "	mm.maprc_ideregistr, pl.prl_estado \n" +
                "from aseo.prl_liquidacionapro pl \n" +
                "inner join aseo.maprc_maestroconciliacion mm on pl.maprc_ideregistr = mm.maprc_ideregistr \n" +
                "inner join public.per_periodo pp on pp.per_ideregistro = mm.per_ideregistro \n" +
                "where pl.prl_estado in (:estados) and mm.emp_ideregistro = 317 \n" +
                "order by mm.maprc_ideregistr desc ", nativeQuery = true)
	public List<Object[]> consultarPeriodosConsolidado(@Param("estados") String[] estados);
	
	@Query(value = "select distinct \n" +
                        "	mm.maprc_ideregistr,\n" +
                        "	to_char(to_date(cast(ac.per_facturacion as text), 'YYYYMM'), 'TMMonth YYYY') as per_nombre, \n" +
                        "	ac.per_ideregistro as per_ideregistro,\n" +
                        "	ac.per_facturacion \n" +
                        "from aseo.aprconc_conciliacion ac \n" +
                        "inner join aseo.maprc_maestroconciliacion mm on ac.maprc_ideregistr = mm.maprc_ideregistr \n" +
                        "inner join aseo.prl_liquidacionapro pl on mm.maprc_ideregistr = pl.maprc_ideregistr  \n" +
                        "where pl.prl_estado in ('A','P') and mm.emp_ideregistro = :idempresa and pl.prl_ideregistro = :prlaIderegistro and ac.iat_valor = 0\n" +
                        "order by ac.per_facturacion asc ", nativeQuery = true)
	public List<PeriodoFactProjection> consultarPeriodoFacturacion(@Param("idempresa") Integer idempresa,@Param("prlaIderegistro") Long prlaIderegistro);
        
        @Query(value = "select distinct \n" +
                        "	mm.maprc_ideregistr,\n" +
                        "	to_char(to_date(cast(ac.per_facturacion as text), 'YYYYMM'), 'TMMonth YYYY') as per_nombre, \n" +
                        "	ac.per_ideregistro as per_ideregistro,\n" +
                        "	ac.per_facturacion \n" +
                        "from aseo.aprconc_conciliacion ac \n" +
                        "inner join aseo.maprc_maestroconciliacion mm on ac.maprc_ideregistr = mm.maprc_ideregistr \n" +
                        "inner join aseo.prl_liquidacionapro pl on mm.maprc_ideregistr = pl.maprc_ideregistr  \n" +
                        "where pl.prl_estado in ('A','P') and mm.emp_ideregistro = :idempresa and pl.prl_ideregistro = :prlaIderegistro and ac.iat_valor > 0\n" +
                        "order by ac.per_facturacion asc ", nativeQuery = true)
	public List<PeriodoFactProjection> consultarPeriodoFacturacionIA(@Param("idempresa") Integer idempresa,@Param("prlaIderegistro") Integer prlaIderegistro);

	@Query("select count(p.prlIderegistro) from PrlLiquidacionapro p where p.prlEstado = :estado")
	Integer consultarLiquidacionPorEstado(@Param("estado") String estado);
        
        @Modifying
        @Transactional
        @Query(value="UPDATE aseo.prl_liquidacionapro " +
            "SET prl_fecha_aprobacion = :fechaAprobado, prl_estado = 'A' " +
            "WHERE prl_ideregistro = :prlIderegistr ",nativeQuery = true)
        public void aprobarPeriodoConsolidado(@Param("prlIderegistr") Long prlIderegistr, @Param("fechaAprobado") Date fecha);
        
        @Modifying
        @Transactional
        @Query(value="DELETE FROM aseo.prl_liquidacionapro\n" +
            "WHERE prl_ideregistro = :prlIderegistr",nativeQuery = true)
        public void descartarPeriodoConsolidado(@Param("prlIderegistr") Long prlIderegistr);

}
