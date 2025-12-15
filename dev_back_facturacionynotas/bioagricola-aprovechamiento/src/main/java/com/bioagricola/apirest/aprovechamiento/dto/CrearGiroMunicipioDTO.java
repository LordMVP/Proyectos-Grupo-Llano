package com.bioagricola.apirest.aprovechamiento.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class CrearGiroMunicipioDTO {

    @NotNull(message = "La fecha de pago es obligatoria")
    private LocalDate fechaPago;

    @NotNull(message = "El total del giro es obligatorio")
    @Positive(message = "El total del giro debe ser mayor a cero")
    private BigDecimal totalGiroMunicipio;

    private String observaciones;

    @NotNull(message = "Los detalles son obligatorios")
    private List<DetalleGiroDTO> detalles;

    @Data
    public static class DetalleGiroDTO {
        @NotNull(message = "El mes/año de pago es obligatorio")
        private Integer mesAnioPago; // Formato YYYYMM

        @NotNull(message = "El valor girado es obligatorio")
        @Positive(message = "El valor girado debe ser mayor a cero")
        private BigDecimal valorGirado;
    }
}
