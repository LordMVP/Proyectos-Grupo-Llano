package com.bioagricola.apirest.modelo.manejadores;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.DperDetperiodo;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

@Service
public interface ManejadorDperDetperiodo
		extends ManejadorCrud<DperDetperiodo, Integer>, IManejadorCrud<DperDetperiodo, Integer> {

	@Query("select actividades from DperDetperiodo actividades  "
			+ "inner join PerPeriodo per on per.perIderegistro = actividades.perPeriodo.perIderegistro "
			+ "inner join CicCiclo cc on cc.cicIderegistro  = per.cicIderegistro  "
			+ "inner join DsusDetsuscrip dd on dd.cicIderegistro = cc.cicIderegistro " + "where  per.perEstado  =  'A' "
			+ "and actividades.dperEstado = 'A' "
			+ "and dd.dsusIderegistr =:idSuscripcion and actividades.prgPrograma.prgIderegistro = :idPrograma ")
	public DperDetperiodo consultaActividades(@Param("idSuscripcion") Long idSuscripcion,
			@Param("idPrograma") int idPrograma);

	@Query("Select dp from DperDetperiodo dp " +
			"where dp.cicCiclo.cicIderegistro = :idCiclo and " +
			"dp.perPeriodo.cicIderegistro = :idCiclo and dp.perPeriodo.perEstado = 'A' and dp.dperEstado = 'A' and dp.cicCiclo.cicEstado = 'A' ")
	List<DperDetperiodo> getFechasLiquidacionAprovechamiento(@Param("idCiclo") Integer idCiclo);

}
