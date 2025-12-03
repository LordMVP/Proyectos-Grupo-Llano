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
import com.gell.gestioncartera.entidades.EstadoCartera;
import com.gell.gestioncartera.servicios.impl.EstadoCarteraServiciosImpl;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
/**
 * 
 * @author TSI
 * Microservicio para el manejo del CRUD de Meta de Estado Cartera
 */
@Slf4j
@RestController
@RequestMapping("api/v1/estadocartera/")
@Api(value = "Metas de gestion microservice, API para la consulta de los datos de la tabla de orientación")
public class EstadoCarteraController {
	private ResponseDto _dto;

	@Autowired
	EstadoCarteraServiciosImpl _service;
	
	private String idEmpresa = "";
	private String idUsuario = "";

	public EstadoCarteraController() {
		_dto = new ResponseDto();
		_dto.setMensaje("Proceso ejecutado correctamente!");
	}
	
	/**
	 * 
	 * Metodo para obtener la meta de orietnacion por el id
	 */
	@GetMapping(path = "getEstadoCartera/{id}")
	@ApiOperation(value = "Listar tabla meta orientación por Id", notes = "Retorna una tabla orientación" )
	public ResponseEntity<ResponseDto> GetEstadoCartera(@PathVariable("id") long id) {
		EstadoCartera estadoCartera = _service.findById(id);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(estadoCartera);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para obtener la lista de metas de Estado Cartera por empresa
	 */
	@GetMapping(path = "getEstadoCarteraEmpresa")
	@ApiOperation(value = "Listar tabla EstadoCartera por empresas", notes = "Retorna un Listado de EstadoCartera" )
	public ResponseEntity<ResponseDto> GetEstadoCarteraEmpresa(HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		Iterable<EstadoCartera> estadoCarteras = _service.findByEmpresasevemp(Long.valueOf(idEmpresa));
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(estadoCarteras);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para guardar el registro de orientaión y obtener el registro guardado
	 */
	@PostMapping(path = "guardarEstadoCartera")
	@ApiOperation(value = "Para Almacenar el registro de tabla Estado Cartera", notes = "Retorna el registro de tabla Estado Cartera almacenado" )
	public ResponseEntity<ResponseDto> GuardarEstadoCartera(@RequestBody EstadoCartera item, HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		
		if (item.getEcar_idregistro() != null) {
			item.setUsu_idregistroupdated_by(Long.valueOf(idUsuario));
			EstadoCartera estadoCartera = _service.findById(item.getEcar_idregistro());
			item.setUsu_idregistrocreated_by(estadoCartera.getUsu_idregistrocreated_by());
			item.setCreated_at(estadoCartera.getCreated_at());
			item.setEmpresasevemp(estadoCartera.getEmpresasevemp());
		}else {
			item.setUsu_idregistrocreated_by(Long.valueOf(idUsuario));
			item.setEmpresasevemp(Long.valueOf(idEmpresa));
		}
		
		EstadoCartera estadoCartera = _service.save(item);
		_dto.setCodigoRespuesta(HttpStatus.CREATED.value());
		_dto.setData(estadoCartera);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.CREATED);
	}
}
