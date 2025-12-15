package com.bioagricola.hya.service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.bioagricola.aforos.repository.IasusInforadicionalsuscripcionRepository;
import com.bioagricola.arcgis.ApiArcGis;
import com.bioagricola.common.constant.UtilConstantes;
import com.bioagricola.common.entity.CnreCnvrecaudo;
import com.bioagricola.common.entity.CosuConsuscrip;
import com.bioagricola.common.entity.DsusDetsuscrip;
import com.bioagricola.common.entity.IasusInforadicionalsuscripcion;
import com.bioagricola.common.entity.LidsLiqdetsus;
import com.bioagricola.common.entity.RaprRutaAprovechamiento;
import com.bioagricola.common.entity.RrbaRutaRecoleccionBarrido;
import com.bioagricola.common.entity.RusuRutsuscrip;
import com.bioagricola.common.entity.RutRuta;
import com.bioagricola.common.entity.TerTercero;
import com.bioagricola.common.repository.CnreCnvrecaudoRepository;
import com.bioagricola.common.repository.DsusDetsuscripRepository;
import com.bioagricola.common.repository.ProPropiedadRepository;
import com.bioagricola.common.repository.RaprRutaAprovechamientoRepository;
import com.bioagricola.common.repository.RrbaRutaRecoleccionBarridoRepository;
import com.bioagricola.common.repository.RutRutaRepository;
import com.bioagricola.common.repository.TerTerceroRepository;
import com.bioagricola.common.repository.UniUnidadRepository;
import com.bioagricola.common.service.ParParametroService;
import com.bioagricola.homologaciones.entity.RureRutrecoleccion;
import com.bioagricola.homologaciones.entity.SusSuscripcion;
import com.bioagricola.homologaciones.repository.BarriosRepository;
import com.bioagricola.homologaciones.repository.CicCicloRepository;
import com.bioagricola.homologaciones.repository.CosuConsuscripRepository;
import com.bioagricola.homologaciones.repository.RureRutrecoleccionRepository;
import com.bioagricola.homologaciones.repository.SuscripcionRepository;
import com.bioagricola.homologaciones.service.impl.HomologacionService;
import com.bioagricola.hya.config.GeneralSpecification;
import com.bioagricola.hya.config.SearchCriteria;
import com.bioagricola.hya.dto.CosuConsuscripDTO;
import com.bioagricola.hya.dto.DsusDetsuscripDTO;
import com.bioagricola.hya.dto.FiltroDsusDTO;
import com.bioagricola.hya.dto.IasusInforadicionalsuscripcionDTO;
import com.bioagricola.hya.dto.RaprRutaAprovechamientoDTO;
import com.bioagricola.hya.dto.RrbaRutaRecoleccionBarridoDTO;
import com.bioagricola.hya.repository.LidsLiqdetsusRepository;
import com.bioagricola.hya.repository.RusuRutsuscripRepository;

import lombok.extern.log4j.Log4j2;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;

@Service
@Transactional
@Log4j2
public class DsusSuscripcionService {
    private final ProPropiedadRepository propiedadRepository;
    private final UniUnidadRepository unidadRepository;
    private final DsusDetsuscripRepository dsusRepository;
    private final RusuRutsuscripRepository rusuRepository;
    private final LidsLiqdetsusRepository liqdetsusRepository;
    private final BarriosRepository barriosRepository;
    private final IasusInforadicionalsuscripcionRepository inforadicionalsuscripcionRepository;
    private final CosuConsuscripRepository cosuConsuscripRepository;
    private final RrbaRutaRecoleccionBarridoRepository recoleccionBarridoRepository;
    private final RaprRutaAprovechamientoRepository rutaAprovechamientoRepository;
    private final RutRutaRepository rutaRepository;
    private final SuscripcionRepository suscripcionRepository;
    private final CnreCnvrecaudoRepository cnreCnvrecaudoRepository;
    private final RureRutrecoleccionRepository  rutrecoleccionRepository;
    private final TerTerceroRepository terceroRepository;
    private final HomologacionService homologacionService;
    private final Function<CosuConsuscrip, CosuConsuscripDTO> convertToCosuConsuscripDTO;
    private final Function<IasusInforadicionalsuscripcion, IasusInforadicionalsuscripcionDTO> convertToIasusInforadicionalsuscripcionDTO;
    private final Function<RaprRutaAprovechamiento, RaprRutaAprovechamientoDTO> convertToRaprRutaAprovechamientoDTO;
    private final CicCicloRepository cicCicloRepository;

    @Autowired
    private ParParametroService _parParametroService;
    
    @PersistenceContext
	private EntityManager em;
    
    /**
     * Constructor de la clase
     * @param propiedadRepository
     * @param unidadRepository
     * @param dsusRepository
     * @param rusuRepository
     * @param liqdetsusRepository
     * @param apiArcGis
     * @param inforadicionalsuscripcionRepository
     * @param cosuConsuscripRepository
     * @param recoleccionBarridoRepository
     * @param rutaAprovechamientoRepository
     * @param rutaRepository
     * @param suscripcionRepository
     * @param cnreCnvrecaudoRepository
     * @param rutrecoleccionRepository
     * @param terceroRepository
     * @param homologacionService
     * @param convertToCosuConsuscripDTO
     * @param convertToIasusInforadicionalsuscripcionDTO
     * @param convertToRrbaRutaRecoleccionBarridoDTO
     * @param convertToRaprRutaAprovechamientoDTO
     * @param cicCicloRepository
     */
    @Autowired
    public DsusSuscripcionService(ProPropiedadRepository propiedadRepository,
                                  UniUnidadRepository unidadRepository,
                                  DsusDetsuscripRepository dsusRepository,
                                  RusuRutsuscripRepository rusuRepository,
                                  LidsLiqdetsusRepository liqdetsusRepository,
                                  BarriosRepository barriosRepository,
                                  IasusInforadicionalsuscripcionRepository inforadicionalsuscripcionRepository,
                                  CosuConsuscripRepository cosuConsuscripRepository,
                                  RrbaRutaRecoleccionBarridoRepository recoleccionBarridoRepository,
                                  RaprRutaAprovechamientoRepository rutaAprovechamientoRepository,
                                  RutRutaRepository rutaRepository,
                                  SuscripcionRepository suscripcionRepository,
                                  CnreCnvrecaudoRepository cnreCnvrecaudoRepository,
                                  RureRutrecoleccionRepository rutrecoleccionRepository, TerTerceroRepository terceroRepository,
                                  HomologacionService homologacionService,
                                  Function<CosuConsuscrip, CosuConsuscripDTO> convertToCosuConsuscripDTO,
                                  Function<IasusInforadicionalsuscripcion, IasusInforadicionalsuscripcionDTO> convertToIasusInforadicionalsuscripcionDTO,
                                  Function<RaprRutaAprovechamiento, RaprRutaAprovechamientoDTO> convertToRaprRutaAprovechamientoDTO, CicCicloRepository cicCicloRepository) {
        this.propiedadRepository = propiedadRepository;
        this.unidadRepository = unidadRepository;
        this.dsusRepository = dsusRepository;
        this.rusuRepository = rusuRepository;
        this.liqdetsusRepository = liqdetsusRepository;
        this.barriosRepository = barriosRepository;
        this.inforadicionalsuscripcionRepository = inforadicionalsuscripcionRepository;
        this.cosuConsuscripRepository = cosuConsuscripRepository;
        this.recoleccionBarridoRepository = recoleccionBarridoRepository;
        this.rutaAprovechamientoRepository = rutaAprovechamientoRepository;
        this.rutaRepository = rutaRepository;
        this.suscripcionRepository = suscripcionRepository;
        this.cnreCnvrecaudoRepository = cnreCnvrecaudoRepository;
        this.rutrecoleccionRepository = rutrecoleccionRepository;
        this.terceroRepository = terceroRepository;
        this.homologacionService = homologacionService;
        this.convertToCosuConsuscripDTO = convertToCosuConsuscripDTO;
        this.convertToIasusInforadicionalsuscripcionDTO = convertToIasusInforadicionalsuscripcionDTO;
        this.convertToRaprRutaAprovechamientoDTO = convertToRaprRutaAprovechamientoDTO;
        this.cicCicloRepository = cicCicloRepository;
    }

    /**
     * Metodo para guardar un nuevo detalle de suscripcion
     *
     * @param dto dto detalle de suscripcion
     * @return Detalle de suscripcion guradado
     */
    public DsusDetsuscrip create(DsusDetsuscripDTO dto, Integer idUsu, Integer idEmp) {
        if (dsusRepository.existsByTerIderegistroAndSusIderegistroAndProIderegistro(dto.getTerIderegistro(), dto.getSusIderegistro(), dto.getProIderegistro()) > 0)
            throw new IllegalArgumentException("Ya existe una suscripcion asignada para el tercero y propiedad.");

        if (dsusRepository.existsByProIderegistroAndEmpIderegistro(dto.getProIderegistro(), idEmp) > 0)
            throw new IllegalArgumentException("La propiedad ya fue asociada a una suscripción.");

        // crear suscripcion
        dto.setSusIderegistro(createSubscription(idUsu, dto.getTerIderegistro().intValue(), idEmp.longValue()).getSusIderegistro());

        DsusDetsuscrip entity = buildSubscription(dto, idUsu, idEmp);

        if (entity.getUniBarrio() != null) {
        	String pCodigo = generatePCode();
            entity.setDsusPcodigo(pCodigo);
            entity = dsusRepository.save(entity);
        }

        createAdditionalSubscriptionInformation(dto, entity);
        createCollectionAndSweeping(dto.getRecoleccionBarridoDTO(), entity,idUsu);

        if(dto.getRutaAprovechamientoDTO().getTerAprovechamiento()!= null && dto.getRutaAprovechamientoDTO().getRutIderegistro()!=null) {
            createExploitation(dto, entity);
        }
        createConcepts(dto, entity);
        createLiquidation(entity, idUsu);
        setOtherFields(entity);

//        Map<String, String> longLatProperty = propiedadRepository.getLongLatiPropiedad(entity.getProIderegistro());
//        String feature = createJsonLocProperty(longLatProperty.get("longitud"), longLatProperty.get("latitud"), entity.getDsusIderegistr().toString(), entity.getDsusPcodigo());
//
//        if (!apiArcGis.guardarPuntoTercero(apiArcGis.getAccessTokenTwo(), feature))
//            throw new IllegalArgumentException("Ha ocurrido un error al guardar punto tercero Api ArcGis.");

        return entity;
    }

    public SusSuscripcion createSubscription(Integer idUs, Integer terId, Long empId) {
        SusSuscripcion entity = new SusSuscripcion();

        entity.setTerIderegistro(terId);
        entity.setSusModconvenio("N");
        entity.setUsuIderegistro(idUs);
        entity.setSusDescripcion("nueva suscripción");

        CnreCnvrecaudo agreement = cnreCnvrecaudoRepository.findByNameAndEmpId(UtilConstantes.SOLO_ASEO, empId)
                .orElseThrow(() -> new IllegalArgumentException("no existe convenio"));

        entity.setCnreIderegistr(agreement.getCnreIderegistr().intValue());
        entity.setCnreNombre(agreement.getCnreNombre());
        return suscripcionRepository.save(entity);
    }

    /**
     * @param dto
     * @param entity
     */
    private void createAdditionalSubscriptionInformation(DsusDetsuscripDTO dto, DsusDetsuscrip entity) {
        IasusInforadicionalsuscripcion detailEntity = new IasusInforadicionalsuscripcion();

        detailEntity.setIasusIderegistro(dto.getInforadicionalsuscripcionDTO().getIasusIderegistro());
        detailEntity.setDsusIderegistr(entity.getDsusIderegistr());
        detailEntity.setSusIderegistro(dto.getSusIderegistro());
        detailEntity.setIasusNombreestablecimiento(dto.getInforadicionalsuscripcionDTO().getIasusReferenciacomercial());
        detailEntity.setIasusReferenciacomercial(dto.getInforadicionalsuscripcionDTO().getIasusReferenciacomercial());
        detailEntity.setIasusCobrojuridico(dto.getInforadicionalsuscripcionDTO().getIasusCobrojuridico());
        detailEntity.setIasusPagapeaje(dto.getInforadicionalsuscripcionDTO().getIasusPagapeaje());
        inforadicionalsuscripcionRepository.save(detailEntity);
    }

    private void createCollectionAndSweeping(RrbaRutaRecoleccionBarridoDTO dto, DsusDetsuscrip entity,Integer idUsu) {
        //Ruta recoleccion
        RrbaRutaRecoleccionBarrido detailEntity = new RrbaRutaRecoleccionBarrido();
        detailEntity.setRrbaIdRegistro(dto.getRrbaIdRegistro());
        detailEntity.setDsusDetsuscrip(entity);
        detailEntity.setRutRuta(rutaRepository.findById(dto.getRutIderegistro()).orElse(null));
        detailEntity.setRutIdMacroRuta(dto.getRutIdMacroRuta());
        Optional<RureRutrecoleccion> rutRecoleccion= rutrecoleccionRepository.findByRutIdemacruta_rutIderegistroAndRureSwtact(
                dto.getRutIdMacroRuta()
                ,"A");
        if(rutRecoleccion.isPresent()){
            detailEntity.setRureIdRegistro(rutRecoleccion.get().getRureIderegistro());
        }
        detailEntity.setRutEstado(dto.getRutEstado());
        detailEntity.setUsuIderegistro(Long.valueOf(idUsu));
        recoleccionBarridoRepository.save(detailEntity);

        //Ruta barrido
        if(dto.getRutIderegistroBar()!=null) {
            RrbaRutaRecoleccionBarrido detailEntityBar = new RrbaRutaRecoleccionBarrido();
            detailEntityBar.setRrbaIdRegistro(dto.getRrbaIdRegistroBar());
            detailEntityBar.setDsusDetsuscrip(entity);
            detailEntityBar.setRutRuta(rutaRepository.findById(dto.getRutIderegistroBar()).orElse(null));
            detailEntityBar.setRutIdMacroRuta(dto.getRutIderegistroBar());
            Optional<RureRutrecoleccion> rutRecoleccionBar = rutrecoleccionRepository.findByRutIdemacruta_rutIderegistroAndRureSwtact(
                    dto.getRutIderegistroBar()
                    , "A");
            if (rutRecoleccionBar.isPresent()) {
                detailEntityBar.setRureIdRegistro(rutRecoleccionBar.get().getRureIderegistro());
            }
            detailEntityBar.setRutEstado(dto.getRutEstadoBar());
            detailEntityBar.setUsuIderegistro(Long.valueOf(idUsu));
            recoleccionBarridoRepository.save(detailEntityBar);
        }

    }

    private void createExploitation(DsusDetsuscripDTO dto, DsusDetsuscrip entity) {
        RaprRutaAprovechamiento detailEntity = new RaprRutaAprovechamiento();
        TerTercero terTercero = terceroRepository.findById(dto.getRutaAprovechamientoDTO().getTerAprovechamiento()).orElse(null);

        detailEntity.setRutaPrIdRegistro(dto.getRutaAprovechamientoDTO().getRutaPrIdRegistro());
        detailEntity.setTerTercero(terTercero != null ? terTercero : entity.getTerIderegistro());
        detailEntity.setDsusDetsuscrip(entity);
        detailEntity.setRutRuta(rutaRepository.findById(dto.getRutaAprovechamientoDTO().getRutIderegistro()).orElse(null));
        detailEntity.setAforado(dto.getRutaAprovechamientoDTO().getAforado());
        detailEntity.setIncentivo(dto.getRutaAprovechamientoDTO().getIncentivo());
        detailEntity.setRutEstado(dto.getRutaAprovechamientoDTO().getRutEstado());
        detailEntity.setUsuIderegistro(entity.getUsuIderegistro());
        detailEntity.setDateCreated(new Date());
        rutaAprovechamientoRepository.save(detailEntity);
    }

    /**
     * @param dto
     * @param entity
     */
    private void createConcepts(DsusDetsuscripDTO dto, DsusDetsuscrip entity) {
        dto.getConceptos().forEach(concept -> {
            CosuConsuscrip ent = new CosuConsuscrip();

            ent.setCosuIdregistr(concept.getCosuIdregistr());
            ent.setCantidad(1);
            ent.setVlrTotal(1);
            ent.setVlrUnitario(1);
            ent.setCosuEstado("A");
            ent.setDsusDetsuscrip(entity);
            ent.setFecFinal(concept.getFecFinal());
            ent.setFecInicio(concept.getFecInicio());
            ent.setEmpIdRegistro(entity.getEmpIderegistro().longValue());
            ent.setUsuIderegistro(entity.getUsuIderegistro().intValue());
            ent.setUniConcepto(concept.getUniConcepto());
            ent.setUniLiquidacion(entity.getUniLiquidacion());
            ent.setCosuObservacion("");
            cosuConsuscripRepository.save(ent);
        });
    }

    /**
     * Metodo para crear y guardar relacion detalle de suscripcion - liquidacion
     *
     * @param subscription detalle suscripcion
     * @param idUsu        id usuario
     */
    private void createLiquidation(DsusDetsuscrip subscription, Integer idUsu) {
        liqdetsusRepository.save(new LidsLiqdetsus(subscription.getDsusIderegistr(), subscription.getUniLiquidacion().intValue(),
                subscription.getEmpIderegistro(), idUsu));
    }

    /**
     * Metodo para crear y guardar relacion detalle de suscripcion - ruta
     *
     * @param idRut        id de ruta
     * @param subscription detalle suscripcion
     * @param idUsu        id usuario
     */
    private void createSubscriptionRoute(Long idRut, DsusDetsuscrip subscription, Integer idUsu) {
        RutRuta ruta = new RutRuta();

        ruta.setRutIderegistro(idRut);
        rusuRepository.save(new RusuRutsuscrip(ruta, subscription, ".", 0, idUsu));
    }
    /**
     * Metodo para editar una suscripcion
     *
     * @param id  id suscripcion
     * @param dto dto suscripcion
     */
    @org.springframework.transaction.annotation.Transactional
    public DsusDetsuscrip update(Long id, DsusDetsuscripDTO dto, Integer idUsu, Integer idEmp) {
        DsusDetsuscrip entity = this.dsusRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format("No se encuentra el detalle de suscripción. %s", id)));

        validateState(id, dto, idUsu, idEmp);
        entity.setDsusFecinicio(dto.getDsusFecinicio());
        entity.setDsusDescripcion(dto.getDsusDescripcion());
        entity.setUniTipsuscripc(dto.getUniTipsuscripc().longValue());
        entity.setCicIderegistro(dto.getCicIderegistro().longValue());
        entity.setUniTipusosuscr(dto.getUniTipusosuscr().longValue());
        entity.setProCatestrato(dto.getProCatestrato().intValue());
        entity.setUniLiquidacion(dto.getUniLiquidacion().longValue());
        entity.setDsusEstado(dto.getDsusEstado());
        entity.setDsusIniestado(dto.getDsusIniestado());
        entity.setDsusFinestado(dto.getDsusFinestado());
        entity.setDsusFactor(dto.getDsusFactor());
        //entity.setUniActsuscripc(dto.getUniActsuscripc().longValue());
        entity.setUsuIderegistro(idUsu.longValue());

        DsusDetsuscrip updated = dsusRepository.save(entity);

        createAdditionalSubscriptionInformation(dto, entity);
        createCollectionAndSweeping(dto.getRecoleccionBarridoDTO(), entity,idUsu);

        if(dto.getRutaAprovechamientoDTO().getTerAprovechamiento()!= null && dto.getRutaAprovechamientoDTO().getRutIderegistro()!=null) {
            createExploitation(dto, entity);
        }else{
            RaprRutaAprovechamiento routeExploitation=  this.rutaAprovechamientoRepository.findByDsusDetsuscrip_DsusIderegistr(entity.getDsusIderegistr());
            if(routeExploitation!=null){
                this.rutaAprovechamientoRepository.delete(routeExploitation);
            }
        }

        this.cosuConsuscripRepository.deleteByDsusIderegistro(entity.getDsusIderegistr());
        createConcepts(dto, entity);

        RutRuta ruta = new RutRuta();

        ruta.setRutIderegistro(dto.getRecoleccionBarridoDTO().getRutIderegistro());

        rusuRepository.updateRusuByDsus(ruta, id);
        liqdetsusRepository.updateLidsByDsus(dto.getUniLiquidacion().intValue() , id);
        setOtherFields(entity);
        return updated;
    }

    /**
     * Validaciones cambio de estado suscripcion
     *
     * @param id  id detalle suscripcion
     * @param dto dto detalle suscripcion
     */
    private void validateState(Long id, DsusDetsuscripDTO dto, Integer idUsu, Integer idEmp) {
        String actualState = dsusRepository.findEstadoByIdDsus(id, idEmp);

        if (!actualState.equals(dto.getDsusEstado())) {
            if (!actualState.equals("P") && dto.getDsusEstado().equals("P"))
                throw new IllegalArgumentException("No se puede modificar el estado de la suscripción a pendiente");

            if ((dto.getDsusEstado().equals("R") || dto.getDsusEstado().equals("U")) && dsusRepository.findDocsSaldo(id) > 0)
                throw new IllegalArgumentException("La suscripción tiene documentos con saldo (Recaudos,Facturas,Financiaciones)");

            if (dto.getDsusEstado().equals("E") && dsusRepository.findDocsSaldoEliminado(id) > 0)
                throw new IllegalArgumentException("La suscripción tiene documentos con saldo (Recaudos,Facturas,Financiaciones)");

            if (dto.getDsusEstado().equals("A") && dsusRepository.findFacturasSaldo(id) > 0)
                throw new IllegalArgumentException("Error, No se puede actualizar el estado de la suscripción porque tiene facturas con saldo");

            if (dto.getDsusEstado().equals("A") && dsusRepository.findLecturaActual(id) == 0)
                dsusRepository.insertNuevoEncabezadoLectura(id, idUsu);
        }
    }

    /**
     * Metodo para listar suscripciones por id de tercero
     *
     * @param idTer id tercero
     * @return lista de suscripciones
     */
    public List<DsusDetsuscrip> findAllByIdTer(Long idTer, Integer idEmp) {
            List<DsusDetsuscrip> dsusDetsuscrips = dsusRepository.findAllDsusByIdTer(idTer, idEmp)
                .stream().peek(this::setOtherFields).collect(Collectors.toList());
        return dsusDetsuscrips;
    }

    /**
     * Metodo para listar suscripciones por id de tercero y empresa alterna
     * @param idTer id tercero
     * @return lista de suscripciones
     */
    public List<Map<String,Object>> findAllByIdTerAndEnterprise(Long idTer, Integer idEmp) {
        List<Map<String,Object>> subscriptions=dsusRepository.findAllDsusByIdTerAndEnterprise(idTer, idEmp);
        List<Map<String,Object>> subscriptionsResponse= new ArrayList<>();

        subscriptions.forEach(s->{
            Map<String,Object> subMap= new HashMap<>();
            subMap.putAll(s);
            subscriptionsResponse.add(subMap);
        }
        );

        subscriptionsResponse.forEach(s->{
            if((int)s.get("empIderegistro")==317){
                s.replace("proIdepropieda","");
            }
        }
        );
        return subscriptionsResponse;
    }

    /**
     * Metodo para listar suscripciones por id de suscriptor
     *
     * @param idSus id suscriptor
     * @return lista de suscripciones
     */
    public List<DsusDetsuscrip> getAllByIdSus(Long idSus, Integer idEmp) {
        return dsusRepository.findAllDsusByIdSus(idSus, idEmp).stream().peek(this::setOtherFields).collect(Collectors.toList());
    }

    /**
     * Metodo para listar propieades disponibles para suscripcion por tercero
     *
     * @param idTer id de tercero
     * @return lista de propiedades
     */
    public List<Map<String, ?>> getAllPropertiesByIdTer(Long idTer) {
        return dsusRepository.findDispPropiedadesSuscripcion(idTer);
    }

    /**
     * Metodo para buscar un detalle de suscripcion por id
     *
     * @param id id dsus
     * @return detalle suscripcion
     */
    public DsusDetsuscrip search(Long id) {
        DsusDetsuscrip entity = dsusRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format("No se encuentra el detalle de la suscripción. %s", id)));

        setOtherFields(entity);

        return entity;
    }

    /**
     * @param entity
     */
    private void setOtherFields(DsusDetsuscrip entity) {
    	org.json.JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);
    	
        if(entity.getSusSuscripcion()!=null) entity.getSusSuscripcion().setCnreNombre(this.cnreCnvrecaudoRepository.findNameCnreById(new Long (entity.getSusSuscripcion().getCnreIderegistr())));
        if(entity.getProPropiedad()!=null) {
            entity.setProDireccion(entity.getProPropiedad().getProDireccion());
            entity.setProSecuencia(entity.getProPropiedad().getProSecuenciaindep());
        }
        if (entity.getUniTipsuscripc() != null)
            entity.setUniTipsuscripNombre(unidadRepository.findNameByUnit(entity.getUniTipsuscripc()));

        if (entity.getCicIderegistro() != null)
            entity.setCicNombre(dsusRepository.findNombreByCiclo(entity.getCicIderegistro().intValue()));

        if (entity.getUniTipusosuscr() != null)
            entity.setUniTipusosusNombre(unidadRepository.findNameByUnit(entity.getUniTipusosuscr()));

        if (entity.getUniLiquidacion() != null)
            entity.setUniLiquidacionNombre(unidadRepository.findNameByUnit(entity.getUniLiquidacion()));

        if (entity.getUniActsuscripc() != null)
            entity.setUniActsuscripcNombre(unidadRepository.findNameByUnit(entity.getUniActsuscripc()));

        if (entity.getCicIderegistro() != null)
            entity.setPerIderegistro(cicCicloRepository.findActivePerByCic(entity.getCicIderegistro().intValue()));

        entity.setInforadicionalsuscripcion(inforadicionalsuscripcionRepository.findByIdSus(entity.getDsusIderegistr())
                .map(convertToIasusInforadicionalsuscripcionDTO).orElse(null));

        RrbaRutaRecoleccionBarrido rutaRecoleccion=recoleccionBarridoRepository.findByDsusDetsuscripId(entity.getDsusIderegistr(), hya_parametros.getLong("uni_microrutas"));
        RrbaRutaRecoleccionBarrido rutaBarrido= recoleccionBarridoRepository.findByDsusDetsuscripId(entity.getDsusIderegistr(), hya_parametros.getLong("uni_rutaaseo"));

        RrbaRutaRecoleccionBarridoDTO rutaRecoleccionBarridoDTO= new RrbaRutaRecoleccionBarridoDTO();
        if(rutaRecoleccion!=null){
            rutaRecoleccionBarridoDTO.setRrbaIdRegistro(rutaRecoleccion.getRrbaIdRegistro());
            rutaRecoleccionBarridoDTO.setRutIderegistro( rutaRecoleccion.getRutRuta().getRutIderegistro());
            rutaRecoleccionBarridoDTO.setDsusIderegistr( rutaRecoleccion.getDsusDetsuscrip().getDsusIderegistr());
            rutaRecoleccionBarridoDTO.setRutIdMacroRuta(rutaRecoleccion.getRutIdMacroRuta());
            rutaRecoleccionBarridoDTO.setRutEstado(rutaRecoleccion.getRutEstado());
        }

        if(rutaBarrido!=null){
            rutaRecoleccionBarridoDTO.setRrbaIdRegistroBar(rutaBarrido.getRrbaIdRegistro());
            rutaRecoleccionBarridoDTO.setRutIderegistroBar(rutaBarrido.getRutRuta().getRutIderegistro());
            rutaRecoleccionBarridoDTO.setRutEstadoBar(rutaBarrido.getRutEstado());
        }
        entity.setRutaRecoleccionBarrido(rutaRecoleccionBarridoDTO);
        
        entity.setRutaAprovechamiento(rutaAprovechamientoRepository.findByDsusDetsuscripId(entity.getDsusIderegistr())
                .map(ra -> {
                    RaprRutaAprovechamientoDTO dto = convertToRaprRutaAprovechamientoDTO.apply(ra);

                    dto.setRutIderegistro(ra.getRutRuta().getRutIderegistro());
                    dto.setTerAprovechamiento(ra.getTerTercero().getTerIderegistro());
                    dto.setDsusIderegistr(ra.getDsusDetsuscrip().getDsusIderegistr());
                    return dto;
                }).orElse(null));
        entity.setConceptos(cosuConsuscripRepository.getAllByIdDsus(entity.getDsusIderegistr()).stream()
                .map(convertToCosuConsuscripDTO).collect(Collectors.toList()));

        entity.setEmpAlternasId(this.dsusRepository.empDsusAlternas(entity.getSusIderegistro(), entity.getEmpIderegistro()));
        if(entity.getEmpAlternasId().isEmpty()) entity.getEmpAlternasId().add(entity.getEmpIderegistro());

    }

    public List<HashMap<String, Object>> search(Integer dsus, String medidor, String pcodigo, Integer empresa, Integer empresaSesion, Boolean desHomo) {
        List<HashMap<String, Object>> mapList = homologacionService.busquedaInformacionHomologcion(dsus, medidor, pcodigo, empresa, empresaSesion, desHomo);
        List<HashMap<String, Object>> response = new ArrayList<>();

        mapList.forEach(hashMap -> {
            HashMap<String, Object> map = new HashMap<>();

            hashMap.forEach((key, value) -> {
                switch (key) {
                    case "dsus_ideregistr":
                        map.put("dsusIderegistr", value);
                        break;
                    case "uni_tipusosuscr":
                        map.put("uniTipusosuscr", value);
                        break;
                    case "pro_catestrato":
                        map.put("proCatestrato", value);
                        break;
                    case "dsus_pcodigo":
                        map.put("dsusPcodigo", value);
                        break;
                    case "cic_ideregistro":
                        map.put("cicIderegistro", value);
                        break;
                    case "cnre_ideregistr":
                        map.put("cnreIderegistr", value);
                        break;
                    case "cnre_nombre":
                        map.put("cnreNombre", value);
                        break;
                    case "pro_idepropieda":
                        if(empresa==317){
                            map.put("proIdepropieda", "");
                        }else {
                            map.put("proIdepropieda", value);
                        }
                        break;
                    case "ter_ideregistro":
                        map.put("terIderegistro", value);
                        break;
                    case "sus_ideregistro":
                        map.put("susIderegistro", value);
                        break;
                    case "cic_nombre":
                        map.put("cicNombre", value);
                        break;
                    case "uni_nombre1":
                        map.put("uniNombre1", value);
                        break;
                    case "consumos":
                        map.put("consumos", value);
                        break;
                    case "convenios":
                        map.put("convenios", value);
                        break;
                    default:
                        break;
                }
            });
            response.add(map);
        });

        return response;
    }

    /**
     * Metodo de filtro de suscripciones
     *
     * @param filterDTO parametros filtro
     * @param page      pagina
     * @param size      tamaño de pagina
     * @return lista de suscripciones
     */
    public Page<DsusDetsuscripDTO> filter(FiltroDsusDTO filterDTO, int page, int size, Integer idEmp) {
        GeneralSpecification<DsusDetsuscrip> filtromunicipio = null;
        GeneralSpecification<DsusDetsuscrip> filtrobarrio = null;
        GeneralSpecification<DsusDetsuscrip> filtroternombre = null;
        GeneralSpecification<DsusDetsuscrip> filtroterdocumento = null;
        GeneralSpecification<DsusDetsuscrip> filtrodireccion = null;
        GeneralSpecification<DsusDetsuscrip> filtronumcatastral = null;
        GeneralSpecification<DsusDetsuscrip> filtroidpropiedad = null;
        GeneralSpecification<DsusDetsuscrip> filtroidsus = null;
        GeneralSpecification<DsusDetsuscrip> filtropcodigo = null;
        GeneralSpecification<DsusDetsuscrip> filtroemplogueada;

        if (filterDTO.getIdmunicipio() != null)
            filtromunicipio = new GeneralSpecification(new SearchCriteria("uniMunicipio", ":", filterDTO.getIdmunicipio()));

        if (filterDTO.getIdbarrio() != null)
            filtrobarrio = new GeneralSpecification(new SearchCriteria("uniBarrio", ":", filterDTO.getIdbarrio()));

        if (filterDTO.getTernombre() != null && !filterDTO.getTernombre().isEmpty())
            filtroternombre = new GeneralSpecification(new SearchCriteria("terTercerodsusDetsuscripTerIderegistroFkey", "terNomcompleto", ":::", filterDTO.getTernombre().toUpperCase()));

        if (filterDTO.getTerdocumento() != null && !filterDTO.getTerdocumento().isEmpty())
            filtroterdocumento = new GeneralSpecification(new SearchCriteria("terTercerodsusDetsuscripTerIderegistroFkey", "terDocumento", ":::", filterDTO.getTerdocumento()));

        if (filterDTO.getDireccion() != null && !filterDTO.getDireccion().isEmpty())
            filtrodireccion = new GeneralSpecification(new SearchCriteria("relationPropiedad", "proDireccion", ":::", filterDTO.getDireccion().toUpperCase()));

        if (filterDTO.getNumcatastral() != null && !filterDTO.getNumcatastral().isEmpty())
            filtronumcatastral = new GeneralSpecification(new SearchCriteria("relationPropiedad", "proNumcatastral", ":::", filterDTO.getNumcatastral()));

        if (filterDTO.getIdpropiedad() != null)
            filtroidpropiedad = new GeneralSpecification(new SearchCriteria("relationPropiedad", "proIderegistro", ":::", filterDTO.getIdpropiedad()));

        if (filterDTO.getIdsus() != null)
            filtroidsus = new GeneralSpecification(new SearchCriteria("dsusIderegistr", ":", filterDTO.getIdsus()));

        if (filterDTO.getPcodigo() != null)
            filtropcodigo = new GeneralSpecification(new SearchCriteria("dsusPcodigo", ":", filterDTO.getPcodigo()));

        filtroemplogueada = new GeneralSpecification(new SearchCriteria("empIderegistro", "=", idEmp));

        return dsusRepository.findAll(Specification.where(filtromunicipio)
                        .and(filtrobarrio)
                        .and(filtroternombre)
                        .and(filtroterdocumento)
                        .and(filtrodireccion)
                        .and(filtronumcatastral)
                        .and(filtroidpropiedad)
                        .and(filtroidsus)
                        .and(filtropcodigo)
                        .and(filtroemplogueada),
                PageRequest.of(page, size, Sort.by("dsusIderegistr").ascending())).map(this::convert);
    }

    /**
     * Metodo para convertir entidad en dto(usado en el filtro de suscripciones)
     *
     * @param entity entidad detalle suscripcion
     * @return detalle suscripcion dto
     */
    private DsusDetsuscripDTO convert(DsusDetsuscrip entity) {
        DsusDetsuscripDTO dto = new DsusDetsuscripDTO();

        dto.setDsusIderegistr(entity.getDsusIderegistr());
        dto.setDsusPcodigo(entity.getDsusPcodigo());
        dto.setTerNomcompleto(entity.getTerIderegistro() != null ? entity.getTerIderegistro().getTerNomcompleto() : "");
        dto.setMunicipio(unidadRepository.findNomMunById(entity.getUniMunicipio()));
        dto.setProDireccion(entity.getProPropiedad() != null ? entity.getProPropiedad().getProDireccion() : "");
        setOtherFields(entity);
        return dto;
    }

    /**
     * Metodo para generar pcodigo para el detalle de suscripcion
     *
     * @return pcodigo
     */
    public String generatePCode() {
    	String sql = "select * from aseo.obtenerpcodigoaseo()";
    	Query qObtenerP_Codigo = em.createNativeQuery(sql);
    	Object result = qObtenerP_Codigo.getSingleResult();
    	if (result != null) {
    	    return result.toString();
    	} else {
    	    throw new IllegalStateException("No se obtuvo ningún resultado de la función aseo.obtenerpcodigoaseo()");
    	}
    }

    /**
     * Metodo para construir entidad detalle de suscripcion
     *
     * @param dto   dto detalle de suscripcion
     * @param idUsu id de usuario logueado
     * @param idEmp id empresa usuario logueado
     * @return entidad detalle suscripcion
     */
    private DsusDetsuscrip buildSubscription(DsusDetsuscripDTO dto, Integer idUsu, Integer idEmp) {
        DsusDetsuscrip entity = new ModelMapper().map(dto, DsusDetsuscrip.class);
        Map<String, Long> munbar = propiedadRepository.findMunBarrByIdPropiedad(dto.getProIderegistro());

        entity.setUniMunicipio(munbar.get("uniMunicipio"));
        entity.setUniBarrio(barriosRepository.findById(munbar.get("uniBarrio")).orElse(null));
        entity.setEmpIderegistro(idEmp);
        entity.setEstTipsuscripc(unidadRepository.findEstByUnit(dto.getUniTipsuscripc()).longValue());
        entity.setEstTipusosuscr(unidadRepository.findEstByUnit(dto.getUniTipusosuscr()));
        entity.setEstLiquidacion(unidadRepository.findEstByUnit(dto.getUniLiquidacion()));
        entity.setDsusPcodigo("");
        entity.setUsuIderegistro(idUsu.longValue());
        entity.setDsusFecact(Timestamp.from(Instant.now()));
        return entity;
    }

    /**
     * Metodo para crear parametro json para guardar punto tercero a traves de Api Arcgis
     *
     * @param longitude       valor longitud x
     * @param latitude        valor latitud y
     * @param idTer           id del tercero
     * @param codSubscription codsus
     * @return String Json feature
     */
    private String createJsonLocProperty(String longitude, String latitude, String idTer, String codSubscription) {
        String result;
        JSONArray array = new JSONArray();
        JSONObject spatialReference = new JSONObject();

        spatialReference.put("wkid", "4326");

        JSONObject geometry = new JSONObject();

        geometry.put("x", longitude);
        geometry.put("y", latitude);
        geometry.put("spatialReference", spatialReference);

        JSONObject attributes = new JSONObject();

        attributes.put("Codigo_Llanogas", codSubscription);
        attributes.put("ID_suscripcion", idTer);
        attributes.put("fecha", Instant.now().toString());
        attributes.put("numero_cuadrilla", "99");
        attributes.put("tipo_cuadrilla", "Comercial");

        JSONObject finalObject = new JSONObject();

        finalObject.put("geometry", geometry);
        finalObject.put("attributes", attributes);
        array.appendElement(finalObject);
        result = array.toJSONString();
        return result;
    }
}
