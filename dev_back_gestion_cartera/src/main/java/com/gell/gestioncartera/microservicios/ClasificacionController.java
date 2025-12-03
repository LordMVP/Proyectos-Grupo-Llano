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
import com.gell.gestioncartera.entidades.Clasificacion;
import com.gell.gestioncartera.servicios.impl.MetaGestionServiciosImpl;
import com.gell.gestioncartera.servicios.impl.ClasificacionServiciosImpl;

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
@RequestMapping("api/v1/clasificacion/")
@Api(value = "Metas de gestion microservice, API para la consulta de los datos de la tabla de clasificación")
public class ClasificacionController {
	private ResponseDto _dto;

	@Autowired
	ClasificacionServiciosImpl _service;
	
	private String idEmpresa = "";
	private String idUsuario = "";

	public ClasificacionController() {
		_dto = new ResponseDto();
		_dto.setMensaje("Proceso ejecutado correctamente!");
	}
	
	/**
	 * 
	 * Metodo para obtener la meta de orietnacion por el id
	 */
	@GetMapping(path = "getClasificacion/{id}")
	@ApiOperation(value = "Listar tabla meta clasificación por Id", notes = "Retorna una tabla clasificación" )
	public ResponseEntity<ResponseDto> GetClasificacion(@PathVariable("id") long id) {
		Clasificacion clasificacion = _service.findById(id);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(clasificacion);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para obtener la lista de metas de clasificaciób por empresa
	 */
	@GetMapping(path = "getClasificacionEmpresa")
	@ApiOperation(value = "Listar tabla Clasificacion por empresas", notes = "Retorna un Listado de Clasificacion" )
	public ResponseEntity<ResponseDto> GetClasificacionEmpresa(HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		Iterable<Clasificacion> clasificaciones = _service.findByEmpresasevemp(Long.valueOf(idEmpresa));
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(clasificaciones);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para guardar el registro de orientaión y obtener el registro guardado
	 */
	@PostMapping(path = "guardarClasificacion")
	@ApiOperation(value = "Para Almacenar el registro de tabla orientación", notes = "Retorna el registro de tabla orientación almacenado" )
	public ResponseEntity<ResponseDto> GuardarClasificacion(@RequestBody Clasificacion item, HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		
		if (item.getCla_idregistro() != null) {
			item.setUsu_idregistroupdated_by(Long.valueOf(idUsuario));
			Clasificacion clasificacion = _service.findById(item.getCla_idregistro());
			item.setUsu_idregistrocreated_by(clasificacion.getUsu_idregistrocreated_by());
			item.setCreated_at(clasificacion.getCreated_at());
			item.setEmpresasevemp(clasificacion.getEmpresasevemp());
		}else {
			item.setUsu_idregistrocreated_by(Long.valueOf(idUsuario));
			item.setEmpresasevemp(Long.valueOf(idEmpresa));
		}
		
		Clasificacion clasificacion = _service.save(item);
		_dto.setCodigoRespuesta(HttpStatus.CREATED.value());
		_dto.setData(clasificacion);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.CREATED);
	}
}
