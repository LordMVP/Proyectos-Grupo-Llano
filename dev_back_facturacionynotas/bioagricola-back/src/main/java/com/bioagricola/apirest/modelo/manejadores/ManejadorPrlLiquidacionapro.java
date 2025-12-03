package com.bioagricola.apirest.modelo.manejadores;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.dtos.PeriodoConsolidadoDTO;
import com.bioagricola.apirest.modelo.dtos.PeriodoFactDTO;
import com.bioagricola.apirest.modelo.entidades.PrlLiquidacionapro;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

@Service
public interface ManejadorPrlLiquidacionapro
extends ManejadorCrud<PrlLiquidacionapro, Integer>, IManejadorCrud<PrlLiquidacionapro, Integer> {

	@Query("select new com.bioagricola.apirest.modelo.dtos.PeriodoConsolidadoDTO(pl.prlIderegistro ,pp.perNombre || ' ' ||extract (year from pp.perFecinicial),  "+
			"pl.prlEstado) from PrlLiquidacionapro pl " + 
			"inner join PerPeriodo pp on pp.perIderegistro = pl.perIderegistro "+
			"where pl.prlTipoProceso = :tipoProceso and pl.prlEstado in ('A','P') ")
	public List<PeriodoConsolidadoDTO> consultarPeriodosConsolidado(@Param ("tipoProceso") Integer tipoProceso);
	
	@Query("select new com.bioagricola.apirest.modelo.dtos.PeriodoFactDTO (pp2.perNombre || ' ' ||extract (year from pp2.perFecinicial), pp2.perIderegistro)  from PrlLiquidacionapro pl " + 
			"inner join DprlDetliquidacionapro dd on dd.prlIdregistro = pl.prlIderegistro " + 
			"inner join FacFactura ff on ff.facIderegistro = dd.facIderegistro " + 
			"inner join PerPeriodo pp2 on pp2.perIderegistro = ff.perIderegistro " + 
			"where pl.prlIderegistro = :prlaIderegistro group by pp2.perIderegistro")
	public List<PeriodoFactDTO> consultarPeriodoFacturacion(@Param("prlaIderegistro") Integer prlaIderegistro);

	@Query("select count(p.prlIderegistro) from PrlLiquidacionapro p where p.prlEstado = :estado and p.prlTipoProceso= :tipoApro")
	Integer consultarLiquidacionPorEstado(@Param("estado") String estado, @Param("tipoApro") Integer tipoAprovechamiento);
}
