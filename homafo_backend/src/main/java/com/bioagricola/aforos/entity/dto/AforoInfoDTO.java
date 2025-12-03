package com.bioagricola.aforos.entity.dto;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class AforoInfoDTO {
	
	private Long afoIderegistro;	
	private Long tipoAforoId;
	private String tipoAforoNombre;
	private String tipoAforoCodigo;
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date afoFechaInicio;
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date afoFechaVigencia;
    private String afoEstado;
    private Float mafvFactor;
    private String afoObservaciones;    
    private String afoNumpqr;
    private Long terAforadorId;
    private String terAforadorNombre;
    private String terAforadorDocumento;
    private Long claseAforoId;
    private String claseAforoNombre;
    private Long conceptoAforoId;
    private String conceptoAforoNombre;
    private Long afoIdeAfoPadre;
    private Long rureIderegistro;
    private Boolean afoDistribucionUniforme;
    private String dsusPcodigo;
    private AforoPreLiquidacionResponse aforoPreLiqDTO;
    private List<DetalleAforoInfoDTO> detalleAforo;
}
