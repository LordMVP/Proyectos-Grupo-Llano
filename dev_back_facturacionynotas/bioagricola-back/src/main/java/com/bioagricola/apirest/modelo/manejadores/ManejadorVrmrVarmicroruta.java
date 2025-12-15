package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.stereotype.Service;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import com.bioagricola.apirest.modelo.entidades.VrmrVarmicroruta;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import java.util.List;

@Service
public interface ManejadorVrmrVarmicroruta
		extends ManejadorCrud<VrmrVarmicroruta, Integer>, IManejadorCrud<VrmrVarmicroruta, Integer> {
    
    @Query("select var from VrmrVarmicroruta var " + "where var.conIderegistro IN :listaIndicadores "
			+ "and var.empIderegistro = :idEmpresa " + "and var.perIderegistro = :perIderegistro and var.vrmrValor > 0 ")
	   List<VrmrVarmicroruta>consultaReporteIndCalidadVrm(@Param("perIderegistro") Integer perIderegistro,
			@Param("listaIndicadores") List<Integer> listaIndicacodres, @Param("idEmpresa") int idEmpresa);

}
