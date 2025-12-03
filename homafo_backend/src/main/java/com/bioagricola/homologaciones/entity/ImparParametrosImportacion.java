package com.bioagricola.homologaciones.entity;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "impar_parametros_importacion", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor 
public class ImparParametrosImportacion implements Serializable
{
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "impar_ideregistro")
	private Integer imparIderegistro;
	
	@Column(name = "impar_columna_interna")
    private String imparColumnaInterna;
	
	@Column(name = "impar_columna_externa")
    private String imparColumnaExterna;
	
	@Column(name = "impar_tabla_interna")
    private String imparTablaInterna;
	
	@Column(name = "impar_tipo_dato")
    private String imparTipoDato;
	
	@Column(name = "impar_obligatorio")
    private Boolean imparObligatorio;
	
	@Column(name = "impar_homologa")
    private Boolean imparHomologa;
	
	@JoinColumn(name = "imarc_ideregistro", referencedColumnName = "imarc_ideregistro")
	@ManyToOne(optional = false)
	//@Column(name = "imarc_ideregistro")
    private ImarcArchivosImportacion imarcIderegistro;
	
	@Column(name = "impar_tabla_referencia")
    private String imparTablaReferencia;
	
	@Column(name = "impar_columna_referencia")
    private String imparColumnaReferencia;
	
	@Column(name = "impar_encabezado")
    private Boolean imparEncabezado;
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "imparIderegistro")
    private List<DimpaDetaImportparam> DimpaDetaImportparamList;
}
