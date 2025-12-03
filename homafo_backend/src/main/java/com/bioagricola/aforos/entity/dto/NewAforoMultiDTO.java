package com.bioagricola.aforos.entity.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class NewAforoMultiDTO {
	Long afoIderegistro;

	Long uniTipoaforo;
	String afoFecha;
	String afoFechaInicio;
	String afoFechafinvegencia;
	String afoNumpqr;
	Long uniClaseSuscripcionaforo;
	String afoFrecuenciaRecoleccion;
	String afoEstado;
	Long terAforador;

	//String uni_tipogenerador;
	String mafvFactor;

	String afoObservaciones;
	//Long afo_cantidadfrecuenciarecoleccion;
	//String tfd_idregistro;
	//String barrio_idregistro;
	//String uni_complemento;
	//Long afo_idpadre;
	String afoFechaActualizacion;
	String rureIdregistro;

	List<DafoDetAforoDTO> dafoDetAforo;
	Long afoCantidadfrecuenciarecoleccion;
	Long barrioIderegistro;
	Long complementoIdregistro;
	Long afoIdeafopadre;
	String afomDistribucion;
	String afomDistribucionNombre;
	Long conceptoAforo;
	String afomDireccion;
	String afomDescripcion;
	Boolean distribucionUniforme;
	
	private Integer tfdIderegistro;
	private Integer tfvIderegistro;
	private String tfdDescripcion;
	private Integer cantidad;
	private Integer frecuencia;


}


