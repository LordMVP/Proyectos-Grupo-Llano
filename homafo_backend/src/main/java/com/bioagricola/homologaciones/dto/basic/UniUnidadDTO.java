package com.bioagricola.homologaciones.dto.basic;

import java.util.Date;

import com.bioagricola.common.util.RawJsonDeserializer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Data
@Getter@Setter
public class UniUnidadDTO {
	
	private Long uniIderegistro;	
	private String uniCodigo;
	private String uniCodigo1;
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String uniCodigo2;	
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String uniCodigo3;	
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String uniCodigo4;	
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String uniCodigo5;	
	private String uniNombre1;	
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String uniNombre2;
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String uniNombre3;	
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String uniNombre4;
	@JsonInclude(JsonInclude.Include.NON_NULL)	
	private String uniNombre5;	
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private Long uniOrden;
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private Long uniNivel;	
	@JsonIgnore
	private Date uniFecha;
	@JsonRawValue
	@JsonDeserialize(using = RawJsonDeserializer.class)
	private String uniPropiedad;
	
	
	
}
