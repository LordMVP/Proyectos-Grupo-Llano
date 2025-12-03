package com.bioagricola.homologaciones.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.homologaciones.controller.generic.AbstractHomogacionesRestController;
import com.bioagricola.homologaciones.dto.basic.PimpProcesoImportacionDTO;
import com.bioagricola.homologaciones.dto.facade.AbstractDTOFacade;
import com.bioagricola.homologaciones.dto.facade.PimpProcesoImportacionDTOFacade;
import com.bioagricola.homologaciones.entity.PimpProcesoImportacion;
import com.bioagricola.homologaciones.service.impl.PiminsProyeccionIminsService;
import com.bioagricola.homologaciones.service.impl.PimpProcesoImportacionService;

@RestController
@RequestMapping(path = "api/pimp")
public class PimpProcesoImportacionRestController extends AbstractHomogacionesRestController<PimpProcesoImportacion, PimpProcesoImportacionDTO> {

	@Autowired
	private PimpProcesoImportacionDTOFacade facade;
	
	@Autowired
	private PiminsProyeccionIminsService piminsService;
	
	@Autowired
	private PimpProcesoImportacionService service;
	
	@Override
	protected AbstractDTOFacade<PimpProcesoImportacion, PimpProcesoImportacionDTO> getFacade() {
		// TODO Auto-generated method stub
		return facade;
	}
	
	@RequestMapping(path="/",method = RequestMethod.GET)
	public ResponseEntity<Page<PimpProcesoImportacionDTO>> getPimps(Pageable pageable){
		Page<PimpProcesoImportacion> page = this.service.findByEstado("P",pageable);
		Page<PimpProcesoImportacionDTO> pageDto = this.convertPageToPageDto(page);
		return ResponseEntity.ok(pageDto);		
	}	
}
