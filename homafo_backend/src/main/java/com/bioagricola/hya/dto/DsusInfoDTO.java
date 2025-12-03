package com.bioagricola.hya.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

/**
 * Clase dto de info suscripcion
 *
 * @author cperez@progracol.com
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class DsusInfoDTO {

    private Integer idempresa;

    private String nombrempresa;

    private String ternombre;

    private String pcodigo;

    private Long dsusid;

    private String estado;

    private String tipouso;

    private String direccion;

    private String barrio;

    private String medidor;
    
    private String longitude;
    
    private String latitude;

    private String facturacion;
    
    private DsusInfoDTO alterna;
}
