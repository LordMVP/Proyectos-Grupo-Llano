package com.bioagricola.aforos.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.controller.generic.AbstractRestController;
import com.bioagricola.aforos.entity.dto.ConsolidatedAforoDTO;
import com.bioagricola.aforos.entity.dto.HistoricosAforoDTO;
import com.bioagricola.aforos.entity.dto.ResponseDTO;
import com.bioagricola.aforos.entity.dto.SearchDTO;
import com.bioagricola.aforos.entity.dto.SearchResponseDTO;
import com.bioagricola.aforos.entity.dto.VisitEditAforoDTO;
import com.bioagricola.aforos.service.impl.HAforoServiceImpl;

@RestController
@RequestMapping("/api/historicos")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class HistoricosController extends AbstractRestController{
	       
	@Autowired
	private HAforoServiceImpl haforoServiceImpl;
	
	
	/**
	 * Buscador de historicos aforo
	 */
	@GetMapping(value= "/consultarHistoricos")
	public ResponseDTO<List<SearchResponseDTO>> historicosAforos(SearchDTO searchDTO) {
		List<SearchResponseDTO> response = haforoServiceImpl.searchAforos(searchDTO);
        return new ResponseDTO<>(Boolean.TRUE,response);
	}
	
	/*
	 *Obtener Aforo historico con la informacion de visitas por id de Aforo 
	 */
	
	@GetMapping(value= "/historicoByIdAforo/{idAforo}")
	@ResponseBody
	public ResponseDTO<List<HistoricosAforoDTO>> historicoByIdAforo(@PathVariable Long idAforo) {		
		if (idAforo != null) {
           return new ResponseDTO<>(Boolean.TRUE,haforoServiceImpl.getHistoricosByIdAforo(idAforo));
		}else {
			return new ResponseDTO<>(Boolean.FALSE,"Error: idAforo nulo");
		}
	}
	/*
	 * Obtener detalle de visitas(aforos realizados) segun el numero de aforo
	 */
	@GetMapping("/historicoDetalleVisitasByIdAforo")
	public ResponseDTO<List<VisitEditAforoDTO>> getDetallesVisitas(SearchDTO searchDTO) {
		List<VisitEditAforoDTO> response = haforoServiceImpl.getHistoricoDetallesVisitas(searchDTO);		
		return new ResponseDTO<>(Boolean.TRUE,response);
	}	
	
	@GetMapping("/consolidadoAforo")
	public ResponseDTO<List<ConsolidatedAforoDTO>> getConsolidadoAforos(SearchDTO searchDTO) {	
		List<ConsolidatedAforoDTO> response = haforoServiceImpl.getHConsolidados(searchDTO);
		if(response.isEmpty()) {
			ConsolidatedAforoDTO c = new ConsolidatedAforoDTO();
								 c.setDetalles(new ArrayList<>());;
			response.add(c);
		}		
		return new ResponseDTO<>(Boolean.TRUE,response);
	}
	
	
	/*@GetMapping("/getaforvencidos")
	public void getaforvencidos(SearchDTO searchDTO) {	
			haforoServiceImpl.vigenciaAforoConsulta();
	}*/
	
	
}
