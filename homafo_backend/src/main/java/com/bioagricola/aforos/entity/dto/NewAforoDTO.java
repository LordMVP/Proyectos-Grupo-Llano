package com.bioagricola.aforos.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class NewAforoDTO {

	private Long uniTipoAforo;
	private String fechaRegistro;	
	private String vigenciaHasta;
	private String vigenciaDesde;
	private String vigenciaFinal;
	private String radicadoPqrs;
	
	private String frecuenciaRecoleccion;
	private String estado;
	private Long tecnicoAforador;
	//uni_tipogenerador?
	private String factor;
	
	private String observaciones;
	
	private String suscripcion;
	private String codigoSub;

	
	private String nombresYapellidos;
	private String direccion;
	private String tipoUso;
	private String referenciaComercial;
	private String actividadComercial;
	private String nombreEstablecimiento;
	private String barrioUsuario;
	private String barrioUsuarioCodigo;

	private String jornada;

	
	private Long conceptoAforo;
	
	
	private Long idSuscripcion;
	private Long idEmpresa;
	private Long idUsuario;
	private Long idPropiedad;
	private Long idTercero;
	private Long idUnidad;
	private String numPqr;
	private Long ideafopadre;
	private Long rureIderegistro;
	private Long afo_cantidadfrecuenciarecoleccion;

	private Integer tfdIderegistro;
	private Integer tfvIderegistro;
	private String tfdDescripcion;
	private Integer cantidad;
	private Integer frecuencia;
}
