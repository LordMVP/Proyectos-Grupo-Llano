package com.bioagricola.homologaciones.dto.basic;

import lombok.Data;

@Data
public class DiaSemanaPrototypeDTO {
	private String label;
	private Integer value;
	
	static public String getLabel(Integer value) {
		switch(value) {
			case 1:return "Lunes";
			case 2:return "Martes";
			case 3:return "Miercoles";
			case 4:return "Jueves";
			case 5:return "Viernes";
			case 6:return "Sabado";
			case 7:return "Domingo";
		}
		return null;
	}
}
