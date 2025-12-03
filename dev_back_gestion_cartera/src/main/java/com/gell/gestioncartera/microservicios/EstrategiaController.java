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
import com.gell.gestioncartera.entidades.Estrategia;
import com.gell.gestioncartera.servicios.impl.MetaGestionServiciosImpl;
import com.gell.gestioncartera.servicios.impl.EstrategiaServiciosImpl;

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
@RequestMapping("api/v1/estrategia/")
@Api(value = "Metas de gestion microservice, API para la consulta de los datos de la tabla de estrategias")
public class EstrategiaController {
	private ResponseDto _dto;

	@Autowired
	EstrategiaServiciosImpl _service;
	
	private String idEmpresa = "";
	private String idUsuario = "";

	public EstrategiaController() {
		_dto = new ResponseDto();
		_dto.setMensaje("Proceso ejecutado correctamente!");
	}
	
	/**
	 * 
	 * Metodo para obtener la meta de orietnacion por el id
	 */
	@GetMapping(path = "getEstrategia/{id}")
	@ApiOperation(value = "Listar tabla meta estategia por Id", notes = "Retorna una tabla estrategia" )
	public ResponseEntity<ResponseDto> GetEstrategia(@PathVariable("id") long id) {
		Estrategia estrategia = _service.findById(id);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(estrategia);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para obtener la lista de metas de estategias por empresa
	 */
	@GetMapping(path = "getEstrategiaEmpresa")
	@ApiOperation(value = "Listar tabla Estrategia por empresas", notes = "Retorna un Listado de Estrategia" )
	public ResponseEntity<ResponseDto> GetEstrategiaEmpresa(HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		Iterable<Estrategia> estrategias = _service.findByEmpresasevemp(Long.valueOf(idEmpresa));
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(estrategias);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para guardar el registro de orientaión y obtener el registro guardado
	 */
	@PostMapping(path = "guardarEstrategia")
	@ApiOperation(value = "Para Almacenar el registro de tabla orientación", notes = "Retorna el registro de tabla orientación almacenado" )
	public ResponseEntity<ResponseDto> GuardarEstrategia(@RequestBody Estrategia item, HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		
		if (item.getEst_idregistro() != null) {
			item.setUsu_idregistroupdated_by(Long.valueOf(idUsuario));
			Estrategia estrategia = _service.findById(item.getEst_idregistro());
			item.setUsu_idregistrocreated_by(estrategia.getUsu_idregistrocreated_by());
			item.setCreated_at(estrategia.getCreated_at());
			item.setEmpresasevemp(estrategia.getEmpresasevemp());
		}else {
			item.setUsu_idregistrocreated_by(Long.valueOf(idUsuario));
			item.setEmpresasevemp(Long.valueOf(idEmpresa));
		}
		
		Estrategia Estrategia = _service.save(item);
		_dto.setCodigoRespuesta(HttpStatus.CREATED.value());
		_dto.setData(Estrategia);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.CREATED);
	}
}
