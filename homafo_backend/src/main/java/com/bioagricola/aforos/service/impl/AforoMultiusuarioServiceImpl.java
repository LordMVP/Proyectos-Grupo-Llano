package com.bioagricola.aforos.service.impl;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.log;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import java.util.HashSet;

import com.bioagricola.aforos.entity.Aforo;
import com.bioagricola.aforos.entity.AforoMultiusuario;
import com.bioagricola.aforos.entity.DetalleAforo;
import com.bioagricola.aforos.entity.dto.CredentialsDTO;
import com.bioagricola.aforos.entity.dto.DafoDetAforoDTO;
import com.bioagricola.aforos.entity.dto.EditAforoDTO;
import com.bioagricola.aforos.entity.dto.NewAforoDTO;
import com.bioagricola.aforos.entity.dto.NewAforoMultiDTO;
import com.bioagricola.aforos.entity.dto.SearchDTO;
import com.bioagricola.aforos.entity.dto.SearchResponseDTO;
import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.aforos.repository.AforoRepository;
import com.bioagricola.aforos.repository.IasusInforadicionalsuscripcionRepository;
import com.bioagricola.common.constant.UtilConstantes;
import com.bioagricola.common.entity.Barrios;
import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.common.entity.HrrHorrecoleccion;
import com.bioagricola.common.entity.IasusInforadicionalsuscripcion;
import com.bioagricola.common.entity.MbcdMunbardirec;
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
import com.bioagricola.homologaciones.entity.RureRutrecoleccion;
import com.bioagricola.homologaciones.entity.TafoTipoAforo;
import com.bioagricola.homologaciones.repository.BarriosRepository;
import com.bioagricola.homologaciones.repository.ProyectosRepository;
import com.bioagricola.homologaciones.service.impl.MubaMunbarrioService;
import com.bioagricola.homologaciones.service.impl.RureRutrecoleccionService;
import com.bioagricola.homologaciones.service.impl.TafoTipoAforoService;


@Service
public class AforoMultiusuarioServiceImpl {

	private static final String DATE_FORMAT="yyyy-MM-dd";
	private static final String EMPTY="-";
	private static final String DEFAULT = "-1";
	private static final Long SINCOMPLEMENTO = 6588L;
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
	private ProyectosRepository proyectosRepository;
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
	private TafoTipoAforoService tafoService;

	@Autowired
	private RureRutrecoleccionService rureService;

	@Autowired
    private ParParametroService _parParametroService;
	
	@Autowired
	private MubaMunbarrioService mubaService;
	
	Logger log = LoggerFactory.getLogger(this.getClass());


	public List<SearchResponseDTO> searchAforos(SearchDTO searchDTO){
		return bDToDTOUtil.mapAforosToListOfSearchResponseMultiDTO(searchComponentServiceImpl.getAforosBusquedaMultiusuario(searchDTO,UtilConstantes.MULTIUSUARIO));
	}

	private Long getLongFromObject(Object object) {
		Long result = null;
        try {
        	if (object instanceof BigInteger) {
        		result = ((BigInteger) object).longValue();
        	} else if (object instanceof Long) {
                result = ((Long) object).longValue();
            } else if (object instanceof Integer) {
                result = ((Integer) object).longValue();
            } else if (object instanceof String) {
                result = Long.valueOf((String) object);
            } else if (object instanceof Short) {
            	result = Long.valueOf((Short) object);
            }
        } catch (Exception e) {
            System.out.println("============= cannot cast:" + e.getLocalizedMessage());
            // do something
        }
        return result;
	}
	public NewAforoMultiDTO searchMultiAforosById(String id){
		/*Aforo aforo = aforoRepository.findAforoByNumeroAforo(Long.parseLong(id));
		return bDToDTOUtil.mapAforosToSearchResponseAforoMultiDTO(aforo);
		*/
		NewAforoMultiDTO multiDto = null;
		List<DafoDetAforoDTO>  dafoDtoList = new ArrayList<>();
		DafoDetAforoDTO dafoDto = null;




    	for(Object[] tmp2: this.aforoRepository.findMultiAforoById(id))
    	{

    		if (multiDto == null) {
    			multiDto  = new NewAforoMultiDTO();
    			multiDto.setUniTipoaforo(this.getLongFromObject(tmp2[1]));
    			multiDto.setAfoFecha(String.valueOf(tmp2[2]));
    			multiDto.setAfoFechaInicio(String.valueOf(tmp2[3]));
    			multiDto.setAfoFechafinvegencia(String.valueOf(tmp2[4]));
    			multiDto.setAfoNumpqr(String.valueOf(tmp2[5]));
    			multiDto.setUniClaseSuscripcionaforo(this.getLongFromObject(tmp2[7]));
    			multiDto.setAfoEstado(String.valueOf(tmp2[6]));
    			multiDto.setTerAforador(getLongFromObject(tmp2[8]));
    			multiDto.setMafvFactor(String.valueOf(tmp2[10]));
    			multiDto.setAfoObservaciones(String.valueOf(tmp2[12]));
    			multiDto.setRureIdregistro(String.valueOf(tmp2[17]));
    			multiDto.setAfomDistribucion(String.valueOf(tmp2[26]));
    			multiDto.setAfoIdeafopadre(this.getLongFromObject(tmp2[15]));
    			multiDto.setAfoFechaActualizacion(String.valueOf(tmp2[16]));
    			multiDto.setConceptoAforo(this.getLongFromObject(tmp2[14]));
    			multiDto.setAfomDireccion(String.valueOf(tmp2[36]));
    			multiDto.setAfomDescripcion(String.valueOf(tmp2[37]));
    			multiDto.setDistribucionUniforme((Boolean)tmp2[38]);
    		}

    		dafoDto = new DafoDetAforoDTO();
    		dafoDto.setAfoNumpqr(String.valueOf(tmp2[21]));
    		dafoDto.setDsusIderegistr(this.getLongFromObject(tmp2[18]));
    		dafoDto.setDafoMultiusuporcentaje(String.valueOf(tmp2[22]));
    		dafoDto.setCodigo(String.valueOf(tmp2[19]));
    		dafoDto.setNombre(String.valueOf(tmp2[23]));
    		dafoDto.setDireccion(String.valueOf(tmp2[25]));
    		dafoDto.setNombreBarrio(String.valueOf(tmp2[24]));
    		dafoDto.setCodigoBarrio(String.valueOf(tmp2[20]));

    		dafoDto.setUniActsuscripc(this.getLongFromObject(tmp2[27]));
    		if (tmp2[28] != null) {
    			dafoDto.setIasusNombreestablecimiento(String.valueOf(tmp2[28]));
    		}
    		if (tmp2[29] != null) {
    			dafoDto.setIasusReferenciacomercial(String.valueOf(tmp2[29]));
    		}
    		dafoDto.setCmpDireccion(String.valueOf(tmp2[33]));

    		dafoDto.setEmpresaSus(String.valueOf(tmp2[34]));
    		dafoDto.setTipoUsoSus(String.valueOf(tmp2[31]));
    		dafoDto.setEstadoSus(String.valueOf(tmp2[32]));
    		dafoDto.setEstrato(this.getLongFromObject(tmp2[35]));

    		dafoDtoList.add(dafoDto);
    	}

    	if (dafoDtoList != null && dafoDtoList.size()>0) {
    		multiDto.setDafoDetAforo(dafoDtoList);
    	}


    	return multiDto;
	}



	@org.springframework.transaction.annotation.Transactional(rollbackFor = Exception.class)
	public Aforo saveAforo(NewAforoMultiDTO dto) {

		Set<String> estadosValidos = new HashSet<>(Arrays.asList(
			    UtilConstantes.ESTADO_EN_PROCESO
			));
		
		this.validateExistentePrevio(dto.getDafoDetAforo(),estadosValidos);
		
		org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);
		UniUnidad uniClaseSuscripcion = uniUnidadRepository.findByEstructuraAndUniNombre1(
				hya_parametros.getLong("est_clases_suscripcion"), UtilConstantes.CLASE_SUSC_MULTIUSUARIO).get(0);
		CredentialsDTO credentials = authenticationFacade.getCredentials();
		
		Aforo aforo = new Aforo();
		TafoTipoAforo tipoAforo = tafoService.findById(dto.getUniTipoaforo());
		aforo.setUniTipoaforo(tipoAforo);
		aforo.setAfoFecha(DateUtil.stringToDate(DATE_FORMAT, dto.getAfoFecha()));
		aforo.setAfoFechainicio(DateUtil.stringToDate(DATE_FORMAT, dto.getAfoFechaInicio()));
		aforo.setAfoFechafinvegencia(DateUtil.stringToDate(DATE_FORMAT, dto.getAfoFechafinvegencia()));
		aforo.setAfoNumpqr(dto.getAfoNumpqr());
		aforo.setUniClasesuscripcionaforo(uniClaseSuscripcion);
		aforo.setAfo_frecuenciarecoleccion(dto.getTfdDescripcion());
		aforo.setAfoEstado(dto.getAfoEstado());
		aforo.setTerAforador(terTerceroRepository.findById(dto.getTerAforador()).orElse(null));
		aforo.setMafvFactor(tipoAforo.getTafoFactorProduccion().doubleValue());
		aforo.setUsuIderegistro(credentials.getUsuprgunid());
		aforo.setAfoObservaciones(dto.getAfoObservaciones());
		
		aforo.setAfoFrecuenciaRecoleccion(dto.getFrecuencia());
		aforo.setTfd_ideregistro(Long.parseLong(dto.getTfdIderegistro().toString()));
		
		try {
			List<RureRutrecoleccion> rure = rureService.findRureEntityByBarrioAndEstado(dto.getBarrioIderegistro(), "A");
			if(!rure.isEmpty()) 
				aforo.setRureIderegistro(rure.stream().findFirst().get().getRureIderegistro());
		}catch (BusinessException ex) {
	        return null;  
	    }	
		
		aforo.setBarrioIderegistro(dto.getBarrioIderegistro());
		aforo.setAfoIdeAfoPadre(dto.getAfoIdeafopadre());
		aforo.setUniComplemento(uniUnidadRepository.findById(dto.getConceptoAforo()).orElse(null));
		aforo.setAfoDistribucionUniforme(dto.getDistribucionUniforme());
		aforo.setUniTipogenerador(UtilConstantes.RESIDENCIAL);		
		boolean valTipoUso = false;	

		DetalleAforo det = null;
		List<DetalleAforo> listaDetalle = new ArrayList<>(1);

		for (DafoDetAforoDTO detDto : dto.getDafoDetAforo()) {
			det = new DetalleAforo();
			det.setDsusIderegistr(dsusDetsuscripRepository.findById(detDto.getDsusIderegistr()).orElse(null));
			//el num pqr en aforo normal esta tomando el numpqr del Aforo,
			//como en mulltiusuario hay un campo numpqr que se esta capturando en la tabla
			//se graba este.
			det.setAfoNumpqr(detDto.getAfoNumpqr()==null ? "" : detDto.getAfoNumpqr());
			det.setDafoMultiusuporcentaje(detDto.getDafoMultiusuporcentaje());
			det.setAforo(aforo);
			//datos repetidos que ya estan en aforo, no deberian estar tambien en el detalle
			det.setDafoFecharegistro(aforo.getAfoFecha());
			det.setUsuIderegistro(aforo.getUsuIderegistro());
			det.setAfoFechafinvegencia(aforo.getAfoFechafinvegencia());
		    det.setAfoNumpqr(aforo.getAfoNumpqr());
		    det.setUniActsuscripc(detDto.getUniActsuscripc() == null
		    		? UtilConstantes.VIVIENDA 
		    		: Integer.parseInt(detDto.getUniActsuscripc().toString()));
		    
		    listaDetalle.add(det);

		    boolean hasInfoAdicional = Optional.ofNullable(detDto.getIasusNombreestablecimiento())
		            .filter(s -> !s.isEmpty())
		            .isPresent() ||
		        Optional.ofNullable(detDto.getIasusReferenciacomercial())
		            .filter(s -> !s.isEmpty())
		            .isPresent();

		    if (hasInfoAdicional) {

		        IasusInforadicionalsuscripcion iasus = iasusInforadicionalsuscripcionRepository
		                .findInfoAdicionalSuscripcion(detDto.getDsusIderegistr())
		                .stream().findFirst()
		                .orElse(new IasusInforadicionalsuscripcion());

		        DsusDetsuscrip dsus = dsusDetsuscripRepository
		                .findById(detDto.getDsusIderegistr())
		                .orElseThrow(() -> new BusinessException("No existe la suscripción"));

		        Optional.ofNullable(iasus.getSusIderegistro())
		                .orElseGet(() -> {
		                    iasus.setSusIderegistro(dsus.getSusIderegistro());
		                    return dsus.getSusIderegistro();
		                });

		        Optional.ofNullable(iasus.getDsusIderegistr())
		                .orElseGet(() -> {
		                    iasus.setDsusIderegistr(dsus.getDsusIderegistr());
		                    return dsus.getDsusIderegistr();
		                });

		        Map<String, Consumer<String>> setters = new HashMap<>();
		        setters.put(detDto.getIasusNombreestablecimiento(), iasus::setIasusNombreestablecimiento);
		        setters.put(detDto.getIasusReferenciacomercial(), iasus::setIasusReferenciacomercial);

		        setters.forEach((value, setter) -> {
		            Optional.ofNullable(value)
		                    .filter(s -> !s.isEmpty())
		                    .ifPresent(setter);
		        });

		        Optional.ofNullable(iasus.getSusIderegistro())
		                .ifPresent(val -> iasusInforadicionalsuscripcionRepository.save(iasus));

		        Optional.ofNullable(det.getUniActsuscripc())
		                .filter(val -> val >= 0)
		                .ifPresent(val -> {
		                    dsus.setUniActsuscripc(Long.parseLong(val.toString()));
		                    dsusDetsuscripRepository.save(dsus);
		                });
		        if (dsus.getUniTipusosuscr().equals(UtilConstantes.COMERCIAL)) valTipoUso = true;
		    }
		    
		}
		if(valTipoUso) aforo.setUniTipogenerador(UtilConstantes.COMERCIAL); 
		aforo.setDetallesAforo(listaDetalle);

		List <Object []> listadoMbcd = new ArrayList<>();
		if (dto.getComplementoIdregistro() == null) {
			listadoMbcd = mubaService.findComplementoMultiusuarioByUnidad(SINCOMPLEMENTO);
		} else {
			listadoMbcd = mubaService.findComplementoMultiusuarioByMbcd(dto.getComplementoIdregistro());
		}
		AforoMultiusuario aforoMultiusuario= new AforoMultiusuario();
		aforoMultiusuario.setAforo(aforo);
		aforoMultiusuario.setAfomDistribucion(dto.getAfomDistribucion());
		aforoMultiusuario.setAfomDireccion(dto.getAfomDireccion());
		aforoMultiusuario.setAfomDescripcion(dto.getAfomDescripcion());
		aforoMultiusuario.setAfomDistribucionNombre(dto.getAfomDistribucionNombre());
		
		if (!listadoMbcd.isEmpty()) {
			Long complemento = null;
			Object value = listadoMbcd.get(0)[1];
			if (value instanceof Long) {
				complemento = (Long) value;
			} else if (value instanceof Integer) {
				complemento = ((Integer) value).longValue();
			}
			aforoMultiusuario.setAfomComplemento(complemento);
			aforoMultiusuario.setAfomNombreMultiusuario((String)listadoMbcd.get(0)[2]);
		}		
		
		aforo.setAforoMultiusuario(aforoMultiusuario);
		aforo = this.aforoRepository.save(aforo);
		
		maestroAforoVisitaServiceImpl.crearVisitas(aforo, authenticationFacade.getCredentials().getUsuprgunid(),
				Integer.parseInt( aforo.getTfd_ideregistro().toString()),aforo.getAfoFrecuenciaRecoleccion());

	    return aforo;
	}

	@Transactional
	public Aforo saveAforo(NewAforoDTO dto) {

		//this.validateExistentePrevio(dto);
		org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);
		UniUnidad uniClaseSuscripcion = uniUnidadRepository.findByEstructuraAndUniNombre1(hya_parametros.getLong("est_clases_suscripcion"), UtilConstantes.CLASE_SUSC_INDIVIDUAL).get(0);
		CredentialsDTO c = authenticationFacade.getCredentials();

		Aforo a = new Aforo();
		a.setUniTipoaforo(tafoService.findById(dto.getUniTipoAforo()));
		a.setAfoFecha(DateUtil.stringToDate(DATE_FORMAT, dto.getFechaRegistro()));
		a.setAfoFechainicio(DateUtil.stringToDate(DATE_FORMAT, dto.getVigenciaDesde()));
		a.setAfoFechafinvegencia(DateUtil.stringToDate(DATE_FORMAT, dto.getVigenciaHasta()));
		a.setAfoNumpqr(dto.getNumPqr());
		a.setUniClasesuscripcionaforo(uniClaseSuscripcion);
		//a.setAfoFrecuenciarecoleccion(dto.getFrecuenciaRecoleccion());
		a.setAfoEstado(dto.getEstado());
		a.setTerAforador(terTerceroRepository.findById(dto.getTecnicoAforador()).orElse(null));
		a.setUsuIderegistro(c.getUsuprgunid());
		a.setAfoObservaciones(dto.getObservaciones());
		a.setMafvFactor(Double.valueOf(Optional.ofNullable(dto.getFactor()).orElse("0")));


		return this.aforoRepository.save(a);
	}

	private void validateExistentePrevio(List<DafoDetAforoDTO> lista,Set<String> estados) {
		List<Long> idsConAforoEnProceso = lista.stream()
			    .filter(l -> estados.stream()
			        .anyMatch(estado -> !aforoRepository.findAforoByDsusAndEstado(
			                                l.getDsusIderegistr(), 
			                                estado
			                             ).isEmpty()))
			    .map(l -> l.getDsusIderegistr())
			    .collect(Collectors.toList());
		
		if (!idsConAforoEnProceso.isEmpty()) {
		    String ids = idsConAforoEnProceso.stream()
		                .map(String::valueOf)
		                .collect(Collectors.joining(", "));
		    
		    throw new BusinessException(String.format("Existen aforos activos para las suscripciones: [%s]", ids));
		}
	}


	@Transactional
	public Aforo updateMultiAforo(NewAforoMultiDTO dto) {

		Aforo aforo = aforoRepository.findAforoByNumeroAforo(Long.valueOf(dto.getAfoIderegistro()));

		CredentialsDTO credentials = authenticationFacade.getCredentials();

		aforo.setUniTipoaforo(tafoService.findById(dto.getUniTipoaforo()));
		aforo.setAfoFecha(DateUtil.stringToDate(DATE_FORMAT, dto.getAfoFecha()));
		aforo.setAfoFechainicio(DateUtil.stringToDate(DATE_FORMAT, dto.getAfoFechaInicio()));
		aforo.setAfoFechafinvegencia(DateUtil.stringToDate(DATE_FORMAT, dto.getAfoFechafinvegencia()));
		aforo.setAfoNumpqr(dto.getAfoNumpqr());
		aforo.setUniClasesuscripcionaforo(uniUnidadRepository.findById(dto.getUniClaseSuscripcionaforo()).orElse(null));
		//CAMPO NO APLICA ELIMNAR
		//aforo.setAfoFrecuenciarecoleccion(dto.getAfoFrecuenciaRecoleccion());
		aforo.setAfoEstado(dto.getAfoEstado());
		aforo.setTerAforador(terTerceroRepository.findById(dto.getTerAforador()).orElse(null));
		aforo.setMafvFactor(Double.valueOf(Optional.ofNullable(dto.getMafvFactor()).orElse("0")));
		aforo.setUsuIderegistro(credentials.getUsuprgunid());
		aforo.setAfoObservaciones(dto.getAfoObservaciones());
		aforo.setBarrioIderegistro(dto.getBarrioIderegistro());
		//uni_complemento -> se precargar segun el barrio seleccionado
		aforo.setAfoIdeAfoPadre(dto.getAfoIdeafopadre());
		aforo.setAfoFechaActualizacion(new Date());
		aforo.setRureIderegistro(Long.valueOf(dto.getRureIdregistro()));
		//ELIMINAR CAMPO
		//aforo.setAfoCantidadfrecuenciarecoleccion(dto.getAfoCantidadfrecuenciarecoleccion());
		aforo.setAfoDistribucionUniforme(dto.getDistribucionUniforme());


		//actualizando detalles
		boolean existe= false;
		DetalleAforo det = null;

		List<DetalleAforo>listaAeliminar= new ArrayList<>(1);
		//eliminar los que no esten en el Dto

		DetalleAforo detalleEliminar = null;
		List<DetalleAforo> listaDetalles = aforo.getDetallesAforo();

		for (int i=0; i < aforo.getDetallesAforo().size();i++ ) {
			 detalleEliminar= aforo.getDetallesAforo().get(i);

			for (DafoDetAforoDTO detDto : dto.getDafoDetAforo()) {
				if (detDto.getDsusIderegistr().equals(detalleEliminar.getDsusIderegistr())) {
					existe = true;
					break;
				}else {
					existe = false;
				}
			}
			if (existe== false) {
				listaAeliminar.add(detalleEliminar);
			}
		}

		for (DetalleAforo indexEliminar: listaAeliminar) {
			listaDetalles.remove(indexEliminar);
		}

		//actualizar los existentes
		for (DafoDetAforoDTO detDto : dto.getDafoDetAforo()) {
			for (DetalleAforo detalle :listaDetalles) {
				//existentes
				if (detDto.getDsusIderegistr().equals(detalle.getDsusIderegistr())) {
					detalle.setAfoNumpqr(detDto.getAfoNumpqr());
					detalle.setDafoMultiusuporcentaje(detDto.getDafoMultiusuporcentaje());
					detalle.setDafoFechactualizacion(new Date());
					existe = true;
					break;
				}else {
					existe = false;
				}
			}
			if (existe == false) {
				//si no existe se crea nuevo detalle
				det = new DetalleAforo();
	  			det.setDsusIderegistr(dsusDetsuscripRepository.findById(detDto.getDsusIderegistr()).orElse(null));
	  			det.setAfoNumpqr(detDto.getAfoNumpqr());
	  			det.setDafoMultiusuporcentaje(detDto.getDafoMultiusuporcentaje());
	  			det.setAforo(aforo);

	  			det.setDafoFecharegistro(aforo.getAfoFecha());
	  			det.setUsuIderegistro(aforo.getUsuIderegistro());
	  			aforo.getDetallesAforo().add(det);
			}
		}

		aforo.setDetallesAforo(listaDetalles);

		aforo.getAforoMultiusuario().setAfomDistribucion(dto.getAfomDistribucion());
		aforo.getAforoMultiusuario().setAfomDireccion(dto.getAfomDireccion());
		aforo.getAforoMultiusuario().setAfomDescripcion(dto.getAfomDescripcion());

		return this.aforoRepository.save(aforo);

	}
	/**
	 * TODO Actualizar Barrio
	 * Fecha Incial, fecha prorroga
	 * @param dto
	 * @return
	 */
	@Transactional
	public Aforo editAforo(NewAforoMultiDTO dto) {

		Aforo aforo = aforoRepository.findAforoByNumeroAforo(Long.valueOf(dto.getAfoIderegistro()));

		if ((dto.getAfomDistribucion() != null) && (!dto.getAfomDistribucion().isEmpty())) {
			aforo.getAforoMultiusuario().setAfomDistribucion(dto.getAfomDistribucion());
		}

		aforo.getAforoMultiusuario().setAfomDireccion(dto.getAfomDireccion());
		aforo.getAforoMultiusuario().setAfomDescripcion(dto.getAfomDescripcion());
		aforo.setAfoDistribucionUniforme(dto.getDistribucionUniforme());

		DsusDetsuscrip dsus;

		IasusInforadicionalsuscripcion iasus;
		List<DetalleAforo> detalleList = aforo.getDetallesAforo();
		DetalleAforo detalle;

		for (DafoDetAforoDTO det:dto.getDafoDetAforo()) {
			/*Actualizacion de infromacion adicional de suscriptores*/
			dsus = dsusDetsuscripRepository.findById(det.getDsusIderegistr()).get();

			iasus = iasusInforadicionalsuscripcionRepository.findInfoAdicionalSuscripcion(det.getDsusIderegistr())
					.stream().findFirst().orElse(new IasusInforadicionalsuscripcion());

			iasus.setIasusNombreestablecimiento(det.getIasusNombreestablecimiento());
			iasus.setIasusReferenciacomercial(det.getIasusReferenciacomercial());

			if ((iasus != null)&& iasus.getSusIderegistro() != null) {
				iasusInforadicionalsuscripcionRepository.save(iasus);
			}

			if(det.getUniActsuscripc()!=null && det.getUniActsuscripc()>=0) {
				dsus.setUniActsuscripc(det.getUniActsuscripc());
				dsusDetsuscripRepository.save(dsus);
			}

			/*actualizacion de detalles aforo si llega a cambiar algun suscriptor*/
			detalleList.stream().filter(item ->item.getDsusIderegistr().getDsusIderegistr() == det.getDsusIderegistr()).forEach(i -> i.setDafoMultiusuporcentaje(det.getDafoMultiusuporcentaje()));

			/*si no existe en la tabla es por que se añadio un nuevo suscriptor a la tabla*/
			if (!detalleList.stream().anyMatch(item -> item.getDsusIderegistr().getDsusIderegistr() == det.getDsusIderegistr())) {
				detalle = new DetalleAforo();
				detalle.setDsusIderegistr(dsusDetsuscripRepository.findById(det.getDsusIderegistr()).orElse(null));
				detalle.setAfoNumpqr(det.getAfoNumpqr());
				detalle.setDafoMultiusuporcentaje(det.getDafoMultiusuporcentaje());
				detalle.setAforo(aforo);
				detalle.setDafoFecharegistro(aforo.getAfoFecha());
				detalle.setUsuIderegistro(aforo.getUsuIderegistro());
				detalleList.add(detalle);
			}
		}

		/*eliminacion de un suscriptor de la tabla*/
		List<Long> listaEliminar = new ArrayList<>(1);
		for (DetalleAforo d : detalleList) {
			boolean existe = dto.getDafoDetAforo().stream().anyMatch(itemDto -> d.getDsusIderegistr().getDsusIderegistr() == itemDto.getDsusIderegistr());

			if (!existe) {
				listaEliminar.add(d.getDsusIderegistr().getDsusIderegistr());
			}
		}

		listaEliminar.forEach(id -> detalleList.removeIf(d -> d.getDsusIderegistr().getDsusIderegistr() == id));
		listaEliminar = null;

		aforo.setDetallesAforo(detalleList);
		aforo.setAfoFechaActualizacion(new Date());

		aforo.setAfoObservaciones(dto.getAfoObservaciones());
		aforo = aforoRepository.save(aforo);

		return aforo;
	}

	public EditAforoDTO getById(String numeroAforo) {
		EditAforoDTO e = new EditAforoDTO();
		Aforo aforo 		 = aforoRepository.findAforoByNumeroAforo(Long.parseLong(numeroAforo));
		DetalleAforo detalle = aforo.getDetallesAforo().get(0);
		DsusDetsuscrip dsus  = detalle.getDsusIderegistr();//dsusDetsuscripRepository.findById(detalle.getDsusIderegistr()).orElse(new DsusDetsuscrip());
		TerTercero tercero 	 = terTerceroRepository.findById(aforo.getTerAforador().getTerIderegistro()).orElse(new TerTercero());
		ProPropiedad pro 	 = propiedadRepository.findById(dsus.getProIderegistro()).orElse(new ProPropiedad());
		Optional<UniUnidad> uniActividad= uniUnidadRepository.findById(dsus.getUniActsuscripc());
		IasusInforadicionalsuscripcion iasus = iasusInforadicionalsuscripcionRepository.findInfoAdicionalSuscripcion(tercero.getTerIderegistro())
				.stream().findFirst().orElse(null);

			e.setIdMunicipio(proyectosRepository.findMunicipioByDsus(dsus.getProIderegistro()).get(0).getProyectoIderegistro());

		Barrios barrio = barriosRepository.findBarriosByMunicipio(e.getIdMunicipio()).stream().findFirst().orElse(new Barrios());

			e.setBarrio(barrio.getBarrioNom());
			e.setIdBarrio(barrio.getBarrioIderegistro());
			e.setEstado(aforo.getAfoEstado());
			e.setVigenciaDesde(DateUtil.dateToString(aforo.getAfoFechainicio()));
			e.setVigenciaHasta(DateUtil.dateToString(aforo.getAfoFechafinvegencia()));
			e.setFechaCreacion(DateUtil.dateToString(detalle.getDafoFecharegistro()));
			e.setFechaActualizacion(DateUtil.dateToString(detalle.getDafoFechactualizacion()));
			e.setObservaciones(aforo.getAfoObservaciones());
			e.setCodUsuario(dsus.getDsusPcodigo());
			e.setNombreUsuario(tercero.getTerNomcompleto());
			e.setDireccion(pro.getProDireccion());
			e.setActividadComercial(uniActividad.isPresent()?uniActividad.get().getUniNombre1():EMPTY);
			e.setSantoSenia(iasus!=null?iasus.getIasusNombreestablecimiento():EMPTY);
			e.setNumAforo(String.valueOf(aforo.getAfoIderegistro()));
			e.setSuscripcion(dsus.getDsusIderegistr().toString());
			e.setNombresApellidoTercero(tercero.getTerNomcompleto());
			e.setDocumentoTercero(tercero.getTerDocumento());

			Optional<UniUnidad> tipoGenerador = uniUnidadRepository.findById(maestroAforoVisitaServiceImpl.getUniTipoGeneradorByAforo(aforo.getAfoIderegistro()));
			e.setTipoGenerador(tipoGenerador.isPresent()?tipoGenerador.get().getUniNombre1():"En proceso de aforo");
			e.setIdTipoGenerador(tipoGenerador.isPresent()?tipoGenerador.get().getUniIderegistro():0L);
			e.setFechaInicial(DateUtil.dateToString(aforo.getAfoFechainicio()));
			e.setFechaProrroga(DateUtil.dateToString(aforo.getAfoFechafinvegencia()));
		return e;
	}

	public SearchResponseDTO searchSuscripcion(SearchDTO searchDTO){

		if(StringUtils.isEmpty(searchDTO.getSuscripcion()))
			searchDTO.setSuscripcion(DEFAULT);
		if(StringUtils.isEmpty(searchDTO.getCodigoSub()))
			searchDTO.setCodigoSub(DEFAULT);
		if(StringUtils.isEmpty(searchDTO.getRadicadoPqrs()))
			searchDTO.setRadicadoPqrs(DEFAULT);

		CredentialsDTO c = authenticationFacade.getCredentials();
		DsusDetsuscrip dsus = dsusDetsuscripRepository.findByIdOrCodigoWithCredentials(c.getEstempresa(),
							  Long.valueOf(searchDTO.getSuscripcion()),searchDTO.getCodigoSub(),searchDTO.getRadicadoPqrs())
							  .stream().findFirst().orElse(null);
		if(dsus!=null) {
			return this.transformDSus(searchDTO, c, dsus);
		}else {
			return new SearchResponseDTO();
		}
	}

	private SearchResponseDTO transformDSus(SearchDTO searchDTO,CredentialsDTO c,DsusDetsuscrip dsus) {
		String nombreTercero ="-";
		String nombreBarrio ="-";
		String direccion = "-";
		String tipoUso = "-";
		String frecuenciaRecoleccion="-";
		IasusInforadicionalsuscripcion iasus= new IasusInforadicionalsuscripcion();
		Optional<UniUnidad> uniUnidad= uniUnidadRepository.findById(dsus.getUniTipusosuscr());
		Optional<TerTercero> terTercero = Optional.of(dsus.getTerIderegistro());//terTerceroRepository.findById(Optional.ofNullable(dsus.getTerIderegistro()).orElse(0L));
		Optional<Barrios> barrio = Optional.of(dsus.getUniBarrio());
		Optional<ProPropiedad> proPropiedad = propiedadRepository.findById(Long.valueOf(Optional.ofNullable(dsus.getProIderegistro()).orElse(0L).toString()));
		Optional<HrrHorrecoleccion> hrrHor = hrrHorrecoleccionRepository.findFrecuenciaRecoleccion().stream().findFirst();
		Optional<UniUnidad> uniActividad= uniUnidadRepository.findById(dsus.getUniActsuscripc());
		if(terTercero.isPresent()) {
			nombreTercero = terTercero.get().getTerNomcompleto();
			iasus = iasusInforadicionalsuscripcionRepository.findInfoAdicionalSuscripcion(terTercero.get().getTerIderegistro())
					.stream().findFirst().orElse(new IasusInforadicionalsuscripcion());
		}
		if(barrio.isPresent())
			nombreBarrio = barrio.get().getBarrioNom();
		if(proPropiedad.isPresent())
			direccion = proPropiedad.get().getProDireccion();
		if(uniUnidad.isPresent())
			tipoUso = uniUnidad.get().getUniNombre1();
		if(hrrHor.isPresent())
			frecuenciaRecoleccion = hrrHor.get().getHrrDia().concat(hrrHor.get().getHrrHorinicio().toString().concat("-".concat(hrrHor.get().getHrrHorfin().toString())));

		SearchResponseDTO sr = new SearchResponseDTO();
						  sr.setCodSuscripcion(dsus.getDsusPcodigo());
						  sr.setIdSuscripcion(dsus.getDsusIderegistr());
						  sr.setIdEmpresa(c.getEstempresa());
						  sr.setIdUsuario(c.getUsuprgunid());
						  sr.setIdPropiedad(proPropiedad.isPresent()?proPropiedad.get().getProIderegistro():0L);
						  sr.setIdTercero(terTercero.isPresent()?terTercero.get().getTerIderegistro():0L);
						  sr.setNumPqr(!DEFAULT.equals(searchDTO.getRadicadoPqrs())?searchDTO.getRadicadoPqrs():this.getRadicadoPqr(searchDTO, c));
						  //sr.setFrecuenciaRecoleccion(frecuenciaRecoleccion);
						  sr.setReferenciaComercial(iasus.getIasusReferenciacomercial());
						  sr.setNombreEstablecimiento(iasus.getIasusNombreestablecimiento());
						  sr.setIdIasus(iasus.getIasusIderegistro());
						  sr.setNombresYapellidos(nombreTercero);
						  sr.setDireccion(direccion);
						  sr.setTipoUso(tipoUso);
						  sr.setActividadComercial(uniActividad.isPresent()?uniActividad.get().getUniNombre1():EMPTY);
						  sr.setBarrioUsuario(nombreBarrio);
		return sr;
	}

	private String getRadicadoPqr(SearchDTO searchDTO,CredentialsDTO c) {
		Reclamos reclamo= reclamosRepository.findByIdOrCodigoWithCredentials(c.getEstempresa(),c.getUsuprgunid(),
						  Long.valueOf(searchDTO.getSuscripcion()),searchDTO.getCodigoSub(),searchDTO.getRadicadoPqrs())
						  .stream().findFirst().orElse(null);
		return reclamo!=null ? reclamo.getReclamoNumpqr() : "";
	}

	public NewAforoMultiDTO searchMultiAforosByIdPadre(String id)
	{

		NewAforoMultiDTO multiDto = null;
		List<DafoDetAforoDTO>  dafoDtoList = new ArrayList<>();
		DafoDetAforoDTO dafoDto = null;




    	for(Object[] tmp2: this.aforoRepository.findMultiAforoByIdPadre(id))
    	{

    		if (multiDto == null) {
    			multiDto  = new NewAforoMultiDTO();
    			multiDto.setUniTipoaforo(this.getLongFromObject(tmp2[1]));
    			multiDto.setAfoFecha(String.valueOf(tmp2[2]));
    			multiDto.setAfoFechaInicio(String.valueOf(tmp2[3]));
    			multiDto.setAfoFechafinvegencia(String.valueOf(tmp2[4]));
    			multiDto.setAfoNumpqr(String.valueOf(tmp2[5]));
    			multiDto.setUniClaseSuscripcionaforo(this.getLongFromObject(tmp2[7]));
    			multiDto.setAfoEstado(String.valueOf(tmp2[6]));
    			multiDto.setTerAforador(getLongFromObject(tmp2[8]));
    			multiDto.setMafvFactor(String.valueOf(tmp2[10]));
    			multiDto.setAfoObservaciones(String.valueOf(tmp2[12]));
    			multiDto.setRureIdregistro(String.valueOf(tmp2[17]));
    			multiDto.setAfomDistribucion(String.valueOf(tmp2[26]));
    			multiDto.setAfoIdeafopadre(this.getLongFromObject(tmp2[15]));
    			multiDto.setAfoFechaActualizacion(String.valueOf(tmp2[16]));
    			multiDto.setConceptoAforo(this.getLongFromObject(tmp2[14]));
    			multiDto.setAfomDireccion(String.valueOf(tmp2[36]));
    			multiDto.setAfomDescripcion(String.valueOf(tmp2[37]));
    			multiDto.setDistribucionUniforme((Boolean)tmp2[38]);
    		}

    		dafoDto = new DafoDetAforoDTO();
    		dafoDto.setAfoNumpqr(String.valueOf(tmp2[21]));
    		dafoDto.setDsusIderegistr(this.getLongFromObject(tmp2[18]));
    		dafoDto.setDafoMultiusuporcentaje(String.valueOf(tmp2[22]));
    		dafoDto.setCodigo(String.valueOf(tmp2[19]));
    		dafoDto.setNombre(String.valueOf(tmp2[23]));
    		dafoDto.setDireccion(String.valueOf(tmp2[25]));
    		dafoDto.setNombreBarrio(String.valueOf(tmp2[24]));
    		dafoDto.setCodigoBarrio(String.valueOf(tmp2[20]));

    		dafoDto.setUniActsuscripc(this.getLongFromObject(tmp2[27]));
    		if (tmp2[28] != null) {
    			dafoDto.setIasusNombreestablecimiento(String.valueOf(tmp2[28]));
    		}
    		if (tmp2[29] != null) {
    			dafoDto.setIasusReferenciacomercial(String.valueOf(tmp2[29]));
    		}
    		dafoDto.setCmpDireccion(String.valueOf(tmp2[33]));

    		dafoDto.setEmpresaSus(String.valueOf(tmp2[34]));
    		dafoDto.setTipoUsoSus(String.valueOf(tmp2[31]));
    		dafoDto.setEstadoSus(String.valueOf(tmp2[32]));
    		dafoDto.setEstrato(this.getLongFromObject(tmp2[35]));

    		dafoDtoList.add(dafoDto);
    	}

    	if (dafoDtoList != null && dafoDtoList.size()>0) {
    		multiDto.setDafoDetAforo(dafoDtoList);
    	}


    	return multiDto;
	}

}
