package com.bioagricola.aforos.entity.dto;

import java.util.List;

import com.bioagricola.homologaciones.entity.TafoTipoAforo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TipoAforosFrecuenciasDTO {
	private Long id;
	private String Object;
	private TafoTipoAforo TipoAforos;
	private Integer frecuencia;
	private Integer cantidad;
	private Integer tfdIderegistro;
	private String tfdDescripcion;
	private Integer tfvIderegistro;
	private String diasSemana;
}
