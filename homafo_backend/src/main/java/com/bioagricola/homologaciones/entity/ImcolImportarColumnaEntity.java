package com.bioagricola.homologaciones.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;
import com.bioagricola.common.util.ENUM_COLUMN_TYPE_DATA;
import com.bioagricola.common.util.ENUM_IMCOL_TIPO_RESOLUCION;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "imcol_importar_columna", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor 
public class ImcolImportarColumnaEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="imcol_ideregistro")
	private Long imcolIderegistro;
	
	@ManyToOne
	@JoinColumn(name="imarc_ideregistro",referencedColumnName = "imarc_ideregistro")
	private ImarcArchivosImportacion imarcIderegistro;
	
	@Column(name="imcol_nombre")
	private String imcolNombre;
	
	@Column(name="imcol_descripcion")
	private String imcolDescripcion;
	
	@Column(name="imcol_tipo_dato")
	@Enumerated(EnumType.STRING)
	private ENUM_COLUMN_TYPE_DATA imcolTipoDato;
	
	@Column(name="imcol_obligatorio")
	private Boolean imcolObligatorio;
	
	@Column(name="imcol_validador")
	private String imcolValidador;
	
	@Column(name="imcol_tipo_resolucion")
	@Enumerated(EnumType.STRING)
	private ENUM_IMCOL_TIPO_RESOLUCION imcolTipoResolucion;
	
	@Column(name="imcol_json")
	private String imcolJson;

	@Column(name="imcol_columna_default")
	private String imcolColumnaDefault;

}
