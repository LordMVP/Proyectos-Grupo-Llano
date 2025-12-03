package com.bioagricola.homologaciones.entity;

import java.time.LocalDateTime;
import java.util.Date;
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
import javax.persistence.Transient;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pimp_proceso_importacion", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor 
public class PimpProcesoImportacion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="pimp_ideregistro")
	private Long pimpIderegistro;
	
	@ManyToOne
	@JoinColumn(name="imarc_ideregistro",referencedColumnName = "imarc_ideregistro")
	private ImarcArchivosImportacion imarcIderegistro;
	
	@Column(name="pimp_fecha_creacion")
	private LocalDateTime pimpFechaCreacion;
	
	@Column(name="pimp_fecha_actualizacion")
	private LocalDateTime pimpFechaActualizacion;
	
	@Column(name="usu_ideregistro")
	private Long usuIderegistro;
	
	@Column(name="emp_ideregistro")
	private Long empIderegistro;
	
	@Column(name="pimp_estado")
	private String pimpEstado;
	
	@Column(name="pimp_numero_registros")
	private Integer pimpNumeroRegistros;
	
	@Column(name="pimp_descripcion")
	private String pimpDescripcion;
	
	@OneToMany(cascade = CascadeType.ALL,mappedBy = "pimpIderegistro")
	private List<PiminsProyeccionImins> proyecciones;
	
	@Transient
	private List<String> mensajesError;
	
	
}
