package com.bioagricola.hya.dto;

import com.bioagricola.aforos.entity.DetalleConceptoVisitaAforo;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class DetalleVisitaDTO {

    private Long visitaId;

    private List<DetalleConceptoVisitaAforo> detallesVisita;

    private String observacionVisita;

    private List<ImgDescriptionDTO> detalleImagen;

    private Map<String,String> detalleImagenMap;
}
