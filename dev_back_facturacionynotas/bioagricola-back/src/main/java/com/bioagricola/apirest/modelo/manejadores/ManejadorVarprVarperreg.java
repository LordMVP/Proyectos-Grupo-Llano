package com.bioagricola.apirest.modelo.manejadores;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.VarprVarperreg;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

@Service
public interface ManejadorVarprVarperreg
		extends ManejadorCrud<VarprVarperreg, Integer>, IManejadorCrud<VarprVarperreg, Integer> {

	@Query("select var from VarprVarperreg var " + "where var.conIderegistro IN :listaIndicadores "
			+ "and var.empIderegistro = :idEmpresa " + "and var.perIderegistro = :perIderegistro ")
	List<VarprVarperreg> consultaReporteIndCalidad(@Param("perIderegistro") Integer perIderegistro,
			@Param("listaIndicadores") List<Integer> listaIndicacodres, @Param("idEmpresa") int idEmpresa);

}
