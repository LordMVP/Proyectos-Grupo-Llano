package com.bioagricola.homologaciones.dto.basic;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter 
@Setter @NoArgsConstructor 
public class HrrHorrecoleccionDTO {
	
	private Long hrrIderegistro;	
	private String hrrDia;
	private Long rureIderegistro;
	private String hrrHorinicio;	
	private String hrrHorfin;	
	private Integer hrrDiaValor;
	private char hrrSwtact;
	private String microruta;
	

}
