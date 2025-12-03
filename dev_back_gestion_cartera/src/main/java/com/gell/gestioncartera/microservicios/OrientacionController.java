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
import com.gell.gestioncartera.entidades.MetaGestion;
import com.gell.gestioncartera.entidades.Orientacion;
import com.gell.gestioncartera.servicios.impl.MetaGestionServiciosImpl;
import com.gell.gestioncartera.servicios.impl.OrientacionServiciosImpl;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
/**
 * 
 * @author TSI
 * Microservicio para el manejo del CRUD de Meta de Orientación
 */
@Slf4j
@RestController
@RequestMapping("api/v1/orientacion/")
@Api(value = "Metas de gestion microservice, API para la consulta de los datos de la tabla de orientación")
public class OrientacionController {
	private ResponseDto _dto;

	@Autowired
	OrientacionServiciosImpl _service;
	
	private String idEmpresa = "";
	private String idUsuario = "";

	public OrientacionController() {
		_dto = new ResponseDto();
		_dto.setMensaje("Proceso ejecutado correctamente!");
	}
	
	/**
	 * 
	 * Metodo para obtener la meta de orietnacion por el id
	 */
	@GetMapping(path = "getOrientacion/{id}")
	@ApiOperation(value = "Listar tabla meta orientación por Id", notes = "Retorna una tabla orientación" )
	public ResponseEntity<ResponseDto> GetOrientacion(@PathVariable("id") long id) {
		Orientacion orientacion = _service.findById(id);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(orientacion);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para obtener la lista de metas de orientación por empresa
	 */
	@GetMapping(path = "getOrientacionEmpresa")
	@ApiOperation(value = "Listar tabla orientacion por empresas", notes = "Retorna un Listado de orientacion" )
	public ResponseEntity<ResponseDto> GetOrientacionEmpresa(HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		Iterable<Orientacion> orientaciones = _service.findByEmpresasevemp(Long.valueOf(idEmpresa));
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(orientaciones);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para guardar el registro de orientaión y obtener el registro guardado
	 */
	@PostMapping(path = "guardarOrientacion")
	@ApiOperation(value = "Para Almacenar el registro de tabla orientación", notes = "Retorna el registro de tabla orientación almacenado" )
	public ResponseEntity<ResponseDto> GuardarOrientacion(@RequestBody Orientacion item, HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		
		if (item.getOri_idregistro() != null) {
			item.setUsu_idregistroupdated_by(Long.valueOf(idUsuario));
			Orientacion orientacion = _service.findById(item.getOri_idregistro());
			item.setUsu_idregistrocreated_by(orientacion.getUsu_idregistrocreated_by());
			item.setCreated_at(orientacion.getCreated_at());
			item.setEmpresasevemp(orientacion.getEmpresasevemp());
		}else {
			item.setUsu_idregistrocreated_by(Long.valueOf(idUsuario));
			item.setEmpresasevemp(Long.valueOf(idEmpresa));
		}
		
		Orientacion orientacion = _service.save(item);
		_dto.setCodigoRespuesta(HttpStatus.CREATED.value());
		_dto.setData(orientacion);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.CREATED);
	}
}
