package com.bioagricola.homologaciones.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class HomologacionInfoSuscripcionRequest
{
	private String dsus_estado;
    private String dsus_fecinicio;
    private String dsus_fecexpira;
    private Integer uni_municipio;
    private Integer uni_tipusosuscr;
    private Integer pro_catestrato;
    private Integer cic_ideregistro;
    private Boolean iasus_cobrojuridico;
    private Integer uni_liquidacion;
    private Boolean iasus_pagapeaje;
    private String iasus_referenciacomercial;
    //rutas:[],
    private List<CosuConsuscripRequest> conceptosRelacionados;
    private Integer sus_ideregistro;
    private Integer dsus_ideregistr;
    private Integer emp_ideregistro;
    private Integer usu_ideregistro;
    private Integer rut_ideregistro_rec;
    private Integer rut_ideregistro_bar;
    private Integer rut_macroRuta;
    private RutaprRutaRequest aprovechamiento;
    private Integer uni_barrio;

}
