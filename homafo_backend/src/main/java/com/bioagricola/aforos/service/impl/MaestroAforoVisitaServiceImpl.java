package com.bioagricola.aforos.service.impl;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.bioagricola.aforos.entity.Aforo;
import com.bioagricola.aforos.entity.DetalleConceptoVisitaAforo;
import com.bioagricola.aforos.entity.DetalleMaestroVisita;
import com.bioagricola.aforos.entity.MaestroAforoVisita;
import com.bioagricola.aforos.entity.TemProcesoMaestroAforo;
import com.bioagricola.aforos.entity.dto.ConceptoDTO;
import com.bioagricola.aforos.entity.dto.ConsolidatedAforoDTO;
import com.bioagricola.aforos.entity.dto.ConsolidatedDetailAforoDTO;
import com.bioagricola.aforos.entity.dto.DmafConceptosDto;
import com.bioagricola.aforos.entity.dto.SearchDTO;
import com.bioagricola.aforos.entity.dto.VisitByAforoDTO;
import com.bioagricola.aforos.entity.dto.VisitDetailByAforoDTO;
import com.bioagricola.aforos.entity.dto.VisitEditAforoDTO;
import com.bioagricola.aforos.entity.dto.VisitEditDetailAforoDTO;
import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.aforos.repository.AforoRepository;
import com.bioagricola.aforos.repository.DetalleConceptoVisitaAforoRepository;
import com.bioagricola.aforos.repository.DetalleMaestroVisitaRepository;
import com.bioagricola.aforos.repository.MaestroAforoVisitaRepository;
import com.bioagricola.aforos.repository.TemProcesoMaestroAforoRepository;
import com.bioagricola.common.entity.ConConcepto;
import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.common.entity.TerTercero;
import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.common.exception.BusinessException;
import com.bioagricola.common.repository.ConConceptoAforosRepository;
import com.bioagricola.common.repository.TerTerceroRepository;
import com.bioagricola.common.repository.UniUnidadRepository;
import com.bioagricola.common.repository.generic.EntityWriter;
import com.bioagricola.common.util.DateUtil;


@Service
public class MaestroAforoVisitaServiceImpl {

	@Autowired
	private MaestroAforoVisitaRepository maestroAforoVisitaRepository;
	@Autowired
	private DetalleMaestroVisitaRepository detalleMaestroVisitaRepository;
	@Autowired
	private TerTerceroRepository terTerceroRepository;
	@Autowired
	private UniUnidadRepository uniUnidadRepository;
	@Autowired
	private TemProcesoMaestroAforoRepository tempProcesoMARepository;
	@Autowired
	private DetalleConceptoVisitaAforoRepository detalleConceptoVisitaAforoRepository;
	@Autowired
	private ConConceptoAforosRepository conConceptoRepository;
	@Autowired
	private AforoRepository aforoRepository;
	@Autowired
	private AuthenticationFacade authenticationFacade;

	@Autowired
	private EntityWriter<DetalleConceptoVisitaAforo> writerConceptos;
	
	Logger log = LoggerFactory.getLogger(this.getClass());

	private static final BiFunction<Integer,Integer, String> KEY = (x,y)-> String.format("%d-%d", x,y);
	private static final String EMPTY="-";
	private static final String TRAMITADO="T";
	private static final String PENDIENTE="P";
	private static final String CANCELADO="C";	
	private static final String DATE_FORMAT="yyyy-MM-dd";

	@PersistenceContext
	private EntityManager em;

	public VisitByAforoDTO generateVisits(SearchDTO searchDTO){
		List<MaestroAforoVisita> maestros = maestroAforoVisitaRepository.getVisitasByAforo(Long.valueOf(searchDTO.getNumAforo()));
		//maestros.removeIf(m-> INACTIVO.equals(m.getMafvEstado()) || m.getMafvFin().before(new Date()));
		if(maestros.isEmpty()) {
			crearVisitas(maestros.get(0).getAforo(), authenticationFacade.getCredentials().getUsuprgunid());
		}
		return this.getVisitasByAforo(searchDTO, Boolean.TRUE);
	}

	/**
	 * Para el proceso de edición de visitas
	 */
	public VisitByAforoDTO getVisitasByAforo(SearchDTO searchDTO, boolean pendientes){
		VisitByAforoDTO v = new VisitByAforoDTO();		
		List<MaestroAforoVisita> maestros = maestroAforoVisitaRepository.getVisitasByAforo(Long.valueOf(searchDTO.getNumAforo()));
		//maestros.removeIf(m-> INACTIVO.equals(m.getMafvEstado()) || m.getMafvFin().before(new Date()));
		MaestroAforoVisita m = maestros.stream().findFirst().orElse(new MaestroAforoVisita());

		Aforo a = m.getAforo();
		Optional<UniUnidad> u = uniUnidadRepository.findById(a.getUniTipoaforo().getTafoIderegistro());
		Optional<UniUnidad> uClaseSus = uniUnidadRepository.findById(Optional.ofNullable(a.getUniClasesuscripcionaforo().getUniIderegistro()).orElse(null));

		List<DetalleMaestroVisita> detalles;
		
		if(pendientes)
			detalles = m.getDetallesMaestrosVisitas().stream().sorted(
                (t1, t2) -> Double.compare(t1.getDmafIderegistro(), t2.getDmafIderegistro()))
                .collect(Collectors.toList());
		else
			detalles = m.getDetallesMaestrosVisitas().stream().sorted(
	                (t1, t2) -> Double.compare(t2.getDmafIderegistro(), t1.getDmafIderegistro()))
	                .collect(Collectors.toList());
		List<VisitDetailByAforoDTO> dtos = new ArrayList<>();
		detalles.forEach(d->
			dtos.add(this.getDetailDTO(d,pendientes))
		);
		if(pendientes) {
			dtos.removeIf(dto-> TRAMITADO.equals(dto.getEstado()));
			dtos.removeIf(dto-> CANCELADO.equals(dto.getEstado()));
		}
		else {
			dtos.removeIf(dto-> PENDIENTE.equals(dto.getEstado()));
			dtos.removeIf(dto-> CANCELADO.equals(dto.getEstado()));
		}
		DsusDetsuscrip dsus= a.getDetallesAforo().get(0).getDsusIderegistr();
		v.setCodSuscripcion(dsus.getDsusPcodigo());
		v.setIdSuscripcion(dsus.getDsusIderegistr());
		v.setClaseSuscripcion(uClaseSus.isPresent()?uClaseSus.get().getUniNombre1():"-");
		v.setIdTipoAforo(a.getUniTipoaforo().getTafoIderegistro());
		v.setNumAforo(a.getAfoIderegistro());
		v.setNumPqrs(a.getAfoNumpqr());
		v.setTipoAforo(u.isPresent()?u.get().getUniNombre1():"-");
		v.setVisitasRegistradas(dtos);
		v.setTerAforador(a.getTerAforador().getTerIderegistro());
		v.setAfoFecha(new SimpleDateFormat("yyyy-MM-dd").format(a.getAfoFecha()));
		v.setMafvFin(new SimpleDateFormat("yyyy-MM-dd").format(m.getMafvFin()));
		//v.setUsuIderegistro(a.getUsuIderegistro());
		return v;
	}
	
	public VisitByAforoDTO getVisitasByAforoCancelados(SearchDTO searchDTO, boolean pendientes){
		VisitByAforoDTO v = new VisitByAforoDTO();		
		List<MaestroAforoVisita> maestros = maestroAforoVisitaRepository.getVisitasByAforo(Long.valueOf(searchDTO.getNumAforo()));
		//maestros.removeIf(m-> INACTIVO.equals(m.getMafvEstado()) || m.getMafvFin().before(new Date()));
		MaestroAforoVisita m = maestros.stream().findFirst().orElse(new MaestroAforoVisita());
		
		Aforo a = m.getAforo();
		Optional<UniUnidad> u = uniUnidadRepository.findById(a.getUniTipoaforo().getTafoIderegistro());
		Optional<UniUnidad> uClaseSus = uniUnidadRepository.findById(Optional.ofNullable(a.getUniClasesuscripcionaforo().getUniIderegistro()).orElse(null));
		
		List<DetalleMaestroVisita> detalles;
		
		detalles = m.getDetallesMaestrosVisitas().stream().sorted(
                (t1, t2) -> Double.compare(t1.getDmafIderegistro(), t2.getDmafIderegistro()))
                .collect(Collectors.toList());
		
		List<VisitDetailByAforoDTO> dtos = new ArrayList<>();
		detalles.forEach(d->
			dtos.add(this.getDetailDTO(d,false))
		);
		
		dtos.removeIf(dto-> TRAMITADO.equals(dto.getEstado()));
		dtos.removeIf(dto-> PENDIENTE.equals(dto.getEstado()));
		
		DsusDetsuscrip dsus= a.getDetallesAforo().get(0).getDsusIderegistr();
		v.setCodSuscripcion(dsus.getDsusPcodigo());
		v.setIdSuscripcion(dsus.getDsusIderegistr());
		v.setClaseSuscripcion(uClaseSus.isPresent()?uClaseSus.get().getUniNombre1():"-");
		v.setIdTipoAforo(a.getUniTipoaforo().getTafoIderegistro());
		v.setNumAforo(a.getAfoIderegistro());
		v.setNumPqrs(a.getAfoNumpqr());
		v.setTipoAforo(u.isPresent()?u.get().getUniNombre1():"-");
		v.setVisitasRegistradas(dtos);
		v.setTerAforador(a.getTerAforador().getTerIderegistro());
		v.setAfoFecha(new SimpleDateFormat("yyyy-MM-dd").format(a.getAfoFecha()));
		v.setMafvFin(new SimpleDateFormat("yyyy-MM-dd").format(m.getMafvFin()));
		//v.setUsuIderegistro(a.getUsuIderegistro());
		
		return v;
	}

	private VisitDetailByAforoDTO getDetailDTO(DetalleMaestroVisita d, Boolean pendientes) {
		VisitDetailByAforoDTO v = new VisitDetailByAforoDTO();
		v.setFechaProgramacion(DateUtil.dateToString(d.getDmafFecharegistro()));
		v.setFechaVisita(DateUtil.dateToString(d.getDmafFechavisita()));
		if(!pendientes)
			v.setFechaEjecucion(DateUtil.dateToString(d.getDmafFechavisita()));

		v.setDiaSemanaFechaProgramacion(DateUtil.getDayOfWeek(d.getDmafFechavisita()));
		v.setId(d.getDmafIderegistro());
		v.setPeso(d.getDmafPesoaforo());
		v.setSemana(d.getDmafSemanasecuencia());
		v.setConsecutivo(d.getDmavConsecutivovisita());
		v.setEstado(d.getDmafEstado());
		v.setUsuIderegistro(d.getUsuIderegistro());
		List<ConceptoDTO> detalles = new ArrayList<>();
		List<DetalleConceptoVisitaAforo> detConceptos = detalleConceptoVisitaAforoRepository.findDetallesConceptosByDetalleVisita(d.getDmafIderegistro());
		detConceptos.stream().forEach(dc->{
			ConceptoDTO dto= new ConceptoDTO();
			Optional<UniUnidad> recipiente = uniUnidadRepository.findById(dc.getUniConcepto().getUniConcepto());
			dto.setCantidadRecipientes(dc.getDcvaCantidadconcepto());
			dto.setIdTipoRecipiente(dc.getUniConcepto().getUniConcepto());
			dto.setPeso(dc.getDcvaPesoaforo());
			dto.setTipoRecipiente(recipiente.isPresent()?recipiente.get().getUniNombre1():"No encontrado");
			dto.setVolumen(dc.getDcvaVolumenaforo());
			dto.setIdDetalleConcepto(dc.getDcvaIderegistro());
			detalles.add(dto);
		});
		v.setDetalles(detalles);
		return v;
	}

	@Transactional
	public Long setVisitasByAforoOld(VisitByAforoDTO vDTO){
		Optional<Aforo> aforo = aforoRepository.findById(vDTO.getNumAforo());
		if(!aforo.isPresent()) {
			throw new BusinessException(String.format("No se ha encontrado aforo con id %d", vDTO.getNumAforo()));
		}

		this.validateConceptosEmpty(vDTO);

		List<DetalleConceptoVisitaAforo> conceptos = new ArrayList<>();
		vDTO.getVisitasRegistradas().stream().forEach(v->
			v.getDetalles().forEach(c->{

				DetalleMaestroVisita dmv = detalleMaestroVisitaRepository.findById(v.getId()).get();
				dmv.setDmafFechavisita(DateUtil.stringToDate(DATE_FORMAT,v.getFechaEjecucion()));
				dmv.setDmafPesoaforo(Optional.ofNullable(dmv.getDmafPesoaforo()).orElse(0D)+c.getPeso());
				dmv.setDmafEstado(TRAMITADO);
				dmv.setDmafObservaciones(v.getObservaciones());
				detalleMaestroVisitaRepository.save(dmv);
				DetalleConceptoVisitaAforo dc = new DetalleConceptoVisitaAforo();

				if(c.getIdDetalleConcepto()==null || c.getIdDetalleConcepto()>0)
				{
					dc.setDcvaIderegistro(c.getIdDetalleConcepto());
					System.err.println("llegue bien hast ael id..."+c.getIdDetalleConcepto()+ " tipo "+v.getId());
				}

				dc.setDcvaCantidadconcepto(c.getCantidadRecipientes());
				dc.setDcvaFechaactualiza(new Date());
				dc.setDcvaFecharegistro(DateUtil.stringToDate(DATE_FORMAT, v.getFechaProgramacion()));
				//dc.setDcvaObservaciones(v.getObservaciones());//:TODO Llegará en un nuevo campo
				dc.setDcvaObservaciones(c.getObservaciones());//:TODO Llegará en un nuevo campo
				dc.setDcvaVolumenaforo(c.getVolumen());
				//dc.setDmafIderegistro(v.getId());
				//dc.setDmafIderegistro(v.get);
				dc.setUniConcepto(new ConConcepto(c.getIdTipoRecipiente()));
				dc.setUsuIderegistro(authenticationFacade.getCredentials().getUsuprgunid());
				dc.setDcvaPesoaforo(c.getPeso());
				conceptos.add(dc);
			})
		);
		writerConceptos.write(conceptos.stream());
		//writerConceptos.merge(conceptos.stream());

		return aforo.get().getAfoIderegistro();
	}

	private void validateConceptosEmpty(VisitByAforoDTO vDTO) {
		vDTO.getVisitasRegistradas().forEach(v->{
			if(TRAMITADO.equalsIgnoreCase(v.getEstado())) {
				if(v.getDetalles()==null || v.getDetalles().isEmpty()) {
					throw new BusinessException(String.format("No se encontraron conceptos para el ID Visita %d", v.getId()));
				}else if(this.allConceptsAreEmpty(v.getDetalles())) {
					throw new BusinessException(String.format("La visita con ID %d no tiene conceptos", v.getId()));
				}
			}
		});
	}

	private boolean allConceptsAreEmpty(List<ConceptoDTO> recipientes) {
		return recipientes.stream().anyMatch(r-> r.getIdTipoRecipiente()==null);
	}

	//@Transactional
	public Long crearVisitas(Aforo aforoBD,Long usuario) {
		Long response = maestroAforoVisitaRepository.fnCreateVisits(aforoBD.getAfoIderegistro().intValue(),new Timestamp(aforoBD.getAfoFechainicio().getTime()),usuario.intValue());
		if(response.compareTo(-1L)==0) {
			throw new BusinessException(String.format("EL aforo con afo_ideRegistro %d no se encuentra Activo", aforoBD.getAfoIderegistro()));
		}else if(response.compareTo(-2L)==0) {
			throw new BusinessException(String.format("Aforo cuenta con unas visitas activas no se pueden generar nuevas visitas  %d", aforoBD.getAfoIderegistro()));
		}else if(response.compareTo(-3L)==0) {
			throw new BusinessException(String.format("No se encontraron ciclos o periodos activos para la suscripciones %d", aforoBD.getAfoIderegistro()));
		}else if(response.compareTo(-3L)==0) {
			throw new BusinessException(String.format("No se encontraron ciclos o periodos activos para la suscripciones %d", aforoBD.getAfoIderegistro()));
		}else if(response.compareTo(-4L)==0) {
			throw new BusinessException(String.format("No se encontro suscripciones para el aforo %d", aforoBD.getAfoIderegistro()));
		}else if(response.compareTo(-5L)==0) {
			throw new BusinessException(String.format("Frecuencia de recoleccion no encotrada suscripcion %d", aforoBD.getAfoIderegistro()));
		}else if(response.compareTo(-6L)==0) {
			throw new BusinessException(String.format("No esta parametrizado la cantidad de visitas para tipo de aforo %d", aforoBD.getAfoIderegistro()));
		}else {
			return response;
		}
	}
	
	
	//@Transactional
	public Long crearVisitas(Aforo aforoBD,Long usuario,Integer tfdIderegistro,Integer frecuencia) {
		Long response = maestroAforoVisitaRepository.fnCreateVisits_frecuencia(aforoBD.getAfoIderegistro().intValue(),
				new Timestamp(aforoBD.getAfoFechainicio().getTime()),usuario.intValue(),tfdIderegistro, frecuencia);
		if(response.compareTo(-1L)==0) {
			throw new BusinessException(String.format("EL aforo con afo_ideRegistro %d no se encuentra Activo", aforoBD.getAfoIderegistro()));
		}else if(response.compareTo(-2L)==0) {
			throw new BusinessException(String.format("Aforo cuenta con unas visitas activas no se pueden generar nuevas visitas  %d", aforoBD.getAfoIderegistro()));
		}else if(response.compareTo(-3L)==0) {
			throw new BusinessException(String.format("No se encontraron ciclos o periodos activos para la suscripciones %d", aforoBD.getAfoIderegistro()));
		}else if(response.compareTo(-3L)==0) {
			throw new BusinessException(String.format("No se encontraron ciclos o periodos activos para la suscripciones %d", aforoBD.getAfoIderegistro()));
		}else if(response.compareTo(-4L)==0) {
			throw new BusinessException(String.format("No se encontro suscripciones para el aforo %d", aforoBD.getAfoIderegistro()));
		}else if(response.compareTo(-5L)==0) {
			throw new BusinessException(String.format("Frecuencia de recoleccion no encotrada suscripcion %d", aforoBD.getAfoIderegistro()));
		}else if(response.compareTo(-6L)==0) {
			throw new BusinessException(String.format("No esta parametrizado la cantidad de visitas para tipo de aforo %d", aforoBD.getAfoIderegistro()));
		}else {
			return response;
		}
	}

	/**
	 * Retorna todos los consolidados existentes para aforos
	 * @param s
	 * @return
	 */
	public List<ConsolidatedAforoDTO> getConsolidados(SearchDTO s){
		List<ConsolidatedAforoDTO> consolidadosDTO= new ArrayList<>();

		this.getVisitas(s).forEach(m-> {
			Map<String, List<DetalleMaestroVisita>> map = new HashMap<>();
			m.getDetallesMaestrosVisitas().forEach(d-> {
				 Calendar cal = Calendar.getInstance();
				 cal.setTime(d.getDmafFechavisita());
				 this.cargarAgrupado(map, d, KEY.apply(cal.get(Calendar.MONTH)+1, cal.get(Calendar.YEAR)));
			});
			consolidadosDTO.add(this.mapToDTO(m,map));
		});

		return consolidadosDTO;
	}

	private ConsolidatedAforoDTO mapToDTO(MaestroAforoVisita m,Map<String, List<DetalleMaestroVisita>> map) {
		ConsolidatedAforoDTO c = new ConsolidatedAforoDTO();
		List<ConsolidatedDetailAforoDTO> detalles = new ArrayList<>();

		map.forEach((key, list) -> {
			ConsolidatedDetailAforoDTO i = new ConsolidatedDetailAforoDTO();
			i.setMes(key);
			i.setNumeroVisitas(list.size());
			//i.setVolumenM3(list.stream().mapToDouble(d->Optional.ofNullable(d.getDmafPesoaforo()).orElse(0D)).sum());  ///conConceptoRepository
			i.setVolumenM3(list.stream().collect(Collectors.summingDouble(n->detalleConceptoVisitaAforoRepository.caclularVolumendmaf(n.getDmafIderegistro()))));
			i.setVolumenMes(list.stream().mapToDouble(d->Optional.ofNullable(d.getDmafPesoaforo()).orElse(0D)).sum());
			detalles.add(i);
		});
		Optional<UniUnidad> tg = Optional.empty();
		if(m.getUniTipogenerador()!=null) {
			log.error("UNIDAD ADMINISTRATIVA:"+m.getUniTipogenerador());
			tg =	uniUnidadRepository.findById(m.getUniTipogenerador());
		}
		List<TemProcesoMaestroAforo> tpma = tempProcesoMARepository.findByIdAforo(m.getAforo().getAfoIderegistro());
		c.setDetalles(detalles);
		c.setFactorProduccion(m.getMafvFactor());
		c.setTafna(!tpma.isEmpty()?tpma.get(0).getMnafTafna():"No calculado");
		c.setTipo(tg.isPresent()?tg.get().getUniNombre1():"No calculado");
		c.setTotalNumeroVisitas(detalles.stream().mapToInt(ConsolidatedDetailAforoDTO::getNumeroVisitas).sum());
		c.setTotalVolumenM3(detalles.stream().mapToDouble(ConsolidatedDetailAforoDTO::getVolumenM3).sum());
		c.setTotalVolumenMes(detalles.stream().mapToDouble(ConsolidatedDetailAforoDTO::getVolumenMes).sum());

		return c;
	}

	public void cargarAgrupado(Map<String, List<DetalleMaestroVisita>> map,DetalleMaestroVisita d, String key){
		List<DetalleMaestroVisita> detallesList = map.getOrDefault(key, new ArrayList<>());
			   detallesList.add(d);
			   map.put(key, detallesList);
	}

	/**
	 * Retorna visitas con detalles informativas para la
	 * visita de edición (Todo transformado a DTO)
	 */
	public List<VisitEditAforoDTO> getDetallesVisitas(SearchDTO s){
		List<VisitEditAforoDTO> visitasDTO= new ArrayList<>();
		List<MaestroAforoVisita> maestros = this.getVisitas(s);
		maestros.forEach(m-> visitasDTO.addAll(this.mapVisitaDTO(m)));

		Map<Long, Double> totales =
				visitasDTO.stream().collect(Collectors.groupingBy(VisitEditAforoDTO::getIdMaestro,
				        Collectors.summingDouble(v-> Optional.ofNullable(v.getVolumen()).orElse(0D))));
		visitasDTO.forEach(v-> v.setTotal(totales.get(v.getIdMaestro())));

		return visitasDTO;
	}

	private List<VisitEditAforoDTO> mapVisitaDTO(MaestroAforoVisita m) {
		List<VisitEditAforoDTO> response = new ArrayList<>();
		List<DetalleConceptoVisitaAforo> dc = detalleConceptoVisitaAforoRepository.findDetallesConceptosByMaaestro(m.getMafvIderegistro());

		m.getDetallesMaestrosVisitas().forEach(d->{
			Optional<TerTercero> tercero = terTerceroRepository.findById(d.getTerAforador().getTerIderegistro());
			VisitEditAforoDTO v = new VisitEditAforoDTO();
						  v.setNumeroVisita(d.getDmafIderegistro());
						  v.setConsecutivo(d.getDmavConsecutivovisita());
						  v.setFechaVisita(DateUtil.dateToString(d.getDmafFechavisita()));
						  v.setDia(DateUtil.getDayOfWeek(d.getDmafFechavisita()));
						  v.setAforador(tercero.isPresent()?tercero.get().getTerNomcompleto():"No encontrado");
						  v.setSemana(d.getDmafSemanasecuencia());
						  //v.setVolumen(d.getDmafPesoaforo());
						  v.setEstado(d.getDmafEstado());
						  v.setIdAforo(m.getAforo().getAfoIderegistro());
						  v.setIdMaestro(m.getMafvIderegistro());
						  v.setObservaciones(d.getDmafObservaciones());

						  List<VisitEditDetailAforoDTO> detalles = this.getDetallesConceptos(m,d,dc);
						  detalles.stream().forEach(det->
							  det.setTotalCantidadRecipientes(detalles.stream().mapToLong(ved-> Optional.ofNullable(ved.getCantidadRecipientes()).orElse(0L)).sum())
						  );
						  detalles.stream().forEach(det->
						  	det.setTotalTotales(detalles.stream().mapToDouble(ved-> Optional.ofNullable(ved.getTotal()).orElse(0D)).sum())
						  );
						  v.setDetalles(detalles);
						  v.setVolumen(detalles.stream().collect(Collectors.summingDouble(n->n.getTotal())));

			 response.add(v);
		});

		return response;
	}

	private List<VisitEditDetailAforoDTO> getDetallesConceptos(MaestroAforoVisita m,DetalleMaestroVisita d,List<DetalleConceptoVisitaAforo> dc) {
		List<VisitEditDetailAforoDTO> conceptosVisitas = new ArrayList<>();
		//dc.stream().filter(c-> d.getDmafIderegistro().compareTo(c.getDmafIderegistro())==0)
		dc.stream().filter(c-> d.getDmafIderegistro().compareTo(c.getDmafIderegistro().getDmafIderegistro())==0)
		.forEach(i->{
			ConConcepto con = conConceptoRepository.findConConceptoByUniConcepto(i.getUniConcepto().getUniConcepto());
			VisitEditDetailAforoDTO cv = new VisitEditDetailAforoDTO();
			cv.setTipoRecipiente(uniUnidadRepository.findById(i.getUniConcepto().getUniConcepto()).get().getUniNombre1());
			cv.setDimensiones(con!=null?con.getConAbreviatura():EMPTY);
			cv.setCantidadRecipientes(i.getDcvaCantidadconcepto());
			cv.setEquivalencia(con!=null?con.getConValor():0D);
			cv.setTotal(i.getDcvaVolumenaforo());
			cv.setIdDetalleConcepto(i.getDcvaIderegistro());
			cv.setObservaciones(i.getDcvaObservaciones());
			cv.setPeso(i.getDcvaPesoaforo());
			conceptosVisitas.add(cv);
		});

		return conceptosVisitas;
	}

	@SuppressWarnings("unchecked")
	private List<MaestroAforoVisita> getVisitas(SearchDTO s) {
			String consulta="select distinct m.* from aseo.mafv_maestroaforovisitas m " +
					"inner join aseo.afo_aforos a on a.afo_ideregistro=m.afo_ideregistro " +
					"inner join aseo.dmaf_detallemaestrovisitas d on m.mafv_ideregistro=d.mafv_ideregistro " +
					"where m.afo_ideregistro=".concat(s.getNumAforo());

				Query q=em.createNativeQuery(consulta+this.getFiltros(s),MaestroAforoVisita.class);
				List<MaestroAforoVisita> visitas = q.getResultList();//Se podría retornar de inmediato pero generaría una excepción de casteo.
				return visitas;
	}

	private String getFiltros(SearchDTO s) {
		StringBuilder f= new StringBuilder();

		if(!StringUtils.isEmpty(s.getDesde()))
			f.append(String.format(" and mafv_inicio>='%s'",s.getDesde()));
		if(!StringUtils.isEmpty(s.getHasta()))
			f.append(String.format(" and mafv_fin<='%s'",s.getHasta()));
		if(!StringUtils.isEmpty(s.getIdTecnicoAforador()))
			f.append(" and d.ter_aforador="+Long.valueOf(s.getIdTecnicoAforador()));
		if(!StringUtils.isEmpty(s.getIdTipoAforo()))
			f.append(" and a.uni_tipoaforo="+Long.valueOf(s.getIdTipoAforo()));

		return f.toString();
	}

	public Long getUniTipoGeneradorByAforo(Long numAforo) {
		MaestroAforoVisita m =  maestroAforoVisitaRepository.getVisitasByAforo(numAforo)
				.stream().findFirst().orElse(new MaestroAforoVisita());
		return m.getUniTipogenerador();
	}

	public Long setVisitasByAforo(VisitByAforoDTO vDTO){
		Optional<Aforo> aforo = aforoRepository.findById(vDTO.getNumAforo());
		if(!aforo.isPresent()) {
			throw new BusinessException(String.format("No se ha encontrado aforo con id %d", vDTO.getNumAforo()));
		}

		this.validateConceptosEmpty(vDTO);

		for(VisitDetailByAforoDTO tmp : vDTO.getVisitasRegistradas() )
		{
			DetalleMaestroVisita dmv = detalleMaestroVisitaRepository.findById(tmp.getId()).get();
			dmv.setDmafFechavisita(DateUtil.stringToDate(DATE_FORMAT,tmp.getFechaEjecucion()));
			dmv.setDmafEstado(TRAMITADO);
			dmv.setDmafObservaciones(tmp.getObservaciones());
			Double pesoTmp=(double) 0;
			for(ConceptoDTO tmp2 : tmp.getDetalles() )
			{
				DetalleConceptoVisitaAforo dc = new DetalleConceptoVisitaAforo();

				if(tmp2.getIdDetalleConcepto()==null || tmp2.getIdDetalleConcepto()>0)
				{
					dc.setDcvaIderegistro(tmp2.getIdDetalleConcepto());
					System.err.println("llegue bien hast ael id..."+tmp2.getIdDetalleConcepto());
				}

				dc.setDcvaCantidadconcepto(tmp2.getCantidadRecipientes());
				dc.setDcvaFechaactualiza(new Date());
				dc.setDcvaFecharegistro(DateUtil.stringToDate(DATE_FORMAT, tmp.getFechaProgramacion()));
				dc.setDcvaObservaciones(tmp2.getObservaciones());//:TODO Llegará en un nuevo campo
				dc.setDcvaVolumenaforo(tmp2.getVolumen());
				dc.setDmafIderegistro(dmv);
				dc.setUniConcepto(new ConConcepto(tmp2.getIdTipoRecipiente()) );
				dc.setUsuIderegistro(authenticationFacade.getCredentials().getUsuprgunid());
				dc.setDcvaPesoaforo(tmp2.getPeso());
				if(dmv.getDetalleConceptosList()==null)
				{
					dmv.setDetalleConceptosList(new ArrayList<DetalleConceptoVisitaAforo>());
				}
				dmv.getDetalleConceptosList().add(dc);
				pesoTmp=pesoTmp+tmp2.getPeso();
			}

			dmv.setDmafPesoaforo(Optional.ofNullable(dmv.getDmafPesoaforo()).orElse(0D)+pesoTmp);
			detalleMaestroVisitaRepository.save(dmv);
		}

		return aforo.get().getAfoIderegistro();
	}

	public DmafConceptosDto buscarConceptosDmaf(Long dmafIderegistro)
	{
		try
		{
			DetalleMaestroVisita dmv = detalleMaestroVisitaRepository.findById(dmafIderegistro).get();
			DmafConceptosDto tmp=new DmafConceptosDto();
			tmp.setDmafIderegistro(dmafIderegistro);
			tmp.setFechaDmaf(DateUtil.dateToString2(dmv.getDmafFechavisita()));
			tmp.setObservacionesDmaf(dmv.getDmafObservaciones());
			if(tmp.getListaConceptosDetalles()==null)
			{
				tmp.setListaConceptosDetalles(new ArrayList<>());
			}

			for(DetalleConceptoVisitaAforo item : dmv.getDetalleConceptosList())
			{
				ConceptoDTO con=new ConceptoDTO();
				Optional<UniUnidad> recipiente = uniUnidadRepository.findById(item.getUniConcepto().getUniConcepto());
				con.setCantidadRecipientes(item.getDcvaCantidadconcepto());
				con.setIdTipoRecipiente(item.getUniConcepto().getUniConcepto());
				con.setPeso(item.getDcvaPesoaforo());
				con.setTipoRecipiente(recipiente.isPresent()?recipiente.get().getUniNombre1():"No encontrado");
				con.setVolumen(item.getDcvaVolumenaforo());
				con.setIdDetalleConcepto(item.getDcvaIderegistro());
				con.setObservaciones(item.getDcvaObservaciones());
				tmp.getListaConceptosDetalles().add(con);
			}

			return tmp;
		}catch (Exception e) {
			System.err.println("que error es "+e.getMessage());
			return null;
		}


	}

	public Integer crudConceptosDmaf(DmafConceptosDto request){
		log.error("PETICION"+request.getListaConceptosDetalles().size());
		try
		{
			DetalleMaestroVisita dmv = detalleMaestroVisitaRepository.findById(request.getDmafIderegistro()).get();
			//dmv.setDmafFechavisita(DateUtil.stringToDate(DATE_FORMAT,request.getFechaDmaf()));
			dmv.setDmafEstado(TRAMITADO);
			dmv.setDmafObservaciones(request.getObservacionesDmaf());
			Double pesoTmp=(double) 0;
			if(dmv.getDetalleConceptosList()==null)
			{
				dmv.setDetalleConceptosList(new ArrayList<DetalleConceptoVisitaAforo>());
			}
			//dmv.setDetalleConceptosList(new ArrayList<DetalleConceptoVisitaAforo>()); ///limpiamos lista
			dmv.getDetalleConceptosList().clear();
			for(ConceptoDTO tmp2 : request.getListaConceptosDetalles() )
			{
					DetalleConceptoVisitaAforo dc = new DetalleConceptoVisitaAforo();

					if(tmp2.getIdDetalleConcepto()==null || tmp2.getIdDetalleConcepto()>0)
					{
						dc.setDcvaIderegistro(tmp2.getIdDetalleConcepto());
					}
					dc.setDcvaCantidadconcepto(tmp2.getCantidadRecipientes());
					dc.setDcvaFechaactualiza(new Date());
					dc.setDcvaFecharegistro(DateUtil.stringToDate(DATE_FORMAT, request.getFechaDmaf()));
					dc.setDcvaObservaciones(tmp2.getObservaciones());
					dc.setDcvaVolumenaforo(tmp2.getVolumen());
					dc.setDmafIderegistro(dmv);
					dc.setUniConcepto(new ConConcepto(tmp2.getIdTipoRecipiente()));
					dc.setUsuIderegistro(authenticationFacade.getCredentials().getUsuprgunid());
					dc.setDcvaPesoaforo(tmp2.getPeso());
					if(dmv.getDetalleConceptosList()==null)
					{
						dmv.setDetalleConceptosList(new ArrayList<DetalleConceptoVisitaAforo>());
					}
					dmv.getDetalleConceptosList().add(dc);
					pesoTmp=pesoTmp+tmp2.getPeso();
			}
			//dmv.setDmafPesoaforo(Optional.ofNullable(dmv.getDmafPesoaforo()).orElse(0D)+pesoTmp);
			dmv.setDmafPesoaforo(Optional.ofNullable(pesoTmp).orElse(0D));
			detalleMaestroVisitaRepository.save(dmv);
			return 0;
		}catch (Exception e) {
			System.err.println("que error llego "+e.getMessage());
			return 1;
		}
	}

	public VisitByAforoDTO getListaDmafEstado(Long idAforo)
	{
		List<MaestroAforoVisita> maestros = maestroAforoVisitaRepository.getVisitasByAforo(idAforo);
		//maestros.removeIf(m-> INACTIVO.equals(m.getMafvEstado()) || m.getMafvFin().before(new Date()));
		MaestroAforoVisita m = maestros.stream().findFirst().orElse(new MaestroAforoVisita());

		List<DetalleMaestroVisita> detalles1=new ArrayList<DetalleMaestroVisita>();
		List<DetalleMaestroVisita> detalles2=new ArrayList<DetalleMaestroVisita>();

			detalles1 = m.getDetallesMaestrosVisitas().stream().sorted(
                (t1, t2) -> Double.compare(t1.getDmafIderegistro(), t2.getDmafIderegistro()))
                .collect(Collectors.toList());

			detalles2 = m.getDetallesMaestrosVisitas().stream().sorted(
	                (t1, t2) -> Double.compare(t2.getDmafIderegistro(), t1.getDmafIderegistro()))
	                .collect(Collectors.toList());


		///agrego los detalles al formato de la ista que necesita
		VisitByAforoDTO tmp=new VisitByAforoDTO();
		List<VisitDetailByAforoDTO> dtos1 = new ArrayList<>();///lista de registradas del tmp
		List<VisitDetailByAforoDTO> dtos2 = new ArrayList<>();///lista de registradas del tmp
		detalles1.forEach(d->
		dtos1.add(this.getDetailDTO(d,Boolean.TRUE))
		);
		detalles2.forEach(d->
		dtos2.add(this.getDetailDTO(d,Boolean.FALSE))
		);
		//dtos.removeIf(dto-> estado.equals(dto.getEstado()));
		//tmp.setVisitasRegistradas(dtos);
		tmp.setVisitasRegistradas(dtos1.stream().filter(item->"P".equals(item.getEstado())).collect(Collectors.toList()));
		tmp.setVisitasRegistradas2(dtos2.stream().filter(item->"T".equals(item.getEstado())).collect(Collectors.toList()));
		return tmp;

	}
	
	public List<MaestroAforoVisita> getMaestroVisitasByIdAforo(Long aforo) {
		return maestroAforoVisitaRepository.getVisitasByAforo(aforo);
	}
	
	public List<DetalleMaestroVisita> getDetalleMaestroVisitasByIdMvfAndEstado(Long mafvIderegistro){
		return detalleMaestroVisitaRepository.getDetalleMaestroVisitasByIdMvfAndEstado(mafvIderegistro);
	}
	
	public void saveAllDetalleVisitas(List<DetalleMaestroVisita> details) {
		detalleMaestroVisitaRepository.saveAll(details);
	}
	
	public void saveAllMaestroVisitas(List<MaestroAforoVisita> mafv) {
		maestroAforoVisitaRepository.saveAll(mafv);
	}

}
