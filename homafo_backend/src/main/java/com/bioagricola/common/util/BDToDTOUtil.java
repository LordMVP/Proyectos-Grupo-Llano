package com.bioagricola.common.util;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.Tuple;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.bioagricola.aforos.entity.Aforo;
import com.bioagricola.aforos.entity.ConsolidadoLiquidacionVisitaAforo;
import com.bioagricola.aforos.entity.DetalleAforo;
import com.bioagricola.aforos.entity.HafoAforos;
import com.bioagricola.aforos.entity.MaestroAforoVisita;
import com.bioagricola.aforos.entity.dto.DafoDetAforoDTO;
import com.bioagricola.aforos.entity.dto.LiquidacionDTO;
import com.bioagricola.aforos.entity.dto.SearchResponseAforoMultiDTO;
import com.bioagricola.aforos.entity.dto.SearchResponseDTO;
import com.bioagricola.aforos.entity.dto.StaticContentResponseDTO;
import com.bioagricola.aforos.repository.ConsolidadoLiquidacionVisitaAforoRepository;
import com.bioagricola.aforos.repository.IasusInforadicionalsuscripcionRepository;
import com.bioagricola.aforos.repository.MaestroAforoVisitaRepository;
import com.bioagricola.aforos.service.impl.DetalleAforoServiceImpl;
import com.bioagricola.aforos.service.impl.SearchComponentServiceImpl;
import com.bioagricola.aforos.service.impl.UniUnidadAforosServiceImpl;
import com.bioagricola.common.constant.UtilConstantes;
import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.common.entity.IasusInforadicionalsuscripcion;
import com.bioagricola.common.entity.ProPropiedad;
import com.bioagricola.common.entity.TerTercero;
import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.common.repository.DsusDetsuscripRepository;
import com.bioagricola.common.repository.ProPropiedadRepository;
import com.bioagricola.common.repository.TerTerceroRepository;
import com.bioagricola.common.service.ParParametroService;

@Component
public class BDToDTOUtil {
	@Autowired
	private UniUnidadAforosServiceImpl unidadAforosServiceImpl;
	@Autowired
	private DsusDetsuscripRepository dsusRepository;
	@Autowired
	private ConsolidadoLiquidacionVisitaAforoRepository consolidadoRepository;
	@Autowired
	private DetalleAforoServiceImpl dafoAforoServiceImpl;
	@Autowired
	private ProPropiedadRepository propiedadRepository;
	@Autowired
	private MaestroAforoVisitaRepository maestroAforoVisitaRepository;
	@Autowired
	private TerTerceroRepository terceroRepository;
	@Autowired
	private SearchComponentServiceImpl searchComponentServiceImpl;
	@Autowired
	private IasusInforadicionalsuscripcionRepository iasusRepository;
	
	@Autowired
    private ParParametroService _parParametroService;

	private List<StaticContentResponseDTO<String>> tiposAforos;
	private static final String EMPTY="";
	
	Logger log = LoggerFactory.getLogger(BDToDTOUtil.class);

	public LiquidacionDTO mapAforoToLiquidacionDTO(Aforo a){
		org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);
			this.tiposAforos = unidadAforosServiceImpl.getTiposAforos();
			LiquidacionDTO l = new LiquidacionDTO();
			l.setIdAforo(a.getAfoIderegistro());
			Long uni_individual = hya_parametros.getLong("uni_individual");
			if(uni_individual.compareTo(a.getUniClasesuscripcionaforo().getUniIderegistro())==0)
				l.setTipoAforo("INDIVIDUAL - ".concat(this.getTipoAforo(a.getUniTipoaforo().getTafoIderegistro())));
			else
				l.setTipoAforo("MULTIUSUARIO - ".concat(this.getTipoAforo(a.getUniTipoaforo().getTafoIderegistro())));
			l.setIdSuscripcion(a.getDetallesAforo().get(0).getDsusIderegistr().getDsusIderegistr());

			MaestroAforoVisita mav= Optional.ofNullable(a.getMaestrosAforosVisitas().get(0)).orElse(null);
			if(mav==null) {
				l.setMensaje("Proceso liquidado");
				l.setEstado("L");
			}else if (mav.getDetallesMaestrosVisitas().stream().anyMatch(d-> "P".equalsIgnoreCase(d.getDmafEstado()))) {
				l.setMensaje("Proceso pendiente visitas");
				l.setEstado("P");
			}else {
				l.setMensaje("Proceso pre liquidado");
				l.setEstado("PL");
			}

		return l;
	}

	public List<SearchResponseDTO> mapAforosToListOfSearchResponseMultiDTO(List<Aforo> aforos){
		this.tiposAforos = unidadAforosServiceImpl.getTiposAforos();
		List<SearchResponseDTO> response = new ArrayList<>();
		org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);

		aforos.forEach(a->{
			SearchResponseDTO s = new SearchResponseDTO();
			s.setNombreMultiusuario("-");
			s.setIdAforo(a.getAfoIderegistro());
			s.setFechaFinal(DateUtil.dateToString(a.getAfoFechafinvegencia()));
			s.setTipoAforo(this.getTipoAforo(a.getUniTipoaforo().getTafoIderegistro()));

			if(a.getDetallesAforo()!=null && !a.getDetallesAforo().isEmpty()) {
				DsusDetsuscrip dsus= a.getDetallesAforo().get(0).getDsusIderegistr();//dsusRepository.findById(a.getDetallesAforo().get(0).getDsusIderegistr()).orElse(null);
				UniUnidad u= unidadAforosServiceImpl.getById(dsus.getUniActsuscripc());
				s.setActividad(getValueFromUni(u));
			}
			s.setCodActualizacion(1L);
			s.setDireccion("-");
			s.setPesoToneladas(0D);
			s.setFechaInicio(DateUtil.dateToString(a.getAfoFechainicio()));
			if(a.getDetallesAforo()!=null && !a.getDetallesAforo().isEmpty()) {
				DsusDetsuscrip dsus= a.getDetallesAforo().get(0).getDsusIderegistr();//dsusRepository.findById(a.getDetallesAforo().get(0).getDsusIderegistr()).orElse(null);
				Optional<ProPropiedad> pro = propiedadRepository.findById(Long.valueOf(Optional.ofNullable(dsus.getProIderegistro()).orElse(-1L).toString()));
				if(pro.isPresent())
					s.setDireccion(pro.get().getProDireccion());
			}
			List<MaestroAforoVisita> maestros= maestroAforoVisitaRepository.getVisitasByAforo(a.getAfoIderegistro());
			if(!maestros.isEmpty()) {
				MaestroAforoVisita m = maestros.get(0);
				s.setPesoToneladas(m.getDetallesMaestrosVisitas().stream().mapToDouble(i-> Optional.ofNullable(i.getDmafPesoaforo()).orElse(0D)).sum()/1000D);
			}
			s.setCantidadUsuarios(a.getDetallesAforo().size());
			Long uni_multiusuario = hya_parametros.getLong("uni_multiusuario");
			if(a.getUniClasesuscripcionaforo().getUniIderegistro().equals(uni_multiusuario)) {
				List<Tuple>tuplas=searchComponentServiceImpl.getInfoAdicionalMultiusuario(a.getAfoIderegistro(),uni_multiusuario.toString());
				if(!tuplas.isEmpty()) {
					tuplas.stream().forEach((t)->{
						t.getElements().stream().forEach(t2->{
							if(t2.getAlias().equalsIgnoreCase("cantidad"))s.setCantidadUsuarios(t.get(t2.getAlias(),BigInteger.class).intValue());
							if(t2.getAlias().equalsIgnoreCase("nombreMultiusuario"))s.setNombreMultiusuario(t.get(t2.getAlias(), String.class));
							if(t2.getAlias().equalsIgnoreCase("complemento"))s.setUniComplemento(t.get(t2.getAlias(),Integer.class).longValue());
						});
					});
				}
			}
			s.setDistribucion(a.getAforoMultiusuario().getAfomDistribucion());
			s.setEstado(a.getAfoEstado());
			s.setObservaciones(a.getAfoObservaciones());
			//System.err.println("que tiene la clase "+a.getUni_clasesuscripcionaforo());
			//s.setClaseSuscripcion(unidadAforosServiceImpl.getById(a.getUni_clasesuscripcionaforo()).getUniNombre1());
			response.add(s);
		});
		return response;
	}

	public SearchResponseAforoMultiDTO mapAforosToSearchResponseAforoMultiDTO(Aforo aforo){
		this.tiposAforos = unidadAforosServiceImpl.getTiposAforos();
			SearchResponseAforoMultiDTO response = new SearchResponseAforoMultiDTO();
			response.setIdAforo(aforo.getAfoIderegistro());
			response.setAfo_fecha(DateUtil.dateToString(aforo.getAfoFecha()));
			response.setUni_tipoaforo(aforo.getUniTipoaforo().getTafoIderegistro());
			response.setAfo_fechaInicio(DateUtil.dateToString(aforo.getAfoFechainicio()));
			response.setAfo_fechafinvegencia(DateUtil.dateToString(aforo.getAfoFechafinvegencia()));
			response.setAfo_numpqr(aforo.getAfoNumpqr());
			//Elininar campo
			//response.setAfo_frecuenciaRecoleccion(aforo.getAfoFrecuenciarecoleccion());
			response.setAfo_estado(aforo.getAfoEstado());
			response.setTer_aforador(aforo.getTerAforador().getTerIderegistro());
			response.setMafv_factor(String.valueOf(aforo.getMafvFactor()));
			response.setAfo_observaciones(aforo.getAfoObservaciones());

			List<DafoDetAforoDTO> listaDafo = new ArrayList<>();
			DafoDetAforoDTO dtoDafo = null;
			for (DetalleAforo detalles : aforo.getDetallesAforo()) {
				dtoDafo = new DafoDetAforoDTO();
				dtoDafo.setAfoNumpqr(detalles.getAfoNumpqr());
				dtoDafo.setDafoMultiusuporcentaje(detalles.getDafoMultiusuporcentaje());
				dtoDafo.setDsusIderegistr(detalles.getDsusIderegistr().getDsusIderegistr());
				listaDafo.add(dtoDafo);
			}
			response.setDafoDetAforo(listaDafo);
			//ELIMNAR CAMPO
			//response.setAfo_cantidadfrecuenciarecoleccion(aforo.getAfoCantidadfrecuenciarecoleccion());
			if (aforo.getAforoMultiusuario() != null) {
			   response.setAfom_distribucion(aforo.getAforoMultiusuario().getAfomDistribucion());
			}
			if (aforo.getRureIderegistro() != null) {
				response.setRure_idregistro(aforo.getRureIderegistro());
			}



		return response;
	}

	public List<SearchResponseDTO> mapAforosToListOfSearchResponseDTO(List<Aforo> aforos){
		this.tiposAforos = unidadAforosServiceImpl.getTiposAforos();
		List<SearchResponseDTO> response = aforos.stream()
			    .filter(a -> a.getDetallesAforo() != null && !a.getDetallesAforo().isEmpty())
			    .filter(a -> a.getMaestrosAforosVisitas() != null && !a.getMaestrosAforosVisitas().isEmpty())
			    .map(a -> {
			        SearchResponseDTO s = new SearchResponseDTO();

			        DsusDetsuscrip dsus = a.getDetallesAforo().get(0).getDsusIderegistr();
			        Optional<IasusInforadicionalsuscripcion> iasus = iasusRepository.findByIdSus(dsus.getDsusIderegistr());
			        if(iasus.isPresent()) {
			        	s.setReferenciaComercial(iasus.get().getIasusReferenciacomercial());
			        	s.setActividadComercial(iasus.get().getIasusReferenciacomercial());
			        	s.setNombreEstablecimiento(iasus.get().getIasusNombreestablecimiento());
			        }

			        Optional<ProPropiedad> pro = propiedadRepository.findById(
			            Long.valueOf(Optional.ofNullable(dsus.getProIderegistro()).orElse(-1L).toString())
			        );
			        Optional<TerTercero> ter = Optional.of(dsus.getTerIderegistro());

			        List<DetalleAforo> dafo = dafoAforoServiceImpl.findDetallesAforo(a.getAfoIderegistro());
			        UniUnidad u = unidadAforosServiceImpl.getById(dsus.getUniActsuscripc());

			        if (!dafo.isEmpty()) {
			            s.setUniActSuscripc(
			                Long.parseLong(dafo.stream().map(DetalleAforo::getUniActsuscripc).findFirst().orElse(null).toString())
			            );
			        }

			        s.setIdSuscripcion(dsus.getDsusIderegistr());
			        s.setCodSuscripcion(dsus.getDsusPcodigo());
			        s.setActividad(getValueFromUni(u));

			        ter.ifPresent(t -> {
			            s.setNombresYapellidos(t.getTerNomcompleto());
			            s.setTerDocumento(t.getTerDocumento());
			        });

			        pro.ifPresent(p -> s.setDireccion(p.getProDireccion()));

			        UniUnidad uni = unidadAforosServiceImpl.getById(
			            a.getMaestrosAforosVisitas().get(0).getUniTipogenerador()
			        );
			        List<ConsolidadoLiquidacionVisitaAforo> c = consolidadoRepository.findConsolidadosByMaestro(
			            a.getMaestrosAforosVisitas().get(0).getMafvIderegistro()
			        );
			        s.setTipoGenerador(getValueFromUni(uni));

			        if (!c.isEmpty()) {
			            s.setVolumenTotal(Optional.ofNullable(c.get(0).getClvaVolumenAforadoLiq()).orElse(0D).toString());
			            s.setVolumenPromedio(Optional.ofNullable(c.get(0).getClvaVolumenAforado()).orElse(0D).toString());
			        }

			        s.setFactorProduccion(a.getMaestrosAforosVisitas().get(0).getMafvFactor());
			        s.setIdAforo(a.getAfoIderegistro());
			        s.setFechaFinal(DateUtil.dateToString(a.getAfoFechafinaforo()));
			        s.setFechaInicio(DateUtil.dateToString(a.getAfoFechainicio()));
			        s.setTipoAforo(this.getTipoAforo(a.getUniTipoaforo().getTafoIderegistro()));
			        s.setTafna("-");
			        s.setEstado(a.getAfoEstado());
			        s.setClaseSuscripcion(a.getUniClasesuscripcionaforo().getUniNombre1());

			        return s;
			    })
			    .collect(Collectors.toList());		
		return response;
	}

	public List<SearchResponseDTO> mapHAforosToListOfSearchResponseDTO(List<HafoAforos> haforos){
		this.tiposAforos = unidadAforosServiceImpl.getTiposAforos();
		List<SearchResponseDTO> response = new ArrayList<>();
		haforos.forEach(a->{
			SearchResponseDTO s = new SearchResponseDTO();
			s.setVolumenTotal("-");
			s.setActividad("-");
			s.setTipoGenerador("-");
			s.setNumAforoPadre("0");

			if(a.getHDetallesAforo()!=null && !a.getHDetallesAforo().isEmpty()) {
				DsusDetsuscrip dsus= dsusRepository.findById(a.getHDetallesAforo().get(0).getDsusIderegistr()).orElse(null);
				UniUnidad u= unidadAforosServiceImpl.getById(dsus.getUniActsuscripc());
				s.setActividad(getValueFromUni(u));
			}

			/*if(a.getMaestrosAforosVisitas()!=null && !a.getMaestrosAforosVisitas().isEmpty()) {
				UniUnidad u = unidadAforosServiceImpl.getById(a.getMaestrosAforosVisitas().get(0).getUni_tipogenerador());
				List<ConsolidadoLiquidacionVisitaAforo> c =consolidadoRepository.findConsolidadosByMaestro(a.getMaestrosAforosVisitas().get(0).getMafv_ideregistro());
				s.setTipoGenerador(getValueFromUni(u));

				if(!c.isEmpty())
					s.setVolumenTotal(Optional.ofNullable(c.get(0).getClva_volumen_aforado_liq()).orElse(0D).toString());
			}*/

			s.setIdAforo(a.getHafoIderegistro());
			if (a.getHafoIdeafopadre()!=null) s.setNumAforoPadre(a.getHafoIdeafopadre().toString());
			s.setFechaFinal(DateUtil.dateToString(a.getHafoFechafinvegencia()));
			s.setFechaInicio(DateUtil.dateToString(a.getHafoFechainicio()));

			s.setTipoAforo(this.getTipoAforo(a.getUniTipoaforo()));

			s.setTafna("-");
			s.setEstado(a.getHafoEstado());
			s.setClaseSuscripcion(unidadAforosServiceImpl.getById(a.getUniClasesuscripcionaforo()).getUniNombre1());


			response.add(s);
		});
		return response;
	}

	private String getValueFromUni(UniUnidad u) {
		return u!=null?u.getUniNombre1():"-";
	}

	private String getTipoAforo(Long uniTipoAforo) {
		StaticContentResponseDTO<String> tipoAforo = this.tiposAforos.stream().filter(i-> i.getId().compareTo(uniTipoAforo)==0).findFirst()
		.orElse(new StaticContentResponseDTO<String>());
		return Optional.ofNullable(tipoAforo.getObject()).orElse(EMPTY);

	}

}
