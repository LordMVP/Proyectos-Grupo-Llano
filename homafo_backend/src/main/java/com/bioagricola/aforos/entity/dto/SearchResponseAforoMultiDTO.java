package com.bioagricola.aforos.entity.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SearchResponseAforoMultiDTO {

	private Long idAforo;
	private String afo_fecha;	
	private Long uni_tipoaforo;
	private String afo_fechaInicio;
	private String afo_fechafinvegencia;
	private String afo_numpqr;
	//private Long uni_claseSuscripcionaforo;
	private String afo_frecuenciaRecoleccion;
	private String afo_estado;
	private Long ter_aforador;
	private String mafv_factor;

	private String afo_observaciones;
	private Long rure_idregistro;

	private List<DafoDetAforoDTO> dafoDetAforo;
	private Long afo_cantidadfrecuenciarecoleccion;
	
	private String afom_distribucion;
}
