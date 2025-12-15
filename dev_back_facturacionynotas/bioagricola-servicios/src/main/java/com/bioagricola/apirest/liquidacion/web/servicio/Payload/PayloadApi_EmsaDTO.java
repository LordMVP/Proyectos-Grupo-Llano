package com.bioagricola.apirest.liquidacion.web.servicio.Payload;

import java.time.LocalDate;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Data;

/*
 * @author Yoner Silva
 */
@Data
public class PayloadApi_EmsaDTO {
    @NotNull(message = "La autenticación no puede ser nula.")
    private String autenticacion;
    
    //Datos actualizar cliente
    private String codigo_cliente;
    private Integer valor;
    private String codigo_ean;   
    
    private LocalDate rango_fecha_desde;
    private LocalDate rango_fecha_hasta;
    
    private LocalDate fecha_reporte;
}
