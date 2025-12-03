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
import com.gell.gestioncartera.entidades.EdadCartera;
import com.gell.gestioncartera.entidades.EstadoCartera;
import com.gell.gestioncartera.servicios.impl.EdadCarteraServiciosImpl;
import com.gell.gestioncartera.servicios.impl.EstadoCarteraServiciosImpl;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
/**
 * 
 * @author TSI
 * Microservicio para el manejo del CRUD de Meta de Edad Cartera
 */
@Slf4j
@RestController
@RequestMapping("api/v1/edadcartera/")
@Api(value = "Edad Cartera microservice, API para la consulta de los datos de la tabla de edad cartera")
public class EdadCarteraController {
	private ResponseDto _dto;

	@Autowired
	EdadCarteraServiciosImpl _service;
	
	private String idEmpresa = "";
	private String idUsuario = "";

	public EdadCarteraController() {
		_dto = new ResponseDto();
		_dto.setMensaje("Proceso ejecutado correctamente!");
	}
	
	/**
	 * 
	 * Metodo para obtener la edad por el id
	 */
	@GetMapping(path = "getEdadCartera/{id}")
	@ApiOperation(value = "Listar tabla Edad Cartera por Id", notes = "Retorna una tabla Edad Cartera" )
	public ResponseEntity<ResponseDto> GetEdadoCartera(@PathVariable("id") long id) {
		EdadCartera edadCartera = _service.findById(id);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(edadCartera);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para obtener la lista de edad cartera por empresa
	 */
	@GetMapping(path = "getEdadCarteraEmpresa")
	@ApiOperation(value = "Listar tabla Edad Cartera por empresas", notes = "Retorna un Listado de Edad Cartera" )
	public ResponseEntity<ResponseDto> GetEstadoCarteraEmpresa(HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		Iterable<EdadCartera> edadCarteras = _service.findByEmpresasevemp(Long.valueOf(idEmpresa));
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(edadCarteras);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para guardar el registro de edad cartera y obtener el registro guardado
	 */
	@PostMapping(path = "guardarEdadCartera")
	@ApiOperation(value = "Para Almacenar el registro de tabla Edad Cartera", notes = "Retorna el registro de tabla Edad Cartera almacenado" )
	public ResponseEntity<ResponseDto> GuardarEdadCartera(@RequestBody EdadCartera item, HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		
		if (item.getEdcar_idregistro() != null) {
			item.setUsu_idregistroupdated_by(Long.valueOf(idUsuario));
			EdadCartera edadCartera = _service.findById(item.getEdcar_idregistro());
			item.setUsu_idregistrocreated_by(edadCartera.getUsu_idregistrocreated_by());
			item.setCreated_at(edadCartera.getCreated_at());
			item.setEmpresasevemp(edadCartera.getEmpresasevemp());
		}else {
			item.setUsu_idregistrocreated_by(Long.valueOf(idUsuario));
			item.setEmpresasevemp(Long.valueOf(idEmpresa));
		}
		
		EdadCartera edadCartera = _service.save(item);
		_dto.setCodigoRespuesta(HttpStatus.CREATED.value());
		_dto.setData(edadCartera);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.CREATED);
	}
}
