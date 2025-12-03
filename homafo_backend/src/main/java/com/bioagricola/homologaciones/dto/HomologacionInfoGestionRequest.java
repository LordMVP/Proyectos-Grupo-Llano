package com.bioagricola.homologaciones.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor
public class HomologacionInfoGestionRequest
{
	private String fecha1;
    private String observaciones;
    private Integer visita;
    private Integer liquidacion;
    private Integer colaborador;
    private List<String> archivos;
    private Integer dsus_ideregistr;
    private String dsus_pcodigo;
    private List<Object[]> parametros;
    private Integer usu_ideregistro;
    private String reclamo_numpqr;
    private VisitasSolRequest visitas;

}
