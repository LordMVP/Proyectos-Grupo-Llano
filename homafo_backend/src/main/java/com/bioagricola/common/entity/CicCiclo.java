package com.bioagricola.common.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cic_ciclo", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter @Setter @NoArgsConstructor
public class CicCiclo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "cic_ideregistro")
	private Long cicIderegistro;
	
	@Column(name = "usu_ideregistro")
	private Long usuIderegistro;
	
	@Column(name = "cic_periodos")
	private Long cicPeriodos;
	
	@Column(name = "cic_nombre")
	private String cicNombre;
	
	@Column(name = "cic_estado")
	private String cicEstado;
	
	@Column(name = "cic_diainicia")
	private Long cicDiainicia;
	
	@Column(name = "cic_diafinaliza")
	private Long cicDiafinaliza;
	
	@Column(name = "cic_anoactual")
	private Long cicAnoactual;
}
