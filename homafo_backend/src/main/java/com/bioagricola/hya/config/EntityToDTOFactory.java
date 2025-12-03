package com.bioagricola.hya.config;

import com.bioagricola.common.dto.EmpresasDTO;
import com.bioagricola.common.entity.*;
import com.bioagricola.hya.dto.*;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Function;

@Configuration
public class EntityToDTOFactory {

    @Bean
    public Function<TerTerceroDTO, TerTercero> convertToTerTercero(ModelMapper mapper) {
        return terTerceroDTO -> mapper.map(terTerceroDTO, TerTercero.class);
    }

    @Bean
    public Function<TerTercero, TerTerceroDTO> convertToTerTerceroDTO(ModelMapper mapper) {
        return terTercero -> mapper.map(terTercero, TerTerceroDTO.class);
    }

    @Bean
    public Function<ClteClatercero, ClteClaterceroDTO> convertToClteClaterceroDTO(ModelMapper mapper) {
        return clteClatercero -> mapper.map(clteClatercero, ClteClaterceroDTO.class);
    }

    @Bean
    public Function<ClteClaterceroDTO, ClteClatercero> convertToClteClatercero(ModelMapper mapper) {
        return clteClaterceroDTO -> mapper.map(clteClaterceroDTO, ClteClatercero.class);
    }

    @Bean
    public Function<UniUnidad, UniUnidadDTO> convertToUniUnidadDTO(ModelMapper mapper) {
        return uniUnidad -> mapper.map(uniUnidad, UniUnidadDTO.class);
    }

    @Bean
    public Function<CosuConsuscrip, CosuConsuscripDTO> convertToCosuConsuscripDTO(ModelMapper mapper) {
        return cosuConsuscrip -> mapper.map(cosuConsuscrip, CosuConsuscripDTO.class);
    }

    @Bean
    public Function<IasusInforadicionalsuscripcion, IasusInforadicionalsuscripcionDTO> convertToIasusInforadicionalsuscripcionDTO(ModelMapper mapper) {
        return entity -> mapper.map(entity, IasusInforadicionalsuscripcionDTO.class);
    }

    @Bean
    public Function<RrbaRutaRecoleccionBarrido, RrbaRutaRecoleccionBarridoDTO> convertToRrbaRutaRecoleccionBarridoDTO(ModelMapper mapper) {
        return entity -> mapper.map(entity, RrbaRutaRecoleccionBarridoDTO.class);
    }

    @Bean
    public Function<RaprRutaAprovechamiento, RaprRutaAprovechamientoDTO> convertToRaprRutaAprovechamientoDTO(ModelMapper mapper) {
        return entity -> mapper.map(entity, RaprRutaAprovechamientoDTO.class);
    }

    @Bean
    public Function<GhomGestionhomologa, GestionHomologaDTO> convertToGestionHomologaDTO(ModelMapper mapper) {
        return entity -> mapper.map(entity, GestionHomologaDTO.class);
    }

    @Bean
    public Function<DghoDetallegestionhomologa, DetalleGestionHomologaDTO> convertToDetalleGestionHomologaDTO(ModelMapper mapper) {
        return entity -> mapper.map(entity, DetalleGestionHomologaDTO.class);
    }

    @Bean
    public Function<Empresas, EmpresasDTO> convertToEmpresasDTO(ModelMapper mapper) {
        return entity -> mapper.map(entity, EmpresasDTO.class);
    }
}
