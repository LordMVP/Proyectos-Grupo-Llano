package com.bioagricola.homologaciones.entity;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "imarc_archivos_importacion", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor 
public class ImarcArchivosImportacion implements Serializable
{
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "imarc_ideregistro")
	private Long imarcIderegistro;
	@Column(name = "imarc_nombre_archivo")
    private String imarcNombreArchivo;
	@Column(name = "imarc_tipo_archivo")
    private String imarcTipoArchivo;
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "imarcIderegistro")
    private List<ImparParametrosImportacion> ImparParametrosImportacionList;
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "imarcIderegistro")
	private List<ImcolImportarColumnaEntity> imcolList;
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "imarcIderegistro")
	private List<IminsImportarInsertsEntity> iminsList;

	@Column(name = "imarc_tipo_proceso")
	private Integer imarcTipoProceso;
	
	@Column(name = "imarc_estado")
	private String imarcEstado;
	
}
