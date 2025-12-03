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
import com.gell.gestioncartera.entidades.Ejecutivo;
import com.gell.gestioncartera.entidades.Tercero;
import com.gell.gestioncartera.entidades.Unidad;
import com.gell.gestioncartera.servicios.impl.EjecutivoServiciosImpl;
import com.gell.gestioncartera.servicios.impl.TerceroServiciosImpl;
import com.gell.gestioncartera.servicios.impl.UnidadServiciosImpl;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
/**
 * 
 * @author TSI
 * Microservicio para el manejo del CRUD de Ejecutivos
 */
@Slf4j
@RestController
@RequestMapping("api/v1/ejecutivo/")
@Api(value = "Ejecutivos microservice, API para la consulta de los datos de los ejecutivos")
public class EjecutivoController {
	private ResponseDto _dto;

	@Autowired
	EjecutivoServiciosImpl _service;
	
	private String idEmpresa = "";
	private String idUsuario = "";

	public EjecutivoController() {
		_dto = new ResponseDto();
		_dto.setMensaje("Proceso ejecutado correctamente!");
	}
	
	/**
	 * 
	 * Metodo para obtener un ejecutivo por el id
	 */
	@GetMapping(path = "getEjecutivo/{id}")
	@ApiOperation(value = "Listar ejecutivo por Id", notes = "Retorna un ejecutivo" )
	public ResponseEntity<ResponseDto> GetEjecutivo(@PathVariable("id") long id) {
		Ejecutivo ejecutivo = _service.findById(id);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(ejecutivo);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para obtener la lista de ejecutivos por empresa
	 */
	@GetMapping(path = "getEjecutivoEmpresa")
	@ApiOperation(value = "Listar ejecutivos por empresas", notes = "Retorna un Listado de ejecutivos" )
	public ResponseEntity<ResponseDto> GetEjecutivoEmpresa(HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		Iterable<Ejecutivo> ejecutivos = _service.findByEmpresasevemp(Long.valueOf(idEmpresa));
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(ejecutivos);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para obtener la lista de ejecutivos por empresa y usuario
	 */
	@GetMapping(path = "getEjecutivoPorEmpresaUsuario}")
	@ApiOperation(value = "Listar ejecutivos por empresas y usuario", notes = "Retorna un Listado de ejecutivos" )
	public ResponseEntity<ResponseDto> GetEjecutivoEmpresaUsuario(HttpServletRequest httpServletRequest) {
		Iterable<Ejecutivo> ejecutivos = _service.findByAll();
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(ejecutivos);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para guardar el registro del ejecutivo y obtener el registro guardado
	 */
	@PostMapping(path = "guardarEjecutivo")
	@ApiOperation(value = "Para Almacenar el registro de Ejecutivo", notes = "Retorna el registro de Ejecutivo almacenado" )
	public ResponseEntity<ResponseDto> GuardarRegsitroEjecutiuvo(@RequestBody Ejecutivo item, HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		
		if (item.getEje_idregistro() != null) {
			item.setUsu_idregistroupdated_by(Long.valueOf(idUsuario));
			Ejecutivo ejecutivo = _service.findById(item.getEje_idregistro());
			item.setUsu_idregistrocreated_by(ejecutivo.getUsu_idregistrocreated_by());
			item.setCreated_at(ejecutivo.getCreated_at());
			item.setEmpresasevemp(ejecutivo.getEmpresasevemp());
		}else {
			item.setUsu_idregistrocreated_by(Long.valueOf(idUsuario));
			item.setEmpresasevemp(Long.valueOf(idEmpresa));
		}
		
		Ejecutivo ejecutivo = _service.save(item);
		 
		_dto.setCodigoRespuesta(HttpStatus.CREATED.value());
		_dto.setData(ejecutivo);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.CREATED);
	}
}
