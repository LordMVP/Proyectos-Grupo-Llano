package com.bioagricola.homologaciones.controller;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.common.util.BasicReflectionConvert;
import com.bioagricola.homologaciones.controller.generic.AbstractHomogacionesRestController;
import com.bioagricola.homologaciones.dto.basic.GenGeneradorDTO;
import com.bioagricola.homologaciones.dto.facade.AbstractDTOFacade;
import com.bioagricola.homologaciones.dto.facade.GenGeneradorDTOFacade;
import com.bioagricola.homologaciones.entity.GenGenerador;
import com.bioagricola.homologaciones.service.impl.GenGeneradorService;

@RestController
@RequestMapping(path = "api/generadores")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class GenGeneradorRestController extends AbstractHomogacionesRestController<GenGenerador, GenGeneradorDTO> {

	@Autowired
	private GenGeneradorService generadorService;
	
	@Autowired 
	ModelMapper modelMapper;
	@Autowired
	BasicReflectionConvert<UniUnidad> unidadBasicConverter;
	@Autowired
	GenGeneradorDTOFacade generadorFacade;
	
	@Autowired
	private AuthenticationFacade authFacade;
	
	
	@GetMapping(path = "/dto")
	public ResponseEntity<Page<GenGeneradorDTO>> getGeneradoresDto(Pageable pageable,@RequestParam Optional<String> search,@RequestParam Optional<String> filter){
		Page<GenGenerador> page = this.generadorService.findAll(pageable,search,filter);
		Page<GenGeneradorDTO> pageDto = this.convertPageToPageDto(page);	
		return new ResponseEntity<>(pageDto,HttpStatus.OK);		
	}
	
	@PostMapping(path = "/dto")
	public ResponseEntity<GenGeneradorDTO> saveDto(@RequestBody GenGeneradorDTO dto){
		GenGenerador generador = generadorFacade.convertToEntity(dto);
		generador.setUsuIderegistro(authFacade.getIdUsuario());	
		generador.getUnidad().setUsuIderegistro(authFacade.getIdUsuario());
		generador = this.generadorService.save(generador);		
		return ResponseEntity.ok(generadorFacade.convertToDto(generador));
	}
	
	@PutMapping(path="/dto/{id}")
	public ResponseEntity<GenGeneradorDTO> updateFromDto(@PathVariable("id") Long id,@RequestBody GenGeneradorDTO dto){
		GenGenerador generador = this.generadorService.findById(id);
		GenGenerador generadorUpdate = generadorFacade.convertToEntity(dto);			
		generadorUpdate.setUsuIderegistro(authFacade.getIdUsuario());
		GenGenerador nueva = generadorFacade.mapForUpdate(generador, generadorUpdate);
		System.out.println(nueva.getUsuIderegistro());
		nueva.getUnidad().setUsuIderegistro(authFacade.getIdUsuario());
		nueva = this.generadorService.save(nueva);
		return ResponseEntity.ok(generadorFacade.convertToDto(nueva));
	}

	@Override
	protected AbstractDTOFacade<GenGenerador, GenGeneradorDTO> getFacade() {
		// TODO Auto-generated method stub
		return this.generadorFacade;
	}
	
	
}
