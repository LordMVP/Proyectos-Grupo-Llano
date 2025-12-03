package com.gell.gestioncartera.microservicios;

import java.util.ArrayList;
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

import com.gell.gestioncartera.dto.CondonacionDto;
import com.gell.gestioncartera.dto.ResponseDto;
import com.gell.gestioncartera.entidades.Clasificacion;
import com.gell.gestioncartera.entidades.Condonacion;
import com.gell.gestioncartera.entidades.CondonacionDetalle;
import com.gell.gestioncartera.entidades.EdadCartera;
import com.gell.gestioncartera.entidades.EstadoCartera;
import com.gell.gestioncartera.entidades.ProgramaUnidad;
import com.gell.gestioncartera.entidades.Usuario;
import com.gell.gestioncartera.servicios.impl.CondonacionServiciosImpl;
import com.gell.gestioncartera.servicios.impl.EdadCarteraServiciosImpl;
import com.gell.gestioncartera.servicios.impl.EstadoCarteraServiciosImpl;
import com.gell.gestioncartera.servicios.impl.ProgramaUnidadServiciosImpl;
import com.gell.gestioncartera.servicios.impl.UsuarioServiciosImpl;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
/**
 * 
 * @author TSI
 * Microservicio para el manejo del CRUD de Condonacion
 */
@Slf4j
@RestController
@RequestMapping("api/v1/condonacion/")
@Api(value = "Condonacion microservice, API para la consulta de los datos de la tabla condonacion")
public class CondonacionController {
	private ResponseDto _dto;

	@Autowired
	CondonacionServiciosImpl _service;
	
	@Autowired
	UsuarioServiciosImpl _serviceUsuario;
	
	@Autowired
	ProgramaUnidadServiciosImpl _serviceProgramaUnidad;
	
	private String idEmpresa = "";
	private String idUsuario = "";

	public CondonacionController() {
		_dto = new ResponseDto();
		_dto.setMensaje("Proceso ejecutado correctamente!");
	}
	
	/**
	 * 
	 * Metodo para obtener la condonacion el id
	 */
	@GetMapping(path = "getCondonacion/{id}")
	@ApiOperation(value = "Listar tabla condonacion por Id", notes = "Retorna una tabla Condonacion" )
	public ResponseEntity<ResponseDto> GetEdadoCartera(@PathVariable("id") long id) {
		Condonacion condonacion = _service.findById(id);
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(condonacion);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	
	/**
	 * 
	 * Metodo para obtener la lista de condonaciones
	 */
	@GetMapping(path = "getCondonacion")
	@ApiOperation(value = "Listar tabla condonacion", notes = "Retorna un Listado de condonacion" )
	public ResponseEntity<ResponseDto> GetClasificacionEmpresa(HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		List<CondonacionDto> condonacionesDto = new ArrayList<CondonacionDto>();
		List<Condonacion> condonaciones = _service.findByEmpresa(Long.valueOf(idEmpresa));
		for(Condonacion itemCondonacion : condonaciones)
		{
			List<CondonacionDetalle> condonacionDetalles = _service.findByUspuideregistr(itemCondonacion.getUspu_ideregistr());

			for(CondonacionDetalle condonacionDetalle : condonacionDetalles) {				
				CondonacionDto condonacionDto = new CondonacionDto();
				condonacionDto.setPrun_ideregistr(itemCondonacion.getPrun_ideregistr());
				ProgramaUnidad programaUnidad = _serviceProgramaUnidad.findById(itemCondonacion.getPrun_ideregistr());
				condonacionDto.setUspu_ideregistr(itemCondonacion.getUspu_ideregistr());
				condonacionDto.setUsu_ideregistro(itemCondonacion.getUsu_ideregistro());
				Usuario usuario = _serviceUsuario.findById(itemCondonacion.getUsu_ideregistro());
				condonacionDto.setNombreusuario(usuario.getUsuario_nom());
				condonacionDto.setNombreproceso(programaUnidad.getUni_nombre1());
				if (condonacionDetalle.getLuspu_tipo() == "0") condonacionDto.setTipoproceso("Porcentaje");
				if (condonacionDetalle.getLuspu_tipo() == "1") condonacionDto.setTipoproceso("Monto");
				if (condonacionDetalle.getLuspu_tipo() == "2") condonacionDto.setTipoproceso("Ambos");
				
				if (condonacionDetalle != null) {
					condonacionDto.setLuspu_ideregistro(condonacionDetalle.getLuspu_ideregistro());
					condonacionDto.setLuspu_limitemonto(condonacionDetalle.getLuspu_limitemonto() != null ? condonacionDetalle.getLuspu_limitemonto() : 0);
					condonacionDto.setLuspu_limiteporcentaje(condonacionDetalle.getLuspu_limiteporcentaje() != null ? condonacionDetalle.getLuspu_limiteporcentaje() : 0);
					condonacionDto.setLuspu_tipo(condonacionDetalle.getLuspu_tipo());
				}
				
				condonacionesDto.add(condonacionDto);
			}
		}
		

		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(condonacionesDto);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}
	

	/**
	 * 
	 * Metodo para guardar el registro de condonacion y obtener el registro guardado
	 */
	@PostMapping(path = "guardarCondonacion")
	@ApiOperation(value = "Para Almacenar el registro de tabla condonacion", notes = "Retorna el registro de tabla condonacion almacenado" )
	public ResponseEntity<ResponseDto> GuardarEdadCartera(@RequestBody CondonacionDto item, HttpServletRequest httpServletRequest) {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		
		List<Condonacion> condonaciones = new ArrayList<>();
		if (item.getUspu_ideregistr() == null) {			
			condonaciones = _service.findByUsuarioyProceso(item.getUsu_ideregistro(), item.getPrun_ideregistr());
		}
		if (condonaciones.size() > 0) {
			_dto.setCodigoRespuesta(HttpStatus.CONFLICT.value());
			_dto.setData(null);
			_dto.setMensaje("Registro ya existe para ese usuario y proceso");
			return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
		}
		Condonacion condonacion = new Condonacion();

		condonacion.setUspu_ideregistr(item.getUspu_ideregistr());
		condonacion.setPrun_ideregistr(item.getPrun_ideregistr());
		condonacion.setUsu_ideregistro(item.getUsu_ideregistro());
		condonacion.setUsu_auditoria(item.getUsu_ideregistro());

		Condonacion condonacionGuardada = _service.save(condonacion);
		
		if (condonacionGuardada != null) {
			CondonacionDetalle condonacionDetalle = new CondonacionDetalle();
			
			if (item.getLuspu_ideregistro() != null) {
				CondonacionDetalle condonacionDetalleGuardada = _service.findByDetalleId(item.getLuspu_ideregistro());
				condonacionDetalle.setFecha(condonacionDetalleGuardada.getFecha());
			}
			condonacionDetalle.setEmp_ideregistro(Long.valueOf(idEmpresa));
			condonacionDetalle.setLuspu_tipo(item.getLuspu_tipo());
			condonacionDetalle.setLuspu_limiteporcentaje(item.getLuspu_limiteporcentaje());
			condonacionDetalle.setLuspu_limitemonto(item.getLuspu_limitemonto());
			condonacionDetalle.setUspuideregistr(condonacionGuardada.getUspu_ideregistr());
			condonacionDetalle.setLuspu_ideregistro(item.getLuspu_ideregistro());
			condonacionDetalle.setUsu_ideregistro(Long.valueOf(idUsuario));
			
			CondonacionDetalle condonacionDetalleGuardada = _service.saveDetale(condonacionDetalle);
		}
		
		_dto.setCodigoRespuesta(HttpStatus.CREATED.value());
		_dto.setData(condonacionGuardada);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.CREATED);
	}
}
