package com.bioagricola.homologaciones.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.entity.EstEstructura;
import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.common.util.BasicReflectionConvert;
import com.bioagricola.homologaciones.controller.generic.AbstractHomogacionesRestController;
import com.bioagricola.homologaciones.controller.generic.EntityNotFoundException;
import com.bioagricola.homologaciones.dto.basic.UniUnidadDTO;
import com.bioagricola.homologaciones.dto.facade.AbstractDTOFacade;
import com.bioagricola.homologaciones.dto.facade.UniUnidadDTOFacade;
import com.bioagricola.homologaciones.service.impl.EstEstructuraService;
import com.bioagricola.homologaciones.service.impl.UniUnidadService;

@RestController
@RequestMapping(path = "api/unidades")
public class UniUnidadRestController extends AbstractHomogacionesRestController<UniUnidad, UniUnidadDTO>
{
	

	@Autowired
	private UniUnidadService service;
	@Autowired
	private EstEstructuraService estructuraService;
	
	@Autowired
	private UniUnidadDTOFacade unidadFacade; 
	
	@Autowired
	BasicReflectionConvert<UniUnidad> dtoUnidadConverter;
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	@GetMapping("/{clase}/{empresa}")
	public List<HashMap<String, Object>> informcionUnidad( @PathVariable("clase") Integer clase, @PathVariable("empresa") Integer empresa) 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.informcionUnidad( clase, idEmpresa);
	}
	
	
	@GetMapping("/{clase}/{empresa}/{tercero}")
	public List<HashMap<String, Object>> informcionUnidadTercero( @PathVariable("clase") Integer clase, @PathVariable("empresa") Integer empresa, @PathVariable("tercero") Integer tercero) 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.informcionUnidadTercero(clase, idEmpresa, tercero);
	}
	
	
	@GetMapping("/dto/{clase}/{empresa}")
	public Page<UniUnidadDTO> byClaseAndEmpresaPageBasicDTO(@PathVariable("clase") Long clase, @PathVariable("empresa") Long empresa,Pageable pageable,Optional<String> search,Optional<String> filter)
	{
		Page<UniUnidad> unidades = service.getByClaseAndEmpresa(clase, empresa,pageable,search,filter);
		List<UniUnidadDTO> unidadesDto = unidades.getContent()
				.stream()
				.map(uni->unidadFacade.convertToDto(uni))
				.collect(Collectors.toList());
				//dtoUnidadConverter.convert(unidades.getContent());
		unidadesDto.stream().forEach(u->System.out.println(u.getUniPropiedad()));
		Page<UniUnidadDTO> pageDto = new PageImpl<UniUnidadDTO>(unidadesDto,pageable,unidades.getTotalElements());		
		return pageDto;
	}	
	
	@GetMapping("/dto/{clase}")
	public ResponseEntity<Page<UniUnidadDTO>> getByClase(@PathVariable Long clase,Pageable pageable,@RequestParam Optional<String> search,@RequestParam Optional<String> filter){		
		return ResponseEntity.ok(this.byClaseAndEmpresaPageBasicDTO(clase, autoFacade.getIdEmpresaLong(), pageable,search,filter));
	}	
	
	@PostMapping(path = "/dto/{clase}")
	public ResponseEntity<UniUnidad> saveDtoByClase(@PathVariable Long clase,@RequestBody UniUnidadDTO dto) {
		UniUnidad unidad = this.service.findByCodigoOrNombre(dto.getUniCodigo(),dto.getUniNombre1()).orElse(this.unidadFacade.convertToEntity(dto));
		if (unidad.getUniIderegistro()!=null) {
			return new ResponseEntity<UniUnidad>(unidad,HttpStatus.CONFLICT);
		}
		//UniUnidad unidad = this.unidadFacade.convertToEntity(dto);		
		EstEstructura estEstructura = this.estructuraService.getByClaseAndEmpresa(clase,autoFacade.getIdEmpresaLong());
		unidad.setEstIderegistro(estEstructura);
		unidad.setUsuIderegistro(autoFacade.getIdUsuario());
		unidad.setUniOrden(1L);
		unidad.setUniCodigo(unidad.getUniCodigo().toUpperCase());
		unidad.setUniCodigo1(unidad.getUniCodigo().toUpperCase());		
		this.service.save(unidad);
		return new ResponseEntity<UniUnidad>(unidad,HttpStatus.OK);
	}
	@PutMapping(path="/dto/{id}")
	public ResponseEntity<UniUnidad> updateFromDtoByClase(@PathVariable Long id,@RequestBody UniUnidadDTO dto){
		System.out.println("JSON DTO" + dto.getUniPropiedad());
		UniUnidad unidad = this.service.findByIdOptional(id).orElseThrow(() -> new EntityNotFoundException(UniUnidad.class,"Id",id.toString()));		
		UniUnidad updateUnidad = this.unidadFacade.convertToEntity(dto);
		
		unidad = this.unidadFacade.mapForUpdate(unidad, updateUnidad);
		//unidad = dtoUnidadConverter.mapEntityToEntity(updateUnidad, unidad);
		unidad.setUniCodigo(unidad.getUniCodigo().toUpperCase());
		unidad.setUniCodigo1(unidad.getUniCodigo1().toUpperCase());
		this.service.save(unidad);
		return new ResponseEntity<UniUnidad>(unidad,HttpStatus.OK);		
	}
	
	@GetMapping(path = "/test/{id}")
	public ResponseEntity<UniUnidadDTO> getTest(@PathVariable("id") Long id){
		UniUnidad unidad = this.service.findByIdOrNull(id);
		//ResponseEntity<UniUnidad> response = new ResponseEntity<UniUnidad>(HttpStatus.OK);
		return ResponseEntity.ok(unidadFacade.convertToDto(unidad));
	}


	@Override
	protected AbstractDTOFacade<UniUnidad, UniUnidadDTO> getFacade() {
		// TODO Auto-generated method stub
		return unidadFacade;
	}
	
	
	@GetMapping("/uniUspu/{programa}/{clase}")
	public List<HashMap<String, Object>> informcionUnidadUspu( @PathVariable("programa") Integer programa, @PathVariable("clase") Integer clase) 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		Integer idUsuario=autoFacade.getCredentials().getAuditoria().getIdUsuario();
		return service.informcionUnidadUspu(idEmpresa,idUsuario,programa,clase);
	}
	
	
	

}
