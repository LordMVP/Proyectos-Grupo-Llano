package com.bioagricola.homologaciones.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.entity.RutRuta;
import com.bioagricola.homologaciones.controller.generic.AbstractHomogacionesRestController;
import com.bioagricola.homologaciones.dto.basic.RutRutaDTO;
import com.bioagricola.homologaciones.dto.facade.AbstractDTOFacade;
import com.bioagricola.homologaciones.dto.facade.RutRutaDTOFacade;
import com.bioagricola.homologaciones.service.impl.RutRutaService;

@RestController
@RequestMapping(path = "api/rutRuta")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RutRutaRestController extends AbstractHomogacionesRestController<RutRuta, RutRutaDTO>
{
	@Autowired
	private RutRutaService service;
	@Autowired
	private RutRutaDTOFacade rutRutaFacade;
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	Logger log=LoggerFactory.getLogger(RutRutaRestController.class);

	@Override
	protected AbstractDTOFacade<RutRuta, RutRutaDTO> getFacade() {
		// TODO Auto-generated method stub
		return rutRutaFacade;
	}
	
	@GetMapping(path = "/dto/macrorutas")
	public ResponseEntity<Page<RutRutaDTO>> getMacroRutas(Pageable pageable,@RequestParam("search") Optional<String> search){
		//String search
		Page<RutRuta> rutas = this.service.getByTipoRutaAndLikeName(3017, pageable,search);
		Page<RutRutaDTO> pageDto = this.convertPageToPageDto(rutas);
		return ResponseEntity.ok(pageDto);		
	}
	
	@GetMapping(path = "/dto/tipo/{tipoRuta}")
	public ResponseEntity<Page<RutRutaDTO>> getByTipo(Pageable pageable,@PathVariable(name = "tipoRuta") Integer tipoRuta,@RequestParam Optional<String> search){
		Page<RutRutaDTO> pageDto = this.convertPageToPageDto(this.service.getByTipoRutaAndLikeName(tipoRuta, pageable, search));
		return ResponseEntity.ok(pageDto);
	}
	
	@GetMapping(path="/dto/{id}")
	public ResponseEntity<RutRutaDTO> getById(@PathVariable(name="id") Long id){
		RutRutaDTO dto = this.rutRutaFacade.convertToDto(this.service.findById(id));
		return ResponseEntity.ok(dto);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/{rutRuta}")
	public List<HashMap<String, Object>> listaRutas(@PathVariable("rutRuta") Integer rutRuta) 
	{
		return service.listaRutas(rutRuta);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/macroRutas/{empresa}")
	public List<HashMap<String, Object>> listaMacroRutas(@PathVariable("empresa") Integer empresa) 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.listaMacroRutas(idEmpresa,empresa);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/rutasTipo/{tipo}")
	public List<HashMap<String, Object>> listaRutasTipo(@PathVariable("tipo") Integer tipo) 
	{
		return service.listaRutasTipo(tipo);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/buscardMubaRuta/{ruta}")
	public String buscarMicroRuta(@PathVariable("ruta") Integer ruta) 
	{
		return service.buscarMacroRutas(ruta);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/rutasBarrioTipo/{tipo}/{barrio}")
	public List<HashMap<String, Object>> listaRutasBarrioTipo(@PathVariable("tipo") Integer tipo, @PathVariable("barrio") Integer barrio) 
	{
		return service.listaRutasBarrioTipo(tipo,barrio);
	}

}
