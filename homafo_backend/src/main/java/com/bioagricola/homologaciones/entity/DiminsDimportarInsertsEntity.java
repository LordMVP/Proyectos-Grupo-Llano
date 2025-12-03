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
@Table(name = "dimins_dimportar_inserts", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor 
public class DiminsDimportarInsertsEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="dimins_ideregistro")
	private Long diminsIderegistro;
	
	@ManyToOne
	@JoinColumn(name="imins_ideregistro",referencedColumnName = "imins_ideregistro")
	private IminsImportarInsertsEntity iminsIderegistro;
	
	@Column(name="dimins_column_name")
	private String diminsColumnName;
	
	@Column(name="dimins_json")
	private String diminsJson;	
		
	@Column(name="dimins_tipo_resolucion")
	@Enumerated(EnumType.STRING)
	private ENUM_IMCOL_TIPO_RESOLUCION diminsTipoResolucion;
	
	@Column(name="dimins_tipo_dato")
	@Enumerated(EnumType.STRING)	
	private ENUM_COLUMN_TYPE_DATA diminsTipoDato;
	
	@Column(name="dimins_obligatorio")
	private Boolean diminsObligatorio;
	
	@Column(name="dimins_validador")
	private String diminsValidador;
	
	@Column(name="dimins_longitud")
	private Integer diminsLongitud;	
	
	@Column(name="dimins_editable")
	private Boolean diminsEditable;
	
	@Column(name="dimins_sugerido")
	private Boolean diminsSugerido;
	
	@Column(name="dimins_json_sugerido")
	private String diminsJsonSugerido;
}
