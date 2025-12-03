package com.bioagricola.hya.service;


import com.bioagricola.common.constant.UtilConstantes;
import com.bioagricola.common.entity.ProPropiedad;
import com.bioagricola.common.entity.UniUnidad;
import com.bioagricola.common.repository.DsusDetsuscripRepository;
import com.bioagricola.common.repository.ProPropiedadRepository;
import com.bioagricola.common.repository.UniUnidadRepository;
import com.bioagricola.hya.config.exhandling.exception.FailuresServiceException;
import com.bioagricola.hya.dto.ProPropiedadDTO;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Clase que contiene la logica relacionada con ProPropiedad
 *
 * @author dsolano
 */
@Service
@Transactional
public class PropiedadService {
    private final ProPropiedadRepository propiedadRepository;
    private final UniUnidadRepository unidadRepository;
    private final DsusDetsuscripRepository dsusRepository;

    public PropiedadService(ProPropiedadRepository propiedadRepository,
                            UniUnidadRepository unidadRepository,
                            DsusDetsuscripRepository dsusRepository) {
        this.propiedadRepository = propiedadRepository;
        this.unidadRepository = unidadRepository;
        this.dsusRepository = dsusRepository;
    }

    /**
     * Metodo para listar las propiedades
     *
     * @param idTercero id tercero
     * @return lista de propiedades
     */
    public List<ProPropiedad> listAllByIdTercero(Long idTercero) {
        List<ProPropiedad> response = propiedadRepository.findAllByTerIderegistro(idTercero);

        response.forEach(this::setAdditionalInfo);
        return response;
    }

    /**
     * Metodo para buscar una propiedad por id
     *
     * @param id id de propiedad
     * @return propiedad
     */
    public ProPropiedad search(Integer id) {
        ProPropiedad prop = this.propiedadRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new IllegalArgumentException(UtilConstantes.PROPERTY_NOT_FOUND));

        setAdditionalInfo(prop);

        return prop;
    }

    /**
     * Metodo para guardar una dto
     *
     * @param dto  nueva dto
     * @param idUs id de usuario logueado
     * @return dto creada
     */
    @Transactional
    public ProPropiedad create(ProPropiedadDTO dto, Integer idUs) {
        if(dto.getMubaSector() == null)
            dto.setMubaSector(0L);
        if(dto.getProSeccion() == null)
            dto.setProSeccion(0);
        if(dto.getProManzana() == null)
            dto.setProManzana(0);

        ProPropiedad entity = propiedadRepository.save(buildProperty(dto, idUs));

        setAdditionalInfo(entity);
        entity.setProIdepropieda(entity.getProIderegistro().toString());
        entity.setUniTippropieda(dto.getUniTippropieda());
        return propiedadRepository.save(entity);
    }

    private void setAdditionalInfo(ProPropiedad entity) {
        if (entity.getUniMunicipio() != null)
            entity.setUniMunicipioNombre(unidadRepository.findNomMunById(entity.getUniMunicipio()));

        if (entity.getUniBarrio() != null)
            entity.setUniBarrioNombre(unidadRepository.findNomBarrioById(entity.getUniBarrio()));

        if (entity.getUniCmpdireccion() != null)
            entity.setUniCmpdireccionNombre(unidadRepository.findNameByUnit(entity.getUniCmpdireccion()));

        if (entity.getUniTippropieda() != null)
            entity.setTippropiedaNombre(unidadRepository.findNameByUnit(entity.getUniTippropieda()));

        if(entity.getProSecuenciaindep()!=null) entity.setProDigitos(entity.getProSecuenciaindep().intValue()); else entity.setProDigitos(0);

        entity.setHasSubscription(dsusRepository.existsByTerIderegistroAndProIderegistro(entity.getTerIderegistro(), entity.getProIderegistro()) > 0);
    }

    /**
     * Metodo para editar una dto
     *
     * @param id   id de la dto
     * @param dto  datos de dto
     * @param idUs id de usuario
     */
    @Transactional
    public ProPropiedad update(Integer id, ProPropiedadDTO dto, Integer idUs) {
        ProPropiedad entity = this.propiedadRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new IllegalArgumentException(UtilConstantes.PROPERTY_NOT_FOUND));

        entity.setProIdepropieda(entity.getProIderegistro().toString());
        entity.setUsuIderegistro(idUs.longValue());
        entity.setEstTippropieda(unidadRepository.findEstByUnit(dto.getUniTippropieda()).longValue());
        entity.setProFecha(Timestamp.from(Instant.now()));
        entity.setProNumcatastral(dto.getProNumcatastral());
        entity.setProNumcatastralnacional(dto.getProNumcatastralnacional());
        entity.setProDigitos(dto.getProDigitos());
        entity.setUniMunicipio(dto.getUniMunicipio());
        entity.setUniBarrio(dto.getUniBarrio());
        entity.setProDireccion(dto.getProDireccion().toUpperCase());
        entity.setUniCmpdireccion(dto.getUniCmpdireccion());
        entity.setMubaSector(dto.getMubaSector());
        entity.setProAltriesgo(dto.getProAltriesgo());
        entity.setProZona(dto.getProZona());
        entity.setProSeccion(dto.getProSeccion());
        entity.setProManzana(dto.getProManzana());
        entity.setProGpsaltitud(dto.getProGpsaltitud());
        entity.setProGpslatitud(dto.getProGpslatitud());
        entity.setProGpslongitud(dto.getProGpslongitud());
        entity.setProNummatriculainmobiliaria(dto.getProNummatriculainmobiliaria());
        entity.setUniClasificacionvivienda(getClassifications(dto));
        setAdditionalInfo(entity);
        return propiedadRepository.save(entity);
    }

    /**
     * @param dto
     * @return
     */
    private List<Map<String, Object>> getClassifications(ProPropiedadDTO dto) {
        List<Map<String, Object>> mapList = new ArrayList<>();

        if (dto.getClasificacionViviendaDTOS() != null && !dto.getClasificacionViviendaDTOS().isEmpty())
            dto.getClasificacionViviendaDTOS().forEach(cDto -> {
                Map<String, Object> mapClassification = new HashMap<>();

                mapClassification.put("uni_ideregistro", cDto.getUniIderegistro());
                mapClassification.put("uni_nombre1", cDto.getUniNombre1());
                mapList.add(mapClassification);
            });

        return mapList;

    }

    /**
     * Metodo para eliminar una propiedad -
     *
     * @param id id de la propiedad
     */
    @Transactional
    public boolean delete(Integer id) {
        BigInteger dsusIderegistr = this.propiedadRepository.validatePropDsus(id);

        if (dsusIderegistr!=null)
            throw new IllegalArgumentException("No se ha podido eliminar: La propiedad se encuentra asociada a la suscripcion con id: "+dsusIderegistr.intValue());

        ProPropiedad prop = this.propiedadRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new IllegalArgumentException(UtilConstantes.PROPERTY_NOT_FOUND));

        if(prop.getProIdpadre()!=null){
            List<ProPropiedad> childs= this.propiedadRepository.findOtherChildProperties(prop.getProIdpadre(),prop.getProSecuenciaindep());
            for (ProPropiedad childProp:childs) {
                childProp.setProSecuenciaindep(childProp.getProSecuenciaindep()-1);
                this.propiedadRepository.save(childProp);
            }
        }

        this.propiedadRepository.delete(prop);
        return true;
    }

    /**
     * Metodo que valida existencia de suscripcion por id de propiedad
     *
     * @param idPr id propiedad
     * @return true o false
     */
    public boolean validateSubscription(Long idPr) {
        return dsusRepository.existsByProIderegistro(idPr) > 0;
    }

    /**
     * Metodo para contruir una dto
     *
     * @param dto  dto dto
     * @param idUs id de usuario
     * @return dto entity
     */
    private ProPropiedad buildProperty(ProPropiedadDTO dto, Integer idUs) {
        if (!unidadRepository.existsById(dto.getUniTippropieda()))
            throw new IllegalArgumentException("No se encuentra la unidad seleccionada.");

        ModelMapper modelMapper = new ModelMapper();
        ProPropiedad proPropiedad = modelMapper.map(dto, ProPropiedad.class);
        UniUnidad uniUnidad = new UniUnidad();

        uniUnidad.setUniIderegistro(dto.getUniTippropieda());
        proPropiedad.setProIdepropieda("0");
        proPropiedad.setProDescripcion(unidadRepository.findNameByUnit(dto.getUniTippropieda()));
        proPropiedad.setProEstado("A");
        proPropiedad.setUsuIderegistro(idUs.longValue());
        proPropiedad.setEstTippropieda(unidadRepository.findEstByUnit(dto.getUniTippropieda()).longValue());
        proPropiedad.setProFecha(Timestamp.from(Instant.now()));
        proPropiedad.setProDireccion(dto.getProDireccion() != null ? dto.getProDireccion().toUpperCase() : "");
        proPropiedad.setUniClasificacionvivienda(getClassifications(dto));
        if(proPropiedad.getProIdpadre()!=null){
            proPropiedad.setProSecuenciaindep(this.calculateSecuen(proPropiedad.getProIdpadre()));
        }
        return proPropiedad;
    }

    private Long calculateSecuen(Long idPadre){
        Long parentId=this.propiedadRepository.findParentProperty(idPadre);
        if(parentId!=null){throw new FailuresServiceException("No se puede clonar la proiedead debido a que esta ya es hija de la propiedad con id: "+parentId);}
        if(!this.propiedadRepository.existInDsus(idPadre)){ throw new FailuresServiceException("No se puede clonar la proiedead debido a que esta no se encuentra asociada a una suscripción.");}
        Long valueSequence=this.propiedadRepository.findChildsProperty(idPadre);
        if(valueSequence!=null){
            return (valueSequence+1);
        }else{
            return new Long(1);
        }
    }
    
    /**
     * Metodo para listar las propiedades
     *
     * @param idTercero id tercero
     * @return lista de propiedades
     */
    public List<ProPropiedad> listAllByIdTerceroIdEmpresa(Long idTercero, Integer idEmpresa, Integer municipio, Integer tipoPropiedad) {
        List<ProPropiedad> response = propiedadRepository.findAllByTerIderegistroAndIdempresa(idTercero, idEmpresa, municipio, tipoPropiedad);

        response.forEach(this::setAdditionalInfo);
        return response;
    }
    
}
