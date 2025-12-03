package com.bioagricola.hya.service;

import com.bioagricola.common.entity.*;
import com.bioagricola.common.repository.CnreCnvrecaudoRepository;
import com.bioagricola.common.repository.DicnDisconvenRepository;
import com.bioagricola.common.repository.DsusDetsuscripRepository;
import com.bioagricola.homologaciones.entity.SusSuscripcion;
import com.bioagricola.homologaciones.repository.DghoDetallegestionhomologaRepository;
import com.bioagricola.homologaciones.repository.EmpresasRepository;
import com.bioagricola.homologaciones.repository.GhomGestionhomologaRepository;
import com.bioagricola.homologaciones.repository.SuscripcionRepository;
import com.bioagricola.hya.config.GeneralSpecification;
import com.bioagricola.hya.config.SearchCriteria;
import com.bioagricola.hya.dto.DetalleGestionHomologaDTO;
import com.bioagricola.hya.dto.FiltroHomologacionDTO;
import com.bioagricola.hya.dto.GestionHomologaDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.function.Function;

@Transactional
@Service
public class DsusHomologacionService {
    private final GhomGestionhomologaRepository gestionhomologaRepository;
    private final DghoDetallegestionhomologaRepository detallegestionhomologaRepository;
    private final CnreCnvrecaudoRepository cnreCnvrecaudoRepository;
    private final DicnDisconvenRepository disconvenRepository;
    private final EmpresasRepository empresasRepository;
    private final SuscripcionRepository suscripcionRepository;
    private final DsusDetsuscripRepository dsusRepository;
    private final Function<GhomGestionhomologa, GestionHomologaDTO> convertToGestionHomologaDTO;
    private final Function<DghoDetallegestionhomologa, DetalleGestionHomologaDTO> convertToDetalleGestionHomologaDTO;

    public DsusHomologacionService(GhomGestionhomologaRepository gestionhomologaRepository,
                                   DghoDetallegestionhomologaRepository detallegestionhomologaRepository,
                                   CnreCnvrecaudoRepository cnreCnvrecaudoRepository,
                                   DicnDisconvenRepository disconvenRepository,
                                   EmpresasRepository empresasRepository,
                                   SuscripcionRepository suscripcionRepository,
                                   DsusDetsuscripRepository dsusRepository,
                                   Function<GhomGestionhomologa, GestionHomologaDTO> convertToGestionHomologaDTO,
                                   Function<DghoDetallegestionhomologa, DetalleGestionHomologaDTO> convertToDetalleGestionHomologaDTO) {
        this.gestionhomologaRepository = gestionhomologaRepository;
        this.detallegestionhomologaRepository = detallegestionhomologaRepository;
        this.cnreCnvrecaudoRepository = cnreCnvrecaudoRepository;
        this.disconvenRepository = disconvenRepository;
        this.empresasRepository = empresasRepository;
        this.suscripcionRepository = suscripcionRepository;
        this.dsusRepository = dsusRepository;
        this.convertToGestionHomologaDTO = convertToGestionHomologaDTO;
        this.convertToDetalleGestionHomologaDTO = convertToDetalleGestionHomologaDTO;
    }

    /**
     * Metodo para guardar una nueva homologacion
     *
     * @param dto dto homologacion
     * @return Detalle de homologcion guradado
     */
    public GestionHomologaDTO create(GestionHomologaDTO dto, Integer idUsu, Integer idEmp) {
        SusSuscripcion beforeSubscription = suscripcionRepository.findById(dto.getSusIderegistro().longValue())
                .orElseThrow(() -> new IllegalArgumentException("not found subscription with id: " + dto.getSusIderegistro()));
        Date date = new Date();

        dto.setGhomFecharegistro(date);
        dto.setGhomFechaactualiza(date);

        // crea nueva suscripción
        SusSuscripcion subscription = createSubscription(idUsu, beforeSubscription.getTerIderegistro(), dto.getCnreIderegistr());

        dto.setSusIderegistro(subscription.getSusIderegistro().intValue());
        dto.getDetalles().forEach(detail -> {
            detail.setSusIderegistroHomologa(subscription.getSusIderegistro());
            detail.setSusIderegistroHomologados(subscription.getSusIderegistro());
        });

        GhomGestionhomologa save = gestionhomologaRepository.save(buildEntity(dto, idUsu, idEmp));
        DsusDetsuscrip detailSubscription = dsusRepository.findById(dto.getDsusIderegistr())
                .orElseThrow(() -> new IllegalArgumentException("not found detail subscription with id: " + dto.getDsusIderegistr()));

        detailSubscription.setSusIderegistro(subscription.getSusIderegistro());
        dsusRepository.save(detailSubscription);

        GestionHomologaDTO response = convertToGestionHomologaDTO.apply(save);

        dto.getDetalles().forEach(detail -> {
            detail.setDghoFechaactualiza(date);
            detail.setDghoFecharegistro(date);

            DghoDetallegestionhomologa buildDetail = buildDetail(save, detail);
            DghoDetallegestionhomologa detailSave = detallegestionhomologaRepository.save(buildDetail);

            DetalleGestionHomologaDTO homologaDTO = convertToDetalleGestionHomologaDTO.apply(detailSave);

            homologaDTO.setGhomIderegistr(detailSave.getGhomGestionhomologa().getGhomIderegistr());
            response.getDetalles().add(homologaDTO);
        });

        return response;
    }

    public SusSuscripcion createSubscription(Integer idUs, Integer terId, Integer cnrId) {
        SusSuscripcion entity = new SusSuscripcion();

        entity.setTerIderegistro(terId);
        entity.setSusModconvenio("N");
        entity.setUsuIderegistro(idUs);
        entity.setSusDescripcion("homologación");
        entity.setCnreIderegistr(cnrId);
        return suscripcionRepository.save(entity);
    }

    /**
     * Metodo para editar una homologacion
     *
     * @param id  id homologacion
     * @param dto dto homologacion
     */
    public GestionHomologaDTO update(Long id, GestionHomologaDTO dto, Integer idUsu, Integer idEmp) {
        GhomGestionhomologa entity = gestionhomologaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No existe la homologación con id: " + id));
        Date date = new Date();

        dto.setGhomFechaactualiza(date);
        dto.setGhomFecharegistro(entity.getGhomFecharegistro());
        dto.setGhomIderegistr(entity.getGhomIderegistr());

        GhomGestionhomologa update = gestionhomologaRepository.save(buildEntity(dto, idUsu, idEmp));
        GestionHomologaDTO response = convertToGestionHomologaDTO.apply(update);

        dto.getDetalles().forEach(detail -> {
            detail.setDghoFechaactualiza(date);
            detail.setDghoFecharegistro(date);

            DghoDetallegestionhomologa buildDetail = buildDetail(update, detail);
            DghoDetallegestionhomologa detailSave = detallegestionhomologaRepository.save(buildDetail);

            response.getDetalles().add(convertToDetalleGestionHomologaDTO.apply(detailSave));
        });
        return response;
    }

    public GhomGestionhomologa buildEntity(GestionHomologaDTO dto, Integer idUsu, Integer idEmp) {
        GhomGestionhomologa entity = new GhomGestionhomologa();

        entity.setGhomIderegistr(dto.getGhomIderegistr());
        entity.setGhomFecharegistro(dto.getGhomFecharegistro());
        entity.setUsuIderegistro(idUsu.longValue());
        entity.setEmpIderegistro(idEmp.longValue());
        entity.setGhomEstado("A");
        entity.setObservaciones(dto.getObservaciones());
        entity.setPerIderegistro(dto.getPerIderegistro());
        entity.setSusIderegistro(dto.getSusIderegistro());
        entity.setDsusIderegistr(dto.getDsusIderegistr());
        entity.setGhomFechaactualiza(dto.getGhomFechaactualiza());
        entity.setGhomFecharegistro(dto.getGhomFecharegistro());
        return entity;
    }

    private DghoDetallegestionhomologa buildDetail(GhomGestionhomologa save, DetalleGestionHomologaDTO detail) {
        DghoDetallegestionhomologa detailEntity = new DghoDetallegestionhomologa();

        detailEntity.setDghoIderegistr(detail.getDghoIderegistr());
        detailEntity.setGhomGestionhomologa(save);
        detailEntity.setEmpIderegistro(save.getEmpIderegistro());
        detailEntity.setUsuIderegistro(save.getUsuIderegistro());
        detailEntity.setDghoEstado(save.getGhomEstado());
        detailEntity.setDghoConsumo(detail.getDghoConsumo());
        detailEntity.setDghoFecharegistro(new Date());
        detailEntity.setDghoNumeromedidor(detail.getDghoNumeromedidor());
        detailEntity.setDghoObservaciones(detail.getDghoObservaciones());
        detailEntity.setDsusPcodigo(detail.getDsusPcodigo());
        detailEntity.setDsusIderegistr(save.getDsusIderegistr());
        detailEntity.setSusIderegistroHomologa(detail.getSusIderegistroHomologa());
        detailEntity.setSusIderegistroHomologados(detail.getSusIderegistroHomologados());
        detailEntity.setDghoFechaactualiza(detail.getDghoFechaactualiza());
        detailEntity.setDghoFecharegistro(detail.getDghoFecharegistro());
        detailEntity.setDsusIderegistr(detail.getDsusIderegistr());
        return detailEntity;
    }

    /**
     * Metodo de filtro de suscripciones
     *
     * @param filterDTO parametros filtro
     * @param page      pagina
     * @param size      tamaño de pagina
     * @return lista de suscripciones
     */
    public Page<GestionHomologaDTO> filter(FiltroHomologacionDTO filterDTO, int page, int size) {
        GeneralSpecification<DghoDetallegestionhomologa> filtroCodigo = null;
        GeneralSpecification<DghoDetallegestionhomologa> filtroMedidor = null;
        GeneralSpecification<DghoDetallegestionhomologa> filtroIdsus = null;
        GeneralSpecification<DghoDetallegestionhomologa> filtroFechaIni = null;
        GeneralSpecification<DghoDetallegestionhomologa> filtroFechaFin = null;
        GeneralSpecification<DghoDetallegestionhomologa> filtroEmpId;

        filtroEmpId = new GeneralSpecification(new SearchCriteria("empIderegistro", "=", filterDTO.getIdempresa()));

        if (filterDTO.getCodigo() != null)
            filtroCodigo = new GeneralSpecification(new SearchCriteria("dsusPcodigo", ":", filterDTO.getCodigo()));

        if (filterDTO.getMedidor() != null)
            filtroMedidor = new GeneralSpecification(new SearchCriteria("dghoNumeromedidor", ":", filterDTO.getMedidor()));

        if (filterDTO.getIdsus() != null)
            filtroMedidor = new GeneralSpecification(new SearchCriteria("susIderegistroHomologa", ":", filterDTO.getIdsus()));

        if (filterDTO.getFechaIni() != null)
            filtroFechaIni = new GeneralSpecification(new SearchCriteria("dghoFecharegistro", ">::", filterDTO.getFechaIni()));

        if (filterDTO.getFechaFin() != null)
            filtroFechaFin = new GeneralSpecification(new SearchCriteria("dghoFecharegistro", "<::", filterDTO.getFechaFin()));

        return detallegestionhomologaRepository.findAll(Specification
                        .where(filtroCodigo)
                        .and(filtroMedidor)
                        .and(filtroIdsus)
                        .and(filtroEmpId)
                        .and(filtroFechaIni)
                        .and(filtroFechaFin),
                PageRequest.of(page, size, Sort.by("dghoIderegistr").ascending())).map(this::convert);
    }

    private GestionHomologaDTO convert(DghoDetallegestionhomologa entity) {
        DetalleGestionHomologaDTO detail = convertToDetalleGestionHomologaDTO.apply(entity);
        GestionHomologaDTO response = convertToGestionHomologaDTO
                .apply(gestionhomologaRepository.findById(detail.getDghoIderegistr()).orElse(new GhomGestionhomologa()));

        response.setDetalles(Collections.singletonList(detail));
        return response;
    }

    public List<CnreCnvrecaudo> getAllAgreementsByEmpId(Long empId) {
        return cnreCnvrecaudoRepository.findAllByEmpId(empId);
    }

    public List<Empresas> getAllEmpByAgreementId(Long id) {
        List<Empresas> response = new ArrayList<>();

        disconvenRepository.findAllByCnreCnvrecaudo(id)
                .forEach(empId -> response.add(empresasRepository.findById(empId)
                        .orElseThrow(() -> new IllegalArgumentException("empresa no encontrada " + empId))));
        return response;
    }

    public List<Map<String,Object>> getHistoryHomologation(FiltroHomologacionDTO dto){
        return this.gestionhomologaRepository.findHistoryHomologation(dto.getIdsus(),dto.getFechaIni(),dto.getFechaFin(),dto.getIdempresa());
    }
}
