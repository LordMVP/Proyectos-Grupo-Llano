package com.bioagricola.homologaciones.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.entity.SecSector;
import com.bioagricola.homologaciones.controller.generic.AbstractHomogacionesRestController;
import com.bioagricola.homologaciones.dto.basic.SecSectorDTO;
import com.bioagricola.homologaciones.dto.facade.AbstractDTOFacade;
import com.bioagricola.homologaciones.dto.facade.SecSectorDTOFacade;
import com.bioagricola.homologaciones.service.impl.SecSectorService;

@RestController
@RequestMapping(path = "api/sector")
public class SecSectorRestController extends AbstractHomogacionesRestController<SecSector, SecSectorDTO>
{
	@Autowired
	private SecSectorService service;
	
	@Autowired
	private SecSectorDTOFacade facade;
	
	@Autowired
	private AuthenticationFacade autoFacade;
	
	
	@GetMapping
	public List<HashMap<String, Object>> datosHomologacion() 
	{
		Integer idEmpresa=autoFacade.getCredentials().getAuditoria().getIdEmpresa();
		return service.listaSectores(idEmpresa);
	}
	
	@GetMapping(path = "/dto/page")
	public ResponseEntity<Page<SecSectorDTO>> getSector(Pageable pageable){
		//Page<SecSector> page = this.service.findByEmpresa(autoFacade.getIdEmpresa(),pageable);
		Page<SecSector> page = this.service.findByEmpresaAndEstado(autoFacade.getIdEmpresa(),"A",pageable);
		return ResponseEntity.ok(this.convertPageToPageDto(page));
	}
	
	@GetMapping(path = "/dto/page/empresa/{empresa}")
	public ResponseEntity<Page<SecSectorDTO>> getSectorByEmpresa(@PathVariable(name = "empresa") Integer empresa,Pageable pageable){
		Page<SecSector> page = this.service.findByEmpresa(empresa,pageable);
		return ResponseEntity.ok(this.convertPageToPageDto(page));
	}

	@Override
	protected AbstractDTOFacade<SecSector, SecSectorDTO> getFacade() {
		// TODO Auto-generated method stub
		return facade;
	}

}
