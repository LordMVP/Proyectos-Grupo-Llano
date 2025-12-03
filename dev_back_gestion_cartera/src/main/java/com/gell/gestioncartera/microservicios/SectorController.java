package com.gell.gestioncartera.microservicios;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gell.gestioncartera.dto.ResponseDto;
import com.gell.gestioncartera.entidades.SectorComuna;
import com.gell.gestioncartera.entidades.Tercero;
import com.gell.gestioncartera.entidades.Unidad;
import com.gell.gestioncartera.servicios.impl.SectorServiciosImpl;
import com.gell.gestioncartera.servicios.impl.TerceroServiciosImpl;
import com.gell.gestioncartera.servicios.impl.UnidadServiciosImpl;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author TSI
 * Microservicio para el manejo del CRUD de los sectores o comunas
 */
@Slf4j
@RestController
@RequestMapping("api/v1/sector/")
@Api(value = "Unidades microservice, API para la consulta de los datos de los sectores o comunas")
public class SectorController {
	private ResponseDto _dto;

	@Autowired
	SectorServiciosImpl _service;

	public SectorController() {
		_dto = new ResponseDto();
		_dto.setMensaje("Proceso ejecutado correctamente!");
	}
	
	/**
	 * 
	 * Metodo para obtener el listado de sectores "comunas"
	 */
	@GetMapping(path = "getSector")
	@ApiOperation(value = "Listar sectores o comunas", notes = "Retorna un Listado de Sectores o comunas" )
	public ResponseEntity<ResponseDto> GetSectorAll() {
		Iterable<SectorComuna> sectores = _service.findByAll();
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(sectores);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
}
