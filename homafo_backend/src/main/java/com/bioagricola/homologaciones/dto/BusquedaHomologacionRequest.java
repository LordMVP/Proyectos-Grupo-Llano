package com.bioagricola.homologaciones.dto;

import java.util.Date;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class BusquedaHomologacionRequest
{
	private String dsus9dsus_pcodigo;
    //private String ter9ñter_nomcompleto;
	private Integer ter9ter_ideregistro;
    private String ter9ter_documento;
    private Integer pro9uni_tipovivienda;
    private Integer dsus9pro_catestrato;
    //private String pro9pro_direccion;
    private String pro9ñpro_direccion;
    private String pro9pro_idepropieda;
    private Integer proyecto9proyecto_ideregistro;
    private Integer dsus9uni_barrio;
    private Integer dsus9dsus_ideregistr;
    private Integer dsus9uni_tipusosuscr;
    private String pro9pro_numcatastral;
    private Integer cic9cic_ideregistro;
    private Integer rut9rut_ideregistro;
    private String dsus9dsus_estado;
    private Integer empresa;
    private String proidepropieda;
    private Integer dsusIderegistr;
    private String dsusPcodigo;
    private Integer empresaSession;
    private Date dsus8dsus_fecinicio;
    private Date dsus9dsus_fecinicio;
    
    
	
    
}
