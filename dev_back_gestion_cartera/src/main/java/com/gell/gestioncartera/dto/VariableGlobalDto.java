package com.gell.gestioncartera.dto;


import com.gell.gestioncartera.entidades.VariableGlobal;

import io.swagger.annotations.ApiModel;
import lombok.Data;
/**
 * 
 * @author TSI
 * Clase tipo entidad JPA para el registro de variables globales dto
 */
@ApiModel("Modelo Variable global dto")
@Data
public class VariableGlobalDto {
	private Long vglo_idregistro;
	private String vglo_descripcion;
	
	private Long uni_atrmaestrocartera;
	private String uni_nombreatrmaestrocartera;
	
	private boolean vglo_esatrmaestrocartera;
	private double vglo_valorconstante;
	private boolean vglo_esvalorconstante;
	private boolean vglo_esvcalculado;
	
	private Long uni_tipometodo;
	private String uni_nombretipometodo;
	
	private Long uni_origenmetodo;
	private String uni_nombreorigenmetodo;
	
	private Long uni_tipodato;
	private String uni_nombretipodato;
}
