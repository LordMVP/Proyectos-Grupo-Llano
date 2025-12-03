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
import com.gell.gestioncartera.entidades.Unidad;
import com.gell.gestioncartera.servicios.impl.TerceroServiciosImpl;
import com.gell.gestioncartera.servicios.impl.UnidadServiciosImpl;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author TSI
 * Microservicio para el manejo del CRUD de las Unidades de las estructuras de clase
 */
@Slf4j
@RestController
@RequestMapping("api/v1/unidad/")
@Api(value = "Unidades microservice, API para la consulta de los datos de las Unidades")
public class UnidadController {
	private ResponseDto _dto;

	@Autowired
	UnidadServiciosImpl _service;

	public UnidadController() {
		_dto = new ResponseDto();
		_dto.setMensaje("Proceso ejecutado correctamente!");
	}
	
	/**
	 * 
	 * Metodo que permite el listado de las unidades por estructura de clase
	 */
	@GetMapping(path = "getUnidad/{id}")
	@ApiOperation(value = "Listar Unidades por estructura de clase", notes = "Retorna un Listado de Uniddes" )
	public ResponseEntity<ResponseDto> GetUnidad(@PathVariable("id") long id) {
		//Iterable<Unidad> uni= _service.findByEstideregistro(id);
		Iterable<Unidad> uni= _service.findByParametros(id);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(uni);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
}
