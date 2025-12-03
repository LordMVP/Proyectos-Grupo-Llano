package com.bioagricola.homologaciones.dto.basic;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter@Setter
public class RutRutaDTO {

	private Long rutIderegistro;
	private String rutNombre;
	private String rutTipo;
	private Long cicIderegistro;
	private Long usuIderegistro;
	private UniUnidadDTO uniTiporuta;
	private String rutCodigo;
}
