package com.bioagricola.aforos.entity;

import java.io.Serializable;

import javax.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ClaveConsolidadoLVA implements Serializable{

	private static final long serialVersionUID = 1L;
	private String clva_tipo_liquidacion;
	private Long mafv_ideregistro;
}
