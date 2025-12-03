package com.bioagricola.homologaciones.dto.basic;

import java.util.Collection;
import java.util.Date;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter@Setter
public class TafoTipoAforoDTO {

	private Long tafoIderegistro;
	private Integer tafoFrecuencia;
	private Integer tafoVigencia;
	private Integer tafoPlazoMaximo;
	private Integer tafoHolgura;
	private Float tafoFactorProduccion;
	private Long uniClaseaforo;
	private Boolean tafoAforoPadre;
	private UniUnidadDTO unidad;
	private Collection<DtafoDetaTipoAforoDTO> detalles;
	private Date dateCreated;
}
