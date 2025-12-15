package com.bioagricola.aforos.service.impl;

import java.lang.reflect.Type;
import java.text.ParseException;
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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.bioagricola.aforos.entity.HDetalleConceptoVisitaAforo;
import com.bioagricola.aforos.entity.HDetalleMaestroVisita;
import com.bioagricola.aforos.entity.HMaestroAforoVisita;
import com.bioagricola.aforos.entity.HafoAforos;
import com.bioagricola.aforos.entity.HdafoDetaforo;
import com.bioagricola.aforos.entity.TemProcesoMaestroAforo;
import com.bioagricola.aforos.entity.dto.ConsolidatedAforoDTO;
import com.bioagricola.aforos.entity.dto.ConsolidatedDetailAforoDTO;
import com.bioagricola.aforos.entity.dto.HistoricosAforoDTO;
import com.bioagricola.aforos.entity.dto.SearchDTO;
import com.bioagricola.aforos.entity.dto.SearchResponseDTO;
import com.bioagricola.aforos.entity.dto.VisitEditAforoDTO;
import com.bioagricola.aforos.entity.dto.VisitEditDetailAforoDTO;
import com.bioagricola.aforos.repository.HAforoRepository;
import com.bioagricola.aforos.repository.HDetalleConceptoVisitaAforoRepository;
import com.bioagricola.aforos.repository.HdafoDetaforoRepository;
import com.bioagricola.aforos.repository.TemProcesoMaestroAforoRepository;
import com.bioagricola.common.constant.UtilConstantes;
import com.bioagricola.common.entity.ConConcepto;
import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.common.entity.TerTercero;
import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.common.repository.ConConceptoAforosRepository;
import com.bioagricola.common.repository.DsusDetsuscripRepository;
import com.bioagricola.common.repository.TerTerceroRepository;
import com.bioagricola.common.repository.UniUnidadRepository;
import com.bioagricola.common.util.BDToDTOUtil;
import com.bioagricola.common.util.ConvertGeneral;
import com.bioagricola.common.util.DateUtil;
import com.bioagricola.homologaciones.repository.HomologacionRepository;
import com.fasterxml.jackson.core.JsonParser;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

@Service
public class HAforoServiceImpl {
	private static final BiFunction<Integer, Integer, String> KEY = (x, y) -> String.format("%d-%d", x, y);
	private static final String EMPTY = "-";

	@Autowired
	private TerTerceroRepository terTerceroRepository;
	@Autowired
	private UniUnidadRepository uniUnidadRepository;
	@Autowired
	private HAforoRepository hAforoRepository;
	@Autowired
	private TemProcesoMaestroAforoRepository tempProcesoMARepository;
	@Autowired
	private ConConceptoAforosRepository conConceptoRepository;
	@Autowired
	private HDetalleConceptoVisitaAforoRepository hDetalleConceptoVisitaAforoRepository;
	@Autowired
	private HdafoDetaforoRepository hdmafRepository;
	
	@Autowired
	private DsusDetsuscripRepository dsusrepoRepository;

	@Autowired
	private BDToDTOUtil bDToDTOUtil;

	@Autowired
	private SearchComponentServiceImpl searchComponentServiceImpl;
	
	@Autowired
	private HomologacionRepository repository;

	@PersistenceContext
	private EntityManager em;
	
	Logger log= LoggerFactory.getLogger(this.getClass());

	public List<SearchResponseDTO> searchAforos(SearchDTO searchDTO) {
		return bDToDTOUtil
				.mapHAforosToListOfSearchResponseDTO(searchComponentServiceImpl.getHAforosBusqueda(searchDTO));
	}

	public List<HistoricosAforoDTO> getHistoricosByIdAforo(Long idAforo) {
		List<HistoricosAforoDTO> respuesta = hAforoRepository.getHistoricoByIdAforo(idAforo);
		return respuesta;
	}

	/**
	 * Retorna visitas con detalles informativas para la visita de edición (Todo
	 * transformado a DTO)
	 */
	public List<VisitEditAforoDTO> getHistoricoDetallesVisitas(SearchDTO s) {
		List<VisitEditAforoDTO> visitasDTO = new ArrayList<>();
		List<HMaestroAforoVisita> maestros = this.getVisitas(s);
		maestros.forEach(m -> visitasDTO.addAll(this.mapVisitaDTO(m)));
		
		Map<Long, Double> totales = visitasDTO.stream().collect(Collectors.groupingBy(VisitEditAforoDTO::getIdMaestro,
				Collectors.summingDouble(v -> Optional.ofNullable(v.getVolumen()).orElse(0D))));
		visitasDTO.forEach(v -> v.setTotal(totales.get(v.getIdMaestro())));
		
		return visitasDTO;
	}
	private List<VisitEditAforoDTO> mapVisitaDTO(HMaestroAforoVisita m) {
		List<VisitEditAforoDTO> response = new ArrayList<>();

		List<HDetalleConceptoVisitaAforo> dc = hDetalleConceptoVisitaAforoRepository
				.findDetallesConceptosByMaaestro(m.getHmafvIderegistro());

		m.getHdetallesMaestrosVisitas().forEach(d -> {
			Optional<TerTercero> tercero = terTerceroRepository.findById(d.getTerAforador());
			VisitEditAforoDTO v = new VisitEditAforoDTO();
			v.setNumeroVisita(d.getHdmavConsecutivovisita());
			v.setFechaVisita(DateUtil.dateToString(d.getHdmafFechavisita()));
			v.setDia(DateUtil.getDayOfWeek(d.getHdmafFechavisita()));
			v.setAforador(tercero.isPresent() ? tercero.get().getTerNomcompleto() : "No encontrado");
			v.setSemana(d.getHdmafSemanasecuencia());
			v.setEstado(d.getHdmafEstado());
			v.setIdAforo(m.getAfoIderegistro());
			v.setIdMaestro(m.getHmafvIderegistro());
			v.setConsecutivo(d.getHdmafIderegistro());
			v.setObservaciones(d.getHdmafObservaciones());

			List<VisitEditDetailAforoDTO> detalles = this.getDetallesConceptos(m, d, dc);

			// Calcular totales UNA SOLA VEZ
			double totalVolumen = detalles.stream()
					.mapToDouble(ved -> Optional.ofNullable(ved.getTotal()).orElse(0D))
					.sum();

			double totalPeso = detalles.stream()
					.mapToDouble(ved -> Optional.ofNullable(ved.getPeso()).orElse(0D))
					.sum();

			v.setDetalles(detalles);
			v.setVolumen(totalVolumen);
			v.setPeso(totalPeso);
			response.add(v);
		});

		return response;
	}

	private List<VisitEditDetailAforoDTO> getDetallesConceptos(HMaestroAforoVisita m, HDetalleMaestroVisita d,
			List<HDetalleConceptoVisitaAforo> dc) {
		List<VisitEditDetailAforoDTO> conceptosVisitas = new ArrayList<>();
		dc.stream().filter(c -> d.getHdmafIderegistro().compareTo(c.getHdmafIderegistro()) == 0).forEach(i -> {
			ConConcepto con = conConceptoRepository.findConConceptoByUniConcepto(i.getUniConcepto());
			VisitEditDetailAforoDTO cv = new VisitEditDetailAforoDTO();
			cv.setTipoRecipiente(uniUnidadRepository.findById(i.getUniConcepto()).get().getUniNombre1());
			cv.setDimensiones(con != null ? con.getConAbreviatura() : EMPTY);
			cv.setCantidadRecipientes(i.getHdcvaCantidadconcepto());
			cv.setEquivalencia(con != null ? con.getConValor() : 0D);
			cv.setTotal(i.getHdcvaVolumenaforo());
			cv.setPeso(i.getHdcvaPesoaforo());
			cv.setObservaciones(i.getHdcvaObservaciones());

			conceptosVisitas.add(cv);
		});

		return conceptosVisitas;
	}

	public List<ConsolidatedAforoDTO> getHConsolidados(SearchDTO s) {
		List<ConsolidatedAforoDTO> consolidadosDTO = new ArrayList<>();
		this.getVisitas(s).forEach(m -> {
			log.error(m.getHdetallesMaestrosVisitas().get(0).getHdmavConsecutivovisita().toString());
			Map<String, List<HDetalleMaestroVisita>> map = new HashMap<>();
			m.getHdetallesMaestrosVisitas().forEach(d -> {
				Calendar cal = Calendar.getInstance();
				cal.setTime(d.getHdmafFechavisita());

				this.cargarAgrupado(map, d, KEY.apply(cal.get(Calendar.MONTH) + 1, cal.get(Calendar.YEAR)));
			});
			consolidadosDTO.add(this.mapToDTO(m, map,Long.parseLong(s.getNumAforo()) ));
		});
		if(s.getNumAforoPadre()!=null) this.getVisitasAfoPadre(s).forEach(m -> {
			Map<String, List<HDetalleMaestroVisita>> map = new HashMap<>();
			m.getHdetallesMaestrosVisitas().forEach(d -> {
				Calendar cal = Calendar.getInstance();
				cal.setTime(d.getHdmafFechavisita());

				this.cargarAgrupado(map, d, KEY.apply(cal.get(Calendar.MONTH) + 1, cal.get(Calendar.YEAR)));
			});
			consolidadosDTO.add(this.mapToDTO(m, map,Long.parseLong(s.getNumAforoPadre()) ));
		});
		return consolidadosDTO;
	}

	public void cargarAgrupado(Map<String, List<HDetalleMaestroVisita>> map, HDetalleMaestroVisita d, String key) {
		List<HDetalleMaestroVisita> detallesList = map.getOrDefault(key, new ArrayList<>());
		detallesList.add(d);
		map.put(key, detallesList);
	}

	private ConsolidatedAforoDTO mapToDTO(HMaestroAforoVisita m, Map<String, List<HDetalleMaestroVisita>> map, Long idDmaf ) {
		ConsolidatedAforoDTO c = new ConsolidatedAforoDTO();
		List<ConsolidatedDetailAforoDTO> detalles = new ArrayList<>();

		map.forEach((key, list) -> {
			ConsolidatedDetailAforoDTO i = new ConsolidatedDetailAforoDTO();
			i.setMes(key);
			i.setNumeroVisitas(list.size());
			//i.setVolumenM3(	list.stream().mapToDouble(d -> Optional.ofNullable(d.getHdmafPesoaforo()).orElse(0D)).sum()); 
			i.setVolumenM3(list.stream().collect(Collectors.summingDouble(n->hDetalleConceptoVisitaAforoRepository.caclularVolumendmaf(n.getHdmafIderegistro()))));
			List<HDetalleMaestroVisita> l1 = list;
			l1.stream().forEach(j-> log.error("PESOOOOOO"+j.getHdmafPesoaforo()));
			i.setVolumenMes(list.stream().mapToDouble(d -> Optional.ofNullable(d.getHdmafPesoaforo()).orElse(0D)).sum());
			detalles.add(i);
		});
		Optional<UniUnidad> tg = Optional.empty();
		Optional<UniUnidad> ta= Optional.empty();
		/*
		if (m.getUniTipogenerador() != null) {
			tg = uniUnidadRepository.findById(m.getUniTipogenerador());
		}
		*/
		HafoAforos aforo= hAforoRepository.buscarAforo(m.getAfoIderegistro());
		if (aforo.getUniTipogenerador() != null) {
			//tg = uniUnidadRepository.findById(m.getUniTipogenerador());
			tg = uniUnidadRepository.findById(aforo.getUniTipogenerador());
		}
		if(aforo.getUniTipoaforo()!=null) {
			ta=uniUnidadRepository.findById(aforo.getUniTipoaforo());
		}
		List<TemProcesoMaestroAforo> tpma = tempProcesoMARepository.findByIdAforo(m.getAfoIderegistro());
		List<HdafoDetaforo> hdmaf= hdmafRepository.buscarHDafo(idDmaf);
		c.setDetalles(detalles);
		c.setNumAforo(aforo.getHafoIderegistro());
		//c.setFactorProduccion(m.getHmafvFactor());
		c.setTipoAforo(ta.isPresent() ? ta.get().getUniNombre1() : "No Tipo Aforo");
		c.setFactorProduccion(hdmaf.get(0).getFactorEquivalencia().toString());
		c.setTafna(hdmaf.stream().collect(Collectors.summingDouble(n->n.getTafnaCalculado())).toString());
		log.error("HAFO:"+c.getTafna());
		c.setTipo(tg.isPresent() ? tg.get().getUniNombre1() : "No calculado");
		c.setTotalNumeroVisitas(detalles.stream().mapToInt(ConsolidatedDetailAforoDTO::getNumeroVisitas).sum());
		c.setTotalVolumenM3(detalles.stream().mapToDouble(ConsolidatedDetailAforoDTO::getVolumenM3).sum());
		c.setTotalVolumenMes(detalles.stream().mapToDouble(ConsolidatedDetailAforoDTO::getVolumenMes).sum());

		return c;
	}

	@SuppressWarnings("unchecked")
	private List<HMaestroAforoVisita> getVisitas(SearchDTO s) {
		String consulta = "select distinct hm.* from aseo.hmafv_maestroaforovisitas hm "
				+ "inner join aseo.hafo_aforos ha on ha.hafo_ideregistro=hm.afo_ideregistro "
				+ "inner join aseo.hdmaf_detallemaestrovisitas d on hm.hmafv_ideregistro=d.hmafv_ideregistro "
				+ "where hm.afo_ideregistro=".concat(s.getNumAforo());

		Query q = em.createNativeQuery(consulta + this.getFiltros(s), HMaestroAforoVisita.class);
		List<HMaestroAforoVisita> visitas = q.getResultList();// Se podría retornar de inmediato pero generaría una
																// excepción de casteo.
		return visitas;
	}
	
	@SuppressWarnings("unchecked")
	private List<HMaestroAforoVisita> getVisitasAfoPadre(SearchDTO s) {
		String consulta = "select distinct hm.* from aseo.hmafv_maestroaforovisitas hm "
				+ "inner join aseo.hafo_aforos ha on ha.hafo_ideregistro=hm.afo_ideregistro "
				+ "inner join aseo.hdmaf_detallemaestrovisitas d on hm.hmafv_ideregistro=d.hmafv_ideregistro "
				+ "where hm.afo_ideregistro=".concat(s.getNumAforoPadre());

		Query q = em.createNativeQuery(consulta + this.getFiltros(s), HMaestroAforoVisita.class);
		List<HMaestroAforoVisita> visitas = q.getResultList();// Se podría retornar de inmediato pero generaría una
																// excepción de casteo.
		return visitas;
	}

	private String getFiltros(SearchDTO s) {
		StringBuilder f = new StringBuilder();

		if (!StringUtils.isEmpty(s.getDesde()))
			f.append(String.format(" and hmafv_inicio>='%s'", s.getDesde()));
		if (!StringUtils.isEmpty(s.getHasta()))
			f.append(String.format(" and hmafv_fin<='%s'", s.getHasta()));
		if (!StringUtils.isEmpty(s.getIdTecnicoAforador()))
			f.append(" and d.ter_aforador=" + Long.valueOf(s.getIdTecnicoAforador()));
		if (!StringUtils.isEmpty(s.getIdTipoAforo()))
			f.append(" and a.uni_tipoaforo=" + Long.valueOf(s.getIdTipoAforo()));

		return f.toString();
	}
	
	@Scheduled(cron = "0 37 8 ? * *")
	public void vigenciaAforoConsulta() {		
		SimpleDateFormat formato=new SimpleDateFormat("yyyy-mm-dd");
		Date d=new Date();		
		Optional<List<HafoAforos>>listaAforos=Optional.empty();
		listaAforos=hAforoRepository.findByHafo_estado(UtilConstantes.ESTADO_VIGENTE);
		if(listaAforos.isPresent()) {
		listaAforos.get().stream().filter(f->d.after(f.getHafoFechafinaforo()))
		.forEach(c->{
			
			List<HdafoDetaforo> hdafo = hdmafRepository.buscarHDafo(c.getHafoIderegistro());
			hdafo.stream().forEach(h->{
				Optional<DsusDetsuscrip> dsus = dsusrepoRepository.findDsusByDsus(h.getDsusIderegistr());
				if(dsus.isPresent()) {
					Integer empresaDsus=repository.buscarEmpresaDsus(Integer.parseInt(dsus.get().getDsusIderegistr().toString()));
					List<Object[]> parametros=repository.parametroValor(empresaDsus);
					ConvertGeneral convertir=new ConvertGeneral();
					String jparameters =  convertir.extraerValorParametro(parametros, "liquidacion_condicion_suscripcion");
					if(jparameters!= null) {
						JsonObject js = com.google.gson.JsonParser.parseString(jparameters).getAsJsonObject();
						JsonArray lista = js.get("noAforado").getAsJsonArray();
						for(JsonElement e : lista) {
							JsonObject obj = e.getAsJsonObject();
							if(obj.get("uni_tipusosuscr").getAsInt() ==  Integer.parseInt(dsus.get().getUniTipusosuscr().toString()))
							{
								DsusDetsuscrip dsusP = dsus.get();
								dsusP.setUniLiquidacion(obj.get("liq_aforado").getAsLong());
								dsusrepoRepository.save(dsusP);
								log.info("Actulizado Liquidacion Sin Aforo ");
							}
							
						}
					}
				}	
				
			});
			c.setHafoEstado(UtilConstantes.ESTADO_VENCIDO);
			c.setHafoFechaactualizacion(d);
				hAforoRepository.save(c);
				});
			log.info("Actualizado El Historico de Aforos Vencidos");
		};
	}
}
