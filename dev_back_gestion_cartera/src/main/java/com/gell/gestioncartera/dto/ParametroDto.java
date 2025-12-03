package com.gell.gestioncartera.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
/**
 * 
 * @author TSI
 * Clase DTO para enviar respuesta con los datos del json de parametro
 */
@Data
public class ParametroDto implements Serializable {
	private static final long serialVersionUID = 1L;
	private Long etapas_gestion_cartera;
	private Long atributo_maestro_cartera;
	private Long calculo_gestion_cartera;
	private Long clase_restriccion_cond_finan;
	private Long clasificacion_ejecutivos;
	private Long concepto_comision_gestion_cartera;
	private Long condicional_gestion_cartera;
	private Long dato_salida_gestion_cartera;
	private Long estado_ejecutivos;
	private Long metodo_backend_gestion_cartera;
	private Long metodo_carga_gestion_cartera;
	private Long procedimiento_gestion_cartera;
	private Long proceso_gestion_cartera;
	private Long tipo_recurso_gestion_cartera;
	private Long tipo_restriccion_gestion_cartera;
	private Long unidad_tiempo_gestion_cartera;
	private List<Long> uni_clase_tercero_gestion;
	private List<Long> programas_cond_financ;
}
