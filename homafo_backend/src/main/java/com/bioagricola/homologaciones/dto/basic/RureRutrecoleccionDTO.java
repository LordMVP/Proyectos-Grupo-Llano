package com.bioagricola.homologaciones.dto.basic;

import java.util.Set;

import javax.validation.constraints.NotNull;

import com.bioagricola.common.util.RawJsonDeserializer;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter@Setter
public class RureRutrecoleccionDTO {

	private Long rureIderegistro;
	@NotNull
	private Long arprIderegistro;
	private String arprNombre;
	private RutRutaDTO rutIdemacruta;	
	@JsonRawValue
	@JsonDeserialize(using = RawJsonDeserializer.class)
	private String rutMicroruta;
	private Set<HrrHorrecoleccionDTO> horarios;
	private Set<RutRutaDTO> microrutas;
	
	
}
