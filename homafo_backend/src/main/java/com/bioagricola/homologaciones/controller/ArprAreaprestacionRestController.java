package com.bioagricola.homologaciones.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.homologaciones.controller.generic.AbstractHomogacionesRestController;
import com.bioagricola.homologaciones.dto.basic.ArprAreaprestacionDTO;
import com.bioagricola.homologaciones.dto.facade.AbstractDTOFacade;
import com.bioagricola.homologaciones.dto.facade.ArprAreaprestacionDTOFacade;
import com.bioagricola.homologaciones.entity.ArprAreaprestacion;
import com.bioagricola.homologaciones.service.impl.ArprAreaprestacionService;
@RestController
@RequestMapping(path = "api/areaprestacion")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ArprAreaprestacionRestController extends AbstractHomogacionesRestController<ArprAreaprestacion, ArprAreaprestacionDTO> {

	@Autowired
	private ArprAreaprestacionDTOFacade arprFacade;
	@Autowired
	private ArprAreaprestacionService arprService;
	
	@GetMapping(path = "/dto/page")
	public ResponseEntity<Page<ArprAreaprestacionDTO>> getPageDTO(Pageable pageable){
		Page<ArprAreaprestacionDTO> pageDto = this.convertPageToPageDto(this.arprService.findAllByEmpresa(317, pageable));
		return ResponseEntity.ok(pageDto);
	}
	
	@Override
	protected AbstractDTOFacade<ArprAreaprestacion, ArprAreaprestacionDTO> getFacade() {
		// TODO Auto-generated method stub
		return arprFacade;
	}
	
	

	
}
