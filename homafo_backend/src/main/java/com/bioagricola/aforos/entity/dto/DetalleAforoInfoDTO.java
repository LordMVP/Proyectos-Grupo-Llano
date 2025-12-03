package com.bioagricola.aforos.entity.dto;

import java.util.Date;

import lombok.Data;

@Data
public class DetalleAforoInfoDTO {

     private Long dafoIderegistro;
     private Date  dafoFecharegistro;
     private Date  dafoFechactualizacion;
     private Date  afoFechafinvegencia;
     private String afoNumpqr;
     private Long dsusIderegistr;
     private DsusSuscripcionResource dsusResource;
     private String dafoMultiusuporcentaje;
     private Long usuIderegistro;
     private Long aforo;
}
