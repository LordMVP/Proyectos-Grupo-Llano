package com.gell.gestioncartera.microservicios;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gell.gestioncartera.dto.ResponseDto;
import com.gell.gestioncartera.dto.VariableGlobalDto;

import com.gell.gestioncartera.entidades.VariableGlobal;

import com.gell.gestioncartera.servicios.impl.VariableGlobalServiciosImpl;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
/**
 * 
 * @author TSI
 * Microservicio para el manejo del CRUD de Variables globales
 */
@Slf4j
@RestController
@RequestMapping("api/v1/vglobal/")
@Api(value = "Variable Globales microservice, API para la consulta de los datos de las variables globales")
public class VariableGlobalController {
	private ResponseDto _dto;

	@Autowired
	VariableGlobalServiciosImpl _service;
	
	private String idEmpresa = "";
	private String idUsuario = "";

	public VariableGlobalController() {
		_dto = new ResponseDto();
		_dto.setMensaje("Proceso ejecutado correctamente!");
	}

	@GetMapping(path = "getVGlobal/{id}")
	@ApiOperation(value = "Listar variable global por Id", notes = "Retorna una variable global" )
	public ResponseEntity<ResponseDto> GetvGlobal(@PathVariable("id") long id) {
		VariableGlobal vGlobal = _service.findById(id);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(vGlobal);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	
	@GetMapping(path = "getVGlobalEmpresaDto")
	@ApiOperation(value = "Listar variables globales por empresas dto", notes = "Retorna un Listado de variables globales dto" )
	public ResponseEntity<ResponseDto> GetVGlobalEmpresaDto(HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		Iterable<VariableGlobalDto> vGlobales = _service.findByAllDto(Long.valueOf(idEmpresa));
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(vGlobales);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	@GetMapping(path = "getVGlobalPorEmpresaUsuario/{idEmpresa}/{idUsuario}")
	@ApiOperation(value = "Listar variables globales por empresas y usuario", notes = "Retorna un Listado de variables globales" )
	public ResponseEntity<ResponseDto> GetVGlobalPorEmpresaUsuario(@PathVariable("idEmpresa") long idEmpresa, @PathVariable("idUsuario") long idUsuario) {
		Iterable<VariableGlobal> vGlobales = _service.findByAll();
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(vGlobales);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	@PostMapping(path = "guardarVGlobal")
	@ApiOperation(value = "Para Almacenar el registro de variable global", notes = "Retorna el registro de variable global almacenado" )
	public ResponseEntity<ResponseDto> GuardarRegsitroEjecutiuvo(@RequestBody VariableGlobal item, HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		
		if (item.getVglo_idregistro() != null) {
			item.setUsu_idregistroupdated_by(Long.valueOf(idUsuario));
			VariableGlobal variableGlobal = _service.findById(item.getVglo_idregistro());
			item.setUsu_idregistrocreated_by(variableGlobal.getUsu_idregistrocreated_by());
			item.setCreated_at(variableGlobal.getCreated_at());
			item.setEmpresasevemp(variableGlobal.getEmpresasevemp());
		}else {
			item.setUsu_idregistrocreated_by(Long.valueOf(idUsuario));
			item.setEmpresasevemp(Long.valueOf(idEmpresa));
		}
				
		VariableGlobal vGlobal = _service.save(item);
		_dto.setCodigoRespuesta(HttpStatus.CREATED.value());
		_dto.setData(vGlobal);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.CREATED);
	}
}
