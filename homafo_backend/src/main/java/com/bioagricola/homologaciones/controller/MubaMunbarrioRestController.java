package com.bioagricola.homologaciones.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.entity.Barrios;
import com.bioagricola.common.entity.MbruMunbarruta;
import com.bioagricola.common.entity.MubaMunbarrio;
import com.bioagricola.common.entity.RutRuta;
import com.bioagricola.common.repository.MbruMunbarrutaRepository;
import com.bioagricola.common.repository.RutRutaRepository;
import com.bioagricola.homologaciones.controller.generic.AbstractHomogacionesRestController;
import com.bioagricola.homologaciones.dto.MubaMunBarrioElementPageDto;
import com.bioagricola.homologaciones.dto.ResultOperationResponse;
import com.bioagricola.homologaciones.dto.basic.MubaMunbarrioDTO;
import com.bioagricola.homologaciones.dto.facade.AbstractDTOFacade;
import com.bioagricola.homologaciones.dto.facade.MubaMunbarrioDTOFacade;
import com.bioagricola.homologaciones.repository.BarriosRepository;
import com.bioagricola.homologaciones.service.impl.MubaMunbarrioService;

import io.jsonwebtoken.lang.Objects;

@RestController
@RequestMapping(path = "api/muba")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class MubaMunbarrioRestController extends AbstractHomogacionesRestController<MubaMunbarrio, MubaMunbarrioDTO> {

	@Autowired
	private MubaMunbarrioDTOFacade facade;
	@Autowired
	private MubaMunbarrioService service;
	@Autowired
	private AuthenticationFacade authFacade;
	
	@Autowired
	private RutRutaRepository rutaRepository;	
	@Autowired
	private MbruMunbarrutaRepository mbruRepository;
	@Autowired
	private BarriosRepository barriosRepository;

	private Page<MubaMunBarrioElementPageDto> convertPageToDto(Page<MubaMunbarrio> page) {
		List<MubaMunBarrioElementPageDto> contentDto = page.getContent().stream()
				.map(gen->this.convertElement(gen))
				.collect(Collectors.toList());
		Page<MubaMunBarrioElementPageDto> pageDto = new PageImpl<MubaMunBarrioElementPageDto>(contentDto,page.getPageable(),page.getTotalElements());
		return pageDto;
	}
	private MubaMunBarrioElementPageDto convertElement(MubaMunbarrio entity) {
		MubaMunBarrioElementPageDto dto = new MubaMunBarrioElementPageDto();
		dto.setBarrioIderegistro(entity.getUniBarrio().getBarrioIderegistro());
		dto.setBarrioNombre(entity.getUniBarrio().getBarrioNom());
		dto.setMunIderegistro(entity.getUniMunicipio().getProyectoIderegistro());
		dto.setMunNombre(entity.getUniMunicipio().getProyectoNom());
		dto.setSecIderegistro(entity.getMubaSector().getSecIderegistro());
		dto.setSecNombre(entity.getMubaSector().getSecNombre());
		return dto;
	}
	@GetMapping(path = "/dto/page")
	public ResponseEntity<Page<MubaMunBarrioElementPageDto>> getPageEmpresa(Pageable pageable,Optional<String> search) {
		Page<MubaMunbarrio> page = this.service.findByEmpresaPage(authFacade.getIdEmpresa(), pageable,search);
		return ResponseEntity.ok(this.convertPageToDto(page));
	}

	@GetMapping(path = "/dto/municipio/{municipio}/barrio/{barrio}")
	public ResponseEntity<MubaMunbarrioDTO> getMubaEmpresaMunicipioBarrio(
			@PathVariable(name = "municipio") Integer municipio, @PathVariable(name = "barrio") Integer barrio) {
		MubaMunbarrio muba = this.service.findByEmpresaMunicipioBarrio(authFacade.getIdEmpresa(), municipio, barrio)
				.orElseThrow(() -> new javax.persistence.EntityNotFoundException());
		return ResponseEntity.ok(this.facade.convertToDto(muba));
	}

	/* AGREGA RUTAS BARRIDO - ZONA ALTO RIESGO *///JLMENDOZA
	@PostMapping(path = "/dto")
	public ResponseEntity<ResultOperationResponse> save(@RequestBody MubaMunbarrioDTO dto) {
		MubaMunbarrio entity = this.facade.convertToEntity(dto);		
		entity.setUsuIderegistro(authFacade.getIdUsuarioLong());
		Barrios barrio=entity.getUniBarrio();
		ResultOperationResponse result = new ResultOperationResponse();
		
		System.out.println("SECTOR"+entity.getMubaSector().getSecIderegistro());
		try {
			if(!dto.getZonaRiesgo().isEmpty()) {
				barriosRepository.updateBarrioZona(Boolean.valueOf(dto.getZonaRiesgo()), barrio.getBarrioIderegistro().intValue());
			} 

			entity = this.service.save(entity);	
			
			/* Ruta Barrido */
			MbruMunbarruta mbru=mbruRepository.findByMubaIderegistro(entity).orElse(new MbruMunbarruta());
			if(mbru.getMubaIderegistro()==null) mbru.setMubaIderegistro(entity);
			//System.out.println("MBRU"+mbru.getMubaIderegistro().toString());
			RutRuta ruta = rutaRepository.findById(dto.getMbru().get(0)).orElseThrow(() -> new javax.persistence.EntityNotFoundException());
			mbru.setRutIderegistro(ruta);
			mbru.setUsuIderegistro(authFacade.getIdUsuarioLong());
			mbruRepository.save(mbru);
			
			result.setCode(0);
			result.setMessage("Parametrizacion guardada correctamente!");
			result.setResult("success");
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			result.setCode(-1);
			result.setMessage(e.getMessage());
			result.setResult("error");
			return ResponseEntity.ok(result);
		}
	
	}

	@Override
	protected AbstractDTOFacade<MubaMunbarrio, MubaMunbarrioDTO> getFacade() {
		// TODO Auto-generated method stub
		return facade;
	}

}
