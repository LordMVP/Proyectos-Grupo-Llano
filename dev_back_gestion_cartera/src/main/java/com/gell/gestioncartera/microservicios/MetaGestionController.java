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
import com.gell.gestioncartera.entidades.MetaGestion;
import com.gell.gestioncartera.entidades.MetaGestionDetalle;
import com.gell.gestioncartera.entidades.NovedadVisitaRecurso;
import com.gell.gestioncartera.servicios.impl.MetaGestionServiciosImpl;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
/**
 * 
 * @author TSI
 * Microservicio para el manejo del CRUD de Meta de Gestion
 */
@Slf4j
@RestController
@RequestMapping("api/v1/mgestion/")
@Api(value = "Metas de gestion microservice, API para la consulta de los datos de la tabla meta gestion")
public class MetaGestionController {
	private ResponseDto _dto;

	@Autowired
	MetaGestionServiciosImpl _service;
	
	private String idEmpresa = "";
	private String idUsuario = "";

	public MetaGestionController() {
		_dto = new ResponseDto();
		_dto.setMensaje("Proceso ejecutado correctamente!");
	}
	
	/**
	 * 
	 * Metodo para obtener la meta de gestión por el id
	 */
	@GetMapping(path = "getMGestion/{id}")
	@ApiOperation(value = "Listar tabla meta gestion por Id", notes = "Retorna una tabla meta de gestion" )
	public ResponseEntity<ResponseDto> GetmGestion(@PathVariable("id") long id) {
		MetaGestion mGestion = _service.findById(id);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(mGestion);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para obtener la lista de metas de gestión por empresa
	 */
	@GetMapping(path = "getMGestionEmpresa")
	@ApiOperation(value = "Listar tabla meta gestionl por empresas", notes = "Retorna un Listado de meta gestion" )
	public ResponseEntity<ResponseDto> GetTComisionalEmpresa(HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		Iterable<MetaGestion> mGestiones = _service.findByEmpresasevemp(Long.valueOf(idEmpresa));
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(mGestiones);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para obtener la lista de metas de gestión  por empresa y usuario
	 */
	@GetMapping(path = "getMGestionPorEmpresaUsuario/{idEmpresa}/{idUsuario}")
	@ApiOperation(value = "Listar tabla meta gestion por empresas y usuario", notes = "Retorna un Listado de tabla meta gestion" )
	public ResponseEntity<ResponseDto> GetTComisionalPorEmpresaUsuario(@PathVariable("idEmpresa") long idEmpresa, @PathVariable("idUsuario") long idUsuario) {
		Iterable<MetaGestion> mGestiones = _service.findByAll();
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(mGestiones);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para guardar el registro del metas de gestión y obtener el registro guardado
	 */
	@PostMapping(path = "guardarMGestion")
	@ApiOperation(value = "Para Almacenar el registro de tabla meta gestion", notes = "Retorna el registro de tabla meta gestion almacenado" )
	public ResponseEntity<ResponseDto> GuardarRegsitroEjecutiuvo(@RequestBody MetaGestion item, HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		
		if (item.getMege_idregistro() != null) {
			item.setUsu_idregistroupdated_by(Long.valueOf(idUsuario));
			MetaGestion metaGestion = _service.findById(item.getMege_idregistro());
			item.setUsu_idregistrocreated_by(metaGestion.getUsu_idregistrocreated_by());
			item.setCreated_at(metaGestion.getCreated_at());
			item.setEmpresasevemp(metaGestion.getEmpresasevemp());
		}else {
			item.setUsu_idregistrocreated_by(Long.valueOf(idUsuario));
			item.setEmpresasevemp(Long.valueOf(idEmpresa));
		}
		
		MetaGestion mGestion = _service.save(item);
		_dto.setCodigoRespuesta(HttpStatus.CREATED.value());
		_dto.setData(mGestion);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.CREATED);
	}
	
	/**
	 * 
	 * Metodo para obtener la meta de gestión detalle por el id de meta gestion
	 */
	@GetMapping(path = "getMGestionDetalle/{id}")
	@ApiOperation(value = "Listar tabla meta gestion por Id", notes = "Retorna una tabla meta de gestion detalle" )
	public ResponseEntity<ResponseDto> getMGestionDetalle(@PathVariable("id") long id) {
		List<MetaGestionDetalle> mGestionDetalles = _service.findByMegeidregistro(id);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(mGestionDetalles);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para guardar el registro del metas de gestión detalle y obtener el registro guardado
	 */
	@PostMapping(path = "guardarMGestionDetalle")
	@ApiOperation(value = "Para Almacenar el registro de tabla meta gestion detalle", notes = "Retorna el registro de tabla meta gestion almacenado" )
	public ResponseEntity<ResponseDto> guardarMGestionDetalle(@RequestBody MetaGestionDetalle item) {
		MetaGestionDetalle mGestion = _service.saveMetaGestionDetalle(item);
		_dto.setCodigoRespuesta(HttpStatus.CREATED.value());
		_dto.setData(mGestion);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.CREATED);
	}
	
	/**
	 * 
	 * Metodo para eliminar el registro de novedad Visita detalle 
	 */
	@PostMapping(path = "eliminarMGestionaDetalle")
	@ApiOperation(value = "Para Almacenar el registro de tabla meta gestion detalle", notes = "Elimina meta gestion detalle" )
	public ResponseEntity<ResponseDto> eliminarMGestionaDetalle(@RequestBody MetaGestionDetalle item, HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		
		_service.deleteMetaGestionDetalle(item);;
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData("");
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
}
