package com.gell.gestioncartera.microservicios;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gell.gestioncartera.dto.DatoGeneralDto;
import com.gell.gestioncartera.dto.DatoGeneralEjecutivoDto;
import com.gell.gestioncartera.dto.DatoGeneralVariableGlobalDto;
import com.gell.gestioncartera.dto.ParametroDto;
import com.gell.gestioncartera.dto.PeriodoDto;
import com.gell.gestioncartera.dto.ResponseDto;
import com.gell.gestioncartera.dto.VariableGlobalDto;
import com.gell.gestioncartera.entidades.Funcion;
import com.gell.gestioncartera.entidades.MetaGestion;
import com.gell.gestioncartera.entidades.Parametro;
import com.gell.gestioncartera.entidades.Periodo;
import com.gell.gestioncartera.entidades.ProgramaUnidad;
import com.gell.gestioncartera.entidades.TablaComisional;
import com.gell.gestioncartera.entidades.Tercero;
import com.gell.gestioncartera.entidades.Unidad;
import com.gell.gestioncartera.entidades.Usuario;
import com.gell.gestioncartera.entidades.VariableGlobal;
import com.gell.gestioncartera.servicios.impl.FuncionServiciosImpl;
import com.gell.gestioncartera.servicios.impl.MetaGestionServiciosImpl;
import com.gell.gestioncartera.servicios.impl.ParametroServiciosImpl;
import com.gell.gestioncartera.servicios.impl.PeriodoServiciosImpl;
import com.gell.gestioncartera.servicios.impl.ProgramaUnidadServiciosImpl;
import com.gell.gestioncartera.servicios.impl.TablaComisionalServiciosImpl;
import com.gell.gestioncartera.servicios.impl.TerceroServiciosImpl;
import com.gell.gestioncartera.servicios.impl.UnidadServiciosImpl;
import com.gell.gestioncartera.servicios.impl.UsuarioServiciosImpl;
import com.gell.gestioncartera.servicios.impl.VariableGlobalServiciosImpl;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author TSI Microservicio para el manejo de los datos generales que necesiten
 *         los formularios, y ahcer una sola peticion global
 */
@Slf4j
@RestController
@RequestMapping("api/v1/datogeneral")
@Api(value = "Unidades microservice, API para la consulta de los datos generales de los ejecutivos")
public class DatoGeneralController {
	private ResponseDto _dto;
	private DatoGeneralEjecutivoDto _datoGeneralEjecutivo;
	private DatoGeneralVariableGlobalDto _datoGeneralVariableGlobal;
	private DatoGeneralDto _datoGeneral;

	@Autowired
	UnidadServiciosImpl _service;
	@Autowired
	TablaComisionalServiciosImpl _serviceTablaComisional;
	@Autowired
	MetaGestionServiciosImpl _serviceMetaGestion;
	@Autowired
	ParametroServiciosImpl _serviceParametro;
	@Autowired
	FuncionServiciosImpl _serviceFuncion;
	@Autowired
	UsuarioServiciosImpl _serviceUsuario;
	@Autowired
	ProgramaUnidadServiciosImpl _serviceProgramaUnidad;
	@Autowired
	VariableGlobalServiciosImpl _serviceVariableGlobal;
	@Autowired
	PeriodoServiciosImpl _servicePeriodo;

	private String idEmpresa = "";
	private String idUsuario = "";

	public DatoGeneralController() {
		_dto = new ResponseDto();
		_datoGeneralEjecutivo = new DatoGeneralEjecutivoDto();
		_datoGeneralVariableGlobal = new DatoGeneralVariableGlobalDto();
		_datoGeneral = new DatoGeneralDto();
		_dto.setMensaje("Proceso ejecutado correctamente!");
	}

	/**
	 * 
	 * Metodo que permite el listado de las unidades por estructura de clase para el
	 * formulario de ejecutivos
	 * 
	 * @throws JsonProcessingException
	 * @throws NumberFormatException
	 * @throws JsonMappingException
	 */
	@GetMapping(path = "/vglobal/datoGeneral/{id}")
	@ApiOperation(value = "Listar datos generales por empresa", notes = "Retorna un Listado de los datos generales para el formulario de variables globales")
	public ResponseEntity<ResponseDto> GetUnidadVariableGlobal(@PathVariable("id") long id,
			HttpServletRequest httpServletRequest)
			throws JsonMappingException, NumberFormatException, JsonProcessingException {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");

		ParametroDto parametroDto = ExtraerParametro(Long.valueOf(idEmpresa));

		List<Unidad> uniTipoDato = _service.findByParametros(parametroDto.getMetodo_carga_gestion_cartera());
		Unidad newUnidadTipoDato = new Unidad();
		newUnidadTipoDato.setUni_ideregistro(-1L);
		newUnidadTipoDato.setUninombre("Seleccione Tipo de dato");
		uniTipoDato.add(newUnidadTipoDato);

		List<Unidad> uniAtributoMaestro = _service.findByParametros(parametroDto.getAtributo_maestro_cartera());
		Unidad newUnidadAtributoMaestro = new Unidad();
		newUnidadAtributoMaestro.setUni_ideregistro(-2L);
		newUnidadAtributoMaestro.setUninombre("Seleccione Atributo Maestro");
		uniAtributoMaestro.add(newUnidadAtributoMaestro);

		List<Unidad> uniCalculoGestion = _service.findByParametros(parametroDto.getMetodo_backend_gestion_cartera());
		Unidad newUnidadCalculoGestion = new Unidad();
		newUnidadCalculoGestion.setUni_ideregistro(-4L);
		newUnidadCalculoGestion.setUninombre("Seleccione Método Backend ");
		uniCalculoGestion.add(newUnidadCalculoGestion);

		List<Unidad> uniMetodoBackEnd = _service.findByParametros(parametroDto.getCalculo_gestion_cartera());
		Unidad newUnidadMetodoBackend = new Unidad();
		newUnidadMetodoBackend.setUni_ideregistro(-3L);
		newUnidadMetodoBackend.setUninombre("Seleccione Calculo Gestión");
		uniMetodoBackEnd.add(newUnidadMetodoBackend);

		List<Unidad> uniProcedimientoGestion = _service
				.findByParametros(parametroDto.getProcedimiento_gestion_cartera());// 198L);
		Unidad newUnidadProcedimientoGestion = new Unidad();
		newUnidadProcedimientoGestion.setUni_ideregistro(-5L);
		newUnidadProcedimientoGestion.setUninombre("Seleccione Procedimiento Gestión");
		uniProcedimientoGestion.add(newUnidadProcedimientoGestion);

		List<Unidad> uniMetodoCarga = _service.findByParametros(parametroDto.getMetodo_carga_gestion_cartera());
		Unidad newUnidadMetodoCarga = new Unidad();
		newUnidadMetodoCarga.setUni_ideregistro(-6L);
		newUnidadMetodoCarga.setUninombre("Seleccione Método de carga");
		uniMetodoCarga.add(newUnidadMetodoCarga);

		_datoGeneralVariableGlobal.setListUnidadAtributoMaestro(uniAtributoMaestro);
		_datoGeneralVariableGlobal.setListUnidadCalculoGestion(uniCalculoGestion);
		_datoGeneralVariableGlobal.setListUnidadMetodoBackend(uniMetodoBackEnd);
		_datoGeneralVariableGlobal.setListUnidadMetodoCarga(uniMetodoCarga);
		_datoGeneralVariableGlobal.setListUnidadProcedimientoGestion(uniProcedimientoGestion);
		_datoGeneralVariableGlobal.setListUnidadTipoDato(uniTipoDato);

		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(_datoGeneralVariableGlobal);
		String a = (String) httpServletRequest.getAttribute("idEmpresa");
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);

	}

	/**
	 * 
	 * Metodo que permite el listado de las unidades por estructura de clase para el
	 * formulario de clasificacion, orientacion, estado cartera, metas gestion, tabla comisional, novedad visita, condonacion
	 * 
	 * @throws JsonProcessingException
	 * @throws NumberFormatException
	 * @throws JsonMappingException
	 */
	@GetMapping(path = "/general")
	@ApiOperation(value = "Listar datos generales por empresa", notes = "Retorna un Listado de los datos generales para varios formularios")
	public ResponseEntity<ResponseDto> GetUnidadGeneral(HttpServletRequest httpServletRequest)
			throws JsonMappingException, NumberFormatException, JsonProcessingException {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");
		
		ParametroDto parametroDto = ExtraerParametro(Long.valueOf(idEmpresa));

		List<Unidad> uniEstado = _service.findByParametros(parametroDto.getEstado_ejecutivos());
		Unidad newUnidadEstado = new Unidad();
		newUnidadEstado.setUni_ideregistro(-1L);
		newUnidadEstado.setUninombre("Seleccione Estado");
		uniEstado.add(newUnidadEstado);
		
		List<Unidad> uniUnidadTiempoMetaGestion = _service.findByUnidadNotNull(parametroDto.getUnidad_tiempo_gestion_cartera(), Long.valueOf(idEmpresa));
		Unidad unidadTiempoMetaGestion= new Unidad();
		unidadTiempoMetaGestion.setUni_ideregistro(-4L);
		unidadTiempoMetaGestion.setUninombre("Seleccione Unidad Tiempo");
		uniUnidadTiempoMetaGestion.add(unidadTiempoMetaGestion);
		
		
		List<Unidad> uniUnidadTiempoEstadoCartera = _service.findByParametros(parametroDto.getUnidad_tiempo_gestion_cartera());
		Unidad UnidadUTiempo = new Unidad();
		UnidadUTiempo.setUni_ideregistro(-2L);
		UnidadUTiempo.setUninombre("Seleccione Unidad Tiempo");
		uniUnidadTiempoEstadoCartera.add(UnidadUTiempo);
		
		List<Unidad> uniTipos = _service.findByParametros(parametroDto.getClasificacion_ejecutivos());
		
		List<Unidad> uniUnidadConceptoMetas = _service.findByParametros(parametroDto.getConcepto_comision_gestion_cartera());
		List<Unidad> uniUnidadTipoRecurso = _service.findByParametros(parametroDto.getTipo_recurso_gestion_cartera());
		List<Unidad> uniUnidadCondicional = _service.findByParametros(parametroDto.getCondicional_gestion_cartera());
		Unidad UnidadCondicional = new Unidad();
		UnidadCondicional.setUni_ideregistro(-3L);
		UnidadCondicional.setUninombre("Seleccione Concepto");
		uniUnidadCondicional.add(UnidadCondicional);
		
		List<Funcion> funFuncionBaseMeta = _serviceFuncion.findByFuntipo("X");
		List<Funcion> funFuncionMeta = _serviceFuncion.findByFuntipo("Y");
		
		List<Funcion> funFuncionBaseComision = _serviceFuncion.findByFuntipo("V");
		Funcion itemFuncionBase = new Funcion();
		itemFuncionBase.setFun_idregistro(-4L);
		itemFuncionBase.setFun_descripcion("Seleccione método");
		itemFuncionBase.setFun_nombre("Seleccione método");
		funFuncionBaseComision.add(itemFuncionBase);
		
		List<Funcion> funFuncionComision = _serviceFuncion.findByFuntipo("L");
		Funcion itemFuncionComision = new Funcion();
		itemFuncionComision.setFun_idregistro(-5L);
		itemFuncionComision.setFun_descripcion("Seleccione método");
		itemFuncionComision.setFun_nombre("Seleccione método");
		funFuncionComision.add(itemFuncionComision);

		
		List<Usuario> usuarios = _serviceUsuario.findUsuarios(Long.valueOf(idEmpresa), parametroDto.getProgramas_cond_financ());
		Usuario usuario = new Usuario();
		usuario.setUsu_ideregistro(-2L);
		usuario.setUsuario_nom("Seleccione Usuario");
		usuarios.add(usuario);
		
		List<ProgramaUnidad> programasUnidad = _serviceProgramaUnidad.findProgramaUnidad(parametroDto.getClase_restriccion_cond_finan(), Long.valueOf(idEmpresa), parametroDto.getProgramas_cond_financ());
		ProgramaUnidad programaUnidad = new ProgramaUnidad();
		programaUnidad.setPrun_ideregistro(-1L);
		programaUnidad.setPrg_nombre("Seleccione Proceso");
		programasUnidad.add(programaUnidad);
		
		List<VariableGlobalDto> variableGlobales = _serviceVariableGlobal.findByAllDto(Long.valueOf(idEmpresa));
		VariableGlobalDto variableGlobalDto = new VariableGlobalDto();
		variableGlobalDto.setVglo_idregistro(-1L);
		variableGlobalDto.setVglo_descripcion("Seleccione Variable Global");
		variableGlobales.add(variableGlobalDto);
		
		_datoGeneral.setListUnidadControlMetasGestion(uniUnidadTiempoMetaGestion);
		List<Long> rango = new ArrayList<Long>();
		Long id1 = -1L;
		Long id2 = -1L;
		Long id3 = -1L;
		Long id4 = -1L;
		Long id5 = -1L;
		for(Unidad itemUnidadControl : uniUnidadTiempoMetaGestion) {
			if (itemUnidadControl.getUni_ideregistro() < 0) continue;
			 id1 = this.ExtraerParametro(itemUnidadControl.getUnipropiedad(), "ciclo_mes");
			 if (id1 > 0)
				 rango.add(id1);
			 id2 = this.ExtraerParametro(itemUnidadControl.getUnipropiedad(), "ciclo_bimestral");
			 if (id2 > 0)
				 rango.add(id2);
			 id3 = this.ExtraerParametro(itemUnidadControl.getUnipropiedad(), "ciclo_trimestral");
			 if (id3 > 0)
				 rango.add(id3);
			 id4 = this.ExtraerParametro(itemUnidadControl.getUnipropiedad(), "ciclo_semestral");
			 if (id4 > 0)
				 rango.add(id4);
			 id5 = this.ExtraerParametro(itemUnidadControl.getUnipropiedad(), "ciclo_anual");
			 if (id5 > 0)
				 rango.add(id5);			

		}
		
		List<Periodo> periodos = new ArrayList<Periodo>();
		List<PeriodoDto> periodosDto = new ArrayList<PeriodoDto>();
		
		periodos = _servicePeriodo.findByPeriodo(rango);
		for(Unidad itemUnidadControl : uniUnidadTiempoMetaGestion) {
			if (itemUnidadControl.getUni_ideregistro() < 0) continue;
			for(Periodo itemPeriodo : periodos) {
				PeriodoDto periodoDto = new PeriodoDto();
				if (itemUnidadControl.getUnipropiedad().contains(itemPeriodo.getCic_ideregistro().toString())) {
					periodoDto.setPer_estado(itemPeriodo.getPer_estado());
					periodoDto.setPer_ideregistro(itemPeriodo.getPer_ideregistro());
					periodoDto.setPer_nombre(itemPeriodo.getPer_nombre());
					periodoDto.setPer_propiedad(itemPeriodo.getCic_ideregistro());
					periodoDto.setUni_ideregistro(itemUnidadControl.getUni_ideregistro());
					periodosDto.add(periodoDto);
					periodoDto = new PeriodoDto();
					periodoDto.setPer_estado(itemPeriodo.getPer_estado());
					periodoDto.setPer_ideregistro(-2L);
					periodoDto.setPer_nombre("Seleccione Ciclo");
					periodoDto.setPer_propiedad(itemPeriodo.getCic_ideregistro());
					periodoDto.setUni_ideregistro(itemUnidadControl.getUni_ideregistro());
					periodosDto.add(periodoDto);

				}
			}
		}
		
		_datoGeneral.setListPeriodo(periodosDto);
		
		_datoGeneral.setListUnidadControlEstaCartera(uniUnidadTiempoEstadoCartera);
		_datoGeneral.setListUnidadEstados(uniEstado);
		
		Unidad unidadConceptoMetas= new Unidad();
		unidadConceptoMetas.setUni_ideregistro(-3L);
		unidadConceptoMetas.setUninombre("Seleccione Concepto");
		uniUnidadConceptoMetas.add(UnidadCondicional);
		_datoGeneral.setListUnidadConceptoMetas(uniUnidadConceptoMetas);
		
		
		_datoGeneral.setListUnidadTipoRecurso(uniUnidadTipoRecurso);
		
		Funcion funcionBaseMeta = new Funcion();
		funcionBaseMeta.setFun_descripcion("Seleccione Método Base");
		funcionBaseMeta.setFun_nombre("Seleccione Método Base");
		funcionBaseMeta.setFun_idregistro(-5L);
		funFuncionBaseMeta.add(funcionBaseMeta);
		_datoGeneral.setListFuncionBaseMeta(funFuncionBaseMeta);
		
		
		Funcion funcionMeta = new Funcion();
		funcionMeta.setFun_descripcion("Seleccione Método Cálculo");
		funcionMeta.setFun_nombre("Seleccione Método Cálculo");
		funcionMeta.setFun_idregistro(-6L);
		funFuncionMeta.add(funcionMeta);
		_datoGeneral.setListFuncionMeta(funFuncionMeta);
		
		_datoGeneral.setListFuncionBaseComision(funFuncionBaseComision);
		_datoGeneral.setListFuncionComision(funFuncionComision);
		
		_datoGeneral.setListUsuarios(usuarios);
		
		_datoGeneral.setListProgramasUnidad(programasUnidad);
		
		_datoGeneral.setListVariableGlobal(variableGlobales);
		
		_datoGeneral.setListUnidadCondicional(uniUnidadCondicional);
		_datoGeneral.setListUnidadTipos(uniTipos);
		
		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(_datoGeneral);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}

	/**
	 * 
	 * Metodo que permite el listado de las unidades por estructura de clase para el
	 * formulario de ejecutivos
	 * 
	 * @throws JsonProcessingException
	 * @throws NumberFormatException
	 * @throws JsonMappingException
	 */
	@GetMapping(path = "/ejecutivo/datoGeneral/{id}")
	@ApiOperation(value = "Listar datos generales por empresa", notes = "Retorna un Listado de los datos generales para el formulario de ejecutivo")
	public ResponseEntity<ResponseDto> GetUnidad(@PathVariable("id") long id, HttpServletRequest httpServletRequest)
			throws JsonMappingException, NumberFormatException, JsonProcessingException {
		idEmpresa = (String) httpServletRequest.getAttribute("idEmpresa");
		idUsuario = (String) httpServletRequest.getAttribute("idUsuario");

		ParametroDto parametroDto = ExtraerParametro(Long.valueOf(idEmpresa));

		List<Unidad> uniEstado = _service.findByParametros(parametroDto.getEstado_ejecutivos());

		Unidad newUnidadEstado = new Unidad();
		newUnidadEstado.setUni_ideregistro(-1L);
		newUnidadEstado.setUninombre("Seleccione Estado");
		uniEstado.add(newUnidadEstado);

		List<Unidad> uniGestion = _service.findByParametros(parametroDto.getEtapas_gestion_cartera());
		Unidad newUnidadGestion = new Unidad();
		newUnidadGestion.setUni_ideregistro(-2L);
		newUnidadGestion.setUninombre("Seleccione Etapa Gestión");
		uniGestion.add(newUnidadGestion);

		List<Unidad> uniTipos = _service.findByParametros(parametroDto.getClasificacion_ejecutivos());
		Unidad newUnidadTipos = new Unidad();
		newUnidadTipos.setUni_ideregistro(-3L);
		newUnidadTipos.setUninombre("Seleccione Clasificación");
		uniTipos.add(newUnidadTipos);

		List<TablaComisional> tablaComisional = _serviceTablaComisional.findByAll();
		TablaComisional newUnidadTComisional = new TablaComisional();
		newUnidadTComisional.setTcom_idregistro(-4L);
		newUnidadTComisional.setTcom_descripcion("Seleccione Tabla de comisión");
		tablaComisional.add(newUnidadTComisional);

		List<MetaGestion> metaGestion = _serviceMetaGestion.findByAll();
		MetaGestion newUnidadMetaGestion = new MetaGestion();
		newUnidadMetaGestion.setMege_idregistro(-5L);
		newUnidadMetaGestion.setMege_descripcion("Seleccione Metas de gestión");
		metaGestion.add(newUnidadMetaGestion);

		_datoGeneralEjecutivo.setListUnidadEstados(uniEstado);
		_datoGeneralEjecutivo.setListUnidadGestion(uniGestion);
		_datoGeneralEjecutivo.setListUnidadTipos(uniTipos);
		_datoGeneralEjecutivo.setListUnidadMetaGestion(metaGestion);
		_datoGeneralEjecutivo.setListUnidadTablaComisional(tablaComisional);

		_dto.setCodigoRespuesta(HttpStatus.OK.value());
		_dto.setData(_datoGeneralEjecutivo);
		return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
	}

	private ParametroDto ExtraerParametro(Long idEmpresa) throws JsonMappingException, JsonProcessingException {
		Parametro parametro = _serviceParametro.findByEmpideregistro(idEmpresa);
		ObjectMapper objectMapper = new ObjectMapper();
		ParametroDto parametroDto = null;

		String json = parametro.getPar_parametro();

		JsonNode jsonNode = objectMapper.readTree(json).get("GESTION_CARTERA");
		String parametroNode = jsonNode.toString();
		parametroDto = objectMapper.readValue(parametroNode, ParametroDto.class);

		return parametroDto;
	}
	
	private Long ExtraerParametro(String json, String valor) throws JsonMappingException, JsonProcessingException {
		ObjectMapper objectMapper = new ObjectMapper();

		JsonNode jsonNode = objectMapper.readTree(json);

		String value = "";
		Long response = -1L;
		try {			
			value = jsonNode.get(valor).asText();
			response = value != "" ? Long.valueOf(value) : -1L;
		} catch (Exception e) {
			response = -1L;
		}
	
		return response;
	}
}
