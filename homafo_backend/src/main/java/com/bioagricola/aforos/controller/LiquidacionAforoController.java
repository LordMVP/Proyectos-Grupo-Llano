package com.bioagricola.aforos.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.controller.generic.AbstractRestController;
import com.bioagricola.aforos.entity.dto.LiquidacionDTO;
import com.bioagricola.aforos.entity.dto.ResponseDTO;
import com.bioagricola.aforos.service.impl.LiquidacionServiceImpl;

@RestController
@RequestMapping("/api/liquidacion")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LiquidacionAforoController extends AbstractRestController{

	@Autowired
	private LiquidacionServiceImpl liquidacionServiceImpl;
	
	@PostMapping(value= "/buscar")
	public ResponseDTO<LiquidacionDTO> search(@Valid @RequestBody LiquidacionDTO dto) {
		LiquidacionDTO response = liquidacionServiceImpl.search(dto);
        return new ResponseDTO<>(Boolean.TRUE,response);
	}
	
	@PostMapping(value= "/preliquidar")
	public ResponseDTO<LiquidacionDTO> preLiquidar(@Valid @RequestBody LiquidacionDTO dto) {
		LiquidacionDTO response = liquidacionServiceImpl.preLiquidar(dto);
		if(response.getMensaje()!=null && (response.getIdAforo()==null || response.getIdAforo()<=0))
			return new ResponseDTO<>(Boolean.FALSE,response.getMensaje(),response);
		return new ResponseDTO<>(Boolean.TRUE,response);
	}
	
	@PostMapping(value= "/liquidar")
	public ResponseDTO<LiquidacionDTO> liquidar(@Valid @RequestBody LiquidacionDTO dto) {
		LiquidacionDTO response = liquidacionServiceImpl.liquidar(dto);
		if(response.getMensaje()!=null && (response.getIdAforo()==null || response.getIdAforo()<=0))
			return new ResponseDTO<>(Boolean.FALSE,response.getMensaje(),response);
		return new ResponseDTO<>(Boolean.TRUE,response);
	}
}
