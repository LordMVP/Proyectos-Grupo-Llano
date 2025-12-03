package com.bioagricola.homologaciones.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.aforos.service.impl.AforoServiceImpl;
import com.bioagricola.homologaciones.controller.generic.AbstractHomogacionesRestController;
import com.bioagricola.homologaciones.dto.basic.TafoTipoAforoDTO;
import com.bioagricola.homologaciones.dto.facade.AbstractDTOFacade;
import com.bioagricola.homologaciones.dto.facade.TafoTipoAforoDTOFacade;
import com.bioagricola.homologaciones.entity.TafoTipoAforo;
import com.bioagricola.homologaciones.service.impl.TafoTipoAforoService;

@RestController
@RequestMapping(path = "api/tiposaforo")

public class TafoTipoAforoRestController extends AbstractHomogacionesRestController<TafoTipoAforo, TafoTipoAforoDTO> {

	@Autowired
	private TafoTipoAforoService tipoAforoService;
	@Autowired
	private TafoTipoAforoDTOFacade tipoAforoConverterFacade;

	@Autowired
	private AuthenticationFacade authFacade;
	
	@Autowired
	private AforoServiceImpl aforoService;

	@GetMapping(path = "/dto")
	public ResponseEntity<Page<TafoTipoAforoDTO>> getTiposAforoDto(Pageable pageable,Optional<String> search,Optional<String> filter) {
		Page<TafoTipoAforo> tiposAforo = this.tipoAforoService.findAll(pageable,search,filter);
		Page<TafoTipoAforoDTO> pageDto = this.convertPageToPageDto(tiposAforo);
		return ResponseEntity.ok(pageDto);
	}

	@Override
	protected AbstractDTOFacade<TafoTipoAforo, TafoTipoAforoDTO> getFacade() {
		// TODO Auto-generated method stub
		return this.tipoAforoConverterFacade;
	}

	@PostMapping(path = "/dto")
	public ResponseEntity<TafoTipoAforo> saveTipoAforo(@RequestBody TafoTipoAforoDTO dto) {
		TafoTipoAforo tipoAforo = this.tipoAforoConverterFacade.convertToEntity(dto);
		tipoAforo.setUsuIderegistro(authFacade.getIdUsuario());
		tipoAforo.setDateCreated(new Date());
		tipoAforo = this.tipoAforoService.save(tipoAforo);
		new ResponseEntity<TafoTipoAforo>(HttpStatus.OK);
		return ResponseEntity.ok(tipoAforo);
	}

	@PutMapping(path = "/dto/{id}")
	public ResponseEntity<TafoTipoAforo> updateTipoAforo(@PathVariable("id") Long id,
			@RequestBody TafoTipoAforoDTO dto) {
		TafoTipoAforo tipoAforo = this.tipoAforoService.findById(id);
		TafoTipoAforo tipoAforoUpdate = this.tipoAforoConverterFacade.convertToEntity(dto);
		TafoTipoAforo nuevo = this.tipoAforoConverterFacade.mapForUpdate(tipoAforo, tipoAforoUpdate);
		nuevo.getUnidad().setUsuIderegistro(authFacade.getIdUsuario());
		nuevo.setUsuIderegistro(authFacade.getIdUsuario());
		nuevo.setDateCreated(new Date());
		nuevo = this.tipoAforoService.save(nuevo);		
		return ResponseEntity.ok(nuevo);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/fechaFinalAforo/{tafoIderegistro}/{rureIderegistro}/{fechaInicial}")
	public List<HashMap<String, Object>> fechaFinalAforo(@PathVariable("tafoIderegistro") Integer tafoIderegistro,@PathVariable("rureIderegistro") Integer rureIderegistro,@PathVariable("fechaInicial") String fechaInicial) 
	{
		return aforoService.fechaFinalAforo(tafoIderegistro, rureIderegistro, fechaInicial);
	}

}
