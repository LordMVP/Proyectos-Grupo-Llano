package com.gell.gestioncartera.microservicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gell.gestioncartera.dto.ResponseDto;
import com.gell.gestioncartera.entidades.Periodo;
import com.gell.gestioncartera.entidades.Tercero;
import com.gell.gestioncartera.servicios.impl.PeriodoServiciosImpl;
import com.gell.gestioncartera.servicios.impl.TerceroServiciosImpl;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author TSI
 * Microservicio para la consulta de periodos
 */
@Slf4j
@RestController
@RequestMapping("api/v1/periodo/")
@Api(value = "Periodos microservice, API para la consulta de los datos de Periodos")
public class PeriodoController {
	private ResponseDto _dto;

	@Autowired
	PeriodoServiciosImpl _service;

	public PeriodoController() {
		_dto = new ResponseDto();
		_dto.setMensaje("Proceso ejecutado correctamente!");
	}
	
	/**
	 * 
	 * Metodo para buscar el periodo por propiedad
	 */
	@GetMapping(path = "getPeriodo/{id}")
	@ApiOperation(value = "Buscar un periodo por id", notes = "Retorna un periodo" )
	public ResponseEntity<ResponseDto> GetPeriodo(@PathVariable("id") Long id) {
		List<Periodo> periodos = _service.findByEstado(id, "A");
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(periodos);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
}
