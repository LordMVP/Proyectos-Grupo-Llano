package com.bioagricola.aforos.controller;

import java.util.ArrayList;
import java.util.Formatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.controller.generic.AbstractRestController;
import com.bioagricola.aforos.entity.Aforo;
import com.bioagricola.aforos.entity.AforoMultiusuario;
import com.bioagricola.aforos.entity.DetalleAforo;
import com.bioagricola.aforos.entity.dto.AforoInfoDTO;
import com.bioagricola.aforos.entity.dto.AforoLiquidacionMultiusuarioRequest;
import com.bioagricola.aforos.entity.dto.AforoLiquidacionRequest;
import com.bioagricola.aforos.entity.dto.AforoLiquidacionResponse;
import com.bioagricola.aforos.entity.dto.AforoLiquidacionResponseGeneralDTO;
import com.bioagricola.aforos.entity.dto.AforoPreLiquidacionResponse;
import com.bioagricola.aforos.entity.dto.ConsolidatedAforoDTO;
import com.bioagricola.aforos.entity.dto.DetalleAforoInfoDTO;
import com.bioagricola.aforos.entity.dto.EditAforoDTO;
import com.bioagricola.aforos.entity.dto.NewAforoDTO;
import com.bioagricola.aforos.entity.dto.ResponseDTO;
import com.bioagricola.aforos.entity.dto.SearchDTO;
import com.bioagricola.aforos.entity.dto.SearchResponseDTO;
import com.bioagricola.aforos.entity.dto.VisitEditAforoDTO;
import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.aforos.mapper.AforoMapper;
import com.bioagricola.aforos.mapper.DetalleAforoMapper;
import com.bioagricola.aforos.repository.AforoMultiusuarioRepository;
import com.bioagricola.aforos.service.impl.AforoServiceImpl;
import com.bioagricola.aforos.service.impl.DetalleAforoServiceImpl;
import com.bioagricola.aforos.service.impl.MaestroAforoVisitaServiceImpl;
import com.bioagricola.common.constant.UtilConstantes;
import com.bioagricola.common.exception.BusinessException;
import com.bioagricola.homologaciones.entity.GenGenerador;
import com.bioagricola.homologaciones.service.impl.GenGeneradorService;

@RestController
@RequestMapping("/api/aforo")
public class AforoController extends AbstractRestController{
	
	Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private AforoMultiusuarioRepository aforoMultiRepo;

	@Autowired
	private AforoServiceImpl aforoServiceImpl;
	
	@Autowired
	private GenGeneradorService generadorService;

	@Autowired
	private MaestroAforoVisitaServiceImpl maestroAforoVisitaServiceImpl;
	@Autowired
	private AuthenticationFacade authenticationFacade;
	@Autowired
	private AforoMapper aforoMapper;

	@Autowired
	private DetalleAforoServiceImpl detalleAforoService;

	@Autowired
	DetalleAforoMapper detalleAforoMapper;
	/**
	 * Buscador general de nuevo aforo
	 */
	@GetMapping(value= "/buscar")
	public ResponseDTO<List<SearchResponseDTO>> searchAforos(SearchDTO searchDTO) {
		List<SearchResponseDTO> response = aforoServiceImpl.searchAforos(searchDTO);
        return new ResponseDTO<>(Boolean.TRUE,response);
	}

	/**
	 * Buscador de suscripción para nuevo aforo
	 */
	@GetMapping("/buscarSuscripcion")
	public ResponseDTO<SearchResponseDTO> searchSuscripcion(SearchDTO searchDTO) {
		SearchResponseDTO response = aforoServiceImpl.searchSuscripcion(searchDTO);
		if(response.getIdSuscripcion()!=null) {
			return new ResponseDTO<>(Boolean.TRUE,response);
		}else {
			ResponseDTO<SearchResponseDTO> r = new ResponseDTO<>();
			r.setSuccess(Boolean.TRUE);
			r.setMessage("No se han encontrado resultados para los criterios de búsqueda.");
			r.setData(new SearchResponseDTO());
			return r;
		}
	}
	
	/**
	 * Buscador de suscripción por complemente par multiusuario // JLMENDOZA
	 */
	@GetMapping("/buscarSuscripcionPorComplemento")
	public ResponseDTO<List<SearchResponseDTO>> searchSuscripcionPorComplemento(SearchDTO searchDTO) {
		
		Optional<List<SearchResponseDTO>> respuesta = Optional.empty();		
		respuesta = aforoServiceImpl.searchSuscripcionPorComplemento(searchDTO);
		
		if(respuesta.isPresent()) {
			return new ResponseDTO<>(Boolean.TRUE,respuesta.get());
		}else {
			return new ResponseDTO<>(Boolean.TRUE,"No se han encontrado resultados para los criterios de búsqueda.",respuesta.get());
		}
	}	

	/**
	 * Información general que llena la interfaz para editar
	 */
	@PostMapping("/informacionGeneral")
	public ResponseDTO<EditAforoDTO> getById(@Valid @RequestBody SearchDTO searchDTO) {
		EditAforoDTO response = aforoServiceImpl.getById(searchDTO.getNumAforo());
        return new ResponseDTO<>(Boolean.TRUE,response);
	}

	/**
	 * Estado de visitas en la interfaz de edición (solo informativo)
	 */
	@GetMapping("/detalleVisitasAforo")
	public ResponseDTO<List<VisitEditAforoDTO>> getDetallesVisitas(SearchDTO searchDTO) {
		List<VisitEditAforoDTO> response = maestroAforoVisitaServiceImpl.getDetallesVisitas(searchDTO);
		return new ResponseDTO<>(Boolean.TRUE,response);
	}

	@GetMapping("/consolidadoAforo")
	public ResponseDTO<List<ConsolidatedAforoDTO>> getConsolidadoAforos(SearchDTO searchDTO) {
		List<ConsolidatedAforoDTO> response = maestroAforoVisitaServiceImpl.getConsolidados(searchDTO);
		if(response.isEmpty()) {
			ConsolidatedAforoDTO c = new ConsolidatedAforoDTO();
								 c.setDetalles(new ArrayList<>());;
			response.add(c);
		}
		return new ResponseDTO<>(Boolean.TRUE,response);
	}

	@PostMapping("/nuevo")	
    public ResponseDTO<Aforo> saveAforo(@Valid @RequestBody NewAforoDTO newAforoDTO) {
		try {
				Aforo aforoBD = aforoServiceImpl.saveNewAforo(newAforoDTO);
			      //se omite la persistencia de detallesAforo por aparte  debido a que a la clase
			      // se le agrego persistencia en cascada en DetalleAforo
				  //aforoBD.setDetallesAforo(Arrays.asList(detalleAforoServiceImpl.saveDetalleAforoNormal(aforoBD, newAforoDTO)));
				 // maestroAforoVisitaServiceImpl.crearVisitas(aforoBD, authenticationFacade.getCredentials().getUsuprgunid());
	        return new ResponseDTO<>(Boolean.TRUE,aforoBD);
		}catch (BusinessException e) {
			return new ResponseDTO<>(Boolean.FALSE,e.getMessage(),new Aforo());
		}
    }

	@PutMapping("/editar")
    public ResponseDTO<Aforo> editAforo(@Valid @RequestBody EditAforoDTO editAforoDTO) {
		Aforo response = aforoServiceImpl.editAforo(editAforoDTO);
        return new ResponseDTO<>(Boolean.TRUE,response);
    }

	@GetMapping("/buscarAforoPadre")
	public ResponseDTO<SearchResponseDTO> buscarAforoPadre(SearchDTO searchDTO) {
		SearchResponseDTO response = aforoServiceImpl.searchAforoPadre(searchDTO);
		if(response.getIdSuscripcion()!=null) {
			return new ResponseDTO<>(Boolean.TRUE,response);
		}else {
			ResponseDTO<SearchResponseDTO> r = new ResponseDTO<>();
			r.setSuccess(Boolean.TRUE);
			r.setMessage("No se han encontrado resultados para los criterios de búsqueda.");
			r.setData(new SearchResponseDTO());
			return r;
		}
	}

	@GetMapping(value= "/buscarVisitas")
	public ResponseDTO<List<SearchResponseDTO>> searchAforosVisitas(SearchDTO searchDTO) {
		List<SearchResponseDTO> response = aforoServiceImpl.searchAforosVisitas(searchDTO);
        return new ResponseDTO<>(Boolean.TRUE,response);
	}

	/*@GetMapping(value = "/pageAnterior") // version anterior del PAGE
	public ResponseEntity<Page<AforoInfoDTO>> getAforosInfo(Pageable pageable,@RequestParam Optional<String> search){
		Page<Aforo> pageAforo = aforoServiceImpl.getAforosPage(pageable,search);
		Page<AforoInfoDTO> pageDTo = pageAforo.map(item -> aforoMapper.aforoToAforoInfoDTO(item));
		return ResponseEntity.ok(pageDTo);
	}*/
	
	@GetMapping(value = "/page")
	public ResponseEntity<Page<AforoInfoDTO>> getAforosInfo(Pageable pageable,@RequestParam Optional<String> search){
		Page<Aforo> pageAforo = aforoServiceImpl.getAforosPage(pageable, search);

		Page<AforoInfoDTO> modPageDTO = pageAforo.map(aforo -> {
			try {
				AforoInfoDTO afo = aforoMapper.aforoToAforoInfoDTO(aforo);

				// Intentar pre-liquidar
				AforoPreLiquidacionResponse afoResponsePreLiquidacion =
						aforoServiceImpl.preLiquidarAforo(aforo.getAfoIderegistro());

				if(afoResponsePreLiquidacion != null) {
					afo.setAforoPreLiqDTO(afoResponsePreLiquidacion);

					// Establecer estado basado en la validación
					if(afoResponsePreLiquidacion.getValido()) {
						afo.setAfoEstado(UtilConstantes.ESTADO_PRE_LIQUIDACION);
					} else {
						afo.setAfoObservaciones(
								(afo.getAfoObservaciones() != null ? afo.getAfoObservaciones() + "  " : "") +
										"- Pre-liquidación: " + afoResponsePreLiquidacion.getMensaje()
						);
						log.warn("Aforo {} no pudo ser pre-liquidado: {}",
								aforo.getAfoIderegistro(),
								afoResponsePreLiquidacion.getMensaje());
						return afo;
					}

					// Cargar detalles
					List<DetalleAforo> detalles = detalleAforoService.findDetallesAforo(aforo.getAfoIderegistro());
					afo.setDetalleAforo(detalles.stream()
							.map(detalleAforoMapper::toResource)
							.collect(Collectors.toList()));
				}
				return afo;

			} catch (Exception e) {
				log.error("Error procesando aforo {}: {}", aforo.getAfoIderegistro(), e.getMessage(), e);

				// En caso de error, retornar DTO básico con estado en proceso
				AforoInfoDTO afo = aforoMapper.aforoToAforoInfoDTO(aforo);
				afo.setAfoEstado(UtilConstantes.ESTADO_EN_PROCESO);
				afo.setAfoObservaciones(
						(afo.getAfoObservaciones() != null ? afo.getAfoObservaciones() + " | " : "") +
								"Error al procesar: " + e.getMessage()
				);
				return afo;
			}
		});

		return ResponseEntity.ok(modPageDTO);
	}

	@GetMapping(value = "/liquidaciones")
	public ResponseEntity<Page<AforoInfoDTO>> getAforosLiquidacion(Pageable pageable){
		return null;
	}

	@GetMapping(value = "/pre-liquidacion/{aforo}")
	public ResponseEntity<AforoPreLiquidacionResponse> getPreLiquidarAforo(@PathVariable(name="aforo")Long aforoId){
		AforoPreLiquidacionResponse response = aforoServiceImpl.preLiquidarAforo(aforoId);
		return ResponseEntity.ok(response);
	}

	@PostMapping(value = "/liquidar")
	public ResponseEntity<AforoLiquidacionResponse> postLiquidarAforo(@RequestBody AforoLiquidacionRequest request){
		Long result = aforoServiceImpl.liquidarAforo(request.getAforo(),request.getGenerador());
		AforoLiquidacionResponse response = new AforoLiquidacionResponse();
		response.setAforoId(request.getAforo());
		response.setCodigo(result);
		response.setMensaje(result.equals(1L)?"El aforo se liquido correctamente y se traslado a historicos":"No se logro liquidar el aforo");
		return ResponseEntity.ok(response);
	}
	
	@PostMapping(value = "/liquidacionGeneral")
	public ResponseEntity<AforoLiquidacionResponseGeneralDTO> postLiquidarAforoGeneral(){
		Long result = aforoServiceImpl.liquidarAforoGeneral();
		AforoLiquidacionResponseGeneralDTO response = AforoLiquidacionResponseGeneralDTO.builder()
		.cantidad(result)
		.statusCode(result > 0 ? 1 : 0)
		.statusText(result > 0 ? "Aforos Liquidados Exitosamente. " : "Genero error la Liquidacion Aforos ")
		.build();
		return ResponseEntity.ok(response);
	}

	@PostMapping(value = "/liquidarMultiusuario")
	public ResponseEntity<AforoLiquidacionResponse> postLiquidarAforoMultiusuario(@RequestBody AforoLiquidacionMultiusuarioRequest request){
		Long result = aforoServiceImpl.liquidarAforoMultiusuario(request.getAforo(),request.getGenerador(),request.getTafna());
		log.error("MULTIUSUARIO: "+request.getAforo() + "Tafna: " + request.getTafna()+"RESULT:"+result);
		AforoLiquidacionResponse response = new AforoLiquidacionResponse();
		response.setAforoId(request.getAforo());
		response.setCodigo(result);
		response.setMensaje(result.equals(1L)?"El aforo se liquido correctamente y se traslado a historicos":"No se logro liquidar el aforo");
		return ResponseEntity.ok(response);		
	}

	
	@PostMapping(value = "/liquidarMultiusuarioGeneral")
	public ResponseEntity<AforoLiquidacionResponseGeneralDTO> postLiquidarAforoMultiusuarioGeneral(){
		Long result = aforoServiceImpl.liquidarAforoMultiusuarioGeneral();
		AforoLiquidacionResponseGeneralDTO response = AforoLiquidacionResponseGeneralDTO.builder()
				.cantidad(result)
				.statusCode(result > 0 ? 1 : 0)
				.statusText(result > 0 ? "MultiUsuarios Aforos Liquidados Exitosamente. " : "Genero error la Liquidacion Multiusuarios Aforos ")
				.build();
				return ResponseEntity.ok(response);
	}
	
	
	@GetMapping(value = "/detalles/{aforo}")
	public ResponseEntity<Page<DetalleAforoInfoDTO>> getDetallesAforo(@PathVariable(name = "aforo")Long aforo){
			List<DetalleAforo> detalles = this.detalleAforoService.findDetallesAforo(aforo);
			List<DetalleAforoInfoDTO> detallesDTO = detalles.stream().map(detalleAforoMapper::toResource).collect(Collectors.toList());
			return ResponseEntity.ok(new PageImpl<>(detallesDTO));

	}
	
	@GetMapping(value = "/test/volumen/{volumen}")
	public ResponseEntity<List<GenGenerador>> getTestVolumen(@PathVariable(name="volumen")Double volumen){		
		return ResponseEntity.ok(this.generadorService.findByVolumenGenerado(volumen));
	}
	
}
