package com.bioagricola.aforos.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class EditAforoDTO {

	private String suscripcion;				 
	private String nombresApellidoTercero;	
	private String documentoTercero;	
	
	private String barrio;
	private String estado; 					//Activo/Inactivo
	private String vigenciaDesde;
	private String vigenciaHasta;
	private String fechaCreacion;
	private String fechaActualizacion;
	private String observaciones;
	
	private String codUsuario;
	private String nombreUsuario;
	private String direccion;
	private String actividadComercial;
	private String tipoGenerador;
	private String santoSenia;				//Nombre establecimiento
	private String referenciaComercial;
	private String numAforo;				//Id Aforo
	private String fechaInicial;
	private String fechaProrroga;
	private Integer rutaMicroMacro;
	
	private Long idBarrio;
	private Long idMunicipio;
	private Long idTipoGenerador;
	private Long idActividadComercial;
	private String nombreTipoAforo;
	private String nombreConcepto;
}

