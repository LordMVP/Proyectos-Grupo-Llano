package com.bioagricola.aforos.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.Formatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import javax.transaction.Transactional;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.bioagricola.aforos.entity.Aforo;
import com.bioagricola.aforos.entity.AforoMultiusuario;
import com.bioagricola.aforos.entity.DetalleAforo;
import com.bioagricola.aforos.entity.DetalleMaestroVisita;
import com.bioagricola.aforos.entity.DlihamDetliqaforomultiusuario;
import com.bioagricola.aforos.entity.LiafocoLiquidacionAforoConceptosAdicional;
import com.bioagricola.aforos.entity.MaestroAforoVisita;
import com.bioagricola.aforos.entity.dto.AforoPreLiquidacionResponse;
import com.bioagricola.aforos.entity.dto.CredentialsDTO;
import com.bioagricola.aforos.entity.dto.DafoDetAforoDTO;
import com.bioagricola.aforos.entity.dto.DetalleAforoInfoDTO;
import com.bioagricola.aforos.entity.dto.EditAforoDTO;
import com.bioagricola.aforos.entity.dto.NewAforoDTO;
import com.bioagricola.aforos.entity.dto.SearchDTO;
import com.bioagricola.aforos.entity.dto.SearchResponseDTO;
import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.aforos.mapper.AforoMaestroVisitasMapper;
import com.bioagricola.aforos.mapper.DetalleAforoMapper;
import com.bioagricola.aforos.mapper.GenGeneradorMapper;
import com.bioagricola.aforos.repository.AforoMultiusuarioRepository;
import com.bioagricola.aforos.repository.AforoRepository;
import com.bioagricola.aforos.repository.DlihamDetliqaforomultiusuarioRepository;
import com.bioagricola.aforos.repository.IasusInforadicionalsuscripcionRepository;
import com.bioagricola.aforos.repository.Liafoco_liquidacionaforoconceptoRepository;
import com.bioagricola.common.constant.UtilConstantes;
import com.bioagricola.common.dto.Usuario;
import com.bioagricola.common.entity.Barrios;
import com.bioagricola.common.entity.ConConcepto;
import com.bioagricola.common.entity.CosuConsuscrip;
import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.common.entity.HrrHorrecoleccion;
import com.bioagricola.common.entity.IasusInforadicionalsuscripcion;
import com.bioagricola.common.entity.ProPropiedad;
import com.bioagricola.common.entity.Reclamos;
import com.bioagricola.common.entity.TerTercero;
import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.common.exception.BusinessException;
import com.bioagricola.common.repository.DsusDetsuscripRepository;
import com.bioagricola.common.repository.HrrHorrecoleccionRepository;
import com.bioagricola.common.repository.ProPropiedadRepository;
import com.bioagricola.common.repository.ReclamosRepository;
import com.bioagricola.common.repository.TerTerceroRepository;
import com.bioagricola.common.repository.UniUnidadRepository;
import com.bioagricola.common.service.ParParametroService;
import com.bioagricola.common.util.BDToDTOUtil;
import com.bioagricola.common.util.DateUtil;
import com.bioagricola.homologaciones.entity.GenGenerador;
import com.bioagricola.homologaciones.entity.RureRutrecoleccion;
import com.bioagricola.homologaciones.entity.TafoTipoAforo;
import com.bioagricola.homologaciones.repository.BarriosRepository;
import com.bioagricola.homologaciones.repository.CosuConsuscripRepository;
import com.bioagricola.homologaciones.repository.RureRutrecoleccionRepository;
import com.bioagricola.homologaciones.service.impl.ConConceptoService;
import com.bioagricola.homologaciones.service.impl.GenGeneradorService;
import com.bioagricola.homologaciones.service.impl.HomologacionService;
import com.bioagricola.homologaciones.service.impl.RureRutrecoleccionService;
import com.bioagricola.homologaciones.service.impl.TafoTipoAforoService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import ch.qos.logback.classic.pattern.Util;

@Service
@Transactional
public class AforoServiceImpl {

	private static final String DATE_FORMAT = "yyyy-MM-dd";
	private static final String EMPTY = "-";
	private static final String DEFAULT = "-1";
	private static final String INDIVIDUAL = "'INDIVIDUAL'";
	private static final String ESTADO_EN_PROCESO="En Proceso";
	private static final Long CONCEP_MARCADO_AFORADO=5262L;

	@Autowired
	private AforoMaestroVisitasMapper maestroMapper;
	
	@Autowired
	private AforoMultiusuarioRepository aforoMultiRepo;

	@Autowired
	private GenGeneradorService generadorService;

	@Autowired
	private GenGeneradorMapper generadorMapper;

	@Autowired
	private AuthenticationFacade authenticationFacade;
	@Autowired
	private AforoRepository aforoRepository;
	@Autowired
	private DsusDetsuscripRepository dsusDetsuscripRepository;
	@Autowired
	private TerTerceroRepository terTerceroRepository;
	@Autowired
	private UniUnidadRepository uniUnidadRepository;
	@Autowired
	private BarriosRepository barriosRepository;
	@Autowired
	private ProPropiedadRepository propiedadRepository;

	@Autowired
	private ReclamosRepository reclamosRepository;
	@Autowired
	private HrrHorrecoleccionRepository hrrHorrecoleccionRepository;
	@Autowired
	private IasusInforadicionalsuscripcionRepository iasusInforadicionalsuscripcionRepository;

	@Autowired
	private SearchComponentServiceImpl searchComponentServiceImpl;
	@Autowired
	private BDToDTOUtil bDToDTOUtil;
	@Autowired
	private MaestroAforoVisitaServiceImpl maestroAforoVisitaServiceImpl;
	@Autowired
	private RureRutrecoleccionRepository rureRepository;
	@Autowired
	private TafoTipoAforoService tafoService;

	@Autowired
	private RureRutrecoleccionService rureService;

	@Autowired
	private DetalleAforoServiceImpl detalleAforoService;

	@Autowired
	private DetalleAforoMapper detalleAforoMapper;
	
	@Autowired
	private HomologacionService serviceHomologacion;
	
	@Autowired
	private CosuConsuscripRepository cosuRepo;
	
	@Autowired
    private ParParametroService _parParametroService;
	
	@Autowired
	private ConConceptoService conceptoService;
	
	@Autowired
	private Liafoco_liquidacionaforoconceptoRepository liaforepoRepository;
	
	@Autowired
	private DlihamDetliqaforomultiusuarioRepository dliqrepoRepository; 

	Logger log = LoggerFactory.getLogger(this.getClass());

	@Transactional
	public Aforo saveNewAforo(NewAforoDTO dto) {

		this.validateExistentePrevio(dto);
		org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);
		
		UniUnidad uniClaseSuscripcion = uniUnidadRepository.findByEstructuraAndUniNombre1(
				hya_parametros.getLong("est_clases_suscripcion"), UtilConstantes.CLASE_SUSC_INDIVIDUAL).get(0);
		CredentialsDTO c = authenticationFacade.getCredentials();

		Aforo a = new Aforo();
		TafoTipoAforo tipoAforo = tafoService.findById(dto.getUniTipoAforo());
		
		a.setUniTipoaforo(tipoAforo);
		a.setAfoFecha(DateUtil.stringToDate(DATE_FORMAT, dto.getFechaRegistro()));
		a.setAfoFechainicio(DateUtil.stringToDate(DATE_FORMAT, dto.getVigenciaDesde()));
		a.setAfoFechafinvegencia(DateUtil.stringToDate(DATE_FORMAT, dto.getVigenciaHasta()));
		a.setAfoFechafinaforo(DateUtil.stringToDate(DATE_FORMAT, dto.getVigenciaFinal()));
		a.setAfoNumpqr(dto.getNumPqr());
		a.setUniClasesuscripcionaforo(uniClaseSuscripcion);
		a.setAfo_frecuenciarecoleccion(dto.getTfdDescripcion());
		a.setAfoEstado(dto.getEstado());
		a.setTerAforador(terTerceroRepository.findById(dto.getTecnicoAforador()).orElse(null));		;
		// uni_tipogenerador ? esta en la tabla pero no se llena?
		//a.setMafvFactor(Double.valueOf(Optional.ofNullable(dto.getFactor()).orElse("0")));
		a.setUsuIderegistro(c.getUsuprgunid());
		a.setAfoObservaciones(dto.getObservaciones());
		a.setMafvFactor(tipoAforo.getTafoFactorProduccion().doubleValue());
		//RureRutrecoleccion rure = rureService.findById(dto.getRureIderegistro());
		a.setAfoFrecuenciaRecoleccion(dto.getFrecuencia());//(rure.getHorariosActivos().size());.
		a.setTfd_ideregistro(Long.parseLong(dto.getTfdIderegistro().toString()));
		a.setRureIderegistro(dto.getRureIderegistro());
		a.setUniComplemento(uniUnidadRepository.findById(dto.getConceptoAforo()).orElse(null));
		if (dto.getIdeafopadre() != null && dto.getIdeafopadre() > 0) {
			a.setAfoIdeAfoPadre(dto.getIdeafopadre());
		}
		a.setBarrioIderegistro(Long.valueOf(dto.getBarrioUsuarioCodigo()));
		List<DetalleAforo> listaDetalle = new ArrayList<>(1);
		DetalleAforo dA = new DetalleAforo();

		 dA.setAforo(a);
		 dA.setDafoFecharegistro(a.getAfoFecha());
		 dA.setAfoNumpqr(dto.getNumPqr());
		 dA.setDsusIderegistr(dsusDetsuscripRepository.findById(dto.getIdSuscripcion()).orElse(null));
		 dA.setUsuIderegistro(a.getUsuIderegistro());
		 dA.setAfoFechafinvegencia(DateUtil.stringToDate(DATE_FORMAT, dto.getVigenciaHasta()));
		 dA.setDafoMultiusuporcentaje("100");
		 dA.setUniActsuscripc(Integer.parseInt(dto.getActividadComercial() != null ? dto.getActividadComercial() : "5283" )); //Establecimiento Comercial Default
		 listaDetalle.add(dA);
		 a.setUniTipogenerador(dA.getDsusIderegistr().getUniTipusosuscr());
		 a.setDetallesAforo(listaDetalle);

		DsusDetsuscrip dsus = dsusDetsuscripRepository.findById(dto.getIdSuscripcion()).get();
		this.saveDsusAndIasusByDsus(dsus, dto.getNombreEstablecimiento(), dto.getReferenciaComercial(), 
				Long.parseLong(dA.getUniActsuscripc().toString()));		 
		Aforo aforo = this.aforoRepository.saveAndFlush(a);
		maestroAforoVisitaServiceImpl.crearVisitas(aforo, authenticationFacade.getCredentials().getUsuprgunid());
		return aforo;
	}

	private void validateExistentePrevio(NewAforoDTO dto) {
		List<Aforo> aforosPrevios = aforoRepository.findAforoByDsusAndEstado(dto.getIdSuscripcion(),
				dto.getEstado());
		if (!aforosPrevios.isEmpty()) {
			throw new BusinessException(String.format("Existen Aforos activos suscripción %d validar estado %s",
					dto.getIdSuscripcion(),dto.getEstado()));
		}
	}

	@Transactional
	public Aforo editAforo(EditAforoDTO dto) {

		Aforo aforo = aforoRepository.findAforoByNumeroAforo(Long.valueOf(dto.getNumAforo()));
		DetalleAforo detalle = aforo.getDetallesAforo().get(0);
		//DsusDetsuscrip dsus = detalle.getDsusIderegistr();
		this.saveDsusAndIasusByDsus(detalle.getDsusIderegistr(), dto.getSantoSenia(), dto.getReferenciaComercial(),
				dto.getIdActividadComercial());

		aforo.setAfoFechainicio(DateUtil.stringToDate(DATE_FORMAT, dto.getVigenciaDesde()));
		aforo.setAfoFechafinvegencia(DateUtil.stringToDate(DATE_FORMAT, dto.getVigenciaHasta()));
		aforo.setAfoObservaciones(dto.getObservaciones());
		aforo.setAfoEstado(dto.getEstado());
		aforo.setAfoFechaActualizacion(DateUtil.stringToDate(DATE_FORMAT, new SimpleDateFormat("yyyy-MM-dd").format(new Date())));
		detalle.setUniActsuscripc(Math.toIntExact(dto.getIdActividadComercial()));
		detalleAforoService.updateDetalleAforo(detalle);
		//PROCESO DE CANCELACION DEL AFORO 
		List<MaestroAforoVisita> mVisita = maestroAforoVisitaServiceImpl.getMaestroVisitasByIdAforo(aforo.getAfoIderegistro());
		if(dto.getEstado().equalsIgnoreCase(UtilConstantes.ESTADO_EN_PROCESO)) {			
			if (!mVisita.isEmpty()) {
			    mVisita.stream()
			        .forEach(m -> {
			            m.setMafvEstado("A");
			            List<DetalleMaestroVisita> details = maestroAforoVisitaServiceImpl.getDetalleMaestroVisitasByIdMvfAndEstado(m.getMafvIderegistro());
			            	details.stream()
			            	.filter(d -> "C".equalsIgnoreCase(d.getDmafEstado()))
			            	.forEach(d -> d.setDmafEstado("P"));
			            	
			            maestroAforoVisitaServiceImpl.saveAllDetalleVisitas(details);	
			        });
			    maestroAforoVisitaServiceImpl.saveAllMaestroVisitas(mVisita);
			}
		
		}
		if(dto.getEstado().equalsIgnoreCase(UtilConstantes.INACTIVO)) {
			if (!mVisita.isEmpty()) {
			    mVisita.stream()
			        .forEach(m -> {
			            m.setMafvEstado("I");
			            List<DetalleMaestroVisita> details = maestroAforoVisitaServiceImpl.getDetalleMaestroVisitasByIdMvfAndEstado(m.getMafvIderegistro());
			            	details.stream()
			            	.filter(d -> "P".equalsIgnoreCase(d.getDmafEstado()))
			            	.forEach(d -> d.setDmafEstado("C"));
			            	
			            maestroAforoVisitaServiceImpl.saveAllDetalleVisitas(details);	
			        });
			    maestroAforoVisitaServiceImpl.saveAllMaestroVisitas(mVisita);
			}
		}

		return aforo;
	}

	private void saveDsusAndIasusByDsus(DsusDetsuscrip dsus, String santoSenia, String referenciaComercial,
			Long idActividadComercial) {
		IasusInforadicionalsuscripcion iasus = iasusInforadicionalsuscripcionRepository
				.findInfoAdicionalSuscripcion(dsus.getDsusIderegistr()).stream().findFirst()
				.orElse(new IasusInforadicionalsuscripcion());
		iasus.setIasusCobrojuridico(Boolean.FALSE);
		iasus.setIasusPagapeaje(Boolean.FALSE);
		iasus.setSusIderegistro(dsus.getSusIderegistro());
		iasus.setDsusIderegistr(dsus.getDsusIderegistr());
		iasus.setIasusReferenciacomercial(referenciaComercial);
		iasus.setIasusNombreestablecimiento(santoSenia);
		iasusInforadicionalsuscripcionRepository.save(iasus);

		/*if (idActividadComercial != null && idActividadComercial >= 0) {
			dsus.setUniActsuscripc(idActividadComercial);
			dsusDetsuscripRepository.save(dsus);
		}*/
	}

	/**
	 * Información general que llena la interfaz para editar
	 */
	public EditAforoDTO getById(String numeroAforo) {
		//System.out.println("Bandera: 1");
		List<HashMap<String, Object>> listaSuscripcion= new ArrayList<HashMap<String,Object>>() ;
		Integer rutaMicroMacro=0;
		EditAforoDTO e = new EditAforoDTO();
		Aforo aforo = aforoRepository.findAforoByNumeroAforo(Long.parseLong(numeroAforo));
		DetalleAforo detalle = aforo.getDetallesAforo().get(0);
		DsusDetsuscrip dsus = detalle.getDsusIderegistr();//dsusDetsuscripRepository.findById(detalle.getDsusIderegistr())
		listaSuscripcion=serviceHomologacion.informacionSuscripcion(Math.toIntExact(dsus.getDsusIderegistr()));
		
		for(HashMap<String, Object> l : listaSuscripcion) {
			for(Entry<String, Object> o : l.entrySet()) {
				if(o.getKey().equalsIgnoreCase("rut_macroRuta") && o.getValue()!=null)rutaMicroMacro+=Integer.parseInt(o.getValue().toString());
			}
		}
		//** [JLMENDOZA] se agrega el campo para poder llevar las frecuencias **//
		e.setRutaMicroMacro(rutaMicroMacro);
		log.error("Capturando: "+rutaMicroMacro);
		
		/*listaSuscripcion.forEach(b->
		b.forEach((c,f)->log.error(c + " -- "+f)));*/
				//.orElse(new DsusDetsuscrip());
		TerTercero tercero = dsus.getTerIderegistro();//terTerceroRepository.findById(Optional.ofNullable(dsus.getTerIderegistro()).orElse(0L))
				//.orElse(new TerTercero());
		ProPropiedad pro = propiedadRepository.findById(dsus.getProIderegistro()).orElse(new ProPropiedad());
		Optional<UniUnidad> uniActividad = uniUnidadRepository.findById(Long.valueOf(detalle.getUniActsuscripc()));
		IasusInforadicionalsuscripcion iasus = iasusInforadicionalsuscripcionRepository
				.findInfoAdicionalSuscripcion(dsus.getDsusIderegistr()).stream().findFirst().orElse(null);

		/*e.setIdMunicipio(
				proyectosRepository.findMunicipioByDsus(dsus.getProIderegistro()).get(0).getProyectoIderegistro());*/
		e.setIdMunicipio(dsus.getUniMunicipio());

		Barrios barrio = barriosRepository.findBarriosByMunicipioAndBarrio(e.getIdMunicipio(),
				dsus.getUniBarrio().getBarrioIderegistro()).stream().findFirst()
				.orElse(new Barrios());

		e.setBarrio(barrio.getBarrioNom());
		e.setIdBarrio(barrio.getBarrioIderegistro());
		e.setEstado(aforo.getAfoEstado());
		e.setVigenciaDesde(DateUtil.dateToString(aforo.getAfoFechainicio()));
		e.setVigenciaHasta(DateUtil.dateToString(aforo.getAfoFechafinvegencia()));
		e.setFechaCreacion(DateUtil.dateToString(aforo.getAfoFecha()));
		e.setFechaActualizacion(DateUtil.dateToString(aforo.getAfoFechaActualizacion()));
		e.setObservaciones(aforo.getAfoObservaciones());
		e.setCodUsuario(dsus.getDsusPcodigo());
		e.setNombreUsuario(tercero.getTerNomcompleto());
		e.setDireccion(pro.getProDireccion());
		e.setActividadComercial(uniActividad.isPresent() ? uniActividad.get().getUniNombre1() : EMPTY);
		e.setIdActividadComercial(uniActividad.isPresent() ? uniActividad.get().getUniIderegistro() : 0);
		e.setSantoSenia(iasus != null ? iasus.getIasusNombreestablecimiento() : EMPTY);
		e.setReferenciaComercial(iasus != null ? iasus.getIasusReferenciacomercial() : EMPTY);
		e.setNumAforo(String.valueOf(aforo.getAfoIderegistro()));
		e.setSuscripcion(dsus.getDsusIderegistr().toString());
		e.setNombresApellidoTercero(tercero.getTerNomcompleto());
		e.setDocumentoTercero(tercero.getTerDocumento());

		Optional<UniUnidad> tipoGenerador = Optional.empty();
		if (maestroAforoVisitaServiceImpl.getUniTipoGeneradorByAforo(aforo.getAfoIderegistro()) != null) {
			tipoGenerador = uniUnidadRepository
					.findById(maestroAforoVisitaServiceImpl.getUniTipoGeneradorByAforo(aforo.getAfoIderegistro()));
		}
		e.setTipoGenerador(tipoGenerador.isPresent() ? tipoGenerador.get().getUniNombre1() : "En proceso de aforo");
		e.setIdTipoGenerador(tipoGenerador.isPresent() ? tipoGenerador.get().getUniIderegistro() : 0L);
		e.setFechaInicial(DateUtil.dateToString(aforo.getAfoFechainicio()));
		e.setFechaProrroga(DateUtil.dateToString(aforo.getAfoFechafinvegencia()));
		e.setNombreTipoAforo(aforo.getUniTipoaforo().getUnidad().getUniNombre1());
		e.setNombreConcepto(aforo.getUniComplemento().getUniNombre1());
		//System.out.println("Bandera: "+e.getActividadComercial());
		return e;
	}

	public List<SearchResponseDTO> searchAforos(SearchDTO searchDTO) {
		return bDToDTOUtil.mapAforosToListOfSearchResponseDTO(
				searchComponentServiceImpl.getAforosBusqueda(searchDTO, UtilConstantes.INDIVIDUAL));
	}

	public SearchResponseDTO searchSuscripcion(SearchDTO searchDTO) {

		if (StringUtils.isEmpty(searchDTO.getSuscripcion()))
			searchDTO.setSuscripcion(DEFAULT);
		if (StringUtils.isEmpty(searchDTO.getCodigoSub()))
			searchDTO.setCodigoSub(DEFAULT);
		if (StringUtils.isEmpty(searchDTO.getRadicadoPqrs()))
			searchDTO.setRadicadoPqrs(DEFAULT);

		CredentialsDTO c = authenticationFacade.getCredentials();
		DsusDetsuscrip dsus = dsusDetsuscripRepository.findByIdOrCodigoWithCredentials(c.getEstempresa(),
				Long.valueOf(searchDTO.getSuscripcion()), searchDTO.getCodigoSub(), searchDTO.getRadicadoPqrs())
				.stream().findFirst().orElse(null);
		if (dsus != null) {
			String cmpDireccionName = propiedadRepository.getCmpDireccionName(dsus.getProIderegistro());
			System.out.println("SISTEMA ->"+dsus.getDsusPcodigo()+ " --- "+cmpDireccionName);
			SearchResponseDTO searchResponseDTO = this.transformDSus(searchDTO, c, dsus);
			searchResponseDTO.setCmpDireccion(cmpDireccionName);
			return searchResponseDTO;
		}else {
			return new SearchResponseDTO();
		}
	}
	
	//JLMENDOZA
	public Optional<List<SearchResponseDTO>> searchSuscripcionPorComplemento(SearchDTO searchDTO) {
		
		if (StringUtils.isEmpty(searchDTO.getBarrio()))
			searchDTO.setSuscripcion(DEFAULT);
		if (StringUtils.isEmpty(searchDTO.getComplemento()))
			searchDTO.setCodigoSub(DEFAULT);

		CredentialsDTO c = authenticationFacade.getCredentials();
		
		List<DsusDetsuscrip> listDsus=dsusDetsuscripRepository.findSuscripcionesActivasByComplemento(Long.parseLong(searchDTO.getComplemento()),c.getEstempresa(),
				Long.parseLong(searchDTO.getBarrio()));

		List<SearchResponseDTO> listDto = listDsus.stream().map(dsus-> this.transformDSus(searchDTO, c, dsus))
				.collect(Collectors.toList());
		
		Optional<List<SearchResponseDTO>>optListDto = Optional.of(listDto);
		
		listDto.stream().forEach(f->{
			f.setCmpDireccion(propiedadRepository.getCmpDireccionName(f.getIdPropiedad()));
		});
		
		return optListDto;
	}

	private List<HrrHorrecoleccion> filtroMacroRuta(List<HrrHorrecoleccion> lista,Long macroRuta,String microRuta) {
		return lista.stream()
				.filter(h-> h.getRureIderegistro() == macroRuta)
				.filter(h-> "A".equalsIgnoreCase(h.getHrrSwtact()))
				.filter(h-> h.getMicroruta().equalsIgnoreCase(microRuta))
				.collect(Collectors.toList());
	}
	
	private SearchResponseDTO transformDSus(SearchDTO searchDTO, CredentialsDTO c, DsusDetsuscrip dsus) {
		String nombreTercero = "-";
		String nombreBarrio = "-";
		String direccion = "-";
		String tipoUso = "-";
		List<HrrHorrecoleccion> frecuenciaRecoleccion = new ArrayList<>();
		Long macroRutaId= 0L;
		Integer microRutaId = 0; 
		List<Object []> listamacroRuta=rureRepository.buscarRutreRure(dsus.getDsusIderegistr().intValue(),UtilConstantes.MICRORUTAID); //SELECCION MACRORUTA RECOL
		if(!listamacroRuta.isEmpty()) {
				Object [] macroRuta = listamacroRuta.get(0);
				macroRutaId = Long.parseLong(((Integer)macroRuta[0]).toString());
				microRutaId = ((BigInteger)macroRuta[1]).intValue();
		}
		IasusInforadicionalsuscripcion iasus = new IasusInforadicionalsuscripcion();
		Optional<UniUnidad> uniUnidad = uniUnidadRepository.findById(dsus.getUniTipusosuscr());
		Optional<TerTercero> terTercero = Optional.of(dsus.getTerIderegistro());//terTerceroRepository
				//.findById(Optional.ofNullable(dsus.getTerIderegistro()).orElse(0L));
		Optional<Barrios> barrio = Optional.of(dsus.getUniBarrio());
		/*Optional<ProPropiedad> proPropiedad = propiedadRepository
				.findById(Long.valueOf(Optional.ofNullable(dsus.getProIderegistro()).orElse(0L).toString()));
		 */
        //ProPropiedad proPropiedad = propiedadRepository.getPropiedad(dsus.getProIderegistro()).get(0);
		String proDireccion = propiedadRepository.getPropDireccion(dsus.getProIderegistro());
		Optional<List<HrrHorrecoleccion>> hrrHor = Optional.of(hrrHorrecoleccionRepository.findFrecuenciaRecoleccion());	 
		Optional<UniUnidad> uniActividad = dsus.getUniActsuscripc() == null ? Optional.empty() : uniUnidadRepository.findById(dsus.getUniActsuscripc());
		
		if (terTercero.isPresent()) {
			nombreTercero = terTercero.get().getTerNomcompleto();

			//iasus = iasusInforadicionalsuscripcionRepository.findInfoAdicionalSuscripcion(terTercero.get().getTerIderegistro())
			iasus = iasusInforadicionalsuscripcionRepository.findInfoAdicionalSuscripcion(dsus.getDsusIderegistr())
					.stream().findFirst().orElse(new IasusInforadicionalsuscripcion());
		}
		if (barrio.isPresent())
			nombreBarrio = barrio.get().getBarrioNom();
		if (proDireccion != null)
			//direccion = proPropiedad.getProDireccion();
			direccion = proDireccion;
		if (uniUnidad.isPresent())
			tipoUso = uniUnidad.get().getUniNombre1();
		if (hrrHor.isPresent()) frecuenciaRecoleccion = this.filtroMacroRuta(hrrHor.get(), macroRutaId, microRutaId.toString());
		
		SearchResponseDTO sr = new SearchResponseDTO();
		sr.setCodSuscripcion(dsus.getDsusPcodigo());
		sr.setIdSuscripcion(dsus.getDsusIderegistr());
		sr.setIdEmpresa(c.getEstempresa());
		sr.setIdUsuario(c.getUsuprgunid());
		//sr.setIdPropiedad(proPropiedad.isPresent() ? proPropiedad.get().getProIderegistro() : 0L);
		sr.setIdPropiedad(dsus.getProIderegistro() != null ? dsus.getProIderegistro() : 0L);
		sr.setIdTercero(terTercero.isPresent() ? terTercero.get().getTerIderegistro() : 0L);
		sr.setNumPqr(!DEFAULT.equals(searchDTO.getRadicadoPqrs()) ? searchDTO.getRadicadoPqrs()
				: this.getRadicadoPqr(searchDTO, c));
		sr.setFrecuenciaRecoleccion(frecuenciaRecoleccion);
		sr.setReferenciaComercial(iasus.getIasusReferenciacomercial());
		sr.setNombreEstablecimiento(iasus.getIasusNombreestablecimiento());
		sr.setIdIasus(iasus.getIasusIderegistro());
		sr.setNombresYapellidos(nombreTercero);
		sr.setDireccion(direccion);
		sr.setTipoUso(tipoUso);
		sr.setActividadComercial(uniActividad.isPresent() ? uniActividad.get().getUniNombre1() : EMPTY);
		sr.setBarrioUsuario(nombreBarrio);
		sr.setBarrioUsuarioCodigo(dsus.getUniBarrio().getBarrioIderegistro());
		sr.setRureIderegistro(macroRutaId==null ? 0 : Integer.parseInt(macroRutaId.toString()));
		sr.setUniActSuscripc(dsus.getUniActsuscripc());
		sr.setNombreConvenio(dsusDetsuscripRepository.getConvenioBySuscriptor(dsus.getSusIderegistro()));
		sr.setEstrato(dsus.getProCatestrato().longValue());
		sr.setEstado(dsus.getDsusEstado());
		return sr;
	}

	private String getRadicadoPqr(SearchDTO searchDTO, CredentialsDTO c) {
		Reclamos reclamo = reclamosRepository
				.findByIdOrCodigoWithCredentials(c.getEstempresa(), c.getUsuprgunid(),
						Long.valueOf(searchDTO.getSuscripcion()), searchDTO.getCodigoSub(), searchDTO.getRadicadoPqrs())
				.stream().findFirst().orElse(null);
		return reclamo != null ? reclamo.getReclamoNumpqr() : "";
	}

	public SearchResponseDTO searchAforoPadre(SearchDTO searchDTO) {

		if (StringUtils.isEmpty(searchDTO.getSuscripcion()))
			searchDTO.setSuscripcion(DEFAULT);
		if (StringUtils.isEmpty(searchDTO.getCodigoSub()))
			searchDTO.setCodigoSub(DEFAULT);
		if (StringUtils.isEmpty(searchDTO.getRadicadoPqrs()))
			searchDTO.setRadicadoPqrs(DEFAULT);

		CredentialsDTO c = authenticationFacade.getCredentials();
		DsusDetsuscrip dsus = dsusDetsuscripRepository
				.buscarAforoPadreHistorico(c.getEstempresa(), Long.valueOf(searchDTO.getNumAforoPadre())).stream().findFirst()
				.orElse(null);
		if (dsus != null) {
			return this.transformDSus(searchDTO, c, dsus);
		} else {
			return new SearchResponseDTO();
		}
	}

	public List<SearchResponseDTO> searchAforosVisitas(SearchDTO searchDTO) {
		return bDToDTOUtil.mapAforosToListOfSearchResponseDTO(
				searchComponentServiceImpl.getAforosBusquedaVisitas(searchDTO, UtilConstantes.INDIVIDUAL));
	}

	public Page<Aforo> getAforosPage(Pageable pageable,Optional<String> search) {
		List<String> estados = new ArrayList<>();
		estados.add(UtilConstantes.ESTADO_EN_PROCESO);
		estados.add(UtilConstantes.ESTADO_PRE_LIQUIDACION);
		estados.add(UtilConstantes.ERROR_LIQUIDACION);

		try {
			Long id = Long.parseLong(search.orElse(""));
			return this.aforoRepository.findByAfoIderegistroAndAfoEstadoIn(id, estados, pageable);
		}
		catch (Exception e) {
			// TODO: handle exception
		}

		return this.aforoRepository.findByAfoEstadoIn(estados, pageable);
	}

	public List<HashMap<String, Object>> fechaFinalAforo(Integer tafoIderegistro,Integer rureIderegistro, String fechaInicial)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: aforoRepository.fechaFinalAforo(tafoIderegistro, rureIderegistro, fechaInicial))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("fechaFinal", tmp2[0]);
    		total.add(tmp1);
    	}
    	return total;
	}


	public AforoPreLiquidacionResponse preLiquidarAforo(Long aforoId) {
		AforoPreLiquidacionResponse response = new AforoPreLiquidacionResponse();
		Double volumenMedio = null;

		try {
			Optional<Aforo> optAforo = this.aforoRepository.findById(aforoId);

			if(!optAforo.isPresent()) {
				response.setValido(false);
				response.setMensaje("Aforo no encontrado con ID: " + aforoId);
				response.setAforo(aforoId);
				return response;
			}

			Aforo aforo = optAforo.get();

				if(aforo.getMaestrosAforosVisitasActivo().isEmpty()) {
					response.setAforo(aforoId);
					response.setValido(false);
					aforo.setAfoEstado(UtilConstantes.ESTADO_EN_PROCESO);
					response.setMensaje("Error: No contiene Maestro de Visitas");
					log.error("Aforo {} no contiene Maestro de Visitas", aforoId);
					return response;
				}

				MaestroAforoVisita maestro = aforo.getMaestrosAforosVisitasActivo().stream().findFirst().get();
				Long visitasTramitadas = maestro.getDetallesMaestrosVisitas().stream()
						.filter(d->d.getDmafEstado().equals("T"))
						.count();

				if(maestro.getMafvMinimoVisitas().compareTo(visitasTramitadas)<=0) {
					log.info("Aforo {}: Las visitas mínimas han sido tramitadas", aforoId);
					response.setValido(true);
						response.setMensaje("Las visitas mínimas han sido tramitadas");
				} else {
					log.warn("Aforo {}: No se han tramitado las visitas mínimas para liquidar", aforoId);
					response.setValido(false);
					aforo.setAfoEstado(UtilConstantes.ESTADO_EN_PROCESO);
					response.setMensaje("No se han tramitado las visitas mínimas para liquidar el aforo.");
					return response;
				}

				response.setMinimoVisitas(maestro.getMafvMinimoVisitas());
				response.setVisitasTramitadas(visitasTramitadas);
				response.setMaestroVisitas(maestroMapper.toResource(maestro));
				response.setTipoAforo(aforo.getUniClasesuscripcionaforo().getUniIderegistro());
				
				Long semanas = 0L;
				
				if (aforo.getAfoFrecuenciaRecoleccion() != 0){
					semanas = (visitasTramitadas / aforo.getAfoFrecuenciaRecoleccion()) ;	
				}else {
					log.warn("Aforo {}: No se Existe frecuencia para el aforo ", aforoId);
					response.setValido(false);
					aforo.setAfoEstado(UtilConstantes.ERROR_LIQUIDACION);
					response.setMensaje("No se Existe frecuencia para liquidar el aforo.");
					return response;
				}	
				

				Double totalVolumenVisitas = maestro.getDetallesMaestrosVisitas().stream()
						.reduce(0D, (sum,item)->sum + item.getDetalleConceptosList().stream()
								.reduce(0D,(subtotal,deta)->subtotal + deta.getDcvaVolumenaforo(),Double::sum), Double::sum);

				Double totalPesoVisitas = 0D;
				Double totalPromedioToneladas = 0D;

				if(aforo.getMafvFactor()==0) {
					volumenMedio = totalVolumenVisitas;
				} else {
					
					volumenMedio = (totalVolumenVisitas*aforo.getMafvFactor())/(maestro.getMafvMinimoVisitas()/aforo.getAfoFrecuenciaRecoleccion());
					
					if(aforo.getAforoMultiusuario()!=null) {
						//volumenMedio = totalVolumenVisitas;
						totalPesoVisitas = maestro.getDetallesMaestrosVisitas().stream()
						        .mapToDouble(item -> item.getDetalleConceptosList().stream()
						                .mapToDouble(deta -> deta.getDcvaPesoaforo())
						                .sum())
						        .sum() / UtilConstantes.CONVERTPESO_A_TONELADA; 
								
						totalPromedioToneladas = ((totalPesoVisitas * aforo.getMafvFactor()) / semanas);
					} else {
						if(aforo.getAfoFrecuenciaRecoleccion()==0 || maestro.getMafvMinimoVisitas()==0) {
							response.setValido(false);
							aforo.setAfoEstado(UtilConstantes.ESTADO_EN_PROCESO);
							response.setMensaje("Error en cálculo de volumen medio, verifique frecuencia de recolección y mínimo de visitas.");
							return response;
						}
						
					}
				}

				response.setTotalVisitasConsolidado(totalVolumenVisitas);
				response.setVolumenMedio(volumenMedio);
				response.setPesoMultiusuario(totalPromedioToneladas);

				List<GenGenerador> generadores = this.generadorService.findByVolumenGeneradoAndClaseAforo(
						volumenMedio, aforo.getUniTipoaforo().getUniClaseAforo().getUniIderegistro());

				List<DetalleAforoInfoDTO> detalles = detalleAforoService.findDetallesAforo(aforoId).stream()
						.map(detalleAforoMapper::toResource)
						.collect(Collectors.toList());

				response.setDetalleAforo(detalles);
				response.setAforo(aforoId);
				response.setGeneradores(generadores.stream().map(generadorMapper::toResource).collect(Collectors.toList()));
				aforo.setAfoEstado(UtilConstantes.ESTADO_PRE_LIQUIDACION);
				this.aforoRepository.save(aforo);
				return response;

		} catch (Exception e) {
			log.error("Error al pre-liquidar aforo {}: {}", aforoId, e.getMessage(), e);
			response.setValido(false);
			response.setMensaje("Error al procesar el aforo: " + e.getMessage());
			response.setAforo(aforoId);
			return response;
		}
	}

	public Long liquidarAforo(Long aforoId,Long generadorId) {
		AforoPreLiquidacionResponse preliquidacion = this.preLiquidarAforo(aforoId);
		org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);
		if(preliquidacion.getValido()) {
			GenGenerador generador = generadorService.findById(generadorId);
			
			if(generador!=null) {
				Aforo aforo = aforoRepository.findById(aforoId).get();
				aforo.setUniTipogenerador(generadorId);
				aforoRepository.save(aforo);
				;
				List<DetalleAforo> detaList = detalleAforoService.findDetallesAforo(aforoId);
				detaList.stream().forEach(d->{
					List<CosuConsuscrip> cosuList = cosuRepo.getAllByIdDsus(Long.parseLong(d.getDsusIderegistr().getDsusIderegistr().toString()));
					if(cosuList.size() > 0 ) {
						cosuList.stream().forEach(c->{
							if(c.getCosuEstado().equalsIgnoreCase("A") && c.getUniConcepto().compareTo(hya_parametros.getLong("concepto_marcado_aforado"))==0) {
								cosuRepo.deleteByDsusIderegistro(Long.parseLong(d.getDsusIderegistr().getDsusIderegistr().toString()));
							}
						});
					}
					CosuConsuscrip cosu = new CosuConsuscrip();
					cosu.setCantidad(1);
					cosu.setVlrTotal(1);
					cosu.setVlrUnitario(1);
					cosu.setCosuEstado("A");
					cosu.setCosuObservacion(aforo.getAfoObservaciones());
					cosu.setDsusDetsuscrip(d.getDsusIderegistr());
					cosu.setEmpIdRegistro(Long.parseLong(d.getDsusIderegistr().getEmpIderegistro().toString()));
					cosu.setFecInicio(new Date());
					cosu.setFecFinal(aforo.getAfoFechafinaforo());
					cosu.setUniLiquidacion(d.getDsusIderegistr().getUniLiquidacion());
					cosu.setUniConcepto(CONCEP_MARCADO_AFORADO);
					cosu.setUsuIderegistro(d.getUsuIderegistro().intValue());
					cosuRepo.save(cosu);
					
					Optional<UniUnidad> un = uniUnidadRepository.findById(generadorId);
					Integer liq = 0;
					Integer procatest = 0;
					Integer uni_tipusosuscr=0;
					if(un.isPresent()) {
						UniUnidad un2= un.get();
						ObjectMapper ob = new ObjectMapper();
						try {
							Map<String,Object>map = ob.readValue(un2.getUniPropiedad(), new TypeReference<Map<String, Object>>(){});
							for (Map.Entry<String, Object> entry : map.entrySet()) {
								System.out.println("Key: " + entry.getKey() + ", Value: " + entry.getValue());
								if(entry.getKey().equalsIgnoreCase("uni_liquidacion")) {
									liq=(Integer)entry.getValue();
								}
								if(entry.getKey().equalsIgnoreCase("pro_catestrato")) {
									procatest=(Integer)entry.getValue();
								}
								if(entry.getKey().equalsIgnoreCase("uni_ideregistro")) {
									uni_tipusosuscr=(Integer)entry.getValue();
								}
				            }							
						}catch(IOException e) {
							e.printStackTrace();
						}
					}
					
					Optional<DsusDetsuscrip> dsus = dsusDetsuscripRepository.findById(d.getDsusIderegistr().getDsusIderegistr());
					if(dsus.isPresent()) {
						DsusDetsuscrip ds = dsus.get();
						try {
							ds.setUniTipusosuscr(Long.parseLong(uni_tipusosuscr.toString()));
							ds.setProCatestrato(procatest);
							ds.setUniLiquidacion(Long.parseLong(liq.toString()));							
							dsusDetsuscripRepository.saveAndFlush(ds);							
						}catch(Exception e) {
							e.printStackTrace();
						}					
					}				
				});	

				
				Double tafna = generador.getGenFactorEquivalencia() * preliquidacion.getVolumenMedio();
				Long resultado = aforoRepository.fnLiquidarAforo(aforoId,preliquidacion.getMaestroVisitas().getMafvIderegistro(),generador.getGenFactorEquivalencia(),tafna,preliquidacion.getVolumenMedio());
			
				return resultado;
			}
		}

		return 0L;
	}
	//JLMENDOZA
	@org.springframework.transaction.annotation.Transactional
	public Long liquidarAforoGeneral() {
		
		List<Aforo> listaAforo = aforoRepository.findAforoByEstado(UtilConstantes.ESTADO_PRE_LIQUIDACION);
		org.json.JSONObject _parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.AFOROS_VARIOS, UtilConstantes.BIOAGRICOLA);
		Long uniClaseAforo = _parametros.getLong("uni_clase_suscripcion_multiusuario");
		
		org.json.JSONObject _parametrosLiquidacionAforos = _parParametroService.getJSONObjectParameter(UtilConstantes.UNIT_HOMOLOGATIONS, UtilConstantes.BIOAGRICOLA);
		JSONObject tipoLIquidacion = _parametrosLiquidacionAforos.getJSONObject("liquidacion_condicion_suscripcion");
		JSONObject tipoLIquidacion_adicional = _parametrosLiquidacionAforos.getJSONObject("conceptos_liquidacion_adicional_aforo");
		JSONArray listaLiquidacionAforado = tipoLIquidacion.getJSONArray("aforado");
		JSONArray listaLiquidacionAforado_conceptos = tipoLIquidacion_adicional.getJSONArray(UtilConstantes.INDIVIDUAL_CONST);
		
		AtomicInteger contador = new AtomicInteger(0);
		
		listaAforo.stream()
		.filter(a -> !a.getUniClasesuscripcionaforo().getUniIderegistro().equals(uniClaseAforo))		
		.forEach(a -> {
			AforoPreLiquidacionResponse preliquidacion = this.preLiquidarAforo(a.getAfoIderegistro());
			if(preliquidacion.getValido()) {	
				Double factor = 0D ;
				List<GenGenerador> listaGenerador = generadorService.listaGeneradorByVolumen(preliquidacion.getVolumenMedio());
				if(!listaGenerador.isEmpty()) {
					TafoTipoAforo taFo = tafoService.findById(a.getUniTipoaforo().getTafoIderegistro());
					factor = preliquidacion.getVolumenMedio() >= 1 ? 0.25 : 0.2 ;
					Double tafna = factor * preliquidacion.getVolumenMedio();
					String tipoGeneradorCRO = generadorService.tipoGeneradorOficialComercialResidencial(preliquidacion.getDetalleAforo().get(0).getDsusIderegistr());
					
					a.setUniTipogenerador(UtilConstantes.COMERCIAL);
					if(tipoGeneradorCRO.equals("OFICIAL")) {
						if (factor == 0.25) a.setUniTipogenerador(UtilConstantes.OFIGRANGENERADOR);
						a.setUniTipogenerador(UtilConstantes.OFIPEQGENERADOR);
					}

					Integer Procatest = !tipoGeneradorCRO.equals("OFICIAL") ? factor == 0.25 ? 9 : 8 : 7;
					aforoRepository.save(a);
					
					List<DetalleAforo> detaList = detalleAforoService.findDetallesAforo(a.getAfoIderegistro());
					detaList.stream().forEach(d -> {
					List<CosuConsuscrip> listaCosu = cosuRepo.getAllByIdDsusConcepto(d.getDsusIderegistr().getDsusIderegistr(),
								new ArrayList<Long>(java.util.Arrays.asList((_parametros.getLong("concepto_marcado_aforado")))));
						if(!listaCosu.isEmpty()) {
							listaCosu.stream()
							.filter(c -> "A".equalsIgnoreCase(c.getCosuEstado()))
							.forEach(c -> {
								int elimi = cosuRepo.deleteByDsusIderegistroAndConcepto(c.getDsusDetsuscrip().getDsusIderegistr(), 
									Integer.parseInt(((Long)_parametros.getLong("concepto_marcado_aforado")).toString()));
								log.error("COSU ELIMINADOS "+elimi);
							});
							
						}
						
						log.error("AFORO-> "+a.getAfoIderegistro());
						CosuConsuscrip cosu = new CosuConsuscrip();
						cosu.setCantidad(1);
						cosu.setVlrTotal(1);
						cosu.setVlrUnitario(1);
						cosu.setCosuEstado("A");
						cosu.setCosuObservacion(a.getAfoObservaciones());
						cosu.setDsusDetsuscrip(d.getDsusIderegistr());
						cosu.setEmpIdRegistro(317L);
						cosu.setFecInicio(new Date());
						cosu.setFecFinal(a.getAfoFechafinaforo());
						cosu.setUniLiquidacion(d.getDsusIderegistr().getUniLiquidacion());
						cosu.setUniConcepto(CONCEP_MARCADO_AFORADO);
						cosu.setUsuIderegistro(d.getUsuIderegistro().intValue());
						cosuRepo.save(cosu);
						
						Integer Liquidacion = 0;						
						Integer TipoUso = Integer.parseInt(a.getUniTipogenerador().toString());						
						List<JSONObject> objetos = IntStream.range(0, listaLiquidacionAforado.length())
								.mapToObj(listaLiquidacionAforado::getJSONObject)
								.collect(Collectors.toList());
						
						 List<Integer> listLiquidacion =  objetos.stream()
								.filter(obj -> TipoUso.equals(obj.optInt("uni_tipusosuscr")))
								.map(obj -> obj.optInt("liq_aforado"))
								.collect(Collectors.toList());
						 
						 if(!listLiquidacion.isEmpty()) {
							 Liquidacion = listLiquidacion.get(0);
						 }
						 
						 Optional<DsusDetsuscrip> dsus = dsusDetsuscripRepository.findById(d.getDsusIderegistr().getDsusIderegistr());
							if(dsus.isPresent()) {
								DsusDetsuscrip ds = dsus.get();
								try {
									ds.setUniTipusosuscr(a.getUniTipogenerador());
									ds.setProCatestrato(Procatest);
									ds.setUniLiquidacion(Long.parseLong(Liquidacion.toString()));							
									dsusDetsuscripRepository.saveAndFlush(ds);							
								}catch(Exception e) {
									e.printStackTrace();
								}					
							};					
					});	
					try {
						Long resultado = aforoRepository.fnLiquidarAforo(a.getAfoIderegistro(),preliquidacion.getMaestroVisitas().getMafvIderegistro(),factor,tafna,preliquidacion.getVolumenMedio());
						
						if(taFo.getTafoAforoPadre()) {
							
							Map<Integer,BigDecimal> conceptosDetalle = new HashMap<>();
							Map<String, BigDecimal> listaConceptos = IntStream.range(0,listaLiquidacionAforado_conceptos.length())
									.mapToObj(listaLiquidacionAforado_conceptos::getJSONObject)
									.map(con->{
										ConConcepto c = conceptoService.findById(con.getLong("uni_concepto"));
										System.out.println("CONCEPTO-> " +c.getConNombre());
										conceptosDetalle.put(con.getInt("uni_concepto"), new BigDecimal(c.getConValor().toString()));										
										return c;
										})
									.filter(c -> c != null && c.getConAlias() != null && c.getConValor() != null)
							        .collect(Collectors.toMap(
							                ConConcepto::getConAlias,                                   
							                c -> new BigDecimal(c.getConValor().toString()),           
							                (v1, v2) -> v1 ));
							
							String formula = "VF = N° Total Visitas * (0.222 * SMMLV) ";
							Long visitas = preliquidacion.getVisitasTramitadas();
							
							BigDecimal valorTotal = (listaConceptos.get("%CCAfoExt").multiply(listaConceptos.get("SMMLV")));
							BigDecimal valorVisita = valorTotal.multiply(new BigDecimal(visitas.toString()));
							
							
							LiafocoLiquidacionAforoConceptosAdicional liAfo = new LiafocoLiquidacionAforoConceptosAdicional();
							liAfo.setHafoIderegistro(a.getAfoIderegistro());
							liAfo.setLiafocoCobro(true);
							liAfo.setLiafocoFechaRegistro(LocalDateTime.now());
							liAfo.setLiafocoIndividual(valorVisita);
							liAfo.setLiafocoUniClasesuscripcionaforo(uniClaseAforo);
							liAfo.setLiafocoUnidadesIndependientes(1);
							liAfo.setLiafocoValortotal(valorTotal);
							liAfo.setUsuIderegistro(a.getUsuIderegistro());
							liAfo.setLiafocoVisitas(visitas);
							liAfo.setEmpIderegistro(UtilConstantes.BIOAGRICOLA);
							
							 liaforepoRepository.save(liAfo);
							 
							 /*
							  * detalle de la liquidacion 
							  * 
							  */			
							conceptosDetalle.forEach((concepto, valor) -> {
								DlihamDetliqaforomultiusuario dliq = new DlihamDetliqaforomultiusuario();	
								dliq.setLiafocoIderegistro(liAfo.getLiafocoIderegistro());
								dliq.setUniConcepto(concepto);
								dliq.setConValor(valor);
								dliqrepoRepository.save(dliq);
							});	
							
						}			
						
						contador.getAndIncrement();
					}catch(Exception e) {
						System.err.println("Error al ejecutar la función SQL: " + e.getMessage());
					}					
				}			
			}			
		});		
		
		return (long)contador.get();
	}

	public Long liquidarAforoMultiusuario(Long aforoId,Long generadorId,Double tafna) {
		AforoPreLiquidacionResponse preliquidacion = this.preLiquidarAforo(aforoId);
		if(preliquidacion.getValido()) {
			GenGenerador generador = generadorService.findById(generadorId);
			if(generador!=null) {
				Aforo aforo = aforoRepository.findById(aforoId).get();
				aforo.setUniTipogenerador(generadorId);
				aforoRepository.save(aforo);

				Formatter formato = new Formatter();
				AforoMultiusuario afoMult= aforo.getAforoMultiusuario();
				afoMult.setCodigoBase("5001"+formato.format("%04d", aforoId.intValue()).toString());
				aforoMultiRepo.save(afoMult);

				Long resultado = aforoRepository.fnLiquidarAforo(aforoId,preliquidacion.getMaestroVisitas().getMafvIderegistro(),generador.getGenFactorEquivalencia(),tafna,preliquidacion.getVolumenMedio());
				return resultado;
			}
		}

		return 0L;
	}

	public Long liquidarAforoMultiusuarioGeneral() {

		org.json.JSONObject _parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.AFOROS_VARIOS, UtilConstantes.BIOAGRICOLA);
		Long uniClaseAforo = _parametros.getLong("uni_clase_suscripcion_multiusuario");

		org.json.JSONObject _parametrosLiquidacionAforos = _parParametroService.getJSONObjectParameter(UtilConstantes.UNIT_HOMOLOGATIONS, UtilConstantes.BIOAGRICOLA);
		JSONObject tipoLIquidacion = _parametrosLiquidacionAforos.getJSONObject("liquidacion_condicion_suscripcion");
		JSONObject tipoLIquidacion_adicional = _parametrosLiquidacionAforos.getJSONObject("conceptos_liquidacion_adicional_aforo");
		
		JSONArray listaLiquidacionAforado = tipoLIquidacion.getJSONArray("aforado");
		JSONArray listaLiquidacionAforado_conceptos = tipoLIquidacion_adicional.getJSONArray(UtilConstantes.MULTIUSUARIO_CONST);
		Optional<UniUnidad> unidad = uniUnidadRepository.findById(uniClaseAforo);

		List<Aforo> listaAforo = aforoRepository.findAforoMultiusuarioByEstado(UtilConstantes.ESTADO_PRE_LIQUIDACION,unidad.get());
		if (listaAforo.isEmpty()) return 0L;

		AtomicLong contador = new AtomicLong(0);
		listaAforo.stream()
		.forEach(aforo -> {

		AforoPreLiquidacionResponse preliquidacion = this.preLiquidarAforo(aforo.getAfoIderegistro());
		if (preliquidacion.getValido()) {
			Double tonAfo = preliquidacion.getPesoMultiusuario();
			aforo.setUniTipogenerador(UtilConstantes.RESIDENCIAL);
			List<DetalleAforo> dAforo = detalleAforoService.findDetallesAforo(aforo.getAfoIderegistro());
			Integer cantidad = dAforo.size();
			boolean valTipoUso = dAforo.stream().anyMatch(d -> d.getDsusIderegistr().getUniTipusosuscr().equals(UtilConstantes.RESIDENCIAL));
			if(!valTipoUso)aforo.setUniTipogenerador(UtilConstantes.COMERCIAL);

			//Liquidacion de Suscripciones ->

			dAforo.stream().forEach(d -> {
		List<CosuConsuscrip> listaCosu = cosuRepo.getAllByIdDsusConcepto(d.getDsusIderegistr().getDsusIderegistr(),
						new ArrayList<Long>(java.util.Arrays.asList((_parametros.getLong("concepto_marcado_aforado")))));
				if(!listaCosu.isEmpty()) {
					listaCosu.stream()
					.filter(c -> "A".equalsIgnoreCase(c.getCosuEstado()))
					.forEach(c -> cosuRepo.deleteByDsusIderegistroAndConcepto(c.getDsusDetsuscrip().getDsusIderegistr(),
							Integer.parseInt(((Long)_parametros.getLong("concepto_marcado_aforado")).toString())));

				}

				CosuConsuscrip cosu = new CosuConsuscrip();
				cosu.setCantidad(1);
				cosu.setVlrTotal(1);
				cosu.setVlrUnitario(1);
				cosu.setCosuEstado("A");
				cosu.setCosuObservacion(aforo.getAfoObservaciones());
				cosu.setDsusDetsuscrip(d.getDsusIderegistr());
				cosu.setEmpIdRegistro(Long.parseLong(d.getDsusIderegistr().getEmpIderegistro().toString()));
				cosu.setFecInicio(new Date());
				cosu.setFecFinal(aforo.getAfoFechafinaforo());
				cosu.setUniLiquidacion(d.getDsusIderegistr().getUniLiquidacion());
				cosu.setUniConcepto(CONCEP_MARCADO_AFORADO);
				cosu.setUsuIderegistro(d.getUsuIderegistro().intValue());
				cosuRepo.save(cosu);

				Double participacion = Double.parseDouble(d.getDafoMultiusuporcentaje());
				Double tonDafoSuscripcion = (tonAfo * participacion) / 100D;
				Integer Liquidacion = 0;
				Integer TipoUso = Integer.parseInt(aforo.getUniTipogenerador().toString());

				List<JSONObject> objetos = IntStream.range(0, listaLiquidacionAforado.length())
						.mapToObj(listaLiquidacionAforado::getJSONObject)
						.collect(Collectors.toList());

				List<Integer> listLiquidacion =  objetos.stream()
						.filter(obj -> TipoUso.equals(obj.optInt("uni_tipusosuscr")))
						.map(obj -> obj.optInt("liq_aforado"))
						.collect(Collectors.toList());

				 if(!listLiquidacion.isEmpty()) {
					 Liquidacion = listLiquidacion.get(0);
				 }

				Optional<DsusDetsuscrip> dsus = dsusDetsuscripRepository.findById(d.getDsusIderegistr().getDsusIderegistr());
				if(dsus.isPresent()) {
					DsusDetsuscrip ds = dsus.get();
					Integer Procatest = aforo.getUniTipogenerador().equals(UtilConstantes.RESIDENCIAL) ? ds.getProCatestrato() :
						aforo.getUniTipogenerador().equals(UtilConstantes.COMERCIAL) ?
						tonDafoSuscripcion >= 0.25 ? 9 : 8 : 7;

					ds.setUniTipusosuscr(aforo.getUniTipogenerador());
					ds.setProCatestrato(Procatest);
					ds.setUniLiquidacion(Long.parseLong(Liquidacion.toString()));
					dsusDetsuscripRepository.saveAndFlush(ds);

				};

				if(d.getUniActsuscripc() == null) d.setUniActsuscripc(UtilConstantes.VIVIENDA);
				contador.getAndIncrement();
			});

			detalleAforoService.SaveAllListaAforos(dAforo);

			Formatter formato = new Formatter();
			AforoMultiusuario afoMult= aforo.getAforoMultiusuario();
			afoMult.setCodigoBase("5001"+formato.format("%04d", aforo.getAfoIderegistro()));
			aforoMultiRepo.save(afoMult);

			Long resultado = aforoRepository.fnLiquidarAforoMultiusuario(aforo.getAfoIderegistro(),preliquidacion.getMaestroVisitas().getMafvIderegistro(),tonAfo,preliquidacion.getVolumenMedio());
					
			Map<Integer,BigDecimal> conceptosDetalle = new HashMap<>();
			Map<String, BigDecimal> listaConceptos = IntStream.range(0,listaLiquidacionAforado_conceptos.length())
					.mapToObj(listaLiquidacionAforado_conceptos::getJSONObject)
					.map(con->{
						ConConcepto c = conceptoService.findById(con.getLong("uni_concepto"));
						System.out.println("CONCEPTO-> " +c.getConNombre());
						conceptosDetalle.put(con.getInt("uni_concepto"), new BigDecimal(c.getConValor().toString()));										
						return c;
						})
					.filter(c -> c != null && c.getConAlias() != null && c.getConValor() != null)
			        .collect(Collectors.toMap(
			                ConConcepto::getConAlias,                                   
			                c -> new BigDecimal(c.getConValor().toString()),           
			                (v1, v2) -> v1 ));
			
			String formula = "VF = 0.3387 * SM + 0.008 * SM * (UI-10) ";
			
			BigDecimal valorTotal = (listaConceptos.get("%FCCFVAIM").multiply(listaConceptos.get("SMMLV")))
											.add(
											(listaConceptos.get("%FCCVVAIM").multiply(listaConceptos.get("SMMLV")))
											.multiply(BigDecimal.valueOf(cantidad < 10 ? 10 : cantidad))
											) ;			
			BigDecimal valorIndividual = valorTotal.divide(BigDecimal.valueOf(cantidad));
			
			LiafocoLiquidacionAforoConceptosAdicional liAfo = new LiafocoLiquidacionAforoConceptosAdicional();
			liAfo.setHafoIderegistro(aforo.getAfoIderegistro());
			liAfo.setLiafocoCobro(true);
			liAfo.setLiafocoFechaRegistro(LocalDateTime.now());
			liAfo.setLiafocoIndividual(valorIndividual);
			liAfo.setLiafocoUniClasesuscripcionaforo(uniClaseAforo);
			liAfo.setLiafocoUnidadesIndependientes(cantidad);
			liAfo.setLiafocoValortotal(valorTotal);
			liAfo.setLiafocoVisitas(preliquidacion.getMinimoVisitas());
			liAfo.setUsuIderegistro(aforo.getUsuIderegistro());
			liAfo.setEmpIderegistro(UtilConstantes.BIOAGRICOLA);
			
			 liaforepoRepository.save(liAfo);
			 
			 /*
			  * detalle de la liquidacion 
			  * 
			  */			
			conceptosDetalle.forEach((concepto, valor) -> {
				DlihamDetliqaforomultiusuario dliq = new DlihamDetliqaforomultiusuario();	
				dliq.setLiafocoIderegistro(liAfo.getLiafocoIderegistro());
				dliq.setUniConcepto(concepto);
				dliq.setConValor(valor);
				dliqrepoRepository.save(dliq);
			});							

			}
		});
		aforoRepository.saveAll(listaAforo);
		return contador.get();
	}


	public Aforo ObtenerAforoByIdAforo(Long id) {
		return aforoRepository.findAforoByNumeroAforo(id);
	}

	public Aforo insertUpdateAforo(Aforo afo) {
		return aforoRepository.save(afo);
	}

	public Page<Aforo> getAforosPagePreLiquidacion(Pageable pageable,Optional<String> search) {
		try {
			Long id = Long.parseLong(search.orElse(""));
			return this.aforoRepository.findByAfoIderegistroAndAfoEstado(id,UtilConstantes.ESTADO_PRE_LIQUIDACION, pageable);
		}
		catch (Exception e) {
			// TODO: handle exception
		}

		return this.aforoRepository.findByAfoEstado(UtilConstantes.ESTADO_PRE_LIQUIDACION,pageable);

	}

}
