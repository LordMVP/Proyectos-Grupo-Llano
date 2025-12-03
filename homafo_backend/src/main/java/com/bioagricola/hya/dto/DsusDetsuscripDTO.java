package com.bioagricola.hya.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
public class DsusDetsuscripDTO {
    private Long dsusIderegistr;
    private String dsusPcodigo;
    private Date dsusFecinicio;
    private String dsusDescripcion;
    private Long estTipsuscripc;
    private Long uniTipsuscripc;
    private Long cicIderegistro;
    private Long estTipusosuscr;
    private Long uniTipusosuscr;
    private Short proCatestrato;
    private Long susIderegistro;
    private Long terIderegistro;
    private Long proIderegistro;
    private Integer estLiquidacion;
    private Long uniLiquidacion;
    private Long uniMunicipio;
    private Long uniBarrio;
    private String dsusEstado;
    private Date dsusIniestado;
    private Date dsusFinestado;
    private BigDecimal dsusFactor;
    private Integer empIderegistro;
    private Long uniActsuscripc;
    private Integer usuIderegistro;
    private Date dsusFecexpira;
    private String dsusResolestrato;
    private String terNomcompleto;
    private String uniTipoDoc;
    private String cnreNombre;
    private String proDescripcion;
    private Long rutIderegistro;
    private Integer cnreId;
    private String proDireccion;
    private String municipio;
    private IasusInforadicionalsuscripcionDTO inforadicionalsuscripcionDTO;
    private RrbaRutaRecoleccionBarridoDTO recoleccionBarridoDTO;
    private RaprRutaAprovechamientoDTO rutaAprovechamientoDTO;
    private List<CosuConsuscripDTO> conceptos;
}
