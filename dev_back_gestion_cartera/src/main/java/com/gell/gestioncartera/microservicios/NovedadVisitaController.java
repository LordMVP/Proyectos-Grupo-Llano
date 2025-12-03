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
import com.gell.gestioncartera.entidades.NovedadVisita;
import com.gell.gestioncartera.entidades.NovedadVisitaRecurso;
import com.gell.gestioncartera.entidades.Clasificacion;
import com.gell.gestioncartera.servicios.impl.MetaGestionServiciosImpl;
import com.gell.gestioncartera.servicios.impl.NovedadVisitaRecursoServiciosImpl;
import com.gell.gestioncartera.servicios.impl.NovedadVisitaServiciosImpl;
import com.gell.gestioncartera.servicios.impl.ClasificacionServiciosImpl;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
/**
 * 
 * @author TSI
 * Microservicio para el manejo del CRUD de novedad de visita
 */
@Slf4j
@RestController
@RequestMapping("api/v1/nvisita/")
@Api(value = "Metas de gestion microservice, API para la consulta de los datos de la tabla de novedad de visita")
public class NovedadVisitaController {
	private ResponseDto _dto;

	@Autowired
	NovedadVisitaServiciosImpl _service;
	
	@Autowired
	NovedadVisitaRecursoServiciosImpl _serviceNovedadVisitaRecurso;
	
	private String idEmpresa = "";
	private String idUsuario = "";

	public NovedadVisitaController() {
		_dto = new ResponseDto();
		_dto.setMensaje("Proceso ejecutado correctamente!");
	}
	
	/**
	 * 
	 * Metodo para obtener la novedad de visita por el id
	 */
	@GetMapping(path = "getNovedadVisita/{id}")
	@ApiOperation(value = "Listar tabla novedad visita por Id", notes = "Retorna una tabla novedad visita" )
	public ResponseEntity<ResponseDto> GetNovedadVisita(@PathVariable("id") long id) {
		NovedadVisita novedadVisita = _service.findById(id);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(novedadVisita);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para obtener la lista de novedad visita recursos
	 */
	@GetMapping(path = "getNovedadVisitaRecurso/{id}")
	@ApiOperation(value = "Listar tabla novedad visita recursos", notes = "Retorna un Listado de novedad visita recursos" )
	public ResponseEntity<ResponseDto> getNovedadVisitaRecurso(@PathVariable("id") long id) {
		Iterable<NovedadVisitaRecurso> novedadVisitaRecurso = _serviceNovedadVisitaRecurso.findByAll(id);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(novedadVisitaRecurso);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para obtener la lista de novedad visita por empresa
	 */
	@GetMapping(path = "getNovedadVisitaEmpresa")
	@ApiOperation(value = "Listar tabla novedad visita por empresas", notes = "Retorna un Listado de novedad visita" )
	public ResponseEntity<ResponseDto> GetClasificacionEmpresa(HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		Iterable<NovedadVisita> novedadVisita = _service.findByEmpresasevemp(Long.valueOf(idEmpresa));
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(novedadVisita);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para guardar el registro de novedad Visita y obtener el registro guardado
	 */
	@PostMapping(path = "guardarNovedadVisita")
	@ApiOperation(value = "Para Almacenar el registro de tabla novedad Visita", notes = "Retorna el registro de tabla novedad Visita almacenado" )
	public ResponseEntity<ResponseDto> GuardarNovedadVisita(@RequestBody NovedadVisita item, HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		
		if (item.getNvis_idregistro() != null) {
			item.setUsu_idregistroupdated_by(Long.valueOf(idUsuario));
			NovedadVisita novedadVisita = _service.findById(item.getNvis_idregistro());
			item.setUsu_idregistrocreated_by(novedadVisita.getUsu_idregistrocreated_by());
			item.setCreated_at(novedadVisita.getCreated_at());
			item.setEmpresasevemp(novedadVisita.getEmpresasevemp());
		}else {
			item.setUsu_idregistrocreated_by(Long.valueOf(idUsuario));
			item.setEmpresasevemp(Long.valueOf(idEmpresa));
		}
		
		NovedadVisita novedadVisita = _service.save(item);
		_dto.setCodigoRespuesta(HttpStatus.CREATED.value());
		_dto.setData(novedadVisita);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.CREATED);
	}
	
	/**
	 * 
	 * Metodo para guardar el registro de novedad Visita detalle y obtener el registro guardado
	 */
	@PostMapping(path = "guardarNovedadVisitaDetalle")
	@ApiOperation(value = "Para Almacenar el registro de tabla novedad Visita detalle", notes = "Retorna el registro de tabla novedad Visita detalle almacenado" )
	public ResponseEntity<ResponseDto> guardarNovedadVisitaDetalle(@RequestBody NovedadVisitaRecurso item, HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		
		NovedadVisitaRecurso novedadVisitaRecurso = _serviceNovedadVisitaRecurso.save(item);
		_dto.setCodigoRespuesta(HttpStatus.CREATED.value());
		_dto.setData(novedadVisitaRecurso);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.CREATED);
	}
	
	/**
	 * 
	 * Metodo para eliminar el registro de novedad Visita detalle 
	 */
	@PostMapping(path = "eliminarNovedadVisitaDetalle")
	@ApiOperation(value = "Para Almacenar el registro de tabla novedad Visita detalle", notes = "Retorna el registro de tabla novedad Visita detalle almacenado" )
	public ResponseEntity<ResponseDto> eliminarNovedadVisitaDetalle(@RequestBody NovedadVisitaRecurso item, HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		
		_serviceNovedadVisitaRecurso.delete(item);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData("");
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
}
