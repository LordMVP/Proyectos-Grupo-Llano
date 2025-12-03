package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.DecaDesccalidad;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

@Service
public interface ManejadorDecaDesccalidad
		extends ManejadorCrud<DecaDesccalidad, Long>, IManejadorCrud<DecaDesccalidad, Long> {

	@Query("select dd from DecaDesccalidad dd  " + "where dd.dsusIderegistr =:dsusIderegistr  "
			+ "and dd.uniConceptoTarifas =:idConceptoTarifas "
			+ "and dd.perIderegistroTarifas =:idPerdiodoDescuentoTarifas "
			+ "and ( :rutIdemicroruta is null OR dd.rutIderegistro =:rutIdemicroruta ) ")
	DecaDesccalidad validarDesceuntoPorSuscrip(@Param("dsusIderegistr") Long dsusIderegistr,
			@Param("idConceptoTarifas") Integer idConceptoTarifas,
			@Param("idPerdiodoDescuentoTarifas") Integer idPerdiodoDescuentoTarifas,
			@Param("rutIdemicroruta") Integer rutIdemicroruta);

}
