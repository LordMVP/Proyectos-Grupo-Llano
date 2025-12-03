package com.bioagricola.aforos.controller;

import java.util.List;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.controller.generic.AbstractRestController;
import com.bioagricola.aforos.entity.Aforo;
import com.bioagricola.aforos.entity.dto.NewAforoMultiDTO;
import com.bioagricola.aforos.entity.dto.ResponseDTO;
import com.bioagricola.aforos.entity.dto.SearchDTO;
import com.bioagricola.aforos.entity.dto.SearchResponseDTO;
import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.aforos.service.impl.AforoMultiusuarioServiceImpl;
import com.bioagricola.aforos.service.impl.DetalleAforoServiceImpl;
import com.bioagricola.aforos.service.impl.MaestroAforoVisitaServiceImpl;
import com.bioagricola.common.exception.BusinessException;

@RestController
@RequestMapping("/api/aforomulti")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AforoMultiusuarioController extends AbstractRestController{
    private static final Logger LOGGER = LoggerFactory.getLogger(AforoMultiusuarioController.class);
	@Autowired
	private AforoMultiusuarioServiceImpl aforoMultiusuarioServiceImpl;
	@Autowired
	private DetalleAforoServiceImpl detalleAforoServiceImpl;
	@Autowired
	private MaestroAforoVisitaServiceImpl maestroAforoVisitaServiceImpl;	
	@Autowired
	private AuthenticationFacade authenticationFacade;
	Logger log= LoggerFactory.getLogger(this.getClass());
	
	/**
	 * Buscador general de nuevo aforo
	 */
	@GetMapping(value= "/buscar")
	@ResponseBody
	public ResponseDTO<List<SearchResponseDTO>> searchAforos(SearchDTO searchDTO) {
		List<SearchResponseDTO> response = aforoMultiusuarioServiceImpl.searchAforos(searchDTO);	
        return new ResponseDTO<>(Boolean.TRUE,response);
	}

	@GetMapping(value= "/buscarById/{id}")
	@ResponseBody
	public ResponseDTO<NewAforoMultiDTO> searchMultiusuario(@PathVariable String id) {
		//System.out.println("------buscar en multiusuario " + id);
		NewAforoMultiDTO response = aforoMultiusuarioServiceImpl.searchMultiAforosById(id);
	
        return new ResponseDTO<>(Boolean.TRUE,response);
	}
	
	@GetMapping("/buscarSuscripcion")
	public ResponseDTO<SearchResponseDTO> searchSuscripcion(SearchDTO searchDTO) {
		SearchResponseDTO response = aforoMultiusuarioServiceImpl.searchSuscripcion(searchDTO);
		if(response.getIdSuscripcion()!=null) {
			return new ResponseDTO<>(Boolean.TRUE,response);
		}else {
			ResponseDTO<SearchResponseDTO> r = new ResponseDTO<>();
			r.setSuccess(Boolean.FALSE);
			r.setMessage("No se han encontrado resultados para los criterios de búsqueda.");
			r.setData(new SearchResponseDTO());
			return r;
		}
	}
	
	@PostMapping("/nuevo")
    public ResponseDTO<Aforo> saveAforo(@Valid @RequestBody NewAforoMultiDTO newAforoMultiDTO) {		
		try {
			//log.error("DTO"+newAforoMultiDTO.getComplementoIdregistro());
			Aforo aforoBD = aforoMultiusuarioServiceImpl.saveAforo(newAforoMultiDTO);			
			/*
			 * aforoBD.setDetallesAforo(Arrays.asList(detalleAforoServiceImpl.saveDetalleAforoNormal(aforoBD, newAforoMultiDTO)));
			 *  maestroAforoVisitaServiceImpl.crearVisitas(aforoBD, null);
			 */
			//maestroAforoVisitaServiceImpl.crearVisitas(aforoBD, authenticationFacade.getCredentials().getUsuprgunid());
           return new ResponseDTO<>(Boolean.TRUE,aforoBD);
		}catch(BusinessException e) {
			return new ResponseDTO<>(Boolean.FALSE,e.getMessage(),null);
		}
    }
	
	@PutMapping("/updateMultiAforo")
    public ResponseDTO<Aforo> updateMultiAforo(@Valid @RequestBody NewAforoMultiDTO dto) {
		Aforo response = aforoMultiusuarioServiceImpl.updateMultiAforo(dto);
        return new ResponseDTO<>(Boolean.TRUE,response);
    }
	
	@PutMapping("/editar")
    public ResponseDTO<Aforo> editAforo(@Valid @RequestBody NewAforoMultiDTO dto) {
		Aforo response = aforoMultiusuarioServiceImpl.editAforo(dto);
        return new ResponseDTO<>(Boolean.TRUE,response);
    }
	
	@GetMapping(value= "/buscarByIdPadre/{id}")
	@ResponseBody
	public ResponseDTO<NewAforoMultiDTO> searchMultiusuarioPadre(@PathVariable String id) 
	{
		NewAforoMultiDTO response = aforoMultiusuarioServiceImpl.searchMultiAforosByIdPadre(id);
	
        return new ResponseDTO<>(Boolean.TRUE,response);
	}
	
}
