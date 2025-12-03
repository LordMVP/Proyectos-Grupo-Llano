package com.bioagricola.aforos.entity.dto;

import java.util.List;

import lombok.Data;

@Data
public class AforoPreLiquidacionResponse {


	private Long aforo;
	private Long minimoVisitas;
	private Long visitasTramitadas;
	private Double totalVisitasConsolidado;
	private Double volumenMedio;
	private Double pesoMultiusuario;
	private Boolean valido;
	private String mensaje;
	private List<GenGeneradorResource> generadores;
	private List<DetalleAforoInfoDTO> detalleAforo;
	private MaestroVisitasResource maestroVisitas;
	private Long tipoAforo;
}
