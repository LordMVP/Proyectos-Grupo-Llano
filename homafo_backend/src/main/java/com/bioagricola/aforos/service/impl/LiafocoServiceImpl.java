package com.bioagricola.aforos.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.aforos.entity.Liafoco;
import com.bioagricola.aforos.entity.dto.LiafocoDTO;
import com.bioagricola.aforos.repository.LiafocoRepository;

@Service
@Transactional
public class LiafocoServiceImpl {
    
    private static final Logger log = LoggerFactory.getLogger(LiafocoServiceImpl.class);
    
    @Autowired
    private LiafocoRepository liafocoRepository;
    
    /**
     * Obtener liquidaciones por hafo_ideregistro
     */
    public List<LiafocoDTO> obtenerLiquidacionesPorHafo(Integer hafoId) {
        log.info("Obteniendo liquidaciones para hafo_ideregistro: {}", hafoId);
        List<Liafoco> liquidaciones = liafocoRepository.findByHafoIderegistro(hafoId);
        return convertirADTO(liquidaciones);
    }

    /**
     * Cambiar el estado de cobro (de true a false o viceversa)
     */
    public boolean cambiarEstadoCobro(Integer liafocoId, Boolean nuevoEstado) {
        log.info("Cambiando estado de cobro para liquidación ID: {} a: {}", liafocoId, nuevoEstado);

        Optional<Liafoco> liquidacionOpt = liafocoRepository.findById(liafocoId);

        if (!liquidacionOpt.isPresent()) {
            log.warn("No se encontró liquidación con ID: {}", liafocoId);
            return false;
        }

        Liafoco liquidacion = liquidacionOpt.get();
        liquidacion.setLiafocoCobro(nuevoEstado);
        liafocoRepository.save(liquidacion);

        log.info("Estado de cobro actualizado exitosamente para ID: {}", liafocoId);
        return true;
    }

    /**
     * Convertir lista de entidades a DTOs
     */
    private List<LiafocoDTO> convertirADTO(List<Liafoco> liquidaciones) {
        return liquidaciones.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Convertir entidad a DTO
     */
    private LiafocoDTO convertirADTO(Liafoco liafoco) {
        return new LiafocoDTO(
                liafoco.getLiafocoIderegistro(),
                liafoco.getLiafocoValortotal(),
                liafoco.getLiafocoIndividual(),
                liafoco.getLiafocoCobro(),
                liafoco.getLiafocoUnidadesIndependientes(),
                liafoco.getLiafocoVisitas()
        );
    }
}

