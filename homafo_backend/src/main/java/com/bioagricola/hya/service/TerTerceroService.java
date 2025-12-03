package com.bioagricola.hya.service;

import com.bioagricola.common.constant.UtilConstantes;
import com.bioagricola.common.entity.ClteClatercero;
import com.bioagricola.common.entity.ContContactotercero;
import com.bioagricola.common.entity.TerTercero;
import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.common.repository.TerTerceroRepository;
import com.bioagricola.common.repository.UniUnidadRepository;
import com.bioagricola.common.service.ParParametroService;
import com.bioagricola.hya.config.EntityToDTOFactory;
import com.bioagricola.hya.config.GeneralSpecification;
import com.bioagricola.hya.config.SearchCriteria;
import com.bioagricola.hya.dto.ClteClaterceroDTO;
import com.bioagricola.hya.dto.ContContactoTerceroDTO;
import com.bioagricola.hya.dto.FiltroTerceroDTO;
import com.bioagricola.hya.dto.TerTerceroDTO;
import com.bioagricola.hya.repository.CiudadesRepository;
import com.bioagricola.hya.repository.ClteClaTerceroRepository;
import com.bioagricola.hya.repository.ContContactoTerceroRepository;

import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service("hyaTerTerceroService")
@Transactional
public class TerTerceroService {
    private final TerTerceroRepository terTerceroRepository;
    private final ClteClaTerceroRepository clteClaTerceroRepository;
    private final CiudadesRepository ciudadesRepository;
    private final UniUnidadRepository uniUnidadRepository;
    private final EntityToDTOFactory entityToDTOFactory;
    private final ContContactoTerceroRepository contContactoTerceroRepository;
    
    @Autowired
    private ParParametroService _parParametroService;

    public TerTerceroService(TerTerceroRepository terTerceroRepository,
                             ClteClaTerceroRepository clteClaTerceroRepository,
                             CiudadesRepository ciudadesRepository,
                             UniUnidadRepository uniUnidadRepository,
                             EntityToDTOFactory entityToDTOFactory,
                             ContContactoTerceroRepository contContactoTerceroRepository) {
        this.terTerceroRepository = terTerceroRepository;
        this.clteClaTerceroRepository = clteClaTerceroRepository;
        this.ciudadesRepository = ciudadesRepository;
        this.uniUnidadRepository = uniUnidadRepository;
        this.entityToDTOFactory = entityToDTOFactory;
        this.contContactoTerceroRepository = contContactoTerceroRepository;
    }

    public TerTerceroDTO save(TerTerceroDTO dto, Integer idUsu) {
        validateByIdentification(dto.getTerDocumento());

        ModelMapper mapper = new ModelMapper();

        dto.setUsuIderegistro(idUsu.longValue());
        return createTerTercero(dto, mapper, true);
    }

    public TerTerceroDTO update(Integer id, TerTerceroDTO dto, Integer idUsu) {
        TerTercero terTercero = terTerceroRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new IllegalArgumentException(String.format("The tercero with ID %s not found!", id)));

        if (!terTercero.getTerDocumento().equals(dto.getTerDocumento()))
            validateByIdentification(dto.getTerDocumento());

        ModelMapper mapper = new ModelMapper();

        dto.setUsuIderegistro(idUsu.longValue());
        dto.setTerIderegistro(terTercero.getTerIderegistro());
        return this.createTerTercero(dto, mapper, false);
    }

    public Page<TerTerceroDTO> filterTerTercero(FiltroTerceroDTO dto, int page, int size) {
        GeneralSpecification<TerTercero> typeDocFilter = null;
        GeneralSpecification<TerTercero> idDocFilter = null;
        GeneralSpecification<TerTercero> fullNameFilter = null;
        GeneralSpecification<TerTercero> filtroSuscripcion = null;
        GeneralSpecification<TerTercero> filtroCodanterior = null;

        if (dto.getTipodoc() != null)
            typeDocFilter = new GeneralSpecification(new SearchCriteria("uniTipidentifica", ":", dto.getTipodoc()));

        if (dto.getNumdoc() != null && !dto.getNumdoc().isEmpty())
            idDocFilter = new GeneralSpecification(new SearchCriteria("terDocumento", ":", dto.getNumdoc().trim()));

        if (dto.getNombre() != null && !dto.getNombre().isEmpty())
            fullNameFilter = new GeneralSpecification(new SearchCriteria("terNomcompleto", ":", dto.getNombre().toUpperCase()));

        if (dto.getSuscripcion() != null && !dto.getSuscripcion().isEmpty())
            filtroSuscripcion = new GeneralSpecification(new SearchCriteria("dsusDetsuscripTerIderegistroFkeyes", "dsusIderegistr", "::", dto.getSuscripcion()));

        if (dto.getCodigoanterior() != null && !dto.getCodigoanterior().isEmpty())
            filtroCodanterior = new GeneralSpecification(new SearchCriteria("dsusDetsuscripTerIderegistroFkeyes", "dsusPcodigo", "::", dto.getCodigoanterior()));


        return terTerceroRepository.findAll(
                Specification.where(fullNameFilter)
                        .and(typeDocFilter)
                        .and(idDocFilter)
                        .and(filtroSuscripcion)
                        .and(filtroCodanterior),
                PageRequest.of(page, size, Sort.by("terNomcompleto").ascending())).map(this::convert);
    }

    private TerTerceroDTO convert(TerTercero tercero) {
        ModelMapper modelMapper = new ModelMapper();
        TerTerceroDTO dto = modelMapper.map(tercero, TerTerceroDTO.class);
        List<ClteClaterceroDTO> clteClaterceroDTOS = new ArrayList<>();
        List<ContContactoTerceroDTO> contactoTerceroDTOS = new ArrayList<>();
        
        JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);

        clteClaTerceroRepository.findByTerIderegistro(tercero.getTerIderegistro()).forEach(clatercero ->
                clteClaterceroDTOS.add(new ClteClaterceroDTO(clatercero.getClteIderegistr(), clatercero.getUniUnidad().getUniIderegistro(),
                        clatercero.getTerTercero().getTerIderegistro(), clatercero.getUsuIderegistro())));
        dto.setClaterceros(clteClaterceroDTOS);

        List<ContContactotercero> contContactoterceros= contContactoTerceroRepository.findAllByTerceroId(tercero.getTerIderegistro());

        if(!contContactoterceros.isEmpty()){
            contContactoterceros.forEach(contContactotercero ->
                    contactoTerceroDTOS.add(
                            new ContContactoTerceroDTO(contContactotercero.getContIderegistro(), contContactotercero.getTerTercero().getTerIderegistro(),
                                    contContactotercero.getUniUnidad().getUniIderegistro(), contContactotercero.getContValor())
                    ));
        }else{
            if(tercero.getTerTelcelular()!=null){
                ContContactoTerceroDTO celular= new ContContactoTerceroDTO(null,tercero.getTerIderegistro(),hya_parametros.getLong("uni_telcelular"), tercero.getTerTelcelular());
                contactoTerceroDTOS.add(celular);
            }
            if(tercero.getTerTelfijo()!=null){
                ContContactoTerceroDTO telfijo= new ContContactoTerceroDTO(null,tercero.getTerIderegistro(),hya_parametros.getLong("uni_telfijo"), tercero.getTerTelfijo());
                contactoTerceroDTOS.add(telfijo);
            }
            if(tercero.getTerCorreo()!=null){
                ContContactoTerceroDTO correo= new ContContactoTerceroDTO(null,tercero.getTerIderegistro(),hya_parametros.getLong("uni_correo"), tercero.getTerCorreo());
                contactoTerceroDTOS.add(correo);
            }
        }

        dto.setContactosTercero(contactoTerceroDTOS);

        if (tercero.getCiudadCod() != null)
            ciudadesRepository.buscaNomCiudadPorId(tercero.getCiudadCod()).ifPresent(dto::setCiudadNombre);

        return dto;
    }

    private TerTerceroDTO createTerTercero(TerTerceroDTO dto, ModelMapper mapper, boolean isCreate) {
        dto.setTerNomcompleto(dto.getTerNombre().toUpperCase() + " " + dto.getTerApellido().toUpperCase());
        dto.setEstTiptercero(uniUnidadRepository.findEstByUnit(dto.getUniTiptercero()).longValue());

        JSONObject hya_parametros = _parParametroService.getJSONObjectParameter(UtilConstantes.HYA, UtilConstantes.BIOAGRICOLA);

        if(!dto.getContactosTercero().isEmpty()){
            boolean mail= false;
            boolean pho = false;
            boolean cel = false;

            for (ContContactoTerceroDTO contacto:dto.getContactosTercero()) {
                if(contacto.getUniUnidadId() == hya_parametros.getLong("uni_correo")){  //correo 4664
                    if(!mail) {
                        dto.setTerCorreo(contacto.getContValor());
                        mail=true;
                    }
                }
                if(contacto.getUniUnidadId() == hya_parametros.getLong("uni_telfijo")){ //telefono fijo 4665
                    if(!pho) {
                        dto.setTerTelfijo(contacto.getContValor());
                        pho=true;
                    }
                }
                if(contacto.getUniUnidadId() == hya_parametros.getLong("uni_telcelular")){ // telefono movil 4666
                    if(!cel) {
                        dto.setTerTelcelular(contacto.getContValor());
                        cel=true;
                    }
                }

                if(cel && pho && mail) break;
            }
        }
        if(dto.getTerTelcelular()==null) dto.setTerTelcelular(".");
        if(dto.getTerTelfijo()==null) dto.setTerTelfijo(".");

        TerTercero save = terTerceroRepository.save(entityToDTOFactory.convertToTerTercero(mapper).apply(dto));
        TerTerceroDTO response = entityToDTOFactory.convertToTerTerceroDTO(mapper).apply(save);

        if (isCreate) {

            if (dto.getClaterceros() != null && !dto.getClaterceros().isEmpty())
                response.setClaterceros(createClatercero(dto, save));

            response.setContactosTercero(createContacts(dto, save));
        } else {
            List<Long> idClaterceros = clteClaTerceroRepository.findByTerIderegistro(dto.getTerIderegistro())
                    .stream().map(ClteClatercero::getClteIderegistr).collect(Collectors.toList());
            List<Long> idContactos = contContactoTerceroRepository.findAllByTerceroId(save.getTerIderegistro())
                    .stream().map(ContContactotercero::getContIderegistro).collect(Collectors.toList());

            clteClaTerceroRepository.deleteAllByIds(idClaterceros);
            response.setClaterceros(createClatercero(dto, save));
            contContactoTerceroRepository.deleteAllByIds(idContactos);
            response.setContactosTercero(createContacts(dto, save));
        }
        return response;
    }

    private List<ContContactoTerceroDTO> createContacts(TerTerceroDTO dto, TerTercero save) {
        List<ContContactoTerceroDTO> response = new ArrayList<>();

        dto.getContactosTercero().forEach(contact -> uniUnidadRepository.findById(contact.getUniUnidadId())
                .ifPresent(uniUnidad -> {
                    ContContactotercero contactotercero =
                            contContactoTerceroRepository.save(new ContContactotercero(save, uniUnidad, contact.getContValor()));

                    response.add(new ContContactoTerceroDTO(contactotercero.getContIderegistro(), save.getTerIderegistro(),
                            contactotercero.getUniUnidad().getUniIderegistro(), contactotercero.getContValor()));
                }));

        return response;
    }

    private List<ClteClaterceroDTO> createClatercero(TerTerceroDTO dto, TerTercero tercero) {
        ClteClatercero clteClatercero = new ClteClatercero();
        List<ClteClaterceroDTO> response = new ArrayList<>();

        dto.getClaterceros().forEach(claDTO -> {
            UniUnidad uniUnidad = uniUnidadRepository.findById(claDTO.getUniClatercero())
                    .orElseThrow(() -> new IllegalArgumentException(String.format("The Unidad with ID %s Not found!", claDTO.getUniClatercero())));

            clteClatercero.setUniUnidad(uniUnidad);
            clteClatercero.setTerTercero(tercero);
            clteClatercero.setUsuIderegistro(dto.getUsuIderegistro().intValue());

            ClteClatercero saved = clteClaTerceroRepository.save(clteClatercero);

            response.add(new ClteClaterceroDTO(saved.getClteIderegistr(), saved.getUniUnidad().getUniIderegistro(),
                    saved.getTerTercero().getTerIderegistro(), saved.getUsuIderegistro()));
        });

        return response;
    }

    private void validateByIdentification(String identification) {
        Optional<TerTercero> byIdentification = terTerceroRepository.findByIdentification(identification);

        if (byIdentification.isPresent())
            throw new IllegalArgumentException(String.format("The tercero with ID %s is already registered!", identification));
    }
}
