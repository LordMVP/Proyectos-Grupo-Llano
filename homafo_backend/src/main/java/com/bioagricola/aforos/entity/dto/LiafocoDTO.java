package com.bioagricola.aforos.entity.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LiafocoDTO {
    
    private Integer liafocoIderegistro;
    private BigDecimal liafocoValortotal;
    private BigDecimal liafocoIndividual;
    private Boolean liafocoCobro;
    private Integer liafocoUnidadesIndependientes;
    private Integer liafocoVisitas;
    
    public LiafocoDTO(BigDecimal liafocoValortotal, BigDecimal liafocoIndividual,
                      Boolean liafocoCobro, Integer liafocoUnidadesIndependientes, Integer liafocoVisitas) {
        this.liafocoValortotal = liafocoValortotal;
        this.liafocoIndividual = liafocoIndividual;
        this.liafocoCobro = liafocoCobro;
        this.liafocoUnidadesIndependientes = liafocoUnidadesIndependientes;
        this.liafocoVisitas = liafocoVisitas;
    }
}

