package com.bioagricola.homologaciones.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.entity.Proyectos;
import com.bioagricola.homologaciones.controller.generic.AbstractHomogacionesRestController;
import com.bioagricola.homologaciones.dto.basic.ProyectosDTO;
import com.bioagricola.homologaciones.dto.facade.AbstractDTOFacade;
import com.bioagricola.homologaciones.dto.facade.ProyectosDTOFacade;
import com.bioagricola.homologaciones.service.impl.ProyectosService;

@RestController
@RequestMapping(path = "api/proyectos")
public class ProyectosRestController extends AbstractHomogacionesRestController<Proyectos,ProyectosDTO>
{
	//private final Integer EMPRESA = 317;
	
	@Autowired
	private ProyectosService service;
	@Autowired
	private ProyectosDTOFacade facade;
	@Autowired
	private AuthenticationFacade autoFacade;
	

	@GetMapping("/lista")
	public List<HashMap<String, Object>> lista() 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.listaProyectos(idEmpresa);
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/listaDepart/{id}/{empresa}")	
	public List<HashMap<String, Object>> listaDepart(@PathVariable Integer id , @PathVariable Integer empresa) 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.listaProyectosDepart(id,idEmpresa);
	}
	
	@GetMapping(path = "/dto/page/empresa")
	public ResponseEntity<Page<ProyectosDTO>> getProyectosEmpresa(Pageable pageable){		
		Integer codEmpresa = autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		Page<Proyectos> proyectos  = service.findByCodEmpresa(codEmpresa, pageable);
		return ResponseEntity.ok(this.convertPageToPageDto(proyectos));
	}

	@Override
	protected AbstractDTOFacade<Proyectos, ProyectosDTO> getFacade() {
		// TODO Auto-generated method stub
		return this.facade;
	}

}
