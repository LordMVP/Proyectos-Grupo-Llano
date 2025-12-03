package com.gell.gestioncartera.entidades;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
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
 * Clase tipo entidad JPA para el registro de Orientacion
 */
@Data
@Entity
@Table(name="nvis_novedadvisita", schema="aseo")
@ApiModel("Modelo Novedad visita")
public class NovedadVisita {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="nvis_idregistro")
	private Long nvis_idregistro;
	
	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name = "uni_unidadestado", updatable = false, insertable = false, referencedColumnName = "uni_ideregistro")
	private Unidad estadoNovedadVisita;

	@Column(name="uni_unidadestado") //114
	private Long uni_unidadestado;
	
	@Column(name="nvis_nombre")
	private String nvis_nombre;
	
	@Column(name="nvis_codigointerno")
	private Long nvis_codigointerno;
//
//	 @OneToMany(mappedBy = "novedadvisita", fetch=FetchType.EAGER)
//	 @JsonIgnore
//	 private List<NovedadVisitaRecurso> novedadvisitarecursos;
	 
	 @javax.persistence.Transient
	 private List<NovedadVisitaRecurso> listnovedadvisitarecursos;
	 
	 @javax.persistence.Transient
	 private String recursos;

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
