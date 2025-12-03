package com.gell.gestioncartera.microservicios;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gell.gestioncartera.dto.ResponseDto;
import com.gell.gestioncartera.entidades.Tercero;
import com.gell.gestioncartera.servicios.impl.TerceroServiciosImpl;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author TSI
 * Microservicio para el manejo del CRUD de Terceros
 */
@Slf4j
@RestController
@RequestMapping("api/v1/tercero/")
@Api(value = "Terceros microservice, API para la consulta de los datos de Terceros")
public class TerceroController {
	private ResponseDto _dto;

	@Autowired
	TerceroServiciosImpl _service;

	public TerceroController() {
		_dto = new ResponseDto();
		_dto.setMensaje("Proceso ejecutado correctamente!");
	}
	
	/**
	 * 
	 * Metodo para buscar el tercero por el número de documento, obtiene un registro de tercero
	 */
	@GetMapping(path = "getDocumento/{documento}")
	@ApiOperation(value = "Buscar un Tercero por documento", notes = "Retorna un Tercero" )
	public ResponseEntity<ResponseDto> GetTercero(@PathVariable("documento") String documento) {
		Tercero ter = _service.findByDocumento(documento);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(ter);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para buscar el tercero por el nombre, obtiene una lista de terceros
	 */
	@GetMapping(path = "getNombre/{nombre}")
	@ApiOperation(value = "Buscar un Tercero por nombre", notes = "Retorna un listados de Tercero" )
	public ResponseEntity<ResponseDto> GetNombre(@PathVariable("nombre") String nombre) {
		Iterable<Tercero> ters = _service.findByNomcompletoContaining(nombre);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(ters);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}

}
