package com.bioagricola.apirest.aprovechamiento.negocio.interfaces;

import com.bioagricola.apirest.modelo.dtos.ColiConliquidaAproDTO;
import com.bioagricola.apirest.modelo.dtos.ConConceptoDTO;
import com.bioagricola.apirest.modelo.dtos.LiquidacionesConceptoDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.util.List;

public interface IParametrizacionLiquidacion {

	public List<LiquidacionesConceptoDTO> consultaParametrosLiquidacione()
			throws IOException, InvalidParameterException;

	public List<Object> consultaMunicipiosTA(@RequestParam("terIderegistro")Long terIderegistro)
			throws IOException, InvalidParameterException ;

	public Boolean insertarConceptosParam(@RequestBody ColiConliquidaAproDTO coliConliquidaAprovechamientoDTO);

	public List<ConConceptoDTO> consultarConceptosAprov(@RequestParam("uniLiquidacion") Integer uniLiquidacion)
			throws IOException;

	public Page<ColiConliquidaAproDTO> listarConceptosParametrizados(@RequestParam(value = "search")String search,
																	 @RequestParam(value = "apro")String apro, Pageable page);

	public boolean consultarPrivilegios (@RequestParam("idPrograma") Integer idPrograma)
			throws IOException;

}
