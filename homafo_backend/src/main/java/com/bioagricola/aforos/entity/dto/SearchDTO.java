package com.bioagricola.aforos.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SearchDTO {

	private String suscripcion;
	private String codigoSub;
	private String radicadoPqrs;
	
	private String nombres_apellidotercer;
	private String documento_tercer;
	
	private String ubicacion;
	private String estrato;
	private String direccion;
	private String municipio;
	private String barrio;
	private String numCatastral;
	private String tipo_Uso;
	private String ciclo;
	private String ruta;
	private String catastral;
	private String estado;
	private String numAforo;
	
	//Buscador de visitas también usa numAforo
	private String desde;
	private String hasta;
	private String idTecnicoAforador;
	private String idTipoAforo;
	
	private String numAforoPadre;
	private String complemento;
	private String fechaInicio;
	private String fechaFin;
	private String stoYSena;
}
