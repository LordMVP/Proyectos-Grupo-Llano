package com.bioagricola.aforos.entity.dto;

import java.util.Date;
import java.util.List;


import lombok.Data;


@Data
public class MaestroVisitasResource {

	private Long mafvIderegistro;
	private Date mafvInicio;
	private Date mafvFin;
	private String mafvEstado;
	private Date mafvFecharegistro;
	private Date mafvFechaactualizacion;
	private Long perIderegistro;
	private Long cicCiclo;
	private Long uniTipogenerador;
	private String mafvFactor;
	private Long usuIderegistro;
	private Long perIderegistrofin;
	private List<DetalleMaestroVisitaResource> detallesMaestroVisita;
	private Long mafvMinimoVisitas;
	private Long aforo;

}
