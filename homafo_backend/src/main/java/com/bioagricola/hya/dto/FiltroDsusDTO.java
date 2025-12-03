package com.bioagricola.hya.dto;

import lombok.Data;

/**
 * Clase que define los parametros del filtro de suscripciones
 *
 * @author cperez@progracol.com
 */
@Data
public class FiltroDsusDTO {
    private Integer idempresa;
    private String medidor;
    private String pcodigoalterna;
    private String pcodigobio;
    private String direccion;
    private Integer idbarrio;
    private String numpqr;
    private String estado;
    private Integer idmunicipio;
    private String ternombre;
    private String terdocumento;
    private String numcatastral;
    private Long idpropiedad;
    private Long idsus;
    private String pcodigo;
    private Boolean deshomologacion;
}
