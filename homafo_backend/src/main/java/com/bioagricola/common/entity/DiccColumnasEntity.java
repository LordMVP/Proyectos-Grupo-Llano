package com.bioagricola.common.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "dicc_columnas", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class DiccColumnasEntity {

	@Id
	@Column(name="dicc_ideregistro")
	private Long diccIderegistro;
	
	@Column(name="dicc_tabla")
	private String diccTabla;
	
	@Column(name="dicc_columna")
	private String diccColumna;
	
	@Column(name="dicc_etiqueta")
	private String diccEtiqueta;
	
	
}
