package com.bioagricola.hya.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class CosuConsuscripDTO {
    private Long cosuIdregistr;
    private Long uniConcepto;
    private Integer cantidad;
    private Integer vlrUnitario;
    private Integer vlrTotal;
    private Date fecInicio;
    private Date fecFinal;
    private String cosuEstado;
    private Integer orden; 
    
    
	public CosuConsuscripDTO(Long cosuIdregistr, Long uniConcepto, Integer cantidad, Integer vlrUnitario,
			Integer vlrTotal, Date fecInicio, Date fecFinal, String cosuEstado, Integer orden) {
		this.cosuIdregistr = cosuIdregistr;
		this.uniConcepto = uniConcepto;
		this.cantidad = cantidad;
		this.vlrUnitario = vlrUnitario;
		this.vlrTotal = vlrTotal;
		this.fecInicio = fecInicio;
		this.fecFinal = fecFinal;
		this.cosuEstado = cosuEstado;
		this.orden = orden ;
	}
    
    
}
