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
 * Clase tipo entidad JPA para el registro de novedad visita recurso
 */
@Data
@Entity
@Table(name="nvir_novedavisita", schema="aseo")
@ApiModel("Modelo Novedad visita recurso")
public class NovedadVisitaRecurso {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="nvir_idregistro")
	private Long nvir_idregistro;
	
	@Column(name="nvis_idregistro")
	private Long nvisidregistro;
	
	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
	@JoinColumn(name = "uni_unidadtrecurso", updatable = false, insertable = false, referencedColumnName = "uni_ideregistro")
	private Unidad estadoTipoRecurso;

	@Column(name="uni_unidadtrecurso") //129
	private Long uni_unidadtrecurso;
	
	@Column(name="nvir_descripcion")
	private String nvir_descripcion;
	
	@Column(name="nvir_esobligatorio")
	private boolean nvir_esobligatorio;	
	
//	@ManyToOne//(fetch=FetchType.LAZY, optional=false)
//	@JoinColumn(name = "nvis_idregistro", updatable = false, insertable = false)
//	private NovedadVisita novedadvisita;
	
}
