package com.bioagricola.homologaciones.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.dto.BarrioInfoDTO;
import com.bioagricola.common.entity.Barrios;
import com.bioagricola.common.util.BasicReflectionConvert;
import com.bioagricola.homologaciones.controller.generic.AbstractHomogacionesRestController;
import com.bioagricola.homologaciones.dto.basic.BarriosDTO;
import com.bioagricola.homologaciones.dto.basic.BasicCompactDTO;
import com.bioagricola.homologaciones.dto.facade.BarriosDTOFacade;
import com.bioagricola.homologaciones.dto.http.ResponseHomologacionesDTO;
import com.bioagricola.homologaciones.service.impl.BarriosService;

@RestController
@RequestMapping("/api/barrios")
public class BarriosRestController extends AbstractHomogacionesRestController<Barrios,BarriosDTO>
{
	@Autowired
	private BarriosService service;
	@Autowired
	private BarriosDTOFacade barriosFacade;
	@Autowired
	AuthenticationFacade authFacade;
	
	
	@GetMapping("/{codigo}")
	public ResponseHomologacionesDTO<List<BasicCompactDTO>> datosHomologacion(@PathVariable("codigo") String codigo) 
	{	
		BasicReflectionConvert<Barrios> basicConverter =  new BasicReflectionConvert<>(Barrios.class,"barrioIderegistro","barrioNom");
		List<Barrios> barrios = service.getByCodpro(codigo);
		List<BasicCompactDTO> barriosDto = basicConverter.convert(barrios);
		ResponseHomologacionesDTO<List<BasicCompactDTO>> response = new ResponseHomologacionesDTO<>(Boolean.TRUE,"",barriosDto);
		return response; 
	}
	
	
	@GetMapping("/nativo/{codigo}")
	public List<HashMap<String, Object>> barriosNativo(@PathVariable("codigo") String codigo) 
	{
		return service.listaBarrios(codigo);
	}
	
	@GetMapping("/nativo/{codigo}/{codemp}")
	public List<HashMap<String, Object>> barriosNativo(@PathVariable("codigo") String codigo,@PathVariable("codemp") String codemp) 
	{
		return service.listaBarrioCodemp(codigo,codemp);
	}
	
	@GetMapping("/complementoPropiedad/{municipio}/{barrio}")
	public List<HashMap<String, Object>> complementoPropiedad(@PathVariable("municipio") Integer municipio , @PathVariable("barrio") Integer barrio) 
	{	
		return service.complementoPropiedad(municipio,barrio);
	}
	
	@GetMapping(path="/dto/page")
	public ResponseEntity<Page<BarriosDTO>> getBarriosByEmpresa(Pageable pageable){		
		return ResponseEntity.ok(this.convertPageToPageDto(this.service.findByEmpresa(authFacade.getIdEmpresa(),pageable)));		
	}
	
	@GetMapping(path="/dto/page/empresa/{empresa}")
	public ResponseEntity<Page<BarriosDTO>> getBarriosByEmpresa(@PathVariable("empresa") Integer empresa,Pageable pageable){		
		return ResponseEntity.ok(this.convertPageToPageDto(this.service.findByEmpresa(empresa,pageable)));		
	}

	@Override
	protected BarriosDTOFacade getFacade() {
		// TODO Auto-generated method stub
		return barriosFacade;
	}
	
	@PostMapping(path="/dto/page/search/{search}")
	public ResponseEntity<Page<BarriosDTO>> getBarriosByEmpresaSearch(@PathVariable(name="search")String search,Pageable pageable){		
		return ResponseEntity.ok(this.convertPageToPageDto(this.service.findByEmpresaAnLikeNombre(authFacade.getIdEmpresa(),search,pageable)));		
	} 

	@RequestMapping(path = "/microruta/{microRuta}",method = RequestMethod.GET)
	public ResponseEntity<List<BarrioInfoDTO>> getBarriosByMicroRuta(@PathVariable(name="microRuta")Integer microRuta){
			return ResponseEntity.ok(service.findBarriosByMicroRuta(microRuta));
	}
	
}
