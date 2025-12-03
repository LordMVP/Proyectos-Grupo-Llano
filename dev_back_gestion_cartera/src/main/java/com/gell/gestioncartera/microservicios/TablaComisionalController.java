package com.gell.gestioncartera.microservicios;

import java.util.List;

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
import com.gell.gestioncartera.entidades.TablaComisional;
import com.gell.gestioncartera.entidades.TablaComisionalDetalle;
import com.gell.gestioncartera.servicios.impl.TablaComisionalServiciosImpl;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
/**
 * 
 * @author TSI
 * Microservicio para el manejo del CRUD de Tabla comisional
 */
@Slf4j
@RestController
@RequestMapping("api/v1/tcomisional/")
@Api(value = "Tabla comisional microservice, API para la consulta de los datos de la tabla comisional")
public class TablaComisionalController {
	private ResponseDto _dto;

	@Autowired
	TablaComisionalServiciosImpl _service;
	
	private String idEmpresa = "";
	private String idUsuario = "";

	public TablaComisionalController() {
		_dto = new ResponseDto();
		_dto.setMensaje("Proceso ejecutado correctamente!");
	}
	
	/**
	 * 
	 * Metodo para obtener un registro de la tabla comisional por el id
	 */
	@GetMapping(path = "getTComisional/{id}")
	@ApiOperation(value = "Listar tabla comisional por Id", notes = "Retorna una tabla comisional" )
	public ResponseEntity<ResponseDto> GettComisional(@PathVariable("id") long id) {
		TablaComisional tComisional = _service.findById(id);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(tComisional);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para obtener la lista de la tabla comisional por empresa
	 */
	@GetMapping(path = "getTComisionalEmpresa")
	@ApiOperation(value = "Listar tabla comisional por empresas", notes = "Retorna un Listado de tabla comisional" )
	public ResponseEntity<ResponseDto> GetTComisionalEmpresa(HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		Iterable<TablaComisional> tComisionales = _service.findByEmpresasevemp(Long.valueOf(idEmpresa));
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(tComisionales);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para obtener la lista de la tabla comisional por empresa y usuario
	 */
	@GetMapping(path = "getTComisionalPorEmpresaUsuario/{idEmpresa}/{idUsuario}")
	@ApiOperation(value = "Listar tabla comisional por empresas y usuario", notes = "Retorna un Listado de tabla comisional" )
	public ResponseEntity<ResponseDto> GetTComisionalPorEmpresaUsuario(@PathVariable("idEmpresa") long idEmpresa, @PathVariable("idUsuario") long idUsuario) {
		Iterable<TablaComisional> tComisionales = _service.findByAll();
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(tComisionales);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para guardar el registro de la tabla comisional y obtener el registro guardado
	 */
	@PostMapping(path = "guardarTComisional")
	@ApiOperation(value = "Para Almacenar el registro de tabla comisional", notes = "Retorna el registro de tabla comisional almacenado" )
	public ResponseEntity<ResponseDto> guardarTComisional(@RequestBody TablaComisional item, HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		
		if (item.getTcom_idregistro() != null) {
			item.setUsu_idregistroupdated_by(Long.valueOf(idUsuario));
			TablaComisional tablaComisional = _service.findById(item.getTcom_idregistro());
			item.setUsu_idregistrocreated_by(tablaComisional.getUsu_idregistrocreated_by());
			item.setCreated_at(tablaComisional.getCreated_at());
			item.setEmpresasevemp(tablaComisional.getEmpresasevemp());
		}else {
			item.setUsu_idregistrocreated_by(Long.valueOf(idUsuario));
			item.setEmpresasevemp(Long.valueOf(idEmpresa));
		}
		
		TablaComisional tComisional = _service.save(item);
		_dto.setCodigoRespuesta(HttpStatus.CREATED.value());
		_dto.setData(tComisional);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.CREATED);
	}
	
	
	/**
	 * 
	 * Metodo para obtener un registro de la tabla comisional detealle por el id de tabla comisional
	 */
	@GetMapping(path = "getTComisionalDetalle/{id}")
	@ApiOperation(value = "Listar tabla comisional detalle por Id", notes = "Retorna una tabla comisional detalle" )
	public ResponseEntity<ResponseDto> getTComisionalDetalle(@PathVariable("id") long id) {
		List<TablaComisionalDetalle> tComisionalDetalles = _service.findByTcomidregistro(id);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(tComisionalDetalles);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para guardar el registro de la tabla comisional detalle y obtener el registro guardado
	 */
	@PostMapping(path = "guardarTComisionalDetalle")
	@ApiOperation(value = "Para Almacenar el registro de tabla comisional detalle", notes = "Retorna el registro de tabla comisional detalle almacenado" )
	public ResponseEntity<ResponseDto> guardarTComisionalDetalle(@RequestBody TablaComisionalDetalle item) {
		TablaComisionalDetalle tComisionalDetalle = _service.saveTablaComisionaDetalle(item);
		_dto.setCodigoRespuesta(HttpStatus.CREATED.value());
		_dto.setData(tComisionalDetalle);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.CREATED);
	}
	
	/**
	 * 
	 * Metodo para eliminar el registro de la tabla comisional detalle 
	 */
	@PostMapping(path = "eliminarTComisionalDetalle")
	@ApiOperation(value = "Para Eliminar el registro de tabla comisional detalle", notes = "" )
	public ResponseEntity<ResponseDto> eliminarTComisionalDetalle(@RequestBody TablaComisionalDetalle item) {
		_service.deleteTablaComisionaDetalle(item);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData("");
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
}
