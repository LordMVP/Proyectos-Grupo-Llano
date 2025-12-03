package com.gell.gestioncartera.entidades;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Calendar;
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
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * 
 * @author TSI
 * Clase tipo entidad JPA para el registro de Clasificación
 */
@Data
@Entity
@Table(name="est_estrategias", schema="aseo")
@ApiModel("Modelo Estrtategias")
public class Estrategia {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="est_idregistro")
	private Long est_idregistro;

//	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
//	@JoinColumn(name = "uni_unidadestado", updatable = false, insertable = false, referencedColumnName = "uni_ideregistro")
//	private Unidad estadoEjecutivo;
//	
	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name = "uni_unidadestado", updatable = false, insertable = false, referencedColumnName = "uni_ideregistro")
	private Unidad estadoEstrategia;
//	
//	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
//	@JoinColumn(name = "uni_unidadestadotgestion", updatable = false, insertable = false, referencedColumnName = "uni_ideregistro")
//	private Unidad estadoEtapaGestion;
//	
//	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
//	@JoinColumn(name = "tcom_idregistro", updatable = false, insertable = false)
//	private TablaComisional tablaComisional;
//	
//	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
//	@JoinColumn(name = "mges_idregistro", updatable = false, insertable = false)
//	private MetaGestion metaGestion;
//	
//	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
//	@JoinColumn(name = "ter_idregistro", updatable = false, insertable = false)
//	private Tercero tercero;
//	
	@OneToMany(mappedBy="estidregistro" )//, cascade=CascadeType.ALL
	@JsonIgnore
	private List<EstrategiaClasificacion> estrategiaClasificaciones;
	
	
	@Column(name="uni_unidadestado")
	private Long uni_unidadestado;
	
	@Column(name="est_nombre")
	private String est_nombre;
	
	@Column(name="est_descripcion")
	private String est_descripcion;
	
	@Column(name="est_observacion")
	private String est_observacion;
	
	@Column(name="est_condicion")
	private String est_condicion;
	
	@Column(name="est_codigointerno")
	private Long est_codigointerno;

	
	@javax.persistence.Transient
	private List<String> clasificaciones;
//	
//	@javax.persistence.Transient
//	private String sectoresnombres;
	
	//Datos de auditoria del registro
	@Column(name="usu_idregistrocreated_by")
	
	private Long usu_idregistrocreated_by;
	@Column(name="created_at")
	@CreationTimestamp
	private LocalDateTime created_at;

	@Column(name="usu_idregistroupdated_by")
	private Long usu_idregistroupdated_by;
	
	@Column(name="updated_at")
	@UpdateTimestamp
	private LocalDateTime updated_at;
	
	@Column(name="emp_ideregistro")
	private Long empresasevemp;
	
}
